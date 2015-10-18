describe('Meteor methods', function() {

  describe('createNewList', function() {

    it("shouldn't add a new todo if not registered", function(done) {
      var listName = "";
      spyOn(Lists, "insert");

      Meteor.call("createNewList", listName, function(error, result){
        expect(Lists.insert).not.toHaveBeenCalled();
        done();
      });
    });

  });

});
