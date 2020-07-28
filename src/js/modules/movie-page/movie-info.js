class MovieInfo {
    constructor() {
        this.body = document.body.querySelector('.movie-info');
        this.starringList = this.body.querySelector('.js-movie-info__starring-list');
        this.similarMoviesList = this.body.querySelector('.js-movie-info__simular-movies-list');
        this.trailer = this.body.querySelector('.js-movie-info__trailer-video');
    }

    createStarringList(actorsList, imageHandler, imageUrl) {
        if(actorsList.length === 0) return;

        this.starringList.innerHTML = '';

        for (let i = 0; i <= 4; i++) {
            const actor = actorsList[i],
                  actorCard = document.createElement('figure'),
                  actorPhoto = document.createElement('img');

            if(!actor) break;

            actorCard.className = 'movie-info__actor';
            actorPhoto.className = 'movie-info__actor-photo';
            
            imageHandler(
                actorPhoto,
                imageUrl,
                actor.profile_path,
                'w200'
            );

            actorCard.append(actorPhoto);
            actorCard.insertAdjacentHTML('beforeend',
            `
            <figcaption class="movie-info__actor-info">
                <div class="movie-info__actor-name js-movie-info__actor-name">${actor.name}</div>
                <span class="movie-info__actor-role js-movie-info__actor-role">${actor.character}</span>
            </figcaption>
            `
            )

            this.starringList.append(actorCard);
        }
    }

        createSimilarMoviesList(moviesList, imageHandler, imageUrl, textHandler) {
            if(moviesList.length === 0) return;

            this.similarMoviesList.innerHTML = '';

            for (let i = 0; i <= 5; i++) {
                const movie = moviesList[i],
                      movieCard = document.createElement('a'),
                      movieImage = document.createElement('img');

                if(!movie) return;

                movieCard.className = 'movie-info__simular-movie';
                movieCard.href = `./movie.html?movie_id=${movie.id}`;
                movieImage.className = 'movie-info__simular-movie-poster';

                imageHandler(
                    movieImage,
                    imageUrl,
                    movie.poster_path,
                    'w200'
                );

                movieCard.append(movieImage);
                movieCard.insertAdjacentHTML('beforeend', 
                `
                <span class="movie-info__simular-movie-name">${textHandler(movie.title, 35)}</span>
                `
                );

                this.similarMoviesList.append(movieCard);
            }
        }

        createTrailer(videoInfo, siteUrl) {
            if(!videoInfo) return;

            this.trailer.innerHTML = 
            `
            <iframe width="100%" height="100%" 
            src="${siteUrl}/embed/${videoInfo.key}" 
            frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen></iframe>
            `;
        }
}

export default MovieInfo;
