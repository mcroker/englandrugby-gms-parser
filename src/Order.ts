import { Utils } from './Utils';
import * as csv from 'fast-csv';
import * as fs from 'fs';

export declare interface OrderCSVData { [name: string]: string; };

/**
 * Enumeration of QualifcationTypes
 * @public
 */
export enum OrderStatus {
    pending = 'Pending',
    inprogress = 'In Progress',
    paid = 'Paid',
    deleted = 'Deleted',
    cancelled = 'Cancelled',
    unknown = ''
}

export enum PaymentMethod {
    dd = 'Direct Debit',
    card = 'Card Payment',
    free = 'Free',
    other = 'Other',
    unknown = ''
}

export const O_ORDERREFERENCE = 'Order Reference';
export const O_ORDERDATE = 'Order Date';
export const O_ORDERTOTAL = 'Order Total';
export const O_AMOUNTDUE = 'Amount Due';
export const O_PAYMENTDUE = 'Payment Due';
export const O_BALANCE = 'Balance';
export const O_STATUS = 'Status';
export const O_FIRSTNAME = 'Purchaser First Name';
export const O_LASTNAME = 'Purchaser Last Name';
export const O_PAYMENTMETHOD = 'Payment Method';
export const O_INVOICE = 'Invoice';
export const O_VENDORTOTAL = 'Vendor Total';
export const O_CREATOR = 'Creator';
export const O_DATEUPDATE = 'Date Updated';

/**
 * Qualifcation Class - one of these is created for each qualifcation somebody holds
 * @beta
 */
export class Order {

    csvdata: OrderCSVData | undefined;
    orderReference: string
    orderDate: Date | undefined
    orderTotal: number
    amountDue: number
    paymentDueDate: Date | undefined
    balance: number
    status: OrderStatus
    purchaserFirstName: string
    purchaserLastName: string
    paymentMethod: PaymentMethod
    invoice: string
    vendorTotal: string
    creatorText: string
    dateUpdated: Date | undefined

    /**
     * Reads GMS People CSV export into People object structure
     * 
     * @param file - Filename of people CSV export
     * 
     * @returns Array of Person objects contained in CSV export
     */
    static readGMSFile(file: string): Promise<Order[]> {
        return new Promise<Order[]>((resolve, reject) => {
            let orders: Order[] = [];
            var orderstream = fs.createReadStream(file);
            csv
                .fromStream(orderstream, { headers: true })
                .on("data", function (data) {
                    orders.push(new Order(data));
                })
                .on("end", function () {
                    resolve(orders)
                })
        })
    }

    static getOrderStatus(statusString: string): OrderStatus {
        if (Object.values(OrderStatus).includes(statusString)) {
            return statusString as OrderStatus;
        } else {
            console.log('WARNING: Order Status ' + statusString + ' not recognised.');
            return OrderStatus.unknown;
        }
    }

    static getPaymentMethod(methodString: string): PaymentMethod {
        if (Object.values(PaymentMethod).includes(methodString)) {
            return methodString as PaymentMethod;
        } else {
            console.log('WARNING: Payment Method ' + methodString + ' not recognised.');
            return PaymentMethod.unknown;
        }
    }

    public constructor(data?: OrderCSVData) {
        if (undefined !== data) {
            this.importOrderCSV(data)
        }
    }

    public importOrderCSV(data: OrderCSVData) {
        this.csvdata = data;
        if (undefined !== data[O_ORDERREFERENCE]) this.orderReference = data[O_ORDERREFERENCE];
        if (undefined !== data[O_ORDERDATE]) this.orderDate = Utils.dateFromUKString(data[O_ORDERDATE]);
        if (undefined !== data[O_ORDERTOTAL]) this.orderTotal = parseFloat(data[O_ORDERTOTAL]);
        if (undefined !== data[O_AMOUNTDUE]) this.amountDue = parseFloat(data[O_AMOUNTDUE]);
        if (undefined !== data[O_PAYMENTDUE]) this.paymentDueDate = Utils.dateFromUKString(data[O_PAYMENTDUE]);
        if (undefined !== data[O_BALANCE]) this.balance = parseFloat(data[O_BALANCE]);
        if (undefined !== data[O_STATUS]) this.status = Order.getOrderStatus(data[O_STATUS]);
        if (undefined !== data[O_FIRSTNAME]) this.purchaserFirstName = data[O_FIRSTNAME];
        if (undefined !== data[O_LASTNAME]) this.purchaserLastName = data[O_LASTNAME];
        if (undefined !== data[O_PAYMENTMETHOD]) this.paymentMethod = Order.getPaymentMethod(data[O_PAYMENTMETHOD]);
        if (undefined !== data[O_INVOICE]) this.invoice = data[O_INVOICE];
        if (undefined !== data[O_VENDORTOTAL]) this.vendorTotal = data[O_VENDORTOTAL];
        if (undefined !== data[O_CREATOR]) this.creatorText = data[O_CREATOR];
        if (undefined !== data[O_DATEUPDATE]) this.dateUpdated = Utils.dateFromUKString(data[O_DATEUPDATE]);
    }

}