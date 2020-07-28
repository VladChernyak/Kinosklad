class MoviePreview {
    constructor() {
        this.body = document.body.querySelector('.movie-preview');
        this.title = this.body.querySelector('.js-movie-description__name');
        this.overview = this.body.querySelector('.js-movie-description__overview');
        this.runtimeValue = this.body.querySelector('.js-movie-description__runtime-value');
        this.releaseYear = this.body.querySelector('.movie-description__release-year');
        this.genres = this.body.querySelector('.js-movie-description__genres');
        this.vote = this.body.querySelector('.js-movie-description__vote-average');
    }

    showMoviePreview(movieInfo, imgPath) {
        this.body.style.backgroundImage = `url("${imgPath}/original/${movieInfo.backdrop_path}")`;

        this.title.innerText = movieInfo.title;
        this.overview.innerText = movieInfo.overview;
        this.runtimeValue.innerText = movieInfo.runtime;
        this.releaseYear.innerText = new Date(movieInfo.release_date).getFullYear();
        this.genres.innerText = movieInfo.genres.map(({ name }) => name).join(', ');
        this.vote.innerText = movieInfo.vote_average;
    }
}

export default MoviePreview;