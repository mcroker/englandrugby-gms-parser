import { ClubGMS, Person } from '..';
import { TWRFCUtils } from './TWRFCUtils';
import * as nodemailer from 'nodemailer';

const DUMMY_RUN = true;

const env = TWRFCUtils.getNunjucks();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mcroker@gmail.com',
        pass: process.env.GMAIL_PASSWORD
    }
});

function sleep(ms: number) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

export function sendReminder(person: Person, children: Map<string, Person>, subject: string, template: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        let agegrades: string[] = [];
        for (const child of children.values()) {
            const agegrade = child.getTeam(false);
            if (undefined !== agegrade) {
                agegrades.push(agegrade.name);
            }
        };
        const childrensNames = Array.from(children.values()).map((item) => item.getName());
        const firstNames = Array.from(children.values()).map((item) => item.firstName);

        var mailOptions = {
            from: 'support@twrfc.com',
            to: person.getContactEmails(),
            cc: TWRFCUtils.getCoachEmails(agegrades),
            subject: 'Tunbridge Wells RFC - ' + subject + ' ' + firstNames.join(','),
            text: env.render(template, { person: person, childrensNames: childrensNames.join(',') })
        };

        if (!DUMMY_RUN) {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    resolve(info);
                }
            });
        } else {
            console.log('Dummy: ', person.getName(), childrensNames, template, mailOptions.to, mailOptions.cc);
            resolve()
        }
    });
}

async function procParent(person: Person) {
    if (person.belongsToScheme(/(Family)|(Senior)|(Concession)/i, true)) {
        let unregChildren: Map<string, Person> = new Map<string, Person>();
        let forgottenChildren: Map<string, Person> = new Map<string, Person>();
        for (let child of person.getChildren()) {
            if (undefined !== child.ageAtStartOfSeason
                && child.ageAtStartOfSeason >= 4
                && child.ageAtStartOfSeason < 18
            ) {
                // Find lapsed children of members
                if (!child.isMember) forgottenChildren.set(child.rfuid, child);
                // Find unregistered member children of members
                if (child.isMember && !child.isPlayer) unregChildren.set(child.rfuid, child);

            }
        }
        if (forgottenChildren.size > 0) {
            await sendReminder(person, forgottenChildren, 'Did you forget to add', 'email_memparent_forgotchild.njk');
            await sleep(1000);
        }
        if (unregChildren.size > 0) {
            await sendReminder(person, unregChildren, 'Please register', 'email_memparent_registerchild.njk');
            await sleep(1000);
        }
    } else { // Person is not a member
        const lapsedChildren: Map<string, Person> = new Map<string, Person>();
        const neverJoinedChildren: Map<string, Person> = new Map<string, Person>();
        for (let child of person.getChildren()) {
            if (!child.isMember && child.isChild()) {
                let hasMemberParent = false;
                for (let parent of child.getParents()) {
                    hasMemberParent = (hasMemberParent || parent.belongsToScheme(/(Family)|(Senior)|(Concession)/i));
                };

                if (!hasMemberParent) { // if a parent is a member they will get a more specific email (sent above)
                    if (child.memberships.length > 0 || child.isPlayer) { // Includes lapsed membership
                        lapsedChildren.set(child.rfuid, child);
                    } else {
                        neverJoinedChildren.set(child.rfuid, child);
                    }
                }
            }
        }
        if (lapsedChildren.size > 0) {
            // await sendReminder(person, lapsedChildren, 'Lapsed membership', 'email_lapsed_goodbye.njk');
            // await sleep(1000);
        }
        if (neverJoinedChildren.size > 0) {
            // await sendReminder(person, neverJoinedChildren, 'GMS house-keeping', 'email_neverjoined.njk');
            // await sleep(1000);
        }
    }
}

(async () => {
    const club: ClubGMS = await ClubGMS.createFromDirectory();

    for (let person of club.getPeople()) {
        if (!person.isChild()) {
            await procParent(person);
        }
    }

})();