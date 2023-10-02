const dotenv = require("dotenv");
dotenv.config();
const BuyCoin = require("../model/buyCoin");
const USER = require("../model/user");
const stripe = require("stripe")(
  "sk_test_51HyRkvC0Ko8dUs4YkmuMJJtZqzIEJegfoCioVpage43IkwxsGmXr8HpuGeh2WJPHlLYdQRvfke3jUfIJU0mT17ex006In5970u"
);

exports.buyCoins = async (req, res) => {
  try {
    const { products, userID } = req.body;
    const lineItems = products.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product.name,
        },
        unit_amount: product.amount * 100,
      },
      quantity: product.qunt,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000",
      cancel_url: "http://localhost:3000/cancel",
    });

    //save a entry in db user-id and session-id for after confirm payment increase the game coin
    await BuyCoin.create({ sessionID: session.id, userID });

    res.json({ id: session.id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal server error",
    });
  }
};

// app.post('/webhook', ),
exports.paymetnSuccess = async (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.endpointSecret
    );
  } catch (err) {
    response.status(404).send(`Webhook give Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const checkOutDone = event.data.object;
      //find the sessionID
      console.log(checkOutDone);
      const session = await BuyCoin.findOne({ sessionID: checkOutDone.id });

      if (session) {
        const additionalCoins = checkOutDone.amount_total / 100;
        console.log(additionalCoins, "may additional coin hu");
        await USER.findByIdAndUpdate(session.userID, {
          $inc: { currentCoin: additionalCoins },
        });
      }

      break;

    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object;
      break;

    default:
      console.log(`Unhandled event type `);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
};
