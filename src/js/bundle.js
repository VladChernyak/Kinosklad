(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _language = _interopRequireDefault(require("./modules/language.js"));

var _requests = _interopRequireDefault(require("./modules/requests.js"));

var _handlers = _interopRequireDefault(require("./modules/handlers.js"));

var _homePage = _interopRequireDefault(require("./modules/home-page/home-page.js"));

var _discover = _interopRequireDefault(require("./modules/discover.js"));

var _discoverPage = _interopRequireDefault(require("./modules/discover-page/discover-page.js"));

var _moviePage = _interopRequireDefault(require("./modules/movie-page/movie-page.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function App() {
  _classCallCheck(this, App);

  this.language = new _language["default"]();
  this.requests = new _requests["default"]();
  this.handlers = new _handlers["default"]();
  this.discover = new _discover["default"]();
};

document.addEventListener('DOMContentLoaded', function () {
  var app = new App();
  var lang = app.language.currentLang;

  if (!lang) {
    app.language.setUserLanguage();
    lang = app.language.currentLang;
  }

  app.language.createLangSwitch(lang);
  app.language.translatePage(lang);
  document.body.style.overflow = 'hidden';

  if (location.pathname !== '/movie.html') {
    document.body.querySelector('.js-header__burger').addEventListener('click', function () {
      document.body.querySelector('.header').classList.toggle('opened');
    });
  }

  console.log('1');

  if (location.pathname === '/index.html' || location.pathname === '/') {
    console.log('ok');
    app.homePage = new _homePage["default"]();
    var showMoviesList = app.discover.createMoviesList.bind(app.homePage.discover),
        showMovieLoader = app.discover.showMovieLoader.bind(app.homePage.discover);
    Promise.all([app.requests.getTranding(lang), app.requests.getDiscover(lang), app.requests.getGenresList(lang)]).then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 3),
          tranding = _ref2[0],
          discover = _ref2[1],
          genresList = _ref2[2];

      app.homePage.carousel.createCarousel(tranding.results, app.requests._imageUrl, app.handlers.processImage, app.handlers.processText, app.handlers.getGenresString, genresList.genres);
      app.homePage.carousel.initCarousel();
      showMoviesList(discover.results, app.requests._imageUrl, app.handlers.processImage, app.handlers.processText, app.handlers.getGenresString, genresList.genres, 10);
      app.homePage.discover.changeUnderlinePosition();
    }).then(function () {
      app.handlers.fadeOut(document.body.querySelector('.loader'));
      document.body.style.overflow = 'visible';
    });
    app.homePage.discover.navigation.addEventListener('click', function (e) {
      if (e.target.tagName !== 'BUTTON') return;
      showMovieLoader();
      app.homePage.discover.navigation.querySelector('.current').classList.remove('current');
      e.target.classList.add('current');
      app.homePage.discover.changeUnderlinePosition(e.target);
      Promise.all([app.requests.getDiscover(lang, e.target.value), app.requests.getGenresList(lang)]).then(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            discover = _ref4[0],
            genresList = _ref4[1];

        showMoviesList(discover.results, app.requests._imageUrl, app.handlers.processImage, app.handlers.processText, app.handlers.getGenresString, genresList.genres, 10);
      });
    });
    app.homePage.discover.search.addEventListener('input', function (e) {
      app.handlers.debounce(function () {
        showMovieLoader();

        if (e.target.value === '') {
          var currentQuery = app.homePage.discover.navigation.querySelector('button.current').value;
          Promise.all([app.requests.getDiscover(lang, currentQuery), app.requests.getGenresList(lang)]).then(function (_ref5) {
            var _ref6 = _slicedToArray(_ref5, 2),
                discover = _ref6[0],
                genresList = _ref6[1];

            showMoviesList(discover.results, app.requests._imageUrl, app.handlers.processImage, app.handlers.processText, app.handlers.getGenresString, genresList.genres, 10);
          });
          return;
        }

        Promise.all([app.requests.getSearchResult(lang, e.target.value), app.requests.getGenresList(lang)]).then(function (_ref7) {
          var _ref8 = _slicedToArray(_ref7, 2),
              discover = _ref8[0],
              genresList = _ref8[1];

          showMoviesList(discover.results, app.requests._imageUrl, app.handlers.processImage, app.handlers.processText, app.handlers.getGenresString, genresList.genres, 10);
        });
      }, 700)();
    });
  }

  if (location.pathname === '/discover.html') {
    app.discoverPage = new _discoverPage["default"]();
    app.discoverPage.initSortSwitch();

    var _showMoviesList = app.discover.createMoviesList.bind(app.discoverPage),
        _showMovieLoader = app.discover.showMovieLoader.bind(app.discoverPage);

    Promise.all([app.requests.getGenresList(lang), app.requests.getDiscover(lang, '&sort_by=primary_release_date.asc'), app.requests.getDiscover(lang, '&sort_by=primary_release_date.desc'), app.requests.getDiscover(lang, app.discoverPage.query)]).then(function (_ref9) {
      var _app$discoverPage$fil;

      var _ref10 = _slicedToArray(_ref9, 4),
          genresList = _ref10[0],
          discoverOldFirst = _ref10[1],
          discoverFutureFirst = _ref10[2],
          discoverMain = _ref10[3];

      var minMaxYears = app.handlers.getMinMaxYears(discoverOldFirst.results, discoverFutureFirst.results);
      app.discoverPage.filters.createGenresFilters(genresList.genres);

      (_app$discoverPage$fil = app.discoverPage.filters).createYearsRange.apply(_app$discoverPage$fil, _toConsumableArray(minMaxYears));

      _showMoviesList(discoverMain.results, app.requests._imageUrl, app.handlers.processImage, app.handlers.processText, app.handlers.getGenresString, genresList.genres, discoverMain.results.length);

      app.discoverPage.createPagination(discoverMain.page, discoverMain.total_pages);
    }).then(function () {
      app.handlers.fadeOut(document.body.querySelector('.loader'));
      document.body.style.overflow = 'visible';
    });
    app.discoverPage.filters.showFiltersButton.addEventListener('click', function () {
      app.discoverPage.filters.body.classList.toggle('opened');
    });
    app.discoverPage.search.addEventListener('input', function (e) {
      app.discoverPage.filters.body.classList.add('closed');
      app.discoverPage.filters.showFiltersButton.disabled = true;
      app.discoverPage.filters.showFiltersButton.style.opacity = 0;
      app.discoverPage.sortBySwitch.disabled = true;
      app.discoverPage.sortBySwitch.style.opacity = 0;
      app.discoverPage.pagination.style.display = 'none';
      document.body.querySelector('.page-wrapper').style.backgroundColor = '#000000';
      app.handlers.debounce(function () {
        _showMovieLoader();

        if (e.target.value === '') {
          app.discoverPage.filters.body.classList.remove('closed');
          app.discoverPage.sortBySwitch.disabled = false;
          app.discoverPage.sortBySwitch.style.opacity = 1;
          app.discoverPage.filters.showFiltersButton.disabled = false;
          app.discoverPage.filters.showFiltersButton.style.opacity = 1;
          app.discoverPage.pagination.style.display = '';
          document.body.querySelector('.page-wrapper').style.backgroundColor = '';
          Promise.all([app.requests.getDiscover(lang, app.discoverPage.query), app.requests.getGenresList(lang)]).then(function (_ref11) {
            var _ref12 = _slicedToArray(_ref11, 2),
                moviesList = _ref12[0],
                genresList = _ref12[1];

            _showMoviesList(moviesList.results, app.requests._imageUrl, app.handlers.processImage, app.handlers.processText, app.handlers.getGenresString, genresList.genres, moviesList.results.length);
          });
          return;
        }

        Promise.all([app.requests.getSearchResult(lang, e.target.value), app.requests.getGenresList(lang)]).then(function (_ref13) {
          var _ref14 = _slicedToArray(_ref13, 2),
              moviesList = _ref14[0],
              genresList = _ref14[1];

          _showMoviesList(moviesList.results, app.requests._imageUrl, app.handlers.processImage, app.handlers.processText, app.handlers.getGenresString, genresList.genres, moviesList.results.length);
        });
      }, 700)();
    });
    app.discoverPage.sortBySwitch.addEventListener('change', function (e) {
      var queries = [];
      location.search.split('&').forEach(function (el) {
        if (!el.includes('sort_by') && !el.includes('vote_count.gte')) queries.push(el);
      });
      var queriesStr = queries.join('&');
      location.href = "./discover.html".concat(queriesStr ? queriesStr : '?').concat(this.value);
    });
    app.discoverPage.filters.body.addEventListener('change', function (e) {
      var genresQuery = app.discoverPage.filters.generateGenresQuery(),
          yearQuery = app.discoverPage.filters.generateYearQuery();
      app.discoverPage.filters.submitButton.href = "./discover.html?".concat(genresQuery).concat(yearQuery);
    });
  }

  if (location.pathname === '/movie.html') {
    app.moviePage = new _moviePage["default"]();
    var movieId = app.moviePage.getMovieId();
    Promise.all([app.requests.getMovieInfo(lang, movieId), app.requests.getMovieInfo(lang, movieId, 'credits'), app.requests.getMovieInfo(lang, movieId, 'similar'), app.requests.getMovieInfo(lang, movieId, 'videos'), app.requests.getGenresList(lang)]).then(function (_ref15) {
      var _ref16 = _slicedToArray(_ref15, 5),
          movieInfo = _ref16[0],
          cast = _ref16[1].cast,
          similar = _ref16[2].results,
          videos = _ref16[3].results,
          genresList = _ref16[4];

      document.title = movieInfo.title;
      app.moviePage.moviePreview.showMoviePreview(movieInfo, app.requests._imageUrl);
      app.moviePage.movieInfo.createStarringList(cast, app.handlers.processImage, app.requests._imageUrl);
      app.moviePage.movieInfo.createSimilarMoviesList(similar, app.handlers.processImage, app.requests._imageUrl, app.handlers.processText);
      app.moviePage.movieInfo.createTrailer(videos[0], app.requests._youTubeUrl);
    }).then(function () {
      app.handlers.fadeOut(document.body.querySelector('.loader'));
      document.body.style.overflow = 'visible';
    });
  }
});

},{"./modules/discover-page/discover-page.js":2,"./modules/discover.js":4,"./modules/handlers.js":5,"./modules/home-page/home-page.js":9,"./modules/language.js":10,"./modules/movie-page/movie-page.js":12,"./modules/requests.js":14}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _filters = _interopRequireDefault(require("./filters.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DiscoverPage = /*#__PURE__*/function () {
  function DiscoverPage() {
    _classCallCheck(this, DiscoverPage);

    this.body = document.body.querySelector('.discover-page');
    this.search = this.body.querySelector('.js-discover-header__search');
    this.moviesList = this.body.querySelector('.discover-movies__list');
    this.sortBySwitch = this.body.querySelector('.js-discover-header__sort-by');
    this.query = location.search ? location.search : this.sortBySwitch.value;
    this.pagination = this.body.querySelector('.discover-page__pagination');
    this.filters = new _filters["default"]();
  }

  _createClass(DiscoverPage, [{
    key: "initSortSwitch",
    value: function initSortSwitch() {
      var urlQuery = location.search.split('&').find(function (e) {
        return e.includes('sort_by');
      }),
          option = this.sortBySwitch.querySelector("option[value*=\"".concat(urlQuery, "\"]"));
      if (!urlQuery) return;
      this.sortBySwitch.value = option.value;
    }
  }, {
    key: "createPaginationButton",
    value: function createPaginationButton(page, currentPage) {
      var currentQueries = [];
      location.search.split('&').forEach(function (e) {
        if (!e.includes('page')) currentQueries.push(e);
      });
      return "\n                <a class=\"pagination__button".concat(page === currentPage ? ' current' : '', "\" \n                href=\"./discover.html").concat(currentQueries.join('&') ? currentQueries.join('&') : '?', "&page=").concat(page, "\">").concat(page, "</a>\n                ");
    }
  }, {
    key: "createPagination",
    value: function createPagination(currentPage, maxPage) {
      var leftSide = this.pagination.querySelector('.pagination__left-side'),
          rightSide = this.pagination.querySelector('.pagination__right-side'),
          dots = this.pagination.querySelector('.pagination__dots');
      var leftStartNumber = currentPage === 1 ? 1 : currentPage - 1,
          rightStartNumber = currentPage === maxPage ? maxPage : currentPage + 1;
      leftSide.innerHTML = '';
      rightSide.innerHTML = '';

      if (maxPage >= 7) {
        dots.style.display = 'inline';

        if (currentPage <= maxPage / 2) {
          for (var count = leftStartNumber; count < leftStartNumber + 5; count++) {
            leftSide.insertAdjacentHTML('beforeend', this.createPaginationButton(count, currentPage));
          }

          rightSide.insertAdjacentHTML('beforeend', this.createPaginationButton(maxPage));
        } else {
          for (var _count = rightStartNumber; _count > rightStartNumber - 5; _count--) {
            rightSide.insertAdjacentHTML('afterbegin', this.createPaginationButton(_count, currentPage));
          }

          leftSide.insertAdjacentHTML('beforeend', this.createPaginationButton(1));
        }

        return;
      }

      for (var _count2 = 1; _count2 <= maxPage; _count2++) {
        leftSide.insertAdjacentHTML('beforeend', this.createPaginationButton(_count2, currentPage));
      }

      dots.style.display = 'none';
    }
  }]);

  return DiscoverPage;
}();

var _default = DiscoverPage;
exports["default"] = _default;

},{"./filters.js":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Filters = /*#__PURE__*/function () {
  function Filters() {
    _classCallCheck(this, Filters);

    this.body = document.querySelector('.js-discover-movies__filters');
    this.genres = this.body.querySelector('.js-movie-genres');
    this.releaseYear = this.body.querySelector('.js-movie-year');
    this.submitButton = this.body.querySelector('.js-discover-movies__filters-submit-button');
    this.showFiltersButton = document.querySelector('.js-discover-header__show-filters');
  }

  _createClass(Filters, [{
    key: "generateGenresQuery",
    value: function generateGenresQuery() {
      var checkedGenres = this.genres.querySelectorAll('input:checked');
      if (checkedGenres.length === 0) return '';
      var result = [].map.call(checkedGenres, function (elem, index) {
        return elem.value;
      });
      return "&with_genres=".concat(result.join('%2C'));
    }
  }, {
    key: "generateYearQuery",
    value: function generateYearQuery() {
      var year = this.releaseYear.querySelector('output').value;
      if (isNaN(year) || year === '') return '';
      return "&primary_release_year=".concat(year);
    }
  }, {
    key: "createGenresFilters",
    value: function createGenresFilters(genresList) {
      var _this = this;

      var currentGenres = [];
      location.search.split('&').forEach(function (elem) {
        if (elem.includes('with_genres')) {
          elem = elem.split('=');
          elem[1].split('%2C').forEach(function (id) {
            return currentGenres.push(+id);
          });
        }
      });
      genresList.forEach(function (genre) {
        var button = "\n            <li class=\"movie-genres__genre\">\n                <label>\n                    <input ".concat(currentGenres.includes(genre.id) ? 'checked' : '', " type=\"checkbox\" value=\"").concat(genre.id, "\">\n                    <span></span>\n                    <span>").concat(genre.name, "</span>\n                </label>\n            </li>\n            ");

        _this.genres.insertAdjacentHTML('beforeend', button);
      });
    }
  }, {
    key: "createYearsRange",
    value: function createYearsRange(minYear, maxYear) {
      var input = this.releaseYear.querySelector('[type="range"]'),
          output = this.releaseYear.querySelector('output');
      input.min = minYear;
      input.max = maxYear;
      input.addEventListener('input', function (e) {
        output.value = e.target.value;
      });
    }
  }]);

  return Filters;
}();

var _default = Filters;
exports["default"] = _default;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Discover = /*#__PURE__*/function () {
  function Discover() {
    _classCallCheck(this, Discover);
  }

  _createClass(Discover, [{
    key: "showMovieLoader",
    value: function showMovieLoader() {
      this.moviesList.innerHTML = "\n        <div class=\"movie-loader\">\n            <div class=\"movie-loader__spinner\"></div>\n        </div>\n        ";
    }
  }, {
    key: "createMoviesList",
    value: function createMoviesList(moviesArray, imageUrl, imageHandler, textHandler, genresHandler, genresList, number) {
      var movieCard;
      this.moviesList.innerHTML = '';

      if (moviesArray.length === 0) {
        this.moviesList.innerHTML = "\n            <div class='discover-movies__list_no-such-results'>\n            \u041D\u0435\u0442 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u043E\u0432\n            </div>\n            ";
        return;
      }

      for (var i = 0; i < number; i++) {
        var movie = moviesArray[i];
        movieCard = document.createElement('a');
        movieCard.className = 'discover-movies__list-item movie-card';
        movieCard.href = "/movie.html?movie_id=".concat(movie.id);
        movieCard.innerHTML = "\n            <div class=\"movie-card__poster\">\n                <img alt=\"".concat(movie.title, "\">\n                <span class=\"movie-card__vote-average-value\">\n                ").concat(movie.vote_average, "\n                </span>\n            </div>\n            <div class=\"movie-card__description\">\n                <div class=\"movie-card__short-info\">\n                    <span class=\"movie-card__release-year\">\n                    ").concat(new Date(movie.release_date).getFullYear(), "\n                    </span>\n                    / \n                    <span class=\"movie-card__genres\">\n                    ").concat(genresHandler(movie.genre_ids, genresList), "\n                    </span>\n                </div>\n                <span class=\"movie-card__title\">\n                ").concat(textHandler(movie.title, 60), "\n                </span>\n            </div>\n            ");
        imageHandler(movieCard.querySelector('.movie-card__poster img'), imageUrl, movie.poster_path, 'w300');
        this.moviesList.append(movieCard);
        movieCard.insertAdjacentHTML('afterend', '<!-- /.movie-card -->');
      }
    }
  }]);

  return Discover;
}();

var _default = Discover;
exports["default"] = _default;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Handlers = /*#__PURE__*/function () {
  function Handlers() {
    _classCallCheck(this, Handlers);
  }

  _createClass(Handlers, [{
    key: "debounce",
    value: function debounce(func, delay) {
      var processing = false,
          cache;
      return function (str) {
        cache = str;
        if (processing) return;
        processing = true;
        setTimeout(function () {
          func(cache);
          processing = false;
        }, delay);
      };
    }
  }, {
    key: "getMinMaxYears",
    value: function getMinMaxYears(oldMoviesList, futureMoviesList) {
      var oldestDate = oldMoviesList[0].release_date,
          newestDate = futureMoviesList[0].release_date;
      return [new Date(oldestDate).getFullYear(), new Date(newestDate).getFullYear()];
    }
  }, {
    key: "getUrlSearchString",
    value: function getUrlSearchString() {
      for (var _len = arguments.length, queries = new Array(_len), _key = 0; _key < _len; _key++) {
        queries[_key] = arguments[_key];
      }

      return queries.join('');
    }
  }, {
    key: "getGenresString",
    value: function getGenresString(idArray, genresArray) {
      var result = genresArray.map(function (_ref) {
        var id = _ref.id,
            name = _ref.name;
        if (idArray.find(function (elem) {
          return elem === id;
        })) return name + ', ';
      });
      result = result.join('');
      return result.substring(0, result.length - 2);
    }
  }, {
    key: "processText",
    value: function processText(text, maxLength) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
      }

      return text;
    }
  }, {
    key: "processImage",
    value: function processImage(elem, url, path, size) {
      elem.onerror = function () {
        elem.src = './img/noize.gif';
      };

      elem.src = "".concat(url, "/").concat(size).concat(path);
    }
  }, {
    key: "fadeOut",
    value: function fadeOut(elem) {
      elem.style.opacity = 1;
      var interval = setInterval(function () {
        if (elem.style.opacity <= 0) {
          elem.remove();
          clearInterval(interval);
        }

        ;
        elem.style.opacity -= .1;
      }, 50);
    }
  }]);

  return Handlers;
}();

var _default = Handlers;
exports["default"] = _default;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function carousel() {
  var popularCarousel = $('.owl-carousel');
  popularCarousel.owlCarousel({
    loop: true,
    center: true,
    nav: false,
    dots: false,
    touchDrag: false,
    mouseDrag: false,
    smartSpeed: 300,
    onInitialized: onInitialized,
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 3
      },
      1439: {
        items: 5
      }
    }
  });

  function closeCurrentMovie(trigger, timer) {
    var movie = $('.owl-item.center').find('.popular-this-week__carousel-item');
    var buttons = $('.popular-this-week__carousel-controls .arrow');
    buttons.attr('disabled', 'disabled');
    movie.removeClass('active').addClass('closed');
    setTimeout(function () {
      return popularCarousel.trigger(trigger);
    }, timer);
    setTimeout(function () {
      return buttons.removeAttr('disabled');
    }, 1200);
  }

  function showCurrentMovie() {
    var closed = $('.popular-this-week__carousel-item.closed');
    if (closed) closed.removeClass('closed');
    $('.owl-item.center').find('.popular-this-week__carousel-item').addClass('active');
  }

  function changeArrowText() {
    var moviesList = $('.owl-item'),
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

  $('.popular-this-week__carousel-controls_next .arrow').click(function () {
    closeCurrentMovie('next.owl.carousel', 500);
  });
  $('.popular-this-week__carousel-controls_prev .arrow').click(function () {
    closeCurrentMovie('prev.owl.carousel', 500);
  });
  popularCarousel.on('translated.owl.carousel', function () {
    showCurrentMovie();
    changeArrowText();
  });
}

var _default = carousel;
exports["default"] = _default;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _carouselSetting = _interopRequireDefault(require("./carousel-setting.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Carousel = /*#__PURE__*/function () {
  function Carousel() {
    _classCallCheck(this, Carousel);

    this.initCarousel = _carouselSetting["default"];
    this.body = document.querySelector('.js-popular-this-week__carousel');
    this.movieCardList = this.body.querySelectorAll('.popular-this-week__carousel-item');
  }

  _createClass(Carousel, [{
    key: "createCarousel",
    value: function createCarousel(moviesArray, imageUrl, imageHandler, textHandler, genresHandler, genresList) {
      [].forEach.call(this.movieCardList, function (card, index) {
        var movieData = moviesArray[index],
            movieLink = "./movie.html?movie_id=".concat(movieData.id),
            moviePosterImg = card.querySelector('.js-movie-card__poster-img');
        imageHandler(moviePosterImg, imageUrl, movieData.poster_path, 'w300');
        card.querySelector('.js-movie-card__poster').href = movieLink;
        card.querySelector('.js-movie-card__title').innerText = textHandler(movieData.title, 30);
        card.querySelector('.js-movie-card__original-title-value').innerText = movieData.original_title;
        card.querySelector('.js-movie-card__release-date-value').innerText = new Intl.DateTimeFormat().format(new Date(movieData.release_date));
        card.querySelector('.js-movie-card__genres-value').innerText = genresHandler(movieData.genre_ids, genresList);
        card.querySelector('.js-movie-card__overview-value').innerText = textHandler(movieData.overview, 300);
        card.querySelector('.js-movie-card__vote-average-value').innerText = movieData.vote_average;
        card.querySelector('.js-movie-card__see-more').href = movieLink;
      });
    }
  }]);

  return Carousel;
}();

var _default = Carousel;
exports["default"] = _default;

},{"./carousel-setting.js":6}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var HomeDiscover = /*#__PURE__*/function () {
  function HomeDiscover() {
    _classCallCheck(this, HomeDiscover);

    this.body = document.body.querySelector('.home-page-discover');
    this.navigation = this.body.querySelector('.home-page-discover__nav');
    this.moviesList = this.body.querySelector('.discover-movies__list');
    this.search = this.body.querySelector('.js-home-page-discover__search-input');
  }

  _createClass(HomeDiscover, [{
    key: "changeUnderlinePosition",
    value: function changeUnderlinePosition() {
      var underline = this.navigation.querySelector('.home-page-discover__nav-underline'),
          currentBtn = this.navigation.querySelector('button.current');
      underline.style.width = currentBtn.offsetWidth + 'px';
      underline.style.left = currentBtn.getBoundingClientRect().left - this.navigation.getBoundingClientRect().left + 'px';
    }
  }]);

  return HomeDiscover;
}();

var _default = HomeDiscover;
exports["default"] = _default;

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _carousel = _interopRequireDefault(require("./carousel.js"));

var _homePageDiscover = _interopRequireDefault(require("./home-page-discover.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HomePage = function HomePage() {
  _classCallCheck(this, HomePage);

  this.carousel = new _carousel["default"]();
  this.discover = new _homePageDiscover["default"]();
};

var _default = HomePage;
exports["default"] = _default;

},{"./carousel.js":7,"./home-page-discover.js":8}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Language = /*#__PURE__*/function () {
  function Language() {
    _classCallCheck(this, Language);

    this.languages = ['ru-RU', 'uk-UK', 'en-US'];
    this.currentLang = localStorage.getItem('lang');
    this.langSwitch = document.body.querySelector('.js-lang-switch');
    this.glossary = {
      'ru-RU': {
        '.js-logo': 'Киносклад',
        '.js-home-link': 'Главная',
        '.js-discover-link': 'Все фильмы',
        '.js-popular-this-week-title': 'Популярное на этой неделе',
        '.js-movie-card__original-title-title': 'Оригинальное название:',
        '.js-movie-card__release-date-title': 'Дата выхода:',
        '.js-movie-card__genres-title': 'Жанры:',
        '.js-movie-card__overview-title': 'Описание:',
        '.js-movie-card__vote-average-title': 'Рейтинг на IMDb',
        '.js-home-page-discover__title': 'Список фильмов',
        '.js-home-page-discover__popular-button': 'Популярные',
        '.js-home-page-discover__rating-button': 'Рейтинговые',
        '.js-home-page-discover__search-input': 'Название фильма',
        '.js-home-page-discover__discover-more': 'Полный список',
        '.js-discover-header__search-input': 'Введите название фильма',
        '.js-discover-header__sort-by_popularity': 'По популярности',
        '.js-discover-header__sort-by_rating': 'По рейтингу',
        '.js-discover-header__sort-by_novelty': 'По новизне',
        '.js-discover-movies__filters-genres-title': 'Жанры:',
        '.js-discover-movies__filters-year-title': 'Год выхода:',
        '.js-discover-movies__filters-submit-button': 'Применить',
        '.js-movie-description__runtime-minutes': 'мин',
        '.js-movie-info__starring-title': 'В главных ролях:',
        '.js-movie-info__trailer-title': 'Трейлер к фильму:',
        '.js-movie-info__simular-movies-title': 'Похожие фильмы:'
      },
      'uk-UK': {
        '.js-logo': 'Кіносклад',
        '.js-home-link': 'Головна',
        '.js-discover-link': 'Усі фільми',
        '.js-popular-this-week-title': 'Популярне на цьому тижні',
        '.js-home-page-discover__title': 'Список фільмів',
        '.js-movie-card__original-title-title': 'Оригінальна назва:',
        '.js-movie-card__release-date-title': 'Дата виходу:',
        '.js-movie-card__genres-title': 'Жанри:',
        '.js-movie-card__overview-title': 'Опис:',
        '.js-movie-card__vote-average-title': 'Рейтинг на IMDb',
        '.js-home-page-discover__popular-button': 'Популярні',
        '.js-home-page-discover__rating-button': 'Рейтингові',
        '.js-home-page-discover__search-input': 'Назва фільму',
        '.js-home-page-discover__discover-more': 'Повний перелік',
        '.js-discover-header__search-input': 'Введіть назву фільму',
        '.js-discover-header__sort-by_popularity': 'За популярністю',
        '.js-discover-header__sort-by_rating': 'По рейтингу',
        '.js-discover-header__sort-by_novelty': 'По новизні',
        '.js-discover-movies__filters-genres-title': 'Жанри:',
        '.js-discover-movies__filters-year-title': 'Рік виходу:',
        '.js-discover-movies__filters-submit-button': 'Застосувати',
        '.js-movie-description__runtime-minutes': 'хв',
        '.js-movie-info__starring-title': 'У головних ролях:',
        '.js-movie-info__trailer-title': 'Трейлер до фільму:',
        '.js-movie-info__simular-movies-title': 'Схожі фільми:'
      },
      'en-US': {
        '.js-logo': 'Kinosklad',
        '.js-home-link': 'Home',
        '.js-discover-link': 'Discover',
        '.js-popular-this-week-title': 'Popular this week',
        '.js-movie-card__original-title-title': 'Original title:',
        '.js-movie-card__release-date-title': 'Release date:',
        '.js-movie-card__genres-title': 'Genres:',
        '.js-movie-card__overview-title': 'Overview:',
        '.js-movie-card__vote-average-title': 'Rating on IMDb',
        '.js-home-page-discover__title': 'Discover',
        '.js-home-page-discover__popular-button': 'Popular',
        '.js-home-page-discover__rating-button': 'Rating',
        '.js-home-page-discover__search-input': 'Movie title',
        '.js-home-page-discover__discover-more': 'Discover more',
        '.js-discover-header__search-input': 'Enter movie name',
        '.js-discover-header__sort-by_popularity': 'By popularity',
        '.js-discover-header__sort-by_rating': 'By rating',
        '.js-discover-header__sort-by_novelty': 'By novelty',
        '.js-discover-movies__filters-genres-title': 'Genres:',
        '.js-discover-movies__filters-year-title': 'Release year:',
        '.js-discover-movies__filters-submit-button': 'Apply',
        '.js-movie-description__runtime-minutes': 'min',
        '.js-movie-info__starring-title': 'Starring:',
        '.js-movie-info__trailer-title': 'Movie trailer:',
        '.js-movie-info__simular-movies-title': 'Simular movies:'
      }
    };
  }

  _createClass(Language, [{
    key: "setUserLanguage",
    value: function setUserLanguage() {
      var userLang = window.navigator.language.substring(0, 2);
      var currentLang = this.languages.find(function (lang) {
        return lang.substring(0, 2) === userLang;
      });
      localStorage.setItem('lang', currentLang ? currentLang : 'en-US');
      this.currentLang = currentLang;
    }
  }, {
    key: "createLangSwitch",
    value: function createLangSwitch(currentLang) {
      var _this = this;

      this.languages.forEach(function (lang) {
        _this.langSwitch.insertAdjacentHTML('beforeend', "<option value=\"".concat(lang, "\">").concat(lang.substring(0, 2), "</option>"));
      });
      this.langSwitch.value = currentLang;
      this.langSwitch.addEventListener('change', function (event) {
        localStorage.setItem('lang', event.target.value);
        location.reload();
      });
    }
  }, {
    key: "translatePage",
    value: function translatePage(currentLang) {
      var locale = this.glossary[this.currentLang];
      document.documentElement.lang = this.currentLang.substring(0, 2);

      var _loop = function _loop() {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            elemClass = _Object$entries$_i[0],
            text = _Object$entries$_i[1];

        var elems = document.body.querySelectorAll(elemClass);
        if (elems.length === 0) return "continue";
        elems.forEach(function (el) {
          if (el.tagName === 'INPUT' && el.type === 'text') {
            el.placeholder = text;
            return;
          }

          el.innerText = text;
        });
      };

      for (var _i = 0, _Object$entries = Object.entries(locale); _i < _Object$entries.length; _i++) {
        var _ret = _loop();

        if (_ret === "continue") continue;
      }
    }
  }]);

  return Language;
}();

var _default = Language;
exports["default"] = _default;

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MovieInfo = /*#__PURE__*/function () {
  function MovieInfo() {
    _classCallCheck(this, MovieInfo);

    this.body = document.body.querySelector('.movie-info');
    this.starringList = this.body.querySelector('.js-movie-info__starring-list');
    this.similarMoviesList = this.body.querySelector('.js-movie-info__simular-movies-list');
    this.trailer = this.body.querySelector('.js-movie-info__trailer-video');
  }

  _createClass(MovieInfo, [{
    key: "createStarringList",
    value: function createStarringList(actorsList, imageHandler, imageUrl) {
      if (actorsList.length === 0) return;
      this.starringList.innerHTML = '';

      for (var i = 0; i <= 4; i++) {
        var actor = actorsList[i],
            actorCard = document.createElement('figure'),
            actorPhoto = document.createElement('img');
        if (!actor) break;
        actorCard.className = 'movie-info__actor';
        actorPhoto.className = 'movie-info__actor-photo';
        imageHandler(actorPhoto, imageUrl, actor.profile_path, 'w200');
        actorCard.append(actorPhoto);
        actorCard.insertAdjacentHTML('beforeend', "\n            <figcaption class=\"movie-info__actor-info\">\n                <div class=\"movie-info__actor-name js-movie-info__actor-name\">".concat(actor.name, "</div>\n                <span class=\"movie-info__actor-role js-movie-info__actor-role\">").concat(actor.character, "</span>\n            </figcaption>\n            "));
        this.starringList.append(actorCard);
      }
    }
  }, {
    key: "createSimilarMoviesList",
    value: function createSimilarMoviesList(moviesList, imageHandler, imageUrl, textHandler) {
      if (moviesList.length === 0) return;
      this.similarMoviesList.innerHTML = '';

      for (var i = 0; i <= 5; i++) {
        var movie = moviesList[i],
            movieCard = document.createElement('a'),
            movieImage = document.createElement('img');
        if (!movie) return;
        movieCard.className = 'movie-info__simular-movie';
        movieCard.href = "./movie.html?movie_id=".concat(movie.id);
        movieImage.className = 'movie-info__simular-movie-poster';
        imageHandler(movieImage, imageUrl, movie.poster_path, 'w200');
        movieCard.append(movieImage);
        movieCard.insertAdjacentHTML('beforeend', "\n                <span class=\"movie-info__simular-movie-name\">".concat(textHandler(movie.title, 35), "</span>\n                "));
        this.similarMoviesList.append(movieCard);
      }
    }
  }, {
    key: "createTrailer",
    value: function createTrailer(videoInfo, siteUrl) {
      if (!videoInfo) return;
      this.trailer.innerHTML = "\n            <iframe width=\"100%\" height=\"100%\" \n            src=\"".concat(siteUrl, "/embed/").concat(videoInfo.key, "\" \n            frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" \n            allowfullscreen></iframe>\n            ");
    }
  }]);

  return MovieInfo;
}();

var _default = MovieInfo;
exports["default"] = _default;

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _moviePreview = _interopRequireDefault(require("./movie-preview.js"));

var _movieInfo = _interopRequireDefault(require("./movie-info.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MoviePage = /*#__PURE__*/function () {
  function MoviePage() {
    _classCallCheck(this, MoviePage);

    this.moviePreview = new _moviePreview["default"]();
    this.movieInfo = new _movieInfo["default"]();
  }

  _createClass(MoviePage, [{
    key: "getMovieId",
    value: function getMovieId() {
      return location.search.split('=')[1];
    }
  }]);

  return MoviePage;
}();

var _default = MoviePage;
exports["default"] = _default;

},{"./movie-info.js":11,"./movie-preview.js":13}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MoviePreview = /*#__PURE__*/function () {
  function MoviePreview() {
    _classCallCheck(this, MoviePreview);

    this.body = document.body.querySelector('.movie-preview');
    this.title = this.body.querySelector('.js-movie-description__name');
    this.overview = this.body.querySelector('.js-movie-description__overview');
    this.runtimeValue = this.body.querySelector('.js-movie-description__runtime-value');
    this.releaseYear = this.body.querySelector('.movie-description__release-year');
    this.genres = this.body.querySelector('.js-movie-description__genres');
    this.vote = this.body.querySelector('.js-movie-description__vote-average');
  }

  _createClass(MoviePreview, [{
    key: "showMoviePreview",
    value: function showMoviePreview(movieInfo, imgPath) {
      this.body.style.backgroundImage = "url(\"".concat(imgPath, "/original/").concat(movieInfo.backdrop_path, "\")");
      this.title.innerText = movieInfo.title;
      this.overview.innerText = movieInfo.overview;
      this.runtimeValue.innerText = movieInfo.runtime;
      this.releaseYear.innerText = new Date(movieInfo.release_date).getFullYear();
      this.genres.innerText = movieInfo.genres.map(function (_ref) {
        var name = _ref.name;
        return name;
      }).join(', ');
      this.vote.innerText = movieInfo.vote_average;
    }
  }]);

  return MoviePreview;
}();

var _default = MoviePreview;
exports["default"] = _default;

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Requests = /*#__PURE__*/function () {
  function Requests() {
    _classCallCheck(this, Requests);

    this._apiKey = 'ac0fb13957471aa7cf34db0d0c3288f4';
    this._discoverUrl = 'https://api.themoviedb.org/3/discover/movie';
    this._trandingUrl = 'https://api.themoviedb.org/3/trending/movie';
    this._movieUrl = 'https://api.themoviedb.org/3/movie';
    this._searchUrl = 'https://api.themoviedb.org/3/search/movie';
    this._genresListUrl = 'https://api.themoviedb.org/3/genre/movie/list';
    this._imageUrl = 'https://image.tmdb.org/t/p';
    this._youTubeUrl = 'https://www.youtube.com';
  }

  _createClass(Requests, [{
    key: "getMovieInfo",
    value: function getMovieInfo(lang, id, option) {
      option = option ? "/".concat(option) : '';
      var request = "".concat(this._movieUrl, "/").concat(id).concat(option, "?api_key=").concat(this._apiKey, "&language=").concat(lang);
      return this.sendRequest(request);
    }
  }, {
    key: "getSearchResult",
    value: function getSearchResult(lang, query) {
      var request = "".concat(this._searchUrl, "?api_key=").concat(this._apiKey, "&language=").concat(lang, "&query=").concat(query);
      return this.sendRequest(request);
    }
  }, {
    key: "getGenresList",
    value: function getGenresList(lang) {
      var request = "".concat(this._genresListUrl, "?api_key=").concat(this._apiKey, "&language=").concat(lang);
      return this.sendRequest(request);
    }
  }, {
    key: "getTranding",
    value: function getTranding(lang) {
      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'week';
      var request = "".concat(this._trandingUrl, "/").concat(time, "?api_key=").concat(this._apiKey, "&language=").concat(lang);
      return this.sendRequest(request);
    }
  }, {
    key: "getDiscover",
    value: function getDiscover(lang) {
      var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '&sort_by=popularity.desc';
      var request = "".concat(this._discoverUrl, "?api_key=").concat(this._apiKey, "&language=").concat(lang).concat(query);
      return this.sendRequest(request);
    }
  }, {
    key: "sendRequest",
    value: function sendRequest(request) {
      var cache = this.checkCache(request);
      if (cache) return cache;
      return fetch(request).then(function (response) {
        return response.json();
      }).then(function (obj) {
        obj.save_time = Date.now();
        localStorage.setItem(request, JSON.stringify(obj));
        return obj;
      });
    }
  }, {
    key: "checkCache",
    value: function checkCache(request) {
      var storageHours = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
      var response = localStorage.getItem(request);

      if (response) {
        var saveTime = JSON.parse(response).save_time,
            storageTime = storageHours * 3600 * 1000;
        response = new Promise(function (res) {
          return res(JSON.parse(response));
        });
        return Date.now() - saveTime < storageTime ? response : false;
      }

      return false;
    }
  }]);

  return Requests;
}();

var _default = Requests;
exports["default"] = _default;

},{}]},{},[1]);
