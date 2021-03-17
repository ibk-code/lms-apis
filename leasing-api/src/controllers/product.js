const { validationResult } = require('express-validator');
const debugLog = require('debug')('products');
const mongodbHelper = require('../helpers/mongodb');

const PRODUCTS_COLLECTION = 'products';
const COMPANY_COLLECTION = 'companies';

const bodyValidate = (req, res) => {
  // 1. Validate the request coming in
  const result = validationResult(req);

  const hasErrors = !result.isEmpty();

  if (hasErrors) {
    //   debugLog('user body', req.body);
    // 2. Throw a 422 if the body is invalid
    return res.status(422).json({
      error: true,
      statusCode: 422,
      message: 'Invalid body request',
      errors: result.array({ onlyFirstError: true }),
    });
  }
};

//Create a new Product
const addProduct = async (req, res, next) => {
  bodyValidate(req, res);

  const obj = req.body;
  const query = { name: obj.name };

  try {
    const checkProduct = await mongodbHelper.findMany(
      PRODUCTS_COLLECTION,
      query
    );

    debugLog('Found products:', checkProduct);

    if (checkProduct.length > 0) {
      return res.status(200).json({
        error: false,
        message: 'Product already exist',
      });
    }

    const checkCompany = await mongodbHelper.findOne(COMPANY_COLLECTION, {
      name: obj.company,
    });

    if (checkCompany === null) {
      return res.status(200).json({
        error: false,
        message: 'The company does not exist, Please choose valid company',
      });
    }

    const newProduct = {
      name: obj.name,
      price: obj.price,
      company: checkCompany._id,
    };

    const product = await mongodbHelper.insertOne(
      PRODUCTS_COLLECTION,
      newProduct
    );

    const xProduct = product;

    res.status(201).json({
      error: false,
      message: 'Product created',
      company: xProduct,
    });
  } catch (error) {
    debugLog('Product error:', error.message);
    res.status(400).json({
      error: true,
      message: 'Error occured processing request',
    });
  }
};

//update Product
const updateProduct = async (req, res, next) => {
  const obj = req.body;

  bodyValidate(req, res);

  try {
    const checkProduct = await mongodbHelper.findById(
      PRODUCTS_COLLECTION,
      obj.productId
    );

    debugLog('Product found:', checkProduct);

    if (checkProduct === null) {
      return res.status(200).json({
        error: false,
        message: 'Product not found',
      });
    }

    const productUpdate = await mongodbHelper.updateOne(
      PRODUCTS_COLLECTION,
      obj.productId,
      {
        name: obj.name || checkProduct.name,
        price: obj.price || checkProduct.price,
      }
    );

    console.log(productUpdate);

    return res.status(200).json({
      error: false,
      message: 'Product updated successfully',
    });
  } catch (error) {
    debugLog('Product error:', error.message);
    res.status(400).json({
      error: true,
      message: 'Error occured processing request',
    });
  }
};

//Get all Products
const getAllProducts = async (req, res, next) => {
  try {
    const getAllProducts = await mongodbHelper.findMany(
      PRODUCTS_COLLECTION,
      {}
    );

    res.status(200).json({
      error: false,
      message: 'All Products',
      products: getAllProducts,
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: 'Error processing request',
    });
  }
};

// get products by id
const getProductById = async (req, res, next) => {
  bodyValidate(req, res);

  const obj = req.query;
  try {
    let product;

    if (obj.productId) {
      product = await mongodbHelper.findById(
        PRODUCTS_COLLECTION,
        obj.productId
      );
    }

    if (product === null) {
      return res.status(200).json({
        error: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      error: false,
      message: 'Successful',
      product,
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: 'Error processing request',
    });
  }
};

//delete a Product
const deleteProduct = async (req, res, next) => {
  bodyValidate(req, res);

  const obj = req.body;
  try {
    const removedProduct = await mongodbHelper.deleteById(
      PRODUCTS_COLLECTION,
      obj.productId
    );

    res.status(200).json({
      error: false,
      message: 'Product is successfully removed',
    });
  } catch (error) {
    res.status(400).json({
      error: false,
      message: 'Error processing request',
    });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
};
