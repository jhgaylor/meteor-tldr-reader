Meteor.subscribe('tldrs');

Meteor.startup(function () {
    
});

Template.read_tldr.tldr = function () {
  return Tldrs.findOne({_id:Session.get('read_tldr')});
}

Template.tldrs_list.tldrs = function () {
    return Tldrs.find().fetch();
};

Template.tldrs_list.events({
  'click li': function (event) {
    Session.set('read_tldr', this._id);
    console.log(this);
  },
})