const router = require("express").Router();

const UsuarioController = require("../controllers/UsuarioController");

router.get("/cadastro", UsuarioController.formCadastro);
router.get("/login", UsuarioController.formLogin);

router.post("/cadastro", UsuarioController.cadastrar);
router.post("/login", UsuarioController.login);
router.post("/logout", UsuarioController.logout);

module.exports = router;
