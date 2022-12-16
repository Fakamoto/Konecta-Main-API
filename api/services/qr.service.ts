import QRCode from 'qrcode';


export class QRService {
    async createQRCode(data: string): Promise<Buffer> {
        return QRCode.toBuffer(data, {
            type: 'png',
            errorCorrectionLevel: 'H',
        })
    }
}
