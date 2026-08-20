require("dotenv").config();

const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { engine } = require("express-handlebars");

const flashMiddleware = require("./middlewares/flash");
const usuarioLogadoMiddleware = require("./middlewares/usuarioLogado");

const UsuarioController = require("./controllers/UsuarioController");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();


//inicialização
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: process.env.SESSION_SECRET || "segredo-desenvolvimento",
    resave: false,
    saveUninitialized: false
}));

app.use(flashMiddleware);
app.use(usuarioLogadoMiddleware);

app.use((req, res, next) => {
    res.locals.anoAtual = new Date().getFullYear();
    next();
});

//Handlebars
app.engine("handlebars", engine({
    defaultLayout: "main",
    helpers: {
        eq: (a, b) => a === b
    }
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));


//rotas
app.get("/", async (req, res) => {
    const totalVeiculos = await prisma.veiculo.count();
    res.render("home", { totalVeiculos });
});

app.get("/areaLogada", UsuarioController.verificaAutenticacao, (req, res) => {
    res.send({
        msg: "Você está logado com o Id " + req.usuarioId + " e pode acessar este recurso."
    });
});

app.get("/areaAdmin", UsuarioController.verificaAutenticacao, UsuarioController.verificaIsAdmin, (req, res) => {
    res.send({
        msg: "Você é um administrador"
    });
});

const veiculoRoutes = require("./routes/veiculoRoutes");
app.use("/veiculos", veiculoRoutes);

const usuarioRoutes = require("./routes/usuarioRoutes");
app.use("/usuarios", usuarioRoutes);

//render pagina 404
app.use((req, res) => {
    res.status(404).render("erro", {
        mensagem: "Página não encontrada."
    });
});

//start
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Aplicação rodando em http://localhost:${PORT}`);
});
