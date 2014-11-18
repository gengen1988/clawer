var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var _ = require('underscore');
var q = require('q');
var app = express();
app.listen(1337);
app.use(express.static(__dirname));

app.get('/search', function (req, res) {
  var question = req.query.q;
  var promiseRequest = q.denodeify(request);
  promiseRequest('http://www.baidu.com/s?wd=' + question)
    .then(function (result) {
      var $ = cheerio.load(result[1]);
      res.send(_.map($('.result').map(function (i, el) {
        var title = $('.t > a', el).text();
        var link = $('.t > a', el).attr('href');
        var content = $('.c-abstract', el).text();
        return {
          title: title,
          link: link,
          content: content
        };
      }), function (val) {
        return val;
      }));
    })
    .fail(function (err) {
      console.log(err);
      res.send('not ok');
    });
});
