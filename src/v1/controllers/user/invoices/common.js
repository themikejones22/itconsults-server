const {
  invoicesService,
  paymentService,
  emailService,
} = require("../../../services");
const httpStatus = require("http-status");
const { clientSchema } = require("../../../models/user/invoice");
const _ = require("lodash");

module.exports.createInvoice = async (req, res, next) => {
  try {
    const user = req.user;
    const { amount, title } = req.body;

    const invoice = await invoicesService.createInvoice(user, amount, title);

    const clientSecret = await paymentService.createPaymentIntent(
      invoice.currency,
      invoice.amount
    );

    // Create the response object
    const response = {
      invoice: _.pick(invoice, clientSchema),
      clientSecret,
    };

    // Send the response back to the client
    res.status(httpStatus.CREATED).json(response);

    await emailService.sendInvoiceForCustomer(
      user.display.language,
      user.email,
      user.name
    );
  } catch (err) {
    next(err);
  }
};

module.exports.getMyInvoices = async (req, res, next) => {
  try {
    const user = req.user;

    const invoices = await invoicesService.getMyInvoices(user);

    // Create the response object
    const response = {
      invoices: invoices.map((invoice) => _.pick(invoice, clientSchema)),
    };

    // Send the response back to the client
    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};
