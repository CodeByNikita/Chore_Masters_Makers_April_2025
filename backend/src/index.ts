import app from './app.js';
import connectToDatabase from "./db/dbConnection.js"

const listenForRequests = () => {
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log("Now listening on port", port);
  });
};

const startServer = async () => { 
  await connectToDatabase();
  listenForRequests();
}

startServer();
