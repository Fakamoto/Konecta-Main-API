import {PythonService, WhatsappService} from '../services';
import { Logger } from '../logger';
import { MyResponse } from '../types/myResponse';
import { Request } from 'express';
import { WebhookWhatsappNotificationParams } from '../mappers';

const LoggerInstance = new Logger('Express');

export class WhatsappController {
    constructor(
        private whatsappService: WhatsappService,
        private pythonService: PythonService,
    ) {
    }

    status = async (req: Request, res: MyResponse): Promise<void> => {
        const verifyToken = process.env.WHATSAPP_WEBHOOK_TOKEN;

        // Parse params from the webhook verification request
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];

        // Check if a token and mode were sent
        if (mode && token) {
            // Check the mode and token sent are correct
            if (mode === 'subscribe' && token === verifyToken) {
                // Respond with 200 OK and challenge token from the request
                console.log('WEBHOOK_VERIFIED');
                res.status(200).send(challenge);
            } else {
                // Responds with '403 Forbidden' if verify tokens do not match
                res.sendStatus(403);
            }
        }
    };

    notification = async (req: Request, res: MyResponse): Promise<MyResponse> => {
        // Check the Incoming webhook message
        // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
        const whatsappNotification = res.locals.bodyParams as WebhookWhatsappNotificationParams;
        const { data, type } = whatsappNotification.getMessage();
        const fromPhoneNumber = whatsappNotification.getFrom();

        if (!data) {
            return res.status(200).send('EVENT_RECEIVED');
        }
        if (!fromPhoneNumber.length) {
            return res.status(200).send('EVENT_RECEIVED');
        }

        LoggerInstance.info(' **********************    WhatsApp   *************************** ');
        LoggerInstance.infoImportant('  message: ', JSON.stringify(data));
        LoggerInstance.infoImportant('  from: ', fromPhoneNumber);
        LoggerInstance.info(' ********************    End WhatsApp   ************************* ');

        let script = (data: any, waId: string) => this.pythonService.runConversionScript(data, waId);
        if (type === 'audio') script = () => Promise.resolve('Audio messages are not supported yet');

        const result = await script(data, fromPhoneNumber);

        await this.whatsappService.sendMessage(
            fromPhoneNumber,
            result,
        );

        return res.status(200).send('EVENT_RECEIVED');
    }
}
