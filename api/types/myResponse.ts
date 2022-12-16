import { Response } from 'express/index';
import Params from '../mappers/params';
import { TimestampPagination } from './listOptions';
import { User } from '../models/user/user';

interface Locals {
    bodyParams: Params,
    queryParams: Params,
    id: number,
    timestampPagination: TimestampPagination,
    searchTerm: string,
    loggedUser: User,
    modelType: string,
}

export interface MyResponse extends Response {
    locals: Locals;
}
