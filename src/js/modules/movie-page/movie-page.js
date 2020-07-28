import MoviePreview from './movie-preview.js';
import MovieInfo from './movie-info.js';

class MoviePage {
    constructor() {
        this.moviePreview = new MoviePreview();
        this.movieInfo = new MovieInfo();
    }

    getMovieId() {
        return location.search.split('=')[1];
    }

}

export default MoviePage;