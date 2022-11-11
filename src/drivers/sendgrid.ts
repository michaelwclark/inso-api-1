import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as MAIL_DEFAULTS from './interfaces/mailerDefaults';

export enum SENDGRID_TEMPLATES {
  CONFIRM_EMAIL = 'd-c5fd47a270b2408b97c4151785fc4bda',
  PASSWORD_RESET_REQUEST = 'd-998871a758e14c53a864d7ba1a4a7da1',
  PASSWORD_RESET_CONFIRMATION = 'd-39eddc4474e24f62bca941c80496e9b2',
}

const MAILER_DEFAULTS = {
  from: { email: MAIL_DEFAULTS.FROM.NO_REPLY },
};
@Injectable()
export class SGService {
  private TEMPLATES = new Map<MAIL_DEFAULTS.TEMPLATES, string>();

  constructor(@InjectSendGrid() private readonly sgclient: SendGridService) {
    this.TEMPLATES.set(
      MAIL_DEFAULTS.TEMPLATES.CONFIRM_EMAIL,
      SENDGRID_TEMPLATES.CONFIRM_EMAIL,
    );
  }

  async sendEmail(mailinfo: {
    name: string;
    username: string;
    contact: string;
    action: MAIL_DEFAULTS.TEMPLATES;
    template?: string;
    data?: any;
    ota?: string;
  }): Promise<void> {
    const email = {
      personalizations: [
        {
          to: [
            {
              email: mailinfo.contact,
              name: mailinfo.name,
            },
          ],
        },
      ],
      content: [
        {
          type: 'text/html',
          value: mailinfo.action,
        },
      ],
      from: {
        email: 'info@inso.ai',
        name: 'Inso',
      },
      reply_to: {
        email: 'info@inso.ai',
        name: 'Inso API',
      },
      templateId: mailinfo.template,
      dynamicTemplateData: mailinfo.data,
    };

    await this.sgclient.send(email).catch((error) => {
      if (error) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    });
  }

  async resetPassword(user: any) {
    this.sendEmail({
      name: user.name,
      username: user.username,
      contact: user.contact,
      action: MAIL_DEFAULTS.TEMPLATES.RESET_PASSWORD,
      template: SENDGRID_TEMPLATES.PASSWORD_RESET_REQUEST,
      data: user,
    });
  }

  async confirmPassword(user: any) {
    this.sendEmail({
      name: user.name,
      username: user.username,
      contact: user.contact,
      action: MAIL_DEFAULTS.TEMPLATES.CONFIRM_PASSWORD_RESET,
      template: SENDGRID_TEMPLATES.PASSWORD_RESET_CONFIRMATION,
      data: user,
    });
  }
}
