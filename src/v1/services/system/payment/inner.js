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

module.exports.createPaymentSession = async (currency = "USD", amount) => {
  try {
    const response = await axios.post(
      "https://api.sandbox.checkout.com/payment-sessions",
      {
        amount: 1000,
        currency: "GBP",
        reference: "ORD-123A",
        display_name: "Online shop",
        billing: {
          address: {
            country: "GB",
          },
        },
        customer: {
          name: "Jia Tsang",
          email: "jia.tsang@example.com",
        },
        success_url: "https://example.com/payments/success",
        failure_url: "https://example.com/payments/failure",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.CHECKOUT_SECRET_KEY, // replace with your real test secret key
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
