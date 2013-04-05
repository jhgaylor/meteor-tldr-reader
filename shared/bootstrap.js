Tldrs = new Meteor.Collection("tldrs");


Meteor.startup(function () {
    c = new Client({
        name: "jakegaylor",
        key: "8P5mD26fGye43y66K5p5"
    });

});

function get_data (client) {
    client.getLatestTldrs(10, function(e, data){
        data.forEach(function (item) {
            item.readBy = item.readyBy || []
            Tldrs.insert(item)
        })
    });
}