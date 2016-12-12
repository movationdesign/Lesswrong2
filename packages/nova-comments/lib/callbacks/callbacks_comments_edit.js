import marked from 'marked';
import Telescope from 'meteor/nova:lib';
import Posts from "meteor/nova:posts";
import Comments from '../collection.js';
import Users from 'meteor/nova:users';
import { Callbacks } from 'meteor/nova:core';

// ------------------------------------- comments.edit.validate -------------------------------- //

function CommentsEditUserCheck (modifier, comment, user) {
  if (!user || !Users.canEdit(user, comment)) {
    throw new Meteor.Error(601, 'sorry_you_cannot_edit_this_comment');
  }
  return modifier;
}
Callbacks.add("comments.edit.validate", CommentsEditUserCheck);

function CommentsEditSubmittedPropertiesCheck (modifier, comment, user) {
  const schema = Posts.simpleSchema()._schema;
  // go over each field and throw an error if it's not editable
  // loop over each operation ($set, $unset, etc.)
  _.each(modifier, function (operation) {
    // loop over each property being operated on
    _.keys(operation).forEach(function (fieldName) {

      var field = schema[fieldName];
      if (!Users.canEditField(user, field, comment)) {
        throw new Meteor.Error("disallowed_property", 'disallowed_property_detected' + ": " + fieldName);
      }

    });
  });
  return modifier;
}
Callbacks.add("comments.edit.validate", CommentsEditSubmittedPropertiesCheck);


// ------------------------------------- comments.edit.sync -------------------------------- //

function CommentsEditGenerateHTMLBody (modifier, comment, user) {
  // if body is being modified, update htmlBody too
  if (modifier.$set && modifier.$set.body) {
    modifier.$set.htmlBody = Telescope.utils.sanitize(marked(modifier.$set.body));
  }
  return modifier;
}
Callbacks.add("comments.edit.sync", CommentsEditGenerateHTMLBody);