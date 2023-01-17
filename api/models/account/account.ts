import {
    Column,
    CreatedAt, Default,
    DeletedAt,
    Model,
    Table,
    Unique,
    UpdatedAt,
} from 'sequelize-typescript';

@Table
export class Account extends Model<Account> {
    id!: number;

    @Unique({ name: 'phone_unique', msg: 'Phone is unique' })
    @Column({})
    phone!: string;

    @Column({})
    planName!: string;

    @Column({})
    subscriptionId!: string;

    @Default(1500)
    @Column({})
    textGeneratorLimit!: number;

    @Default(5)
    @Column({})
    imageGeneratorLimit!: number;

    @Default(5)
    @Column({})
    audioTranscriptionLimit!: number;

    @Column
    purchaseDate!: Date;

    @Column
    paymentId!: string;

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
