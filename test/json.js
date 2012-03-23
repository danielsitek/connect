
var connect = require('../')
  , should = require('./shared');

var app = connect();

app.use(connect.json());

app.use(function(req, res){
  res.end(JSON.stringify(req.body));
});

app.use(function(err, req, res, next){
  res.statusCode = err.status;
  res.end(err.message);
});

describe('connect.json()', function(){
  should['default request body'](app);

  it('should ignore GET', function(done){
    app.request()
    .get('/')
    .set('Content-Type', 'application/json')
    .write('{"user":"tobi"}')
    .end(function(res){
      res.body.should.equal('{}');
      done();
    });
  })

  it('should parse JSON', function(done){
    app.request()
    .post('/')
    .set('Content-Type', 'application/json')
    .write('{"user":"tobi"}')
    .end(function(res){
      res.body.should.equal('{"user":"tobi"}');
      done();
    });
  })
  
  it('should fail gracefully', function(done){
    app.request()
    .post('/')
    .set('Content-Type', 'application/json')
    .write('{"user"')
    .end(function(res){
      res.body.should.equal('Unexpected end of input');
      done();
    });
  })

  it('should 400 on malformed JSON', function(done){
    var app = connect();
    app.use(connect.json());

    app.use(function(req, res){
      res.end(JSON.stringify(req.body));
    });

    app.request()
    .post('/')
    .set('Content-Type', 'application/json')
    .write('{"foo')
    .expect(400, done);
  })

  describe('by default', function(){
    it('should parse primitives', function(done){
      var app = connect();
      app.use(connect.json());

      app.use(function(req, res){
        res.end(JSON.stringify(req.body));
      });

      app.request()
      .post('/')
      .set('Content-Type', 'application/json')
      .write('true')
      .expect('true', done);
    })
  })

  describe('when strict', function(){
    it('should 400 on primitives', function(done){
      var app = connect();
      app.use(connect.json({ strict: true }));

      app.use(function(req, res){
        res.end(JSON.stringify(req.body));
      });

      app.request()
      .post('/')
      .set('Content-Type', 'application/json')
      .write('true')
      .expect(400, done);
    })
  })
})