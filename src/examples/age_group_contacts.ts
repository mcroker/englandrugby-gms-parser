import { ClubGMS } from '..';
import { TWRFCAgeGrades } from './TWRFCUtils';

(async () => {
  const club: ClubGMS = await ClubGMS.createFromDirectory();
  for (var person of club.findPeopleByTeamName(TWRFCAgeGrades.under6)) {
    console.log(person.getName(), person.getContactEmails());
  }
})();