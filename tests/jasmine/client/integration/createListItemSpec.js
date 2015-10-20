describe("CreateListItem", function(){

	beforeAll(function(done){
		Meteor.call('clearDB', function(){
  			Meteor.call('loadFixtures');
  			done();
  		});
	});

	describe("If not logged", function(){

		it("shouldn't be able to add a new item", function(){
			var form = $("form.addTodo").html();
			expect(form).toBe(undefined);
		});

	});
	
	describe("If logged", function(){

		beforeAll(function(done){
			Meteor.loginWithPassword("pepe@gmail.com", "mipassword", function(err){
		    	Tracker.afterFlush(done);
		    });
		});

		it("shouldn't add a new item if name is not a string", function(){
			var itemName = 14;

			$("[name=todoName]").val(itemName);
			$("form.addTodo").submit();
			setTimeout(function(){
				expect(Todos.findOne({name: itemName})).toBeFalsy();
			}, 500);
		});

		it("shouldn't add a new item if list id is null", function(){
			var itemName = "New Item";

			$("[name=todoName]").val(itemName);
			$("form.addTodo").submit();
			setTimeout(function(){
				expect(Todos.findOne({name: itemName})).toBeFalsy();
			}, 100);
		});

		it("should add a new item with the name given", function(){
			var itemName = "New Item";
			var listName = "New List";

			$('[name="listName"]').val(listName); 
		    $('#formList').submit();
		    setTimeout(function(){
		        expect(Lists.findOne({name:listName})).toBeTruthy();

		        $("[name=todoName]").val(itemName);
				$("form.addTodo").submit();
				setTimeout(function(){
					expect(Todos.findOne({name: itemName})).toBeTruthy();
					done();
				}, 100);
		    }, 100);
		});
	});
});