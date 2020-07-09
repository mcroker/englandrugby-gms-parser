/**
 * Team 
 * Not sure how this plays off against teams.
 * @beta
 */

import * as csv from 'fast-csv';
import * as fs from 'fs';
import { Person, Gender } from './Person';
import { PersonGroup } from './PersonGroup';

export enum TeamGender {
    male = 'Male',
    female = 'Female',
    mixed = 'Mixed',
    touchmixed = 'Touch Mixed',
    unknown = 'UNKNOWN'
}

export enum TeamStatus {
    active = 'Active',
    unknown = 'UNKNOWN'
}

export enum TeamType {
    u6 = 'U6',
    u7 = 'U7',
    u8 = 'U8',
    u9 = 'U9',
    u10 = 'U10',
    u11 = 'U11',
    u12 = 'U12M',
    u13 = 'U13M',
    u13w = 'U13W',
    u14 = 'U14M',
    u15 = 'U15M',
    u15w = 'U15W',
    u16 = 'U16M',
    u17 = 'U17M',
    u18 = 'U18M',
    u18w = 'U18W',
    senior1 = '1st XV Men',
    ladies1 = '1st XV Women',
    senior2 = '2nd XV Men',
    senior3 = '3rd XV Men',
    senior4 = '4th XV Men',
    vets = 'Veterans Men',
    touch = 'Touch Mixed',
    unknown = 'Unknown'
}

/**
 * A datastructure holding the membership csv data.
 * @public
 */
export declare interface TeamCSVData { [name: string]: string; };
export const T_TEAM = 'Team';
export const T_TEAMTYPE = 'Team Type';
export const T_SEQUENCE = 'Sequence';
export const T_GENDER = 'Gender';
export const T_MINAGE = 'Min. Age';
export const T_MAXAGE = 'Max. Age';
export const T_STATUS = 'Status';
export const T_STRIP = 'Team Strip Description';

const DEFAULT_TEAMS = [
    { T_TEAM: 'U6', T_TEAMTYPE: 'U6', T_SEQUENCE: '1', T_GENDER: TeamGender.mixed, T_MINAGE: '4', T_MAXAGE: '5' },
    { T_TEAM: 'U7', T_TEAMTYPE: 'U7', T_SEQUENCE: '2', T_GENDER: TeamGender.mixed, T_MINAGE: '6', T_MAXAGE: '6' },
    { T_TEAM: 'U8', T_TEAMTYPE: 'U8', T_SEQUENCE: '3', T_GENDER: TeamGender.mixed, T_MINAGE: '7', T_MAXAGE: '7' },
    { T_TEAM: 'U9', T_TEAMTYPE: 'U9', T_SEQUENCE: '4', T_GENDER: TeamGender.mixed, T_MINAGE: '8', T_MAXAGE: '8' },
    { T_TEAM: 'U10', T_TEAMTYPE: 'U10', T_SEQUENCE: '5', T_GENDER: TeamGender.mixed, T_MINAGE: '9', T_MAXAGE: '9' },
    { T_TEAM: 'U11', T_TEAMTYPE: 'U11', T_SEQUENCE: '6', T_GENDER: TeamGender.mixed, T_MINAGE: '10', T_MAXAGE: '10' },
    { T_TEAM: 'U12', T_TEAMTYPE: 'U12M', T_SEQUENCE: '7', T_GENDER: TeamGender.male, T_MINAGE: '11', T_MAXAGE: '11' },
    { T_TEAM: 'U13', T_TEAMTYPE: 'U13M', T_SEQUENCE: '8', T_GENDER: TeamGender.male, T_MINAGE: '12', T_MAXAGE: '12' },
    { T_TEAM: 'U13 Girls', T_TEAMTYPE: 'U13W', T_SEQUENCE: '9', T_GENDER: TeamGender.female, T_MINAGE: '11', T_MAXAGE: '12' },
    { T_TEAM: 'U14', T_TEAMTYPE: 'U14M', T_SEQUENCE: '10', T_GENDER: TeamGender.male, T_MINAGE: '13', T_MAXAGE: '13' },
    { T_TEAM: 'U15', T_TEAMTYPE: 'U15M', T_SEQUENCE: '11', T_GENDER: TeamGender.male, T_MINAGE: '14', T_MAXAGE: '14' },
    { T_TEAM: 'U15 Girls', T_TEAMTYPE: 'U15W', T_SEQUENCE: '12', T_GENDER: TeamGender.female, T_MINAGE: '13', T_MAXAGE: '14' },
    { T_TEAM: 'U16', T_TEAMTYPE: 'U16M', T_SEQUENCE: '13', T_GENDER: TeamGender.male, T_MINAGE: '15', T_MAXAGE: '15' },
    { T_TEAM: 'U17', T_TEAMTYPE: 'U17M', T_SEQUENCE: '14', T_GENDER: TeamGender.male, T_MINAGE: '16', T_MAXAGE: '16' },
    { T_TEAM: 'U18', T_TEAMTYPE: 'U18M', T_SEQUENCE: '15', T_GENDER: TeamGender.male, T_MINAGE: '17', T_MAXAGE: '17' },
    { T_TEAM: 'U18 Girls', T_TEAMTYPE: 'U18W', T_SEQUENCE: '16', T_GENDER: TeamGender.female, T_MINAGE: '15', T_MAXAGE: '17' }
];

/**
 * Membership class. One of these is created for each row in the membership csv file.
 * @beta
 */
export class Team extends PersonGroup {

    csvdata: TeamCSVData;
    type: TeamType = TeamType.unknown;
    sequence: number = 0;
    gender: TeamGender = TeamGender.mixed;
    minage: number = 0;
    maxage: number = 999;
    status: TeamStatus = TeamStatus.active;
    strip: string = '';

    /**
     * Reads GMS Membership CSV export into Membership object structure
     * 
     * @param file - Filename of membership CSV export
     * 
     * @returns Array of Membership objects contained in CSV export
     */
    static readGMSFile(file?: string): Promise<Team[]> {
        if (undefined != file) {
            return new Promise<Team[]>((resolve) => {
                let teams: Team[] = [];
                var teamsStream = fs.createReadStream(file);
                csv
                    .fromStream(teamsStream, { headers: true })
                    .on('data', function (data) {
                        teams.push(new Team(data));
                    })
                    .on('end', function () {
                        resolve(teams)
                    })
            })
        } else {
            let teams: Team[] = [];
            for (const data of DEFAULT_TEAMS) {
                teams.push(new Team(data));
            }
            return Promise.resolve(teams);
        }
    }

    static getTeamStatus(statusString: string): TeamStatus {
        if (Object.values(TeamStatus).includes(statusString as any)) {
            return statusString as TeamStatus;
        } else {
            console.log('WARNING: TeamStatus ' + statusString + ' not recognised.');
            return TeamStatus.unknown;
        }
    }

    static getTeamGender(genderString: string): TeamGender {
        if (Object.values(TeamGender).includes(genderString as any)) {
            return genderString as TeamGender;
        } else {
            console.log('WARNING: TeamGender ' + genderString + ' not recognised.');
            return TeamGender.unknown;
        }
    }

    static getTeamType(typeString: string): TeamType {
        if (Object.values(TeamType).includes(typeString as any)) {
            return typeString as TeamType;
        } else {
            console.log('WARNING: TeamType ' + typeString + ' not recognised.');
            return TeamType.unknown;
        }
    }

    public constructor(data?: TeamCSVData) {
        super();
        if (undefined !== data) {
            this.loadFromCSV(data)
        }
    }

    public loadFromCSV(data: TeamCSVData) {
        this.csvdata = data;
        if (undefined !== data[T_TEAM]) this.name = data[T_TEAM];
        if (undefined !== data[T_TEAMTYPE]) this.type = Team.getTeamType(data[T_TEAMTYPE]);
        if (undefined !== data[T_SEQUENCE]) this.sequence = parseInt(data[T_SEQUENCE]);
        if (undefined !== data[T_GENDER]) this.gender = Team.getTeamGender(data[T_GENDER]);
        if (undefined !== data[T_MINAGE]) this.minage = parseInt(data[T_MINAGE]);
        if (undefined !== data[T_MAXAGE]) this.maxage = parseInt(data[T_MAXAGE]);
        if (undefined !== data[T_STATUS]) this.status = Team.getTeamStatus(data[T_STATUS]);
        if (undefined !== data[T_STRIP]) this.strip = data[T_STRIP];
    }

    get isActive(): boolean {
        return ('Active' === this.status);
    }

    meetsGenderCriteria(gender: Gender) {
        switch (this.gender) {
            case TeamGender.male:
                return (gender == Gender.male);
            case TeamGender.female:
                return (gender == Gender.female);
            default:
                return true;
        }
    }

    personMeetsCriteria(person: Person, onlyRegisteredPlayers: boolean = false, meetsAgeOnly = true): boolean {
        const oldEough: boolean = (undefined === person.ageAtStartOfSeason || person.ageAtStartOfSeason >= this.minage);
        const youngEnough: boolean = (undefined === person.ageAtStartOfSeason || person.ageAtStartOfSeason <= this.maxage);
        const meetsGender: boolean = (undefined === this.gender || this.meetsGenderCriteria(person.getInferredGender()));
        const meetsRegistation: boolean = (!onlyRegisteredPlayers || (undefined !== person.isPlayer && person.isPlayer));
        const isAssociated: boolean = new RegExp(this.name + '(,|$)').test(person.teamsString);
        return (((isAssociated && !meetsAgeOnly) || (oldEough && youngEnough && meetsGender)) && meetsRegistation);
    }

}


