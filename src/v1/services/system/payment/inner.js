const axios = require("axios");

module.exports.getStripePublishableKey = () => {
  try {
    const publishableKey = process.env.CHECKOUT_PUBLISHABLE_KEY;
    if (!publishableKey) {
      throw new Error("No stripe publishable key on the server");
    }

    return publishableKey;
  } catch (err) {
    throw err;
  }
};

module.exports.createPaymentLink = async (
  customer,
  reference,
  description,
  amount
) => {
  try {
    const url = "https://api.sandbox.checkout.com/payment-links";

    const payload = {
      amount,
      currency: "USD",
      reference,
      description,
      customer: {
        email: customer.email,
        name: customer.name,
      },
      billing: {
        address: {
          country: "US",
        },
      },
      processing_channel_id: "pc_loilg3lb45ye5ehvxybkway3ku",
      success_url: "https://your-website.com/success",
      failure_url: "https://your-website.com/failure",
    };

    const headers = {
      Authorization: "Bearer " + process.env.CHECKOUT_SECRET_KEY,
      "Content-Type": "application/json",
    };

    const response = await axios.post(url, payload, { headers });
    paymentLink = response.data._links.redirect.href;
    return paymentLink;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    throw error;
  }
};
