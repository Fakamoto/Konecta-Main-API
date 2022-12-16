import { CREATED, NO_CONTENT, OK } from 'http-status-codes';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';
import mockRequest from '../mocks/mockRequest';
import mockResponse from '../mocks/mockResponse';
import mockNextFunction from '../mocks/mockNextFunction';
import Factory from '../factories/factory';
import sortDTOs from '../helpers/sortDTOs';
import resetDB from '../helpers/resetDB';
import { User } from '../../api/models/user/user';
import { UsersController } from '../../api/controllers';
import { UserSerializer } from '../../api/serializers';
import { CreateUserParams, UpdateUserParams } from '../../api/mappers';
import { serializeAndSortUsers } from '../factories/userFactory';
import { Role } from '../../api/models/role/role';
import { UserDTO } from '../../api/serializers/user/user.serializer';
import { ForbiddenError } from '../../api/helpers/errors';

beforeEach(() => resetDB());

let req: any;
let res: any;
let next: any;

beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = mockNextFunction();
});

describe('list', () => {
    let loggedUser: User;
    let activeUsers: User[];
    let deleteUsers: User[];
    beforeEach(async (done) => {
        loggedUser = await Factory.create('User');
        deleteUsers = await Factory.createMany('User', 5, { deletedAt: '2020-08-13 12:50:11' });
        activeUsers = await Factory.createMany('User', 5);
        res.locals.loggedUser = loggedUser;
        await UsersController.listAll(req, res, next);
        done();
    });

    test('should respond with status OK', () => {
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(OK);
    });

    test('should respond with all user, active or inactive', () => {
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json.mock.calls[0][0].sort(sortDTOs)).toEqual(new UserSerializer().serializeList(activeUsers.concat(deleteUsers).concat([loggedUser])).sort(sortDTOs));
    });

    test('has the active boolean correctly when serialized', () => {
        const deletedIds: number[] = deleteUsers.map((user) => user.id);
        const usersReturned = res.json.mock.calls[0][0] as UserDTO[];
        usersReturned.forEach((user: UserDTO) => {
            if (deletedIds.includes(user.id)) expect(user.active).toEqual(false);
            else expect(user.active).toEqual(true);
        });
    });
});

describe('create', () => {
    let createUserParams: CreateUserParams;

    beforeEach(async (done) => {
        res.locals.loggedUser = await Factory.create('User');
        createUserParams = {
            firstName: 'First name!',
            lastName: 'Last name!',
            password: 'asdasd',
            email: 'jnicastro@clapps.xyz',
            role: Role.USER,
        };
        res.locals.bodyParams = createUserParams;
        await UsersController.create(req, res, next);
        done();
    });

    test('should create the user with the corresponding fields', async () => {
        const allUsers: User[] = await User.findAll({ where: { email: createUserParams.email } });
        expect(allUsers.length).toEqual(1);
        const newUser = allUsers[0];
        expect(newUser.firstName).toEqual(createUserParams.firstName);
        expect(newUser.lastName).toEqual(createUserParams.lastName);
        expect(newUser.email).toEqual(createUserParams.email);
        expect(newUser.role).toEqual(createUserParams.role);
        expect(await bcrypt.compare(createUserParams.password, newUser.password)).toBe(true);
    });

    test('should respond with status OK', async () => {
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(CREATED);
    });
});

describe('update', () => {
    let user: User;
    let otherUsers: User[];
    let otherInstanceUsers: User[];
    let updateUserParams: UpdateUserParams;

    describe('when updating the correct user', () => {
        beforeEach(async (done) => {
            user = await Factory.create('User', {
                goal: 'This is my goal!',
                education: null,
                allowWhatsApp: false,
                facebook: 'myoldfacebook.com',
            });
            otherUsers = await Factory.createMany('User', 5);
            otherInstanceUsers = await Factory.createMany('User', 5);
            updateUserParams = {
                firstName: 'asdasd',
                lastName: '234234',
                role: 'ADMIN',
            } as UpdateUserParams;
            res.locals.bodyParams = updateUserParams;
            res.locals.loggedUser = user;
            res.locals.id = user.id;
            await UsersController.update(req, res, next);
            done();
        });

        test('should not change any of the other users', async () => {
            const nonUpdatedUsers = await User.findAll({ where: { id: { [Op.not]: user.id } } });
            expect(serializeAndSortUsers(nonUpdatedUsers)).toEqual(serializeAndSortUsers(otherUsers.concat(otherInstanceUsers)));
        });

        test('should update the fields that were given', async () => {
            const updatedUser: User = await User.findOne({ where: { id: user.id } }) as User;
            expect(updatedUser.firstName).toEqual(updateUserParams.firstName);
            expect(updatedUser.lastName).toEqual(updateUserParams.lastName);
            expect(updatedUser.role).toEqual(updateUserParams.role);
        });
    });
});

describe('setActive', () => {
    let loggedUser: User;
    let userToActivate: User;
    const run = () => UsersController.setActive(req, res, next);
    const findUser = (userId: number) => User.findOne({ where: { id: userId } });

    beforeEach(async (done) => {
        loggedUser = await Factory.create('User');
        userToActivate = await Factory.create('User');

        res.locals.loggedUser = loggedUser;
        res.locals.id = userToActivate.id;
        done();
    });

    describe('when the user does not have the permissions', () => {
        beforeEach(async (done) => {
            loggedUser.role = Role.USER;
            await userToActivate.destroy();
            done();
        });

        test('should throw a FORBIDDEN error', async () => {
            await run();
            const error = next.mock.calls[0][0];
            expect(error).toBeInstanceOf(ForbiddenError);
        });

        test('should not set the user active', async () => {
            let user: User|null = await findUser(userToActivate.id);
            expect(user).toBeNull();
            await run().catch(() => {});
            user = await findUser(userToActivate.id);
            expect(user).toBeNull();
        });
    });

    describe('when the user is active', () => {
        test('should respond with status NO CONTENT', async () => {
            await run();
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(NO_CONTENT);
        });

        test('should leave the user active', async () => {
            let user: User|null = await findUser(userToActivate.id);
            expect(user).not.toBeNull();
            await run();
            user = await findUser(userToActivate.id);
            expect(user).not.toBeNull();
        });
    });

    describe('when the user is inactive', () => {
        beforeEach(async () => {
            loggedUser.role = Role.ADMIN;
            await userToActivate.destroy();
        });

        test('should respond with status NO CONTENT', async () => {
            await run();
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(NO_CONTENT);
        });

        test('should set user active', async () => {
            let user: User|null = await findUser(userToActivate.id);
            expect(user).toBeNull();
            await run();
            user = await findUser(userToActivate.id);
            expect(user).not.toBeNull();
        });
    });
});
