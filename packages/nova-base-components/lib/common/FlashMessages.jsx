import { Components, registerComponent } from 'meteor/nova:lib';
import { withMessages } from 'meteor/nova:core';
import React from 'react';

const FlashMessages = ({messages, clear, markAsSeen}) => {
  return <p>repair me!</p>
  return (
    <div className="flash-messages">
      {messages
        .filter(message => message.show)
        .map(message => <Components.Flash key={message._id} message={message} clear={clear} markAsSeen={markAsSeen} />)}
    </div>
  );
}

FlashMessages.displayName = "FlashMessages";

registerComponent('FlashMessages', FlashMessages, withMessages);
