import { ClubGMS } from '..';
import { TWRFCUtils, TWRFCScheme } from './TWRFCUtils';
const printf = require('printf');

const TRACKEDSCHEME = [
  TWRFCScheme.senior,
  TWRFCScheme.family,
  TWRFCScheme.vets,
  TWRFCScheme.concession,
  TWRFCScheme.vp,
  TWRFCScheme.higherEd,
  TWRFCScheme.youth,
  TWRFCScheme.social,
  TWRFCScheme.other
];

function consolidateSchemes(scheme: string): TWRFCScheme {
  let normalisedScheme = TWRFCUtils.normaliseScheme(scheme);
  if (TRACKEDSCHEME.includes(normalisedScheme)) {
    return normalisedScheme
  } else {
    return TWRFCScheme.other
  }
}

declare interface CountArray { [name: string]: number[]; };

(async () => {
  const club: ClubGMS = await ClubGMS.createFromDirectory();

  // Initialise and zero arrays
  let countallkids: CountArray = {};
  let countmemkids: CountArray = {};
  for (let scheme of TRACKEDSCHEME) {
    countallkids[scheme] = [0, 0, 0, 0, 0, 0];
    countmemkids[scheme] = [0, 0, 0, 0, 0, 0];
  }

  // Loop through families with at least one active member
  // create a tally (by scheme) of the number of families with X children with/without membership
  for (var family of club.families.filter((item) => { return item.hasActiveMember() })) {
    let primary = family.getPrimaryData(TWRFCUtils.scoreMembership);
    let mainscheme = (undefined !== primary.membership) ? consolidateSchemes(primary.membership.scheme) : TWRFCScheme.other;
    countmemkids[mainscheme][family.countChildren()] += 1;
    countallkids[mainscheme][family.countChildren(false)] += 1;
  }

  // Output text
  const TITLEFORMAT = '\n### Distribution of #children in family (%s)\n\n';
  const HRULE = '---------------------------------------------------------\n';
  const OUTFORMAT = '%-22s %5s %5s %5s %5s %5s %5s\n';
  process.stdout.write(printf(TITLEFORMAT + OUTFORMAT + HRULE, 'Members only', '', 0, 1, 2, 3, 4, 5));
  for (let scheme of TRACKEDSCHEME) {
    process.stdout.write(printf(OUTFORMAT,
      scheme,
      countmemkids[scheme][0],
      countmemkids[scheme][1],
      countmemkids[scheme][2],
      countmemkids[scheme][3],
      countmemkids[scheme][4],
      countmemkids[scheme][5]
    ));
  }

  process.stdout.write(printf(TITLEFORMAT + OUTFORMAT + HRULE, 'All children', '', 0, 1, 2, 3, 4, 5));
  for (let scheme of TRACKEDSCHEME) {
    process.stdout.write(printf(OUTFORMAT,
      scheme,
      countallkids[scheme][0],
      countallkids[scheme][1],
      countallkids[scheme][2],
      countallkids[scheme][3],
      countallkids[scheme][4],
      countallkids[scheme][5]
    ));
  }

})();