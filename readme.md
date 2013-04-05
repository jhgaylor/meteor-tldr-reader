## Log:

### Installed meteor

### created meteor app

    meteor create tldr
    mkdir client lib public server shared


### Added Meteor components
    meteor add accounts-ui accounts-password bootstrap jquery

### Removed Meteor components
    meteor remove autopublish

### cloned my repo of the js client
    cd lib/
    git clone https://github.com/jhgaylor/api-js-client.git

### created the tldrs collection
in shared/bootstrap.js

    Tldrs = Meteor.collection('tldrs')


This gives access to the collection to both the server and the client

### Published the tldrs collection
in server/bootstrap.js


    Meteor.publish('tldrs', function () {
        return Tldrs.find();
    })


This allows subscribers to access the collection.  For now I want all the records available to my client.

### Subscribed the client to the tldrs collection
in client/app.js

    Meteor.subscribe('tldrs');


This will tell the client to listen for changes to tldrs


### exposed the client
For now I am exposing the TLDR api client to both the server and client, but I won't be programming the client to use the TLDR api client.  It's just for access via the chrome console

    c = new Client({
        name: "jakegaylor",
        key: "8P5mD26fGye43y66K5p5"
    });


### Get some data!
I needed some TLDR's to start creating the UI with, so I got some!  Here is the helper i used

    
    function get_data () {
        c.getLatestTldrs(10, function(e, data){
            data.forEach(function (item) {
                TLDRS.insert(item)
            })
        });
    }

I then called the method via the console. Now I have 10 data points to start working on a ui.
My app doesn't have any need to restructure the data provided by TLDR.  All the server side work will be keep state synced and make requests to tldr.io