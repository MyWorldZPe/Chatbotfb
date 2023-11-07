require('dotenv').config();
import { response } from "express";
import request from "request";

const IMAGE_GET_STARTE = 'https://cdn-kvweb.kiotviet.vn/kiotviet-website/wp-content/uploads/2014/10/kinh-doanh-do-choi-tre-em.jpg';
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
let callSendAPI = (sender_psid, response) => {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v18.0/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

let getUserName = (sender_psid) => {
    return new Promise((resolve, reject) => {
        // Send the HTTP request to the Messenger Platform
        request({
            "uri": `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
            "method": "GET",
        }, (err, res, body) => {
            console.log(body);
            if (!err) {
                body = JSON.parse(body);
                // "first_name": "Peter",
                // "last_name": "Chang",
                let username = `${body.last_name} ${body.first_name}`;
                resolve(username);
            } else {
                console.error("Unable to send message:" + err);
                reject(err);
            }
        });

    })


}
let handleGetStarted = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let username = await getUserName(sender_psid);
            let response1 = {
                "text": `Xin chào ${username} đã đến với WorldZToy!
            Chúng tôi sẽ nhắn tin cho bạn sớm nhất có thể` };
            // let response2 = sendGetStartedTemplate();
            //send text messenge
            await callSendAPI(sender_psid, response1);
            //send generic template message
            // await callSendAPI(sender_psid, response2);
            resolve('done');


        } catch (e) {
            reject(e);
        }
    });
}

// let sendGetStartedTemplate = () => {
//     let response = {
//         "attachment": {
//             "type": "template",
//             "payload": {
//                 "template_type": "generic",
//                 "elements": [{
//                     "title": "Cửa hàng đồ chơi trẻ em WorldZToy xin kính chào quý khách",
//                     "subtitle": "Hãy chọn dịch vụ mà bạn muốn",
//                     "image_url": IMAGE_GET_STARTE,
//                     "buttons": [
//                         {
//                             "type": "postback",
//                             "title": "TƯ VẤN SẢN PHẨM ",
//                             "payload": "TUVAN_SP",
//                         },
//                         {
//                             "type": "postback",
//                             "title": "PHẢN HỒI SẢN PHẨM",
//                             "payload": "PHANHOI_SP",
//                         }

//                     ],
//                 }]
//             }
//         }
//     }
//     return response;
// }

// let handleSendTUVANSP = (sender_psid,) => {
//     return new Promise(async (resolve, reject) => {
//         try {

//             let response1 = getSendTUVANSPTemplate();
//             //send text messenge
//             await callSendAPI(sender_psid, response1);



//         } catch (e) {
//             reject(e);
//         }
//     });
// }

module.exports = {
    handleGetStarted: handleGetStarted,
    handleSendTUVANSP: handleSendTUVANSP,
}