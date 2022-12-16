import { CronJob } from 'cron';
import { Logger } from '../logger';

const LoggerInstance = new Logger('Cron');

export class ExampleCron {
    private cronJob: CronJob;

    constructor(
    ) {
        this.cronJob = new CronJob('0 */1 * * *', async () => {
            await this.cronExecution();
        });
    }

    start(): void {
        if (!this.cronJob.running) {
            this.cronJob.start();
        }
    }

    cronExecution = async (): Promise<void> => {
        try {
            LoggerInstance.debug('Example Cron Started.');

            LoggerInstance.debug('Example Cron Ended.');
        } catch (e) {
            LoggerInstance.error(`${ e }.`);
        }
    }
}
