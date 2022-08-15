import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix  from 'notiflix';
import {fetchCountries} from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const refs = {
    inputField: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('country-info'),
};
//console.log(refs)

refs.inputField.addEventListener('input', debounce((onSearch), DEBOUNCE_DELAY))

//інпут. видавати інфо по країнам при інпуті.
function onSearch(event) {
    event.preventDefault();
    clearCountries();
    const countrySearchQuery = event.target.value.trim();
    //console.log(searchCountry);
    if (!countrySearchQuery) {  //якщо запит - це пуста строка
        return
    }
    fetchCountries(countrySearchQuery)//отримання країн - через фу-цію фетч -на іншій вкладці. Тут вже умови прописуємо
        .then(data => {
            if (data.length > 10) {
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.')
                return
            } else if (data.length === 1) {
                renderCountryInfo(data);
            } else {
                renderCountryList(data);
            }
        })
        .catch( error => {
            Notiflix.Notify.failure('Oops, there is no country with that name');
        });

}

//рендеринг країн

function renderCountryList(item) {
    const markupList = item
     .map(({ name, flags }) => {
         return `<li>
      <img src="${flags.svg}" alt="${name.official}" width="40">
      <p>${name.official}</p>
      </li>`;
    })
    .join('');
  refs.countryList.innerHTML = markupList;
} 

function renderCountryInfo(items){
    const markupInfo = items
        .map(({ name, capital, population, flags, languages }) => {
            return ` <div>
        <h1>${name.official}</h1>
        <img src="${flags.svg}" alt="${name.official}" width="40" > 
      <p> ${capital}</p>
      <p> ${population}</p>
      <p> ${Object.values(languages)} </p>
      </div>`;
    }).join('');
      refs.countryInfo.innerHTML = markupInfo;
    }
   

//очищуємо пошук
function clearCountries() {
    // refs.countryList.innerHTML='';
    // refs.countryInfo.innerHTML='';
    refs.innerHTML = '';
    
}