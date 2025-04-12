const { Invoice } = require("../../../models/user/invoice");
// const { ApiError } = require("../../../middleware/apiError");
// const httpStatus = require("http-status");
// const errors = require("../../../config/errors");

module.exports.createInvoice = async (user, amount, title) => {
  try {
    // if (!user.isPaymentVerified()) {
    //   const statusCode = httpStatus.FORBIDDEN;
    //   const message = errors.user.paymentUnverified;
    //   throw new ApiError(statusCode, message);
    // }

    const invoice = new Invoice({
      userId: user._id,
      currency: "USD",
      amount,
      title,
    });

    await invoice.save();

    // user.unverifyPayment();
    // await user.save();

    return invoice;
  } catch (err) {
    throw err;
  }
};

module.exports.getMyInvoices = async (user) => {
  try {
    return await Invoice.find({ userId: user._id }).sort({ _id: -1 });
  } catch (err) {
    throw err;
  }
};
