import { Person } from './Person';
import { Membership } from './Membership';

/**
 * Function to help identify the primary person.  A function which implments 
 * MembershipScoreFunction returns a numeric score for each person.  The entry which gets
 * the highest score is deemed the primary member.
 * @beta
 */
export type MembershipScoreFunction = (per: Person, mem: Membership) => number;

/**
 * Type definition for the Primary data of a family.  In general the primary member/membership
 * Is the lead adult who pays - but that's not easy to derrive so we do our best.
 * @beta
 */
export interface PrimaryData {
    person?: Person;
    membership?: Membership;
}

/**
 * Class for a family - where a family contains a related collection of children and parent
 * People objects
 * @beta
 */
export class Family {

    children: Person[] = [];
    adults: Person[] = [];
    primaryPerson: Person | undefined = undefined;

    allPeople(): Person[] {
        return this.adults.concat(this.children);
    }

    allIds(): string[] {
        return this.allPeople().map((element) => { return element.rfuid });
    }

    includes(person: Person) {
        return (this.children.includes(person) || this.adults.includes(person));
    }

    includesById(rfuid: string) {
        return this.allIds().includes(rfuid);
    }

    addPerson(person: Person) {
        if (!this.includes(person)) {
            if (person.isChild()) {
                this.children.push(person);
            } else {
                this.adults.push(person);
            }
        }
    }

    getPrimaryData(scoreFunc: MembershipScoreFunction): PrimaryData {
        let primaryScheme: Membership | undefined = undefined;
        let primaryPerson: Person | undefined = undefined;
        let topScore = 0;
        let oldestPerson: Person | undefined = undefined;
        let firstDOB: Date | undefined = undefined;
        for (let person of this.allPeople()) {
            if (undefined === firstDOB || (undefined !== person.DOB && person.DOB < firstDOB)) {
                oldestPerson = person;
                firstDOB = person.DOB;
            }
            for (let membership of person.memberships) {
                let score = scoreFunc(person, membership)
                if (score > topScore) {
                    topScore = score;
                    primaryScheme = membership;
                    primaryPerson = person;
                }
            }
        }
        if (undefined === primaryPerson && undefined !== oldestPerson) {
            primaryPerson = oldestPerson;
        }
        return ({ membership: primaryScheme, person: primaryPerson } as PrimaryData)
    }

    countAdults(requireMembership = true) {
        if (requireMembership) {
            let adultMembers = this.adults.filter((item: Person) => { return item.isMember })
            return adultMembers.length
        } else {
            return this.adults.length
        }
    }

    countChildren(requireMembership = true) {
        if (requireMembership) {
            let childMembers = this.children.filter((item: Person) => { return item.isMember })
            return childMembers.length
        } else {
            return this.children.length
        }
    }

    hasActiveMember(): boolean {
        return ((this.countAdults(true) + this.countChildren(true)) > 0);
    }

    mergeFamily(family: Family) {
        this.adults = [... new Set(this.adults.concat(family.adults))];
        this.children = [... new Set(this.children.concat(family.children))];
    }

    private static processAdult(person: Person, family: Family, people: Map<string, Person>): Family {
        if (!family.includes(person)) {
            family.addPerson(person);
            for (let child of person.getChildren()) {
                family.mergeFamily(Family.processChild(child, family, people));
            }
        }
        return family;
    }

    private static processChild(person: Person, family: Family, people: Map<string, Person>): Family {
        if (!family.includes(person)) {
            family.addPerson(person);
            for (let parent of person.getParents()) {
                family.mergeFamily(Family.processAdult(parent, family, people));
            }
        }
        return family
    }

    public static createFamilyData(people: Map<string, Person>): Family[] {
        let processed: string[] = [];
        let familys: Family[] = [];
        for (var person of people.values()) {
            if (person.isChild() && !processed.includes(person.rfuid)) {
                let family = Family.processChild(person, new Family(), people);
                processed = [...new Set(processed.concat(family.allIds()))];
                familys.push(family);
            } else if (!processed.includes(person.rfuid)) {
                let family = Family.processAdult(person, new Family(), people);
                processed = [...new Set(processed.concat(family.allIds()))];
                familys.push(family);
            }
        };
        return familys;
    }

}
