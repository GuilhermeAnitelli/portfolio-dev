// EMAILJS - Configuração
const EMAILJS_CONFIG = {
    publicKey: 'FjMMe_39SqBSgX15m',
    serviceId: 'service_anitelli',
    templateId: 'template_j862yml',
    autoReplyTemplateId: 'template_f550316'
};

emailjs.init(EMAILJS_CONFIG.publicKey);

// Validação do Formulário
const contactForm = document.getElementById('contactForm');
const formStatus = document.querySelector('.form-status');

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

    formGroup.classList.remove('error');
    errorMessage.textContent = '';

    if (!field.value.trim()) {
        isValid = false;
        message = 'Este campo é obrigatório';
    }

    if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            message = 'Email inválido';
        }
    }

    if (field.id === 'name' && field.value.trim() && field.value.trim().length < 3) {
        isValid = false;
        message = 'Nome deve ter no mínimo 3 caracteres';
    }

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

// Envio do Formulário
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

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

    const submitBtn = contactForm.querySelector('.btn-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const originalText = btnText.textContent;
    
    submitBtn.disabled = true;
    btnText.textContent = 'Enviando...';

    const templateParams = {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        to_name: 'Guilherme Anitelli',
    };

    try {
        // Enviar email para você
        await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams
        );

        console.log('✅ Email principal enviado!');
        
        showStatus('✅ Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
        contactForm.reset();
        
        inputs.forEach(input => {
            input.parentElement.classList.remove('error');
            input.parentElement.querySelector('.error-message').textContent = '';
        });

    } catch (error) {
        console.error('❌ Erro detalhado:', error);
        
        let errorMsg = '❌ Erro ao enviar mensagem. ';
        
        if (error.text) {
            if (error.text.includes('Invalid')) {
                errorMsg += 'Configuração inválida do EmailJS.';
            } else if (error.text.includes('template')) {
                errorMsg += 'Template não encontrado.';
            } else if (error.text.includes('service')) {
                errorMsg += 'Serviço de email indisponível.';
            } else {
                errorMsg += error.text;
            }
        } else {
            errorMsg += 'Tente novamente ou entre em contato pelo email.';
        }
        
        showStatus(errorMsg, 'error');
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