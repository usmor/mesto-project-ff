import '../pages/index.css';
import { createCard, handleLikeFromServer } from './card.js';
import { closePopUp, openPopUp } from './modal.js';
import { enableValidation, clearValidation } from './validation.js';
import { getProfileInfo, getInitialCards, updateProfileInfo, postNewCard, deleteCardFromServer, updateAvatar } from './api.js';

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__input-error_active'
};

let currentUserId;

const placesList = document.querySelector('.places__list');
const popups = document.querySelectorAll('.popup');
popups.forEach((popup) => {
  popup.classList.add('popup_is-animated');
})

// Переменные для попапа "Редактировать профиль"
const profileFormPopUp = document.querySelector('.popup_type_edit');
const profileForm = profileFormPopUp.querySelector('.popup__form');
const profileTitleInput = profileForm.querySelector('.popup__input_type_name');
const profileDescriptionInput = profileForm.querySelector('.popup__input_type_description');
const openProfilePopUp = document.querySelector('.profile__edit-button');
const closeProfilePopUp = profileFormPopUp.querySelector('.popup__close');

// Данные профиля
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__avatar-image');
const profileAvatarEdit = profileAvatar.querySelector('.profile__avatar-edit-button');

// Переменные для попапа "Изменить аватарку" 
const avatarFormPopup = document.querySelector('.popup_type_avatar');
const avatarForm = avatarFormPopup.querySelector('.popup__form');
const avatarLinkInput = avatarForm.querySelector('.popup__input_type_url');
const closeAvatarPopup = avatarFormPopup.querySelector('.popup__close');

// Переменные для попапа "Добавить карточку"
const cardFormPopUp = document.querySelector('.popup_type_new-card');
const cardForm = cardFormPopUp.querySelector('.popup__form');
const cardFormNameInput = cardForm.querySelector('.popup__input_type_card-name');
const cardFormLinkInput = cardForm.querySelector('.popup__input_type_url');
const openCardPopUp = document.querySelector('.profile__add-button');
const closeCardPopUp = cardFormPopUp.querySelector('.popup__close');

// Переменные для попапа "Посмотреть картинку"
const imagePopUp = document.querySelector('.popup_type_image');
const closeImagePopUp = imagePopUp.querySelector('.popup__close');
const imageElement = imagePopUp.querySelector('.popup__image');
const imageCaption = imagePopUp.querySelector('.popup__caption');

// Переменные для удаления карточки
const deletePopUp = document.querySelector('.popup_type_delete');
const deleteForm = deletePopUp.querySelector('.popup__form');
const closeDeletePopUp = deletePopUp.querySelector('.popup__close');
let cardForDelete = {};

// Загрузка
function renderLoading(button, isLoading) {
  if (isLoading) {
    button.textContent = 'Сохранение...';
  }
  else {
    button.textContent = 'Сохранить';
  }
}

// Обработка формы "Редактировать профиль"
function handleProfileFormSubmit(event) {
  event.preventDefault();
  const buttonSubmit = profileForm.querySelector('.popup__button');
  renderLoading(buttonSubmit, true);
  const name = profileTitleInput.value;
  const about = profileDescriptionInput.value;

  updateProfileInfo(name, about)
    .then((res) => {
      profileTitle.textContent = res.name;
      profileDescription.textContent = res.about;
      closePopUp(profileFormPopUp);
    })
    .catch((error) => {
      console.log('Ошибка при редактировании информации профиля:', error);
    })
    .finally(() => renderLoading(buttonSubmit, false));
}

function handleAvatarFormSubmit(event) {
  event.preventDefault();
  const buttonSubmit = avatarForm.querySelector('.popup__button');
  renderLoading(buttonSubmit, true);
  const avatarLink = avatarLinkInput.value;

  updateAvatar(avatarLink)
  .then((res) => {
    profileAvatar.style.backgroundImage = `url(${res.avatar})` ;
    closePopUp(avatarFormPopup)
  })
  .catch((error) => {
    console.log('Ошибка при обновлении аватарки:', error);
  })
  .finally(() => renderLoading(buttonSubmit, false));
}

// Отрисовка информации о пользователе
function renderProfileInfo (user) {
  profileTitle.textContent = user.name;
  profileDescription.textContent = user.about;
  profileAvatar.style.backgroundImage = `url(${user.avatar})`;
}

// Обработка формы "Добавить карточку"
function handleCardFormSubmit(event) {
  event.preventDefault();

  const buttonSubmit = cardForm.querySelector('.popup__button');
  renderLoading(buttonSubmit, true);

  const name = cardFormNameInput.value;
  const link = cardFormLinkInput.value;
  
  postNewCard(name, link)
  .then((cardData) => {
    const newCard = createCard(
      cardData,
      currentUserId,
      openPopUpImage,
      handleDeleteCard,
      handleLikeFromServer
    );
    placesList.prepend(newCard);
    closePopUp(cardFormPopUp);
    cardForm.reset();
  })
  .finally(() => renderLoading(buttonSubmit, false));
}

// Функция открытия картинки
function openPopUpImage(dataImage) {
  imageElement.src = dataImage.link;
  imageElement.alt = dataImage.name;
  imageCaption.textContent = dataImage.name;
  openPopUp(imagePopUp);
}

const handleDeleteCard = (cardId, card) => {
  cardForDelete = {
    id: cardId,
    card
  };
  openPopUp(deletePopUp);
};

const handleDeleteCardSubmit = (evt) => {
  evt.preventDefault();
  if (!cardForDelete.card) return;

  deleteCardFromServer(cardForDelete.id)
    .then(() => {
      cardForDelete.card.remove();
      closePopUp(deletePopUp);
      cardForDelete = {};
    })
    .catch((error) => {
      console.log('Ошибка при удалении карточки:', error);
    });
};

function renderCards(cards) {
  cards.forEach((cardData) => {
    const cardElement = createCard(
      cardData,
      currentUserId,
      openPopUpImage,
      handleDeleteCard,
      handleLikeFromServer
    );
    placesList.append(cardElement);
  });
}

// Слушатели для открытия попапов
openProfilePopUp.addEventListener('click', () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationConfig);
  openPopUp(profileFormPopUp);
});

openCardPopUp.addEventListener('click', () => {
  cardForm.reset();
  clearValidation(cardForm, validationConfig);
  openPopUp(cardFormPopUp)
});

profileAvatarEdit.addEventListener('click', () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openPopUp(avatarFormPopup);
});

// Слушатели для закрытия попапов
closeProfilePopUp.addEventListener('click', () => closePopUp(profileFormPopUp));
closeCardPopUp.addEventListener('click', () => closePopUp(cardFormPopUp));
closeImagePopUp.addEventListener('click', () => closePopUp(imagePopUp));
closeDeletePopUp.addEventListener('click', () => closePopUp(deletePopUp));
closeAvatarPopup.addEventListener('click', () => closePopUp(avatarFormPopup));

profileForm.addEventListener('submit', handleProfileFormSubmit);
cardForm.addEventListener('submit', handleCardFormSubmit);
deleteForm.addEventListener('submit', handleDeleteCardSubmit);
avatarForm.addEventListener('submit', handleAvatarFormSubmit);

// Вызов функции валидации форм
enableValidation(validationConfig);

Promise.all([getProfileInfo(), getInitialCards()])
.then(([user, cards]) => {
  currentUserId = user._id;
  renderProfileInfo(user);
  renderCards(cards)
})
.catch((error) => {
  console.log('Ошибка:', error);
});

