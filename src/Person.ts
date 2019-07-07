/**
 * Data structure holding csv data from person GMS csv export.
 * @public
 */
export declare interface PersonCSVData { [name: string]: string; };

/**
 * Enumeration for M/F gender values
 * @public
 */
export enum Gender {
    male = 'M',
    female = 'F'
};

import { Address } from './Address';
import { Relationship, RelationshipType as RelType } from './Relationship';
import { Utils } from './Utils';
import { Qualifcation, QualificationType } from './Qualification';
import { Role } from './Role';
import { GenderConfig, ClubConfig, DefaultClubConfig } from './ClubConfig';
import { AgeGrade } from './Team';

export const P_TITLE = 'Title';
export const P_RFUID = 'RFU ID';
export const P_FIRSTNAME = 'First Name';
export const P_LASTNAME = 'Last Name';
export const P_KNOWNAS = 'Known as';
export const P_DOB = 'Date Of Birth';
export const P_PHONE = 'Phone';
export const P_EMAIL = 'E-mail';
export const P_BALANCE = 'Balance';
export const P_SOURCE = 'Source';
export const P_MEMBER = 'Member';
export const P_CONTACT = 'Contact';
export const P_PLAYER = 'Player';
export const P_PLAYERTYPE = 'Player Type';
export const P_PLAYEDAT = 'Player At';
export const P_HASDBS = 'Has DBS';
export const P_DBSSSTATUS = 'DBS';
export const P_DBSEXPIRY = 'DBS Valid To';
export const P_DBSVERIFIEDDATE = 'DBS Verified Date';
export const P_DBSRENEWALDATE = 'DBS Renewal Date';
export const P_ROLE = 'Role';
export const P_AWARDNAME = 'Award Qualification Name';
export const P_AGEATSTARTSEASON = 'Age at Start of Season';
export const P_CURRENTAGE = 'Current Age';
export const P_AGEGROUP = 'Age Group';
export const P_RELATIONSHIPS = 'Relationships';
export const P_EXTERNALREF = 'External Ref';
export const P_DPAFLAG1 = 'DPAFlag1';
export const P_DPAFLAG2 = 'DPAFlag2';
export const P_INTERESTS = 'Interests';
export const P_CUSTOMTAG = 'Custom Tag';
export const P_DATEASSOCIATED = 'Date Associated to Club';

import {
    M_RFUID,
    M_KNOWNAS,
    M_LABEL,
    M_DISABILITY,
    M_ETHNIC,
    M_OCCUPATION,
    M_FIRSTNAME,
    M_EXTERNALREF,
    M_LASTNAME,
    M_PLAYEDAT,
    M_DOB,
    M_AGE,
    M_BALANCE,
    M_EMAIL,
    M_PHONE,
    M_ROLE,
    M_PLAYER,
    M_DBSSTATUS,
    M_DBSEXPIRY,
    M_AWARDNAME,
    M_RELATIONSHIPS,
    MembershipCSVData,
    Membership
} from './Membership'

/**
 * Enumberation for DBS record status'
 * @todo I am sure this isn't complete.
 * @beta
 */
export enum DBSStatus {
    Current = 'Current',
    Expired = 'Expired'
}

/**
 * Primary object representing a person extracted from the file
 * @beta
 */
export class Person {

    csvdata: PersonCSVData | undefined;
    title: string = '';
    rfuid: string = '';
    firstName: string = '';
    lastName: string = '';
    knownAs: string = '';
    DOB: Date | undefined = undefined;
    address: Address;
    phone: string = '';
    email: string = '';
    balance: number | undefined = undefined; // Shouldn't be NaN - 0
    source: string = '';
    isMember: boolean = false;
    contact: string = ''; // TODO boolean?
    isPlayer: boolean | undefined = undefined;
    playerType: string = '';
    playerAt: string = '';
    hasDBS: boolean | undefined = undefined;
    DBSStatus: string = '';
    DBSExpiryDate: Date | undefined = undefined;
    DBSVerificationDate: Date | undefined = undefined;
    DBSRenewalDate: Date | undefined = undefined;
    roleText: string = '';
    roles: Role[] = [];
    awardQualificationText: string = '';
    qualifcations: Qualifcation[] = [];
    ageAtStartOfSeason: number | undefined = undefined;
    currentAge: number | undefined = undefined;
    ageGroup: string = '';
    relationshipText: string = '';
    relationships: Relationship[] = [];
    externalRef: string = '';
    hasDPAFlag1: boolean = true; // Assume maximum DBA if not set
    hasDPAFlag2: boolean = true; // Assume maximum DBA if not set
    interests: string = '';
    customTag: string = '';
    dataAssocated: Date | undefined = undefined;
    label: string = '';
    ethnicOrigin: string = '';
    disability: string = ''; // TODO is boolean?
    occupation: string = '';
    memberships: Membership[] = [];
    gender: Gender | undefined = undefined;

    // TODO - getContactPhones()

    public constructor(data?: PersonCSVData) {
        if (undefined !== data) {
            this.importPersonCSV(data)
        }
    }

    public getParents(includeParentsOfAdults = false): Person[] {
        if (includeParentsOfAdults || this.isChild()) {
            return this.relationships.filter((item: Relationship) => {
                return ((item.relType === RelType.childOf || item.relType === RelType.chargeOf) && undefined !== item.relation)
            }).map((rel: Relationship) => {
                if (undefined !== rel.relation) {
                    return rel.relation
                } else {
                    throw (new Error('rel.relation shouldn\'t ever be null'));
                }
            });
        } else {
            return [];
        }
    }

    public getChildren(includeAdultChildren = false): Person[] {
        return this.relationships.filter((item: Relationship) => {
            return (
                (item.relType === RelType.parentOf || item.relType === RelType.guardianOf) &&
                undefined !== item.relation &&
                (includeAdultChildren || item.relation.isChild())
            )
        }).map((rel: Relationship) => {
            if (undefined !== rel.relation) {
                return rel.relation
            } else {
                throw (new Error('rel.relation shouldn\'t ever be null'));
            }
        });
    }

    public getContactEmails(): string[] {
        let contactEmails: Set<string> = new Set<string>();
        if (undefined !== this.email && '' !== this.email) {
            contactEmails.add('"' + this.getName() + '" <' + this.email + '>');
        }
        if (this.isChild()) {
            for (let parent of this.getParents()) {
                if (undefined !== parent.email && '' !== parent.email) {
                    contactEmails.add('"' + parent.getName() + '" <' + parent.email + '>');
                }
            }
        }
        return Array.from(contactEmails.values());
    }

    public importPersonCSV(data: PersonCSVData) {
        this.csvdata = data;
        // People Export Fields
        if (undefined !== data[P_TITLE]) this.title = data[P_TITLE];
        if (undefined !== data[P_RFUID]) this.rfuid = data[P_RFUID];
        if (undefined !== data[P_FIRSTNAME]) this.firstName = data[P_FIRSTNAME];
        if (undefined !== data[P_LASTNAME]) this.lastName = data[P_LASTNAME];
        if (undefined !== data[P_KNOWNAS]) this.knownAs = data[P_KNOWNAS];
        if (undefined !== data[P_DOB]) this.DOB = Utils.dateFromUKString(data[P_DOB]);
        this.address = new Address(data);
        if (undefined !== data[P_PHONE]) this.phone = data[P_PHONE];
        if (undefined !== data[P_EMAIL]) this.email = data[P_EMAIL];
        if (undefined !== data[P_BALANCE]) this.balance = parseFloat(data[P_BALANCE]);
        if (undefined !== data[P_SOURCE]) this.source = data[P_SOURCE];
        if (undefined !== data[P_MEMBER]) this.isMember = ('Yes' === data[P_MEMBER]);
        if (undefined !== data[P_CONTACT]) this.contact = data[P_CONTACT];
        if (undefined !== data[P_PLAYER]) this.isPlayer = ('Yes' === data[P_PLAYER]);
        if (undefined !== data[P_PLAYERTYPE]) this.playerType = data[P_PLAYERTYPE];
        if (undefined !== data[P_PLAYEDAT]) this.playerAt = data[P_PLAYEDAT];
        if (undefined !== data[P_HASDBS]) this.hasDBS = ('Yes' === data[P_HASDBS]);
        if (undefined !== data[P_DBSSSTATUS]) this.DBSStatus = data[P_DBSSSTATUS];
        if (undefined !== data[P_DBSRENEWALDATE]) this.DBSExpiryDate = Utils.dateFromUKString(data[P_DBSRENEWALDATE]);
        if (undefined !== data[P_DBSVERIFIEDDATE]) this.DBSVerificationDate = Utils.dateFromUKString(data[P_DBSVERIFIEDDATE]);
        if (undefined !== data[P_DBSRENEWALDATE]) this.DBSRenewalDate = Utils.dateFromUKString(data[P_DBSRENEWALDATE]);
        if (undefined !== data[P_ROLE]) this.setRoles(data[P_ROLE]);
        if (undefined !== data[P_AWARDNAME]) this.setQualifcations(data[P_AWARDNAME]);
        if (undefined !== data[P_AGEATSTARTSEASON]) this.ageAtStartOfSeason = parseInt(data[P_AGEATSTARTSEASON]);
        if (undefined !== data[P_CURRENTAGE]) this.currentAge = parseInt(data[P_CURRENTAGE]);
        if (undefined !== data[P_AGEGROUP]) this.ageGroup = data[P_AGEGROUP];
        if (undefined !== data[P_RELATIONSHIPS]) this.setRelationships(data[P_RELATIONSHIPS]);
        if (undefined !== data[P_EXTERNALREF]) this.externalRef = data[P_EXTERNALREF];
        if (undefined !== data[P_DPAFLAG1]) this.hasDPAFlag1 = ('Yes' === data[P_DPAFLAG1]);
        if (undefined !== data[P_DPAFLAG2]) this.hasDPAFlag2 = ('Yes' === data[P_DPAFLAG2]);
        if (undefined !== data[P_INTERESTS]) this.interests = data[P_INTERESTS];
        if (undefined !== data[P_CUSTOMTAG]) this.customTag = data[P_CUSTOMTAG];
        if (undefined !== data[P_DATEASSOCIATED]) this.dataAssocated = Utils.dateFromUKString(data[P_DATEASSOCIATED]);
    }

    protected setRelationships(text: string) {
        this.relationshipText = text;
        this.relationships = [];
        if ('' !== String(this.relationshipText).trim()) {
            for (let rel of this.relationshipText.split(',')) {
                this.relationships.push(new Relationship(rel));
            }
        }
    }

    protected setRoles(text: string) {
        this.roleText = text;
        this.roles = [];
        if ('' !== String(this.roleText).trim()) {
            for (let role of this.roleText.split(',')) {
                this.roles.push(new Role(role));
            }
        }
    }

    protected setQualifcations(text: string) {
        this.awardQualificationText = text;
        this.qualifcations = [];
        if ('' !== String(this.awardQualificationText).trim()) {
            for (let qualifcation of this.awardQualificationText.split(';')) {
                this.qualifcations.push(new Qualifcation(qualifcation));
            }
        }
    }

    importMembershipCSV(data: MembershipCSVData, overwrite: boolean = false) {
        if (('' === this.rfuid || overwrite) && (undefined !== data[M_RFUID])) this.rfuid = data[M_RFUID];
        if (('' === this.knownAs || overwrite) && (undefined !== data[M_KNOWNAS])) this.knownAs = data[M_KNOWNAS];
        if (('' === this.label || overwrite) && (undefined !== data[M_LABEL])) this.label = data[M_LABEL];
        if (('' === this.disability || overwrite) && (undefined !== data[M_DISABILITY])) this.disability = data[M_DISABILITY];
        if (('' === this.ethnicOrigin || overwrite) && (undefined !== data[M_ETHNIC])) this.ethnicOrigin = data[M_ETHNIC];
        if (('' === this.occupation || overwrite) && (undefined !== data[M_OCCUPATION])) this.occupation = data[M_OCCUPATION];
        if (('' === this.firstName || overwrite) && (undefined !== data[M_FIRSTNAME])) this.firstName = data[M_FIRSTNAME];
        if (('' === this.externalRef || overwrite) && (undefined !== data[M_EXTERNALREF])) this.externalRef = data[M_EXTERNALREF];
        if (('' === this.lastName || overwrite) && (undefined !== data[M_LASTNAME])) this.lastName = data[M_LASTNAME];
        if (('' === this.playerAt || overwrite) && (undefined !== data[M_PLAYEDAT])) this.playerAt = data[M_PLAYEDAT];
        if ((undefined === this.DOB || overwrite) && (undefined !== data[M_DOB])) this.DOB = Utils.dateFromUKString(data[M_DOB]);
        if ((undefined === this.currentAge || overwrite) && (undefined !== data[M_AGE])) this.currentAge = parseInt(data[M_AGE]);
        if ((undefined === this.balance || overwrite) && (undefined !== data[M_BALANCE])) this.balance = parseFloat(data[M_BALANCE]);
        if (('' === this.email || overwrite) && (undefined !== data[M_EMAIL])) this.email = data[M_EMAIL];
        if (('' === this.phone || overwrite) && (undefined !== data[M_PHONE])) this.phone = data[M_PHONE];
        if (('' === this.roleText || overwrite) && (undefined !== data[M_ROLE])) this.setRoles(data[M_ROLE]);
        if ((undefined === this.isPlayer || overwrite) && (undefined !== data[M_PLAYER])) this.isPlayer = ('yes' === data[M_PLAYER]);
        if (('' === this.DBSStatus || overwrite) && (undefined !== data[M_DBSSTATUS])) this.DBSStatus = data[M_DBSSTATUS];
        if ((undefined === this.DBSExpiryDate || overwrite) && (undefined !== data[M_DBSEXPIRY])) this.DBSExpiryDate = Utils.dateFromUKString(data[M_DBSEXPIRY]);
        if (('' === this.awardQualificationText || overwrite) && (undefined !== data[M_AWARDNAME])) this.setQualifcations(data[M_AWARDNAME]);
        if ((undefined === this.relationships || overwrite) && (undefined !== data[M_RELATIONSHIPS])) this.setRelationships(data[M_RELATIONSHIPS])
    }

    addMembership(membership: Membership) {
        this.importMembershipCSV(membership.csvdata);
        this.memberships.push(membership);
    }

    isChild(): boolean {
        let ageAtStartOfSeason = this.getAgeAtStartOfSeason();
        return (undefined !== ageAtStartOfSeason && ageAtStartOfSeason < 18);
    }

    belongsToScheme(scheme: RegExp | string, requireActive = true): boolean {
        return (undefined !== this.memberships.find((item: Membership) => {
            return (item.scheme.match(scheme) && (!requireActive || 'Active' === item.status));
        }));
    }

    hasRole(role: RegExp | string): boolean {
        return (undefined !== this.roles.find((item: Role) => {
            return (item.name.match(role));
        }));
    }

    hasQualifcation(qualifcation: RegExp | string): boolean {
        return (undefined !== this.qualifcations.find((item: Qualifcation) => {
            return (item.name.match(qualifcation));
        }));
    }

    hasQualifcationType(qualifcationType: QualificationType, minLevel = -1): boolean {
        return (undefined !== this.qualifcations.find((item: Qualifcation) => {
            return (item.type === qualifcationType && item.level >= minLevel);
        }));
    }

    getName(): string {
        let firstname = ('' !== this.knownAs) ? this.knownAs : this.firstName;
        return firstname + ' ' + this.lastName;
    }

    getNameAndId(): string {
        let firstname = ('' !== this.knownAs) ? this.knownAs : this.firstName;
        return firstname + ' ' + this.lastName + ' (' + this.rfuid + ')';
    }

    getInferredGender(genderConfig?: GenderConfig): Gender {
        // The PC person in me dislikes both inferring gender from title, and from name
        // but given the export doesn't contain gender data ... I have no choice
        if (undefined !== this.gender) {
            return this.gender;
        } else {
            genderConfig = (undefined === genderConfig) ? new DefaultClubConfig().gender: genderConfig;
            let lctitle = this.title.toLowerCase();
            let lcname = this.firstName.toLowerCase();
            if (undefined !== genderConfig && undefined !== genderConfig.titles && Object.keys(genderConfig.titles).includes(lctitle)) {
                return (genderConfig.titles[lctitle]);
            } else if (undefined !== genderConfig && undefined !== genderConfig.names && Object.keys(genderConfig.names).includes(lcname)) {
                return (genderConfig.names[lcname]);
            } else {
                return Gender.male; // Hedge our bets.
            }
        }
    }

    getAgeOnDate(onDate?: Date): number | undefined {
        onDate = (undefined !== onDate) ? onDate : new Date();
        if (undefined !== this.DOB) {
            let age = onDate.getFullYear() - this.DOB.getFullYear();
            const m = onDate.getMonth() - this.DOB.getMonth();
            if (m < 0 || (m === 0 && onDate.getDate() < this.DOB.getDate())) { age-- };
            return age;
        } else {
            return undefined;
        }
    }

    getAgeAtStartOfSeason(season?: string): number | undefined {
        if (undefined !== this.ageAtStartOfSeason && undefined === season) {
            return this.ageAtStartOfSeason
        } else {
            if (undefined == season) { // Default to current season
                let now = new Date();
                season = (now.getMonth() <= 6) ? String(now.getFullYear()) : String(now.getFullYear() - 1);
            }
            let startDate = new Date(season + '-08-31');
            return this.getAgeOnDate(startDate)
        }
    }

    getAgeGrade(onlyRegisteredPlayers: boolean = true, config?: ClubConfig): AgeGrade | undefined {
        config = (undefined === config) ? new DefaultClubConfig() : config;
        let agegrade: AgeGrade | undefined = undefined;
        let ageAtStartOfSeason = this.getAgeAtStartOfSeason();
        if (undefined !== ageAtStartOfSeason) {
            for (let configitem of config.agegroup) {
                if (ageAtStartOfSeason >= configitem.minage
                    && (undefined === configitem.maxage || ageAtStartOfSeason <= configitem.maxage)
                    && (undefined === configitem.gender || this.getInferredGender(config.gender) === configitem.gender)
                    && (!onlyRegisteredPlayers || this.isPlayer)
                ) {
                    agegrade = configitem.agegrade;
                    break;
                }
            }
        }
        return agegrade;
    }

}