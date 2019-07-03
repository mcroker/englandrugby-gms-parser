import * as fs from 'fs';
import * as csv from 'fast-csv';

import { Membership } from './Membership';
import { Person } from './Person';
import { Family } from './Family';
import { Role } from './Role';
import { Qualifcation, QualificationType } from './Qualification';
import { Scheme, SchemeNormaliseFunction } from './Scheme';

export class ClubGMS {

  people: Map<string, Person> = new Map<string, Person>();
  memberships: Membership[] = [];
  families: Family[] = [];
  schemes: Map<string, Scheme> = new Map<string, Scheme>();

  public constructor(peopleData?: Person[], membershipData?: Membership[]) {

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

  public static createFromGMSExports(peopleFile?: string, memberFile?: string): Promise<ClubGMS> {
    return new Promise<ClubGMS>((resolve, reject) => {
      let peoplePromise = (undefined !== peopleFile) ? ClubGMS.readPeopleGMSFile(peopleFile) : Promise.resolve([] as Person[]);
      let memberPromise = (undefined !== memberFile) ? ClubGMS.readMembershipGMSFile(memberFile) : Promise.resolve([] as Membership[]);
      Promise.all([peoplePromise, memberPromise])
        .then((data: any[]) => {
          resolve(new ClubGMS(data[0] as Person[], data[1] as Membership[]));
        })
        .catch((err: Error) => {
          reject(err);
        });
    })
  }

  public static readPeopleGMSFile(file: string): Promise<Person[]> {
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

  public static readMembershipGMSFile(file: string): Promise<Membership[]> {
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

  // People

  getPeople() {
    return Array.from(this.people.values());
  }

  findPersonById(rfuid: string): Person | undefined {
    return this.people.get(rfuid);
  }

  findPeopleByRole(role: string | RegExp): Person[] {
    return Array.from(this.people.values()).filter((person: Person) => {
      return (undefined !== person.roles.find((item: Role) => { return item.name.match(role) }))
    })
  }

  findPeopleByQualification(qualifcation: string | RegExp): Person[] {
    return Array.from(this.people.values()).filter((person: Person) => {
      return (undefined !== person.qualifcations.find((item: Qualifcation) => {
        return item.name.match(qualifcation)
      }))
    })
  }

  findPeopleByQualificationType(type: QualificationType, level?: number): Person[] {
    let searchlevel = (undefined !== level) ? level : 0;
    return Array.from(this.people.values()).filter((person: Person) => {
      return (undefined !== person.qualifcations.find((item: Qualifcation) => {
        return (item.type === type && item.level >= searchlevel)
      }))
    })
  }

  findPeopleByMembershipScheme(scheme: string | RegExp, status?: string): Person[] {
    return Array.from(this.people.values()).filter((person: Person) => {
      return (undefined !== person.memberships.find((item: Membership) => {
        return (item.scheme.match(scheme) && (undefined === status || item.status === status))
      }))
    })
  }

  // Family

  findFamilyContainingId(rfuid: string): Family | undefined {
    return this.families.find((family: Family) => {
      let result = family.allIds().includes(rfuid);
      return result;
    });
  }

  // Schemes
  getScheme(name: string): Scheme | undefined {
    return this.schemes.get(name);
  }

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


