const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2',
  API_KEY = '705e304a1444804fc433c2e12ba7b051';

// получение элементов страницы
const leftMenu = document.querySelector('.left-menu'),
  hamburger = document.querySelector('.hamburger'),
  tvShowsList = document.querySelector('.tv-shows__list'),
  modal = document.querySelector('.modal');

const DBService = class { //создание карточек
  getData = async (url) => {
    const res = await fetch(url);
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(`Не удалось получить данные по адресу ${url}`)
    }

  }

  getTestData = async () => {
    return await this.getData('test.json')
  }
}

const renderCard = response => {
  console.log(response);
  tvShowsList.textContent = '';

  response.results.forEach(({backdrop_path: backdrop,
                            name: title,
                            poster_path: poster,
                            vote_average: vote
  }) => {
    const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
    const backdropIMG = backdrop ? `data-backdrop="${IMG_URL}${ backdrop }"` : null;
    const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

    const card = document.createElement('li');
    card.className = 'tv-shows__item';
    card.innerHTML = `
      <a href="#" class="tv-card">
          ${voteElem}
          <img class="tv-card__img"
               src="${posterIMG}"
               ${backdropIMG}"
               alt="${title}">
          <h4 class="tv-card__head">${title}</h4>
      </a>
    `;
    tvShowsList.append(card);
  });
};

new DBService().getTestData().then(renderCard);


// открытие/закрытие меню

hamburger.addEventListener('click', event => {
  leftMenu.classList.toggle('openMenu');
  hamburger.classList.toggle('open');
});

//закрытие меню при клике не в меню
document.addEventListener('click', event => {
  const target = event.target;
  if (!target.closest('.left-menu')) {
    leftMenu.classList.remove('openMenu');
    hamburger.classList.remove('open');
    console.log(event);
  }
});

//открытие меню при клике на иконку, а не на гамбургер
leftMenu.addEventListener('click', event => {
  const target = event.target;
  const dropdown = target.closest('.dropdown')
  if (dropdown) {
    dropdown.classList.toggle('active');
    leftMenu.classList.add('openMenu');
    hamburger.classList.add('open');
  }
});

//изменение картинки фильма при наведении
const changeImg = event => {
  const card = event.target.closest('.tv-shows__item');
  if (card) {
    const img = card.querySelector('.tv-card__img');
    if (img.dataset.backdrop) {
      [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
    }
    img.dataset.max = '123';
  }
};

tvShowsList.addEventListener('mouseover', changeImg);
tvShowsList.addEventListener('mouseout', changeImg);

//открытие модального окна
tvShowsList.addEventListener('click', event => {
  event.preventDefault();
  const target = event.target;
  const card = target.closest('.tv-card');
  if (card) {
    document.body.style.overflow = 'hidden';
    modal.classList.remove('hide');
  };
});

// закрытие модального окна
modal.addEventListener('click', event => {
  if (event.target.closest('.cross') ||
    event.target.classList.contains('modal')) {
    document.body.style.overflow = '';
    modal.classList.add('hide');
  };
})
