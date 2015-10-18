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

describe('createListItem', function() {

    beforeEach(function(){
      spyOn(Todos, "insert");
    });

    it("shouldn't create list item if not registered", function(done) {
      var todoName = "";
      var currentList = ""
      var err = "not-logged-in";
      
      Meteor.call("createListItem", todoName, currentList,function(error, result){
        expect(error.error).toBe(err);
        expect(Todos.insert).not.toHaveBeenCalled();
        done();
      });
    });

    it("shouldn't  todoItem is not a string", function(done){
      var todoName = "";
      var currentList = 45;
      var err = "Match failed";

      Meteor.call("createListItem", todoName, currentList, function(error, result){
        expect(error.reason).toBe(err);
        expect(Todos.insert).not.toHaveBeenCalled();
        done();
      });
    });
  });

});
