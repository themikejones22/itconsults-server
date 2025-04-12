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
    const sessionResponse = await axios.post(
      "https://api.sandbox.checkout.com/payment-sessions",
      {
        amount: 6540,
        currency: "GBP",
        reference: "get started guide",
        shipping: {
          address: {
            address_line1: "Checkout.com",
            address_line2: "90 Tottenham Court Road",
            city: "London",
            state: "London",
            zip: "W1T 4TJ",
            country: "GB",
          },
        },
        billing: {
          address: {
            address_line1: "Checkout.com",
            address_line2: "90 Tottenham Court Road",
            city: "London",
            state: "London",
            zip: "W1T 4TJ",
            country: "GB",
          },
        },
        "3ds": {
          enabled: false,
          attempt_n3d: false,
          challenge_indicator: "no_preference",
          exemption: "low_value",
          allow_upgrade: true,
        },
        enabled_payment_methods: ["card"],
        success_url: "https://example.com/payments/success",
        failure_url: "https://example.com/payments/fail",
        metadata: {
          coupon_code: "20OFF",
          partner_id: 123989,
        },
        processing_channel_id: "pc_loilg3lb45ye5ehvxybkway3ku",
      }
    );

    return sessionResponse.data;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    throw error;
  }
};
