import { ClubGMS } from '..';
import { TWRFCUtils } from './TWRFCUtils';
const printf = require('printf');

const OUTFORMAT = '%-8s %-8s %-25s %s\n';
const HR = '--------------------------------------------------------------------------------------------------\n';

(async () => {
    const club = await ClubGMS.createFromDirectory();
    const errorData = TWRFCUtils.parseDataErrors(club);
    process.stdout.write(printf(OUTFORMAT + HR, 'Group', 'RFU ID', 'Name', 'Message'));
    errorData.forEach((errors: string[], rfuid: string) => {
        let person = club.findPersonById(rfuid);
        if (undefined !== person) {
            let team = person.getTeam(false);
            let agegrade = (undefined !== team && undefined !== team.type) ? team.type : '';
            process.stdout.write(printf(OUTFORMAT, rfuid, agegrade, person.getName(), errors.join(';')));
        }
    })
})()