import { ClubGMS } from '..';
import { TWRFCUtils, TWRFCAgeGrades } from './TWRFCUtils';

var env = TWRFCUtils.getNunjucks();

(async () => {
  const club: ClubGMS = await ClubGMS.createFromDirectory();
  const errorData = TWRFCUtils.parseDataErrors(club);
  const errors: { [rfuid: string]: string } = {};
  errorData.forEach((value: string[], rfuid: string) => { errors[rfuid] = value.join(';'); });

  const gradeIndex = Object.keys(TWRFCAgeGrades).indexOf(process.argv[2]);
  if (-1 == gradeIndex) {
    console.log('Specified age grade not found - try under12');
  } else {
    const team = club.getTeam(Object.values(TWRFCAgeGrades)[gradeIndex]);
    if (undefined !== team) {
      process.stdout.write(
        env.render('team_report.njk', { team: team, comments: errors })
      );
    } else {
      console.log('Specified team not found')
    }
  }
})();