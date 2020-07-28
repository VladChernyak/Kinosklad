function carousel() {
    const popularCarousel = $('.owl-carousel');

    popularCarousel.owlCarousel({
        loop: true,
        center: true,
        nav: false,
        dots: false,
        touchDrag: false,
        mouseDrag: false,
        smartSpeed: 300,
        onInitialized,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 3,
            },
            1439: {
                items: 5
            }
        }
    })

    function closeCurrentMovie(trigger, timer) {
        const movie = $('.owl-item.center').find('.popular-this-week__carousel-item');
        const buttons = $('.popular-this-week__carousel-controls .arrow');

        buttons.attr('disabled','disabled');

        movie.removeClass('active').addClass('closed');

        setTimeout(() => popularCarousel.trigger(trigger), timer);
        setTimeout(() => buttons.removeAttr('disabled'), 1200)
    }

    function showCurrentMovie() {
        const closed = $('.popular-this-week__carousel-item.closed');

        if(closed) closed.removeClass('closed');

        $('.owl-item.center').find('.popular-this-week__carousel-item').addClass('active');
    }

    function changeArrowText() {
        const moviesList = $('.owl-item'),
              currentMovie = $('.owl-item.center'),
              nextMovie = moviesList[moviesList.index(currentMovie) + 1],
              prevMovie = moviesList[moviesList.index(currentMovie) - 1];

        $('.js-next-movie-name').text(nextMovie.querySelector('.js-movie-card__title').innerText);
        $('.js-prev-movie-name').text(prevMovie.querySelector('.js-movie-card__title').innerText);
    }

    function onInitialized() {
        showCurrentMovie();
        changeArrowText();
    }
    

    $('.popular-this-week__carousel-controls_next .arrow').click(function() {
        closeCurrentMovie('next.owl.carousel', 500);
    })

    $('.popular-this-week__carousel-controls_prev .arrow').click(function() {
        closeCurrentMovie('prev.owl.carousel', 500);
    })

    popularCarousel.on('translated.owl.carousel', function() {
        showCurrentMovie();
        changeArrowText();
    })
}

export default carousel;