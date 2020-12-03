# ChatNow
Extremely lightweight web-based instant messaging app written in basic HTML, CSS, and node.js for the back-end. Leverages socket.io for real-time communication with friends.

# Steps to run application
1. ```git clone``` the repository or download source files onto your machine

2. Install dependencies
```$ npm install```

3. Set up a MySQL database with the name 'messages' and run the  ```initializeDB.sql``` script on it

4. Initialize and startup server
```$ node app.js```

5. Open up ```localhost:4200``` in your browser and chat away!

# Taking it to the next level
If you're really feeling adventurous, feel free to fork this. In order to chat with anybody in the world you would technically only need to:
1. Spin up an EC2, setup the DB and start the node server.
2. Update the endpoint in index.html to your EC2's DNS.
3. Serve this updated index.html through some public URL. Anybody using link that should be able to talk to anybody else who has access to it(*).

## Disclaimer(*)
This was a learning project for me when I was starting with web development. Security is obviously not high standard here, and neither was meticulous code design a high priority. The purpose of this project is was just to demonstrate how real-time chat functionality can be achieved and see how node/express/socket worked for myself. It was created quickly & just for fun so keep in mind that publicizing mechanism mentioned in this section is just provided for your information and would actually open up a communication channel with everyone who knows what the URL is.

Happy Chatting!
