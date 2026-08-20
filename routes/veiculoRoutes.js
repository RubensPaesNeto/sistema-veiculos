const router = require("express").Router();

const VeiculoController = require("../controllers/VeiculoController");

router.get("/todos", VeiculoController.buscar);
router.get("/cadastro", VeiculoController.formCadastro);
router.post("/cadastro", VeiculoController.cadastrar);

router.get("/buscar/:id", VeiculoController.buscarPorId);

router.get("/editar/:id", VeiculoController.formEditar);
router.post("/editar/:id", VeiculoController.editar);

router.post("/deletar/:id", VeiculoController.deletar);

module.exports = router;
