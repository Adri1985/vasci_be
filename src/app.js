require('dotenv').config(); // Cargar variables de entorno desde el archivo .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Permitir solicitudes desde otros orígenes
app.use(express.json()); // Parsear JSON en el cuerpo de las solicitudes

// Verificar si la variable MONGO_URI está cargada
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI no está definido en el archivo .env');
  process.exit(1); // Detener la ejecución si no está definido
}

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch((error) => console.error('Error al conectar a MongoDB:', error));

// Rutas
const authRoutes = require('./routes/auth'); // Importar las rutas de autenticación
app.use('/api/auth', authRoutes); // Prefijo para las rutas de autenticación

// Ruta base
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

const subscriptionRoutes = require('./routes/subscription');

app.use('/api/subscription', subscriptionRoutes);
require('dotenv').config();


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
