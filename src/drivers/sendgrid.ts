import { InjectSendGrid, SendGridService } from "@ntegral/nestjs-sendgrid";
import { Injectable } from "@nestjs/common";
import { DefaultEmailParams } from "./interfaces/mailerDefaults";
import * as MAIL_DEFAULTS from "./interfaces/mailerDefaults";
import { JwtService } from "@nestjs/jwt";

enum SENDGRID_TEMPLATES {
    CONFIRM_EMAIL = "",
    PASSWORD_RESET_REQUEST = "",
    PASSWORD_RESET_CONFIRMATION = ""
}

const MAILER_DEFAULTS = { 
    from:{ email:MAIL_DEFAULTS.FROM.NO_REPLY},
}
@Injectable()
export class SGService {
  private TEMPLATES = new Map<MAIL_DEFAULTS.TEMPLATES, string>()

  constructor(
    @InjectSendGrid() private readonly sgclient: SendGridService,
    private jwtService: JwtService,
    ) {
      this.TEMPLATES.set(
          MAIL_DEFAULTS.TEMPLATES.CONFIRM_EMAIL, 
          SENDGRID_TEMPLATES.CONFIRM_EMAIL,
      );
  }

  async sendEmail(mailinfo: {
      name: string;
      username: string;
      email: string;
      action: MAIL_DEFAULTS.TEMPLATES,
      template?: string,
      data?: any, 
      ota?: string;
  }[]): Promise<void> {
        
        const email = {
          personalizations :[
            {
              to:[
                {
                  email: mailinfo[0].email,
                  name: mailinfo[0].name
                }
              ],
              //subject: "Hello, World!"
            }
          ],
          content: 
          [
            {
              type: "text/html", 
              value: mailinfo[0].action
            }
          ],
          from:
          {
            email: "paigezaleppa@gmail.com",
            name:"Inso API"
          },
          reply_to:
          {
            email:"paigezaleppa@gmail.com",
            name:"Inso API"
          },
          templateId: mailinfo[0].template,
          dynamicTemplateData: {
            user: mailinfo[0].data
          }
        };

        await this.sgclient.send(email).catch((error) => {
          console.log(error);
        });
  }

  private getTemplate(template: MAIL_DEFAULTS.TEMPLATES): string {
    const id = this.TEMPLATES.get(template);
    if (id) {
      return id;
    }
    throw new Error(`No existing template for: ${template}`);
  }

  async verifyEmail(user: any){
    
    this.sendEmail([
        {
          name: user.f_name,
          username: user.username,
          email: user.contact[0].email,
          action: MAIL_DEFAULTS.TEMPLATES.CONFIRM_EMAIL,
          template: process.env.CONFIRM_EMAIL_ID, // template id for email verification template
          data: user.data
        }
    ]);

    

    console.log(`Email verification sent!`);

    //return this.createVerificationToken(user);
  }

  // async createVerificationToken(user: any){
    
  //   const payload = { 'username': user.username, 'email': user.contact[0].email };
  //   // const token = this.jwtService.sign(payload)
  //   this.jwtService.sign(payload)
    

  //   var a = document.createElement('a');
  //   var link = document.createTextNode('This string is a link');
  //   a.appendChild(link);
  //   a.title = 'This is a link';
  //   a.href = 'http://localhost:3000'
  //   return a;

  //   // let text = 'http://localhost:3000/auth/' + token;
  //   // let result = text.link('http://localhost:3000/')
  // }

}