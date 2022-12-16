import chalk from 'chalk';

type LoggerName = 'Express' | 'Socket' | 'Cron';
type DebuggerMode = 'info' | 'debug' | 'warn' | 'error';

type LoggerConfig = {
    title: LoggerName,
    headerChalk: chalk.Chalk,
    descriptionChalk: chalk.Chalk,
    active: boolean,
    activeMode: DebuggerMode,
};

export class Logger {
    instances = new Map<LoggerName, LoggerConfig>();

    private instanceConfig: LoggerConfig;
    private activeMode: { [mode: string]: boolean } = {}

    constructor(loggerName: LoggerName) {
        const DEBUGGER_ACTIVE = process.env.DEBUGGER === 'true';

        this.instances.set('Express', {
            title: 'Express',
            headerChalk: chalk.magentaBright,
            descriptionChalk: chalk.magenta,
            active: DEBUGGER_ACTIVE,
            activeMode: process.env.EXPRESS_MODE as DebuggerMode
        });

        this.instances.set('Socket', {
            title: 'Socket',
            headerChalk: chalk.magentaBright,
            descriptionChalk: chalk.magenta,
            active: DEBUGGER_ACTIVE,
            activeMode: process.env.SOCKET_MODE as DebuggerMode
        });

        this.instances.set('Cron', {
            title: 'Cron',
            headerChalk: chalk.gray,
            descriptionChalk: chalk.gray,
            active: DEBUGGER_ACTIVE,
            activeMode: process.env.CRON_MODE as DebuggerMode
        });

        this.instanceConfig = this.instances.get(loggerName)!;
    }

    getInstance(instanceName: LoggerName) {
        return this.instances.get(instanceName);
    }

    info(...args: any[]) {
        const { active, title, activeMode } = this.instanceConfig;
        const isGeneralModeActive = !this.isModeActive('info');
        const isSpecificModeActive = !this.isModeActive('info', activeMode);
        if (!active || (!isGeneralModeActive && !isSpecificModeActive)) return;

        console.log(
            chalk.gray(`[${title}]`),
            chalk.gray(...args)
        );
    }

    infoImportant(...args: any[]) {
        const { active, title, activeMode } = this.instanceConfig;
        const isGeneralModeActive = !this.isModeActive('info');
        const isSpecificModeActive = !this.isModeActive('info', activeMode);
        if (!active || (!isGeneralModeActive && !isSpecificModeActive)) return;

        console.log(
            chalk.blue(`[${title}]`),
            chalk.blue(...args)
        );
    }

    debug(...args: any[]) {
        const { active, title, headerChalk, descriptionChalk, activeMode } = this.instanceConfig;
        const isGeneralModeActive = !this.isModeActive('debug');
        const isSpecificModeActive = !this.isModeActive('debug', activeMode);
        if (!active || (!isGeneralModeActive && !isSpecificModeActive)) return;

        console.log(
            headerChalk(`[${title}]`),
            descriptionChalk(...args),
        );
    }

    warn(...args: any[]) {
        const { active, title, activeMode } = this.instanceConfig;
        const isGeneralModeActive = !this.isModeActive('warn');
        const isSpecificModeActive = !this.isModeActive('warn', activeMode);
        if (!active || (!isGeneralModeActive && !isSpecificModeActive)) return;

        console.error(
            chalk.yellowBright(`[${title}]`),
            chalk.yellow(...args)
        );
    }

    error(...args: any[]) {
        const { title } = this.instanceConfig;
        console.error(
            chalk.redBright(`[${title}]`),
            chalk.red(...args),
        );
    }

    private isModeActive(mode: DebuggerMode, active: DebuggerMode = process.env.DEBUG_MODE as DebuggerMode) {
        const activeMode: {[key: string]: boolean} = {};
        switch (mode) {
            case 'info': activeMode.info = true;
            case 'debug': activeMode.debug = true;
            case 'warn': activeMode.warn = true;
            case 'error': activeMode.error = true;
        }

        return activeMode[active];
    }

}
