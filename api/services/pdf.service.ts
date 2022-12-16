/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const puppeteer = require('puppeteer');

import moment from 'moment';
moment.locale('es');

import Handlebars from 'handlebars';
import { GenericInternalServerError } from '../helpers/errors';

const exampleHtml = fs.readFileSync('templates/pdf/example.template.html', 'utf8');

type PdfData = { [key: string]: string | number | any };

export class PdfService {

    async generateExamplePdf(): Promise<Buffer> {
        return await this.generatePdf(exampleHtml, { example: 'Dynamic Data' });
    }

    private async puppeteerInit() {
        const browser = await puppeteer.launch({
            headless: true,
            pipe: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-gpu',
                '--full-memory-crash-report',
                '--unlimited-storage',
                '--disable-dev-shm-usage',
            ],
            ignoreDefaultArgs: ['--disable-extensions'],
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
        // Emular impresion para que tome la bandera print del css
        page.setDefaultTimeout(30 * 60 * 1000);
        return { browser, page };
    }

    private compileHtml(template: string, data: PdfData): string {
        const compiledTemplate = Handlebars.compile(template);
        return compiledTemplate(data);
    }

    private async generatePdf(template: string, data: PdfData): Promise<Buffer> {
        // Load new Puppeteer
        const { browser, page } = await this.puppeteerInit();

        try {
            // Compile content
            const content = this.compileHtml(template, data);

            // Load PDF in puppeteer.
            await page.setContent(content);

            // Get PDF from browser
            const pdfResult = await page.pdf({ printBackground: true, preferCSSPageSize: true });

            // Close puppeteer.
            await browser.close();

            console.log(`Puppeteer - Browser closed!, RAM: ${JSON.stringify(process.memoryUsage())}`);
            return pdfResult;
        } catch (err) {
            console.log(`Puppeteer - Something went wrong. Trying to close browser.., RAM: ${JSON.stringify(process.memoryUsage())}`);
            await browser.close();

            throw new GenericInternalServerError(`Error on printing PDF, metadata: ${err}`);
        }
    }

    private async generatePng(template: string, data: PdfData): Promise<Buffer> {
        // Load new Puppeteer
        const { browser, page } = await this.puppeteerInit();

        try {
            // Compile content
            const content = this.compileHtml(template, data);

            // Load PDF in puppeteer.
            await page.setContent(content);

            // Get PNG from a screenshot of the browser
            const pngResult = await page.screenshot({ type: 'png' });

            // Close puppeteer.
            await browser.close();

            console.log(`Puppeteer - Browser closed!, RAM: ${JSON.stringify(process.memoryUsage())}`);
            return pngResult;
        } catch (err) {
            console.log(`Puppeteer - Something went wrong. Trying to close browser.., RAM: ${JSON.stringify(process.memoryUsage())}`);
            await browser.close();

            throw new GenericInternalServerError(`Error on printing unified png, metadata: ${err}`);
        }
    }
}
