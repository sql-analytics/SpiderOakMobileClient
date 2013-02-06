describe('DevicesCollection', function() {
  beforeEach(function() {
    this.server = sinon.fakeServer.create();
    this.b32username = "ORSXG5DVONSXE3TBNVSQ"; // nibbler b32 of "testusername"
  });
  afterEach(function() {
    this.server.restore();
  });
  describe('Fetching', function() {
    beforeEach(function() {
      this.successSpy = sinon.spy();
      this.errorSpy = sinon.spy();
      this.server.respondWith(
        "GET",
        "https://spideroak.com/storage/" + this.b32username + "/",
        [
          200,
          {"Content-Type": "test/html"},
          '{"devices":[["Test device","Test%20device/"],'+
            '["Other device","Other%20device/"]],"stats":{}}'
        ]
      );
      this.collection = new spiderOakApp.DevicesCollection();
      this.collection.url = "https://spideroak.com/storage/" +
                                    this.b32username + "/";
      this.collection.fetch({
        success: this.successSpy,
        error: this.errorSpy
      });
      this.server.respond();
    });
    it('should fetch from the server using GET', function() {
      expect(this.server.requests[0].method).toEqual("GET");
    });
    it('should use the expected url', function() {
      expect(this.server.requests[0].url)
        .toEqual("https://spideroak.com/storage/" + this.b32username + "/");
    });
    it('should fetch the model(s)', function() {
      var model = this.collection.at(0);
      expect(this.successSpy.calledOnce).toBeTruthy();
      expect(this.collection.models.length).toEqual(2);
    });
    it('should populate with DeviceModel instance(s)', function() {
      var model = this.collection.at(0);
      expect(model instanceof spiderOakApp.DeviceModel).toBeTruthy();
    });
    it('should asign the correct attributes in the model(s)', function() {
      var model = this.collection.at(0);
      expect(model.get("name")).toEqual("Test device");
      expect(model.get("url")).toEqual("Test%20device/");
    });
  });
});
