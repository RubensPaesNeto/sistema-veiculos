const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient();

const ANO_MINIMO = 1886;

class VeiculoController {
    //renderizar Handlebars
    static async formCadastro(req, res) {
        res.render("veiculos/cadastro");
    }

    //cadastrar
    static async cadastrar(req, res) {
        const { modelo, placa, ano, cor } = req.body;

        try {
            const erros = await VeiculoController.validar({ modelo, placa, ano, cor });

            if (erros.length > 0) {
                return res.status(400).render("veiculos/cadastro", {
                    erros,
                    valores: { modelo, placa, ano, cor }
                });
            }

            await client.veiculo.create({
                data: {
                    modelo: modelo.trim(),
                    placa: placa.trim().toUpperCase(),
                    ano: parseInt(ano),
                    cor: cor.trim()
                }
            });

            req.flash("sucesso", "Veículo cadastrado com sucesso!");
            res.redirect("/veiculos/todos");

        } catch (error) {
            console.error(error);
            res.status(500).render("erro", {
                mensagem: "Não foi possível cadastrar o veículo. Tente novamente mais tarde."
            });
        }
    }

    //buscar os veiculos
    static async buscar(req, res) {
        try {
            const veiculos = await client.veiculo.findMany({
                orderBy: { id: "asc" }
            });

            res.render("veiculos/lista", {
                veiculos,
                total: veiculos.length
            });

        } catch (error) {
            console.error(error);
            res.status(500).render("erro", {
                mensagem: "Não foi possível carregar a lista de veículos."
            });
        }
    }

    //buscar por ID
    static async buscarPorId(req, res) {
        try {
            const id = parseInt(req.params.id);
            const veiculo = await client.veiculo.findUnique({ where: { id } });

            if (!veiculo) {
                return res.status(404).render("erro", {
                    mensagem: "Veículo não encontrado."
                });
            }

            res.render("veiculos/detalhes", { veiculo });

        } catch (error) {
            console.error(error);
            res.status(500).render("erro", {
                mensagem: "Não foi possível carregar os dados do veículo."
            });
        }
    }

    //Renderização da pagina de Editar Veiculo
    static async formEditar(req, res) {
        try {
            const id = parseInt(req.params.id);
            const veiculo = await client.veiculo.findUnique({ where: { id } });

            if (!veiculo) {
                return res.status(404).render("erro", {
                    mensagem: "Veículo não encontrado."
                });
            }

            res.render("veiculos/editar", { veiculo });

        } catch (error) {
            console.error(error);
            res.status(500).render("erro", {
                mensagem: "Não foi possível carregar o veículo para edição."
            });
        }
    }

    // Editar Veiculo
    static async editar(req, res) {
        const id = parseInt(req.params.id);
        const { modelo, placa, ano, cor } = req.body;

        try {
            const erros = await VeiculoController.validar({ modelo, placa, ano, cor }, id);

            if (erros.length > 0) {
                return res.status(400).render("veiculos/editar", {
                    erros,
                    veiculo: { id, modelo, placa, ano, cor }
                });
            }

            await client.veiculo.update({
                where: { id },
                data: {
                    modelo: modelo.trim(),
                    placa: placa.trim().toUpperCase(),
                    ano: parseInt(ano),
                    cor: cor.trim()
                }
            });

            req.flash("sucesso", "Veículo atualizado com sucesso!");
            res.redirect("/veiculos/todos");

        } catch (error) {
            console.error(error);
            res.status(500).render("erro", {
                mensagem: "Não foi possível salvar as alterações do veículo."
            });
        }
    }

    //Deletar Veiculo
    static async deletar(req, res) {
        try {
            const id = parseInt(req.params.id);
            await client.veiculo.delete({ where: { id } });

            req.flash("sucesso", "Veículo removido com sucesso!");
            res.redirect("/veiculos/todos");

        } catch (error) {
            console.error(error);
            req.flash("erro", "Não foi possível remover o veículo.");
            res.redirect("/veiculos/todos");
        }
    }

    //validação
    static async validar({ modelo, placa, ano, cor }, idAtual = null) {
        const erros = [];

        if (!modelo || !modelo.trim()) erros.push("O modelo é obrigatório.");
        if (!cor || !cor.trim()) erros.push("A cor é obrigatória.");

        if (!placa || !placa.trim()) {
            erros.push("A placa é obrigatória.");
        } else {
            const placaExistente = await client.veiculo.findFirst({
                where: { placa: placa.trim().toUpperCase() }
            });

            if (placaExistente && placaExistente.id !== idAtual) {
                erros.push("Já existe um veículo cadastrado com essa placa.");
            }
        }

        const anoNumero = parseInt(ano);
        const anoAtual = new Date().getFullYear();
        if (!ano || isNaN(anoNumero) || anoNumero < ANO_MINIMO || anoNumero > anoAtual + 1) {
            erros.push(`Informe um ano válido (entre ${ANO_MINIMO} e ${anoAtual + 1}).`);
        }

        return erros;
    }
}

module.exports = VeiculoController;
