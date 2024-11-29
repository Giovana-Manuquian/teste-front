document.addEventListener("DOMContentLoaded", function () {
    // Carregar cursos e turmas
    carregarCursos();
    
    // Capturar os dados do lead, para preencher na tela
    const leadId = 123; // Este é o ID do lead, você pode capturar via query string ou outro método
    carregarLeadInfo(leadId);

    // Formulário de matrícula
    document.getElementById("matricula-form").addEventListener("submit", async function (event) {
        event.preventDefault();
        
        const cursoId = document.getElementById("curso").value;
        const turmaId = document.getElementById("turma").value;

        if (!cursoId || !turmaId) {
            alert("Por favor, selecione um curso e uma turma.");
            return;
        }

        matricularAluno(leadId, cursoId, turmaId);
    });
});

// Função para carregar os cursos
async function carregarCursos() {
    const cursoSelect = document.getElementById("curso");
    cursoSelect.innerHTML = '<option>Carregando cursos...</option>';

    try {
        const response = await fetch('http://localhost:8085/api/cursos');
        const cursos = await response.json();

        cursoSelect.innerHTML = ''; // Limpar opções
        cursos.forEach(curso => {
            const option = document.createElement("option");
            option.value = curso.id;
            option.textContent = curso.descricao;
            cursoSelect.appendChild(option);
        });

        cursoSelect.addEventListener('change', () => carregarTurmas(cursoSelect.value));

    } catch (error) {
        console.error("Erro ao carregar cursos:", error);
        alert('Erro ao carregar cursos.');
    }
}

// Função para carregar as turmas de um curso
async function carregarTurmas(cursoId) {
    const turmaSelect = document.getElementById("turma");
    turmaSelect.innerHTML = '<option>Carregando turmas...</option>';

    try {
        const response = await fetch(`http://localhost:8085/api/cursos/${cursoId}/turmas`);
        const turmas = await response.json();

        turmaSelect.innerHTML = ''; // Limpar opções
        turmas.forEach(turma => {
            const option = document.createElement("option");
            option.value = turma.id;
            option.textContent = turma.descricao;
            turmaSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Erro ao carregar turmas:", error);
        alert('Erro ao carregar turmas.');
    }
}

// Função para carregar informações do lead
async function carregarLeadInfo(leadId) {
    try {
        const response = await fetch(`http://localhost:8085/api/leads/${leadId}`);
        const lead = await response.json();

        document.getElementById("lead-nome").textContent = lead.nome;
        document.getElementById("lead-email").textContent = lead.email;
        document.getElementById("lead-telefone").textContent = lead.telefone;

    } catch (error) {
        console.error("Erro ao carregar lead:", error);
        alert('Erro ao carregar informações do lead.');
    }
}

// Função para matricular o aluno
async function matricularAluno(leadId, cursoId, turmaId) {
    const matriculaData = {
        leadId: leadId,
        cursoId: cursoId,
        turmaId: turmaId,
    };

    try {
        const response = await fetch('http://localhost:8085/api/matriculas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(matriculaData),
        });

        if (response.ok) {
            document.getElementById("matricula-success").style.display = 'block';
        } else {
            alert('Erro ao matricular o aluno.');
        }
    } catch (error) {
        console.error("Erro ao matricular aluno:", error);
        alert('Erro ao matricular aluno.');
    }
}
