const express = require('express');
const { body, query } = require('express-validator');
const controller = require('../controllers/product');

const router = express.Router();

router.post(
  '/product/create',
  [
    body('name').isString(),
    body('company').isString(),
    body('price').isString(),
  ],
  controller.addProduct
);
router.put(
  '/product/updateProduct',
  [body('productId').isMongoId()],
  controller.updateProduct
);
router.get('/product/products', controller.getAllProducts);
router.get(
  '/product/product',
  [query('productId').isMongoId()],
  controller.getProductById
);
router.delete(
  '/product/removeProduct',
  [body('productId').isMongoId()],
  controller.deleteProduct
);

module.exports = router;
