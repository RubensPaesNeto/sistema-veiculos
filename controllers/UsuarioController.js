const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient();

class UsuarioController {

  //redenrização do handlebars
  static formCadastro(req, res) {
    res.render("usuarios/cadastro");
  }

  static formLogin(req, res) {
    res.render("usuarios/login");
  }

  //cadastro
  static async cadastrar(req, res) {
    const { nome, email, senha } = req.body;

    try {
      const erros = UsuarioController.validarCadastro({ nome, email, senha });

      const emailExistente = await client.usuario.findUnique({ where: { email } });
      if (emailExistente) {
        erros.push("Já existe uma conta cadastrada com esse e-mail.");
      }

      if (erros.length > 0) {
        return res.status(400).render("usuarios/cadastro", {
          erros,
          valores: { nome, email }
        });
      }

      //hash da senha
      const salt = bcryptjs.genSaltSync(8);
      const hashSenha = bcryptjs.hashSync(senha, salt);


      //create of user
      await client.usuario.create({
        data: { nome, email, senha: hashSenha }
      });

      req.flash("sucesso", "Conta criada com sucesso! Faça login para continuar.");
      return res.redirect("/usuarios/login");

    } catch (error) {
      console.error(error);
      return res.status(500).render("erro", {
        mensagem: "Não foi possível concluir o cadastro. Tente novamente mais tarde."
      });
    }
  }


  //login
  static async login(req, res) {
    const { email, senha } = req.body;

    try {
      const usuario = await client.usuario.findUnique({ where: { email } });

      if (!usuario || !bcryptjs.compareSync(senha, usuario.senha)) {
        return res.status(400).render("usuarios/login", {
          erros: ["E-mail ou senha inválidos."],
          valores: { email }
        });
      }

      const token = jwt.sign(
        { id: usuario.id, nome: usuario.nome },
        process.env.SENHA_SERVIDOR,
        { expiresIn: "2h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 2 * 60 * 60 * 1000
      });

      req.flash("sucesso", `Bem-vindo(a), ${usuario.nome}!`);
      return res.redirect("/");

    } catch (error) {
      console.error(error);
      return res.status(500).render("erro", {
        mensagem: "Não foi possível fazer login. Tente novamente mais tarde."
      });
    }
  }


  //logout
  static logout(req, res) {
    res.clearCookie("token");
    res.redirect("/");
  }


  //verificar autenticação
  static async verificaAutenticacao(req, res, next) {
    const token = req.cookies && req.cookies.token;

    if (!token) {
      req.flash("erro", "Você precisa estar logado para acessar essa página.");
      return res.redirect("/usuarios/login");
    }

    jwt.verify(token, process.env.SENHA_SERVIDOR, (err, payload) => {
      if (err) {
        req.flash("erro", "Sua sessão expirou. Faça login novamente.");
        return res.redirect("/usuarios/login");
      }

      req.usuarioId = payload.id;
      next();
    });
  }

  //verificar se é Admin
  static async verificaIsAdmin(req, res, next) {
    if (!req.usuarioId) {
      req.flash("erro", "Você não está autenticado.");
      return res.redirect("/usuarios/login");
    }

    const usuario = await client.usuario.findUnique({ where: { id: req.usuarioId } });

    if (!usuario || !usuario.IsAdmin) {
      req.flash("erro", "Acesso negado: você não é um administrador.");
      return res.redirect("/");
    }

    next();
  }

  //validação
  static validarCadastro({ nome, email, senha }) {
    const erros = [];

    if (!nome || !nome.trim()) erros.push("O nome é obrigatório.");
    if (!email || !email.trim()) erros.push("O e-mail é obrigatório.");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) erros.push("Informe um e-mail válido.");
    if (!senha || senha.length < 6) erros.push("A senha deve ter pelo menos 6 caracteres.");

    return erros;
  }
}

module.exports = UsuarioController;
