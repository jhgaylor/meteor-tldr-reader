Meteor.publish('tldrs', function () {
    return Tldrs.find();
});

Meteor.publish('filters', function () {
    return Filters.find();
});


// Meteor.publish('user_filtersets', function () {
//     return Meteor.users.findOne({_id:this.userId}, {fields: {filtersets:1}});
// }

Meteor.publish("userData", function () {
  return Meteor.users.find({_id: this.userId},
                           {fields: {'filtersets': 1}});
});

Meteor.startup(function () {

// Tldrs.update({}, {readBy: {}}) 
// Tldrs.remove({})
// Filters.remove({})
});

