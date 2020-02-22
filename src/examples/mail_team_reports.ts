import { ClubGMS } from '..';
import { TWRFCAgeGrades } from './TWRFCUtils';
import * as nodemailer from 'nodemailer';
import { TWRFCUtils } from './TWRFCUtils';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mcroker@gmail.com',
    pass: process.env.GMAIL_PASSWORD
  }
});

function send(mailOptions: any): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log('Email sent: ' + info.response);
        resolve(info);
      }
    });
  });
}

function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

var env = TWRFCUtils.getNunjucks();



(async () => {
  const club: ClubGMS = await ClubGMS.createFromDirectory();
  const errorData = TWRFCUtils.parseDataErrors(club);
  const errors: { [rfuid: string]: string } = {};
  errorData.forEach((value: string[], rfuid: string) => { errors[rfuid] = value.join(';'); });

  let ageGrades: string[] = [];

  if (undefined !== process.argv[2]) {
    const gradeIndex = Object.keys(TWRFCAgeGrades).indexOf(process.argv[2]);
    if (-1 == gradeIndex) {
      throw ('Specified age grade not found - try under12');
    } else {
      ageGrades.push(Object.values(TWRFCAgeGrades)[gradeIndex]);
    }
  } else {
    ageGrades = Object.values(TWRFCAgeGrades);
  }

  for (const grade of ageGrades) {
    const tolist = TWRFCUtils.getCoachEmails([grade]);
    if (undefined !== tolist && tolist !== '') {
      const team = club.getTeam(grade);
      if (undefined !== team) {
        const mailOptions = {
          from: 'membership@twrfc.com',
          to: tolist,
          subject: 'TWRFC Membership Report - ' + grade,
          html: env.render('team_report_html.njk', { team: team, comments: errors })
        }
        await send(mailOptions);
        await sleep(1000);
      } else {
        console.error('Team ' + grade + ' not found.');
      }
    }
  }
})();