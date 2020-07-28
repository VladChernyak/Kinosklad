import Filters from './filters.js';

class DiscoverPage {
    constructor() {
        this.body = document.body.querySelector('.discover-page');
        this.search = this.body.querySelector('.js-discover-header__search');
        this.moviesList = this.body.querySelector('.discover-movies__list');
        this.sortBySwitch = this.body.querySelector('.js-discover-header__sort-by');
        this.query = location.search ? location.search : this.sortBySwitch.value;
        this.pagination = this.body.querySelector('.discover-page__pagination');
        this.filters = new Filters();

    }

    initSortSwitch() {
        const urlQuery = location.search.split('&').find((e) => e.includes('sort_by')),
              option = this.sortBySwitch.querySelector(`option[value*="${urlQuery}"]`);       

        if(!urlQuery) return;

        this.sortBySwitch.value = option.value;
    }

    createPaginationButton(page, currentPage) {
        const currentQueries = [];

        location.search.split('&').forEach(e => {
            if(!e.includes('page')) currentQueries.push(e);
        });

        return (
                `
                <a class="pagination__button${page === currentPage ? ' current' : ''}" 
                href="./discover.html${currentQueries.join('&') ? currentQueries.join('&') : '?'}&page=${page}">${page}</a>
                `
        )
    }

    createPagination(currentPage, maxPage) {
        const leftSide = this.pagination.querySelector('.pagination__left-side'),
              rightSide = this.pagination.querySelector('.pagination__right-side'),
              dots = this.pagination.querySelector('.pagination__dots');

        let leftStartNumber = currentPage === 1 ? 1 : currentPage - 1,
            rightStartNumber = currentPage === maxPage ? maxPage : currentPage + 1;

        leftSide.innerHTML = '';
        rightSide.innerHTML = '';

        if(maxPage >= 7) {
            dots.style.display = 'inline';

            if(currentPage <= maxPage / 2) {
                for (let count = leftStartNumber; count < leftStartNumber + 5; count++) {
                    leftSide.insertAdjacentHTML('beforeend', this.createPaginationButton(count, currentPage));
                }

                rightSide.insertAdjacentHTML('beforeend', this.createPaginationButton(maxPage));
            } else {
                for (let count = rightStartNumber; count > rightStartNumber - 5; count--) {
                    rightSide.insertAdjacentHTML('afterbegin', this.createPaginationButton(count, currentPage));
                }

                leftSide.insertAdjacentHTML('beforeend', this.createPaginationButton(1));
            }

            return;
        }

        for (let count = 1; count <= maxPage; count++) {
            leftSide.insertAdjacentHTML('beforeend', this.createPaginationButton(count, currentPage));
        }

        dots.style.display = 'none';
    }
}

export default DiscoverPage;