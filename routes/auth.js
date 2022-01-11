const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Crear un nuevo usuario
// router.post( '/new', (req, res) => {
//     return res.json({
//         ok: true,
//         msg: 'Crear usuario /new'
//     });
// });
//      Se movió a controllers/auth.js y quedó de la siguiente manera

// crearUsuario se manda como referencia, en lugar de llamar a la funcion
// post( path, middlewares?, controller)
router.post( '/new', [
    // checa si esos parametros cumplen con las caracteristicas especificadas
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').isLength({ min: 6 }),
    // validarCampos retorna un error en caso de que algún parametro no se cumpla
    validarCampos
    // en caso de que lo anterior se haya procesado correctamtente, se llama a crear usuario para las siguientese validaciones
    // hasta este punto ya fue validado los campos siguientes:
    // name: contiene un string 
    // email: contiene un email con formato valido
    // password contiene un string de mínimo 6 caracteres
], crearUsuario ); 

// Login de usuario
// primero es el path, luego los middelware? (opcional) y por ultimo, el controlador de la ruta
// utliza express validator
router.post( '/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatorio').isLength({ min: 6 }),
    validarCampos
    // hasta este punto ya fue validado los campos siguientes:
    // email: contiene un email con formato valido
    // password contiene un string de mínimo 6 caracteres
], loginUsuario);

// Validar y revalidar token
router.get( '/renew', validarJWT, revalidarToken);


module.exports = router;