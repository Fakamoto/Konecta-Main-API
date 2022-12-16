import { Router } from 'express';
import { validateBodyParams, validateIdPathParam } from '../middlewares';
import { CreateUserParams, UpdateUserParams } from '../mappers';
import { UsersController } from '../controllers';
import transactionMiddleware from '../middlewares/sequelizeTransactionMiddleware';

const usersRouter = (usersController: UsersController): Router => {
    const router = Router();

    // CRUD routes
    router.post('/', validateBodyParams(CreateUserParams), transactionMiddleware(usersController.create));
    router.get('/:id', validateIdPathParam, transactionMiddleware(usersController.get));
    router.put('/:id', validateIdPathParam, validateBodyParams(UpdateUserParams), transactionMiddleware(usersController.update));
    router.delete('/:id', validateIdPathParam, transactionMiddleware(usersController.delete));

    return router;
};

export { usersRouter as UsersRouter };
