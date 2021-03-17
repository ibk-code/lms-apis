const mongodb = require('mongodb');

const connectMongodb = require('../db');

let DATABASE_CONNECTION = null;

function setDb() {
  connectMongodb().then((client) => {
    DATABASE_CONNECTION = client.db('leasing');
  });
}

function insertDocument() {
  return (collectionName, document) => {
    setDb();
    function handleInsertDocument(resolve, reject) {
      try {
        const db = DATABASE_CONNECTION;
        const collection = db.collection(collectionName);
        collection.insertOne(document, (err, result) => {
          if (err) {
            return reject(err);
          }
          return resolve(result.ops[0]);
        });
      } catch (error) {
        return reject(error);
      }
      return null;
    }
    return new Promise(handleInsertDocument);
  };
}

function insertDocuments() {
  setDb();
  return (collectionName, documents) => {
    function handleInsertDocument(resolve, reject) {
      try {
        const db = DATABASE_CONNECTION;
        const collection = db.collection(collectionName);
        collection.insertMany(documents, (err, result) => {
          if (err) {
            return reject(err);
          }
          return resolve(result, documents);
        });
      } catch (error) {
        return reject(error);
      }
      return null;
    }
    return new Promise(handleInsertDocument);
  };
}

function findDocuments() {
  setDb();

  return (collectionName, query) => {
    function handleFindDocuments(resolve, reject) {
      try {
        const db = DATABASE_CONNECTION;
        const collection = db.collection(collectionName);
        const findResult = collection.find(query);
        if (findResult) {
          findResult.toArray((err, docs) => {
            if (err) {
              return reject(err);
            }
            return resolve(docs);
          });
        } else {
          return resolve([]);
        }
      } catch (error) {
        return reject(error);
      }
      return null;
    }
    return new Promise(handleFindDocuments);
  };
}

function findDocument() {
  setDb();

  return (collectionName, query) => {
    function handleFindDocuments(resolve, reject) {
      try {
        const db = DATABASE_CONNECTION;
        const collection = db.collection(collectionName);
        collection.findOne(query, (err, docs) => {
          if (err) {
            return reject(err);
          }
          return resolve(docs);
        });
      } catch (error) {
        return reject(error);
      }
      return null;
    }
    return new Promise(handleFindDocuments);
  };
}

function findDocumentById() {
  setDb();

  return (collectionName, documentId) => {
    function handleFindDocumentById(resolve, reject) {
      try {
        const db = DATABASE_CONNECTION;
        const collection = db.collection(collectionName);
        collection.findOne(
          { _id: new mongodb.ObjectId(documentId) },
          (err, docs) => {
            if (err) {
              return reject(err);
            }
            return resolve(docs);
          }
        );
      } catch (error) {
        return reject(error);
      }
      return null;
    }
    return new Promise(handleFindDocumentById);
  };
}

function updateDocument() {
  setDb();

  return (collectionName, documentId, update = {}) => {
    function handleFindDocuments(resolve, reject) {
      try {
        const db = DATABASE_CONNECTION;
        const collection = db.collection(collectionName);
        collection.updateOne(
          { _id: new mongodb.ObjectId(documentId) },
          { $set: update },
          (err, docs) => {
            if (err) {
              return reject(err);
            }
            return resolve(docs);
          }
        );
      } catch (error) {
        return reject(error);
      }
      return null;
    }
    return new Promise(handleFindDocuments);
  };
}

function updateDocuments() {
  setDb();

  return (collectionName, query = {}, update = {}, options = {}) => {
    function handleUpdateDocuments(resolve, reject) {
      try {
        const db = DATABASE_CONNECTION;
        const collection = db.collection(collectionName);
        collection.updateMany(query, { $set: update }, options, (err, docs) => {
          if (err) {
            return reject(err);
          }
          return resolve(docs);
        });
      } catch (error) {
        return reject(error);
      }
      return null;
    }
    return new Promise(handleUpdateDocuments);
  };
}

function deleteDocument() {
  setDb();

  return (collectionName, query) => {
    function handleDeleteDocument(resolve, reject) {
      try {
        const db = DATABASE_CONNECTION;
        const collection = db.collection(collectionName);
        collection.deleteOne(query, (err, docs) => {
          if (err) {
            return reject(err);
          }
          return resolve(docs);
        });
      } catch (error) {
        return reject(error);
      }
      return null;
    }
    return new Promise(handleDeleteDocument);
  };
}

function deleteDocumentById() {
  setDb();

  return (collectionName, documentId) => {
    function handleDeleteDocumentById(resolve, reject) {
      try {
        const db = DATABASE_CONNECTION;
        const collection = db.collection(collectionName);
        collection.deleteOne(
          { _id: new mongodb.ObjectId(documentId) },
          (err, docs) => {
            if (err) {
              return reject(err);
            }
            return resolve(docs);
          }
        );
      } catch (error) {
        return reject(error);
      }
      return null;
    }
    return new Promise(handleDeleteDocumentById);
  };
}

function getTotalField() {
  setDb();

  return (collectionName, match = {}, group = {}) => {
    function getAggregate(resolve, reject) {
      try {
        const db = DATABASE_CONNECTION;
        const collection = db.collection(collectionName);
        collection
          .aggregate([
            { $match: match },
            { $group: group },
            { $sort: { countDocuments: -1 } },
            // { $limit: 1 },
          ])
          .toArray((err, docs) => {
            if (err) {
              return reject(err);
            }
            return resolve(docs);
          });
      } catch (error) {
        return reject(error);
      }
      return null;
    }
    return new Promise(getAggregate);
  };
}

module.exports = {
  insertOne: insertDocument(),
  deleteOne: deleteDocument(),
  deleteById: deleteDocumentById(),
  inserMany: insertDocuments(),
  findMany: findDocuments(),
  updateOne: updateDocument(),
  updateMany: updateDocuments(),
  findOne: findDocument(),
  findById: findDocumentById(),
  getAggregate: getTotalField(),
};
