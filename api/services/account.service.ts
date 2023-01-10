import { DatabaseError } from '../helpers/errors';
import { Account } from '../models/account/account';
import { CreateAccountParams } from '../mappers/account/createAccountParams';
import { CreateAccountRequestParams } from '../mappers/account/createAccountRequestParams';
import {AccountRequests, AccountRequestType} from '../models/account/accountRequests';

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

    hasLimit = async (accountId: number, limit: number, type: AccountRequestType): Promise<boolean> => {
        const requests = await AccountRequests.findAll({ where: { accountId, type } });

        if (type === 'textGenerator') {
            const sum = requests.reduce((acc: number, request: AccountRequests) => acc + request.tokens, 0);
            return sum < limit;
        }

        return requests.length < limit;
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
