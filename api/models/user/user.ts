import {
    AfterValidate,
    BeforeCreate,
    BeforeUpdate,
    Column,
    CreatedAt,
    DataType,
    DeletedAt,
    Is,
    Model,
    Table,
    UpdatedAt,
} from 'sequelize-typescript';
import { BadRequestError } from '../../helpers/errors';
import {
    emailValidation,
    lengthValidation,
    roleValidation,
    ValidationConstants,
} from '../../helpers/sequelizeModelValidation';
import HookOptions from '../../types/hookOptions';
import { hashPassword, validatePassword } from '../../helpers/passwordUtils';
import { ErrorCodes } from '../../helpers/errors/errorCodes';

@Table
export class User extends Model<User> {
    id!: number;

    @Column({
        type: DataType.STRING,
        validate: { isEmail: emailValidation, len: lengthValidation(1, ValidationConstants.MAX_STRING) },
    })
    email!: string;

    @Column({ validate: { len: lengthValidation(1, ValidationConstants.MAX_PASSWORD_LENGTH) } })
    password!: string;

    @Column({ validate: { len: lengthValidation(1, ValidationConstants.MAX_USER_NAME_LENGTH) } })
    firstName!: string;

    @Column({ validate: { len: lengthValidation(1, ValidationConstants.MAX_USER_NAME_LENGTH) } })
    lastName!: string;

    @Column({})
    secret2FA!: string;

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;

    @DeletedAt
    @Column
    deletedAt!: Date;

    @Is('Role', roleValidation)
    @Column
    role!: string;

    @AfterValidate
    static async uniquenessValidations(user: User): Promise<void> {
        if (user.changed('email')) await this.validateEmailUnique(user);
    }

    @BeforeCreate
    static async beforeCreateChanges(user: User): Promise<void> {
        validatePassword(user.password);
        user.password = await hashPassword(user.password);
    }

    @BeforeUpdate
    static async beforeUpdateChanges(user: User, options: HookOptions): Promise<void> {
        if (user.changed('password')) {
            validatePassword(user.password);
            user.password = await hashPassword(user.password);
        }
        options.validate = false;
    }

    private static validateEmailUnique = async (user: User): Promise<void> => {
        if (user.email != null) {
            const userCount: number = await User.count({ where: { email: user.email } });
            if (userCount > 0) {
                throw new BadRequestError(`A user already exist with email: ${user.email}`, ErrorCodes.EMAIL_ALREADY_IN_USE);
            }
        }
    };
}
