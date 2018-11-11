var io = require('socket.io-client');
var socket = io.connect('http://192.168.0.13:3000');
const http = require('http');
const WebSocket = require('ws');
var fs = require('fs');




///////////Server for From Cloud respond to here to be able to send the commands to Volumio Backend!!!!!!!!!!
const server = new http.createServer();
const wss = new WebSocket.Server({ server });



wss.on('connection', function connection(ws) {

  ws.on('message', function incoming(message) {
    console.log('received:', message + "1");

    message = message.toString();
    try {
    var check_the_data = message.split(" ");

  	var isnum = /^\d+$/.test(message);		
    if (message === "play") {
    socket.emit('play');		///////// Send to Volumio backend
    console.log(message);
    console.log("Sent the play command to Volumio Backend");
    ws.send("AA");
}

  else if (message === '+'){
  	socket.emit('volume','+');   ///////// Send to Volumio backend
  	console.log("Volume up triggered");
}
  else if (message === '-'){
  	socket.emit('volume', '-');
  	console.log("Volume down triggered");
  }

  else if (message === 'stop' || message === 'pause') {   ////////////Smart Stop for volatile and non-volatile songs
    //console.log("It enters here");

socket.emit('getState', '');
socket.once('pushState', function (state) {
if (state.volatile) {
  	socket.emit('stop');
  	console.log("Stopped");
// playing non-volatile source that can be paused
} else {

	socket.emit('pause');

	console.log("Paused");
}
});

  }

  else if (message === 'mute') {
  	socket.emit('mute');
  	console.log("Muted");
}
else if (message === 'unmute') {
  	socket.emit('unmute');
  	console.log("UnMuted");
}
		else if (message === 'next') {
  				socket.emit('next');
  				console.log("Next song is playing");
  			}
  				else if (message === 'prev') {
  				socket.emit('prev');
  				console.log("Previous Song is playing");
  			}
  				else if (isnum) {
  					var Nmbr = Number(message);
  				socket.emit('volume', Nmbr);
  				console.log(Nmbr);
  				console.log('volume set');
  				ws.send('AA');
  			}

  			else if (check_the_data[0] === 'search') {


           var song_name_with_artistname = message.split("and ").pop();
          
           console.log("Song name:" + song_name_with_artistname);
           var seperator = song_name_with_artistname.split(",");
            var song_name = seperator[0];          
            var artist_name = seperator[1];
            console.log(song_name);
            console.log(artist_name);

            var capitalize_the_first_letter = song_name.charAt(0).toUpperCase() + song_name.slice(1);
            console.log(capitalize_the_first_letter);

  				 socket.emit('search', {'value':song_name_with_artistname});
           console.log("Search started");
           

           socket.on('pushBrowseLibrary', function(data){
       
            try {

  
              console.log(data.navigation.lists.length);
              var i;
               var j;
              for (i = 0; i < data.navigation.lists.length; i++) {
                var title = data.navigation.lists[i].title
     
                if (title == 'Spotify Tracks' ){
                 
                  
                   var title1=null;
                 
                  for (j = 0; j <10; j++) {
                 
                    title1 = data.navigation.lists[i].items[j].title
                    console.log("Title of the song:" + title1 + " " + j);
                    if (capitalize_the_first_letter == title1) {
                  var uri = data.navigation.lists[i].items[j].uri
                  socket.emit('addPlay', {'uri':uri});
                  console.log("Matched with the music " + j + " " + title1 + " " + uri);
                
                      break;
                   
                    };
                  };
                  if (capitalize_the_first_letter !== title1){
                  var uri = data.navigation.lists[i].items[0].uri
                  socket.emit('addPlay', {'uri':uri});
                  console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                 

                }
              };

               
            };

              

     
       }

            catch(err) {

            console.log(err);

          }

          data.navigation.lists.length = 0;
           });
  			}

        else if (check_the_data[0] === 'artist') {


           var song_name_with_artistname = message.split("and ").pop();
         
           console.log("Artist Name: " + song_name_with_artistname);
      

            var capitalize_the_first_letter = song_name_with_artistname.charAt(0).toUpperCase() + song_name_with_artistname.slice(1);
            console.log(capitalize_the_first_letter);

           socket.emit('search', {'value':song_name_with_artistname});
           console.log("Search started");
           

           socket.on('pushBrowseLibrary', function(data){
            
            try {

       
              var i;
               var j;
              for (i = 0; i < data.navigation.lists.length; i++) {
                var title = data.navigation.lists[i].title
                console.log(title);

                if (title == 'Spotify Tracks' ){
                  
                   var title1=null;
                   console.log("items length" + data.navigation.lists[i].items.length);
                  for (j = 0; j <data.navigation.lists[i].items.length; j++) {
                    //console.log("It is here");
                    console.log(data.navigation.lists[i].items[0]);
                    title1 = data.navigation.lists[i].items[0].title
                    console.log("Title of the song:" + title1);
               if (j == 0) {
                  var uri = data.navigation.lists[i].items[0].uri
                  socket.emit('addPlay', {'uri':uri});
                  console.log("Matched with the music " + title1 + " " + uri);
                              
                    }                    
                    if (j != 0 ) {
                        console.log("j is not zero");
                        var uri = data.navigation.lists[i].items[j].uri
                         socket.emit('addToQueue', {'uri':uri});
                      
                    }
                  };
          
              };

               
            };

              
       }

            catch(err) {

            console.log(err);

          }

          data.navigation.lists.length = 0;
           });
        }



        //   else if (message === 'audended') {

        //    socket.emit( 'volume', currentvolume);
        // }
      }
  catch(err) {

            console.log(err);

          }

    });

    ws.on('close', function close() {
    console.log('disconnected');
    });

});

server.listen(1000);