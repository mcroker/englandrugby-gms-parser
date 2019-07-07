export declare interface CSVData { [name: string]: string; };

export const H_BUILDINGNAME = 'Building Name';
export const H_HOUSENO = 'House Number';
export const H_ADDR1 = 'Address Line 1';
export const H_ADDR2 = 'Address Line 2';
export const H_ADDR3 = 'Address Line 3';
export const H_CITY = 'City';
export const H_COUNTY = 'County';
export const H_POSTCODE = 'Postal Code';
export const H_COUNTRY = 'Country';
export const H_REGION = 'Region';

/**
 * Represents a persons address
 * @beta
 */
export class Address {

    public buildingName: string = '';
    public houseNumber: string = '';
    public line1: string = '';
    public line2: string = '';
    public line3: string = '';
    public city: string = '';
    public county: string = '';
    public postcode: string = '';
    public country: string = '';
    public region: string = '';

    /**
     * constructor
     * 
     * @param data - CSVDataRow from Person CSV object
     */
    public constructor(data?: CSVData) {
        if (undefined !== data) {
            this.loadFromCSV(data);
        }
    }
    /**
     * load address object properties based from Person CSV object 
     * 
     * @param data - CSVDataRow from Person CSV Format
     */
    public loadFromCSV(data: CSVData) {
        // People Export Fields
        if (undefined !== data[H_BUILDINGNAME]) this.buildingName = data[H_BUILDINGNAME];
        if (undefined !== data[H_HOUSENO]) this.houseNumber = data[H_HOUSENO];
        if (undefined !== data[H_ADDR1]) this.line1 = data[H_ADDR1];
        if (undefined !== data[H_ADDR2]) this.line2 = data[H_ADDR2];
        if (undefined !== data[H_ADDR3]) this.line3 = data[H_ADDR3];
        if (undefined !== data[H_CITY]) this.city = data[H_CITY];
        if (undefined !== data[H_COUNTY]) this.county = data[H_COUNTY];
        if (undefined !== data[H_POSTCODE]) this.postcode = data[H_POSTCODE];
        if (undefined !== data[H_COUNTRY]) this.country = data[H_COUNTRY];
        if (undefined !== data[H_REGION]) this.region = data[H_REGION];
    }

    /**
     * Convert address to string
     * 
     * @returns String representation of address
     */
    public toString() {
        let a: string[] = [];
        if ('' !== this.buildingName) { a.push(this.buildingName) };
        if ('' !== this.houseNumber) { a.push(this.houseNumber) };
        if ('' !== this.line1) { a.push(this.line1) };
        if ('' !== this.line2) { a.push(this.line2) };
        if ('' !== this.line3) { a.push(this.line3) };
        if ('' !== this.city) { a.push(this.city) };
        if ('' !== this.county) { a.push(this.county) };
        if ('' !== this.postcode) { a.push(this.postcode) };
        if ('' !== this.country && 'UNITED KINGDOM' !== this.country) {
            a.push(this.country);
            if ('' !== this.region) { a.push(this.region) };
        };
        return a.join(', ');
    }

}
