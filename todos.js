Todos = new Meteor.Collection('todos');
Lists = new Meteor.Collection('lists');

Router.route('/register');
Router.route('/login');
Router.route('/', {
  name: 'home',
  template: 'home',
  /*
	ANOTHER WAY
  waitOn: function(){
  	return Meteor.subscribe('lists');
  }*/
});
Router.route('/list/:_id', {
  name: 'listPage',
  template: 'listPage',
  data: function(){
    var currentList = this.params._id;
    var currentUser = Meteor.userId();
    return Lists.findOne({_id: currentList,
    						createdBy: currentUser});
  },
  subscriptions: function(){
  	var currentList = this.params._id;
  	return Meteor.subscribe('todos', currentList);
  },
  onBeforeAction: function(){
  	var currentUser = Meteor.userId();
  	if(currentUser){
  		this.next();
  	}else{
  		this.render('login');
  	}
  },
  onRun: function(){
  	console.log("you triggered 'on run'");
  	this.next();
  },
  onRerun: function(){
  	console.log("you trigered 'on rerun'");
  },
  onAfterAction: function(){
  	console.log("you triggered 'on after action'");
  },
  onStop: function(){
  	console.log("you triggered 'on stop'");
  }
});

Router.configure({
  layoutTemplate: 'main',
  loadingTemplate: 'loading'
});

if (Meteor.isServer){
	Meteor.publish('lists', function(){
		var currentUser = this.userId;
		return Lists.find({createdBy: currentUser});
	});
	Meteor.publish('todos', function(currentList){
		var currentUser = this.userId;
		return Todos.find({createdBy: currentUser,
							listId: currentList});
	});

	function defaultName(currentUser){
		var nextLetter = "A";
		var nextName = "List " + nextLetter;
		while(Lists.findOne({name: nextName, createdBy:currentUser})){
			nextLetter = String.fromCharCode(nextLetter.fromCharCodeAt(0) + 1);
			nextName = "List " + nextLetter;
		}
		return nextName;
	}

	Meteor.methods({
		'createNewList': function(listName){
			check(listName, String);
			var currentUser = Meteor.userId();
			if(listName == ""){
				listName = defaultName(currentUser);
			}
			var data = {
				name: listName,
				createdBy: currentUser
			}
			if(!currentUser){
				throw new Meteor.Error("not logged-in", "You're not logged--in")
			}	
			return Lists.insert(data);
		},
		'createListItem': function(todoName, currentList){
		    check(todoName, String);
		    check(currentList, String);
		    var currentUser = Meteor.userId();
		    var data = {
		        name: todoName,
		        completed: false,
		        createdAt: new Date(),
		        createdBy: currentUser,
		        listId: currentList
		    }
		    if(!currentUser){
		        throw new Meteor.Error("not-logged-in", "You're not logged-in.");
		    }
		    return Todos.insert(data);
		},
		'updateListItem': function(documentId, todoItem){
			check(todoItem, String);
			var currentUser = Meteor.userId();
			var data = {
				_id: documentId,
				createdBy: currentUser
			}
			if(!currentUser){
				throw new Meteor.Error("not-logged-in", "You're not logged");
			}
			Todos.update(data, {$set: {name: todoItem}})
		},
		'changeItemStatus': function(documentId, status){
			check(status, Boolean);
			var data = {
				_id: documentId,
				createdBy: currentUser
			}
			var currentUser = Meteor.userId();
			if(!currentUser){
				throw new Meteor.Error("not-logged-in", "You're not logged in");
			}
			Todos.update(data, {$set: {completed: status}});
		},
		'removeListItem': function(documentId){
    		var currentUser = Meteor.userId();
    		var data = {
		        _id: documentId,
		        createdBy: currentUser
		    }
		    if(!currentUser){
		        throw new Meteor.Error("not-logged-in", "You're not logged-in.");
		    }
		    Todos.remove(data);
		}

	});
}

if (Meteor.isClient){
  
  keys = {
    RETURN: 13,
    ESCAPE: 27
  }

  $.validator.setDefaults({
  	rules: {
        email: {required: true, email: true},
        password: {required: true, minlength: 6}
    },
    messages: {
        email: {
            required: "You must enter an email address.",
            email: "You have entered an invalid email address."
        },
        password: {
        	required: "You must enter a password.",
          	minlength: "Your password must be at least {0} characters"
        }
    }
  });

  Template.todos.helpers({
    'todo': function(){
      var currentList = this._id;
      var currentUser = Meteor.userId();
      return Todos.find({listId: currentList, createdBy: currentUser},
                        {sort: {createdAt: -1}});
    }
  }); 

  Template.addTodo.events({
    'submit form': function(event){
    event.preventDefault();
    var todoName = $('[name="todoName"]').val();
    var currentList = this._id;
    Meteor.call('createListItem', todoName, currentList, function(error){
        if(error){
            console.log(error.reason);
        } else {
            $('[name="todoName"]').val('');
        }
    });
    }
  });

  Template.todoItem.helpers({
    'checked': function(){
      var isCompleted = this.completed;
      if(isCompleted){
        return "checked";
      }else{
        return "";
      }
    }
  });

  Template.todoItem.events({
    'click .delete-todo': function(event){
      event.preventDefault();
      var documentId = this._id;
      var confirm = window.confirm("Delete this task?");
      if(confirm){
        Meteor.call('removeListItem', documentId);
      }
    },
    'keyup [name=todoItem]': function(event){
      if(event.which == keys.RETURN || event.which == keys.ESCAPE){
        $(event.target).blur();
      }else{
        var documentId = this._id;
      var todoItem = $(event.target).val();
      Meteor.call('updateListItem', documentId, todoItem);
      }
    },
    'change [type=checkbox]': function(){
      var documentId = this._id;
      var isCompleted = this.completed;
      if(isCompleted){
        Meteor.call("changeItemStatus", documentId, false);
      } else {
        Meteor.call("changeItemStatus", documentId, true);
      }
    }
  });

  Template.todosCount.helpers({
    'totalTodos': function(){
      var currentList = this._id;
      return Todos.find({listId: currentList}).count();
    },
    'completedTodos': function(){
      var currentList = this._id;
      return Todos.find({listId: currentList,completed: true}).count();
    }
  });

  Template.addList.events({
    'submit form': function(event){
      event.preventDefault();
      var listName = $('[name=listName]').val();
      Meteor.call('createNewList', listName, function(error){
      	if(error){
      		console.log(error.reason);
      	}else{
      		Router.go("listPage", {_id: results});
      		$('[name=listName]').val('');
      	}
      });
    }
  });

  Template.lists.helpers({
    'list': function(){
    	var currentUser = Meteor.userId();
    	return Lists.find({createdBy: currentUser},
    						{sort: {name: 1}});
    }
  });

  Template.lists.onCreated(function(){
  	this.subscribe('lists');
  });

  Template.register.events({
  	'submit form': function(event){
  		event.preventDefault();
  	}
  });

  Template.register.onRendered(function(){
  	var validator = $('.register').validate({
  		submitHandler: function(){
  			var email = $('[name=email]').val();
        	var password = $('[name=password]').val();
        	Accounts.createUser({
            	email: email,
            	password: password
        	}, function(){
        		if(error){
        			if(error.reason == "Email already exists."){
        				validator.showErrors({
            				email: "That email already belongs to a registered user."   
        				});
    				}
        		}else{
        			Router.go("home");
        		}
        	});
  		}
  	});
  });

  Template.navigation.events({
  	'click .logout': function(event){
  		event.preventDefault();
  		Meteor.logout();
  		Router.go('login');
  	}
  });

  Template.login.events({
  	'submit form': function(event){
  		event.preventDefault();
    }
  });

  Template.login.onRendered(function(){
  	var validator = $('.login').validate({
  		submitHandler: function(event){
  			var email = $('[name=email]').val();
        	var password = $('[name=password]').val();
        	Meteor.loginWithPassword(email, password, function(){
        		if(error){
				    if(error.reason == "User not found"){
				        validator.showErrors({
				            email: "That email doesn't belong to a registered user."   
				        });
				    }
				    if(error.reason == "Incorrect password"){
				        validator.showErrors({
				            password: "You entered an incorrect password."    
				        });
				    }
				}else{
        			var currentRoute = Router.current().route.getName();
        			if (currentRoute == "login"){
        				Router.go("home");
        			}
        		}
        	});
  		}
  	});
  });
}