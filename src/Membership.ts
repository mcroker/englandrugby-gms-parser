export declare interface MembershipCSVData { [name: string]: string; };

export const M_CLUB = 'Club';
export const M_MEMBALANCE = 'Balance'; // Not sure
export const M_MEMTYPE = 'Membership Type';
export const M_MEMNUMBER = 'Membership Number';
export const M_MEMSCHEME = 'Membership Scheme';
export const M_MEMSTARTDATE = 'Start Date';
export const M_MEMVALIDTO = 'Valid To';
export const M_ORDERSTATUS = 'Order Status';
export const M_ORDERNUMBER = 'Order';
export const M_MEMSTATUS = 'Status';
export const M_MEMSTATUSREASON = 'Status Reason';
export const M_MEMRENEWALDATE = 'Renewal Date';
export const M_UPDATEDATE = 'Date Updated';
export const M_UPDATEDBY = 'Updated By';

// These are references to fields correctly associated to a person
export const M_RFUID = 'RFU ID';
export const M_NAME = 'Name';
export const M_KNOWNAS = 'Known As';
export const M_LABEL = 'Label';
export const M_DISABILITY = 'Disability';
export const M_ETHNIC = 'Ethnic Origin';
export const M_OCCUPATION = 'Occupation';
export const M_FIRSTNAME = 'First Name';
export const M_EXTERNALREF = 'External Ref';
export const M_LASTNAME = 'Last Name';
export const M_PLAYEDAT = 'Player At';
export const M_DOB = 'Date Of Birth';
export const M_AGE = 'Age';
export const M_BALANCE = 'Balance';
export const M_EMAIL = 'Email';
export const M_PHONE = 'Phone';
export const M_ROLE = 'Role';
export const M_PLAYER = 'Player';
export const M_DBSSTATUS = 'DBS Status';
export const M_DBSEXPIRY = 'DBS Expiry';
export const M_AWARDNAME = 'Award Qualification Name';
export const M_RELATIONSHIPS = 'Relationships';

export class Membership {

    csvdata: MembershipCSVData;
    memNumber: string = '';
    rfuid: string = '';
    club: string = '';
    memType: string = '';
    scheme: string = '';
    startDate: Date | undefined = undefined;
    validTo: Date | undefined = undefined;
    orderStatus: string = '';
    orderNumber: string = '';
    balance: number | undefined = undefined;
    status: string = '';
    statusReason: string = '';
    renewalDate: Date | undefined = undefined;
    updateDate: Date | undefined  = undefined;
    updateBy: string = ''

    public constructor(data?: MembershipCSVData) {
        if (undefined !== data) {
            this.loadFromCSV(data)
        }
    }

    public loadFromCSV(data: MembershipCSVData) {
        this.csvdata = data;
        if (undefined !== data[M_RFUID]) this.rfuid = data[M_RFUID];
        if (undefined !== data[M_MEMNUMBER]) this.memNumber = data[M_MEMNUMBER];
        if (undefined !== data[M_CLUB]) this.club = data[M_CLUB];
        if (undefined !== data[M_MEMTYPE]) this.memType = data[M_MEMTYPE];
        if (undefined !== data[M_MEMSCHEME]) this.scheme = data[M_MEMSCHEME];
        if (undefined !== data[M_MEMSTARTDATE]) this.startDate = new Date(data[M_MEMSTARTDATE]);
        if (undefined !== data[M_MEMVALIDTO]) this.validTo = new Date(data[M_MEMVALIDTO]);
        if (undefined !== data[M_ORDERSTATUS]) this.orderStatus = data[M_ORDERSTATUS];
        if (undefined !== data[M_ORDERNUMBER]) this.orderNumber = data[M_ORDERNUMBER];
        if (undefined !== data[M_BALANCE]) this.balance = parseFloat(data[M_BALANCE]);
        if (undefined !== data[M_MEMSTATUS]) this.status = data[M_MEMSTATUS];
        if (undefined !== data[M_MEMSTATUSREASON]) this.statusReason = data[M_MEMSTATUSREASON];
        if (undefined !== data[M_MEMRENEWALDATE]) this.renewalDate = new Date(data[M_MEMRENEWALDATE]);
        if (undefined !== data[M_UPDATEDATE]) this.updateDate = new Date(data[M_UPDATEDATE]);
        if (undefined !== data[M_UPDATEDBY]) this.updateBy = data[M_UPDATEDBY];
    }

    isActive() {
        return ('Active' === this.status);
    }
}