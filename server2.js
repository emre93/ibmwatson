
const express = require('express');

var stringify = require('json-stringify-safe');

const app = express();
var BinaryServer = require('binaryjs').BinaryServer;
var wav = require('wav');
const watson = require('watson-developer-cloud');
const IBMCloudEnv = require('ibm-cloud-env');
var fs = require('fs');



var port = process.env.PORT || 80;



var server = BinaryServer({port: port});

var clients = [];
var id;

const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
const AuthorizationV1 = require('watson-developer-cloud/authorization/v1');
const IamTokenManagerV1 = require('watson-developer-cloud/iam-token-manager/v1');

// Create the token manager
let tokenManager;
let instanceType;
const serviceUrl = process.env.SPEECH_TO_TEXT_URL || 'https://stream.watsonplatform.net/speech-to-text/api';

  instanceType = 'cf';
  const speechService = new SpeechToTextV1({
    username: process.env.SPEECH_TO_TEXT_USERNAME ,
    password: process.env.SPEECH_TO_TEXT_PASSWORD ,
    url: serviceUrl,
     headers: {
    'X-Watson-Learning-Opt-Out': 'true'
  }
  });
  tokenManager = new AuthorizationV1(speechService.getCredentials());



app.get('/', (req, res) => res.render('index'));

// Get credentials using your credentials
app.get('/api/credentials', (req, res, next) => {
  tokenManager.getToken((err, token) => {
    if (err) {
      next(err);
    } else {
      let credentials;
      if (instanceType === 'iam') {
        credentials = {
          accessToken: token,
          serviceUrl,
        };
      } else {
        credentials = {
          token,
          serviceUrl,

        };
      }
      res.json(credentials);
    }
  });
  //console.log(token);
});



var AssistantV1 = require('watson-developer-cloud/assistant/v1');

/**
 * Instantiate the Watson Assistant Service
 */
var assistant = new AssistantV1({
  username: process.env.ASSISTANT_USERNAME ,
  password: process.env.ASSISTANT_PASSWORD ,
  version: '2018-07-10',
  headers: {
    'X-Watson-Learning-Opt-Out': 'true'
  }
});


   var params = {
        objectMode: false,
        'content_type': 'audio/l16;rate=48000',
        model: 'en-US_BroadbandModel',
        keywords: ['viola','play', 'mute', 'pause', 'stop', 'volume up', 'volume down','unmute', 'next','prev','previous'],
        inactivity_timeout : 25,
        'keywords_threshold': 0.85,
         'max_alternatives': 1,
        'interim_results' : true
        // 'word_confidence' : true
        
   };



try {


server.on('connection', function(client) {
     var parts = [];
console.log("Connection made");
//clients.push(client);
    id = Math.random();
    console.log('connection is established : ' + id);
    clients[id] = client;
    clients.push(client);
console.log(clients.length);

client.binaryType = 'arraybuffer'

 var recognizeStream = speechService.recognizeUsingWebSocket(params, function(err, response) {
        // The error will be the first argument of the callback
        if (err.code == 404) {
            // Handle Not Found (404) error
        } else if (err.code == 413) {
            // Handle Request Too Large (413) error
        } else {
            console.log('Unexpected error: ', err.code);
            console.log('error:', err);
        }
    });

client.on('stream', function(stream, meta) {
  const array = new Int16Array(stream);
 //console.log(stream);


  stream.on('data', function(data) {
        parts.push(data);
        
        //console.log(data);
      });
  console.log("Client On Stream");
  //stream.pipe(l16Stream);



function Error_Handle() {

  console.log("Error handling");

   var recognizeStream = speechService.recognizeUsingWebSocket(params, function(err, response) {
        // The error will be the first argument of the callback
        if (err.code == 404) {
            // Handle Not Found (404) error
        } else if (err.code == 413) {
            // Handle Request Too Large (413) error
        } else {
            console.log('Unexpected error: ', err.code);
            console.log('error:', err);
        }
    });

    stream.pipe(recognizeStream);

    recognizeStream.setEncoding('utf8');

// Listen for events.
 recognizeStream.on('data', function(event) { onEvent('Data:', event); });
 recognizeStream.on('error', function(event) { onEvent('Error:', event); });
 recognizeStream.on('close', function(event) { onEvent('Close:', event); });


}

     
 stream.pipe(recognizeStream);
 
  client.send("Started");
 
  //console.log(stream);

  console.log("We are here");

  //.pipe(fileWriter);
  stream.on('end', function() {
    //fileWriter.end();
    console.log("Stream on end");
    //recognizeStream.send(stringify({action: 'stop'}));
    //recognizeStream.send(stringify({action: 'start'}));
  });

recognizeStream.setEncoding('utf8');

// Listen for events.
 recognizeStream.on('data', function(event) { onEvent('Data:', event); });
 recognizeStream.on('error', function(event) { onEvent('Error:', event); });
 recognizeStream.on('close', function(event) { onEvent('Close:', event); });



// Display events on the console.
 function onEvent(name, event) {

      if (name == 'Close:' && event !== 1000)
 {

     console.log("Erroorrr!!");
     setTimeout(function(){  Error_Handle(); }, 1500);

}

  try {
        console.log(name, JSON.stringify(event, null, 2));
        var deneme = JSON.stringify(event, null, 2);
 
    var Transcription = deneme.substring(1, deneme.length-1);  //removing the quatition marks ("") in string




var wakeword = deneme.split(" ");

var mightbekey_word = wakeword[0];

var mightbekey_word = deneme.replace(/ .*/,'');
mightbekey_word = mightbekey_word.substring(1);

for (var i = 0, len = wakeword.length; i < len; i++) {


 if (wakeword[i] === "Emily" || wakeword[i] === "James" || wakeword[i] === "viola")  {



  assistant.message({
  workspace_id: '',
  input: {'text': Transcription}
},  function(err, response) {
  if (err)
    console.log('error:', err);
  else 
    console.log(stringify(response.output.text.toString(), null, 2));  // console the answer from assistant
  console.log(Transcription);

    var jsonstring = stringify(response.output.text.toString(), null, 2); // receiving the assistant answer here

    var newStr = jsonstring.substring(1, jsonstring.length-1);  //removing the quatition marks ("") in string

     

    client.send(newStr);

      var ambigious_respond = newStr.split("and ");
        //console.log("First one: " + ambigious_respond[0] +"11");
  
    if (ambigious_respond[0] == 'ambigious ' ) 

    {

       var i;

      for (i = 0; i < clients.length; i++) {
     
        console.log("Inside in loop");
        clients[i].send("ambigious");

    
    }

    }


   

  }); /////////// function(err,response) brackets for assisstant
 ////////////// we put in this paranthesis because we would like to use newStr variable to get the location's latitude and longitude values for weather information and it is defined in the function. 
    ////////// TODO make the newStr variable global variable to use it outside of the function


}



}
if (mightbekey_word === "Emily" || mightbekey_word === "James" || mightbekey_word === "viola") {

    assistant.message({
  workspace_id: '',
  input: {'text': Transcription}
},  function(err, response) {
  if (err)
    console.log('error:', err);
  else {
    console.log(stringify(response.output.text.toString(), null, 2));  // console the answer from assistant
    var jsonstring = stringify(response.output.text.toString(), null, 2); // receiving the assistant answer here
    var newStr = jsonstring.substring(1, jsonstring.length-1);  //removing the quatition marks ("") in string  

    client.send(newStr);


         var ambigious_respond = newStr.split("and ");
        console.log("First one: " + ambigious_respond[0] +"11");

    if (ambigious_respond[0] == 'ambigious ' ) 

    {

       var i;

      for (i = 0; i < clients.length; i++) {
 
        console.log("Inside in loop");
        clients[i].send('ambigious');
 
    
    }

    }


      }

  });


} /////If calues for might be a keyword



  } ////for try paranthesis 
 

catch (err) {

  console.log(err);
}


}; //////function for STT (name,event)


});////////client.on stream

   client.on('close', function() {
        for (var i=0;i<clients.length;i++) {
            if(clients[i].id == client.id) {
                clients.splice(i, 1);
            }
        }
        client.close();
    });

});   /////server.on

}

catch (err) {

  console.log(err);
}


