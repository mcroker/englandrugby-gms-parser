import * as fs from 'fs';
import * as csv from 'fast-csv';

import { Membership } from './Membership';
import { Person } from './Person';
import { Family } from './Family';
import { Role } from './Role';
import { Qualifcation, QualifcationTypes } from './Qualification';

export class ClubGMS {

  people: Map<string, Person> = new Map<string, Person>();
  memberships: Membership[] = [];
  families: Family[] = [];

  public constructor(peopleData?: Person[], membershipData?: Membership[]) {
    if (undefined !== peopleData) {
      peopleData.map((person: Person) => this.people.set(person.rfuid, person));
    }

    if (undefined !== membershipData) {
      membershipData.map((membership: Membership) => {
        let person: Person | undefined = this.people.get(membership.rfuid);
        if (undefined === person) {
          person = new Person();
        }
        person.addMembership(membership);
        this.people.set(person.rfuid, person);
        this.memberships.push(membership);
      });
    }

    this.families = Family.createFamilyData(this.people);

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

  findPeopleByQualifcation(qualifcation: string | RegExp): Person[] {
    return Array.from(this.people.values()).filter((person: Person) => {
      return (undefined !== person.qualifcations.find((item: Qualifcation) => {
        return item.name.match(qualifcation)
      }))
    })
  }

  findPeopleByQualifcationType(type: QualifcationTypes, level?: number): Person[] {
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

  findFamilyContainingId(rfuid: string): Family | undefined {
    return this.families.find((family: Family) => {
      let result = family.allIds().includes(rfuid);
      return result;
    });
  }

}


