import { Person } from './Person';

export enum RelationshipType {
    parentOf = 'Parent',
    siblingOf = 'Sibling',
    chargeOf = 'Charge',
    childOf = 'Child',
    grandchildOf = 'Grandchild',
    guardianOf = 'Guardian',
    grandparentOf = 'Grandparent',
    otherOf = 'Other',
    nextOfKinOf = 'Next',
    wifeOf = 'Wife',
    husbandOf = 'Husband',
    partnerOf = 'Partner',
    fianceOf = 'Fiance',
    unknown = 'Unknown'
};

export class Relationship {

    public rfuid: string;
    public relType: RelationshipType;
    public relation: Person | undefined;

    constructor(relString?: string) {
        if (undefined != relString) {
            relString = relString.trim();
            let relRFUIdMatch = relString.match(/\(([^)]*)\)/g);
            if (relRFUIdMatch != null) {
                this.rfuid = relRFUIdMatch[0].substring(1, relRFUIdMatch[0].length - 1);
            }
            let relTypeMatch = relString.match(/^[^ ]*/g);
            if (null !== relTypeMatch) {
                this.relType = Relationship.getRelationshipType(relTypeMatch[0]);
            }
        }
    }

    static getRelationshipType(typeString: string): RelationshipType {
        if (Object.values(RelationshipType).includes(typeString)) {
            return typeString as RelationshipType;
        } else {
            console.log('WARNING: RelationshipType ' + typeString + ' not recognised.');
            return RelationshipType.unknown;
        }
    }

}