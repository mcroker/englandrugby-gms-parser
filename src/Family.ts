import { Person } from './Person';
import { Membership } from './Membership';

export type MembershipScoreFunction = (per: Person, mem: Membership) => number;

export interface PrimaryData {
  person?: Person;
  membership?: Membership;
}

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
        let primaryScheme : Membership | undefined = undefined;
        let primaryPerson : Person | undefined = undefined;
        let topScore = 0;
        let oldestPerson: Person | undefined = undefined;
        let firstDOB: Date | undefined = undefined;
        for (let person of this.allPeople()) {
            if (undefined === firstDOB || (undefined !== person.DOB && person.DOB < firstDOB)) {
                oldestPerson = person;
                firstDOB = person.DOB;
            }
            for(let membership  of person.memberships) {
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

    mergeFamily(family: Family) {
        this.adults = [... new Set(this.adults.concat(family.adults))];
        this.children = [... new Set(this.children.concat(family.children))];
    }

    private static processAdult(person: Person, family: Family, people: Map<string, Person>): Family {
        if (!family.includes(person)) {
            family.addPerson(person);
            for (var rel of person.relationships) {
                if (undefined !== rel && undefined !== rel.rfuid) {
                    let myrel = people.get(rel.rfuid);
                    if (undefined !== myrel && !family.includesById(myrel.rfuid)) {
                        switch (rel.relType) {

                            case 'Parent':
                            case 'Guardian':
                            case 'Next':
                                if (myrel.isChild()) {
                                    // console.log('P ', person.getNameAndId(), ' =P=> ', myrel.getNameAndId());
                                    family.mergeFamily(Family.processChild(myrel, family, people));
                                }
                                break;

                            case 'Sibling':
                            case 'Charge':
                            case 'Child':
                            case 'Grandchild':
                            case 'Guardian':
                            case 'Grandparent':
                            case 'Other':
                            case 'Next':
                            case 'Wife':
                            case 'Husband':
                            case 'Partner':
                            case 'Fiance':
                                break;

                            default:
                                console.log('P*************** rel not recognised:' + rel.relType);
                        }
                    }
                }
            }
        }
        return family;
    }

    private static processChild(person: Person, family: Family, people: Map<string, Person>): Family {
        if (!family.includes(person)) {
            family.addPerson(person);
            for (var rel of person.relationships) {
                if (undefined !== rel && undefined !== rel.rfuid) {
                    let myrel = people.get(rel.rfuid);
                    if (undefined !== myrel && !family.includesById(myrel.rfuid)) {
                        switch (rel.relType) {

                            case 'Charge':
                            case 'Child':
                                // console.log('C ', person.getNameAndId(), ' =C=> ', myrel.getNameAndId());
                                family.mergeFamily(Family.processAdult(myrel, family, people));
                                break;

                            case 'Sibling':
                                if (myrel.isChild()) {
                                    // console.log('S ', person.getNameAndId(), ' =S=> ', myrel.getNameAndId());
                                    family.mergeFamily(Family.processChild(myrel, family, people));
                                }
                                break;

                            case 'Parent':
                            case 'Other':
                            case 'Next':
                            case 'Grandchild':
                            case 'Grandparent':
                            case 'Wife':
                            case 'Husband':
                            case 'Partner':
                            case 'Fiance':
                                break;


                            default:
                                console.log('K*************** rel not recognised:' + rel.relType);
                        }
                    }
                }
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