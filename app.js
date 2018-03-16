const Crawler = require("crawler");
const tools = require("./tools");

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
  console.log(error);
};

const whenCrawl = (res) => {
  let $ = res.$;

  tools.collectInternalLinks(tools.getBaseUrl(res.options.uri), $)
    .then((links) => {
      links.forEach((l) => {
        c.queue(l);
      });
    });
};

c.on('request', function (options) {
    console.log('Call: ' + options.uri);
});

c.queue('https://www.google.fr/search?q=nutrition');
