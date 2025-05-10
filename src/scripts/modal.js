// функция открытия попапа
function openPopUp(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', closePopUpEsc);
  popup.addEventListener('click', closePopUpOverlay);
}

// функция закрытия попапа
function closePopUp(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', closePopUpEsc);
  popup.removeEventListener('click', closePopUpOverlay);
}

// функция закрытия попапа через оверлей
function closePopUpOverlay(event) {
  if (event.target.classList.contains('popup')) {
    closePopUp(event.target);
  }
}

// функция закрытия попапа через эскейп
function closePopUpEsc(event) {
  if (event.key === 'Escape') {
    const popup = document.querySelector('.popup_is-opened');
    closePopUp(popup);
  }
}

export { openPopUp, closePopUp }