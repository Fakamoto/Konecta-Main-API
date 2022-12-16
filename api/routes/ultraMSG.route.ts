import { Router } from 'express';
import {MercadoPagoController, UltraMSGController} from '../controllers';
import { validateBodyParams } from '../middlewares';
import { WebhookMercadoPagoParams } from '../mappers';
import transactionMiddleware from '../middlewares/sequelizeTransactionMiddleware';

const ultraMSGRouter = (ultraMSGController: UltraMSGController): Router => {
    const router = Router();

    // CRUD routes
    router.post('/webhook', transactionMiddleware(ultraMSGController.webhook));

    return router;
};

export { ultraMSGRouter as UltraMSGRouter };
