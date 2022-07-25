import { InjectSendGrid, SendGridService } from "@ntegral/nestjs-sendgrid";
import { Injectable } from "@nestjs/common";
import { DefaultEmailParams } from "./interfaces/mailerDefaults";
import * as MAIL_DEFAULTS from "./interfaces/mailerDefaults";

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

  constructor(@InjectSendGrid() private readonly sgclient: SendGridService) {
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
      ota?: string;
  }[]): Promise<void> {
        // TODO: Build the mail from mailinfo
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
          templateId: "d-c5fd47a270b2408b97c4151785fc4bda"
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

}