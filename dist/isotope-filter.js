function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}

function _classCallCheck(instance, Constructor) {
    if (!_instanceof(instance, Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

/*!
 * isoTopeFilter v0.0.1 (https://github.com/Setest/isoTopeFilter)
 *
 * Add filters from the box for isoTope
 *
 * Author Prishepenko Stepan: Setest <itman116@gmail.com> (https://github.com/Setest/)
 * Since 2020-01-31
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * https://isotope.metafizzy.co
 */
var isoTopeFilter = function isoTopeFilter(props) {
    "use strict";

    _classCallCheck(this, isoTopeFilter);

    _defineProperty(this, "isotope", void 0);

    _defineProperty(this, "instances", void 0);

    _defineProperty(this, "props", {
        selected: '',
        filterId: '',
        filterItem: '',
        targetId: '',
        targetItem: '',
        activeItemSelector: 'active'
    });

    _defineProperty(this, "_selected", new Set());

    _defineProperty(this, "_timerAsyncLoadedTimerInt", 100);

    _defineProperty(this, "_timerAsyncLoadedCounter", 0);

    _defineProperty(this, "_checkVendorsLoading", function () {
        this._timerAsyncLoadedCounter++;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        if (typeof $ === 'function' && typeof Isotope === 'function') {
            clearTimeout(this._timerAsyncLoaded);

            if (this.setup(args)) {
                this.events();
                console.log('isoTopeFilter is loaded');
            }
        } else if (this._timerAsyncLoadedTimerInt * this._timerAsyncLoadedCounter > 10000) {
            console.error('по всей видимости Isotope или jquery не подключен, прерываю попытки');
        } else {
            this._timerAsyncLoaded = setTimeout(this._checkVendorsLoading.bind(this, args), this._timerAsyncLoadedTimerInt);
        }
    });

    _defineProperty(this, "_isLoaded", function () {
        console.log('_isLoaded', this.props.targetId);
        return isoTopeFilter.instances.has(this.props.targetId);
    });

    _defineProperty(this, "setup", function () {
        var self = this;
        console.log('setup', this.props.targetId);

        if (!this.props.filterId) {
            throw new Error("[isoTopeFilter] Filter id is not set");
        }

        if (!document.getElementById(this.props.filterId)) {
            throw new Error("[isoTopeFilter] Filter container with id \"".concat(this.props.filterId, "\" is not exist"));
        }

        if (!this.props.targetId) {
            throw new Error("[isoTopeFilter] Target id is not set");
        }

        if (!document.getElementById(this.props.targetId)) {
            throw new Error("[isoTopeFilter] Target container with id \"".concat(this.props.targetId, "\" is not exist"));
        }

        if (typeof this.props.selected !== 'undefined') {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.props.selected.split(',')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var filterItem = _step.value;
                    filterItem = filterItem.trim();

                    if (filterItem.length) {
                        self._addFilter(filterItem, false);

                        this._updateFilterEl(filterItem);
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }

        this._isotope();

        return true;
    });

    _defineProperty(this, "_isotope", function () {
        var _this = this;

        // debugger;
        var self = this;
        this.isotope = $("#".concat(self.props.targetId)).isotope({
            targetItem: self.props.targetItem,
            filter: function filter(id, el) {
                if (!_this._selected.size) return true; // console.log('isotope el', el);

                var categories = el.dataset.categories;

                if (typeof categories !== 'undefined') {
                    categories = categories.toString();
                }

                categories = categories.split(',');
                var result = false;
                var MyIsoTopeException;

                try {
                    _this._selected.forEach(function (value, valueAgain, set) {
                        if (~categories.indexOf(value)) {
                            result = true;
                            throw MyIsoTopeException; // throw new Error('oops');
                        }
                    });
                } catch (e) {
                    if (e !== MyIsoTopeException) throw e;
                }

                return result;
            }
        });
    });

    _defineProperty(this, "_addFilter", function (val) {
        var autoreload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        if (this._selected.has(val)) return;

        this._selected.add(val); // this._updateFilterEl(val);


        if (autoreload) this._isotope();
    });

    _defineProperty(this, "_removeFilter", function (val) {
        this._selected.delete(val);

        this._isotope();
    });

    _defineProperty(this, "_updateFilterEl", function (val) {
        // debugger;
        var filterEl;

        if (filterEl = document.querySelector("#".concat(this.props.filterId, " ").concat(this.props.filterItem, "[data-filter=\"").concat(val, "\"]"))) {
            console.log(filterEl);
            filterEl.classList.toggle(this.props.activeItemSelector);
        } // let isSelected = filterEl.classList.contains(this.props.activeItemSelector);

    });

    _defineProperty(this, "events", function () {
        var _this2 = this;

        var buttons = document.querySelectorAll(this.props.filterItem);
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = buttons[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var button = _step2.value;
                button.addEventListener('click', function (event) {
                    var $target = $(event.currentTarget);
                    $target.toggleClass(_this2.props.activeItemSelector);
                    var isSelected = $target.hasClass(_this2.props.activeItemSelector);
                    var filter_val = $target.attr('data-filter').toString();

                    if (isSelected) {
                        _this2._addFilter(filter_val);
                    } else {
                        _this2._removeFilter(filter_val);
                    }
                });
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        return true;
    });

    // debugger;
    var _self = this;

    props = props || {};
    this.props = Object.assign(this.props, props); // делаем из него singleton

    if (!!isoTopeFilter.instance) {
        if (this._isLoaded()) {
            return isoTopeFilter.instance;
        }
    } else {
        isoTopeFilter.instances = new Set();
    }

    isoTopeFilter.instances.add(this.props.targetId);
    isoTopeFilter.instance = this; // т.к. скрипт запуска может быть асинхронным, и нужные скрипты могут запуститься позже

    document.addEventListener("DOMContentLoaded", function () {
        if (_self._timerAsyncLoaded === undefined) {
            _self._timerAsyncLoaded = setTimeout(_self._checkVendorsLoading.bind(_self, [props]), 0);
        }
    }, false);
    return this;
};