describe('Meteor methods', function() {

  describe('createNewList', function() {

    beforeEach(function(){
      spyOn(Lists, "insert");
    });

    it("shouldn't add a new list if not registered", function(done) {
      var listName = "";
      var err = "not logged-in";
      
      Meteor.call("createNewList", listName, function(error, result){
        expect(error.error).toBe(err);
        expect(Lists.insert).not.toHaveBeenCalled();
        done();
      });
    });

    it("sholdn't add a new list if the name is not a string", function(done){
      var listName = 47;
      var err = "Match failed";

      Meteor.call("createNewList", listName, function(error, result){
        expect(error.reason).toBe(err);
        expect(Lists.insert).not.toHaveBeenCalled();
        done();
      });
    });


  });

});
