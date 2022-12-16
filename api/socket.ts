import { Server, Socket } from 'socket.io';
import { Logger } from './logger';
import Config from './config';
import JwtToken from './types/jwtToken';
import Dict = NodeJS.Dict;

const DASHBOARD_ROOM = 'dashboard';

interface IDataMessage {
    message: string;
}

const LoggerInstance = new Logger('Socket');

export default class SocketApp {
    private _io: Server | undefined;
    private _sockets: Dict<Socket> = {};

    constructor(
    ) {
        this._sockets = {};
    }

    public getToken =
        (socket: Socket): [ (string | string[] | undefined), (JwtToken | undefined) ] =>
            [ socket.handshake.query.token, undefined ];

    public getUUID =
        (socket: Socket): string | string[] | undefined =>
            socket.handshake.query.uuid;

    public getSocketId(socket: Socket): string {
        const [ , decodedToken ] = this.getToken(socket);
        LoggerInstance.info('uuid: ', this.getUUID(socket));
        return <string>(decodedToken ? <unknown>decodedToken?.id : this.getUUID(socket));
    }

    public start(): void {
        this._io = new Server(Number(Config.socketPort), {
            cors: {
                origin: '*',
                methods: [ 'GET', 'POST' ],
            },
        });
        LoggerInstance.debug(`Started on http://localhost:${ Config.socketPort }`);

        this._io.on('connection', async (socket: Socket): Promise<void> => {
            const socketId = this.getSocketId(socket);
            await socket.join(DASHBOARD_ROOM);
            LoggerInstance.debug(`Success socket Join Room ${ DASHBOARD_ROOM } with socketId: ${ socketId }`);
            this._sockets[socketId] = socket;
            socket.emit('connection');
        });
    }
}
