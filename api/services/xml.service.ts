/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import xml2js from 'xml2js';

class XMLService {
    static builderXML = new xml2js.Builder({
        headless: true,
        renderOpts: { pretty: false },
    });

    static parserXML: xml2js.Parser = new xml2js.Parser({
        explicitArray: false,
        // attrNameProcessors: [(name) => (name.split(':').length > 1 ? name.split(':')[1] : name)],
        // tagNameProcessors: [((name) => name.split(':')[1])],
    });

    static parse(requestXML: string): any {
        return this.parserXML.parseStringPromise(requestXML);
    }

    static build(model: string): any {
        return this.builderXML.buildObject(model);
    }
}
