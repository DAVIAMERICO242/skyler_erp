import { SQLConnection } from "../connect-sql";

const receber = [
    "1 - Receitas Diretas",
    "Clientes - Serviços Prestados",
    "Clientes - Revenda de Mercadoria",
    "2 - Receitas Indiretas",
    "Rendimentos de Aplicações",
    "Receitas Financeiras",
    "Empréstimos Bancários",
    "Empréstimos Sócios",
    "Receitas não direcionadas",
    "Receita Colombo",
    "Outras Entradas",
    "Resgate de Investimento - Bradesco (inativa)",
    "Receitas empréstimos intragrupo",
    ".",
    "Devoluções de Compra de Mercadoria de Revenda (inativa)",
    "SEM USO -  Outras Entradas"
]

const pagar = [
    "3 - Tributações",
    "Devoluções de Vendas de Mercadoria (inativa)",
    "PIS",
    "COFINS",
    "IRPJ",
    "CSLL",
    "ISS",
    "Simples Nacional (DAS)",
    "Icms Antecipado",
    "ISS Retido",
    "GNRE",
    "4 - Custo da Mercadoria",
    "Compras de Mercadorias para Revenda",
    "Fretes sobre compra",
    "Adiantamento Fornecedor",
    "5 - Despesas de Marketing",
    "Comissões (inativa)",
    "Marketing",
    "Despesas de viagens marketing",
    "Bonificações (inativa)",
    "Despesas com e-commecer (inativa)",
    "Showroom 2023.1 (inativa)",
    "Limpeza de Vitrine (inativa)",
    "Embalagens (inativa)",
    "Brindes (inativa)",
    "Royalties (inativa)",
    "Frete sobre vendas (inativa)",
    "Suprimentos loja (inativa)",
    "Cheques Devolvidos (inativa)",
    "Designer Gráfico",
    "Estacionamento Clientes (inativa)",
    "Despesas Feira de Santana (inativa)",
    "Ressarcimento (inativa)",
    "Showroom 2023.2 (inativa)",
    "Produto peça piloto (inativa)",
    "Despesas com franquias (inativa)",
    "GNRE (inativa)",
    "Showroom 2024.1  Atlantic Blu",
    "Endormarketing",
    "6 - Despesas Administrativas",
    "Aluguel",
    "Condomínio (inativa)",
    "Água e Esgoto",
    "Energia Elétrica",
    "Telefonia",
    "Material de Escritório",
    "Manutenção de Imobilizado",
    "Seguros",
    "IPTU/IPVA",
    "Advogados",
    "Segurança (inativa)",
    "Material de limpeza",
    "Sistemas",
    "Despesas com treinamentos (inativa)",
    "Uber (inativa)",
    "Contabilidade",
    "Internet",
    "Suprimentos escritório",
    "Combustivel (inativa)",
    "Despesas com Viagens",
    "Ecad",
    "Associaçoes e sindicatos",
    "Despesa Colombo",
    "Despesas não direcionadas",
    "Multa Rescisória (inativa)",
    "Outras despesas operacionais",
    "Despesas Juridicas",
    "Doações/ Caridade",
    "Despesas não operacionais",
    "Confraternizações (inativa)",
    "Despesa Corban",
    "Despesas com desenvolvimento de produto",
    "Cheques devolvidos",
    "7 - Despesas com vendas",
    "Comissões",
    "Despesas com viagens comercias",
    "Bonificações/ Premiações",
    "Despesas com e-commerce",
    "Suprimentos Lojas",
    "Fretes sobre venda",
    "Embalagens",
    "Brindes para clientes",
    "Royalties",
    "Despesas com Franquias",
    "Segurança de loja",
    "Despesas com treinamentos",
    "Cheques devolvidos",
    "8 - Investimento",
    "Máquinas e Equipamentos",
    "Veículos",
    "Instalações",
    "Equipamentos de Informática",
    "Móveis e Utensílios",
    "Arquitetura",
    "Caução aluguel (inativa)",
    "Loja Skyler São Paulo",
    "9 - Despesas com Pessoal",
    "Salários",
    "Adiantamento salárial",
    "Férias",
    "Rescisões - Desligamento",
    "13º Salário",
    "INSS",
    "FGTS",
    "IRRF",
    "Vale Transporte",
    "Vale Refeição",
    "Assistência odontológica",
    "Fardamento",
    "Admissões",
    "Premiações",
    "CIEE",
    "FGTS Rescisão",
    "Bonificação Corridinha",
    "Aniversários e comemorações (inativa)",
    "Rescisões - Termino de contrato",
    "INSS Patronal",
    "Feriado Trabalhado",
    "Horas Extras",
    "Multas  rescisórias",
    "9.1 - Remuneração dos Sócios",
    "Pro-labore",
    "Distribuição de Lucros - Sócios",
    "10 - Despesas financeiras",
    "Juros sobre Empréstimos",
    "Multas",
    "Pagamento de Empréstimos",
    "Tarifas Bancárias",
    "Tarifas Adm Cartões",
    "Aplicações Financeiras",
    "Aplicações de Investimento - Bradesco (inativa)",
    "Despesas emprestimos intragrupo",
    "Demais Despesas"
]

function is_category(string:string){
    const pattern = /^\d+(?:\.\d+)? -.+$/;
    return pattern.test(string)
}

for (let i=0;i<=pagar.length;i++){
    console.log(pagar[i])
    console.log(is_category(pagar[i]))
}



function cadastroCategoria(nome:string,action:string) {
    return new Promise((resolve, reject) => {
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(`INSERT INTO categoria_contas (nome_categoria,pagar_receber) VALUES 
                   ('${nome}','${action}')`,
                    (err, result) => {
                        if (err) {
                            if(err.sqlMessage?.toUpperCase().includes("DUPLICATE")){
                                reject({
                                    duplicate:true
                                })
                            }else{
                                reject({
                                    duplicate:false
                                })
                            }
                        } else {
                            resolve(null);
                        }
                    });
            }
        }).catch((err) => {
            reject({
                duplicate:false
            });
        });
    });
}

function cadastroTipo(tipo:string,categoria:string) {
    return new Promise((resolve, reject) => {
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(`INSERT INTO tipo_contas (nome_conta,categoria_conta) VALUES 
                   ('${tipo}','${categoria}')`,
                    (err, result) => {
                        if (err) {
                            if(err.sqlMessage?.toUpperCase().includes("DUPLICATE")){
                                reject({
                                    duplicate:true
                                })
                            }else{
                                reject({
                                    duplicate:false
                                })
                            }
                        } else {
                            resolve(null);
                        }
                    });
            }
        }).catch((err) => {
            reject({
                duplicate:false
            });
        });
    });
}


const categorias_pagar = pagar.filter((e)=>is_category(e)).filter((e)=>e)
const categorias_receber = receber.filter((e)=>is_category(e)).filter((e)=>e)

var current_category = ""
for (let i = 0; i <= pagar.length; i++) {
    if(is_category(pagar[i])){
        var current_category = pagar[i];
    }
    else if(current_category){
        cadastroTipo(pagar[i],current_category)
    }
}


