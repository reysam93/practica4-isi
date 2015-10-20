describe('createNewList', function() {
    beforeAll(function(done){
      Meteor.call('clearDB', function(){
        Meteor.call('loadFixtures');
        done();
      });

    })
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

    it("should add name to list",function(done){
      $('[name="listName"]').val("ismael"); 
      $('#formList').submit();
      setTimeout(function(){
        expect(Lists.findOne({name:"ismael"})).toBeTruthy()
        done();
      }, 500);
    });
    it("shouldn't add a new list if not registered",function(done){
      Meteor.logout(function() {
          Tracker.afterFlush(function(){
            expect($('#formList').html()).toBe(undefined);
            done();
          });
      });
        
    });
});