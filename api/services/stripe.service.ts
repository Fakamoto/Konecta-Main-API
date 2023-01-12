import config from '../config';
import { Logger } from '../logger';
import Stripe from 'stripe';
import { AccountService } from './account.service';
import {UltraMSGService} from "./ultraMSG.service";

export type PlanLimits = { textGeneratorLimit: number, audioTranscriptionLimit: number, imageGeneratorLimit: number };

const plans: { [price: string]: PlanLimits } = {
    [300]: { textGeneratorLimit: 50000, imageGeneratorLimit: 100, audioTranscriptionLimit: 100 },
    [1000]: { textGeneratorLimit: 150000, imageGeneratorLimit: -1, audioTranscriptionLimit: -1 }
}

export class StripeService {

    private stripe: Stripe;

    private logger = new Logger('Express');

    constructor(
        private accountService: AccountService,
        private ultraMSGService: UltraMSGService
    ) {
        this.stripe = new Stripe(config.stripe.secret, { apiVersion: '2022-11-15' });
    }

    async createStripeLink(phone: string, price: string) {
        const { url } = await this.stripe.paymentLinks.create({
            line_items: [{ price, quantity: 1 }],
            after_completion: { type: 'redirect', redirect: { url: `${config.apiHost}/api` } },
            allow_promotion_codes: false,
            custom_text: {
                submit: { message: 'SUBMIT' },
            },
            phone_number_collection: { enabled: false },
            shipping_address_collection: { allowed_countries: [] },
            currency: 'usd',
            metadata: { phone }
        });

        return url;
    }
    webhookHandler = async (type: string, data: Stripe.Event.Data): Promise<void> => {
        const fullObject: Stripe.Event.Data.Object = data.object;
        const { metadata, id: paymentId, amount_total: price } = fullObject as any;
        // console.log(type, metadata, price);

        if (type === 'checkout.session.completed') {
            // TODO: Payment success
            await this.accountService.setPlan(
                paymentId,
                metadata.phone,
                plans[price],
            );
            this.logger.debug(`Payment success for ${metadata?.phone}`);

            await this.ultraMSGService.sendMessage(
                'Congratulations! You have successfully upgrade your plan to "Lite Subscription"! If you want to cancel your subscription, you can do it sending /cancel in this private conversation.',
                metadata.phone,
            );
        }

        if (type === 'charge.refunded') {
            // TODO: Payment success
            await this.accountService.setFree(
                paymentId,
            );
            this.logger.error(`Payment Refund for ${metadata?.phone}`);
        }
    }

}
