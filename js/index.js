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
class isoTopeFilter {
    isotope;
    instances;

    props = {
        selected: '',
        filterId: '',
        filterItem: '',
        targetId: '',
        targetItem: '',
        activeItemSelector: 'active'
    };

    _selected = new Set();

    constructor(props) {
        // debugger;
        let self = this;

        props = props || {};

        this.props = Object.assign(this.props, props);

        // делаем из него singleton
        if (!!isoTopeFilter.instance) {
            if (this._isLoaded()) {
                return isoTopeFilter.instance;
            }
        } else {
            isoTopeFilter.instances = new Set();
        }

        isoTopeFilter.instances.add(this.props.targetId);
        isoTopeFilter.instance = this;
        // т.к. скрипт запуска может быть асинхронным, и нужные скрипты могут запуститься позже
        document.addEventListener("DOMContentLoaded", function () {
            if (self._timerAsyncLoaded === undefined) {
                self._timerAsyncLoaded = setTimeout(self._checkVendorsLoading.bind(self, [props]), 0);
            }
        }, false);

        return this;
    }

    _timerAsyncLoadedTimerInt = 100;
    _timerAsyncLoadedCounter = 0;
    _checkVendorsLoading = function (...args) {
        this._timerAsyncLoadedCounter++;
        if (typeof $ === 'function' && typeof Isotope === 'function') {
            clearTimeout(this._timerAsyncLoaded);
            if (this.setup(args)) {
                this.events();
                console.log('isoTopeFilter is loaded');
            }
        } else if ((this._timerAsyncLoadedTimerInt * this._timerAsyncLoadedCounter) > 10000) {
            console.error('по всей видимости Isotope или jquery не подключен, прерываю попытки');
        } else {
            this._timerAsyncLoaded = setTimeout(this._checkVendorsLoading.bind(this, args), this._timerAsyncLoadedTimerInt);
        }
    }

    _isLoaded = function () {
        console.log('_isLoaded', this.props.targetId);
        return isoTopeFilter.instances.has(this.props.targetId);
    }

    setup = function () {
        let self = this;
        console.log('setup', this.props.targetId);
        if (!this.props.filterId) {
            throw new Error(`[isoTopeFilter] Filter id is not set`);
        }
        if (!document.getElementById(this.props.filterId)) {
            throw new Error(`[isoTopeFilter] Filter container with id "${this.props.filterId}" is not exist`);
        }
        if (!this.props.targetId) {
            throw new Error(`[isoTopeFilter] Target id is not set`);
        }
        if (!document.getElementById(this.props.targetId)) {
            throw new Error(`[isoTopeFilter] Target container with id "${this.props.targetId}" is not exist`);
        }

        if (typeof this.props.selected !== 'undefined') {
            for (let filterItem of this.props.selected.split(',')) {
                filterItem = filterItem.trim();
                if (filterItem.length){
                    self._addFilter(filterItem, false);
                    this._updateFilterEl(filterItem);
                }
            }
        }

        this._isotope();
        return true;
    }

    _isotope = function () {
        // debugger;
        let self = this;
        this.isotope = $(`#${self.props.targetId}`).isotope({
            targetItem: self.props.targetItem,
            filter: (id, el) => {
                if (!this._selected.size) return true;
                // console.log('isotope el', el);
                let categories = el.dataset.categories
                if (typeof categories !== 'undefined') {
                    categories = categories.toString();
                }
                categories = categories.split(',');
                let result = false;

                let MyIsoTopeException;
                try {
                    this._selected.forEach((value, valueAgain, set) => {
                        if (~categories.indexOf(value)) {
                            result = true;
                            throw MyIsoTopeException // throw new Error('oops');
                        }
                    });
                } catch (e) {
                    if (e !== MyIsoTopeException) throw e;
                }
                return result;
            }
        });
    }

    _addFilter = function (val, autoreload = true) {
        if (this._selected.has(val)) return;
        this._selected.add(val);
        // this._updateFilterEl(val);
        if (autoreload) this._isotope();
    }

    _removeFilter = function (val) {
        this._selected.delete(val);
        this._isotope();
    }

    _updateFilterEl = function (val) {
        // debugger;
        let filterEl;
        if (filterEl = document.querySelector(`#${this.props.filterId} ${this.props.filterItem}[data-filter="${val}"]`)) {
            console.log(filterEl);
            filterEl.classList.toggle(this.props.activeItemSelector);
        }
        // let isSelected = filterEl.classList.contains(this.props.activeItemSelector);
    }

    events = function () {
        const buttons = document.querySelectorAll(this.props.filterItem);
        for (let button of buttons) {
            button.addEventListener('click', event => {
                let $target = $(event.currentTarget);
                $target.toggleClass(this.props.activeItemSelector);

                let isSelected = $target.hasClass(this.props.activeItemSelector);
                let filter_val = $target.attr('data-filter').toString();
                if (isSelected) {
                    this._addFilter(filter_val);
                } else {
                    this._removeFilter(filter_val);
                }
            });
        }
        return true;
    }
}