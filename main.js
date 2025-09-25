// Aguarda o carregamento completo do DOM para garantir que todos os elementos existam.
document.addEventListener('DOMContentLoaded', () => {

    // 1. Seleciona os elementos da página com os quais vamos trabalhar.
    const searchButton = document.getElementById('search-button');
    const usernameInput = document.getElementById('username-input');
    const profileContainer = document.getElementById('profile-container');

    // Adiciona o evento de clique ao botão de busca.
    searchButton.addEventListener('click', () => {
        // Pega o nome de usuário digitado no campo de input, removendo espaços em branco.
        const username = usernameInput.value.trim();

        // Verifica se o campo não está vazio antes de fazer a chamada.
        if (username) {
            fetchGithubUser(username);
        } else {
            // Informa ao usuário que ele precisa digitar algo.
            profileContainer.innerHTML = '<p class="error-message">Por favor, digite um nome de usuário.</p>';
        }
    });

    /**
     * Função assíncrona para buscar os dados do usuário na API do GitHub.
     * Esta é a requisição Ajax que a tarefa pede.
     * @param {string} username - O nome de usuário do GitHub a ser buscado.
     */
    async function fetchGithubUser(username) {
        // URL da API do GitHub para buscar um usuário específico.
        const apiUrl = `https://api.github.com/users/${username}`;

        // Feedback visual: informa ao usuário que os dados estão sendo carregados.
        profileContainer.innerHTML = '<p class="loading-message">Carregando...</p>';

        // Bloco try...catch para tratar sucessos e erros na requisição.
        try {
            // 2. Realiza a chamada para a API usando fetch e aguarda a resposta.
            const response = await fetch(apiUrl);

            // 3. Verifica se a resposta da API foi bem-sucedida (status 200-299).
            // Se o usuário não for encontrado, a API retorna um status 404.
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Usuário não encontrado.');
                } else {
                    throw new Error('Ocorreu um erro ao buscar o perfil.');
                }
            }

            // Converte a resposta em formato JSON.
            const userData = await response.json();

            // 4. Chama a função para exibir os dados na tela.
            displayUserProfile(userData);

        } catch (error) {
            // Em caso de erro (rede, usuário não encontrado, etc.), exibe a mensagem de erro.
            profileContainer.innerHTML = `<p class="error-message">Erro: ${error.message}</p>`;
            console.error('Falha na requisição:', error);
        }
    }

    /**
     * Função para renderizar o perfil do usuário no front-end.
     * @param {object} user - O objeto com os dados do usuário retornado pela API.
     */
    function displayUserProfile(user) {
        // 5. Cria o HTML para exibir os dados do perfil.
        // Usamos template literals (crases ``) para facilitar a construção do HTML.
        const profileHTML = `
            <div class="profile-card">
                <img src="${user.avatar_url}" alt="Avatar de ${user.name}" class="profile-avatar">
                <div class="profile-info">
                    <h2>${user.name || 'Nome não disponível'}</h2>
                    <p class="username">@${user.login}</p>
                    <p class="bio">${user.bio || 'Nenhuma bio disponível.'}</p>
                    <ul>
                        <li><strong>Repositórios:</strong> ${user.public_repos}</li>
                        <li><strong>Seguidores:</strong> ${user.followers}</li>
                        <li><strong>Seguindo:</strong> ${user.following}</li>
                    </ul>
                    <a href="${user.html_url}" target="_blank" class="profile-link">Ver Perfil no GitHub</a>
                </div>
            </div>
        `;

        // Insere o HTML gerado dentro do container no front-end.
        profileContainer.innerHTML = profileHTML;
    }
});
