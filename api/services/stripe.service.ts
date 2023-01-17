import config from '../config';
import { Logger } from '../logger';
import Stripe from 'stripe';
import { AccountService } from './account.service';
import { UltraMSGService } from './ultraMSG.service';

export type PlanLimits = {
    name: string,
    textGeneratorLimit: number,
    audioTranscriptionLimit: number,
    imageGeneratorLimit: number
};

export const PLAN = {
    Basic: 300,
    Enterprise: 1000
}

export type Plan = { id: number, priceId: string, name: string };

export const BASIC_PLAN: Plan = { id: 300, priceId: config.stripe.basicPrice, name: 'Basic' };
export const ENTERPRISE_PLAN: Plan = { id: 1000, priceId: config.stripe.enterprisePrice, name: 'Enterprise' };

const plans: { [price: string]: PlanLimits } = {
    [BASIC_PLAN.id]: {
        name: BASIC_PLAN.name,
        textGeneratorLimit: 50000,
        imageGeneratorLimit: 100,
        audioTranscriptionLimit: 100
    },
    [ENTERPRISE_PLAN.id]: {
        name: ENTERPRISE_PLAN.name,
        textGeneratorLimit: 150000,
        imageGeneratorLimit: -1,
        audioTranscriptionLimit: -1
    }
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

    async createStripeLink(phone: string, plan: Plan) {
        const { url } = await this.stripe.paymentLinks.create({
            line_items: [{ price: plan.priceId, quantity: 1 }],
            after_completion: { type: 'redirect', redirect: { url: `${config.apiHost}/api` } },
            allow_promotion_codes: true,
            custom_text: {
                submit: { message: 'SUBMIT' },
            },
            phone_number_collection: { enabled: false },
            shipping_address_collection: { allowed_countries: [] },
            currency: 'usd',
            metadata: { phone, planName: plan.name }
        });

        return url;
    }
    webhookHandler = async (type: string, data: Stripe.Event.Data): Promise<void> => {
        const fullObject: Stripe.Event.Data.Object = data.object;
        const { metadata, id: paymentId, amount_total: price, customer_details: customer } = fullObject as any;
        // console.log(type, metadata, price);

        if (type === 'checkout.session.completed') {
            let phone = metadata.phone;
            if (customer.phone) {
                phone = `${customer.phone}@c.us`;
            }

            // TODO: Payment success
            await this.accountService.setPlan(
                paymentId,
                phone,
                metadata.planName,
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
