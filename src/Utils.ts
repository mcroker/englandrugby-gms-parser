import * as glob from 'glob-promise';
import * as fs from 'fs';

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

    public static findLatestGlob(globPattern: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            glob.promise(globPattern)
                .then((files: string[]) => {
                    if (files.length > 0) {
                        let latestMtime: Date | null = null;
                        let latestFile: string = '';
                        for (let file of files) {
                            const mtime = fs.statSync(file).mtime;
                            if (null === latestMtime || mtime.getTime() > latestMtime.getTime()) {
                                latestMtime = mtime;
                                latestFile = file;
                            }
                        }
                        resolve(latestFile);
                    } else {
                        reject(new Error('No files found'));
                    }
                })
                .catch((err: Error) => {
                    reject(err);
                });
        })
    }

}