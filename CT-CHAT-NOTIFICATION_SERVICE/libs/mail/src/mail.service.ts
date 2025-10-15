import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) { }

    async sendOtp(email, otp) {
      await this.mailerService.sendMail({
        to: email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Welcome to Auth App! Confirm your Email',
        template: 'sample',// `.hbs` extension is appended automatically
        context: { 
          name: 'Test',
          otp,
        },
      });
    }

    async sendResetPasswordLink(email: string, link: string){
      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset password link',
        template: 'resetpassword',
        context: {
          url: link
        }
      })
    }
}
