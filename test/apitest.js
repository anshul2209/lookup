let mongoose = require("mongoose");
let provider = require('../model/provider');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server/index');
let should = chai.should();

chai.use(chaiHttp);

describe('/GET Provider with state as \'ID\'', () => {
  it('it should GET all the providers from ID state', (done) => {
    chai.request(server)
      .get('/providers?state=ID')
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('data').with.lengthOf(216);
          res.body.should.have.property('message').eql('data recieved');
        done();
      });
  });
});
describe('/GET Provider with invalid state', () => {
  it('it should return zero results', (done) => {
    chai.request(server)
      .get('/providers?state=abc')
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('data').with.lengthOf(0);
          res.body.should.have.property('message').eql('no data');
        done();
      });
  });
});
describe('/GET Provider using invalid query params', () => {
  it('it should throw up error and no data is returned', (done) => {
    chai.request(server)
      .get('/providers?a=b')
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('data').with.lengthOf(0);
          res.body.should.have.property('message').eql('the query is invalid');
        done();
      });
  });
});
describe('Test min max medicare payments 6000 8000', () => {
  it('it should get provider details for medicare payments within the range of 6000 and 8000', (done) => {
    chai.request(server)
      .get('/providers?min_average_medicare_payments=6000&max_average_medicare_payments=8000')
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('data').with.lengthOf(11372);
          res.body.should.have.property('message').eql('data recieved');
        done();
      });
  });
});
describe('Test min max discharges 10 20', () => {
  it('it should get provider details with dscharges within range of 10-20', (done) => {
    chai.request(server)
      .get('/providers?min_discharges=10&max_discharges=20')
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('data').with.lengthOf(22219);
          res.body.should.have.property('message').eql('data recieved');
        done();
      });
  });
});

describe('Test min max discharges 10 20 and state CA', () => {
  it('it should get provider details with discharges within range of 10-20 from state CA', (done) => {
    chai.request(server)
      .get('/providers?min_discharges=10&max_discharges=20&state=CA')
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('data').with.lengthOf(2133);
          res.body.should.have.property('message').eql('data recieved');
        done();
      });
  });
});
