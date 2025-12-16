// ============================================
// EMAILJS - Configuração
// ============================================
// Substitua com suas credenciais do EmailJS
const EMAILJS_CONFIG = {
    publicKey: 'FjMMe_39SqBSgX15m',  // Ex: 'user_abc123xyz'
    serviceId: 'service_anitelli',   // Ex: 'service_abc123'
    templateId: 'template_j862ymlc'  // Ex: 'template_abc123'
};

// Inicializar EmailJS
emailjs.init(EMAILJS_CONFIG.publicKey);

// ============================================
// Validação do Formulário
// ============================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.querySelector('.form-status');

// Validação em tempo real
const inputs = contactForm.querySelectorAll('input, textarea');
inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
        if (input.parentElement.classList.contains('error')) {
            validateField(input);
        }
    });
});

function validateField(field) {
    const formGroup = field.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');
    let isValid = true;
    let message = '';

    // Limpar erro anterior
    formGroup.classList.remove('error');
    errorMessage.textContent = '';

    // Validação de campo vazio
    if (!field.value.trim()) {
        isValid = false;
        message = 'Este campo é obrigatório';
    }

    // Validação de email
    if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            message = 'Email inválido';
        }
    }

    // Validação de nome (mínimo 3 caracteres)
    if (field.id === 'name' && field.value.trim() && field.value.trim().length < 3) {
        isValid = false;
        message = 'Nome deve ter no mínimo 3 caracteres';
    }

    // Validação de mensagem (mínimo 10 caracteres)
    if (field.id === 'message' && field.value.trim() && field.value.trim().length < 10) {
        isValid = false;
        message = 'Mensagem deve ter no mínimo 10 caracteres';
    }

    if (!isValid) {
        formGroup.classList.add('error');
        errorMessage.textContent = message;
    }

    return isValid;
}

// ============================================
// Envio do Formulário com EmailJS
// ============================================
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validar todos os campos
    let isFormValid = true;
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });

    if (!isFormValid) {
        showStatus('Por favor, corrija os erros antes de enviar.', 'error');
        return;
    }

    // Desabilitar botão durante envio
    const submitBtn = contactForm.querySelector('.btn-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const originalText = btnText.textContent;
    
    submitBtn.disabled = true;
    btnText.textContent = 'Enviando...';

    // Preparar dados para o EmailJS
    const templateParams = {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        to_name: 'Guilherme Anitelli', // Seu nome
    };

    try {
        // Enviar email via EmailJS
        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams
        );

        console.log('Email enviado com sucesso!', response.status, response.text);
        
        showStatus('✅ Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
        contactForm.reset();
        
        // Limpar estados de erro
        inputs.forEach(input => {
            input.parentElement.classList.remove('error');
            input.parentElement.querySelector('.error-message').textContent = '';
        });

    } catch (error) {
        console.error('Erro ao enviar email:', error);
        showStatus('❌ Erro ao enviar mensagem. Tente novamente ou entre em contato diretamente pelo email.', 'error');
    } finally {
        submitBtn.disabled = false;
        btnText.textContent = originalText;
    }
});

function showStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    
    setTimeout(() => {
        formStatus.className = 'form-status';
    }, 7000);
}