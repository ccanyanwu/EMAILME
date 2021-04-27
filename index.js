var config = require("./config");
const express = require("express");
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
require('./models/User')
const keys = require('./config/keys');

//google auth
require('./modules/passport');
const authRoute = require('./routes/authRoutes');

var cors = require("cors");
var bodyParser = require("body-parser");
var routes = require("./routes/routes");

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

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
)

app.use(passport.initialize());
app.use(passport.session());


/***********
PARSE JSON
**********/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(cors({ origin: true }));

//google auth
authRoute(app);

app.listen(config.PORT, "0.0.0.0",  () => {
  console.log(`Server running on ${config.PORT}...`);
});


//Routes
app.all('*',)

//app.use(routes)
