const jwt = require("jsonwebtoken");

// Lê o token guardado no cookie (se existir) e disponibiliza os dados
// do usuário logado para todas as views, sem bloquear o acesso a rotas públicas.
function usuarioLogadoMiddleware(req, res, next) {

    const token = req.cookies && req.cookies.token;

    if (token) {
        jwt.verify(token, process.env.SENHA_SERVIDOR, (err, payload) => {
            if (!err) {
                req.usuarioId = payload.id;
                res.locals.usuarioLogado = payload.nome || true;
            }
            next();
        });
    } else {
        next();
    }
}

module.exports = usuarioLogadoMiddleware;
