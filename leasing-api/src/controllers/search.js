const { validationResult } = require('express-validator');
const debugLog = require('debug')('Search');
const mongodbHelper = require('../helpers/mongodb');
const { get } = require('../routes');

const CUSTOMER_COLLECTION = 'customers';
const PRODUCT_COLLECTION = 'products';
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

//Search by the city
const searchByCity = async (req, res, next) => {
  bodyValidate(req, res);

  const obj = req.query;
  const query = { city: obj.city };

  try {
    const checkCity = await mongodbHelper.getAggregate(
      CUSTOMER_COLLECTION,
      { city: obj.city },
      { _id: '$product', count: { $sum: 1 } }
    );

    debugLog('Customer City:', checkCity);

    const getPopularProduct = await mongodbHelper.findById(
      PRODUCT_COLLECTION,
      checkCity[0]._id
    );

    debugLog('Popular Product name:', getPopularProduct.name);

    const getPopularCompany = await mongodbHelper.findById(
      COMPANY_COLLECTION,
      getPopularProduct.company
    );

    debugLog('Popular company name:', getPopularCompany.name);

    res.status(200).json({
      error: false,
      popularProduct: getPopularProduct.name,
      popularCompany: getPopularCompany.name,
      message: 'Search Result',
    });
  } catch (error) {
    debugLog('Customer ERROR:', error.message);
    res.status(400).json({
      error: true,
      message: 'Error occured processing request',
    });
  }
};

//Search by the company
const searchByCompany = async (req, res, next) => {
  bodyValidate(req, res);

  const obj = req.query;
  const query = { city: obj.company };

  try {
    // get companies id
    const companyId = await mongodbHelper.findOne(COMPANY_COLLECTION, {
      name: obj.company,
    });

    debugLog('Log company details:', companyId);

    // get all products under this company
    const getAllProducts = await mongodbHelper.findMany(PRODUCT_COLLECTION, {
      company: companyId._id,
    });

    debugLog('Products particular to a company:', getAllProducts);

    const allProducts = getAllProducts.map((e) => {
      return e._id;
    });

    debugLog('all products:', allProducts);

    const popularCity = await mongodbHelper.findMany(CUSTOMER_COLLECTION, {
      product: { $in: allProducts },
    });

    debugLog('All customer :', popularCity);

    // get all city
    const getAllCities = popularCity.map((e) => {
      return e.city;
    });

    debugLog('All customer city:', getAllCities);

    const getCity = (arr) => {
      return arr
        .sort(
          (a, b) =>
            arr.filter((v) => v === a).length -
            arr.filter((v) => v === b).length
        )
        .pop();
    };

    res.status(200).json({
      error: false,
      highestSaleCity: getCity(getAllCities),
    });
  } catch (error) {
    debugLog('Search highest city ERROR:', error.message);
    res.status(400).json({
      error: true,
      message: 'Error occured processing request',
    });
  }
};

const getCustomerList = async (req, res, next) => {
  try {
    bodyValidate(req, res);

    const obj = req.body;
    const query = { city: obj.company };

    //   get all companies id
    const companyIds = await mongodbHelper.findMany(COMPANY_COLLECTION, {
      name: { $in: obj.company },
    });

    const getCompanyIds = companyIds.map((e) => e._id);

    //   get all products that match the ids
    const productIds = await mongodbHelper.findMany(PRODUCT_COLLECTION, {
      company: { $in: getCompanyIds },
    });

    const getProductIds = productIds.map((e) => e._id);

    const allCustomers = await mongodbHelper.findMany(CUSTOMER_COLLECTION, {
      product: { $in: getProductIds },
    });

    debugLog('All customer :', allCustomers);

    res.status(200).json({
      error: false,
      message: 'List of customers',
      customers: allCustomers,
    });
  } catch (error) {
    debugLog('Customer list ERROR:', error.message);
    res.status(400).json({
      error: true,
      message: 'Error occured processing request',
    });
  }
};

const getCompaniesAndProducts = async (req, res, next) => {
  try {
    bodyValidate(req, res);

    const obj = req.body;

    //   get all customers product id
    const users = await mongodbHelper.findMany(CUSTOMER_COLLECTION, {
      name: { $in: obj.customer },
    });

    const getuserProductIds = users.map((e) => e.product);

    //   get all products that match the ids
    const products = await mongodbHelper.findMany(PRODUCT_COLLECTION, {
      _id: { $in: getuserProductIds },
    });

    const getcompanyIds = products.map((e) => e.company);

    const allCompanys = await mongodbHelper.findMany(COMPANY_COLLECTION, {
      _id: { $in: getcompanyIds },
    });

    debugLog('All company :', allCompanys);

    res.status(200).json({
      error: false,
      message: 'List of customers',
      allProducts: products,
      companies: allCompanys,
    });
  } catch (error) {
    debugLog('Company and product list ERROR:', error.message);
    res.status(400).json({
      error: true,
      message: 'Error occured processing request',
    });
  }
};

module.exports = {
  searchByCity,
  searchByCompany,
  getCustomerList,
  getCompaniesAndProducts,
};
