Tldrs = new Meteor.Collection("tldrs");
Filtersets = new Meteor.Collection("user_filtersets");

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
    // filters: function (args) {
    //     return { $and: args }
    // },
    // buildFilters: function () {
    //   and = function (selectors) {
    //     return {$and: selectors}
    //   };

    // }
    
});



Meteor.startup(function () {
    
  /**
   * Javascript client for the tldr.io API
   * MIT License, tldr.io
   *
   */

  /**
   * Create a new client for the tldr.io API
   * @param {Object} options Object containing the credentials
   *                           name: api client name
   *                           key: api client key
   */

  //Short term scoping fix.  need to bundle this sometime
  Client = function Client (options) {
    if (!options) { throw 'Missing options'; }
    if (!options.name) { throw 'Missing API client name'; }
    if (!options.key) { throw 'Missing API client key'; }

    this.name = options.name;
    this.key = options.key;
    this.apiUrl = 'https://api.tldr.io';
  };

  /**
   * Retrieve the contents of a url
   * @param {String} url URL to retrieve
   * @param {String} method HTTP method to use
   * @param {Function} callback Will be called after the request is processed. Signature err, tldrs
   *                            err is a message explaining the error, or null if no error
   *                            tldrs is an array of the retrieved tldrs or an object if tldrs.length == 1
   * @param {Object} options An optional last parameter
  */
  Client.prototype.callURL = function (url, method, callback, options){
    var options = options == void 0 ? {} : options;

    $.ajax({ type: method
             , url: url
             , data: options['data'] ? options['data'] : ""
             , headers: { 'api-client-name': this.name,
                          'api-client-key': this.key
                      }
             })
    .done(function (data) { callback(null, data); })
    .fail(function (jqxhr) {
      if (jqxhr.status === 404) { return callback('URL not found'); }
      if (jqxhr.status === 401) { return callback(jqxhr.responseText); }

      return callback('An unknown error happened');
    });
  };
  
  /**
   * Fetch the latest tldrs
   * GET /tldrs/latest/:number
   * @param {Object} number How many latest tldrs to fetch (max possible is 10)
   * @param {Function} callback Will be called after request is processed. Signature: err, tldrs
   *                            err is a message explaining the error, or null if no error
   *                            tldrs is an array of the retrieved tldrs
   *
   */
  Client.prototype.getLatestTldrs = function (number, callback) {
    var url = this.apiUrl + '/tldrs/latest/' + number;
    var method = 'GET';
    this.callURL(url, method, callback);
  };

  /**
   * Search a tldr by url
   * GET /tldrs/search?url=:url
   * @param {String} url
   * @param {Function} callback Will be called after request is processed. Signature: err, tldr
   *                            err is a message explaining the error, or null if no error
   *                            tldr is the tldr
   *
   */
  Client.prototype.searchByUrl = function (url, callback) {
    var url = this.apiUrl + '/tldrs/search?url=' + encodeURIComponent(url);
    var method = 'GET';
    this.callURL(url, method, callback);
  };    


  /**
   * Search tldrs by batch
   * POST /tldrs/searchBatch
   * @param {Array} urls Array of urls whose tldr we want
   * @param {Function} callback Will be called after request is processed. Signature: err, tldrs
   *                            err is a message explaining the error, or null if no error
   *                            tldrs is an array of the tldrs, in the same order
   *
   */
  Client.prototype.searchBatch = function (urls, callback) {
    var url = this.apiUrl + '/tldrs/searchBatch'
    var method = 'POST';
    var options = {data:{ batch: urls }};
    this.callURL(url, method, callback, options);
  };

  // Expose the client constructor in the global object
  if (typeof window === 'undefined') {
    
  } else {
    window.TldrioApiClient = Client;
  }


    c = new Client({
        name: "jakegaylor",
        key: "8P5mD26fGye43y66K5p5"
    });
});