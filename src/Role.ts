import { Utils } from './Utils';

export class Role {
    name: string = '';
    since: Date | undefined = undefined;
  
    constructor(text: string) {
        let roleparts = text.split(' since ');
        this.name = String(roleparts[0]).trim();
        this.since = (undefined !== roleparts[1]) ? Utils.dateFromUKString(roleparts[1]) : undefined;
    }
  }