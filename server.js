const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Store messages in memory (replace with a database in a production environment)
const messages = [];

io.on('connection', (socket) => {
  console.log('New client connected');

  // Send existing messages to the newly connected client
  socket.emit('initial messages', messages);

  // Handle new messages
  socket.on('chat message', (msg) => {
    console.log('Message received:', msg);
    messages.push(msg);
    io.emit('chat message', msg);
  });

  // Handle image uploads
  socket.on('image upload', (imageData) => {
    console.log('Image received');
    messages.push({ type: 'image', data: imageData });
    io.emit('image upload', imageData);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});