'use strict';

var app = require('../..');
import request from 'supertest';

var newWebhook;

describe('Webhook API:', function() {

  describe('GET /api/webhooks', function() {
    var webhooks;

    beforeEach(function(done) {
      request(app)
        .get('/api/webhooks')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          webhooks = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(webhooks).to.be.instanceOf(Array);
    });

  });

  describe('POST /api/webhooks', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/webhooks')
        .send({
          name: 'New Webhook',
          info: 'This is the brand new webhook!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newWebhook = res.body;
          done();
        });
    });

    it('should respond with the newly created webhook', function() {
      expect(newWebhook.name).to.equal('New Webhook');
      expect(newWebhook.info).to.equal('This is the brand new webhook!!!');
    });

  });

  describe('GET /api/webhooks/:id', function() {
    var webhook;

    beforeEach(function(done) {
      request(app)
        .get('/api/webhooks/' + newWebhook._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          webhook = res.body;
          done();
        });
    });

    afterEach(function() {
      webhook = {};
    });

    it('should respond with the requested webhook', function() {
      expect(webhook.name).to.equal('New Webhook');
      expect(webhook.info).to.equal('This is the brand new webhook!!!');
    });

  });

  describe('PUT /api/webhooks/:id', function() {
    var updatedWebhook;

    beforeEach(function(done) {
      request(app)
        .put('/api/webhooks/' + newWebhook._id)
        .send({
          name: 'Updated Webhook',
          info: 'This is the updated webhook!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedWebhook = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedWebhook = {};
    });

    it('should respond with the updated webhook', function() {
      expect(updatedWebhook.name).to.equal('Updated Webhook');
      expect(updatedWebhook.info).to.equal('This is the updated webhook!!!');
    });

  });

  describe('DELETE /api/webhooks/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/webhooks/' + newWebhook._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when webhook does not exist', function(done) {
      request(app)
        .delete('/api/webhooks/' + newWebhook._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
