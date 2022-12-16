import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import { MailOptions } from 'nodemailer/lib/smtp-transport';
import { compile as Compile } from 'handlebars';
import * as fs from 'fs';
import config from '../config';
import { User } from '../models/user/user';
import { PdfService } from './pdf.service';

const EMAIL_TEMPLATE_PATH = 'templates/mail/email.template.html';

export class EmailService {
    transporter: Mail;
    private readonly compiler: HandlebarsTemplateDelegate;

    constructor(private pdfService: PdfService) {
        const htmlTemplate: string = fs.readFileSync(EMAIL_TEMPLATE_PATH, 'utf-8');
        this.compiler = Compile(htmlTemplate);
        const { systemEmail, systemEmailPassword, systemEmailService } = config;
        this.transporter = nodemailer.createTransport({
            service: systemEmailService,
            secure: false,
            auth: {
                user: systemEmail,
                pass: systemEmailPassword,
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false,
            },
        });
    }

    sendExampleEmail(
        user: User
    ): void {
        this.send({
            firstName: user.firstName,
            lastName: user.lastName,
            message: 'Example email',
        }, user.email, 'Example Subject!');
    }

    async sendExampleEmailWithAttachments(user: User): Promise<void> {
        const examplePdf = await this.pdfService.generateExamplePdf();
        const pdfs = ['https://pdf.clapps.io/example.pdf'];

        const attachments: Mail.Attachment[] = [
            ...pdfs.map((url, index) => ({
                filename: `example_${index + 1}.pdf`,
                path: url
            })),
            {
                filename: 'example.pdf',
                content: examplePdf,
                contentType: 'application/pdf'
            }
        ]

        this.send(
            {
                firstName: user.firstName,
                lastName: user.lastName,
                message: 'Example email with attachments',
            },
            user.email,
            'Example Subject with attachments!',
            attachments
        );
    }

    private send(body: any, to: string, subject: string, attachments: Mail.Attachment[] = []): void {
        const { systemEmail } = config;
        const mailOptions: MailOptions = {
            from: {
                name: 'Pollux Finance',
                address: systemEmail,
            },
        };

        mailOptions.html = this.compiler(body);
        mailOptions.to = to;
        mailOptions.subject = subject;

        mailOptions.attachments = [
            {
                filename: 'logo.svg',
                path: 'https://s3.sa-east-1.amazonaws.com/asset.pollux.finance/pollux-Isologotipo.png',
                cid: 'pollux.finance'
            },
            ...attachments
        ];

        this.transporter.sendMail(mailOptions, (error, info) => {
            error ? console.log(error) : console.log(info);
        });
    }
}
