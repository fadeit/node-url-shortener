var request = require('superagent')
  , mock = require('superagent-mocker')(request)
  , expect = require('expect.js');

describe('Test Node Url Shortener - RESTful API', function () {
  var id;

  beforeEach(function() {
    mock.clearRoutes();
    mock.timeout = 0;
  });

  it('should POST /api/v1/shorten', function (done) {
    mock.post('/api/v1/shorten', function(req) {
      return {
        hash: 'MQ==',
        long_url: req.body.long_url,
        short_url: 'http://localhost:3000/MQ==',
        status_code: 200,
        status_txt: 'OK',
      };
    });
    request.post('/api/v1/shorten', {
        long_url: 'https://www.google.com'
      })
      .end(function(_, data) {
        // console.log(data);
        expect(data).to.an('object');
        expect(data).not.to.be.empty();
        expect(data).to.have.keys('hash', 'long_url', 'short_url', 'status_code', 'status_txt');
        id = data.hash;
        done();
      });
  });

  it('should POST /api/v1/expand', function(done){
    mock.post('/api/v1/expand', function(req) {
      return {
        hash: req.body.short_url,
        long_url: 'https://www.google.com',
        short_url: 'http://localhost:3000/' + req.body.short_url,
        status_code: 200,
        status_txt: 'OK',
      };
    });
    request.post('/api/v1/expand', {
        short_url: id
      })
      .end(function(_, data) {
        // console.log(data);
        expect(data).to.an('object');
        expect(data).not.to.be.empty();
        expect(data).to.have.keys('hash', 'long_url', 'short_url', 'status_code', 'status_txt');
        done();
      })
  });
})
