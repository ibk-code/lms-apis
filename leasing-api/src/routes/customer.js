const express = require('express');
const { body, query } = require('express-validator');
const controller = require('../controllers/customers');

const router = express.Router();

router.post(
  '/customer/create',
  [
    body('name').isString(),
    body('product').isString(),
    body('city').isString(),
  ],
  controller.addCustomer
);
router.put(
  '/customer/updateCustomer',
  [body('customerId').isMongoId()],
  controller.updateCustomer
);
router.get('/customer/customers', controller.getAllCustomers);
router.get(
  '/customer/customer',
  [query('customerId').isMongoId()],
  controller.getCustomerById
);
router.delete(
  '/customer/removeCustomer',
  [body('customerId').isMongoId()],
  controller.deleteCustomer
);

module.exports = router;
