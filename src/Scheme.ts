import { Membership } from './Membership';

/**
 * Functions implemting this function can be used to normalise the name of a schema
 * @beta
 */
export type SchemeNormaliseFunction = (scheme: string) => string;

/**
 * Scheme object. Once of these is created for each membershiPScheme in a club.
 * @beta
 */
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