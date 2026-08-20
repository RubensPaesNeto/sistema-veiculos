const express = require("express");
const app = express();

// Capturar campos enviados por POST
app.use(express.urlencoded({extended: true}));
app.use(express.json());



const exphbs = require("express-handlebars")
app.engine("handlebars", exphbs.engine())
app.set("view engine", "handlebars")
const UsuarioController = require("./controllers/UsuarioController.js")

app.get("/areaLogada", UsuarioController.verificaAutenticacao,(req,res) =>{
    res.send({
        msg: "Você está logado com o Id  " + req.usuarioId +  " e pode acessar este recurso.",
    })
})

app.get("/areaAdmin", UsuarioController.verificaAutenticacao, UsuarioController.verificaIsAdmin,(req,res) =>{
    res.send({
        msg: "Você é um administrador"
    })
})

app.get("/", (req,res)=> {
    res.render("home")
   // res.send("Hello World!")
});


const veiculosRoutes = require("./routes/veiculoRoutes")
app.use("/veiculos", veiculosRoutes)

const UsuariosRoutes = require("./routes/UsuarioRoutes.js")
app.use("/usuarios", UsuariosRoutes)

app.listen(8000, (err) => {
    console.log("aplicação rodando em localhost:8000")
});