import { Column, CreatedAt, Model, Scopes, Table, UpdatedAt, } from 'sequelize-typescript';

@Scopes(() => ({
    ofInstance(instanceId: number) {
        return {
            where: {
                instanceId,
            },
        };
    },
}))

@Table
export class UserResetPasswordCode extends Model<UserResetPasswordCode> {
    id!: number;

    @Column
    code!: string;

    @Column
    email!: string;

    @Column
    expiresAt!: Date;

    @CreatedAt

    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;
}
