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

    @Default(5)
    @Column({})
    textGeneratorLimit!: number;

    @Default(5)
    @Column({})
    imageGeneratorLimit!: number;

    @Default(5)
    @Column({})
    audioTranscriptionLimit!: number;

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
