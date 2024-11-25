"use strict";
const urlAPI = "https://restcountries.com/v3.1/all";

let paises = [];

// Exemplo de classe
class Pais {
    constructor(flag,
        name,
        region,
        population,
        startOfWeek,
        flags) {
            this.flag = flag;
            this.name = name;
            this.region = region;
            this.population = population;
            this.startOfWeek = startOfWeek;
            this.flags = flags;
        }
}

const criarElementoPais = (pais) => {
    const minhaDiv = document.createElement('div');
    minhaDiv.classList.add("component-pais");

    minhaDiv.innerHTML = `
        <div>
            <img src="${pais.flags}" alt="Bandeira de ${pais.name}" style="width: 50px; height: auto;"/> 
            <span>${pais.name}</span> - 
            <span>${pais.region}</span>
        </div>
    `;

    return minhaDiv;
};


function processarDados(lista) {
    const divDados = document.querySelector("#dados");
    divDados.innerHTML = ""; // Limpa resultados anteriores

    if (lista.length === 0) {
        // Exibe mensagem de "País não encontrado" se a lista estiver vazia
        const mensagem = document.createElement("p");
        mensagem.textContent = "Nenhum país encontrado.";
        mensagem.style.color = "red";
        mensagem.style.textAlign = "center";
        divDados.appendChild(mensagem);
        return;
    }

    const ul = document.createElement("ul"); // Cria uma lista

    for (const pais of lista) {
        const li = document.createElement("li"); // Cria um item da lista

        const obj = {
            flag: pais.flag ?? "", // Emojis de bandeira (opcional)
            name: pais.name.common ?? "Nome desconhecido", // Nome com fallback
            region: pais.region ?? "Região não especificada",
            population: pais.population ?? "População desconhecida",
            startOfWeek: pais.startOfWeek ?? "Desconhecido",
            flags: pais.flags?.png ?? "" // Caminho da bandeira
        };

        const componentePais = criarElementoPais(obj);
        li.appendChild(componentePais);
        ul.appendChild(li); // Adiciona o item à lista
    }

    divDados.appendChild(ul); // Adiciona a lista à div
}

function pesquisaHandler(evt) {
    evt.preventDefault(); // Bloqueia o envio padrão do formulário

    const termoBusca = evt.target.q.value.toLowerCase().trim(); // Termo de busca

    if (!termoBusca) {
        // Se o campo estiver vazio, exibe todos os países
        processarDados(paises);
        return;
    }

    // Filtra os países localmente
    const listaFiltrada = paises.filter(pais =>
        pais.name.common.toLowerCase().includes(termoBusca)
    );

    // Exibe os países filtrados ou mensagem de erro
    processarDados(listaFiltrada);

    console.log(`Busca realizada: "${termoBusca}"`);
}

function carregarDados() {
    const divDados = document.querySelector("#dados");
    divDados.innerHTML = "Carregando..."; // Indicador de carregamento

    fetch(urlAPI) // Requisição à API
        .then((result) => result.json()) // Converte a resposta para JSON
        .then((lista) => {
            lista.sort((a, b) => a.name.common.localeCompare(b.name.common)); // Ordena por nome

            paises = lista; // Atualiza a lista global
            processarDados(lista); // Exibe os países
        })
        .catch((err) => {
            console.error("Erro ao carregar os dados:", err);
            divDados.innerHTML = "Erro ao carregar os dados.";
        });
}

function app() {
    // Adiciona o evento de submissão ao formulário
    const formulario = document.querySelector("#form-busca");
    formulario.addEventListener("submit", pesquisaHandler);

    // Carrega os dados iniciais
    carregarDados();
}

// Executa o app
app();