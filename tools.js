module.exports = {
  getBaseUrl: (uri) => {
    let reg = new RegExp('(https?:\/\/[^\/]*)\/?.*');
    let baseUrl = uri.match(reg);
    return baseUrl[1];
  },
  collectInternalLinks: (baseUrl, $) => new Promise((s,f) => {
    let links = [];

    let relativeLinks = $("a[href^='/']");
    relativeLinks.each(function() {
        if ($(this).attr('href').startsWith('//'))
          links.push('http:' + $(this).attr('href'));
        else
          links.push(baseUrl + $(this).attr('href'));
    });

    let absoluteLinks = $("a[href^='http']");
    absoluteLinks.each(function() {
        links.push($(this).attr('href'));
    });

    s(links);
  }),
};
