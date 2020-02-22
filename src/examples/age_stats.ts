import { ClubGMS, Person, PersonGroup } from '..'; import { TWRFCUtils } from './TWRFCUtils';

const env = TWRFCUtils.getNunjucks();

let groups = [{ name: 'no DOB or <4', min: 0, max: 3 }];
for (let i = 4; i < 25; i++) {
  groups.push({ name: i.toString(), min: i, max: i });
};
for (let i = 25; i <= 60; i = i + 5) {
  groups.push({ name: i.toString() + '-' + String(i + 4), min: i, max: i + 4 });
};
groups.push({ name: '>65', min: 65, max: 999 });

(async () => {
  const club: ClubGMS = await ClubGMS.createFromDirectory()
  let ages: PersonGroup[] = [];
  for (const group of groups) {
    ages.push(new PersonGroup(group.name, club.getPeople()
      .filter((person: Person) =>
        (person.ageAtStartOfSeason !== undefined && person.ageAtStartOfSeason >= group.min && person.ageAtStartOfSeason <= group.max)
      )
    ));
  }
  process.stdout.write(
    env.render('group_stats.njk', { title: 'Age', rows: ages })
  );
})();