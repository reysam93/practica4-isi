

describe('removeListItem', function() {

	beforeEach(function(done){
        Meteor.call('clearDB', function(){
            Meteor.call('loadFixtures');
            done();
        });
      Meteor.loginWithPassword("pepe@gmail.com", "mipassword", function(err){
        Tracker.afterFlush(done);
      });
    });

    it("shouldn't remove a list item  if the list is empty", function(done) {
        
        setTimeout(function(){
            expect(Todos.find().count()).toBe(0)
            done();
        }, 500);
       expect($('.delete-todo').html()).toBe(undefined);

    });
    it("should remove a list item ", function(done) {

        var listName = "list_1";
        var itemName = "task_1";
        
        $('[name="listName"]').val(listName); 
        $('#formList').submit();
        setTimeout(function(){
            $("[name=todoName]").val(itemName);
            $("form.addTodo").submit();
            done();
        }, 100);

        setTimeout(function(){
            expect(Todos.findOne({name: itemName})).toBeTruthy();
            done();
        }, 500);

        $('.delete-todo').click();
        
        setTimeout(function(){
            expect(Todos.findOne({name: itemName})).toBeFalsy()
            done();
        }, 500);
    });
    it("shouldn't remove a list item if not registered",function(done){

        var listName = "list_2";
        var itemName = "task_2";
        
        $('[name="listName"]').val(listName); 
        $('#formList').submit();
        setTimeout(function(){
            $("[name=todoName]").val(itemName);
            $("form.addTodo").submit();
            
        }, 100);

        setTimeout(function(){
            expect(Todos.findOne({name: itemName})).toBeTruthy();
            done();
        }, 500);

        Meteor.logout(function() {
            Tracker.afterFlush(function(){
                expect($('.delete-todo').html()).toBe(undefined);
                done();
            });
        });

         setTimeout(function(){
            expect(Todos.findOne({name: itemName})).toBeFalsy()
            done();
        }, 500);
        
        
    });

  });
