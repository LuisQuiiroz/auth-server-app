const express = require('express');
const cors = require('cors');
const path = require('path');
const { dbConnection } = require('./db/config');

// Configura las variables de entorno del cocumento .env
require('dotenv').config();
// console.log(process.env );


// Crear el servidor/ aplicacion de express
const app = express();

// Conexión a la  Base de Datos
dbConnection();

// use() es un middleware, que se ejecuta antes de la conexion con la base de datos

// directorio público
app.use( express.static('public')); // Abre el html de la carpeta public

//CORS
// permite la carga de recursos para un origen distinto al suyo (dominio, esquema o puerto).
app.use( cors() );

// Lectura y parseo del body
app.use( express.json() );

// Rutas middleware
app.use( '/api/auth' , require('./routes/auth'))

// Manejar demas rutas
// '*' cualquier ruta que no este especificada entra aqui
app.get( '*', ( req, res ) => {
    // regresa esa url
    // __dirname es donde está desplegado el servidor
    res.sendFile( path.resolve( __dirname, 'public/index.html' ) );
} );

// escucha en que puerto se está ejecutando la aplicación
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);

});