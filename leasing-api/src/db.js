const mongodb = require('mongodb');

async function connectMongodb() {
  const url = 'mongodb+srv://econnect:econnect2020@cluster0.aok1a.mongodb.net';
  return mongodb.MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = connectMongodb;
