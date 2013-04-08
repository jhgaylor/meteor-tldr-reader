Tldrs = new Meteor.Collection("tldrs");
Filters = new Meteor.Collection("filters");

Meteor.methods({
    get_data: function (client) {
        client.getLatestTldrs(10, function(e, data){
            data.forEach(function (item) {
                item.readBy = item.readyBy || []
                Tldrs.insert(item)
            })
        });
    },
    tldr_mark_unread: function (tldr_id, user_id){
      //removes a user from the list of users who has read a tldr
      Tldrs.update(tldr_id, {$pull: {readBy:user_id}});
    },
    tldr_mark_read: function (tldr_id, user_id){
      //adds a user to the list of users who has read a tldr
      Tldrs.update(tldr_id, {$addToSet: {readBy:user_id}});
    },
    user_remove_filterset: function (filterset) {
      Meteor.users.update(Meteor.userId(), {$pull: {'profile.filtersets': filterset}})
    },
    user_add_filterset: function (filterset) {
      Meteor.users.update(Meteor.userId(), {$addToSet: {'profile.filtersets': filterset}})
    },
    user_update_filterset: function (target, replacement) {
      //I don't like this implementation.  a) its 2 db actions b) it causes a change in order
      Meteor.call('user_remove_filterset', target);
      Meteor.call('user_add_filterset', replacement);
    },
    create_filterset: function (user_id) {
      var filterset = {
        user: user_id,
        filters: [],
        rules: []
      }
      console.log(filterset)
      Filters.insert(filterset)
    }


    // filters: function (args) {
    //     return { $and: args }
    // },
    // buildFilters: function () {
    //   and = function (selectors) {
    //     return {$and: selectors}
    //   };

    // }
    
});



