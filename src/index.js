/* eslint-disable max-len */
'use strict';

const selectCities = document.getElementById('select-cities'),
  listDefault = document.querySelector('.dropdown-lists__list--default'),
  listSelect = document.querySelector('.dropdown-lists__list--select'),
  listAutocomplete = document.querySelector('.dropdown-lists__list--autocomplete'),
  closeButton = document.querySelector('.close-button'),
  button = document.querySelector('.button'),
  label = document.querySelector('label'),
  urlData = 'http://localhost:3000/RU',
  countryLineSelector = '.dropdown-lists__total-line',
  cityLineSelector = '.dropdown-lists__line';
let listState = '';

const getData = callback => fetch(urlData)
  .then(request => request.json())
  .then(request => callback(request));

const hideAll = () => {
  button.setAttribute('disabled', '');
  button.href = '#';
  label.style.display = 'block';
  closeButton.style.display = 'none';
  listState = '';
  listDefault.style.display = 'none';
  listSelect.style.display = 'none';
  listAutocomplete.style.display = 'none';
};

const showDefault = () => {
  button.setAttribute('disabled', '');
  button.href = '#';
  label.style.display = 'none';
  closeButton.style.display = 'none';
  listState = 'default';
  listDefault.style.display = 'block';
  listSelect.style.display = 'none';
  listAutocomplete.style.display = 'none';
};
const showSelect = () => {
  button.setAttribute('disabled', '');
  button.href = '#';
  label.style.display = 'none';
  closeButton.style.display = 'block';
  listState = 'select';
  listDefault.style.display = 'none';
  listSelect.style.display = 'block';
  listAutocomplete.style.display = 'none';
};
const showAutocomplete = () => {
  label.style.display = 'none';
  closeButton.style.display = 'block';
  listState = 'autocomplete';
  listDefault.style.display = 'none';
  listSelect.style.display = 'none';
  listAutocomplete.style.display = 'block';
};



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

const renderCity = (listForInsert, city) => {
  const cityLine = document.createElement('div');
  cityLine.classList.add('dropdown-lists__line');
  cityLine.innerHTML = `
  <div class="dropdown-lists__city">
    ${city.name}
  </div>
  <div class="dropdown-lists__count">${city.count}</div>
  `;

  listForInsert.append(cityLine);
};

const renderDefaultList = () => {
  const insertPoint = listDefault.childNodes[1];
  insertPoint.textContent = '';
  getData(request => {
    request.map(country => bubleSort(country.cities, 'count'));
    request.forEach(country => {
      renderCounry(insertPoint, country);
      for (let i = 0; i < 3; i++) {
        renderCity(insertPoint, country.cities[i]);
      }
    });
    console.log(request);
  });
};

const renderSelectList = countryName => {
  const insertPoint = listSelect.childNodes[1];
  insertPoint.textContent = '';
  getData(request => {
    request.map(country => bubleSort(country.cities, 'count'));
    request.forEach(country => {
      if (country.country === countryName) {
        renderCounry(insertPoint, country);
        country.cities.forEach(city => {
          renderCity(insertPoint, city);
        });
      }
    });
  });
};

const renderAutocompleteList = input => {
  const insertPoint = listAutocomplete.childNodes[1],
    searchingRegular = new RegExp(`^${input}`, `i`);
  insertPoint.textContent = '';
  getData(request => {
    request.map(country => bubleSort(country.cities, 'count'));
    request.forEach(country => {
      country.cities.forEach(city => {
        if (searchingRegular.test(city.name)) {
          button.href = city.link;
          renderCity(insertPoint, city);
        }
      });
    });
    if (!insertPoint.textContent) {
      renderCity(insertPoint, {
        name: 'Ничего не найдено',
        count: ''
      });
    }
  });
};

const listeners = () => {
  document.addEventListener('click', event => {
    if (event.target === selectCities && selectCities.value === '') {
      showDefault();
    } else if (!event.target.closest('.' + listDefault.classList[1]) && !event.target.closest('.' + listSelect.classList[1]) && !event.target.closest('.' + listAutocomplete.classList[1]) && !event.target.closest('#' + selectCities.id) && !event.target.closest('.' + button.classList[0])) {
      selectCities.value = '';
      hideAll();
    }
    if (listState === 'default' && event.target.closest(countryLineSelector)) {
      const clickText = event.target.closest(countryLineSelector).childNodes[1].textContent.trim();
      selectCities.value = clickText;
      renderSelectList(clickText);
      showSelect();
    } else if (listState === 'select' && event.target.closest(countryLineSelector)) {
      selectCities.value = '';
      showDefault();
    }
    if (event.target.closest(cityLineSelector)) {
      const clickText = event.target.closest(cityLineSelector).childNodes[1].textContent.trim();
      selectCities.value = clickText;
      button.removeAttribute('disabled', '');
      renderAutocompleteList(selectCities.value.trim());
      showAutocomplete();
    }
  });

  selectCities.addEventListener('input', () => {
    if (selectCities.value) {
      renderAutocompleteList(selectCities.value.trim());
      showAutocomplete();
    } else {
      showDefault();
    }
  });
};

hideAll();
listeners();
renderDefaultList();