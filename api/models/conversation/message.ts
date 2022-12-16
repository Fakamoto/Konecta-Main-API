import { Column, CreatedAt, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class Message extends Model<Message> {
    @Column({ primaryKey: true, autoIncrement: true })
    id!: number;

    @Column({
        type: DataType.STRING,
    })
    from!: string;

    @Column({
        type: DataType.STRING,
    })
    message!: string;

    @CreatedAt
    @Column
    createdAt!: Date;
}
