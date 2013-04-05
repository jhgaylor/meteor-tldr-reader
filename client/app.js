Meteor.subscribe('tldrs');

Meteor.startup(function () {
  Session.setDefault('read_filter', {});
  Session.setDefault('read_filter_selection', 'all');
  Session.setDefault('language_filter_value', ["en", "de"]);
});

Template.current_tldr_reader.tldr = function () {
  Meteor.call('createLanguageFilter', Session.get('language_filter_value'));
  return Tldrs.findOne({_id:Session.get('current_tldr')});
};

Template.current_tldr_reader.events({
  'click #mark-unread': function (event) {
    Meteor.call('tldr_unread', Session.get('current_tldr'), Meteor.userId());
  }
});

Template.tldrs_list.tldrs = function () {
  //this probably needs to be refactored.  My application will probably depend on swapping the sets of filters
  //easily and quickly.  for instance, different 'columns' can have different filters (authors, terms, languages)
  return Tldrs.find({$and: [Session.get('read_filter'), Session.get('language_filter')]}).fetch();
};


Template.tldrs_list.helpers({
  activeSelector: function (other) {
    return Session.get('read_filter_selection') == other
  },
  

})

Template.tldrs_list.events({
  'click li': function (event) {
    Session.set('current_tldr', this._id);
    Meteor.call('tldr_read', this._id, Meteor.userId());
    console.log(this);
  },
  'click #all-items': function (event) {
    Session.set('read_filter', {});
    Session.set('read_filter_selection', 'all')
  },
  'click #unread-items': function (event) {
    Session.set('read_filter', {readBy: {$not: {$in: [Meteor.userId()]}} } );
    Session.set('read_filter_selection', 'unread')
  },
  'click #read-items': function (event) {
    Session.set('read_filter', {readBy: {$in: [Meteor.userId()]}});
    Session.set('read_filter_selection', 'read')
  },
  'change #language_selection': function (event) {
    $_ = $(event.currentTarget);
    Session.set('language_filter_value', $_.val().split(','))
  },
  'click #get_data': function () {
    c.getLatestTldrs(10, function(e, data){
        data.forEach(function (item) {
            item.readBy = item.readyBy || []
            Tldrs.insert(item)
        })
    });
  }
});

Template.tldrs_list_item.wasRead = function (tldr) {  
  return Tldrs.findOne({id:this._id, readBy: {$in: [Meteor.userId()]}}) != void 0 ? "read" : "unread"
};


