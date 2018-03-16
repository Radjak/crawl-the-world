module.exports = {
  getBaseUrl: (uri) => {
    let reg = new RegExp('(https?:\/\/[^\/]*)\/?.*');
    let baseUrl = uri.match(reg);
    return baseUrl[1];
  },
  collectInternalLinks: (baseUrl, $) => new Promise((s,f) => {
    let links = [];

    let hrefs = $("a[href]");

    hrefs.each(function() {
      let href = $(this).attr('href');

      let reg = new RegExp('^https?.*');
      let reg2 = new RegExp('^\/\/.*');
      let reg3 = new RegExp('^\/[^\/]*');

      if (href.match(reg))
        links.push(href);
      else if (href.match(reg2))
        links.push('http' + href);
      else if (href.match(reg3))
        links.push(baseUrl + href);
      else
        links.push(baseUrl + '/' + href);
    });

    s(links);
  }),
};
