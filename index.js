// Requires
const express = require('express');
const connectDB = require('./config/db');

// Crear servidor 
const app = express();

// Conectar MongoDB
connectDB();

// Definir puerto
const port = process.env.PORT || 4000;

// Habilitar body parser para json
app.use( express.json());

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/links', require('./routes/links'));
app.use('/api/files', require('./routes/files'));

// Home
app.get('/', (req, res) => {
    res.send("Welcome to NodeSend Server")
})

// Iniciar servidor 
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running in port ${port}`)
})