var request = require('supertest');  
var should = require('should');

describe('Router', function(){
  var url = "http://localhost:9999";
  describe('GET /api/users (logon)', function(){
    it('should return an error if trying to get users list if not logged on with admin', function(){
      request(url)
        .get('/api/users')
        .expect(403)
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          done();
        });
      });
    it('should return ok if trying to get users list if logged on with admin', function(){
      var user = {
        email: 'admin@genius.com',
        password: 'admin'
      }
      request(url)
        .post('/api/users')
        .set('Accept', 'application/json')
        .send(user)
        .expect('Content-Type', /json/)
        .expect(200) //Status code
        .end(function(err,res) {
          if (err) {
            throw err;
          }
          done();
      });
      request(url)
        .get('/api/users')
        .set('Accept', 'application/json')
        .send(user)
        .expect('Content-Type', /json/)
        .expect(200) //Status code
        .end(function(err,res) {
          if (err) {
            throw err;
          }
          res.body.length.should.equal(3);
          done();
      });
    });
  });
  describe('POST /api/users (logon)', function(){
    it('should return an error if trying to logon with an unknown user', function(){
      var user = {
        email: 'unknown@genius.com',
        password: 'whatever'
      }
      request(url)
        .post('/api/users')
        .send(user)
        .expect(400)
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          done();
        });
      });
    it('should return ok if trying to logon with an known user', function(){
      var user = {
        email: 'randy@genius.com',
        password: 'password'
      }
      request(url)
        .post('/api/users')
        .set('Accept', 'application/json')
        .send(user)
        .expect('Content-Type', /json/)
        .expect(200) //Status code
        .end(function(err,res) {
          if (err) {
            throw err;
          }
          res.body.firstName.should.equal('Randy');
          res.body.lastName.should.equal('Kamradt');                    
          res.body.email.should.equal('randy@genius.com');
          res.body.role.should.equal('nobody');                    
          done();
      });
    });
  });
  describe('DELETE /api/users (logoff)', function(){
    it('should return an error if trying to logoff without being logged on', function(){
      request(url)
        .delete('/api/users')
        .expect(400)
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          done();
        });
      });
    it('should return ok if trying to logoff after logging on', function(){
      var user = {
        email: 'randy@genius.com',
        password: 'password'
      }
      request(url)
        .post('/api/users')
        .set('Accept', 'application/json')
        .send(user)
        .expect('Content-Type', /json/)
        .expect(200) //Status code
        .end(function(err,res) {
          if (err) {
            throw err;
          }
          done();
      });
      request(url)
        .delete('/api/users')
        .set('Accept', 'application/json')
        .expect(200) //Status code
        .end(function(err,res) {
          if (err) {
            throw err;
          }
          done();
      });
    });
  });
});
