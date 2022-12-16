import { JwtService, MercadoPagoService } from '../services';
import { Logger } from '../logger';
import { Request } from 'express';
import { MyResponse } from '../types/myResponse';
import { WebhookMercadoPagoParams } from '../mappers';
import { WebhookDialogflowResponseParams } from '../mappers/dialogflow/webhookDialogflowResponseParams';

// eslint-disable-next-line no-unused-vars
const LoggerInstance = new Logger('Express');

export class MercadoPagoController {
    constructor(
        private mercadoPagoService: MercadoPagoService,
        private jwtService: JwtService
    ) {
    }

    webhookCallback = (req: Request, res: MyResponse): Promise<MyResponse | void> => {
        return this.mercadoPagoService.webhook(res.locals.bodyParams as WebhookMercadoPagoParams).then(
            (response: WebhookDialogflowResponseParams | void) => {
                return res.status(200).json(response);
            }
        )
    };
}
