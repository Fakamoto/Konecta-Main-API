import { Router } from 'express';
import { MercadoPagoController } from '../controllers';
import { validateBodyParams } from '../middlewares';
import { WebhookMercadoPagoParams } from '../mappers';
import transactionMiddleware from '../middlewares/sequelizeTransactionMiddleware';

const mercadoPagoRouter = (mercadoPagoController: MercadoPagoController): Router => {
    const router = Router();

    // CRUD routes
    router.post('/webhook', validateBodyParams(WebhookMercadoPagoParams), transactionMiddleware(mercadoPagoController.webhookCallback));

    return router;
};

export { mercadoPagoRouter as MercadoPagoRouter };
