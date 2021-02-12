var express= require("express")
var randomstring = require("randomstring"); 
const { Payload } =require("dialogflow-fulfillment");
const MongoClient = require('mongodb').MongoClient;
var app=express();
var user_name="";
const url='mongodb://localhost:127.0.0.1:27017/';
    
function defaultFallback(agent) {
    agent.add('Sorry! I am unable to understand this at the moment. I am still learning humans. You can pick any of the service that might help me.');
    }

async function mobile(agent){
    
   var mobile=agent.parameters["number-integer"][0]+"";
    console.log(mobile);
    const client = new MongoClient(url,{useUnifiedTopology: true});
    await client.connect();
    var n=await client.db("dialog").collection("mobile").findOne({'mobile': mobile});
    console.log(n);
    if(n==null){
        await agent.add("User not found");
    }
    else
    {
    user_name=n.name;
    await agent.add("Welcome  "+user_name+"!!  \n How can I help you");}
  }

function report(agent){
    var i= agent.parameters['number'][0];
    console.log(i);
    var issue_list={1:"Internet Down",2:"Slow Internet",3:"Buffering problem",4:"No connectivity",5:"Slow connection"};
    if(i>=6 || i==0){
      agent.add("Please enter again");
    }
    else{
    var trouble_ticket= randomstring.generate(7);
    MongoClient.connect(url,{useUnifiedTopology: true},(err,client)=>{
        if(err)
        return console.log(err)
        var db1= client.db("dialog")
        var c="complaints"
        var date=new Date(Date.now());
        var d=date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear()
        db1.collection(c).insertOne({"username":user_name,"issue":issue_list[i],"status":"pending","date":d,"trouble_ticket":trouble_ticket},function(err, res) {
            if (err) throw err;   
          })
    })
    agent.add("The issue reported is: "+ issue_list[i] +"\nThe ticket number is: "+trouble_ticket+".\n");
  }
}
function options(agent){
    var payLoadData=
    {
"richContent": [
[
  {
    "type": "list",
    "title": "Internet Down",
    "subtitle": "Press '1' for Internet is down",
    "event": {
      "name": "",
      "languageCode": "",
      "parameters": {}
    }
  },
  {
    "type": "divider"
  },
  {
    "type": "list",
    "title": "Slow Internet",
    "subtitle": "Press '2' Slow Internet",
    "event": {
      "name": "",
      "languageCode": "",
      "parameters": {}
    }
  },
  {
    "type": "divider"
  },
  {
    "type": "list",
    "title": "Buffering problem",
    "subtitle": "Press '3' for Buffering problem",
    "event": {
      "name": "",
      "languageCode": "",
      "parameters": {}
    }
  },
  {
    "type": "divider"
  },
  {
    "type": "list",
    "title": "No connectivity",
    "subtitle": "Press '4' for No connectivity",
    "event": {
      "name": "",
      "languageCode": "",
      "parameters": {}
    }
  },
  {
    "type":"divider"
  },
  {
    "type": "list",
    "title":"Weak connection",
    "subtitle": "Press '5' for Slow connection",
    "event":{
      "name":"",
      "languageCode":"",
      "parameters":{}
    }
  }

]
]
}
agent.add(new Payload(agent.UNSPECIFIED,payLoadData,{sendAsMessage:true, rawPayload:true }));
}

module.exports = { defaultFallback: defaultFallback,mobile:mobile, options:options,report:report};

