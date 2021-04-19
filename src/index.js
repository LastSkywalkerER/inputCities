/* eslint-disable max-len */
'use strict';

// Определяем все элементы страницы и переменные для отображения состояния выпадающего списка
const selectCities = document.getElementById('select-cities'),
  listDefault = document.querySelector('.dropdown-lists__list--default'),
  listSelect = document.querySelector('.dropdown-lists__list--select'),
  listAutocomplete = document.querySelector('.dropdown-lists__list--autocomplete'),
  closeButton = document.querySelector('.close-button'),
  button = document.querySelector('.button'),
  label = document.querySelector('label'),
  mainWindow = document.querySelector('.input-cities'),
  urlData = './db_cities.json',
  countryLineSelector = '.dropdown-lists__total-line',
  cityLineSelector = '.dropdown-lists__line',
  spiner = document.createElement('div'),
  modal = document.querySelector('modal'),
  mainBlockWidth = mainWindow.clientWidth;
let listState = '',
  appData = localStorage.getItem('local') ? JSON.parse(localStorage.getItem('local')) : false,
  local = 'RU',
  notFoundText = '';



// анимация загрузки данных
const loadingPage = () => {
  spiner.classList.add('sk-circle-bounce');
  for (let i = 1; i < 13; i++) {
    spiner.insertAdjacentHTML('beforeend', `<div class='sk-child sk-circle-${i}'></div>`);
  }

  mainWindow.style.display = 'none';
  mainWindow.insertAdjacentElement('afterend', spiner);
};

// отображение элементов после загрузки данных
const loadedPgae = () => {
  spiner.remove();
  mainWindow.style.display = 'block';
};

// зпрос на получение данных с сервера
const getData = callback => fetch(urlData)
  .then(request => request.json())
  .then(request => callback(request[local]));

// создание контейнера для страны с городами и отрисовка строки с этой страной
const renderCounry = (listForInsert, country) => {
  const countryBlock = document.createElement('div');
  countryBlock.classList.add('dropdown-lists__countryBlock');
  countryBlock.innerHTML = `
    <div class="dropdown-lists__total-line">
      <div class="dropdown-lists__country">${country.country}</div>
      <div class="dropdown-lists__count">${country.count}</div>
    </div>
    `;

  listForInsert.append(countryBlock);
};

// отрисовка городов в быранной стране
const renderCity = (listForInsert, city, matchReg, input = '') => {
  const cityLine = document.createElement('div');
  cityLine.classList.add('dropdown-lists__line');
  cityLine.innerHTML = `
    <div class="dropdown-lists__city">
      <strong>${input.slice(0, 1).toUpperCase() + input.slice(1).toLowerCase()}</strong>${city.name.replace(matchReg, '')}
    </div>
    <div class="dropdown-lists__count">${city.count}</div>
    `;

  listForInsert.append(cityLine);
};

// отрисовка стандартного списка со странами и ТОП-3 городами
const renderDefaultList = () => {
  const insertPoint = listDefault.childNodes[1];
  insertPoint.textContent = '';

  appData.forEach(country => {
    renderCounry(insertPoint, country);
    for (let i = 0; i < 3; i++) {
      renderCity(insertPoint, country.cities[i]);
    }
  });

};

// отрисовка списка с выбранной страной и всеми её городами
const renderSelectList = countryName => {
  const insertPoint = listSelect.childNodes[1];
  insertPoint.textContent = '';
  appData.forEach(country => {
    if (country.country === countryName) {
      renderCounry(insertPoint, country);
      country.cities.forEach(city => {
        renderCity(insertPoint, city);
      });
    }
  });
};

// отрисовка списка городов совпадающих с введёнными буквами
const renderAutocompleteList = input => {
  const insertPoint = listAutocomplete.childNodes[1],
    searchingRegular = new RegExp(`^${input}`, `gi`);
  insertPoint.textContent = '';
  appData.forEach(country => {
    country.cities.forEach(city => {
      if (searchingRegular.test(city.name)) {
        button.href = city.link;
        renderCity(insertPoint, city, searchingRegular, input);
      }
    });
  });
  if (!insertPoint.textContent) {
    renderCity(insertPoint, {
      name: notFoundText,
      count: ''
    });
  }
};

// прячем все списки и чистим состояния
const hideAll = () => {
  // button.setAttribute('disabled', '');
  // button.href = '#';
  label.style.display = 'block';
  // closeButton.style.display = 'none';
  listState = '';
  listDefault.style.display = 'none';
  listSelect.style.display = 'none';
  listAutocomplete.style.display = 'none';
};

// показываем стандартный список, чистим кнопку и инпут
const showDefault = () => {
  button.setAttribute('disabled', '');
  button.href = '#';
  selectCities.value = '';
  // label.style.display = 'none';
  // closeButton.style.display = 'none';
  listDefault.style.display = 'block';
  listSelect.style.display = 'none';
  listAutocomplete.style.display = 'none';
};

// показываем список выбранной страны, чистим кнопку, передаём в инпут выбранную страну
const showSelect = event => {
  button.setAttribute('disabled', '');
  button.href = '#';
  const clickText = event.target.closest(countryLineSelector).childNodes[1].textContent.trim();
  selectCities.value = clickText;
  renderSelectList(clickText);
  label.style.display = 'none';
  closeButton.style.display = 'block';
  listDefault.style.display = 'none';
  listSelect.style.display = 'block';
  listAutocomplete.style.display = 'none';
};

// показываем список с автозаполнением, меняем сосотояние
const showAutocomplete = () => {
  // label.style.display = 'none';
  // closeButton.style.display = 'block';
  listState = 'autocomplete';
  listDefault.style.display = 'none';
  listSelect.style.display = 'none';
  listAutocomplete.style.display = 'block';
};

// сортировка пузырьком по убыванию и по свойству
const bubleSort = (array, property) => {
  for (let i in array) {
    for (let j = 1; j < array.length - i; j++) {
      if (+array[j - 1][property] < +array[j][property]) {
        const temp = array[j - 1];
        array[j - 1] = array[j];
        array[j] = temp;
      }
    }
  }
  return array;
};

// тригер анимации
const toggleAnimation = event => {
  let position = 0;

  mainWindow.childNodes[9].style.overflowX = 'hidden';
  mainWindow.childNodes[9].childNodes[1].style.width = `${mainBlockWidth * 2}px`;
  mainWindow.childNodes[9].childNodes[1].style.position = 'relative';

  //анимация от стандартного к выбору
  const animationDefault = () => {
    showSelect(event);
    listDefault.style.display = 'block';

    position += 50;
    mainWindow.childNodes[9].childNodes[1].style.right = `${position}px`;

    if (position <= mainBlockWidth) {
      requestAnimationFrame(animationDefault);
      return;
    }

    showSelect(event);

    mainWindow.childNodes[9].childNodes[1].style.width = `100%`;
    mainWindow.childNodes[9].childNodes[1].style.position = 'static';
  };

  //анимация от выбора к стандартному
  const animationSelect = () => {
    showDefault();
    listSelect.style.display = 'block';

    position -= 50;
    mainWindow.childNodes[9].childNodes[1].style.right = `${position}px`;

    if (position >= 0) {
      requestAnimationFrame(animationSelect);
      return;
    }

    showDefault(event);

    mainWindow.childNodes[9].childNodes[1].style.width = `100%`;
    mainWindow.childNodes[9].childNodes[1].style.position = 'static';
  };

  if (listState === 'default') {
    position = 0;
    requestAnimationFrame(animationDefault);
    listState = 'select';
  } else if (listState === 'select') {
    position = mainBlockWidth;
    requestAnimationFrame(animationSelect);
    listState = 'default';
  }

};

// вешаем события
const listeners = () => {
  // проверяем клик
  document.addEventListener('click', event => {
    // клик по инпуту - показываем стандартный список, если мимо прячем всё
    if (event.target === selectCities) {
      showDefault();
      listState = 'default';
    } else if (!event.target.closest('.' + listDefault.classList[1]) && !event.target.closest('.' + listSelect.classList[1]) && !event.target.closest('.' + listAutocomplete.classList[1]) && !event.target.closest('#' + selectCities.id) && !event.target.closest('.' + button.classList[0])) {
      // selectCities.value = '';
      hideAll();
    }
    // клик по стране, переключение списков между стандартным и выбором городов
    if (event.target.closest(countryLineSelector)) {
      toggleAnimation(event);
    }
    // клик по городу - заполнем инпут и кнопку
    if (event.target.closest(cityLineSelector)) {
      const clickText = event.target.closest(cityLineSelector).childNodes[1].textContent.trim();
      selectCities.value = clickText;
      button.removeAttribute('disabled', '');
      renderAutocompleteList(selectCities.value.trim());
      hideAll();
    }
    // переход по ссылке тоже всё чистит
    if (event.target.closest('.' + button.classList[0])) {
      selectCities.value = '';
      hideAll();
    }
    // убираем бесящий лейбл если поле нее пустое при кликах
    if (selectCities.value) {
      label.style.display = 'none';
      closeButton.style.display = 'block';
    } else {
      label.style.display = 'block';
      closeButton.style.display = 'none';
    }
    // клик по кресту чистит всё
    if (event.target.closest('.' + closeButton.classList[0])) {
      selectCities.value = '';
      hideAll();
      closeButton.style.display = 'none';
    }


  });

  // обработка ввода города
  selectCities.addEventListener('input', () => {
    if (selectCities.value) {
      renderAutocompleteList(selectCities.value.trim());
      showAutocomplete();
    } else {
      showDefault();
      listState = 'default';
    }

    if (selectCities.value) {
      label.style.display = 'none';
      closeButton.style.display = 'block';
    } else {
      label.style.display = 'block';
      closeButton.style.display = 'none';
    }
  });
};

// если данные подгрузились из локального хранилища, то грузим страницу. Если нет, то подгружаем данные с сервера на страницу и в локальное хранилище
const saveData = () => {
  if (appData) {
    loadedPgae();
    hideAll();
    listeners();
    renderDefaultList();
  } else {
    getData(request => {
      request.map(country => bubleSort(country.cities, 'count'));
      let mainCountry = '',
        index = 1;
      switch (local) {
        case 'RU':
          mainCountry = 'Россия';
          break;
        case 'EN':
          mainCountry = 'United Kingdom';
          break;
        case 'DE':
          mainCountry = 'Deutschland';
          break;
      }
      appData = [];
      request.forEach(country => {
        if (country.country === mainCountry) {
          appData[0] = country;
        } else {
          appData[index] = country;
          index++;
        }
      });
      localStorage.setItem('local', JSON.stringify(appData));
      loadedPgae();
      hideAll();
      listeners();
      renderDefaultList();
    });
  }
};

// переводим вёрску в выбранный язык
const translatePage = () => {
  let labelText = '',
    buttonText = '';
  switch (local) {
    case 'RU':
      notFoundText = 'Ничего не найдено';
      labelText = 'Страна или город';
      buttonText = 'Перейти';
      break;
    case 'EN':
      notFoundText = 'Nothing found';
      labelText = 'Country or city';
      buttonText = 'Go over';
      break;
    case 'DE':
      notFoundText = 'Niets gevonden';
      labelText = 'Land of stad';
      buttonText = 'Ga over';
      break;
  }
  label.textContent = labelText;
  button.textContent = buttonText;
};

// проверяем установлена ли локализация сайта в куки, если да, то просто грузим страницу без модалки, иначе узнаю и пишем в куки
const checkLocal = () => {
  if (document.cookie) {
    modal.style.display = 'none';
    local = document.cookie;
    saveData();
    translatePage();
  } else {
    modal.addEventListener('input', event => {
      local = event.target.value;
      document.cookie = local;
      modal.style.display = 'none';
      appData = false;
      saveData();
      translatePage();
    });
  }
};

// грузим данные и по загрузке рисуем элементы
loadingPage();
checkLocal();