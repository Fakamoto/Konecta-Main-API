import { authenticator } from 'otplib';

export class TwoFAService {
    generateSecret = (): string => authenticator.generateSecret();
    generateKeyUri = (accountName: string, issuer: string, secret: string): string => authenticator.keyuri(accountName, issuer, secret)
    verifyToken = (token: string, secret: string): boolean => authenticator.verify({ token, secret })
}
