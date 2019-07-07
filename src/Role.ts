import { Utils } from './Utils';

/**
 * Role object. One of these is created for each role a person has.
 * @beta
 */
export class Role {
    name: string = '';
    since: Date | undefined = undefined;
  
    constructor(text: string) {
        let roleparts = text.split(' since ');
        this.name = String(roleparts[0]).trim();
        this.since = (undefined !== roleparts[1]) ? Utils.dateFromUKString(roleparts[1]) : undefined;
    }
  }