const { validationResult } = require('express-validator');
const debugLog = require('debug')('company');
const mongodbHelper = require('../helpers/mongodb');

const COLLECTION_COMPANIES = 'companies';

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

//Create a new company
const addCompany = async (req, res, next) => {
  bodyValidate(req, res);

  const obj = req.body;
  const query = { name: obj.name };

  try {
    const checkCompany = await mongodbHelper.findMany(
      COLLECTION_COMPANIES,
      query
    );

    debugLog('Found company:', checkCompany);

    if (checkCompany.length > 0) {
      return res.status(200).json({
        error: false,
        message: 'User already exist',
      });
    }

    const newCompany = {
      name: obj.name,
      status: 'active',
    };

    const company = await mongodbHelper.insertOne(
      COLLECTION_COMPANIES,
      newCompany
    );

    const xCompany = company;

    res.status(201).json({
      error: false,
      message: 'company created',
      company: xCompany,
    });
  } catch (error) {
    debugLog('Company error:', error.message);
    res.status(400).json({
      error: true,
      message: 'Error occured processing request',
    });
  }
};

//update company profile
const updateCompany = async (req, res, next) => {
  const obj = req.body;

  bodyValidate(req, res);

  try {
    const checkCompany = await mongodbHelper.findById(
      COLLECTION_COMPANIES,
      obj.companyId
    );

    debugLog('Company found:', checkCompany);

    if (checkCompany === null) {
      return res.status(200).json({
        error: false,
        message: 'Company not found',
      });
    }

    const updateCompany = await mongodbHelper.updateOne(
      COLLECTION_COMPANIES,
      obj.companyId,
      { name: obj.name }
    );

    return res.status(200).json({
      error: false,
      message: 'Company updated successfully',
      company: obj.name,
    });
  } catch (error) {
    debugLog('Company error:', error.message);
    res.status(400).json({
      error: true,
      message: 'Error occured processing request',
    });
  }
};

//Get all registered company
const getAllCompany = async (req, res, next) => {
  try {
    const getAllCompanies = await mongodbHelper.findMany(
      COLLECTION_COMPANIES,
      {}
    );

    res.status(200).json({
      error: false,
      message: 'All companies',
      companies: getAllCompanies,
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: 'Error processing request',
    });
  }
};

const getCompanyById = async (req, res, next) => {
  bodyValidate(req, res);

  const obj = req.query;
  try {
    let company;

    if (obj.companyId) {
      company = await mongodbHelper.findById(
        COLLECTION_COMPANIES,
        obj.companyId
      );
    }

    if (company === null) {
      return res.status(200).json({
        error: false,
        message: 'Company not found',
      });
    }

    res.status(200).json({
      error: false,
      message: 'Successful',
      company,
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: 'Error processing request',
    });
  }
};

//delete a company
const deleteCompany = async (req, res, next) => {
  bodyValidate(req, res);

  const obj = req.body;
  try {
    const removedCompany = await mongodbHelper.deleteById(
      COLLECTION_COMPANIES,
      obj.companyId
    );

    res.status(200).json({
      error: false,
      message: 'Company is successfully removed',
    });
  } catch (error) {
    res.status(400).json({
      error: false,
      message: 'Error processing request',
    });
  }
};

module.exports = {
  addCompany,
  getAllCompany,
  getCompanyById,
  deleteCompany,
  updateCompany,
};
