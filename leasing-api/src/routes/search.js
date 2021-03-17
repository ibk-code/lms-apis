const express = require('express');
const { body, query } = require('express-validator');
const controller = require('../controllers/search');

const router = express.Router();

router.get('/search/city', [query('city').isString()], controller.searchByCity);
router.get(
  '/search/company',
  [query('company').isString()],
  controller.searchByCompany
);
router.get(
  '/search/company/customers',
  [body('company').isArray()],
  controller.getCustomerList
);
router.get(
  '/search/customer/companies_product',
  [body('customer').isArray()],
  controller.getCompaniesAndProducts
);

module.exports = router;
