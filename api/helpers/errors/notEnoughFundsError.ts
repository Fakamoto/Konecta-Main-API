export class NotEnoughFundsError extends Error {
    constructor(desiredAmount: string, availableAmount: string) {
        super(`Available funds: ${availableAmount}. Desired amount: ${desiredAmount}.`);
    }
}
