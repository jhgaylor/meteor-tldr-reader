Meteor.publish('tldrs', function () {
    return Tldrs.find();
})

Meteor.startup(function () {
// Tldrs.update({}, {readBy: {}}) 
// Tldrs.remove({})
});

