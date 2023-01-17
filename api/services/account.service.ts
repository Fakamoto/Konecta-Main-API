import { DatabaseError } from '../helpers/errors';
import { Account } from '../models/account/account';
import { CreateAccountParams } from '../mappers/account/createAccountParams';
import { CreateAccountRequestParams } from '../mappers/account/createAccountRequestParams';
import { AccountRequests, AccountRequestType } from '../models/account/accountRequests';
import moment from 'moment';
import { Op } from 'sequelize';
import { PlanLimits } from './stripe.service';

export class AccountService {
    create = async (createAccountParams: CreateAccountParams): Promise<Account> => {
        const accountParams = {
            phone: createAccountParams.phone
        };
        return Account.create(accountParams).catch((error: any) => {
            throw new DatabaseError(error);
        });
    };

    findByPhone = (phone: string): Promise<Account> => {
        return Account
            .findOne({ where: { phone } })
            .then((account: Account | null) => {
                return account;
            }).catch((error: any) => {
                throw new DatabaseError(error);
            });
    };

    hasLimit = async (accountId: number, phone: string, purchaseDate: Date, limit: number, type: AccountRequestType): Promise<boolean> => {
        if ( limit === -1) return true;
        const purchaseMoment = moment(purchaseDate);
        const daysPurchase = moment().diff(purchaseMoment, 'days');
        if (daysPurchase >= 35) {
            await this.setFree(phone);
        }

        const toDate = moment().toDate();
        const requests = await AccountRequests.findAll({ where: { accountId, type, createdAt: { [Op.gte]: purchaseDate, [Op.lte]: toDate } } });

        if (type === 'textGenerator') {
            const sum = requests.reduce((acc: number, request: AccountRequests) => acc + request.tokens, 0);
            return sum < limit;
        }

        return requests.length < limit;
    }

    setFree = async (paymentId: string): Promise<Account> => {
        const account: Account = await Account.findOne({ where: { paymentId } });
        if (!account) throw new Error('Account not found');

        account.textGeneratorLimit = 1500; // TODO: move this to variables
        account.audioTranscriptionLimit = 5; // TODO: move this to variables
        account.imageGeneratorLimit = 5; // TODO: move this to variables

        return account.save();
    }

    setPlan = async (
        paymentId: string,
        phone: string,
        planName: string,
        { textGeneratorLimit, audioTranscriptionLimit, imageGeneratorLimit }: PlanLimits
    ): Promise<Account> => {
        let account: Account = await Account.findOne({ where: { phone } });
        if (!account) {
            account = await this.create({ phone })
        }

        account.planName = planName;
        account.textGeneratorLimit = textGeneratorLimit;
        account.audioTranscriptionLimit = audioTranscriptionLimit;
        account.imageGeneratorLimit = imageGeneratorLimit;
        account.purchaseDate = moment().toDate();
        account.paymentId = paymentId;

        return account.save();
    }

    addTextGeneratorRequest= async (account: Account, accountRequest: CreateAccountRequestParams): Promise<AccountRequests> => {
        return AccountRequests.create({ accountId: account.id, type: 'textGenerator', ...accountRequest });
    };

    addImageGeneratorLimitRequest= async (account: Account, accountRequest: CreateAccountRequestParams): Promise<AccountRequests> => {
        return AccountRequests.create({ accountId: account.id, type: 'imageGenerator', ...accountRequest });
    };

    addAudioTranscriptionRequest= async (account: Account, accountRequest: CreateAccountRequestParams): Promise<AccountRequests> => {
        return AccountRequests.create({ accountId: account.id, type: 'audioTranscription', ...accountRequest });
    };
}
