import 'dotenv/config'; 

const MY_VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;

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

        });
        res.status(200).send('EVENT_RECEIVED');
    }
    else {
        res.sendStatus(404);
    }
}



let handleMessages = (sender_psid, received_message) => {

}


let handlePostback = (sender_psid, received_postback) => {

}


let callSendAPI = (sender_psid, response) => {

}


export default {
    getHomePage: getHomePage,
    getWebhook: getWebhook,
    postWebhook: postWebhook
}