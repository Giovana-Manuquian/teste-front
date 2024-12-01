/*document.addEventListener("DOMContentLoaded", function () {
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

    // Evento para cancelar a matrícula
    document.getElementById("cancelar-matricula").addEventListener("click", function () {
        document.getElementById("matricular-modal").style.display = 'none'; // Fechar o modal
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
// Função para matricular o aluno
async function matricularAluno(cursoId, turmaId) {
    const alunoData = {
        cursoId: cursoId, // Usando 'cursoId'
        turmaId: turmaId, // Usando 'turmaId'
        data_cadastro: "2023-10-10", // Adicione a data de cadastro aqui
        email: document.getElementById("email").value, // Pegando o email do DOM
        nome: document.getElementById("nome").value, // Pegando o nome do DOM
        telefone: document.getElementById("telefone").value // Pegando o telefone do DOM
    };

    console.log(alunoData); // Verifique se os dados estão corretos antes de enviar

    try {
        const response = await fetch('/api/matriculas/confirmar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(alunoData)
        });

        if (response.ok) {
            const novoAluno = await response.json();
            console.log('Aluno matriculado com sucesso:', novoAluno);
        } else {
            const errorText = await response.text();
            console.error('Erro ao matricular aluno:', response.statusText, errorText);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }

    
} */