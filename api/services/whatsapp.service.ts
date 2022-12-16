import axios from 'axios';
import { ResponseWhatsappMessageParams } from '../mappers';

const webhookToken = process.env.WHATSAPP_USER_ACCESS_TOKEN;
const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
const version = process.env.WHATSAPP_VERSION;

export class WhatsappService {

    public sendMessage = async (phoneNumber: string, message: string): Promise<ResponseWhatsappMessageParams> => {
        const response = await axios({
            method: 'POST', // Required, HTTP method, a string, e.g. POST, GET
            url: `https://graph.facebook.com/${ version }/${ phoneNumberId }/messages`,
            data: {
                'messaging_product': 'whatsapp',
                'to': phoneNumber.replace('+', ''),
                'type': 'text',
                'recipient_type': 'individual',
                'text': {
                    'body': message,
                }
            },
            headers: {
                'Authorization': `Bearer ${ webhookToken }`,
                'Content-Type': 'application/json'
            },
        });

        return response.data as ResponseWhatsappMessageParams;
    }

    public getVoiceAudio = async (audioId: string): Promise<ResponseWhatsappMessageParams> => {
        const response = await axios({
            method: 'POST', // Required, HTTP method, a string, e.g. POST, GET
            url: `https://graph.facebook.com/${ version }/${ phoneNumberId }/messages`,
            data: {},
            headers: {
                'Authorization': `Bearer ${ webhookToken }`,
                'Content-Type': 'application/json'
            },
        });

        return response.data as ResponseWhatsappMessageParams;
    }
}
