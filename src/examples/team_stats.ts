import { ClubGMS, PersonGroup } from '..';
import { TWRFCAgeGrades, TWRFCUtils } from './TWRFCUtils';

const env = TWRFCUtils.getNunjucks();

(async () => {
  const club: ClubGMS = await ClubGMS.createFromDirectory();
  let teams: PersonGroup[] = [];
  for (const grade of Object.values(TWRFCAgeGrades)) {
    const team = club.getTeam(grade);
    if (undefined !== team) {
      teams.push(team);
    }
  }
  process.stdout.write(
    env.render('group_stats.njk', { title: 'Team', rows: teams })
  );
})();