import {
    BelongsTo,
    Column,
    CreatedAt,
    DeletedAt, ForeignKey,
    Model,
    Table,
    UpdatedAt,
} from 'sequelize-typescript';

import { Account } from './account';

export type AccountRequestType = 'textGenerator' | 'imageGenerator' | 'audioTranscription';

@Table
export class AccountRequests extends Model<AccountRequests> {
    id!: number;

    @ForeignKey(() => Account)
    accountId!: number;

    @BelongsTo(() => Account)
    account!: Account;

    @Column({})
    type!: AccountRequestType;

    @Column({})
    tokens!: number;

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;

    @DeletedAt
    @Column
    deletedAt!: Date;
}
