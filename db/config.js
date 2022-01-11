const mongoose  = require("mongoose");

// Conectarse a la base de datos
const dbConnection = async () => {
    try {
        // BD_CNN credenciales a mongodb
        await mongoose.connect( process.env.BD_CNN) // promesa

        console.log('Base de datos Online');
        
    } catch (error) {

        console.log(error);
        throw new Error('Error a la hora de inicializar la base de datos');

    }
}
module.exports = {
 dbConnection
}