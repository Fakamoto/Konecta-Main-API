import { Column, CreatedAt, DeletedAt, Model, Table, UpdatedAt, } from 'sequelize-typescript';
import { lengthValidation, ValidationConstants } from '../../helpers/sequelizeModelValidation';

@Table
export class Veterinary extends Model<Veterinary> {
    id!: number;

    @Column({ validate: { len: lengthValidation(1, ValidationConstants.MAX_WP_USER_NAME_LENGTH) } })
    name!: string;

    @Column({ validate: { len: lengthValidation(1, ValidationConstants.MAX_WP_USER_NAME_LENGTH) } })
    lastName!: string;

    @Column({ validate: { len: lengthValidation(1, ValidationConstants.MAX_WP_COUNTRY_NAME_LENGTH) } })
    country!: string;

    @Column({ validate: { len: lengthValidation(1, ValidationConstants.MAX_WP_DESCRIPTION_LENGTH) } })
    description!: string;

    @Column({ validate: { len: lengthValidation(1, ValidationConstants.MAX_WP_PHONE_NUMBER_LENGTH) } })
    phoneNumber!: string;

    @Column({ validate: { len: lengthValidation(1, ValidationConstants.MAX_WP_EMAIL_LENGTH) } })
    email!: string;

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
