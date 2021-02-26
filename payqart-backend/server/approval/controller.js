export const approveCredit = (req, res, next) => {
  // console.log(req.body);
  if (!req.body.totalCart) {
    return res.status(400).json({
      message: "Please make sure the totalCart value is included",
    });
  }

  if (!req.body.date) {
    return res.status(400).json({
      message: "Please make sure next salary date is included",
    });
  }

  if (req.body.existingLoan === true) {
    return res.status(400).json({
      message: "Please make sure existing loan status is specified",
    });
  }

  if (!req.body.salary) {
    return res.status(400).json({
      message: "Please make sure salary is included",
    });
  }

  const { totalCart, month } = req.body;
  const downPayment = (30 / 100) * +totalCart;
  const shoppingCredit = +totalCart - Math.ceil(downPayment);
  const intrest = Math.ceil((4 / 100) * shoppingCredit);
  const totalIntrest = intrest * +month;
  const monthlyRepayment = Math.ceil((shoppingCredit + totalIntrest) / month);

  return res.status(200).json({
    message: "Your shopping credit was approved",
    credit: shoppingCredit,
    downPayment,
    monthlyRepayment,
    month,
  });
};

export const updateDownPayment = (req, res, next) => {
  if (!req.body.deposit) {
    return res.status(400).json({
      message: "Please make sure a down payment is specified",
    });
  }

  const { totalCart, month, deposit } = req.body;
  const expectedDownPayment = (30 / 100) * +totalCart;
  const downPayment =
    +deposit > expectedDownPayment ? +deposit : expectedDownPayment;
  const shoppingCredit = +totalCart - Math.ceil(downPayment);
  const intrest = Math.ceil((4 / 100) * shoppingCredit);
  const totalIntrest = intrest * +month;
  const monthlyRepayment = Math.ceil((shoppingCredit + totalIntrest) / month);

  return res.status(200).json({
    message: "Your shopping credit was updated",
    credit: shoppingCredit,
    downPayment,
    monthlyRepayment,
    month,
  });
};
