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
async function carregarCursos() {
    const cursoSelect = document.getElementById("curso-filtro");
    cursoSelect.innerHTML = '<option>Carregando cursos...</option>'; // Mensagem de carregamento

    try {
        const response = await fetch('http://localhost:8085/api/cursos'); // URL da API dos cursos
        if (!response.ok) {
            throw new Error('Erro ao carregar cursos');
        }

        const cursos = await response.json();

        // Limpar o seletor antes de adicionar novas opções
        cursoSelect.innerHTML = ''; 
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Selecione um curso';
        cursoSelect.appendChild(defaultOption);

        cursos.forEach(curso => {
            const option = document.createElement('option');
            option.value = curso.id;  // Verifique se o id está correto
            option.textContent = curso.descricao;  // Verifique se a descrição está correta
            cursoSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar cursos:', error);
        alert('Erro ao carregar cursos. Verifique a conexão com a API.');
    }
}

// Função para filtrar os leads
function filtrarLeads() {
    const nomeFiltro = document.getElementById("nome-filtro").value;
    const emailFiltro = document.getElementById("email-filtro").value;
    const cursoFiltro = document.getElementById("curso-filtro").value;

    // Montar os parâmetros de consulta com os valores dos filtros
    const params = new URLSearchParams({
        nome: nomeFiltro || '',   // Filtro de nome (se vazio, não filtra)
        email: emailFiltro || '', // Filtro de e-mail (se vazio, não filtra)
        curso: cursoFiltro || ''  // Filtro de curso (se vazio, não filtra)
    });

    // Realizar a consulta com os parâmetros
    console.log("Parâmetros de filtro:", params.toString()); // Verificar os parâmetros
    fetch(`http://localhost:8085/api/leads/filter?${params.toString()}`, {
        method: 'GET',
    })
    .then(response => {
        console.log("Resposta da API:", response); // Verificar resposta
        return response.json();
    })
    .then(leads => {
        if (leads && leads.length > 0) {
            exibirLeadsNaTabela(leads); // Exibir os leads filtrados na tabela
        } else {
            alert('Nenhum lead encontrado com os filtros selecionados.');
        }
    })
    .catch(error => {
        console.error("Erro ao filtrar leads:", error);
        alert('Erro ao buscar leads. Verifique a conexão com a API.');
    });
}

// Função para exibir os leads na tabela
function exibirLeadsNaTabela(leads) {
    const tabela = document.getElementById("leads-table").getElementsByTagName('tbody')[0];
    tabela.innerHTML = ""; // Limpar a tabela antes de exibir os novos leads

    // Adicionar cada lead à tabela
    leads.forEach(lead => {
        const linha = document.createElement("tr");
        linha.innerHTML = `<td>${lead.id}</td><td>${lead.nome}</td><td>${lead.email}</td><td>${lead.curso.descricao}</td>`;
        tabela.appendChild(linha);
    });
}
