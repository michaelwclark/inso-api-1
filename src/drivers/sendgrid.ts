import { InjectSendGrid, SendGridService } from "@ntegral/nestjs-sendgrid";
import { Injectable } from "@nestjs/common";
import * as MAIL_DEFAULTS from "./interfaces/mailerDefaults";

enum SENDGRID_TEMPLATES {
    CONFIRM_EMAIL = "d-c5fd47a270b2408b97c4151785fc4bda", // id for email verification template from send grid
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
    @InjectSendGrid() private readonly sgclient: SendGridService
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
  }): Promise<void> {
        
    const email = {
      personalizations :[
        {
          to:[
            {
              email: mailinfo.email,
              name: mailinfo.name
            }
          ],
          //subject: "Hello, World!"   // gets overridden
        }
      ],
      content:[
        {
          type: "text/html", 
          value: mailinfo.action
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
      templateId: mailinfo.template,
      dynamicTemplateData: mailinfo.data
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
    
    this.sendEmail(
      {
        name: user.f_name,
        username: user.username,
        email: user.contact.email,
        action: MAIL_DEFAULTS.TEMPLATES.CONFIRM_EMAIL,
        template: SENDGRID_TEMPLATES.CONFIRM_EMAIL,
        data: user
      }
    );

    

    console.log(`Email verification sent!`);

  }
}