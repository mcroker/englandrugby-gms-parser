import { Membership, Person, ClubGMS } from '..';
import * as nunjucks from 'nunjucks';
import * as path from 'path';
import * as fs from 'fs';

export enum TWRFCAgeGrades {
  under6 = 'Tunbridge Wells U6',
  under7 = 'Tunbridge Wells U7',
  under8 = 'Tunbridge Wells U8',
  under9 = 'Tunbridge Wells U9',
  under10 = 'Tunbridge Wells U10',
  under11 = 'Tunbridge Wells U11',
  under12 = 'Tunbridge Wells U12',
  under13 = 'Tunbridge Wells U13',
  under13W = 'Tunbridge Wells U13 Girls',
  under14 = 'Tunbridge Wells U14',
  under15 = 'Tunbridge Wells U15',
  under15W = 'Tunbridge Wells U15 Girls',
  under16 = 'Tunbridge Wells U16',
  under17 = 'Tunbridge Wells U17',
  under18 = 'Tunbridge Wells U18',
  under18W = 'Tunbridge Wells U18 Girls',
  colts = 'Tunbridge Wells COLTS',
  senior = 'Tunbridge Wells SENIOR',
  ladies = 'Tunbridge Wells LADIES'
}

export enum TWRFCScheme {
  senior = 'Senior Player',
  family = 'Parent (Family Member)',
  vets = 'Vets Player',
  concession = 'Concession',
  vp = 'VP',
  higherEd = 'Higher-Ed',
  youth = 'Youth Player',
  social = 'Social Member',
  associate = 'Associate',
  volunteer = 'Coach/Volunteer',
  other = 'Other'
}

export class TWRFCUtils {

  static getNunjucks(...dirPath: string[]): nunjucks.Environment {

    const dirLocation = (0 == dirPath.length) ? path.join(__dirname, 'templates') : path.join(...dirPath);

    nunjucks.configure(dirLocation, {
      autoescape: false
    });

    var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(dirLocation),
      { autoescape: false });

    env.addFilter('fixedlength', function (input: string | number, length: number) {
      const padding = '                                                                                                                                                                                                                                                                ';
      const padded: string = (input) ? input + padding : padding;
      return padded.substr(0, length - 1);
    });

    env.addFilter('ismember_html', function (p: Person) {
      if (0 != p.memberships.filter((item) => { return (item.status == 'Active' && item.scheme != 'Associate') }).length) {
        return 'Yes'
      } else if (p.isMember) {
        return 'No (Sabatical)'
      } else {
        return '<span style="color:red">No</span>'
      }
    });

    env.addFilter('ismember', function (p: Person) {
      if (0 != p.memberships.filter((item) => { return (item.status == 'Active' && item.scheme != 'Associate') }).length) {
        return 'Yes'
      } else if (p.isMember) {
        return 'No (Sabatical)'
      } else {
        return 'No'
      }
    });

    env.addFilter('isplayer_html', function (p: Person) {
      if (p.isPlayer) {
        return 'Yes'
      } else {
        return '<span style="color:red">No</span>'
      }
    });

    env.addFilter('isplayer', function (p: Person) {
      if (p.isPlayer) {
        return 'Yes'
      } else {
        return 'No'
      }
    });

    env.addFilter('yesno', function (b: boolean) {
      if (b) {
        return 'Yes'
      } else {
        return 'No'
      }
    });

    env.addFilter('yesblank', function (b: string) {
      if (b) {
        return 'Yes'
      } else {
        return ''
      }
    });

    env.addFilter('dbs_html', function (b?: string) {
      if (b === 'Current') {
        return b
      } else if (b !== '') {
        return '<span style="color:red">' + b + '</span>'
      } else {
        return '<span style="color:red">None</span>'
      }
    });

    return env;
  }

  static scoreMembership(person: Person, membership: Membership): number {
    let scheme = TWRFCUtils.normaliseScheme(membership.scheme);
    let activeScore = membership.isActive() ? 100 : 0; // An active membership always trumps and expired one
    let score = 0;
    switch (scheme) {
      case TWRFCScheme.senior:
        score = 9
        break;;
      case TWRFCScheme.family:
        score = 8
        break;;
      case TWRFCScheme.vets:
        score = 7
        break;;
      case TWRFCScheme.concession:
        score = 6
        break;;
      case TWRFCScheme.vp:
        score = 5
        break;;
      case TWRFCScheme.higherEd:
        score = 4
        break;;
      case TWRFCScheme.youth:
        score = 3
        break;;
      case TWRFCScheme.social:
        score = 2
        break;;
      case TWRFCScheme.volunteer:
      case TWRFCScheme.associate:
      case TWRFCScheme.other:
        score = 1
        break;;
    }
    return score + activeScore;
  }

  static normaliseScheme(scheme: string): TWRFCScheme {
    if (scheme === 'Senior Player') {
      return TWRFCScheme.senior;
    } else if (scheme === 'Veteran (Occasional Player)') {
      return TWRFCScheme.vets;
    } else if (scheme === 'Concession') {
      return TWRFCScheme.concession;
    } else if (scheme === 'Vice President (Social)') {
      return TWRFCScheme.vp;
    } else if (scheme === 'Higher Education (Occasional Player)') {
      return TWRFCScheme.higherEd;
    } else if (scheme === 'Youth Player') {
      return TWRFCScheme.youth;
    } else if (scheme.match(/family/i)) {
      return TWRFCScheme.family;
    } else if (scheme.match(/social/i)) {
      return TWRFCScheme.higherEd;
    } else if (scheme === 'Associate') {
      return TWRFCScheme.associate;
    } else if (scheme === 'Coach/Volunteer') {
      return TWRFCScheme.volunteer;
    } else {
      console.log('WARNING: Scheme ' + scheme + ' not recognised.');
      return TWRFCScheme.other;
    }
  }

  static getCoachEmails(ageGrades: TWRFCAgeGrades[] | string[]): string {
    const coachemails = JSON.parse(fs.readFileSync(path.join(__dirname, 'clubconfig.json'), 'utf8').toString()).coachemails;
    let emails: string[] = [];
    for (const agegrade of ageGrades) {
      if (coachemails.hasOwnProperty(agegrade)) {
        emails.push(coachemails[agegrade]);
      }
    }
    console.log(emails);
    return emails.join(', ');
  }

  static parseDataErrors(club: ClubGMS): Map<string, string[]> {

    let dataErrors: Map<string, string[]> = new Map<string, string[]>();
    const reportDataError = (person: Person, error: string) => {
      let errors = dataErrors.get(person.rfuid);
      if (undefined == errors) {
        errors = [error];
      } else {
        errors.push(error);
      }
      dataErrors.set(person.rfuid, errors);
    };

    for (let person of club.getPeople().filter((item) => item.isMember)) {
      if (person.isChild()) {
        if (person.getParents().length === 0 && person.getChildren().length > 0) {
          reportDataError(person, 'child has no parent but has children (wrong DOB?)');
        }
        else if (person.getParents().length === 0) {
          reportDataError(person, 'child has no parents');
        }
        else if (person.getChildren().length > 0)
          reportDataError(person, 'child has children');
      }
    }

    for (let member of club.findPeopleByMembershipScheme(/Family/)) {
      if (member.isChild()) {
        reportDataError(member, 'Has family membership but is a child');
      } else {
        if (member.getChildren().length === 0) {
          reportDataError(member, 'Has family membership but no children');
        }
        for (let child of member.getChildren()) {
          if (!child.isMember) {
            reportDataError(child, 'Is not a youth member but parent is a family member');
          }
        }
      }
    }

    for (let member of club.findPeopleByMembershipScheme(/Senior/)) {
      if (member.isChild()) {
        reportDataError(member, 'Has senior membership but is a child');
      } else {
        for (let child of member.getChildren()) {
          if (!child.isMember) {
            reportDataError(child, 'Is not a youth member but parent is a senior member');
          }
        }
      }
    }

    return dataErrors;
  }

}
