/*describe("testing login and logout", function(){
  beforeEach(function(done){
    Meteor.loginWithPassword("pepe@gmail.com", "mipassword", function(err){
      Tracker.afterFlush(done);
    });
  });
  afterEach(function(done){
    Meteor.logout(function() {
      Tracker.afterFlush(done);
    });
  });

  it("should user be logged in", function(){
    var user = Meteor.user();
    expect(user).not.toBe(null);
  });
});*/