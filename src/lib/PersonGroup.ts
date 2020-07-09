import { Person, DBSStatus } from './Person';
import { QualificationType } from './Qualification';

export class PersonGroup {
    name: string = '';
    private people: Person[] = [];

    constructor(name?: string, people?: Person[]) {
        if (undefined !== name) {
            this.name = name;
        }
        if (undefined !== people) {
            this.people = people;
        }
    }

    addPerson(player: Person) {
        this.people.push(player);
    }

    getPeople() {
        return this.people;
    }

    getPlayers(onlyRegisteredPlayers: boolean = true) {
        if (!onlyRegisteredPlayers) {
            return this.people.filter((person: Person) => !person.hasRole('Coach'));
        } else {
            return this.people.filter((person: Person) => (!person.hasRole('Coach') && person.isPlayer));
        }
    }

    getCoaches() {
        return this.people.filter((person: Person) => person.hasRole('Coach'));
    }

    getCoachesWithDBSStatus(status: DBSStatus = DBSStatus.Current) {
        return this.getCoaches().filter((coach: Person) => coach.DBSStatus === status);
    }

    getCoachesWithQualType(type: QualificationType, minLevel?: number) {
        return this.getCoaches().filter((coach: Person) => coach.hasQualifcationType(type, minLevel));
    }

    getCoachesWithQual(name: string | RegExp) {
        return this.getCoaches().filter((coach: Person) => coach.hasQualifcation(name));
    }

    get numActiveMembers(): number {
        return this.getPlayers().filter((item) => { return item.isMember }).length;
    }

    get pctActiveMembers(): number {
        return 100 * this.numActiveMembers / this.numPlayers;
    }

    get numRegisteredMembers(): number {
        return this.getPlayers().filter((item) => { return item.isPlayer }).length;
    }

    get numPlayers(): number {
        return this.getPlayers(false).length;
    }

    get numCoaches(): number {
        return this.getCoaches().length;
    }

    get coachRatio(): number {
        return this.numActiveMembers / this.numCoaches;
    }

    get numCoachesNoDBS(): number {
        return this.numCoaches - this.getCoachesWithDBSStatus(DBSStatus.Current).length;
    }

    // RR
    get numRefsL2(): number {
        return this.getCoachesWithQualType(QualificationType.refereeing, 2).length;
    }

    get numCoachesL2(): number {
        return this.getCoachesWithQualType(QualificationType.coaching, 2).length;
    }

    get numCoachesL0(): number {
        return this.getCoachesWithQualType(QualificationType.coaching, 0).length;
    }

    get numCoachesConcussion(): number {
        return this.getCoachesWithQual(/Concussion/).length;
    }

    get pctRegisteredMembers(): number {
        return 100 * this.numRegisteredMembers / this.numPlayers;
    }

};