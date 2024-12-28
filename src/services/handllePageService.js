import request from "request";
import 'dotenv/config'; 
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
let handleSetupProfileAPI = () => {
    return new Promise((resolve, reject) => {
        try {
            let url = `https://graph.facebook.com/v21.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`
            
            let request_body = {
                "get_started": {
                    "payload": "GET_STARTED"
                },
                "persistent_menu": [
                    {
                        "locale": "default",
                        "composer_input_disabled": false,
                        "call_to_actions": [
                            {
                                "type": "postback",
                                "title": "Talk to an agent",
                                "payload": "CARE_HELP"
                            },
                            {
                                "type": "postback",
                                "title": "Outfit suggestions",
                                "payload": "CURATION"
                            },
                            {
                                "type": "web_url",
                                "title": "Shop now",
                                "url": "https://www.originalcoastclothing.com/",
                                "webview_height_ratio": "full"
                            }
                        ]
                    }
                ],
                "whitelisted_domains": ["https://app-chat-messenger.onrender.com/"],
                "greeting": [
                    {
                        "locale": "default",
                        "text": "Hello {{user_first_name}}! I am a chatbot"
                    }
                ]  
            } 

            request({
                    "uri": url,
                    "method": "POST",
                    "json": request_body

                }, (err, res, body) => {
                    if(!err){
                        resolve('Done!');
                    } else {
                        reject("Unable to send message:" + err);
                    }
                });
        }
        catch (e) {
            reject(e);
        }
    })
}

let getFacabookUsername = (sender_psid) => {
    return new Promise((resolve, reject) => {
        try {
            // Send the HTTP request to the Messenger Platform
            let uri = `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`;
            request({
                "uri": uri,
                "method": "GET"
            }, (err, res, data) => {
                if (!err) {
                    try {
                        let body = JSON.parse(data);
                        let username = `${body.first_name} ${body.last_name}`;
                        resolve("Done!");
                    } catch (error) {
                        reject("Error parsing response: " + error);
                    }
                } else {
                    reject("Unable to send message:" + err);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}
export default{
    handleSetupProfileAPI:handleSetupProfileAPI,
    getFacabookUsername:getFacabookUsername
}