Meteor.subscribe('tldrs');

Meteor.startup(function () {
  
});

Template.current_tldr_reader.tldr = function () {
  return Tldrs.findOne({_id:Session.get('current_tldr')});
};

Template.current_tldr_reader.events({
  'click #mark-unread': function (event) {
    Meteor.call('tldr_unread', Session.get('current_tldr'), Meteor.userId());
  }
});

Template.tldrs_list.tldrs = function () {
  Session.setDefault('read_filter', {});
  return Tldrs.find(Session.get('read_filter')).fetch();
};


Template.tldrs_list.helpers({
  activeSelector: function (other) {
    return Session.get('read_filter_selection') == other
  }
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
});

Template.tldrs_list_item.wasRead = function (tldr) {  
  return Tldrs.findOne({id:this._id, readBy: {$in: [Meteor.userId()]}}) != void 0 ? "read" : "unread"
};


