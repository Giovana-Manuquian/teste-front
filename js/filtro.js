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

    // Função para filtrar os leadsfunction filtrarLeads() {
    const nomeFiltro = document.getElementById("nome-filtro").value;
    const emailFiltro = document.getElementById("email-filtro").value;
    const cursoFiltro = document.getElementById("curso-filtro").value;

    const params = new URLSearchParams({
        nome: nomeFiltro || '',   // Filtro de nome
        email: emailFiltro || '', // Filtro de e-mail
        curso: cursoFiltro || ''  // Filtro de curso
    });

    // Log para verificar os parâmetros antes de enviar
    console.log("Parâmetros de filtro:", params.toString()); // Exibe os parâmetros na URL

    fetch(`http://localhost:8085/api/leads/filter?${params.toString()}`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(leads => {
        console.log("Leads recebidos:", leads);
        if (leads && leads.length > 0) {
            exibirLeadsNaTabela(leads); // Exibe os leads filtrados
        } else {
            alert('Nenhum lead encontrado com os filtros selecionados.');
        }
    })
    .catch(error => {
        console.error("Erro ao filtrar leads:", error);
        alert('Erro ao buscar leads. Verifique a conexão com a API.');
    });



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
