const extractMails = (uri, $) => new Promise((s,f) => {
  let mails = [];

  $("a[href^='mailto']").each(function() {
    mails.push({
      uri: uri,
      mail: $(this).attr('href'),
    });
  });

  s(mails);
});

const checkMetas = ($, keywords) => new Promise((s,f) => {
  let metas = [];

  $('meta').each(function() {
    let reg = new RegExp(keywords.join('|'));

    if ($.html($(this)).match(reg))
      metas.push($.html($(this)));

    s(metas);
  });
});

const checkTitles = ($, keywords) => new Promise((s,f) => {
  let titles = [];

  $('title, h1, h2, h3, h4, h5, h6').each(function() {
    let reg = new RegExp(keywords.join('|'));

    if ($.html($(this)).match(reg))
      titles.push($(this).text());

    s(titles);
  });
});

module.exports = (db, uri, $, keywords) => new Promise((s,f) => {
  extractMails(uri, $)
    .then((mails) => {
      if (mails.length !== 0)
        db.insertMany('mail', mails);
    });

  checkMetas($, keywords)
    .then((metas) => {
      if (metas.length !== 0) {
        let data = {
          uri: uri,
          metas: metas,
        };

        db.insertOne('meta', data);
      }
    });

  checkTitles($, keywords)
    .then((titles) => {
      if (titles.length !== 0) {
        let data = {
          uri: uri,
          titles: titles,
        };

        db.insertOne('title', data);
      }
    });
});
