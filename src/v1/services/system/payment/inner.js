const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  // apiVersion: "2022-08-01",
  apiVersion: "2019-10-17",
});

module.exports.getStripePublishableKey = () => {
  try {
    const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      throw new Error("No stripe publishable key on the server");
    }

    return publishableKey;
  } catch (err) {
    throw err;
  }
};

module.exports.createPaymentIntent = async (currency = "USD", amount) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency,
      amount: amount * 100,
      automatic_payment_methods: { enabled: true },
    });

    return paymentIntent.client_secret;
  } catch (err) {
    throw err;
  }
};
