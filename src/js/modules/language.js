class Language {
    constructor() {
        this.languages = ['ru-RU', 'uk-UK', 'en-US'];
        this.currentLang = localStorage.getItem('lang');
        this.langSwitch = document.body.querySelector('.js-lang-switch');
        this.glossary = {
            'ru-RU': {
                '.js-logo': 'Киносклад',
                '.js-home-link': 'Главная',
                '.js-discover-link': 'Все фильмы',
                '.js-popular-this-week-title': 'Популярное на этой неделе',
                '.js-movie-card__original-title-title': 'Оригинальное название:',
                '.js-movie-card__release-date-title': 'Дата выхода:',
                '.js-movie-card__genres-title': 'Жанры:',
                '.js-movie-card__overview-title': 'Описание:',
                '.js-movie-card__vote-average-title': 'Рейтинг на IMDb',
                '.js-home-page-discover__title': 'Список фильмов',
                '.js-home-page-discover__popular-button': 'Популярные',
                '.js-home-page-discover__rating-button': 'Рейтинговые',
                '.js-home-page-discover__search-input': 'Название фильма',
                '.js-home-page-discover__discover-more': 'Полный список',
                '.js-discover-header__search-input': 'Введите название фильма',
                '.js-discover-header__sort-by_popularity': 'По популярности',
                '.js-discover-header__sort-by_rating': 'По рейтингу',
                '.js-discover-header__sort-by_novelty': 'По новизне',
                '.js-discover-movies__filters-genres-title': 'Жанры:',
                '.js-discover-movies__filters-year-title': 'Год выхода:',
                '.js-discover-movies__filters-submit-button': 'Применить',
                '.js-movie-description__runtime-minutes': 'мин',
                '.js-movie-info__starring-title': 'В главных ролях:',
                '.js-movie-info__trailer-title': 'Трейлер к фильму:',
                '.js-movie-info__simular-movies-title': 'Похожие фильмы:'                
            },
            'uk-UK': {
                '.js-logo': 'Кіносклад',
                '.js-home-link': 'Головна',
                '.js-discover-link': 'Усі фільми',
                '.js-popular-this-week-title': 'Популярне на цьому тижні',
                '.js-home-page-discover__title': 'Список фільмів',
                '.js-movie-card__original-title-title': 'Оригінальна назва:',
                '.js-movie-card__release-date-title': 'Дата виходу:',
                '.js-movie-card__genres-title': 'Жанри:',
                '.js-movie-card__overview-title': 'Опис:',
                '.js-movie-card__vote-average-title': 'Рейтинг на IMDb',
                '.js-home-page-discover__popular-button': 'Популярні',
                '.js-home-page-discover__rating-button': 'Рейтингові',
                '.js-home-page-discover__search-input': 'Назва фільму',
                '.js-home-page-discover__discover-more': 'Повний перелік',
                '.js-discover-header__search-input': 'Введіть назву фільму',
                '.js-discover-header__sort-by_popularity': 'За популярністю',
                '.js-discover-header__sort-by_rating': 'По рейтингу',
                '.js-discover-header__sort-by_novelty': 'По новизні',
                '.js-discover-movies__filters-genres-title': 'Жанри:',
                '.js-discover-movies__filters-year-title': 'Рік виходу:',
                '.js-discover-movies__filters-submit-button': 'Застосувати',
                '.js-movie-description__runtime-minutes': 'хв',
                '.js-movie-info__starring-title': 'У головних ролях:',
                '.js-movie-info__trailer-title': 'Трейлер до фільму:',
                '.js-movie-info__simular-movies-title': 'Схожі фільми:'                
            },
            'en-US': {
                '.js-logo': 'Kinosklad',
                '.js-home-link': 'Home',
                '.js-discover-link': 'Discover',
                '.js-popular-this-week-title': 'Popular this week',
                '.js-movie-card__original-title-title': 'Original title:',
                '.js-movie-card__release-date-title': 'Release date:',
                '.js-movie-card__genres-title': 'Genres:',
                '.js-movie-card__overview-title': 'Overview:',
                '.js-movie-card__vote-average-title': 'Rating on IMDb',
                '.js-home-page-discover__title': 'Discover',
                '.js-home-page-discover__popular-button': 'Popular',
                '.js-home-page-discover__rating-button': 'Rating',
                '.js-home-page-discover__search-input': 'Movie title',
                '.js-home-page-discover__discover-more': 'Discover more',
                '.js-discover-header__search-input': 'Enter movie name',
                '.js-discover-header__sort-by_popularity': 'By popularity',
                '.js-discover-header__sort-by_rating': 'By rating',
                '.js-discover-header__sort-by_novelty': 'By novelty',
                '.js-discover-movies__filters-genres-title': 'Genres:',
                '.js-discover-movies__filters-year-title': 'Release year:',
                '.js-discover-movies__filters-submit-button': 'Apply',
                '.js-movie-description__runtime-minutes': 'min',
                '.js-movie-info__starring-title': 'Starring:',
                '.js-movie-info__trailer-title': 'Movie trailer:',
                '.js-movie-info__simular-movies-title': 'Simular movies:'                
            }
        }
    }

    setUserLanguage() {
        const userLang = window.navigator.language.substring(0, 2);

        const currentLang = this.languages.find((lang) => {
            return lang.substring(0, 2) === userLang;
        })

        localStorage.setItem ('lang', currentLang ? currentLang : 'en-US');
        this.currentLang = currentLang;
    }

    createLangSwitch(currentLang) {
        this.languages.forEach((lang) => {

            this.langSwitch.insertAdjacentHTML('beforeend', 
            `<option value="${lang}">${lang.substring(0, 2)}</option>`);

        })

        this.langSwitch.value = currentLang;
        this.langSwitch.addEventListener('change', function(event) {
            localStorage.setItem('lang', event.target.value);
            location.reload()
        })
    }

    translatePage(currentLang) {
        const locale = this.glossary[this.currentLang];

        document.documentElement.lang = this.currentLang.substring(0, 2);

        for (let [elemClass, text] of Object.entries(locale)) {
            let elems = document.body.querySelectorAll(elemClass);

            if(elems.length === 0) continue;

            elems.forEach((el) => {
                if(el.tagName === 'INPUT' && el.type === 'text') {
                    el.placeholder = text;
                    return;
                }

                el.innerText = text;
            })
        }
    }
}

export default Language;