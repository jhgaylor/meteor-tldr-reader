Tldrs = new Meteor.Collection("tldrs");


Meteor.startup(function () {
    c = new Client({
        name: "jakegaylor",
        key: "8P5mD26fGye43y66K5p5"
    });
});



Meteor.methods({
    get_data: function (client) {
        client.getLatestTldrs(10, function(e, data){
            data.forEach(function (item) {
                item.readBy = item.readyBy || []
                Tldrs.insert(item)
            })
        });
    },
    tldr_unread: function (tldr_id, user_id){
        Tldrs.update(tldr_id, {$pull: {readBy:user_id}});
    },
    tldr_read: function (tldr_id, user_id){
        Tldrs.update(tldr_id, {$addToSet: {readBy:user_id}});
    },
    filters: function (args) {
        return { $and: args }
    },
    createLanguageFilter: function (languages) {
        Session.set('language_filter', {'language.language': { $in: languages } });
    }
    
    
});