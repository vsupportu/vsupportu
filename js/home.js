   jQuery(document).ready(function($) {
   
// Menu Script
       if ($(window).width() <= 767) {
           $(".menu-top").click(function() {
               $(".res-menu ul").addClass("mobilemenu");
               $(this).toggleClass('btn-open').toggleClass('btn-close');
           });
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
  if (height >=300) {
    $('.header').addClass('home-header');
  }
  else if (height == 0) {
    $('.header').removeClass('home-header');
  }
});


 var stickyTop = $('.home-container').offset().top;
       $(window).on('scroll', function() {
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
           autoplayHoverPause:true,
           center: true,
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
       $('.menu_items li a').bind('click', function(event) {
           event.preventDefault();
           $(document).off("scroll");
           obj = $(this);
           main_link_ref = obj.attr("href");
           $target = $(main_link_ref);
           $(".menu_items li a").each(function(index) {
               if ($(this).hasClass('active')) {
                   $(this).removeClass('active');
                   return false;
               }
           });
           obj.addClass('active');
           $('html, body').stop().animate({
               'scrollTop': $target.offset().top - 0
           }, 1500, 'swing', function() {
               window.location.hash = main_link_ref;
               $(document).on("scroll", onScroll);
           });
       });
       // End of use strict
       function onScroll(event) {
           var scrollPos = $(document).scrollTop();
           $('.menu_items li a').each(function() {

               var currLink = $(this);
               var refElement = $(currLink.attr("href"));
               if (refElement.position().top - 50 <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
                   console.log(refElement.height());
                   console.log(scrollPos);
                   $('.menu_items li a').removeClass("active");
                   currLink.addClass("active");
               } else {
                   currLink.removeClass("active");
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
   (function($, window, document, undefined) {

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

           $.each(Owl.Plugins, $.proxy(function(key, plugin) {
               this._plugins[key[0].toLowerCase() + key.slice(1)] = new plugin(this);
           }, this));

           $.each(Owl.Pipe, $.proxy(function(priority, worker) {
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
           run: function(cache) {
               cache.current = this._items && this._items[this.relative(this._current)];
           }
       }, {
           filter: ['items', 'settings'],
           run: function() {
               var cached = this._clones,
                   clones = this.$stage.children('.cloned');

               if (clones.length !== cached.length || (!this.settings.loop && cached.length > 0)) {
                   this.$stage.children('.cloned').remove();
                   this._clones = [];
               }
           }
       }, {
           filter: ['items', 'settings'],
           run: function() {
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
           run: function() {
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
           run: function() {
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

               if (!this.settings.autoWidth && $.grep(this._mergers, function(v) {
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
           run: function(cache) {
               cache.current && this.reset(this.$stage.children().index(cache.current));
           }
       }, {
           filter: ['position'],
           run: function() {
               this.animate(this.coordinates(this._current));
           }
       }, {
           filter: ['width', 'position', 'items', 'settings'],
           run: function() {
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
       Owl.prototype.initialize = function() {
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
       Owl.prototype.setup = function() {
           var viewport = this.viewport(),
               overwrites = this.options.responsive,
               match = -1,
               settings = null;

           if (!overwrites) {
               settings = $.extend({}, this.options);
           } else {
               $.each(overwrites, function(breakpoint) {
                   if (breakpoint <= viewport && breakpoint > match) {
                       match = Number(breakpoint);
                   }
               });

               settings = $.extend({}, this.options, overwrites[match]);
               delete settings.responsive;

               // responsive class
               if (settings.responsiveClass) {
                   this.$element.attr('class', function(i, c) {
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
       Owl.prototype.optionsLogic = function() {
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
       Owl.prototype.prepare = function(item) {
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
       Owl.prototype.update = function() {
           var i = 0,
               n = this._pipe.length,
               filter = $.proxy(function(p) {
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
       Owl.prototype.width = function(dimension) {
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
       Owl.prototype.refresh = function() {
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
       Owl.prototype.eventsCall = function() {
           // Save events references
           this.e._onDragStart = $.proxy(function(e) {
               this.onDragStart(e);
           }, this);
           this.e._onDragMove = $.proxy(function(e) {
               this.onDragMove(e);
           }, this);
           this.e._onDragEnd = $.proxy(function(e) {
               this.onDragEnd(e);
           }, this);
           this.e._onResize = $.proxy(function(e) {
               this.onResize(e);
           }, this);
           this.e._transitionEnd = $.proxy(function(e) {
               this.transitionEnd(e);
           }, this);
           this.e._preventClick = $.proxy(function(e) {
               this.preventClick(e);
           }, this);
       };

       /**
        * Checks window `resize` event.
        * @protected
        */
       Owl.prototype.onThrottledResize = function() {
           window.clearTimeout(this.resizeTimer);
           this.resizeTimer = window.setTimeout(this.e._onResize, this.settings.responsiveRefreshRate);
       };

       /**
        * Checks window `resize` event.
        * @protected
        */
       Owl.prototype.onResize = function() {
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
       Owl.prototype.eventsRouter = function(event) {
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
       Owl.prototype.internalEvents = function() {
           var isTouch = isTouchSupport(),
               isTouchIE = isTouchSupportIE();

           if (this.settings.mouseDrag) {
               this.$stage.on('mousedown', $.proxy(function(event) {
                   this.eventsRouter(event)
               }, this));
               this.$stage.on('dragstart', function() {
                   return false
               });
               this.$stage.get(0).onselectstart = function() {
                   return false
               };
           } else {
               this.$element.addClass('owl-text-select-on');
           }

           if (this.settings.touchDrag && !isTouchIE) {
               this.$stage.on('touchstart touchcancel', $.proxy(function(event) {
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
       Owl.prototype.onDragStart = function(event) {
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

           $(document).on('mousemove.owl.dragEvents mouseup.owl.dragEvents touchmove.owl.dragEvents touchend.owl.dragEvents', $.proxy(function(event) {
               this.eventsRouter(event)
           }, this));
       };

       /**
        * Handles the touchmove/mousemove events.
        * @todo Simplify
        * @protected
        * @param {Event} event - The event arguments.
        */
       Owl.prototype.onDragMove = function(event) {
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
       Owl.prototype.onDragEnd = function(event) {
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
       Owl.prototype.removeClick = function(target) {
           this.drag.targetEl = target;
           $(target).on('click.preventClick', this.e._preventClick);
           // to make sure click is removed:
           window.setTimeout(function() {
               $(target).off('click.preventClick');
           }, 300);
       };

       /**
        * Suppresses click event.
        * @protected
        * @param {Event} ev - The event arguments.
        */
       Owl.prototype.preventClick = function(ev) {
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
       Owl.prototype.getTransformProperty = function() {
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
       Owl.prototype.closest = function(coordinate) {
           var position = -1,
               pull = 30,
               width = this.width(),
               coordinates = this.coordinates();

           if (!this.settings.freeDrag) {
               // check closest item
               $.each(coordinates, $.proxy(function(index, value) {
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
       Owl.prototype.animate = function(coordinate) {
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
               }, this.speed() / 1000, this.settings.fallbackEasing, $.proxy(function() {
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
       Owl.prototype.current = function(position) {
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
       Owl.prototype.invalidate = function(part) {
           this._invalidated[part] = true;
       }

       /**
        * Resets the absolute position of the current item.
        * @public
        * @param {Number} position - The absolute position of the new item.
        */
       Owl.prototype.reset = function(position) {
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
       Owl.prototype.normalize = function(position, relative) {
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
       Owl.prototype.relative = function(position) {
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
       Owl.prototype.maximum = function(relative) {
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
       Owl.prototype.minimum = function(relative) {
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
       Owl.prototype.items = function(position) {
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
       Owl.prototype.mergers = function(position) {
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
       Owl.prototype.clones = function(position) {
           var odd = this._clones.length / 2,
               even = odd + this._items.length,
               map = function(index) {
                   return index % 2 === 0 ? even + index / 2 : odd - (index + 1) / 2
               };

           if (position === undefined) {
               return $.map(this._clones, function(v, i) {
                   return map(i)
               });
           }

           return $.map(this._clones, function(v, i) {
               return v === position ? map(i) : null
           });
       };

       /**
        * Sets the current animation speed.
        * @public
        * @param {Number} [speed] - The animation speed in milliseconds or nothing to leave it unchanged.
        * @returns {Number} - The current animation speed in milliseconds.
        */
       Owl.prototype.speed = function(speed) {
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
       Owl.prototype.coordinates = function(position) {
           var coordinate = null;

           if (position === undefined) {
               return $.map(this._coordinates, $.proxy(function(coordinate, index) {
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
       Owl.prototype.duration = function(from, to, factor) {
           return Math.min(Math.max(Math.abs(to - from), 1), 6) * Math.abs((factor || this.settings.smartSpeed));
       };

       /**
        * Slides to the specified item.
        * @public
        * @param {Number} position - The position of the item.
        * @param {Number} [speed] - The time in milliseconds for the transition.
        */
       Owl.prototype.to = function(position, speed) {
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
               this.e._goToLoop = window.setTimeout($.proxy(function() {
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
       Owl.prototype.next = function(speed) {
           speed = speed || false;
           this.to(this.relative(this.current()) + 1, speed);
       };

       /**
        * Slides to the previous item.
        * @public
        * @param {Number} [speed] - The time in milliseconds for the transition.
        */
       Owl.prototype.prev = function(speed) {
           speed = speed || false;
           this.to(this.relative(this.current()) - 1, speed);
       };

       /**
        * Handles the end of an animation.
        * @protected
        * @param {Event} event - The event arguments.
        */
       Owl.prototype.transitionEnd = function(event) {

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
       Owl.prototype.viewport = function() {
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
       Owl.prototype.replace = function(content) {
           this.$stage.empty();
           this._items = [];

           if (content) {
               content = (content instanceof jQuery) ? content : $(content);
           }

           if (this.settings.nestedItemSelector) {
               content = content.find('.' + this.settings.nestedItemSelector);
           }

           content.filter(function() {
               return this.nodeType === 1;
           }).each($.proxy(function(index, item) {
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
       Owl.prototype.add = function(content, position) {
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
       Owl.prototype.remove = function(position) {
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
       Owl.prototype.addTriggerableEvents = function() {
           var handler = $.proxy(function(callback, event) {
               return $.proxy(function(e) {
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
           }, $.proxy(function(event, callback) {
               this.$element.on(event + '.owl.carousel', handler(callback, event + '.owl.carousel'));
           }, this));

       };

       /**
        * Watches the visibility of the carousel element.
        * @protected
        */
       Owl.prototype.watchVisibility = function() {

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
       Owl.prototype.preloadAutoWidthImages = function(imgs) {
           var loaded, that, $el, img;

           loaded = 0;
           that = this;
           imgs.each(function(i, el) {
               $el = $(el);
               img = new Image();

               img.onload = function() {
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
       Owl.prototype.destroy = function() {

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
               this.$stage.get(0).onselectstart = function() {};
               this.$stage.off('dragstart', function() {
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
       Owl.prototype.op = function(a, o, b) {
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
       Owl.prototype.on = function(element, event, listener, capture) {
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
       Owl.prototype.off = function(element, event, listener, capture) {
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
       Owl.prototype.trigger = function(name, data, namespace) {
           var status = {
                   item: {
                       count: this._items.length,
                       index: this.current()
                   }
               },
               handler = $.camelCase(
                   $.grep(['on', name, namespace], function(v) {
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
               $.each(this._plugins, function(name, plugin) {
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
       Owl.prototype.suppress = function(events) {
           $.each(events, $.proxy(function(index, event) {
               this._supress[event] = true;
           }, this));
       }

       /**
        * Releases suppressed events.
        * @protected
        * @param {Array.<String>} events - The events to release.
        */
       Owl.prototype.release = function(events) {
           $.each(events, $.proxy(function(index, event) {
               delete this._supress[event];
           }, this));
       }

       /**
        * Checks the availability of some browser features.
        * @protected
        */
       Owl.prototype.browserSupport = function() {
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
       $.fn.owlCarousel = function(options) {
           return this.each(function() {
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
   (function($, window, document, undefined) {

       /**
        * Creates the lazy plugin.
        * @class The Lazy Plugin
        * @param {Owl} carousel - The Owl Carousel
        */
       var Lazy = function(carousel) {

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
               'initialized.owl.carousel change.owl.carousel': $.proxy(function(e) {
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
                           load = $.proxy(function(i, v) {
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
       Lazy.prototype.load = function(position) {
           var $item = this._core.$stage.children().eq(position),
               $elements = $item && $item.find('.owl-lazy');

           if (!$elements || $.inArray($item.get(0), this._loaded) > -1) {
               return;
           }

           $elements.each($.proxy(function(index, element) {
               var $element = $(element),
                   image,
                   url = (window.devicePixelRatio > 1 && $element.attr('data-src-retina')) || $element.attr('data-src');

               this._core.trigger('load', {
                   element: $element,
                   url: url
               }, 'lazy');

               if ($element.is('img')) {
                   $element.one('load.owl.lazy', $.proxy(function() {
                       $element.css('opacity', 1);
                       this._core.trigger('loaded', {
                           element: $element,
                           url: url
                       }, 'lazy');
                   }, this)).attr('src', url);
               } else {
                   image = new Image();
                   image.onload = $.proxy(function() {
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
       Lazy.prototype.destroy = function() {
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
   (function($, window, document, undefined) {

       /**
        * Creates the auto height plugin.
        * @class The Auto Height Plugin
        * @param {Owl} carousel - The Owl Carousel
        */
       var AutoHeight = function(carousel) {
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
               'initialized.owl.carousel': $.proxy(function() {
                   if (this._core.settings.autoHeight) {
                       this.update();
                   }
               }, this),
               'changed.owl.carousel': $.proxy(function(e) {
                   if (this._core.settings.autoHeight && e.property.name == 'position') {
                       this.update();
                   }
               }, this),
               'loaded.owl.lazy': $.proxy(function(e) {
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
       AutoHeight.prototype.update = function() {
           this._core.$stage.parent()
               .height(this._core.$stage.children().eq(this._core.current()).height())
               .addClass(this._core.settings.autoHeightClass);
       };

       AutoHeight.prototype.destroy = function() {
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
   (function($, window, document, undefined) {

       /**
        * Creates the video plugin.
        * @class The Video Plugin
        * @param {Owl} carousel - The Owl Carousel
        */
       var Video = function(carousel) {
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
               'resize.owl.carousel': $.proxy(function(e) {
                   if (this._core.settings.video && !this.isInFullScreen()) {
                       e.preventDefault();
                   }
               }, this),
               'refresh.owl.carousel changed.owl.carousel': $.proxy(function(e) {
                   if (this._playing) {
                       this.stop();
                   }
               }, this),
               'prepared.owl.carousel': $.proxy(function(e) {
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

           this._core.$element.on('click.owl.video', '.owl-video-play-icon', $.proxy(function(e) {
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
       Video.prototype.fetch = function(target, item) {

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
       Video.prototype.thumbnail = function(target, video) {

           var tnLink,
               icon,
               path,
               dimensions = video.width && video.height ? 'style="width:' + video.width + 'px;height:' + video.height + 'px;"' : '',
               customTn = target.find('img'),
               srcType = 'src',
               lazyClass = '',
               settings = this._core.settings,
               create = function(path) {
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
                   success: function(data) {
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
       Video.prototype.stop = function() {
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
       Video.prototype.play = function(ev) {
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
       Video.prototype.isInFullScreen = function() {

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
       Video.prototype.destroy = function() {
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
   (function($, window, document, undefined) {

       /**
        * Creates the animate plugin.
        * @class The Navigation Plugin
        * @param {Owl} scope - The Owl Carousel
        */
       var Animate = function(scope) {
           this.core = scope;
           this.core.options = $.extend({}, Animate.Defaults, this.core.options);
           this.swapping = true;
           this.previous = undefined;
           this.next = undefined;

           this.handlers = {
               'change.owl.carousel': $.proxy(function(e) {
                   if (e.property.name == 'position') {
                       this.previous = this.core.current();
                       this.next = e.property.value;
                   }
               }, this),
               'drag.owl.carousel dragged.owl.carousel translated.owl.carousel': $.proxy(function(e) {
                   this.swapping = e.type == 'translated';
               }, this),
               'translate.owl.carousel': $.proxy(function(e) {
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
       Animate.prototype.swap = function() {

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

       Animate.prototype.clear = function(e) {
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
       Animate.prototype.destroy = function() {
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
   (function($, window, document, undefined) {

       /**
        * Creates the autoplay plugin.
        * @class The Autoplay Plugin
        * @param {Owl} scope - The Owl Carousel
        */
       var Autoplay = function(scope) {
           this.core = scope;
           this.core.options = $.extend({}, Autoplay.Defaults, this.core.options);

           this.handlers = {
               'translated.owl.carousel refreshed.owl.carousel': $.proxy(function() {
                   this.autoplay();
               }, this),
               'play.owl.autoplay': $.proxy(function(e, t, s) {
                   this.play(t, s);
               }, this),
               'stop.owl.autoplay': $.proxy(function() {
                   this.stop();
               }, this),
               'mouseover.owl.autoplay': $.proxy(function() {
                   if (this.core.settings.autoplayHoverPause) {
                       this.pause();
                   }
               }, this),
               'mouseleave.owl.autoplay': $.proxy(function() {
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
       Autoplay.prototype.autoplay = function() {
           if (this.core.settings.autoplay && !this.core.state.videoPlay) {
               window.clearInterval(this.interval);

               this.interval = window.setInterval($.proxy(function() {
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
       Autoplay.prototype.play = function(timeout, speed) {
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
       Autoplay.prototype.stop = function() {
           window.clearInterval(this.interval);
       };

       /**
        * Pauses the autoplay.
        * @public
        */
       Autoplay.prototype.pause = function() {
           window.clearInterval(this.interval);
       };

       /**
        * Destroys the plugin.
        */
       Autoplay.prototype.destroy = function() {
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
   (function($, window, document, undefined) {
       'use strict';

       /**
        * Creates the navigation plugin.
        * @class The Navigation Plugin
        * @param {Owl} carousel - The Owl Carousel.
        */
       var Navigation = function(carousel) {
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
               'prepared.owl.carousel': $.proxy(function(e) {
                   if (this._core.settings.dotsData) {
                       this._templates.push($(e.content).find('[data-dot]').andSelf('[data-dot]').attr('data-dot'));
                   }
               }, this),
               'add.owl.carousel': $.proxy(function(e) {
                   if (this._core.settings.dotsData) {
                       this._templates.splice(e.position, 0, $(e.content).find('[data-dot]').andSelf('[data-dot]').attr('data-dot'));
                   }
               }, this),
               'remove.owl.carousel prepared.owl.carousel': $.proxy(function(e) {
                   if (this._core.settings.dotsData) {
                       this._templates.splice(e.position, 1);
                   }
               }, this),
               'change.owl.carousel': $.proxy(function(e) {
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
               'changed.owl.carousel': $.proxy(function(e) {
                   if (e.property.name == 'position') {
                       this.draw();
                   }
               }, this),
               'refreshed.owl.carousel': $.proxy(function() {
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
       Navigation.prototype.initialize = function() {
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

           this._controls.$indicators.on('click', 'div', $.proxy(function(e) {
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
               .on('click', $.proxy(function(e) {
                   this.prev(options.navSpeed);
               }, this));
           this._controls.$next
               .addClass(options.navClass[1])
               .html(options.navText[1])
               .hide()
               .appendTo($container)
               .on('click', $.proxy(function(e) {
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
       Navigation.prototype.destroy = function() {
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
       Navigation.prototype.update = function() {
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
       Navigation.prototype.draw = function() {
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
       Navigation.prototype.onTrigger = function(event) {
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
       Navigation.prototype.current = function() {
           var index = this._core.relative(this._core.current());
           return $.grep(this._pages, function(o) {
               return o.start <= index && o.end >= index;
           }).pop();
       }

       /**
        * Gets the current succesor/predecessor position.
        * @protected
        * @returns {Number}
        */
       Navigation.prototype.getPosition = function(successor) {
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
       Navigation.prototype.next = function(speed) {
           $.proxy(this._overrides.to, this._core)(this.getPosition(true), speed);
       }

       /**
        * Slides to the previous item or page.
        * @public
        * @param {Number} [speed=false] - The time in milliseconds for the transition.
        */
       Navigation.prototype.prev = function(speed) {
           $.proxy(this._overrides.to, this._core)(this.getPosition(false), speed);
       }

       /**
        * Slides to the specified item or page.
        * @public
        * @param {Number} position - The position of the item or page.
        * @param {Number} [speed] - The time in milliseconds for the transition.
        * @param {Boolean} [standard=false] - Whether to use the standard behaviour or not.
        */
       Navigation.prototype.to = function(position, speed, standard) {
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
   (function($, window, document, undefined) {
       'use strict';

       /**
        * Creates the hash plugin.
        * @class The Hash Plugin
        * @param {Owl} carousel - The Owl Carousel
        */
       var Hash = function(carousel) {
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
               'initialized.owl.carousel': $.proxy(function() {
                   if (this._core.settings.startPosition == 'URLHash') {
                       $(window).trigger('hashchange.owl.navigation');
                   }
               }, this),
               'prepared.owl.carousel': $.proxy(function(e) {
                   var hash = $(e.content).find('[data-hash]').andSelf('[data-hash]').attr('data-hash');
                   this._hashes[hash] = e.content;
               }, this)
           };

           // set default options
           this._core.options = $.extend({}, Hash.Defaults, this._core.options);

           // register the event handlers
           this.$element.on(this._handlers);

           // register event listener for hash navigation
           $(window).on('hashchange.owl.navigation', $.proxy(function() {
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
       Hash.prototype.destroy = function() {
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
   ! function() {
       var t;
       window.ws_caption_fade = function(i, n, o, a) {
           var e = i.noDelay ? 0 : (i.duration / 2 - i.captionDuration / 3) / 2;
           0 > e && (e = 0), n.stop(1, 1).delay(e).fadeOut(i.captionDuration / 3), a && (t && clearTimeout(t), t = setTimeout(function() {
               n.stop(1, 1).html(a), n.fadeIn(i.captionDuration, function() {
                   this.filters && this.style.removeAttribute("filter")
               })
           }, i.noDelay ? 0 : i.duration / 2 + e))
       }
   }();
   ! function() {
       var t;
       window.ws_caption_move = function(i, e, a, o) {
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
           0 > f && (f = 0), e.stop(1, 1).delay(f).fadeOut(i.captionDuration / 3), o && (t && clearTimeout(t), t = setTimeout(function() {
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
               }), t(0), setTimeout(function() {
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
           function(n, i, a, s, o, r) {
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
                   p(n, h).show(), p(i, 0).show(), p(d, g), p(f, 0), p(w, 2 * g), p(l, 0), wowAnimate(function(t) {
                       t = e.easing.swing(t), p(n, (1 - t) * h), p(i, t * v)
                   }, 0, 1, t.duration);
                   var m = .8;
                   wowAnimate(function(t) {
                       t *= m, p(w, 2 * (1 - t) * g), p(d, (1 - t) * g), p(l, -2 * t * g), p(f, t * -g)
                   }, 0, 1, t.duration, function() {
                       wowAnimate(function(t) {
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
               var a = e.replace(/\-\w/g, function(t) {
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
               complete: function() {
                   t.css(o), t.parent().replaceWith(t), e.complete && e.complete()
               }
           })
       }
       var p = jQuery;
       e.stop(1, 1).fadeOut(t.captionDuration / 3, function() {
           i && (e.html(i), s(e, {
               direction: "left",
               easing: "easeInOutExpo",
               complete: function() {
                   e.get(0).filters && e.get(0).style.removeAttribute("filter")
               },
               duration: t.captionDuration
           }))
       })
   }! function() {
       var t, e = jQuery;
       e.extend(e.easing, {
           easeInQuad: function(t, e, i, o, n) {
               return o * (e /= n) * e + i
           },
           easeOutQuad: function(t, e, i, o, n) {
               return -o * (e /= n) * (e - 2) + i
           }
       }), window.ws_caption_traces = function(i, o, n, a) {
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
               }).animate(r, .8 * i.captionDuration, "easeOutQuad", function() {
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
               u = function() {
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
           0 > p && (p = 0), o.stop(1, 1).delay(p).fadeOut(i.captionDuration / 3), a && (t && clearTimeout(t), t = setTimeout(function() {
               o.stop(1, 1).html(a);
               var t = o.find(">span,>div").get();
               e(t).css({
                   position: "relative",
                   visibility: "hidden",
                   verticalAlign: "top",
                   overflow: "hidden"
               }), o.show(), l(e(t[0]), c[0]), setTimeout(function() {
                   l(e(t[1]), c[1])
               }, .3 * i.captionDuration)
           }, i.noDelay ? 0 : i.duration / 2 + p))
       }
   }();

   jQuery.fn.wowSlider = function(t) {
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
               Z || (isNaN(t) && (t = Q(G, N)), t = n(t), G != t && (D ? D.load(t, function() {
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
                           function(e, n, i) {
                               ee = Math.floor(Math.random() * B.length), k(B[ee]).trigger("effectStart", {
                                   curIndex: e,
                                   nextIndex: n,
                                   cont: k("." + B[ee].name, A),
                                   start: function() {
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
               e[0] || (e = k(e)), e.on((n ? "mousedown " : "") + "touchstart", function(e) {
                   var n = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
                   2 == t.gestures && A.addClass("ws_grabbing"), f = 0, n ? (r = n.pageX, c = n.pageY, d = p = 1, a && (d = p = a(e))) : d = p = 0, e.originalEvent.touches || (e.preventDefault(), e.stopPropagation())
               }), k(document).on((n ? "mousemove " : "") + "touchmove", e, function(t) {
                   if (d) {
                       var e = t.originalEvent.touches ? t.originalEvent.touches[0] : t;
                       f = 1, l = e.pageX - r, u = e.pageY - c, i && i(t, l, u)
                   }
               }), k(document).on((n ? "mouseup " : "") + "touchend", e, function(e) {
                   2 == t.gestures && A.removeClass("ws_grabbing"), d && (f && o && o(e, l, u), !f && s && s(e), f && (e.preventDefault(), e.stopPropagation()), f = 0, d = 0)
               }), e.on("click", function(t) {
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
               pe && (pe = 0, setTimeout(function() {
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
               g(), t.autoPlay ? (ue = setTimeout(function() {
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
               A.find(".ws_bullets a,.ws_thumbs a").click(function(t) {
                   w(t, k(this).index())
               });
               var i;
               if (de.length) {
                   de.hover(function() {
                       xe = 1
                   }, function() {
                       xe = 0
                   });
                   var a = de.find(">div");
                   de.css({
                       overflow: "hidden"
                   });
                   var o, s, r;
                   if (i = de.width() < A.width(), de.bind("mousemove mouseover", e), de.mouseout(function() {
                           s = setTimeout(function() {
                               a.stop()
                           }, 100)
                       }), de.trigger("mousemove"), t.gestures) {
                       var c, l, f, d, p, h;
                       u(de, 2 == t.gestures, function(t, e, n) {
                           if (f > p || d > h) return !1;
                           var i = Math.min(Math.max(c + e, f - p), 0),
                               o = Math.min(Math.max(l + n, d - h), 0);
                           a.css("left", i), a.css("top", o)
                       }, function() {
                           r = 1;
                           var t = a.find("> a");
                           return f = de.width(), d = de.height(), p = k(t.get(0)).outerWidth(!0) * t.length, h = a.height(), c = parseFloat(a.css("left")) || 0, l = parseFloat(a.css("top")) || 0, !0
                       }, function() {
                           r = 0
                       }, function() {
                           r = 0
                       })
                   }
                   A.find(".ws_thumbs a").each(function(t, e) {
                       u(e, 0, 0, function(t) {
                           return !!k(t.target).parents(".ws_thumbs").get(0)
                       }, function() {
                           r = 1
                       }, function(t) {
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
                       v.hover(function() {
                           n(k(this).index())
                       });
                       var _;
                       m.hover(function() {
                           _ && (clearTimeout(_), _ = 0), n(x)
                       }, function() {
                           v.removeClass("ws_overbull"), document.all ? _ || (_ = setTimeout(function() {
                               b.hide(), _ = 0
                           }, 400)) : b.stop().animate({
                               opacity: 0
                           }, {
                               duration: "fast",
                               complete: function() {
                                   b.hide()
                               }
                           })
                       }), m.click(function(t) {
                           w(t, k(t.target).index())
                       })
                   }
               }
           }

           function x(t) {
               k("A", de).each(function(e) {
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
               k("A", fe).each(function(e) {
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
                   i.each(function() {
                       k(this).css("marginTop", -t.height * a / 2)
                   })
               }
               if (3 == e) {
                   var o = window.innerHeight - (A.offset().top || 0),
                       s = t.width / t.height,
                       r = s > n / o;
                   A.css("height", o), i.each(function() {
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
                   }), i.each(function() {
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
           window.ws_basic = function(t, e, n) {
               var i = k(this);
               this.go = function(e) {
                   n.find(".ws_list").css("transform", "translate3d(0,0,0)").stop(!0).animate({
                       left: e ? -e + "00%" : /Safari/.test(navigator.userAgent) ? "0%" : 0
                   }, t.duration, "easeInOutExpo", function() {
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
           var Q = t.onBeforeStep || function(t) {
               return t + 1
           };
           t.startSlide = n(isNaN(t.startSlide) ? Q(-1, N) : t.startSlide), D && D.load(t.startSlide, function() {}), e(t.startSlide);
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
           z.each(function() {
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
           k(B).bind("effectStart", function(t, e) {
               Z++, a(e, function() {
                   l(), e.cont && k(e.cont).stop().show().css("opacity", 1), e.start && e.start(), U = G, G = e.nextIndex, d(G, U, e.captionNoDelay)
               })
           }), k(B).bind("effectEnd", function(t, n) {
               e(G).stop(!0, !0).show(), setTimeout(function() {
                   o(G, function() {
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
                   u(O, 2 == t.gestures, function(e, n) {
                       re = !!B[0].step, m(), I.stop(!0, !0), se && (te = !0, Z++, se = 0, re || l()), ce = n, n > ae && (n = ae), -ae > n && (n = -ae), re ? B[0].step(G, n / ae) : t.support.transform && t.support.transition ? I.css("transform", "translate3d(" + n + "px,0,0)") : I.css("left", oe + n)
                   }, function(t) {
                       var e = /ws_playpause|ws_prev|ws_next|ws_bullets/g.test(t.target.className) || k(t.target).parents(".ws_bullets").get(0),
                           n = me ? t.target == me[0] : 0;
                       return e || n || J && J.playing() ? !1 : (se = 1, ae = O.width(), oe = parseFloat(-G * ae) || 0, !0)
                   }, function(e, i) {
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
                           start: function() {
                               function e() {
                                   t.support.transform && t.support.transition && I.css({
                                       transition: "0ms",
                                       transform: /Firefox/.test(j) ? "" : "translate3d(0,0,0)"
                                   }), k(B[0]).trigger("effectEnd", {
                                       swipe: !0
                                   })
                               }

                               function n() {
                                   re ? i > a || -a > i ? k(B[0]).trigger("effectEnd") : wowAnimate(function(t) {
                                       var e = i + (a * (i > 0 ? 1 : -1) - i) * t;
                                       B[0].step(U, e / a)
                                   }, 0, 1, r, function() {
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
                   }, function() {
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
               }).html(ie).bind("contextmenu", function() {
                   return !1
               }).show().appendTo(ne || document.body).attr("target", "_blank");
               var we = k('<div class="ws_controls">').appendTo(O);
               if (fe[0] && fe.appendTo(we), t.controls) {
                   var be = k('<a href="#" class="ws_next"><span>' + t.next + "<i></i><b></b></span></a>"),
                       ye = k('<a href="#" class="ws_prev"><span>' + t.prev + "<i></i><b></b></span></a>");
                   we.append(be, ye), be.bind("click", function(t) {
                       w(t, G + 1, 1)
                   }), ye.bind("click", function(t) {
                       w(t, G - 1, 0)
                   }), /iPhone/.test(navigator.platform) && (ye.get(0).addEventListener("touchend", function(t) {
                       w(t, G - 1, 1)
                   }, !1), be.get(0).addEventListener("touchend", function(t) {
                       w(t, G + 1, 0)
                   }, !1)), t.controlsThumb && (be.append('<img alt="" src="">'), ye.append('<img alt="" src="">'))
               }
               var xe, _e = t.thumbRate;
               if (t.caption) {
                   var Te = k("<div class='ws-title' style='display:none'></div>"),
                       Me = k("<div class='ws-title' style='display:none'></div>");
                   k("<div class='ws-title-wrapper'>").append(Te, Me).appendTo(O), Te.bind("mouseover", function() {
                       J && J.playing() || g()
                   }), Te.bind("mouseout", function() {
                       J && J.playing() || v()
                   })
               }
               var Fe, Se = {
                   none: function(t, e, n, i) {
                       Fe && clearTimeout(Fe), Fe = setTimeout(function() {
                           e.html(i).show()
                       }, t.noDelay ? 0 : t.duration / 2)
                   }
               };
               Se[t.captionEffect] || (Se[t.captionEffect] = window["ws_caption_" + t.captionEffect]), (fe.length || de.length) && y(), d(G, U, !0), t.stopOnHover && (this.bind("mouseover", function() {
                   J && J.playing() || g(), he = !0
               }), this.bind("mouseout", function() {
                   J && J.playing() || v(), he = !1
               })), J && J.playing() || v();
               var Ce = A.find("audio").get(0),
                   Ee = t.autoPlay;
               if (Ce) {
                   if (k(Ce).insertAfter(A), window.Audio && Ce.canPlayType && Ce.canPlayType("audio/mp3")) Ce.loop = "loop", t.autoPlay && (Ce.autoplay = "autoplay", setTimeout(function() {
                       Ce.play()
                   }, 100));
                   else {
                       Ce = Ce.src;
                       var ke = Ce.substring(0, Ce.length - /[^\\\/]+$/.exec(Ce)[0].length),
                           Ae = "wsSound" + Math.round(9999 * Math.random());
                       k("<div>").appendTo(A).get(0).id = Ae;
                       var Pe = "wsSL" + Math.round(9999 * Math.random());
                       window[Pe] = {
                           onInit: function() {}
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
                   A.bind("stop", function() {
                       Ee = !1, Ce ? Ce.pause() : k(Ae).SetVariable("method:pause", "")
                   }), A.bind("start", function() {
                       Ce ? Ce.play() : k(Ae).SetVariable("method:play", "")
                   })
               }
               P.wsStart = s, P.wsRestart = v, P.wsStop = m;
               var je = k('<a href="#" class="ws_playpause"><span><i></i><b></b></span></a>');
               if (t.playPause && (je.addClass(t.autoPlay ? "ws_pause" : "ws_play"), je.click(function() {
                       return F(), !1
                   }), we.append(je)), t.keyboardControl && k(document).on("keyup", function(t) {
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
                   }), t.scrollControl && A.on("DOMMouseScroll mousewheel", function(t) {
                       t.originalEvent.wheelDelta < 0 || t.originalEvent.detail > 0 ? w(null, G + 1, 1) : w(null, G - 1, 0)
                   }), "function" == typeof wowsliderVideo) {
                   var Oe = k('<div class="ws_video_btn"><div></div></div>').appendTo(O);
                   J = new wowsliderVideo(A, t, l), "undefined" != typeof $f && (J.vimeo(!0), J.start(G)), window.onYouTubeIframeAPIReady = function() {
                       J.youtube(!0), J.start(G)
                   }, Oe.on("click touchend", function() {
                       Z || J.play(G, 1)
                   })
               }
               var qe = 0;
               if (t.fullScreen) {
                   var Ie = function() {
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
                       document.addEventListener(Ie.fullscreenchange, function() {
                           S() ? (qe = 1, E()) : (De && (De = 0, A.unwrap()), qe = 0, E()), B[0].step || l()
                       }), k("<a href='#' class='ws_fullscreen'></a>").on("click", C).appendTo(O)
                   }
               }
               return t.responsive && (k(E), k(window).on("load resize", E)), this
           }
       }, jQuery.extend(jQuery.easing, {
           easeInOutExpo: function(t, e, n, i, a) {
               return 0 == e ? n : e == a ? n + i : (e /= a / 2) < 1 ? i / 2 * Math.pow(2, 10 * (e - 1)) + n : i / 2 * (-Math.pow(2, -10 * --e) + 2) + n
           },
           easeOutCirc: function(t, e, n, i, a) {
               return i * Math.sqrt(1 - (e = e / a - 1) * e) + n
           },
           easeOutCubic: function(t, e, n, i, a) {
               return i * ((e = e / a - 1) * e * e + 1) + n
           },
           easeOutElastic1: function(t, e, n, i, a) {
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
           easeOutBack: function(t, e, n, i, a, o) {
               return void 0 == o && (o = 1.70158), i * ((e = e / a - 1) * e * ((o + 1) * e + o) + 1) + n
           }
       }), jQuery.fn.wowSlider.support = {
           transform: function() {
               if (!window.getComputedStyle) return !1;
               var t = document.createElement("div");
               document.body.insertBefore(t, document.body.lastChild), t.style.transform = "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)";
               var e = window.getComputedStyle(t).getPropertyValue("transform");
               return t.parentNode.removeChild(t), void 0 !== e ? "none" !== e : !1
           }(),
           perspective: function() {
               for (var t = "perspectiveProperty perspective WebkitPerspective MozPerspective OPerspective MsPerspective".split(" "), e = 0; e < t.length; e++)
                   if (void 0 !== document.body.style[t[e]]) return !!t[e];
               return !1
           }(),
           transition: function() {
               var t = document.body || document.documentElement,
                   e = t.style;
               return void 0 !== e.transition || void 0 !== e.WebkitTransition || void 0 !== e.MozTransition || void 0 !== e.MsTransition || void 0 !== e.OTransition
           }()
       },
       function(t) {
           function e(e, n, i, a, o, s, r) {
               function c(t) {
                   function e(e) {
                       cancelAnimationFrame(e), t(1), r && r()
                   }
                   var n = (new Date).getTime() + o,
                       i = function() {
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
                   return "string" == typeof e ? r = e : "string" == typeof n && (r = n), r = function(t, e, n) {
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
                           h = c(function(t) {
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
       }(jQuery), Date.now || (Date.now = function() {
           return (new Date).getTime()
       }),
       function() {
           "use strict";
           for (var t = ["webkit", "moz"], e = 0; e < t.length && !window.requestAnimationFrame; ++e) {
               var n = t[e];
               window.requestAnimationFrame = window[n + "RequestAnimationFrame"], window.cancelAnimationFrame = window[n + "CancelAnimationFrame"] || window[n + "CancelRequestAnimationFrame"]
           }
           if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
               var i = 0;
               window.requestAnimationFrame = function(t) {
                   var e = Date.now(),
                       n = Math.max(i + 16, e);
                   return setTimeout(function() {
                       t(i = n)
                   }, n - e)
               }, window.cancelAnimationFrame = clearTimeout
           }
       }();




   // extend wowslider for effect support
   (function($) {
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
               cont.on('click', '[data-effect]', function() {
                   var curEffect = $(this).attr('data-effect');
                   $.getScript(effectsPath + curEffect + ".js", function() {
                       callback(curEffect);
                   });
                   return false;
               });

               // fix firefox drag event
               cont.on('dragstart', '.effmore', function(e) {
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

           $('#devices').on('click', 'a', function(e) {
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
       $.fn.wowSlider = function(options) {
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
                   controlDeviceButtons(wow, function(newOpts) {
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
           $.getScript(effectsPath + newOptions.effect + ".js", function() {
               newOptions.support = default_wowSlider.support;

               // change duration in brick effect
               if (newOptions.effect == 'brick') newOptions.duration = 5500;
               else newOptions.duration = default_options.duration;

               // recreate html or init effects
               if (!bkpCont) { //first start
                   bkpCont = $(document.createElement("div")).append(wow.clone()).html();

                   createEffects(function(eff) {
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
                   onStep: function(num) {
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
       window.wowReInitor = function(wow, options) {
           $(wow).wowSlider(options);
       };
   })(jQuery);