class Requests {
    constructor() {
        this._apiKey = 'ac0fb13957471aa7cf34db0d0c3288f4';
        this._discoverUrl = 'https://api.themoviedb.org/3/discover/movie';
        this._trandingUrl = 'https://api.themoviedb.org/3/trending/movie';
        this._movieUrl = 'https://api.themoviedb.org/3/movie';
        this._searchUrl = 'https://api.themoviedb.org/3/search/movie';
        this._genresListUrl = 'https://api.themoviedb.org/3/genre/movie/list';
        this._imageUrl = 'https://image.tmdb.org/t/p';
        this._youTubeUrl = 'https://www.youtube.com';
    }

    getMovieInfo(lang, id, option) {
        option = option ? `/${option}` : '';

        const request = `${this._movieUrl}/${id}${option}?api_key=${this._apiKey}&language=${lang}`;

        return this.sendRequest(request);
    }

    getSearchResult(lang, query) {
        const request = `${this._searchUrl}?api_key=${this._apiKey}&language=${lang}&query=${query}`;

        return this.sendRequest(request);
    }

    getGenresList(lang) {
        const request = `${this._genresListUrl}?api_key=${this._apiKey}&language=${lang}`;

        return this.sendRequest(request);
    }

    getTranding(lang, time='week') {
        const request = `${this._trandingUrl}/${time}?api_key=${this._apiKey}&language=${lang}`;

        return this.sendRequest(request);
    }

    getDiscover(lang, query = '&sort_by=popularity.desc') {
        const request = `${this._discoverUrl}?api_key=${this._apiKey}&language=${lang}${query}`;

        return this.sendRequest(request);
    }

    sendRequest(request) {
        const cache = this.checkCache(request);

        if(cache) return cache;

        return fetch(request)
        .then(response => response.json())
        .then(obj => {
            obj.save_time = Date.now();
            localStorage.setItem(request, JSON.stringify(obj));

            return obj;
        })
    }

    checkCache(request, storageHours = 2) {
        let response = localStorage.getItem(request);

        if(response) {
            const saveTime = JSON.parse(response).save_time,
                  storageTime = storageHours * 3600 * 1000;
            
            response = new Promise((res) => res(JSON.parse(response)));
            
            return Date.now() - saveTime < storageTime ? response : false;
        }

        return false;
    }
}

export default Requests;


