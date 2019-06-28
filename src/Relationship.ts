export class Relationship {

    public rfuid: string | undefined;
    public relType: string | undefined;

    constructor(relString?: string) {
        if (undefined != relString) {
            relString = relString.trim();
            let relRFUIdMatch = relString.match(/\(([^)]*)\)/g);
            if (relRFUIdMatch != null) {
                this.rfuid = relRFUIdMatch[0].substring(1, relRFUIdMatch[0].length - 1);
            }
            let relTypeMatch = relString.match(/^[^ ]*/g);
            if (null !== relTypeMatch) {
                this.relType = relTypeMatch[0];
            }
        }
    }

}