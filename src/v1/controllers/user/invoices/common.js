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
    const { amount, title, type, url } = req.body;

    const invoice = await invoicesService.createInvoice(
      user,
      amount,
      title,
      type,
      url
    );

    const paymentLink = await paymentService.createPaymentLink(
      user,
      invoice._id,
      title,
      amount
    );

    // Create the response object
    const response = {
      invoice: _.pick(invoice, clientSchema),
      paymentLink,
    };

    // Send the response back to the client
    res.status(httpStatus.CREATED).json(response);

    // await emailService.sendInvoiceForCustomer(
    //   user.display.language,
    //   user.email,
    //   user.name
    // );
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
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
    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.checkoutWebhook = (req, res) => {
  const event = req.body;

  console.log("Received webhook:", event);

  // ✅ Verify event type
  if (event.type === "payment_approved") {
    // Update database, mark order as paid, etc.
    console.log("Payment succeeded.");
  }

  // Respond with 2xx to acknowledge receipt
  res.status(200).send("Webhook received");
};
