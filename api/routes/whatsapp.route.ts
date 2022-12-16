import { Router } from 'express';
import { WhatsappController } from '../controllers';
import transactionMiddleware from '../middlewares/sequelizeTransactionMiddleware';
import { validateBodyParams } from '../middlewares';
import { WebhookWhatsappNotificationParams } from '../mappers';

const whatsappRouter = (whatsappController: WhatsappController): Router => {
    const router = Router();

    // CRUD routes
    router.get('/webhook', transactionMiddleware(whatsappController.status));
    router.post('/webhook', validateBodyParams(WebhookWhatsappNotificationParams), transactionMiddleware(whatsappController.notification));

    return router;
};

export { whatsappRouter as WhatsappRouter };
