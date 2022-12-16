import { S3 } from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import config from '../config';
import { GenericInternalServerError } from '../helpers/errors';
import SendData = ManagedUpload.SendData;

export class S3Service {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
    s3 = new S3({
        credentials: { accessKeyId: config.s3Key, secretAccessKey: config.s3Secret },
        region: config.s3Region,
    });

    private uploadFileToS3 = (bucket:string, key:string, body:Buffer, type: string = 'pdf', options = {}) : Promise<SendData> => {
        return this.s3.upload({
            Bucket: bucket,
            Key: key,
            ContentType: type,
            Body: body,
            ...options,
        }).promise();
    };

    uploadFile = (fileName: string, file: Buffer, type: string, options = {}): Promise<SendData> => {
        return this.uploadFileToS3(
            config.s3Bucket,
            fileName,
            file,
            type,
            options
        ).catch((error: { message:string }) => {
            throw new GenericInternalServerError(error.message);
        });
    };
}
