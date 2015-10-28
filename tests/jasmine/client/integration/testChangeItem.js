describe('changeItemStatus', function() {
  beforeEach(function(done){
     Meteor.call('clearDB', function(){
            Meteor.call('loadFixtures');
            done();
        });
    Meteor.loginWithPassword("pepe@gmail.com", "mipassword", function(err){
      Tracker.afterFlush(done);
    });
    var data={
      name : "listName",
      createdBy : Meteor.userId()
    }
    Lists.insert(data);
    var task = {
      name : "todoName",
      completed: false,
      createdAt: new Date(),
      createdBy: Meteor.userId(),
      listId: "listName"
    }
    Todos.insert(task);
  });

  afterEach(function(done){
    Meteor.logout(function() {
      Tracker.afterFlush(done);
    });
  });

  it("should change item to list",function(done){
    Tracker.afterFlush(function() {
      $('#check').attr("checked", true);
      done();
    });
    
    var isCompleted = Todos.findOne({name: "todoName"}).completed;  
    setTimeout(function(){
       expect(true).toBe(isCompleted);
          done();
    }, 500);
    
  });
});