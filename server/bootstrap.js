Meteor.startup(function () {
	Features = new Meteor.Collection("features");
	Meteor.publish("features", function () {
	  return Features.find(); // everything
	});
});