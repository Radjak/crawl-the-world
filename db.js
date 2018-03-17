const MongoClient = require('mongodb').MongoClient;

class MongoDb {
  constructor (url, dbName) {
    this.url = url;
    this.dbName = dbName;
  }

  connect () {
    return new Promise((s,f) => {
      MongoClient.connect(this.url, (err, client) => {
        if (err) f(err);

        this.client = client;
        this.db = client.db(this.dbName);

        s();
      });
    });
  }

  close () {
    this.client.close();
  }

  findAll (collection, data) {
    return new Promise((s,f) => {
      this.db.collection(collection).find(data).toArray((err, result) => {
        if (err) f(err);

        s(result);
      });
    });
  }

  findOne (collection, data) {
    return new Promise((s,f) => {
      this.db.collection(collection).findOne(data, (err, result) => {
        if (err) f(err);

        s(result);
      });
    });
  }

  insertMany (collection, data) {
    return new Promise((s,f) => {
      this.db.collection(collection).insertMany(data, (err, result) => {
        if (err) f(err);

        s(result);
      });
    });
  }

  insertOne (collection, data) {
    return new Promise((s,f) => {
      this.db.collection(collection).insertOne(data, (err, result) => {
        if (err) f(err);

        s(result);
      });
    });
  }

  update (collection, search, data) {
    return new Promise((s,f) => {
      this.db.collection(collection).update(search, data, (err, result) => {
        if (err) f(err);

        s(result);
      });
    });
  }

  callOrNo (uri, collection) {
    return new Promise((s,f) => {
      let dataToFind = {
        uri: uri,
      };

      this.findOne(collection, dataToFind)
        .then((resFindOne) => {
          if (resFindOne === null) s(true);
          else s(false);
        })
        .catch((err) => {
          f(err);
        });
    });
  }

  uriCall (uri, collection) {
    return new Promise((s,f) => {
      let dataToFind = {
        uri: uri,
      };

      this.findOne(collection, dataToFind)
        .then((resFindOne) => {
          if (resFindOne === null) {
            let dataToInsert = {
              uri: uri,
              created_at: new Date(),
              updated_at: new Date(),
            };

            this.insertOne(collection, dataToInsert);
          } else {
            let dataToSearch = {
              uri: uri,
            };

            let dataToUpdate = {
              $set: {
                updated_at: new Date(),
              }
            };

            this.update('call', dataToSearch, dataToUpdate);
          }
        })
        .catch((err) => {
          f(err);
        });
    });
  }
}

module.exports = MongoDb;
