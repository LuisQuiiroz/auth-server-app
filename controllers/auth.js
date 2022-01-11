// Para tener el tipado de express
const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');


const crearUsuario = async(req, res = response) => {
    // console.log( req.body );

    // Ya fueron validados (mediante un middleware (valdiar-campos)) que se esos campos vienen correctamente
    const { name, email, password} = req.body;
    // console.log(name, email, password);


    try {
        // verificar si el email ya existe en la base de datos
        const usuario = await Usuario.findOne({ email: email });
        if ( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese email'
            });
        }

        // Crear usuario con el modelo
        const dbUser = new Usuario( req.body );
        // console.log(dbUser);
        

        // hashear/encriptar la contraseña

        // Cantidad de vueltas para la encriptacion default: 10
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync( password, salt ); 
    
        
        // Generar el JWT
        // Se va a enviar a Angular como método de autenticación pasiva
        // https://jwt.io/
        const token = await generarJWT( dbUser.id, dbUser.name ); 
        // console.log(dbUser.id); // ese id se trabaja como uid, que fue generado por mongo
        
        

        //Crear usuario en la base de datos
        await dbUser.save();

        // Generar respuesta exitosa
        return res.status(201).json({
            ok: true,
            uid: dbUser.id, // este id fue generado por mongo
            name,
            email,
            token
        });


    } catch (error) {

        console.log(error);
        
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });

    }
    
}

const loginUsuario = async(req, res = response) => {
    
    const { email, password} = req.body;
    // console.log( email, password);
    
    try {
        // verificar si email existe
        const dbUser = await Usuario.findOne({ email });

        if ( !dbUser ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            });
        }

        // Confirmar si el password hace match
        const validPassword = bcrypt.compareSync( password, dbUser.password);
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'El password no es válido'
            });
        }
        // Generar el JWT
        const token = await generarJWT( dbUser.id, dbUser.name ); 
        
        // respuesta del servicio
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
        
    }
}

const revalidarToken = async(req, res = response) => {

    const { uid } = req;

    // Ler de la base de datos
    const dbUser = await Usuario.findById(uid);

    // Generar el JWT
    const token = await generarJWT( uid, dbUser.name ); 

    return res.json({
        ok: true,
        // msg: 'Renew',
        uid, 
        name: dbUser.name,
        email: dbUser.email,
        token
    });
}


module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}