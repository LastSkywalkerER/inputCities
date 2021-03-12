/* eslint-disable max-len */
'use strict';

const selectCities = document.getElementById('select-cities'),
  listDefault = document.querySelector('.dropdown-lists__list--default'),
  listSelect = document.querySelector('.dropdown-lists__list--select'),
  listAutocomplete = document.querySelector('.dropdown-lists__list--autocomplete'),
  urlData = 'http://localhost:3000/RU';

const getData = () => fetch(urlData);

const hideAll = () => {
  listDefault.style.display = 'none';
  listSelect.style.display = 'none';
  listAutocomplete.style.display = 'none';
};

const showDefault = () => {
  listDefault.style.display = 'block';
  listSelect.style.display = 'none';
  listAutocomplete.style.display = 'none';
};
const showSelect = () => {
  listDefault.style.display = 'none';
  listSelect.style.display = 'block';
  listAutocomplete.style.display = 'none';
};
const showAutocomplete = () => {
  listDefault.style.display = 'none';
  listSelect.style.display = 'none';
  listAutocomplete.style.display = 'block';
};

const listeners = () => {
  document.addEventListener('click', event => {
    if (event.target === selectCities) {
      showDefault();
    } else if (!event.target.closest('.' + listDefault.classList[1]) && !event.target.closest('.' + listSelect.classList[1]) && !event.target.closest('.' + listAutocomplete.classList[1])) {
      hideAll();
    }
  });

  selectCities.addEventListener('input', () => {
    showSelect();
  });
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

const renderCity = (city) => {};

const renderDefaultList = () => {
  listDefault.childNodes[1].textContent = '';
  getData()
    .then(request => request.json())
    .then(request => {
      request.map(country => bubleSort(country.cities, 'count'));
      request.forEach(country => renderCounry(listDefault.childNodes[1], country));
    });
};

hideAll();
listeners();
renderDefaultList();