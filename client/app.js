Meteor.subscribe('tldrs');

Meteor.startup(function () {

});

Template.read_tldr.tldr = function () {
  return Tldrs.findOne({_id:Session.get('read_tldr')});
}

Template.tldrs_list.tldrs = function () {
    return Tldrs.find().fetch();
};

Template.tldrs_list_item.wasRead = function (tldr) {
  
    return Tldrs.findOne({id:this._id, readBy: {$in: [Meteor.userId()]}}) != void 0 ? "read" : "unread"
  


}

Template.tldrs_list.events({
  'click li': function (event) {
    Session.set('read_tldr', this._id);
    Tldrs.update(this._id, {$addToSet: {readBy:Meteor.userId()}})
    
    console.log(this);
  },
})