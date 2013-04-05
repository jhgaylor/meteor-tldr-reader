Tldrs = new Meteor.Collection("tldrs");

Meteor.startup(function () {
    c = new Client({
        name: "jakegaylor",
        key: "8P5mD26fGye43y66K5p5"
    });

});

function get_data () {
    c.getLatestTldrs(10, function(e, data){
        data.forEach(function (item) {
            TLDRS.insert(item)
        })
    });
}