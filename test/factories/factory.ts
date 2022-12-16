import setupUserFactory from './userFactory';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const FactoryGirl = require('factory-girl');

const { factory } = FactoryGirl;
factory.setAdapter(new FactoryGirl.SequelizeAdapter());
setupUserFactory(factory);

export default factory;
