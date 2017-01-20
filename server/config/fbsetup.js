/* eslint-disable brace-style */
/* eslint-disable camelcase */
import request from 'request';

module.exports = function (controller) {
  // subscribe to page events
  request.post('https://graph.facebook.com/me/subscribed_apps?access_token=' + process.env.ACCESS_TOKEN,
    function (err, res, body) {
      if (err) {
        controller.log('Could not subscribe to page messages')
      }
      else {
        controller.log('Successfully subscribed to Facebook events:', body)
        console.log('Botkit can now receive messages')

        // start ticking to send conversation messages
        controller.startTicking()
      }
    })

  var url = 'https://graph.facebook.com/v2.6/me/thread_settings?access_token=' + process.env.ACCESS_TOKEN;

  // // set up CTA for FB page
  // var burgerMenu = {
  //   'setting_type' : 'call_to_actions',
  //   'thread_state' : 'existing_thread',
  //   'call_to_actions':[
  //     {
  //       'type':'postback',
  //       'title':'Hello',
  //       'payload':'hello'
  //     },
  //     {
  //       'type':'postback',
  //       'title':'Start a New Order',
  //       'payload':'DEVELOPER_DEFINED_PAYLOAD_FOR_START_ORDER'
  //     }
  //   ]
  // };

  // request.post(url, {form: burgerMenu}, function (err, response, body) {
  //   if (err) {
  //     console.log(err);
  //   }
  //   else {
  //     console.log('CTA added', body);
  //   }
  // });

  // set up persistent menu
  var persistentMenu = {
    'setting_type' : 'call_to_actions',
    'thread_state' : 'existing_thread',
    'call_to_actions':[
      {
        'type': 'postback',
        'title': 'View QRCode',
        'payload': 'View QRCode',
      },
      {
        'type': 'postback',
        'title': 'My Account',
        'payload': 'My Account',
      },
      {
        'type': 'postback',
        'title': 'View Rewards',
        'payload': 'View Rewards',
      },
      {
        'type': 'postback',
        'title': 'Claim Rewards at Store',
        'payload': 'Claim Rewards at Store',
      },
      {
        'type': 'postback',
        'title': 'View News and Promos',
        'payload': 'View News and Promos',
      }
    ]
  }

  request.post(url, {form: persistentMenu}, function (err, response, body) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('permanent menu added', body);
    }
  })

  // set up greetings
  var greetingForm = {
    'setting_type':'greeting',
    'greeting':{
      'text': `WashLane Rewards is the loyalty program of WashLane Waterless Carwash & Detailing.
               Earn points by presenting your loyalty qrcode every time 
               you avail our services at WashLane.`
    }
  }

  request.post(url, {form: greetingForm}, function (err, response, body) {
    if (err) {
      console.log(err)
    } else {
      console.log('greetings added', body)
    }
  })

  var gettingStarted = {
    "setting_type":"call_to_actions",
    "thread_state":"new_thread",    
    "call_to_actions":[
      {
        "payload":"Get Started"
      }
    ]
  }

  request.post(url, {form: gettingStarted}, function (err, response, body) {
    if (err) {
      console.log(err)
    } else {
      console.log('getting started added', body)
    }
  })
}

/* eslint-disable brace-style */
/* eslint-disable camelcase */