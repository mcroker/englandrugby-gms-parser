import * as fs from 'fs';
import * as csv from 'fast-csv';

import { Membership } from './Membership';
import { Person } from './Person';
import { Family } from './Family';
import { Role } from './Role';
import { Qualifcation, QualificationType } from './Qualification';
import { Scheme, SchemeNormaliseFunction } from './Scheme';
import { AgeGrade } from './Team';
import { ClubConfig, DefaultClubConfig } from './ClubConfig';
import { Utils } from './Utils';

/**
 * Primary class for gms-parser package, loads and enbles access to all imported GMS csv data
 * @beta
 */
export class ClubGMS {

  people: Map<string, Person> = new Map<string, Person>();
  memberships: Membership[] = [];
  families: Family[] = [];
  schemes: Map<string, Scheme> = new Map<string, Scheme>();
  config: ClubConfig;

  /**
   * Constructor for ClubGMS class.
   * 
   * This expects to be passed pre-processed people and membership data.
   * To create a ClubGMS object it is more likely you would want to use the static functions
   * ClubGMS.createFromDirectory() or ClubGMS.createFromGMSExports().
   * 
   * @param peopleData     - Array of Person objects
   * @param membershipData - Array of membership objects
   * @param config         - ClubConfig object, allowing a number of default configuration items to be overwritten.
   */
  public constructor(peopleData?: Person[], membershipData?: Membership[], config?: ClubConfig) {

    this.config = (undefined !== config) ? config : new DefaultClubConfig() as ClubConfig;

    // Stage 1 - Load people data
    if (undefined !== peopleData) {
      peopleData.map((person: Person) => this.people.set(person.rfuid, person));
    }

    // Stage 2 - Load membership data
    if (undefined !== membershipData) {
      membershipData.forEach((membership: Membership) => {
        let person: Person | undefined = this.people.get(membership.rfuid);
        if (undefined === person) {
          person = new Person();
        }
        membership.associatePerson(person);
        person.addMembership(membership);
        this.people.set(person.rfuid, person);
        this.memberships.push(membership);
      });
    }

    // Stage 3 - Create links between people based on relationship
    this.people.forEach((person) => {
      for (let rel of person.relationships) {
        let relation = this.people.get(rel.rfuid);
        if (undefined !== relation) {
          rel.relation = relation;
        }
      };
    });

    // Stage 4 - Resolve into family groups
    this.families = Family.createFamilyData(this.people);

    // Stage 5 - Add people to schemes
    this.people.forEach((person) => {
      for (let membership of person.memberships) {
        let scheme = this.schemes.get(membership.scheme);
        if (undefined === scheme) {
          scheme = new Scheme(membership.scheme);
        }
        scheme.addMembership(membership);
        this.schemes.set(membership.scheme, scheme);
      };
    });

  }

  /**
   * Creates a ClubGMS object by scanning the selected directory for the most recent files
   * matching the pattern of a GMS people or GMS membership export.
   * 
   * @param dirname - Directory to be scanned, if not provided defaults to $HOME/Downloads, or '.' if $HOME not set.
   * @param config  - ClubConfig object allows default configuration to be set.
   * 
   * @returns Populated ClubGMS object
   */
  public static createFromDirectory(dirname?: string, config?: ClubConfig): Promise<ClubGMS> {
    return new Promise<ClubGMS>((resolve, reject) => {
      if (undefined === dirname) {
        dirname = (undefined !== process.env.HOME) ? process.env.HOME + '/Downloads' : '.'
      }
      let findpeople = Utils.findLatestGlob(dirname + '/Individual_Everyone_*.csv');
      let findmembers = Utils.findLatestGlob(dirname + '/Individual_MembersList_*.csv');
      Promise.all([findpeople, findmembers])
        .then((results) => {
          let peopleFile = results[0];
          let membersFile = results[1];
          ClubGMS.createFromGMSExports(peopleFile, membersFile, config)
            .then((club: ClubGMS) => {
              resolve(club);
            })
            .catch((err: Error) => {
              reject(err);
            });
        })
        .catch((err: Error) => {
          return Promise.reject(err);
        })
    })
  }

  /**
   * Creates a ClubGMS object from the people and member file specified.
   * 
   * @param peopleFile - Filename of people CSV export
   * @param memberFile - Filename of member CSV export
   * @param config     - ClubConfig object allows default configuraiton to be overridden
   * 
   * @returns Populated ClubGMS object
   */
  public static createFromGMSExports(peopleFile?: string, memberFile?: string, config?: ClubConfig): Promise<ClubGMS> {
    return new Promise<ClubGMS>((resolve, reject) => {
      let peoplePromise = (undefined !== peopleFile) ? ClubGMS.readPeopleGMSFile(peopleFile) : Promise.resolve([] as Person[]);
      let memberPromise = (undefined !== memberFile) ? ClubGMS.readMembershipGMSFile(memberFile) : Promise.resolve([] as Membership[]);
      Promise.all([peoplePromise, memberPromise])
        .then((data: any[]) => {
          resolve(new ClubGMS(data[0] as Person[], data[1] as Membership[], config));
        })
        .catch((err: Error) => {
          reject(err);
        });
    })
  }

  /**
   * Reads GMS People CSV export into People object structure
   * 
   * @param file - Filename of people CSV export
   * 
   * @returns Array of Person objects contained in CSV export
   */
  protected static readPeopleGMSFile(file: string): Promise<Person[]> {
    return new Promise<Person[]>((resolve, reject) => {
      let people: Person[] = [];
      var peoplestream = fs.createReadStream(file);
      csv
        .fromStream(peoplestream, { headers: true })
        .on("data", function (data) {
          people.push(new Person(data));
        })
        .on("end", function () {
          resolve(people)
        })
    })
  }

  /**
   * Reads GMS Membership CSV export into Membership object structure
   * 
   * @param file - Filename of membership CSV export
   * 
   * @returns Array of Membership objects contained in CSV export
   */
  protected static readMembershipGMSFile(file: string): Promise<Membership[]> {
    return new Promise<Membership[]>((resolve, reject) => {
      let memberships: Membership[] = [];
      var memberstream = fs.createReadStream(file);
      csv
        .fromStream(memberstream, { headers: true })
        .on("data", function (data) {
          memberships.push(new Membership(data));
        })
        .on("end", function () {
          resolve(memberships)
        })
    })
  }

  // People ==================================================

  /**
   * Get all people in club
   * @returns array of People objects for all people in club
   */
  getPeople() {
    return Array.from(this.people.values());
  }

  /**
   * Find all people within a particular AgeGrade
   * @param agegrade              - AgeGrade to match
   * @param onlyRegisteredPlayers - If false will return people with right age irrespective of
   *                                whether they are a registered player (default: true)
   * 
   * @returns array of People objects for people who match AgeGrade criteria
   *          If nobody was found an empty array is returned.
   */
  findPeopleByAgeGrade(agegrade: AgeGrade, onlyRegisteredPlayers: boolean = true): Person[] {
    return Array.from(this.people.values()).filter((person: Person) => {
      return (person.getAgeGrade(onlyRegisteredPlayers, this.config) === agegrade)
    })
  }

  /**
   * Find a single person by their RFU ID.
   * 
   * @param rfuid - RFU ID of person to find.
   * 
   * @returns Person object matching the rfuid. If no match is found undefined is returned.
   */
  findPersonById(rfuid: string): Person | undefined {
    return this.people.get(rfuid);
  }

  /**
   * Find all people holding a particular role.
   * 
   * @param role - Either a string or regular-express for the role to be matched
   * 
   * @returns An array of Person objects for the people matching the role criteria
   *          If nobody was found an empty array is returned.
   */
  findPeopleByRole(role: string | RegExp): Person[] {
    return Array.from(this.people.values()).filter((person: Person) => {
      return (undefined !== person.roles.find((item: Role) => { return item.name.match(role) }))
    })
  }

  /**
   * Find all people holding a particular qualifcation
   * 
   * This uses a match on the qualification name. If you are more generally interested in 
   * people holding a particular qualifcation type (e.g. L2 coaching or L2 refereeing use
   * findPeopleByQualifcaitonType()
   * 
   * @param qualifcation - Either a string or regular-express for the qualifcation to be matched
   * 
   * @returns An array of Person objects for the people matching the qualifcation criteria,
   *          if nobody was found an empty array is returned.
   */
  findPeopleByQualification(qualifcation: string | RegExp): Person[] {
    return Array.from(this.people.values()).filter((person: Person) => {
      return (undefined !== person.qualifcations.find((item: Qualifcation) => {
        return item.name.match(qualifcation)
      }))
    })
  }

  /**
   * Find all people holding a particular qualifcation type (e.g. L2 coaching)
   * 
   * @param type  - Qualifcation type (e.g. QualifcationType.coaching)
   * @param level - If provided, minimun level of qualifcation to match (0,1,2,3).
   *                Default is to match all people irrespective of level.
   * 
   * @returns An array of Person objects for the people matching the criteria,
   *          if nobody was found an empty array is returned.
   */
  findPeopleByQualificationType(type: QualificationType, level?: number): Person[] {
    let searchlevel = (undefined !== level) ? level : 0;
    return Array.from(this.people.values()).filter((person: Person) => {
      return (undefined !== person.qualifcations.find((item: Qualifcation) => {
        return (item.type === type && item.level >= searchlevel)
      }))
    })
  }

  /**
   * Find all people beloning to a particular membership scheme.
   * 
   * @param scheme - String or regular-express of membership scheme to match
   * @param status - If provided only match membership records with a particular status.
   *                 Default is to match all people with the scheme irrespective of status.
   * 
   * @returns An array of Person objects for the people matching the criteria
   */
  findPeopleByMembershipScheme(scheme: string | RegExp, status?: string): Person[] {
    return Array.from(this.people.values()).filter((person: Person) => {
      return (undefined !== person.memberships.find((item: Membership) => {
        return (item.scheme.match(scheme) && (undefined === status || item.status === status))
      }))
    })
  }

  // Family ==================================================

  /**
   * Find the family object for the family containing the person identified by RFU ID.
   * 
   * @param rfuid - RFUI ID of the person to match
   * 
   * @returns Family object, or undefined if not found.
   */
  findFamilyContainingId(rfuid: string): Family | undefined {
    return this.families.find((family: Family) => {
      let result = family.allIds().includes(rfuid);
      return result;
    });
  }

  // Scheme ==================================================

  /**
   * Return the object for a named membership scheme.
   * 
   * @param name - Name of scheme to retrieve.
   * 
   * @returns Scheme object or undefined if not found.
   */
  getScheme(name: string): Scheme | undefined {
    return this.schemes.get(name);
  }

  /**
   * Return all membership schemes in the club
   * 
   * @returns Array of all membership schemes. If no schems are defined an empty
   *          array is returned.
   */
  getSchemes(): Scheme[] {
    return Array.from(this.schemes.values());
  }

  getNormalisedSchemes(normaliseFunction: SchemeNormaliseFunction): Scheme[] {
    let normalisedSchemes: Map<string, Scheme> = new Map<string, Scheme>();
    for (let scheme of Array.from(this.schemes.values())) {
      let normalisedName = normaliseFunction(scheme.name);
      let normalisedScheme = normalisedSchemes.get(normalisedName);
      if (undefined === normalisedScheme) {
        normalisedScheme = new Scheme(normalisedName);
      }
      normalisedScheme.merge(scheme);
      normalisedSchemes.set(normalisedScheme.name, normalisedScheme);
    }
    return Array.from(normalisedSchemes.values());
  }

}


