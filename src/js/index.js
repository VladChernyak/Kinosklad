import Language from './modules/language.js';
import Requests from './modules/requests.js';
import Handlers from './modules/handlers.js';
import HomePage from './modules/home-page/home-page.js';
import Discover from './modules/discover.js'
import DiscoverPage from './modules/discover-page/discover-page.js';
import MoviePage from './modules/movie-page/movie-page.js';

class App {
    constructor() {
        this.language = new Language();
        this.requests = new Requests();
        this.handlers = new Handlers();
        this.discover = new Discover();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const app = new App();
    let lang = app.language.currentLang;

    if (!lang) {
        app.language.setUserLanguage();
        lang = app.language.currentLang;
    }

    app.language.createLangSwitch(lang);
    app.language.translatePage(lang);

    document.body.style.overflow = 'hidden';

    if (location.pathname !== '/movie.html') {
        document.body.querySelector('.js-header__burger').addEventListener('click', () => {
            document.body.querySelector('.header').classList.toggle('opened');
        });
    }
    console.log('1')
    if (location.pathname === '/index.html' 
        || location.pathname === '/') {
        console.log('ok')
        app.homePage = new HomePage();

        const showMoviesList = app.discover.createMoviesList.bind(app.homePage.discover),
              showMovieLoader = app.discover.showMovieLoader.bind(app.homePage.discover);

        Promise.all([
            app.requests.getTranding(lang),
            app.requests.getDiscover(lang),
            app.requests.getGenresList(lang),
        ])
        .then(([tranding, discover, genresList]) => {
            app.homePage.carousel.createCarousel(
                tranding.results,
                app.requests._imageUrl,
                app.handlers.processImage,
                app.handlers.processText,
                app.handlers.getGenresString,
                genresList.genres
            );

            app.homePage.carousel.initCarousel();

            showMoviesList(
                discover.results,
                app.requests._imageUrl,
                app.handlers.processImage,
                app.handlers.processText,
                app.handlers.getGenresString,
                genresList.genres,
                10
            );

            app.homePage.discover.changeUnderlinePosition();
            })
            .then(() => {
                app.handlers.fadeOut(document.body.querySelector('.loader'));
                document.body.style.overflow = 'visible';
            })

        app.homePage.discover.navigation.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') return;

            showMovieLoader();

            app.homePage.discover.navigation.querySelector('.current').classList.remove('current');
            e.target.classList.add('current');

            app.homePage.discover.changeUnderlinePosition(e.target);

            Promise.all([
                app.requests.getDiscover(lang, e.target.value),
                app.requests.getGenresList(lang),
            ])
            .then(([discover, genresList]) => {
                showMoviesList(
                    discover.results,
                    app.requests._imageUrl,
                    app.handlers.processImage,
                    app.handlers.processText,
                    app.handlers.getGenresString,
                    genresList.genres,
                    10
                );
            })
        })

        app.homePage.discover.search.addEventListener('input', (e) => {
            app.handlers.debounce(() => {
                showMovieLoader();

                if (e.target.value === '') {
                    const currentQuery =
                        app.homePage.discover.navigation.querySelector('button.current').value;

                    Promise.all([
                        app.requests.getDiscover(lang, currentQuery),
                        app.requests.getGenresList(lang),
                    ])
                    .then(([discover, genresList]) => {
                        showMoviesList(
                            discover.results,
                            app.requests._imageUrl,
                            app.handlers.processImage,
                            app.handlers.processText,
                            app.handlers.getGenresString,
                            genresList.genres,
                            10
                        );
                    })

                    return;
                }

                Promise.all([
                    app.requests.getSearchResult(lang, e.target.value),
                    app.requests.getGenresList(lang),
                ])
                .then(([discover, genresList]) => {
                    showMoviesList(
                        discover.results,
                        app.requests._imageUrl,
                        app.handlers.processImage,
                        app.handlers.processText,
                        app.handlers.getGenresString,
                        genresList.genres,
                        10
                    );
                })
            }, 700)()
        })
    }

    if (location.pathname === '/discover.html') {
        app.discoverPage = new DiscoverPage();

        app.discoverPage.initSortSwitch();

        const showMoviesList = app.discover.createMoviesList.bind(app.discoverPage),
              showMovieLoader = app.discover.showMovieLoader.bind(app.discoverPage);

        Promise.all([
            app.requests.getGenresList(lang),
            app.requests.getDiscover(lang, '&sort_by=primary_release_date.asc'),
            app.requests.getDiscover(lang, '&sort_by=primary_release_date.desc'),
            app.requests.getDiscover(lang, app.discoverPage.query)
        ])
            .then(([genresList, discoverOldFirst, discoverFutureFirst, discoverMain]) => {
                const minMaxYears = app.handlers.getMinMaxYears(
                    discoverOldFirst.results,
                    discoverFutureFirst.results
                );

                app.discoverPage.filters.createGenresFilters(genresList.genres);
                app.discoverPage.filters.createYearsRange(...minMaxYears);
                showMoviesList(
                    discoverMain.results,
                    app.requests._imageUrl,
                    app.handlers.processImage,
                    app.handlers.processText,
                    app.handlers.getGenresString,
                    genresList.genres,
                    discoverMain.results.length
                )

                app.discoverPage.createPagination(discoverMain.page, discoverMain.total_pages)
            })
            .then(() => {
                app.handlers.fadeOut(document.body.querySelector('.loader'));
                document.body.style.overflow = 'visible';
            })

        app.discoverPage.filters.showFiltersButton.addEventListener('click', () => {
            app.discoverPage.filters.body.classList.toggle('opened');
        })

        app.discoverPage.search.addEventListener('input', (e) => {
            app.discoverPage.filters.body.classList.add('closed');

            app.discoverPage.filters.showFiltersButton.disabled = true;
            app.discoverPage.filters.showFiltersButton.style.opacity = 0;

            app.discoverPage.sortBySwitch.disabled = true;
            app.discoverPage.sortBySwitch.style.opacity = 0;

            app.discoverPage.pagination.style.display = 'none';

            document.body.querySelector('.page-wrapper').style.backgroundColor = '#000000';

            app.handlers.debounce(() => {
                showMovieLoader();

                if (e.target.value === '') {
                    app.discoverPage.filters.body.classList.remove('closed');

                    app.discoverPage.sortBySwitch.disabled = false;
                    app.discoverPage.sortBySwitch.style.opacity = 1;

                    app.discoverPage.filters.showFiltersButton.disabled = false;
                    app.discoverPage.filters.showFiltersButton.style.opacity = 1;

                    app.discoverPage.pagination.style.display = '';
    
                    document.body.querySelector('.page-wrapper').style.backgroundColor = '';
    
                    Promise.all([
                        app.requests.getDiscover(lang, app.discoverPage.query),
                        app.requests.getGenresList(lang)
                    ])
                        .then(([moviesList, genresList]) => {
                            showMoviesList(
                                moviesList.results,
                                app.requests._imageUrl,
                                app.handlers.processImage,
                                app.handlers.processText,
                                app.handlers.getGenresString,
                                genresList.genres,
                                moviesList.results.length
                            )
                        })
    
                    return;
                }
    
                Promise.all([
                    app.requests.getSearchResult(lang, e.target.value),
                    app.requests.getGenresList(lang)
                ])
                    .then(([moviesList, genresList]) => {
                        showMoviesList(
                            moviesList.results,
                            app.requests._imageUrl,
                            app.handlers.processImage,
                            app.handlers.processText,
                            app.handlers.getGenresString,
                            genresList.genres,
                            moviesList.results.length
                        )
                    })
            }, 700)()
        })

        app.discoverPage.sortBySwitch.addEventListener('change', function (e) {
            const queries = [];

            location.search.split('&').forEach((el) => {
                if (!el.includes('sort_by') && !el.includes('vote_count.gte')) queries.push(el);
            })
            const queriesStr = queries.join('&');

            location.href = `./discover.html${queriesStr ? queriesStr : '?'}${this.value}`;
        })

        app.discoverPage.filters.body.addEventListener('change', (e) => {
            const genresQuery = app.discoverPage.filters.generateGenresQuery(),
                yearQuery = app.discoverPage.filters.generateYearQuery();

            app.discoverPage.filters.submitButton.href = `./discover.html?${genresQuery}${yearQuery}`;
        })
    }

    if (location.pathname === '/movie.html') {
        app.moviePage = new MoviePage();

        const movieId = app.moviePage.getMovieId();

        Promise.all([
            app.requests.getMovieInfo(lang, movieId),
            app.requests.getMovieInfo(lang, movieId, 'credits'),
            app.requests.getMovieInfo(lang, movieId, 'similar'),
            app.requests.getMovieInfo(lang, movieId, 'videos'),
            app.requests.getGenresList(lang)
        ])
            .then(([movieInfo, { cast }, { results: similar }, { results: videos }, genresList]) => {
                document.title = movieInfo.title;

                app.moviePage.moviePreview.showMoviePreview(movieInfo, app.requests._imageUrl);
                app.moviePage.movieInfo.createStarringList(
                    cast,
                    app.handlers.processImage,
                    app.requests._imageUrl
                )
                app.moviePage.movieInfo.createSimilarMoviesList(
                    similar,
                    app.handlers.processImage,
                    app.requests._imageUrl,
                    app.handlers.processText
                )
                app.moviePage.movieInfo.createTrailer(
                    videos[0],
                    app.requests._youTubeUrl
                )
            })
            .then(() => {
                app.handlers.fadeOut(document.body.querySelector('.loader'));
                document.body.style.overflow = 'visible';
            })
    }
})