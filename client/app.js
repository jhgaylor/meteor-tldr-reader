Meteor.subscribe('tldrs');

Meteor.startup(function () {
  Session.setDefault('read_filter', {});
  Session.setDefault('read_filter_selection', 'all');
  Session.setDefault('language_filter_value', ["en", "de"]);

});

Deps.autorun(function () {
    filterset = Session.get('current_filterset') || {name: "", filters: []}
    $('#current_filterset_name').val(filterset && filterset.name)
    $('#current_filterset_filters').val(filterset && filterset.filters)//JSON.stringify(filterset.filters))
    Session.set('language_filter', {'language.language': { $in: Session.get('language_filter_value') } })  
})

Template.user_filterset.events({
  'click #new_filterset': function (event) {
    var name = $('#current_filterset_name').val();
    var filters = $('#current_filterset_filters').val();
    var filterset = {name:name, filters:filters};
    Meteor.call('user_add_filterset', filterset);
    Session.set('current_filterset', filterset);

  },
  'click #save_filterset': function (event) {
    var name = $('#current_filterset_name').val();
    var filters = $('#current_filterset_filters').val();//$.parseJSON($('#current_filterset_filters').val());
    var filterset = {name:name, filters:filters}
    Meteor.call('user_update_filterset', Session.get('current_filterset'), filterset)
    Session.set('current_filterset', filterset)
  },
  'click #delete_filterset': function (event) {
    Meteor.call('user_remove_filterset', Session.get('current_filterset'))
  },
})

Template.user_filtersets_list.filtersets = function () {
  if(!Meteor.loggingIn()){
    if(Meteor.user()){
      return Meteor.user().profile.filtersets;
    }
  }
};

Template.user_filtersets_list.events({
  'click li': function (event) {
    Session.set('current_filterset', this);
  },
});

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
  
  //this probably needs to be refactored.  My application will probably depend on swapping the sets of filters
  //easily and quickly.  for instance, different 'columns' can have different filters (authors, terms, languages)
  
  //DONT SHIP THIS NEXT LINE.  FOR THE LOVE OF GOD DON'T SHIP IT.
  var filterset_filters = Session.get('current_filterset') && eval("a="+Session.get('current_filterset').filters);
  Session.set('current_filters', [Session.get('read_filter'), Session.get('language_filter')].concat(filterset_filters || []))
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
  'click tr': function (event) {
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

Template.tldrs_list_item.author = function () {
    return this.creator.usernameForDisplay;
}

//Template helpers.
Template.tldrs_list_item.helpers({
  wasRead: function (tldr) {  
    //returns css class name 'read' or 'unread' for the tldr
    var sel = {id:this._id, readBy: {$in: [Meteor.userId()]}};
    return Tldrs.findOne(sel) ? "read" : "unread"
  },

});


