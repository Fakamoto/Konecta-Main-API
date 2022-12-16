import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ modelName: 'wp_postmeta', timestamps: false })
export class WpPostmeta extends Model<WpPostmeta> {
    @Column({ type: DataType.BIGINT, primaryKey: true, field: 'meta_id', allowNull: false })
    metaId!: number;

    @Column({ type: DataType.BIGINT, field: 'post_id', allowNull: false })
    postId!: number;

    @Column({ type: DataType.CHAR, field: 'meta_key', allowNull: false })
    metaKey!: string;

    @Column({ type: DataType.CHAR, field: 'meta_value', allowNull: false })
    metaValue!: string;
}
