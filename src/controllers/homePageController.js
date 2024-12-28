import 'dotenv/config'; 
import request from 'request';
const MY_VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
let getHomePage = (req, res) => {
    res.render('homePage.ejs')
}


let getWebhook = (req, res) => {
    let VERIFY_TOKEN = MY_VERIFY_TOKEN;
    let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    // Check the mode and token sent is correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Respond with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
}


let postWebhook = (req, res) => {
    let body = req.body;
    if(body.object === 'page'){
        body.entry.forEach(function(entry){
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);


            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            if(webhook_event.message){
                handleMessages(sender_psid, webhook_event.message);
            } else if(webhook_event.postback){
                handlePostback(sender_psid, webhook_event.postback);
            } 

        });
        res.status(200).send('EVENT_RECEIVED');
    }
    else {
        res.sendStatus(404);
    }
}



let handleMessages = (sender_psid, received_message) => {
    let response;

    if (received_message.text) {
        response = {
            "text": `You sent the message: "${received_message.text}". Now send me an image!`
        }
    }
    else if(received_message.attachments){
        let attachment_url = received_message.attachments[0].payload.url;
        response = {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [{
                "title": "Is this the right picture?",
                "subtitle": "Tap a button to answer.",
                "image_url": attachment_url,
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Yes!",
                    "payload": "yes",
                  },
                  {
                    "type": "postback",
                    "title": "No!",
                    "payload": "no",
                  }
                ],
              }]
            }
          }
        }
    
    }

    callSendAPI(sender_psid, response);

}


let handlePostback = (sender_psid, received_postback) => {
    let response;
  
    // Get the payload for the postback
    let payload = received_postback.payload;
  
    // Set the response based on the postback payload
    if (payload === 'yes') {
      response = { "text": "Thanks!" }
    } else if (payload === 'no') {
      response = { "text": "Oops, try sending another image." }
    }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
}


let callSendAPI = (sender_psid, response) => {
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    request({
        "uri": "https://graph.facebook.com/v6.0/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if(!err){
            console.log('message sent!');
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}


export default {
    getHomePage: getHomePage,
    getWebhook: getWebhook,
    postWebhook: postWebhook
}