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

```
Tldrs = Meteor.collection('tldrs')
```

This gives access to the collection to both the server and the client

### Published the tldrs collection
in server/bootstrap.js

```
Meteor.publish('tldrs', function () {
return Tldrs.find();
})
```

This allows subscribers to access the collection.  For now I want all the records available to my client.

### Subscribed the client to the tldrs collection
in client/app.js

```
Meteor.subscribe('tldrs');
```

This will tell the client to listen for changes to tldrs