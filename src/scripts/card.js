const cardTemplate = document.querySelector('#card-template').content;

// функция создания карточки
function createCard(placeData, deleteCard, likeCard, openPopUpImage) {
  const placeItem = cardTemplate.querySelector('.places__item').cloneNode(true);

  const placeTitle = placeItem.querySelector('.card__title');
  const placeImage =  placeItem.querySelector('.card__image');
  const deleteButton = placeItem.querySelector('.card__delete-button');
  const likeButton = placeItem.querySelector('.card__like-button');

  placeImage.src = placeData.link;
  placeImage.alt = placeData.name;
  placeTitle.textContent = placeData.name;

  deleteButton.addEventListener('click', () => deleteCard(placeItem));
  likeButton.addEventListener('click', () => likeCard(likeButton));
  placeImage.addEventListener('click', () => openPopUpImage(placeData));

  return placeItem;
}

// функция удаления карточки
function deleteCard(placeItem) {
  placeItem.remove();
}

// функция постановки и убирания лайка
function likeCard(likeButton) {
  likeButton.classList.toggle('card__like-button_is-active');
}


export {createCard, deleteCard, likeCard}