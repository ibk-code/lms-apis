const { log } = require('debug');
const jwt = require('jsonwebtoken');
const mongodbHelper = require('../helpers/mongodb');
const mongo = require('mongodb');

async function authenticateUser(req, res, next) {
  req.user = {};

  const authorization = req.headers['authorization'];

  if (!authorization) {
    return res
      .status(401)
      .json({ error: true, message: 'Invalid authorization', status: 401 });
  }
  try {
    const splittedAuth = authorization.split(' ');
    let token = splittedAuth.length > 1 ? splittedAuth[1] : authorization;

    const decodedToken = jwt.verify(token, process.env.JWT_KEY);

    const { userId, expiresIn } = decodedToken;

    if (Date.now() >= expiresIn * 1000) {
      res.status(401).json({
        error: true,
        status: 401,
        message: 'Token timed out. Login again',
      });
    }

    const user = await mongodbHelper.findById(
      'users',
      new mongo.ObjectId(userId)
    );

    if (user) {
      req.user = {
        userFirstName: user.firstName || user.fName,
        userLastName: user.lastName || user.sName,
        userImageURL: user.imageUrl || user.imgUrl,
      };
    } else {
      return res.status(401).json({
        error: true,
        message: 'Invalid authorization, email mismatch',
        status: 401,
      });
    }

    next();
  } catch (error) {
    return res
      .json({
        error: true,
        message: 'Invalid authorization',
        status: 401,
      })
      .status(401);
  }
}

module.exports = authenticateUser;
