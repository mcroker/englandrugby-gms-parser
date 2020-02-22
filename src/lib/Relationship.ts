import { Person } from './Person';

/**
 * Enumeration for RelationshipTpyes...  generally these are based on the person
 * i.e. persona.relationship.reltype = RelationshipType.parentOf if 
 * persona is the parent of the person referenced in persona.relationship.relation
 * @beta
 */
export enum RelationshipType {
    parentOf = 'Parent',
    siblingOf = 'Sibling',
    chargeOf = 'Charge',
    childOf = 'Child',
    grandchildOf = 'Grandchild',
    guardianOf = 'Guardian',
    grandparentOf = 'Grandparent',
    otherOf = 'Other',
    nextOfKinOf = 'Next of Kin',
    wifeOf = 'Wife',
    husbandOf = 'Husband',
    partnerOf = 'Partner',
    fianceOf = 'Fiance',
    emergencycontact = 'Emergency Contact',
    contactsource = 'Contact Source',
    businesscontact = 'Business Contact',
    unknown = 'Unknown'
};

/**
 * Relationship object. One of these is created for each relationship a person has to 
 * another person.
 * @beta
 */
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
            let relTypeMatch = relString.match(/^(.*) of/);
            if (null !== relTypeMatch) {
                this.relType = Relationship.getRelationshipType(relTypeMatch[1]);
            }
        }
    }

    static getRelationshipType(typeString: string): RelationshipType {
        if (Object.values(RelationshipType).includes(typeString as any)) {
            return typeString as RelationshipType;
        } else {
            console.log('WARNING: RelationshipType ' + typeString + ' not recognised.');
            return RelationshipType.unknown;
        }
    }

}