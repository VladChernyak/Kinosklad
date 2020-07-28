import initCarousel from './carousel-setting.js';

class Carousel {
    constructor() {
        this.body = document.querySelector('.js-popular-this-week__carousel');
        this.movieCardList = this.body.querySelectorAll('.popular-this-week__carousel-item');
    }

    createCarousel(moviesArray, imageUrl, imageHandler, textHandler, genresHandler, genresList) {
        [].forEach.call(this.movieCardList, (card, index) => {
            const movieData = moviesArray[index],
                  movieLink = `./movie.html?movie_id=${movieData.id}`,
                  moviePosterImg = card.querySelector('.js-movie-card__poster-img');

            imageHandler(
                moviePosterImg,
                imageUrl,
                movieData.poster_path,
                'w300');

            card.querySelector('.js-movie-card__poster').href = movieLink;
            card.querySelector('.js-movie-card__title').innerText = textHandler(movieData.title, 30);
            card.querySelector('.js-movie-card__original-title-value').innerText = movieData.original_title;
            card.querySelector('.js-movie-card__release-date-value').innerText = 
            new Intl.DateTimeFormat().format(new Date(movieData.release_date));

            card.querySelector('.js-movie-card__genres-value').innerText = 
            genresHandler(movieData.genre_ids, genresList);

            card.querySelector('.js-movie-card__overview-value').innerText = textHandler(movieData.overview, 300);
            card.querySelector('.js-movie-card__vote-average-value').innerText = movieData.vote_average;
            card.querySelector('.js-movie-card__see-more').href = movieLink;
        })
    }

    initCarousel = initCarousel;
}

export default Carousel;