// Middleware simples de mensagens "flash" (sucesso / erro), usando a sessão.
// Paran não precissar dad dependência extra como connect-flash 

function flashMiddleware(req, res, next) {

    req.flash = (tipo, mensagem) => {
        if (!req.session.flash) {
            req.session.flash = {};
        }
        req.session.flash[tipo] = mensagem;
    };

    res.locals.sucesso = req.session.flash && req.session.flash.sucesso;
    res.locals.erro = req.session.flash && req.session.flash.erro;

    if (req.session.flash) {
        req.session.flash = null;
    }

    next();
}

module.exports = flashMiddleware;
