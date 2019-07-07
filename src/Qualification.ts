/**
 * Enumeration of QualifcationTypes
 * @public
 */
export enum QualificationType {
    coaching = 'Coaching',
    welfare = 'Welfare',
    medical = 'Medical',
    refereeing = 'Refereeing',
    unknown = 'Other',
    coachdevelopment = 'Coach Development',
    admin = 'Admin',
    leadership = 'Leadership'
}

enum NormalisedQualifcation {
    concussion = 'Concussion Module',
    rugbyready = 'Rugby Ready',
    cpd = 'CPD',
    cmod = 'CMOD'
}

/**
 * Qualifcation Class - one of these is created for each qualifcation somebody holds
 * @beta
 */
export class Qualifcation {
    name: string = '';
    type: QualificationType = QualificationType.unknown;
    level: number  = -1;

    constructor(name: string) {
        this.name = String(name).trim();
        let normalisedName = this.name;

        if (this.name.match(/^CPD /) || this.name.match(/ CPD /)) normalisedName = NormalisedQualifcation.cpd;
        if (this.name.match(/^CMOD /) || this.name.match(/^Continuous Referee Development/)) normalisedName = NormalisedQualifcation.cmod;
        if (this.name.match(/^Concussion Module/)) normalisedName = NormalisedQualifcation.concussion;

        switch (normalisedName) {

            // Medical
            case NormalisedQualifcation.concussion:
                this.type = QualificationType.medical;
                this.level = 0;
                break;;
            case 'Emergency First Aid in Rugby Union':
            case 'Appointed Person (First Aid)':
                this.type = QualificationType.medical;
                this.level = 1;
                break;;
            case 'RFU Pre-Hospital Immediate Care in Sport Level 2':
                this.type = QualificationType.medical;
                this.level = 2;
                break;;

            // Coaching
            case NormalisedQualifcation.cpd:
            case 'TAG':
            case 'Level 3 Application Workshop':
                this.type = QualificationType.coaching;
                break;;
            case 'Rugby Ready':
            case 'Start Rugby':
                this.type = QualificationType.coaching;
                this.level = 0;
                break;;
            case '1st4Sport Level 1':
            case 'Coaching Childrens Rugby':
            case 'Mini-Midi Coach Award':
            case 'UKCC Level 1: Introducing Children to Rugby Union':
            case 'Level 1 Mini-Midi': // Guess this is coaching
            case 'RFU Preliminary Award':  // Guess this is coaching
            case 'Youth Level 1': // Guess this is coaching
            case 'Adult Level 1': // Guess this is coaching
                this.type = QualificationType.coaching;
                this.level = 1;
                break;;
            case '1st4Sport Level 2':
            case 'Adult Level 2': // Guess this is coaching
            case 'UKCC Level 2: Coaching the 15-a-side game':
            case 'England Rugby Coaching Award (Level 2)':
            case 'RFU Coaching Award': // Guess this is level 2
            case 'UKCC Level 2: QBE Coaching the 15-a-side game':
                this.type = QualificationType.coaching;
                this.level = 2;
                break;;
            case '1st4Sport Level 3':
            case 'Adult Level 3':
                this.type = QualificationType.coaching;
                this.level = 3;
                break;;

            // Referreeing
            case NormalisedQualifcation.cmod:
                this.type = QualificationType.refereeing;
                break;;
            case 'Quilter Kids First Refereeing Children':
            case 'National Foundation Referee Certificate - Part 1':
            case 'Refereeing Children Rugby Union: Level 1':
            case 'National Referee Mini-Midi Certificate':
            case 'Refereeing Mini Midi Rugby':
                this.type = QualificationType.refereeing;
                this.level = 1;
                break;;
            case 'Entry Level Referee Award Course':
            case 'Entry Level Referee Award Stages 1 and 2':
            case 'Legacy - Entry Level Referee Award':
            case 'England Rugby Refereeing Award (Level 2)':
            case 'Refereeing the 15-a-side game: Level 2':
            case 'Entry Level Referee Award Stage 3':
            case 'Society Referee':
                this.type = QualificationType.refereeing;
                this.level = 2;
                break;;

            // Welfare
            case 'Safeguarding and Protecting Young People in Rugby Union':
            case 'Play it Safe':
            case 'Club Safeguarding Officers Workshop':
                this.type = QualificationType.welfare;
                break;;

            // Development
            case 'Coach and Referee Developer':
            case 'Developing Coaches & Match Officials 2':
            case 'RFU Rugby Educator':
            case 'RFU Rugby Developer':
                this.type = QualificationType.coachdevelopment;
                break;;

            // Leadership
            case 'RFU Leadership Academy':
            case 'Rugby Leaders - Foundation':
                this.type = QualificationType.leadership;
                break;;

            // Admin
            case 'GMS Training Workshop':
            case 'RFU Workforce Access': // Guess this is admin
                this.type = QualificationType.admin;
                break;;

            default:
                console.log('Warning: qualifcation unrecognised : ', this.name);
        }
    }
}