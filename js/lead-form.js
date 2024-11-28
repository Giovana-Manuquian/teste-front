// Capturar o evento de envio do formulário
document.getElementById('lead-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Previne o envio padrão do formulário

    // Capturar os dados do formulário
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;
    const cursoId = document.getElementById('curso').value;

    // Validação de telefone
    const phoneRegex = /^\d{10,11}$/;
    if (!phoneRegex.test(telefone)) {
        alert('Por favor, insira um telefone válido.');
        return;
    }

    // Validação de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um e-mail válido.');
        return;
    }

    // Verificar se um curso foi selecionado
    if (!cursoId) {
        alert('Por favor, selecione um curso.');
        return;
    }

    // Montar o objeto a ser enviado
    const leadData = {
        nome: nome,
        telefone: telefone,
        email: email,
        curso: { id: parseInt(cursoId) } // Associa o curso pelo ID
    };

    // Desabilitar o formulário e mostrar o indicador de carregamento
    document.getElementById('lead-form').querySelectorAll('input, select, button').forEach(el => el.disabled = true);
    document.getElementById('loading').style.display = 'block';

    try {
        // Enviar os dados para o backend usando fetch
        const response = await fetch('http://localhost:8085/api/leads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(leadData),
        });

        // Esconde o indicador de carregamento
        document.getElementById('loading').style.display = 'none';

        // Reabilitar o formulário
        document.getElementById('lead-form').querySelectorAll('input, select, button').forEach(el => el.disabled = false);

        if (response.ok) {
            alert('Lead cadastrado com sucesso!');
            document.getElementById('lead-form').reset(); // Limpa o formulário
        } else {
            const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
            alert('Erro ao cadastrar lead: ' + (error.message || 'Erro desconhecido'));
        }
    } catch (error) {
        // Esconde o indicador de carregamento em caso de erro
        document.getElementById('loading').style.display = 'none';
        // Reabilitar o formulário
        document.getElementById('lead-form').querySelectorAll('input, select, button').forEach(el => el.disabled = false);
        alert('Erro de conexão: ' + error.message);
    }

    console.log('Curso ID selecionado:', cursoId);  // Exibe o ID do curso selecionado
});

// Função para carregar os cursos dinamicamente
async function carregarCursos() {
    // Exibir a mensagem de "Carregando..." enquanto os cursos não são carregados
    const cursoSelect = document.getElementById('curso');
    cursoSelect.innerHTML = '<option>Carregando cursos...</option>'; // Mensagem de carregamento

    try {
        const response = await fetch('http://localhost:8085/api/cursos');

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error('Erro ao carregar cursos. Código de status: ' + response.status);
        }

        // Tenta processar a resposta como JSON, mas verifica antes se há conteúdo
        const cursos = await response.json().catch(() => []);

        // Limpar opções anteriores (caso haja)
        cursoSelect.innerHTML = '';

        // Adiciona a opção padrão caso não haja cursos
        if (cursos.length === 0) {
            cursoSelect.innerHTML = '<option>Sem cursos disponíveis</option>';
        }

        // Adiciona os cursos ao select
        cursos.forEach(curso => {
            const option = document.createElement('option');
            option.value = curso.id;
            option.textContent = curso.descricao;
            cursoSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar cursos:', error);
        cursoSelect.innerHTML = '<option>Erro ao carregar cursos</option>';
    }
}

// Chama a função para carregar os cursos ao carregar a página
window.onload = carregarCursos;
