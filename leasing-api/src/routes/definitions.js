const index = require('./index');
const users = require('./users');
const company = require('./company');
const product = require('./product');
const customer = require('./customer');
const search = require('./search');

const useRouter = (app) => {
  const routeDefinitions = [index, users, company, product, customer, search];

  for (let i = 0; i < routeDefinitions.length; i += 1) {
    const router = routeDefinitions[i];
    app.use('/api/v1', router);
  }
};

module.exports = useRouter;
