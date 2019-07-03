import { Membership } from './Membership';

export type SchemeNormaliseFunction = (scheme: string) => string;

export class Scheme {

    name: string;
    memberships: Membership[] = [];

    constructor(name: string) {
        this.name = name;
    }

    addMembership(membership: Membership) {
        this.memberships.push(membership);
    }

    getCountActiveMembers(): number {
      return this.memberships.filter((item) => { return item.isActive() }).length
    }

    merge(scheme: Scheme) {
        this.memberships = this.memberships.concat(scheme.memberships);
    }

}