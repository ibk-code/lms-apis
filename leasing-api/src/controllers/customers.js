const { validationResult } = require('express-validator');
const debugLog = require('debug')('Customer');
const mongodbHelper = require('../helpers/mongodb');

const CUSTOMER_COLLECTION = 'customers';
const PRODUCT_COLLECTION = 'products';

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
const addCustomer = async (req, res, next) => {
  bodyValidate(req, res);

  const obj = req.body;
  const query = { name: obj.name };

  try {
    const checkCustomer = await mongodbHelper.findMany(
      CUSTOMER_COLLECTION,
      query
    );

    debugLog('Found customer:', checkCustomer);

    if (checkCustomer.length > 0) {
      return res.status(200).json({
        error: false,
        message: 'Customer already exist',
      });
    }

    const checkProduct = await mongodbHelper.findOne(PRODUCT_COLLECTION, {
      name: obj.product,
    });

    if (checkProduct === null) {
      return res.status(200).json({
        error: false,
        message: 'The product does not exist, Please choose valid product',
      });
    }

    const newCustomer = {
      name: obj.name,
      product: checkProduct._id,
      city: obj.city,
    };

    const customer = await mongodbHelper.insertOne(
      CUSTOMER_COLLECTION,
      newCustomer
    );

    const xCustomer = customer;

    res.status(201).json({
      error: false,
      message: 'Customer created',
      company: xCustomer,
    });
  } catch (error) {
    debugLog('Customer ERROR:', error.message);
    res.status(400).json({
      error: true,
      message: 'Error occured processing request',
    });
  }
};

//update Customer
const updateCustomer = async (req, res, next) => {
  const obj = req.body;

  bodyValidate(req, res);

  try {
    const checkCustomer = await mongodbHelper.findById(
      CUSTOMER_COLLECTION,
      obj.customerId
    );

    debugLog('Customer found:', checkCustomer);

    if (checkCustomer === null) {
      return res.status(200).json({
        error: false,
        message: 'Customer not found',
      });
    }

    const customerUpdate = await mongodbHelper.updateOne(
      CUSTOMER_COLLECTION,
      obj.customerId,
      {
        name: obj.name || checkCustomer.name,
        city: obj.city || checkCustomer.city,
      }
    );

    console.log(customerUpdate);

    return res.status(200).json({
      error: false,
      message: 'Customer updated successfully',
    });
  } catch (error) {
    debugLog('Product error:', error.message);
    res.status(400).json({
      error: true,
      message: 'Error occured processing request',
    });
  }
};

//Get all Customers
const getAllCustomers = async (req, res, next) => {
  try {
    const getAllCustomers = await mongodbHelper.findMany(
      CUSTOMER_COLLECTION,
      {}
    );

    res.status(200).json({
      error: false,
      message: 'All Customers',
      products: getAllCustomers,
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: 'Error processing request',
    });
  }
};

// get customer by id
const getCustomerById = async (req, res, next) => {
  bodyValidate(req, res);

  const obj = req.query;
  try {
    let customer;

    if (obj.customerId) {
      customer = await mongodbHelper.findById(
        CUSTOMER_COLLECTION,
        obj.customerId
      );
    }

    if (customer === null) {
      return res.status(200).json({
        error: false,
        message: 'Customer not found',
      });
    }

    res.status(200).json({
      error: false,
      message: 'Successful',
      customer,
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: 'Error processing request',
    });
  }
};

//delete a Customer
const deleteCustomer = async (req, res, next) => {
  bodyValidate(req, res);

  const obj = req.body;
  try {
    const removedCustomer = await mongodbHelper.deleteById(
      CUSTOMER_COLLECTION,
      obj.customerId
    );

    res.status(200).json({
      error: false,
      message: 'Customer is successfully removed',
    });
  } catch (error) {
    res.status(400).json({
      error: false,
      message: 'Error processing request',
    });
  }
};

module.exports = {
  addCustomer,
  getAllCustomers,
  getCustomerById,
  deleteCustomer,
  updateCustomer,
};
