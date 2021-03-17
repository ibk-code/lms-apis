const express = require('express');
const { body, query } = require('express-validator');
const controller = require('../controllers/company');

const router = express.Router();

router.post(
  '/company/create',
  [body('name').isString()],
  controller.addCompany
);
router.put(
  '/company/updateCompany',
  [body('companyId').isMongoId(), body('name').isString()],
  controller.updateCompany
);
router.get('/company/companies', controller.getAllCompany);
router.get(
  '/company/company',
  [query('companyId').isMongoId()],
  controller.getCompanyById
);
router.delete(
  '/company/removeCompany',
  [body('companyId').isMongoId()],
  controller.deleteCompany
);

module.exports = router;
