## TypeScript with Express

This repo is set-up for students to work on an Express server using TypeScript. 

## Set-up steps: 

Let's set you up to be able to use this repository. These instructions will walk you through a quick database set-up so that you learn to navigate the MongoDb Compass GUI if you've never used it before, and so that your database is set-up correctly for you to be able to play around with the example endpoint. 

First, **fork and clone the repo**. 

Then, run: 

```
npm install
```

If you don't yet have MongoDb Compass installed, you will need it for this project. [Here is where you can download it](https://www.mongodb.com/try/download/compass). Make sure you get the **MongoDb Compass GUI download**, and not the other ones on the page.

<br>

Then, open MongoDB Compass and click on "Connect" on the following page:

<br>

<img src="./src/assets/new_connection.png" width=1000px>

<br>

Then, click on the "+" sign on the left, to create a new Database: 

<br>

<img src="./src/assets/create_db.png" height=500px>

<br>

Name your new database "makers_bnb_ts" and your first collection "examples": 

<br>

<img src="./src/assets/name_db.png" width=500px>

<br>

Then, open your examples collection, click on "Add Data" > "Insert document" and save the following document: 
<br>

<img src="./src/assets/create_document.png" width=500px>

<br>
<br>
Back on vscode, create a .env file in the makers_bnb_ts_exercise folder, and add the following line to it: 

```
MONGODB_URL="mongodb://0.0.0.0/makers_bnb_ts"
```

The set-up we've done with the database will eventually let you use the following endpoint: 

| Method   | URL             | Response  |
| -------- | ----------------|-------------------------------------------------------------------------------------|
| GET      | /example/:id    | { "example": { "_id": "67ed0ee130bb0f0df0d3c235", "firstProperty": "This is a string", "secondProperty": 1 }}|


## Running the Server: 

Now, let's see how to run our server in order to be able to hit the above endpoint with Postman. 

You will be aware that TypeScript code needs to be **compiled into JavaScript code before executing**. This will be necessary for this server to work as well - you will write the server code in TypeScript, then compile it into JavaScript, and eventually run the compiled code to check everything is working properly. 

First of all, let's compile all this TypeScript code into executable JavaScript: 

```
npm run build
```

The build script will compile your code into a new **dist** folder - if you open it, you will see it's structured in the same way as your src folder where all teh TypeScript files are, but instead of ts code, it's all JavaScript. Let's now run our compiled server: 

```
npm run start
```

The server runs with nodemon, which means that it will restart if any changes are made. You should have two terminals open during development, one where you re-compile your code when necessary, and one where you keep running the server from your compiled folder. 

<br>

<img src="./src/assets/two_terminals.png" width=1000px>
