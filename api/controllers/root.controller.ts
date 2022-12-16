import { Request, Response } from 'express';
import { OK } from 'http-status-codes';

export class RootController {

    root = async (req: Request, res: Response): Promise<void> => {
        res.status(OK).json({ message: 'Konecta Main API' });
    };
}
