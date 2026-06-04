jQuery(document).ready(function ($) {

    // Menu Script
    if ($(window).width() <= 767) {
        $(".menu-top").click(function () {
            $(".res-menu ul").addClass("mobilemenu");
            $(this).toggleClass('btn-open').toggleClass('btn-close');
        });



        //jQuery(document).ready(function($){
        // orientationChange();
        //});
        //function orientationChange() {
        // if(window.addEventListener) {
        //  window.addEventListener("orientationchange", function() {
        //    location.reload();
        //});
        //}
        //}
    }

    // Slider Script
    jQuery("#wowslider-container1").wowSlider({
        effect: "fade",
        prev: "",
        next: "",
        duration: 30 * 100,
        delay: 30 * 100,
        width: 533,
        height: 800,
        autoPlay: true,
        autoPlayVideo: false,
        playPause: true,
        stopOnHover: true,
        loop: false,
        bullets: 3,
        caption: true,
        captionEffect: "fade",
        controls: true,
        controlsThumb: true,
        responsive: 1,
        fullScreen: true,
        gestures: 2,
        onBeforeStep: 0,
        images: 0
    });




    // Header Fixed   
    $(window).scroll(function () {
        var height = $(window).scrollTop();
        if (height >= 300) {
            $('.header').addClass('home-header');
        }
        else if (height == 0) {
            $('.header').removeClass('home-header');
        }
    });


    var stickyTop = $('.home-container').offset().top;
    $(window).on('scroll', function () {
        if ($(window).scrollTop() >= stickyTop) {
            $('.header').addClass('header-fixed');
        } else {
            $('.header').removeClass('header-fixed');
        }
    });

    // Brand Companies

    $('.brand-companies').owlCarousel({
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: false,
        dots: false,
        center: true,
        loop: true,

        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 3
            },
            1000: {
                items: 7
            }
        }
    });
    // Clients caro
    $('.client-caro').owlCarousel({
        autoplay: true,
        autoplayHoverPause: true,
        dots: false,
        loop: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 2
            },
            1000: {
                items: 3
            }
        }
    });


    //Scrool script
    $(document).on("scroll", onScroll);
    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('.menu_items li a').bind('click', function (event) {
        event.preventDefault();
        $(document).off("scroll");
        obj = $(this);
        main_link_ref = obj.attr("href");
        $target = $(main_link_ref);
        $(".menu_items li a").each(function (index) {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                return false;
            }
        });
        obj.addClass('active');
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top - 0
        }, 1500, 'swing', function () {
            window.location.hash = main_link_ref;
            $(document).on("scroll", onScroll);
        });
    });
    // End of use strict
    function onScroll(event) {
        var scrollPos = $(document).scrollTop();
        var windowHeight = $(window).height();
        var docHeight = $(document).height();

        // If we are at the bottom of the page, highlight the last menu item (Contact)
        if (scrollPos + windowHeight >= docHeight - 50) {
            $('.menu_items li a').removeClass("active");
            $('.menu_items li a').last().addClass("active");
            return;
        }

        $('.menu_items li a').each(function () {
            var currLink = $(this);
            var refElement = $(currLink.attr("href"));
            if (refElement.length) {
                var top = refElement.offset().top;
                if (top - 80 <= scrollPos && top + refElement.outerHeight() - 80 > scrollPos) {
                    $('.menu_items li a').removeClass("active");
                    currLink.addClass("active");
                } else {
                    currLink.removeClass("active");
                }
            }
        });
    }


});

//owl carousel

/**
 * Owl carousel
 * @version 2.0.0
 * @author Bartosz Wojciechowski
 * @license The MIT License (MIT)
 * @todo Lazy Load Icon
 * @todo prevent animationend bubling
 * @todo itemsScaleUp
 * @todo Test Zepto
 * @todo stagePadding calculate wrong active classes
 */
;
(function ($, window, document, undefined) {

    var drag, state, e;

    /**
     * Template for status information about drag and touch events.
     * @private
     */
    drag = {
        start: 0,
        startX: 0,
        startY: 0,
        current: 0,
        currentX: 0,
        currentY: 0,
        offsetX: 0,
        offsetY: 0,
        distance: null,
        startTime: 0,
        endTime: 0,
        updatedX: 0,
        targetEl: null
    };

    /**
     * Template for some status informations.
     * @private
     */
    state = {
        isTouch: false,
        isScrolling: false,
        isSwiping: false,
        direction: false,
        inMotion: false
    };

    /**
     * Event functions references.
     * @private
     */
    e = {
        _onDragStart: null,
        _onDragMove: null,
        _onDragEnd: null,
        _transitionEnd: null,
        _resizer: null,
        _responsiveCall: null,
        _goToLoop: null,
        _checkVisibile: null
    };

    /**
     * Creates a carousel.
     * @class The Owl Carousel.
     * @public
     * @param {HTMLElement|jQuery} element - The element to create the carousel for.
     * @param {Object} [options] - The options
     */
    function Owl(element, options) {

        /**
         * Current settings for the carousel.
         * @public
         */
        this.settings = null;

        /**
         * Current options set by the caller including defaults.
         * @public
         */
        this.options = $.extend({}, Owl.Defaults, options);

        /**
         * Plugin element.
         * @public
         */
        this.$element = $(element);

        /**
         * Caches informations about drag and touch events.
         */
        this.drag = $.extend({}, drag);

        /**
         * Caches some status informations.
         * @protected
         */
        this.state = $.extend({}, state);

        /**
         * @protected
         * @todo Must be documented
         */
        this.e = $.extend({}, e);

        /**
         * References to the running plugins of this carousel.
         * @protected
         */
        this._plugins = {};

        /**
         * Currently suppressed events to prevent them from beeing retriggered.
         * @protected
         */
        this._supress = {};

        /**
         * Absolute current position.
         * @protected
         */
        this._current = null;

        /**
         * Animation speed in milliseconds.
         * @protected
         */
        this._speed = null;

        /**
         * Coordinates of all items in pixel.
         * @todo The name of this member is missleading.
         * @protected
         */
        this._coordinates = [];

        /**
         * Current breakpoint.
         * @todo Real media queries would be nice.
         * @protected
         */
        this._breakpoint = null;

        /**
         * Current width of the plugin element.
         */
        this._width = null;

        /**
         * All real items.
         * @protected
         */
        this._items = [];

        /**
         * All cloned items.
         * @protected
         */
        this._clones = [];

        /**
         * Merge values of all items.
         * @todo Maybe this could be part of a plugin.
         * @protected
         */
        this._mergers = [];

        /**
         * Invalidated parts within the update process.
         * @protected
         */
        this._invalidated = {};

        /**
         * Ordered list of workers for the update process.
         * @protected
         */
        this._pipe = [];

        $.each(Owl.Plugins, $.proxy(function (key, plugin) {
            this._plugins[key[0].toLowerCase() + key.slice(1)] = new plugin(this);
        }, this));

        $.each(Owl.Pipe, $.proxy(function (priority, worker) {
            this._pipe.push({
                'filter': worker.filter,
                'run': $.proxy(worker.run, this)
            });
        }, this));

        this.setup();
        this.initialize();
    }

    /**
     * Default options for the carousel.
     * @public
     */
    Owl.Defaults = {
        items: 3,
        loop: false,
        center: false,

        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        freeDrag: false,

        margin: 0,
        stagePadding: 0,

        merge: false,
        mergeFit: true,
        autoWidth: false,

        startPosition: 0,
        rtl: false,

        smartSpeed: 250,
        fluidSpeed: false,
        dragEndSpeed: false,

        responsive: {},
        responsiveRefreshRate: 200,
        responsiveBaseElement: window,
        responsiveClass: false,

        fallbackEasing: 'swing',

        info: false,

        nestedItemSelector: false,
        itemElement: 'div',
        stageElement: 'div',

        // Classes and Names
        themeClass: 'owl-theme',
        baseClass: 'owl-carousel',
        itemClass: 'owl-item',
        centerClass: 'center',
        activeClass: 'active'
    };

    /**
     * Enumeration for width.
     * @public
     * @readonly
     * @enum {String}
     */
    Owl.Width = {
        Default: 'default',
        Inner: 'inner',
        Outer: 'outer'
    };

    /**
     * Contains all registered plugins.
     * @public
     */
    Owl.Plugins = {};

    /**
     * Update pipe.
     */
    Owl.Pipe = [{
        filter: ['width', 'items', 'settings'],
        run: function (cache) {
            cache.current = this._items && this._items[this.relative(this._current)];
        }
    }, {
        filter: ['items', 'settings'],
        run: function () {
            var cached = this._clones,
                clones = this.$stage.children('.cloned');

            if (clones.length !== cached.length || (!this.settings.loop && cached.length > 0)) {
                this.$stage.children('.cloned').remove();
                this._clones = [];
            }
        }
    }, {
        filter: ['items', 'settings'],
        run: function () {
            var i, n,
                clones = this._clones,
                items = this._items,
                delta = this.settings.loop ? clones.length - Math.max(this.settings.items * 2, 4) : 0;

            for (i = 0, n = Math.abs(delta / 2); i < n; i++) {
                if (delta > 0) {
                    this.$stage.children().eq(items.length + clones.length - 1).remove();
                    clones.pop();
                    this.$stage.children().eq(0).remove();
                    clones.pop();
                } else {
                    clones.push(clones.length / 2);
                    this.$stage.append(items[clones[clones.length - 1]].clone().addClass('cloned'));
                    clones.push(items.length - 1 - (clones.length - 1) / 2);
                    this.$stage.prepend(items[clones[clones.length - 1]].clone().addClass('cloned'));
                }
            }
        }
    }, {
        filter: ['width', 'items', 'settings'],
        run: function () {
            var rtl = (this.settings.rtl ? 1 : -1),
                width = (this.width() / this.settings.items).toFixed(3),
                coordinate = 0,
                merge, i, n;

            this._coordinates = [];
            for (i = 0, n = this._clones.length + this._items.length; i < n; i++) {
                merge = this._mergers[this.relative(i)];
                merge = (this.settings.mergeFit && Math.min(merge, this.settings.items)) || merge;
                coordinate += (this.settings.autoWidth ? this._items[this.relative(i)].width() + this.settings.margin : width * merge) * rtl;

                this._coordinates.push(coordinate);
            }
        }
    }, {
        filter: ['width', 'items', 'settings'],
        run: function () {
            var i, n, width = (this.width() / this.settings.items).toFixed(3),
                css = {
                    'width': Math.abs(this._coordinates[this._coordinates.length - 1]) + this.settings.stagePadding * 2,
                    'padding-left': this.settings.stagePadding || '',
                    'padding-right': this.settings.stagePadding || ''
                };

            this.$stage.css(css);

            css = {
                'width': this.settings.autoWidth ? 'auto' : width - this.settings.margin
            };
            css[this.settings.rtl ? 'margin-left' : 'margin-right'] = this.settings.margin;

            if (!this.settings.autoWidth && $.grep(this._mergers, function (v) {
                return v > 1
            }).length > 0) {
                for (i = 0, n = this._coordinates.length; i < n; i++) {
                    css.width = Math.abs(this._coordinates[i]) - Math.abs(this._coordinates[i - 1] || 0) - this.settings.margin;
                    this.$stage.children().eq(i).css(css);
                }
            } else {
                this.$stage.children().css(css);
            }
        }
    }, {
        filter: ['width', 'items', 'settings'],
        run: function (cache) {
            cache.current && this.reset(this.$stage.children().index(cache.current));
        }
    }, {
        filter: ['position'],
        run: function () {
            this.animate(this.coordinates(this._current));
        }
    }, {
        filter: ['width', 'position', 'items', 'settings'],
        run: function () {
            var rtl = this.settings.rtl ? 1 : -1,
                padding = this.settings.stagePadding * 2,
                begin = this.coordinates(this.current()) + padding,
                end = begin + this.width() * rtl,
                inner, outer, matches = [],
                i, n;

            for (i = 0, n = this._coordinates.length; i < n; i++) {
                inner = this._coordinates[i - 1] || 0;
                outer = Math.abs(this._coordinates[i]) + padding * rtl;

                if ((this.op(inner, '<=', begin) && (this.op(inner, '>', end))) ||
                    (this.op(outer, '<', begin) && this.op(outer, '>', end))) {
                    matches.push(i);
                }
            }

            this.$stage.children('.' + this.settings.activeClass).removeClass(this.settings.activeClass);
            this.$stage.children(':eq(' + matches.join('), :eq(') + ')').addClass(this.settings.activeClass);

            if (this.settings.center) {
                this.$stage.children('.' + this.settings.centerClass).removeClass(this.settings.centerClass);
                this.$stage.children().eq(this.current()).addClass(this.settings.centerClass);
            }
        }
    }];

    /**
     * Initializes the carousel.
     * @protected
     */
    Owl.prototype.initialize = function () {
        this.trigger('initialize');

        this.$element
            .addClass(this.settings.baseClass)
            .addClass(this.settings.themeClass)
            .toggleClass('owl-rtl', this.settings.rtl);

        // check support
        this.browserSupport();

        if (this.settings.autoWidth && this.state.imagesLoaded !== true) {
            var imgs, nestedSelector, width;
            imgs = this.$element.find('img');
            nestedSelector = this.settings.nestedItemSelector ? '.' + this.settings.nestedItemSelector : undefined;
            width = this.$element.children(nestedSelector).width();

            if (imgs.length && width <= 0) {
                this.preloadAutoWidthImages(imgs);
                return false;
            }
        }

        this.$element.addClass('owl-loading');

        // create stage
        this.$stage = $('<' + this.settings.stageElement + ' class="owl-stage"/>')
            .wrap('<div class="owl-stage-outer">');

        // append stage
        this.$element.append(this.$stage.parent());

        // append content
        this.replace(this.$element.children().not(this.$stage.parent()));

        // set view width
        this._width = this.$element.width();

        // update view
        this.refresh();

        this.$element.removeClass('owl-loading').addClass('owl-loaded');

        // attach generic events
        this.eventsCall();

        // attach generic events
        this.internalEvents();

        // attach custom control events
        this.addTriggerableEvents();

        this.trigger('initialized');
    };

    /**
     * Setups the current settings.
     * @todo Remove responsive classes. Why should adaptive designs be brought into IE8?
     * @todo Support for media queries by using `matchMedia` would be nice.
     * @public
     */
    Owl.prototype.setup = function () {
        var viewport = this.viewport(),
            overwrites = this.options.responsive,
            match = -1,
            settings = null;

        if (!overwrites) {
            settings = $.extend({}, this.options);
        } else {
            $.each(overwrites, function (breakpoint) {
                if (breakpoint <= viewport && breakpoint > match) {
                    match = Number(breakpoint);
                }
            });

            settings = $.extend({}, this.options, overwrites[match]);
            delete settings.responsive;

            // responsive class
            if (settings.responsiveClass) {
                this.$element.attr('class', function (i, c) {
                    return c.replace(/\b owl-responsive-\S+/g, '');
                }).addClass('owl-responsive-' + match);
            }
        }

        if (this.settings === null || this._breakpoint !== match) {
            this.trigger('change', {
                property: {
                    name: 'settings',
                    value: settings
                }
            });
            this._breakpoint = match;
            this.settings = settings;
            this.invalidate('settings');
            this.trigger('changed', {
                property: {
                    name: 'settings',
                    value: this.settings
                }
            });
        }
    };

    /**
     * Updates option logic if necessery.
     * @protected
     */
    Owl.prototype.optionsLogic = function () {
        // Toggle Center class
        this.$element.toggleClass('owl-center', this.settings.center);

        // if items number is less than in body
        if (this.settings.loop && this._items.length < this.settings.items) {
            this.settings.loop = false;
        }

        if (this.settings.autoWidth) {
            this.settings.stagePadding = false;
            this.settings.merge = false;
        }
    };

    /**
     * Prepares an item before add.
     * @todo Rename event parameter `content` to `item`.
     * @protected
     * @returns {jQuery|HTMLElement} - The item container.
     */
    Owl.prototype.prepare = function (item) {
        var event = this.trigger('prepare', {
            content: item
        });

        if (!event.data) {
            event.data = $('<' + this.settings.itemElement + '/>')
                .addClass(this.settings.itemClass).append(item)
        }

        this.trigger('prepared', {
            content: event.data
        });

        return event.data;
    };

    /**
     * Updates the view.
     * @public
     */
    Owl.prototype.update = function () {
        var i = 0,
            n = this._pipe.length,
            filter = $.proxy(function (p) {
                return this[p]
            }, this._invalidated),
            cache = {};

        while (i < n) {
            if (this._invalidated.all || $.grep(this._pipe[i].filter, filter).length > 0) {
                this._pipe[i].run(cache);
            }
            i++;
        }

        this._invalidated = {};
    };

    /**
     * Gets the width of the view.
     * @public
     * @param {Owl.Width} [dimension=Owl.Width.Default] - The dimension to return.
     * @returns {Number} - The width of the view in pixel.
     */
    Owl.prototype.width = function (dimension) {
        dimension = dimension || Owl.Width.Default;
        switch (dimension) {
            case Owl.Width.Inner:
            case Owl.Width.Outer:
                return this._width;
            default:
                return this._width - this.settings.stagePadding * 2 + this.settings.margin;
        }
    };

    /**
     * Refreshes the carousel primarily for adaptive purposes.
     * @public
     */
    Owl.prototype.refresh = function () {
        if (this._items.length === 0) {
            return false;
        }

        var start = new Date().getTime();

        this.trigger('refresh');

        this.setup();

        this.optionsLogic();

        // hide and show methods helps here to set a proper widths,
        // this prevents scrollbar to be calculated in stage width
        this.$stage.addClass('owl-refresh');

        this.update();

        this.$stage.removeClass('owl-refresh');

        this.state.orientation = window.orientation;

        this.watchVisibility();

        this.trigger('refreshed');
    };

    /**
     * Save internal event references and add event based functions.
     * @protected
     */
    Owl.prototype.eventsCall = function () {
        // Save events references
        this.e._onDragStart = $.proxy(function (e) {
            this.onDragStart(e);
        }, this);
        this.e._onDragMove = $.proxy(function (e) {
            this.onDragMove(e);
        }, this);
        this.e._onDragEnd = $.proxy(function (e) {
            this.onDragEnd(e);
        }, this);
        this.e._onResize = $.proxy(function (e) {
            this.onResize(e);
        }, this);
        this.e._transitionEnd = $.proxy(function (e) {
            this.transitionEnd(e);
        }, this);
        this.e._preventClick = $.proxy(function (e) {
            this.preventClick(e);
        }, this);
    };

    /**
     * Checks window `resize` event.
     * @protected
     */
    Owl.prototype.onThrottledResize = function () {
        window.clearTimeout(this.resizeTimer);
        this.resizeTimer = window.setTimeout(this.e._onResize, this.settings.responsiveRefreshRate);
    };

    /**
     * Checks window `resize` event.
     * @protected
     */
    Owl.prototype.onResize = function () {
        if (!this._items.length) {
            return false;
        }

        if (this._width === this.$element.width()) {
            return false;
        }

        if (this.trigger('resize').isDefaultPrevented()) {
            return false;
        }

        this._width = this.$element.width();

        this.invalidate('width');

        this.refresh();

        this.trigger('resized');
    };

    /**
     * Checks for touch/mouse drag event type and add run event handlers.
     * @protected
     */
    Owl.prototype.eventsRouter = function (event) {
        var type = event.type;

        if (type === "mousedown" || type === "touchstart") {
            this.onDragStart(event);
        } else if (type === "mousemove" || type === "touchmove") {
            this.onDragMove(event);
        } else if (type === "mouseup" || type === "touchend") {
            this.onDragEnd(event);
        } else if (type === "touchcancel") {
            this.onDragEnd(event);
        }
    };

    /**
     * Checks for touch/mouse drag options and add necessery event handlers.
     * @protected
     */
    Owl.prototype.internalEvents = function () {
        var isTouch = isTouchSupport(),
            isTouchIE = isTouchSupportIE();

        if (this.settings.mouseDrag) {
            this.$stage.on('mousedown', $.proxy(function (event) {
                this.eventsRouter(event)
            }, this));
            this.$stage.on('dragstart', function () {
                return false
            });
            this.$stage.get(0).onselectstart = function () {
                return false
            };
        } else {
            this.$element.addClass('owl-text-select-on');
        }

        if (this.settings.touchDrag && !isTouchIE) {
            this.$stage.on('touchstart touchcancel', $.proxy(function (event) {
                this.eventsRouter(event)
            }, this));
        }

        // catch transitionEnd event
        if (this.transitionEndVendor) {
            this.on(this.$stage.get(0), this.transitionEndVendor, this.e._transitionEnd, false);
        }

        // responsive
        if (this.settings.responsive !== false) {
            this.on(window, 'resize', $.proxy(this.onThrottledResize, this));
        }
    };

    /**
     * Handles touchstart/mousedown event.
     * @protected
     * @param {Event} event - The event arguments.
     */
    Owl.prototype.onDragStart = function (event) {
        var ev, isTouchEvent, pageX, pageY, animatedPos;

        ev = event.originalEvent || event || window.event;

        // prevent right click
        if (ev.which === 3 || this.state.isTouch) {
            return false;
        }

        if (ev.type === 'mousedown') {
            this.$stage.addClass('owl-grab');
        }

        this.trigger('drag');
        this.drag.startTime = new Date().getTime();
        this.speed(0);
        this.state.isTouch = true;
        this.state.isScrolling = false;
        this.state.isSwiping = false;
        this.drag.distance = 0;

        pageX = getTouches(ev).x;
        pageY = getTouches(ev).y;

        // get stage position left
        this.drag.offsetX = this.$stage.position().left;
        this.drag.offsetY = this.$stage.position().top;

        if (this.settings.rtl) {
            this.drag.offsetX = this.$stage.position().left + this.$stage.width() - this.width() +
                this.settings.margin;
        }

        // catch position // ie to fix
        if (this.state.inMotion && this.support3d) {
            animatedPos = this.getTransformProperty();
            this.drag.offsetX = animatedPos;
            this.animate(animatedPos);
            this.state.inMotion = true;
        } else if (this.state.inMotion && !this.support3d) {
            this.state.inMotion = false;
            return false;
        }

        this.drag.startX = pageX - this.drag.offsetX;
        this.drag.startY = pageY - this.drag.offsetY;

        this.drag.start = pageX - this.drag.startX;
        this.drag.targetEl = ev.target || ev.srcElement;
        this.drag.updatedX = this.drag.start;

        // to do/check
        // prevent links and images dragging;
        if (this.drag.targetEl.tagName === "IMG" || this.drag.targetEl.tagName === "A") {
            this.drag.targetEl.draggable = false;
        }

        $(document).on('mousemove.owl.dragEvents mouseup.owl.dragEvents touchmove.owl.dragEvents touchend.owl.dragEvents', $.proxy(function (event) {
            this.eventsRouter(event)
        }, this));
    };

    /**
     * Handles the touchmove/mousemove events.
     * @todo Simplify
     * @protected
     * @param {Event} event - The event arguments.
     */
    Owl.prototype.onDragMove = function (event) {
        var ev, isTouchEvent, pageX, pageY, minValue, maxValue, pull;

        if (!this.state.isTouch) {
            return;
        }

        if (this.state.isScrolling) {
            return;
        }

        ev = event.originalEvent || event || window.event;

        pageX = getTouches(ev).x;
        pageY = getTouches(ev).y;

        // Drag Direction
        this.drag.currentX = pageX - this.drag.startX;
        this.drag.currentY = pageY - this.drag.startY;
        this.drag.distance = this.drag.currentX - this.drag.offsetX;

        // Check move direction
        if (this.drag.distance < 0) {
            this.state.direction = this.settings.rtl ? 'right' : 'left';
        } else if (this.drag.distance > 0) {
            this.state.direction = this.settings.rtl ? 'left' : 'right';
        }
        // Loop
        if (this.settings.loop) {
            if (this.op(this.drag.currentX, '>', this.coordinates(this.minimum())) && this.state.direction === 'right') {
                this.drag.currentX -= (this.settings.center && this.coordinates(0)) - this.coordinates(this._items.length);
            } else if (this.op(this.drag.currentX, '<', this.coordinates(this.maximum())) && this.state.direction === 'left') {
                this.drag.currentX += (this.settings.center && this.coordinates(0)) - this.coordinates(this._items.length);
            }
        } else {
            // pull
            minValue = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum());
            maxValue = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum());
            pull = this.settings.pullDrag ? this.drag.distance / 5 : 0;
            this.drag.currentX = Math.max(Math.min(this.drag.currentX, minValue + pull), maxValue + pull);
        }

        // Lock browser if swiping horizontal

        if ((this.drag.distance > 8 || this.drag.distance < -8)) {
            if (ev.preventDefault !== undefined) {
                ev.preventDefault();
            } else {
                ev.returnValue = false;
            }
            this.state.isSwiping = true;
        }

        this.drag.updatedX = this.drag.currentX;

        // Lock Owl if scrolling
        if ((this.drag.currentY > 16 || this.drag.currentY < -16) && this.state.isSwiping === false) {
            this.state.isScrolling = true;
            this.drag.updatedX = this.drag.start;
        }

        this.animate(this.drag.updatedX);
    };

    /**
     * Handles the touchend/mouseup events.
     * @protected
     */
    Owl.prototype.onDragEnd = function (event) {
        var compareTimes, distanceAbs, closest;

        if (!this.state.isTouch) {
            return;
        }

        if (event.type === 'mouseup') {
            this.$stage.removeClass('owl-grab');
        }

        this.trigger('dragged');

        // prevent links and images dragging;
        this.drag.targetEl.removeAttribute("draggable");

        // remove drag event listeners

        this.state.isTouch = false;
        this.state.isScrolling = false;
        this.state.isSwiping = false;

        // to check
        if (this.drag.distance === 0 && this.state.inMotion !== true) {
            this.state.inMotion = false;
            return false;
        }

        // prevent clicks while scrolling

        this.drag.endTime = new Date().getTime();
        compareTimes = this.drag.endTime - this.drag.startTime;
        distanceAbs = Math.abs(this.drag.distance);

        // to test
        if (distanceAbs > 3 || compareTimes > 300) {
            this.removeClick(this.drag.targetEl);
        }

        closest = this.closest(this.drag.updatedX);

        this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed);
        this.current(closest);
        this.invalidate('position');
        this.update();

        // if pullDrag is off then fire transitionEnd event manually when stick
        // to border
        if (!this.settings.pullDrag && this.drag.updatedX === this.coordinates(closest)) {
            this.transitionEnd();
        }

        this.drag.distance = 0;

        $(document).off('.owl.dragEvents');
    };

    /**
     * Attaches `preventClick` to disable link while swipping.
     * @protected
     * @param {HTMLElement} [target] - The target of the `click` event.
     */
    Owl.prototype.removeClick = function (target) {
        this.drag.targetEl = target;
        $(target).on('click.preventClick', this.e._preventClick);
        // to make sure click is removed:
        window.setTimeout(function () {
            $(target).off('click.preventClick');
        }, 300);
    };

    /**
     * Suppresses click event.
     * @protected
     * @param {Event} ev - The event arguments.
     */
    Owl.prototype.preventClick = function (ev) {
        if (ev.preventDefault) {
            ev.preventDefault();
        } else {
            ev.returnValue = false;
        }
        if (ev.stopPropagation) {
            ev.stopPropagation();
        }
        $(ev.target).off('click.preventClick');
    };

    /**
     * Catches stage position while animate (only CSS3).
     * @protected
     * @returns
     */
    Owl.prototype.getTransformProperty = function () {
        var transform, matrix3d;

        transform = window.getComputedStyle(this.$stage.get(0), null).getPropertyValue(this.vendorName + 'transform');
        // var transform = this.$stage.css(this.vendorName + 'transform')
        transform = transform.replace(/matrix(3d)?\(|\)/g, '').split(',');
        matrix3d = transform.length === 16;

        return matrix3d !== true ? transform[4] : transform[12];
    };

    /**
     * Gets absolute position of the closest item for a coordinate.
     * @todo Setting `freeDrag` makes `closest` not reusable. See #165.
     * @protected
     * @param {Number} coordinate - The coordinate in pixel.
     * @return {Number} - The absolute position of the closest item.
     */
    Owl.prototype.closest = function (coordinate) {
        var position = -1,
            pull = 30,
            width = this.width(),
            coordinates = this.coordinates();

        if (!this.settings.freeDrag) {
            // check closest item
            $.each(coordinates, $.proxy(function (index, value) {
                if (coordinate > value - pull && coordinate < value + pull) {
                    position = index;
                } else if (this.op(coordinate, '<', value) &&
                    this.op(coordinate, '>', coordinates[index + 1] || value - width)) {
                    position = this.state.direction === 'left' ? index + 1 : index;
                }
                return position === -1;
            }, this));
        }

        if (!this.settings.loop) {
            // non loop boundries
            if (this.op(coordinate, '>', coordinates[this.minimum()])) {
                position = coordinate = this.minimum();
            } else if (this.op(coordinate, '<', coordinates[this.maximum()])) {
                position = coordinate = this.maximum();
            }
        }

        return position;
    };

    /**
     * Animates the stage.
     * @public
     * @param {Number} coordinate - The coordinate in pixels.
     */
    Owl.prototype.animate = function (coordinate) {
        this.trigger('translate');
        this.state.inMotion = this.speed() > 0;

        if (this.support3d) {
            this.$stage.css({
                transform: 'translate3d(' + coordinate + 'px' + ',0px, 0px)',
                transition: (this.speed() / 1000) + 's'
            });
        } else if (this.state.isTouch) {
            this.$stage.css({
                left: coordinate + 'px'
            });
        } else {
            this.$stage.animate({
                left: coordinate
            }, this.speed() / 1000, this.settings.fallbackEasing, $.proxy(function () {
                if (this.state.inMotion) {
                    this.transitionEnd();
                }
            }, this));
        }
    };

    /**
     * Sets the absolute position of the current item.
     * @public
     * @param {Number} [position] - The new absolute position or nothing to leave it unchanged.
     * @returns {Number} - The absolute position of the current item.
     */
    Owl.prototype.current = function (position) {
        if (position === undefined) {
            return this._current;
        }

        if (this._items.length === 0) {
            return undefined;
        }

        position = this.normalize(position);

        if (this._current !== position) {
            var event = this.trigger('change', {
                property: {
                    name: 'position',
                    value: position
                }
            });

            if (event.data !== undefined) {
                position = this.normalize(event.data);
            }

            this._current = position;

            this.invalidate('position');

            this.trigger('changed', {
                property: {
                    name: 'position',
                    value: this._current
                }
            });
        }

        return this._current;
    };

    /**
     * Invalidates the given part of the update routine.
     * @param {String} part - The part to invalidate.
     */
    Owl.prototype.invalidate = function (part) {
        this._invalidated[part] = true;
    }

    /**
     * Resets the absolute position of the current item.
     * @public
     * @param {Number} position - The absolute position of the new item.
     */
    Owl.prototype.reset = function (position) {
        position = this.normalize(position);

        if (position === undefined) {
            return;
        }

        this._speed = 0;
        this._current = position;

        this.suppress(['translate', 'translated']);

        this.animate(this.coordinates(position));

        this.release(['translate', 'translated']);
    };

    /**
     * Normalizes an absolute or a relative position for an item.
     * @public
     * @param {Number} position - The absolute or relative position to normalize.
     * @param {Boolean} [relative=false] - Whether the given position is relative or not.
     * @returns {Number} - The normalized position.
     */
    Owl.prototype.normalize = function (position, relative) {
        var n = (relative ? this._items.length : this._items.length + this._clones.length);

        if (!$.isNumeric(position) || n < 1) {
            return undefined;
        }

        if (this._clones.length) {
            position = ((position % n) + n) % n;
        } else {
            position = Math.max(this.minimum(relative), Math.min(this.maximum(relative), position));
        }

        return position;
    };

    /**
     * Converts an absolute position for an item into a relative position.
     * @public
     * @param {Number} position - The absolute position to convert.
     * @returns {Number} - The converted position.
     */
    Owl.prototype.relative = function (position) {
        position = this.normalize(position);
        position = position - this._clones.length / 2;
        return this.normalize(position, true);
    };

    /**
     * Gets the maximum position for an item.
     * @public
     * @param {Boolean} [relative=false] - Whether to return an absolute position or a relative position.
     * @returns {Number}
     */
    Owl.prototype.maximum = function (relative) {
        var maximum, width, i = 0,
            coordinate,
            settings = this.settings;

        if (relative) {
            return this._items.length - 1;
        }

        if (!settings.loop && settings.center) {
            maximum = this._items.length - 1;
        } else if (!settings.loop && !settings.center) {
            maximum = this._items.length - settings.items;
        } else if (settings.loop || settings.center) {
            maximum = this._items.length + settings.items;
        } else if (settings.autoWidth || settings.merge) {
            revert = settings.rtl ? 1 : -1;
            width = this.$stage.width() - this.$element.width();
            while (coordinate = this.coordinates(i)) {
                if (coordinate * revert >= width) {
                    break;
                }
                maximum = ++i;
            }
        } else {
            throw 'Can not detect maximum absolute position.'
        }

        return maximum;
    };

    /**
     * Gets the minimum position for an item.
     * @public
     * @param {Boolean} [relative=false] - Whether to return an absolute position or a relative position.
     * @returns {Number}
     */
    Owl.prototype.minimum = function (relative) {
        if (relative) {
            return 0;
        }

        return this._clones.length / 2;
    };

    /**
     * Gets an item at the specified relative position.
     * @public
     * @param {Number} [position] - The relative position of the item.
     * @return {jQuery|Array.<jQuery>} - The item at the given position or all items if no position was given.
     */
    Owl.prototype.items = function (position) {
        if (position === undefined) {
            return this._items.slice();
        }

        position = this.normalize(position, true);
        return this._items[position];
    };

    /**
     * Gets an item at the specified relative position.
     * @public
     * @param {Number} [position] - The relative position of the item.
     * @return {jQuery|Array.<jQuery>} - The item at the given position or all items if no position was given.
     */
    Owl.prototype.mergers = function (position) {
        if (position === undefined) {
            return this._mergers.slice();
        }

        position = this.normalize(position, true);
        return this._mergers[position];
    };

    /**
     * Gets the absolute positions of clones for an item.
     * @public
     * @param {Number} [position] - The relative position of the item.
     * @returns {Array.<Number>} - The absolute positions of clones for the item or all if no position was given.
     */
    Owl.prototype.clones = function (position) {
        var odd = this._clones.length / 2,
            even = odd + this._items.length,
            map = function (index) {
                return index % 2 === 0 ? even + index / 2 : odd - (index + 1) / 2
            };

        if (position === undefined) {
            return $.map(this._clones, function (v, i) {
                return map(i)
            });
        }

        return $.map(this._clones, function (v, i) {
            return v === position ? map(i) : null
        });
    };

    /**
     * Sets the current animation speed.
     * @public
     * @param {Number} [speed] - The animation speed in milliseconds or nothing to leave it unchanged.
     * @returns {Number} - The current animation speed in milliseconds.
     */
    Owl.prototype.speed = function (speed) {
        if (speed !== undefined) {
            this._speed = speed;
        }

        return this._speed;
    };

    /**
     * Gets the coordinate of an item.
     * @todo The name of this method is missleanding.
     * @public
     * @param {Number} position - The absolute position of the item within `minimum()` and `maximum()`.
     * @returns {Number|Array.<Number>} - The coordinate of the item in pixel or all coordinates.
     */
    Owl.prototype.coordinates = function (position) {
        var coordinate = null;

        if (position === undefined) {
            return $.map(this._coordinates, $.proxy(function (coordinate, index) {
                return this.coordinates(index);
            }, this));
        }

        if (this.settings.center) {
            coordinate = this._coordinates[position];
            coordinate += (this.width() - coordinate + (this._coordinates[position - 1] || 0)) / 2 * (this.settings.rtl ? -1 : 1);
        } else {
            coordinate = this._coordinates[position - 1] || 0;
        }

        return coordinate;
    };

    /**
     * Calculates the speed for a translation.
     * @protected
     * @param {Number} from - The absolute position of the start item.
     * @param {Number} to - The absolute position of the target item.
     * @param {Number} [factor=undefined] - The time factor in milliseconds.
     * @returns {Number} - The time in milliseconds for the translation.
     */
    Owl.prototype.duration = function (from, to, factor) {
        return Math.min(Math.max(Math.abs(to - from), 1), 6) * Math.abs((factor || this.settings.smartSpeed));
    };

    /**
     * Slides to the specified item.
     * @public
     * @param {Number} position - The position of the item.
     * @param {Number} [speed] - The time in milliseconds for the transition.
     */
    Owl.prototype.to = function (position, speed) {
        if (this.settings.loop) {
            var distance = position - this.relative(this.current()),
                revert = this.current(),
                before = this.current(),
                after = this.current() + distance,
                direction = before - after < 0 ? true : false,
                items = this._clones.length + this._items.length;

            if (after < this.settings.items && direction === false) {
                revert = before + this._items.length;
                this.reset(revert);
            } else if (after >= items - this.settings.items && direction === true) {
                revert = before - this._items.length;
                this.reset(revert);
            }
            window.clearTimeout(this.e._goToLoop);
            this.e._goToLoop = window.setTimeout($.proxy(function () {
                this.speed(this.duration(this.current(), revert + distance, speed));
                this.current(revert + distance);
                this.update();
            }, this), 30);
        } else {
            this.speed(this.duration(this.current(), position, speed));
            this.current(position);
            this.update();
        }
    };

    /**
     * Slides to the next item.
     * @public
     * @param {Number} [speed] - The time in milliseconds for the transition.
     */
    Owl.prototype.next = function (speed) {
        speed = speed || false;
        this.to(this.relative(this.current()) + 1, speed);
    };

    /**
     * Slides to the previous item.
     * @public
     * @param {Number} [speed] - The time in milliseconds for the transition.
     */
    Owl.prototype.prev = function (speed) {
        speed = speed || false;
        this.to(this.relative(this.current()) - 1, speed);
    };

    /**
     * Handles the end of an animation.
     * @protected
     * @param {Event} event - The event arguments.
     */
    Owl.prototype.transitionEnd = function (event) {

        // if css2 animation then event object is undefined
        if (event !== undefined) {
            event.stopPropagation();

            // Catch only owl-stage transitionEnd event
            if ((event.target || event.srcElement || event.originalTarget) !== this.$stage.get(0)) {
                return false;
            }
        }

        this.state.inMotion = false;
        this.trigger('translated');
    };

    /**
     * Gets viewport width.
     * @protected
     * @return {Number} - The width in pixel.
     */
    Owl.prototype.viewport = function () {
        var width;
        if (this.options.responsiveBaseElement !== window) {
            width = $(this.options.responsiveBaseElement).width();
        } else if (window.innerWidth) {
            width = window.innerWidth;
        } else if (document.documentElement && document.documentElement.clientWidth) {
            width = document.documentElement.clientWidth;
        } else {
            throw 'Can not detect viewport width.';
        }
        return width;
    };

    /**
     * Replaces the current content.
     * @public
     * @param {HTMLElement|jQuery|String} content - The new content.
     */
    Owl.prototype.replace = function (content) {
        this.$stage.empty();
        this._items = [];

        if (content) {
            content = (content instanceof jQuery) ? content : $(content);
        }

        if (this.settings.nestedItemSelector) {
            content = content.find('.' + this.settings.nestedItemSelector);
        }

        content.filter(function () {
            return this.nodeType === 1;
        }).each($.proxy(function (index, item) {
            item = this.prepare(item);
            this.$stage.append(item);
            this._items.push(item);
            this._mergers.push(item.find('[data-merge]').andSelf('[data-merge]').attr('data-merge') * 1 || 1);
        }, this));

        this.reset($.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0);

        this.invalidate('items');
    };

    /**
     * Adds an item.
     * @todo Use `item` instead of `content` for the event arguments.
     * @public
     * @param {HTMLElement|jQuery|String} content - The item content to add.
     * @param {Number} [position] - The relative position at which to insert the item otherwise the item will be added to the end.
     */
    Owl.prototype.add = function (content, position) {
        position = position === undefined ? this._items.length : this.normalize(position, true);

        this.trigger('add', {
            content: content,
            position: position
        });

        if (this._items.length === 0 || position === this._items.length) {
            this.$stage.append(content);
            this._items.push(content);
            this._mergers.push(content.find('[data-merge]').andSelf('[data-merge]').attr('data-merge') * 1 || 1);
        } else {
            this._items[position].before(content);
            this._items.splice(position, 0, content);
            this._mergers.splice(position, 0, content.find('[data-merge]').andSelf('[data-merge]').attr('data-merge') * 1 || 1);
        }

        this.invalidate('items');

        this.trigger('added', {
            content: content,
            position: position
        });
    };

    /**
     * Removes an item by its position.
     * @todo Use `item` instead of `content` for the event arguments.
     * @public
     * @param {Number} position - The relative position of the item to remove.
     */
    Owl.prototype.remove = function (position) {
        position = this.normalize(position, true);

        if (position === undefined) {
            return;
        }

        this.trigger('remove', {
            content: this._items[position],
            position: position
        });

        this._items[position].remove();
        this._items.splice(position, 1);
        this._mergers.splice(position, 1);

        this.invalidate('items');

        this.trigger('removed', {
            content: null,
            position: position
        });
    };

    /**
     * Adds triggerable events.
     * @protected
     */
    Owl.prototype.addTriggerableEvents = function () {
        var handler = $.proxy(function (callback, event) {
            return $.proxy(function (e) {
                if (e.relatedTarget !== this) {
                    this.suppress([event]);
                    callback.apply(this, [].slice.call(arguments, 1));
                    this.release([event]);
                }
            }, this);
        }, this);

        $.each({
            'next': this.next,
            'prev': this.prev,
            'to': this.to,
            'destroy': this.destroy,
            'refresh': this.refresh,
            'replace': this.replace,
            'add': this.add,
            'remove': this.remove
        }, $.proxy(function (event, callback) {
            this.$element.on(event + '.owl.carousel', handler(callback, event + '.owl.carousel'));
        }, this));

    };

    /**
     * Watches the visibility of the carousel element.
     * @protected
     */
    Owl.prototype.watchVisibility = function () {

        // test on zepto
        if (!isElVisible(this.$element.get(0))) {
            this.$element.addClass('owl-hidden');
            window.clearInterval(this.e._checkVisibile);
            this.e._checkVisibile = window.setInterval($.proxy(checkVisible, this), 500);
        }

        function isElVisible(el) {
            return el.offsetWidth > 0 && el.offsetHeight > 0;
        }

        function checkVisible() {
            if (isElVisible(this.$element.get(0))) {
                this.$element.removeClass('owl-hidden');
                this.refresh();
                window.clearInterval(this.e._checkVisibile);
            }
        }
    };

    /**
     * Preloads images with auto width.
     * @protected
     * @todo Still to test
     */
    Owl.prototype.preloadAutoWidthImages = function (imgs) {
        var loaded, that, $el, img;

        loaded = 0;
        that = this;
        imgs.each(function (i, el) {
            $el = $(el);
            img = new Image();

            img.onload = function () {
                loaded++;
                $el.attr('src', img.src);
                $el.css('opacity', 1);
                if (loaded >= imgs.length) {
                    that.state.imagesLoaded = true;
                    that.initialize();
                }
            };

            img.src = $el.attr('src') || $el.attr('data-src') || $el.attr('data-src-retina');
        });
    };

    /**
     * Destroys the carousel.
     * @public
     */
    Owl.prototype.destroy = function () {

        if (this.$element.hasClass(this.settings.themeClass)) {
            this.$element.removeClass(this.settings.themeClass);
        }

        if (this.settings.responsive !== false) {
            $(window).off('resize.owl.carousel');
        }

        if (this.transitionEndVendor) {
            this.off(this.$stage.get(0), this.transitionEndVendor, this.e._transitionEnd);
        }

        for (var i in this._plugins) {
            this._plugins[i].destroy();
        }

        if (this.settings.mouseDrag || this.settings.touchDrag) {
            this.$stage.off('mousedown touchstart touchcancel');
            $(document).off('.owl.dragEvents');
            this.$stage.get(0).onselectstart = function () { };
            this.$stage.off('dragstart', function () {
                return false
            });
        }

        // remove event handlers in the ".owl.carousel" namespace
        this.$element.off('.owl');

        this.$stage.children('.cloned').remove();
        this.e = null;
        this.$element.removeData('owlCarousel');

        this.$stage.children().contents().unwrap();
        this.$stage.children().unwrap();
        this.$stage.unwrap();
    };

    /**
     * Operators to calculate right-to-left and left-to-right.
     * @protected
     * @param {Number} [a] - The left side operand.
     * @param {String} [o] - The operator.
     * @param {Number} [b] - The right side operand.
     */
    Owl.prototype.op = function (a, o, b) {
        var rtl = this.settings.rtl;
        switch (o) {
            case '<':
                return rtl ? a > b : a < b;
            case '>':
                return rtl ? a < b : a > b;
            case '>=':
                return rtl ? a <= b : a >= b;
            case '<=':
                return rtl ? a >= b : a <= b;
            default:
                break;
        }
    };

    /**
     * Attaches to an internal event.
     * @protected
     * @param {HTMLElement} element - The event source.
     * @param {String} event - The event name.
     * @param {Function} listener - The event handler to attach.
     * @param {Boolean} capture - Wether the event should be handled at the capturing phase or not.
     */
    Owl.prototype.on = function (element, event, listener, capture) {
        if (element.addEventListener) {
            element.addEventListener(event, listener, capture);
        } else if (element.attachEvent) {
            element.attachEvent('on' + event, listener);
        }
    };

    /**
     * Detaches from an internal event.
     * @protected
     * @param {HTMLElement} element - The event source.
     * @param {String} event - The event name.
     * @param {Function} listener - The attached event handler to detach.
     * @param {Boolean} capture - Wether the attached event handler was registered as a capturing listener or not.
     */
    Owl.prototype.off = function (element, event, listener, capture) {
        if (element.removeEventListener) {
            element.removeEventListener(event, listener, capture);
        } else if (element.detachEvent) {
            element.detachEvent('on' + event, listener);
        }
    };

    /**
     * Triggers an public event.
     * @protected
     * @param {String} name - The event name.
     * @param {*} [data=null] - The event data.
     * @param {String} [namespace=.owl.carousel] - The event namespace.
     * @returns {Event} - The event arguments.
     */
    Owl.prototype.trigger = function (name, data, namespace) {
        var status = {
            item: {
                count: this._items.length,
                index: this.current()
            }
        },
            handler = $.camelCase(
                $.grep(['on', name, namespace], function (v) {
                    return v
                })
                    .join('-').toLowerCase()
            ),
            event = $.Event(
                [name, 'owl', namespace || 'carousel'].join('.').toLowerCase(),
                $.extend({
                    relatedTarget: this
                }, status, data)
            );

        if (!this._supress[name]) {
            $.each(this._plugins, function (name, plugin) {
                if (plugin.onTrigger) {
                    plugin.onTrigger(event);
                }
            });

            this.$element.trigger(event);

            if (this.settings && typeof this.settings[handler] === 'function') {
                this.settings[handler].apply(this, event);
            }
        }

        return event;
    };

    /**
     * Suppresses events.
     * @protected
     * @param {Array.<String>} events - The events to suppress.
     */
    Owl.prototype.suppress = function (events) {
        $.each(events, $.proxy(function (index, event) {
            this._supress[event] = true;
        }, this));
    }

    /**
     * Releases suppressed events.
     * @protected
     * @param {Array.<String>} events - The events to release.
     */
    Owl.prototype.release = function (events) {
        $.each(events, $.proxy(function (index, event) {
            delete this._supress[event];
        }, this));
    }

    /**
     * Checks the availability of some browser features.
     * @protected
     */
    Owl.prototype.browserSupport = function () {
        this.support3d = isPerspective();

        if (this.support3d) {
            this.transformVendor = isTransform();

            // take transitionend event name by detecting transition
            var endVendors = ['transitionend', 'webkitTransitionEnd', 'transitionend', 'oTransitionEnd'];
            this.transitionEndVendor = endVendors[isTransition()];

            // take vendor name from transform name
            this.vendorName = this.transformVendor.replace(/Transform/i, '');
            this.vendorName = this.vendorName !== '' ? '-' + this.vendorName.toLowerCase() + '-' : '';
        }

        this.state.orientation = window.orientation;
    };

    /**
     * Get touch/drag coordinats.
     * @private
     * @param {event} - mousedown/touchstart event
     * @returns {object} - Contains X and Y of current mouse/touch position
     */

    function getTouches(event) {
        if (event.touches !== undefined) {
            return {
                x: event.touches[0].pageX,
                y: event.touches[0].pageY
            };
        }

        if (event.touches === undefined) {
            if (event.pageX !== undefined) {
                return {
                    x: event.pageX,
                    y: event.pageY
                };
            }

            if (event.pageX === undefined) {
                return {
                    x: event.clientX,
                    y: event.clientY
                };
            }
        }
    }

    /**
     * Checks for CSS support.
     * @private
     * @param {Array} array - The CSS properties to check for.
     * @returns {Array} - Contains the supported CSS property name and its index or `false`.
     */
    function isStyleSupported(array) {
        var p, s, fake = document.createElement('div'),
            list = array;
        for (p in list) {
            s = list[p];
            if (typeof fake.style[s] !== 'undefined') {
                fake = null;
                return [s, p];
            }
        }
        return [false];
    }

    /**
     * Checks for CSS transition support.
     * @private
     * @todo Realy bad design
     * @returns {Number}
     */
    function isTransition() {
        return isStyleSupported(['transition', 'WebkitTransition', 'MozTransition', 'OTransition'])[1];
    }

    /**
     * Checks for CSS transform support.
     * @private
     * @returns {String} The supported property name or false.
     */
    function isTransform() {
        return isStyleSupported(['transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform'])[0];
    }

    /**
     * Checks for CSS perspective support.
     * @private
     * @returns {String} The supported property name or false.
     */
    function isPerspective() {
        return isStyleSupported(['perspective', 'webkitPerspective', 'MozPerspective', 'OPerspective', 'MsPerspective'])[0];
    }

    /**
     * Checks wether touch is supported or not.
     * @private
     * @returns {Boolean}
     */
    function isTouchSupport() {
        return 'ontouchstart' in window || !!(navigator.msMaxTouchPoints);
    }

    /**
     * Checks wether touch is supported or not for IE.
     * @private
     * @returns {Boolean}
     */
    function isTouchSupportIE() {
        return window.navigator.msPointerEnabled;
    }

    /**
     * The jQuery Plugin for the Owl Carousel
     * @public
     */
    $.fn.owlCarousel = function (options) {
        return this.each(function () {
            if (!$(this).data('owlCarousel')) {
                $(this).data('owlCarousel', new Owl(this, options));
            }
        });
    };

    /**
     * The constructor for the jQuery Plugin
     * @public
     */
    $.fn.owlCarousel.Constructor = Owl;

})(window.Zepto || window.jQuery, window, document);

/**
 * Lazy Plugin
 * @version 2.0.0
 * @author Bartosz Wojciechowski
 * @license The MIT License (MIT)
 */
;
(function ($, window, document, undefined) {

    /**
     * Creates the lazy plugin.
     * @class The Lazy Plugin
     * @param {Owl} carousel - The Owl Carousel
     */
    var Lazy = function (carousel) {

        /**
         * Reference to the core.
         * @protected
         * @type {Owl}
         */
        this._core = carousel;

        /**
         * Already loaded items.
         * @protected
         * @type {Array.<jQuery>}
         */
        this._loaded = [];

        /**
         * Event handlers.
         * @protected
         * @type {Object}
         */
        this._handlers = {
            'initialized.owl.carousel change.owl.carousel': $.proxy(function (e) {
                if (!e.namespace) {
                    return;
                }

                if (!this._core.settings || !this._core.settings.lazyLoad) {
                    return;
                }

                if ((e.property && e.property.name == 'position') || e.type == 'initialized') {
                    var settings = this._core.settings,
                        n = (settings.center && Math.ceil(settings.items / 2) || settings.items),
                        i = ((settings.center && n * -1) || 0),
                        position = ((e.property && e.property.value) || this._core.current()) + i,
                        clones = this._core.clones().length,
                        load = $.proxy(function (i, v) {
                            this.load(v)
                        }, this);

                    while (i++ < n) {
                        this.load(clones / 2 + this._core.relative(position));
                        clones && $.each(this._core.clones(this._core.relative(position++)), load);
                    }
                }
            }, this)
        };

        // set the default options
        this._core.options = $.extend({}, Lazy.Defaults, this._core.options);

        // register event handler
        this._core.$element.on(this._handlers);
    }

    /**
     * Default options.
     * @public
     */
    Lazy.Defaults = {
        lazyLoad: false
    }

    /**
     * Loads all resources of an item at the specified position.
     * @param {Number} position - The absolute position of the item.
     * @protected
     */
    Lazy.prototype.load = function (position) {
        var $item = this._core.$stage.children().eq(position),
            $elements = $item && $item.find('.owl-lazy');

        if (!$elements || $.inArray($item.get(0), this._loaded) > -1) {
            return;
        }

        $elements.each($.proxy(function (index, element) {
            var $element = $(element),
                image,
                url = (window.devicePixelRatio > 1 && $element.attr('data-src-retina')) || $element.attr('data-src');

            this._core.trigger('load', {
                element: $element,
                url: url
            }, 'lazy');

            if ($element.is('img')) {
                $element.one('load.owl.lazy', $.proxy(function () {
                    $element.css('opacity', 1);
                    this._core.trigger('loaded', {
                        element: $element,
                        url: url
                    }, 'lazy');
                }, this)).attr('src', url);
            } else {
                image = new Image();
                image.onload = $.proxy(function () {
                    $element.css({
                        'background-image': 'url(' + url + ')',
                        'opacity': '1'
                    });
                    this._core.trigger('loaded', {
                        element: $element,
                        url: url
                    }, 'lazy');
                }, this);
                image.src = url;
            }
        }, this));

        this._loaded.push($item.get(0));
    }

    /**
     * Destroys the plugin.
     * @public
     */
    Lazy.prototype.destroy = function () {
        var handler, property;

        for (handler in this.handlers) {
            this._core.$element.off(handler, this.handlers[handler]);
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] != 'function' && (this[property] = null);
        }
    }

    $.fn.owlCarousel.Constructor.Plugins.Lazy = Lazy;

})(window.Zepto || window.jQuery, window, document);

/**
 * AutoHeight Plugin
 * @version 2.0.0
 * @author Bartosz Wojciechowski
 * @license The MIT License (MIT)
 */
;
(function ($, window, document, undefined) {

    /**
     * Creates the auto height plugin.
     * @class The Auto Height Plugin
     * @param {Owl} carousel - The Owl Carousel
     */
    var AutoHeight = function (carousel) {
        /**
         * Reference to the core.
         * @protected
         * @type {Owl}
         */
        this._core = carousel;

        /**
         * All event handlers.
         * @protected
         * @type {Object}
         */
        this._handlers = {
            'initialized.owl.carousel': $.proxy(function () {
                if (this._core.settings.autoHeight) {
                    this.update();
                }
            }, this),
            'changed.owl.carousel': $.proxy(function (e) {
                if (this._core.settings.autoHeight && e.property.name == 'position') {
                    this.update();
                }
            }, this),
            'loaded.owl.lazy': $.proxy(function (e) {
                if (this._core.settings.autoHeight && e.element.closest('.' + this._core.settings.itemClass) ===
                    this._core.$stage.children().eq(this._core.current())) {
                    this.update();
                }
            }, this)
        };

        // set default options
        this._core.options = $.extend({}, AutoHeight.Defaults, this._core.options);

        // register event handlers
        this._core.$element.on(this._handlers);
    };

    /**
     * Default options.
     * @public
     */
    AutoHeight.Defaults = {
        autoHeight: false,
        autoHeightClass: 'owl-height'
    };

    /**
     * Updates the view.
     */
    AutoHeight.prototype.update = function () {
        this._core.$stage.parent()
            .height(this._core.$stage.children().eq(this._core.current()).height())
            .addClass(this._core.settings.autoHeightClass);
    };

    AutoHeight.prototype.destroy = function () {
        var handler, property;

        for (handler in this._handlers) {
            this._core.$element.off(handler, this._handlers[handler]);
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] != 'function' && (this[property] = null);
        }
    };

    $.fn.owlCarousel.Constructor.Plugins.AutoHeight = AutoHeight;

})(window.Zepto || window.jQuery, window, document);

/**
 * Video Plugin
 * @version 2.0.0
 * @author Bartosz Wojciechowski
 * @license The MIT License (MIT)
 */
;
(function ($, window, document, undefined) {

    /**
     * Creates the video plugin.
     * @class The Video Plugin
     * @param {Owl} carousel - The Owl Carousel
     */
    var Video = function (carousel) {
        /**
         * Reference to the core.
         * @protected
         * @type {Owl}
         */
        this._core = carousel;

        /**
         * Cache all video URLs.
         * @protected
         * @type {Object}
         */
        this._videos = {};

        /**
         * Current playing item.
         * @protected
         * @type {jQuery}
         */
        this._playing = null;

        /**
         * Whether this is in fullscreen or not.
         * @protected
         * @type {Boolean}
         */
        this._fullscreen = false;

        /**
         * All event handlers.
         * @protected
         * @type {Object}
         */
        this._handlers = {
            'resize.owl.carousel': $.proxy(function (e) {
                if (this._core.settings.video && !this.isInFullScreen()) {
                    e.preventDefault();
                }
            }, this),
            'refresh.owl.carousel changed.owl.carousel': $.proxy(function (e) {
                if (this._playing) {
                    this.stop();
                }
            }, this),
            'prepared.owl.carousel': $.proxy(function (e) {
                var $element = $(e.content).find('.owl-video');
                if ($element.length) {
                    $element.css('display', 'none');
                    this.fetch($element, $(e.content));
                }
            }, this)
        };

        // set default options
        this._core.options = $.extend({}, Video.Defaults, this._core.options);

        // register event handlers
        this._core.$element.on(this._handlers);

        this._core.$element.on('click.owl.video', '.owl-video-play-icon', $.proxy(function (e) {
            this.play(e);
        }, this));
    };

    /**
     * Default options.
     * @public
     */
    Video.Defaults = {
        video: false,
        videoHeight: false,
        videoWidth: false
    };

    /**
     * Gets the video ID and the type (YouTube/Vimeo only).
     * @protected
     * @param {jQuery} target - The target containing the video data.
     * @param {jQuery} item - The item containing the video.
     */
    Video.prototype.fetch = function (target, item) {

        var type = target.attr('data-vimeo-id') ? 'vimeo' : 'youtube',
            id = target.attr('data-vimeo-id') || target.attr('data-youtube-id'),
            width = target.attr('data-width') || this._core.settings.videoWidth,
            height = target.attr('data-height') || this._core.settings.videoHeight,
            url = target.attr('href');

        if (url) {
            id = url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

            if (id[3].indexOf('youtu') > -1) {
                type = 'youtube';
            } else if (id[3].indexOf('vimeo') > -1) {
                type = 'vimeo';
            } else {
                throw new Error('Video URL not supported.');
            }
            id = id[6];
        } else {
            throw new Error('Missing video URL.');
        }

        this._videos[url] = {
            type: type,
            id: id,
            width: width,
            height: height
        };

        item.attr('data-video', url);

        this.thumbnail(target, this._videos[url]);
    };

    /**
     * Creates video thumbnail.
     * @protected
     * @param {jQuery} target - The target containing the video data.
     * @param {Object} info - The video info object.
     * @see `fetch`
     */
    Video.prototype.thumbnail = function (target, video) {

        var tnLink,
            icon,
            path,
            dimensions = video.width && video.height ? 'style="width:' + video.width + 'px;height:' + video.height + 'px;"' : '',
            customTn = target.find('img'),
            srcType = 'src',
            lazyClass = '',
            settings = this._core.settings,
            create = function (path) {
                icon = '<div class="owl-video-play-icon"></div>';

                if (settings.lazyLoad) {
                    tnLink = '<div class="owl-video-tn ' + lazyClass + '" ' + srcType + '="' + path + '"></div>';
                } else {
                    tnLink = '<div class="owl-video-tn" style="opacity:1;background-image:url(' + path + ')"></div>';
                }
                target.after(tnLink);
                target.after(icon);
            };

        // wrap video content into owl-video-wrapper div
        target.wrap('<div class="owl-video-wrapper"' + dimensions + '></div>');

        if (this._core.settings.lazyLoad) {
            srcType = 'data-src';
            lazyClass = 'owl-lazy';
        }

        // custom thumbnail
        if (customTn.length) {
            create(customTn.attr(srcType));
            customTn.remove();
            return false;
        }

        if (video.type === 'youtube') {
            path = "http://img.youtube.com/vi/" + video.id + "/hqdefault.jpg";
            create(path);
        } else if (video.type === 'vimeo') {
            $.ajax({
                type: 'GET',
                url: 'http://vimeo.com/api/v2/video/' + video.id + '.json',
                jsonp: 'callback',
                dataType: 'jsonp',
                success: function (data) {
                    path = data[0].thumbnail_large;
                    create(path);
                }
            });
        }
    };

    /**
     * Stops the current video.
     * @public
     */
    Video.prototype.stop = function () {
        this._core.trigger('stop', null, 'video');
        this._playing.find('.owl-video-frame').remove();
        this._playing.removeClass('owl-video-playing');
        this._playing = null;
    };

    /**
     * Starts the current video.
     * @public
     * @param {Event} ev - The event arguments.
     */
    Video.prototype.play = function (ev) {
        this._core.trigger('play', null, 'video');

        if (this._playing) {
            this.stop();
        }

        var target = $(ev.target || ev.srcElement),
            item = target.closest('.' + this._core.settings.itemClass),
            video = this._videos[item.attr('data-video')],
            width = video.width || '100%',
            height = video.height || this._core.$stage.height(),
            html, wrap;

        if (video.type === 'youtube') {
            html = '<iframe width="' + width + '" height="' + height + '" src="http://www.youtube.com/embed/' +
                video.id + '?autoplay=1&v=' + video.id + '" frameborder="0" allowfullscreen></iframe>';
        } else if (video.type === 'vimeo') {
            html = '<iframe src="http://player.vimeo.com/video/' + video.id + '?autoplay=1" width="' + width +
                '" height="' + height +
                '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
        }

        item.addClass('owl-video-playing');
        this._playing = item;

        wrap = $('<div style="height:' + height + 'px; width:' + width + 'px" class="owl-video-frame">' +
            html + '</div>');
        target.after(wrap);
    };

    /**
     * Checks whether an video is currently in full screen mode or not.
     * @todo Bad style because looks like a readonly method but changes members.
     * @protected
     * @returns {Boolean}
     */
    Video.prototype.isInFullScreen = function () {

        // if Vimeo Fullscreen mode
        var element = document.fullscreenElement || document.mozFullScreenElement ||
            document.webkitFullscreenElement;

        if (element && $(element).parent().hasClass('owl-video-frame')) {
            this._core.speed(0);
            this._fullscreen = true;
        }

        if (element && this._fullscreen && this._playing) {
            return false;
        }

        // comming back from fullscreen
        if (this._fullscreen) {
            this._fullscreen = false;
            return false;
        }

        // check full screen mode and window orientation
        if (this._playing) {
            if (this._core.state.orientation !== window.orientation) {
                this._core.state.orientation = window.orientation;
                return false;
            }
        }

        return true;
    };

    /**
     * Destroys the plugin.
     */
    Video.prototype.destroy = function () {
        var handler, property;

        this._core.$element.off('click.owl.video');

        for (handler in this._handlers) {
            this._core.$element.off(handler, this._handlers[handler]);
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] != 'function' && (this[property] = null);
        }
    };

    $.fn.owlCarousel.Constructor.Plugins.Video = Video;

})(window.Zepto || window.jQuery, window, document);

/**
 * Animate Plugin
 * @version 2.0.0
 * @author Bartosz Wojciechowski
 * @license The MIT License (MIT)
 */
;
(function ($, window, document, undefined) {

    /**
     * Creates the animate plugin.
     * @class The Navigation Plugin
     * @param {Owl} scope - The Owl Carousel
     */
    var Animate = function (scope) {
        this.core = scope;
        this.core.options = $.extend({}, Animate.Defaults, this.core.options);
        this.swapping = true;
        this.previous = undefined;
        this.next = undefined;

        this.handlers = {
            'change.owl.carousel': $.proxy(function (e) {
                if (e.property.name == 'position') {
                    this.previous = this.core.current();
                    this.next = e.property.value;
                }
            }, this),
            'drag.owl.carousel dragged.owl.carousel translated.owl.carousel': $.proxy(function (e) {
                this.swapping = e.type == 'translated';
            }, this),
            'translate.owl.carousel': $.proxy(function (e) {
                if (this.swapping && (this.core.options.animateOut || this.core.options.animateIn)) {
                    this.swap();
                }
            }, this)
        };

        this.core.$element.on(this.handlers);
    };

    /**
     * Default options.
     * @public
     */
    Animate.Defaults = {
        animateOut: false,
        animateIn: false
    };

    /**
     * Toggles the animation classes whenever an translations starts.
     * @protected
     * @returns {Boolean|undefined}
     */
    Animate.prototype.swap = function () {

        if (this.core.settings.items !== 1 || !this.core.support3d) {
            return;
        }

        this.core.speed(0);

        var left,
            clear = $.proxy(this.clear, this),
            previous = this.core.$stage.children().eq(this.previous),
            next = this.core.$stage.children().eq(this.next),
            incoming = this.core.settings.animateIn,
            outgoing = this.core.settings.animateOut;

        if (this.core.current() === this.previous) {
            return;
        }

        if (outgoing) {
            left = this.core.coordinates(this.previous) - this.core.coordinates(this.next);
            previous.css({
                'left': left + 'px'
            })
                .addClass('animated owl-animated-out')
                .addClass(outgoing)
                .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', clear);
        }

        if (incoming) {
            next.addClass('animated owl-animated-in')
                .addClass(incoming)
                .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', clear);
        }
    };

    Animate.prototype.clear = function (e) {
        $(e.target).css({
            'left': ''
        })
            .removeClass('animated owl-animated-out owl-animated-in')
            .removeClass(this.core.settings.animateIn)
            .removeClass(this.core.settings.animateOut);
        this.core.transitionEnd();
    }

    /**
     * Destroys the plugin.
     * @public
     */
    Animate.prototype.destroy = function () {
        var handler, property;

        for (handler in this.handlers) {
            this.core.$element.off(handler, this.handlers[handler]);
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] != 'function' && (this[property] = null);
        }
    };

    $.fn.owlCarousel.Constructor.Plugins.Animate = Animate;

})(window.Zepto || window.jQuery, window, document);

/**
 * Autoplay Plugin
 * @version 2.0.0
 * @author Bartosz Wojciechowski
 * @license The MIT License (MIT)
 */
;
(function ($, window, document, undefined) {

    /**
     * Creates the autoplay plugin.
     * @class The Autoplay Plugin
     * @param {Owl} scope - The Owl Carousel
     */
    var Autoplay = function (scope) {
        this.core = scope;
        this.core.options = $.extend({}, Autoplay.Defaults, this.core.options);

        this.handlers = {
            'translated.owl.carousel refreshed.owl.carousel': $.proxy(function () {
                this.autoplay();
            }, this),
            'play.owl.autoplay': $.proxy(function (e, t, s) {
                this.play(t, s);
            }, this),
            'stop.owl.autoplay': $.proxy(function () {
                this.stop();
            }, this),
            'mouseover.owl.autoplay': $.proxy(function () {
                if (this.core.settings.autoplayHoverPause) {
                    this.pause();
                }
            }, this),
            'mouseleave.owl.autoplay': $.proxy(function () {
                if (this.core.settings.autoplayHoverPause) {
                    this.autoplay();
                }
            }, this)
        };

        this.core.$element.on(this.handlers);
    };

    /**
     * Default options.
     * @public
     */
    Autoplay.Defaults = {
        autoplay: false,
        autoplayTimeout: 5000,
        autoplayHoverPause: false,
        autoplaySpeed: false
    };

    /**
     * @protected
     * @todo Must be documented.
     */
    Autoplay.prototype.autoplay = function () {
        if (this.core.settings.autoplay && !this.core.state.videoPlay) {
            window.clearInterval(this.interval);

            this.interval = window.setInterval($.proxy(function () {
                this.play();
            }, this), this.core.settings.autoplayTimeout);
        } else {
            window.clearInterval(this.interval);
        }
    };

    /**
     * Starts the autoplay.
     * @public
     * @param {Number} [timeout] - ...
     * @param {Number} [speed] - ...
     * @returns {Boolean|undefined} - ...
     * @todo Must be documented.
     */
    Autoplay.prototype.play = function (timeout, speed) {
        // if tab is inactive - doesnt work in <IE10
        if (document.hidden === true) {
            return;
        }

        if (this.core.state.isTouch || this.core.state.isScrolling ||
            this.core.state.isSwiping || this.core.state.inMotion) {
            return;
        }

        if (this.core.settings.autoplay === false) {
            window.clearInterval(this.interval);
            return;
        }

        this.core.next(this.core.settings.autoplaySpeed);
    };

    /**
     * Stops the autoplay.
     * @public
     */
    Autoplay.prototype.stop = function () {
        window.clearInterval(this.interval);
    };

    /**
     * Pauses the autoplay.
     * @public
     */
    Autoplay.prototype.pause = function () {
        window.clearInterval(this.interval);
    };

    /**
     * Destroys the plugin.
     */
    Autoplay.prototype.destroy = function () {
        var handler, property;

        window.clearInterval(this.interval);

        for (handler in this.handlers) {
            this.core.$element.off(handler, this.handlers[handler]);
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] != 'function' && (this[property] = null);
        }
    };

    $.fn.owlCarousel.Constructor.Plugins.autoplay = Autoplay;

})(window.Zepto || window.jQuery, window, document);

/**
 * Navigation Plugin
 * @version 2.0.0
 * @author Artus Kolanowski
 * @license The MIT License (MIT)
 */
;
(function ($, window, document, undefined) {
    'use strict';

    /**
     * Creates the navigation plugin.
     * @class The Navigation Plugin
     * @param {Owl} carousel - The Owl Carousel.
     */
    var Navigation = function (carousel) {
        /**
         * Reference to the core.
         * @protected
         * @type {Owl}
         */
        this._core = carousel;

        /**
         * Indicates whether the plugin is initialized or not.
         * @protected
         * @type {Boolean}
         */
        this._initialized = false;

        /**
         * The current paging indexes.
         * @protected
         * @type {Array}
         */
        this._pages = [];

        /**
         * All DOM elements of the user interface.
         * @protected
         * @type {Object}
         */
        this._controls = {};

        /**
         * Markup for an indicator.
         * @protected
         * @type {Array.<String>}
         */
        this._templates = [];

        /**
         * The carousel element.
         * @type {jQuery}
         */
        this.$element = this._core.$element;

        /**
         * Overridden methods of the carousel.
         * @protected
         * @type {Object}
         */
        this._overrides = {
            next: this._core.next,
            prev: this._core.prev,
            to: this._core.to
        };

        /**
         * All event handlers.
         * @protected
         * @type {Object}
         */
        this._handlers = {
            'prepared.owl.carousel': $.proxy(function (e) {
                if (this._core.settings.dotsData) {
                    this._templates.push($(e.content).find('[data-dot]').andSelf('[data-dot]').attr('data-dot'));
                }
            }, this),
            'add.owl.carousel': $.proxy(function (e) {
                if (this._core.settings.dotsData) {
                    this._templates.splice(e.position, 0, $(e.content).find('[data-dot]').andSelf('[data-dot]').attr('data-dot'));
                }
            }, this),
            'remove.owl.carousel prepared.owl.carousel': $.proxy(function (e) {
                if (this._core.settings.dotsData) {
                    this._templates.splice(e.position, 1);
                }
            }, this),
            'change.owl.carousel': $.proxy(function (e) {
                if (e.property.name == 'position') {
                    if (!this._core.state.revert && !this._core.settings.loop && this._core.settings.navRewind) {
                        var current = this._core.current(),
                            maximum = this._core.maximum(),
                            minimum = this._core.minimum();
                        e.data = e.property.value > maximum ?
                            current >= maximum ? minimum : maximum :
                            e.property.value < minimum ? maximum : e.property.value;
                    }
                }
            }, this),
            'changed.owl.carousel': $.proxy(function (e) {
                if (e.property.name == 'position') {
                    this.draw();
                }
            }, this),
            'refreshed.owl.carousel': $.proxy(function () {
                if (!this._initialized) {
                    this.initialize();
                    this._initialized = true;
                }
                this._core.trigger('refresh', null, 'navigation');
                this.update();
                this.draw();
                this._core.trigger('refreshed', null, 'navigation');
            }, this)
        };

        // set default options
        this._core.options = $.extend({}, Navigation.Defaults, this._core.options);

        // register event handlers
        this.$element.on(this._handlers);
    }

    /**
     * Default options.
     * @public
     * @todo Rename `slideBy` to `navBy`
     */
    Navigation.Defaults = {
        nav: false,
        navRewind: true,
        navText: ['prev', 'next'],
        navSpeed: false,
        navElement: 'div',
        navContainer: false,
        navContainerClass: 'owl-nav',
        navClass: ['owl-prev', 'owl-next'],
        slideBy: 1,
        dotClass: 'owl-dot',
        dotsClass: 'owl-dots',
        dots: true,
        dotsEach: false,
        dotData: false,
        dotsSpeed: false,
        dotsContainer: false,
        controlsClass: 'owl-controls'
    }

    /**
     * Initializes the layout of the plugin and extends the carousel.
     * @protected
     */
    Navigation.prototype.initialize = function () {
        var $container, override,
            options = this._core.settings;

        // create the indicator template
        if (!options.dotsData) {
            this._templates = [$('<div>')
                .addClass(options.dotClass)
                .append($('<span>'))
                .prop('outerHTML')
            ];
        }

        // create controls container if needed
        if (!options.navContainer || !options.dotsContainer) {
            this._controls.$container = $('<div>')
                .addClass(options.controlsClass)
                .appendTo(this.$element);
        }

        // create DOM structure for absolute navigation
        this._controls.$indicators = options.dotsContainer ? $(options.dotsContainer) :
            $('<div>').hide().addClass(options.dotsClass).appendTo(this._controls.$container);

        this._controls.$indicators.on('click', 'div', $.proxy(function (e) {
            var index = $(e.target).parent().is(this._controls.$indicators) ?
                $(e.target).index() : $(e.target).parent().index();

            e.preventDefault();

            this.to(index, options.dotsSpeed);
        }, this));

        // create DOM structure for relative navigation
        $container = options.navContainer ? $(options.navContainer) :
            $('<div>').addClass(options.navContainerClass).prependTo(this._controls.$container);

        this._controls.$next = $('<' + options.navElement + '>');
        this._controls.$previous = this._controls.$next.clone();

        this._controls.$previous
            .addClass(options.navClass[0])
            .html(options.navText[0])
            .hide()
            .prependTo($container)
            .on('click', $.proxy(function (e) {
                this.prev(options.navSpeed);
            }, this));
        this._controls.$next
            .addClass(options.navClass[1])
            .html(options.navText[1])
            .hide()
            .appendTo($container)
            .on('click', $.proxy(function (e) {
                this.next(options.navSpeed);
            }, this));

        // override public methods of the carousel
        for (override in this._overrides) {
            this._core[override] = $.proxy(this[override], this);
        }
    }

    /**
     * Destroys the plugin.
     * @protected
     */
    Navigation.prototype.destroy = function () {
        var handler, control, property, override;

        for (handler in this._handlers) {
            this.$element.off(handler, this._handlers[handler]);
        }
        for (control in this._controls) {
            this._controls[control].remove();
        }
        for (override in this.overides) {
            this._core[override] = this._overrides[override];
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] != 'function' && (this[property] = null);
        }
    }

    /**
     * Updates the internal state.
     * @protected
     */
    Navigation.prototype.update = function () {
        var i, j, k,
            options = this._core.settings,
            lower = this._core.clones().length / 2,
            upper = lower + this._core.items().length,
            size = options.center || options.autoWidth || options.dotData ?
                1 : options.dotsEach || options.items;

        if (options.slideBy !== 'page') {
            options.slideBy = Math.min(options.slideBy, options.items);
        }

        if (options.dots || options.slideBy == 'page') {
            this._pages = [];

            for (i = lower, j = 0, k = 0; i < upper; i++) {
                if (j >= size || j === 0) {
                    this._pages.push({
                        start: i - lower,
                        end: i - lower + size - 1
                    });
                    j = 0, ++k;
                }
                j += this._core.mergers(this._core.relative(i));
            }
        }
    }

    /**
     * Draws the user interface.
     * @todo The option `dotData` wont work.
     * @protected
     */
    Navigation.prototype.draw = function () {
        var difference, i, html = '',
            options = this._core.settings,
            $items = this._core.$stage.children(),
            index = this._core.relative(this._core.current());

        if (options.nav && !options.loop && !options.navRewind) {
            this._controls.$previous.toggleClass('disabled', index <= 0);
            this._controls.$next.toggleClass('disabled', index >= this._core.maximum());
        }

        this._controls.$previous.toggle(options.nav);
        this._controls.$next.toggle(options.nav);

        if (options.dots) {
            difference = this._pages.length - this._controls.$indicators.children().length;

            if (options.dotData && difference !== 0) {
                for (i = 0; i < this._controls.$indicators.children().length; i++) {
                    html += this._templates[this._core.relative(i)];
                }
                this._controls.$indicators.html(html);
            } else if (difference > 0) {
                html = new Array(difference + 1).join(this._templates[0]);
                this._controls.$indicators.append(html);
            } else if (difference < 0) {
                this._controls.$indicators.children().slice(difference).remove();
            }

            this._controls.$indicators.find('.active').removeClass('active');
            this._controls.$indicators.children().eq($.inArray(this.current(), this._pages)).addClass('active');
        }

        this._controls.$indicators.toggle(options.dots);
    }

    /**
     * Extends event data.
     * @protected
     * @param {Event} event - The event object which gets thrown.
     */
    Navigation.prototype.onTrigger = function (event) {
        var settings = this._core.settings;

        event.page = {
            index: $.inArray(this.current(), this._pages),
            count: this._pages.length,
            size: settings && (settings.center || settings.autoWidth || settings.dotData ?
                1 : settings.dotsEach || settings.items)
        };
    }

    /**
     * Gets the current page position of the carousel.
     * @protected
     * @returns {Number}
     */
    Navigation.prototype.current = function () {
        var index = this._core.relative(this._core.current());
        return $.grep(this._pages, function (o) {
            return o.start <= index && o.end >= index;
        }).pop();
    }

    /**
     * Gets the current succesor/predecessor position.
     * @protected
     * @returns {Number}
     */
    Navigation.prototype.getPosition = function (successor) {
        var position, length,
            options = this._core.settings;

        if (options.slideBy == 'page') {
            position = $.inArray(this.current(), this._pages);
            length = this._pages.length;
            successor ? ++position : --position;
            position = this._pages[((position % length) + length) % length].start;
        } else {
            position = this._core.relative(this._core.current());
            length = this._core.items().length;
            successor ? position += options.slideBy : position -= options.slideBy;
        }
        return position;
    }

    /**
     * Slides to the next item or page.
     * @public
     * @param {Number} [speed=false] - The time in milliseconds for the transition.
     */
    Navigation.prototype.next = function (speed) {
        $.proxy(this._overrides.to, this._core)(this.getPosition(true), speed);
    }

    /**
     * Slides to the previous item or page.
     * @public
     * @param {Number} [speed=false] - The time in milliseconds for the transition.
     */
    Navigation.prototype.prev = function (speed) {
        $.proxy(this._overrides.to, this._core)(this.getPosition(false), speed);
    }

    /**
     * Slides to the specified item or page.
     * @public
     * @param {Number} position - The position of the item or page.
     * @param {Number} [speed] - The time in milliseconds for the transition.
     * @param {Boolean} [standard=false] - Whether to use the standard behaviour or not.
     */
    Navigation.prototype.to = function (position, speed, standard) {
        var length;

        if (!standard) {
            length = this._pages.length;
            $.proxy(this._overrides.to, this._core)(this._pages[((position % length) + length) % length].start, speed);
        } else {
            $.proxy(this._overrides.to, this._core)(position, speed);
        }
    }

    $.fn.owlCarousel.Constructor.Plugins.Navigation = Navigation;

})(window.Zepto || window.jQuery, window, document);

/**
 * Hash Plugin
 * @version 2.0.0
 * @author Artus Kolanowski
 * @license The MIT License (MIT)
 */
;
(function ($, window, document, undefined) {
    'use strict';

    /**
     * Creates the hash plugin.
     * @class The Hash Plugin
     * @param {Owl} carousel - The Owl Carousel
     */
    var Hash = function (carousel) {
        /**
         * Reference to the core.
         * @protected
         * @type {Owl}
         */
        this._core = carousel;

        /**
         * Hash table for the hashes.
         * @protected
         * @type {Object}
         */
        this._hashes = {};

        /**
         * The carousel element.
         * @type {jQuery}
         */
        this.$element = this._core.$element;

        /**
         * All event handlers.
         * @protected
         * @type {Object}
         */
        this._handlers = {
            'initialized.owl.carousel': $.proxy(function () {
                if (this._core.settings.startPosition == 'URLHash') {
                    $(window).trigger('hashchange.owl.navigation');
                }
            }, this),
            'prepared.owl.carousel': $.proxy(function (e) {
                var hash = $(e.content).find('[data-hash]').andSelf('[data-hash]').attr('data-hash');
                this._hashes[hash] = e.content;
            }, this)
        };

        // set default options
        this._core.options = $.extend({}, Hash.Defaults, this._core.options);

        // register the event handlers
        this.$element.on(this._handlers);

        // register event listener for hash navigation
        $(window).on('hashchange.owl.navigation', $.proxy(function () {
            var hash = window.location.hash.substring(1),
                items = this._core.$stage.children(),
                position = this._hashes[hash] && items.index(this._hashes[hash]) || 0;

            if (!hash) {
                return false;
            }

            this._core.to(position, false, true);
        }, this));
    }

    /**
     * Default options.
     * @public
     */
    Hash.Defaults = {
        URLhashListener: false
    }

    /**
     * Destroys the plugin.
     * @public
     */
    Hash.prototype.destroy = function () {
        var handler, property;

        $(window).off('hashchange.owl.navigation');

        for (handler in this._handlers) {
            this._core.$element.off(handler, this._handlers[handler]);
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] != 'function' && (this[property] = null);
        }
    }

    $.fn.owlCarousel.Constructor.Plugins.Hash = Hash;

})(window.Zepto || window.jQuery, window, document);


//wow slider
// -----------------------------------------------------------------------------------
// http://wowslider.com/
// JavaScript Wow Slider is a free software that helps you easily generate delicious 
// slideshows with gorgeous transition effects, in a few clicks without writing a single line of code.
// Generated by WOW Slider
//
//***********************************************
// Obfuscated by Javascript Obfuscator
// http://javascript-source.com
//***********************************************
! function () {
    var t;
    window.ws_caption_fade = function (i, n, o, a) {
        var e = i.noDelay ? 0 : (i.duration / 2 - i.captionDuration / 3) / 2;
        0 > e && (e = 0), n.stop(1, 1).delay(e).fadeOut(i.captionDuration / 3), a && (t && clearTimeout(t), t = setTimeout(function () {
            n.stop(1, 1).html(a), n.fadeIn(i.captionDuration, function () {
                this.filters && this.style.removeAttribute("filter")
            })
        }, i.noDelay ? 0 : i.duration / 2 + e))
    }
}();
! function () {
    var t;
    window.ws_caption_move = function (i, e, a, o) {
        var n = jQuery,
            s = [{
                left1: "100%",
                top2: "100%"
            }, {
                left1: "80%",
                left2: "-50%"
            }, {
                top1: "-100%",
                top2: "100%",
                distance: .7,
                easing: "easeOutBack"
            }, {
                top1: "-80%",
                top2: "-80%",
                distance: .3,
                easing: "easeOutBack"
            }, {
                top1: "-80%",
                left2: "80%"
            }, {
                left1: "80%",
                left2: "80%"
            }];
        s = s[Math.floor(Math.random() * s.length)];
        var p = .5,
            c = "easeOutElastic1",
            f = i.noDelay ? 0 : i.duration / 2 - i.captionDuration / 3;
        0 > f && (f = 0), e.stop(1, 1).delay(f).fadeOut(i.captionDuration / 3), o && (t && clearTimeout(t), t = setTimeout(function () {
            function t(t) {
                var e = n(a[t]).css("opacity");
                n(a[t]).css({
                    visibility: "visible"
                }).css({
                    opacity: 0
                }).animate({
                    opacity: e
                }, i.captionDuration, "easeOutCirc").animate({
                    top: 0,
                    left: 0
                }, {
                    duration: i.captionDuration,
                    easing: s.easing || c,
                    queue: !1
                })
            }
            e.stop(1, 1).html(o);
            var a = e.find(">span,>div").get();
            n(a).css({
                position: "relative",
                visibility: "hidden"
            }), e.show();
            for (var f in s)
                if (/\%/.test(s[f])) {
                    s[f] = parseInt(s[f]) / 100;
                    var l = e.offset()[/left/.test(f) ? "left" : "top"],
                        u = /left/.test(f) ? "width" : "height";
                    s[f] *= s[f] < 0 ? l : i.$this[u]() - e[u]() - l
                }
            n(a[0]).css({
                left: (s.left1 || 0) + "px",
                top: (s.top1 || 0) + "px"
            }), n(a[1]).css({
                left: (s.left2 || 0) + "px",
                top: (s.top2 || 0) + "px"
            }), t(0), setTimeout(function () {
                t(1)
            }, i.captionDuration * (s.distance || p))
        }, i.noDelay ? 0 : i.duration / 2 + f))
    }
}();

function ws_caption_parallax(t, n, i, a, s, o) {
    var e = jQuery;
    n.parent().css({
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden"
    }), n.html(a).css("width", "100%").stop(1, 1), i.html(s).css("width", "100%").stop(1, 1),
        function (n, i, a, s, o, r) {
            function p(n, i) {
                return n.css(t.support.transform ? {
                    transform: "translate3d(" + i + "px,0px,0px)"
                } : {
                    marginLeft: i
                }).css("display", "inline-block")
            }
            var u = 15,
                c = t.$this.width();
            if (u *= c / 100, t.prevIdx == t.curIdx) p(n, 0).fadeIn(o / 3), p(e(">div,>span", n), 0);
            else {
                var d = e(">div", n),
                    f = e(">div", i),
                    w = e(">span", n),
                    l = e(">span", i),
                    h = u + c * (r ? -1 : 1),
                    v = u + c * (r ? 1 : -1),
                    g = (r ? -1 : 1) * u;
                p(n, h).show(), p(i, 0).show(), p(d, g), p(f, 0), p(w, 2 * g), p(l, 0), wowAnimate(function (t) {
                    t = e.easing.swing(t), p(n, (1 - t) * h), p(i, t * v)
                }, 0, 1, t.duration);
                var m = .8;
                wowAnimate(function (t) {
                    t *= m, p(w, 2 * (1 - t) * g), p(d, (1 - t) * g), p(l, -2 * t * g), p(f, t * -g)
                }, 0, 1, t.duration, function () {
                    wowAnimate(function (t) {
                        t = e.easing.easeOutCubic(1, t, 0, 1, 1, 1);
                        var n = 2 * (1 - m) * g,
                            i = (1 - m) * g,
                            a = -2 * m * g,
                            s = m * -g;
                        p(w, (1 - t) * n), p(d, (1 - t) * i), p(l, (1 - t) * a + -2 * t * g), p(f, (1 - t) * s + t * -g)
                    }, 0, 1, /Firefox/g.test(navigator.userAgent) ? 1500 : t.delay)
                })
            }
        }(n, i, a, s, t.captionDuration, o)
}

function ws_caption_slide(t, e, o, i) {
    function r(t, e) {
        var o, i = document.defaultView;
        if (i && i.getComputedStyle) {
            var r = i.getComputedStyle(t, "");
            r && (o = r.getPropertyValue(e))
        } else {
            var a = e.replace(/\-\w/g, function (t) {
                return t.charAt(1).toUpperCase()
            });
            o = t.currentStyle ? t.currentStyle[a] : t.style[a]
        }
        return o
    }

    function a(t, e, o) {
        for (var i = "padding-left|padding-right|border-left-width|border-right-width".split("|"), a = 0, n = 0; n < i.length; n++) a += parseFloat(r(t, i[n])) || 0;
        var s = parseFloat(r(t, "width")) || (t.offsetWidth || 0) - a;
        return e && (s += a), o && (s += (parseFloat(r(t, "margin-left")) || 0) + (parseFloat(r(t, "margin-right")) || 0)), s
    }

    function n(t, e, o) {
        for (var i = "padding-top|padding-bottom|border-top-width|border-bottom-width".split("|"), a = 0, n = 0; n < i.length; n++) a += parseFloat(r(t, i[n])) || 0;
        var s = parseFloat(r(t, "height")) || (t.offsetHeight || 0) - a;
        return e && (s += a), o && (s += (parseFloat(r(t, "margin-top")) || 0) + (parseFloat(r(t, "margin-bottom")) || 0)), s
    }

    function s(t, e) {
        var o = {
            position: 0,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
        };
        for (var i in o) o[i] = t.get(0).style[i];
        t.show();
        var s = {
            width: a(t.get(0), 1, 1),
            height: n(t.get(0), 1, 1),
            "float": t.css("float"),
            overflow: "hidden",
            opacity: 0
        };
        for (var i in o) s[i] = o[i] || r(t.get(0), i);
        var l = p("<div></div>").css({
            fontSize: "100%",
            background: "transparent",
            border: "none",
            margin: 0,
            padding: 0
        });
        t.wrap(l), l = t.parent(), "static" == t.css("position") ? (l.css({
            position: "relative"
        }), t.css({
            position: "relative"
        })) : (p.extend(s, {
            position: t.css("position"),
            zIndex: t.css("z-index")
        }), t.css({
            position: "absolute",
            top: 0,
            left: 0,
            right: "auto",
            bottom: "auto"
        })), l.css(s).show();
        var d = e.direction || "left",
            u = "up" == d || "down" == d ? "top" : "left",
            c = "up" == d || "left" == d,
            g = e.distance || ("top" == u ? t.outerHeight(!0) : t.outerWidth(!0));
        t.css(u, c ? isNaN(g) ? "-" + g : -g : g);
        var f = {};
        f[u] = (c ? "+=" : "-=") + g, l.animate({
            opacity: 1
        }, {
            duration: e.duration,
            easing: e.easing
        }), t.animate(f, {
            queue: !1,
            duration: e.duration,
            easing: e.easing,
            complete: function () {
                t.css(o), t.parent().replaceWith(t), e.complete && e.complete()
            }
        })
    }
    var p = jQuery;
    e.stop(1, 1).fadeOut(t.captionDuration / 3, function () {
        i && (e.html(i), s(e, {
            direction: "left",
            easing: "easeInOutExpo",
            complete: function () {
                e.get(0).filters && e.get(0).style.removeAttribute("filter")
            },
            duration: t.captionDuration
        }))
    })
} ! function () {
    var t, e = jQuery;
    e.extend(e.easing, {
        easeInQuad: function (t, e, i, o, n) {
            return o * (e /= n) * e + i
        },
        easeOutQuad: function (t, e, i, o, n) {
            return -o * (e /= n) * (e - 2) + i
        }
    }), window.ws_caption_traces = function (i, o, n, a) {
        function r(t) {
            var e, i = parseInt,
                t = t.replace(/\s\s*/g, "");
            if ("transparent" == t && (t = "rgba(255,255,255,0)"), e = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/.exec(t)) e = [i(e[1], 16), i(e[2], 16), i(e[3], 16)];
            else if (e = /^#([\da-fA-F])([\da-fA-F])([\da-fA-F])/.exec(t)) e = [17 * i(e[1], 16), 17 * i(e[2], 16), 17 * i(e[3], 16)];
            else if (e = /^rgba\(([\d]+),([\d]+),([\d]+),([\d]+|[\d]*.[\d]+)\)/.exec(t)) e = [+e[1], +e[2], +e[3], +e[4]];
            else {
                if (!(e = /^rgb\(([\d]+),([\d]+),([\d]+)\)/.exec(t))) throw Error(t + " is not supported by $.parseColor");
                e = [+e[1], +e[2], +e[3]]
            }
            return isNaN(e[3]) && (e[3] = 1), e.slice(0, 3 + !!u)
        }

        function s(t, e, i) {
            t = r(t), e = r(e);
            for (var o = [t], n = 0; i > n; n++) {
                var a = [Math.round(t[0] - (n + 1) * (t[0] - e[0]) / (i + 1)), Math.round(t[1] - (n + 1) * (t[1] - e[1]) / (i + 1)), Math.round(t[2] - (n + 1) * (t[2] - e[2]) / (i + 1))];
                4 == t.length && a.push(t[3] - (n + 1) * (t[3] - e[3]) / (i + 1)), o.push(a)
            }
            o.push(e);
            for (var n in o) o[n] = (4 == t.length ? "rgba(" : "rgb(") + o[n].join(",") + ")";
            return o
        }

        function d(t, i) {
            if (!t || !t.length) return t;
            var o = 3,
                n = s(t.css("background-color"), t.css("color"), o) || h,
                a = {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0
                },
                r = {};
            i.top ? (a.top = -i.top * t.innerHeight(), r.height = 100 / n.length + "%") : i.left && (a.position = "absolute", r.height = "100%", r.width = 100 / n.length + "%", i.left < 0 ? (a.left = -i.left * t.innerWidth(), r["float"] = "left") : (a.right = i.left * t.innerWidth(), r["float"] = "right"));
            var d = e('<i class="ws-colored-traces">').css(a);
            for (var f in n) e("<i>").css({
                display: "block",
                background: n[f]
            }).css(r).appendTo(d);
            return t.append(d)
        }

        function f(t) {
            return e(".ws-colored-traces", t).remove(), t
        }

        function l(t, o) {
            var n = {
                visibility: "visible"
            },
                a = {},
                r = {};
            o.top ? (n.top = o.top * i.$this.height(), n.height = Math.abs(o.top) * i.$this.height(), a.top = 0, r.height = t.height()) : o.left && (n.left = o.left * i.$this.width() * 2, r.left = 0, o.left < 0 ? (a.left = n.left / 2, n.width = i.$this.width(), r.width = t.width() + 2) : (n.width = t.width() + 2, a.left = 0, n.paddingLeft = i.$this.width(), r.paddingLeft = t.css("paddingLeft"))), d(t, o).css(n).animate(a, {
                duration: .8 * i.captionDuration,
                easing: "easeInQuad"
            }).animate(r, .8 * i.captionDuration, "easeOutQuad", function () {
                f(e(this)).css({
                    height: "",
                    width: "",
                    overflow: "",
                    top: "",
                    left: "",
                    paddingLeft: ""
                })
            })
        }
        var h = ["#fff", "#ccc", "#555", "#000"],
            c = [
                [{
                    top: -1
                }, {
                    left: 1
                }],
                [{
                    top: -1
                }, {
                    left: -1
                }],
                [{
                    left: -1
                }, {
                    left: 1
                }],
                [{
                    left: 1
                }, {
                    left: -1
                }]
            ][Math.floor(4 * Math.random())],
            u = function () {
                var t = e("<div>").css("backgroundColor", "rgba(100,255,20,.5)");
                return /rgba/g.test(t.css("backgroundColor"))
            }();
        o.parent().css({
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden"
        });
        var p = i.noDelay ? 0 : i.duration / 2 - i.captionDuration / 1.5;
        0 > p && (p = 0), o.stop(1, 1).delay(p).fadeOut(i.captionDuration / 3), a && (t && clearTimeout(t), t = setTimeout(function () {
            o.stop(1, 1).html(a);
            var t = o.find(">span,>div").get();
            e(t).css({
                position: "relative",
                visibility: "hidden",
                verticalAlign: "top",
                overflow: "hidden"
            }), o.show(), l(e(t[0]), c[0]), setTimeout(function () {
                l(e(t[1]), c[1])
            }, .3 * i.captionDuration)
        }, i.noDelay ? 0 : i.duration / 2 + p))
    }
}();

jQuery.fn.wowSlider = function (t) {
    function e(t) {
        return I.css({
            left: -t + "00%"
        })
    }

    function n(t) {
        return ((t || 0) + N) % N
    }

    function i(e) {
        if (window["ws_" + e]) {
            var n = new window["ws_" + e](t, $, O);
            n.name = "ws_" + e, B.push(n)
        }
    }

    function a(t, e) {
        J ? J.pause(t.curIndex, e) : e()
    }

    function o(t, e) {
        J ? J.play(t, 0, e) : e()
    }

    function s(t, e, i) {
        Z || (isNaN(t) && (t = Q(G, N)), t = n(t), G != t && (D ? D.load(t, function () {
            c(t, e, i)
        }) : c(t, e, i)))
    }

    function r(t) {
        for (var e = "", n = 0; n < t.length; n++) e += String.fromCharCode(t.charCodeAt(n) ^ 1 + (t.length - n) % 7);
        return e
    }

    function c(n, i, a) {
        if (!Z) {
            if (i) void 0 != a && (K = a ^ t.revers), e(n);
            else {
                if (Z) return;
                te = !1,
                    function (e, n, i) {
                        ee = Math.floor(Math.random() * B.length), k(B[ee]).trigger("effectStart", {
                            curIndex: e,
                            nextIndex: n,
                            cont: k("." + B[ee].name, A),
                            start: function () {
                                K = void 0 != i ? i ^ t.revers : !!(n > e) ^ t.revers ? 1 : 0, B[ee].go(n, e, K)
                            }
                        })
                    }(G, n, a), A.trigger(k.Event("go", {
                        index: n
                    }))
            }
            G = n, G != t.stopOn || --t.loop || (t.autoPlay = 0), t.onStep && t.onStep(n)
        }
    }

    function l() {
        A.find(".ws_effect").fadeOut(200), e(G).fadeIn(200).find("img").css({
            visibility: "visible"
        })
    }

    function u(t, e, n, i, a, o) {
        new f(t, e, n, i, a, o)
    }

    function f(e, n, i, a, o, s) {
        var r, c, l, u, f = 0,
            d = 0,
            p = 0;
        e[0] || (e = k(e)), e.on((n ? "mousedown " : "") + "touchstart", function (e) {
            var n = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
            2 == t.gestures && A.addClass("ws_grabbing"), f = 0, n ? (r = n.pageX, c = n.pageY, d = p = 1, a && (d = p = a(e))) : d = p = 0, e.originalEvent.touches || (e.preventDefault(), e.stopPropagation())
        }), k(document).on((n ? "mousemove " : "") + "touchmove", e, function (t) {
            if (d) {
                var e = t.originalEvent.touches ? t.originalEvent.touches[0] : t;
                f = 1, l = e.pageX - r, u = e.pageY - c, i && i(t, l, u)
            }
        }), k(document).on((n ? "mouseup " : "") + "touchend", e, function (e) {
            2 == t.gestures && A.removeClass("ws_grabbing"), d && (f && o && o(e, l, u), !f && s && s(e), f && (e.preventDefault(), e.stopPropagation()), f = 0, d = 0)
        }), e.on("click", function (t) {
            p && (t.preventDefault(), t.stopPropagation()), p = 0
        })
    }

    function d(e, n, i) {
        if (fe.length && _(e), de.length && x(e), t.controlsThumb && t.controls && b(e), t.caption && M(e, n, i), Y) {
            var a = k("A", z.get(e)).get(0);
            a ? (Y.setAttribute("href", a.href), Y.setAttribute("target", a.target), Y.style.display = "block") : Y.style.display = "none"
        }
        t.responsive && E()
    }

    function p() {
        pe && (pe = 0, setTimeout(function () {
            A.trigger(k.Event("stop", {}))
        }, t.duration))
    }

    function h() {
        !pe && t.autoPlay && (pe = 1, A.trigger(k.Event("start", {})))
    }

    function m() {
        g(), p()
    }

    function v() {
        g(), t.autoPlay ? (ue = setTimeout(function () {
            he || s(void 0, void 0, 1)
        }, t.delay), h()) : p()
    }

    function g() {
        ue && clearTimeout(ue), ue = null
    }

    function w(t, e, n) {
        g(), t && t.preventDefault(), s(e, void 0, n), v(), Ee && Ce && Ce.play()
    }

    function b(e) {
        var n = t.controlsThumb,
            i = n[e + 1] || n[0],
            a = n[(e || n.length) - 1];
        be.find("img").attr("src", i), ye.find("img").attr("src", a)
    }

    function y() {
        function e(t) {
            if (!r) {
                clearTimeout(s);
                for (var e = .2, n = 0; 2 > n; n++) {
                    if (n) var c = a.find("> a"),
                        l = i ? a.width() : k(c.get(0)).outerWidth(!0) * c.length;
                    else var l = a.height();
                    var u = de[n ? "width" : "height"](),
                        f = u - l;
                    if (0 > f) {
                        var d, p, h = (t[n ? "pageX" : "pageY"] - de.offset()[n ? "left" : "top"]) / u;
                        if (o == h) return;
                        o = h;
                        var m = a.position()[n ? "left" : "top"];
                        if (a.css({
                            transition: "0ms linear",
                            transform: "translate3d(" + m.left + "px," + m.top + "px,0)"
                        }), a.stop(!0), _e > 0) {
                            if (h > e && 1 - e > h) return;
                            d = .5 > h ? 0 : f - 1, p = _e * Math.abs(m - d) / (Math.abs(h - .5) - e)
                        } else d = f * Math.min(Math.max((h - e) / (1 - 2 * e), 0), 1), p = -_e * l / 2;
                        a.animate(n ? {
                            left: d
                        } : {
                            top: d
                        }, p, _e > 0 ? "linear" : "easeOutCubic")
                    } else a.css(n ? "left" : "top", f / 2)
                }
            }
        }

        function n(t) {
            0 > t && (t = 0), D && D.loadTtip(t), k(v.get(x)).removeClass("ws_overbull"), k(v.get(t)).addClass("ws_overbull"), b.show();
            var e = {
                left: v.get(t).offsetLeft - b.width() / 2,
                "margin-top": v.get(t).offsetTop - v.get(0).offsetTop + "px",
                "margin-bottom": -v.get(t).offsetTop + v.get(v.length - 1).offsetTop + "px"
            },
                n = g.get(t),
                i = {
                    left: -n.offsetLeft + (k(n).outerWidth(!0) - k(n).outerWidth()) / 2
                };
            0 > x ? (b.css(e), y.css(i)) : (document.all || (e.opacity = 1), b.stop().animate(e, "fast"), y.stop().animate(i, "fast")), x = t
        }
        A.find(".ws_bullets a,.ws_thumbs a").click(function (t) {
            w(t, k(this).index())
        });
        var i;
        if (de.length) {
            de.hover(function () {
                xe = 1
            }, function () {
                xe = 0
            });
            var a = de.find(">div");
            de.css({
                overflow: "hidden"
            });
            var o, s, r;
            if (i = de.width() < A.width(), de.bind("mousemove mouseover", e), de.mouseout(function () {
                s = setTimeout(function () {
                    a.stop()
                }, 100)
            }), de.trigger("mousemove"), t.gestures) {
                var c, l, f, d, p, h;
                u(de, 2 == t.gestures, function (t, e, n) {
                    if (f > p || d > h) return !1;
                    var i = Math.min(Math.max(c + e, f - p), 0),
                        o = Math.min(Math.max(l + n, d - h), 0);
                    a.css("left", i), a.css("top", o)
                }, function () {
                    r = 1;
                    var t = a.find("> a");
                    return f = de.width(), d = de.height(), p = k(t.get(0)).outerWidth(!0) * t.length, h = a.height(), c = parseFloat(a.css("left")) || 0, l = parseFloat(a.css("top")) || 0, !0
                }, function () {
                    r = 0
                }, function () {
                    r = 0
                })
            }
            A.find(".ws_thumbs a").each(function (t, e) {
                u(e, 0, 0, function (t) {
                    return !!k(t.target).parents(".ws_thumbs").get(0)
                }, function () {
                    r = 1
                }, function (t) {
                    w(t, k(e).index())
                })
            })
        }
        if (fe.length) {
            var m = fe.find(">div"),
                v = k("a", fe),
                g = v.find("IMG");
            if (g.length) {
                var b = k('<div class="ws_bulframe"/>').appendTo(m),
                    y = k("<div/>").css({
                        width: g.length + 1 + "00%"
                    }).appendTo(k("<div/>").appendTo(b));
                g.appendTo(y), k("<span/>").appendTo(b);
                var x = -1;
                v.hover(function () {
                    n(k(this).index())
                });
                var _;
                m.hover(function () {
                    _ && (clearTimeout(_), _ = 0), n(x)
                }, function () {
                    v.removeClass("ws_overbull"), document.all ? _ || (_ = setTimeout(function () {
                        b.hide(), _ = 0
                    }, 400)) : b.stop().animate({
                        opacity: 0
                    }, {
                        duration: "fast",
                        complete: function () {
                            b.hide()
                        }
                    })
                }), m.click(function (t) {
                    w(t, k(t.target).index())
                })
            }
        }
    }

    function x(t) {
        k("A", de).each(function (e) {
            if (e == t) {
                var n = k(this);
                if (n.addClass("ws_selthumb"), !xe) {
                    var i, a = de.find(">div"),
                        o = n.position() || {};
                    i = a.position() || {};
                    for (var s = 0; 1 >= s; s++) {
                        var r = de[s ? "width" : "height"](),
                            c = a[s ? "width" : "height"](),
                            l = r - c;
                        0 > l ? a.stop(!0).animate(s ? {
                            left: -Math.max(Math.min(o.left, -i.left), o.left + n.outerWidth(!0) - de.width())
                        } : {
                            top: -Math.max(Math.min(o.top, 0), o.top + n.outerHeight(!0) - de.height())
                        }) : a.css(s ? "left" : "top", l / 2)
                    }
                }
            } else k(this).removeClass("ws_selthumb")
        })
    }

    function _(t) {
        k("A", fe).each(function (e) {
            e == t ? k(this).addClass("ws_selbull") : k(this).removeClass("ws_selbull")
        })
    }

    function T(t) {
        var e = z[t],
            n = k("img", e).attr("title"),
            i = k(e).data("descr");
        return n.replace(/\s+/g, "") || (n = ""), (n ? "<span>" + n + "</span>" : "") + (i ? "<br><div>" + i + "</div>" : "")
    }

    function M(e, n, i) {
        var a = T(e),
            o = T(n),
            s = t.captionEffect;
        (Se[k.type(s)] || Se[s] || Se.none)(k.extend({
            $this: A,
            curIdx: G,
            prevIdx: U,
            noDelay: i
        }, t), Te, Me, a, o, K)
    }

    function F() {
        t.autoPlay = !t.autoPlay, t.autoPlay ? (v(), je.removeClass("ws_play"), je.addClass("ws_pause"), J && J.start(G)) : (P.wsStop(), je.removeClass("ws_pause"), je.addClass("ws_play"))
    }

    function S() {
        return !!document[Ie.fullscreenElement]
    }

    function C() {
        /WOW Slider/g.test(j) || (S() ? document[Ie.exitFullscreen]() : (De = 1, A.wrap("<div class='ws_fs_wrapper'></div>").parent()[0][Ie.requestFullscreen]()))
    }

    function E() {
        var e = qe ? 4 : t.responsive,
            n = O.width() || t.width,
            i = k([$, L.find("img"), R.find("img")]);
        if (e > 0 && document.addEventListener && A.css("fontSize", Math.max(10 * Math.min(n / t.width || 1, 1), 4)), 2 == e) {
            var a = Math.max(n / t.width, 1) - 1;
            i.each(function () {
                k(this).css("marginTop", -t.height * a / 2)
            })
        }
        if (3 == e) {
            var o = window.innerHeight - (A.offset().top || 0),
                s = t.width / t.height,
                r = s > n / o;
            A.css("height", o), i.each(function () {
                k(this).css({
                    width: r ? "auto" : "100%",
                    height: r ? "100%" : "auto",
                    marginLeft: r ? (n - o * s) / 2 : 0,
                    marginTop: r ? 0 : (o - n / s) / 2
                })
            })
        }
        if (4 == e) {
            var c = window.innerWidth,
                l = window.innerHeight,
                s = (A.width() || t.width) / (A.height() || t.height);
            A.css({
                maxWidth: s > c / l ? "100%" : s * l,
                height: ""
            }), i.each(function () {
                k(this).css({
                    width: "100%",
                    marginLeft: 0,
                    marginTop: 0
                })
            })
        } else A.css({
            maxWidth: "",
            top: ""
        })
    }
    var k = jQuery,
        A = this,
        P = A.get(0);
    window.ws_basic = function (t, e, n) {
        var i = k(this);
        this.go = function (e) {
            n.find(".ws_list").css("transform", "translate3d(0,0,0)").stop(!0).animate({
                left: e ? -e + "00%" : /Safari/.test(navigator.userAgent) ? "0%" : 0
            }, t.duration, "easeInOutExpo", function () {
                i.trigger("effectEnd")
            })
        }
    }, t = k.extend({
        effect: "fade",
        prev: "",
        next: "",
        duration: 1e3,
        delay: 2e3,
        captionDuration: 1e3,
        captionEffect: "none",
        width: 960,
        height: 360,
        thumbRate: 1,
        gestures: 2,
        caption: !0,
        controls: !0,
        controlsThumb: !1,
        keyboardControl: !1,
        scrollControl: !1,
        autoPlay: !0,
        autoPlayVideo: !1,
        responsive: 1,
        support: jQuery.fn.wowSlider.support,
        stopOnHover: 0,
        preventCopy: 1
    }, t);
    var j = navigator.userAgent,
        O = k(".ws_images", A).css("overflow", "visible"),
        q = k("<div>").appendTo(O).css({
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden"
        }),
        I = O.find("ul").css("width", "100%").wrap("<div class='ws_list'></div>").parent().appendTo(q);
    k("<div>").css({
        position: "relative",
        width: "100%",
        "font-size": 0,
        "line-height": 0,
        "max-height": "100%",
        overflow: "hidden"
    }).append(O.find("li:first img:first").clone().css({
        width: "100%",
        visibility: "hidden"
    })).prependTo(O), I.css({
        position: "absolute",
        top: 0,
        height: "100%",
        transform: /Firefox/.test(j) ? "" : "translate3d(0,0,0)"
    });
    var D = t.images && new wowsliderPreloader(this, t),
        z = O.find("li"),
        N = z.length,
        W = (I.width() / I.find("li").width(), {
            position: "absolute",
            top: 0,
            height: "100%",
            overflow: "hidden"
        }),
        L = k("<div>").addClass("ws_swipe_left").css(W).prependTo(I),
        R = k("<div>").addClass("ws_swipe_right").css(W).appendTo(I);
    if (/MSIE/.test(j) || /Trident/.test(j) || /Safari/.test(j) || /Firefox/.test(j)) {
        var V = Math.pow(10, Math.ceil(Math.LOG10E * Math.log(N)));
        I.css({
            width: V + "00%"
        }), z.css({
            width: 100 / V + "%"
        }), L.css({
            width: 100 / V + "%",
            left: -100 / V + "%"
        }), R.css({
            width: 100 / V + "%",
            left: 100 * N / V + "%"
        })
    } else I.css({
        width: N + "00%",
        display: "table"
    }), z.css({
        display: "table-cell",
        "float": "none",
        width: "auto"
    }), L.css({
        width: 100 / N + "%",
        left: -100 / N + "%"
    }), R.css({
        width: 100 / N + "%",
        left: "100%"
    });
    var Q = t.onBeforeStep || function (t) {
        return t + 1
    };
    t.startSlide = n(isNaN(t.startSlide) ? Q(-1, N) : t.startSlide), D && D.load(t.startSlide, function () { }), e(t.startSlide);
    var X, Y;
    t.preventCopy && (X = k('<div class="ws_cover"><a href="#" style="display:none;position:absolute;left:0;top:0;width:100%;height:100%"></a></div>').css({
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        "z-index": 10,
        background: "#FFF",
        opacity: 0
    }).appendTo(O), Y = X.find("A").get(0)); {
        var $ = [];
        k(".ws_frame", A)
    }
    z.each(function () {
        for (var t = k(">img:first,>iframe:first,>iframe:first+img,>a:first,>div:first", this), e = k("<div></div>"), n = 0; n < this.childNodes.length;) this.childNodes[n] != t.get(0) && this.childNodes[n] != t.get(1) ? e.append(this.childNodes[n]) : n++;
        k(this).data("descr") || (e.text().replace(/\s+/g, "") ? k(this).data("descr", e.html().replace(/^\s+|\s+$/g, "")) : k(this).data("descr", "")), k(this).data("type", t[0].tagName);
        k(">iframe", this).css("opacity", 0);
        $[$.length] = k(">a>img", this).get(0) || k(">iframe+img", this).get(0) || k(">*", this).get(0)
    }), $ = k($), $.css("visibility", "visible"), L.append(k($[N - 1]).clone()), R.append(k($[0]).clone());
    var B = [];
    t.effect = t.effect.replace(/\s+/g, "").split(",");
    for (var H in t.effect) i(t.effect[H]);
    B.length || i("basic");
    var G = t.startSlide,
        U = G,
        J = !1,
        K = 1,
        Z = 0,
        te = !1;
    k(B).bind("effectStart", function (t, e) {
        Z++, a(e, function () {
            l(), e.cont && k(e.cont).stop().show().css("opacity", 1), e.start && e.start(), U = G, G = e.nextIndex, d(G, U, e.captionNoDelay)
        })
    }), k(B).bind("effectEnd", function (t, n) {
        e(G).stop(!0, !0).show(), setTimeout(function () {
            o(G, function () {
                Z--, v(), J && J.start(G)
            })
        }, n ? n.delay || 0 : 0)
    }), t.loop = t.loop || Number.MAX_VALUE, t.stopOn = n(t.stopOn);
    var ee = Math.floor(Math.random() * B.length);
    2 == t.gestures && A.addClass("ws_gestures");
    var ne = O,
        ie = '$#"';
    if (ie && (ie = r(ie))) {
        if (t.gestures) {
            var ae, oe, se, re, ce = 0,
                le = 10;
            u(O, 2 == t.gestures, function (e, n) {
                re = !!B[0].step, m(), I.stop(!0, !0), se && (te = !0, Z++, se = 0, re || l()), ce = n, n > ae && (n = ae), -ae > n && (n = -ae), re ? B[0].step(G, n / ae) : t.support.transform && t.support.transition ? I.css("transform", "translate3d(" + n + "px,0,0)") : I.css("left", oe + n)
            }, function (t) {
                var e = /ws_playpause|ws_prev|ws_next|ws_bullets/g.test(t.target.className) || k(t.target).parents(".ws_bullets").get(0),
                    n = me ? t.target == me[0] : 0;
                return e || n || J && J.playing() ? !1 : (se = 1, ae = O.width(), oe = parseFloat(-G * ae) || 0, !0)
            }, function (e, i) {
                se = 0;
                var a = O.width(),
                    o = n(G + (0 > i ? 1 : -1)),
                    s = a * i / Math.abs(i);
                Math.abs(ce) < le && (o = G, s = 0);
                var r = 200 + 200 * (a - Math.abs(i)) / a;
                Z--, k(B[0]).trigger("effectStart", {
                    curIndex: G,
                    nextIndex: o,
                    cont: re ? k(".ws_effect") : 0,
                    captionNoDelay: !0,
                    start: function () {
                        function e() {
                            t.support.transform && t.support.transition && I.css({
                                transition: "0ms",
                                transform: /Firefox/.test(j) ? "" : "translate3d(0,0,0)"
                            }), k(B[0]).trigger("effectEnd", {
                                swipe: !0
                            })
                        }

                        function n() {
                            re ? i > a || -a > i ? k(B[0]).trigger("effectEnd") : wowAnimate(function (t) {
                                var e = i + (a * (i > 0 ? 1 : -1) - i) * t;
                                B[0].step(U, e / a)
                            }, 0, 1, r, function () {
                                k(B[0]).trigger("effectEnd")
                            }) : t.support.transform && t.support.transition ? (I.css({
                                transition: r + "ms ease-out",
                                transform: "translate3d(" + s + "px,0,0)"
                            }), setTimeout(e, r)) : I.animate({
                                left: oe + s
                            }, r, e)
                        }
                        te = !0, D ? D.load(o, n) : n()
                    }
                })
            }, function () {
                var t = k("A", z.get(G));
                t && t.click()
            })
        }
        var ue, fe = A.find(".ws_bullets"),
            de = A.find(".ws_thumbs"),
            pe = t.autoPlay,
            he = !1,
            me = r('8B"iucc9!jusv?+,unpuimggs)eji!"');
        me += r("uq}og<%vjwjvhhh?vfn`sosa8fhtviez8ckifo8dnir(wjxd=70t{9");
        var ve = ne || document.body;
        if (ie.length < 4 && (ie = ie.replace(/^\s+|\s+$/g, "")), ne = ie ? k("<div>") : 0, k(ne).css({
            position: "absolute",
            padding: "0 0 0 0"
        }).appendTo(ve), ne && document.all) {
            var ge = k("<iframe>");
            ge.css({
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                filter: "alpha(opacity=0)",
                opacity: .01
            }), ge.attr({
                src: "javascript:false",
                scrolling: "no",
                framespacing: 0,
                border: 0,
                frameBorder: "no"
            }), ne.append(ge)
        }
        k(ne).css({
            zIndex: 56,
            right: "15px",
            bottom: "15px"
        }).appendTo(ve), me += r("uhcrm>bwuh=majeis<dqwm:aikp.d`joi}9Csngi?!<"), me = ne ? k(me) : ne, me && me.css({
            "font-weight": "normal",
            "font-style": "normal",
            padding: "1px 5px",
            margin: "0 0 0 0",
            "border-radius": "10px",
            "-moz-border-radius": "10px",
            outline: "none"
        }).html(ie).bind("contextmenu", function () {
            return !1
        }).show().appendTo(ne || document.body).attr("target", "_blank");
        var we = k('<div class="ws_controls">').appendTo(O);
        if (fe[0] && fe.appendTo(we), t.controls) {
            var be = k('<a href="#" class="ws_next"><span>' + t.next + "<i></i><b></b></span></a>"),
                ye = k('<a href="#" class="ws_prev"><span>' + t.prev + "<i></i><b></b></span></a>");
            we.append(be, ye), be.bind("click", function (t) {
                w(t, G + 1, 1)
            }), ye.bind("click", function (t) {
                w(t, G - 1, 0)
            }), /iPhone/.test(navigator.platform) && (ye.get(0).addEventListener("touchend", function (t) {
                w(t, G - 1, 1)
            }, !1), be.get(0).addEventListener("touchend", function (t) {
                w(t, G + 1, 0)
            }, !1)), t.controlsThumb && (be.append('<img alt="" src="">'), ye.append('<img alt="" src="">'))
        }
        var xe, _e = t.thumbRate;
        if (t.caption) {
            var Te = k("<div class='ws-title' style='display:none'></div>"),
                Me = k("<div class='ws-title' style='display:none'></div>");
            k("<div class='ws-title-wrapper'>").append(Te, Me).appendTo(O), Te.bind("mouseover", function () {
                J && J.playing() || g()
            }), Te.bind("mouseout", function () {
                J && J.playing() || v()
            })
        }
        var Fe, Se = {
            none: function (t, e, n, i) {
                Fe && clearTimeout(Fe), Fe = setTimeout(function () {
                    e.html(i).show()
                }, t.noDelay ? 0 : t.duration / 2)
            }
        };
        Se[t.captionEffect] || (Se[t.captionEffect] = window["ws_caption_" + t.captionEffect]), (fe.length || de.length) && y(), d(G, U, !0), t.stopOnHover && (this.bind("mouseover", function () {
            J && J.playing() || g(), he = !0
        }), this.bind("mouseout", function () {
            J && J.playing() || v(), he = !1
        })), J && J.playing() || v();
        var Ce = A.find("audio").get(0),
            Ee = t.autoPlay;
        if (Ce) {
            if (k(Ce).insertAfter(A), window.Audio && Ce.canPlayType && Ce.canPlayType("audio/mp3")) Ce.loop = "loop", t.autoPlay && (Ce.autoplay = "autoplay", setTimeout(function () {
                Ce.play()
            }, 100));
            else {
                Ce = Ce.src;
                var ke = Ce.substring(0, Ce.length - /[^\\\/]+$/.exec(Ce)[0].length),
                    Ae = "wsSound" + Math.round(9999 * Math.random());
                k("<div>").appendTo(A).get(0).id = Ae;
                var Pe = "wsSL" + Math.round(9999 * Math.random());
                window[Pe] = {
                    onInit: function () { }
                }, swfobject.createSWF({
                    data: ke + "player_mp3_js.swf",
                    width: "1",
                    height: "1"
                }, {
                    allowScriptAccess: "always",
                    loop: !0,
                    FlashVars: "listener=" + Pe + "&loop=1&autoplay=" + (t.autoPlay ? 1 : 0) + "&mp3=" + Ce
                }, Ae), Ce = 0
            }
            A.bind("stop", function () {
                Ee = !1, Ce ? Ce.pause() : k(Ae).SetVariable("method:pause", "")
            }), A.bind("start", function () {
                Ce ? Ce.play() : k(Ae).SetVariable("method:play", "")
            })
        }
        P.wsStart = s, P.wsRestart = v, P.wsStop = m;
        var je = k('<a href="#" class="ws_playpause"><span><i></i><b></b></span></a>');
        if (t.playPause && (je.addClass(t.autoPlay ? "ws_pause" : "ws_play"), je.click(function () {
            return F(), !1
        }), we.append(je)), t.keyboardControl && k(document).on("keyup", function (t) {
            switch (t.which) {
                case 32:
                    F();
                    break;
                case 37:
                    w(t, G - 1, 0);
                    break;
                case 39:
                    w(t, G + 1, 1)
            }
        }), t.scrollControl && A.on("DOMMouseScroll mousewheel", function (t) {
            t.originalEvent.wheelDelta < 0 || t.originalEvent.detail > 0 ? w(null, G + 1, 1) : w(null, G - 1, 0)
        }), "function" == typeof wowsliderVideo) {
            var Oe = k('<div class="ws_video_btn"><div></div></div>').appendTo(O);
            J = new wowsliderVideo(A, t, l), "undefined" != typeof $f && (J.vimeo(!0), J.start(G)), window.onYouTubeIframeAPIReady = function () {
                J.youtube(!0), J.start(G)
            }, Oe.on("click touchend", function () {
                Z || J.play(G, 1)
            })
        }
        var qe = 0;
        if (t.fullScreen) {
            var Ie = function () {
                for (var t, e, n = [
                    ["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenchange"],
                    ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitfullscreenchange"],
                    ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitfullscreenchange"],
                    ["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozfullscreenchange"],
                    ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "MSFullscreenChange"]
                ], i = {}, a = 0, o = n.length; o > a; a++)
                    if (t = n[a], t && t[1] in document) {
                        for (a = 0, e = t.length; e > a; a++) i[n[0][a]] = t[a];
                        return i
                    }
                return !1
            }();
            if (Ie) {
                var De = 0;
                document.addEventListener(Ie.fullscreenchange, function () {
                    S() ? (qe = 1, E()) : (De && (De = 0, A.unwrap()), qe = 0, E()), B[0].step || l()
                }), k("<a href='#' class='ws_fullscreen'></a>").on("click", C).appendTo(O)
            }
        }
        return t.responsive && (k(E), k(window).on("load resize", E)), this
    }
}, jQuery.extend(jQuery.easing, {
    easeInOutExpo: function (t, e, n, i, a) {
        return 0 == e ? n : e == a ? n + i : (e /= a / 2) < 1 ? i / 2 * Math.pow(2, 10 * (e - 1)) + n : i / 2 * (-Math.pow(2, -10 * --e) + 2) + n
    },
    easeOutCirc: function (t, e, n, i, a) {
        return i * Math.sqrt(1 - (e = e / a - 1) * e) + n
    },
    easeOutCubic: function (t, e, n, i, a) {
        return i * ((e = e / a - 1) * e * e + 1) + n
    },
    easeOutElastic1: function (t, e, n, i, a) {
        var o = Math.PI / 2,
            s = 1.70158,
            r = 0,
            c = i;
        if (0 == e) return n;
        if (1 == (e /= a)) return n + i;
        if (r || (r = .3 * a), c < Math.abs(i)) {
            c = i;
            var s = r / 4
        } else var s = r / o * Math.asin(i / c);
        return c * Math.pow(2, -10 * e) * Math.sin((e * a - s) * o / r) + i + n
    },
    easeOutBack: function (t, e, n, i, a, o) {
        return void 0 == o && (o = 1.70158), i * ((e = e / a - 1) * e * ((o + 1) * e + o) + 1) + n
    }
}), jQuery.fn.wowSlider.support = {
    transform: function () {
        if (!window.getComputedStyle) return !1;
        var t = document.createElement("div");
        document.body.insertBefore(t, document.body.lastChild), t.style.transform = "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)";
        var e = window.getComputedStyle(t).getPropertyValue("transform");
        return t.parentNode.removeChild(t), void 0 !== e ? "none" !== e : !1
    }(),
    perspective: function () {
        for (var t = "perspectiveProperty perspective WebkitPerspective MozPerspective OPerspective MsPerspective".split(" "), e = 0; e < t.length; e++)
            if (void 0 !== document.body.style[t[e]]) return !!t[e];
        return !1
    }(),
    transition: function () {
        var t = document.body || document.documentElement,
            e = t.style;
        return void 0 !== e.transition || void 0 !== e.WebkitTransition || void 0 !== e.MozTransition || void 0 !== e.MsTransition || void 0 !== e.OTransition
    }()
},
    function (t) {
        function e(e, n, i, a, o, s, r) {
            function c(t) {
                function e(e) {
                    cancelAnimationFrame(e), t(1), r && r()
                }
                var n = (new Date).getTime() + o,
                    i = function () {
                        var o = (new Date).getTime() - n;
                        0 > o && (o = 0);
                        var s = a ? o / a : 1;
                        1 > s ? (t(s), requestAnimationFrame(i)) : e(1)
                    };
                return i(), {
                    stop: e
                }
            }

            function l(t, e, n) {
                return t + (e - t) * n
            }

            function u(e, n) {
                return "linear" == n ? e : "swing" == n ? t.easing[n] ? t.easing[n](e) : e : t.easing[n] ? t.easing[n](1, e, 0, 1, 1, 1) : e
            }

            function f(t, e, n, i) {
                if ("object" == typeof e) {
                    var a = {};
                    for (var o in e) a[o] = f(t, e[o], n[o], i);
                    return a
                }
                var s = ["px", "%", "in", "cm", "mm", "pt", "pc", "em", "ex", "ch", "rem", "vh", "vw", "vmin", "vmax", "deg", "rad", "grad", "turn"],
                    r = "";
                return "string" == typeof e ? r = e : "string" == typeof n && (r = n), r = function (t, e, n) {
                    for (var i in e)
                        if (t.indexOf(e[i]) > -1) return e[i];
                    return p[n] ? p[n] : ""
                }(r, s, t), e = parseFloat(e), n = parseFloat(n), l(e, n, i) + r
            }
            if ("undefined" != typeof e) {
                e.jquery || "function" == typeof e || (n = e.from, i = e.to, a = e.duration, o = e.delay, s = e.easing, r = e.callback, e = e.each || e.obj);
                var d = "num";
                if (e.jquery && (d = "obj"), "undefined" != typeof e && "undefined" != typeof n && "undefined" != typeof i) {
                    "function" == typeof o && (r = o, o = 0), "function" == typeof s && (r = s, s = 0), "string" == typeof o && (s = o, o = 0), a = a || 0, o = o || 0, s = s || 0, r = r || 0;
                    var p = {
                        opacity: 0,
                        top: "px",
                        left: "px",
                        right: "px",
                        bottom: "px",
                        width: "px",
                        height: "px",
                        translate: "px",
                        rotate: "deg",
                        rotateX: "deg",
                        rotateY: "deg",
                        scale: 0
                    },
                        h = c(function (t) {
                            if (t = u(t, s), "num" === d) {
                                var a = l(n, i, t);
                                e(a)
                            } else {
                                var a = {
                                    transform: ""
                                };
                                for (var o in n)
                                    if ("undefined" != typeof p[o]) {
                                        var r = f(o, n[o], i[o], t);
                                        switch (o) {
                                            case "translate":
                                                a.transform += " translate3d(" + r[0] + "," + r[1] + "," + r[2] + ")";
                                                break;
                                            case "rotate":
                                                a.transform += " rotate(" + r + ")";
                                                break;
                                            case "rotateX":
                                                a.transform += " rotateX(" + r + ")";
                                                break;
                                            case "rotateY":
                                                a.transform += " rotateY(" + r + ")";
                                                break;
                                            case "scale":
                                                a.transform += "object" == typeof r ? " scale(" + r[0] + ", " + r[1] + ")" : " scale(" + r + ")";
                                                break;
                                            default:
                                                a[o] = r
                                        }
                                    }
                                "" === a.transform && delete a.transform, e.css(a)
                            }
                        });
                    return h
                }
            }
        }
        window.wowAnimate = e
    }(jQuery), Date.now || (Date.now = function () {
        return (new Date).getTime()
    }),
    function () {
        "use strict";
        for (var t = ["webkit", "moz"], e = 0; e < t.length && !window.requestAnimationFrame; ++e) {
            var n = t[e];
            window.requestAnimationFrame = window[n + "RequestAnimationFrame"], window.cancelAnimationFrame = window[n + "CancelAnimationFrame"] || window[n + "CancelRequestAnimationFrame"]
        }
        if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
            var i = 0;
            window.requestAnimationFrame = function (t) {
                var e = Date.now(),
                    n = Math.max(i + 16, e);
                return setTimeout(function () {
                    t(i = n)
                }, n - e)
            }, window.cancelAnimationFrame = clearTimeout
        }
    }();




// extend wowslider for effect support
(function ($) {
    // amount of lates effects
    var effects = 10;

    // all effects list
    var allEfects = "turn|shift|cube_over|louvers|lines|carousel|dribbles|parallax|brick|collage|basic|basic_linear|blast|blinds|blur|book|bubbles|carousel_basic|cube|domino|fade|flip|fly|glass_parallax|kenburns|page|photo|rotate|seven|slices|squares|stack|stack_vertical|tv".split("|");

    var effectsPath = ('http://wowslider.com/') + 'images/effects/';

    // create effects buttons
    // @callback = function(effect)
    function createEffects(callback) {
        if ($('#effbuttons').length && !$("#effbuttons .effbutton").length) {
            var cont = $('#effbuttons');
            //wow.parent().append(cont);
            cont.html("<span class='effects-title'>Change effect: </span>");

            // prepare effects links
            var effectsLinks = '';
            for (var e = 0; e < effects; e++) {
                if (e < allEfects.length)
                    effectsLinks += '<a class="button effbutton" data-effect="' + allEfects[e] + '" href="#">' + allEfects[e].replace("_", " ") + '</a> ';
            }

            // all effects list
            var effectsMore = '';
            if (effects < allEfects.length) {
                for (var k = effects; k < allEfects.length; k++) {
                    var exist = 0;
                    for (var s = 0; s < effects.length; s++) {
                        if (effects[s] == allEfects[k]) {
                            exist = 1;
                            break;
                        }
                    }
                    if (!exist) {
                        effectsMore += '<li data-effect="' + allEfects[k] + '">' + allEfects[k].replace("_", " ") + '</li>';
                    }
                }
                effectsMore = '<a class="button effmore" href="#">More <span>^</span><ul>' + effectsMore + '</ul></a>';
            }

            cont.append(effectsLinks + effectsMore);

            // click on effect button event
            cont.on('click', '[data-effect]', function () {
                var curEffect = $(this).attr('data-effect');
                $.getScript(effectsPath + curEffect + ".js", function () {
                    callback(curEffect);
                });
                return false;
            });

            // fix firefox drag event
            cont.on('dragstart', '.effmore', function (e) {
                e.preventDefault();
            })
        }
    }

    function selectEffect(new_effect) {
        $("#effbuttons .checked").removeClass('checked');
        var curItem = $("#effbuttons [data-effect='" + new_effect + "']");
        curItem.addClass('checked');

        // add checked to More button
        if (curItem.parents('.effmore')[0]) {
            curItem.parents('.effmore').addClass('checked');
        }
    };


    function controlDeviceButtons(wow, callback) {
        // device buttons
        var sliderCont = wow.parent(),
            curResponsive = 1;

        function resizeWnd() {
            // apply after transition
            if (curResponsive > 1)
                sliderCont.css('width', '100%');

            $(window).resize();
        }

        $('#devices').on('click', 'a', function (e) {
            var thisClass = this.className;
            e.preventDefault();

            if (/laptop|tablet|mobile/g.test(thisClass)) {
                $('#devices').find('.laptop, .tablet, .mobile').removeClass('checked');

                if (curResponsive > 1) {
                    curResponsive = 1;
                    $('#devices').find('.boxed, .fullwidth, .fullscreen').removeClass('checked');
                    $('#devices .boxed').addClass('checked');
                }

                $('>div', sliderCont).css('height', '');

                if (/laptop/g.test(thisClass)) {
                    sliderCont.css('maxWidth', sliderCont.width()).animate({
                        maxWidth: curResponsive > 1 ? $(window).width() : 960
                    }, resizeWnd);
                } else if (/tablet/g.test(thisClass)) {
                    sliderCont.css('maxWidth', sliderCont.width()).animate({
                        maxWidth: 700
                    }, resizeWnd);
                } else if (/mobile/g.test(thisClass)) {
                    sliderCont.css('maxWidth', sliderCont.width()).animate({
                        maxWidth: 500
                    }, resizeWnd);
                }
                $(this).addClass('checked');
            } else {
                if (/boxed/g.test(thisClass)) {
                    curResponsive = 1;
                    sliderCont.css('maxWidth', '').removeClass('fullwidth');
                } else if (/fullwidth/g.test(thisClass)) {
                    sliderCont.css('maxWidth', 'none').addClass('fullwidth');
                    curResponsive = 2;
                } else if (/fullscreen/g.test(thisClass)) {
                    sliderCont.css('maxWidth', 'none');
                    $('#' + wow.attr('id') + ' .ws_fullscreen').click();
                    return;
                }
                $('#devices').find('.boxed, .fullwidth, .fullscreen').removeClass('checked');

                if (curResponsive > 1) {
                    $('#devices').find('.tablet, .mobile').removeClass('checked');
                    $('#devices .laptop').addClass('checked');
                    resizeWnd();
                }

                $(this).addClass('checked');
            }

            callback({
                responsive: curResponsive
            });
        });
    }


    var cSlide, bkpCont, wowInstance, firstInitBtns;

    // rewrite slider
    // window.wowReInitor = function (wow,options){
    var default_wowSlider = $.fn.wowSlider;
    var default_options;
    var newOptions;
    $.fn.wowSlider = function (options) {
        if (!default_options) {
            default_options = options;
        }
        var wow = $(this);
        if (!newOptions) {
            newOptions = $.extend({}, options);
        }
        // add current effect if no in effects list
        /*
        if (newOptions.effect && (effects.join("|").indexOf(newOptions.effect)<0))
               effects[effects.length] = newOptions.effect;
        */

        // add fullscreen api
        newOptions.fullScreen = true;

        // change sizes when click on device buttons
        if (!firstInitBtns) {
            firstInitBtns = 1;

            if (wow.attr('data-fullscreen')) {
                wow.parent().css('max-width', 'none');
            }

            if (wow.attr('data-no-devices')) {
                $('#devices').remove();
            } else {
                controlDeviceButtons(wow, function (newOpts) {
                    if (newOptions.responsive !== newOpts.responsive) {
                        newOptions.responsive = newOpts.responsive;
                        newOptions.forceStart = 0;
                        wowReInitor(wowInstance, newOptions);
                    }
                });

                if (newOptions.responsive == 2) {
                    $('#devices a.fullwidth').click();
                }
            }

            if (wow.attr('data-effects')) {
                $('#devices').remove();
                allEfects = wow.attr('data-effects').split("|");
            }
        }

        // get new effect script, then start
        $.getScript(effectsPath + newOptions.effect + ".js", function () {
            newOptions.support = default_wowSlider.support;

            // change duration in brick effect
            if (newOptions.effect == 'brick') newOptions.duration = 5500;
            else newOptions.duration = default_options.duration;

            // recreate html or init effects
            if (!bkpCont) { //first start
                bkpCont = $(document.createElement("div")).append(wow.clone()).html();

                createEffects(function (eff) {
                    newOptions.effect = eff;
                    newOptions.forceStart = 1;
                    wowReInitor(wowInstance, newOptions);
                    //reinitSlider(new_o);
                });

                selectEffect(newOptions.effect);
            } else {
                wow.get(0).wsStop();
                wow = $(bkpCont).replaceAll(wow);
            }

            wowInstance = wow; // save instance for effect

            if (!newOptions.effect)
                newOptions.effect = (allEfects[Math.floor(Math.random() * allEfects.length)]) || "blinds";
            var new_opt = $.extend({
                startSlide: cSlide,
                onStep: function (num) {
                    cSlide = num
                }
            }, newOptions);

            // run slider
            //var result = wow.wowSlider(new_opt); 
            var result = default_wowSlider.apply(wow, [new_opt]);

            if (isNaN(cSlide))
                cSlide = 0;
            else if (newOptions.forceStart)
                wow.get(0).wsStart(cSlide + 1);

            selectEffect(new_opt.effect);

            return result;
        });
    }

    // for old compability
    window.wowReInitor = function (wow, options) {
        $(wow).wowSlider(options);
    };
})(jQuery);



//Footer Year Dynamic
function setCopyrightDate() {
    year = new Date().getFullYear();
    document.getElementById("currentYear").innerHTML = year;
} setCopyrightDate();




eval(function (e, t, a, i, l, r) { if (l = function (e) { return (e < 62 ? "" : l(parseInt(e / 62))) + ((e %= 62) > 35 ? String.fromCharCode(e + 29) : e.toString(36)) }, !"".replace(/^/, String)) { for (; a--;)r[l(a)] = i[a] || l(a); i = [function (e) { return r[e] }], l = function () { return "\\w+" }, a = 1 } for (; a--;)i[a] && (e = e.replace(new RegExp("\\b" + l(a) + "\\b", "g"), i[a])); return e }('!18(t,e){"4I 4J";1b i=t.5r=t.5r||t;1c(!i.3A){1b r,s,n,a,o,l=18(t){1b e,r=t.1t("."),s=i;1d(e=0;r.1f>e;e++)s[r[e]]=s=s[r[e]]||{};1a s},h=l("5p.5o"),u=1e-10,f=18(t){1b e,i=[],r=t.1f;1d(e=0;e!==r;i.24(t[e++]));1a i},p=18(){},19=18(){1b t=az.1A.a1,e=t.2h([]);1a 18(i){1a 1g!=i&&(i 2p 42||"4q"==1k i&&!!i.24&&t.2h(i)===e)}}(),c={},d=18(r,s,n,a){15.59=c[r]?c[r].59:[],c[r]=15,15.5C=1g,15.9D=n;1b o=[];15.6Q=18(h){1d(1b u,f,p,19,m=s.1f,g=m;--m>-1;)(u=c[s[m]]||1j d(s[m],[])).5C?(o[m]=u.5C,g--):h&&u.59.24(15);1c(0===g&&n)1d(f=("5p.5o."+r).1t("."),p=f.4K(),19=l(f.1I("."))[p]=15.5C=n.4i(n,o),a&&(i[p]=19,"18"==1k 3H&&3H.6R?3H((t.8U?t.8U+"/":"")+r.1t(".").4K(),[],18(){1a 19}):r===e&&"37"!=1k 2k&&2k.3n&&(2k.3n=19)),m=0;15.59.1f>m;m++)15.59[m].6Q()},15.6Q(!0)},m=t.3J=18(t,e,i,r){1a 1j d(t,e,i,r)},g=h.8z=18(t,e,i){1a e=e||18(){},m(t,[],18(){1a e},i),e};m.70=i;1b v=[0,0,1,1],x=[],y=g("2A.8A",18(t,e,i,r){15.7b=t,15.7C=i||0,15.7A=r||0,15.7a=e?v.4O(e):v},!0),T=y.8Y={},w=y.8y=18(t,e,i,r){1d(1b s,n,a,o,l=e.1t(","),u=l.1f,f=(i||"5G,6U,5A").1t(",");--u>-1;)1d(n=l[u],s=r?g("2A."+n,1g,!0):h.2A[n]||{},a=f.1f;--a>-1;)o=f[a],T[n+"."+o]=T[o+n]=s[o]=t.2C?t:t[o]||1j t};1d(n=y.1A,n.3T=!1,n.2C=18(t){1c(15.7b)1a 15.7a[0]=t,15.7b.4i(1g,15.7a);1b e=15.7C,i=15.7A,r=1===e?1-t:2===e?t:.5>t?2*t:2*(1-t);1a 1===i?r*=r:2===i?r*=r*r:3===i?r*=r*r*r:4===i&&(r*=r*r*r*r),1===e?1-r:2===e?r:.5>t?r/2:1-r/2},r=["9o","7T","bt","aW","aM,aP"],s=r.1f;--s>-1;)n=r[s]+",ba"+s,w(1j y(1g,1g,1,s),n,"6U",!0),w(1j y(1g,1g,2,s),n,"5G"+(0===s?",aH":"")),w(1j y(1g,1g,3,s),n,"5A");T.bz=h.2A.9o.5G,T.an=h.2A.7T.5A;1b b=g("8q.8p",18(t){15.4n={},15.7R=t||15});n=b.1A,n.9V=18(t,e,i,r,s){s=s||0;1b n,l,h=15.4n[t],u=0;1d(1g==h&&(15.4n[t]=h=[]),l=h.1f;--l>-1;)n=h[l],n.c===e&&n.s===i?h.3c(l,1):0===u&&s>n.2w&&(u=l+1);h.3c(u,0,{c:e,s:i,8Z:r,2w:s}),15!==a||o||a.3g()},n.bm=18(t,e){1b i,r=15.4n[t];1c(r)1d(i=r.1f;--i>-1;)1c(r[i].c===e)1a 2y r.3c(i,1)},n.8v=18(t){1b e,i,r,s=15.4n[t];1c(s)1d(e=s.1f,i=15.7R;--e>-1;)r=s[e],r&&(r.8Z?r.c.2h(r.s||i,{2f:t,2J:i}):r.c.2h(r.s||i))};1b P=t.aJ,O=t.aw,S=84.aN||18(){1a(1j 84).bs()},k=S();1d(r=["6a","bq","9U","o"],s=r.1f;--s>-1&&!P;)P=t[r[s]+"bp"],O=t[r[s]+"bk"]||t[r[s]+"a8"];g("6f",18(t,e){1b i,r,s,n,l,h=15,f=S(),19=e!==!1&&P,c=a5,d=33,m="6h",g=18(t){1b e,a,o=S()-k;o>c&&(f+=o-d),k+=o,h.3q=(k-f)/8l,e=h.3q-l,(!i||e>0||t===!0)&&(h.3C++,l+=e+(e>=n?.aF:n-e),a=!0),t!==!0&&(s=r(g)),a&&h.8v(m)};b.2h(h),h.3q=h.3C=0,h.6h=18(){g(!0)},h.7e=18(t,e){c=t||1/u,d=1i.aD(e,c,0)},h.67=18(){1g!=s&&(19&&O?O(s):ao(s),r=p,s=1g,h===a&&(o=!1))},h.3g=18(){1g!==s?h.67():h.3C>10&&(k=S()-c+5),r=0===i?p:19&&P?P:18(t){1a 6j(t,0|8l*(l-h.3q)+1)},h===a&&(o=!0),g(2)},h.6T=18(t){1a 2n.1f?(i=t,n=1/(i||60),l=15.3q+n,2y h.3g()):i},h.8j=18(t){1a 2n.1f?(h.67(),19=t,2y h.6T(i)):19},h.6T(t),6j(18(){19&&5>h.3C&&h.8j(!1)},aI)}),n=h.6f.1A=1j h.8q.8p,n.2V=h.6f;1b A=g("5N.93",18(t,e){1c(15.1w=e=e||{},15.1D=15.2i=t||0,15.2K=1P(e.4F)||0,15.1C=1,15.2l=e.1X===!0,15.1y=e.1y,15.2F=e.4y===!0,V){o||a.3g();1b i=15.1w.7l?j:V;i.1V(15,i.1p),15.1w.2W&&15.2W(!0)}});a=A.78=1j h.6f,n=A.1A,n.2z=n.1K=n.2u=n.1F=!1,n.1E=n.1p=0,n.1B=-1,n.1h=n.3i=n.3O=n.1r=n.26=1g,n.1F=!1;1b C=18(){o&&S()-k>8E&&a.3g(),6j(C,8E)};C(),n.7P=18(t,e){1a 1g!=t&&15.41(t,e),15.4y(!1).2W(!1)},n.7f=18(t,e){1a 1g!=t&&15.41(t,e),15.2W(!0)},n.aa=18(t,e){1a 1g!=t&&15.41(t,e),15.2W(!1)},n.41=18(t,e){1a 15.2R(1P(t),e!==!1)},n.ah=18(t,e){1a 15.4y(!1).2W(!1).2R(t?-15.2K:0,e!==!1,!0)},n.80=18(t,e){1a 1g!=t&&15.41(t||15.27(),e),15.4y(!0).2W(!1)},n.1G=18(){},n.4H=18(){1a 15.1p=15.1E=0,15.2u=15.1K=!1,15.1B=-1,(15.1K||!15.26)&&15.1H(!0),15},n.5c=18(){1b t,e=15.1r,i=15.1l;1a!e||!15.1K&&!15.1F&&e.5c()&&(t=e.4g())>=i&&i+15.27()/15.1C>t},n.1H=18(t,e){1a o||a.3g(),15.1K=!t,15.2l=15.5c(),e!==!0&&(t&&!15.26?15.1r.1V(15,15.1l-15.2K):!t&&15.26&&15.1r.40(15,!0)),!1},n.2s=18(){1a 15.1H(!1,!1)},n.3R=18(t,e){1a 15.2s(t,e),15},n.3m=18(t){1d(1b e=t?15:15.26;e;)e.2z=!0,e=e.26;1a 15},n.5R=18(t){1d(1b e=t.1f,i=t.4O();--e>-1;)"{5v}"===t[e]&&(i[e]=15);1a i},n.4j=18(t){1b e=15.1w;e[t].4i(e[t+"8h"]||e.5s||15,e[t+"8I"]||x)},n.ab=18(t,e,i,r){1c("bw"===(t||"").1u(0,2)){1b s=15.1w;1c(1===2n.1f)1a s[t];1g==e?4d s[t]:(s[t]=e,s[t+"8I"]=19(i)&&-1!==i.1I("").1m("{5v}")?15.5R(i):i,s[t+"8h"]=r),"4B"===t&&(15.3O=e)}1a 15},n.4F=18(t){1a 2n.1f?(15.1r.2r&&15.8M(15.1l+t-15.2K),15.2K=t,15):15.2K},n.2B=18(t){1a 2n.1f?(15.1D=15.2i=t,15.3m(!0),15.1r.2r&&15.1p>0&&15.1p<15.1D&&0!==t&&15.2R(15.1E*(t/15.1D),!0),15):(15.2z=!1,15.1D)},n.27=18(t){1a 15.2z=!1,2n.1f?15.2B(t):15.2i},n.3q=18(t,e){1a 2n.1f?(15.2z&&15.27(),15.2R(t>15.1D?15.1D:t,e)):15.1p},n.2R=18(t,e,i){1c(o||a.3g(),!2n.1f)1a 15.1E;1c(15.1r){1c(0>t&&!i&&(t+=15.27()),15.1r.2r){15.2z&&15.27();1b r=15.2i,s=15.1r;1c(t>r&&!i&&(t=r),15.1l=(15.1F?15.5g:s.1p)-(15.2F?r-t:t)/15.1C,s.2z||15.3m(!1),s.1r)1d(;s.1r;)s.1r.1p!==(s.1l+s.1E)/s.1C&&s.2R(s.1E,!0),s=s.1r}15.1K&&15.1H(!0,!1),(15.1E!==t||0===15.1D)&&(15.1G(t,e,!1),z.1f&&q())}1a 15},n.bv=n.br=18(t,e){1a 2n.1f?15.2R(15.2B()*t,e):15.1p/15.2B()},n.8M=18(t){1a 2n.1f?(t!==15.1l&&(15.1l=t,15.26&&15.26.4V&&15.26.1V(15,t-15.2K)),15):15.1l},n.aR=18(t){1a 15.1l+(0!=t?15.27():15.2B())/15.1C},n.6M=18(t){1c(!2n.1f)1a 15.1C;1c(t=t||u,15.1r&&15.1r.2r){1b e=15.5g,i=e||0===e?e:15.1r.2R();15.1l=i-(i-15.1l)*15.1C/t}1a 15.1C=t,15.3m(!1)},n.4y=18(t){1a 2n.1f?(t!=15.2F&&(15.2F=t,15.2R(15.1r&&!15.1r.2r?15.27()-15.1E:15.1E,!0)),15):15.2F},n.2W=18(t){1c(!2n.1f)1a 15.1F;1b e,i,r=15.1r;1a t!=15.1F&&r&&(o||t||a.3g(),e=r.4g(),i=e-15.5g,!t&&r.2r&&(15.1l+=i,15.3m(!1)),15.5g=t?e:1g,15.1F=t,15.2l=15.5c(),!t&&0!==i&&15.2u&&15.2B()&&15.1G(r.2r?15.1E:(e-15.1l)/15.1C,!0,!0)),15.1K&&!t&&15.1H(!0,!1),15};1b R=g("5N.95",18(t){A.2h(15,0,t),15.3N=15.2r=!0});n=R.1A=1j A,n.2V=R,n.3R().1K=!1,n.28=n.3i=n.4W=1g,n.4V=!1,n.1V=n.85=18(t,e){1b i,r;1c(t.1l=1P(e||0)+t.2K,t.1F&&15!==t.1r&&(t.5g=t.1l+(15.4g()-t.1l)/t.1C),t.26&&t.26.40(t,!0),t.26=t.1r=15,t.1K&&t.1H(!0,!0),i=15.3i,15.4V)1d(r=t.1l;i&&i.1l>r;)i=i.1n;1a i?(t.1h=i.1h,i.1h=t):(t.1h=15.28,15.28=t),t.1h?t.1h.1n=t:15.3i=t,t.1n=i,15.4W=t,15.1r&&15.3m(!0),15},n.40=18(t,e){1a t.26===15&&(e||t.1H(!1,!0),t.1n?t.1n.1h=t.1h:15.28===t&&(15.28=t.1h),t.1h?t.1h.1n=t.1n:15.3i===t&&(15.3i=t.1n),t.1h=t.1n=t.26=1g,t===15.4W&&(15.4W=15.3i),15.1r&&15.3m(!0)),15},n.1G=18(t,e,i){1b r,s=15.28;1d(15.1E=15.1p=15.1B=t;s;)r=s.1h,(s.2l||t>=s.1l&&!s.1F)&&(s.2F?s.1G((s.2z?s.27():s.2i)-(t-s.1l)*s.1C,e,i):s.1G((t-s.1l)*s.1C,e,i)),s=r},n.4g=18(){1a o||a.3g(),15.1E};1b M=g("3A",18(e,i,r){1c(A.2h(15,i,r),15.1G=M.1A.1G,1g==e)7g"7W 3V a 1g 2J.";15.2J=e="1O"!=1k e?e:M.48(e)||e;1b s,n,a,o=e.aQ||e.1f&&e!==t&&e[0]&&(e[0]===t||e[0].3S&&e[0].1v&&!e.3S),l=15.1w.5e;1c(15.7j=l=1g==l?B[M.7O]:"2E"==1k l?l>>0:B[l],(o||e 2p 42||e.24&&19(e))&&"2E"!=1k e[0])1d(15.2N=a=f(e),15.4a=[],15.3b=[],s=0;a.1f>s;s++)n=a[s],n?"1O"!=1k n?n.1f&&n!==t&&n[0]&&(n[0]===t||n[0].3S&&n[0].1v&&!n.3S)?(a.3c(s--,1),15.2N=a=a.4O(f(n))):(15.3b[s]=W(n,15,!1),1===l&&15.3b[s].1f>1&&G(n,15,1g,1,15.3b[s])):(n=a[s--]=M.48(n),"1O"==1k n&&a.3c(s+1,1)):a.3c(s--,1);1o 15.4a={},15.3b=W(e,15,!1),1===l&&15.3b.1f>1&&G(e,15,1g,1,15.3b);(15.1w.1X||0===i&&0===15.2K&&15.1w.1X!==!1)&&(15.1p=-u,15.1G(-15.2K))},!0),D=18(e){1a e&&e.1f&&e!==t&&e[0]&&(e[0]===t||e[0].3S&&e[0].1v&&!e.3S)},X=18(t,e){1b i,r={};1d(i 1x t)Y[i]||i 1x e&&"2Q"!==i&&"x"!==i&&"y"!==i&&"2D"!==i&&"3j"!==i&&"3M"!==i&&"4w"!==i||!(!N[i]||N[i]&&N[i].aX)||(r[i]=t[i],4d t[i]);t.57=r};n=M.1A=1j A,n.2V=M,n.3R().1K=!1,n.3x=0,n.1s=n.2N=n.3z=n.1Z=1g,n.56=n.3k=!1,M.4M="1.17.0",M.7B=n.2M=1j y(1g,1g,1,1),M.7O="2m",M.78=a,M.7y=9K,M.7e=18(t,e){a.7e(t,e)},M.48=t.$||t.7X||18(e){1b i=t.$||t.7X;1a i?(M.48=i,i(e)):"37"==1k 52?e:52.91?52.91(e):52.af("#"===e.1z(0)?e.1u(1):e)};1b z=[],F={},I=M.5f={9Y:19,9g:D,9Z:z},N=M.am={},E=I.a9={},L=0,Y=I.9C={4e:1,4F:1,5e:1,4E:1,6s:1,at:1,7l:1,5d:1,3o:1,4B:1,aY:1,b5:1,5h:1,b0:1,aZ:1,3Z:1,96:1,aS:1,by:1,bh:1,ac:1,69:1,aC:1,1X:1,5M:1,ar:1,1y:1,2W:1,4y:1,7n:1,2Z:1,5n:1,5s:1},B={3E:0,4A:1,2m:2,aK:3,au:4,av:5,"bo":1,"as":0},j=A.8n=1j R,V=A.ap=1j R,U=30,q=I.9P=18(){1b t,e=z.1f;1d(F={};--e>-1;)t=z[e],t&&t.3k!==!1&&(t.1G(t.3k[0],t.3k[1],!0),t.3k=!1);z.1f=0};V.1l=a.3q,j.1l=a.3C,V.2l=j.2l=!0,6j(q,1),A.8H=M.1G=18(){1b t,e,i;1c(z.1f&&q(),V.1G((a.3q-V.1l)*V.1C,!1,!1),j.1G((a.3C-j.1l)*j.1C,!1,!1),z.1f&&q(),a.3C>=U){U=a.3C+(3l(M.7y,10)||9K);1d(i 1x E){1d(e=E[i].3X,t=e.1f;--t>-1;)e[t].1K&&e.3c(t,1);0===e.1f&&4d E[i]}1c(i=V.28,(!i||i.1F)&&M.7y&&!j.28&&1===a.4n.6h.1f){1d(;i&&i.1F;)i=i.1h;i||a.67()}}},a.9V("6h",A.8H);1b W=18(t,e,i){1b r,s,n=t.6b;1c(E[n||(t.6b=n="t"+L++)]||(E[n]={2J:t,3X:[]}),e&&(r=E[n].3X,r[s=r.1f]=e,i))1d(;--s>-1;)r[s]===e&&r.3c(s,1);1a E[n].3X},Z=18(t,e,i,r){1b s,n,a=t.1w.5n;1a a&&(s=a(t,e,i,r)),a=M.5n,a&&(n=a(t,e,i,r)),s!==!1&&n!==!1},G=18(t,e,i,r,s){1b n,a,o,l;1c(1===r||r>=4){1d(l=s.1f,n=0;l>n;n++)1c((o=s[n])!==e)o.1K||o.2s(1g,t,e)&&(a=!0);1o 1c(5===r)8u;1a a}1b h,f=e.1l+u,p=[],19=0,c=0===e.1D;1d(n=s.1f;--n>-1;)(o=s[n])===e||o.1K||o.1F||(o.1r!==e.1r?(h=h||Q(e,0,c),0===Q(o,h,c)&&(p[19++]=o)):f>=o.1l&&o.1l+o.27()/o.1C>f&&((c||!o.2u)&&2e-10>=f-o.1l||(p[19++]=o)));1d(n=19;--n>-1;)1c(o=p[n],2===r&&o.2s(i,t,e)&&(a=!0),2!==r||!o.1s&&o.2u){1c(2!==r&&!Z(o,e))aV;o.1H(!1,!1)&&(a=!0)}1a a},Q=18(t,e,i){1d(1b r=t.1r,s=r.1C,n=t.1l;r.1r;){1c(n+=r.1l,s*=r.1C,r.1F)1a-1M;r=r.1r}1a n/=s,n>e?n-e:i&&n===e||!t.2u&&2*u>n-e?u:(n+=t.27()/t.1C/s)>e+u?0:n-e-u};n.7o=18(){1b t,e,i,r,s,n=15.1w,a=15.3z,o=15.1D,l=!!n.1X,h=n.4e;1c(n.3o){15.1Z&&(15.1Z.1G(-1,!0),15.1Z.3R()),s={};1d(r 1x n.3o)s[r]=n.3o[r];1c(s.5e=!1,s.1X=!0,s.2Z=l&&n.2Z!==!1,s.3o=s.4F=1g,15.1Z=M.4p(15.2J,0,s),l)1c(15.1p>0)15.1Z=1g;1o 1c(0!==o)1a}1o 1c(n.5d&&0!==o)1c(15.1Z)15.1Z.1G(-1,!0),15.1Z.3R(),15.1Z=1g;1o{0!==15.1p&&(l=!1),i={};1d(r 1x n)Y[r]&&"7n"!==r||(i[r]=n[r]);1c(i.5e=0,i.1y="82",i.2Z=l&&n.2Z!==!1,i.1X=l,15.1Z=M.4p(15.2J,0,i),l){1c(0===15.1p)1a}1o 15.1Z.7o(),15.1Z.1H(!1),15.1w.1X&&(15.1Z=1g)}1c(15.2M=h=h?h 2p y?h:"18"==1k h?1j y(h,n.69):T[h]||M.7B:M.7B,n.69 2p 42&&h.3y&&(15.2M=h.3y.4i(h,n.69)),15.7i=15.2M.7C,15.8r=15.2M.7A,15.1s=1g,15.2N)1d(t=15.2N.1f;--t>-1;)15.5m(15.2N[t],15.4a[t]={},15.3b[t],a?a[t]:1g)&&(e=!0);1o e=15.5m(15.2J,15.4a,15.3b,a);1c(e&&M.64("5S",15),a&&(15.1s||"18"!=1k 15.2J&&15.1H(!1,!1)),n.5d)1d(i=15.1s;i;)i.s+=i.c,i.c=-i.c,i=i.1h;15.3O=n.4B,15.2u=!0},n.5m=18(e,i,r,s){1b n,a,o,l,h,u;1c(1g==e)1a!1;F[e.6b]&&q(),15.1w.57||e.1v&&e!==t&&e.3S&&N.57&&15.1w.7n!==!1&&X(15.1w,e);1d(n 1x 15.1w){1c(u=15.1w[n],Y[n])u&&(u 2p 42||u.24&&19(u))&&-1!==u.1I("").1m("{5v}")&&(15.1w[n]=u=15.5R(u,15));1o 1c(N[n]&&(l=1j N[n]).72(e,15.1w[n],15)){1d(15.1s=h={1h:15.1s,t:l,p:"1Y",s:0,c:1,f:!0,n:n,5u:!0,2w:l.74},a=l.2P.1f;--a>-1;)i[l.2P[a]]=15.1s;(l.74||l.5S)&&(o=!0),(l.7x||l.9i)&&(15.56=!0)}1o 15.1s=i[n]=h={1h:15.1s,t:e,p:n,f:"18"==1k e[n],n:n,5u:!1,2w:0},h.s=h.f?e[n.1m("4Q")||"18"!=1k e["8P"+n.1u(3)]?n:"8P"+n.1u(3)]():1q(e[n]),h.c="1O"==1k u&&"="===u.1z(1)?3l(u.1z(0)+"1",10)*1P(u.1u(2)):1P(u)-h.s||0;h&&h.1h&&(h.1h.1n=h)}1a s&&15.2s(s,e)?15.5m(e,i,r,s):15.7j>1&&15.1s&&r.1f>1&&G(e,15,i,15.7j,r)?(15.2s(i,e),15.5m(e,i,r,s)):(15.1s&&(15.1w.2Z!==!1&&15.1D||15.1w.2Z&&!15.1D)&&(F[e.6b]=!0),o)},n.1G=18(t,e,i){1b r,s,n,a,o=15.1p,l=15.1D,h=15.1B;1c(t>=l)15.1E=15.1p=l,15.3x=15.2M.3T?15.2M.2C(1):1,15.2F||(r=!0,s="4E",i=i||15.1r.3N),0===l&&(15.2u||!15.1w.2Z||i)&&(15.1l===15.1r.1D&&(t=0),(0===t||0>h||h===u&&"5B"!==15.1y)&&h!==t&&(i=!0,h>u&&(s="3Z")),15.1B=a=!e||t||h===t?t:u);1o 1c(1e-7>t)15.1E=15.1p=0,15.3x=15.2M.3T?15.2M.2C(0):0,(0!==o||0===l&&h>0)&&(s="3Z",r=15.2F),0>t&&(15.2l=!1,0===l&&(15.2u||!15.1w.2Z||i)&&(h>=0&&(h!==u||"5B"!==15.1y)&&(i=!0),15.1B=a=!e||t||h===t?t:u)),15.2u||(i=!0);1o 1c(15.1E=15.1p=t,15.7i){1b f=t/l,p=15.7i,19=15.8r;(1===p||3===p&&f>=.5)&&(f=1-f),3===p&&(f*=2),1===19?f*=f:2===19?f*=f*f:3===19?f*=f*f*f:4===19&&(f*=f*f*f*f),15.3x=1===p?1-f:2===p?f:.5>t/l?f/2:1-f/2}1o 15.3x=15.2M.2C(t/l);1c(15.1p!==o||i){1c(!15.2u){1c(15.7o(),!15.2u||15.1K)1a;1c(!i&&15.1s&&(15.1w.2Z!==!1&&15.1D||15.1w.2Z&&!15.1D))1a 15.1p=15.1E=o,15.1B=h,z.24(15),2y(15.3k=[t,e]);15.1p&&!r?15.3x=15.2M.2C(15.1p/l):r&&15.2M.3T&&(15.3x=15.2M.2C(0===15.1p?0:1))}1d(15.3k!==!1&&(15.3k=!1),15.2l||!15.1F&&15.1p!==o&&t>=0&&(15.2l=!0),0===o&&(15.1Z&&(t>=0?15.1Z.1G(t,e,i):s||(s="bA")),15.1w.5h&&(0!==15.1p||0===l)&&(e||15.4j("5h"))),n=15.1s;n;)n.f?n.t[n.p](n.c*15.3x+n.s):n.t[n.p]=n.c*15.3x+n.s,n=n.1h;15.3O&&(0>t&&15.1Z&&t!==-1e-4&&15.1Z.1G(t,e,i),e||(15.1p!==o||r)&&15.4j("4B")),s&&(!15.1K||i)&&(0>t&&15.1Z&&!15.3O&&t!==-1e-4&&15.1Z.1G(t,e,i),r&&(15.1r.3N&&15.1H(!1,!1),15.2l=!1),!e&&15.1w[s]&&15.4j(s),0===l&&15.1B===u&&a!==u&&(15.1B=0))}},n.2s=18(t,e,i){1c("4A"===t&&(t=1g),1g==t&&(1g==e||e===15.2J))1a 15.3k=!1,15.1H(!1,!1);e="1O"!=1k e?e||15.2N||15.2J:M.48(e)||e;1b r,s,n,a,o,l,h,u,f,p=i&&15.1p&&i.1l===15.1l&&15.1r===i.1r;1c((19(e)||D(e))&&"2E"!=1k e[0])1d(r=e.1f;--r>-1;)15.2s(t,e[r],i)&&(l=!0);1o{1c(15.2N){1d(r=15.2N.1f;--r>-1;)1c(e===15.2N[r]){o=15.4a[r]||{},15.3z=15.3z||[],s=15.3z[r]=t?15.3z[r]||{}:"4A";8u}}1o{1c(e!==15.2J)1a!1;o=15.4a,s=15.3z=t?15.3z||{}:"4A"}1c(o){1c(h=t||o,u=t!==s&&"4A"!==s&&t!==o&&("4q"!=1k t||!t.aA),i&&(M.5n||15.1w.5n)){1d(n 1x h)o[n]&&(f||(f=[]),f.24(n));1c((f||!t)&&!Z(15,i,e,f))1a!1}1d(n 1x h)(a=o[n])&&(p&&(a.f?a.t[a.p](a.s):a.t[a.p]=a.s,l=!0),a.5u&&a.t.2s(h)&&(l=!0),a.5u&&0!==a.t.2P.1f||(a.1n?a.1n.1h=a.1h:a===15.1s&&(15.1s=a.1h),a.1h&&(a.1h.1n=a.1n),a.1h=a.1n=1g),4d o[n]),u&&(s[n]=1);!15.1s&&15.2u&&15.1H(!1,!1)}}1a l},n.4H=18(){1a 15.56&&M.64("7x",15),15.1s=15.3z=15.1Z=15.3O=1g,15.56=15.2l=15.3k=!1,15.4a=15.2N?{}:[],A.1A.4H.2h(15),15.1w.1X&&(15.1p=-u,15.1G(-15.2K)),15},n.1H=18(t,e){1c(o||a.3g(),t&&15.1K){1b i,r=15.2N;1c(r)1d(i=r.1f;--i>-1;)15.3b[i]=W(r[i],15,!0);1o 15.3b=W(15.2J,15,!0)}1a A.1A.1H.2h(15,t,e),15.56&&15.1s?M.64(t?"9i":"7x",15):!1},M.4p=18(t,e,i){1a 1j M(t,e,i)},M.6q=18(t,e,i){1a i.5d=!0,i.1X=0!=i.1X,1j M(t,e,i)},M.5Z=18(t,e,i,r){1a r.3o=i,r.1X=0!=r.1X&&0!=i.1X,1j M(t,e,r)},M.4v=18(t,e,i,r,s){1a 1j M(e,0,{4F:t,4E:e,6s:i,5s:r,3Z:e,96:i,1X:!1,2Z:!1,7l:s,5e:0})},M.4Q=18(t,e){1a 1j M(t,0,e)},M.4C=18(t,e){1c(1g==t)1a[];t="1O"!=1k t?t:M.48(t)||t;1b i,r,s,n;1c((19(t)||D(t))&&"2E"!=1k t[0]){1d(i=t.1f,r=[];--i>-1;)r=r.4O(M.4C(t[i],e));1d(i=r.1f;--i>-1;)1d(n=r[i],s=i;--s>-1;)n===r[s]&&r.3c(i,1)}1o 1d(r=W(t).4O(),i=r.1f;--i>-1;)(r[i].1K||e&&!r[i].5c())&&r.3c(i,1);1a r},M.aj=M.aq=18(t,e,i){"4q"==1k e&&(i=e,e=!1);1d(1b r=M.4C(t,e),s=r.1f;--s>-1;)r[s].2s(i,t)};1b $=g("5q.8O",18(t,e){15.2P=(t||"").1t(","),15.5t=15.2P[0],15.74=e||0,15.a3=$.1A},!0);1c(n=$.1A,$.4M="1.10.1",$.49=2,n.1s=1g,n.a6=18(t,e,i,r,s,n){1b a,o;1a 1g!=r&&(a="2E"==1k r||"="!==r.1z(1)?1P(r)-1P(i):3l(r.1z(0)+"1",10)*1P(r.1u(2)))?(15.1s=o={1h:15.1s,t:t,p:e,s:i,c:a,f:"18"==1k t[e],n:s||e,r:n},o.1h&&(o.1h.1n=o),o):2y 0},n.1Y=18(t){1d(1b e,i=15.1s,r=1e-6;i;)e=i.c*t+i.s,i.r?e=1i.3P(e):r>e&&e>-r&&(e=0),i.f?i.t[i.p](e):i.t[i.p]=e,i=i.1h},n.2s=18(t){1b e,i=15.2P,r=15.1s;1c(1g!=t[15.5t])15.2P=[];1o 1d(e=i.1f;--e>-1;)1g!=t[i[e]]&&i.3c(e,1);1d(;r;)1g!=t[r.n]&&(r.1h&&(r.1h.1n=r.1n),r.1n?(r.1n.1h=r.1h,r.1n=1g):15.1s===r&&(15.1s=r.1h)),r=r.1h;1a!1},n.9G=18(t,e){1d(1b i=15.1s;i;)(t[15.5t]||1g!=i.n&&t[i.n.1t(15.5t+"19").1I("")])&&(i.r=e),i=i.1h},M.64=18(t,e){1b i,r,s,n,a,o=e.1s;1c("5S"===t){1d(;o;){1d(a=o.1h,r=s;r&&r.2w>o.2w;)r=r.1h;(o.1n=r?r.1n:n)?o.1n.1h=o:s=o,(o.1h=r)?r.1n=o:n=o,o=a}o=e.1s=s}1d(;o;)o.5u&&"18"==1k o.t[t]&&o.t[t]()&&(i=!0),o=o.1h;1a i},$.6O=18(t){1d(1b e=t.1f;--e>-1;)t[e].49===$.49&&(N[(1j t[e]).5t]=t[e]);1a!0},m.2L=18(t){1c(!(t&&t.9J&&t.9H&&t.49))7g"ay 2L a4.";1b e,i=t.9J,r=t.6n||0,s=t.al,n={9H:"72",4Q:"1Y",3R:"2s",3P:"9G",aE:"5S"},a=g("5q."+i.1z(0).5Q()+i.1u(1)+"9Q",18(){$.2h(15,i,r),15.2P=s||[]},t.3G===!0),o=a.1A=1j $(i);o.2V=a,a.49=t.49;1d(e 1x n)"18"==1k t[e]&&(o[n[e]]=t[e]);1a a.4M=t.4M,$.6O([a]),a},r=t.3t){1d(s=0;r.1f>s;s++)r[s]();1d(n 1x c)c[n].9D||t.7d.7Q("bl aL bj bf: 5p.5o."+n)}o=!1}}("37"!=1k 2k&&2k.3n&&"37"!=1k 3G?3G:15||43,"3A");1b 1J="37"!=1k 2k&&2k.3n&&"37"!=1k 3G?3G:15||43;(1J.3t||(1J.3t=[])).24(18(){"4I 4J";1J.3J("8s",["5N.93","5N.95","3A"],18(t,e,i){1b r=18(t){e.2h(15,t),15.2U={},15.3N=15.1w.3N===!0,15.2r=15.1w.2r===!0,15.4V=!0,15.3O=15.1w.4B;1b i,r,s=15.1w;1d(r 1x s)i=s[r],l(i)&&-1!==i.1I("").1m("{5v}")&&(s[r]=15.5R(i));l(s.3X)&&15.1V(s.3X,0,s.b8,s.b1)},s=1e-10,n=i.5f,a=r.5f={},o=n.9g,l=n.9Y,h=n.9Z,u=n.9P,f=[],p=1J.3J.70,19=18(t){1b e,i={};1d(e 1x t)i[e]=t[e];1a i},c=a.aO=18(t,e,i,r){1b n,a=t.1r,o=a.1E,l=t.1l,h=0>t.1B||0===t.1B&&a.2F,u=h?0:s,p=h?s:0;1c(e||!15.58){1d(a.7f(l),n=t.1n;n&&n.1l===l;)n.1B=p,n=n.1n;1d(n=t.1h;n&&n.1l===l;)n.1B=u,n=n.1h;e&&e.4i(r||a.1w.5s||a,i||f),(15.58||!a.1F)&&a.41(o)}},d=18(t){1b e,i=[],r=t.1f;1d(e=0;e!==r;i.24(t[e++]));1a i},m=r.1A=1j e;1a r.4M="1.17.0",m.2V=r,m.3R().1K=m.58=!1,m.4p=18(t,e,r,s){1b n=r.5M&&p.7h||i;1a e?15.1V(1j n(t,e,r),s):15.4Q(t,r,s)},m.6q=18(t,e,r,s){1a 15.1V((r.5M&&p.7h||i).6q(t,e,r),s)},m.5Z=18(t,e,r,s,n){1b a=s.5M&&p.7h||i;1a e?15.1V(a.5Z(t,e,r,s),n):15.4Q(t,s,n)},m.6G=18(t,e,s,n,a,l,h,u){1b f,p=1j r({4E:l,6s:h,5s:u,2r:15.2r});1d("1O"==1k t&&(t=i.48(t)||t),t=t||[],o(t)&&(t=d(t)),n=n||0,0>n&&(t=d(t),t.80(),n*=-1),f=0;t.1f>f;f++)s.3o&&(s.3o=19(s.3o)),p.4p(t[f],e,19(s),f*n);1a 15.1V(p,a)},m.ax=18(t,e,i,r,s,n,a,o){1a i.1X=0!=i.1X,i.5d=!0,15.6G(t,e,i,r,s,n,a,o)},m.aB=18(t,e,i,r,s,n,a,o,l){1a r.3o=i,r.1X=0!=r.1X&&0!=i.1X,15.6G(t,e,r,s,n,a,o,l)},m.2h=18(t,e,r,s){1a 15.1V(i.4v(0,t,e,r),s)},m.4Q=18(t,e,r){1a r=15.3F(r,0,!0),1g==e.1X&&(e.1X=r===15.1p&&!15.1F),15.1V(1j i(t,0,e),r)},r.a0=18(t,e){t=t||{},1g==t.2r&&(t.2r=!0);1b s,n,a=1j r(t),o=a.1r;1d(1g==e&&(e=!0),o.40(a,!0),a.1l=0,a.1B=a.1p=a.1E=o.1p,s=o.28;s;)n=s.1h,e&&s 2p i&&s.2J===s.1w.4E||a.1V(s,s.1l-s.2K),s=n;1a o.1V(a,0),a},m.1V=18(s,n,a,o){1b h,u,f,p,19,c;1c("2E"!=1k n&&(n=15.3F(n,0,!0,s)),!(s 2p t)){1c(s 2p 42||s&&s.24&&l(s)){1d(a=a||"a2",o=o||0,h=n,u=s.1f,f=0;u>f;f++)l(p=s[f])&&(p=1j r({3X:p})),15.1V(p,h),"1O"!=1k p&&"18"!=1k p&&("ak"===a?h=p.1l+p.27()/p.1C:"ag"===a&&(p.1l-=p.4F())),h+=o;1a 15.3m(!0)}1c("1O"==1k s)1a 15.87(s,n);1c("18"!=1k s)7g"7W 1V "+s+" bi bd 26; bc bg 9h a 3V, 26, 18, bx 1O.";s=i.4v(0,s)}1c(e.1A.1V.2h(15,s,n),(15.1K||15.1p===15.1D)&&!15.1F&&15.1D<15.2B())1d(19=15,c=19.4g()>s.1l;19.1r;)c&&19.1r.2r?19.2R(19.1E,!0):19.1K&&19.1H(!0,!1),19=19.1r;1a 15},m.61=18(e){1c(e 2p t)1a 15.40(e,!1);1c(e 2p 42||e&&e.24&&l(e)){1d(1b i=e.1f;--i>-1;)15.61(e[i]);1a 15}1a"1O"==1k e?15.8g(e):15.3R(1g,e)},m.40=18(t,i){e.1A.40.2h(15,t,i);1b r=15.3i;1a r?15.1p>r.1l+r.2i/r.1C&&(15.1p=15.2B(),15.1E=15.2i):15.1p=15.1E=15.1D=15.2i=0,15},m.bb=18(t,e){1a 15.1V(t,15.3F(1g,e,!0,t))},m.85=m.aU=18(t,e,i,r){1a 15.1V(t,e||0,i,r)},m.b6=18(t,e,i,r){1a 15.1V(t,15.3F(1g,e,!0,t),i,r)},m.87=18(t,e){1a 15.2U[t]=15.3F(e),15},m.b3=18(t,e,r,s){1b n=i.4v(0,c,["{5v}",e,r,s],15);1a n.1y="5B",15.1V(n,t)},m.8g=18(t){1a 4d 15.2U[t],15},m.b2=18(t){1a 1g!=15.2U[t]?15.2U[t]:-1},m.3F=18(e,i,r,s){1b n;1c(s 2p t&&s.26===15)15.61(s);1o 1c(s&&(s 2p 42||s.24&&l(s)))1d(n=s.1f;--n>-1;)s[n]2p t&&s[n].26===15&&15.61(s[n]);1c("1O"==1k i)1a 15.3F(i,r&&"2E"==1k e&&1g==15.2U[i]?e-15.2B():0,r);1c(i=i||0,"1O"!=1k e||!76(e)&&1g==15.2U[e])1g==e&&(e=15.2B());1o{1c(n=e.1m("="),-1===n)1a 1g==15.2U[e]?r?15.2U[e]=15.2B()+i:i:15.2U[e]+i;i=3l(e.1z(n-1)+"1",10)*1P(e.1u(n+1)),e=n>1?15.3F(e.1u(0,n-1),0,r):15.2B()}1a 1P(e)+i},m.41=18(t,e){1a 15.2R("2E"==1k t?t:15.3F(t),e!==!1)},m.b4=18(){1a 15.2W(!0)},m.b9=18(t,e){1a 15.7P(t,e)},m.b7=18(t,e){1a 15.7f(t,e)},m.1G=18(t,e,i){15.1K&&15.1H(!0,!1);1b r,n,a,o,l,f=15.2z?15.27():15.2i,p=15.1p,19=15.1l,c=15.1C,d=15.1F;1c(t>=f)15.1E=15.1p=f,15.2F||15.7c()||(n=!0,o="4E",l=!!15.1r.3N,0===15.1D&&(0===t||0>15.1B||15.1B===s)&&15.1B!==t&&15.28&&(l=!0,15.1B>s&&(o="3Z"))),15.1B=15.1D||!e||t||15.1B===t?t:s,t=f+1e-4;1o 1c(1e-7>t)1c(15.1E=15.1p=0,(0!==p||0===15.1D&&15.1B!==s&&(15.1B>0||0>t&&15.1B>=0))&&(o="3Z",n=15.2F),0>t)15.2l=!1,15.1r.3N&&15.2F?(l=n=!0,o="3Z"):15.1B>=0&&15.28&&(l=!0),15.1B=t;1o{1c(15.1B=15.1D||!e||t||15.1B===t?t:s,0===t&&n)1d(r=15.28;r&&0===r.1l;)r.1D||(n=!1),r=r.1h;t=0,15.2u||(l=!0)}1o 15.1E=15.1p=15.1B=t;1c(15.1p!==p&&15.28||i||l){1c(15.2u||(15.2u=!0),15.2l||!15.1F&&15.1p!==p&&t>0&&(15.2l=!0),0===p&&15.1w.5h&&0!==15.1p&&(e||15.4j("5h")),15.1p>=p)1d(r=15.28;r&&(a=r.1h,!15.1F||d);)(r.2l||r.1l<=15.1p&&!r.1F&&!r.1K)&&(r.2F?r.1G((r.2z?r.27():r.2i)-(t-r.1l)*r.1C,e,i):r.1G((t-r.1l)*r.1C,e,i)),r=a;1o 1d(r=15.3i;r&&(a=r.1n,!15.1F||d);)(r.2l||p>=r.1l&&!r.1F&&!r.1K)&&(r.2F?r.1G((r.2z?r.27():r.2i)-(t-r.1l)*r.1C,e,i):r.1G((t-r.1l)*r.1C,e,i)),r=a;15.3O&&(e||(h.1f&&u(),15.4j("4B"))),o&&(15.1K||(19===15.1l||c!==15.1C)&&(0===15.1p||f>=15.27())&&(n&&(h.1f&&u(),15.1r.3N&&15.1H(!1,!1),15.2l=!1),!e&&15.1w[o]&&15.4j(o)))}},m.7c=18(){1d(1b t=15.28;t;){1c(t.1F||t 2p r&&t.7c())1a!0;t=t.1h}1a!1},m.5X=18(t,e,r,s){s=s||-5K;1d(1b n=[],a=15.28,o=0;a;)s>a.1l||(a 2p i?e!==!1&&(n[o++]=a):(r!==!1&&(n[o++]=a),t!==!1&&(n=n.4O(a.5X(!0,e,r)),o=n.1f))),a=a.1h;1a n},m.4C=18(t,e){1b r,s,n=15.1K,a=[],o=0;1d(n&&15.1H(!0,!0),r=i.4C(t),s=r.1f;--s>-1;)(r[s].26===15||e&&15.8J(r[s]))&&(a[o++]=r[s]);1a n&&15.1H(!1,!0),a},m.aT=18(){1a 15.4W},m.8J=18(t){1d(1b e=t.26;e;){1c(e===15)1a!0;e=e.26}1a!1},m.8T=18(t,e,i){i=i||0;1d(1b r,s=15.28,n=15.2U;s;)s.1l>=i&&(s.1l+=t),s=s.1h;1c(e)1d(r 1x n)n[r]>=i&&(n[r]+=t);1a 15.3m(!0)},m.2s=18(t,e){1c(!t&&!e)1a 15.1H(!1,!1);1d(1b i=e?15.4C(e):15.5X(!0,!0,!1),r=i.1f,s=!1;--r>-1;)i[r].2s(t,e)&&(s=!0);1a s},m.bu=18(t){1b e=15.5X(!1,!0,!0),i=e.1f;1d(15.1p=15.1E=0;--i>-1;)e[i].1H(!1,!1);1a t!==!1&&(15.2U={}),15.3m(!0)},m.4H=18(){1d(1b e=15.28;e;)e.4H(),e=e.1h;1a t.1A.4H.2h(15)},m.1H=18(t,i){1c(t===15.1K)1d(1b r=15.28;r;)r.1H(t,!0),r=r.1h;1a e.1A.1H.2h(15,t,i)},m.2R=18(){15.58=!0;1b e=t.1A.2R.4i(15,2n);1a 15.58=!1,e},m.2B=18(t){1a 2n.1f?(0!==15.2B()&&0!==t&&15.6M(15.1D/t),15):(15.2z&&15.27(),15.1D)},m.27=18(t){1c(!2n.1f){1c(15.2z){1d(1b e,i,r=0,s=15.3i,n=ad;s;)e=s.1n,s.2z&&s.27(),s.1l>n&&15.4V&&!s.1F?15.1V(s,s.1l-s.2K):n=s.1l,0>s.1l&&!s.1F&&(r-=s.1l,15.1r.2r&&(15.1l+=s.1l/15.1C),15.8T(-s.1l,!1,-5K),n=0),i=s.1l+s.2i/s.1C,i>r&&(r=i),s=e;15.1D=15.2i=r,15.2z=!1}1a 15.2i}1a 0!==15.27()&&0!==t&&15.6M(15.2i/t),15},m.2W=18(e){1c(!e)1d(1b i=15.28,r=15.1p;i;)i.1l===r&&"5B"===i.1y&&(i.1B=0),i=i.1h;1a t.1A.2W.4i(15,2n)},m.ai=18(){1d(1b e=15.1r;e.1r;)e=e.1r;1a e===t.8n},m.4g=18(){1a 15.1F?15.1E:(15.1r.4g()-15.1l)*15.1C},r},!0)}),1J.3J&&1J.3t.4K()(),18(t){"4I 4J";1b e=18(){1a(1J.5r||1J)[t]};"18"==1k 3H&&3H.6R?3H(["3A"],e):"37"!=1k 2k&&2k.3n&&(8i("./3A.6V"),2k.3n=e())}("8s");1b 1J="37"!=1k 2k&&2k.3n&&"37"!=1k 3G?3G:15||43;(1J.3t||(1J.3t=[])).24(18(){"4I 4J";1J.3J("2A.8x",["2A.8A"],18(t){1b e,i,r,s=1J.5r||1J,n=s.5p.5o,a=2*1i.4S,o=1i.4S/2,l=n.8z,h=18(e,i){1b r=l("2A."+e,18(){},!0),s=r.1A=1j t;1a s.2V=r,s.2C=i,r},u=t.8y||18(){},f=18(t,e,i,r){1b s=l("2A."+t,{6U:1j e,5G:1j i,5A:1j r},!0);1a u(s,t),s},p=18(t,e,i){15.t=t,15.v=e,i&&(15.5E=i,i.5D=15,15.c=i.v-e,15.8k=i.t-t)},19=18(e,i){1b r=l("2A."+e,18(t){15.23=t||0===t?t:1.aG,15.2o=1.a7*15.23},!0),s=r.1A=1j t;1a s.2V=r,s.2C=i,s.3y=18(t){1a 1j r(t)},r},c=f("8x",19("bn",18(t){1a(t-=1)*t*((15.23+1)*t+15.23)+1}),19("bC",18(t){1a t*t*((15.23+1)*t-15.23)}),19("ek",18(t){1a 1>(t*=2)?.5*t*t*((15.2o+1)*t-15.2o):.5*((t-=2)*t*((15.2o+1)*t+15.2o)+2)})),d=l("2A.6P",18(t,e,i){e=e||0===e?e:.7,1g==t?t=.7:t>1&&(t=1),15.8w=1!==t?e:0,15.23=(1-t)/2,15.2o=t,15.3K=15.23+15.2o,15.3T=i===!0},!0),m=d.1A=1j t;1a m.2V=d,m.2C=18(t){1b e=t+(.5-t)*15.8w;1a 15.23>t?15.3T?1-(t=1-t/15.23)*t:e-(t=1-t/15.23)*t*t*t*e:t>15.3K?15.3T?1-(t=(t-15.3K)/15.23)*t:e+(t-e)*(t=(t-15.3K)/15.23)*t*t*t:15.3T?1:e},d.4e=1j d(.7,.7),m.3y=d.3y=18(t,e,i){1a 1j d(t,e,i)},e=l("2A.8W",18(t){t=t||1,15.23=1/t,15.2o=t+1},!0),m=e.1A=1j t,m.2V=e,m.2C=18(t){1a 0>t?t=0:t>=1&&(t=.dX),(15.2o*t>>0)*15.23},m.3y=e.3y=18(t){1a 1j e(t)},i=l("2A.8X",18(e){e=e||{};1d(1b i,r,s,n,a,o,l=e.dp||"3E",h=[],u=0,f=0|(e.do||20),19=f,c=e.dz!==!1,d=e.dA===!0,m=e.8C 2p t?e.8C:1g,g="2E"==1k e.8B?.4*e.8B:.4;--19>-1;)i=c?1i.8t():1/f*19,r=m?m.2C(i):i,"3E"===l?s=g:"dE"===l?(n=1-i,s=n*n*g):"1x"===l?s=i*i*g:.5>i?(n=2*i,s=.5*n*n*g):(n=2*(1-i),s=.5*n*n*g),c?r+=1i.8t()*s-.5*s:19%2?r+=.5*s:r-=.5*s,d&&(r>1?r=1:0>r&&(r=0)),h[u++]={x:i,y:r};1d(h.dF(18(t,e){1a t.x-e.x}),o=1j p(1,1,1g),19=f;--19>-1;)a=h[19],o=1j p(a.x,a.y,o);15.1n=1j p(0,0,0!==o.t?o:o.5E)},!0),m=i.1A=1j t,m.2V=i,m.2C=18(t){1b e=15.1n;1c(t>e.t){1d(;e.5E&&t>=e.t;)e=e.5E;e=e.5D}1o 1d(;e.5D&&e.t>=t;)e=e.5D;1a 15.1n=e,e.v+(t-e.t)/e.8k*e.c},m.3y=18(t){1a 1j i(t)},i.4e=1j i,f("dG",h("dH",18(t){1a 1/2.75>t?7.2X*t*t:2/2.75>t?7.2X*(t-=1.5/2.75)*t+.75:2.5/2.75>t?7.2X*(t-=2.25/2.75)*t+.6W:7.2X*(t-=2.6Y/2.75)*t+.6X}),h("dI",18(t){1a 1/2.75>(t=1-t)?1-7.2X*t*t:2/2.75>t?1-(7.2X*(t-=1.5/2.75)*t+.75):2.5/2.75>t?1-(7.2X*(t-=2.25/2.75)*t+.6W):1-(7.2X*(t-=2.6Y/2.75)*t+.6X)}),h("dJ",18(t){1b e=.5>t;1a t=e?1-2*t:2*t-1,t=1/2.75>t?7.2X*t*t:2/2.75>t?7.2X*(t-=1.5/2.75)*t+.75:2.5/2.75>t?7.2X*(t-=2.25/2.75)*t+.6W:7.2X*(t-=2.6Y/2.75)*t+.6X,e?.5*(1-t):.5*t+.5})),f("dB",h("dC",18(t){1a 1i.3f(1-(t-=1)*t)}),h("dD",18(t){1a-(1i.3f(1-t*t)-1)}),h("dK",18(t){1a 1>(t*=2)?-.5*(1i.3f(1-t*t)-1):.5*(1i.3f(1-(t-=2)*t)+1)})),r=18(e,i,r){1b s=l("2A."+e,18(t,e){15.23=t>=1?t:1,15.2o=(e||r)/(1>t?t:1),15.3K=15.2o/a*(1i.dL(1/15.23)||0),15.2o=a/15.2o},!0),n=s.1A=1j t;1a n.2V=s,n.2C=i,n.3y=18(t,e){1a 1j s(t,e)},s},f("dT",r("dU",18(t){1a 15.23*1i.3L(2,-10*t)*1i.2t((t-15.3K)*15.2o)+1},.3),r("dV",18(t){1a-(15.23*1i.3L(2,10*(t-=1))*1i.2t((t-15.3K)*15.2o))},.3),r("dW",18(t){1a 1>(t*=2)?-.5*15.23*1i.3L(2,10*(t-=1))*1i.2t((t-15.3K)*15.2o):.5*15.23*1i.3L(2,-10*(t-=1))*1i.2t((t-15.3K)*15.2o)+1},.45)),f("dS",h("dR",18(t){1a 1-1i.3L(2,-10*t)}),h("dN",18(t){1a 1i.3L(2,10*(t-1))-.6w}),h("dM",18(t){1a 1>(t*=2)?.5*1i.3L(2,10*(t-1)):.5*(2-1i.3L(2,-10*(t-1)))})),f("dO",h("dP",18(t){1a 1i.2t(t*o)}),h("dQ",18(t){1a-1i.2S(t*o)+1}),h("dy",18(t){1a-.5*(1i.2S(1i.4S*t)-1)})),l("2A.dx",{dg:18(e){1a t.8Y[e]}},!0),u(s.6P,"6P","4e,"),u(i,"8X","4e,"),u(e,"8W","4e,"),c},!0)}),1J.3J&&1J.3t.4K()();1b 1J="37"!=1k 2k&&2k.3n&&"37"!=1k 3G?3G:15||43;(1J.3t||(1J.3t=[])).24(18(){"4I 4J";1J.3J("5q.9L",["5q.8O","3A"],18(t,e){1b i,r,s,n,a=18(){t.2h(15,"57"),15.2P.1f=0,15.1Y=a.1A.1Y},o=1J.3J.70,l={},h=a.1A=1j t("57");h.2V=a,a.4M="1.17.0",a.49=2,a.6H=0,a.8G="di",a.9b=!0,h="2j",a.79={4T:h,8e:h,8d:h,51:h,2D:h,3j:h,dj:h,7q:h,7H:h,3a:h,df:""};1b u,f,p,19,c,d,m=/(?:\\d|\\-\\d|\\.\\d|\\-\\.\\d)+/g,g=/(?:\\d|\\-\\d|\\.\\d|\\-\\.\\d|\\+=\\d|\\-=\\d|\\+=.\\d|\\-=\\.\\d)+/g,v=/(?:\\+=|\\-=|\\-|\\b)[\\d\\-\\.]+[a-dd-d9-9]*(?:%|\\b)/3Q,x=/(?![+-]?\\d*\\.?\\d+|[+-]|e[+-]\\d+)[^0-9]/g,y=/(?:\\d|\\-|\\+|=|#|\\.)*/g,T=/2a *= *([^)]*)/i,w=/2a:([^;]*)/i,b=/3U\\(2a *=.+?\\)/i,P=/^(6e|6r)/,O=/([A-Z])/g,S=/-([a-z])/3Q,k=/(^(?:8F\\(\\"|8F\\())|(?:(\\"\\))$|\\)$)/3Q,A=18(t,e){1a e.5Q()},C=/(?:6K|86|8f)/i,R=/(9t|9s|9r|9q)=[\\d\\-\\.e]+/3Q,M=/9A\\:6z\\.6B\\.6A\\(.+?\\)/i,D=/,(?=[^\\)]*(?:\\(|$))/3Q,X=1i.4S/3D,z=3D/1i.4S,F={},I=52,N=18(t){1a I.5I?I.5I("9m://9l.9k.9d/d8/da",t):I.db(t)},E=N("dc"),L=N("dk"),Y=a.5f={dl:l},B=dt.du,j=18(){1b t=B.1m("94"),e=N("a");1a p=-1!==B.1m("dv")&&-1===B.1m("dw")&&(-1===t||1P(B.1u(t+8,1))>3),c=p&&6>1P(B.1u(B.1m("ds/")+8,1)),19=-1!==B.1m("dr"),(/dn ([0-9]{1,}[\\.0-9]{0,})/.7S(B)||/dm\\/.*dY:([0-9]{1,}[\\.0-9]{0,})/.7S(B))&&(d=1q(4D.$1)),e?(e.1v.3B="4T:dq;2a:.55;",/^0.55/.35(e.1v.2a)):!1}(),V=18(t){1a T.35("1O"==1k t?t:(t.3e?t.3e.2x:t.1v.2x)||"")?1q(4D.$1)/1M:1},U=18(t){43.7d&&7d.7Q(t)},q="",W="",Z=18(t,e){e=e||E;1b i,r,s=e.1v;1c(2y 0!==s[t])1a t;1d(t=t.1z(0).5Q()+t.1u(1),i=["O","ev","6a","eu","ej"],r=5;--r>-1&&2y 0===s[i[r]+t];);1a r>=0?(W=3===r?"6a":i[r],q="-"+W.6i()+"-",W+t):1g},G=I.7N?I.7N.e5:18(){},Q=a.e3=18(t,e,i,r,s){1b n;1a j||"2a"!==e?(!r&&t.1v[e]?n=t.1v[e]:(i=i||G(t))?n=i[e]||i.4o(e)||i.4o(e.1N(O,"-$1").6i()):t.3e&&(n=t.3e[e]),1g==s||n&&"3E"!==n&&"2m"!==n&&"2m 2m"!==n?n:s):V(t)},$=Y.e1=18(t,i,r,s,n){1c("2j"===s||!s)1a r;1c("2m"===s||!r)1a 0;1b o,l,h,u=C.35(i),f=t,p=E.1v,19=0>r;1c(19&&(r=-r),"%"===s&&-1!==i.1m("4w"))o=r/1M*(u?t.ef:t.eb);1o{1c(p.3B="4w:0 6k 83;4z:"+Q(t,"4z")+";ei-3j:0;","%"!==s&&f.65)p[u?"92":"6C"]=r+s;1o{1c(f=t.5J||I.7D,l=f.71,h=e.78.3C,l&&u&&l.3q===h)1a l.2D*r/1M;p[u?"2D":"3j"]=r+s}f.65(E),o=1q(E[u?"4X":"4Y"]),f.7F(E),u&&"%"===s&&a.ea!==!1&&(l=f.71=f.71||{},l.3q=h,l.2D=1M*(o/r)),0!==o||n||(o=$(t,i,r,s,!0))}1a 19?-o:o},H=Y.e9=18(t,e,i){1c("7J"!==Q(t,"4z",i))1a 0;1b r="51"===e?"6K":"8a",s=Q(t,"7H"+r,i);1a t["ec"+r]-($(t,e,1q(s),s.1N(y,""))||0)},K=18(t,e){1b i,r,s,n={};1c(e=e||G(t,1g))1c(i=e.1f)1d(;--i>-1;)s=e[i],(-1===s.1m("-2Q")||6v===s)&&(n[s.1N(S,A)]=e.4o(s));1o 1d(i 1x e)(-1===i.1m("9j")||be===i)&&(n[i]=e[i]);1o 1c(e=t.3e||t.1v)1d(i 1x e)"1O"==1k i&&2y 0===n[i]&&(n[i.1N(S,A)]=e[i]);1a j||(n.2a=V(t)),r=4N(t,e,!1),n.1W=r.1W,n.21=r.21,n.2q=r.2q,n.2G=r.2G,n.x=r.x,n.y=r.y,34&&(n.z=r.z,n.22=r.22,n.29=r.29,n.36=r.36),n.88&&4d n.88,n},J=18(t,e,i,r,s){1b n,a,o,l={},h=t.1v;1d(a 1x i)"3B"!==a&&"1f"!==a&&76(a)&&(e[a]!==(n=i[a])||s&&s[a])&&-1===a.1m("ed")&&("2E"==1k n||"1O"==1k n)&&(l[a]="2m"!==n||"51"!==a&&"4T"!==a?""!==n&&"2m"!==n&&"3E"!==n||"1O"!=1k e[a]||""===e[a].1N(x,"")?n:0:H(t,a),2y 0!==h[a]&&(o=1j 62(h,a,h[a],o)));1c(r)1d(a 1x r)"3M"!==a&&(l[a]=r[a]);1a{5O:l,4R:o}},8b={2D:["6K","86"],3j:["8a","eh"]},ee=["9p","9f","9X","98"],8R=18(t,e,i){1b r=1q("2D"===e?t.4X:t.4Y),s=8b[e],n=s.1f;1d(i=i||G(t,1g);--n>-1;)r-=1q(Q(t,"7q"+s[n],i,!0))||0,r-=1q(Q(t,"4w"+s[n]+"8f",i,!0))||0;1a r},4r=18(t,e){(1g==t||""===t||"2m"===t||"2m 2m"===t)&&(t="0 0");1b i=t.1t(" "),r=-1!==t.1m("51")?"0%":-1!==t.1m("8e")?"1M%":i[0],s=-1!==t.1m("4T")?"0%":-1!==t.1m("8d")?"1M%":i[1];1a 1g==s?s="77"===r?"50%":"0":"77"===s&&(s="50%"),("77"===r||76(1q(r))&&-1===(r+"").1m("="))&&(r="50%"),t=r+" "+s+(i.1f>2?" "+i[2]:""),e&&(e.9u=-1!==r.1m("%"),e.9v=-1!==s.1m("%"),e.eg="="===r.1z(1),e.e8="="===s.1z(1),e.63=1q(r.1N(x,"")),e.6y=1q(s.1N(x,"")),e.v=t),e||t},6u=18(t,e){1a"1O"==1k t&&"="===t.1z(1)?3l(t.1z(0)+"1",10)*1q(t.1u(2)):1q(t)-1q(e)},2H=18(t,e){1a 1g==t?e:"1O"==1k t&&"="===t.1z(1)?3l(t.1z(0)+"1",10)*1q(t.1u(2))+e:1q(t)},ae=18(t,e,i,r){1b s,n,a,o,l,h=1e-6;1a 1g==t?o=e:"2E"==1k t?o=t:(s=6m,n=t.1t("19"),l="="===t.1z(1),a=(l?3l(t.1z(0)+"1",10)*1q(n[0].1u(2)):1q(n[0]))*(-1===t.1m("e7")?1:z)-(l?0:e),n.1f&&(r&&(r[i]=e+a),-1!==t.1m("e0")&&(a%=s,a!==a%(s/2)&&(a=0>a?a+s:a-s)),-1!==t.1m("dZ")&&0>a?a=(a+5K*s)%s-(0|a/s)*s:-1!==t.1m("e2")&&a>0&&(a=(a-5K*s)%s-(0|a/s)*s)),o=e+a),h>o&&o>-h&&(o=0),o},44={e6:[0,1R,1R],e4:[0,1R,0],el:[5Y,5Y,5Y],9W:[0,0,0],et:[2Y,0,0],ew:[0,2Y,2Y],er:[0,0,1R],es:[0,0,2Y],en:[1R,1R,1R],eo:[1R,0,1R],eq:[2Y,2Y,0],ep:[1R,1R,0],dh:[1R,d6,0],c6:[2Y,2Y,2Y],c7:[2Y,0,2Y],c8:[0,2Y,0],83:[1R,0,0],c9:[1R,5Y,c5],c4:[0,1R,1R],4L:[1R,1R,1R,0]},5H=18(t,e,i){1a t=0>t?t+1:t>1?t-1:t,0|1R*(1>6*t?e+6*(i-e)*t:.5>t?i:2>3*t?e+6*(i-e)*(2/3-t):e)+.5},6d=a.c0=18(t){1b e,i,r,s,n,a;1a t&&""!==t?"2E"==1k t?[t>>16,1R&t>>8,1R&t]:(","===t.1z(t.1f-1)&&(t=t.1u(0,t.1f-1)),44[t]?44[t]:"#"===t.1z(0)?(4===t.1f&&(e=t.1z(1),i=t.1z(2),r=t.1z(3),t="#"+e+e+i+i+r+r),t=3l(t.1u(1),16),[t>>16,1R&t>>8,1R&t]):"6r"===t.1u(0,3)?(t=t.2O(m),s=1P(t[0])%6m/6m,n=1P(t[1])/1M,a=1P(t[2])/1M,i=.5>=a?a*(n+1):a+n-a*n,e=2*a-i,t.1f>3&&(t[3]=1P(t[3])),t[0]=5H(s+1/3,e,i),t[1]=5H(s,e,i),t[2]=5H(s-1/3,e,i),t):(t=t.2O(m)||44.4L,t[0]=1P(t[0]),t[1]=1P(t[1]),t[2]=1P(t[2]),t.1f>3&&(t[3]=1P(t[3])),t)):44.9W},3W="(?:\\\\b(?:(?:6e|6Z|6r|c1)\\\\(.+?\\\\))|\\\\B#.+?\\\\b";1d(h 1x 44)3W+="|"+h+"\\\\b";3W=4D(3W+")","3Q");1b 7k=18(t,e,i,r){1c(1g==t)1a 18(t){1a t};1b s,n=e?(t.2O(3W)||[""])[0]:"",a=t.1t(n).1I("").2O(v)||[],o=t.1u(0,t.1m(a[0])),l=")"===t.1z(t.1f-1)?")":"",h=-1!==t.1m(" ")?" ":",",u=a.1f,f=u>0?a[0].1N(m,""):"";1a u?s=e?18(t){1b e,p,19,c;1c("2E"==1k t)t+=f;1o 1c(r&&D.35(t)){1d(c=t.1N(D,"|").1t("|"),19=0;c.1f>19;19++)c[19]=s(c[19]);1a c.1I(",")}1c(e=(t.2O(3W)||[n])[0],p=t.1t(e).1I("").2O(v)||[],19=p.1f,u>19--)1d(;u>++19;)p[19]=i?p[0|(19-1)/2]:a[19];1a o+p.1I(h)+h+e+l+(-1!==t.1m("7I")?" 7I":"")}:18(t){1b e,n,p;1c("2E"==1k t)t+=f;1o 1c(r&&D.35(t)){1d(n=t.1N(D,"|").1t("|"),p=0;n.1f>p;p++)n[p]=s(n[p]);1a n.1I(",")}1c(e=t.2O(v)||[],p=e.1f,u>p--)1d(;u>++p;)e[p]=i?e[0|(p-1)/2]:a[p];1a o+e.1I(h)+l}:18(t){1a t}},68=18(t){1a t=t.1t(","),18(e,i,r,s,n,a,o){1b l,h=(i+"").1t(" ");1d(o={},l=0;4>l;l++)o[t[l]]=h[l]=h[l]||h[(l-1)/2>>0];1a s.31(e,o,n,a)}},62=(Y.c2=18(t){15.2L.1Y(t);1d(1b e,i,r,s,n=15.1y,a=n.9T,o=n.4R,l=1e-6;o;)e=a[o.v],o.r?e=1i.3P(e):l>e&&e>-l&&(e=0),o.t[o.p]=e,o=o.1h;1c(n.9S&&(n.9S.1W=a.1W),1===t)1d(o=n.4R;o;){1c(i=o.t,i.2f){1c(1===i.2f){1d(s=i.1U+i.s+i.4h,r=1;i.l>r;r++)s+=i["3r"+r]+i["38"+(r+1)];i.e=s}}1o i.e=i.s+i.1U;o=o.1h}},18(t,e,i,r,s){15.t=t,15.p=e,15.v=i,15.r=s,r&&(r.1n=15,15.1h=r)}),ce=(Y.c3=18(t,e,i,r,s,n){1b a,o,l,h,u,f=r,p={},19={},c=i.3I,d=F;1d(i.3I=1g,F=e,r=u=i.31(t,e,r,s),F=d,n&&(i.3I=c,f&&(f.1n=1g,f.1n&&(f.1n.1h=1g)));r&&r!==f;){1c(1>=r.2f&&(o=r.p,19[o]=r.s+r.c,p[o]=r.s,n||(h=1j 62(r,"s",o,h,r.r),r.c=0),1===r.2f))1d(a=r.l;--a>0;)l="3r"+a,o=r.p+"19"+l,19[o]=r.1y[l],p[o]=r[l],n||(h=1j 62(r,l,o,h,r.5P[l]));r=r.1h}1a{9T:p,ca:19,4R:h,cb:u}},Y.cj=18(t,e,r,s,a,o,l,h,u,f,p){15.t=t,15.p=e,15.s=r,15.c=s,15.n=l||e,t 2p ce||n.24(15.n),15.r=h,15.2f=o||0,u&&(15.2w=u,i=!0),15.b=2y 0===f?r:f,15.e=2y 0===p?r+s:p,a&&(15.1h=a,a.1n=15)}),de=18(t,e,i,r,s,n){1b a=1j ce(t,e,i,r-i,s,-1,n);1a a.b=i,a.e=a.1U=r,a},5l=a.4u=18(t,e,i,r,s,n,a,o,l,h){i=i||n||"",a=1j ce(t,e,0,0,a,h?2:1,1g,!1,o,i,r),r+="";1b f,p,19,c,d,v,x,y,T,w,b,O,S=i.1t(", ").1I(",").1t(" "),k=r.1t(", ").1I(",").1t(" "),A=S.1f,C=u!==!1;1d((-1!==r.1m(",")||-1!==i.1m(","))&&(S=S.1I(" ").1N(D,", ").1t(" "),k=k.1I(" ").1N(D,", ").1t(" "),A=S.1f),A!==k.1f&&(S=(n||"").1t(" "),A=S.1f),a.2L=l,a.1Y=h,f=0;A>f;f++)1c(c=S[f],d=k[f],y=1q(c),y||0===y)a.4f("",y,6u(d,y),d.1N(g,""),C&&-1!==d.1m("2j"),!0);1o 1c(s&&("#"===c.1z(0)||44[c]||P.35(c)))O=","===d.1z(d.1f-1)?"),":")",c=6d(c),d=6d(d),T=c.1f+d.1f>6,T&&!j&&0===d[3]?(a["38"+a.l]+=a.l?" 4L":"4L",a.e=a.e.1t(k[f]).1I("4L")):(j||(T=!1),a.4f(T?"6Z(":"6e(",c[0],d[0]-c[0],",",!0,!0).4f("",c[1],d[1]-c[1],",",!0).4f("",c[2],d[2]-c[2],T?",":O,!0),T&&(c=4>c.1f?1:c[3],a.4f("",c,(4>d.1f?1:d[3])-c,O,!1)));1o 1c(v=c.2O(m)){1c(x=d.2O(g),!x||x.1f!==v.1f)1a a;1d(19=0,p=0;v.1f>p;p++)b=v[p],w=c.1m(b,19),a.4f(c.1u(19,w-19),1P(b),6u(x[p],b),"",C&&"2j"===c.1u(w+b.1f,2),0===p),19=w+b.1f;a["38"+a.l]+=c.1u(19)}1o a["38"+a.l]+=a.l?" "+c:c;1c(-1!==r.1m("=")&&a.1y){1d(O=a.1U+a.1y.s,f=1;a.l>f;f++)O+=a["38"+f]+a.1y["3r"+f];a.e=O+a["38"+f]}1a a.l||(a.2f=-1,a.1U=a.e),a.46||a},2b=9;1d(h=ce.1A,h.l=h.2w=0;--2b>0;)h["3r"+2b]=0,h["38"+2b]="";h.1U="",h.1h=h.1n=h.46=h.1y=h.2L=h.1Y=h.5P=1g,h.4f=18(t,e,i,r,s,n){1b a=15,o=a.l;1a a["38"+o]+=n&&o?" "+t:t||"",i||0===o||a.2L?(a.l++,a.2f=a.1Y?2:1,a["38"+a.l]=r||"",o>0?(a.1y["3r"+o]=e+i,a.5P["3r"+o]=s,a["3r"+o]=e,a.2L||(a.46=1j ce(a,"3r"+o,e,i,a.46||a,0,a.n,s,a.2w),a.46.1U=0),a):(a.1y={s:e+i},a.5P={},a.s=e,a.c=i,a.r=s,a)):(a["38"+o]+=e+(r||""),a)};1b 6o=18(t,e){e=e||{},15.p=e.39?Z(t)||t:t,l[t]=l[15.p]=15,15.3d=e.5w||7k(e.2I,e.4G,e.ck,e.4m),e.2g&&(15.31=e.2g),15.9e=e.4G,15.4m=e.4m,15.5z=e.5z,15.4t=e.2I,15.2w=e.6n||0},1Q=Y.cl=18(t,e,i){"4q"!=1k e&&(e={2g:i});1b r,s,n=t.1t(","),a=e.2I;1d(i=i||[a],r=0;n.1f>r;r++)e.39=0===r&&e.39,e.2I=i[r]||a,s=1j 6o(n[r],e)},89=18(t){1c(!l[t]){1b e=t.1z(0).5Q()+t.1u(1)+"9Q";1Q(t,{2g:18(t,i,r,s,n,a,h){1b u=o.5p.5o.5q[e];1a u?(u.ci(),l[r].31(t,i,r,s,n,a,h)):(U("ch: "+e+" 6V bB 9h cc."),n)}})}};h=6o.1A,h.4u=18(t,e,i,r,s,n){1b a,o,l,h,u,f,p=15.5z;1c(15.4m&&(D.35(i)||D.35(e)?(o=e.1N(D,"|").1t("|"),l=i.1N(D,"|").1t("|")):p&&(o=[e],l=[i])),l){1d(h=l.1f>o.1f?l.1f:o.1f,a=0;h>a;a++)e=o[a]=o[a]||15.4t,i=l[a]=l[a]||15.4t,p&&(u=e.1m(p),f=i.1m(p),u!==f&&(-1===f?o[a]=o[a].1t(p).1I(""):-1===u&&(o[a]+=" "+p)));e=o.1I(", "),i=l.1I(", ")}1a 5l(t,15.p,e,i,15.9e,15.4t,r,15.2w,s,n)},h.31=18(t,e,i,r,n,a){1a 15.4u(t.1v,15.3d(Q(t,15.p,s,!1,15.4t)),15.3d(e),n,a)},a.cd=18(t,e,i){1Q(t,{2g:18(t,r,s,n,a,o){1b l=1j ce(t,s,0,0,a,2,s,!1,i);1a l.2L=o,l.1Y=e(t,r,n.3u,s),l},6n:i})},a.9F=p||19;1b 3p,7u="2q,2G,36,x,y,z,21,2T,1W,22,29,3a,1T,1S".1t(","),be=Z("2Q"),6v=q+"2Q",4P=Z("5x"),34=1g!==Z("3a"),5a=Y.9j=18(){15.3a=1q(a.6H)||0,15.47=a.9n!==!1&&34?a.9n||"2m":!1},9a=43.cf,6F=18(t,e,i){1b r,s=I.5I("9m://9l.9k.9d/cg/2v",t),n=/([a-z])([A-Z])/g;1d(r 1x i)s.bZ(1g,r.1N(n,"$1-$2").6i(),i[r]);1a e.65(s),s},6E=I.bY,9E=18(){1b t,e,i,r=d||/94/i.35(B)&&!43.bI;1a I.5I&&!r&&(t=6F("2v",6E),e=6F("7G",t,{2D:1M,3j:50,x:1M}),i=e.9M().2D,e.1v[4P]="50% 50%",e.1v[be]="2q(0.5)",r=i===e.9M().2D&&!(19&&34),6E.7F(t)),r}(),7z=18(t,e,i,r,s){1b n,o,l,h,u,f,p,19,c,d,m,g,v,x,y=t.3w,T=6D(t,!0);y&&(v=y.2d,x=y.2c),(!r||2>(n=r.1t(" ")).1f)&&(p=t.4s(),e=4r(e).1t(" "),n=[(-1!==e[0].1m("%")?1q(e[0])/1M*p.2D:1q(e[0]))+p.x,(-1!==e[1].1m("%")?1q(e[1])/1M*p.3j:1q(e[1]))+p.y]),i.2d=h=1q(n[0]),i.2c=u=1q(n[1]),r&&T!==5L&&(f=T[0],p=T[1],19=T[2],c=T[3],d=T[4],m=T[5],g=f*c-p*19,o=h*(c/g)+u*(-19/g)+(19*m-c*d)/g,l=h*(-p/g)+u*(f/g)-(f*m-p*d)/g,h=i.2d=n[0]=o,u=i.2c=n[1]=l),y&&(s||s!==!1&&a.9b!==!1?(o=h-v,l=u-x,y.3h+=o*T[0]+l*T[2]-o,y.3s+=o*T[1]+l*T[3]-l):y.3h=y.3s=0),t.4b("1y-2v-6p",n.1I(" "))},6I=18(t){1a!!(9a&&"18"==1k t.4s&&t.99&&(!t.5J||t.5J.4s&&t.5J.99))},5L=[1,0,0,1,0,0],6D=18(t,e){1b i,r,s,n,a,o=t.3w||1j 5a,l=5V;1c(be?r=Q(t,6v,1g,!0):t.3e&&(r=t.3e.2x.2O(R),r=r&&4===r.1f?[r[0].1u(4),1P(r[2].1u(4)),1P(r[1].1u(4)),r[3].1u(4),o.x||0,o.y||0].1I(","):""),i=!r||"3E"===r||"3v(1, 0, 0, 1, 0, 0)"===r,(o.2v||t.4s&&6I(t))&&(i&&-1!==(t.1v[be]+"").1m("3v")&&(r=t.1v[be],i=0),s=t.4U("2Q"),i&&s&&(-1!==s.1m("3v")?(r=s,i=0):-1!==s.1m("5b")&&(r="3v(1,0,0,1,"+s.2O(/(?:\\-|\\b)[\\d\\-\\.e]+\\b/3Q).1I(",")+")",i=0))),i)1a 5L;1d(s=(r||"").2O(/(?:\\-|\\b)[\\d\\-\\.e]+\\b/3Q)||[],2b=s.1f;--2b>-1;)n=1P(s[2b]),s[2b]=(a=n-(n|=0))?(0|a*l+(0>a?-.5:.5))/l+n:n;1a e&&s.1f>6?[s[0],s[1],s[4],s[5],s[12],s[13]]:s},4N=Y.bJ=18(t,i,r,n){1c(t.3w&&r&&!n)1a t.3w;1b o,l,h,u,f,p,19=r?t.3w||1j 5a:1j 5a,c=0>19.2q,d=2e-5,m=5V,g=34?1q(Q(t,4P,i,!1,"0 0 0").1t(" ")[2])||19.32||0:0,v=1q(a.6H)||0;1c(19.2v=!(!t.4s||!6I(t)),19.2v&&(7z(t,Q(t,4P,s,!1,"50% 50%")+"",19,t.4U("1y-2v-6p")),3p=a.9F||9E),o=6D(t),o!==5L){1c(16===o.1f){1b x,y,T,w,b,P=o[0],O=o[1],S=o[2],k=o[3],A=o[4],C=o[5],R=o[6],M=o[7],D=o[8],X=o[9],F=o[10],I=o[12],N=o[13],E=o[14],L=o[11],Y=1i.5k(R,F);19.32&&(E=-19.32,I=D*E-o[12],N=X*E-o[13],E=F*E+19.32-o[14]),19.22=Y*z,Y&&(w=1i.2S(-Y),b=1i.2t(-Y),x=A*w+D*b,y=C*w+X*b,T=R*w+F*b,D=A*-b+D*w,X=C*-b+X*w,F=R*-b+F*w,L=M*-b+L*w,A=x,C=y,R=T),Y=1i.5k(D,F),19.29=Y*z,Y&&(w=1i.2S(-Y),b=1i.2t(-Y),x=P*w-D*b,y=O*w-X*b,T=S*w-F*b,X=O*b+X*w,F=S*b+F*w,L=k*b+L*w,P=x,O=y,S=T),Y=1i.5k(O,P),19.1W=Y*z,Y&&(w=1i.2S(-Y),b=1i.2t(-Y),P=P*w+A*b,y=O*w+C*b,C=O*-b+C*w,R=S*-b+R*w,O=y),19.22&&1i.5T(19.22)+1i.5T(19.1W)>bK.9&&(19.22=19.1W=0,19.29+=3D),19.2q=(0|1i.3f(P*P+O*O)*m+.5)/m,19.2G=(0|1i.3f(C*C+X*X)*m+.5)/m,19.36=(0|1i.3f(R*R+F*F)*m+.5)/m,19.21=0,19.3a=L?1/(0>L?-L:L):0,19.x=I,19.y=N,19.z=E,19.2v&&(19.x-=19.2d-(19.2d*P-19.2c*A),19.y-=19.2c-(19.2c*O-19.2d*C))}1o 1c(!(34&&!n&&o.1f&&19.x===o[4]&&19.y===o[5]&&(19.22||19.29)||2y 0!==19.x&&"3E"===Q(t,"6S",i))){1b B=o.1f>=6,j=B?o[0]:1,V=o[1]||0,U=o[2]||0,q=B?o[3]:1;19.x=o[4]||0,19.y=o[5]||0,h=1i.3f(j*j+V*V),u=1i.3f(q*q+U*U),f=j||V?1i.5k(V,j)*z:19.1W||0,p=U||q?1i.5k(U,q)*z+f:19.21||0,1i.5T(p)>90&&bL>1i.5T(p)&&(c?(h*=-1,p+=0>=f?3D:-3D,f+=0>=f?3D:-3D):(u*=-1,p+=0>=p?3D:-3D)),19.2q=h,19.2G=u,19.1W=f,19.21=p,34&&(19.22=19.29=19.z=0,19.3a=v,19.36=1),19.2v&&(19.x-=19.2d-(19.2d*j+19.2c*U),19.y-=19.2c-(19.2d*V+19.2c*q))}19.32=g;1d(l 1x 19)d>19[l]&&19[l]>-d&&(19[l]=0)}1a r&&(t.3w=19,19.2v&&(3p&&t.1v[be]?e.4v(.6w,18(){4Z(t.1v,be)}):!3p&&t.4U("2Q")&&e.4v(.6w,18(){t.5i("2Q")}))),19},8K=18(t){1b e,i,r=15.1y,s=-r.1W*X,n=s+r.21*X,a=5V,o=(0|1i.2S(s)*r.2q*a)/a,l=(0|1i.2t(s)*r.2q*a)/a,h=(0|1i.2t(n)*-r.2G*a)/a,u=(0|1i.2S(n)*r.2G*a)/a,f=15.t.1v,p=15.t.3e;1c(p){i=l,l=-h,h=-i,e=p.2x,f.2x="";1b 19,c,m=15.t.4X,g=15.t.4Y,v="7J"!==p.4z,x="9A:6z.6B.6A(9t="+o+", 9s="+l+", 9r="+h+", 9q="+u,w=r.x+m*r.1T/1M,b=r.y+g*r.1S/1M;1c(1g!=r.63&&(19=(r.9u?.5W*m*r.63:r.63)-m/2,c=(r.9v?.5W*g*r.6y:r.6y)-g/2,w+=19-(19*o+c*l),b+=c-(19*h+c*u)),v?(19=m/2,c=g/2,x+=", 9y="+(19-(19*o+c*l)+w)+", 9x="+(c-(19*h+c*u)+b)+")"):x+=", bH=\'2m bG\')",f.2x=-1!==e.1m("6z.6B.6A(")?e.1N(M,x):x+" "+e,(0===t||1===t)&&1===o&&0===l&&0===h&&1===u&&(v&&-1===x.1m("9y=0, 9x=0")||T.35(e)&&1M!==1q(4D.$1)||-1===e.1m("d7("&&e.1m("bD"))&&f.5i("2x")),!v){1b P,O,S,k=8>d?1:-1;1d(19=r.5U||0,c=r.66||0,r.5U=1i.3P((m-((0>o?-o:o)*m+(0>l?-l:l)*g))/2+w),r.66=1i.3P((g-((0>u?-u:u)*g+(0>h?-h:h)*m))/2+b),2b=0;4>2b;2b++)O=ee[2b],P=p[O],i=-1!==P.1m("2j")?1q(P):$(15.t,O,1q(P),P.1N(y,""))||0,S=i!==r[O]?2>2b?-r.5U:-r.66:2>2b?19-r.5U:c-r.66,f[O]=(r[O]=1i.3P(i-S*(0===2b||2===2b?1:k)))+"2j"}}},8N=Y.bE=Y.bF=18(t){1b e,i,r,s,n,a,o,l,h,u,f,p,c,d,m,g,v,x,y,T,w,b,P,O=15.1y,S=15.t.1v,k=O.1W,A=O.22,C=O.29,R=O.2q,M=O.2G,D=O.36,z=O.x,F=O.y,I=O.z,N=O.2v,E=O.3a,L=O.47;1c(!((1!==t&&0!==t||"2m"!==L||15.3V.1E!==15.3V.2i&&15.3V.1E)&&L||I||E||C||A)||3p&&N||!34)1a 2y(k||O.21||N?(k*=X,b=O.21*X,P=5V,e=1i.2S(k)*R,s=1i.2t(k)*R,i=1i.2t(k-b)*-M,n=1i.2S(k-b)*M,b&&"9z"===O.4x&&(v=1i.9B(b),v=1i.3f(1+v*v),i*=v,n*=v,O.2T&&(e*=v,s*=v)),N&&(z+=O.2d-(O.2d*e+O.2c*i)+O.3h,F+=O.2c-(O.2d*s+O.2c*n)+O.3s,3p&&(O.1T||O.1S)&&(d=15.t.4s(),z+=.5W*O.1T*d.2D,F+=.5W*O.1S*d.3j),d=1e-6,d>z&&z>-d&&(z=0),d>F&&F>-d&&(F=0)),y=(0|e*P)/P+","+(0|s*P)/P+","+(0|i*P)/P+","+(0|n*P)/P+","+z+","+F+")",N&&3p?15.t.4b("2Q","3v("+y):S[be]=(O.1T||O.1S?"5b("+O.1T+"%,"+O.1S+"%) 3v(":"3v(")+y):S[be]=(O.1T||O.1S?"5b("+O.1T+"%,"+O.1S+"%) 3v(":"3v(")+R+",0,0,"+M+","+z+","+F+")");1c(19&&(d=1e-4,d>R&&R>-d&&(R=D=2e-5),d>M&&M>-d&&(M=D=2e-5),!E||O.z||O.22||O.29||(E=0)),k||O.21)k*=X,m=e=1i.2S(k),g=s=1i.2t(k),O.21&&(k-=O.21*X,m=1i.2S(k),g=1i.2t(k),"9z"===O.4x&&(v=1i.9B(O.21*X),v=1i.3f(1+v*v),m*=v,g*=v,O.2T&&(e*=v,s*=v))),i=-g,n=m;1o{1c(!(C||A||1!==D||E||N))1a 2y(S[be]=(O.1T||O.1S?"5b("+O.1T+"%,"+O.1S+"%) 9I(":"9I(")+z+"2j,"+F+"2j,"+I+"2j)"+(1!==R||1!==M?" 5j("+R+","+M+")":""));e=n=1,i=s=0}h=1,r=a=o=l=u=f=0,p=E?-1/E:0,c=O.32,d=1e-6,T=",",w="0",k=C*X,k&&(m=1i.2S(k),g=1i.2t(k),o=-g,u=p*-g,r=e*g,a=s*g,h=m,p*=m,e*=m,s*=m),k=A*X,k&&(m=1i.2S(k),g=1i.2t(k),v=i*m+r*g,x=n*m+a*g,l=h*g,f=p*g,r=i*-g+r*m,a=n*-g+a*m,h*=m,p*=m,i=v,n=x),1!==D&&(r*=D,a*=D,h*=D,p*=D),1!==M&&(i*=M,n*=M,l*=M,f*=M),1!==R&&(e*=R,s*=R,o*=R,u*=R),(c||N)&&(c&&(z+=r*-c,F+=a*-c,I+=h*-c+c),N&&(z+=O.2d-(O.2d*e+O.2c*i)+O.3h,F+=O.2c-(O.2d*s+O.2c*n)+O.3s),d>z&&z>-d&&(z=w),d>F&&F>-d&&(F=w),d>I&&I>-d&&(I=0)),y=O.1T||O.1S?"5b("+O.1T+"%,"+O.1S+"%) 97(":"97(",y+=(d>e&&e>-d?w:e)+T+(d>s&&s>-d?w:s)+T+(d>o&&o>-d?w:o),y+=T+(d>u&&u>-d?w:u)+T+(d>i&&i>-d?w:i)+T+(d>n&&n>-d?w:n),A||C?(y+=T+(d>l&&l>-d?w:l)+T+(d>f&&f>-d?w:f)+T+(d>r&&r>-d?w:r),y+=T+(d>a&&a>-d?w:a)+T+(d>h&&h>-d?w:h)+T+(d>p&&p>-d?w:p)+T):y+=",0,0,0,0,1,0,",y+=z+T+F+T+I+T+(E?1+-I/E:1)+")",S[be]=y};h=5a.1A,h.x=h.y=h.z=h.21=h.2T=h.1W=h.22=h.29=h.32=h.1T=h.1S=h.3h=h.3s=0,h.2q=h.2G=h.36=1,1Q("2Q,5j,2q,2G,36,x,y,z,1W,22,29,7s,21,2T,7t,7v,7m,bM,5x,7w,7Y,7V,9R,47,4x,1T,1S,8S",{2g:18(t,e,i,r,n,o,l){1c(r.73===l)1a n;r.73=l;1b h,u,f,p,19,c,d,m,g,v=t.3w,x=r.3I=4N(t,s,!0,l.9R),y=t.1v,T=1e-6,w=7u.1f,b=l,P={},O="5x";1c("1O"==1k b.2Q&&be)f=E.1v,f[be]=b.2Q,f.6S="bN",f.4z="7J",I.7D.65(E),h=4N(E,1g,!1),I.7D.7F(E),1g!=b.1T&&(h.1T=2H(b.1T,x.1T)),1g!=b.1S&&(h.1S=2H(b.1S,x.1S));1o 1c("4q"==1k b){1c(h={2q:2H(1g!=b.2q?b.2q:b.5j,x.2q),2G:2H(1g!=b.2G?b.2G:b.5j,x.2G),36:2H(b.36,x.36),x:2H(b.x,x.x),y:2H(b.y,x.y),z:2H(b.z,x.z),1T:2H(b.1T,x.1T),1S:2H(b.1S,x.1S),3a:2H(b.7Y,x.3a)},d=b.7V,1g!=d)1c("4q"==1k d)1d(f 1x d)b[f]=d[f];1o b.1W=d;"1O"==1k b.x&&-1!==b.x.1m("%")&&(h.x=0,h.1T=2H(b.x,x.1T)),"1O"==1k b.y&&-1!==b.y.1m("%")&&(h.y=0,h.1S=2H(b.y,x.1S)),h.1W=ae("1W"1x b?b.1W:"7t"1x b?b.7t+"7p":"7s"1x b?b.7s:x.1W,x.1W,"1W",P),34&&(h.22=ae("22"1x b?b.22:"7v"1x b?b.7v+"7p":x.22||0,x.22,"22",P),h.29=ae("29"1x b?b.29:"7m"1x b?b.7m+"7p":x.29||0,x.29,"29",P)),h.21=1g==b.21?x.21:ae(b.21,x.21),h.2T=1g==b.2T?x.2T:ae(b.2T,x.2T),(u=h.2T-x.2T)&&(h.21+=u,h.1W+=u)}1d(34&&1g!=b.47&&(x.47=b.47,c=!0),x.4x=b.4x||x.4x||a.8G,19=x.47||x.z||x.22||x.29||h.z||h.22||h.29||h.3a,19||1g==b.5j||(h.36=1);--w>-1;)i=7u[w],p=h[i]-x[i],(p>T||-T>p||1g!=b[i]||1g!=F[i])&&(c=!0,n=1j ce(x,i,x[i],p,n),i 1x P&&(n.e=P[i]),n.1U=0,n.2L=o,r.2P.24(n.n));1a p=b.5x,x.2v&&(p||b.7w)&&(m=x.3h,g=x.3s,7z(t,4r(p),h,b.7w,b.8S),n=de(x,"2d",(v?x:h).2d,h.2d,n,O),n=de(x,"2c",(v?x:h).2c,h.2c,n,O),(m!==x.3h||g!==x.3s)&&(n=de(x,"3h",v?m:x.3h,x.3h,n,O),n=de(x,"3s",v?g:x.3s,x.3s,n,O)),p=3p?1g:"1L 1L"),(p||34&&19&&x.32)&&(be?(c=!0,i=4P,p=(p||Q(t,i,s,!1,"50% 50%"))+"",n=1j ce(y,i,0,0,n,-1,O),n.b=y[i],n.2L=o,34?(f=x.32,p=p.1t(" "),x.32=(p.1f>2&&(0===f||"1L"!==p[2])?1q(p[2]):f)||0,n.1U=n.e=p[0]+" "+(p[1]||"50%")+" 1L",n=1j ce(x,"32",0,0,n,-1,n.n),n.b=f,n.1U=n.e=x.32):n.1U=n.e=p):4r(p+"",x)),c&&(r.4k=x.2v&&3p||!19&&3!==15.4k?2:3),n},39:!0}),1Q("bU",{2I:"1L 1L 1L 1L #9w",39:!0,4G:!0,4m:!0,5z:"7I"}),1Q("bV",{2I:"1L",2g:18(t,e,i,n,a){e=15.3d(e);1b o,l,h,u,f,p,19,c,d,m,g,v,x,y,T,w,b=["bW","bX","bT","bS"],P=t.1v;1d(d=1q(t.4X),m=1q(t.4Y),o=e.1t(" "),l=0;b.1f>l;l++)15.p.1m("4w")&&(b[l]=Z(b[l])),f=u=Q(t,b[l],s,!1,"1L"),-1!==f.1m(" ")&&(u=f.1t(" "),f=u[0],u=u[1]),p=h=o[l],19=1q(f),v=f.1u((19+"").1f),x="="===p.1z(1),x?(c=3l(p.1z(0)+"1",10),p=p.1u(2),c*=1q(p),g=p.1u((c+"").1f-(0>c?1:0))||""):(c=1q(p),g=p.1u((c+"").1f)),""===g&&(g=r[i]||v),g!==v&&(y=$(t,"8o",19,v),T=$(t,"bO",19,v),"%"===g?(f=1M*(y/d)+"%",u=1M*(T/m)+"%"):"em"===g?(w=$(t,"8o",1,"em"),f=y/w+"em",u=T/w+"em"):(f=y+"2j",u=T+"2j"),x&&(p=1q(f)+c+g,h=1q(u)+c+g)),a=5l(P,b[l],f+" "+u,p+" "+h,!1,"1L",a);1a a},39:!0,5w:7k("1L 1L 1L 1L",!1,!0)}),1Q("bP",{2I:"0 0",2g:18(t,e,i,r,n,a){1b o,l,h,u,f,p,19="bQ-4z",c=s||G(t,1g),m=15.3d((c?d?c.4o(19+"-x")+" "+c.4o(19+"-y"):c.4o(19):t.3e.bR+" "+t.3e.cm)||"0 0"),g=15.3d(e);1c(-1!==m.1m("%")!=(-1!==g.1m("%"))&&(p=Q(t,"cn").1N(k,""),p&&"3E"!==p)){1d(o=m.1t(" "),l=g.1t(" "),L.4b("cR",p),h=2;--h>-1;)m=o[h],u=-1!==m.1m("%"),u!==(-1!==l[h].1m("%"))&&(f=0===h?t.4X-L.2D:t.4Y-L.3j,o[h]=u?1q(m)/1M*f+"2j":1M*(1q(m)/f)+"%");m=o.1I(" ")}1a 15.4u(t.1v,m,g,n,a)},5w:4r}),1Q("cS",{2I:"0 0",5w:4r}),1Q("3a",{2I:"1L",39:!0}),1Q("cT",{2I:"50% 50%",39:!0}),1Q("cU",{39:!0}),1Q("cQ",{39:!0}),1Q("cP",{39:!0}),1Q("7H",{2g:68("9X,9f,98,9p")}),1Q("7q",{2g:68("cL,cM,cN,cO")}),1Q("cV",{2I:"7G(1L,1L,1L,1L)",2g:18(t,e,i,r,n,a){1b o,l,h;1a 9>d?(l=t.3e,h=8>d?" ":",",o="7G("+l.cW+h+l.d3+h+l.d4+h+l.d5+")",e=15.3d(e).1t(",").1I(h)):(o=15.3d(Q(t,15.p,s,!1,15.4t)),e=15.3d(e)),15.4u(t.1v,o,e,n,a)}}),1Q("d2",{2I:"1L 1L 1L #9w",4G:!0,4m:!0}),1Q("7M,8D",{2g:18(t,e,i,r,s){1a s}}),1Q("4w",{2I:"1L 6k #6x",2g:18(t,e,i,r,n,a){1a 15.4u(t.1v,15.3d(Q(t,"6C",s,!1,"1L")+" "+Q(t,"d1",s,!1,"6k")+" "+Q(t,"cX",s,!1,"#6x")),15.3d(e),n,a)},4G:!0,5w:18(t){1b e=t.1t(" ");1a e[0]+" "+(e[1]||"6k")+" "+(t.2O(3W)||["#6x"])[0]}}),1Q("cY",{2g:68("6C,cZ,d0,92")}),1Q("cK,6J,9c",{2g:18(t,e,i,r,s){1b n=t.1v,a="6J"1x n?"6J":"9c";1a 1j ce(n,a,0,0,s,-1,i,!1,0,n[a],e)}});1b 9O=18(t){1b e,i=15.t,r=i.2x||Q(15.1y,"2x")||"",s=0|15.s+15.c*t;1M===s&&(-1===r.1m("cJ(")&&-1===r.1m("cu(")&&-1===r.1m("cv(")?(i.5i("2x"),e=!Q(15.1y,"2x")):(i.2x=r.1N(b,""),e=!0)),e||(15.3Y&&(i.2x=r=r||"3U(2a="+s+")"),-1===r.1m("cw")?0===s&&15.3Y||(i.2x=r+" 3U(2a="+s+")"):i.2x=r.1N(T,"2a="+s))};1Q("2a,3U,5F",{2I:"1",2g:18(t,e,i,r,n,a){1b o=1q(Q(t,"2a",s,!1,"1")),l=t.1v,h="5F"===i;1a"1O"==1k e&&"="===e.1z(1)&&(e=("-"===e.1z(0)?-1:1)*1q(e.1u(2))+o),h&&1===o&&"6c"===Q(t,"7r",s)&&0!==e&&(o=0),j?n=1j ce(l,"2a",o,e-o,n):(n=1j ce(l,"2a",1M*o,1M*(e-o),n),n.3Y=h?1:0,l.8L=1,n.2f=2,n.b="3U(2a="+n.s+")",n.e="3U(2a="+(n.s+n.c)+")",n.1y=t,n.2L=a,n.1Y=9O),h&&(n=1j ce(l,"7r",0,0,n,-1,1g,!1,0,0!==o?"6t":"6c",0===e?"6c":"6t"),n.1U="6t",r.2P.24(n.n),r.2P.24(i)),n}});1b 4Z=18(t,e){e&&(t.9N?(("6a"===e.1u(0,2)||"9U"===e.1u(0,6))&&(e="-"+e),t.9N(e.1N(O,"-$1").6i())):t.5i(e))},81=18(t){1c(15.t.54=15,1===t||0===t){15.t.4b("4l",0===t?15.b:15.e);1d(1b e=15.1y,i=15.t.1v;e;)e.v?i[e.p]=e.v:4Z(i,e.p),e=e.1h;1===t&&15.t.54===15&&(15.t.54=1g)}1o 15.t.4U("4l")!==15.e&&15.t.4b("4l",15.e)};1Q("3M",{2g:18(t,e,r,n,a,o,l){1b h,u,f,p,19,c=t.4U("4l")||"",d=t.1v.3B;1c(a=n.7E=1j ce(t,r,0,0,a,2),a.1Y=81,a.2w=-11,i=!0,a.b=c,u=K(t,s),f=t.54){1d(p={},19=f.1y;19;)p[19.p]=1,19=19.1h;f.1Y(1)}1a t.54=a,a.e="="!==e.1z(1)?e:c.1N(4D("\\\\s*\\\\b"+e.1u(2)+"\\\\b"),"")+("+"===e.1z(0)?" "+e.1u(2):""),t.4b("4l",a.e),h=J(t,u,K(t),l,p),t.4b("4l",c),a.1y=h.4R,t.1v.3B=d,a=a.46=n.31(t,h.5O,a,o)}});1b 7U=18(t){1c((1===t||0===t)&&15.1y.1E===15.1y.2i&&"82"!==15.1y.1y){1b e,i,r,s,n,a=15.t.1v,o=l.2Q.31;1c("4A"===15.e)a.3B="",s=!0;1o 1d(e=15.e.1t(" ").1I("").1t(","),r=e.1f;--r>-1;)i=e[r],l[i]&&(l[i].31===o?s=!0:i="5x"===i?4P:l[i].p),4Z(a,i);s&&(4Z(a,be),n=15.t.3w,n&&(n.2v&&15.t.5i("1y-2v-6p"),4d 15.t.3w))}};1d(1Q("cx",{2g:18(t,e,r,s,n){1a n=1j ce(t,r,0,0,n,2),n.1Y=7U,n.e=e,n.2w=-10,n.1y=s.3u,i=!0,n}}),h="ct,cs,co,cp".1t(","),2b=h.1f;2b--;)89(h[2b]);h=a.1A,h.1s=h.73=h.3I=1g,h.72=18(t,e,o){1c(!t.3S)1a!1;15.7Z=t,15.3u=o,15.7K=e,u=e.7M,i=!1,r=e.79||a.79,s=G(t,""),n=15.2P;1b h,19,d,m,g,v,x,y,T,b=t.1v;1c(f&&""===b.4c&&(h=Q(t,"4c",s),("2m"===h||""===h)&&15.6l(b,"4c",0)),"1O"==1k e&&(m=b.3B,h=K(t,s),b.3B=m+";"+e,h=J(t,h,K(t)).5O,!j&&w.35(e)&&(h.2a=1q(4D.$1)),e=h,b.3B=m),15.1s=19=e.3M?l.3M.31(t,e.3M,"3M",15,1g,1g,e):15.31(t,e,1g),15.4k){1d(T=3===15.4k,be?p&&(f=!0,""===b.4c&&(x=Q(t,"4c",s),("2m"===x||""===x)&&15.6l(b,"4c",0)),c&&15.6l(b,"7L",15.7K.7L||(T?"cq":"6c"))):b.8L=1,d=19;d&&d.1h;)d=d.1h;y=1j ce(t,"2Q",0,0,1g,2),15.5y(y,1g,d),y.1Y=be?8N:8K,y.1y=15.3I||4N(t,s,!0),y.3V=o,y.2w=-1,n.4K()}1c(i){1d(;19;){1d(v=19.1h,d=m;d&&d.2w>19.2w;)d=d.1h;(19.1n=d?d.1n:g)?19.1n.1h=19:m=19,(19.1h=d)?d.1n=19:g=19,19=v}15.1s=m}1a!0},h.31=18(t,e,i,n){1b a,o,h,f,p,19,c,d,m,g,v=t.1v;1d(a 1x e)19=e[a],o=l[a],o?i=o.31(t,19,a,15,i,n,e):(p=Q(t,a,s)+"",m="1O"==1k 19,"4G"===a||"cr"===a||"cy"===a||-1!==a.1m("cz")||m&&P.35(19)?(m||(19=6d(19),19=(19.1f>3?"6Z(":"6e(")+19.1I(",")+")"),i=5l(v,a,p,19,!0,"4L",i,0,n)):!m||-1===19.1m(" ")&&-1===19.1m(",")?(h=1q(p),c=h||0===h?p.1u((h+"").1f):"",(""===p||"2m"===p)&&("2D"===a||"3j"===a?(h=8R(t,a,s),c="2j"):"51"===a||"4T"===a?(h=H(t,a,s),c="2j"):(h="2a"!==a?0:1,c="")),g=m&&"="===19.1z(1),g?(f=3l(19.1z(0)+"1",10),19=19.1u(2),f*=1q(19),d=19.1N(y,"")):(f=1q(19),d=m?19.1N(y,""):""),""===d&&(d=a 1x r?r[a]:c),19=f||0===f?(g?f+h:f)+d:e[a],c!==d&&""!==d&&(f||0===f)&&h&&(h=$(t,a,h,c),"%"===d?(h/=$(t,a,1M,"%")/1M,e.8D!==!0&&(p=h+"%")):"em"===d?h/=$(t,a,1,"em"):"2j"!==d&&(f=$(t,a,f,d),d="2j"),g&&(f||0===f)&&(19=f+h+d)),g&&(f+=h),!h&&0!==h||!f&&0!==f?2y 0!==v[a]&&(19||"cG"!=19+""&&1g!=19)?(i=1j ce(v,a,f||h||0,0,i,-1,a,!1,0,p,19),i.1U="3E"!==19||"6S"!==a&&-1===a.1m("cH")?19:p):U("cI "+a+" 3V cF: "+e[a]):(i=1j ce(v,a,h,f-h,i,0,a,u!==!1&&("2j"===d||"4c"===a),0,p,19),i.1U=d)):i=5l(v,a,p,19,!0,1g,i,0,n)),n&&i&&!i.2L&&(i.2L=n);1a i},h.1Y=18(t){1b e,i,r,s=15.1s,n=1e-6;1c(1!==t||15.3u.1p!==15.3u.1D&&0!==15.3u.1p)1c(t||15.3u.1p!==15.3u.1D&&0!==15.3u.1p||15.3u.1B===-1e-6)1d(;s;){1c(e=s.c*t+s.s,s.r?e=1i.3P(e):n>e&&e>-n&&(e=0),s.2f)1c(1===s.2f)1c(r=s.l,2===r)s.t[s.p]=s.1U+e+s.4h+s.3Y+s.6g;1o 1c(3===r)s.t[s.p]=s.1U+e+s.4h+s.3Y+s.6g+s.6L+s.6N;1o 1c(4===r)s.t[s.p]=s.1U+e+s.4h+s.3Y+s.6g+s.6L+s.6N+s.8Q+s.8V;1o 1c(5===r)s.t[s.p]=s.1U+e+s.4h+s.3Y+s.6g+s.6L+s.6N+s.8Q+s.8V+s.cE+s.cA;1o{1d(i=s.1U+e+s.4h,r=1;s.l>r;r++)i+=s["3r"+r]+s["38"+(r+1)];s.t[s.p]=i}1o-1===s.2f?s.t[s.p]=s.1U:s.1Y&&s.1Y(t);1o s.t[s.p]=e+s.1U;s=s.1h}1o 1d(;s;)2!==s.2f?s.t[s.p]=s.b:s.1Y(t),s=s.1h;1o 1d(;s;){1c(2!==s.2f)1c(s.r&&-1!==s.2f)1c(e=1i.3P(s.s+s.c),s.2f){1c(1===s.2f){1d(r=s.l,i=s.1U+e+s.4h,r=1;s.l>r;r++)i+=s["3r"+r]+s["38"+(r+1)];s.t[s.p]=i}}1o s.t[s.p]=e+s.1U;1o s.t[s.p]=s.e;1o s.1Y(t);s=s.1h}},h.cB=18(t){15.3I=15.3I||4N(15.7Z,s,!0),15.4k=15.3I.2v&&3p||!t&&3!==15.4k?2:3};1b 8m=18(){15.t[15.p]=15.e,15.1y.5y(15,15.1h,1g,!0)};h.6l=18(t,e,i){1b r=15.1s=1j ce(t,e,0,0,15.1s,2);r.e=i,r.1Y=8m,r.1y=15},h.5y=18(t,e,i,r){1a t&&(e&&(e.1n=t),t.1h&&(t.1h.1n=t.1n),t.1n?t.1n.1h=t.1h:15.1s===t&&(15.1s=t.1h,r=!0),i?i.1h=t:r||1g!==15.1s||(15.1s=t),t.1h=e,t.1n=i),t},h.2s=18(e){1b i,r,s,n=e;1c(e.5F||e.3U){n={};1d(r 1x e)n[r]=e[r];n.2a=1,n.5F&&(n.7r=1)}1a e.3M&&(i=15.7E)&&(s=i.46,s&&s.1n?15.5y(s.1n,i.1h,s.1n.1n):s===15.1s&&(15.1s=i.1h),i.1h&&15.5y(i.1h,i.1h.1h,s.1n),15.7E=1g),t.1A.2s.2h(15,n)};1b 53=18(t,e,i){1b r,s,n,a;1c(t.cC)1d(s=t.1f;--s>-1;)53(t[s],e,i);1o 1d(r=t.8c,s=r.1f;--s>-1;)n=r[s],a=n.2f,n.1v&&(e.24(K(n)),i&&i.24(n)),1!==a&&9!==a&&11!==a||!n.8c.1f||53(n,e,i)};1a a.cD=18(t,i,r){1b s,n,a,o,l=e.4p(t,i,r),h=[l],u=[],f=[],p=[],19=e.5f.9C;1d(t=l.2N||l.2J,53(t,u,p),l.1G(i,!0,!0),53(t,f),l.1G(0,!0,!0),l.1H(!0),s=p.1f;--s>-1;)1c(n=J(p[s],u[s],f[s]),n.4R){n=n.5O;1d(a 1x r)19[a]&&(n[a]=r[a]);o={};1d(a 1x n)o[a]=u[s][a];h.24(e.5Z(p[s],i,o,n))}1a h},t.6O([a]),a},!0)}),1J.3J&&1J.3t.4K()(),18(t){"4I 4J";1b e=18(){1a(1J.5r||1J)[t]};"18"==1k 3H&&3H.6R?3H(["3A"],e):"37"!=1k 2k&&2k.3n&&(8i("../3A.6V"),2k.3n=e())}("9L");', 0, 901, "|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||this|||function|_|return|var|if|for||length|null|_next|Math|new|typeof|_startTime|indexOf|_prev|else|_time|parseFloat|_timeline|_firstPT|split|substr|style|vars|in|data|charAt|prototype|_rawPrevTime|_timeScale|_duration|_totalTime|_paused|render|_enabled|join|_gsScope|_gc|0px|100|replace|string|Number|xe|255|yPercent|xPercent|xs0|add|rotation|immediateRender|setRatio|_startAt||skewX|rotationX|_p1|push||timeline|totalDuration|_first|rotationY|opacity|ge|yOrigin|xOrigin||type|parser|call|_totalDuration|px|module|_active|auto|arguments|_p2|instanceof|scaleX|smoothChildTiming|_kill|sin|_initted|svg|pr|filter|void|_dirty|easing|duration|getRatio|width|number|_reversed|scaleY|ne|defaultValue|target|_delay|plugin|_ease|_targets|match|_overwriteProps|transform|totalTime|cos|skewY|_labels|constructor|paused|5625|128|lazy||parse|zOrigin||Se|test|scaleZ|undefined|xs|prefix|perspective|_siblings|splice|format|currentStyle|sqrt|wake|xOffset|_last|height|_lazy|parseInt|_uncache|exports|startAt|Te|time|xn|yOffset|_gsQueue|_tween|matrix|_gsTransform|ratio|config|_overwrittenProps|TweenLite|cssText|frame|180|none|_parseTimeOrLabel|global|define|_transform|_gsDefine|_p3|pow|className|autoRemoveChildren|_onUpdate|round|gi|kill|nodeType|_calcEnd|alpha|tween|ue|tweens|xn1|onReverseComplete|_remove|seek|Array|window|oe||xfirst|force3D|selector|API|_propLookup|setAttribute|zIndex|delete|ease|appendXtra|rawTime|xs1|apply|_callback|_transformType|class|multi|_listeners|getPropertyValue|to|object|re|getBBox|dflt|parseComplex|delayedCall|border|skewType|reversed|position|all|onUpdate|getTweensOf|RegExp|onComplete|delay|color|invalidate|use|strict|pop|transparent|version|Ie|concat|Oe|set|firstMPT|PI|top|getAttribute|_sortChildren|_recent|offsetWidth|offsetHeight|Ye||left|document|Ue|_gsClassPT||_notifyPluginsOfEnabled|css|_forcingPlayhead|sc|ke|translate|isActive|runBackwards|overwrite|_internals|_pauseTime|onStart|removeAttribute|scale|atan2|me|_initProps|onOverwrite|greensock|com|plugins|GreenSockGlobals|callbackScope|_propName|pg|self|formatter|transformOrigin|_linkCSSP|keyword|easeInOut|isPause|gsClass|prev|next|autoAlpha|easeIn|le|createElementNS|parentNode|9999999999|ze|repeat|core|difs|rxp|toUpperCase|_swapSelfInParams|_onInitAllProps|abs|ieOffsetX|1e5|01|getChildren|192|fromTo||remove|_e|ox|_onPluginEvent|appendChild|ieOffsetY|sleep|pe|easeParams|ms|_gsTweenID|hidden|he|rgb|Ticker|xs2|tick|toLowerCase|setTimeout|solid|_addLazySet|360|priority|ve|origin|from|hsl|onCompleteParams|inherit|se|Pe|001|000|oy|DXImageTransform|Matrix|Microsoft|borderTopWidth|Fe|Re|Ce|staggerTo|defaultTransformPerspective|Xe|cssFloat|Left|xn2|timeScale|xs3|activate|SlowMo|check|amd|display|fps|easeOut|js|9375|984375|625|rgba|globals|_gsCache|_onInitTween|_lastParsedTransform|_priority||isNaN|center|ticker|suffixMap|_params|_func|_hasPausedChild|console|lagSmoothing|pause|throw|TweenMax|_easeType|_overwrite|fe|useFrames|shortRotationY|autoCSS|_init|_short|padding|visibility|rotationZ|shortRotation|we|shortRotationX|svgOrigin|_onDisable|autoSleep|De|_power|defaultEase|_type|body|_classNamePT|removeChild|rect|margin|inset|absolute|_vars|WebkitBackfaceVisibility|autoRound|defaultView|defaultOverwrite|play|log|_eventTarget|exec|Quad|je|directionalRotation|Cannot|jQuery|transformPerspective|_target|reverse|Be|isFromStart|red|Date|insert|Right|addLabel|filters|ye|Top|te|childNodes|bottom|right|Width|removeLabel|Scope|require|useRAF|gap|1e3|Ve|_rootFramesTimeline|borderLeft|EventDispatcher|events|_easePower|TimelineLite|random|break|dispatchEvent|_p|Back|register|_class|Ease|strength|template|strictUnits|2e3|url|defaultSkewType|_updateRoot|Params|_contains|Ne|zoom|startTime|Ee|TweenPlugin|get|xn3|ie|smoothOrigin|shiftChildren|GreenSockAMDPath|xs4|SteppedEase|RoughEase|map|up||querySelectorAll|borderLeftWidth|Animation|Android|SimpleTimeline|onReverseCompleteParams|matrix3d|marginBottom|getCTM|Ae|defaultSmoothOrigin|styleFloat|org|clrs|marginRight|isSelector|not|_onEnable|Transform|w3|www|http|defaultForce3D|Linear|marginLeft|M22|M21|M12|M11|oxp|oyp|999|Dy|Dx|simple|progid|tan|reservedProps|func|Me|useSVGTransformAttr|_roundProps|init|translate3d|propName|120|CSSPlugin|getBoundingClientRect|removeProperty|Le|lazyRender|Plugin|parseTransform|autoRotate|proxy|webkit|addEventListener|black|marginTop|isArray|lazyTweens|exportRoot|toString|normal|_super|definition|500|_addTween|525|CancelRequestAnimationFrame|tweenLookup|resume|eventCallback|onRepeatScope|999999999999||getElementById|start|restart|usesFrames|killTweensOf|sequence|overwriteProps|_plugins|swing|clearTimeout|_rootTimeline|killDelayedCallsTo|repeatDelay|false|onCompleteScope|allOnStart|preexisting|cancelAnimationFrame|staggerFrom|illegal|Object|_tempKill|staggerFromTo|yoyo|min|initAll|004|70158|easeNone|1500|requestAnimationFrame|concurrent|encountered|Quint|now|pauseCallback|Strong|jquery|endTime|onReverseCompleteScope|recent|insertMultiple|continue|Quart|_autoCSS|onUpdateParams|onStartScope|onStartParams|stagger|getLabelTime|addPause|stop|onUpdateScope|appendMultiple|gotoAndStop|align|gotoAndPlay|Power|append|it|the||dependency|is|onRepeatParams|into|missing|CancelAnimationFrame|GSAP|removeEventListener|BackOut|true|RequestAnimationFrame|moz|totalProgress|getTime|Cubic|clear|progress|on|or|onRepeat|linear|_dummyGS|file|BackIn|Alpha|set3DTransformRatio|setTransformRatio|expand|sizingMethod|chrome|getTransform|359|270|shortRotationZ|block|borderTop|backgroundPosition|background|backgroundPositionX|borderBottomLeftRadius|borderBottomRightRadius|boxShadow|borderRadius|borderTopLeftRadius|borderTopRightRadius|documentElement|setAttributeNS|parseColor|hsla|_setPluginRatio|_parseToProxy|cyan|203|gray|purple|green|pink|end|pt|loaded|registerSpecialProp||SVGElement|2000|Error|_cssRegister|CSSPropTween|collapsible|_registerComplexSpecialProp|backgroundPositionY|backgroundImage|physicsProps|physics2D|visible|fill|throwProps|bezier|radient|oader|pacity|clearProps|stroke|Color|xs5|_enableTransforms|slice|cascadeTo|xn4|value|NaN|Style|invalid|atrix|float|paddingTop|paddingRight|paddingBottom|paddingLeft|userSelect|backfaceVisibility|src|backgroundSize|perspectiveOrigin|transformStyle|clip|clipTop|borderTopColor|borderWidth|borderRightWidth|borderBottomWidth|borderTopStyle|textShadow|clipRight|clipBottom|clipLeft|165|gradient|1999|Z0|xhtml|createElement|div|zA||lineHeight|find|orange|compensated|fontSize|img|_specialProps|Trident|MSIE|points|taper|1px|Firefox|Version|navigator|userAgent|Safari|Chrome|EaseLookup|SineInOut|randomize|clamp|Circ|CircOut|CircIn|out|sort|Bounce|BounceOut|BounceIn|BounceInOut|CircInOut|asin|ExpoInOut|ExpoIn|Sine|SineOut|SineIn|ExpoOut|Expo|Elastic|ElasticOut|ElasticIn|ElasticInOut|999999999|rv|_cw|short|convertToPixels|ccw|getStyle|lime|getComputedStyle|aqua|rad|oyr|calculateOffset|cacheWidths|clientHeight|offset|Origin||clientWidth|oxr|Bottom|line|Webkit|BackInOut|silver||white|fuchsia|yellow|olive|blue|navy|maroon|Ms|Moz|teal".split("|"), 0, {})), eval(function (e, t, a, i, l, r) { for (l = function (e) { return (e < 62 ? "" : l(parseInt(e / 62))) + ((e %= 62) > 35 ? String.fromCharCode(e + 29) : e.toString(36)) }; a--;)i[a] && (e = e.replace(new RegExp("\\b" + l(a) + "\\b", "g"), i[a])); return e }('20 1Z={27:[{j:"13 N E",d:1,g:1,f:{e:0,i:"o"},c:{n:"W",b:"1e",a:G,h:"r"}},{j:"13 N r",d:1,g:1,f:{e:0,i:"o"},c:{n:"W",b:"1e",a:G,h:"E"}},{j:"13 N L",d:1,g:1,f:{e:0,i:"o"},c:{n:"W",b:"1e",a:G,h:"J"}},{j:"13 N J",d:1,g:1,f:{e:0,i:"o"},c:{n:"W",b:"1e",a:G,h:"L"}},{j:"26",d:1,g:1,f:{e:0,i:"o"},c:{n:"14",b:"1e",a:G,h:"r"}},{j:"Z R o",d:[2,4],g:[4,7],f:{e:1k,i:"o"},c:{n:"14",b:"z",a:G,h:"r"}},{j:"Z R D",d:[2,4],g:[4,7],f:{e:1k,i:"D"},c:{n:"14",b:"z",a:G,h:"r"}},{j:"Z R 1j-o",d:[2,4],g:[4,7],f:{e:1k,i:"1j-o"},c:{n:"14",b:"z",a:G,h:"r"}},{j:"Z R 1j-D",d:[2,4],g:[4,7],f:{e:1k,i:"1j-D"},c:{n:"14",b:"z",a:G,h:"r"}},{j:"Z R (k)",d:[2,4],g:[4,7],f:{e:1k,i:"k"},c:{n:"14",b:"z",a:G,h:"r"}},{j:"1y 1H N E",d:1,g:1s,f:{e:25,i:"D"},c:{n:"14",b:"1X",a:V,h:"r"}},{j:"1y 1H N r",d:1,g:1s,f:{e:25,i:"o"},c:{n:"14",b:"w",a:V,h:"r"}},{j:"1y 1H N L",d:1s,g:1,f:{e:25,i:"1j-D"},c:{n:"14",b:"w",a:V,h:"r"}},{j:"1y 1H N J",d:1s,g:1,f:{e:25,i:"1j-o"},c:{n:"14",b:"w",a:V,h:"r"}},{j:"1y Y N E",d:1,g:25,f:{e:1k,i:"D"},c:{n:"W",b:"w",a:1g,h:"r"}},{j:"1y Y N r",d:1,g:25,f:{e:1k,i:"o"},c:{n:"W",b:"w",a:1g,h:"E"}},{j:"1y 1W N L",d:25,g:1,f:{e:1k,i:"1j-D"},c:{n:"W",b:"w",a:1g,h:"J"}},{j:"1y Y N J",d:25,g:1,f:{e:1k,i:"1j-o"},c:{n:"W",b:"w",a:1g,h:"L"}},{j:"13 R m E (k)",d:[2,4],g:[4,7],f:{e:1f,i:"k"},c:{n:"W",b:"z",a:1m,h:"E"}},{j:"13 R m r (k)",d:[2,4],g:[4,7],f:{e:1f,i:"k"},c:{n:"W",b:"z",a:1m,h:"r"}},{j:"13 R m L (k)",d:[2,4],g:[4,7],f:{e:1f,i:"k"},c:{n:"W",b:"z",a:1m,h:"L"}},{j:"13 R m J (k)",d:[2,4],g:[4,7],f:{e:1f,i:"k"},c:{n:"W",b:"z",a:1m,h:"J"}},{j:"13 k R m k 1S",d:[2,4],g:[4,7],f:{e:1f,i:"k"},c:{n:"W",b:"z",a:1m,h:"k"}},{j:"13 d m E (o)",d:[7,11],g:1,f:{e:1d,i:"o"},c:{n:"W",b:"w",a:p,h:"E"}},{j:"13 d m E (D)",d:[7,11],g:1,f:{e:1d,i:"D"},c:{n:"W",b:"w",a:p,h:"E"}},{j:"13 d m E (k)",d:[7,11],g:1,f:{e:1d,i:"k"},c:{n:"W",b:"w",a:p,h:"E"}},{j:"13 d m r (o)",d:[7,11],g:1,f:{e:1d,i:"o"},c:{n:"W",b:"w",a:p,h:"r"}},{j:"13 d m r (D)",d:[7,11],g:1,f:{e:1d,i:"D"},c:{n:"W",b:"w",a:p,h:"r"}},{j:"13 d m r (k)",d:[7,11],g:1,f:{e:1d,i:"k"},c:{n:"W",b:"w",a:p,h:"r"}},{j:"13 d N J m L (o)",d:[7,11],g:1,f:{e:1d,i:"o"},c:{n:"W",b:"w",a:p,h:"L"}},{j:"13 d N J m L (k)",d:[7,11],g:1,f:{e:1d,i:"k"},c:{n:"W",b:"w",a:p,h:"L"}},{j:"13 d N L m J (D)",d:[7,11],g:1,f:{e:1d,i:"D"},c:{n:"W",b:"w",a:p,h:"J"}},{j:"13 d N L m J (k)",d:[7,11],g:1,f:{e:1d,i:"k"},c:{n:"W",b:"w",a:p,h:"J"}},{j:"13 P m L (o)",d:1,g:[12,16],f:{e:q,i:"o"},c:{n:"W",b:"w",a:p,h:"L"}},{j:"13 P m L (D)",d:1,g:[12,16],f:{e:q,i:"D"},c:{n:"W",b:"w",a:p,h:"L"}},{j:"13 P m L (k)",d:1,g:[12,16],f:{e:q,i:"k"},c:{n:"W",b:"w",a:p,h:"L"}},{j:"13 P m J (o)",d:1,g:[12,16],f:{e:q,i:"o"},c:{n:"W",b:"w",a:p,h:"J"}},{j:"13 P m J (D)",d:1,g:[12,16],f:{e:q,i:"D"},c:{n:"W",b:"w",a:p,h:"J"}},{j:"13 P m J (k)",d:1,g:[12,16],f:{e:q,i:"k"},c:{n:"W",b:"w",a:p,h:"J"}},{j:"13 P N r m E (o)",d:1,g:[12,16],f:{e:q,i:"o"},c:{n:"W",b:"w",a:p,h:"E"}},{j:"13 P N r m E (k)",d:1,g:[12,16],f:{e:q,i:"k"},c:{n:"W",b:"w",a:p,h:"E"}},{j:"13 P N E m r (D)",d:1,g:[12,16],f:{e:q,i:"D"},c:{n:"W",b:"w",a:p,h:"r"}},{j:"13 P N E m r (k)",d:1,g:[12,16],f:{e:q,i:"k"},c:{n:"W",b:"w",a:p,h:"r"}},{j:"Z v Y R m E (k)",d:[2,4],g:[4,7],f:{e:1f,i:"k"},c:{n:"Q",b:"z",a:1m,h:"E"}},{j:"Z v Y R m r (k)",d:[2,4],g:[4,7],f:{e:1f,i:"k"},c:{n:"Q",b:"z",a:1m,h:"r"}},{j:"Z v Y R m L (k)",d:[2,4],g:[4,7],f:{e:1f,i:"k"},c:{n:"Q",b:"z",a:1m,h:"L"}},{j:"Z v Y R m J (k)",d:[2,4],g:[4,7],f:{e:1f,i:"k"},c:{n:"Q",b:"z",a:1m,h:"J"}},{j:"Z v Y k R m k 1S",d:[2,4],g:[4,7],f:{e:1f,i:"k"},c:{n:"Q",b:"z",a:1m,h:"k"}},{j:"Z v Y R N J-r (o)",d:[2,4],g:[4,7],f:{e:1f,i:"o"},c:{n:"Q",b:"z",a:1m,h:"1V"}},{j:"Z v Y R N L-E (D)",d:[2,4],g:[4,7],f:{e:1f,i:"D"},c:{n:"Q",b:"z",a:1m,h:"21"}},{j:"Z v Y R N J-E (k)",d:[2,4],g:[4,7],f:{e:1f,i:"k"},c:{n:"Q",b:"z",a:1m,h:"1T"}},{j:"Z v Y R N L-r (k)",d:[2,4],g:[4,7],f:{e:1f,i:"k"},c:{n:"Q",b:"z",a:1m,h:"1U"}},{j:"Z v Y d m E (o)",d:[7,11],g:1,f:{e:1d,i:"o"},c:{n:"Q",b:"w",a:p,h:"E"}},{j:"Z v Y d m E (D)",d:[7,11],g:1,f:{e:1d,i:"D"},c:{n:"Q",b:"w",a:p,h:"E"}},{j:"Z v Y d m E (k)",d:[7,11],g:1,f:{e:1d,i:"k"},c:{n:"Q",b:"w",a:p,h:"E"}},{j:"Z v Y d m r (o)",d:[7,11],g:1,f:{e:1d,i:"o"},c:{n:"Q",b:"w",a:p,h:"r"}},{j:"Z v Y d m r (D)",d:[7,11],g:1,f:{e:1d,i:"D"},c:{n:"Q",b:"w",a:p,h:"r"}},{j:"Z v Y d m r (k)",d:[7,11],g:1,f:{e:1d,i:"k"},c:{n:"Q",b:"w",a:p,h:"r"}},{j:"Z v Y d N J m L (o)",d:[7,11],g:1,f:{e:1d,i:"o"},c:{n:"Q",b:"w",a:p,h:"L"}},{j:"Z v Y d N J m L (k)",d:[7,11],g:1,f:{e:1d,i:"k"},c:{n:"Q",b:"w",a:p,h:"L"}},{j:"Z v Y d N L m J (D)",d:[7,11],g:1,f:{e:1d,i:"D"},c:{n:"Q",b:"w",a:p,h:"J"}},{j:"Z v Y d N L m J (k)",d:[7,11],g:1,f:{e:1d,i:"k"},c:{n:"Q",b:"w",a:p,h:"J"}},{j:"Z v Y P m L (o)",d:1,g:[12,16],f:{e:q,i:"o"},c:{n:"Q",b:"w",a:p,h:"L"}},{j:"Z v Y P m L (D)",d:1,g:[12,16],f:{e:q,i:"D"},c:{n:"Q",b:"w",a:p,h:"L"}},{j:"Z v Y P m L (k)",d:1,g:[12,16],f:{e:q,i:"k"},c:{n:"Q",b:"w",a:p,h:"L"}},{j:"Z v Y P m J (o)",d:1,g:[12,16],f:{e:q,i:"o"},c:{n:"Q",b:"w",a:p,h:"J"}},{j:"Z v Y P m J (D)",d:1,g:[12,16],f:{e:q,i:"D"},c:{n:"Q",b:"w",a:p,h:"J"}},{j:"Z v Y P m J (k)",d:1,g:[12,16],f:{e:q,i:"k"},c:{n:"Q",b:"w",a:p,h:"J"}},{j:"Z v Y P N r m E (o)",d:1,g:[12,16],f:{e:q,i:"o"},c:{n:"Q",b:"w",a:p,h:"E"}},{j:"Z v Y P N r m E (k)",d:1,g:[12,16],f:{e:q,i:"k"},c:{n:"Q",b:"w",a:p,h:"E"}},{j:"Z v Y P N E m r (D)",d:1,g:[12,16],f:{e:q,i:"D"},c:{n:"Q",b:"w",a:p,h:"r"}},{j:"Z v Y P N E m r (k)",d:1,g:[12,16],f:{e:q,i:"k"},c:{n:"Q",b:"w",a:p,h:"r"}},{j:"1u",d:1,g:1,f:{e:0,i:"o"},c:{n:"Q",b:"1e",a:V,h:"r",1h:.5}},{j:"1u d",d:4,g:1,f:{e:1f,i:"o"},c:{n:"Q",b:"1e",a:V,h:"r",1h:.5}},{j:"1u g",d:1,g:4,f:{e:1f,i:"o"},c:{n:"Q",b:"1e",a:V,h:"r",1h:.5}},{j:"1u R A",d:3,g:4,f:{e:1s,i:"o"},c:{n:"Q",b:"1e",a:V,h:"r",1h:.5,y:x}},{j:"1u R F",d:3,g:4,f:{e:1s,i:"o"},c:{n:"Q",b:"1e",a:V,h:"J",1h:.5,u:-x}},{j:"1u-1I R A",d:3,g:4,f:{e:15,i:"o"},c:{n:"Q",b:"1e",a:V,h:"r",1h:.5,y:x}},{j:"1u-1I R F",d:3,g:4,f:{e:15,i:"o"},c:{n:"Q",b:"1e",a:V,h:"J",1h:.5,u:-x}},{j:"1u 1I d",d:4,g:1,f:{e:1f,i:"o"},c:{n:"Q",b:"1e",a:V,h:"E",1h:.5}},{j:"1u 1I g",d:1,g:4,f:{e:1f,i:"o"},c:{n:"Q",b:"1e",a:V,h:"r",1h:.5}},{j:"1c f N r",d:1,g:1,f:{e:0,i:"o"},c:{n:"W",b:"z",a:V,h:"E",y:x}},{j:"1c f N E",d:1,g:1,f:{e:0,i:"o"},c:{n:"W",b:"z",a:V,h:"r",y:-x}},{j:"1c f N J",d:1,g:1,f:{e:0,i:"o"},c:{n:"W",b:"z",a:V,h:"L",u:-x}},{j:"1c f N L",d:1,g:1,f:{e:0,i:"o"},c:{n:"W",b:"z",a:V,h:"J",u:x}},{j:"1c R N r",d:[3,4],g:[3,4],f:{e:19,i:"o"},c:{n:"14",b:"z",a:V,h:"r",y:x}},{j:"1c R N E",d:[3,4],g:[3,4],f:{e:19,i:"D"},c:{n:"14",b:"z",a:V,h:"r",y:-x}},{j:"1c R N J",d:[3,4],g:[3,4],f:{e:19,i:"o"},c:{n:"14",b:"z",a:V,h:"r",u:-x}},{j:"1c R N L",d:[3,4],g:[3,4],f:{e:19,i:"D"},c:{n:"14",b:"z",a:V,h:"r",u:x}},{j:"1c d N J",d:[6,12],g:1,f:{e:19,i:"o"},c:{n:"14",b:"z",a:V,h:"r",u:x}},{j:"1c d N L",d:[6,12],g:1,f:{e:19,i:"D"},c:{n:"14",b:"z",a:V,h:"r",u:-x}},{j:"1c g N r",d:1,g:[6,12],f:{e:19,i:"o"},c:{n:"14",b:"z",a:V,h:"r",y:-x}},{j:"1c g N E",d:1,g:[6,12],f:{e:19,i:"D"},c:{n:"14",b:"z",a:V,h:"r",y:x}},{j:"1v d N r",d:[3,10],g:1,f:{e:19,i:"o"},c:{n:"14",b:"z",a:V,h:"r",y:x}},{j:"1v d N E",d:[3,10],g:1,f:{e:19,i:"D"},c:{n:"14",b:"z",a:V,h:"r",y:-x}},{j:"1v g N J",d:1,g:[3,10],f:{e:19,i:"o"},c:{n:"14",b:"z",a:V,h:"r",u:-x}},{j:"1v g N L",d:1,g:[3,10],f:{e:19,i:"D"},c:{n:"14",b:"z",a:V,h:"r",u:x}},{j:"1v v 1z f N r",d:1,g:1,f:{e:q,i:"o"},c:{n:"Q",b:"z",a:V,h:"E",1h:.1,1r:-x,y:x}},{j:"1v v 1z f N E",d:1,g:1,f:{e:q,i:"o"},c:{n:"Q",b:"z",a:V,h:"r",1h:.1,1r:x,y:-x}},{j:"1v v 1z R N r",d:[3,4],g:[3,4],f:{e:19,i:"o"},c:{n:"Q",b:"z",a:V,h:"E",1r:-1w}},{j:"1v v 1z R N E",d:[3,4],g:[3,4],f:{e:19,i:"o"},c:{n:"Q",b:"z",a:V,h:"r",1r:-1w}},{j:"1v v 1z R N k",d:[3,4],g:[3,4],f:{e:19,i:"k"},c:{n:"Q",b:"z",a:V,h:"k",1r:-1w}},{j:"B f 1O",d:1,g:1,f:{e:0,i:"o"},c:{n:"14",b:"z",a:1a,h:"r",1h:.8}},{j:"B f N 1L",d:1,g:1,f:{e:0,i:"o"},c:{n:"14",b:"w",a:1a,h:"r",1h:1.2}},{j:"B R k",d:[3,4],g:[3,4],f:{e:1s,i:"k"},c:{n:"14",b:"z",a:V,h:"r",1h:.1}},{j:"B R N 1L k",d:[3,4],g:[3,4],f:{e:1s,i:"k"},c:{n:"14",b:"z",a:V,h:"r",1h:2}},{j:"B 1O v 1z R k",d:[3,4],g:[3,4],f:{e:1s,i:"k"},c:{n:"14",b:"z",a:V,h:"r",1h:.1,1r:x}},{j:"B v 1z R N 1L k",d:[3,4],g:[3,4],f:{e:1s,i:"k"},c:{n:"14",b:"z",a:V,h:"r",1h:2,1r:-x}},{j:"1D-Y R 24",d:3,g:4,f:{e:15,i:"o"},c:{n:"W",b:"w",a:1Y,h:"1T"}},{j:"1D-Y d A",d:6,g:1,f:{e:0,i:"o"},c:{n:"Q",b:"z",a:V,h:"r"}},{j:"1D-Y d F",d:6,g:1,f:{e:0,i:"o"},c:{n:"Q",b:"z",a:V,h:"J"}},{j:"1D-Y g A",d:1,g:8,f:{e:0,i:"o"},c:{n:"Q",b:"z",a:V,h:"r"}},{j:"1D-Y g F",d:1,g:8,f:{e:0,i:"o"},c:{n:"Q",b:"z",a:V,h:"J"}}],23:[{j:"1b f m E (l&#t;)",d:1,g:1,f:{e:q,i:"o"},s:{c:{y:1E},b:"1F",a:G,h:"A"},C:{c:{y:l},b:"z",a:G,h:"A"}},{j:"1b f m r (l&#t;)",d:1,g:1,f:{e:q,i:"o"},s:{c:{y:-1E},b:"1F",a:G,h:"A"},C:{c:{y:-l},b:"z",a:G,h:"A"}},{j:"1b f m L (l&#t;)",d:1,g:1,f:{e:q,i:"o"},s:{c:{u:-1E},b:"1F",a:1x,h:"F"},C:{c:{u:-l},b:"z",a:1x,h:"F"}},{j:"1b f m J (l&#t;)",d:1,g:1,f:{e:q,i:"o"},s:{c:{u:1E},b:"1F",a:1x,h:"F"},C:{c:{u:l},b:"z",a:1x,h:"F"}},{j:"1b R m E (l&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"o"},s:{c:{y:l},b:"w",a:G,h:"A"}},{j:"1b R m r (l&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"D"},s:{c:{y:-l},b:"w",a:G,h:"A"}},{j:"1b R m L (l&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"1j-o"},s:{c:{u:-l},b:"w",a:G,h:"F"}},{j:"1b R m J (l&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"1j-D"},s:{c:{u:l},b:"w",a:G,h:"F"}},{j:"1B S R k (l&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"k"},s:{c:{y:l},b:"w",a:1G,h:"A"}},{j:"1C S R k (l&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"k"},s:{c:{u:l},b:"w",a:1G,h:"F"}},{j:"B v S R m E (l&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"o"},M:{c:{I:.1A},a:1l,b:"18"},s:{c:{y:l},b:"H",a:G,h:"A"},C:{a:1g,b:"H"}},{j:"B v S R m r (l&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"D"},M:{c:{I:.1A},a:1l,b:"18"},s:{c:{y:-l},b:"H",a:G,h:"A"},C:{a:1g,b:"H"}},{j:"B v S R m L (l&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"1j-o"},M:{c:{I:.1A},a:1l,b:"18"},s:{c:{u:-l},b:"H",a:G,h:"F"},C:{a:1g,b:"H"}},{j:"B v S R m J (l&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"1j-D"},M:{c:{I:.1A},a:1l,b:"18"},s:{c:{u:l},b:"H",a:G,h:"F"},C:{a:1g,b:"H"}},{j:"B v A S R k (l&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"k"},M:{c:{I:.1A,u:1k},a:1l,b:"18"},s:{c:{y:l,u:-1k},b:"H",a:1G,h:"A"},C:{c:{u:0},a:1g,b:"H"}},{j:"B v F S R k (l&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"k"},M:{c:{I:.1A,y:-15},a:1l,b:"18"},s:{c:{u:l,y:15},b:"H",a:1G,h:"F"},C:{c:{y:0},a:1g,b:"H"}},{j:"1b d m E (l&#t;)",d:[5,9],g:1,f:{e:q,i:"o"},s:{c:{y:l},b:"w",a:1a,h:"A"}},{j:"1b d m r (l&#t;)",d:[5,9],g:1,f:{e:q,i:"o"},s:{c:{y:-l},b:"w",a:1a,h:"A"}},{j:"1b d m L (l&#t;)",d:[5,9],g:1,f:{e:q,i:"o"},s:{c:{u:-l},b:"w",a:G,h:"F"}},{j:"1b d m J (l&#t;)",d:[5,9],g:1,f:{e:q,i:"D"},s:{c:{u:l},b:"w",a:G,h:"F"}},{j:"1B S d k (l&#t;)",d:[5,9],g:1,f:{e:q,i:"k"},s:{c:{y:l},b:"w",a:1a,h:"A"}},{j:"1C S d k (l&#t;)",d:[5,9],g:1,f:{e:q,i:"k"},s:{c:{u:-l},b:"w",a:1a,h:"F"}},{j:"1C S d k (1J&#t;)",d:[3,7],g:1,f:{e:1Q,i:"k"},s:{c:{u:-1J},b:"w",a:1R,h:"F"}},{j:"B v S d m E (l&#t;)",d:[5,9],g:1,f:{e:19,i:"o"},M:{c:{I:.O},a:p,b:"K"},s:{c:{y:l},b:"H",a:1p,h:"A"},C:{c:{e:X},b:"K",a:p}},{j:"B v S d m r (l&#t;)",d:[5,9],g:1,f:{e:19,i:"D"},M:{c:{I:.O},a:p,b:"K"},s:{c:{y:-l},b:"H",a:1p,h:"A"},C:{c:{e:X},b:"K",a:p}},{j:"B v S d m L (l&#t;)",d:[5,9],g:1,f:{e:19,i:"o"},M:{c:{I:.O},a:p,b:"K"},s:{c:{u:-l},b:"w",a:p,h:"F"},C:{c:{e:X},b:"K",a:p}},{j:"B v S d m J (l&#t;)",d:[5,9],g:1,f:{e:19,i:"D"},M:{c:{I:.O},a:p,b:"K"},s:{c:{u:l},b:"w",a:p,h:"F"},C:{c:{e:X},b:"K",a:p}},{j:"B v A S d k (l&#t;)",d:[5,9],g:1,f:{e:19,i:"k"},M:{c:{I:.O},a:p,b:"K"},s:{c:{y:l},b:"H",a:1p,h:"A"},C:{c:{e:X},b:"K",a:p}},{j:"B v F S d k (l&#t;)",d:[5,9],g:1,f:{e:19,i:"k"},M:{c:{I:.O},a:p,b:"K"},s:{c:{u:-l},b:"H",a:p,h:"F"},C:{c:{e:X},b:"K",a:p}},{j:"1b P m E (l&#t;)",d:1,g:[5,9],f:{e:q,i:"o"},s:{c:{y:l},b:"w",a:1a,h:"A"}},{j:"1b P m r (l&#t;)",d:1,g:[5,9],f:{e:q,i:"o"},s:{c:{y:-l},b:"w",a:1a,h:"A"}},{j:"1b P m L (l&#t;)",d:1,g:[5,9],f:{e:q,i:"o"},s:{c:{u:-l},b:"w",a:G,h:"F"}},{j:"1b P m J (l&#t;)",d:1,g:[5,9],f:{e:q,i:"D"},s:{c:{u:l},b:"w",a:G,h:"F"}},{j:"1B S P k (l&#t;)",d:1,g:[5,9],f:{e:q,i:"k"},s:{c:{y:l},b:"w",a:1a,h:"A"}},{j:"1C S P k (l&#t;)",d:1,g:[5,9],f:{e:q,i:"k"},s:{c:{u:-l},b:"w",a:1a,h:"F"}},{j:"1B S P k (1J&#t;)",d:1,g:[4,9],f:{e:1Q,i:"k"},s:{c:{y:1J},b:"w",a:1R,h:"A"}},{j:"B v S P m E (l&#t;)",d:1,g:[7,11],f:{e:19,i:"o"},M:{c:{I:.O},a:p,b:"K"},s:{c:{y:l},b:"w",a:p,h:"A"},C:{c:{e:X},b:"K",a:p}},{j:"B v S P m r (l&#t;)",d:1,g:[7,11],f:{e:19,i:"D"},M:{c:{I:.O},a:p,b:"K"},s:{c:{y:-l},b:"w",a:p,h:"A"},C:{c:{e:X},b:"K",a:p}},{j:"B v S P m L (l&#t;)",d:1,g:[7,11],f:{e:19,i:"o"},M:{c:{I:.O},a:p,b:"K"},s:{c:{u:-l},b:"H",a:1p,h:"F"},C:{c:{e:X},b:"K",a:p}},{j:"B v S P m J (l&#t;)",d:1,g:[7,11],f:{e:q,i:"D"},M:{c:{I:.O},a:p,b:"K"},s:{c:{u:l},b:"H",a:1p,h:"F"},C:{c:{e:X},b:"K",a:p}},{j:"B v A S P k (l&#t;)",d:1,g:[7,11],f:{e:q,i:"k"},M:{c:{I:.O},a:p,b:"K"},s:{c:{y:l},b:"H",a:p,h:"A"},C:{c:{e:X},b:"K",a:p}},{j:"B v F S P k (l&#t;)",d:1,g:[7,11],f:{e:q,i:"k"},M:{c:{I:.O},a:p,b:"K"},s:{c:{u:-l},b:"H",a:1p,h:"F"},C:{c:{e:X},b:"K",a:p}},{j:"1N 1P 1M v S m E (l&#t;)",d:1,g:[7,11],f:{e:q,i:"o"},M:{c:{I:.O,u:-1k},a:p,b:"z"},s:{c:{u:-1k,y:l},b:"w",a:G,h:"A"},C:{c:{u:0,e:X},b:"z",a:p}},{j:"1N 1P 1M v S m r (l&#t;)",d:1,g:[7,11],f:{e:q,i:"D"},M:{c:{I:.O,u:-1k},a:p,b:"z"},s:{c:{u:1k,y:-l},b:"w",a:G,h:"A"},C:{c:{u:0,e:X},b:"z",a:p}},{j:"1c 1t m E (x&#t;)",d:1,g:1,f:{e:q,i:"o"},s:{c:{y:x},b:"w",a:1a,h:"A"}},{j:"1c 1t m r (x&#t;)",d:1,g:1,f:{e:q,i:"o"},s:{c:{y:-x},b:"w",a:1a,h:"A"}},{j:"1c 1t m L (x&#t;)",d:1,g:1,f:{e:q,i:"o"},s:{c:{u:-x},b:"w",a:1a,h:"F"}},{j:"1c 1t m J (x&#t;)",d:1,g:1,f:{e:q,i:"o"},s:{c:{u:x},b:"w",a:1a,h:"F"}},{j:"B v 17 1t m E (x&#t;)",d:1,g:1,f:{e:q,i:"k"},s:{c:{I:.8,1r:7,u:10,y:1w},b:"1e",a:1x,h:"A"},C:{c:{1r:0,u:0,y:x},a:1x,b:"1e"}},{j:"B v 17 1t m r (x&#t;)",d:1,g:1,f:{e:q,i:"k"},s:{c:{I:.8,1r:-7,u:10,y:-1w},b:"1e",a:1x,h:"A"},C:{c:{1r:0,u:0,y:-x},a:1x,b:"1e"}},{j:"B v 17 1n m E (x&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"o"},M:{c:{I:.O},a:1l,b:"18"},s:{c:{y:x},b:"H",a:G,h:"A"},C:{a:1g,b:"H"}},{j:"B v 17 1n m r (x&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"D"},M:{c:{I:.O},a:1l,b:"18"},s:{c:{y:-x},b:"H",a:G,h:"A"},C:{a:1g,b:"H"}},{j:"B v 17 1n m L (x&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"1j-o"},M:{c:{I:.O},a:1l,b:"18"},s:{c:{u:-x},b:"H",a:G,h:"F"},C:{a:1g,b:"H"}},{j:"B v 17 1n m J (x&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"1j-D"},M:{c:{I:.O},a:1l,b:"18"},s:{c:{u:x},b:"H",a:G,h:"F"},C:{a:1g,b:"H"}},{j:"B v A 17 1n k (x&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"k"},M:{c:{I:.1i,u:-15},a:1o,b:"18"},s:{c:{y:q,u:15},b:"H",a:1o,h:"A"},C:{c:{y:x,u:0},a:1o,b:"H"}},{j:"B v F 17 1n k (x&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"k"},M:{c:{I:.1i,y:15},a:1o,b:"18"},s:{c:{u:q,y:-15},b:"H",a:1o,h:"F"},C:{c:{u:x,y:0},a:1o,b:"H"}},{j:"1c d m E (x&#t;)",d:[5,9],g:1,f:{e:q,i:"o"},s:{c:{y:x},b:"w",a:1a,h:"A"}},{j:"1c d m r (x&#t;)",d:[5,9],g:1,f:{e:q,i:"o"},s:{c:{y:-x},b:"w",a:1a,h:"A"}},{j:"1B 17 d k (x&#t;)",d:[5,9],g:1,f:{e:q,i:"k"},s:{c:{y:x},b:"w",a:1a,h:"A"}},{j:"B v 17 d m E (x&#t;)",d:[5,9],g:1,f:{e:q,i:"o"},M:{c:{I:.O,u:3},a:p,b:"K"},s:{c:{y:22,u:0},b:"H",a:G,h:"A"},C:{c:{e:X,y:x},b:"K",a:p}},{j:"B v 17 d m r (x&#t;)",d:[5,9],g:1,f:{e:q,i:"D"},M:{c:{I:.O,u:3},a:p,b:"K"},s:{c:{y:-x,u:0},b:"H",a:G,h:"A"},C:{c:{e:X},b:"K",a:p}},{j:"B v 17 d m L (x&#t;)",d:[5,9],g:1,f:{e:q,i:"o"},M:{c:{I:.O},a:p,b:"K"},s:{c:{u:-x},b:"H",a:G,h:"F"},C:{c:{e:X},b:"K",a:p}},{j:"B v 17 d m J (x&#t;)",d:[5,9],g:1,f:{e:q,i:"D"},M:{c:{I:.O},a:p,b:"K"},s:{c:{u:x},b:"H",a:G,h:"F"},C:{c:{e:X},b:"K",a:p}},{j:"B v A 17 d k (x&#t;)",d:[5,9],g:1,f:{e:q,i:"k"},M:{c:{I:.O,u:3},a:p,b:"K"},s:{c:{y:x,u:0},b:"H",a:G,h:"A"},C:{c:{e:X},b:"K",a:p}},{j:"B v F 17 d k (x&#t;)",d:[5,9],g:1,f:{e:q,i:"k"},M:{c:{I:.O},a:p,b:"K"},s:{c:{u:-x},b:"H",a:G,h:"F"},C:{c:{e:X},b:"K",a:p}},{j:"B v A 17 1K d m E (x&#t;)",d:[7,11],g:1,f:{e:q,i:"o"},s:{c:{I:.O,u:5,y:1w},b:"18",a:G,h:"A"},C:{c:{u:0,y:x},b:"18",a:G}},{j:"B v A 17 1K d m r (x&#t;)",d:[7,11],g:1,f:{e:q,i:"D"},s:{c:{I:.O,u:5,y:-1w},b:"18",a:G,h:"A"},C:{c:{u:0,y:-x},b:"18",a:G}},{j:"1c P m L (x&#t;)",d:1,g:[5,9],f:{e:q,i:"o"},s:{c:{u:-x},b:"w",a:G,h:"F"}},{j:"1c P m J (x&#t;)",d:1,g:[5,9],f:{e:q,i:"D"},s:{c:{u:x},b:"w",a:G,h:"F"}},{j:"1C 17 P k (x&#t;)",d:1,g:[5,9],f:{e:q,i:"k"},s:{c:{u:-x},b:"w",a:G,h:"F"}},{j:"B v 17 P m L (x&#t;)",d:1,g:[7,11],f:{e:q,i:"o"},M:{c:{I:.O},a:p,b:"K"},s:{c:{u:-x},b:"H",a:G,h:"F"},C:{c:{e:X},b:"K",a:p}},{j:"B v 17 P m J (x&#t;)",d:1,g:[7,11],f:{e:q,i:"D"},M:{c:{I:.O},a:p,b:"K"},s:{c:{u:x},b:"H",a:G,h:"F"},C:{c:{e:X},b:"K",a:p}},{j:"B v 17 P m E (x&#t;)",d:1,g:[7,11],f:{e:q,i:"o"},M:{c:{I:.O},a:p,b:"K"},s:{c:{y:x},b:"H",a:G,h:"A"},C:{c:{e:X},b:"K",a:p}},{j:"B v 17 P m r (x&#t;)",d:1,g:[7,11],f:{e:q,i:"D"},M:{c:{I:.O},a:p,b:"K"},s:{c:{y:-x},b:"H",a:G,h:"A"},C:{c:{e:X},b:"K",a:p}},{j:"B v A 17 P k (x&#t;)",d:1,g:[7,11],f:{e:q,i:"k"},M:{c:{I:.O},a:p,b:"K"},s:{c:{y:x},b:"H",a:G,h:"A"},C:{c:{e:X},b:"K",a:p}},{j:"B v F 17 P k (x&#t;)",d:1,g:[7,11],f:{e:q,i:"k"},M:{c:{I:.O},a:p,b:"K"},s:{c:{u:-x},b:"H",a:G,h:"F"},C:{c:{e:X},b:"K",a:p}},{j:"B v F 17 1K P m E (x&#t;)",d:1,g:[7,11],f:{e:q,i:"o"},s:{c:{I:.O,u:1w,y:-5},b:"18",a:G,h:"F"},C:{c:{u:x,y:0},b:"18",a:G}},{j:"B v F 17 1K P m r (x&#t;)",d:1,g:[7,11],f:{e:q,i:"D"},s:{c:{I:.O,u:-1w,y:-5},b:"18",a:G,h:"F"},C:{c:{u:-x,y:0},b:"18",a:G}},{j:"1b 1t m E (l&#t;, T U)",d:1,g:1,f:{e:q,i:"o",U:"T"},s:{c:{y:l},b:"w",a:1a,h:"A"}},{j:"1b 1t m r (l&#t;, T U)",d:1,g:1,f:{e:q,i:"o",U:"T"},s:{c:{y:-l},b:"w",a:1a,h:"A"}},{j:"1b 1t m L (l&#t;, T U)",d:1,g:1,f:{e:q,i:"o",U:"T"},s:{c:{u:-l},b:"w",a:1a,h:"F"}},{j:"1b 1t m J (l&#t;, T U)",d:1,g:1,f:{e:q,i:"o",U:"T"},s:{c:{u:l},b:"w",a:1a,h:"F"}},{j:"B v S 1n m E (l&#t;, T U)",d:[2,4],g:[4,7],f:{e:q,i:"o",U:"T"},M:{c:{I:.O},a:1l,b:"18"},s:{c:{y:l},b:"H",a:G,h:"A"},C:{a:1g,b:"H"}},{j:"B v S 1n m r (l&#t;, T U)",d:[2,4],g:[4,7],f:{e:q,i:"D",U:"T"},M:{c:{I:.O},a:1l,b:"18"},s:{c:{y:-l},b:"H",a:G,h:"A"},C:{a:1g,b:"H"}},{j:"B v S 1n m L (l&#t;, T U)",d:[2,4],g:[4,7],f:{e:q,i:"1j-o",U:"T"},M:{c:{I:.O},a:1l,b:"18"},s:{c:{u:-l},b:"H",a:G,h:"F"},C:{a:1g,b:"H"}},{j:"B v S 1n m J (l&#t;, T U)",d:[2,4],g:[4,7],f:{e:q,i:"1j-D",U:"T"},M:{c:{I:.O},a:1l,b:"18"},s:{c:{u:l},b:"H",a:G,h:"F"},C:{a:1g,b:"H"}},{j:"B v A S 1n k (l&#t;, T U)",d:[2,4],g:[4,7],f:{e:q,i:"k",U:"T"},M:{c:{I:.1i},a:1o,b:"18"},s:{c:{y:l},b:"H",a:1o,h:"A"},C:{a:1o,b:"H"}},{j:"B v F S 1n k (l&#t;, T U)",d:[2,4],g:[4,7],f:{e:q,i:"k",U:"T"},M:{c:{I:.1i},a:1o,b:"18"},s:{c:{u:l},b:"H",a:1o,h:"F"},C:{a:1o,b:"H"}},{j:"B v S d m E (l&#t;, T U)",d:[5,9],g:1,f:{e:1i,i:"o",U:"T"},M:{c:{I:.O,u:3},a:p,b:"K"},s:{c:{y:l,u:-3},b:"w",a:1p,h:"A"},C:{c:{e:X,u:0},b:"z",a:1q}},{j:"B v S d m r (l&#t;, T U)",d:[5,9],g:1,f:{e:1i,i:"D",U:"T"},M:{c:{I:.O,u:3},a:p,b:"K"},s:{c:{y:-l,u:-3},b:"w",a:1p,h:"A"},C:{c:{e:X,u:0},b:"z",a:1q}},{j:"B v S d m L (l&#t;, T U)",d:[5,9],g:1,f:{e:1i,i:"o",U:"T"},M:{c:{I:.O},a:p,b:"K"},s:{c:{u:-l},b:"H",a:G,h:"F"},C:{c:{e:X},b:"z",a:1q}},{j:"B v S d m J (l&#t;, T U)",d:[5,9],g:1,f:{e:1i,i:"D",U:"T"},M:{c:{I:.O},a:p,b:"K"},s:{c:{u:l},b:"H",a:G,h:"F"},C:{c:{e:X},b:"z",a:1q}},{j:"B v A S d k (l&#t;, T U)",d:[5,9],g:1,f:{e:1i,i:"k",U:"T"},M:{c:{I:.O,u:3},a:p,b:"K"},s:{c:{y:l,u:-3},b:"w",a:1p,h:"A"},C:{c:{e:X,u:0},b:"z",a:1q}},{j:"B v F S d k (l&#t;, T U)",d:[5,9],g:1,f:{e:1i,i:"k",U:"T"},M:{c:{I:.O},a:p,b:"K"},s:{c:{u:-l},b:"H",a:G,h:"F"},C:{c:{e:X},b:"z",a:1q}},{j:"B v S P m L (l&#t;, T U)",d:1,g:[7,11],f:{e:1i,i:"o",U:"T"},M:{c:{I:.O},a:p,b:"K"},s:{c:{u:-l},b:"w",a:1p,h:"F"},C:{c:{e:X},b:"z",a:1q}},{j:"B v S P m J (l&#t;, T U)",d:1,g:[7,11],f:{e:1i,i:"D",U:"T"},M:{c:{I:.O},a:p,b:"K"},s:{c:{u:l},b:"w",a:1p,h:"F"},C:{c:{e:X},b:"z",a:1q}},{j:"B v S P m E (l&#t;, T U)",d:1,g:[7,11],f:{e:1i,i:"o",U:"T"},M:{c:{I:.O},a:p,b:"K"},s:{c:{y:l},b:"H",a:G,h:"A"},C:{c:{e:X},b:"z",a:1q}},{j:"B v S P m r (l&#t;, T U)",d:1,g:[7,11],f:{e:1i,i:"D",U:"T"},M:{c:{I:.O},a:p,b:"K"},s:{c:{y:-l},b:"H",a:G,h:"A"},C:{c:{e:X},b:"z",a:1q}},{j:"B v A S P k (l&#t;, T U)",d:1,g:[7,11],f:{e:1i,i:"k",U:"T"},M:{c:{I:.O},a:p,b:"K"},s:{c:{y:l},b:"H",a:G,h:"A"},C:{c:{e:X},b:"z",a:1q}},{j:"B v F S P k (l&#t;, T U)",d:1,g:[7,11],f:{e:1i,i:"k",U:"T"},M:{c:{I:.O},a:p,b:"K"},s:{c:{u:-l},b:"w",a:1p,h:"F"},C:{c:{e:X},b:"z",a:1q}}]}', 0, 132, "||||||||||duration|easing|transition|rows|delay|tile|cols|direction|sequence|name|random|180|to|type|forward|600|75|left|animation|176|rotateX|and|easeInOutQuart|90|rotateY|easeOutQuart|horizontal|Scaling|after|reverse|right|vertical|1e3|easeInOutBack|scale3d|top|easeOutBack|bottom|before|from|85|columns|mixed|tiles|spinning|large|depth|750|slide|200|sliding|Fading||||Sliding|fade|||turning|easeInOutQuint|55|1500|Spinning|Turning|100|easeInOutQuad|50|350|scale|65|col|30|450|500|cuboids|700|1200|400|rotate|35|cuboid|Carousel|Flying|45|800|Smooth|rotating|95|Horizontal|Vertical|Mirror|91|easeInQuart|1300|fading|mirror|540|drunk|out|scaling|Drunk|in|colums|150|2e3|directions|topright|bottomleft|topleft|sliging|linear|850|layerSliderTransitions|var|bottomright|87|t3d|diagonal||Crossfading|t2d".split("|"))), eval(function (e, t, a, i, l, r) { if (l = function (e) { return (e < 62 ? "" : l(parseInt(e / 62))) + ((e %= 62) > 35 ? String.fromCharCode(e + 29) : e.toString(36)) }, !"".replace(/^/, String)) { for (; a--;)r[l(a)] = i[a] || l(a); i = [function (e) { return r[e] }], l = function () { return "\\w+" }, a = 1 } for (; a--;)i[a] && (e = e.replace(new RegExp("\\b" + l(a) + "\\b", "g"), i[a])); return e }('16 ab(t,e,i){17 a;"5O"==1O t?a=3K("#"+t):"ad"==1O t&&(a=t);17 s,o;2q(e){1i"ac":s="c4 3K b2",o=\'b1 b0 4M bF bX aG 4K 4P er ed an dX dY 31 22 3K aQ e4 e6 23 2K 2k aJ 4P ex. <as>4R eO 3Y 4P 5T eV eZ 2k 22 eX eP 31 2K 5p eE 22 "eC eF eG 2k 4X" eM eN 22 eL & dW db 3L.</as>\';1p;1i"9M":s="65 3K b2",o="b1 b0 4M dU dS dR an 65 3M ("+i+\') 31 22 3K aQ. 2K dQ at dF 3M 1.7.0 4K dv. 4R aM 3K 2k 1.10.x 4K dw. dt: 4R do 2R dq 22 3K dr aG 3Y 5T 5p do 2R aM 2k 2.x 3M 31 3K dz 5V 3t 2R b8 dB dC dE 4M dD 7 & 8. <a 2E="5P://ds.du.3J/dG/4/69-23-dP/#dT-13&dO-60">dN dH dK dM dp d0 3K by d2 d3.</a>\'}a.1l("12-42"),a.43(\'<p 1s="12-d4">!</p>\'),a.43(\'<p 1s="12-42-cY">2K: \'+s+"</p>"),a.43(\'<p 1s="12-42-8J">\'+o+"</p>")}!16(t){1c("2G"!=1O 7r)23(17 e 3E 7r)14[e]=7r[e];t.ah.3g=16(e){17 a="1.7.0",s=t.ah.ac,o=t(14),r=16(t,e){23(17 i=t.1K("."),a=e.1K("."),s=0;s<i.1h;++s){1c(a.1h==s)21!1;1c(1b(i[s])!=1b(a[s]))21 1b(i[s])>1b(a[s])?!1:!0}21 i.1h!=a.1h?!0:!0};1c(r("1.8.0",s)||o.1l("12-bv"),r(a,s)){1c((1O e).3I("ad|2G"))21 14.1M(16(){1E i(14,e)});1c("11"===e){17 n=t(14).11("2K").g;1c(n)21 n}1w 1c("cR"===e){17 d=t(14).11("2K").o;1c(d)21 d}1w{1c("cV"!==e)21 14.1M(16(){17 i=t(14).11("2K");1c(i){1c(!i.g.2P&&!i.g.4t)1c("3V"==1O e)e>0&&e<i.g.2w+1&&e!=i.g.1Z&&i.4N(e);1w 2q(e){1i"1T":i.o.6V(i.g),i.1T("6F");1p;1i"1Y":i.o.7c(i.g),i.1Y("6F");1p;1i"27":i.g.2A||(i.o.bt(i.g),i.g.2x=!0,i.27())}"dm"===e&&i.2g(),(i.g.2A||!i.g.2A&&i.g.2x)&&"1t"==e&&(i.o.b3(i.g),i.g.2x=!1,i.g.1I.18(\'1R[1e*="3q.3J"], 1R[1e*="5m.be"], 1R[1e*="5Z.3Q"]\').1M(16(){2i(t(14).11("8Z"))}),i.1t()),"d8"==e&&i.99()}});17 d=t(14).11("2K").8G;1c(d)21 d}}1w ab(o,"9M",s)};17 i=16(e,d){17 l=14;l.$el=t(e).1l("12-2b"),l.$el.11("2K",l),l.3R=16(){1c(l.8G=i.9Z,l.o=t.4Q({},l.8G,d),l.g=t.4Q({},i.72),l.1v=t.4Q({},i.9p),l.bi=t.4Q({},i.9Q),l.g.bz=t(e).2o("12-bv")?!1:!0,l.g.dI=t(e).4n(),l.g.2p&&(l.o.4J=!1),"bZ"===l.o.2C&&(l.o.2C=!0),"aI"===l.o.2C&&(l.o.2C=!1),"2G"!=1O aN&&(l.t=t.4Q({},aN)),"2G"!=1O aO&&(l.ct=t.4Q({},aO)),!l.g.aP)1c(l.g.aP=!0,t("4n").18(\'aK[8I*="5T"]\').1h&&(l.g.c2=t("4n").18(\'aK[8I*="5T"]\').1g("8I").1K("5T")[1]),t("4n").18(\'6o[1e*="69"]\').1h&&-1!=t("4n").18(\'6o[1e*="69"]\').1g("1e").1f("?")&&(l.g.bS=t("4n").18(\'6o[1e*="69"]\').1g("1e").1K("?")[1].1K("=")[1]),l.o.3p&&""!=l.o.3p&&l.o.3D&&""!=l.o.3D){t(e).1l("12-"+l.o.3p);17 a=l.o.3D+l.o.3p+"/3p.19",s=t("8E");1c(t("8E").1h||(s=t("4X")),t(\'6h[2E="\'+a+\'"]\').1h)o=t(\'6h[2E="\'+a+\'"]\'),l.g.33||(l.g.33=!0,l.g.9a=2h(16(){l.2V()},8w));1w 1c(4Z.aF){4Z.aF(a);17 o=t(\'6h[2E="\'+a+\'"]\')}1w 17 o=t(\'<6h 5a="bE" 2E="\'+a+\'" 4s="8J/19" />\').1C(s);o.3R(16(){l.g.33||(l.g.33=!0,l.g.96=2h(16(){l.2V()},8w))}),t(1W).3R(16(){l.g.33||(l.g.33=!0,l.g.97=2h(16(){l.2V()},8w))}),l.g.9o=2h(16(){l.g.33||(l.g.33=!0,l.2V())},1Q)}1w l.2V()},l.2V=16(){t(e).4S(t(l.o.4S)),t("4n").1g("5Y")?t("4X").1g("5Y")||t("4X").1g("5Y","12-72"):t("4n").1g("5Y","12-72"),l.g.7f()===!0&&l.o.7K===!0&&(t(e).1l("12-4l"),t(e).3y(".12-3b-2W-2b").1l("12-4l"));17 i=16(){l.o.7K===!0&&l.g.7f()===!0?(t(e).1l("12-4l"),t(e).3y(".12-3b-2W-2b").1l("12-4l"),l.o.49=!1):t(1W).1a()<l.o.b5||t(1W).1a()>l.o.bc?(t(e).1l("12-4l"),t(e).3y(".12-3b-2W-2b").1l("12-4l")):(t(e).2n("12-4l"),t(e).3y(".12-3b-2W-2b").2n("12-4l"))};1c(t(1W).2g(16(){i()}),i(),l.g.1y=16(){21 t(e).1a()},l.g.1F=16(){21 t(e).1d()},t(e).18(".12-3A").2n("12-3A").1l("12-1q"),t(e).18(\'.12-1q > *[1s*="12-s"]\').1M(16(){17 e=t(14).1g("1s").1K("12-s")[1].1K(" ")[0];t(14).2n("12-s"+e).1l("12-l"+e)}),l.o.aH&&(l.o.2U=l.o.aH),l.o.bD===!1&&(l.o.4V=!1),1==t(e).18(".12-1q").1h&&(l.o.49=!1,l.o.8Y=!1,l.o.7b=!1,l.o.7e=!1,l.o.4v=0,l.o.79=!1,l.o.2C=!0,l.o.2U=1,l.o.38="aI"),t(e).1V().2o("12-3b-2W-6N")&&0!==l.o.41&&(t(e)[0].1L.1a="1D%"),l.g.9R=l.g.2l=l.o.1a?""+l.o.1a:t(e)[0].1L.1a,l.g.3N=l.o.1d?""+l.o.1d:t(e)[0].1L.1d,-1==l.g.2l.1f("%")&&-1==l.g.2l.1f("1B")&&(l.g.2l+="1B"),-1==l.g.3N.1f("%")&&-1==l.g.3N.1f("1B")&&(l.g.3N+="1B"),l.g.4a=l.o.a4&&-1!=l.g.2l.1f("1B")&&-1!=l.g.3N.1f("1B")?!0:!1,l.o.7J===!0&&(l.o.41=0,l.g.4a=!0,-1!=l.g.2l.1f("%")&&(l.g.2l=1b(l.g.2l)+"1B"),-1!=l.g.3N.1f("%")&&(l.g.3N=1b(l.g.3N)+"1B")),t(e).18(\'*[1s*="12-l"], *[1s*="12-bg"]\').1M(16(){t(14).1V().2o("12-1q")||t(14).bH(t(14).1V())}),t(e).18(".12-1q").1M(16(){t(14).11("5d",t(14).5d()+1).1l("12-1q-"+(t(14).5d()+1)),t(14).2X(\':2R([1s*="12-"])\').1M(16(){t(14).bw()});17 e=t("<1k>").1l("12-bQ");t(14).18(".12-bg").1h?e.bM(t(14).18(".12-bg").eq("0")):e.4S(t(14))}),t(e).18(\'.12-1q, *[1s*="12-l"]\').1M(16(){1c(t(14).11("12")||t(14).1g("5a")||t(14).1g("1L")){1c(t(14).11("12"))17 e=t(14).11("12").24().1K(";");1w 1c(t(14).1g("5a")&&-1!=t(14).1g("5a").1f(":")&&-1!=t(14).1g("5a").1f(";"))17 e=t(14).1g("5a").24().1K(";");1w 17 e=t(14).1g("1L").24().1K(";");23(x=0;x<e.1h;x++){3H=e[x].1K(":"),-1!=3H[0].1f("4O")&&(3H[1]=l.9f(3H[1]));17 i="";3H[2]&&(i=":"+t.5Q(3H[2]))," "!=3H[0]&&""!=3H[0]&&t(14).11(t.5Q(3H[0]),t.5Q(3H[1])+i)}}l.o.7N===!0&&l.o.49===!0&&(l.o.49=!1,l.g.8v=!0);17 a=t(14);a.11("4j",a[0].1L.1j),a.11("4u",a[0].1L.1n),t(14).3t("a")&&t(14).2X().1h>0&&(a=t(14).2X());17 s=a.1a(),o=a.1d();a[0].1L.1a&&-1!=a[0].1L.1a.1f("%")&&(s=a[0].1L.1a),a[0].1L.1d&&-1!=a[0].1L.1d.1f("%")&&(o=a[0].1L.1d),a.11("2S",s),a.11("2T",o),a.11("8V",a.19("2c-1j")),a.11("93",a.19("2c-1G")),a.11("83",a.19("2c-1n")),a.11("7O",a.19("2c-1m"));17 r="3V"==1O 3j(a.19("36"))?1A.cb(1D*3j(a.19("36")))/1D:1;t(14).11("75",r),-1==a.19("4k-1j-1a").1f("1B")?a.11("6J",a[0].1L.a5):a.11("6J",a.19("4k-1j-1a")),-1==a.19("4k-1G-1a").1f("1B")?a.11("6j",a[0].1L.a8):a.11("6j",a.19("4k-1G-1a")),-1==a.19("4k-1n-1a").1f("1B")?a.11("6g",a[0].1L.a7):a.11("6g",a.19("4k-1n-1a")),-1==a.19("4k-1m-1a").1f("1B")?a.11("6M",a[0].1L.a6):a.11("6M",a.19("4k-1m-1a")),a.11("a3",a.19("9q-a1")),a.11("a2",a.19("a0-1d"))}),4Z.4b.aY)23(17 a=0;a<t(e).18(".12-1q").1h;a++)t(e).18(".12-1q").eq(a).11("cE")==4Z.4b.aY.1K("#")[1]&&(l.o.2U=a+1);t(e).18(\'*[1s*="12-92-"]\').1M(16(){23(17 i=t(14).1g("1s").1K(" "),a=0;a<i.1h;a++)1c(-1!=i[a].1f("12-92-")){17 s=1b(i[a].1K("12-92-")[1]);t(14).19({cy:"cH"}).2s(16(i){i.3u(),t(e).3g(s)})}}),l.g.2w=t(e).18(".12-1q").1h,l.o.77&&l.g.2w>2?("2e"==l.o.2U,l.o.8h=!1):l.o.77=!1,"2e"==l.o.2U&&(l.o.2U=1A.26(1A.2e()*l.g.2w+1)),l.o.57=l.o.57<l.g.2w+1?l.o.57:1,l.o.57=l.o.57<1?1:l.o.57,l.g.4i=1,l.o.4V&&(l.g.4i=0),l.4F.3q.2V(),l.4F.3Q.2V(),l.4F.6K.2V(),l.o.4V&&(l.o.2U=l.o.2U-1===0?l.g.2w:l.o.2U-1),l.g.1Z=l.o.2U,l.g.1I=t(e).18(".12-1q:eq("+(l.g.1Z-1)+")"),t(e).18(".12-1q").cL(\'<1k 1s="12-52"></1k>\'),l.g.i=t(e).18(".12-52"),l.o.9v&&(l.g.3n=t("<1k>").1l("12-cJ-5z").1C(l.g.i)),l.o.9r&&!l.g.2p&&(l.g.34=t("<1k>").1l("12-cx-5z").1C(l.g.i),l.g.34.43(t(\'<1k 1s="12-ct-1j"><1k 1s="12-ct-3m"><1k 1s="12-ct-aW"><1k 1s="12-ct-aE"></1k></1k></1k></1k><1k 1s="12-ct-1G"><1k 1s="12-ct-3m"><1k 1s="12-ct-aW"><1k 1s="12-ct-aE"></1k></1k></1k></1k><1k 1s="12-ct-cj"></1k>\'))),l.g.5s=t("<1k>").19({ck:-1,1J:"1P"}).1l("12-aD-2b").1C(t(e)),t("<1k>").1l("12-aD-cg").1C(l.g.5s),"ce"==t(e).19("3F")&&t(e).19("3F","ag"),l.g.i.19(l.o.7a?{cf:"64("+l.o.7a+")"}:{cl:l.o.8Q}),"8O"==l.o.8Q&&0==l.o.7a&&l.g.i.19({3w:"1P 8O !cm"}),t(e).18(".12-1q 28").1M(16(){1c(t(14).61("1a").61("1d"),l.o.3S===!0&&l.o.4J===!0){1c("5O"!=1O t(14).11("1e")){t(14).11("1e",t(14).1g("1e"));17 e=l.o.3D+"../19/cv.cr";t(14).1g("1e",e)}}1w"5O"==1O t(14).11("1e")&&(t(14).1g("1e",t(14).11("1e")),t(14).61("11-1e"))});17 s=t([]);1c(t(e).18("*:2R(.12-bg)").1M(16(){"2G"!=1O t(14).11("6I")&&0!==1b(t(14).11("6I"))&&(s=s.8z(t(14)))}),l.g.i.3Y("cq",16(e){l.g.am=e.84-t(14).1V().4q().1j,l.g.b4=e.af-t(14).1V().4q().1n}),l.g.i.3Y("aq",16(e){17 i=t(14).1V().4q().1j+l.g.am,a=t(14).1V().4q().1n+l.g.b4,o=e.84-i,r=e.af-a;s.1M(16(){t(14).19({3G:-o/1D*1b(t(14).11("6I")),44:-r/1D*1b(t(14).11("6I"))})})}),l.g.i.3Y("bO",16(){s.1M(16(){2Z.2k(14,.4,{19:{3G:0,44:0}})})}),l.o.8Y&&(t(\'<a 1s="12-1o-1T" 2E="#" />\').2s(16(i){i.3u(),t(e).3g("1T")}).1C(t(e)),t(\'<a 1s="12-1o-1Y" 2E="#" />\').2s(16(i){i.3u(),t(e).3g("1Y")}).1C(t(e)),l.o.9w&&(t(e).18(".12-1o-1T, .12-1o-1Y").19({1J:"1P"}),t(e).1S(16(){l.g.7X||(l.g.2p?t(e).18(".12-1o-1T, .12-1o-1Y").19("1J","2f"):t(e).18(".12-1o-1T, .12-1o-1Y").1t(!0,!0).2y(2z))},16(){l.g.2p?t(e).18(".12-1o-1T, .12-1o-1Y").19("1J","1P"):t(e).18(".12-1o-1T, .12-1o-1Y").1t(!0,!0).3B(2z)}))),l.o.7b||l.o.7e){17 o=t(\'<1k 1s="12-1m-1o-2H" />\').1C(t(e));1c(l.g.3k=o,"4I"==l.o.38&&o.1l("12-ar-5h"),l.o.7e&&"4I"!=l.o.38){1c(t(\'<5C 1s="12-1m-4U" />\').1C(t(e).18(".12-1m-1o-2H")),"1S"==l.o.38)17 r=t(\'<1k 1s="12-1H-1S"><1k 1s="12-1H-1S-52"><1k 1s="12-1H-1S-bg"></1k><1k 1s="12-1H-1S-28"><28></1k><5C></5C></1k></1k>\').1C(t(e).18(".12-1m-4U"));23(x=1;x<l.g.2w+1;x++){17 n=t(\'<a 2E="#" />\').1C(t(e).18(".12-1m-4U")).2s(16(i){i.3u(),t(e).3g(t(14).5d()+1)});1c("1S"==l.o.38){t(e).18(".12-1H-1S, .12-1H-1S-28").19({1a:l.o.8k,1d:l.o.5N});17 d=t(e).18(".12-1H-1S"),g=d.18("28").19({1d:l.o.5N}),h=t(e).18(".12-1H-1S-52").19({29:"2D",1J:"2f"});n.1S(16(){17 i,a=t(e).18(".12-1q").eq(t(14).5d());i=l.o.3S===!0&&l.o.4J===!0?a.18(".12-4w").1h?a.18(".12-4w").11("1e"):a.18(".12-32").1h?a.18(".12-32").1g("1e"):a.18(".12-bg").1h?a.18(".12-bg").11("1e"):l.o.3D+l.o.3p+"/6E.4H":a.18(".12-4w").1h?a.18(".12-4w").1g("1e"):a.18(".12-32").1h?a.18(".12-32").1g("1e"):a.18(".12-bg").1h?a.18(".12-bg").1g("1e"):l.o.3D+l.o.3p+"/6E.4H",t(e).18(".12-1H-1S-28").19({1j:1b(d.19("2c-1j")),1n:1b(d.19("2c-1n"))}),g.3R(16(){g.19(0==t(14).1a()?{3F:"ag",47:"0 1X",1j:"1X"}:{3F:"cF",3G:-t(14).1a()/2,1j:"50%"})}).1g("1e",i),d.19({1J:"2f"}).1t().4m({1j:t(14).3F().1j+(t(14).1a()-d.3r())/2},88),h.19({1J:"1P",29:"2O"}).1t().2y(88)},16(){h.1t().3B(88,16(){d.19({29:"2D",1J:"2f"})})})}}"1S"==l.o.38&&r.1C(t(e).18(".12-1m-4U")),t(e).18(".12-1m-4U a:eq("+(l.o.2U-1)+")").1l("12-1o-1U")}1c(l.o.7b)17 c=t(\'<a 1s="12-1o-27" 2E="#" />\').2s(16(i){i.3u(),t(e).3g("27")}).4S(t(e).18(".12-1m-1o-2H")),u=t(\'<a 1s="12-1o-1t" 2E="#" />\').2s(16(i){i.3u(),t(e).3g("1t")}).1C(t(e).18(".12-1m-1o-2H"));1w"4I"!=l.o.38&&(t(\'<5C 1s="12-1o-ap 12-1o-cC" />\').4S(t(e).18(".12-1m-1o-2H")),t(\'<5C 1s="12-1o-ap 12-1o-cu" />\').1C(t(e).18(".12-1m-1o-2H")));l.o.74&&"4I"!=l.o.38&&(o.19({1J:"1P"}),t(e).1S(16(){l.g.7X||(l.g.2p?o.19("1J","2f"):o.1t(!0,!0).2y(2z))},16(){l.g.2p?o.19("1J","1P"):o.1t(!0,!0).3B(2z)}))}1c("4I"==l.o.38){l.g.3Z=t(\'<1k 1s="12-1H-2H"></1k>\').1C(t(e));17 r=t(\'<1k 1s="12-1H"><1k 1s="12-1H-52"><1k 1s="12-1H-1q-2b"><1k 1s="12-1H-1q"></1k></1k></1k></1k>\').1C(l.g.3Z);1c(l.g.5h=t(e).18(".12-1H-1q-2b"),"6n"3E 1W?l.g.5h.1l("12-cs"):l.g.5h.1S(16(){t(14).1l("12-1H-1q-1S")},16(){t(14).2n("12-1H-1q-1S"),l.7T()}).aq(16(e){17 i=1b(e.84-t(14).4q().1j)/t(14).1a()*(t(14).1a()-t(14).18(".12-1H-1q").1a());t(14).18(".12-1H-1q").1t().19({3G:i})}),t(e).18(".12-1q").1M(16(){17 i,a=t(14).5d()+1;i=l.o.3S===!0&&l.o.4J===!0?t(14).18(".12-4w").1h?t(14).18(".12-4w").11("1e"):t(14).18(".12-32").1h?t(14).18(".12-32").1g("1e"):t(14).18(".12-bg").1h?t(14).18(".12-bg").11("1e"):l.o.3D+l.o.3p+"/6E.4H":t(14).18(".12-4w").1h?t(14).18(".12-4w").1g("1e"):t(14).18(".12-32").1h?t(14).18(".12-32").1g("1e"):t(14).18(".12-bg").1h?t(14).18(".12-bg").1g("1e"):l.o.3D+l.o.3p+"/6E.4H";17 s=t(\'<a 2E="#" 1s="12-4p-\'+a+\'"><28 1e="\'+i+\'"></a>\');s.1C(t(e).18(".12-1H-1q")),"6n"3E 1W||s.1S(16(){t(14).2X().1t().6f(2z,l.o.8l/1D)},16(){t(14).2X().2o("12-4p-1U")||t(14).2X().1t().6f(2z,l.o.8n/1D)}),s.2s(16(i){i.3u(),t(e).3g(a)})}),c&&u){17 f=l.g.3k=t(\'<1k 1s="12-1m-1o-2H 12-cD-5h"></1k>\').1C(t(e));c.8t().2s(16(i){i.3u(),t(e).3g("27")}).1C(f),u.8t().2s(16(i){i.3u(),t(e).3g("1t")}).1C(f)}l.o.74&&(l.g.3Z.19("1J","1P"),f&&(l.g.3k="2f"==f.19("1J")?f:t(e).18(".12-ar-5h"),l.g.3k.19("1J","1P")),t(e).1S(16(){t(e).1l("12-1S"),l.g.7X||(l.g.2p?(l.g.3Z.19("1J","2f"),l.g.3k&&l.g.3k.19("1J","2f")):(l.g.3Z.1t(!0,!0).2y(2z),l.g.3k&&l.g.3k.1t(!0,!0).2y(2z)))},16(){t(e).2n("12-1S"),l.g.2p?(l.g.3Z.19("1J","1P"),l.g.3k&&l.g.3k.19("1J","1P")):(l.g.3Z.1t(!0,!0).3B(2z),l.g.3k&&l.g.3k.1t(!0,!0).3B(2z))}))}l.g.4c=t(\'<1k 1s="12-4c"></1k>\').1C(t(e)),"2f"!=l.g.4c.19("1J")||l.g.4c.18("28").1h||(l.g.6H=16(){l.g.4c.19({1J:"1P",29:"2O"}).2y(4e,16(){l.g.6H=!1})},l.g.5o=t("<28>").1g("1e",l.o.3D+l.o.3p+"/4c.4H").1C(l.g.4c),l.g.9Y="3V"==1O 1b(t(e).19("2c-1m"))?1b(t(e).19("2c-1m")):0),l.7y(),l.o.9z&&t(e).18(".12-1q").1h>1&&t("4X").6L("bT",16(t){l.g.2P||l.g.4t||(37==t.bx?(l.o.6V(l.g),l.1T("6F")):39==t.bx&&(l.o.7c(l.g),l.1Y("6F")))}),"6n"3E 1W&&t(e).18(".12-1q").1h>1&&l.o.9A&&(l.g.i.6L("ci",16(t){17 e=t.5g?t.5g:t.bp.5g;1==e.1h&&(l.g.6P=l.g.5q=e[0].bb)}),l.g.i.6L("cd",16(t){17 e=t.5g?t.5g:t.bp.5g;1==e.1h&&(l.g.5q=e[0].bb),1A.4o(l.g.6P-l.g.5q)>45&&t.3u()}),l.g.i.6L("cp",16(){1A.4o(l.g.6P-l.g.5q)>45&&(l.g.6P-l.g.5q>0?(l.o.7c(l.g),t(e).3g("1Y")):(l.o.6V(l.g),t(e).3g("1T")))})),1==l.o.9N&&t(e).18(".12-1q").1h>1&&l.g.i.1S(16(){l.o.aw(l.g),l.g.2A&&(l.g.2N=!0,l.1t(),l.g.3n&&l.g.3n.1t(),l.g.34&&l.g.2F&&l.g.2F.62(),l.g.3U=(1E 56).5j())},16(){1==l.g.2N&&(l.27(),l.g.2N=!1)}),l.89(),l.o.1u&&(l.g.1u=t("<28>").1l("12-cw").1C(t(e)).1g("1L",l.o.9J).19({29:"2D",1J:"bK"}).3R(16(){17 i=0;l.g.1u||(i=1Q),2h(16(){l.g.1u.11("2S",l.g.1u.1a()),l.g.1u.11("2T",l.g.1u.1d()),"1X"!=l.g.1u.19("1j")&&l.g.1u.11("4j",l.g.1u[0].1L.1j),"1X"!=l.g.1u.19("1G")&&l.g.1u.11("5G",l.g.1u[0].1L.1G),"1X"!=l.g.1u.19("1n")&&l.g.1u.11("4u",l.g.1u[0].1L.1n),"1X"!=l.g.1u.19("1m")&&l.g.1u.11("5L",l.g.1u[0].1L.1m),0!=l.o.8D&&t("<a>").1C(t(e)).1g("2E",l.o.8D).1g("9G",l.o.9E).19({bJ:"1P",bR:"1P"}).43(l.g.1u),l.g.1u.19({1J:"1P",29:"2O"}),l.7S()},i)}).1g("1e",l.o.1u)),t(1W).2g(16(){l.2g()}),t(1W).3Y("c3",16(){t(1W).2g()}),l.g.9y=!0,1==l.o.4V?(l.o.49?(l.g.2A=!0,t(e).18(".12-1o-27").1l("12-1o-27-1U")):t(e).18(".12-1o-1t").1l("12-1o-1t-1U"),l.1Y()):"2G"!=1O l.g.1I[0]&&l.3S(l.g.1I,16(){l.g.1I.2y(l.o.7E,16(){l.g.4t=!1,t(14).1l("12-1U"),l.o.5I&&t(14).1N(t(14).11("5b")+25).ca(16(){t(14).18(".12-32").2s(),t(14).18("2t, 6G").1M(16(){0!==1O t(14)[0].6R&&(t(14)[0].6R=0),t(14).2s()}),t(14).7t()}),l.g.1I.18(\' > *[1s*="12-l"]\').1M(16(){17 e=t(14);(!e.2o("12-2t-3A")||e.2o("12-2t-3A")&&l.o.5I===!1)&&e.11("4A")>0&&e.11("46",2h(16(){l.8x(e)},e.11("4A")))})}),l.7x(l.g.1Z),l.o.49?(l.g.4t=!1,l.27()):t(e).18(".12-1o-1t").1l("12-1o-1t-1U")}),l.o.ba(t(e))},l.2g=16(){l.g.2g=!0,l.g.2P||(l.3x(l.g.1I,16(){l.g.2u&&l.g.2u.63(),l.g.2g=!1}),l.g.1u&&l.7S())},l.27=16(){l.g.2A?"1T"==l.g.2m&&l.o.8h?l.1T():l.1Y():(l.g.2A=!0,l.g.2P||l.g.4t||l.5z()),t(e).18(".12-1o-27").1l("12-1o-27-1U"),t(e).18(".12-1o-1t").2n("12-1o-1t-1U")},l.5z=16(){1c(t(e).18(".12-1U").11("12"))17 i=l.bi.7d;1w 17 i=l.o.7d;17 a=t(e).18(".12-1U").11("5X")?1b(t(e).18(".12-1U").11("5X")):i;1c(!l.o.4V&&!t(e).18(".12-1U").11("5X")){17 s=t(e).18(".12-1q:eq("+(l.o.2U-1)+")").11("5X");a=s?s:i}1c(2i(l.g.4f),l.g.3U?(l.g.4h||(l.g.4h=(1E 56).5j()),l.g.4h>l.g.3U&&(l.g.3U=(1E 56).5j()),l.g.3s||(l.g.3s=a),l.g.3s-=l.g.3U-l.g.4h,l.g.3U=!1,l.g.4h=(1E 56).5j()):(l.g.3s=a,l.g.4h=(1E 56).5j()),l.g.3s=1b(l.g.3s),l.g.4f=2h(16(){l.g.4h=l.g.3U=l.g.3s=!1,l.27()},l.g.3s),l.g.3n&&l.g.3n.4m({1a:l.g.1y()},l.g.3s,"8X",16(){t(14).19({1a:0})}),l.g.34){17 o=l.g.34.18(".12-ct-1G .12-ct-3m"),r=l.g.34.18(".12-ct-1j .12-ct-3m");"1P"==l.g.34.19("1J")&&(o.19({3m:0}),r.19({3m:0}),l.g.34.2y(8M)),l.g.2F?l.g.2F.c1():(l.g.2F=1E al,l.g.2F.8z(2Z.6w(o[0],a/bj,{3a:0},{3W:95.94,3a:6e,bV:16(){l.g.2F=!1}})),l.g.2F.8z(2Z.6w(r[0],a/bj,{3a:0},{3W:95.94,3a:6e})))}},l.1t=16(){l.g.3U=(1E 56).5j(),l.g.3n&&l.g.3n.1t(),l.g.34&&l.g.2F&&l.g.2F.62(),l.g.2N||l.g.2x||(t(e).18(".12-1o-1t").1l("12-1o-1t-1U"),t(e).18(".12-1o-27").2n("12-1o-27-1U")),2i(l.g.4f),l.g.2A=!1},l.99=16(){2i(l.g.4f),l.g.2A=!1,2i(l.g.9a),2i(l.g.96),2i(l.g.97),2i(l.g.9o),2i(l.g.aL),l.g.3n&&l.g.3n.1t(),l.g.34&&l.g.2F&&l.g.2F.62(),t(e).18("*").1t(!0,!1).7t(),t(e).18(".12-1q >").1M(16(){t(14).11("3C")&&t(14).11("3C").62()}),l.g.2N||l.g.2x||(t(e).18(".12-1o-1t").1l("12-1o-1t-1U"),t(e).18(".12-1o-27").2n("12-1o-27-1U"))},l.bG=16(){t(e).18("*").1t(),2i(l.g.4f),l.4N(l.g.1Z,l.g.2m)},l.9f=16(e){21"aX"==t.5Q(e.24())||"8X"==t.5Q(e.24())?e.24():e.2j("8W","aT").2j("8P","ak").2j("8T","aV").2j("cA","cO").2j("cz","cB").2j("ch","cM").2j("bN","cn").2j("c8","cK").2j("cI","cN").2j("cG","bL").2j("bP","bI").2j("5y","bB").2j("bA","bC")},l.1T=16(t){1c(l.g.1Z<2&&(l.g.4i+=1),l.g.4i>l.o.4v&&l.o.4v>0&&!t)l.g.4i=0,l.1t(),0==l.o.79&&(l.o.4v=0);1w{17 e=l.g.1Z<2?l.g.2w:l.g.1Z-1;l.g.2m="1T",l.4N(e,l.g.2m)}},l.1Y=16(t){1c(l.o.77)1c(t){1c(t){17 e=l.g.1Z<l.g.2w?l.g.1Z+1:1;l.g.2m="1Y",l.4N(e,l.g.2m)}}1w{17 e=l.g.1Z,i=16(){e=1A.26(1A.2e()*l.g.2w)+1,e==l.g.1Z?i():(l.g.2m="1Y",l.4N(e,l.g.2m))};i()}1w 1c(l.g.1Z<l.g.2w||(l.g.4i+=1),l.g.4i>l.o.4v&&l.o.4v>0&&!t)l.g.4i=0,l.1t(),0==l.o.79&&(l.o.4v=0);1w{17 e=l.g.1Z<l.g.2w?l.g.1Z+1:1;l.g.2m="1Y",l.4N(e,l.g.2m)}},l.4F={3q:{2V:16(){17 i=-1===4Z.4b.2E.1f("9H:")?"":"5P:",a=t(e).18(\'1R[1e*="3q.3J"], 1R[1e*="5m.be"]\');1c(a.1h){t("<6o>").1g({1e:i+"//c6.3q.3J/c7",4s:"8J/c9"}).1C("8E");{a.1h}1W.bU=16(){a.1M(16(){1c(t(14).1V().1l("12-2t-3A"),t(14).1V(\'[1s*="12-l"]\')){17 e=i,a=t("<1k>").1l("12-54").1C(t(14).1V());t("<28>").1C(a).1l("12-32").1g("9I","9L 2t").1g("1e",e+"//28.3q.3J/bW/"+t(14).1g("1e").1K("c0/")[1].1K("?")[0]+"/"+l.o.9s),t("<1k>").1C(a).1l("12-9K"),t(14).1V().19({1a:t(14).1a(),1d:t(14).1d()}).2s(16(){17 e=t(14).18("1R");1c(e.19("1J","2f"),t(14).11("4A")>0&&t(14).11("46")&&2i(t(14).11("46")),l.g.4d||(l.g.2P=!0,l.g.2N?(0!=l.o.2C&&(l.g.2N=!1),l.g.2x=!0):l.g.2x=l.g.2A,0!=l.o.2C&&l.1t(),l.g.4d=!0),"2G"==1O e.11("6p")){e.1g("1e",s);17 i=16(t){0===t.11&&(l.g.7B+=1,"1X"==l.o.2C&&1==l.g.2x&&l.g.7B==l.g.1I.18(\'1R[1e*="3q.3J"], 1R[1e*="5m.be"]\').1h&&(l.g.3s=1,l.27()))},a=16(t){t.9G.9F()};e.11("6p",1E bY.cc(e[0],{de:{ek:a,em:i}}))}1w e.11("6p").9F();t(14).18(".12-54").1N(l.g.v.d).3B(l.g.v.91,16(){l.g.2P=!1,1==l.g.2g&&l.3x(l.g.1I,16(){l.g.2g=!1})})}),e=-1===t(14).1g("1e").1f("5P")?i:"";17 s=e+t(14).1g("1e"),o="&";-1==s.1f("?")&&(o="?"),-1==s.1f("4D")?s+=o:s.2j("4D=1","4D=0"),s+="&9B=9u&6K=1&ej=1&3M=3",t(14).11("5n",s),t(14).11("2S",t(14).1g("1a")),t(14).11("2T",t(14).1g("1d")),t(14).1g("1e","")}})}}},6v:16(){},1t:16(t){t.1V().18(".12-54").2y(l.g.v.78,16(){t.1V().18("1R").11("6p").ei(),t.1V().18("1R").19("1J","1P")})}},3Q:{2V:16(){17 i=-1===4Z.4b.2E.1f("9H:")?"":"5P:";t(e).18(\'1R[1e*="5Z.3Q"]\').1M(16(){1c(t(14).1V().1l("12-2t-3A"),t(14).1V(\'[1s*="12-l"]\')){17 e=t(14),a=i,s=t("<1k>").1l("12-54").1C(t(14).1V());t.ef(a+"//3Q.3J/eg/eh/2t/"+t(14).1g("1e").1K("2t/")[1].1K("?")[0]+".en?eo=?",16(i){t("<28>").1C(s).1l("12-32").1g("9I","9L 2t").1g("1e",i[0].eu),e.11("9C",1Q*1b(i[0].2r)),t("<1k>").1C(s).1l("12-9K")}),t(14).1V().19({1a:t(14).1a(),1d:t(14).1d()}).2s(16(){t(14).11("4A")>0&&t(14).11("46")&&2i(t(14).11("46")),l.g.2P=!0,l.g.2N?(0!=l.o.2C&&(l.g.2N=!1),l.g.2x=!0):l.g.2x=l.g.2A,0!=l.o.2C&&l.1t(),l.g.4d=!0,a=-1===t(14).18("1R").11("5n").1f("5P")?i:"",t(14).18("1R").1g("1e",a+t(14).18("1R").11("5n")),t(14).18(".12-54").1N(l.g.v.d).3B(l.g.v.91,16(){1c("1X"==l.o.2C&&1==l.g.2x){17 t=2h(16(){l.27()},e.11("9C")-l.g.v.d);e.11("8Z",t)}l.g.2P=!1,1==l.g.2g&&l.3x(l.g.1I,16(){l.g.2g=!1})})});17 o="&";-1==t(14).1g("1e").1f("?")&&(o="?");17 r="&9B=9u";-1==t(14).1g("1e").1f("4D")?t(14).11("5n",t(14).1g("1e")+o+"4D=1"+r):t(14).11("5n",t(14).1g("1e").2j("4D=0","4D=1")+r),t(14).11("2S",t(14).1g("1a")),t(14).11("2T",t(14).1g("1d")),t(14).1g("1e","")}})},6v:16(){},1t:16(t){t.1V().18(".12-54").2y(l.g.v.78,16(){t.1V().18("1R").1g("1e","")})}},6K:{2V:16(){t(e).18("2t, 6G").1M(16(){17 e="2G"!=1O t(14).1g("1a")?t(14).1g("1a"):"es",i="2G"!=1O t(14).1g("1d")?t(14).1g("1d"):""+t(14).1d();-1===e.1f("%")&&(e=1b(e)),-1===i.1f("%")&&(i=1b(i)),"1D%"!==e||0!==i&&"0"!==i&&"1D%"!==i||(t(14).1g("1d","1D%"),i="1X"),t(14).1V().1l("12-2t-3A").19({1a:e,1d:i}).11({2S:e,2T:i});t(14);t(14).3Y("ep",16(){"1X"===l.o.2C&&l.g.2x===!0&&l.27()}),t(14).61("1a").61("1d").19({1a:"1D%",1d:"1D%"}).2s(16(t){l.g.4d||(14.2N&&t.3u(),14.6v(),l.g.2P=!0,l.g.2N?(l.o.2C!==!1&&(l.g.2N=!1),l.g.2x=!0):l.g.2x=l.g.2A,l.o.2C!==!1&&l.1t(),l.g.4d=!0,l.g.2P=!1,l.g.2g===!0&&l.3x(l.g.1I,16(){l.g.2g=!1}))})})},6v:16(){},1t:16(t){t[0].62()}}},l.4N=16(i,a){l.g.4h=l.g.3U=l.g.3s=!1,l.g.3n&&l.g.3n.1t().1N(2z).4m({1a:0},ec),l.g.34&&(l.g.34.3B(4e),l.g.2F&&l.g.2F.5t().2r(.35)),1==l.g.4d&&(l.g.4d=!1,l.g.2A=l.g.2x,l.g.1I.18(\'1R[1e*="3q.3J"], 1R[1e*="5m.be"]\').1M(16(){l.4F.3q.1t(t(14))}),l.g.1I.18(\'1R[1e*="5Z.3Q"]\').1M(16(){l.4F.3Q.1t(t(14))}),l.g.1I.18("2t, 6G").1M(16(){l.4F.6K.1t(t(14))})),t(e).18(\'1R[1e*="3q.3J"], 1R[1e*="5m.be"], 1R[1e*="5Z.3Q"]\').1M(16(){2i(t(14).11("8Z"))}),2i(l.g.4f),l.g.66=i,l.g.1r=t(e).18(".12-1q:eq("+(l.g.66-1)+")"),a||(l.g.2m=l.g.1Z<l.g.66?"1Y":"1T");17 s=0;t(e).18(\'1R[1e*="3q.3J"], 1R[1e*="5m.be"], 1R[1e*="5Z.3Q"]\').1h>0&&(s=l.g.v.78),"2G"!=1O l.g.1r[0]&&l.3S(l.g.1r,16(){l.4m()})},l.3S=16(i,a){1c(l.g.4t=!0,l.g.9y&&t(e).19({29:"2O"}),l.o.3S){17 s=[],o=0;1c("1P"!=i.19("3w-2I")&&-1!=i.19("3w-2I").1f("64")&&!i.2o("12-3z")&&!i.2o("12-2R-3z")){17 r=i.19("3w-2I");r=r.3I(/64\\((.*)\\)/)[1].2j(/"/9x,""),s[s.1h]=[r,i]}1c(i.18("28:2R(.12-3z, .12-2R-3z)").1M(16(){l.o.4J===!0&&t(14).1g("1e",t(14).11("1e")),s[s.1h]=[t(14).1g("1e"),t(14)]}),i.18("*").1M(16(){1c("1P"!=t(14).19("3w-2I")&&-1!=t(14).19("3w-2I").1f("64")&&!t(14).2o("12-3z")&&!t(14).2o("12-2R-3z")){17 e=t(14).19("3w-2I");e=e.3I(/64\\((.*)\\)/)[1].2j(/"/9x,""),s[s.1h]=[e,t(14)]}}),0==s.1h)t(".12-1H-2H, .12-1o-1Y, .12-1o-1T, .12-1m-1o-2H").19({29:"2O"}),l.3x(i,a);1w{l.g.2p?l.g.5s.19("1J","2f"):l.g.5s.1N(9P).2y(2z);17 n=16(){l.g.5s.1t(!0,!0).19({1J:"1P"}),t(".12-1H-2H, .12-1o-1Y, .12-1o-1T, .12-1m-1o-2H").19({29:"2O"}),-1!==40.3X.1f("e1/7")||l.g.2p?2h(16(){l.3x(i,a)},50):l.3x(i,a)};23(x=0;x<s.1h;x++)t("<28>").11("el",s[x]).3R(16(){t(14).11("el")[1].1l("12-3z"),++o==s.1h&&n()}).42(16(){17 e=t(14).11("el")[0].9j(t(14).11("el")[0].9m("/")+1,t(14).11("el")[0].1h);1W.6u?6u.e0(\'2K 42:\\r\\n\\r\\6A 6B 4M 22 6y 31 22 2I 4K 3w 2I "\'+e+\'" 3t 6S 2k a 6m 4b 5p 5V 6z be 33. 4R 6D 22 6Q 31 4T 4P 6l 6i 3E 22 6c.\'):9b(\'2K 42:\\r\\n\\r\\6A 6B 4M 22 6y 31 22 2I 4K 3w 2I "\'+e+\'" 3t 6S 2k a 6m 4b 5p 5V 6z be 33. 4R 6D 22 6Q 31 4T 4P 6l 6i 3E 22 6c.\'),t(14).1l("12-2R-3z"),++o==s.1h&&n()}).1g("1e",s[x][0])}}1w t(".12-1H-2H, .12-1o-1Y, .12-1o-1T, .12-1m-1o-2H").19({29:"2O"}),l.3x(i,a)},l.3x=16(e,i){e.19({29:"2D",1J:"2f"}),l.g.6H&&l.g.6H(),l.89(),"4I"==l.o.38&&l.9O();17 a=e.2X();a.1M(16(){17 e=t(14),i=e.11("4j")?e.11("4j"):"0",a=e.11("4u")?e.11("4u"):"0";e.3t("a")&&e.2X().1h>0&&(e.19({1J:"2f"}),e=e.2X());17 s="1X",o="1X";e.11("2S")&&("3V"==1O e.11("2S")?s=1b(e.11("2S"))*l.g.1x:-1!=e.11("2S").1f("%")&&(s=e.11("2S"))),e.11("2T")&&("3V"==1O e.11("2T")?o=1b(e.11("2T"))*l.g.1x:-1!=e.11("2T").1f("%")&&(o=e.11("2T")));17 r=e.11("8V")?1b(e.11("8V"))*l.g.1x:0,n=e.11("93")?1b(e.11("93"))*l.g.1x:0,d=e.11("83")?1b(e.11("83"))*l.g.1x:0,g=e.11("7O")?1b(e.11("7O"))*l.g.1x:0,h=e.11("6J")?1b(e.11("6J"))*l.g.1x:0,c=e.11("6j")?1b(e.11("6j"))*l.g.1x:0,u=e.11("6g")?1b(e.11("6g"))*l.g.1x:0,f=e.11("6M")?1b(e.11("6M"))*l.g.1x:0,p=e.11("a3"),m=e.11("a2");1c(l.g.4a||l.o.41>0){1c(e.3t("28")&&!e.2o("12-bg")&&e.1g("1e")&&(e.19({1a:"1X",1d:"1X"}),0!=s&&"1X"!=s||"3V"!=1O o||0==o||(s=o/e.1d()*e.1a()),0!=o&&"1X"!=o||"3V"!=1O s||0==s||(o=s/e.1a()*e.1d()),"1X"==s&&(s=e.1a()*l.g.1x),"1X"==o&&(o=e.1d()*l.g.1x),e.19({1a:s,1d:o})),e.3t("28")||e.19({1a:s,1d:o,"9q-a1":1b(p)*l.g.1x+"1B","a0-1d":1b(m)*l.g.1x+"1B"}),e.3t("1k")&&e.18("1R").11("5n")){17 v=e.18("1R");v.1g("1a",1b(v.11("2S"))*l.g.1x).1g("1d",1b(v.11("2T"))*l.g.1x),e.19({1a:1b(v.11("2S"))*l.g.1x,1d:1b(v.11("2T"))*l.g.1x})}e.19({2c:d+"1B "+n+"1B "+g+"1B "+r+"1B ",a5:h+"1B",a8:c+"1B",a7:u+"1B",a6:f+"1B"})}1c(e.2o("12-bg")){17 y=l.g.i;e.19({1a:"1X",1d:"1X"}),s=e.1a(),o=e.1d();17 b=l.g.1x;-1!=l.g.2l.1f("%")&&(l.g.1y()>s?(b=l.g.1y()/s,l.g.1F()>o*b&&(b=l.g.1F()/o)):l.g.1F()>o&&(b=l.g.1F()/o,l.g.1y()>s*b&&(b=l.g.1y()/s))),e.19({1a:s*b,1d:o*b,3G:y.1a()/2-s*b/2,44:y.1d()/2-o*b/2})}1w{17 w=e;e.1V().3t("a")&&(e=e.1V());17 x=0;l.o.76?x=l.o.76>0?(l.g.1y()-l.o.76)/2:0:l.o.7p&&(x=l.o.7p>0?(l.g.1y()-l.o.7p)/2:0),x=0>x?0:x,-1!=i.1f("%")?e.19({1j:l.g.1y()/1D*1b(i)-w.1a()/2-r-h}):(x>0||l.g.4a||l.o.41>0)&&e.19({1j:x+1b(i)*l.g.1x}),-1!=a.1f("%")?e.19({1n:l.g.1F()/1D*1b(a)-w.1d()/2-d-u}):(l.g.4a||l.o.41>0)&&e.19({1n:1b(a)*l.g.1x})}}),e.19({1J:"1P",29:"2O"}),l.7y(),i(),t(14).7t()},l.7y=16(){1c(l.g.5o){17 t=16(){l.g.5o.1d()>0?l.g.4c.19(l.g.9Y>0?{1d:l.g.5o.1d()/2}:{1d:l.g.5o.1d(),44:-l.g.5o.1d()/2}):2h(16(){t()},50)};t()}},l.89=16(){1c(l.o.41>0&&(t(1W).1a()<l.o.41?(l.g.4a=!0,l.g.2l=l.o.41+"1B"):(l.g.4a=!1,l.g.2l=l.g.9R,l.g.1x=1)),t(e).3y(".12-3b-2W-2b").1h&&t(e).3y(".12-3b-2W-6N").19({1a:t(1W).1a()}),l.g.4a){17 i=t(e).1V();l.o.7J===!0?t(e).19({1a:"1D%",1d:t(1W).1d()}):(t(e).19({1a:i.1a()-1b(t(e).19("2c-1j"))-1b(t(e).19("2c-1G"))}),l.g.1x=t(e).1a()/1b(l.g.2l),t(e).19({1d:l.g.1x*1b(l.g.3N)}))}1w l.g.1x=1,t(e).19({1a:l.g.2l,1d:l.g.3N});1c(t(e).3y(".12-3b-2W-2b").1h&&(t(e).3y(".12-3b-2W-6N").19({1d:t(e).3l(!0)}),t(e).3y(".12-3b-2W-2b").19({1d:t(e).3l(!0)}),t(e).3y(".12-3b-2W-6N").19({1a:t(1W).1a(),1j:-t(e).3y(".12-3b-2W-2b").4q().1j}),-1!=l.g.2l.1f("%"))){17 a=1b(l.g.2l),s=t("4X").1a()/1D*a-(t(e).3r()-t(e).1a());t(e).1a(s)}t(e).18(".12-52, .12-1v-2b").19({1a:l.g.1y(),1d:l.g.1F()}),l.g.1I&&l.g.1r?(l.g.1I.19({1a:l.g.1y(),1d:l.g.1F()}),l.g.1r.19({1a:l.g.1y(),1d:l.g.1F()})):t(e).18(".12-1q").19({1a:l.g.1y(),1d:l.g.1F()})},l.7S=16(){l.g.1u.19({1a:l.g.1u.11("2S")*l.g.1x,1d:l.g.1u.11("2T")*l.g.1x}),l.g.2p?l.g.1u.19("1J","2f"):l.g.1u.2y(2z);17 i=7Z=87=7Y="1X";i=l.g.1u.11("4j")&&-1!=l.g.1u.11("4j").1f("%")?l.g.1y()/1D*1b(l.g.1u.11("4j"))-l.g.1u.1a()/2+1b(t(e).19("2c-1j")):1b(l.g.1u.11("4j"))*l.g.1x,7Z=l.g.1u.11("5G")&&-1!=l.g.1u.11("5G").1f("%")?l.g.1y()/1D*1b(l.g.1u.11("5G"))-l.g.1u.1a()/2+1b(t(e).19("2c-1G")):1b(l.g.1u.11("5G"))*l.g.1x,87=l.g.1u.11("4u")&&-1!=l.g.1u.11("4u").1f("%")?l.g.1F()/1D*1b(l.g.1u.11("4u"))-l.g.1u.1d()/2+1b(t(e).19("2c-1n")):1b(l.g.1u.11("4u"))*l.g.1x,7Y=l.g.1u.11("5L")&&-1!=l.g.1u.11("5L").1f("%")?l.g.1F()/1D*1b(l.g.1u.11("5L"))-l.g.1u.1d()/2+1b(t(e).19("2c-1m")):1b(l.g.1u.11("5L"))*l.g.1x,l.g.1u.19({1j:i,1G:7Z,1n:87,1m:7Y})},l.9O=16(){l.7M("3Y");17 i=-1==l.g.2l.1f("%")?1b(l.g.2l):l.g.1y();t(e).18(".12-1H-1q a").19({1a:1b(l.o.8k*l.g.1x),1d:1b(l.o.5N*l.g.1x)}),t(e).18(".12-1H-1q a:7v").19({47:0}),t(e).18(".12-1H-1q").19({1d:1b(l.o.5N*l.g.1x)});17 a=t(e).18(".12-1H"),s=1b(-1==l.o.6X.1f("%")?l.o.6X:i/1D*1b(l.o.6X));a.19({1a:s*1A.26(1D*l.g.1x)/1D}),a.1a()>t(e).18(".12-1H-1q").1a()&&a.19({1a:t(e).18(".12-1H-1q").1a()}),l.7M("9V")},l.7x=16(i){17 a=i?i:l.g.66;t(e).18(".12-1H-1q a:2R(.12-4p-"+a+")").2X().1M(16(){t(14).2n("12-4p-1U").1t().6f(8S,l.o.8n/1D)}),t(e).18(".12-1H-1q a.12-4p-"+a).2X().1l("12-4p-1U").1t().6f(8S,l.o.8l/1D)},l.7T=16(){1c(!t(e).18(".12-1H-1q-2b").2o("12-1H-1q-1S")){17 i=t(e).18(".12-4p-1U").1h?t(e).18(".12-4p-1U").1V():!1;1c(i){17 a=i.3F().1j+i.1a()/2,s=t(e).18(".12-1H-1q-2b").1a()/2-a;s=s<t(e).18(".12-1H-1q-2b").1a()-t(e).18(".12-1H-1q").1a()?t(e).18(".12-1H-1q-2b").1a()-t(e).18(".12-1H-1q").1a():s,s=s>0?0:s,t(e).18(".12-1H-1q").4m({3G:s},cQ)}}},l.7M=16(i){1c(l.o.74&&!t(e).2o("12-1S"))2q(i){1i"3Y":l.g.3Z.19({29:"2D",1J:"2f"});1p;1i"9V":l.g.3Z.19({29:"2O",1J:"1P"})}},l.4m=16(){l.g.7B=0,t(e).18(".12-1q").1h>1&&(l.g.2P=!0),l.g.4t=!1,2i(l.g.4f),2i(l.g.e5),l.g.9e=l.g.1I,l.o.aB(l.g),"4I"==l.o.38&&(l.7x(),"6n"3E 1W||l.7T()),l.g.1r.1l("12-bh");17 i=7P=6s=8g=6t=7q=6q=7A=6O=ea=6C=eb="1X",d=7w=l.g.1y(),g=7o=l.g.1F(),h="1T"==l.g.2m?l.g.1I:l.g.1r,c=h.11("3o")?h.11("3o"):l.o.8K,u=l.g.8m[l.g.2m][c];2q(("1j"==u||"1G"==u)&&(d=6s=7w=6q=0,6C=0),("1n"==u||"1m"==u)&&(g=i=7o=6t=0,6O=0),u){1i"1j":7P=6t=0,6O=-l.g.1y();1p;1i"1G":i=7q=0,6O=l.g.1y();1p;1i"1n":8g=6q=0,6C=-l.g.1F();1p;1i"1m":6s=7A=0,6C=l.g.1F()}l.g.1I.19({1j:i,1G:7P,1n:6s,1m:8g}),l.g.1r.19({1a:7w,1d:7o,1j:6t,1G:7q,1n:6q,1m:7A});17 f=l.g.1I.11("5S")?1b(l.g.1I.11("5S")):l.o.71,p=l.g.1I.11("4E")?1b(l.g.1I.11("4E")):l.o.4y,m=l.g.1I.11("4L")?l.g.1I.11("4L"):l.o.4x,v=l.g.1r.11("5b")?1b(l.g.1r.11("5b")):l.o.5J,y=l.g.1r.11("68")?1b(l.g.1r.11("68")):l.o.5w;0===y&&(y=1);17 b=l.g.1r.11("67")?l.g.1r.11("67"):l.o.5x,w=16(){l.g.1I.1N(f+p/15).4m({1a:d,1d:g},p,m,16(){x()})},x=16(){1c(l.g.9e.18(\' > *[1s*="12-l"]\').1M(16(){t(14).11("3C")&&t(14).11("3C").7I(),t(14).19({e9:"1P"})}),l.g.1I=l.g.1r,l.g.e8=l.g.1Z,l.g.1Z=l.g.66,l.o.7U(l.g),l.o.3S&&l.o.4J){17 i=l.g.1Z==l.g.2w?1:l.g.1Z+1;t(e).18(".12-1q").eq(i-1).18("28:2R(.12-3z)").1M(16(){t(14).3R(16(){t(14).1l("12-3z")}).42(16(){17 e=t(14).11("1e").9j(t(14).11("1e").9m("/")+1,t(14).11("1e").1h);1W.6u?6u(\'2K 42:\\r\\n\\r\\6A 6B 4M 22 6y 31 22 2I 4K 3w 2I "\'+e+\'" 3t 6S 2k a 6m 4b 5p 5V 6z be 33. 4R 6D 22 6Q 31 4T 4P 6l 6i 3E 22 6c.\'):9b(\'2K 42:\\r\\n\\r\\6A 6B 4M 22 6y 31 22 2I 4K 3w 2I "\'+e+\'" 3t 6S 2k a 6m 4b 5p 5V 6z be 33. 4R 6D 22 6Q 31 4T 4P 6l 6i 3E 22 6c.\'),t(14).1l("12-2R-3z")}).1g("1e",t(14).11("1e"))})}t(e).18(".12-1q").2n("12-1U"),t(e).18(".12-1q:eq("+(l.g.1Z-1)+")").1l("12-1U").2n("12-bh"),t(e).18(".12-1m-4U a").2n("12-1o-1U"),t(e).18(".12-1m-4U a:eq("+(l.g.1Z-1)+")").1l("12-1o-1U"),l.g.2A&&l.5z(),l.g.2P=!1,1==l.g.2g&&l.3x(l.g.1I,16(){l.g.2g=!1})},S=16(e){17 i=l.g.1I.18(\' > *[1s*="12-l"]\');i.1M(16(){1c("2G"==1O t(14).11("8q")||"2G"!=1O t(14).11("8q")&&t(14).11("8q")!==l.g.1Z){t(14).11("2B")||l.5r(t(14)),t(14).2n("12-8y");17 i,s,o=t(14).11("3o")?t(14).11("3o"):u;2q(o){1i"1j":i=-l.g.1y(),s=0;1p;1i"1G":i=l.g.1y(),s=0;1p;1i"1n":s=-l.g.1F(),i=0;1p;1i"1m":s=l.g.1F(),i=0;1p;1i"3v":s=0,i=0}1c("1E"===t(14).11("2B"))17 r="1E";1w 17 r=t(14).11("5u")?t(14).11("5u"):!1;2q(r){1i"1j":i=l.g.1y(),s=0;1p;1i"1G":i=-l.g.1y(),s=0;1p;1i"1n":s=l.g.1F(),i=0;1p;1i"1m":s=-l.g.1F(),i=0;1p;1i"3v":s=0,i=0;1p;1i"1E":i=t(14).11("3h")?"1j"===t(14).11("3h")?l.g.1y():"1G"===t(14).11("3h")?-l.g.1y():-1b(t(14).11("3h")):-l.1v.7R,s=t(14).11("3e")?"1n"===t(14).11("3e")?l.g.1F():"1m"===t(14).11("3e")?-l.g.1F():-1b(t(14).11("3e")):-l.1v.7W}17 n=5e=5i=4r=4W=4Y=3f=3c="1P";n=t(14).11("5M")?t(14).11("5M"):l.1v.81,5e=t(14).11("7l")?t(14).11("7l"):l.1v.82,5i=t(14).11("7k")?t(14).11("7k"):l.1v.7V,4r=t(14).11("5K")?t(14).11("5K"):l.1v.7Q,4W=t(14).11("7j")?t(14).11("7j"):l.1v.8f,4Y=t(14).11("7n")?t(14).11("7n"):l.1v.8b,1===4r?(3f=t(14).11("7h")?t(14).11("7h"):l.1v.8d,3c=t(14).11("7i")?t(14).11("7i"):l.1v.8e):3f=3c=4r;23(17 d=t(14).11("7m")?t(14).11("7m").1K(" "):l.1v.8a,g=0;g<d.1h;g++)-1===d[g].1f("%")&&-1!==d[g].1f("1j")&&-1!==d[g].1f("1G")&&-1!==d[g].1f("1n")&&-1!==d[g].1f("1m")&&(d[g]=""+1b(d[g])*l.g.1x+"1B");17 h=d.8H(" "),c=t(14).11("70")?t(14).11("70"):l.1v.86,f=1b(t(14).19("1j")),p=1b(t(14).19("1n")),m=1b(t(14).1g("1s").1K("12-l")[1]),v=t(14).3r()>t(14).3l()?t(14).3r():t(14).3l(),y=0===1b(n)?t(14).3r():v,b=0===1b(n)?t(14).3l():v;1c(-1===m&&"1E"!==r||"1j"===t(14).11("3h")||"1G"===t(14).11("3h")?0>i?i=-(l.g.1y()-f+(3f/2-.5)*y+1D):i>0&&(i=f+(3f/2+.5)*y+1D):i*=l.g.1x,-1===m&&"1E"!==r||"1n"===t(14).11("3e")||"1m"===t(14).11("3e")?0>s?s=-(l.g.1F()-p+(3c/2-.5)*b+1D):s>0&&(s=p+(3c/2+.5)*b+1D):s*=l.g.1x,-1===m||"1E"===r)17 w=1;1w 17 x=l.g.1I.11("6Z")?1b(l.g.1I.11("6Z")):l.o.8o,w=m*x;1c("1E"===t(14).11("2B"))17 S=l.1v.71,L=l.1v.4y,T=l.1v.4x;1w 17 S=l.o.71,L=l.o.4y,T=l.o.4x;17 I=t(14).11("5S")?1b(t(14).11("5S")):S,k=t(14).11("4E")?1b(t(14).11("4E")):L;0===k&&(k=1);17 O=t(14).11("4L")?t(14).11("4L"):T;e&&(I=0,k=e),t(14).11("46")&&2i(t(14).11("46"));17 C={29:"2D"},W=t(14),X={3a:n,4B:5e,4C:5i,6W:4W,7g:4Y,5l:3f,5k:3c,x:-i*w,y:-s*w,1N:I/1Q,3W:a(O),8i:16(){W.19(C)}};("3v"==r||!r&&"3v"===o||"8p"!==t(14).11("aR")&&"1E"===t(14).11("2B"))&&(X.36=0,C.36=t(14).11("75")),t(14).11("3C")&&t(14).11("3C").7I(),2Z.8L(t(14)[0],{8r:h,8s:c}),t(14).11("3C",2Z.2k(t(14)[0],k/1Q,X))}})},L=16(){l.g.1r.1N(f+v).4m({1a:l.g.1y(),1d:l.g.1F()},y,b)},T=16(){l.g.3i&&(f=0),"16"==1O l.o.aa&&l.o.aa(l.g,f+v),l.g.1r.18(\' > *[1s*="12-l"]\').1M(16(){1c(t(14).11("2B")||l.5r(t(14)),"1E"===t(14).11("2B"))17 e="1E";1w 17 e=t(14).11("3o")?t(14).11("3o"):u;17 i,s;2q(e){1i"1j":i=-l.g.1y(),s=0;1p;1i"1G":i=l.g.1y(),s=0;1p;1i"1n":s=-l.g.1F(),i=0;1p;1i"1m":s=l.g.1F(),i=0;1p;1i"3v":s=0,i=0;1p;1i"1E":i=t(14).11("59")?"1j"===t(14).11("59")?-l.g.1y():"1G"===t(14).11("59")?l.g.1y():1b(t(14).11("59")):l.1v.9i,s=t(14).11("5c")?"1n"===t(14).11("5c")?-l.g.1F():"1m"===t(14).11("5c")?l.g.1F():1b(t(14).11("5c")):l.1v.9d}17 o=8U=7F=6b=7s=7H=51=53="1P";o=t(14).11("8A")?t(14).11("8A"):l.1v.9g,8U=t(14).11("bo")?t(14).11("bo"):l.1v.9h,7F=t(14).11("bn")?t(14).11("bn"):l.1v.9c,6b=t(14).11("8C")?t(14).11("8C"):l.1v.9l,7s=t(14).11("bm")?t(14).11("bm"):l.1v.9U,7H=t(14).11("bf")?t(14).11("bf"):l.1v.9W,1===6b?(51=t(14).11("bd")?t(14).11("bd"):l.1v.98,53=t(14).11("bq")?t(14).11("bq"):l.1v.a9):51=53=6b;23(17 r=t(14).11("b7")?t(14).11("b7").1K(" "):l.1v.9T,n=0;n<r.1h;n++)-1===r[n].1f("%")&&-1!==r[n].1f("1j")&&-1!==r[n].1f("1G")&&-1!==r[n].1f("1n")&&-1!==r[n].1f("1m")&&(r[n]=""+1b(r[n])*l.g.1x+"1B");17 d=r.8H(" "),g=t(14).11("b6")?t(14).11("b6"):l.1v.9S,h=1b(t(14).19("1j")),c=1b(t(14).19("1n")),f=1b(t(14).1g("1s").1K("12-l")[1]);-1!==t(14)[0].1L.1a.1f("%")&&t(14).19({1a:l.g.1y()/1D*1b(t(14)[0].1L.1a)});17 p=t(14).3r()>t(14).3l()?t(14).3r():t(14).3l(),m=0===1b(o)?t(14).3r():p,v=0===1b(o)?t(14).3l():p;1c(-1===f&&"1E"!==e||"1j"===t(14).11("59")||"1G"===t(14).11("59")?0>i?i=-(h+(51/2+.5)*m+1D):i>0&&(i=l.g.1y()-h+(51/2-.5)*m+1D):i*=l.g.1x,-1===f&&"1E"!==e||"1n"===t(14).11("5c")||"1m"===t(14).11("5c")?0>s?s=-(c+(53/2+.5)*v+1D):s>0&&(s=l.g.1F()-c+(53/2-.5)*v+1D):s*=l.g.1x,-1===f||"1E"===e)17 y=1;1w 17 b=l.g.1r.11("b9")?1b(l.g.1r.11("b9")):l.o.aZ,y=f*b;1c("1E"===t(14).11("2B"))17 w=l.1v.5J,x=l.1v.5w,S=l.1v.5x;1w 17 w=l.o.5J,x=l.o.5w,S=l.o.5x;17 L=t(14).11("5b")?1b(t(14).11("5b")):w,T=t(14).11("68")?1b(t(14).11("68")):x,I=t(14).11("67")?t(14).11("67"):S,k=t(14),O=16(){k.2o("12-2t-3A")&&k.1l("12-8y"),1==l.o.5I&&(k.18(".12-32").2s(),k.18("2t, 6G").1M(16(){0!==1O t(14)[0].6R&&(t(14)[0].6R=0),t(14).2s()})),(!k.2o("12-2t-3A")||k.2o("12-2t-3A")&&l.o.5I===!1)&&k.11("4A")>0&&k.11("46",2h(16(){l.8x(k)},k.11("4A")))};t(14).19({3G:0,44:0});17 C={5l:51,5k:53,6W:7s,7g:7H,3a:o,4B:8U,4C:7F,29:"2O",x:i*y,y:s*y},W={3a:0,4B:0,4C:0,6W:0,7g:0,5l:1,5k:1,3W:a(I),1N:L/1Q,x:0,y:0,8i:16(){O()}};(-1!=e.1f("3v")||"8p"!==t(14).11("eK")&&"1E"===t(14).11("2B"))&&(C.36=0,W.36=t(14).11("75")),t(14).11("3C")&&t(14).11("3C").7I(),2Z.8L(t(14)[0],{8s:g,8r:d}),t(14).11("3C",2Z.6w(t(14)[0],T/1Q,C,W))})},I=16(){1c(o(t(e))&&(l.g.1r.11("58")||l.g.1r.11("5E")))1c(l.g.1r.11("58")&&l.g.1r.11("5E")){17 i=1A.26(2*1A.2e()),a=[["3d",l.g.1r.11("58")],["bs",l.g.1r.11("5E")]];O(a[i][0],a[i][1])}1w l.g.1r.11("58")?O("3d",l.g.1r.11("58")):O("bs",l.g.1r.11("5E"));1w 1c(l.g.1r.11("5D")&&l.g.1r.11("5F")){17 i=1A.26(2*1A.2e()),a=[["2d",l.g.1r.11("5D")],["br",l.g.1r.11("5F")]];O(a[i][0],a[i][1])}1w l.g.1r.11("5D")?O("2d",l.g.1r.11("5D")):l.g.1r.11("5F")?O("br",l.g.1r.11("5F")):O("2d","1")},k=16(){o(t(e))&&-1!=5W.1f("3d")?O("3d",5W.1K(":")[1]):-1!=5W.1f("3d")?O("2d","4T"):O("2d",5W.1K(":")[1])},O=16(t,e){17 i,a,s=-1==t.1f("eI")?l.t:l.ct,o="3d";1c(-1!=t.1f("2d")&&(o="2d"),-1!=e.1f("7v"))a=s["t"+o].1h-1,i="7v";1w 1c(-1!=e.1f("4T"))a=1A.26(1A.2e()*n(s["t"+o])),i="2e bu 4T";1w{17 r=e.1K(","),d=r.1h;a=1b(r[1A.26(1A.2e()*d)])-1,i="2e bu e7"}C(o,s["t"+o][a])},C=16(e,i){17 o=l.g.i,n=l.g.1I.18(\'*[1s*="12-l"]\').1h>0?1Q:0,d=-1==i.6x.24().1f("dV")?!1:!0,g=-1==i.6x.24().1f("dd")?!1:!0,h=1O i.48,c=1O i.4g;2q(h){1i"3V":h=i.48;1p;1i"5O":h=1A.26(1A.2e()*(1b(i.48.1K(",")[1])-1b(i.48.1K(",")[0])+1))+1b(i.48.1K(",")[0]);1p;av:h=1A.26(1A.2e()*(i.48[1]-i.48[0]+1))+i.48[0]}2q(c){1i"3V":c=i.4g;1p;1i"5O":c=1A.26(1A.2e()*(1b(i.4g.1K(",")[1])-1b(i.4g.1K(",")[0])+1))+1b(i.4g.1K(",")[0]);1p;av:c=1A.26(1A.2e()*(i.4g[1]-i.4g[0]+1))+i.4g[0]}(1==l.g.7f()&&1==l.o.9t||l.g.2p&&1==l.o.9n)&&(h>=15?h=7:h>=5?h=4:h>=4?h=3:h>2&&(h=2),c>=15?c=7:c>=5?c=4:c>=4?c=3:c>2&&(c=2),c>2&&h>2&&(c=2,h>4&&(h=4)));17 u=l.g.i.1a()/h,f=l.g.i.1d()/c;l.g.2u?l.g.2u.1t(!0,!0).63().19({1J:"2f",1a:o.1a(),1d:o.1d()}):l.g.2u=t("<1k>").1l("12-1v-2b").1l("12-4G-2D").19({1a:o.1a(),1d:o.1d()}).4S(o);17 p=o.1a()-1A.26(u)*h,m=o.1d()-1A.26(f)*c,v=[];v.aC=16(){17 t,e,i,a=14.1h;1c(0==a)21!1;23(;--a;)t=1A.26(1A.2e()*(a+1)),e=14[a],i=14[t],14[a]=i,14[t]=e;21 14};23(17 y=0;h*c>y;y++)v.8c(y);2q(i.3P.d9){1i"5t":v.5t();1p;1i"ax-85":v=r(c,h,"85");1p;1i"ax-5t":v=r(c,h,"5t");1p;1i"2e":v.aC()}17 b=l.g.1I.18(".12-bg"),w=l.g.1r.18(".12-bg");1c(0==b.1h&&0==w.1h&&(e="2d",i=t.4Q(!0,{},l.t.df[0]),i.1z.2r=1,i.3P.1N=0),"3d"==e){l.g.3i=(h*c-1)*i.3P.1N;17 L=0;i.2J&&i.2J.2r&&(L+=i.2J.2r),i.2a&&i.2a.2r&&(L+=i.2a.2r),i.2v&&i.2v.2r&&(L+=i.2v.2r),l.g.3i+=L;17 I=0;i.2J&&i.2J.1N&&(I+=i.2J.1N),i.2a&&i.2a.1N&&(I+=i.2a.1N),i.2v&&i.2v.1N&&(I+=i.2v.1N),l.g.3i+=I}1w l.g.3i=(h*c-1)*i.3P.1N+i.1z.2r,l.g.5U=t("<1k>").1l("12-dg").1C(l.g.2u),l.g.8N=t("<1k>").1l("12-dl").1C(l.g.2u);23(17 k=l.g.2m,O=0;h*c>O;O++){17 C,W,X=O%h==0?p:0,Y=O>(c-1)*h-1?m:0,H=t("<1k>").1l("12-1v-3P").19({1a:1A.26(u)+X,1d:1A.26(f)+Y}).1C(l.g.2u);1c("3d"==e){H.1l("12-3d-2b");17 P,M=1A.26(u)+X,N=1A.26(f)+Y;P="ao"==i.2a.5R?1A.4o(i.2a.1z.30)>90&&"aA"!=i.3P.az?1A.26(M/7)+X:M:1A.4o(i.2a.1z.2L)>90&&"aA"!=i.3P.az?1A.26(N/7)+Y:N;17 B=M/2,R=N/2,A=P/2,z=16(e,i,a,s,o,r,n,d,l){t("<1k>").1l(e).19({1a:a,1d:s,"-o-3T":"5A("+o+"1B, "+r+"1B, "+n+"1B) 2L("+d+"3O) 30("+l+"3O) 5B(5v) 4z(1, 1, 1)","-dk-3T":"5A("+o+"1B, "+r+"1B, "+n+"1B) 2L("+d+"3O) 30("+l+"3O) 5B(5v) 4z(1, 1, 1)","-dj-3T":"5A("+o+"1B, "+r+"1B, "+n+"1B) 2L("+d+"3O) 30("+l+"3O) 5B(5v) 4z(1, 1, 1)","-6U-3T":"5A("+o+"1B, "+r+"1B, "+n+"1B) 2L("+d+"3O) 30("+l+"3O) 5B(5v) 4z(1, 1, 1)",3T:"5A("+o+"1B, "+r+"1B, "+n+"1B) 2L("+d+"3O) 30("+l+"3O) 5B(5v) 4z(1, 1, 1)"}).1C(i)};z("12-3d-3L",H,0,0,0,0,-A,0,0);"cW"==i.2a.5R&&1A.4o(i.2a.1z.2L)>90?z("12-3d-5y",H.18(".12-3d-3L"),M,N,-B,-R,-A,6e,0):z("12-3d-5y",H.18(".12-3d-3L"),M,N,-B,-R,-A,0,6e),z("12-3d-1m",H.18(".12-3d-3L"),M,P,-B,R-A,0,-90,0),z("12-3d-1n",H.18(".12-3d-3L"),M,P,-B,-R-A,0,90,0),z("12-3d-ai",H.18(".12-3d-3L"),M,N,-B,-R,A,0,0),z("12-3d-1j",H.18(".12-3d-3L"),P,N,-B-A,-R,0,0,-90),z("12-3d-1G",H.18(".12-3d-3L"),P,N,B-A,-R,0,0,90),C=H.18(".12-3d-ai"),W=H.18("ao"==i.2a.5R?1A.4o(i.2a.1z.30)>90?".12-3d-5y":".12-3d-1j, .12-3d-1G":1A.4o(i.2a.1z.2L)>90?".12-3d-5y":".12-3d-1n, .12-3d-1m");17 D=v[O]*i.3P.1N,U=l.g.2u.18(".12-3d-2b:eq("+O+") .12-3d-3L"),F=1E al;i.2J&&i.2J.1z?(i.2J.1z.1N=i.2J.1z.1N?(i.2J.1z.1N+D)/1Q:D/1Q,F.2k(U[0],i.2J.2r/1Q,s(i.2J.1z,i.2J.4O))):i.2a.1z.1N=i.2a.1z.1N?(i.2a.1z.1N+D)/1Q:D/1Q,F.2k(U[0],i.2a.2r/1Q,s(i.2a.1z,i.2a.4O)),i.2v&&(i.2v.1z||(i.2v.1z={}),F.2k(U[0],i.2v.2r/1Q,s(i.2v.1z,i.2v.4O,"2v")))}1w{17 q=2Y=2Q=2M="1X",j=6T=1;1c("2e"==i.1z.5R)17 V=["1n","1m","1G","1j"],Q=V[1A.26(1A.2e()*V.1h)];1w 17 Q=i.1z.5R;1c(-1!=i.6x.24().1f("aS")&&O%2==0&&(k="1T"==k?"1Y":"1T"),"1T"==k)2q(Q){1i"1n":Q="1m";1p;1i"1m":Q="1n";1p;1i"1j":Q="1G";1p;1i"1G":Q="1j";1p;1i"7D":Q="7z";1p;1i"7L":Q="7u";1p;1i"7u":Q="7L";1p;1i"7z":Q="7D"}2q(Q){1i"1n":q=2Q=-H.1d(),2Y=2M=0;1p;1i"1m":q=2Q=H.1d(),2Y=2M=0;1p;1i"1j":q=2Q=0,2Y=2M=-H.1a();1p;1i"1G":q=2Q=0,2Y=2M=H.1a();1p;1i"7D":q=H.1d(),2Q=0,2Y=H.1a(),2M=0;1p;1i"7L":q=H.1d(),2Q=0,2Y=-H.1a(),2M=0;1p;1i"7u":q=-H.1d(),2Q=0,2Y=H.1a(),2M=0;1p;1i"7z":q=-H.1d(),2Q=0,2Y=-H.1a(),2M=0}2q(l.g.55=i.1z.6a?i.1z.6a:1,1==d&&1!=l.g.55&&(q/=2,2Q/=2,2Y/=2,2M/=2),i.1z.4s){1i"3v":q=2Q=2Y=2M=0,j=0,6T=1;1p;1i"d1":j=0,6T=1,1==l.g.55&&(2Q=2M=0)}1c(H.19((i.1z.3m||i.1z.2L||i.1z.30||1!=l.g.55)&&!l.g.2p&&"1q"!=i.1z.4s?{4G:"2O"}:{4G:"2D"}),l.g.5U.19(1==d?{4G:"2O"}:{4G:"2D"}),1==g||"1q"==i.1z.4s||1==d){17 E=H.1C(l.g.5U),G=H.8t().1C(l.g.8N);C=t("<1k>").1l("12-dn").1C(E)}1w 17 G=H.1C(l.g.8N);W=t("<1k>").1l("12-dL").1C(G).19({1n:-q,1j:-2Y,dJ:"2f",36:j});17 Z=v[O]*i.3P.1N,5f=i.1z.3m?i.1z.3m:0,J=i.1z.2L?i.1z.2L:0,$=i.1z.30?i.1z.30:0;1c("1T"==k&&(5f=-5f,J=-J,$=-$),2Z.6w(W[0],i.1z.2r/1Q,{3a:5f,4B:J,4C:$,6a:l.g.55},{1N:Z/1Q,1n:0,1j:0,36:6T,3a:0,4B:0,4C:0,6a:1,3W:a(i.1z.4O)}),1==g&&(w.1h<1||w.1h>0&&(-1!=w.1g("1e").24().1f("4H")||w.1a()<l.g.1y()||w.1d()<l.g.1F()))&&2Z.2k(C[0],i.1z.2r/1Q,{1N:Z/1Q,36:0,3W:a(i.1z.4O)}),("1q"==i.1z.4s||1==d)&&-1==i.6x.24().1f("aS")){17 K=0;0!=5f&&(K=-5f),2Z.2k(C[0],i.1z.2r/1Q,{1N:Z/1Q,1n:2Q,1j:2M,3a:K,6a:l.g.55,36:j,3W:a(i.1z.4O)})}}b.1h&&("3d"==e||"2d"==e&&(1==g||"1q"==i.1z.4s||1==d)?C.43(t("<28>").1g("1e",b.1g("1e")).19({1a:b[0].1L.1a,1d:b[0].1L.1d,3G:3j(b.19("47-1j"))-3j(H.3F().1j),44:3j(b.19("47-1n"))-3j(H.3F().1n)})):0==l.g.5U.2X().1h&&l.g.5U.43(t("<28>").1g("1e",b.1g("1e")).19({1a:b[0].1L.1a,1d:b[0].1L.1d,3G:3j(b.19("47-1j")),44:3j(b.19("47-1n"))}))),w.1h&&W.43(t("<28>").1g("1e",w.1g("1e")).19({1a:w[0].1L.1a,1d:w[0].1L.1d,3G:3j(w.19("47-1j"))-3j(H.3F().1j),44:3j(w.19("47-1n"))-3j(H.3F().1n)}))}17 6r=l.g.1I,ee=l.g.1r;2h(16(){6r.18(".12-bg").19({29:"2D"})},50),ee.18(".12-bg").19({29:"2D"}),l.g.2u.2n("12-4G-2D"),S(n),0===n&&(n=10),2h(16(){6r.19({1a:0})},n);17 8j=1b(ee.11("6d"))?1b(ee.11("6d")):0,ae=l.g.3i+8j>0?l.g.3i+8j:0;2h(16(){1==l.g.2g&&(l.g.2u.63(),6r.2n("12-1U"),l.3x(ee,16(){l.g.2g=!1})),T(),(ee.18(".12-bg").1h<1||ee.18(".12-bg").1h>0&&-1!=ee.18(".12-bg").1g("1e").24().1f("4H"))&&l.g.2u.1N(8M).3B(2z,16(){t(14).63().aJ()}),ee.19({1a:l.g.1y(),1d:l.g.1F()})},ae),l.g.3i<2z&&(l.g.3i=1Q),2h(16(){l.g.2u.1l("12-4G-2D"),ee.18(".12-bg").1h?(ee.18(".12-bg").19({1J:"1P",29:"2O"}),l.g.2p?(ee.18(".12-bg").19("1J","2f"),2h(16(){x()},4e)):ee.18(".12-bg").2y(4e,16(){x()})):x()},l.g.3i)},W=16(){l.g.1r.18(\' > *[1s*="12-l"]\').1M(16(){t(14).19({29:"2D"})}),l.g.8F=t(e).4q().1n,t(1W).3R(16(){2h(16(){l.g.8F=t(e).4q().1n},20)});17 i=16(){t(1W).dx()+t(1W).1d()-l.g.1F()/2>l.g.8F&&(l.g.6k=!0,l.g.8v===!0&&(l.o.49=!0,l.27()),T())};t(1W).dy(16(){l.g.6k||i()}),i()},X=(l.g.1r.11("58")||l.g.1r.11("5D"))&&l.t||(l.g.1r.11("5E")||l.g.1r.11("5F"))&&l.ct?"1E":"65";1c(l.g.1r.11("2B")||l.5r(l.g.1r),"1E"===l.g.1r.11("2B")&&(X="1E"),l.o.8B&&(X="9X"),l.o.4V&&!l.g.6k){1c(1==l.g.2w){17 f=0;l.o.7U(l.g)}1w{17 Y=1b(l.g.1r.11("6d"))?1b(l.g.1r.11("6d")):0,H="1E"==X?0:p;l.g.aL=2h(16(){x()},H+1A.4o(Y))}l.g.3i=!0,l.o.7N===!0?W():(l.g.6k=!0,T()),l.g.1r.19({1a:l.g.1y(),1d:l.g.1F()}),l.g.2p||l.g.1r.18(".12-bg").19({1J:"1P"}).2y(l.o.7E),l.g.4t=!1}1w 2q(X){1i"65":l.g.3i=!1,l.g.2u&&l.g.2u.63(),w(),S(),L(),T();1p;1i"1E":"2G"!=1O 5W?k():I();1p;1i"9X":C(l.o.8B.4s,l.o.8B.dA)}},l.5r=16(t){17 e=!t.11("12")&&(t.11("12")||t.11("5X")||t.11("3o")||t.11("5u")||t.11("5b")||t.11("5S")||t.11("68")||t.11("4E")||t.11("4A")||t.11("67")||t.11("4L")||t.11("8C")||t.11("5K")||t.11("8A")||t.11("5M"))?"65":"1E";t.11("2B",e)},l.8x=16(t){t.11("2B")||l.5r(t),t.2n("12-8y");17 e=l.g.1I;"1T"!=l.g.2m&&l.g.1r&&(e=l.g.1r);17 i,s,o=e.11("3o")?e.11("3o"):l.o.8K,r=l.g.8m[l.g.2m][o],n=t.11("3o")?t.11("3o"):r;2q(n){1i"1j":i=-l.g.1y(),s=0;1p;1i"1G":i=l.g.1y(),s=0;1p;1i"1n":s=-l.g.1F(),i=0;1p;1i"1m":s=l.g.1F(),i=0;1p;1i"3v":s=0,i=0}1c("1E"===t.11("2B"))17 d="1E";1w 17 d=t.11("5u")?t.11("5u"):!1;2q(d){1i"1j":i=l.g.1y(),s=0;1p;1i"1G":i=-l.g.1y(),s=0;1p;1i"1n":s=l.g.1F(),i=0;1p;1i"1m":s=-l.g.1F(),i=0;1p;1i"3v":s=0,i=0;1p;1i"1E":i=t.11("3h")?"1j"===t.11("3h")?l.g.1y():"1G"===t.11("3h")?-l.g.1y():-1b(t.11("3h")):-l.1v.7R,s=t.11("3e")?"1n"===t.11("3e")?l.g.1F():"1m"===t.11("3e")?-l.g.1F():-1b(t.11("3e")):-l.1v.7W}17 g=5e=5i=4r=4W=4Y=3f=3c="1P";g=t.11("5M")?t.11("5M"):l.1v.81,5e=t.11("7l")?t.11("7l"):l.1v.82,5i=t.11("7k")?t.11("7k"):l.1v.7V,4r=t.11("5K")?t.11("5K"):l.1v.7Q,4W=t.11("7j")?t.11("7j"):l.1v.8f,4Y=t.11("7n")?t.11("7n"):l.1v.8b,1===4r?(3f=t.11("7h")?t.11("7h"):l.1v.8d,3c=t.11("7i")?t.11("7i"):l.1v.8e):3f=3c=4r;23(17 h=t.11("7m")?t.11("7m").1K(" "):l.1v.8a,c=0;c<h.1h;c++)-1===h[c].1f("%")&&-1!==h[c].1f("1j")&&-1!==h[c].1f("1G")&&-1!==h[c].1f("1n")&&-1!==h[c].1f("1m")&&(h[c]=""+1b(h[c])*l.g.1x+"1B");17 u=h.8H(" "),f=t.11("70")?t.11("70"):l.1v.86,p=1b(t.19("1j")),m=1b(t.19("1n")),v=1b(t.1g("1s").1K("12-l")[1]),y=t.3r()>t.3l()?t.3r():t.3l(),b=0===1b(g)?t.3r():y,w=0===1b(g)?t.3l():y;1c(-1===v&&"1E"!==d||"1j"===t.11("3h")||"1G"===t.11("3h")?0>i?i=-(l.g.1y()-p+(3f/2-.5)*b+1D):i>0&&(i=p+(3f/2+.5)*b+1D):i*=l.g.1x,-1===v&&"1E"!==d||"1n"===t.11("3e")||"1m"===t.11("3e")?0>s?s=-(l.g.1F()-m+(3c/2-.5)*w+1D):s>0&&(s=m+(3c/2+.5)*w+1D):s*=l.g.1x,-1===v||"1E"===d)17 x=1;1w 17 S=l.g.1I.11("6Z")?1b(l.g.1I.11("6Z")):l.o.8o,x=v*S;1c("1E"===t.11("2B"))17 L=l.1v.4y,T=l.1v.4x;1w 17 L=l.o.4y,T=l.o.4x;17 I=t.11("4E")?1b(t.11("4E")):L;0===I&&(I=1);17 k=t.11("4L")?t.11("4L"):T,O={29:"2D"},C={3a:g,4B:5e,4C:5i,6W:4W,7g:4Y,5l:3f,5k:3c,x:-i*x,y:-s*x,3W:a(k),8i:16(){t.19(O)}};("3v"==d||!d&&"3v"==n||"8p"!==t.11("aR")&&"1E"===t.11("2B"))&&(C.36=0,O.36=t.11("75")),2Z.8L(t[0],{8s:f,8r:u}),2Z.2k(t[0],I/1Q,C)},l.3R()},a=16(t){17 e;1c(-1!==t.24().1f("aX")||-1!==t.24().1f("8X"))e=95.94;1w 1c(-1!==t.24().1f("8W")){17 i=t.24().1K("8W")[1];e=1W[i.8R(0).7G()+i.7C(1)].aT}1w 1c(-1!==t.24().1f("8T")){17 i=t.24().1K("8T")[1];e=1W[i.8R(0).7G()+i.7C(1)].aV}1w 1c(-1!==t.24().1f("8P")){17 i=t.24().1K("8P")[1];e=1W[i.8R(0).7G()+i.7C(1)].ak}21 e},s=16(t,e,i,s){1c("2G"==1O e)17 e="d5";17 o={};21 t.3m!==s&&(o.3a=t.3m),t.30!==s&&(o.4C=t.30),t.2L!==s&&(o.4B=t.2L),"2v"===i?o.5l=o.5k=o.aj=1:t.4z!==s&&(o.5l=o.5k=o.aj=t.4z),t.1N&&(o.1N="2v"===i?t.1N/1Q:t.1N),o.3W=a(e),o},o=16(e){17 i=t("<1k>"),a=!1,s=!1,o=["cZ","cT","cS","cU","cX"];3T=["d6","d7","di","dh","da"];23(17 r=o.1h-1;r>=0;r--)a=a?a:au 0!=i[0].1L[o[r]];23(17 r=3T.1h-1;r>=0;r--)i.19("3T-1L","ay-3d"),s=s?s:"ay-3d"==i[0].1L[3T[r]];21 a&&au 0!=i[0].1L[o[4]]&&(i.1g("5Y","12-dc").1C(e),a=3===i[0].eJ&&9===i[0].eH,i.bw()),a&&s},r=16(t,e,i){17 a=[];1c("85"==i)23(17 s=0;t>s;s++)23(17 o=0;e>o;o++)a.8c(s+o*t);1w 23(17 s=t-1;s>-1;s--)23(17 o=e-1;o>-1;o--)a.8c(s+o*t);21 a},n=16(t){17 e=0;23(17 i 3E t)t.eA(i)&&++e;21 e},d=16(){bl=16(t){t=t.24();17 e=/(bk)[ \\/]([\\w.]+)/.5H(t)||/(6U)[ \\/]([\\w.]+)/.5H(t)||/(ez)(?:.*3M|)[ \\/]([\\w.]+)/.5H(t)||/(9k) ([\\w.]+)/.5H(t)||t.1f("b8")<0&&/(ey)(?:.*? eB:([\\w.]+)|)/.5H(t)||[];21{8u:e[1]||"",3M:e[2]||"0"}};17 t=bl(40.3X),e={};21 t.8u&&(e[t.8u]=!0,e.3M=t.3M),e.bk?e.6U=!0:e.6U&&(e.eD=!0),e};i.72={3M:"5.6.0",7f:16(){21 40.3X.3I(/f0/i)||40.3X.3I(/f1/i)||40.3X.3I(/f2/i)||40.3X.3I(/eY/i)||40.3X.3I(/eS/i)||40.3X.3I(/eR/i)||40.3X.3I(/eQ eT/i)?!0:!1},eU:16(t){21"1X"==t.19("2c-1m")||"1P"==t.19("2c-1m")||0==t.19("2c-1m")||"eW"==t.19("2c-1m")?!0:!1},2p:d().9k&&d().3M<9?!0:!1,8v:!1,2N:!1,4d:!1,2A:!1,2P:!1,2w:6Y,2m:"1Y",4f:6Y,1y:6Y,1F:6Y,ew:0,8m:{1T:{1j:"1G",1G:"1j",1n:"1m",1m:"1n"},1Y:{1j:"1j",1G:"1G",1n:"1n",1m:"1m"}},v:{d:4e,91:8S,78:4e}},i.9p={9i:80,9d:0,5w:1Q,5J:0,5x:"73",2y:!0,9g:0,9h:0,9c:0,9l:1,98:1,a9:1,9U:0,9W:0,9T:["50%","50%","0"],9S:4e,7R:-80,7W:0,4y:9P,dZ:0,4x:"73",3B:!0,81:0,82:0,7V:0,7Q:1,8d:1,8e:1,8f:0,8b:0,8a:["50%","50%","0"],86:4e},i.9Q={7d:aU},i.9Z={a4:!0,41:0,76:0,7J:!1,4S:"",49:!0,7N:!0,9N:!0,2U:1,4V:!0,7E:8M,4v:0,79:!0,8h:!1,77:!1,3p:"e3",3D:"/69/e2/",8Q:"8O",7a:!1,8Y:!0,7b:!0,7e:!0,9z:!0,9A:!0,9w:!0,74:!1,9v:!1,9r:!0,38:"1S",6X:"60%",8k:1D,5N:60,8l:35,8n:1D,5I:!0,2C:"1X",9s:"et.ev",3S:!0,4J:!0,1u:!1,9J:"1j: -9D; 1n: -9D;",8D:!1,9E:"c5",9t:!0,9n:!0,7K:!1,b5:0,bc:co,cP:"",ba:16(){},bt:16(){},b3:16(){},aw:16(){},aB:16(){},7U:16(){},6V:16(){},7c:16(){},7d:aU,8K:"1G",aZ:.45,8o:.45,5w:1Q,4y:1Q,5x:"73",4x:"73",5J:0,71:0}}(3K);', 0, 933, "|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||data|ls||this||function|var|find|css|width|parseInt|if|height|src|indexOf|attr|length|case|left|div|addClass|bottom|top|nav|break|slide|nextLayer|class|stop|yourLogo|lt|else|ratio|sliderWidth|transition|Math|px|appendTo|100|new|sliderHeight|right|thumbnail|curLayer|display|split|style|each|delay|typeof|none|1e3|iframe|hover|prev|active|parent|window|auto|next|curLayerIndex||return|the|for|toLowerCase||floor|start|img|visibility|animation|container|padding||random|block|resize|setTimeout|clearTimeout|replace|to|sliderOriginalWidth|prevNext|removeClass|hasClass|ie78|switch|duration|click|video|ltContainer|after|layersNum|originalAutoSlideshow|fadeIn|300|autoSlideshow|transitiontype|autoPauseSlideshow|hidden|href|cttl|undefined|wrapper|image|before|LayerSlider|rotateX|L2|paused|visible|isAnimating|T2|not|originalWidth|originalHeight|firstSlide|init|fullwidth|children|L1|TweenLite|rotateY|of|videopreview|loaded|circleTimer||opacity||thumbnailNavigation||rotation|wp|curSubScaleY||offsetyout|curSubScaleX|layerSlider|offsetxout|totalDuration|parseFloat|bottomWrapper|outerHeight|rotate|barTimer|slidedirection|skin|youtube|outerWidth|curSlideTime|is|preventDefault|fade|background|makeResponsive|closest|preloaded|layer|fadeOut|tr|skinsPath|in|position|marginLeft|param|match|com|jQuery|box|version|sliderOriginalHeight|deg|tile|vimeo|load|imgPreload|transform|pausedSlideTime|number|ease|userAgent|on|thumbsWrapper|navigator|responsiveUnder|error|append|marginTop||showUntilTimer|margin|cols|autoStart|responsiveMode|location|shadow|pausedByVideo|500|slideTimer|rows|startSlideTime|nextLoop|originalLeft|border|forcehide|animate|html|abs|thumb|offset|curSubScale|type|isLoading|originalTop|loops|tn|easingOut|durationOut|scale3d|showuntil|rotationX|rotationY|autoplay|durationout|media|overflow|png|always|lazyLoad|or|easingout|like|change|easing|your|extend|Please|prependTo|all|slidebuttons|animateFirstSlide|curSubSkewX|body|curSubSkewY|document||nextSubScaleX|inner|nextSubScaleY|vpcontainer|scale2D|Date|fisrtSlide|transition3d|offsetxin|rel|delayin|offsetyin|index|curSubRotateX|_|touches|thumbnails|curSubRotateY|getTime|scaleY|scaleX|youtu|videoSrc|shadowImg|and|touchEndX|transitionType|li|reverse|slideoutdirection|0deg|durationIn|easingIn|back|timer|translate3d|rotateZ|span|transition2d|customtransition3d|customtransition2d|originalRight|exec|autoPlayVideos|delayIn|scaleout|originalBottom|rotateout|tnHeight|string|http|trim|direction|delayout|WordPress|curTiles|it|LSCustomTransition|slidedelay|id|player||removeAttr|pause|empty|url|old|nextLayerIndex|easingin|durationin|layerslider|scale|nextSubScale|slider|timeshift|180|fadeTo|originalBorderTop|link|used|originalBorderRight|firstSlideAnimated|images|wrong|ontouchstart|script|ytplayer|nextLayerTop|te|curLayerTop|nextLayerLeft|console|play|fromTo|name|URL|cannot|nIt|seems|layerMarginTop|check|nothumb|clicked|audio|showShadow|parallaxlevel|originalBorderLeft|html5|bind|originalBorderBottom|helper|layerMarginLeft|touchStartX|URLs|currentTime|pointing|O2|webkit|cbPrev|skewX|tnContainerWidth|null|parallaxout|perspectiveout|delayOut|global|easeInOutQuint|hoverBottomNav|originalOpacity|layersContainer|randomSlideshow|fi|forceLoopNum|globalBGImage|navStartStop|cbNext|slideDelay|navButtons|isMobile|skewY|scalexout|scaleyout|skewxout|rotateyout|rotatexout|transformoriginout|skewyout|nextLayerHeight|sublayerContainer|nextLayerRight|kmGS|nextSubSkewX|dequeue|bottomleft|last|nextLayerWidth|changeThumb|resizeShadow|bottomright|nextLayerBottom|numYouTubeCurSlide|slice|topleft|sliderFadeInDuration|nextSubRotateY|toUpperCase|nextSubSkewY|kill|fullScreen|hideOnMobile|topright|bottomNavSizeHelper|startInViewport|originalPaddingBottom|curLayerRight|scaleOut|offsetXOut|resizeYourLogo|scrollThumb|cbAnimStop|rotateYOut|offsetYOut|forceHideControls|oB|oR||rotateOut|rotateXOut|originalPaddingTop|pageX|forward|perspectiveOut|oT|250|resizeSlider|transformOriginOut|skewYOut|push|scaleXOut|scaleYOut|skewXOut|curLayerBottom|twoWaySlideshow|onComplete|ie|tnWidth|tnActiveOpacity|slideDirections|tnInactiveOpacity|parallaxOut|false|originalSlide|transformOrigin|transformPerspective|clone|browser|originalAutoStart|150|sublayerShowUntil|videohack|add|rotatein|slideTransition|scalein|yourLogoLink|head|sliderTop|defaults|join|content|text|slideDirection|set|350|nextTiles|transparent|easein|globalBGColor|charAt|750|easeout|nextSubRotateX|originalPaddingLeft|easeinout|linear|navPrevNext|videoTimer||fo|linkto|originalPaddingRight|easeNone|Linear|t2|t3|scaleXIn|forcestop|t1|alert|rotateYIn|offsetYIn|stopLayer|ieEasing|rotateIn|rotateXIn|offsetXIn|substring|msie|scaleIn|lastIndexOf|optimizeForIE78|t4|layerTransitions|font|showCircleTimer|youtubePreview|optimizeForMobile|opaque|showBarTimer|hoverPrevNext|gi|showSlider|keybNav|touchNav|wmode|videoDuration|10px|yourLogoTarget|playVideo|target|file|alt|yourLogoStyle|playvideo|Play|oldjquery|pauseOnHover|resizeThumb|400|slideTransitions|sliderOriginalWidthRU|perspectiveIn|transformOriginIn|skewXIn|off|skewYIn|forced|shadowBtmMod|options|line|size|originalLineHeight|originalFontSize|responsive|borderLeftWidth|borderBottomWidth|borderTopWidth|borderRightWidth|scaleYIn|cbTimeLineStart|lsShowNotice|jquery|object||pageY|relative|fn|front|scaleZ|easeIn|TimelineLite|parallaxStartX||horizontal|sides|mousemove|above|strong||void|default|cbPause|col|preserve|depth|large|cbAnimStart|randomize|loading|half|createStyleSheet|plugin|firstLayer|disabled|show|meta|t5|update|layerSliderTransitions|layerSliderCustomTransitions|initialized|library|fadeout|mirror|easeInOut|4e3|easeOut|hider|swing|hash|parallaxIn|looks|It|issue|cbStop|parallaxStartY|hideUnder|perspectivein|transformoriginin|compatible|parallaxin|cbInit|clientX|hideOver|scalexin||skewyin||animating|st|2e3|chrome|uaMatch|skewxin|rotateyin|rotatexin|originalEvent|scaleyin|custom2d|custom3d|cbStart|from|norotate|remove|which||enableCSS3|bounce|Back|Bounce|animateFirstLayer|stylesheet|that|restart|insertBefore|Elastic|textDecoration|bock|Circ|insertAfter|quint|mouseleave|elastic|gpuhack|outline|lswpVersion|keydown|onYouTubeIframeAPIReady|onReverseComplete|vi|another|YT|enabled|embed|resume|wpVersion|orientationchange|multiple|_self|www|iframe_api|sine|javascript|queue|round|Player|touchmove|static|backgroundImage|indicator|cubic|touchstart|center|zIndex|backgroundColor|important|Quint|1e6|touchend|mouseenter|gif|touchscroll||sideright|blank|yourlogo|circle|cursor|quart|quad|Quart|sideleft|below|deeplink|absolute|circ|pointer|expo|bar|Sine|wrapAll|Cubic|Expo|Quad|staticImage|600|userInitData|msPerspective|OPerspective|MozPerspective|defaultInitData|vertical|WebkitPerspective|title|perspective|updating|mixed|clicking|here|exclam|easeInOutQuart|transformStyle|OTransformStyle|forceStop|sequence|WebkitTransformStyle|Settings|test3d|crossfad|events|t2d|curtiles|MozTransformStyle|msTransformStyle|moz|ms|nexttiles|redraw|curtile||about|use|Updater|support|Important|kreaturamedia|newer|higher|scrollTop|scroll|because|obj|with|older|IE|browsers|least|faq|can|originalMarkup|dispay|read|nexttile|more|You|entry|wordpress|requires|using|are|group|you|carousel|Advanced|extra|copy|showUntil|log|Trident|skins|v5|causing|changeTimer|problems|specified|prevLayerIndex|filter|layerMarginRight|layerMarginBottom|450|loads||getJSON|api|v2|stopVideo|enablejsapi|onReady||onStateChange|json|callback|ended||theme|640|maxresdefault|thumbnail_large|jpg|numYouTubeCurslide|sliders|mozilla|opera|hasOwnProperty|rv|Put|safari|enable|JS|includes|offsetLeft|custom|offsetHeight|fadein|Troubleshooting|option|within|navigate|page|Windows|BlackBerry|iPod|Phone|isHideOn3D|admin|0px|main|iPad|area|Android|webOS|iPhone".split("|"), 0, {})),
    jQuery("#homeslider").layerSlider({ responsive: !1, responsiveUnder: 1600, layersContainer: 1600, skinsPath: "css/skins/" });
/**
 * Owl Carousel v2.3.4
 * Copyright 2013-2018 David Deutsch
 * Licensed under: SEE LICENSE IN https://github.com/OwlCarousel2/OwlCarousel2/blob/master/LICENSE
 */
!function(a,b,c,d){function e(b,c){this.settings=null,this.options=a.extend({},e.Defaults,c),this.$element=a(b),this._handlers={},this._plugins={},this._supress={},this._current=null,this._speed=null,this._coordinates=[],this._breakpoint=null,this._width=null,this._items=[],this._clones=[],this._mergers=[],this._widths=[],this._invalidated={},this._pipe=[],this._drag={time:null,target:null,pointer:null,stage:{start:null,current:null},direction:null},this._states={current:{},tags:{initializing:["busy"],animating:["busy"],dragging:["interacting"]}},a.each(["onResize","onThrottledResize"],a.proxy(function(b,c){this._handlers[c]=a.proxy(this[c],this)},this)),a.each(e.Plugins,a.proxy(function(a,b){this._plugins[a.charAt(0).toLowerCase()+a.slice(1)]=new b(this)},this)),a.each(e.Workers,a.proxy(function(b,c){this._pipe.push({filter:c.filter,run:a.proxy(c.run,this)})},this)),this.setup(),this.initialize()}e.Defaults={items:3,loop:!1,center:!1,rewind:!1,checkVisibility:!0,mouseDrag:!0,touchDrag:!0,pullDrag:!0,freeDrag:!1,margin:0,stagePadding:0,merge:!1,mergeFit:!0,autoWidth:!1,startPosition:0,rtl:!1,smartSpeed:250,fluidSpeed:!1,dragEndSpeed:!1,responsive:{},responsiveRefreshRate:200,responsiveBaseElement:b,fallbackEasing:"swing",slideTransition:"",info:!1,nestedItemSelector:!1,itemElement:"div",stageElement:"div",refreshClass:"owl-refresh",loadedClass:"owl-loaded",loadingClass:"owl-loading",rtlClass:"owl-rtl",responsiveClass:"owl-responsive",dragClass:"owl-drag",itemClass:"owl-item",stageClass:"owl-stage",stageOuterClass:"owl-stage-outer",grabClass:"owl-grab"},e.Width={Default:"default",Inner:"inner",Outer:"outer"},e.Type={Event:"event",State:"state"},e.Plugins={},e.Workers=[{filter:["width","settings"],run:function(){this._width=this.$element.width()}},{filter:["width","items","settings"],run:function(a){a.current=this._items&&this._items[this.relative(this._current)]}},{filter:["items","settings"],run:function(){this.$stage.children(".cloned").remove()}},{filter:["width","items","settings"],run:function(a){var b=this.settings.margin||"",c=!this.settings.autoWidth,d=this.settings.rtl,e={width:"auto","margin-left":d?b:"","margin-right":d?"":b};!c&&this.$stage.children().css(e),a.css=e}},{filter:["width","items","settings"],run:function(a){var b=(this.width()/this.settings.items).toFixed(3)-this.settings.margin,c=null,d=this._items.length,e=!this.settings.autoWidth,f=[];for(a.items={merge:!1,width:b};d--;)c=this._mergers[d],c=this.settings.mergeFit&&Math.min(c,this.settings.items)||c,a.items.merge=c>1||a.items.merge,f[d]=e?b*c:this._items[d].width();this._widths=f}},{filter:["items","settings"],run:function(){var b=[],c=this._items,d=this.settings,e=Math.max(2*d.items,4),f=2*Math.ceil(c.length/2),g=d.loop&&c.length?d.rewind?e:Math.max(e,f):0,h="",i="";for(g/=2;g>0;)b.push(this.normalize(b.length/2,!0)),h+=c[b[b.length-1]][0].outerHTML,b.push(this.normalize(c.length-1-(b.length-1)/2,!0)),i=c[b[b.length-1]][0].outerHTML+i,g-=1;this._clones=b,a(h).addClass("cloned").appendTo(this.$stage),a(i).addClass("cloned").prependTo(this.$stage)}},{filter:["width","items","settings"],run:function(){for(var a=this.settings.rtl?1:-1,b=this._clones.length+this._items.length,c=-1,d=0,e=0,f=[];++c<b;)d=f[c-1]||0,e=this._widths[this.relative(c)]+this.settings.margin,f.push(d+e*a);this._coordinates=f}},{filter:["width","items","settings"],run:function(){var a=this.settings.stagePadding,b=this._coordinates,c={width:Math.ceil(Math.abs(b[b.length-1]))+2*a,"padding-left":a||"","padding-right":a||""};this.$stage.css(c)}},{filter:["width","items","settings"],run:function(a){var b=this._coordinates.length,c=!this.settings.autoWidth,d=this.$stage.children();if(c&&a.items.merge)for(;b--;)a.css.width=this._widths[this.relative(b)],d.eq(b).css(a.css);else c&&(a.css.width=a.items.width,d.css(a.css))}},{filter:["items"],run:function(){this._coordinates.length<1&&this.$stage.removeAttr("style")}},{filter:["width","items","settings"],run:function(a){a.current=a.current?this.$stage.children().index(a.current):0,a.current=Math.max(this.minimum(),Math.min(this.maximum(),a.current)),this.reset(a.current)}},{filter:["position"],run:function(){this.animate(this.coordinates(this._current))}},{filter:["width","position","items","settings"],run:function(){var a,b,c,d,e=this.settings.rtl?1:-1,f=2*this.settings.stagePadding,g=this.coordinates(this.current())+f,h=g+this.width()*e,i=[];for(c=0,d=this._coordinates.length;c<d;c++)a=this._coordinates[c-1]||0,b=Math.abs(this._coordinates[c])+f*e,(this.op(a,"<=",g)&&this.op(a,">",h)||this.op(b,"<",g)&&this.op(b,">",h))&&i.push(c);this.$stage.children(".active").removeClass("active"),this.$stage.children(":eq("+i.join("), :eq(")+")").addClass("active"),this.$stage.children(".center").removeClass("center"),this.settings.center&&this.$stage.children().eq(this.current()).addClass("center")}}],e.prototype.initializeStage=function(){this.$stage=this.$element.find("."+this.settings.stageClass),this.$stage.length||(this.$element.addClass(this.options.loadingClass),this.$stage=a("<"+this.settings.stageElement+">",{class:this.settings.stageClass}).wrap(a("<div/>",{class:this.settings.stageOuterClass})),this.$element.append(this.$stage.parent()))},e.prototype.initializeItems=function(){var b=this.$element.find(".owl-item");if(b.length)return this._items=b.get().map(function(b){return a(b)}),this._mergers=this._items.map(function(){return 1}),void this.refresh();this.replace(this.$element.children().not(this.$stage.parent())),this.isVisible()?this.refresh():this.invalidate("width"),this.$element.removeClass(this.options.loadingClass).addClass(this.options.loadedClass)},e.prototype.initialize=function(){if(this.enter("initializing"),this.trigger("initialize"),this.$element.toggleClass(this.settings.rtlClass,this.settings.rtl),this.settings.autoWidth&&!this.is("pre-loading")){var a,b,c;a=this.$element.find("img"),b=this.settings.nestedItemSelector?"."+this.settings.nestedItemSelector:d,c=this.$element.children(b).width(),a.length&&c<=0&&this.preloadAutoWidthImages(a)}this.initializeStage(),this.initializeItems(),this.registerEventHandlers(),this.leave("initializing"),this.trigger("initialized")},e.prototype.isVisible=function(){return!this.settings.checkVisibility||this.$element.is(":visible")},e.prototype.setup=function(){var b=this.viewport(),c=this.options.responsive,d=-1,e=null;c?(a.each(c,function(a){a<=b&&a>d&&(d=Number(a))}),e=a.extend({},this.options,c[d]),"function"==typeof e.stagePadding&&(e.stagePadding=e.stagePadding()),delete e.responsive,e.responsiveClass&&this.$element.attr("class",this.$element.attr("class").replace(new RegExp("("+this.options.responsiveClass+"-)\\S+\\s","g"),"$1"+d))):e=a.extend({},this.options),this.trigger("change",{property:{name:"settings",value:e}}),this._breakpoint=d,this.settings=e,this.invalidate("settings"),this.trigger("changed",{property:{name:"settings",value:this.settings}})},e.prototype.optionsLogic=function(){this.settings.autoWidth&&(this.settings.stagePadding=!1,this.settings.merge=!1)},e.prototype.prepare=function(b){var c=this.trigger("prepare",{content:b});return c.data||(c.data=a("<"+this.settings.itemElement+"/>").addClass(this.options.itemClass).append(b)),this.trigger("prepared",{content:c.data}),c.data},e.prototype.update=function(){for(var b=0,c=this._pipe.length,d=a.proxy(function(a){return this[a]},this._invalidated),e={};b<c;)(this._invalidated.all||a.grep(this._pipe[b].filter,d).length>0)&&this._pipe[b].run(e),b++;this._invalidated={},!this.is("valid")&&this.enter("valid")},e.prototype.width=function(a){switch(a=a||e.Width.Default){case e.Width.Inner:case e.Width.Outer:return this._width;default:return this._width-2*this.settings.stagePadding+this.settings.margin}},e.prototype.refresh=function(){this.enter("refreshing"),this.trigger("refresh"),this.setup(),this.optionsLogic(),this.$element.addClass(this.options.refreshClass),this.update(),this.$element.removeClass(this.options.refreshClass),this.leave("refreshing"),this.trigger("refreshed")},e.prototype.onThrottledResize=function(){b.clearTimeout(this.resizeTimer),this.resizeTimer=b.setTimeout(this._handlers.onResize,this.settings.responsiveRefreshRate)},e.prototype.onResize=function(){return!!this._items.length&&(this._width!==this.$element.width()&&(!!this.isVisible()&&(this.enter("resizing"),this.trigger("resize").isDefaultPrevented()?(this.leave("resizing"),!1):(this.invalidate("width"),this.refresh(),this.leave("resizing"),void this.trigger("resized")))))},e.prototype.registerEventHandlers=function(){a.support.transition&&this.$stage.on(a.support.transition.end+".owl.core",a.proxy(this.onTransitionEnd,this)),!1!==this.settings.responsive&&this.on(b,"resize",this._handlers.onThrottledResize),this.settings.mouseDrag&&(this.$element.addClass(this.options.dragClass),this.$stage.on("mousedown.owl.core",a.proxy(this.onDragStart,this)),this.$stage.on("dragstart.owl.core selectstart.owl.core",function(){return!1})),this.settings.touchDrag&&(this.$stage.on("touchstart.owl.core",a.proxy(this.onDragStart,this)),this.$stage.on("touchcancel.owl.core",a.proxy(this.onDragEnd,this)))},e.prototype.onDragStart=function(b){var d=null;3!==b.which&&(a.support.transform?(d=this.$stage.css("transform").replace(/.*\(|\)| /g,"").split(","),d={x:d[16===d.length?12:4],y:d[16===d.length?13:5]}):(d=this.$stage.position(),d={x:this.settings.rtl?d.left+this.$stage.width()-this.width()+this.settings.margin:d.left,y:d.top}),this.is("animating")&&(a.support.transform?this.animate(d.x):this.$stage.stop(),this.invalidate("position")),this.$element.toggleClass(this.options.grabClass,"mousedown"===b.type),this.speed(0),this._drag.time=(new Date).getTime(),this._drag.target=a(b.target),this._drag.stage.start=d,this._drag.stage.current=d,this._drag.pointer=this.pointer(b),a(c).on("mouseup.owl.core touchend.owl.core",a.proxy(this.onDragEnd,this)),a(c).one("mousemove.owl.core touchmove.owl.core",a.proxy(function(b){var d=this.difference(this._drag.pointer,this.pointer(b));a(c).on("mousemove.owl.core touchmove.owl.core",a.proxy(this.onDragMove,this)),Math.abs(d.x)<Math.abs(d.y)&&this.is("valid")||(b.preventDefault(),this.enter("dragging"),this.trigger("drag"))},this)))},e.prototype.onDragMove=function(a){var b=null,c=null,d=null,e=this.difference(this._drag.pointer,this.pointer(a)),f=this.difference(this._drag.stage.start,e);this.is("dragging")&&(a.preventDefault(),this.settings.loop?(b=this.coordinates(this.minimum()),c=this.coordinates(this.maximum()+1)-b,f.x=((f.x-b)%c+c)%c+b):(b=this.settings.rtl?this.coordinates(this.maximum()):this.coordinates(this.minimum()),c=this.settings.rtl?this.coordinates(this.minimum()):this.coordinates(this.maximum()),d=this.settings.pullDrag?-1*e.x/5:0,f.x=Math.max(Math.min(f.x,b+d),c+d)),this._drag.stage.current=f,this.animate(f.x))},e.prototype.onDragEnd=function(b){var d=this.difference(this._drag.pointer,this.pointer(b)),e=this._drag.stage.current,f=d.x>0^this.settings.rtl?"left":"right";a(c).off(".owl.core"),this.$element.removeClass(this.options.grabClass),(0!==d.x&&this.is("dragging")||!this.is("valid"))&&(this.speed(this.settings.dragEndSpeed||this.settings.smartSpeed),this.current(this.closest(e.x,0!==d.x?f:this._drag.direction)),this.invalidate("position"),this.update(),this._drag.direction=f,(Math.abs(d.x)>3||(new Date).getTime()-this._drag.time>300)&&this._drag.target.one("click.owl.core",function(){return!1})),this.is("dragging")&&(this.leave("dragging"),this.trigger("dragged"))},e.prototype.closest=function(b,c){var e=-1,f=30,g=this.width(),h=this.coordinates();return this.settings.freeDrag||a.each(h,a.proxy(function(a,i){return"left"===c&&b>i-f&&b<i+f?e=a:"right"===c&&b>i-g-f&&b<i-g+f?e=a+1:this.op(b,"<",i)&&this.op(b,">",h[a+1]!==d?h[a+1]:i-g)&&(e="left"===c?a+1:a),-1===e},this)),this.settings.loop||(this.op(b,">",h[this.minimum()])?e=b=this.minimum():this.op(b,"<",h[this.maximum()])&&(e=b=this.maximum())),e},e.prototype.animate=function(b){var c=this.speed()>0;this.is("animating")&&this.onTransitionEnd(),c&&(this.enter("animating"),this.trigger("translate")),a.support.transform3d&&a.support.transition?this.$stage.css({transform:"translate3d("+b+"px,0px,0px)",transition:this.speed()/1e3+"s"+(this.settings.slideTransition?" "+this.settings.slideTransition:"")}):c?this.$stage.animate({left:b+"px"},this.speed(),this.settings.fallbackEasing,a.proxy(this.onTransitionEnd,this)):this.$stage.css({left:b+"px"})},e.prototype.is=function(a){return this._states.current[a]&&this._states.current[a]>0},e.prototype.current=function(a){if(a===d)return this._current;if(0===this._items.length)return d;if(a=this.normalize(a),this._current!==a){var b=this.trigger("change",{property:{name:"position",value:a}});b.data!==d&&(a=this.normalize(b.data)),this._current=a,this.invalidate("position"),this.trigger("changed",{property:{name:"position",value:this._current}})}return this._current},e.prototype.invalidate=function(b){return"string"===a.type(b)&&(this._invalidated[b]=!0,this.is("valid")&&this.leave("valid")),a.map(this._invalidated,function(a,b){return b})},e.prototype.reset=function(a){(a=this.normalize(a))!==d&&(this._speed=0,this._current=a,this.suppress(["translate","translated"]),this.animate(this.coordinates(a)),this.release(["translate","translated"]))},e.prototype.normalize=function(a,b){var c=this._items.length,e=b?0:this._clones.length;return!this.isNumeric(a)||c<1?a=d:(a<0||a>=c+e)&&(a=((a-e/2)%c+c)%c+e/2),a},e.prototype.relative=function(a){return a-=this._clones.length/2,this.normalize(a,!0)},e.prototype.maximum=function(a){var b,c,d,e=this.settings,f=this._coordinates.length;if(e.loop)f=this._clones.length/2+this._items.length-1;else if(e.autoWidth||e.merge){if(b=this._items.length)for(c=this._items[--b].width(),d=this.$element.width();b--&&!((c+=this._items[b].width()+this.settings.margin)>d););f=b+1}else f=e.center?this._items.length-1:this._items.length-e.items;return a&&(f-=this._clones.length/2),Math.max(f,0)},e.prototype.minimum=function(a){return a?0:this._clones.length/2},e.prototype.items=function(a){return a===d?this._items.slice():(a=this.normalize(a,!0),this._items[a])},e.prototype.mergers=function(a){return a===d?this._mergers.slice():(a=this.normalize(a,!0),this._mergers[a])},e.prototype.clones=function(b){var c=this._clones.length/2,e=c+this._items.length,f=function(a){return a%2==0?e+a/2:c-(a+1)/2};return b===d?a.map(this._clones,function(a,b){return f(b)}):a.map(this._clones,function(a,c){return a===b?f(c):null})},e.prototype.speed=function(a){return a!==d&&(this._speed=a),this._speed},e.prototype.coordinates=function(b){var c,e=1,f=b-1;return b===d?a.map(this._coordinates,a.proxy(function(a,b){return this.coordinates(b)},this)):(this.settings.center?(this.settings.rtl&&(e=-1,f=b+1),c=this._coordinates[b],c+=(this.width()-c+(this._coordinates[f]||0))/2*e):c=this._coordinates[f]||0,c=Math.ceil(c))},e.prototype.duration=function(a,b,c){return 0===c?0:Math.min(Math.max(Math.abs(b-a),1),6)*Math.abs(c||this.settings.smartSpeed)},e.prototype.to=function(a,b){var c=this.current(),d=null,e=a-this.relative(c),f=(e>0)-(e<0),g=this._items.length,h=this.minimum(),i=this.maximum();this.settings.loop?(!this.settings.rewind&&Math.abs(e)>g/2&&(e+=-1*f*g),a=c+e,(d=((a-h)%g+g)%g+h)!==a&&d-e<=i&&d-e>0&&(c=d-e,a=d,this.reset(c))):this.settings.rewind?(i+=1,a=(a%i+i)%i):a=Math.max(h,Math.min(i,a)),this.speed(this.duration(c,a,b)),this.current(a),this.isVisible()&&this.update()},e.prototype.next=function(a){a=a||!1,this.to(this.relative(this.current())+1,a)},e.prototype.prev=function(a){a=a||!1,this.to(this.relative(this.current())-1,a)},e.prototype.onTransitionEnd=function(a){if(a!==d&&(a.stopPropagation(),(a.target||a.srcElement||a.originalTarget)!==this.$stage.get(0)))return!1;this.leave("animating"),this.trigger("translated")},e.prototype.viewport=function(){var d;return this.options.responsiveBaseElement!==b?d=a(this.options.responsiveBaseElement).width():b.innerWidth?d=b.innerWidth:c.documentElement&&c.documentElement.clientWidth?d=c.documentElement.clientWidth:console.warn("Can not detect viewport width."),d},e.prototype.replace=function(b){this.$stage.empty(),this._items=[],b&&(b=b instanceof jQuery?b:a(b)),this.settings.nestedItemSelector&&(b=b.find("."+this.settings.nestedItemSelector)),b.filter(function(){return 1===this.nodeType}).each(a.proxy(function(a,b){b=this.prepare(b),this.$stage.append(b),this._items.push(b),this._mergers.push(1*b.find("[data-merge]").addBack("[data-merge]").attr("data-merge")||1)},this)),this.reset(this.isNumeric(this.settings.startPosition)?this.settings.startPosition:0),this.invalidate("items")},e.prototype.add=function(b,c){var e=this.relative(this._current);c=c===d?this._items.length:this.normalize(c,!0),b=b instanceof jQuery?b:a(b),this.trigger("add",{content:b,position:c}),b=this.prepare(b),0===this._items.length||c===this._items.length?(0===this._items.length&&this.$stage.append(b),0!==this._items.length&&this._items[c-1].after(b),this._items.push(b),this._mergers.push(1*b.find("[data-merge]").addBack("[data-merge]").attr("data-merge")||1)):(this._items[c].before(b),this._items.splice(c,0,b),this._mergers.splice(c,0,1*b.find("[data-merge]").addBack("[data-merge]").attr("data-merge")||1)),this._items[e]&&this.reset(this._items[e].index()),this.invalidate("items"),this.trigger("added",{content:b,position:c})},e.prototype.remove=function(a){(a=this.normalize(a,!0))!==d&&(this.trigger("remove",{content:this._items[a],position:a}),this._items[a].remove(),this._items.splice(a,1),this._mergers.splice(a,1),this.invalidate("items"),this.trigger("removed",{content:null,position:a}))},e.prototype.preloadAutoWidthImages=function(b){b.each(a.proxy(function(b,c){this.enter("pre-loading"),c=a(c),a(new Image).one("load",a.proxy(function(a){c.attr("src",a.target.src),c.css("opacity",1),this.leave("pre-loading"),!this.is("pre-loading")&&!this.is("initializing")&&this.refresh()},this)).attr("src",c.attr("src")||c.attr("data-src")||c.attr("data-src-retina"))},this))},e.prototype.destroy=function(){this.$element.off(".owl.core"),this.$stage.off(".owl.core"),a(c).off(".owl.core"),!1!==this.settings.responsive&&(b.clearTimeout(this.resizeTimer),this.off(b,"resize",this._handlers.onThrottledResize));for(var d in this._plugins)this._plugins[d].destroy();this.$stage.children(".cloned").remove(),this.$stage.unwrap(),this.$stage.children().contents().unwrap(),this.$stage.children().unwrap(),this.$stage.remove(),this.$element.removeClass(this.options.refreshClass).removeClass(this.options.loadingClass).removeClass(this.options.loadedClass).removeClass(this.options.rtlClass).removeClass(this.options.dragClass).removeClass(this.options.grabClass).attr("class",this.$element.attr("class").replace(new RegExp(this.options.responsiveClass+"-\\S+\\s","g"),"")).removeData("owl.carousel")},e.prototype.op=function(a,b,c){var d=this.settings.rtl;switch(b){case"<":return d?a>c:a<c;case">":return d?a<c:a>c;case">=":return d?a<=c:a>=c;case"<=":return d?a>=c:a<=c}},e.prototype.on=function(a,b,c,d){a.addEventListener?a.addEventListener(b,c,d):a.attachEvent&&a.attachEvent("on"+b,c)},e.prototype.off=function(a,b,c,d){a.removeEventListener?a.removeEventListener(b,c,d):a.detachEvent&&a.detachEvent("on"+b,c)},e.prototype.trigger=function(b,c,d,f,g){var h={item:{count:this._items.length,index:this.current()}},i=a.camelCase(a.grep(["on",b,d],function(a){return a}).join("-").toLowerCase()),j=a.Event([b,"owl",d||"carousel"].join(".").toLowerCase(),a.extend({relatedTarget:this},h,c));return this._supress[b]||(a.each(this._plugins,function(a,b){b.onTrigger&&b.onTrigger(j)}),this.register({type:e.Type.Event,name:b}),this.$element.trigger(j),this.settings&&"function"==typeof this.settings[i]&&this.settings[i].call(this,j)),j},e.prototype.enter=function(b){a.each([b].concat(this._states.tags[b]||[]),a.proxy(function(a,b){this._states.current[b]===d&&(this._states.current[b]=0),this._states.current[b]++},this))},e.prototype.leave=function(b){a.each([b].concat(this._states.tags[b]||[]),a.proxy(function(a,b){this._states.current[b]--},this))},e.prototype.register=function(b){if(b.type===e.Type.Event){if(a.event.special[b.name]||(a.event.special[b.name]={}),!a.event.special[b.name].owl){var c=a.event.special[b.name]._default;a.event.special[b.name]._default=function(a){return!c||!c.apply||a.namespace&&-1!==a.namespace.indexOf("owl")?a.namespace&&a.namespace.indexOf("owl")>-1:c.apply(this,arguments)},a.event.special[b.name].owl=!0}}else b.type===e.Type.State&&(this._states.tags[b.name]?this._states.tags[b.name]=this._states.tags[b.name].concat(b.tags):this._states.tags[b.name]=b.tags,this._states.tags[b.name]=a.grep(this._states.tags[b.name],a.proxy(function(c,d){return a.inArray(c,this._states.tags[b.name])===d},this)))},e.prototype.suppress=function(b){a.each(b,a.proxy(function(a,b){this._supress[b]=!0},this))},e.prototype.release=function(b){a.each(b,a.proxy(function(a,b){delete this._supress[b]},this))},e.prototype.pointer=function(a){var c={x:null,y:null};return a=a.originalEvent||a||b.event,a=a.touches&&a.touches.length?a.touches[0]:a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:a,a.pageX?(c.x=a.pageX,c.y=a.pageY):(c.x=a.clientX,c.y=a.clientY),c},e.prototype.isNumeric=function(a){return!isNaN(parseFloat(a))},e.prototype.difference=function(a,b){return{x:a.x-b.x,y:a.y-b.y}},a.fn.owlCarousel=function(b){var c=Array.prototype.slice.call(arguments,1);return this.each(function(){var d=a(this),f=d.data("owl.carousel");f||(f=new e(this,"object"==typeof b&&b),d.data("owl.carousel",f),a.each(["next","prev","to","destroy","refresh","replace","add","remove"],function(b,c){f.register({type:e.Type.Event,name:c}),f.$element.on(c+".owl.carousel.core",a.proxy(function(a){a.namespace&&a.relatedTarget!==this&&(this.suppress([c]),f[c].apply(this,[].slice.call(arguments,1)),this.release([c]))},f))})),"string"==typeof b&&"_"!==b.charAt(0)&&f[b].apply(f,c)})},a.fn.owlCarousel.Constructor=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this._core=b,this._interval=null,this._visible=null,this._handlers={"initialized.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.autoRefresh&&this.watch()},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this._core.$element.on(this._handlers)};e.Defaults={autoRefresh:!0,autoRefreshInterval:500},e.prototype.watch=function(){this._interval||(this._visible=this._core.isVisible(),this._interval=b.setInterval(a.proxy(this.refresh,this),this._core.settings.autoRefreshInterval))},e.prototype.refresh=function(){this._core.isVisible()!==this._visible&&(this._visible=!this._visible,this._core.$element.toggleClass("owl-hidden",!this._visible),this._visible&&this._core.invalidate("width")&&this._core.refresh())},e.prototype.destroy=function(){var a,c;b.clearInterval(this._interval);for(a in this._handlers)this._core.$element.off(a,this._handlers[a]);for(c in Object.getOwnPropertyNames(this))"function"!=typeof this[c]&&(this[c]=null)},a.fn.owlCarousel.Constructor.Plugins.AutoRefresh=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this._core=b,this._loaded=[],this._handlers={"initialized.owl.carousel change.owl.carousel resized.owl.carousel":a.proxy(function(b){if(b.namespace&&this._core.settings&&this._core.settings.lazyLoad&&(b.property&&"position"==b.property.name||"initialized"==b.type)){var c=this._core.settings,e=c.center&&Math.ceil(c.items/2)||c.items,f=c.center&&-1*e||0,g=(b.property&&b.property.value!==d?b.property.value:this._core.current())+f,h=this._core.clones().length,i=a.proxy(function(a,b){this.load(b)},this);for(c.lazyLoadEager>0&&(e+=c.lazyLoadEager,c.loop&&(g-=c.lazyLoadEager,e++));f++<e;)this.load(h/2+this._core.relative(g)),h&&a.each(this._core.clones(this._core.relative(g)),i),g++}},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this._core.$element.on(this._handlers)};e.Defaults={lazyLoad:!1,lazyLoadEager:0},e.prototype.load=function(c){var d=this._core.$stage.children().eq(c),e=d&&d.find(".owl-lazy");!e||a.inArray(d.get(0),this._loaded)>-1||(e.each(a.proxy(function(c,d){var e,f=a(d),g=b.devicePixelRatio>1&&f.attr("data-src-retina")||f.attr("data-src")||f.attr("data-srcset");this._core.trigger("load",{element:f,url:g},"lazy"),f.is("img")?f.one("load.owl.lazy",a.proxy(function(){f.css("opacity",1),this._core.trigger("loaded",{element:f,url:g},"lazy")},this)).attr("src",g):f.is("source")?f.one("load.owl.lazy",a.proxy(function(){this._core.trigger("loaded",{element:f,url:g},"lazy")},this)).attr("srcset",g):(e=new Image,e.onload=a.proxy(function(){f.css({"background-image":'url("'+g+'")',opacity:"1"}),this._core.trigger("loaded",{element:f,url:g},"lazy")},this),e.src=g)},this)),this._loaded.push(d.get(0)))},e.prototype.destroy=function(){var a,b;for(a in this.handlers)this._core.$element.off(a,this.handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},a.fn.owlCarousel.Constructor.Plugins.Lazy=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(c){this._core=c,this._previousHeight=null,this._handlers={"initialized.owl.carousel refreshed.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.autoHeight&&this.update()},this),"changed.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.autoHeight&&"position"===a.property.name&&this.update()},this),"loaded.owl.lazy":a.proxy(function(a){a.namespace&&this._core.settings.autoHeight&&a.element.closest("."+this._core.settings.itemClass).index()===this._core.current()&&this.update()},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this._core.$element.on(this._handlers),this._intervalId=null;var d=this;a(b).on("load",function(){d._core.settings.autoHeight&&d.update()}),a(b).resize(function(){d._core.settings.autoHeight&&(null!=d._intervalId&&clearTimeout(d._intervalId),d._intervalId=setTimeout(function(){d.update()},250))})};e.Defaults={autoHeight:!1,autoHeightClass:"owl-height"},e.prototype.update=function(){var b=this._core._current,c=b+this._core.settings.items,d=this._core.settings.lazyLoad,e=this._core.$stage.children().toArray().slice(b,c),f=[],g=0;a.each(e,function(b,c){f.push(a(c).height())}),g=Math.max.apply(null,f),g<=1&&d&&this._previousHeight&&(g=this._previousHeight),this._previousHeight=g,this._core.$stage.parent().height(g).addClass(this._core.settings.autoHeightClass)},e.prototype.destroy=function(){var a,b;for(a in this._handlers)this._core.$element.off(a,this._handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},a.fn.owlCarousel.Constructor.Plugins.AutoHeight=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this._core=b,this._videos={},this._playing=null,this._handlers={"initialized.owl.carousel":a.proxy(function(a){a.namespace&&this._core.register({type:"state",name:"playing",tags:["interacting"]})},this),"resize.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.video&&this.isInFullScreen()&&a.preventDefault()},this),"refreshed.owl.carousel":a.proxy(function(a){a.namespace&&this._core.is("resizing")&&this._core.$stage.find(".cloned .owl-video-frame").remove()},this),"changed.owl.carousel":a.proxy(function(a){a.namespace&&"position"===a.property.name&&this._playing&&this.stop()},this),"prepared.owl.carousel":a.proxy(function(b){if(b.namespace){var c=a(b.content).find(".owl-video");c.length&&(c.css("display","none"),this.fetch(c,a(b.content)))}},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this._core.$element.on(this._handlers),this._core.$element.on("click.owl.video",".owl-video-play-icon",a.proxy(function(a){this.play(a)},this))};e.Defaults={video:!1,videoHeight:!1,videoWidth:!1},e.prototype.fetch=function(a,b){var c=function(){return a.attr("data-vimeo-id")?"vimeo":a.attr("data-vzaar-id")?"vzaar":"youtube"}(),d=a.attr("data-vimeo-id")||a.attr("data-youtube-id")||a.attr("data-vzaar-id"),e=a.attr("data-width")||this._core.settings.videoWidth,f=a.attr("data-height")||this._core.settings.videoHeight,g=a.attr("href");if(!g)throw new Error("Missing video URL.");if(d=g.match(/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com|be\-nocookie\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/),d[3].indexOf("youtu")>-1)c="youtube";else if(d[3].indexOf("vimeo")>-1)c="vimeo";else{if(!(d[3].indexOf("vzaar")>-1))throw new Error("Video URL not supported.");c="vzaar"}d=d[6],this._videos[g]={type:c,id:d,width:e,height:f},b.attr("data-video",g),this.thumbnail(a,this._videos[g])},e.prototype.thumbnail=function(b,c){var d,e,f,g=c.width&&c.height?"width:"+c.width+"px;height:"+c.height+"px;":"",h=b.find("img"),i="src",j="",k=this._core.settings,l=function(c){e='<div class="owl-video-play-icon"></div>',d=k.lazyLoad?a("<div/>",{class:"owl-video-tn "+j,srcType:c}):a("<div/>",{class:"owl-video-tn",style:"opacity:1;background-image:url("+c+")"}),b.after(d),b.after(e)};if(b.wrap(a("<div/>",{class:"owl-video-wrapper",style:g})),this._core.settings.lazyLoad&&(i="data-src",j="owl-lazy"),h.length)return l(h.attr(i)),h.remove(),!1;"youtube"===c.type?(f="//img.youtube.com/vi/"+c.id+"/hqdefault.jpg",l(f)):"vimeo"===c.type?a.ajax({type:"GET",url:"//vimeo.com/api/v2/video/"+c.id+".json",jsonp:"callback",dataType:"jsonp",success:function(a){f=a[0].thumbnail_large,l(f)}}):"vzaar"===c.type&&a.ajax({type:"GET",url:"//vzaar.com/api/videos/"+c.id+".json",jsonp:"callback",dataType:"jsonp",success:function(a){f=a.framegrab_url,l(f)}})},e.prototype.stop=function(){this._core.trigger("stop",null,"video"),this._playing.find(".owl-video-frame").remove(),this._playing.removeClass("owl-video-playing"),this._playing=null,this._core.leave("playing"),this._core.trigger("stopped",null,"video")},e.prototype.play=function(b){var c,d=a(b.target),e=d.closest("."+this._core.settings.itemClass),f=this._videos[e.attr("data-video")],g=f.width||"100%",h=f.height||this._core.$stage.height();this._playing||(this._core.enter("playing"),this._core.trigger("play",null,"video"),e=this._core.items(this._core.relative(e.index())),this._core.reset(e.index()),c=a('<iframe frameborder="0" allowfullscreen mozallowfullscreen webkitAllowFullScreen ></iframe>'),c.attr("height",h),c.attr("width",g),"youtube"===f.type?c.attr("src","//www.youtube.com/embed/"+f.id+"?autoplay=1&rel=0&v="+f.id):"vimeo"===f.type?c.attr("src","//player.vimeo.com/video/"+f.id+"?autoplay=1"):"vzaar"===f.type&&c.attr("src","//view.vzaar.com/"+f.id+"/player?autoplay=true"),a(c).wrap('<div class="owl-video-frame" />').insertAfter(e.find(".owl-video")),this._playing=e.addClass("owl-video-playing"))},e.prototype.isInFullScreen=function(){var b=c.fullscreenElement||c.mozFullScreenElement||c.webkitFullscreenElement;return b&&a(b).parent().hasClass("owl-video-frame")},e.prototype.destroy=function(){var a,b;this._core.$element.off("click.owl.video");for(a in this._handlers)this._core.$element.off(a,this._handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},a.fn.owlCarousel.Constructor.Plugins.Video=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this.core=b,this.core.options=a.extend({},e.Defaults,this.core.options),this.swapping=!0,this.previous=d,this.next=d,this.handlers={"change.owl.carousel":a.proxy(function(a){a.namespace&&"position"==a.property.name&&(this.previous=this.core.current(),this.next=a.property.value)},this),"drag.owl.carousel dragged.owl.carousel translated.owl.carousel":a.proxy(function(a){a.namespace&&(this.swapping="translated"==a.type)},this),"translate.owl.carousel":a.proxy(function(a){a.namespace&&this.swapping&&(this.core.options.animateOut||this.core.options.animateIn)&&this.swap()},this)},this.core.$element.on(this.handlers)};e.Defaults={animateOut:!1,
    animateIn: !1
}, e.prototype.swap = function () { if (1 === this.core.settings.items && a.support.animation && a.support.transition) { this.core.speed(0); var b, c = a.proxy(this.clear, this), d = this.core.$stage.children().eq(this.previous), e = this.core.$stage.children().eq(this.next), f = this.core.settings.animateIn, g = this.core.settings.animateOut; this.core.current() !== this.previous && (g && (b = this.core.coordinates(this.previous) - this.core.coordinates(this.next), d.one(a.support.animation.end, c).css({ left: b + "px" }).addClass("animated owl-animated-out").addClass(g)), f && e.one(a.support.animation.end, c).addClass("animated owl-animated-in").addClass(f)) } }, e.prototype.clear = function (b) { a(b.target).css({ left: "" }).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut), this.core.onTransitionEnd() }, e.prototype.destroy = function () { var a, b; for (a in this.handlers) this.core.$element.off(a, this.handlers[a]); for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null) }, a.fn.owlCarousel.Constructor.Plugins.Animate = e
}(window.Zepto || window.jQuery, window, document), function (a, b, c, d) { var e = function (b) { this._core = b, this._call = null, this._time = 0, this._timeout = 0, this._paused = !0, this._handlers = { "changed.owl.carousel": a.proxy(function (a) { a.namespace && "settings" === a.property.name ? this._core.settings.autoplay ? this.play() : this.stop() : a.namespace && "position" === a.property.name && this._paused && (this._time = 0) }, this), "initialized.owl.carousel": a.proxy(function (a) { a.namespace && this._core.settings.autoplay && this.play() }, this), "play.owl.autoplay": a.proxy(function (a, b, c) { a.namespace && this.play(b, c) }, this), "stop.owl.autoplay": a.proxy(function (a) { a.namespace && this.stop() }, this), "mouseover.owl.autoplay": a.proxy(function () { this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause() }, this), "mouseleave.owl.autoplay": a.proxy(function () { this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.play() }, this), "touchstart.owl.core": a.proxy(function () { this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause() }, this), "touchend.owl.core": a.proxy(function () { this._core.settings.autoplayHoverPause && this.play() }, this) }, this._core.$element.on(this._handlers), this._core.options = a.extend({}, e.Defaults, this._core.options) }; e.Defaults = { autoplay: !1, autoplayTimeout: 5e3, autoplayHoverPause: !1, autoplaySpeed: !1 }, e.prototype._next = function (d) { this._call = b.setTimeout(a.proxy(this._next, this, d), this._timeout * (Math.round(this.read() / this._timeout) + 1) - this.read()), this._core.is("interacting") || c.hidden || this._core.next(d || this._core.settings.autoplaySpeed) }, e.prototype.read = function () { return (new Date).getTime() - this._time }, e.prototype.play = function (c, d) { var e; this._core.is("rotating") || this._core.enter("rotating"), c = c || this._core.settings.autoplayTimeout, e = Math.min(this._time % (this._timeout || c), c), this._paused ? (this._time = this.read(), this._paused = !1) : b.clearTimeout(this._call), this._time += this.read() % c - e, this._timeout = c, this._call = b.setTimeout(a.proxy(this._next, this, d), c - e) }, e.prototype.stop = function () { this._core.is("rotating") && (this._time = 0, this._paused = !0, b.clearTimeout(this._call), this._core.leave("rotating")) }, e.prototype.pause = function () { this._core.is("rotating") && !this._paused && (this._time = this.read(), this._paused = !0, b.clearTimeout(this._call)) }, e.prototype.destroy = function () { var a, b; this.stop(); for (a in this._handlers) this._core.$element.off(a, this._handlers[a]); for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null) }, a.fn.owlCarousel.Constructor.Plugins.autoplay = e }(window.Zepto || window.jQuery, window, document), function (a, b, c, d) { "use strict"; var e = function (b) { this._core = b, this._initialized = !1, this._pages = [], this._controls = {}, this._templates = [], this.$element = this._core.$element, this._overrides = { next: this._core.next, prev: this._core.prev, to: this._core.to }, this._handlers = { "prepared.owl.carousel": a.proxy(function (b) { b.namespace && this._core.settings.dotsData && this._templates.push('<div class="' + this._core.settings.dotClass + '">' + a(b.content).find("[data-dot]").addBack("[data-dot]").attr("data-dot") + "</div>") }, this), "added.owl.carousel": a.proxy(function (a) { a.namespace && this._core.settings.dotsData && this._templates.splice(a.position, 0, this._templates.pop()) }, this), "remove.owl.carousel": a.proxy(function (a) { a.namespace && this._core.settings.dotsData && this._templates.splice(a.position, 1) }, this), "changed.owl.carousel": a.proxy(function (a) { a.namespace && "position" == a.property.name && this.draw() }, this), "initialized.owl.carousel": a.proxy(function (a) { a.namespace && !this._initialized && (this._core.trigger("initialize", null, "navigation"), this.initialize(), this.update(), this.draw(), this._initialized = !0, this._core.trigger("initialized", null, "navigation")) }, this), "refreshed.owl.carousel": a.proxy(function (a) { a.namespace && this._initialized && (this._core.trigger("refresh", null, "navigation"), this.update(), this.draw(), this._core.trigger("refreshed", null, "navigation")) }, this) }, this._core.options = a.extend({}, e.Defaults, this._core.options), this.$element.on(this._handlers) }; e.Defaults = { nav: !1, navText: ['<span aria-label="Previous">&#x2039;</span>', '<span aria-label="Next">&#x203a;</span>'], navSpeed: !1, navElement: 'button type="button" role="presentation"', navContainer: !1, navContainerClass: "owl-nav", navClass: ["owl-prev", "owl-next"], slideBy: 1, dotClass: "owl-dot", dotsClass: "owl-dots", dots: !0, dotsEach: !1, dotsData: !1, dotsSpeed: !1, dotsContainer: !1 }, e.prototype.initialize = function () { var b, c = this._core.settings; this._controls.$relative = (c.navContainer ? a(c.navContainer) : a("<div>").addClass(c.navContainerClass).appendTo(this.$element)).addClass("disabled"), this._controls.$previous = a("<" + c.navElement + ">").addClass(c.navClass[0]).html(c.navText[0]).prependTo(this._controls.$relative).on("click", a.proxy(function (a) { this.prev(c.navSpeed) }, this)), this._controls.$next = a("<" + c.navElement + ">").addClass(c.navClass[1]).html(c.navText[1]).appendTo(this._controls.$relative).on("click", a.proxy(function (a) { this.next(c.navSpeed) }, this)), c.dotsData || (this._templates = [a('<button role="button">').addClass(c.dotClass).append(a("<span>")).prop("outerHTML")]), this._controls.$absolute = (c.dotsContainer ? a(c.dotsContainer) : a("<div>").addClass(c.dotsClass).appendTo(this.$element)).addClass("disabled"), this._controls.$absolute.on("click", "button", a.proxy(function (b) { var d = a(b.target).parent().is(this._controls.$absolute) ? a(b.target).index() : a(b.target).parent().index(); b.preventDefault(), this.to(d, c.dotsSpeed) }, this)); for (b in this._overrides) this._core[b] = a.proxy(this[b], this) }, e.prototype.destroy = function () { var a, b, c, d, e; e = this._core.settings; for (a in this._handlers) this.$element.off(a, this._handlers[a]); for (b in this._controls) "$relative" === b && e.navContainer ? this._controls[b].html("") : this._controls[b].remove(); for (d in this.overides) this._core[d] = this._overrides[d]; for (c in Object.getOwnPropertyNames(this)) "function" != typeof this[c] && (this[c] = null) }, e.prototype.update = function () { var a, b, c, d = this._core.clones().length / 2, e = d + this._core.items().length, f = this._core.maximum(!0), g = this._core.settings, h = g.center || g.autoWidth || g.dotsData ? 1 : g.dotsEach || g.items; if ("page" !== g.slideBy && (g.slideBy = Math.min(g.slideBy, g.items)), g.dots || "page" == g.slideBy) for (this._pages = [], a = d, b = 0, c = 0; a < e; a++){ if (b >= h || 0 === b) { if (this._pages.push({ start: Math.min(f, a - d), end: a - d + h - 1 }), Math.min(f, a - d) === f) break; b = 0, ++c } b += this._core.mergers(this._core.relative(a)) } }, e.prototype.draw = function () { var b, c = this._core.settings, d = this._core.items().length <= c.items, e = this._core.relative(this._core.current()), f = c.loop || c.rewind; this._controls.$relative.toggleClass("disabled", !c.nav || d), c.nav && (this._controls.$previous.toggleClass("disabled", !f && e <= this._core.minimum(!0)), this._controls.$next.toggleClass("disabled", !f && e >= this._core.maximum(!0))), this._controls.$absolute.toggleClass("disabled", !c.dots || d), c.dots && (b = this._pages.length - this._controls.$absolute.children().length, c.dotsData && 0 !== b ? this._controls.$absolute.html(this._templates.join("")) : b > 0 ? this._controls.$absolute.append(new Array(b + 1).join(this._templates[0])) : b < 0 && this._controls.$absolute.children().slice(b).remove(), this._controls.$absolute.find(".active").removeClass("active"), this._controls.$absolute.children().eq(a.inArray(this.current(), this._pages)).addClass("active")) }, e.prototype.onTrigger = function (b) { var c = this._core.settings; b.page = { index: a.inArray(this.current(), this._pages), count: this._pages.length, size: c && (c.center || c.autoWidth || c.dotsData ? 1 : c.dotsEach || c.items) } }, e.prototype.current = function () { var b = this._core.relative(this._core.current()); return a.grep(this._pages, a.proxy(function (a, c) { return a.start <= b && a.end >= b }, this)).pop() }, e.prototype.getPosition = function (b) { var c, d, e = this._core.settings; return "page" == e.slideBy ? (c = a.inArray(this.current(), this._pages), d = this._pages.length, b ? ++c : --c, c = this._pages[(c % d + d) % d].start) : (c = this._core.relative(this._core.current()), d = this._core.items().length, b ? c += e.slideBy : c -= e.slideBy), c }, e.prototype.next = function (b) { a.proxy(this._overrides.to, this._core)(this.getPosition(!0), b) }, e.prototype.prev = function (b) { a.proxy(this._overrides.to, this._core)(this.getPosition(!1), b) }, e.prototype.to = function (b, c, d) { var e; !d && this._pages.length ? (e = this._pages.length, a.proxy(this._overrides.to, this._core)(this._pages[(b % e + e) % e].start, c)) : a.proxy(this._overrides.to, this._core)(b, c) }, a.fn.owlCarousel.Constructor.Plugins.Navigation = e }(window.Zepto || window.jQuery, window, document), function (a, b, c, d) { "use strict"; var e = function (c) { this._core = c, this._hashes = {}, this.$element = this._core.$element, this._handlers = { "initialized.owl.carousel": a.proxy(function (c) { c.namespace && "URLHash" === this._core.settings.startPosition && a(b).trigger("hashchange.owl.navigation") }, this), "prepared.owl.carousel": a.proxy(function (b) { if (b.namespace) { var c = a(b.content).find("[data-hash]").addBack("[data-hash]").attr("data-hash"); if (!c) return; this._hashes[c] = b.content } }, this), "changed.owl.carousel": a.proxy(function (c) { if (c.namespace && "position" === c.property.name) { var d = this._core.items(this._core.relative(this._core.current())), e = a.map(this._hashes, function (a, b) { return a === d ? b : null }).join(); if (!e || b.location.hash.slice(1) === e) return; b.location.hash = e } }, this) }, this._core.options = a.extend({}, e.Defaults, this._core.options), this.$element.on(this._handlers), a(b).on("hashchange.owl.navigation", a.proxy(function (a) { var c = b.location.hash.substring(1), e = this._core.$stage.children(), f = this._hashes[c] && e.index(this._hashes[c]); f !== d && f !== this._core.current() && this._core.to(this._core.relative(f), !1, !0) }, this)) }; e.Defaults = { URLhashListener: !1 }, e.prototype.destroy = function () { var c, d; a(b).off("hashchange.owl.navigation"); for (c in this._handlers) this._core.$element.off(c, this._handlers[c]); for (d in Object.getOwnPropertyNames(this)) "function" != typeof this[d] && (this[d] = null) }, a.fn.owlCarousel.Constructor.Plugins.Hash = e }(window.Zepto || window.jQuery, window, document), function (a, b, c, d) { function e(b, c) { var e = !1, f = b.charAt(0).toUpperCase() + b.slice(1); return a.each((b + " " + h.join(f + " ") + f).split(" "), function (a, b) { if (g[b] !== d) return e = !c || b, !1 }), e } function f(a) { return e(a, !0) } var g = a("<support>").get(0).style, h = "Webkit Moz O ms".split(" "), i = { transition: { end: { WebkitTransition: "webkitTransitionEnd", MozTransition: "transitionend", OTransition: "oTransitionEnd", transition: "transitionend" } }, animation: { end: { WebkitAnimation: "webkitAnimationEnd", MozAnimation: "animationend", OAnimation: "oAnimationEnd", animation: "animationend" } } }, j = { csstransforms: function () { return !!e("transform") }, csstransforms3d: function () { return !!e("perspective") }, csstransitions: function () { return !!e("transition") }, cssanimations: function () { return !!e("animation") } }; j.csstransitions() && (a.support.transition = new String(f("transition")), a.support.transition.end = i.transition.end[a.support.transition]), j.cssanimations() && (a.support.animation = new String(f("animation")), a.support.animation.end = i.animation.end[a.support.animation]), j.csstransforms() && (a.support.transform = new String(f("transform")), a.support.transform3d = j.csstransforms3d()) }(window.Zepto || window.jQuery, window, document);
