import { ClubGMS } from '..';
import { TWRFCUtils } from './TWRFCUtils';

const printf = require('printf');

(async () => {
    const club: ClubGMS = await ClubGMS.createFromDirectory();

    const OUTFORMAT = '%-22s %5s\n';
    const HR = '----------------------------\n'

    process.stdout.write(printf(OUTFORMAT + HR,
        'Scheme',
        '#Mem'
    ));

    for (let scheme of club.getNormalisedSchemes(TWRFCUtils.normaliseScheme)) {
        process.stdout.write(printf(OUTFORMAT,
            scheme.name,
            scheme.getCountActiveMembers()
        ));
    }

})();