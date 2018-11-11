# CloudConstable AI assistant for Volumio

## Description
- This project is in prototype step!
- The project can send audio stream to the cloudapp and then send to the STT services of IBM Watson. If the keyword is detected by STT, Assistant will answer the user in appropriate way.
- The answer will be receieved by client and then send to the Volumio backend to control the Music player by voice command.

## Install Prerequisites

Prerequisites:

-Make sure nodejs 8.0 installed and the required libraries are installed for the javascript file.
- For windows machine install the git bash recommended in order to use the nodejs

In Git, direct the folder which contain the volumio_cloud_and_html_connection.js
and install the required libraries.

Required libraries are: -npm install io
                        -npm install http
                        -npm install ws

- Make sure you change the IP address of Raspberry Pi in volumio_cloud_and_html.js file.


## Run

1- Run volumio_cloud_and_html_connection.js first and then run the html file.
2- After you give the access for microphone in html file.  First Keyword should be detected and the keywords are: Emily , James or viola. Either of them are detected assistant will be activated and will do the commands that you ask for. 

You will be able to ask to AI for commands like:
   

          Hey Emily, Can you play thriller by Michael Jackson. ----It does not mandatory to say the artist name.
          Hey Emily, Can you skip the song, or previous the song.
          so the commands are ; mute, unmute, stop-pause(smart stop), play, set the volume to certain level, turn up the volume and turn down the volume.

   NOTE:   For the prototype purposes, The search function uses  only Spotify Premium account if you dont have it, it wont work.

3- Run the html file in Google Chrome otherwise, it may complain about the microphone access. In order to see the Transcription and Assistant answer, you need to right click and hit Inspect. On the left side choose Console and you will see the Transcriptions and assistant answers.


