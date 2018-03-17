const Crawler = require("crawler");
const tools = require("./tools");
const logger = require("./logger");
const MongoDb = require("./db");

const db = new MongoDb('mongodb://localhost:27017', 'crawler');

let c = new Crawler({
    maxConnections : 10,
    rateLimit: 100,
    retries: 1,
    retryTimeout: 5000,
    callback : function (error, res, done) {
        if (error) whenError(error);
        else whenCrawl(res);

        done();
    }
});

const whenError = (error) => {
  logger.writeCrawlerError(error);
};

const whenCrawl = (res) => {
  let $ = res.$;

  const search = ['nutrition', 'musuclation'];

  tools.checkDOM($, search)
    .then((data) => {

    });

  tools.collectInternalLinks(tools.getBaseUrl(res.options.uri), $)
    .then((links) => {
      links.forEach((link) => {
        db.callOrNo(link, 'call')
          .then((call) => {
            if (call) c.queue(link);
          })
          .catch((err) => {
            logger.writeCrawlerError(err);
          });
      });
    });
};

c.on('request', function (options) {
    logger.writeUriCall(options.uri);
    db.uriCall(options.uri, 'call');
});

process.on('SIGINT', function () {
  db.close();
  process.exit();
});

db.connect()
  .then((res) => {
    c.queue('https://www.google.fr/search?q=nutrition');
  })
  .catch((err) => {
    logger.writeCrawlerError(err);
    process.exit();
  });
