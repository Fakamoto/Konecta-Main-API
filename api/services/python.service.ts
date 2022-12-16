import { spawn } from 'child_process';
import path from 'path';
import process from 'process';

const completion = path.join(process.cwd(), 'script', 'completion.py');

const completionsMap: {[waId: string]: string} = {};

export class PythonService {

    runScript(path: string, ...args: any[]): Promise<any> {
        return new Promise((resolve, reject) => {
            const pythonProcess = spawn('python', [path, ...args]);

            // Listen for data events from the Python script
            pythonProcess.stdout.on('data', (data: string) => {
                const resultStr = data.toString();
                const result = JSON.parse(resultStr);

                console.log('Data from Python script:', result);
                resolve(result);
            });

            // Listen for error events from the Python script
            pythonProcess.stderr.on('data', (data: string) => {
                console.error(`Error from Python script: ${data}`);
                reject(data);
            });
        });
    }

    async runConversionScript(text: string, waId: string): Promise<string> {
        const result = await this.runScript(completion, text, completionsMap[waId]);
        const { choices, id } = result;
        completionsMap[waId] = id || '';

        return choices[0].text.replace('\n\n', '');
    }
}
