/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/webhooks              ->  index
 * POST    /api/webhooks              ->  create
 * GET     /api/webhooks/:id          ->  show
 * PUT     /api/webhooks/:id          ->  update
 * DELETE  /api/webhooks/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Botkit from 'botkit';
import request from 'request';
import * as User from '../user/user.controller';

const BOT_CONTROLLER = Botkit.facebookbot({
                  access_token: process.env.ACCESS_TOKEN,
                  verify_token: process.env.VERIFY_TOKEN
                 });

const bot = BOT_CONTROLLER.spawn({});

// SETUP
require('../../config/fbsetup')(BOT_CONTROLLER);

BOT_CONTROLLER.on('facebook_optin', function (bot, message) {
  bot.reply(message, 'Welcome, friend');
})

// user said hello
BOT_CONTROLLER.hears(['hello'], 'message_received', function (bot, message) {
  bot.reply(message, {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [{
          title: "rift",
          subtitle: "Next-generation virtual reality",
          item_url: "https://www.oculus.com/en-us/rift/",    
          image_url: "http://messengerdemo.parseapp.com/img/rift.png",
          buttons: [{
            type: "web_url",
            url: "https://www.oculus.com/en-us/rift/",
            title: "Open Web URL"
          }, {
            type: "postback",
            title: "Call Postback",
            payload: "Payload for first bubble",
          }],
        }, {
          title: "touch",
          subtitle: "Your Hands, Now in VR",
          item_url: "https://www.oculus.com/en-us/touch/",               
          image_url: "http://messengerdemo.parseapp.com/img/touch.png",
          buttons: [{
            type: "web_url",
            url: "https://www.oculus.com/en-us/touch/",
            title: "Open Web URL"
          }, {
            type: "postback",
            title: "Call Postback",
            payload: "Payload for second bubble",
          }]
        }]
      }
    }
  });
})

const askMobileNum = (err, convo) => {
  convo.ask('To get started, please enter your mobile number(09XXXXXXXXX)',
    [
      {
        pattern: '^(09)\\d{9}',
        callback: (response, convo) => {
          convo.setVar('mobileNumber',response.text);
          confirmNum(response,convo);
          convo.next();
        }
      },
      {
        default: true,
        callback: (response, convo) => {
          convo.repeat();
          convo.next();
        }
      }
    ]
  );
};

const confirmNum = (err, convo) => {
  convo.ask({
      'text': 'are you sure you want to use this mobile number: {{vars.mobileNumber}} ?',
      quick_replies: [{
        content_type: 'text',
        title: 'Yes',
        payload: 'yes',
      }, {
        content_type: 'text',
        title: 'No',
        payload: 'no',
      }]
    }, 
    [ 
      {
        pattern: 'yes',
        callback: (response, convo) => {
          userVerifcation(response, convo)
          convo.next();
        }
      },
      {
        pattern: 'no',
        callback: (response, convo) => {
          askMobileNum(null, convo);
          convo.next();
        }
      },
      {
        default: true,
        callback: (response, convo) => {
          convo.changeTopic('bad_response');
        }
      }
    ]);
};

const userVerifcation = (response, convo) => {
  convo.say('Please enter the verification code sent to your mobile number: {{vars.mobileNumber}}');
  convo.ask(
    {
      text: 'If you haven\'t received the verification in 5 minutes. Please tap the Resend button',
      quick_replies: [{
        content_type: 'text',
        title: 'Resend',
        payload: 'resend',
      }, {
        content_type: 'text',
        title: 'Call Customercare',
        payload: 'customercare', 
      }]
    },
    [ 
      {
        pattern: 'resend',
        callback: (response, convo) => {
          console.log('resend');
        }
      },
      {
        pattern: 'customercare',
        callback: (response, convo) => {
          console.log('customercare');
        }
      },
      {
        pattern: '\\d{4}',
        callback: (response, convo) => {
          console.log('pattern works');
          //validation of verification code
          let validate = true;
          if(validate) {
            convo.say('Your account has been successfully activated');
            mainMenu(response, convo);
          } else {
            convo.say('Invalid Code, Please try again.');
            convo.repeat();
          }
          convo.next();
        }
      },
      {
        default: true,
        callback: (response, convo) => {
          console.log('eto na yun?');
          convo.repeat();
          convo.next();
        }
      }
    ]
  );
};

const mainMenu = (response, convo) => {
  convo.ask(
    {
      text: 'Please select one',
      quick_replies: [
        {
          content_type: 'text',
          title: 'View QRCode',
          payload: 'View QRCode',
        },
        {
          content_type: 'text',
          title: 'My Account',
          payload: 'My Account',
        },
        {
          content_type: 'text',
          title: 'View Rewards',
          payload: 'View Rewards',
        },
        {
          content_type: 'text',
          title: 'Claim Rewards at Store',
          payload: 'Claim Rewards at Store',
        },
        {
          content_type: 'text',
          title: 'View News and Promos',
          payload: 'View News and Promos',
        }
      ]
    },
    [ 
      {
        pattern: 'View QRCode',
        callback: (response, convo) => {
          viewBarcode(response, convo);
          convo.next();
        }
      },
      {
        pattern: 'My Account',
        callback: (response, convo) => {
          myAccount(response, convo);
          convo.next();
        }
      },
      {
        pattern: 'View Rewards',
        callback: (response, convo) => {
          checkRewards(response, convo);
          convo.next();
        }
      },
      {
        pattern: 'Claim Rewards at Store',
        callback: (response, convo) => {
          convo.say('TODO Claim Rewards at Store');
          convo.next();
        }
      },
      {
        pattern: 'View News and Promos',
        callback: (response, convo) => {
          convo.say('View News and Promos');
          convo.next();
        }
      },
      {
        default: true,
        callback: (response, convo) => {
          convo.repeat();
          convo.next();
        }
      }
    ]
  );
};

//Menu's
const viewBarcode = (response, convo) => {
  convo.say('WashLane Rewards QRCode');
  convo.say({
    attachment: {
      type: 'image',
      payload: {
        url: 'http://cdnqrcgde.s3-eu-west-1.amazonaws.com/wp-content/uploads/2013/11/jpeg.jpg'
      }
    }
  });
  mainMenu(response, convo);
};

const myAccount = (response, convo) => {
  convo.ask({
    attachment: {
        type: 'template',
        payload: {
            template_type: 'button',
            text: 'My Account: ',
            buttons: [{
              "title": "View Balance",
              "type": "postback",
              "payload": "View Balance"
            }, {
              "title": "Update Profile",
              "type": "postback",
              "payload": "Update Profile"
            }, {
              "title": "Access WashLane Wifi",
              "type": "postback",
              "payload": "payload"
            }]
          }
    }
  },
  [
    {
      pattern: 'View Balance',
      callback: function(response,convo) {
        viewBalance(response, convo);
        convo.next();
      }
    },
    {
      pattern: 'Update Profile',
      callback: function(response,convo) {
        convo.say('Under construction');
        myAccount(response, convo);
        convo.next();
      }
    },
    {
      default: true,
      callback: (response, convo) => {
        mainMenu(response, convo);
        convo.next();
      }
    }
  ]);
};

const viewBalance = (response, convo) => {
  convo.ask({
    attachment: {
        type: 'template',
        payload: {
            template_type: 'button',
            text: 'Check Balance: ',
            buttons: [{
              "title": "Points",
              "type": "postback",
              "payload": "Points"
            }, {
              "title": "e-Stamps",
              "type": "postback",
              "payload": "e-Stamps"
            }, {
              "title": "Raffle Entries",
              "type": "postback",
              "payload": "Raffle Entries"
            }]
          }
    }
  },
  [
    {
      pattern: 'Points',
      callback: function(response,convo) {
        convo.say('You have 0.0 points in your account.');
        myAccount(response, convo);
        convo.next();
      }
    },
    {
      pattern: 'e-Stamps',
      callback: function(response,convo) {
        convo.say('You have 0 e-Stamps in your account.');
        myAccount(response, convo);
        convo.next();
      }
    },
    {
      pattern: 'Raffle Entries',
      callback: function(response,convo) {
        convo.say('You have 0 raffle entries in your account.');
        myAccount(response, convo);
        convo.next();
      }
    },
    {
      default: true,
      callback: (response, convo) => {
        mainMenu(response, convo);
        convo.next();
      }
    }
  ]);
};

const checkRewards = (response, convo) => {
  convo.ask({
    attachment: {
        type: 'template',
        payload: {
            template_type: 'button',
            text: 'View Rewards: ',
            buttons: [{
              "title": "Points",
              "type": "postback",
              "payload": "Points"
            }, {
              "title": "e-Stamps",
              "type": "postback",
              "payload": "e-Stamps"
            }, {
              "title": "Raffle Entries",
              "type": "postback",
              "payload": "Raffle Entries"
            }]
          }
    }
  },
  [
    {
      pattern: 'Points',
      callback: function(response,convo) {
        showRewards(response,convo);
        convo.next();
      }
    },
    {
      pattern: 'e-Stamps',
      callback: function(response,convo) {
        showRewards(response,convo);
        convo.next();
      }
    },
    {
      pattern: 'Raffle Entries',
      callback: function(response,convo) {
        showRewards(response,convo);
        convo.next();
      }
    },
    {
      default: true,
      callback: (response, convo) => {
        mainMenu(response, convo);
        convo.next();
      }
    }
  ]);
};

const showRewards = (response, convo) => {
  convo.ask({
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [{
          title: "Item Reward 1",
          subtitle: "Next-generation virtual reality",
          item_url: "https://www.oculus.com/en-us/rift/",    
          image_url: "http://messengerdemo.parseapp.com/img/rift.png",
          buttons: [{
            type: "web_url",
            url: "https://www.oculus.com/en-us/rift/",
            title: "Open Web URL"
          }, {
            type: "postback",
            title: "Redeem Reward",
            payload: "Redeem Item 1"
          }],
        }, {
          title: "Item Reward 2",
          subtitle: "Your Hands, Now in VR",
          item_url: "https://www.oculus.com/en-us/touch/",               
          image_url: "http://messengerdemo.parseapp.com/img/touch.png",
          buttons: [{
            type: "web_url",
            url: "https://www.oculus.com/en-us/touch/",
            title: "Open Web URL"
          }, {
            type: "postback",
            title: "Call Postback",
            payload: "Redeem Item 2"
          }]
        }]
      }
    }
  },
  [
    {
      default: true,
      callback: (response, convo) => {
        convo.say('you dont have enough points');
        mainMenu(response, convo);
        convo.next();
      }
    }
  ]);
}

// Initial Process
BOT_CONTROLLER.hears(['Get Started'], 'message_received', function (bot, message) {
  bot.reply(message, 'Hey there! Thanks for getting in touch with WashLane. 70mb you can use on WashLane WiFi.');
  console.log('message!', message.user);
  let form = {
    form: ['first_name','last_name','profile_pic','locale','timezone','gender'],
    access_token: process.env.ACCESS_TOKEN
  };
  request(`https://graph.facebook.com/v2.6/${message.user}?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=${process.env.ACCESS_TOKEN}`,
    function(err, resp, body) {
      console.log('test', body);
  });
  bot.startConversation(message, askMobileNum);
});

BOT_CONTROLLER.hears(['View QRCode'], 'message_received', function (bot, message) {
  bot.startConversation(message, viewBarcode);
});

BOT_CONTROLLER.hears(['My Account'], 'message_received', function (bot, message) {
  bot.startConversation(message, myAccount);
});

BOT_CONTROLLER.hears(['View Rewards'], 'message_received', function (bot, message) {
  bot.startConversation(message, checkRewards);
});

// BOT_CONTROLLER.hears(['^(09)\\d{9}'], 'message_received', function (bot, message) {
//   bot.reply(message, `are you sure you want to use this mobile number: ${message.text} ?`);
// })


// this function processes the POST request to the webhook
var handler = function (obj) {
  BOT_CONTROLLER.debug('Message received from FB')
  var message
  if (obj.entry) {
    for (var e = 0; e < obj.entry.length; e++) {
      for (var m = 0; m < obj.entry[e].messaging.length; m++) {
        var facebook_message = obj.entry[e].messaging[m];

        // normal message
        if (facebook_message.message) {
          message = {
            text: facebook_message.message.text,
            user: facebook_message.sender.id,
            channel: facebook_message.sender.id,
            timestamp: facebook_message.timestamp,
            seq: facebook_message.message.seq,
            mid: facebook_message.message.mid,
            attachments: facebook_message.message.attachments
          }

          // save if user comes from m.me adress or Facebook search
          // create_user_if_new(facebook_message.sender.id, facebook_message.timestamp);

          BOT_CONTROLLER.receiveMessage(bot, message)
        }
        // When a user clicks on "Send to Messenger"
        else if (facebook_message.optin ||
                (facebook_message.postback && facebook_message.postback.payload === 'optin')) {
          message = {
            optin: facebook_message.optin,
            user: facebook_message.sender.id,
            channel: facebook_message.sender.id,
            timestamp: facebook_message.timestamp
          }

          // save if user comes from "Send to Messenger"
          request()
          // create_user_if_new(facebook_message.sender.id, facebook_message.timestamp)

          BOT_CONTROLLER.trigger('facebook_optin', [bot, message])
        }
        // clicks on a postback action in an attachment
        else if (facebook_message.postback) {
          // trigger BOTH a facebook_postback event
          // and a normal message received event.
          // this allows developers to receive postbacks as part of a conversation.
          message = {
            payload: facebook_message.postback.payload,
            user: facebook_message.sender.id,
            channel: facebook_message.sender.id,
            timestamp: facebook_message.timestamp
          }

          BOT_CONTROLLER.trigger('facebook_postback', [bot, message])

          message = {
            text: facebook_message.postback.payload,
            user: facebook_message.sender.id,
            channel: facebook_message.sender.id,
            timestamp: facebook_message.timestamp
          }

          BOT_CONTROLLER.receiveMessage(bot, message)
        }
        // message delivered callback
        else if (facebook_message.delivery) {
          message = {
            optin: facebook_message.delivery,
            user: facebook_message.sender.id,
            channel: facebook_message.sender.id,
            timestamp: facebook_message.timestamp
          }

          BOT_CONTROLLER.trigger('message_delivered', [bot, message])
        }
        else {
          BOT_CONTROLLER.log('Got an unexpected message from Facebook: ', facebook_message)
        }
      }
    }
  }
}


// Gets a list of Webhooks
export function index(req, res) {
  if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong validation token');
  }
}


// Creates a new Webhook in the DB
export function create(req, res) {
  handler(req.body);
  res.send('ok');
}

