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

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    try {
        await simulateFormSubmit(formData);
        
        showStatus('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
        contactForm.reset();
    } catch (error) {
        showStatus('Erro ao enviar mensagem. Tente novamente mais tarde.', 'error');
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
    }, 5000);
}

function simulateFormSubmit(data) {
    return new Promise((resolve) => {
        console.log('Dados do formulário:', data);
        setTimeout(resolve, 1500);
    });
}

// Para integração real, use:
// - Formspree: https://formspree.io/
// - EmailJS: https://www.emailjs.com/
// - Netlify Forms (se hospedado na Netlify)