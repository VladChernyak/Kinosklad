class Filters {
    constructor() {
        this.body = document.querySelector('.js-discover-movies__filters');
        this.genres = this.body.querySelector('.js-movie-genres');
        this.releaseYear = this.body.querySelector('.js-movie-year');
        this.submitButton = this.body.querySelector('.js-discover-movies__filters-submit-button');
        this.showFiltersButton = document.querySelector('.js-discover-header__show-filters');
    }

    generateGenresQuery() {
        const checkedGenres = this.genres.querySelectorAll('input:checked');
        
        if(checkedGenres.length === 0) return '';

        let result = [].map.call(checkedGenres, (elem, index) => {
            return elem.value;
        })

        return `&with_genres=${result.join('%2C')}`;
    }

    generateYearQuery() {
        const year = this.releaseYear.querySelector('output').value;

        if(isNaN(year) || year === '') return '';

        return `&primary_release_year=${year}`;
    }

    createGenresFilters(genresList) {
        const currentGenres = [];

        location.search.split('&').forEach((elem) => {
            if(elem.includes('with_genres')) {
                elem = elem.split('=');

                elem[1].split('%2C').forEach((id) => currentGenres.push(+id));
            }
        })

        genresList.forEach((genre) => {
            const button = 
            `
            <li class="movie-genres__genre">
                <label>
                    <input ${currentGenres.includes(genre.id) ? 'checked' : ''} type="checkbox" value="${genre.id}">
                    <span></span>
                    <span>${genre.name}</span>
                </label>
            </li>
            `;

            this.genres.insertAdjacentHTML('beforeend', button);
        })
    }

    createYearsRange(minYear, maxYear) {
        const input = this.releaseYear.querySelector('[type="range"]'),
              output = this.releaseYear.querySelector('output');

        input.min = minYear;
        input.max = maxYear;

        input.addEventListener('input', (e) => {
            output.value = e.target.value;
        })
    }
}

export default Filters;