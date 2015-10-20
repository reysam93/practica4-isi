describe("CreateListItemSpec", function(){

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

	});

});