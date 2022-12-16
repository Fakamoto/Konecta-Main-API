import { Column, CreatedAt, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class Session extends Model<Session> {
    @Column({ primaryKey: true, autoIncrement: true })
    id!: number;

    @Column({
        type: DataType.STRING,
    })
    session!: string;

    @Column({
        type: DataType.STRING,
    })
    sessionKey!: string;

    @CreatedAt
    @Column
    createdAt!: Date;
}
