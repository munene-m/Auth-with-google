const stripe = require("stripe")(process.env.STRIPE_KEY);
const CLIENT_DOMAIN = process.env.CLIENT_URL;

const createCheckout = async (req, res) => {
  try {
    const prices = await stripe.prices.list({
      lookup_keys: [req.body.lookup_key],
      expand: ["data.product"],
    });

    const session = await stripe.checkout.sessions.create({
      billing_address_collection: "auto",
      line_items: [
        {
          price: prices.data[0].id,
          // For metered billing, do not pass quantity
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${CLIENT_DOMAIN}/stripe-success`,
      cancel_url: `${CLIENT_DOMAIN}/stripe-cancel`,
    });

    res.redirect(303, session.url);
  } catch (err) {
    res.status(400).json(err);
  }
};

const createPortalSession = async (req, res) => {};

module.exports = { createCheckout };
