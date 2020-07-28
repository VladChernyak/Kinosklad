class Handlers {
    debounce(func, delay) {
        let processing = false,
            cache;

        return function(str) {
            cache = str;

            if(processing) return;

            processing = true;

            setTimeout(() => {
                func(cache);
                processing = false;
            }, delay)
        }
    }

    getMinMaxYears(oldMoviesList, futureMoviesList) {
        const oldestDate = oldMoviesList[0].release_date,
              newestDate = futureMoviesList[0].release_date;

        return [
            new Date(oldestDate).getFullYear(),
            new Date(newestDate).getFullYear()
        ];
    }

    getUrlSearchString(...queries) {
        return queries.join('')
    }

    getGenresString(idArray, genresArray) {
        let result = genresArray.map(({ id, name }) => {
            if(idArray.find((elem) => elem === id)) return name + ', ';
        })

        result = result.join('');

        return result.substring(0, result.length - 2);
    }

    processText(text, maxLength) {
        if(text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }

        return text;
    }

    processImage(elem, url, path, size) {
        elem.onerror = function() {
            elem.src = './img/noize.gif';
        }

        elem.src = `${url}/${size}${path}`;
    }

    fadeOut(elem) {
        elem.style.opacity = 1;

        let interval = setInterval(() => {
            if(elem.style.opacity <= 0) {
                elem.remove();
                clearInterval(interval);
            };
            elem.style.opacity -= .1;
        }, 50)
    }
}

export default Handlers;