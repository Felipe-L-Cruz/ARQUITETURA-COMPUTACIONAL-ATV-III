
const palavras = [
    {
        palavra: "REGISTRADORES",
        linha: 8,
        coluna: 2,
        direcao: "horizontal",
        pista: "Pequenas unidades de armazenamento interno utilizadas pelo processador."
    },
    {
        palavra: "DATABUS",
        linha: 3,
        coluna: 10,
        direcao: "vertical",
        pista: "Caminho utilizado para transportar informações entre componentes."
    },
    {
        palavra: "QUADCORE",
        linha: 5,
        coluna: 5,
        direcao: "vertical",
        pista: "Arquitetura de processador que possui quatro núcleos."
    },
    {
        palavra: "DUALCORE",
        linha: 6,
        coluna: 2,
        direcao: "vertical",
        pista: "Arquitetura de processador que possui dois núcleos."
    },
    {
        palavra: "CACHE",
        linha: 4,
        coluna: 9,
        direcao: "horizontal",
        pista: "Memória rápida que auxilia o processador."
    },
    {
        palavra: "FLASH",
        linha: 0,
        coluna: 12,
        direcao: "vertical",
        pista: "Tipo de memória não volátil utilizada em diversos dispositivos."
    },
    {
        palavra: "CPU",
        linha: 7,
        coluna: 0,
        direcao: "horizontal",
        pista: "Componente responsável pela execução das instruções dos programas."
    },
    {
        palavra: "RAM",
        linha: 6,
        coluna: 9,
        direcao: "horizontal",
        pista: "Memória temporária utilizada durante a execução dos programas."
    },
    {
        palavra: "ROM",
        linha: 11,
        coluna: 1,
        direcao: "horizontal",
        pista: "Memória que mantém seus dados mesmo sem energia."
    },
    {
        palavra: "ULA",
        linha: 1,
        coluna: 11,
        direcao: "horizontal",
        pista: "Unidade responsável pelas operações matemáticas e lógicas."
    },
    {
        palavra: "DMA",
        linha: 10,
        coluna: 4,
        direcao: "horizontal",
        pista: "Técnica que permite transferências de dados sem intervenção constante do processador."
    },
    {
        palavra: "UC",
        linha: 6,
        coluna: 0,
        direcao: "vertical",
        pista: "Unidade responsável por coordenar a execução das instruções."
    }
];

const linhas = 14;
const colunas = 15;

const tabuleiro = document.getElementById("cruzadinha");
const pistasHorizontais = document.getElementById("pistas-horizontais");
const pistasVerticais = document.getElementById("pistas-verticais");
const pontuacao = document.getElementById("pontuacao");

let celulas = [];
let palavraAtiva = null;

// Criação do tabuleiro
function criarTabuleiro() {

    tabuleiro.innerHTML = "";
    celulas = [];

    for (let i = 0; i < linhas; i++) {

        celulas[i] = [];

        for (let j = 0; j < colunas; j++) {

            const input = document.createElement("input");

            input.type = "text";
            input.maxLength = 1;
            input.readOnly = true;

            input.classList.add("celula");

            input.dataset.linha = i;
            input.dataset.coluna = j;

            celulas[i][j] = input;
            tabuleiro.appendChild(input);
        }
    }

    tabuleiro.style.display = "grid";
    tabuleiro.style.gridTemplateColumns = `repeat(${colunas}, 35px)`;
}

// Posicionamento das palavras
function posicionarPalavras() {

    palavras.forEach((item) => {

        for (let i = 0; i < item.palavra.length; i++) {

            let linha = item.linha;
            let coluna = item.coluna;

            if (item.direcao === "horizontal") {
                coluna += i;
            } else {
                linha += i;
            }

            const input = celulas[linha][coluna];

            input.classList.add("ativa");
            input.dataset.resposta = item.palavra[i];
        }
    });
}

// Criação das pistas
function criarPistas() {

    pistasHorizontais.innerHTML = "";
    pistasVerticais.innerHTML = "";

    palavras.forEach((item) => {

        const li = document.createElement("li");

        li.textContent = item.pista;
        li.title = "Clique para responder";

        li.addEventListener("click", function() {

            palavraAtiva = item;

            const primeiraCelula = celulas[item.linha][item.coluna];

            primeiraCelula.focus();
        });

        if (item.direcao === "horizontal") {
            pistasHorizontais.appendChild(li);
        } else {
            pistasVerticais.appendChild(li);
        }
    });
}


function configurarDigitacao() {

    document.addEventListener("keydown", function(event) {

        const input = document.activeElement;

        // Verifica se existe uma célula selecionada
        if (!input || !input.classList.contains("ativa")) {
            return;
        }

        if (!palavraAtiva) {
            return;
        }

        const linhaAtual = Number(input.dataset.linha);
        const colunaAtual = Number(input.dataset.coluna);

        let indice;

        if (palavraAtiva.direcao === "horizontal") {
            if (linhaAtual !== palavraAtiva.linha) return;

            indice = colunaAtual - palavraAtiva.coluna;

        } else {
            if (colunaAtual !== palavraAtiva.coluna) return;

            indice = linhaAtual - palavraAtiva.linha;
        }

        if (indice < 0 || indice >= palavraAtiva.palavra.length) {
            return;
        }

        // Digitar letra
        if (/^[a-zA-Z0-9]$/.test(event.key)) {

            event.preventDefault();

            input.value = event.key.toUpperCase();

            if (indice + 1 < palavraAtiva.palavra.length) {

                let novaLinha = palavraAtiva.linha;
                let novaColuna = palavraAtiva.coluna;

                if (palavraAtiva.direcao === "horizontal") {
                    novaColuna += indice + 1;
                } else {
                    novaLinha += indice + 1;
                }

                celulas[novaLinha][novaColuna].focus();
            }
        }

        // Apagar letra
        if (event.key === "Backspace") {

            event.preventDefault();

            if (input.value !== "") {
                input.value = "";
            } else if (indice > 0) {

                let novaLinha = palavraAtiva.linha;
                let novaColuna = palavraAtiva.coluna;

                if (palavraAtiva.direcao === "horizontal") {
                    novaColuna += indice - 1;
                } else {
                    novaLinha += indice - 1;
                }

                const anterior = celulas[novaLinha][novaColuna];

                anterior.value = "";
                anterior.focus();
            }
        }

    });
}

function conferirRespostas() {

    let acertos = 0;

    const corretas = new Set();
    const incorretas = new Set();

    palavras.forEach((item) => {

        let respostaCompleta = "";

        for (let i = 0; i < item.palavra.length; i++) {

            let linha = item.linha;
            let coluna = item.coluna;

            if (item.direcao === "horizontal") {
                coluna += i;
            } else {
                linha += i;
            }

            respostaCompleta += celulas[linha][coluna].value;
        }

        const acertou = respostaCompleta === item.palavra;

        if (acertou) {
            acertos++;
        }

        for (let i = 0; i < item.palavra.length; i++) {

            let linha = item.linha;
            let coluna = item.coluna;

            if (item.direcao === "horizontal") {
                coluna += i;
            } else {
                linha += i;
            }

            const chave = `${linha}-${coluna}`;

            if (acertou) {
                corretas.add(chave);
            } else {
                incorretas.add(chave);
            }
        }
    });

    celulas.forEach((linha, i) => {

        linha.forEach((input, j) => {

            input.classList.remove("correta", "incorreta");

            const chave = `${i}-${j}`;

            if (corretas.has(chave)) {
                input.classList.add("correta");
            } else if (incorretas.has(chave)) {
                input.classList.add("incorreta");
            }
        });
    });

    pontuacao.textContent = acertos;
}

// Reiniciar jogo
function reiniciarJogo() {

    celulas.forEach((linha) => {

        linha.forEach((input) => {

            input.value = "";

            input.classList.remove("correta", "incorreta");
        });
    });

    palavraAtiva = null;
    pontuacao.textContent = "0";
}

// Eventos dos botões
document.getElementById("btn-conferir")
    .addEventListener("click", conferirRespostas);

document.getElementById("btn-reiniciar")
    .addEventListener("click", reiniciarJogo);

// Inicialização
criarTabuleiro();
posicionarPalavras();
criarPistas();
configurarDigitacao();
