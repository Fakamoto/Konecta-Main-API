import { NextFunction, Request } from 'express';
import { MyResponse } from './myResponse';

type Middleware = (req: Request, res: MyResponse, next: NextFunction) => Promise<void>;

export default Middleware;
