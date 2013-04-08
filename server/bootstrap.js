Meteor.publish('tldrs', function () {
    return Tldrs.find();
});

Meteor.publish('filtersets', function () {
    return Filtersets.find();
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
});

