// отображение ошибки
const showInputError = (form, input, config) => {
  const error = form.querySelector(`.${input.id}-error`);
  input.classList.add(config.inputErrorClass);
  error.textContent = input.validationMessage;
  error.classList.add(config.errorClass);
};

// скрытие ошибки
const hideInputError = (form, input, config) => {
  const error = form.querySelector(`.${input.id}-error`);
  input.classList.remove(config.inputErrorClass);
  error.classList.remove(config.errorClass);
  error.textContent = '';
};

// проверка на валидность данных
const checkInputValidity = (form, input, config) => {
  if (input.validity.patternMismatch) {
    input.setCustomValidity(input.dataset.errorMessage);
  } else {
    input.setCustomValidity('');
  }

  if (!input.validity.valid) {
    showInputError(form, input, config);
  } else {
    hideInputError(form, input, config);
  }
};

// проверка на наличие невалидных полей в форме
const hasInvalidInput = (inputs) => {
  return inputs.some((input) => {
    return !input.validity.valid;
  })
};

// изменение стилей кнопки отправки в зависимости от валидности полей
const toggleButtonState = (inputs, submitButton, config) => {
  if (hasInvalidInput(inputs)) {
    submitButton.disabled = true;
    submitButton.classList.add(config.inactiveButtonClass);
  } else {
    submitButton.disabled = false;
    submitButton.classList.remove(config.inactiveButtonClass);
  }
};

// инициализация валидации
const enableValidation = (config) => {
  const forms = Array.from(document.querySelectorAll(config.formSelector));
  forms.forEach((form) => {
    form.addEventListener('submit', (evt) => {
      evt.preventDefault();
    });
    setEventListeners(form, config)});
};

// навешивание слушателей на все поля формы
const setEventListeners = (form, config) => {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const submitButton = form.querySelector(config.submitButtonSelector);
  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      checkInputValidity(form, input, config);
      toggleButtonState(inputs, submitButton, config);
    });
  });
};

// очистка валидации 
const clearValidation = (form, config) => {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const submitButton = form.querySelector(config.submitButtonSelector);
  inputs.forEach((input) => {
    input.setCustomValidity('');
    hideInputError(form, input, config);
  });
  toggleButtonState(inputs, submitButton, config);
}

export { enableValidation, clearValidation };
