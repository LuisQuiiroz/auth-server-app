const { Schema, model } = require("mongoose");

// Esquema de usuario
const UsuarioSchema  = Schema({
    // Argumentos
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }

});


// Model(Nombre del modelo, esquema)
// moongose se va a encargar de agregarle el plural a la tabla a la hora de crear la base de datos
// Modelo de como se va a guardar en la base de datos
// todo modelo genera un id por parte de moongose
module.exports = model('Usuario', UsuarioSchema)