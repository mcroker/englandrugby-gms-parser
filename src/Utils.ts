export class Utils {

    public static dateFromUKString(dateString: string): Date | undefined {
        dateString = new String(dateString).trim();
        let p = dateString.split('/');
        let year = p[2];
        let month = p[1];
        let day = p[0];
        if (undefined !== year && undefined !== month && undefined !== day) {
            let date = new Date(p[2] + '-' + p[1] + '-' + p[0]);
            if (0 !== date.getTime()) {
                return date;
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    }

}