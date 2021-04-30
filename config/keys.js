//just figure out what to return
if (process.env.NODE_ENV === 'production') {
  //production keys
  module.exports = require("./prod");
}
else {
  //dev keys
  module.exports = require('./dev');
}

/* const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://FRESH:<password>@fresh.t1l4i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
}); */

//production
//mongodb+srv://emailme:emailme@emailme.tnxio.mongodb.net/EMAILME?retryWrites=true&w=majority

