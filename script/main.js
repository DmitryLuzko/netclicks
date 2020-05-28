const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2',
  SERVER = 'https://api.themoviedb.org/3'
  API_KEY = '705e304a1444804fc433c2e12ba7b051';

// получение элементов страницы
const leftMenu = document.querySelector('.left-menu'),
  hamburger = document.querySelector('.hamburger'),
  tvShowsList = document.querySelector('.tv-shows__list'),
  modal = document.querySelector('.modal'),
  tvShows = document.querySelector('.tv-shows'),
  tvCardImg = document.querySelector('.tv-card__img'),
  modalTitle = document.querySelector('.modal__title'),
  rating = document.querySelector('.rating'),
  genresList = document.querySelector('.genres-list'),
  description = document.querySelector('.description'),
  modalLink = document.querySelector('.modal__link'),
  searchForm = document.querySelector('.search__form')
  searchFormInput = document.querySelector('.search__form-input')

const loading = document.createElement('div');
loading.className = 'loading';

//создание карточек
const DBService = class {
  getData = async (url) => {
    const res = await fetch(url);
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(`Не удалось получить данные по адресу ${url}`)
    }
  }

  getTestData = () => this.getData('test.json');

  getTestCard = () => this.getData('card.json');

  getSearchResult = query => this.getData(`${SERVER}/search/tv?api_key=${API_KEY}&query=${query}&language=ru-RU`);

  getTvShow = id => this.getData(`${SERVER}/tv/${id}?api_key=${API_KEY}&language=ru-RU`);
}

const renderCard = response => {
  tvShowsList.textContent = '';

  response.results.forEach(({
    backdrop_path: backdrop,
    name: title,
    poster_path: poster,
    vote_average: vote,
    id
  }) => {
    const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
    const backdropIMG = backdrop ? `data-backdrop="${IMG_URL}${backdrop}"` : null;
    const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

    const card = document.createElement('li');
    card.idTv = id;
    card.className = 'tv-shows__item';
    card.innerHTML = `
      <a href="#" id = ${id} class="tv-card">
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

  if (!response.results.length) {
      tvShowsList.innerHTML = `<p>Такого сериала не существует, введите корректное название</p>`;
  }

  loading.remove();
};

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  const value = searchFormInput.value.trim();
  searchFormInput.value = '';
  if (value) {
    tvShows.append(loading);
    new DBService().getSearchResult(value).then(renderCard);
  }
});

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
  }
});

//открытие меню при клике на иконку, а не на гамбургер
leftMenu.addEventListener('click', event => {
  event.preventDefault();
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

    new DBService().getTvShow(card.id)
      .then(data => {
        console.log(data);
        tvCardImg.src = IMG_URL + data.poster_path;
        modalTitle.textContent = data.name;
        genresList.textContent = '';
        for (const item of data.genres) {
          genresList.innerHTML += `<li>${item.name}</li>`
        };
        rating.textContent = data.vote_average;
        description.textContent = data.overview;
        modalLink.href = data.homepage;
      })

      .then(() => {
        document.body.style.overflow = 'hidden';
        modal.classList.remove('hide');
      })

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
