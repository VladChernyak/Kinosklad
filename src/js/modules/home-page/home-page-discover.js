class HomeDiscover {
    constructor() {
        this.body = document.body.querySelector('.home-page-discover');
        this.navigation = this.body.querySelector('.home-page-discover__nav');
        this.moviesList = this.body.querySelector('.discover-movies__list');
        this.search = this.body.querySelector('.js-home-page-discover__search-input');
    }

    changeUnderlinePosition() {
        const underline = this.navigation.querySelector('.home-page-discover__nav-underline'),
              currentBtn = this.navigation.querySelector('button.current');

        underline.style.width = currentBtn.offsetWidth + 'px';
        underline.style.left = 
        currentBtn.getBoundingClientRect().left - this.navigation.getBoundingClientRect().left + 'px';
    }
}

export default HomeDiscover;