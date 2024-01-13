const express = require("express");
const port = 8000;
const app = express();
const http = require('http');
const path = require("path")
require('dotenv').config();
const socketIO = require('socket.io');
const db = require('./configration/mongoose')
const productroutes = require("./routes/productroute")
const categoryRoutes = require('./routes/categoryroute');
const cors = require("cors");
const jwt = require("./helper/jwt");
const errorHandler = require("./helper/error");



const server = http.createServer(app);
const io = socketIO(server);



app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cors());
app.set('view engine', 'ejs');
app.set('views','./views')


app.use(jwt);
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler)
  


app.use("/",require('./routes'))





io.of('/users').on('connection', (socket) => {
    console.log('User connected');
  
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  
    socket.on('userMessage', (message) => {
      // Handle user messages
      io.of('/customers').emit('userMessage', { sender: 'User', message });
      io.of('/users').emit('userMessage', { sender: 'User', message });
     

    });
  });

  io.of('/customers').on('connection', (socket) => {
    console.log('Customer connected');
  
    socket.on('disconnect', () => {
      console.log('Customer disconnected');
    });
  
    socket.on('customerMessage', (message) => {
      // Handle customer messages
      io.of('/users').emit('customerMessage', { sender: 'Customer', message });
      io.of('/customers').emit('customerMessage', { sender: 'Customer', message });
     
    });
  });




  server .listen(port,(err)=>{
    if (err) {
        console.log('Something went wrong', err);
        } else{
            console.log(`Server is running on port ${port}`);
            };
})