import { Person } from './Person';
import { GroupStats } from './Types';

export class PersonGroup implements GroupStats {
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

    addPlayer(player: Person) {
        this.people.push(player);
    }

    getPlayers(onlyRegisteredPlayers: boolean = true) {
        if (!onlyRegisteredPlayers) {
            return this.people;
        } else {
            return this.people.filter((player: Person) => player.isPlayer);
        }
    }

    get numPeople(): number {
        return this.people.length;
    };

    get numActiveMembers(): number {
        return this.people.filter((item) => { return item.isMember }).length;
    }

    get pctActiveMembers(): number {
        return 100 * this.numActiveMembers / this.numPeople;
    }

    get numRegisteredMembers(): number {
        return this.people.filter((item) => { return item.isPlayer }).length;
    }

    get pctRegisteredMembers(): number {
        return 100 * this.numRegisteredMembers / this.numPeople;
    }

};