"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateDownPayment = exports.approveCredit = void 0;

var approveCredit = function approveCredit(req, res, next) {
  // console.log(req.body);
  if (!req.body.totalCart) {
    return res.status(400).json({
      message: "Please make sure the totalCart value is included"
    });
  }

  if (!req.body.date) {
    return res.status(400).json({
      message: "Please make sure next salary date is included"
    });
  }

  if (req.body.existingLoan === true) {
    return res.status(400).json({
      message: "Please make sure existing loan status is specified"
    });
  }

  if (!req.body.salary) {
    return res.status(400).json({
      message: "Please make sure salary is included"
    });
  }

  var _req$body = req.body,
      totalCart = _req$body.totalCart,
      month = _req$body.month;
  var downPayment = 30 / 100 * +totalCart;
  var shoppingCredit = +totalCart - Math.ceil(downPayment);
  var intrest = Math.ceil(4 / 100 * shoppingCredit);
  var totalIntrest = intrest * +month;
  var monthlyRepayment = Math.ceil((shoppingCredit + totalIntrest) / month);
  return res.status(200).json({
    message: "Your shopping credit was approved",
    credit: shoppingCredit,
    downPayment: downPayment,
    monthlyRepayment: monthlyRepayment,
    month: month
  });
};

exports.approveCredit = approveCredit;

var updateDownPayment = function updateDownPayment(req, res, next) {
  if (!req.body.deposit) {
    return res.status(400).json({
      message: "Please make sure a down payment is specified"
    });
  }

  var _req$body2 = req.body,
      totalCart = _req$body2.totalCart,
      month = _req$body2.month,
      deposit = _req$body2.deposit;
  var expectedDownPayment = 30 / 100 * +totalCart;
  var downPayment = +deposit > expectedDownPayment ? +deposit : expectedDownPayment;
  var shoppingCredit = +totalCart - Math.ceil(downPayment);
  var intrest = Math.ceil(4 / 100 * shoppingCredit);
  var totalIntrest = intrest * +month;
  var monthlyRepayment = Math.ceil((shoppingCredit + totalIntrest) / month);
  return res.status(200).json({
    message: "Your shopping credit was updated",
    credit: shoppingCredit,
    downPayment: downPayment,
    monthlyRepayment: monthlyRepayment,
    month: month
  });
};

exports.updateDownPayment = updateDownPayment;