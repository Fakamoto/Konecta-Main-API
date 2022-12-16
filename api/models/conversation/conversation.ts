import { Column, CreatedAt, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Message } from './message';
import { Session } from './session';

@Table
export class Conversation extends Model<Conversation> {
    @Column({ primaryKey: true, autoIncrement: true })
    id!: number;

    @HasMany(() => Message)
    @Column({ allowNull: false, unique: false })
    messages!: Message[];

    @ForeignKey(() => Session)
    @Column({ allowNull: false, unique: true })
    sessionId!: number;

    @CreatedAt
    @Column
    createdAt!: Date;
}
