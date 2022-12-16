import sequelize from '../sequelize';

export default async () => {
    // We change the timeout which might make some test take a lot of time if there is an error.
    // But it makes debugging easier. It can be commented if a test never ends.
    jest.setTimeout(3000000);
    const models = Object.values(sequelize.models);
    await Promise.all(models.map(async (model) => {
        await model.destroy({ truncate: true, cascade: true, force: true });
    }));
};
