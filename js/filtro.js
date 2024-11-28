// filtro.js
document.addEventListener("DOMContentLoaded", function() {
    // Carregar cursos no filtro
    carregarCursos();

    // Manipulador do evento de submit do formulário de filtro
    document.getElementById("filtro-form").addEventListener("submit", function(event) {
        event.preventDefault();
        filtrarLeads();
    });
});

// Função para carregar os cursos no filtro
function carregarCursos() {
    const cursoSelect = document.getElementById("curso-filtro");
    fetch('/api/cursos')  // A URL da API para buscar os cursos
        .then(response => response.json())
        .then(cursos => {
            cursos.forEach(curso => {
                const option = document.createElement("option");
                option.value = curso.id;
                option.textContent = curso.descricao;
                cursoSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Erro ao carregar os cursos:", error));
}

// Função para filtrar os leads
function filtrarLeads() {
    const nomeFiltro = document.getElementById("nome-filtro").value;
    const emailFiltro = document.getElementById("email-filtro").value;
    const cursoFiltro = document.getElementById("curso-filtro").value;

    // Montar o objeto com os filtros
    const filtros = {
        nome: nomeFiltro,
        email: emailFiltro,
        curso: cursoFiltro
    };

    // Fazer a requisição para a API de leads com os filtros
    fetch('/api/leads', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(filtros) // Passando os filtros
    })
    .then(response => response.json())
    .then(leads => {
        exibirLeadsNaTabela(leads);
    })
    .catch(error => console.error("Erro ao filtrar leads:", error));
}

// Função para exibir os leads na tabela
function exibirLeadsNaTabela(leads) {
    const tabela = document.getElementById("leads-table");
    tabela.innerHTML = ""; // Limpar a tabela antes de exibir os novos leads

    // Criar o cabeçalho da tabela
    const cabecalho = document.createElement("tr");
    cabecalho.innerHTML = `<th>ID</th><th>Nome</th><th>E-mail</th><th>Curso</th>`;
    tabela.appendChild(cabecalho);

    // Adicionar cada lead à tabela
    leads.forEach(lead => {
        const linha = document.createElement("tr");
        linha.innerHTML = `<td>${lead.id}</td><td>${lead.nome}</td><td>${lead.email}</td><td>${lead.curso}</td>`;
        tabela.appendChild(linha);
    });
}
