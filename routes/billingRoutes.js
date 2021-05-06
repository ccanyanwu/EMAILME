const keys = require('../config/keys')
//const stripe = require('stripe')(keys.stripeSecretKey);
const paystack = require("paystack")(keys.paystackSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
    app.post('/api/paystack', requireLogin, async (req, res) => {
        //check if user is signed in

     const charge =  await  paystack.plan
        .create({
          name: "API demo",
          amount: 1000000,
          interval: "monthly",
          source: req.body.id,
        });
          

       /*  const charge = await paystack.charges.create({
            amount: 1000000,
            currency: 'NGN',
            description: 'N10000 for 5 credits',
            source: req.body.id
        }); */
        req.user.credits += 5;
        const user = await req.user.save();
        res.send(user);
    });
}

/* module.exports = (app) => {
  app.post("/api/stripe", requireLogin, async (req, res) => {
    //check if user is signed in

    const charge = await stripe.charges.create({
      amount: 500,
      currency: "usd",
      description: "$5 for 5 credits",
      source: req.body.id,
    });
    req.user.credits += 5;
    const user = await req.user.save();
    res.send(user);
  });
}; */