import { Request, Response } from 'express';
import { OK } from 'http-status-codes';
import Stripe from 'stripe';
import { StripeService } from '../services/stripe.service';
import config from '../config';

export class RootController {
    constructor(private stripeService: StripeService) {
    }

    root = async (req: Request, res: Response): Promise<void> => {
        res.status(OK).json({ success: true });
    };

    stripeWebhook = async (req: Request, res: Response): Promise<void> => {
        const { data, type }: { type: string, data: Stripe.Event.Data } = req.body;
        await this.stripeService.webhookHandler(type, data);

        res.status(OK).json({ message: 'Konecta Main API' });
    };

    createStripeLink = async (req: Request, res: Response): Promise<void> => {
        res.status(OK).json({ url: undefined });
    };
}
