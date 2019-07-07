import { Gender } from './Person';

export enum AgeGrade {
    under6 = 'U6',
    under7 = 'U7',
    under8 = 'U8',
    under9 = 'U9',
    under10 = 'U10',
    under11 = 'U11',
    under12 = 'U12',
    under13 = 'U13',
    under13ladies = 'U13W',
    under14 = 'U14',
    under15 = 'U15',
    under15ladies = 'U15W',
    under16 = 'U16',
    under17 = 'U17',
    under18 = 'U18',
    under18ladies = 'U18W',
    colts = 'COLTS',
    senior = 'SENIOR',
    ladies = 'LADIES'
}

export interface AgeGradeConfigItem {
    agegrade: AgeGrade,
    minage: number,
    maxage?: number,
    gender?: Gender
}
export type AgeGradeConfig = AgeGradeConfigItem[];

export const DEFAULT_AGE_GRADE_CONFIG: AgeGradeConfig = [
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