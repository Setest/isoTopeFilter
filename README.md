# Isotope

_Magic wrapper of IsoTope for easy filtering data_

See [isotope.metafizzy.co](https://isotope.metafizzy.co) for complete docs and demos.

## About

Фильтрует вывод сетки isoTope в зависимости от текущего (и переданного) значения фильтрации.
Асинхронный, не прерывает вызов других скриптов, не валится при ошибках, не перегружает память,
в случае множественного вызова на странице, позволяет связывать столько фильтров и сеток на одной странице
сколько это нужно.

## Install

### Link

Link directly to script.

``` html
<script src=".../dist/isotope-filter.js"></script>
```

## ToDo

- изменить логику управление селектором активного элемента фильтра как реакцию на
  изменение значений this._selected через методы _addFilter и _removeFilter используя для этого _updateFilterEl
  Пример примитивной реактивности.

## License

### Open source license

If you are creating an open source application under a license compatible with the [GNU GPL license v3](https://www.gnu.org/licenses/gpl-3.0.html), you may use Isotope under the terms of the GPLv3.

## Use

JavaScript

``` js
let $isoTopeGrid = new isoTopeFilter({
    selected  : '1,2,3',
    filterId  : 'morph-select',
    filterItem: '.morph-select__item',
    targetId  : 'services',
    targetItem: '.services__item'
})
```

In your HTML


``` html
Кнопки фильтрации
<div class="morph-select mb-5 mb-md-4" id="morph-select">
    <button class="morph-select__title js-morph-select__title btn btn-primary-light rounded d-md-none">
        Выбрать услугу
    <i class="morph__icon i i_icon-plus text-primary i_size_12 animated ml-2"></i>
    </button>
    <ul class="morph-select__list">
        <li class="morph-select__item" data-filter="1" tabindex="1">Биоинформатика</li>
        <li class="morph-select__item" data-filter="2" tabindex="2">Биобанк</li>
    </ul>
</div>

isoTope grid
<div id="services">
    <div class="services__item" data-categories="0,1" >
        ...
    </div>
    <div class="services__item" data-categories="1" >
        ...
    </div>
    <div class="services__item" data-categories="2,test" >
        ...
    </div>
    ...
</div>
```

* * *

By [Setest 🌈🐻](<itman116@gmail.com>)
