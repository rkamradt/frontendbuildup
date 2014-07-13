var request = require('supertest');  
var should = require('should');

describe('Router', function(){
  var url = "http://localhost:9999";
  describe('GET /api/users', function(){
    it('should return an error if trying to get users list if not logged on with admin', function(done){
      request(url)
        .get('/api/users')
        .expect(403)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            console.log('GET /api/users expected status 403 status: ' + res.status);
            done();
          }
        });
    });
    it('should return ok if trying to get users list if logged on with admin', function(done){
      var user = {
        email: 'admin@genius.com',
        password: 'admin'
      }
      var req = request.agent(url);
      req.post('/api/users')
        .send(user)
        .expect(200) 
        .end(function(err,res) {
          if (err) {
            done(err);
          }
          req.get('/api/users')
            .set('Accept', 'application/json')
            .expect(200) 
    //        .expect('Content-Type', /json/)
            .end(function(err,res) {
              if (err) {
                done(err);
              } else {
                var users = JSON.parse(res.body);
                users.length.should.equal(3);
                done();
              }
            
          });
        });
    });
  });
  describe('POST /api/users (logon)', function(){
    it('should return an error if trying to logon with an unknown user', function(done){
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
            done(err);
          } else {
            console.log('logon expected status 400 status: ' + res.status);
            done();
          }
        });
    });
    it('should return ok if trying to logon with an known user', function(done){
      var user = {
        email: 'randy@genius.com',
        password: 'password'
      }
      request(url)
        .post('/api/users')
        .set('Accept', 'application/json')
        .send(user)
        .expect(200) 
        .expect('Content-Type', /json/)
        .end(function(err,res) {
          if (err) {
            done(err);
          } else {
            console.log('logon expected status 200 status: ' + res.status);
            console.log('logged on user: ' + res.body.email);
            res.body.firstName.should.equal('Randy');
            res.body.lastName.should.equal('Kamradt');                    
            res.body.email.should.equal('randy@genius.com');
            res.body.role.should.equal('nobody');                    
            done();
          }
      });
    });
  });
  describe('DELETE /api/users (logoff)', function(){
    it('should return an error if trying to logoff without being logged on', function(done){
      request(url)
        .del('/api/users')
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });
    it('should return ok if trying to logoff after logging on', function(done){
      var user = {
        email: 'randy@genius.com',
        password: 'password'
      }
      var req = request.agent(url);
      var cookies;
      req.post('/api/users')
        .send(user)
        .expect(200) 
        .end(function(err,res) {
          if (err) {
            done(err);
          } else {
            cookies = res.headers['set-cookie']
                      .map(function(r){
                        return r.replace("; path=/; httponly","") 
                      }).join(";");
            console.log("cookies = " + cookies);
          }
      });
      req.del('/api/users')
        .set('cookie', cookies)
        .expect(200)
        .end(function(err,res) {
          if (err) {
            done(err);
          } else {
            done();
          }
      });
    });
  });
});
