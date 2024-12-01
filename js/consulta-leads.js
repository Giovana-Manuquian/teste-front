document.addEventListener("DOMContentLoaded", function() {
    carregarCursos();

    document.getElementById("filtro-form").addEventListener("submit", function(event) {
        event.preventDefault();
        filtrarLeads();
    });

    document.getElementById("curso-filtro").addEventListener("change", function() {
        const cursoId = this.value;
        if (cursoId) {
            carregarTurmas(cursoId);
        } else {
            const turmaSelect = document.getElementById("turma-select");
            turmaSelect.innerHTML = '';
        }
    });
});

async function carregarCursos() {
    const cursoSelect = document.getElementById("curso-filtro");
    cursoSelect.innerHTML = '<option>Carregando cursos...</option>';

    try {
        const response = await fetch('http://localhost:8085/api/cursos');
        if (!response.ok) {
            throw new Error('Erro ao carregar cursos');
        }

        const cursos = await response.json();
        cursoSelect.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Selecione um curso';
        cursoSelect.appendChild(defaultOption);

        cursos.forEach(curso => {
            const option = document.createElement('option');
            option.value = curso.id;
            option.textContent = curso.descricao;
            cursoSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar cursos:', error);
        alert('Erro ao carregar cursos. Verifique a conexão com a API.');
    }
}

async function carregarTurmas(cursoId) {
    const turmaSelect = document.getElementById("turma-select");
    turmaSelect.innerHTML = '<option>Carregando turmas...</option>';

    console.log(`Carregando turmas para o curso ID: ${cursoId}`);

    try {
        const response = await fetch(`http://localhost:8085/api/turmas/curso/${cursoId}/turmas`);
        console.log('Resposta da API para turmas:', response);

        if (!response.ok) {
            throw new Error('Erro ao carregar turmas');
        }

        const turmas = await response.json();
        console.log('Turmas carregadas:', turmas);

        turmaSelect.innerHTML = '';

        if (turmas.length === 0) {
            const option = document.createElement('option');
            option.textContent = 'Nenhuma turma disponível';
            turmaSelect.appendChild(option);
            return;
        }

        turmas.forEach(turma => {
            const option = document.createElement('option');
            option.value = turma.id;
            option.textContent = turma.descricao;
            turmaSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar turmas:', error);
        alert('Erro ao carregar turmas. Verifique a conexão com a API.');
    }
}

function filtrarLeads() {
    const nomeFiltro = document.getElementById("nome-filtro").value;
    const emailFiltro = document.getElementById("email-filtro").value;
    const cursoFiltro = document.getElementById("curso-filtro").value;

    const params = new URLSearchParams({
        nome: nomeFiltro || '',
        email: emailFiltro || '',
        curso: cursoFiltro || ''
    });

    console.log("Parâmetros de filtro:", params.toString());
    fetch(`http://localhost:8085/api/leads/filter?${params.toString()}`, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text); });
        }
        return response.json();
    })
    .then(leads => {
        if (leads && leads.length > 0) {
            exibirLeadsNaTabela(leads);
        } else {
            alert('Nenhum lead encontrado com os filtros selecionados.');
        }
    })
    .catch(error => {
        console.error("Erro ao filtrar leads:", error);
        alert('Erro ao buscar leads. Verifique a conexão com a API.');
    });
}

function exibirLeadsNaTabela(leads) {
    const tabela = document.getElementById("leads-table").getElementsByTagName('tbody')[0];
    tabela.innerHTML = "";

    leads.forEach(lead => {
        const linha = document.createElement("tr"); // Corrigido aqui
        linha.innerHTML = `
            <td>${lead.id}</td>
            <td>${lead.nome}</td>
            <td>${lead.email}</td>
            <td>${lead.curso.descricao}</td>
            <td><button onclick="abrirModalMatricula(${lead.id})">Matricular</button></td>
        `;
        tabela.appendChild(linha);
    });
}

async function abrirModalMatricula(leadId) {
    const modal = document.getElementById("matricular-modal");
    modal.style.display = "block";

    const turmaSelect = document.getElementById("turma-select");
    turmaSelect.innerHTML = '';

    await carregarCursosNoModal();

    const cursoSelect = document.getElementById("curso-select");
    cursoSelect.value = ''; // Limpa a seleção atual

    cursoSelect.addEventListener("change", async function() {
        const cursoId = this.value;
        if (cursoId) {
            await carregarTurmas(cursoId);
        } else {
            turmaSelect.innerHTML = '';
        }
    });

    document.getElementById("confirmar-matricula").onclick = function() {
        matricularAluno(leadId);
    };

    document.getElementById("cancelar-matricula").onclick = function() {
        modal.style.display = "none";
    };
}

async function carregarCursosNoModal() {
    const cursoSelect = document.getElementById("curso-select");
    cursoSelect.innerHTML = '<option value="">Selecione um curso...</option>'; // Adiciona uma opção padrão

    try {
        const response = await fetch('http://localhost:8085/api/cursos');
        if (!response.ok) {
            throw new Error('Erro ao carregar cursos');
        }

        const cursos = await response.json();
        cursoSelect.innerHTML = '<option value="">Selecione um curso...</option>'; // Limpa e adiciona a opção padrão

        cursos.forEach(curso => {
            const option = document.createElement('option');
            option.value = curso.id;
            option.textContent = curso.descricao;
            cursoSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar cursos:', error);
        alert('Erro ao carregar cursos. Verifique a conexão com a API.');
    }
}

async function matricularAluno(leadId) {
    const cursoId = document.getElementById("curso-select").value;
    const turmaId = document.getElementById("turma-select").value;

    if (!cursoId || !turmaId) {
        alert('Por favor, selecione um curso e uma turma.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8085/api/matriculas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ leadId, cursoId, turmaId })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Erro ao matricular aluno');
        }

        alert('Aluno matriculado com sucesso!');
        document.getElementById("matricular-modal").style.display = "none";
    } catch (error) {
        console.error('Erro ao matricular aluno:', error);
        alert('Erro ao matricular aluno. Verifique a conexão com a API.');
    }
}