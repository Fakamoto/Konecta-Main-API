import { Router } from 'express';
import { RootController } from '../controllers';

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const multipart = require('connect-multiparty');
// const multipartMiddleware = multipart();

const rootRouter = (
    rootController: RootController,
    whatsappRouter: Router,
    ultraMSGRouter: Router,
): Router => {
    const router = Router();
    // Routes without user
    router.get('/', rootController.root);
    router.get('/status', rootController.root);

    // Routes without loggedUser
    router.use('/whatsapp', whatsappRouter);
    router.use('/ultramsg', ultraMSGRouter);
    // router.use('/mercado-pago', mercadoPagoRouter);

    return router;
};

export { rootRouter as RootRouter };
