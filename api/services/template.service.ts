import { Logger } from '../logger';
import handlebars from 'handlebars';

// eslint-disable-next-line no-unused-vars
const LoggerInstance = new Logger('Express');

export class TemplateService {

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public apply(templateString: string, object: any): string {
        const template = handlebars.compile(templateString);
        const dst = template(object);
        return dst;
    }
}
