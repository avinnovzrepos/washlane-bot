'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var webhookCtrlStub = {
  index: 'webhookCtrl.index',
  show: 'webhookCtrl.show',
  create: 'webhookCtrl.create',
  update: 'webhookCtrl.update',
  destroy: 'webhookCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var webhookIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './webhook.controller': webhookCtrlStub
});

describe('Webhook API Router:', function() {

  it('should return an express router instance', function() {
    expect(webhookIndex).to.equal(routerStub);
  });

  describe('GET /api/webhooks', function() {

    it('should route to webhook.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'webhookCtrl.index')
        ).to.have.been.calledOnce;
    });

  });

  describe('GET /api/webhooks/:id', function() {

    it('should route to webhook.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'webhookCtrl.show')
        ).to.have.been.calledOnce;
    });

  });

  describe('POST /api/webhooks', function() {

    it('should route to webhook.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'webhookCtrl.create')
        ).to.have.been.calledOnce;
    });

  });

  describe('PUT /api/webhooks/:id', function() {

    it('should route to webhook.controller.update', function() {
      expect(routerStub.put
        .withArgs('/:id', 'webhookCtrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('PATCH /api/webhooks/:id', function() {

    it('should route to webhook.controller.update', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'webhookCtrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('DELETE /api/webhooks/:id', function() {

    it('should route to webhook.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'webhookCtrl.destroy')
        ).to.have.been.calledOnce;
    });

  });

});
