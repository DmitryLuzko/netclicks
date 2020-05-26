// получение кнопок меню
const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');

// открытие/закрытие меню

hamburger.addEventListener('click', event => {
  leftMenu.classList.toggle('openMenu');
  hamburger.classList.toggle('open');
});

document.addEventListener('click', event => { //закрытие меню при клике не в меню
  const target = event.target;
  if (!target.closest('.left-menu')) {
    leftMenu.classList.remove('openMenu');
    hamburger.classList.remove('open');
    console.log(event);
  }
});

leftMenu.addEventListener('click', event => { //открытие меню при клике на иконку, а не на гамбургер
  const target = event.target;
  const dropdown = target.closest('.dropdown')
  if (dropdown) {
    dropdown.classList.toggle('active');
    leftMenu.classList.add('openMenu');
    hamburger.classList.add('open');
  }
});

const tvImg = document.querySelectorAll('.tv-card__img') //изменение картинки фильма при наведении
for (let i = 0; i < tvImg.length; i++) {
    let originalImage = tvImg[i].src;
    tvImg[i].addEventListener('mouseenter', event => {
        tvImg[i].src = tvImg[i].getAttribute("data-backdrop");
    });
    tvImg[i].addEventListener('mouseout', event => {
        tvImg[i].src = originalImage;
    });
};
