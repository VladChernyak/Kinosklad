class Discover {

    showMovieLoader() {
        this.moviesList.innerHTML =
        `
        <div class="movie-loader">
            <div class="movie-loader__spinner"></div>
        </div>
        `;
    }

    createMoviesList(moviesArray, imageUrl, imageHandler, textHandler, genresHandler, genresList, number) {
        let movieCard;

        this.moviesList.innerHTML = '';

        if (moviesArray.length === 0) {
            this.moviesList.innerHTML = 
            `
            <div class='discover-movies__list_no-such-results'>
            Нет результатов
            </div>
            `;

            return;
        }

        for (let i = 0; i < number; i++) {
            let movie = moviesArray[i];

            movieCard = document.createElement('a');
            movieCard.className = 'discover-movies__list-item movie-card';
            movieCard.href = `/movie.html?movie_id=${movie.id}`;

            movieCard.innerHTML =
            `
            <div class="movie-card__poster">
                <img alt="${movie.title}">
                <span class="movie-card__vote-average-value">
                ${movie.vote_average}
                </span>
            </div>
            <div class="movie-card__description">
                <div class="movie-card__short-info">
                    <span class="movie-card__release-year">
                    ${new Date(movie.release_date).getFullYear()}
                    </span>
                    / 
                    <span class="movie-card__genres">
                    ${genresHandler(movie.genre_ids, genresList)}
                    </span>
                </div>
                <span class="movie-card__title">
                ${textHandler(movie.title, 60)}
                </span>
            </div>
            `;

            imageHandler(
                movieCard.querySelector('.movie-card__poster img'),
                imageUrl,
                movie.poster_path,
                'w300'
            );

            this.moviesList.append(movieCard);

            movieCard.insertAdjacentHTML('afterend', '<!-- /.movie-card -->');
        }       
    }
}

export default Discover;