import { AgeGrade } from './Team';
import { Gender } from './Person';

/**
 * Configuration for Title-based gender inference
 * @beta
 */
export interface GenderTitleConfig { [title: string]: Gender; };

/**
 * Configuration for Name-based gender inference
 * @beta
 */
export interface GenderNameConfig { [name: string]: Gender; };

/**
 * Configuration for gender inference.
 * @beta
 */
export interface GenderConfig {
    titles: GenderTitleConfig;
    names: GenderNameConfig;
};

/**
 * Configuration for age & gender to AgeGrade resolution
 * @beta
 */
export interface AgeGradeConfigItem {
    agegrade: AgeGrade,
    minage: number,
    maxage?: number,
    gender?: Gender
}

/**
 * Configuration set for age & gender to AgeGrade resolution.
 * @beta
 */
export type AgeGradeConfig = AgeGradeConfigItem[];

/**
 * Configuration of RFU Seasons
 * @beta
 */
export interface SeasonConfig {
    [season: string]: {
        start: Date,
        end: Date
    };
};

/**
 * Top-level CLub Configuration Type
 * @beta
 */
export interface ClubConfig {
    readonly gender: GenderConfig;
    readonly agegroup: AgeGradeConfig;
    readonly seasons: SeasonConfig;
}

/**
 * Default Configuration
 * @beta
 */
export class DefaultClubConfig implements ClubConfig {

    /**
     * Default AgrGrade Configuration
     */
    public readonly agegroup: AgeGradeConfig = [
        { agegrade: AgeGrade.under6, minage: 4, maxage: 5 },
        { agegrade: AgeGrade.under7, minage: 6, maxage: 6 },
        { agegrade: AgeGrade.under8, minage: 7, maxage: 7 },
        { agegrade: AgeGrade.under9, minage: 8, maxage: 8 },
        { agegrade: AgeGrade.under10, minage: 9, maxage: 9 },
        { agegrade: AgeGrade.under11, minage: 10, maxage: 10 },
        { agegrade: AgeGrade.under12, minage: 11, maxage: 11, gender: Gender.male },
        { agegrade: AgeGrade.under13, minage: 12, maxage: 12, gender: Gender.male },
        { agegrade: AgeGrade.under14, minage: 13, maxage: 13, gender: Gender.male },
        { agegrade: AgeGrade.under15, minage: 14, maxage: 14, gender: Gender.male },
        { agegrade: AgeGrade.under16, minage: 15, maxage: 15, gender: Gender.male },
        { agegrade: AgeGrade.colts, minage: 16, maxage: 17, gender: Gender.male },
        { agegrade: AgeGrade.senior, minage: 18, gender: Gender.male },
        { agegrade: AgeGrade.under13ladies, minage: 11, maxage: 13, gender: Gender.female },
        { agegrade: AgeGrade.under15ladies, minage: 13, maxage: 14, gender: Gender.female },
        { agegrade: AgeGrade.under18ladies, minage: 15, maxage: 17, gender: Gender.female },
        { agegrade: AgeGrade.ladies, minage: 18, gender: Gender.female },
    ]

    /**
     * Default title to gender inference configuration
     */
    public readonly gender: GenderConfig = {
        titles: {
            master: Gender.male,
            miss: Gender.female,
            mr: Gender.male,
            mrs: Gender.female,
            ms: Gender.female
        } as GenderTitleConfig,
        names: {
            oliver: Gender.male,
            jack: Gender.male,
            harry: Gender.male,
            george: Gender.male,
            charlie: Gender.male,
            jacob: Gender.male,
            thomas: Gender.male,
            noah: Gender.male,
            william: Gender.male,
            oscar: Gender.male,
            james: Gender.male,
            muhammad: Gender.male,
            henry: Gender.male,
            alfie: Gender.male,
            leo: Gender.male,
            joshua: Gender.male,
            freddie: Gender.male,
            ethan: Gender.male,
            archie: Gender.male,
            alexander: Gender.male,
            isaac: Gender.male,
            joseph: Gender.male,
            samuel: Gender.male,
            daniel: Gender.male,
            edward: Gender.male,
            logan: Gender.male,
            lucas: Gender.male,
            mohammed: Gender.male,
            max: Gender.male,
            benjamin: Gender.male,
            mason: Gender.male,
            harrison: Gender.male,
            theo: Gender.male,
            sebastian: Gender.male,
            arthur: Gender.male,
            jake: Gender.male,
            finley: Gender.male,
            adam: Gender.male,
            dylan: Gender.male,
            riley: Gender.male,
            zachary: Gender.male,
            teddy: Gender.male,
            david: Gender.male,
            toby: Gender.male,
            theodore: Gender.male,
            matthew: Gender.male,
            elijah: Gender.male,
            jenson: Gender.male,
            harvey: Gender.male,
            jayden: Gender.male,
            michael: Gender.male,
            hugo: Gender.male,
            luca: Gender.male,
            reuben: Gender.male,
            lewis: Gender.male,
            harley: Gender.male,
            stanley: Gender.male,
            luke: Gender.male,
            frankie: Gender.male,
            tommy: Gender.male,
            jude: Gender.male,
            nathan: Gender.male,
            charles: Gender.male,
            louie: Gender.male,
            mohammad: Gender.male,
            gabriel: Gender.male,
            blake: Gender.male,
            bobby: Gender.male,
            albert: Gender.male,
            ryan: Gender.male,
            elliott: Gender.male,
            tyler: Gender.male,
            rory: Gender.male,
            elliot: Gender.male,
            frederick: Gender.male,
            alex: Gender.male,
            louis: Gender.male,
            liam: Gender.male,
            ollie: Gender.male,
            dexter: Gender.male,
            ronnie: Gender.male,
            jackson: Gender.male,
            callum: Gender.male,
            jaxon: Gender.male,
            leon: Gender.male,
            aaron: Gender.male,
            kai: Gender.male,
            roman: Gender.male,
            austin: Gender.male,
            reggie: Gender.male,
            jamie: Gender.male,
            seth: Gender.male,
            felix: Gender.male,
            ibrahim: Gender.male,
            ellis: Gender.male,
            carter: Gender.male,
            kian: Gender.male,
            sonny: Gender.male,
            connor: Gender.male,
            caleb: Gender.male,
            jonathan: Gender.male,
            eddie: Gender.male,
            ben: Gender.male,
            bruno: Gender.male,
            johnny: Gender.male,
            barnaby: Gender.male,
            monty: Gender.male,
            brodie: Gender.male,
            maxim: Gender.male,
            rufus: Gender.male,
            samson: Gender.male,
            maximilian: Gender.male,
            hector: Gender.male,
            reece: Gender.male,
            roham: Gender.male,
            torin: Gender.male,
            marlow: Gender.male,
            amelia: Gender.female,
            olivia: Gender.female,
            emily: Gender.female,
            isla: Gender.female,
            ava: Gender.female,
            jessica: Gender.female,
            ella: Gender.female,
            isabella: Gender.female,
            poppy: Gender.female,
            mia: Gender.female,
            sophie: Gender.female,
            sophia: Gender.female,
            lily: Gender.female,
            grace: Gender.female,
            evie: Gender.female,
            scarlett: Gender.female,
            ruby: Gender.female,
            chloe: Gender.female,
            daisy: Gender.female,
            isabelle: Gender.female,
            phoebe: Gender.female,
            florence: Gender.female,
            freya: Gender.female,
            alice: Gender.female,
            charlotte: Gender.female,
            sienna: Gender.female,
            matilda: Gender.female,
            evelyn: Gender.female,
            eva: Gender.female,
            millie: Gender.female,
            sofia: Gender.female,
            lucy: Gender.female,
            elsie: Gender.female,
            imogen: Gender.female,
            layla: Gender.female,
            rosie: Gender.female,
            maya: Gender.female,
            elizabeth: Gender.female,
            esme: Gender.female,
            willow: Gender.female,
            lola: Gender.female,
            ivy: Gender.female,
            holly: Gender.female,
            emilia: Gender.female,
            molly: Gender.female,
            erin: Gender.female,
            jasmine: Gender.female,
            eliza: Gender.female,
            ellie: Gender.female,
            abigail: Gender.female,
            lilly: Gender.female,
            eleanor: Gender.female,
            georgia: Gender.female,
            hannah: Gender.female,
            harriet: Gender.female,
            maisie: Gender.female,
            amber: Gender.female,
            emma: Gender.female,
            annabelle: Gender.female,
            bella: Gender.female,
            amelie: Gender.female,
            thea: Gender.female,
            harper: Gender.female,
            rose: Gender.female,
            gracie: Gender.female,
            summer: Gender.female,
            violet: Gender.female,
            martha: Gender.female,
            penelope: Gender.female,
            anna: Gender.female,
            zara: Gender.female,
            nancy: Gender.female,
            maria: Gender.female,
            maryam: Gender.female,
            darcie: Gender.female,
            darcey: Gender.female,
            heidi: Gender.female,
            lottie: Gender.female,
            megan: Gender.female,
            francesca: Gender.female,
            mila: Gender.female,
            lexi: Gender.female,
            bethany: Gender.female,
            julia: Gender.female,
            lacey: Gender.female,
            robyn: Gender.female,
            aisha: Gender.female,
            victoria: Gender.female,
            zoe: Gender.female,
            clara: Gender.female,
            sara: Gender.female,
            beatrice: Gender.female,
            darcy: Gender.female,
            leah: Gender.female,
            arabella: Gender.female,
            hollie: Gender.female,
            sarah: Gender.female,
            maddison: Gender.female,
            katie: Gender.female,
            eloise: Gender.female
        } as GenderNameConfig
    };

    public readonly seasons: SeasonConfig = {
        2018: { start: new Date('2018-09-07'), end: new Date('2019-05-27') },
        2019: { start: new Date('2019-09-01'), end: new Date('2020-05-25') }
    }

}