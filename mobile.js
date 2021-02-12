var express= require("express")
var app=express();
const functions = require('firebase-functions');

const bodyParser=require('body-parser'); //will pass whatever is there in our body
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const { WebhookClient } = require("dialogflow-fulfillment");
const {defaultFallback, mobile, options,report } = require("./app.js");
app.post("/dialogflow", express.json(), (req, res) => {
const agent = new WebhookClient({ request: req, response: res });
//console.log(agent);
let intentMap = new Map();
intentMap.set("Default Fallback Intent", defaultFallback);
intentMap.set("MobileNumber",mobile);
intentMap.set("internet", options);
intentMap.set("internet - custom",report);
agent.handleRequest(intentMap);
});
app.listen(process.env.PORT || 8080);