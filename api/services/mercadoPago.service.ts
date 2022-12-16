import { PreferenceMercadoPagoParams, ResponseMercadoPagoParams, WebhookMercadoPagoParams } from '../mappers';
import { Logger } from '../logger';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const MercadoPago = require('mercadopago');

const LoggerInstance = new Logger('Express');

const NODE_ENV = process.env.NODE_ENV || 'development';
const accessToken = NODE_ENV === 'production' ? process.env.MP_ACCESS_TOKEN : process.env.MP_TEST_ACCESS_TOKEN;

export class MercadoPagoService {

    constructor() {
        MercadoPago.configure({
            access_token: accessToken
        });
    }

    // eslint-disable-next-line no-unused-vars
    public webhook = async (bodyParams: WebhookMercadoPagoParams): Promise<void> => {
        LoggerInstance.infoImportant('id: ' + bodyParams.id);
        LoggerInstance.infoImportant('type: ' + bodyParams.type);
        LoggerInstance.infoImportant('data.id: ' + bodyParams.data.id);
        // const payment = await this.getPayment(bodyParams.data.id);

        // if (bodyParams.type === 'payment' && payment.body.status === 'approved') {
            // const [ wa_id, postId ] = payment.body.external_reference.split('/');
            // const veterinary = await this.wordpressService.getWpPostMeta(parseInt(postId));
            // await this.sendNotificationPatient(wa_id, veterinary);
            // await this.sendNotificationVet(veterinary, wa_id, payment.body.external_reference);

            // return ;
        // }

        LoggerInstance.error('payment is uncompleted: ' + bodyParams.data.id);
        return;
    }

    public create = async (preference: PreferenceMercadoPagoParams): Promise<ResponseMercadoPagoParams> => {
        MercadoPago.configurations.setAccessToken(accessToken);

        return await MercadoPago.preferences.create(preference);
    }
}
