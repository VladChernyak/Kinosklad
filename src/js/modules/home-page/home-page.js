import Carousel from './carousel.js';
import Discover from './home-page-discover.js';

class HomePage {
    constructor() {
        this.carousel = new Carousel();
        this.discover = new Discover();
    }
}

export default HomePage;
