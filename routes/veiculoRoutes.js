const router = require("express").Router();

const VeiculoController = require("../controllers/VeiculoController");

const UsuarioController = require("../controllers/UsuarioController");

router.get("/todos", UsuarioController.verificaAutenticacao, VeiculoController.buscar);
router.get("/cadastro", UsuarioController.verificaAutenticacao, VeiculoController.formCadastro);
router.post("/cadastro", UsuarioController.verificaAutenticacao, VeiculoController.cadastrar);

router.get("/buscar/:id", UsuarioController.verificaAutenticacao, VeiculoController.buscarPorId);

router.get("/editar/:id", UsuarioController.verificaAutenticacao, VeiculoController.formEditar);
router.post("/editar/:id", UsuarioController.verificaAutenticacao,  VeiculoController.editar);

router.post("/deletar/:id", UsuarioController.verificaAutenticacao,  VeiculoController.deletar);

module.exports = router;
