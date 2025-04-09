const cardTemplate = document.querySelector('#card-template').content;

function createCard(placeData, deleteCard) {
  const placeItem = cardTemplate.querySelector('.places__item').cloneNode(true);

  const placeTitle = placeItem.querySelector('.card__title');
  const placeImage =  placeItem.querySelector('.card__image');
  const deleteButton = placeItem.querySelector('.card__delete-button');

  placeImage.src = placeData.link;
  placeImage.alt = placeData.name;
  placeTitle.textContent = placeData.name;

  deleteButton.addEventListener('click', () => deleteCard(placeItem));
  return placeItem;
}

function deleteCard(placeItem) {
  placeItem.remove();
}

const placesList = document.querySelector('.places__list');

function renderCards(cards) {
  cards.forEach(item => {
      placesList.append(createCard(item, deleteCard));
  });
}

renderCards(initialCards);
