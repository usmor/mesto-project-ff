import '../pages/index.css';
import { initialCards } from './cards.js';
import { createCard, deleteCard, likeCard } from './card.js';
import { closePopUp, openPopUp, openPopUpImage } from './modal.js';

const placesList = document.querySelector('.places__list');

// Переменные для попапа "Редактировать профиль"
const profileFormPopUp = document.querySelector('.popup_type_edit');
const profileForm = profileFormPopUp.querySelector('.popup__form');
const profileTitleInput = profileForm.querySelector('.popup__input_type_name');
const profileDescriptionInput = profileForm.querySelector('.popup__input_type_description');
const openProfilePopUp = document.querySelector('.profile__edit-button');
const closeProfilePopUp = profileFormPopUp.querySelector('.popup__close');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

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

// Слушатели для открытия попапов
openProfilePopUp.addEventListener('click', () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openPopUp(profileFormPopUp);
});
openCardPopUp.addEventListener('click', () => openPopUp(cardFormPopUp));

// Слушатели для закрытия попапов
closeProfilePopUp.addEventListener('click', () => closePopUp(profileFormPopUp));
closeCardPopUp.addEventListener('click', () => closePopUp(cardFormPopUp));
closeImagePopUp.addEventListener('click', () => closePopUp(imagePopUp));

// Обработка формы "Редактировать профиль"
function handleProfileFormSubmit(event) {
  event.preventDefault();
  profileTitle.textContent = profileTitleInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closePopUp(profileFormPopUp);
}
profileForm.addEventListener('submit', handleProfileFormSubmit);

// Обработка формы "Добавить карточку"
function handleCardFormSubmit(event) {
  event.preventDefault();

  const cardData = {
    name: cardFormNameInput.value,
    link: cardFormLinkInput.value
  };

  placesList.prepend(createCard(cardData, deleteCard, likeCard, openPopUpImage));
  closePopUp(cardFormPopUp);
  cardForm.reset();
}
cardForm.addEventListener('submit', handleCardFormSubmit);

// Отрисовка карточек
function renderCards(cards) {
  cards.forEach((item) => {
    placesList.append(createCard(item, deleteCard, likeCard, openPopUpImage));
  });
}
renderCards(initialCards);
