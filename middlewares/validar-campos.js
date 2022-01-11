const { response } = require("express");
const { validationResult } = require("express-validator");


// middleware: función que recibe como argumentos request, response, next
const validarCampos = (req, res = response, next) => {

    const errors = validationResult( req );
    if ( !errors.isEmpty() ) {
        // si no está vacío, retorna lo siguiente
        return res.status(400).json({
            ok: false,
            errors: errors.mapped() // mapea/ describe el tipo de error obtenido
        });
    }
    // continuar con el siguiente middleware
    next();
}


module.exports = {
    validarCampos
}