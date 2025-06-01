import { AddOrRemoveLike } from "./api.js";
const cardTemplate = document.querySelector('#card-template').content;

// Функция создания карточки
function createCard(
  placeData,
  currentUserId,
  openPopUpImage,
  onDeleteCard,
  handleLikeFromServer
) {
  const placeItem = cardTemplate.querySelector('.places__item').cloneNode(true);
  const placeTitle = placeItem.querySelector('.card__title');
  const placeImage = placeItem.querySelector('.card__image');
  const deleteButton = placeItem.querySelector('.card__delete-button');
  const likeButton = placeItem.querySelector('.card__like-button');
  const likeNumber = placeItem.querySelector('.card__like-number');

  placeTitle.textContent = placeData.name;
  placeImage.src = placeData.link;
  placeImage.alt = placeData.name;
  likeNumber.textContent = placeData.likes.length;

  const isLiked = placeData.likes.some(user => user._id === currentUserId);
  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  }

  // Удаление карточки (только если текущий пользователь является владельцем)
   if (placeData.owner._id !== currentUserId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener('click', () => {
      onDeleteCard(placeData._id, placeItem);
    });
  }

  // Обработка лайков
  likeButton.addEventListener('click', () => {
    const method = placeData.likes.some(user => user._id === currentUserId) ? 'DELETE' : 'PUT';
    handleLikeFromServer(placeData._id, method)
    .then((updatedCard) => {
      placeData.likes = updatedCard.likes;
      likeNumber.textContent = updatedCard.likes.length;

      const likedByUser = updatedCard.likes.some(user => user._id === currentUserId);
      likeButton.classList.toggle('card__like-button_is-active', likedByUser);
    })
    .catch((err) => {
      console.log('Ошибка:', err)
    })
  });

  // Открытие попапа с картинкой
  placeImage.addEventListener('click', () => openPopUpImage(placeData));
  
  return placeItem;
}

function handleLikeFromServer(cardId, method) {
  return AddOrRemoveLike(cardId, method)
}

export { createCard, handleLikeFromServer };