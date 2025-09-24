// Aguarda o DOM estar completamente carregado antes de executar o script.
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos do formulário com os quais vamos interagir.
    const form = document.getElementById('registration-form');
    const submitButton = document.getElementById('submit-button');
    const formStatus = document.getElementById('form-status');

    // Adiciona um ouvinte de evento para o envio do formulário.
    form.addEventListener('submit', async (event) => {
        // 1. Previne o comportamento padrão do formulário (que é recarregar a página).
        event.preventDefault();

        // Limpa mensagens de erro e status anteriores.
        clearErrors();
        formStatus.style.display = 'none';

        // 2. Validação dos campos do formulário no lado do cliente (front-end).
        const isValid = validateForm();
        if (!isValid) {
            return; // Interrompe a execução se a validação falhar.
        }

        // 3. Feedback visual para o usuário: estado de carregamento.
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        // 4. Estrutura try...catch...finally para lidar com a requisição Ajax.
        try {
            // Coleta os dados do formulário.
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // 5. Realiza a requisição com a Fetch API.
            // A função 'sendDataToServer' simula uma chamada de API.
            const response = await sendDataToServer(data);
            
            // Exibe a mensagem de sucesso retornada pelo "servidor".
            showStatusMessage(response.message, 'success');
            form.reset(); // Limpa o formulário após o sucesso.

        } catch (error) {
            // 6. Captura qualquer erro (de rede ou da aplicação) e exibe uma mensagem.
            showStatusMessage(error.message, 'error');
            console.error('Erro no envio do formulário:', error);

        } finally {
            // 7. Bloco 'finally' sempre será executado, restaurando o botão.
            submitButton.disabled = false;
            submitButton.textContent = 'Registrar';
        }
    });

    /**
     * Função que valida os campos do formulário.
     * @returns {boolean} - Retorna true se todos os campos forem válidos, senão false.
     */
    function validateForm() {
        let valid = true;
        const fullName = document.getElementById('fullName');
        const email = document.getElementById('email');
        const password = document.getElementById('password');

        // Validação do nome completo
        if (fullName.value.trim() === '') {
            showError(fullName, 'O nome completo é obrigatório.');
            valid = false;
        }

        // Validação do email
        if (email.value.trim() === '') {
            showError(email, 'O e-mail é obrigatório.');
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            showError(email, 'Por favor, insira um e-mail válido.');
            valid = false;
        }

        // Validação da senha
        if (password.value.length < 8) {
            showError(password, 'A senha deve ter no mínimo 8 caracteres.');
            valid = false;
        }
        
        return valid;
    }

    /**
     * Exibe uma mensagem de erro para um campo específico.
     * @param {HTMLElement} inputElement - O elemento input que tem o erro.
     * @param {string} message - A mensagem de erro a ser exibida.
     */
    function showError(inputElement, message) {
        inputElement.classList.add('is-invalid');
        const errorElement = inputElement.nextElementSibling;
        errorElement.textContent = message;
    }

    /**
     * Limpa todas as mensagens de erro e estilos de erro dos campos.
     */
    function clearErrors() {
        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    }

    /**
     * Exibe uma mensagem de status global (sucesso ou erro).
     * @param {string} message - A mensagem a ser exibida.
     * @param {string} type - O tipo de mensagem ('success' ou 'error').
     */
    function showStatusMessage(message, type) {
        formStatus.textContent = message;
        formStatus.className = type; // Remove classes antigas e adiciona a nova.
        formStatus.style.display = 'block';
    }

    /**
     * SIMULAÇÃO DE UMA API DE BACK-END.
     * Em um projeto real, aqui você faria a chamada fetch para sua URL de verdade.
     * ex: const response = await fetch('https://sua-api.com/register', { ... });
     * @param {object} data - Os dados do formulário a serem enviados.
     * @returns {Promise<object>} - Uma promessa que resolve com a resposta do servidor.
     */
    function sendDataToServer(data) {
        console.log('Dados enviados para o servidor:', data);

        // Simula a latência da rede (1.5 segundos).
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Para testar o cenário de erro, descomente a linha abaixo.
                // if (data.email.includes('erro@')) {
                //     reject(new Error('Este e-mail já está cadastrado. Tente outro.'));
                //     return;
                // }

                // Simula uma resposta de sucesso do servidor.
                resolve({
                    success: true,
                    message: `Obrigado por se cadastrar, ${data.fullName}!`
                });
            }, 1500);
        });
    }
});
