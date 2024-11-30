document.addEventListener("DOMContentLoaded", function () {
    // Carregar cursos
    carregarCursos();

    // Formulário de lead
    document.getElementById("lead-form").addEventListener("submit", async function (event) {
        event.preventDefault();
        await cadastrarLead();
    });

    // Botão de matrícula
    document.getElementById("matricular-button").addEventListener("click", async function () {
        const cursoId = document.getElementById("curso").value;
        const turmaId = document.getElementById("turma").value;

        if (!cursoId || !turmaId) {
            alert("Por favor, selecione um curso e uma turma para matricular.");
            return;
        }

        await matricularAluno(cursoId, turmaId);
    });
});

// Função para carregar os cursos
async function carregarCursos() {
    const cursoSelect = document.getElementById("curso");
    cursoSelect.innerHTML = '<option>Carregando cursos...</option>';

    try {
        const response = await fetch('http://localhost:8085/api/cursos');
        if (!response.ok) {
            throw new Error('Erro ao carregar cursos: ' + response.statusText);
        }
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
        alert('Erro ao carregar cursos. Tente novamente mais tarde.');
    }
}

// Função para carregar as turmas
async function carregarTurmas(cursoId) {
    const turmaSelect = document.getElementById("turma");
    turmaSelect.innerHTML = '<option>Carregando turmas...</option>';

    try {
        const response = await fetch(`http://localhost:8085/api/turmas/curso/${cursoId}/turmas`);
        if (!response.ok) {
            throw new Error('Erro ao carregar turmas: ' + response.statusText);
        }
        const turmas = await response.json();
        console.log(turmas); // Adicione este log para verificar a resposta

        turmaSelect.innerHTML = ''; // Limpar opções
        turmas.forEach(turma => {
            const option = document.createElement("option");
            option.value = turma.id;
            option.textContent = turma.descricao;
            turmaSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Erro ao carregar turmas:", error);
        alert('Erro ao carregar turmas. Tente novamente mais tarde.');
    }
}

// Função para cadastrar o lead
async function cadastrarLead() {
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;

    document.getElementById("lead-nome").textContent = nome;
    document.getElementById("lead-telefone").textContent = telefone;
    document.getElementById("lead-email").textContent = email;

    // Aqui você pode adicionar a lógica para enviar os dados do lead para o servidor, se necessário
}

// Função para matricular o aluno
async function matricularAluno(cursoId, turmaId) {
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;

    const alunoData = {
        nome: nome,
        telefone: telefone,
        email: email,
        cursoId: cursoId,
        turmaId: turmaId
    };

    try {
        const response = await fetch('http://localhost:8085/api/matricular', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(alunoData)
        });

        if (!response.ok) {
            throw new Error('Erro ao matricular aluno: ' + response.statusText);
        }

        document.getElementById("matricula-success").style.display = 'block';

    } catch (error) {
        console.error("Erro ao matricular aluno:", error);
        alert('Erro ao matricular aluno. Tente novamente mais tarde.');
    }
}