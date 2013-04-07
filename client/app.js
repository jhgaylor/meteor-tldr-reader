Meteor.subscribe('tldrs');

Meteor.startup(function () {
  Session.setDefault('read_filter', {});
  Session.setDefault('read_filter_selection', 'all');
  Session.setDefault('language_filter_value', ["en", "de"]);

});

Template.user_filterset.events({
  'click #new_filterset': function (event) {
    console.log("this is where u stopped");
    //Meteor.call('user_add_filterset', {name:"New Filterset", filters:[]})
  },
})

Template.user_filtersets_list.filtersets = function () {
  if(!Meteor.loggingIn()){
    return Meteor.user().profile.filtersets;
  }
};

Template.current_tldr_reader.tldr = function () {
  //return currently selected tldr for read panel
  
  return Tldrs.findOne({_id:Session.get('current_tldr')});
  
    
};

//Event Handlers
Template.current_tldr_reader.events({
  'click #mark-unread': function (event) {
    Meteor.call('tldr_mark_unread', Session.get('current_tldr'), Meteor.userId());
  }
});

Template.tldrs_list.tldrs = function () {
  Session.set('language_filter', {'language.language': { $in: Session.get('language_filter_value') } })
  //this probably needs to be refactored.  My application will probably depend on swapping the sets of filters
  //easily and quickly.  for instance, different 'columns' can have different filters (authors, terms, languages)
  Session.set('current_filters', [Session.get('read_filter'), Session.get('language_filter')])
  return Tldrs.find({$and: Session.get('current_filters')}).fetch();
};

//Template Helpers
Template.tldrs_list.helpers({
  readFileterActiveSelector: function (other) {
    //returns the name of the active read selector for btn-group
    return Session.get('read_filter_selection') == other
  },
  

})

//Event Handlers
Template.tldrs_list.events({
  'click li': function (event) {
    Session.set('current_tldr', this._id);
    Meteor.call('tldr_mark_read', this._id, Meteor.userId());
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
    c.getLatestTldrs(50, function(e, data){
        data.forEach(function (item) {
            item.readBy = item.readyBy || []
            Tldrs.insert(item)
        })
    });
  }
});

//Template helpers.
Template.tldrs_list_item.helpers({
  wasRead: function (tldr) {  
    //returns css class name 'read' or 'unread' for the tldr
    var sel = {id:this._id, readBy: {$in: [Meteor.userId()]}};
    return Tldrs.findOne(sel) ? "read" : "unread"
  },
});


