/* eslint-disable max-len */
'use strict';

const selectCities = document.getElementById('select-cities'),
  listDefault = document.querySelector('.dropdown-lists__list--default'),
  listSelect = document.querySelector('.dropdown-lists__list--select'),
  listAutocomplete = document.querySelector('.dropdown-lists__list--autocomplete');

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
    } else if (event.target.closest(listDefault.classList) || event.target.closest(listSelect.classList) || event.target.closest(listAutocomplete.classList)) {
      hideAll();
    }
  });

  selectCities.addEventListener('input', () => {
    showSelect();
  });

};

hideAll();
listeners();