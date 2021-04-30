var config = require("./config");
const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
require('./models/User')
const keys = require('./config/keys');

//google auth
require('./modules/passport');
const authRoute = require('./routes/authRoutes');
const billingRoute = require("./routes/billingRoutes");


var cors = require("cors");

//connect to database
/* mongoose.connect(keys.mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}).catch(error => console.log(error)); */

(async () => {
  try {
    await mongoose.connect(keys.mongoURI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (err) {
    console.log("error: " + err);
  }
})();

const app = express();

/***********
PARSE JSON
**********/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
)

app.use(passport.initialize());
app.use(passport.session());





app.use(cors({ origin: true }));

//using our routes
authRoute(app);
billingRoute(app);

//production routes
if (process.env.NODE_ENV === 'production') {
  //express serve up production assets like main.js & main.css file
  app.use(express.static('client/build'));

  //express will serve up the index.html file if it doesn't recognize the route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(config.PORT, "0.0.0.0",  () => {
  console.log(`Server running on ${config.PORT}...`);
});


//Routes
app.all('*',)

//app.use(routes)
