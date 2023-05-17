var require;var require;/**
 * interact.js 1.4.0-rc.13
 *
 * Copyright (c) 2012-2019 Taye Adeyemi <dev@taye.me>
 * Released under the MIT License.
 * https://raw.github.com/taye/interact.js/master/LICENSE
 */
(function(f){if(true){module.exports=f()}else { var g; }})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return require(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _scope = require("@interactjs/core/scope");

var arr = _interopRequireWildcard(require("@interactjs/utils/arr"));

var is = _interopRequireWildcard(require("@interactjs/utils/is"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

_scope.ActionName.Drag = 'drag';

function install(scope) {
  var actions = scope.actions,
      Interactable = scope.Interactable,
      interactions = scope.interactions,
      defaults = scope.defaults;
  interactions.signals.on('before-action-move', beforeMove);
  interactions.signals.on('action-resume', beforeMove); // dragmove

  interactions.signals.on('action-move', move);
  Interactable.prototype.draggable = drag.draggable;
  actions[_scope.ActionName.Drag] = drag;
  actions.names.push(_scope.ActionName.Drag);
  arr.merge(actions.eventTypes, ['dragstart', 'dragmove', 'draginertiastart', 'dragresume', 'dragend']);
  actions.methodDict.drag = 'draggable';
  defaults.actions.drag = drag.defaults;
}

function beforeMove(_ref) {
  var interaction = _ref.interaction;

  if (interaction.prepared.name !== 'drag') {
    return;
  }

  var axis = interaction.prepared.axis;

  if (axis === 'x') {
    interaction.coords.cur.page.y = interaction.coords.start.page.y;
    interaction.coords.cur.client.y = interaction.coords.start.client.y;
    interaction.coords.velocity.client.y = 0;
    interaction.coords.velocity.page.y = 0;
  } else if (axis === 'y') {
    interaction.coords.cur.page.x = interaction.coords.start.page.x;
    interaction.coords.cur.client.x = interaction.coords.start.client.x;
    interaction.coords.velocity.client.x = 0;
    interaction.coords.velocity.page.x = 0;
  }
}

function move(_ref2) {
  var iEvent = _ref2.iEvent,
      interaction = _ref2.interaction;

  if (interaction.prepared.name !== 'drag') {
    return;
  }

  var axis = interaction.prepared.axis;

  if (axis === 'x' || axis === 'y') {
    var opposite = axis === 'x' ? 'y' : 'x';
    iEvent.page[opposite] = interaction.coords.start.page[opposite];
    iEvent.client[opposite] = interaction.coords.start.client[opposite];
    iEvent.delta[opposite] = 0;
  }
}
/**
 * ```js
 * interact(element).draggable({
 *     onstart: function (event) {},
 *     onmove : function (event) {},
 *     onend  : function (event) {},
 *
 *     // the axis in which the first movement must be
 *     // for the drag sequence to start
 *     // 'xy' by default - any direction
 *     startAxis: 'x' || 'y' || 'xy',
 *
 *     // 'xy' by default - don't restrict to one axis (move in any direction)
 *     // 'x' or 'y' to restrict movement to either axis
 *     // 'start' to restrict movement to the axis the drag started in
 *     lockAxis: 'x' || 'y' || 'xy' || 'start',
 *
 *     // max number of drags that can happen concurrently
 *     // with elements of this Interactable. Infinity by default
 *     max: Infinity,
 *
 *     // max number of drags that can target the same element+Interactable
 *     // 1 by default
 *     maxPerElement: 2
 * })
 *
 * var isDraggable = interact('element').draggable(); // true
 * ```
 *
 * Get or set whether drag actions can be performed on the target
 *
 * @alias Interactable.prototype.draggable
 *
 * @param {boolean | object} [options] true/false or An object with event
 * listeners to be fired on drag events (object makes the Interactable
 * draggable)
 * @return {boolean | Interactable} boolean indicating if this can be the
 * target of drag events, or this Interctable
 */


var draggable = function draggable(options) {
  if (is.object(options)) {
    this.options.drag.enabled = options.enabled !== false;
    this.setPerAction('drag', options);
    this.setOnEvents('drag', options);

    if (/^(xy|x|y|start)$/.test(options.lockAxis)) {
      this.options.drag.lockAxis = options.lockAxis;
    }

    if (/^(xy|x|y)$/.test(options.startAxis)) {
      this.options.drag.startAxis = options.startAxis;
    }

    return this;
  }

  if (is.bool(options)) {
    this.options.drag.enabled = options;
    return this;
  }

  return this.options.drag;
};

var drag = {
  id: 'actions/drag',
  install: install,
  draggable: draggable,
  beforeMove: beforeMove,
  move: move,
  defaults: {
    startAxis: 'xy',
    lockAxis: 'xy'
  },
  checker: function checker(_pointer, _event, interactable) {
    var dragOptions = interactable.options.drag;
    return dragOptions.enabled ? {
      name: 'drag',
      axis: dragOptions.lockAxis === 'start' ? dragOptions.startAxis : dragOptions.lockAxis
    } : null;
  },
  getCursor: function getCursor() {
    return 'move';
  }
};
var _default = drag;
exports["default"] = _default;

},{"@interactjs/core/scope":24,"@interactjs/utils/arr":46,"@interactjs/utils/is":56}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _BaseEvent2 = _interopRequireDefault(require("@interactjs/core/BaseEvent"));

var arr = _interopRequireWildcard(require("@interactjs/utils/arr"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DropEvent =
/*#__PURE__*/
function (_BaseEvent) {
  _inherits(DropEvent, _BaseEvent);

  /**
   * Class of events fired on dropzones during drags with acceptable targets.
   */
  function DropEvent(dropState, dragEvent, type) {
    var _this;

    _classCallCheck(this, DropEvent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DropEvent).call(this, dragEvent._interaction));
    _this.propagationStopped = false;
    _this.immediatePropagationStopped = false;

    var _ref = type === 'dragleave' ? dropState.prev : dropState.cur,
        element = _ref.element,
        dropzone = _ref.dropzone;

    _this.type = type;
    _this.target = element;
    _this.currentTarget = element;
    _this.dropzone = dropzone;
    _this.dragEvent = dragEvent;
    _this.relatedTarget = dragEvent.target;
    _this.draggable = dragEvent.interactable;
    _this.timeStamp = dragEvent.timeStamp;
    return _this;
  }
  /**
   * If this is a `dropactivate` event, the dropzone element will be
   * deactivated.
   *
   * If this is a `dragmove` or `dragenter`, a `dragleave` will be fired on the
   * dropzone element and more.
   */


  _createClass(DropEvent, [{
    key: "reject",
    value: function reject() {
      var _this2 = this;

      var dropState = this._interaction.dropState;

      if (this.type !== 'dropactivate' && (!this.dropzone || dropState.cur.dropzone !== this.dropzone || dropState.cur.element !== this.target)) {
        return;
      }

      dropState.prev.dropzone = this.dropzone;
      dropState.prev.element = this.target;
      dropState.rejected = true;
      dropState.events.enter = null;
      this.stopImmediatePropagation();

      if (this.type === 'dropactivate') {
        var activeDrops = dropState.activeDrops;
        var index = arr.findIndex(activeDrops, function (_ref2) {
          var dropzone = _ref2.dropzone,
              element = _ref2.element;
          return dropzone === _this2.dropzone && element === _this2.target;
        });
        dropState.activeDrops = [].concat(_toConsumableArray(activeDrops.slice(0, index)), _toConsumableArray(activeDrops.slice(index + 1)));
        var deactivateEvent = new DropEvent(dropState, this.dragEvent, 'dropdeactivate');
        deactivateEvent.dropzone = this.dropzone;
        deactivateEvent.target = this.target;
        this.dropzone.fire(deactivateEvent);
      } else {
        this.dropzone.fire(new DropEvent(dropState, this.dragEvent, 'dragleave'));
      }
    }
  }, {
    key: "preventDefault",
    value: function preventDefault() {}
  }, {
    key: "stopPropagation",
    value: function stopPropagation() {
      this.propagationStopped = true;
    }
  }, {
    key: "stopImmediatePropagation",
    value: function stopImmediatePropagation() {
      this.immediatePropagationStopped = this.propagationStopped = true;
    }
  }]);

  return DropEvent;
}(_BaseEvent2["default"]);

var _default = DropEvent;
exports["default"] = _default;

},{"@interactjs/core/BaseEvent":13,"@interactjs/utils/arr":46}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var utils = _interopRequireWildcard(require("@interactjs/utils"));

var _drag = _interopRequireDefault(require("../drag"));

var _DropEvent = _interopRequireDefault(require("./DropEvent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function install(scope) {
  var actions = scope.actions,
      interact = scope.interact,
      Interactable = scope.Interactable,
      interactions = scope.interactions,
      defaults = scope.defaults;
  scope.usePlugin(_drag["default"]);
  interactions.signals.on('before-action-start', function (_ref) {
    var interaction = _ref.interaction;

    if (interaction.prepared.name !== 'drag') {
      return;
    }

    interaction.dropState = {
      cur: {
        dropzone: null,
        element: null
      },
      prev: {
        dropzone: null,
        element: null
      },
      rejected: null,
      events: null,
      activeDrops: null
    };
  });
  interactions.signals.on('after-action-start', function (_ref2) {
    var interaction = _ref2.interaction,
        event = _ref2.event,
        dragEvent = _ref2.iEvent;

    if (interaction.prepared.name !== 'drag') {
      return;
    }

    var dropState = interaction.dropState; // reset active dropzones

    dropState.activeDrops = null;
    dropState.events = null;
    dropState.activeDrops = getActiveDrops(scope, interaction.element);
    dropState.events = getDropEvents(interaction, event, dragEvent);

    if (dropState.events.activate) {
      fireActivationEvents(dropState.activeDrops, dropState.events.activate);
    }
  }); // FIXME proper signal types

  interactions.signals.on('action-move', function (arg) {
    return onEventCreated(arg, scope);
  });
  interactions.signals.on('action-end', function (arg) {
    return onEventCreated(arg, scope);
  });
  interactions.signals.on('after-action-move', function (_ref3) {
    var interaction = _ref3.interaction;

    if (interaction.prepared.name !== 'drag') {
      return;
    }

    fireDropEvents(interaction, interaction.dropState.events);
    interaction.dropState.events = {};
  });
  interactions.signals.on('after-action-end', function (_ref4) {
    var interaction = _ref4.interaction;

    if (interaction.prepared.name !== 'drag') {
      return;
    }

    fireDropEvents(interaction, interaction.dropState.events);
  });
  interactions.signals.on('stop', function (_ref5) {
    var interaction = _ref5.interaction;

    if (interaction.prepared.name !== 'drag') {
      return;
    }

    var dropState = interaction.dropState;
    dropState.activeDrops = null;
    dropState.events = null;
    dropState.cur.dropzone = null;
    dropState.cur.element = null;
    dropState.prev.dropzone = null;
    dropState.prev.element = null;
    dropState.rejected = false;
  });
  /**
   *
   * ```js
   * interact('.drop').dropzone({
   *   accept: '.can-drop' || document.getElementById('single-drop'),
   *   overlap: 'pointer' || 'center' || zeroToOne
   * }
   * ```
   *
   * Returns or sets whether draggables can be dropped onto this target to
   * trigger drop events
   *
   * Dropzones can receive the following events:
   *  - `dropactivate` and `dropdeactivate` when an acceptable drag starts and ends
   *  - `dragenter` and `dragleave` when a draggable enters and leaves the dropzone
   *  - `dragmove` when a draggable that has entered the dropzone is moved
   *  - `drop` when a draggable is dropped into this dropzone
   *
   * Use the `accept` option to allow only elements that match the given CSS
   * selector or element. The value can be:
   *
   *  - **an Element** - only that element can be dropped into this dropzone.
   *  - **a string**, - the element being dragged must match it as a CSS selector.
   *  - **`null`** - accept options is cleared - it accepts any element.
   *
   * Use the `overlap` option to set how drops are checked for. The allowed
   * values are:
   *
   *   - `'pointer'`, the pointer must be over the dropzone (default)
   *   - `'center'`, the draggable element's center must be over the dropzone
   *   - a number from 0-1 which is the `(intersection area) / (draggable area)`.
   *   e.g. `0.5` for drop to happen when half of the area of the draggable is
   *   over the dropzone
   *
   * Use the `checker` option to specify a function to check if a dragged element
   * is over this Interactable.
   *
   * @param {boolean | object | null} [options] The new options to be set.
   * @return {boolean | Interactable} The current setting or this Interactable
   */

  Interactable.prototype.dropzone = function (options) {
    return dropzoneMethod(this, options);
  };
  /**
   * ```js
   * interact(target)
   * .dropChecker(function(dragEvent,         // related dragmove or dragend event
   *                       event,             // TouchEvent/PointerEvent/MouseEvent
   *                       dropped,           // bool result of the default checker
   *                       dropzone,          // dropzone Interactable
   *                       dropElement,       // dropzone elemnt
   *                       draggable,         // draggable Interactable
   *                       draggableElement) {// draggable element
   *
   *   return dropped && event.target.hasAttribute('allow-drop')
   * }
   * ```
   */


  Interactable.prototype.dropCheck = function (dragEvent, event, draggable, draggableElement, dropElement, rect) {
    return dropCheckMethod(this, dragEvent, event, draggable, draggableElement, dropElement, rect);
  };
  /**
   * Returns or sets whether the dimensions of dropzone elements are calculated
   * on every dragmove or only on dragstart for the default dropChecker
   *
   * @param {boolean} [newValue] True to check on each move. False to check only
   * before start
   * @return {boolean | interact} The current setting or interact
   */


  interact.dynamicDrop = function (newValue) {
    if (utils.is.bool(newValue)) {
      // if (dragging && scope.dynamicDrop !== newValue && !newValue) {
      //  calcRects(dropzones)
      // }
      scope.dynamicDrop = newValue;
      return interact;
    }

    return scope.dynamicDrop;
  };

  utils.arr.merge(actions.eventTypes, ['dragenter', 'dragleave', 'dropactivate', 'dropdeactivate', 'dropmove', 'drop']);
  actions.methodDict.drop = 'dropzone';
  scope.dynamicDrop = false;
  defaults.actions.drop = drop.defaults;
}

function collectDrops(_ref6, draggableElement) {
  var interactables = _ref6.interactables;
  var drops = []; // collect all dropzones and their elements which qualify for a drop

  for (var _i = 0; _i < interactables.list.length; _i++) {
    var _ref7;

    _ref7 = interactables.list[_i];
    var dropzone = _ref7;

    if (!dropzone.options.drop.enabled) {
      continue;
    }

    var accept = dropzone.options.drop.accept; // test the draggable draggableElement against the dropzone's accept setting

    if (utils.is.element(accept) && accept !== draggableElement || utils.is.string(accept) && !utils.dom.matchesSelector(draggableElement, accept) || utils.is.func(accept) && !accept({
      dropzone: dropzone,
      draggableElement: draggableElement
    })) {
      continue;
    } // query for new elements if necessary


    var dropElements = utils.is.string(dropzone.target) ? dropzone._context.querySelectorAll(dropzone.target) : utils.is.array(dropzone.target) ? dropzone.target : [dropzone.target];

    for (var _i2 = 0; _i2 < dropElements.length; _i2++) {
      var _ref8;

      _ref8 = dropElements[_i2];
      var dropzoneElement = _ref8;

      if (dropzoneElement !== draggableElement) {
        drops.push({
          dropzone: dropzone,
          element: dropzoneElement
        });
      }
    }
  }

  return drops;
}

function fireActivationEvents(activeDrops, event) {
  // loop through all active dropzones and trigger event
  for (var _i3 = 0; _i3 < activeDrops.length; _i3++) {
    var _ref9;

    _ref9 = activeDrops[_i3];
    var _ref10 = _ref9,
        dropzone = _ref10.dropzone,
        element = _ref10.element;
    event.dropzone = dropzone; // set current element as event target

    event.target = element;
    dropzone.fire(event);
    event.propagationStopped = event.immediatePropagationStopped = false;
  }
} // return a new array of possible drops. getActiveDrops should always be
// called when a drag has just started or a drag event happens while
// dynamicDrop is true


function getActiveDrops(scope, dragElement) {
  // get dropzones and their elements that could receive the draggable
  var activeDrops = collectDrops(scope, dragElement);

  for (var _i4 = 0; _i4 < activeDrops.length; _i4++) {
    var _ref11;

    _ref11 = activeDrops[_i4];
    var activeDrop = _ref11;
    activeDrop.rect = activeDrop.dropzone.getRect(activeDrop.element);
  }

  return activeDrops;
}

function getDrop(_ref12, dragEvent, pointerEvent) {
  var dropState = _ref12.dropState,
      draggable = _ref12.interactable,
      dragElement = _ref12.element;
  var validDrops = []; // collect all dropzones and their elements which qualify for a drop

  for (var _i5 = 0; _i5 < dropState.activeDrops.length; _i5++) {
    var _ref13;

    _ref13 = dropState.activeDrops[_i5];
    var _ref14 = _ref13,
        dropzone = _ref14.dropzone,
        dropzoneElement = _ref14.element,
        rect = _ref14.rect;
    validDrops.push(dropzone.dropCheck(dragEvent, pointerEvent, draggable, dragElement, dropzoneElement, rect) ? dropzoneElement : null);
  } // get the most appropriate dropzone based on DOM depth and order


  var dropIndex = utils.dom.indexOfDeepestElement(validDrops);
  return dropState.activeDrops[dropIndex] || null;
}

function getDropEvents(interaction, _pointerEvent, dragEvent) {
  var dropState = interaction.dropState;
  var dropEvents = {
    enter: null,
    leave: null,
    activate: null,
    deactivate: null,
    move: null,
    drop: null
  };

  if (dragEvent.type === 'dragstart') {
    dropEvents.activate = new _DropEvent["default"](dropState, dragEvent, 'dropactivate');
    dropEvents.activate.target = null;
    dropEvents.activate.dropzone = null;
  }

  if (dragEvent.type === 'dragend') {
    dropEvents.deactivate = new _DropEvent["default"](dropState, dragEvent, 'dropdeactivate');
    dropEvents.deactivate.target = null;
    dropEvents.deactivate.dropzone = null;
  }

  if (dropState.rejected) {
    return dropEvents;
  }

  if (dropState.cur.element !== dropState.prev.element) {
    // if there was a previous dropzone, create a dragleave event
    if (dropState.prev.dropzone) {
      dropEvents.leave = new _DropEvent["default"](dropState, dragEvent, 'dragleave');
      dragEvent.dragLeave = dropEvents.leave.target = dropState.prev.element;
      dragEvent.prevDropzone = dropEvents.leave.dropzone = dropState.prev.dropzone;
    } // if dropzone is not null, create a dragenter event


    if (dropState.cur.dropzone) {
      dropEvents.enter = new _DropEvent["default"](dropState, dragEvent, 'dragenter');
      dragEvent.dragEnter = dropState.cur.element;
      dragEvent.dropzone = dropState.cur.dropzone;
    }
  }

  if (dragEvent.type === 'dragend' && dropState.cur.dropzone) {
    dropEvents.drop = new _DropEvent["default"](dropState, dragEvent, 'drop');
    dragEvent.dropzone = dropState.cur.dropzone;
    dragEvent.relatedTarget = dropState.cur.element;
  }

  if (dragEvent.type === 'dragmove' && dropState.cur.dropzone) {
    dropEvents.move = new _DropEvent["default"](dropState, dragEvent, 'dropmove');
    dropEvents.move.dragmove = dragEvent;
    dragEvent.dropzone = dropState.cur.dropzone;
  }

  return dropEvents;
}

function fireDropEvents(interaction, events) {
  var dropState = interaction.dropState;
  var activeDrops = dropState.activeDrops,
      cur = dropState.cur,
      prev = dropState.prev;

  if (events.leave) {
    prev.dropzone.fire(events.leave);
  }

  if (events.move) {
    cur.dropzone.fire(events.move);
  }

  if (events.enter) {
    cur.dropzone.fire(events.enter);
  }

  if (events.drop) {
    cur.dropzone.fire(events.drop);
  }

  if (events.deactivate) {
    fireActivationEvents(activeDrops, events.deactivate);
  }

  dropState.prev.dropzone = cur.dropzone;
  dropState.prev.element = cur.element;
}

function onEventCreated(_ref15, scope) {
  var interaction = _ref15.interaction,
      iEvent = _ref15.iEvent,
      event = _ref15.event;

  if (iEvent.type !== 'dragmove' && iEvent.type !== 'dragend') {
    return;
  }

  var dropState = interaction.dropState;

  if (scope.dynamicDrop) {
    dropState.activeDrops = getActiveDrops(scope, interaction.element);
  }

  var dragEvent = iEvent;
  var dropResult = getDrop(interaction, dragEvent, event); // update rejected status

  dropState.rejected = dropState.rejected && !!dropResult && dropResult.dropzone === dropState.cur.dropzone && dropResult.element === dropState.cur.element;
  dropState.cur.dropzone = dropResult && dropResult.dropzone;
  dropState.cur.element = dropResult && dropResult.element;
  dropState.events = getDropEvents(interaction, event, dragEvent);
}

function dropzoneMethod(interactable, options) {
  if (utils.is.object(options)) {
    interactable.options.drop.enabled = options.enabled !== false;

    if (options.listeners) {
      var normalized = utils.normalizeListeners(options.listeners); // rename 'drop' to '' as it will be prefixed with 'drop'

      var corrected = Object.keys(normalized).reduce(function (acc, type) {
        var correctedType = /^(enter|leave)/.test(type) ? "drag".concat(type) : /^(activate|deactivate|move)/.test(type) ? "drop".concat(type) : type;
        acc[correctedType] = normalized[type];
        return acc;
      }, {});
      interactable.off(interactable.options.drop.listeners);
      interactable.on(corrected);
      interactable.options.drop.listeners = corrected;
    }

    if (utils.is.func(options.ondrop)) {
      interactable.on('drop', options.ondrop);
    }

    if (utils.is.func(options.ondropactivate)) {
      interactable.on('dropactivate', options.ondropactivate);
    }

    if (utils.is.func(options.ondropdeactivate)) {
      interactable.on('dropdeactivate', options.ondropdeactivate);
    }

    if (utils.is.func(options.ondragenter)) {
      interactable.on('dragenter', options.ondragenter);
    }

    if (utils.is.func(options.ondragleave)) {
      interactable.on('dragleave', options.ondragleave);
    }

    if (utils.is.func(options.ondropmove)) {
      interactable.on('dropmove', options.ondropmove);
    }

    if (/^(pointer|center)$/.test(options.overlap)) {
      interactable.options.drop.overlap = options.overlap;
    } else if (utils.is.number(options.overlap)) {
      interactable.options.drop.overlap = Math.max(Math.min(1, options.overlap), 0);
    }

    if ('accept' in options) {
      interactable.options.drop.accept = options.accept;
    }

    if ('checker' in options) {
      interactable.options.drop.checker = options.checker;
    }

    return interactable;
  }

  if (utils.is.bool(options)) {
    interactable.options.drop.enabled = options;
    return interactable;
  }

  return interactable.options.drop;
}

function dropCheckMethod(interactable, dragEvent, event, draggable, draggableElement, dropElement, rect) {
  var dropped = false; // if the dropzone has no rect (eg. display: none)
  // call the custom dropChecker or just return false

  if (!(rect = rect || interactable.getRect(dropElement))) {
    return interactable.options.drop.checker ? interactable.options.drop.checker(dragEvent, event, dropped, interactable, dropElement, draggable, draggableElement) : false;
  }

  var dropOverlap = interactable.options.drop.overlap;

  if (dropOverlap === 'pointer') {
    var origin = utils.getOriginXY(draggable, draggableElement, 'drag');
    var page = utils.pointer.getPageXY(dragEvent);
    page.x += origin.x;
    page.y += origin.y;
    var horizontal = page.x > rect.left && page.x < rect.right;
    var vertical = page.y > rect.top && page.y < rect.bottom;
    dropped = horizontal && vertical;
  }

  var dragRect = draggable.getRect(draggableElement);

  if (dragRect && dropOverlap === 'center') {
    var cx = dragRect.left + dragRect.width / 2;
    var cy = dragRect.top + dragRect.height / 2;
    dropped = cx >= rect.left && cx <= rect.right && cy >= rect.top && cy <= rect.bottom;
  }

  if (dragRect && utils.is.number(dropOverlap)) {
    var overlapArea = Math.max(0, Math.min(rect.right, dragRect.right) - Math.max(rect.left, dragRect.left)) * Math.max(0, Math.min(rect.bottom, dragRect.bottom) - Math.max(rect.top, dragRect.top));
    var overlapRatio = overlapArea / (dragRect.width * dragRect.height);
    dropped = overlapRatio >= dropOverlap;
  }

  if (interactable.options.drop.checker) {
    dropped = interactable.options.drop.checker(dragEvent, event, dropped, interactable, dropElement, draggable, draggableElement);
  }

  return dropped;
}

var drop = {
  id: 'actions/drop',
  install: install,
  getActiveDrops: getActiveDrops,
  getDrop: getDrop,
  getDropEvents: getDropEvents,
  fireDropEvents: fireDropEvents,
  defaults: {
    enabled: false,
    accept: null,
    overlap: 'pointer'
  }
};
var _default = drop;
exports["default"] = _default;

},{"../drag":1,"./DropEvent":2,"@interactjs/utils":55}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _InteractEvent = _interopRequireDefault(require("@interactjs/core/InteractEvent"));

var _scope = require("@interactjs/core/scope");

var utils = _interopRequireWildcard(require("@interactjs/utils"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_scope.ActionName.Gesture = 'gesture';

function install(scope) {
  var actions = scope.actions,
      Interactable = scope.Interactable,
      interactions = scope.interactions,
      defaults = scope.defaults;
  /**
   * ```js
   * interact(element).gesturable({
   *     onstart: function (event) {},
   *     onmove : function (event) {},
   *     onend  : function (event) {},
   *
   *     // limit multiple gestures.
   *     // See the explanation in {@link Interactable.draggable} example
   *     max: Infinity,
   *     maxPerElement: 1,
   * })
   *
   * var isGestureable = interact(element).gesturable()
   * ```
   *
   * Gets or sets whether multitouch gestures can be performed on the target
   *
   * @param {boolean | object} [options] true/false or An object with event
   * listeners to be fired on gesture events (makes the Interactable gesturable)
   * @return {boolean | Interactable} A boolean indicating if this can be the
   * target of gesture events, or this Interactable
   */

  Interactable.prototype.gesturable = function (options) {
    if (utils.is.object(options)) {
      this.options.gesture.enabled = options.enabled !== false;
      this.setPerAction('gesture', options);
      this.setOnEvents('gesture', options);
      return this;
    }

    if (utils.is.bool(options)) {
      this.options.gesture.enabled = options;
      return this;
    }

    return this.options.gesture;
  };

  interactions.signals.on('action-start', updateGestureProps);
  interactions.signals.on('action-move', updateGestureProps);
  interactions.signals.on('action-end', updateGestureProps);
  interactions.signals.on('new', function (_ref) {
    var interaction = _ref.interaction;
    interaction.gesture = {
      angle: 0,
      distance: 0,
      scale: 1,
      startAngle: 0,
      startDistance: 0
    };
  });
  actions[_scope.ActionName.Gesture] = gesture;
  actions.names.push(_scope.ActionName.Gesture);
  utils.arr.merge(actions.eventTypes, ['gesturestart', 'gesturemove', 'gestureend']);
  actions.methodDict.gesture = 'gesturable';
  defaults.actions.gesture = gesture.defaults;
}

var gesture = {
  id: 'actions/gesture',
  install: install,
  defaults: {},
  checker: function checker(_pointer, _event, _interactable, _element, interaction) {
    if (interaction.pointers.length >= 2) {
      return {
        name: 'gesture'
      };
    }

    return null;
  },
  getCursor: function getCursor() {
    return '';
  }
};

function updateGestureProps(_ref2) {
  var interaction = _ref2.interaction,
      iEvent = _ref2.iEvent,
      event = _ref2.event,
      phase = _ref2.phase;

  if (interaction.prepared.name !== 'gesture') {
    return;
  }

  var pointers = interaction.pointers.map(function (p) {
    return p.pointer;
  });
  var starting = phase === 'start';
  var ending = phase === 'end';
  var deltaSource = interaction.interactable.options.deltaSource;
  iEvent.touches = [pointers[0], pointers[1]];

  if (starting) {
    iEvent.distance = utils.pointer.touchDistance(pointers, deltaSource);
    iEvent.box = utils.pointer.touchBBox(pointers);
    iEvent.scale = 1;
    iEvent.ds = 0;
    iEvent.angle = utils.pointer.touchAngle(pointers, deltaSource);
    iEvent.da = 0;
    interaction.gesture.startDistance = iEvent.distance;
    interaction.gesture.startAngle = iEvent.angle;
  } else if (ending || event instanceof _InteractEvent["default"]) {
    var prevEvent = interaction.prevEvent;
    iEvent.distance = prevEvent.distance;
    iEvent.box = prevEvent.box;
    iEvent.scale = prevEvent.scale;
    iEvent.ds = 0;
    iEvent.angle = prevEvent.angle;
    iEvent.da = 0;
  } else {
    iEvent.distance = utils.pointer.touchDistance(pointers, deltaSource);
    iEvent.box = utils.pointer.touchBBox(pointers);
    iEvent.scale = iEvent.distance / interaction.gesture.startDistance;
    iEvent.angle = utils.pointer.touchAngle(pointers, deltaSource);
    iEvent.ds = iEvent.scale - interaction.gesture.scale;
    iEvent.da = iEvent.angle - interaction.gesture.angle;
  }

  interaction.gesture.distance = iEvent.distance;
  interaction.gesture.angle = iEvent.angle;

  if (utils.is.number(iEvent.scale) && iEvent.scale !== Infinity && !isNaN(iEvent.scale)) {
    interaction.gesture.scale = iEvent.scale;
  }
}

var _default = gesture;
exports["default"] = _default;

},{"@interactjs/core/InteractEvent":15,"@interactjs/core/scope":24,"@interactjs/utils":55}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.install = install;
Object.defineProperty(exports, "drag", {
  enumerable: true,
  get: function get() {
    return _drag["default"];
  }
});
Object.defineProperty(exports, "drop", {
  enumerable: true,
  get: function get() {
    return _drop["default"];
  }
});
Object.defineProperty(exports, "gesture", {
  enumerable: true,
  get: function get() {
    return _gesture["default"];
  }
});
Object.defineProperty(exports, "resize", {
  enumerable: true,
  get: function get() {
    return _resize["default"];
  }
});
exports.id = void 0;

var _drag = _interopRequireDefault(require("./drag"));

var _drop = _interopRequireDefault(require("./drop"));

var _gesture = _interopRequireDefault(require("./gesture"));

var _resize = _interopRequireDefault(require("./resize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function install(scope) {
  scope.usePlugin(_gesture["default"]);
  scope.usePlugin(_resize["default"]);
  scope.usePlugin(_drag["default"]);
  scope.usePlugin(_drop["default"]);
}

var id = 'actions';
exports.id = id;

},{"./drag":1,"./drop":3,"./gesture":4,"./resize":6}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _scope = require("@interactjs/core/scope");

var utils = _interopRequireWildcard(require("@interactjs/utils"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

_scope.ActionName.Resize = 'resize';

function install(scope) {
  var actions = scope.actions,
      browser = scope.browser,
      Interactable = scope.Interactable,
      interactions = scope.interactions,
      defaults = scope.defaults; // Less Precision with touch input

  interactions.signals.on('new', function (interaction) {
    interaction.resizeAxes = 'xy';
  });
  interactions.signals.on('action-start', start);
  interactions.signals.on('action-move', move);
  interactions.signals.on('action-start', updateEventAxes);
  interactions.signals.on('action-move', updateEventAxes);
  resize.cursors = initCursors(browser);
  resize.defaultMargin = browser.supportsTouch || browser.supportsPointerEvent ? 20 : 10;
  /**
   * ```js
   * interact(element).resizable({
   *   onstart: function (event) {},
   *   onmove : function (event) {},
   *   onend  : function (event) {},
   *
   *   edges: {
   *     top   : true,       // Use pointer coords to check for resize.
   *     left  : false,      // Disable resizing from left edge.
   *     bottom: '.resize-s',// Resize if pointer target matches selector
   *     right : handleEl    // Resize if pointer target is the given Element
   *   },
   *
   *     // Width and height can be adjusted independently. When `true`, width and
   *     // height are adjusted at a 1:1 ratio.
   *     square: false,
   *
   *     // Width and height can be adjusted independently. When `true`, width and
   *     // height maintain the aspect ratio they had when resizing started.
   *     preserveAspectRatio: false,
   *
   *   // a value of 'none' will limit the resize rect to a minimum of 0x0
   *   // 'negate' will allow the rect to have negative width/height
   *   // 'reposition' will keep the width/height positive by swapping
   *   // the top and bottom edges and/or swapping the left and right edges
   *   invert: 'none' || 'negate' || 'reposition'
   *
   *   // limit multiple resizes.
   *   // See the explanation in the {@link Interactable.draggable} example
   *   max: Infinity,
   *   maxPerElement: 1,
   * })
   *
   * var isResizeable = interact(element).resizable()
   * ```
   *
   * Gets or sets whether resize actions can be performed on the target
   *
   * @param {boolean | object} [options] true/false or An object with event
   * listeners to be fired on resize events (object makes the Interactable
   * resizable)
   * @return {boolean | Interactable} A boolean indicating if this can be the
   * target of resize elements, or this Interactable
   */

  Interactable.prototype.resizable = function (options) {
    return resizable(this, options, scope);
  };

  actions[_scope.ActionName.Resize] = resize;
  actions.names.push(_scope.ActionName.Resize);
  utils.arr.merge(actions.eventTypes, ['resizestart', 'resizemove', 'resizeinertiastart', 'resizeresume', 'resizeend']);
  actions.methodDict.resize = 'resizable';
  defaults.actions.resize = resize.defaults;
}

var resize = {
  id: 'actions/resize',
  install: install,
  defaults: {
    square: false,
    preserveAspectRatio: false,
    axis: 'xy',
    // use default margin
    margin: NaN,
    // object with props left, right, top, bottom which are
    // true/false values to resize when the pointer is over that edge,
    // CSS selectors to match the handles for each direction
    // or the Elements for each handle
    edges: null,
    // a value of 'none' will limit the resize rect to a minimum of 0x0
    // 'negate' will alow the rect to have negative width/height
    // 'reposition' will keep the width/height positive by swapping
    // the top and bottom edges and/or swapping the left and right edges
    invert: 'none'
  },
  checker: function checker(_pointer, _event, interactable, element, interaction, rect) {
    if (!rect) {
      return null;
    }

    var page = utils.extend({}, interaction.coords.cur.page);
    var options = interactable.options;

    if (options.resize.enabled) {
      var resizeOptions = options.resize;
      var resizeEdges = {
        left: false,
        right: false,
        top: false,
        bottom: false
      }; // if using resize.edges

      if (utils.is.object(resizeOptions.edges)) {
        for (var edge in resizeEdges) {
          resizeEdges[edge] = checkResizeEdge(edge, resizeOptions.edges[edge], page, interaction._latestPointer.eventTarget, element, rect, resizeOptions.margin || this.defaultMargin);
        }

        resizeEdges.left = resizeEdges.left && !resizeEdges.right;
        resizeEdges.top = resizeEdges.top && !resizeEdges.bottom;

        if (resizeEdges.left || resizeEdges.right || resizeEdges.top || resizeEdges.bottom) {
          return {
            name: 'resize',
            edges: resizeEdges
          };
        }
      } else {
        var right = options.resize.axis !== 'y' && page.x > rect.right - this.defaultMargin;
        var bottom = options.resize.axis !== 'x' && page.y > rect.bottom - this.defaultMargin;

        if (right || bottom) {
          return {
            name: 'resize',
            axes: (right ? 'x' : '') + (bottom ? 'y' : '')
          };
        }
      }
    }

    return null;
  },
  cursors: null,
  getCursor: function getCursor(action) {
    var cursors = resize.cursors;

    if (action.axis) {
      return cursors[action.name + action.axis];
    } else if (action.edges) {
      var cursorKey = '';
      var edgeNames = ['top', 'bottom', 'left', 'right'];

      for (var i = 0; i < 4; i++) {
        if (action.edges[edgeNames[i]]) {
          cursorKey += edgeNames[i];
        }
      }

      return cursors[cursorKey];
    }

    return null;
  },
  defaultMargin: null
};

function resizable(interactable, options, scope) {
  if (utils.is.object(options)) {
    interactable.options.resize.enabled = options.enabled !== false;
    interactable.setPerAction('resize', options);
    interactable.setOnEvents('resize', options);

    if (utils.is.string(options.axis) && /^x$|^y$|^xy$/.test(options.axis)) {
      interactable.options.resize.axis = options.axis;
    } else if (options.axis === null) {
      interactable.options.resize.axis = scope.defaults.actions.resize.axis;
    }

    if (utils.is.bool(options.preserveAspectRatio)) {
      interactable.options.resize.preserveAspectRatio = options.preserveAspectRatio;
    } else if (utils.is.bool(options.square)) {
      interactable.options.resize.square = options.square;
    }

    return interactable;
  }

  if (utils.is.bool(options)) {
    interactable.options.resize.enabled = options;
    return interactable;
  }

  return interactable.options.resize;
}

function checkResizeEdge(name, value, page, element, interactableElement, rect, margin) {
  // false, '', undefined, null
  if (!value) {
    return false;
  } // true value, use pointer coords and element rect


  if (value === true) {
    // if dimensions are negative, "switch" edges
    var width = utils.is.number(rect.width) ? rect.width : rect.right - rect.left;
    var height = utils.is.number(rect.height) ? rect.height : rect.bottom - rect.top; // don't use margin greater than half the relevent dimension

    margin = Math.min(margin, (name === 'left' || name === 'right' ? width : height) / 2);

    if (width < 0) {
      if (name === 'left') {
        name = 'right';
      } else if (name === 'right') {
        name = 'left';
      }
    }

    if (height < 0) {
      if (name === 'top') {
        name = 'bottom';
      } else if (name === 'bottom') {
        name = 'top';
      }
    }

    if (name === 'left') {
      return page.x < (width >= 0 ? rect.left : rect.right) + margin;
    }

    if (name === 'top') {
      return page.y < (height >= 0 ? rect.top : rect.bottom) + margin;
    }

    if (name === 'right') {
      return page.x > (width >= 0 ? rect.right : rect.left) - margin;
    }

    if (name === 'bottom') {
      return page.y > (height >= 0 ? rect.bottom : rect.top) - margin;
    }
  } // the remaining checks require an element


  if (!utils.is.element(element)) {
    return false;
  }

  return utils.is.element(value) // the value is an element to use as a resize handle
  ? value === element // otherwise check if element matches value as selector
  : utils.dom.matchesUpTo(element, value, interactableElement);
}

function initCursors(browser) {
  return browser.isIe9 ? {
    x: 'e-resize',
    y: 's-resize',
    xy: 'se-resize',
    top: 'n-resize',
    left: 'w-resize',
    bottom: 's-resize',
    right: 'e-resize',
    topleft: 'se-resize',
    bottomright: 'se-resize',
    topright: 'ne-resize',
    bottomleft: 'ne-resize'
  } : {
    x: 'ew-resize',
    y: 'ns-resize',
    xy: 'nwse-resize',
    top: 'ns-resize',
    left: 'ew-resize',
    bottom: 'ns-resize',
    right: 'ew-resize',
    topleft: 'nwse-resize',
    bottomright: 'nwse-resize',
    topright: 'nesw-resize',
    bottomleft: 'nesw-resize'
  };
}

function start(_ref) {
  var iEvent = _ref.iEvent,
      interaction = _ref.interaction;

  if (interaction.prepared.name !== 'resize' || !interaction.prepared.edges) {
    return;
  }

  var startRect = interaction.rect;
  var resizeOptions = interaction.interactable.options.resize;
  /*
   * When using the `resizable.square` or `resizable.preserveAspectRatio` options, resizing from one edge
   * will affect another. E.g. with `resizable.square`, resizing to make the right edge larger will make
   * the bottom edge larger by the same amount. We call these 'linked' edges. Any linked edges will depend
   * on the active edges and the edge being interacted with.
   */

  if (resizeOptions.square || resizeOptions.preserveAspectRatio) {
    var linkedEdges = utils.extend({}, interaction.prepared.edges);
    linkedEdges.top = linkedEdges.top || linkedEdges.left && !linkedEdges.bottom;
    linkedEdges.left = linkedEdges.left || linkedEdges.top && !linkedEdges.right;
    linkedEdges.bottom = linkedEdges.bottom || linkedEdges.right && !linkedEdges.top;
    linkedEdges.right = linkedEdges.right || linkedEdges.bottom && !linkedEdges.left;
    interaction.prepared._linkedEdges = linkedEdges;
  } else {
    interaction.prepared._linkedEdges = null;
  } // if using `resizable.preserveAspectRatio` option, record aspect ratio at the start of the resize


  if (resizeOptions.preserveAspectRatio) {
    interaction.resizeStartAspectRatio = startRect.width / startRect.height;
  }

  interaction.resizeRects = {
    start: startRect,
    current: utils.extend({}, startRect),
    inverted: utils.extend({}, startRect),
    previous: utils.extend({}, startRect),
    delta: {
      left: 0,
      right: 0,
      width: 0,
      top: 0,
      bottom: 0,
      height: 0
    }
  };
  iEvent.rect = interaction.resizeRects.inverted;
  iEvent.deltaRect = interaction.resizeRects.delta;
}

function move(_ref2) {
  var iEvent = _ref2.iEvent,
      interaction = _ref2.interaction;

  if (interaction.prepared.name !== 'resize' || !interaction.prepared.edges) {
    return;
  }

  var resizeOptions = interaction.interactable.options.resize;
  var invert = resizeOptions.invert;
  var invertible = invert === 'reposition' || invert === 'negate';
  var edges = interaction.prepared.edges; // eslint-disable-next-line no-shadow

  var start = interaction.resizeRects.start;
  var current = interaction.resizeRects.current;
  var inverted = interaction.resizeRects.inverted;
  var deltaRect = interaction.resizeRects.delta;
  var previous = utils.extend(interaction.resizeRects.previous, inverted);
  var originalEdges = edges;
  var eventDelta = utils.extend({}, iEvent.delta);

  if (resizeOptions.preserveAspectRatio || resizeOptions.square) {
    // `resize.preserveAspectRatio` takes precedence over `resize.square`
    var startAspectRatio = resizeOptions.preserveAspectRatio ? interaction.resizeStartAspectRatio : 1;
    edges = interaction.prepared._linkedEdges;

    if (originalEdges.left && originalEdges.bottom || originalEdges.right && originalEdges.top) {
      eventDelta.y = -eventDelta.x / startAspectRatio;
    } else if (originalEdges.left || originalEdges.right) {
      eventDelta.y = eventDelta.x / startAspectRatio;
    } else if (originalEdges.top || originalEdges.bottom) {
      eventDelta.x = eventDelta.y * startAspectRatio;
    }
  } // update the 'current' rect without modifications


  if (edges.top) {
    current.top += eventDelta.y;
  }

  if (edges.bottom) {
    current.bottom += eventDelta.y;
  }

  if (edges.left) {
    current.left += eventDelta.x;
  }

  if (edges.right) {
    current.right += eventDelta.x;
  }

  if (invertible) {
    // if invertible, copy the current rect
    utils.extend(inverted, current);

    if (invert === 'reposition') {
      // swap edge values if necessary to keep width/height positive
      var swap;

      if (inverted.top > inverted.bottom) {
        swap = inverted.top;
        inverted.top = inverted.bottom;
        inverted.bottom = swap;
      }

      if (inverted.left > inverted.right) {
        swap = inverted.left;
        inverted.left = inverted.right;
        inverted.right = swap;
      }
    }
  } else {
    // if not invertible, restrict to minimum of 0x0 rect
    inverted.top = Math.min(current.top, start.bottom);
    inverted.bottom = Math.max(current.bottom, start.top);
    inverted.left = Math.min(current.left, start.right);
    inverted.right = Math.max(current.right, start.left);
  }

  inverted.width = inverted.right - inverted.left;
  inverted.height = inverted.bottom - inverted.top;

  for (var edge in inverted) {
    deltaRect[edge] = inverted[edge] - previous[edge];
  }

  iEvent.edges = interaction.prepared.edges;
  iEvent.rect = inverted;
  iEvent.deltaRect = deltaRect;
}

function updateEventAxes(_ref3) {
  var interaction = _ref3.interaction,
      iEvent = _ref3.iEvent,
      action = _ref3.action;

  if (action !== 'resize' || !interaction.resizeAxes) {
    return;
  }

  var options = interaction.interactable.options;

  if (options.resize.square) {
    if (interaction.resizeAxes === 'y') {
      iEvent.delta.x = iEvent.delta.y;
    } else {
      iEvent.delta.y = iEvent.delta.x;
    }

    iEvent.axes = 'xy';
  } else {
    iEvent.axes = interaction.resizeAxes;

    if (interaction.resizeAxes === 'x') {
      iEvent.delta.y = 0;
    } else if (interaction.resizeAxes === 'y') {
      iEvent.delta.x = 0;
    }
  }
}

var _default = resize;
exports["default"] = _default;

},{"@interactjs/core/scope":24,"@interactjs/utils":55}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getContainer = getContainer;
exports.getScroll = getScroll;
exports.getScrollSize = getScrollSize;
exports.getScrollSizeDelta = getScrollSizeDelta;
exports["default"] = void 0;

var domUtils = _interopRequireWildcard(require("@interactjs/utils/domUtils"));

var is = _interopRequireWildcard(require("@interactjs/utils/is"));

var _raf = _interopRequireDefault(require("@interactjs/utils/raf"));

var _rect = require("@interactjs/utils/rect");

var _window = require("@interactjs/utils/window");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function install(scope) {
  var interactions = scope.interactions,
      defaults = scope.defaults,
      actions = scope.actions;
  scope.autoScroll = autoScroll;

  autoScroll.now = function () {
    return scope.now();
  };

  interactions.signals.on('new', function (_ref) {
    var interaction = _ref.interaction;
    interaction.autoScroll = null;
  });
  interactions.signals.on('stop', autoScroll.stop);
  interactions.signals.on('action-move', function (arg) {
    return autoScroll.onInteractionMove(arg);
  });
  actions.eventTypes.push('autoscroll');
  defaults.perAction.autoScroll = autoScroll.defaults;
}

var autoScroll = {
  defaults: {
    enabled: false,
    margin: 60,
    // the item that is scrolled (Window or HTMLElement)
    container: null,
    // the scroll speed in pixels per second
    speed: 300
  },
  now: Date.now,
  interaction: null,
  i: null,
  x: 0,
  y: 0,
  isScrolling: false,
  prevTime: 0,
  margin: 0,
  speed: 0,
  start: function start(interaction) {
    autoScroll.isScrolling = true;

    _raf["default"].cancel(autoScroll.i);

    interaction.autoScroll = autoScroll;
    autoScroll.interaction = interaction;
    autoScroll.prevTime = autoScroll.now();
    autoScroll.i = _raf["default"].request(autoScroll.scroll);
  },
  stop: function stop() {
    autoScroll.isScrolling = false;

    if (autoScroll.interaction) {
      autoScroll.interaction.autoScroll = null;
    }

    _raf["default"].cancel(autoScroll.i);
  },
  // scroll the window by the values in scroll.x/y
  scroll: function scroll() {
    var interaction = autoScroll.interaction;
    var interactable = interaction.interactable,
        element = interaction.element;
    var options = interactable.options[autoScroll.interaction.prepared.name].autoScroll;
    var container = getContainer(options.container, interactable, element);
    var now = autoScroll.now(); // change in time in seconds

    var dt = (now - autoScroll.prevTime) / 1000; // displacement

    var s = options.speed * dt;

    if (s >= 1) {
      var scrollBy = {
        x: autoScroll.x * s,
        y: autoScroll.y * s
      };

      if (scrollBy.x || scrollBy.y) {
        var prevScroll = getScroll(container);

        if (is.window(container)) {
          container.scrollBy(scrollBy.x, scrollBy.y);
        } else if (container) {
          container.scrollLeft += scrollBy.x;
          container.scrollTop += scrollBy.y;
        }

        var curScroll = getScroll(container);
        var delta = {
          x: curScroll.x - prevScroll.x,
          y: curScroll.y - prevScroll.y
        };

        if (delta.x || delta.y) {
          interactable.fire({
            type: 'autoscroll',
            target: element,
            interactable: interactable,
            delta: delta,
            interaction: interaction,
            container: container
          });
        }
      }

      autoScroll.prevTime = now;
    }

    if (autoScroll.isScrolling) {
      _raf["default"].cancel(autoScroll.i);

      autoScroll.i = _raf["default"].request(autoScroll.scroll);
    }
  },
  check: function check(interactable, actionName) {
    var options = interactable.options;
    return options[actionName].autoScroll && options[actionName].autoScroll.enabled;
  },
  onInteractionMove: function onInteractionMove(_ref2) {
    var interaction = _ref2.interaction,
        pointer = _ref2.pointer;

    if (!(interaction.interacting() && autoScroll.check(interaction.interactable, interaction.prepared.name))) {
      return;
    }

    if (interaction.simulation) {
      autoScroll.x = autoScroll.y = 0;
      return;
    }

    var top;
    var right;
    var bottom;
    var left;
    var interactable = interaction.interactable,
        element = interaction.element;
    var options = interactable.options[interaction.prepared.name].autoScroll;
    var container = getContainer(options.container, interactable, element);

    if (is.window(container)) {
      left = pointer.clientX < autoScroll.margin;
      top = pointer.clientY < autoScroll.margin;
      right = pointer.clientX > container.innerWidth - autoScroll.margin;
      bottom = pointer.clientY > container.innerHeight - autoScroll.margin;
    } else {
      var rect = domUtils.getElementClientRect(container);
      left = pointer.clientX < rect.left + autoScroll.margin;
      top = pointer.clientY < rect.top + autoScroll.margin;
      right = pointer.clientX > rect.right - autoScroll.margin;
      bottom = pointer.clientY > rect.bottom - autoScroll.margin;
    }

    autoScroll.x = right ? 1 : left ? -1 : 0;
    autoScroll.y = bottom ? 1 : top ? -1 : 0;

    if (!autoScroll.isScrolling) {
      // set the autoScroll properties to those of the target
      autoScroll.margin = options.margin;
      autoScroll.speed = options.speed;
      autoScroll.start(interaction);
    }
  }
};

function getContainer(value, interactable, element) {
  return (is.string(value) ? (0, _rect.getStringOptionResult)(value, interactable, element) : value) || (0, _window.getWindow)(element);
}

function getScroll(container) {
  if (is.window(container)) {
    container = window.document.body;
  }

  return {
    x: container.scrollLeft,
    y: container.scrollTop
  };
}

function getScrollSize(container) {
  if (is.window(container)) {
    container = window.document.body;
  }

  return {
    x: container.scrollWidth,
    y: container.scrollHeight
  };
}

function getScrollSizeDelta(_ref3, func) {
  var interaction = _ref3.interaction,
      element = _ref3.element;
  var scrollOptions = interaction && interaction.interactable.options[interaction.prepared.name].autoScroll;

  if (!scrollOptions || !scrollOptions.enabled) {
    func();
    return {
      x: 0,
      y: 0
    };
  }

  var scrollContainer = getContainer(scrollOptions.container, interaction.interactable, element);
  var prevSize = getScroll(scrollContainer);
  func();
  var curSize = getScroll(scrollContainer);
  return {
    x: curSize.x - prevSize.x,
    y: curSize.y - prevSize.y
  };
}

var _default = {
  id: 'auto-scroll',
  install: install
};
exports["default"] = _default;

},{"@interactjs/utils/domUtils":50,"@interactjs/utils/is":56,"@interactjs/utils/raf":61,"@interactjs/utils/rect":62,"@interactjs/utils/window":65}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _utils = require("@interactjs/utils");

var is = _interopRequireWildcard(require("@interactjs/utils/is"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function install(scope) {
  var Interactable = scope.Interactable,
      actions = scope.actions;
  Interactable.prototype.getAction = getAction;
  /**
   * ```js
   * interact(element, { ignoreFrom: document.getElementById('no-action') })
   * // or
   * interact(element).ignoreFrom('input, textarea, a')
   * ```
   * @deprecated
   * If the target of the `mousedown`, `pointerdown` or `touchstart` event or any
   * of it's parents match the given CSS selector or Element, no
   * drag/resize/gesture is started.
   *
   * Don't use this method. Instead set the `ignoreFrom` option for each action
   * or for `pointerEvents`
   *
   * @example
   * interact(targett)
   *   .draggable({
   *     ignoreFrom: 'input, textarea, a[href]'',
   *   })
   *   .pointerEvents({
   *     ignoreFrom: '[no-pointer]',
   *   })
   *
   * @param {string | Element | null} [newValue] a CSS selector string, an
   * Element or `null` to not ignore any elements
   * @return {string | Element | object} The current ignoreFrom value or this
   * Interactable
   */

  Interactable.prototype.ignoreFrom = (0, _utils.warnOnce)(function (newValue) {
    return this._backCompatOption('ignoreFrom', newValue);
  }, 'Interactable.ignoreFrom() has been deprecated. Use Interactble.draggable({ignoreFrom: newValue}).');
  /**
   * @deprecated
   *
   * A drag/resize/gesture is started only If the target of the `mousedown`,
   * `pointerdown` or `touchstart` event or any of it's parents match the given
   * CSS selector or Element.
   *
   * Don't use this method. Instead set the `allowFrom` option for each action
   * or for `pointerEvents`
   *
   * @example
   * interact(targett)
   *   .resizable({
   *     allowFrom: '.resize-handle',
   *   .pointerEvents({
   *     allowFrom: '.handle',,
   *   })
   *
   * @param {string | Element | null} [newValue] a CSS selector string, an
   * Element or `null` to allow from any element
   * @return {string | Element | object} The current allowFrom value or this
   * Interactable
   */

  Interactable.prototype.allowFrom = (0, _utils.warnOnce)(function (newValue) {
    return this._backCompatOption('allowFrom', newValue);
  }, 'Interactable.allowFrom() has been deprecated. Use Interactble.draggable({allowFrom: newValue}).');
  /**
   * ```js
   * interact('.resize-drag')
   *   .resizable(true)
   *   .draggable(true)
   *   .actionChecker(function (pointer, event, action, interactable, element, interaction) {
   *
   *   if (interact.matchesSelector(event.target, '.drag-handle') {
   *     // force drag with handle target
   *     action.name = drag
   *   }
   *   else {
   *     // resize from the top and right edges
   *     action.name  = 'resize'
   *     action.edges = { top: true, right: true }
   *   }
   *
   *   return action
   * })
   * ```
   *
   * Gets or sets the function used to check action to be performed on
   * pointerDown
   *
   * @param {function | null} [checker] A function which takes a pointer event,
   * defaultAction string, interactable, element and interaction as parameters
   * and returns an object with name property 'drag' 'resize' or 'gesture' and
   * optionally an `edges` object with boolean 'top', 'left', 'bottom' and right
   * props.
   * @return {Function | Interactable} The checker function or this Interactable
   */

  Interactable.prototype.actionChecker = actionChecker;
  /**
   * Returns or sets whether the the cursor should be changed depending on the
   * action that would be performed if the mouse were pressed and dragged.
   *
   * @param {boolean} [newValue]
   * @return {boolean | Interactable} The current setting or this Interactable
   */

  Interactable.prototype.styleCursor = styleCursor;

  Interactable.prototype.defaultActionChecker = function (pointer, event, interaction, element) {
    return defaultActionChecker(this, pointer, event, interaction, element, actions);
  };
}

function getAction(pointer, event, interaction, element) {
  var action = this.defaultActionChecker(pointer, event, interaction, element);

  if (this.options.actionChecker) {
    return this.options.actionChecker(pointer, event, action, this, element, interaction);
  }

  return action;
}

function defaultActionChecker(interactable, pointer, event, interaction, element, actions) {
  var rect = interactable.getRect(element);
  var buttons = event.buttons || {
    0: 1,
    1: 4,
    3: 8,
    4: 16
  }[event.button];
  var action = null;

  for (var _i = 0; _i < actions.names.length; _i++) {
    var _ref;

    _ref = actions.names[_i];
    var actionName = _ref;

    // check mouseButton setting if the pointer is down
    if (interaction.pointerIsDown && /mouse|pointer/.test(interaction.pointerType) && (buttons & interactable.options[actionName].mouseButtons) === 0) {
      continue;
    }

    action = actions[actionName].checker(pointer, event, interactable, element, interaction, rect);

    if (action) {
      return action;
    }
  }
}

function styleCursor(newValue) {
  if (is.bool(newValue)) {
    this.options.styleCursor = newValue;
    return this;
  }

  if (newValue === null) {
    delete this.options.styleCursor;
    return this;
  }

  return this.options.styleCursor;
}

function actionChecker(checker) {
  if (is.func(checker)) {
    this.options.actionChecker = checker;
    return this;
  }

  if (checker === null) {
    delete this.options.actionChecker;
    return this;
  }

  return this.options.actionChecker;
}

var _default = {
  id: 'auto-start/interactableMethods',
  install: install
};
exports["default"] = _default;

},{"@interactjs/utils":55,"@interactjs/utils/is":56}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var utils = _interopRequireWildcard(require("@interactjs/utils"));

var _InteractableMethods = _interopRequireDefault(require("./InteractableMethods"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function install(scope) {
  var interact = scope.interact,
      interactions = scope.interactions,
      defaults = scope.defaults;
  scope.usePlugin(_InteractableMethods["default"]); // set cursor style on mousedown

  interactions.signals.on('down', function (_ref) {
    var interaction = _ref.interaction,
        pointer = _ref.pointer,
        event = _ref.event,
        eventTarget = _ref.eventTarget;

    if (interaction.interacting()) {
      return;
    }

    var actionInfo = getActionInfo(interaction, pointer, event, eventTarget, scope);
    prepare(interaction, actionInfo, scope);
  }); // set cursor style on mousemove

  interactions.signals.on('move', function (_ref2) {
    var interaction = _ref2.interaction,
        pointer = _ref2.pointer,
        event = _ref2.event,
        eventTarget = _ref2.eventTarget;

    if (interaction.pointerType !== 'mouse' || interaction.pointerIsDown || interaction.interacting()) {
      return;
    }

    var actionInfo = getActionInfo(interaction, pointer, event, eventTarget, scope);
    prepare(interaction, actionInfo, scope);
  });
  interactions.signals.on('move', function (arg) {
    var interaction = arg.interaction;

    if (!interaction.pointerIsDown || interaction.interacting() || !interaction.pointerWasMoved || !interaction.prepared.name) {
      return;
    }

    scope.autoStart.signals.fire('before-start', arg);
    var interactable = interaction.interactable;

    if (interaction.prepared.name && interactable) {
      // check manualStart and interaction limit
      if (interactable.options[interaction.prepared.name].manualStart || !withinInteractionLimit(interactable, interaction.element, interaction.prepared, scope)) {
        interaction.stop();
      } else {
        interaction.start(interaction.prepared, interactable, interaction.element);
      }
    }
  });
  interactions.signals.on('stop', function (_ref3) {
    var interaction = _ref3.interaction;
    var interactable = interaction.interactable;

    if (interactable && interactable.options.styleCursor) {
      setCursor(interaction.element, '', scope);
    }
  });
  defaults.base.actionChecker = null;
  defaults.base.styleCursor = true;
  utils.extend(defaults.perAction, {
    manualStart: false,
    max: Infinity,
    maxPerElement: 1,
    allowFrom: null,
    ignoreFrom: null,
    // only allow left button by default
    // see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons#Return_value
    mouseButtons: 1
  });
  /**
   * Returns or sets the maximum number of concurrent interactions allowed.  By
   * default only 1 interaction is allowed at a time (for backwards
   * compatibility). To allow multiple interactions on the same Interactables and
   * elements, you need to enable it in the draggable, resizable and gesturable
   * `'max'` and `'maxPerElement'` options.
   *
   * @alias module:interact.maxInteractions
   *
   * @param {number} [newValue] Any number. newValue <= 0 means no interactions.
   */

  interact.maxInteractions = function (newValue) {
    return maxInteractions(newValue, scope);
  };

  scope.autoStart = {
    // Allow this many interactions to happen simultaneously
    maxInteractions: Infinity,
    withinInteractionLimit: withinInteractionLimit,
    cursorElement: null,
    signals: new utils.Signals()
  };
} // Check if the current interactable supports the action.
// If so, return the validated action. Otherwise, return null


function validateAction(action, interactable, element, eventTarget, scope) {
  if (interactable.testIgnoreAllow(interactable.options[action.name], element, eventTarget) && interactable.options[action.name].enabled && withinInteractionLimit(interactable, element, action, scope)) {
    return action;
  }

  return null;
}

function validateMatches(interaction, pointer, event, matches, matchElements, eventTarget, scope) {
  for (var i = 0, len = matches.length; i < len; i++) {
    var match = matches[i];
    var matchElement = matchElements[i];
    var matchAction = match.getAction(pointer, event, interaction, matchElement);

    if (!matchAction) {
      continue;
    }

    var action = validateAction(matchAction, match, matchElement, eventTarget, scope);

    if (action) {
      return {
        action: action,
        interactable: match,
        element: matchElement
      };
    }
  }

  return {
    action: null,
    interactable: null,
    element: null
  };
}

function getActionInfo(interaction, pointer, event, eventTarget, scope) {
  var matches = [];
  var matchElements = [];
  var element = eventTarget;

  function pushMatches(interactable) {
    matches.push(interactable);
    matchElements.push(element);
  }

  while (utils.is.element(element)) {
    matches = [];
    matchElements = [];
    scope.interactables.forEachMatch(element, pushMatches);
    var actionInfo = validateMatches(interaction, pointer, event, matches, matchElements, eventTarget, scope);

    if (actionInfo.action && !actionInfo.interactable.options[actionInfo.action.name].manualStart) {
      return actionInfo;
    }

    element = utils.dom.parentNode(element);
  }

  return {
    action: null,
    interactable: null,
    element: null
  };
}

function prepare(interaction, _ref4, scope) {
  var action = _ref4.action,
      interactable = _ref4.interactable,
      element = _ref4.element;
  action = action || {};

  if (interaction.interactable && interaction.interactable.options.styleCursor) {
    setCursor(interaction.element, '', scope);
  }

  interaction.interactable = interactable;
  interaction.element = element;
  utils.copyAction(interaction.prepared, action);
  interaction.rect = interactable && action.name ? interactable.getRect(element) : null;

  if (interactable && interactable.options.styleCursor) {
    var cursor = action ? scope.actions[action.name].getCursor(action) : '';
    setCursor(interaction.element, cursor, scope);
  }

  scope.autoStart.signals.fire('prepared', {
    interaction: interaction
  });
}

function withinInteractionLimit(interactable, element, action, scope) {
  var options = interactable.options;
  var maxActions = options[action.name].max;
  var maxPerElement = options[action.name].maxPerElement;
  var autoStartMax = scope.autoStart.maxInteractions;
  var activeInteractions = 0;
  var interactableCount = 0;
  var elementCount = 0; // no actions if any of these values == 0

  if (!(maxActions && maxPerElement && autoStartMax)) {
    return false;
  }

  for (var _i = 0; _i < scope.interactions.list.length; _i++) {
    var _ref5;

    _ref5 = scope.interactions.list[_i];
    var interaction = _ref5;
    var otherAction = interaction.prepared.name;

    if (!interaction.interacting()) {
      continue;
    }

    activeInteractions++;

    if (activeInteractions >= autoStartMax) {
      return false;
    }

    if (interaction.interactable !== interactable) {
      continue;
    }

    interactableCount += otherAction === action.name ? 1 : 0;

    if (interactableCount >= maxActions) {
      return false;
    }

    if (interaction.element === element) {
      elementCount++;

      if (otherAction === action.name && elementCount >= maxPerElement) {
        return false;
      }
    }
  }

  return autoStartMax > 0;
}

function maxInteractions(newValue, scope) {
  if (utils.is.number(newValue)) {
    scope.autoStart.maxInteractions = newValue;
    return this;
  }

  return scope.autoStart.maxInteractions;
}

function setCursor(element, cursor, scope) {
  if (scope.autoStart.cursorElement) {
    scope.autoStart.cursorElement.style.cursor = '';
  }

  element.ownerDocument.documentElement.style.cursor = cursor;
  element.style.cursor = cursor;
  scope.autoStart.cursorElement = cursor ? element : null;
}

var _default = {
  id: 'auto-start/base',
  install: install,
  maxInteractions: maxInteractions,
  withinInteractionLimit: withinInteractionLimit,
  validateAction: validateAction
};
exports["default"] = _default;

},{"./InteractableMethods":8,"@interactjs/utils":55}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _scope = require("@interactjs/core/scope");

var _domUtils = require("@interactjs/utils/domUtils");

var is = _interopRequireWildcard(require("@interactjs/utils/is"));

var _base = _interopRequireDefault(require("./base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function install(scope) {
  scope.autoStart.signals.on('before-start', function (_ref) {
    var interaction = _ref.interaction,
        eventTarget = _ref.eventTarget,
        dx = _ref.dx,
        dy = _ref.dy;

    if (interaction.prepared.name !== 'drag') {
      return;
    } // check if a drag is in the correct axis


    var absX = Math.abs(dx);
    var absY = Math.abs(dy);
    var targetOptions = interaction.interactable.options.drag;
    var startAxis = targetOptions.startAxis;
    var currentAxis = absX > absY ? 'x' : absX < absY ? 'y' : 'xy';
    interaction.prepared.axis = targetOptions.lockAxis === 'start' ? currentAxis[0] // always lock to one axis even if currentAxis === 'xy'
    : targetOptions.lockAxis; // if the movement isn't in the startAxis of the interactable

    if (currentAxis !== 'xy' && startAxis !== 'xy' && startAxis !== currentAxis) {
      // cancel the prepared action
      interaction.prepared.name = null; // then try to get a drag from another ineractable

      var element = eventTarget;

      var getDraggable = function getDraggable(interactable) {
        if (interactable === interaction.interactable) {
          return;
        }

        var options = interaction.interactable.options.drag;

        if (!options.manualStart && interactable.testIgnoreAllow(options, element, eventTarget)) {
          var action = interactable.getAction(interaction.downPointer, interaction.downEvent, interaction, element);

          if (action && action.name === _scope.ActionName.Drag && checkStartAxis(currentAxis, interactable) && _base["default"].validateAction(action, interactable, element, eventTarget, scope)) {
            return interactable;
          }
        }
      }; // check all interactables


      while (is.element(element)) {
        var interactable = scope.interactables.forEachMatch(element, getDraggable);

        if (interactable) {
          interaction.prepared.name = _scope.ActionName.Drag;
          interaction.interactable = interactable;
          interaction.element = element;
          break;
        }

        element = (0, _domUtils.parentNode)(element);
      }
    }
  });

  function checkStartAxis(startAxis, interactable) {
    if (!interactable) {
      return false;
    }

    var thisAxis = interactable.options[_scope.ActionName.Drag].startAxis;
    return startAxis === 'xy' || thisAxis === 'xy' || thisAxis === startAxis;
  }
}

var _default = {
  id: 'auto-start/dragAxis',
  install: install
};
exports["default"] = _default;

},{"./base":9,"@interactjs/core/scope":24,"@interactjs/utils/domUtils":50,"@interactjs/utils/is":56}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _base = _interopRequireDefault(require("./base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function install(scope) {
  var autoStart = scope.autoStart,
      interactions = scope.interactions,
      defaults = scope.defaults;
  scope.usePlugin(_base["default"]);
  defaults.perAction.hold = 0;
  defaults.perAction.delay = 0;
  interactions.signals.on('new', function (interaction) {
    interaction.autoStartHoldTimer = null;
  });
  autoStart.signals.on('prepared', function (_ref) {
    var interaction = _ref.interaction;
    var hold = getHoldDuration(interaction);

    if (hold > 0) {
      interaction.autoStartHoldTimer = setTimeout(function () {
        interaction.start(interaction.prepared, interaction.interactable, interaction.element);
      }, hold);
    }
  });
  interactions.signals.on('move', function (_ref2) {
    var interaction = _ref2.interaction,
        duplicate = _ref2.duplicate;

    if (interaction.pointerWasMoved && !duplicate) {
      clearTimeout(interaction.autoStartHoldTimer);
    }
  }); // prevent regular down->move autoStart

  autoStart.signals.on('before-start', function (_ref3) {
    var interaction = _ref3.interaction;
    var hold = getHoldDuration(interaction);

    if (hold > 0) {
      interaction.prepared.name = null;
    }
  });
}

function getHoldDuration(interaction) {
  var actionName = interaction.prepared && interaction.prepared.name;

  if (!actionName) {
    return null;
  }

  var options = interaction.interactable.options;
  return options[actionName].hold || options[actionName].delay;
}

var _default = {
  id: 'auto-start/hold',
  install: install,
  getHoldDuration: getHoldDuration
};
exports["default"] = _default;

},{"./base":9}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.install = install;
Object.defineProperty(exports, "autoStart", {
  enumerable: true,
  get: function get() {
    return _base["default"];
  }
});
Object.defineProperty(exports, "dragAxis", {
  enumerable: true,
  get: function get() {
    return _dragAxis["default"];
  }
});
Object.defineProperty(exports, "hold", {
  enumerable: true,
  get: function get() {
    return _hold["default"];
  }
});
exports.id = void 0;

var _base = _interopRequireDefault(require("./base"));

var _dragAxis = _interopRequireDefault(require("./dragAxis"));

var _hold = _interopRequireDefault(require("./hold"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function install(scope) {
  scope.usePlugin(_base["default"]);
  scope.usePlugin(_hold["default"]);
  scope.usePlugin(_dragAxis["default"]);
}

var id = 'auto-start';
exports.id = id;

},{"./base":9,"./dragAxis":10,"./hold":11}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.BaseEvent = exports.EventPhase = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var EventPhase;
exports.EventPhase = EventPhase;

(function (EventPhase) {
  EventPhase["Start"] = "start";
  EventPhase["Move"] = "move";
  EventPhase["End"] = "end";
  EventPhase["_NONE"] = "";
})(EventPhase || (exports.EventPhase = EventPhase = {}));

var BaseEvent =
/*#__PURE__*/
function () {
  function BaseEvent(interaction) {
    _classCallCheck(this, BaseEvent);

    this.immediatePropagationStopped = false;
    this.propagationStopped = false;
    this._interaction = interaction;
  }

  _createClass(BaseEvent, [{
    key: "preventDefault",
    value: function preventDefault() {}
    /**
     * Don't call any other listeners (even on the current target)
     */

  }, {
    key: "stopPropagation",
    value: function stopPropagation() {
      this.propagationStopped = true;
    }
    /**
     * Don't call listeners on the remaining targets
     */

  }, {
    key: "stopImmediatePropagation",
    value: function stopImmediatePropagation() {
      this.immediatePropagationStopped = this.propagationStopped = true;
    }
  }, {
    key: "interaction",
    get: function get() {
      return this._interaction._proxy;
    }
  }]);

  return BaseEvent;
}();

exports.BaseEvent = BaseEvent;
var _default = BaseEvent;
exports["default"] = _default;

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var arr = _interopRequireWildcard(require("@interactjs/utils/arr"));

var _extend = _interopRequireDefault(require("@interactjs/utils/extend"));

var _normalizeListeners = _interopRequireDefault(require("@interactjs/utils/normalizeListeners"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function fireUntilImmediateStopped(event, listeners) {
  for (var _i = 0; _i < listeners.length; _i++) {
    var _ref;

    _ref = listeners[_i];
    var listener = _ref;

    if (event.immediatePropagationStopped) {
      break;
    }

    listener(event);
  }
}

var Eventable =
/*#__PURE__*/
function () {
  function Eventable(options) {
    _classCallCheck(this, Eventable);

    this.types = {};
    this.propagationStopped = false;
    this.immediatePropagationStopped = false;
    this.options = (0, _extend["default"])({}, options || {});
  }

  _createClass(Eventable, [{
    key: "fire",
    value: function fire(event) {
      var listeners;
      var global = this.global; // Interactable#on() listeners
      // tslint:disable no-conditional-assignment

      if (listeners = this.types[event.type]) {
        fireUntilImmediateStopped(event, listeners);
      } // interact.on() listeners


      if (!event.propagationStopped && global && (listeners = global[event.type])) {
        fireUntilImmediateStopped(event, listeners);
      }
    }
  }, {
    key: "on",
    value: function on(type, listener) {
      var listeners = (0, _normalizeListeners["default"])(type, listener);

      for (type in listeners) {
        this.types[type] = arr.merge(this.types[type] || [], listeners[type]);
      }
    }
  }, {
    key: "off",
    value: function off(type, listener) {
      var listeners = (0, _normalizeListeners["default"])(type, listener);

      for (type in listeners) {
        var eventList = this.types[type];

        if (!eventList || !eventList.length) {
          continue;
        }

        for (var _i2 = 0; _i2 < listeners[type].length; _i2++) {
          var _ref2;

          _ref2 = listeners[type][_i2];
          var subListener = _ref2;
          var index = eventList.indexOf(subListener);

          if (index !== -1) {
            eventList.splice(index, 1);
          }
        }
      }
    }
  }]);

  return Eventable;
}();

var _default = Eventable;
exports["default"] = _default;

},{"@interactjs/utils/arr":46,"@interactjs/utils/extend":52,"@interactjs/utils/normalizeListeners":58}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.InteractEvent = exports.EventPhase = void 0;

var _extend = _interopRequireDefault(require("@interactjs/utils/extend"));

var _getOriginXY = _interopRequireDefault(require("@interactjs/utils/getOriginXY"));

var _hypot = _interopRequireDefault(require("@interactjs/utils/hypot"));

var _BaseEvent2 = _interopRequireDefault(require("./BaseEvent"));

var _defaultOptions = _interopRequireDefault(require("./defaultOptions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var EventPhase;
exports.EventPhase = EventPhase;

(function (EventPhase) {
  EventPhase["Start"] = "start";
  EventPhase["Move"] = "move";
  EventPhase["End"] = "end";
  EventPhase["_NONE"] = "";
})(EventPhase || (exports.EventPhase = EventPhase = {}));

var InteractEvent =
/*#__PURE__*/
function (_BaseEvent) {
  _inherits(InteractEvent, _BaseEvent);

  /** */
  function InteractEvent(interaction, event, actionName, phase, element, related, preEnd, type) {
    var _this;

    _classCallCheck(this, InteractEvent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InteractEvent).call(this, interaction));
    element = element || interaction.element;
    var target = interaction.interactable; // FIXME: add deltaSource to defaults

    var deltaSource = (target && target.options || _defaultOptions["default"]).deltaSource;
    var origin = (0, _getOriginXY["default"])(target, element, actionName);
    var starting = phase === 'start';
    var ending = phase === 'end';
    var prevEvent = starting ? _assertThisInitialized(_this) : interaction.prevEvent;
    var coords = starting ? interaction.coords.start : ending ? {
      page: prevEvent.page,
      client: prevEvent.client,
      timeStamp: interaction.coords.cur.timeStamp
    } : interaction.coords.cur;
    _this.page = (0, _extend["default"])({}, coords.page);
    _this.client = (0, _extend["default"])({}, coords.client);
    _this.rect = (0, _extend["default"])({}, interaction.rect);
    _this.timeStamp = coords.timeStamp;

    if (!ending) {
      _this.page.x -= origin.x;
      _this.page.y -= origin.y;
      _this.client.x -= origin.x;
      _this.client.y -= origin.y;
    }

    _this.ctrlKey = event.ctrlKey;
    _this.altKey = event.altKey;
    _this.shiftKey = event.shiftKey;
    _this.metaKey = event.metaKey;
    _this.button = event.button;
    _this.buttons = event.buttons;
    _this.target = element;
    _this.currentTarget = element;
    _this.relatedTarget = related || null;
    _this.preEnd = preEnd;
    _this.type = type || actionName + (phase || '');
    _this.interactable = target;
    _this.t0 = starting ? interaction.pointers[interaction.pointers.length - 1].downTime : prevEvent.t0;
    _this.x0 = interaction.coords.start.page.x - origin.x;
    _this.y0 = interaction.coords.start.page.y - origin.y;
    _this.clientX0 = interaction.coords.start.client.x - origin.x;
    _this.clientY0 = interaction.coords.start.client.y - origin.y;

    if (starting || ending) {
      _this.delta = {
        x: 0,
        y: 0
      };
    } else {
      _this.delta = {
        x: _this[deltaSource].x - prevEvent[deltaSource].x,
        y: _this[deltaSource].y - prevEvent[deltaSource].y
      };
    }

    _this.dt = interaction.coords.delta.timeStamp;
    _this.duration = _this.timeStamp - _this.t0; // velocity and speed in pixels per second

    _this.velocity = (0, _extend["default"])({}, interaction.coords.velocity[deltaSource]);
    _this.speed = (0, _hypot["default"])(_this.velocity.x, _this.velocity.y);
    _this.swipe = ending || phase === 'inertiastart' ? _this.getSwipe() : null;
    return _this;
  }

  _createClass(InteractEvent, [{
    key: "getSwipe",
    value: function getSwipe() {
      var interaction = this._interaction;

      if (interaction.prevEvent.speed < 600 || this.timeStamp - interaction.prevEvent.timeStamp > 150) {
        return null;
      }

      var angle = 180 * Math.atan2(interaction.prevEvent.velocityY, interaction.prevEvent.velocityX) / Math.PI;
      var overlap = 22.5;

      if (angle < 0) {
        angle += 360;
      }

      var left = 135 - overlap <= angle && angle < 225 + overlap;
      var up = 225 - overlap <= angle && angle < 315 + overlap;
      var right = !left && (315 - overlap <= angle || angle < 45 + overlap);
      var down = !up && 45 - overlap <= angle && angle < 135 + overlap;
      return {
        up: up,
        down: down,
        left: left,
        right: right,
        angle: angle,
        speed: interaction.prevEvent.speed,
        velocity: {
          x: interaction.prevEvent.velocityX,
          y: interaction.prevEvent.velocityY
        }
      };
    }
  }, {
    key: "preventDefault",
    value: function preventDefault() {}
    /**
     * Don't call listeners on the remaining targets
     */

  }, {
    key: "stopImmediatePropagation",
    value: function stopImmediatePropagation() {
      this.immediatePropagationStopped = this.propagationStopped = true;
    }
    /**
     * Don't call any other listeners (even on the current target)
     */

  }, {
    key: "stopPropagation",
    value: function stopPropagation() {
      this.propagationStopped = true;
    }
  }, {
    key: "pageX",
    get: function get() {
      return this.page.x;
    },
    set: function set(value) {
      this.page.x = value;
    }
  }, {
    key: "pageY",
    get: function get() {
      return this.page.y;
    },
    set: function set(value) {
      this.page.y = value;
    }
  }, {
    key: "clientX",
    get: function get() {
      return this.client.x;
    },
    set: function set(value) {
      this.client.x = value;
    }
  }, {
    key: "clientY",
    get: function get() {
      return this.client.y;
    },
    set: function set(value) {
      this.client.y = value;
    }
  }, {
    key: "dx",
    get: function get() {
      return this.delta.x;
    },
    set: function set(value) {
      this.delta.x = value;
    }
  }, {
    key: "dy",
    get: function get() {
      return this.delta.y;
    },
    set: function set(value) {
      this.delta.y = value;
    }
  }, {
    key: "velocityX",
    get: function get() {
      return this.velocity.x;
    },
    set: function set(value) {
      this.velocity.x = value;
    }
  }, {
    key: "velocityY",
    get: function get() {
      return this.velocity.y;
    },
    set: function set(value) {
      this.velocity.y = value;
    }
  }]);

  return InteractEvent;
}(_BaseEvent2["default"]);

exports.InteractEvent = InteractEvent;
var _default = InteractEvent;
exports["default"] = _default;

},{"./BaseEvent":13,"./defaultOptions":20,"@interactjs/utils/extend":52,"@interactjs/utils/getOriginXY":53,"@interactjs/utils/hypot":54}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Interactable = void 0;

var arr = _interopRequireWildcard(require("@interactjs/utils/arr"));

var _browser = _interopRequireDefault(require("@interactjs/utils/browser"));

var _clone = _interopRequireDefault(require("@interactjs/utils/clone"));

var _domUtils = require("@interactjs/utils/domUtils");

var _events = _interopRequireDefault(require("@interactjs/utils/events"));

var _extend = _interopRequireDefault(require("@interactjs/utils/extend"));

var is = _interopRequireWildcard(require("@interactjs/utils/is"));

var _normalizeListeners = _interopRequireDefault(require("@interactjs/utils/normalizeListeners"));

var _window = require("@interactjs/utils/window");

var _Eventable = _interopRequireDefault(require("./Eventable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/** */
var Interactable =
/*#__PURE__*/
function () {
  /** */
  function Interactable(target, options, defaultContext) {
    _classCallCheck(this, Interactable);

    this.events = new _Eventable["default"]();
    this._actions = options.actions;
    this.target = target;
    this._context = options.context || defaultContext;
    this._win = (0, _window.getWindow)((0, _domUtils.trySelector)(target) ? this._context : target);
    this._doc = this._win.document;
    this.set(options);
  }

  _createClass(Interactable, [{
    key: "setOnEvents",
    value: function setOnEvents(actionName, phases) {
      if (is.func(phases.onstart)) {
        this.on("".concat(actionName, "start"), phases.onstart);
      }

      if (is.func(phases.onmove)) {
        this.on("".concat(actionName, "move"), phases.onmove);
      }

      if (is.func(phases.onend)) {
        this.on("".concat(actionName, "end"), phases.onend);
      }

      if (is.func(phases.oninertiastart)) {
        this.on("".concat(actionName, "inertiastart"), phases.oninertiastart);
      }

      return this;
    }
  }, {
    key: "updatePerActionListeners",
    value: function updatePerActionListeners(actionName, prev, cur) {
      if (is.array(prev) || is.object(prev)) {
        this.off(actionName, prev);
      }

      if (is.array(cur) || is.object(cur)) {
        this.on(actionName, cur);
      }
    }
  }, {
    key: "setPerAction",
    value: function setPerAction(actionName, options) {
      var defaults = this._defaults; // for all the default per-action options

      for (var optionName in options) {
        var actionOptions = this.options[actionName];
        var optionValue = options[optionName];
        var isArray = is.array(optionValue); // remove old event listeners and add new ones

        if (optionName === 'listeners') {
          this.updatePerActionListeners(actionName, actionOptions.listeners, optionValue);
        } // if the option value is an array


        if (isArray) {
          actionOptions[optionName] = arr.from(optionValue);
        } // if the option value is an object
        else if (!isArray && is.plainObject(optionValue)) {
            // copy the object
            actionOptions[optionName] = (0, _extend["default"])(actionOptions[optionName] || {}, (0, _clone["default"])(optionValue)); // set anabled field to true if it exists in the defaults

            if (is.object(defaults.perAction[optionName]) && 'enabled' in defaults.perAction[optionName]) {
              actionOptions[optionName].enabled = optionValue.enabled !== false;
            }
          } // if the option value is a boolean and the default is an object
          else if (is.bool(optionValue) && is.object(defaults.perAction[optionName])) {
              actionOptions[optionName].enabled = optionValue;
            } // if it's anything else, do a plain assignment
            else {
                actionOptions[optionName] = optionValue;
              }
      }
    }
    /**
     * The default function to get an Interactables bounding rect. Can be
     * overridden using {@link Interactable.rectChecker}.
     *
     * @param {Element} [element] The element to measure.
     * @return {object} The object's bounding rectangle.
     */

  }, {
    key: "getRect",
    value: function getRect(element) {
      element = element || (is.element(this.target) ? this.target : null);

      if (is.string(this.target)) {
        element = element || this._context.querySelector(this.target);
      }

      return (0, _domUtils.getElementRect)(element);
    }
    /**
     * Returns or sets the function used to calculate the interactable's
     * element's rectangle
     *
     * @param {function} [checker] A function which returns this Interactable's
     * bounding rectangle. See {@link Interactable.getRect}
     * @return {function | object} The checker function or this Interactable
     */

  }, {
    key: "rectChecker",
    value: function rectChecker(checker) {
      if (is.func(checker)) {
        this.getRect = checker;
        return this;
      }

      if (checker === null) {
        delete this.getRect;
        return this;
      }

      return this.getRect;
    }
  }, {
    key: "_backCompatOption",
    value: function _backCompatOption(optionName, newValue) {
      if ((0, _domUtils.trySelector)(newValue) || is.object(newValue)) {
        this.options[optionName] = newValue;

        for (var _i = 0; _i < this._actions.names.length; _i++) {
          var _ref;

          _ref = this._actions.names[_i];
          var action = _ref;
          this.options[action][optionName] = newValue;
        }

        return this;
      }

      return this.options[optionName];
    }
    /**
     * Gets or sets the origin of the Interactable's element.  The x and y
     * of the origin will be subtracted from action event coordinates.
     *
     * @param {Element | object | string} [origin] An HTML or SVG Element whose
     * rect will be used, an object eg. { x: 0, y: 0 } or string 'parent', 'self'
     * or any CSS selector
     *
     * @return {object} The current origin or this Interactable
     */

  }, {
    key: "origin",
    value: function origin(newValue) {
      return this._backCompatOption('origin', newValue);
    }
    /**
     * Returns or sets the mouse coordinate types used to calculate the
     * movement of the pointer.
     *
     * @param {string} [newValue] Use 'client' if you will be scrolling while
     * interacting; Use 'page' if you want autoScroll to work
     * @return {string | object} The current deltaSource or this Interactable
     */

  }, {
    key: "deltaSource",
    value: function deltaSource(newValue) {
      if (newValue === 'page' || newValue === 'client') {
        this.options.deltaSource = newValue;
        return this;
      }

      return this.options.deltaSource;
    }
    /**
     * Gets the selector context Node of the Interactable. The default is
     * `window.document`.
     *
     * @return {Node} The context Node of this Interactable
     */

  }, {
    key: "context",
    value: function context() {
      return this._context;
    }
  }, {
    key: "inContext",
    value: function inContext(element) {
      return this._context === element.ownerDocument || (0, _domUtils.nodeContains)(this._context, element);
    }
  }, {
    key: "testIgnoreAllow",
    value: function testIgnoreAllow(options, interactableElement, eventTarget) {
      return !this.testIgnore(options.ignoreFrom, interactableElement, eventTarget) && this.testAllow(options.allowFrom, interactableElement, eventTarget);
    }
  }, {
    key: "testAllow",
    value: function testAllow(allowFrom, interactableElement, element) {
      if (!allowFrom) {
        return true;
      }

      if (!is.element(element)) {
        return false;
      }

      if (is.string(allowFrom)) {
        return (0, _domUtils.matchesUpTo)(element, allowFrom, interactableElement);
      } else if (is.element(allowFrom)) {
        return (0, _domUtils.nodeContains)(allowFrom, element);
      }

      return false;
    }
  }, {
    key: "testIgnore",
    value: function testIgnore(ignoreFrom, interactableElement, element) {
      if (!ignoreFrom || !is.element(element)) {
        return false;
      }

      if (is.string(ignoreFrom)) {
        return (0, _domUtils.matchesUpTo)(element, ignoreFrom, interactableElement);
      } else if (is.element(ignoreFrom)) {
        return (0, _domUtils.nodeContains)(ignoreFrom, element);
      }

      return false;
    }
    /**
     * Calls listeners for the given InteractEvent type bound globally
     * and directly to this Interactable
     *
     * @param {InteractEvent} iEvent The InteractEvent object to be fired on this
     * Interactable
     * @return {Interactable} this Interactable
     */

  }, {
    key: "fire",
    value: function fire(iEvent) {
      this.events.fire(iEvent);
      return this;
    }
  }, {
    key: "_onOff",
    value: function _onOff(method, typeArg, listenerArg, options) {
      if (is.object(typeArg) && !is.array(typeArg)) {
        options = listenerArg;
        listenerArg = null;
      }

      var addRemove = method === 'on' ? 'add' : 'remove';
      var listeners = (0, _normalizeListeners["default"])(typeArg, listenerArg);

      for (var type in listeners) {
        if (type === 'wheel') {
          type = _browser["default"].wheelEvent;
        }

        for (var _i2 = 0; _i2 < listeners[type].length; _i2++) {
          var _ref2;

          _ref2 = listeners[type][_i2];
          var listener = _ref2;

          // if it is an action event type
          if (arr.contains(this._actions.eventTypes, type)) {
            this.events[method](type, listener);
          } // delegated event
          else if (is.string(this.target)) {
              _events["default"]["".concat(addRemove, "Delegate")](this.target, this._context, type, listener, options);
            } // remove listener from this Interatable's element
            else {
                _events["default"][addRemove](this.target, type, listener, options);
              }
        }
      }

      return this;
    }
    /**
     * Binds a listener for an InteractEvent, pointerEvent or DOM event.
     *
     * @param {string | array | object} types The types of events to listen
     * for
     * @param {function | array | object} [listener] The event listener function(s)
     * @param {object | boolean} [options] options object or useCapture flag for
     * addEventListener
     * @return {Interactable} This Interactable
     */

  }, {
    key: "on",
    value: function on(types, listener, options) {
      return this._onOff('on', types, listener, options);
    }
    /**
     * Removes an InteractEvent, pointerEvent or DOM event listener.
     *
     * @param {string | array | object} types The types of events that were
     * listened for
     * @param {function | array | object} [listener] The event listener function(s)
     * @param {object | boolean} [options] options object or useCapture flag for
     * removeEventListener
     * @return {Interactable} This Interactable
     */

  }, {
    key: "off",
    value: function off(types, listener, options) {
      return this._onOff('off', types, listener, options);
    }
    /**
     * Reset the options of this Interactable
     *
     * @param {object} options The new settings to apply
     * @return {object} This Interactable
     */

  }, {
    key: "set",
    value: function set(options) {
      var defaults = this._defaults;

      if (!is.object(options)) {
        options = {};
      }

      this.options = (0, _clone["default"])(defaults.base);

      for (var actionName in this._actions.methodDict) {
        var methodName = this._actions.methodDict[actionName];
        this.options[actionName] = {};
        this.setPerAction(actionName, (0, _extend["default"])((0, _extend["default"])({}, defaults.perAction), defaults.actions[actionName]));
        this[methodName](options[actionName]);
      }

      for (var setting in options) {
        if (is.func(this[setting])) {
          this[setting](options[setting]);
        }
      }

      return this;
    }
    /**
     * Remove this interactable from the list of interactables and remove it's
     * action capabilities and event listeners
     *
     * @return {interact}
     */

  }, {
    key: "unset",
    value: function unset() {
      _events["default"].remove(this.target, 'all');

      if (is.string(this.target)) {
        // remove delegated events
        for (var type in _events["default"].delegatedEvents) {
          var delegated = _events["default"].delegatedEvents[type];

          if (delegated.selectors[0] === this.target && delegated.contexts[0] === this._context) {
            delegated.selectors.splice(0, 1);
            delegated.contexts.splice(0, 1);
            delegated.listeners.splice(0, 1); // remove the arrays if they are empty

            if (!delegated.selectors.length) {
              delegated[type] = null;
            }
          }

          _events["default"].remove(this._context, type, _events["default"].delegateListener);

          _events["default"].remove(this._context, type, _events["default"].delegateUseCapture, true);
        }
      } else {
        _events["default"].remove(this.target, 'all');
      }
    }
  }, {
    key: "_defaults",
    get: function get() {
      return {
        base: {},
        perAction: {},
        actions: {}
      };
    }
  }]);

  return Interactable;
}();

exports.Interactable = Interactable;
var _default = Interactable;
exports["default"] = _default;

},{"./Eventable":14,"@interactjs/utils/arr":46,"@interactjs/utils/browser":47,"@interactjs/utils/clone":48,"@interactjs/utils/domUtils":50,"@interactjs/utils/events":51,"@interactjs/utils/extend":52,"@interactjs/utils/is":56,"@interactjs/utils/normalizeListeners":58,"@interactjs/utils/window":65}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var arr = _interopRequireWildcard(require("@interactjs/utils/arr"));

var domUtils = _interopRequireWildcard(require("@interactjs/utils/domUtils"));

var _extend = _interopRequireDefault(require("@interactjs/utils/extend"));

var is = _interopRequireWildcard(require("@interactjs/utils/is"));

var _Signals = _interopRequireDefault(require("@interactjs/utils/Signals"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var InteractableSet =
/*#__PURE__*/
function () {
  function InteractableSet(scope) {
    var _this = this;

    _classCallCheck(this, InteractableSet);

    this.scope = scope;
    this.signals = new _Signals["default"](); // all set interactables

    this.list = [];
    this.selectorMap = {};
    this.signals.on('unset', function (_ref) {
      var interactable = _ref.interactable;
      var target = interactable.target,
          context = interactable._context;
      var targetMappings = is.string(target) ? _this.selectorMap[target] : target[_this.scope.id];
      targetMappings.splice(targetMappings.findIndex(function (m) {
        return m.context === context;
      }), 1);
    });
  }

  _createClass(InteractableSet, [{
    key: "new",
    value: function _new(target, options) {
      options = (0, _extend["default"])(options || {}, {
        actions: this.scope.actions
      });
      var interactable = new this.scope.Interactable(target, options, this.scope.document);
      var mappingInfo = {
        context: interactable._context,
        interactable: interactable
      };
      this.scope.addDocument(interactable._doc);
      this.list.push(interactable);

      if (is.string(target)) {
        if (!this.selectorMap[target]) {
          this.selectorMap[target] = [];
        }

        this.selectorMap[target].push(mappingInfo);
      } else {
        if (!interactable.target[this.scope.id]) {
          Object.defineProperty(target, this.scope.id, {
            value: [],
            configurable: true
          });
        }

        target[this.scope.id].push(mappingInfo);
      }

      this.signals.fire('new', {
        target: target,
        options: options,
        interactable: interactable,
        win: this.scope._win
      });
      return interactable;
    }
  }, {
    key: "get",
    value: function get(target, options) {
      var context = options && options.context || this.scope.document;
      var isSelector = is.string(target);
      var targetMappings = isSelector ? this.selectorMap[target] : target[this.scope.id];

      if (!targetMappings) {
        return null;
      }

      var found = arr.find(targetMappings, function (m) {
        return m.context === context && (isSelector || m.interactable.inContext(target));
      });
      return found && found.interactable;
    }
  }, {
    key: "forEachMatch",
    value: function forEachMatch(element, callback) {
      for (var _i = 0; _i < this.list.length; _i++) {
        var _ref2;

        _ref2 = this.list[_i];
        var interactable = _ref2;
        var ret = void 0;

        if ((is.string(interactable.target) // target is a selector and the element matches
        ? is.element(element) && domUtils.matchesSelector(element, interactable.target) : // target is the element
        element === interactable.target) && // the element is in context
        interactable.inContext(element)) {
          ret = callback(interactable);
        }

        if (ret !== undefined) {
          return ret;
        }
      }
    }
  }]);

  return InteractableSet;
}();

exports["default"] = InteractableSet;

},{"@interactjs/utils/Signals":45,"@interactjs/utils/arr":46,"@interactjs/utils/domUtils":50,"@interactjs/utils/extend":52,"@interactjs/utils/is":56}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "PointerInfo", {
  enumerable: true,
  get: function get() {
    return _PointerInfo["default"];
  }
});
exports["default"] = exports.Interaction = void 0;

var utils = _interopRequireWildcard(require("@interactjs/utils"));

var _InteractEvent = _interopRequireWildcard(require("./InteractEvent"));

var _PointerInfo = _interopRequireDefault(require("./PointerInfo"));

var _scope = require("./scope");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Interaction =
/*#__PURE__*/
function () {
  /** */
  function Interaction(_ref) {
    var pointerType = _ref.pointerType,
        signals = _ref.signals;

    _classCallCheck(this, Interaction);

    // current interactable being interacted with
    this.interactable = null; // the target element of the interactable

    this.element = null; // action that's ready to be fired on next move event

    this.prepared = {
      name: null,
      axis: null,
      edges: null
    }; // keep track of added pointers

    this.pointers = []; // pointerdown/mousedown/touchstart event

    this.downEvent = null;
    this.downPointer = {};
    this._latestPointer = {
      pointer: null,
      event: null,
      eventTarget: null
    }; // previous action event

    this.prevEvent = null;
    this.pointerIsDown = false;
    this.pointerWasMoved = false;
    this._interacting = false;
    this._ending = false;
    this._proxy = null;
    this.simulation = null;
    /**
     * @alias Interaction.prototype.move
     */

    this.doMove = utils.warnOnce(function (signalArg) {
      this.move(signalArg);
    }, 'The interaction.doMove() method has been renamed to interaction.move()');
    this.coords = {
      // Starting InteractEvent pointer coordinates
      start: utils.pointer.newCoords(),
      // Previous native pointer move event coordinates
      prev: utils.pointer.newCoords(),
      // current native pointer move event coordinates
      cur: utils.pointer.newCoords(),
      // Change in coordinates and time of the pointer
      delta: utils.pointer.newCoords(),
      // pointer velocity
      velocity: utils.pointer.newCoords()
    };
    this._signals = signals;
    this.pointerType = pointerType;
    var that = this;
    this._proxy = {
      get pointerIsDown() {
        return that.pointerIsDown;
      },

      get pointerWasMoved() {
        return that.pointerWasMoved;
      },

      start: function start(action, i, e) {
        return that.start(action, i, e);
      },
      move: function move(arg) {
        return that.move(arg);
      },
      end: function end(event) {
        return that.end(event);
      },
      stop: function stop() {
        return that.stop();
      },
      interacting: function interacting() {
        return that.interacting();
      },

      get _proxy() {
        return this;
      }

    };

    this._signals.fire('new', {
      interaction: this
    });
  }

  _createClass(Interaction, [{
    key: "pointerDown",
    value: function pointerDown(pointer, event, eventTarget) {
      var pointerIndex = this.updatePointer(pointer, event, eventTarget, true);

      this._signals.fire('down', {
        pointer: pointer,
        event: event,
        eventTarget: eventTarget,
        pointerIndex: pointerIndex,
        interaction: this
      });
    }
    /**
     * ```js
     * interact(target)
     *   .draggable({
     *     // disable the default drag start by down->move
     *     manualStart: true
     *   })
     *   // start dragging after the user holds the pointer down
     *   .on('hold', function (event) {
     *     var interaction = event.interaction
     *
     *     if (!interaction.interacting()) {
     *       interaction.start({ name: 'drag' },
     *                         event.interactable,
     *                         event.currentTarget)
     *     }
     * })
     * ```
     *
     * Start an action with the given Interactable and Element as tartgets. The
     * action must be enabled for the target Interactable and an appropriate
     * number of pointers must be held down - 1 for drag/resize, 2 for gesture.
     *
     * Use it with `interactable.<action>able({ manualStart: false })` to always
     * [start actions manually](https://github.com/taye/interact.js/issues/114)
     *
     * @param {object} action   The action to be performed - drag, resize, etc.
     * @param {Interactable} target  The Interactable to target
     * @param {Element} element The DOM Element to target
     * @return {object} interact
     */

  }, {
    key: "start",
    value: function start(action, interactable, element) {
      if (this.interacting() || !this.pointerIsDown || this.pointers.length < (action.name === _scope.ActionName.Gesture ? 2 : 1) || !interactable.options[action.name].enabled) {
        return false;
      }

      utils.copyAction(this.prepared, action);
      this.interactable = interactable;
      this.element = element;
      this.rect = interactable.getRect(element);
      this.edges = this.prepared.edges;
      this._interacting = this._doPhase({
        interaction: this,
        event: this.downEvent,
        phase: _InteractEvent.EventPhase.Start
      });
      return this._interacting;
    }
  }, {
    key: "pointerMove",
    value: function pointerMove(pointer, event, eventTarget) {
      if (!this.simulation) {
        this.updatePointer(pointer, event, eventTarget, false);
        utils.pointer.setCoords(this.coords.cur, this.pointers.map(function (p) {
          return p.pointer;
        }), this._now());
      }

      var duplicateMove = this.coords.cur.page.x === this.coords.prev.page.x && this.coords.cur.page.y === this.coords.prev.page.y && this.coords.cur.client.x === this.coords.prev.client.x && this.coords.cur.client.y === this.coords.prev.client.y;
      var dx;
      var dy; // register movement greater than pointerMoveTolerance

      if (this.pointerIsDown && !this.pointerWasMoved) {
        dx = this.coords.cur.client.x - this.coords.start.client.x;
        dy = this.coords.cur.client.y - this.coords.start.client.y;
        this.pointerWasMoved = utils.hypot(dx, dy) > this.pointerMoveTolerance;
      }

      var signalArg = {
        pointer: pointer,
        pointerIndex: this.getPointerIndex(pointer),
        event: event,
        eventTarget: eventTarget,
        dx: dx,
        dy: dy,
        duplicate: duplicateMove,
        interaction: this
      };

      if (!duplicateMove) {
        // set pointer coordinate, time changes and velocity
        utils.pointer.setCoordDeltas(this.coords.delta, this.coords.prev, this.coords.cur);
        utils.pointer.setCoordVelocity(this.coords.velocity, this.coords.delta);
      }

      this._signals.fire('move', signalArg);

      if (!duplicateMove) {
        // if interacting, fire an 'action-move' signal etc
        if (this.interacting()) {
          this.move(signalArg);
        }

        if (this.pointerWasMoved) {
          utils.pointer.copyCoords(this.coords.prev, this.coords.cur);
        }
      }
    }
    /**
     * ```js
     * interact(target)
     *   .draggable(true)
     *   .on('dragmove', function (event) {
     *     if (someCondition) {
     *       // change the snap settings
     *       event.interactable.draggable({ snap: { targets: [] }})
     *       // fire another move event with re-calculated snap
     *       event.interaction.move()
     *     }
     *   })
     * ```
     *
     * Force a move of the current action at the same coordinates. Useful if
     * snap/restrict has been changed and you want a movement with the new
     * settings.
     */

  }, {
    key: "move",
    value: function move(signalArg) {
      signalArg = utils.extend({
        pointer: this._latestPointer.pointer,
        event: this._latestPointer.event,
        eventTarget: this._latestPointer.eventTarget,
        interaction: this
      }, signalArg || {});
      signalArg.phase = _InteractEvent.EventPhase.Move;

      this._doPhase(signalArg);
    } // End interact move events and stop auto-scroll unless simulation is running

  }, {
    key: "pointerUp",
    value: function pointerUp(pointer, event, eventTarget, curEventTarget) {
      var pointerIndex = this.getPointerIndex(pointer);

      if (pointerIndex === -1) {
        pointerIndex = this.updatePointer(pointer, event, eventTarget, false);
      }

      this._signals.fire(/cancel$/i.test(event.type) ? 'cancel' : 'up', {
        pointer: pointer,
        pointerIndex: pointerIndex,
        event: event,
        eventTarget: eventTarget,
        curEventTarget: curEventTarget,
        interaction: this
      });

      if (!this.simulation) {
        this.end(event);
      }

      this.pointerIsDown = false;
      this.removePointer(pointer, event);
    }
  }, {
    key: "documentBlur",
    value: function documentBlur(event) {
      this.end(event);

      this._signals.fire('blur', {
        event: event,
        interaction: this
      });
    }
    /**
     * ```js
     * interact(target)
     *   .draggable(true)
     *   .on('move', function (event) {
     *     if (event.pageX > 1000) {
     *       // end the current action
     *       event.interaction.end()
     *       // stop all further listeners from being called
     *       event.stopImmediatePropagation()
     *     }
     *   })
     * ```
     *
     * @param {PointerEvent} [event]
     */

  }, {
    key: "end",
    value: function end(event) {
      this._ending = true;
      event = event || this._latestPointer.event;
      var endPhaseResult;

      if (this.interacting()) {
        endPhaseResult = this._doPhase({
          event: event,
          interaction: this,
          phase: _InteractEvent.EventPhase.End
        });
      }

      this._ending = false;

      if (endPhaseResult === true) {
        this.stop();
      }
    }
  }, {
    key: "currentAction",
    value: function currentAction() {
      return this._interacting ? this.prepared.name : null;
    }
  }, {
    key: "interacting",
    value: function interacting() {
      return this._interacting;
    }
    /** */

  }, {
    key: "stop",
    value: function stop() {
      this._signals.fire('stop', {
        interaction: this
      });

      this.interactable = this.element = null;
      this._interacting = false;
      this.prepared.name = this.prevEvent = null;
    }
  }, {
    key: "getPointerIndex",
    value: function getPointerIndex(pointer) {
      var pointerId = utils.pointer.getPointerId(pointer); // mouse and pen interactions may have only one pointer

      return this.pointerType === 'mouse' || this.pointerType === 'pen' ? this.pointers.length - 1 : utils.arr.findIndex(this.pointers, function (curPointer) {
        return curPointer.id === pointerId;
      });
    }
  }, {
    key: "getPointerInfo",
    value: function getPointerInfo(pointer) {
      return this.pointers[this.getPointerIndex(pointer)];
    }
  }, {
    key: "updatePointer",
    value: function updatePointer(pointer, event, eventTarget, down) {
      var id = utils.pointer.getPointerId(pointer);
      var pointerIndex = this.getPointerIndex(pointer);
      var pointerInfo = this.pointers[pointerIndex];
      down = down === false ? false : down || /(down|start)$/i.test(event.type);

      if (!pointerInfo) {
        pointerInfo = new _PointerInfo["default"](id, pointer, event, null, null);
        pointerIndex = this.pointers.length;
        this.pointers.push(pointerInfo);
      } else {
        pointerInfo.pointer = pointer;
      }

      if (down) {
        this.pointerIsDown = true;

        if (!this.interacting()) {
          utils.pointer.setCoords(this.coords.start, this.pointers.map(function (p) {
            return p.pointer;
          }), this._now());
          utils.pointer.copyCoords(this.coords.cur, this.coords.start);
          utils.pointer.copyCoords(this.coords.prev, this.coords.start);
          utils.pointer.pointerExtend(this.downPointer, pointer);
          this.downEvent = event;
          pointerInfo.downTime = this.coords.cur.timeStamp;
          pointerInfo.downTarget = eventTarget;
          this.pointerWasMoved = false;
        }
      }

      this._updateLatestPointer(pointer, event, eventTarget);

      this._signals.fire('update-pointer', {
        pointer: pointer,
        event: event,
        eventTarget: eventTarget,
        down: down,
        pointerInfo: pointerInfo,
        pointerIndex: pointerIndex,
        interaction: this
      });

      return pointerIndex;
    }
  }, {
    key: "removePointer",
    value: function removePointer(pointer, event) {
      var pointerIndex = this.getPointerIndex(pointer);

      if (pointerIndex === -1) {
        return;
      }

      var pointerInfo = this.pointers[pointerIndex];

      this._signals.fire('remove-pointer', {
        pointer: pointer,
        event: event,
        pointerIndex: pointerIndex,
        pointerInfo: pointerInfo,
        interaction: this
      });

      this.pointers.splice(pointerIndex, 1);
    }
  }, {
    key: "_updateLatestPointer",
    value: function _updateLatestPointer(pointer, event, eventTarget) {
      this._latestPointer.pointer = pointer;
      this._latestPointer.event = event;
      this._latestPointer.eventTarget = eventTarget;
    }
  }, {
    key: "_createPreparedEvent",
    value: function _createPreparedEvent(event, phase, preEnd, type) {
      var actionName = this.prepared.name;
      return new _InteractEvent["default"](this, event, actionName, phase, this.element, null, preEnd, type);
    }
  }, {
    key: "_fireEvent",
    value: function _fireEvent(iEvent) {
      this.interactable.fire(iEvent);

      if (!this.prevEvent || iEvent.timeStamp >= this.prevEvent.timeStamp) {
        this.prevEvent = iEvent;
      }
    }
  }, {
    key: "_doPhase",
    value: function _doPhase(signalArg) {
      var event = signalArg.event,
          phase = signalArg.phase,
          preEnd = signalArg.preEnd,
          type = signalArg.type;

      var beforeResult = this._signals.fire("before-action-".concat(phase), signalArg);

      if (beforeResult === false) {
        return false;
      }

      var iEvent = signalArg.iEvent = this._createPreparedEvent(event, phase, preEnd, type);

      var rect = this.rect;

      if (rect) {
        // update the rect modifications
        var edges = this.edges || this.prepared.edges || {
          left: true,
          right: true,
          top: true,
          bottom: true
        };

        if (edges.top) {
          rect.top += iEvent.delta.y;
        }

        if (edges.bottom) {
          rect.bottom += iEvent.delta.y;
        }

        if (edges.left) {
          rect.left += iEvent.delta.x;
        }

        if (edges.right) {
          rect.right += iEvent.delta.x;
        }

        rect.width = rect.right - rect.left;
        rect.height = rect.bottom - rect.top;
      }

      this._signals.fire("action-".concat(phase), signalArg);

      this._fireEvent(iEvent);

      this._signals.fire("after-action-".concat(phase), signalArg);

      return true;
    }
  }, {
    key: "_now",
    value: function _now() {
      return Date.now();
    }
  }, {
    key: "pointerMoveTolerance",
    get: function get() {
      return 1;
    }
  }]);

  return Interaction;
}();

exports.Interaction = Interaction;
var _default = Interaction;
exports["default"] = _default;

},{"./InteractEvent":15,"./PointerInfo":19,"./scope":24,"@interactjs/utils":55}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.PointerInfo = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PointerInfo = function PointerInfo(id, pointer, event, downTime, downTarget) {
  _classCallCheck(this, PointerInfo);

  this.id = id;
  this.pointer = pointer;
  this.event = event;
  this.downTime = downTime;
  this.downTarget = downTarget;
};

exports.PointerInfo = PointerInfo;
var _default = PointerInfo;
exports["default"] = _default;

},{}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.defaults = void 0;
// tslint:disable no-empty-interface
var defaults = {
  base: {
    preventDefault: 'auto',
    deltaSource: 'page'
  },
  perAction: {
    enabled: false,
    origin: {
      x: 0,
      y: 0
    }
  },
  actions: {}
};
exports.defaults = defaults;
var _default = defaults;
exports["default"] = _default;

},{}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.install = install;
exports["default"] = void 0;

var _domUtils = require("@interactjs/utils/domUtils");

var _events = _interopRequireDefault(require("@interactjs/utils/events"));

var is = _interopRequireWildcard(require("@interactjs/utils/is"));

var _window = require("@interactjs/utils/window");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function preventDefault(interactable, newValue) {
  if (/^(always|never|auto)$/.test(newValue)) {
    interactable.options.preventDefault = newValue;
    return interactable;
  }

  if (is.bool(newValue)) {
    interactable.options.preventDefault = newValue ? 'always' : 'never';
    return interactable;
  }

  return interactable.options.preventDefault;
}

function checkAndPreventDefault(interactable, scope, event) {
  var setting = interactable.options.preventDefault;

  if (setting === 'never') {
    return;
  }

  if (setting === 'always') {
    event.preventDefault();
    return;
  } // setting === 'auto'
  // if the browser supports passive event listeners and isn't running on iOS,
  // don't preventDefault of touch{start,move} events. CSS touch-action and
  // user-select should be used instead of calling event.preventDefault().


  if (_events["default"].supportsPassive && /^touch(start|move)$/.test(event.type)) {
    var doc = (0, _window.getWindow)(event.target).document;
    var docOptions = scope.getDocOptions(doc);

    if (!(docOptions && docOptions.events) || docOptions.events.passive !== false) {
      return;
    }
  } // don't preventDefault of pointerdown events


  if (/^(mouse|pointer|touch)*(down|start)/i.test(event.type)) {
    return;
  } // don't preventDefault on editable elements


  if (is.element(event.target) && (0, _domUtils.matchesSelector)(event.target, 'input,select,textarea,[contenteditable=true],[contenteditable=true] *')) {
    return;
  }

  event.preventDefault();
}

function onInteractionEvent(_ref) {
  var interaction = _ref.interaction,
      event = _ref.event;

  if (interaction.interactable) {
    interaction.interactable.checkAndPreventDefault(event);
  }
}

function install(scope) {
  /** @lends Interactable */
  var Interactable = scope.Interactable;
  /**
   * Returns or sets whether to prevent the browser's default behaviour in
   * response to pointer events. Can be set to:
   *  - `'always'` to always prevent
   *  - `'never'` to never prevent
   *  - `'auto'` to let interact.js try to determine what would be best
   *
   * @param {string} [newValue] `'always'`, `'never'` or `'auto'`
   * @return {string | Interactable} The current setting or this Interactable
   */

  Interactable.prototype.preventDefault = function (newValue) {
    return preventDefault(this, newValue);
  };

  Interactable.prototype.checkAndPreventDefault = function (event) {
    return checkAndPreventDefault(this, scope, event);
  };

  var _arr = ['down', 'move', 'up', 'cancel'];

  for (var _i = 0; _i < _arr.length; _i++) {
    var eventSignal = _arr[_i];
    scope.interactions.signals.on(eventSignal, onInteractionEvent);
  } // prevent native HTML5 drag on interact.js target elements


  scope.interactions.eventMap.dragstart = function preventNativeDrag(event) {
    for (var _i2 = 0; _i2 < scope.interactions.list.length; _i2++) {
      var _ref2;

      _ref2 = scope.interactions.list[_i2];
      var interaction = _ref2;

      if (interaction.element && (interaction.element === event.target || (0, _domUtils.nodeContains)(interaction.element, event.target))) {
        interaction.interactable.checkAndPreventDefault(event);
        return;
      }
    }
  };
}

var _default = {
  id: 'core/interactablePreventDefault',
  install: install
};
exports["default"] = _default;

},{"@interactjs/utils/domUtils":50,"@interactjs/utils/events":51,"@interactjs/utils/is":56,"@interactjs/utils/window":65}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _arr = require("@interactjs/utils/arr");

var dom = _interopRequireWildcard(require("@interactjs/utils/domUtils"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var finder = {
  methodOrder: ['simulationResume', 'mouseOrPen', 'hasPointer', 'idle'],
  search: function search(details) {
    for (var _i = 0; _i < finder.methodOrder.length; _i++) {
      var _ref;

      _ref = finder.methodOrder[_i];
      var method = _ref;
      var interaction = finder[method](details);

      if (interaction) {
        return interaction;
      }
    }
  },
  // try to resume simulation with a new pointer
  simulationResume: function simulationResume(_ref2) {
    var pointerType = _ref2.pointerType,
        eventType = _ref2.eventType,
        eventTarget = _ref2.eventTarget,
        scope = _ref2.scope;

    if (!/down|start/i.test(eventType)) {
      return null;
    }

    for (var _i2 = 0; _i2 < scope.interactions.list.length; _i2++) {
      var _ref3;

      _ref3 = scope.interactions.list[_i2];
      var interaction = _ref3;
      var element = eventTarget;

      if (interaction.simulation && interaction.simulation.allowResume && interaction.pointerType === pointerType) {
        while (element) {
          // if the element is the interaction element
          if (element === interaction.element) {
            return interaction;
          }

          element = dom.parentNode(element);
        }
      }
    }

    return null;
  },
  // if it's a mouse or pen interaction
  mouseOrPen: function mouseOrPen(_ref4) {
    var pointerId = _ref4.pointerId,
        pointerType = _ref4.pointerType,
        eventType = _ref4.eventType,
        scope = _ref4.scope;

    if (pointerType !== 'mouse' && pointerType !== 'pen') {
      return null;
    }

    var firstNonActive;

    for (var _i3 = 0; _i3 < scope.interactions.list.length; _i3++) {
      var _ref5;

      _ref5 = scope.interactions.list[_i3];
      var interaction = _ref5;

      if (interaction.pointerType === pointerType) {
        // if it's a down event, skip interactions with running simulations
        if (interaction.simulation && !hasPointerId(interaction, pointerId)) {
          continue;
        } // if the interaction is active, return it immediately


        if (interaction.interacting()) {
          return interaction;
        } // otherwise save it and look for another active interaction
        else if (!firstNonActive) {
            firstNonActive = interaction;
          }
      }
    } // if no active mouse interaction was found use the first inactive mouse
    // interaction


    if (firstNonActive) {
      return firstNonActive;
    } // find any mouse or pen interaction.
    // ignore the interaction if the eventType is a *down, and a simulation
    // is active


    for (var _i4 = 0; _i4 < scope.interactions.list.length; _i4++) {
      var _ref6;

      _ref6 = scope.interactions.list[_i4];
      var _interaction = _ref6;

      if (_interaction.pointerType === pointerType && !(/down/i.test(eventType) && _interaction.simulation)) {
        return _interaction;
      }
    }

    return null;
  },
  // get interaction that has this pointer
  hasPointer: function hasPointer(_ref7) {
    var pointerId = _ref7.pointerId,
        scope = _ref7.scope;

    for (var _i5 = 0; _i5 < scope.interactions.list.length; _i5++) {
      var _ref8;

      _ref8 = scope.interactions.list[_i5];
      var interaction = _ref8;

      if (hasPointerId(interaction, pointerId)) {
        return interaction;
      }
    }

    return null;
  },
  // get first idle interaction with a matching pointerType
  idle: function idle(_ref9) {
    var pointerType = _ref9.pointerType,
        scope = _ref9.scope;

    for (var _i6 = 0; _i6 < scope.interactions.list.length; _i6++) {
      var _ref10;

      _ref10 = scope.interactions.list[_i6];
      var interaction = _ref10;

      // if there's already a pointer held down
      if (interaction.pointers.length === 1) {
        var target = interaction.interactable; // don't add this pointer if there is a target interactable and it
        // isn't gesturable

        if (target && !target.options.gesture.enabled) {
          continue;
        }
      } // maximum of 2 pointers per interaction
      else if (interaction.pointers.length >= 2) {
          continue;
        }

      if (!interaction.interacting() && pointerType === interaction.pointerType) {
        return interaction;
      }
    }

    return null;
  }
};

function hasPointerId(interaction, pointerId) {
  return (0, _arr.some)(interaction.pointers, function (_ref11) {
    var id = _ref11.id;
    return id === pointerId;
  });
}

var _default = finder;
exports["default"] = _default;

},{"@interactjs/utils/arr":46,"@interactjs/utils/domUtils":50}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _browser = _interopRequireDefault(require("@interactjs/utils/browser"));

var _domObjects = _interopRequireDefault(require("@interactjs/utils/domObjects"));

var _events = _interopRequireDefault(require("@interactjs/utils/events"));

var _pointerUtils = _interopRequireDefault(require("@interactjs/utils/pointerUtils"));

var _Signals = _interopRequireDefault(require("@interactjs/utils/Signals"));

var _Interaction = _interopRequireDefault(require("./Interaction"));

var _interactionFinder = _interopRequireDefault(require("./interactionFinder"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var methodNames = ['pointerDown', 'pointerMove', 'pointerUp', 'updatePointer', 'removePointer', 'windowBlur'];

function install(scope) {
  var signals = new _Signals["default"]();
  var listeners = {};

  for (var _i = 0; _i < methodNames.length; _i++) {
    var method = methodNames[_i];
    listeners[method] = doOnInteractions(method, scope);
  }

  var pEventTypes = _browser["default"].pEventTypes;
  var eventMap = {};

  if (_domObjects["default"].PointerEvent) {
    eventMap[pEventTypes.down] = listeners.pointerDown;
    eventMap[pEventTypes.move] = listeners.pointerMove;
    eventMap[pEventTypes.up] = listeners.pointerUp;
    eventMap[pEventTypes.cancel] = listeners.pointerUp;
  } else {
    eventMap.mousedown = listeners.pointerDown;
    eventMap.mousemove = listeners.pointerMove;
    eventMap.mouseup = listeners.pointerUp;
    eventMap.touchstart = listeners.pointerDown;
    eventMap.touchmove = listeners.pointerMove;
    eventMap.touchend = listeners.pointerUp;
    eventMap.touchcancel = listeners.pointerUp;
  }

  eventMap.blur = function (event) {
    for (var _i2 = 0; _i2 < scope.interactions.list.length; _i2++) {
      var _ref;

      _ref = scope.interactions.list[_i2];
      var interaction = _ref;
      interaction.documentBlur(event);
    }
  };

  scope.signals.on('add-document', onDocSignal);
  scope.signals.on('remove-document', onDocSignal); // for ignoring browser's simulated mouse events

  scope.prevTouchTime = 0;

  scope.Interaction =
  /*#__PURE__*/
  function (_InteractionBase) {
    _inherits(Interaction, _InteractionBase);

    function Interaction() {
      _classCallCheck(this, Interaction);

      return _possibleConstructorReturn(this, _getPrototypeOf(Interaction).apply(this, arguments));
    }

    _createClass(Interaction, [{
      key: "_now",
      value: function _now() {
        return scope.now();
      }
    }, {
      key: "pointerMoveTolerance",
      get: function get() {
        return scope.interactions.pointerMoveTolerance;
      },
      set: function set(value) {
        scope.interactions.pointerMoveTolerance = value;
      }
    }]);

    return Interaction;
  }(_Interaction["default"]);

  scope.interactions = {
    signals: signals,
    // all active and idle interactions
    list: [],
    "new": function _new(options) {
      options.signals = signals;
      var interaction = new scope.Interaction(options);
      scope.interactions.list.push(interaction);
      return interaction;
    },
    listeners: listeners,
    eventMap: eventMap,
    pointerMoveTolerance: 1
  };
}

function doOnInteractions(method, scope) {
  return function (event) {
    var interactions = scope.interactions.list;

    var pointerType = _pointerUtils["default"].getPointerType(event);

    var _pointerUtils$getEven = _pointerUtils["default"].getEventTargets(event),
        _pointerUtils$getEven2 = _slicedToArray(_pointerUtils$getEven, 2),
        eventTarget = _pointerUtils$getEven2[0],
        curEventTarget = _pointerUtils$getEven2[1];

    var matches = []; // [ [pointer, interaction], ...]

    if (_browser["default"].supportsTouch && /touch/.test(event.type)) {
      scope.prevTouchTime = scope.now();

      for (var _i3 = 0; _i3 < event.changedTouches.length; _i3++) {
        var _ref2;

        _ref2 = event.changedTouches[_i3];
        var changedTouch = _ref2;
        var pointer = changedTouch;

        var pointerId = _pointerUtils["default"].getPointerId(pointer);

        var searchDetails = {
          pointer: pointer,
          pointerId: pointerId,
          pointerType: pointerType,
          eventType: event.type,
          eventTarget: eventTarget,
          curEventTarget: curEventTarget,
          scope: scope
        };
        var interaction = getInteraction(searchDetails);
        matches.push([searchDetails.pointer, searchDetails.eventTarget, searchDetails.curEventTarget, interaction]);
      }
    } else {
      var invalidPointer = false;

      if (!_browser["default"].supportsPointerEvent && /mouse/.test(event.type)) {
        // ignore mouse events while touch interactions are active
        for (var i = 0; i < interactions.length && !invalidPointer; i++) {
          invalidPointer = interactions[i].pointerType !== 'mouse' && interactions[i].pointerIsDown;
        } // try to ignore mouse events that are simulated by the browser
        // after a touch event


        invalidPointer = invalidPointer || scope.now() - scope.prevTouchTime < 500 || // on iOS and Firefox Mobile, MouseEvent.timeStamp is zero if simulated
        event.timeStamp === 0;
      }

      if (!invalidPointer) {
        var _searchDetails = {
          pointer: event,
          pointerId: _pointerUtils["default"].getPointerId(event),
          pointerType: pointerType,
          eventType: event.type,
          curEventTarget: curEventTarget,
          eventTarget: eventTarget,
          scope: scope
        };

        var _interaction = getInteraction(_searchDetails);

        matches.push([_searchDetails.pointer, _searchDetails.eventTarget, _searchDetails.curEventTarget, _interaction]);
      }
    } // eslint-disable-next-line no-shadow


    for (var _i4 = 0; _i4 < matches.length; _i4++) {
      var _matches$_i = _slicedToArray(matches[_i4], 4),
          _pointer = _matches$_i[0],
          _eventTarget = _matches$_i[1],
          _curEventTarget = _matches$_i[2],
          _interaction2 = _matches$_i[3];

      _interaction2[method](_pointer, event, _eventTarget, _curEventTarget);
    }
  };
}

function getInteraction(searchDetails) {
  var pointerType = searchDetails.pointerType,
      scope = searchDetails.scope;

  var foundInteraction = _interactionFinder["default"].search(searchDetails);

  var signalArg = {
    interaction: foundInteraction,
    searchDetails: searchDetails
  };
  scope.interactions.signals.fire('find', signalArg);
  return signalArg.interaction || scope.interactions["new"]({
    pointerType: pointerType
  });
}

function onDocSignal(_ref3, signalName) {
  var doc = _ref3.doc,
      scope = _ref3.scope,
      options = _ref3.options;
  var eventMap = scope.interactions.eventMap;
  var eventMethod = signalName.indexOf('add') === 0 ? _events["default"].add : _events["default"].remove;

  if (scope.browser.isIOS && !options.events) {
    options.events = {
      passive: false
    };
  } // delegate event listener


  for (var eventType in _events["default"].delegatedEvents) {
    eventMethod(doc, eventType, _events["default"].delegateListener);
    eventMethod(doc, eventType, _events["default"].delegateUseCapture, true);
  }

  var eventOptions = options && options.events;

  for (var _eventType in eventMap) {
    eventMethod(doc, _eventType, eventMap[_eventType], eventOptions);
  }
}

var _default = {
  id: 'core/interactions',
  install: install,
  onDocSignal: onDocSignal,
  doOnInteractions: doOnInteractions,
  methodNames: methodNames
};
exports["default"] = _default;

},{"./Interaction":18,"./interactionFinder":22,"@interactjs/utils/Signals":45,"@interactjs/utils/browser":47,"@interactjs/utils/domObjects":49,"@interactjs/utils/events":51,"@interactjs/utils/pointerUtils":60}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createScope = createScope;
exports.initScope = initScope;
exports.Scope = exports.ActionName = void 0;

var utils = _interopRequireWildcard(require("@interactjs/utils"));

var _domObjects = _interopRequireDefault(require("@interactjs/utils/domObjects"));

var _defaultOptions = _interopRequireDefault(require("./defaultOptions"));

var _Eventable = _interopRequireDefault(require("./Eventable"));

var _Interactable = _interopRequireDefault(require("./Interactable"));

var _InteractableSet = _interopRequireDefault(require("./InteractableSet"));

var _InteractEvent = _interopRequireDefault(require("./InteractEvent"));

var _interactions = _interopRequireDefault(require("./interactions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var win = utils.win,
    browser = utils.browser,
    raf = utils.raf,
    Signals = utils.Signals,
    events = utils.events;
var ActionName;
exports.ActionName = ActionName;

(function (ActionName) {})(ActionName || (exports.ActionName = ActionName = {}));

function createScope() {
  return new Scope();
}

var Scope =
/*#__PURE__*/
function () {
  function Scope() {
    var _this = this;

    _classCallCheck(this, Scope);

    this.id = "__interact_scope_".concat(Math.floor(Math.random() * 100));
    this.signals = new Signals();
    this.browser = browser;
    this.events = events;
    this.utils = utils;
    this.defaults = utils.clone(_defaultOptions["default"]);
    this.Eventable = _Eventable["default"];
    this.actions = {
      names: [],
      methodDict: {},
      eventTypes: []
    };
    this.InteractEvent = _InteractEvent["default"];
    this.interactables = new _InteractableSet["default"](this); // all documents being listened to

    this.documents = [];
    this._plugins = [];
    this._pluginMap = {};

    this.onWindowUnload = function (event) {
      return _this.removeDocument(event.target);
    };

    var scope = this;

    this.Interactable =
    /*#__PURE__*/
    function (_InteractableBase) {
      _inherits(Interactable, _InteractableBase);

      function Interactable() {
        _classCallCheck(this, Interactable);

        return _possibleConstructorReturn(this, _getPrototypeOf(Interactable).apply(this, arguments));
      }

      _createClass(Interactable, [{
        key: "set",
        value: function set(options) {
          _get(_getPrototypeOf(Interactable.prototype), "set", this).call(this, options);

          scope.interactables.signals.fire('set', {
            options: options,
            interactable: this
          });
          return this;
        }
      }, {
        key: "unset",
        value: function unset() {
          _get(_getPrototypeOf(Interactable.prototype), "unset", this).call(this);

          for (var _i = 0; _i < scope.interactions.list.length; _i++) {
            var _ref;

            _ref = scope.interactions.list[_i];
            var interaction = _ref;

            if (interaction.interactable === this) {
              interaction.stop();
            }
          }

          scope.interactables.signals.fire('unset', {
            interactable: this
          });
        }
      }, {
        key: "_defaults",
        get: function get() {
          return scope.defaults;
        }
      }]);

      return Interactable;
    }(_Interactable["default"]);
  }

  _createClass(Scope, [{
    key: "init",
    value: function init(window) {
      return initScope(this, window);
    }
  }, {
    key: "pluginIsInstalled",
    value: function pluginIsInstalled(plugin) {
      return this._pluginMap[plugin.id] || this._plugins.indexOf(plugin) !== -1;
    }
  }, {
    key: "usePlugin",
    value: function usePlugin(plugin, options) {
      if (this.pluginIsInstalled(plugin)) {
        return this;
      }

      if (plugin.id) {
        this._pluginMap[plugin.id] = plugin;
      }

      plugin.install(this, options);

      this._plugins.push(plugin);

      return this;
    }
  }, {
    key: "addDocument",
    value: function addDocument(doc, options) {
      // do nothing if document is already known
      if (this.getDocIndex(doc) !== -1) {
        return false;
      }

      var window = win.getWindow(doc);
      options = options ? utils.extend({}, options) : {};
      this.documents.push({
        doc: doc,
        options: options
      });
      events.documents.push(doc); // don't add an unload event for the main document
      // so that the page may be cached in browser history

      if (doc !== this.document) {
        events.add(window, 'unload', this.onWindowUnload);
      }

      this.signals.fire('add-document', {
        doc: doc,
        window: window,
        scope: this,
        options: options
      });
    }
  }, {
    key: "removeDocument",
    value: function removeDocument(doc) {
      var index = this.getDocIndex(doc);
      var window = win.getWindow(doc);
      var options = this.documents[index].options;
      events.remove(window, 'unload', this.onWindowUnload);
      this.documents.splice(index, 1);
      events.documents.splice(index, 1);
      this.signals.fire('remove-document', {
        doc: doc,
        window: window,
        scope: this,
        options: options
      });
    }
  }, {
    key: "getDocIndex",
    value: function getDocIndex(doc) {
      for (var i = 0; i < this.documents.length; i++) {
        if (this.documents[i].doc === doc) {
          return i;
        }
      }

      return -1;
    }
  }, {
    key: "getDocOptions",
    value: function getDocOptions(doc) {
      var docIndex = this.getDocIndex(doc);
      return docIndex === -1 ? null : this.documents[docIndex].options;
    }
  }, {
    key: "now",
    value: function now() {
      return (this.window.Date || Date).now();
    }
  }]);

  return Scope;
}();

exports.Scope = Scope;

function initScope(scope, window) {
  win.init(window);

  _domObjects["default"].init(window);

  browser.init(window);
  raf.init(window);
  events.init(window);
  scope.usePlugin(_interactions["default"]);
  scope.document = window.document;
  scope.window = window;
  return scope;
}

},{"./Eventable":14,"./InteractEvent":15,"./Interactable":16,"./InteractableSet":17,"./defaultOptions":20,"./interactions":23,"@interactjs/utils":55,"@interactjs/utils/domObjects":49}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.touchAction = touchAction;
exports.boxSizing = boxSizing;
exports.noListeners = noListeners;
exports["default"] = exports.noListenersMessage = exports.boxSizingMessage = exports.touchActionMessage = exports.install = exports.links = void 0;

var _domObjects = _interopRequireDefault(require("@interactjs/utils/domObjects"));

var _domUtils = require("@interactjs/utils/domUtils");

var is = _interopRequireWildcard(require("@interactjs/utils/is"));

var _window = _interopRequireDefault(require("@interactjs/utils/window"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable no-console */

/* global process */
var links = {
  touchAction: 'https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action',
  boxSizing: 'https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing'
};
exports.links = links;
var install = undefined === 'production' ? function () {} // eslint-disable-next-line no-restricted-syntax
: function install(scope) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      logger = _ref.logger;

  logger = logger || console;

  if (undefined !== 'production') {
    scope.logger = logger;
    scope.interactions.signals.on('action-start', function (_ref2) {
      var interaction = _ref2.interaction;
      touchAction(interaction, scope.logger);
      boxSizing(interaction, scope.logger);
      noListeners(interaction, scope.logger);
    });
  }
};
exports.install = install;
var touchActionMessage = '[interact.js] Consider adding CSS "touch-action: none" to this element\n';
exports.touchActionMessage = touchActionMessage;
var boxSizingMessage = '[interact.js] Consider adding CSS "box-sizing: border-box" to this resizable element';
exports.boxSizingMessage = boxSizingMessage;
var noListenersMessage = '[interact.js] There are no listeners set for this action';
exports.noListenersMessage = noListenersMessage;

function touchAction(_ref3, logger) {
  var element = _ref3.element;

  if (!parentHasStyle(element, 'touchAction', /pan-|pinch|none/)) {
    logger.warn(touchActionMessage, element, links.touchAction);
  }
}

function boxSizing(interaction, logger) {
  var element = interaction.element;

  if (interaction.prepared.name === 'resize' && element instanceof _domObjects["default"].HTMLElement && !hasStyle(element, 'boxSizing', /border-box/)) {
    logger.warn(boxSizingMessage, element, links.boxSizing);
  }
}

function noListeners(interaction, logger) {
  var actionName = interaction.prepared.name;
  var moveListeners = interaction.interactable.events.types["".concat(actionName, "move")] || [];

  if (!moveListeners.length) {
    logger.warn(noListenersMessage, actionName, interaction.interactable);
  }
}

function hasStyle(element, prop, styleRe) {
  return styleRe.test(element.style[prop] || _window["default"].window.getComputedStyle(element)[prop]);
}

function parentHasStyle(element, prop, styleRe) {
  var parent = element;

  while (is.element(parent)) {
    if (hasStyle(parent, prop, styleRe)) {
      return true;
    }

    parent = (0, _domUtils.parentNode)(parent);
  }

  return false;
}

var _default = {
  id: 'dev-tools',
  install: install
};
exports["default"] = _default;

},{"@interactjs/utils/domObjects":49,"@interactjs/utils/domUtils":50,"@interactjs/utils/is":56,"@interactjs/utils/window":65}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _InteractEvent = require("@interactjs/core/InteractEvent");

var _base = _interopRequireDefault(require("@interactjs/modifiers/base"));

var utils = _interopRequireWildcard(require("@interactjs/utils"));

var _raf = _interopRequireDefault(require("@interactjs/utils/raf"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_InteractEvent.EventPhase.Resume = 'resume';
_InteractEvent.EventPhase.InertiaStart = 'inertiastart';

function install(scope) {
  var interactions = scope.interactions,
      defaults = scope.defaults;
  interactions.signals.on('new', function (_ref) {
    var interaction = _ref.interaction;
    interaction.inertia = {
      active: false,
      smoothEnd: false,
      allowResume: false,
      upCoords: {},
      timeout: null
    };
  }); // FIXME proper signal typing

  interactions.signals.on('before-action-end', function (arg) {
    return release(arg, scope);
  });
  interactions.signals.on('down', function (arg) {
    return resume(arg, scope);
  });
  interactions.signals.on('stop', function (arg) {
    return stop(arg);
  });
  defaults.perAction.inertia = {
    enabled: false,
    resistance: 10,
    minSpeed: 100,
    endSpeed: 10,
    allowResume: true,
    smoothEndDuration: 300
  };
  scope.usePlugin(_base["default"]);
}

function resume(_ref2, scope) {
  var interaction = _ref2.interaction,
      event = _ref2.event,
      pointer = _ref2.pointer,
      eventTarget = _ref2.eventTarget;
  var state = interaction.inertia; // Check if the down event hits the current inertia target

  if (state.active) {
    var element = eventTarget; // climb up the DOM tree from the event target

    while (utils.is.element(element)) {
      // if interaction element is the current inertia target element
      if (element === interaction.element) {
        // stop inertia
        _raf["default"].cancel(state.timeout);

        state.active = false;
        interaction.simulation = null; // update pointers to the down event's coordinates

        interaction.updatePointer(pointer, event, eventTarget, true);
        utils.pointer.setCoords(interaction.coords.cur, interaction.pointers.map(function (p) {
          return p.pointer;
        }), interaction._now()); // fire appropriate signals

        var signalArg = {
          interaction: interaction
        };
        scope.interactions.signals.fire('action-resume', signalArg); // fire a reume event

        var resumeEvent = new scope.InteractEvent(interaction, event, interaction.prepared.name, _InteractEvent.EventPhase.Resume, interaction.element);

        interaction._fireEvent(resumeEvent);

        utils.pointer.copyCoords(interaction.coords.prev, interaction.coords.cur);
        break;
      }

      element = utils.dom.parentNode(element);
    }
  }
}

function release(_ref3, scope) {
  var interaction = _ref3.interaction,
      event = _ref3.event,
      noPreEnd = _ref3.noPreEnd;
  var state = interaction.inertia;

  if (!interaction.interacting() || interaction.simulation && interaction.simulation.active || noPreEnd) {
    return null;
  }

  var options = getOptions(interaction);

  var now = interaction._now();

  var velocityClient = interaction.coords.velocity.client;
  var pointerSpeed = utils.hypot(velocityClient.x, velocityClient.y);
  var smoothEnd = false;
  var modifierResult; // check if inertia should be started

  var inertiaPossible = options && options.enabled && interaction.prepared.name !== 'gesture' && event !== state.startEvent;
  var inertia = inertiaPossible && now - interaction.coords.cur.timeStamp < 50 && pointerSpeed > options.minSpeed && pointerSpeed > options.endSpeed;
  var modifierArg = {
    interaction: interaction,
    pageCoords: utils.extend({}, interaction.coords.cur.page),
    states: inertiaPossible && interaction.modifiers.states.map(function (modifierStatus) {
      return utils.extend({}, modifierStatus);
    }),
    preEnd: true,
    prevCoords: undefined,
    requireEndOnly: null
  }; // smoothEnd

  if (inertiaPossible && !inertia) {
    modifierArg.prevCoords = interaction.prevEvent.page;
    modifierArg.requireEndOnly = false;
    modifierResult = _base["default"].setAll(modifierArg);

    if (modifierResult.changed) {
      smoothEnd = true;
    }
  }

  if (!(inertia || smoothEnd)) {
    return null;
  }

  utils.pointer.copyCoords(state.upCoords, interaction.coords.cur);
  interaction.pointers[0].pointer = state.startEvent = new scope.InteractEvent(interaction, event, // FIXME add proper typing Action.name
  interaction.prepared.name, _InteractEvent.EventPhase.InertiaStart, interaction.element);
  state.t0 = now;
  state.active = true;
  state.allowResume = options.allowResume;
  interaction.simulation = state;
  interaction.interactable.fire(state.startEvent);

  if (inertia) {
    state.vx0 = interaction.coords.velocity.client.x;
    state.vy0 = interaction.coords.velocity.client.y;
    state.v0 = pointerSpeed;
    calcInertia(interaction, state);
    utils.extend(modifierArg.pageCoords, interaction.coords.cur.page);
    modifierArg.pageCoords.x += state.xe;
    modifierArg.pageCoords.y += state.ye;
    modifierArg.prevCoords = undefined;
    modifierArg.requireEndOnly = true;
    modifierResult = _base["default"].setAll(modifierArg);
    state.modifiedXe += modifierResult.delta.x;
    state.modifiedYe += modifierResult.delta.y;
    state.timeout = _raf["default"].request(function () {
      return inertiaTick(interaction);
    });
  } else {
    state.smoothEnd = true;
    state.xe = modifierResult.delta.x;
    state.ye = modifierResult.delta.y;
    state.sx = state.sy = 0;
    state.timeout = _raf["default"].request(function () {
      return smothEndTick(interaction);
    });
  }

  return false;
}

function stop(_ref4) {
  var interaction = _ref4.interaction;
  var state = interaction.inertia;

  if (state.active) {
    _raf["default"].cancel(state.timeout);

    state.active = false;
    interaction.simulation = null;
  }
}

function calcInertia(interaction, state) {
  var options = getOptions(interaction);
  var lambda = options.resistance;
  var inertiaDur = -Math.log(options.endSpeed / state.v0) / lambda;
  state.x0 = interaction.prevEvent.page.x;
  state.y0 = interaction.prevEvent.page.y;
  state.t0 = state.startEvent.timeStamp / 1000;
  state.sx = state.sy = 0;
  state.modifiedXe = state.xe = (state.vx0 - inertiaDur) / lambda;
  state.modifiedYe = state.ye = (state.vy0 - inertiaDur) / lambda;
  state.te = inertiaDur;
  state.lambda_v0 = lambda / state.v0;
  state.one_ve_v0 = 1 - options.endSpeed / state.v0;
}

function inertiaTick(interaction) {
  updateInertiaCoords(interaction);
  utils.pointer.setCoordDeltas(interaction.coords.delta, interaction.coords.prev, interaction.coords.cur);
  utils.pointer.setCoordVelocity(interaction.coords.velocity, interaction.coords.delta);
  var state = interaction.inertia;
  var options = getOptions(interaction);
  var lambda = options.resistance;
  var t = interaction._now() / 1000 - state.t0;

  if (t < state.te) {
    var progress = 1 - (Math.exp(-lambda * t) - state.lambda_v0) / state.one_ve_v0;

    if (state.modifiedXe === state.xe && state.modifiedYe === state.ye) {
      state.sx = state.xe * progress;
      state.sy = state.ye * progress;
    } else {
      var quadPoint = utils.getQuadraticCurvePoint(0, 0, state.xe, state.ye, state.modifiedXe, state.modifiedYe, progress);
      state.sx = quadPoint.x;
      state.sy = quadPoint.y;
    }

    interaction.move();
    state.timeout = _raf["default"].request(function () {
      return inertiaTick(interaction);
    });
  } else {
    state.sx = state.modifiedXe;
    state.sy = state.modifiedYe;
    interaction.move();
    interaction.end(state.startEvent);
    state.active = false;
    interaction.simulation = null;
  }

  utils.pointer.copyCoords(interaction.coords.prev, interaction.coords.cur);
}

function smothEndTick(interaction) {
  updateInertiaCoords(interaction);
  var state = interaction.inertia;
  var t = interaction._now() - state.t0;

  var _getOptions = getOptions(interaction),
      duration = _getOptions.smoothEndDuration;

  if (t < duration) {
    state.sx = utils.easeOutQuad(t, 0, state.xe, duration);
    state.sy = utils.easeOutQuad(t, 0, state.ye, duration);
    interaction.move();
    state.timeout = _raf["default"].request(function () {
      return smothEndTick(interaction);
    });
  } else {
    state.sx = state.xe;
    state.sy = state.ye;
    interaction.move();
    interaction.end(state.startEvent);
    state.smoothEnd = state.active = false;
    interaction.simulation = null;
  }
}

function updateInertiaCoords(interaction) {
  var state = interaction.inertia; // return if inertia isn't running

  if (!state.active) {
    return;
  }

  var pageUp = state.upCoords.page;
  var clientUp = state.upCoords.client;
  utils.pointer.setCoords(interaction.coords.cur, [{
    pageX: pageUp.x + state.sx,
    pageY: pageUp.y + state.sy,
    clientX: clientUp.x + state.sx,
    clientY: clientUp.y + state.sy
  }], interaction._now());
}

function getOptions(_ref5) {
  var interactable = _ref5.interactable,
      prepared = _ref5.prepared;
  return interactable && interactable.options && prepared.name && interactable.options[prepared.name].inertia;
}

var _default = {
  id: 'inertia',
  install: install,
  calcInertia: calcInertia,
  inertiaTick: inertiaTick,
  smothEndTick: smothEndTick,
  updateInertiaCoords: updateInertiaCoords
};
exports["default"] = _default;

},{"@interactjs/core/InteractEvent":15,"@interactjs/modifiers/base":30,"@interactjs/utils":55,"@interactjs/utils/raf":61}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
Object.defineProperty(exports, "autoScroll", {
  enumerable: true,
  get: function get() {
    return _autoScroll["default"];
  }
});
Object.defineProperty(exports, "interactablePreventDefault", {
  enumerable: true,
  get: function get() {
    return _interactablePreventDefault["default"];
  }
});
Object.defineProperty(exports, "inertia", {
  enumerable: true,
  get: function get() {
    return _inertia["default"];
  }
});
Object.defineProperty(exports, "modifiers", {
  enumerable: true,
  get: function get() {
    return _base["default"];
  }
});
Object.defineProperty(exports, "reflow", {
  enumerable: true,
  get: function get() {
    return _reflow["default"];
  }
});
Object.defineProperty(exports, "interact", {
  enumerable: true,
  get: function get() {
    return _interact["default"];
  }
});
exports.pointerEvents = exports.actions = exports["default"] = void 0;

var actions = _interopRequireWildcard(require("@interactjs/actions"));

exports.actions = actions;

var _autoScroll = _interopRequireDefault(require("@interactjs/auto-scroll"));

var autoStart = _interopRequireWildcard(require("@interactjs/auto-start"));

var _interactablePreventDefault = _interopRequireDefault(require("@interactjs/core/interactablePreventDefault"));

var _devTools = _interopRequireDefault(require("@interactjs/dev-tools"));

var _inertia = _interopRequireDefault(require("@interactjs/inertia"));

var modifiers = _interopRequireWildcard(require("@interactjs/modifiers"));

var _base = _interopRequireDefault(require("@interactjs/modifiers/base"));

var pointerEvents = _interopRequireWildcard(require("@interactjs/pointer-events"));

exports.pointerEvents = pointerEvents;

var _reflow = _interopRequireDefault(require("@interactjs/reflow"));

var _interact = _interopRequireWildcard(require("./interact"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function init(window) {
  _interact.scope.init(window);

  _interact["default"].use(_interactablePreventDefault["default"]); // inertia


  _interact["default"].use(_inertia["default"]); // pointerEvents


  _interact["default"].use(pointerEvents); // autoStart, hold


  _interact["default"].use(autoStart); // drag and drop, resize, gesture


  _interact["default"].use(actions); // snap, resize, etc.


  _interact["default"].use(_base["default"]); // for backwrads compatibility


  for (var type in modifiers) {
    var _modifiers$type = modifiers[type],
        _defaults = _modifiers$type._defaults,
        _methods = _modifiers$type._methods;
    _defaults._methods = _methods;
    _interact.scope.defaults.perAction[type] = _defaults;
  } // autoScroll


  _interact["default"].use(_autoScroll["default"]); // reflow


  _interact["default"].use(_reflow["default"]); // eslint-disable-next-line no-undef


  if (undefined !== 'production') {
    _interact["default"].use(_devTools["default"]);
  }

  return _interact["default"];
} // eslint-disable-next-line no-undef


_interact["default"].version = init.version = "1.4.0-rc.13";
var _default = _interact["default"];
exports["default"] = _default;

},{"./interact":28,"@interactjs/actions":5,"@interactjs/auto-scroll":7,"@interactjs/auto-start":12,"@interactjs/core/interactablePreventDefault":21,"@interactjs/dev-tools":25,"@interactjs/inertia":26,"@interactjs/modifiers":31,"@interactjs/modifiers/base":30,"@interactjs/pointer-events":41,"@interactjs/reflow":43}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.scope = exports.interact = void 0;

var _scope = require("@interactjs/core/scope");

var utils = _interopRequireWildcard(require("@interactjs/utils"));

var _browser = _interopRequireDefault(require("@interactjs/utils/browser"));

var _events = _interopRequireDefault(require("@interactjs/utils/events"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

/** @module interact */
var globalEvents = {};
var scope = new _scope.Scope();
/**
 * ```js
 * interact('#draggable').draggable(true)
 *
 * var rectables = interact('rect')
 * rectables
 *   .gesturable(true)
 *   .on('gesturemove', function (event) {
 *       // ...
 *   })
 * ```
 *
 * The methods of this variable can be used to set elements as interactables
 * and also to change various default settings.
 *
 * Calling it as a function and passing an element or a valid CSS selector
 * string returns an Interactable object which has various methods to configure
 * it.
 *
 * @global
 *
 * @param {Element | string} target The HTML or SVG Element to interact with
 * or CSS selector
 * @return {Interactable}
 */

exports.scope = scope;

var interact = function interact(target, options) {
  var interactable = scope.interactables.get(target, options);

  if (!interactable) {
    interactable = scope.interactables["new"](target, options);
    interactable.events.global = globalEvents;
  }

  return interactable;
};
/**
 * Use a plugin
 *
 * @alias module:interact.use
 *
 * @param {Object} plugin
 * @param {function} plugin.install
 * @return {interact}
 */


exports.interact = interact;
interact.use = use;

function use(plugin, options) {
  scope.usePlugin(plugin, options);
  return interact;
}
/**
 * Check if an element or selector has been set with the {@link interact}
 * function
 *
 * @alias module:interact.isSet
 *
 * @param {Element} element The Element being searched for
 * @return {boolean} Indicates if the element or CSS selector was previously
 * passed to interact
 */


interact.isSet = isSet;

function isSet(target, options) {
  return !!scope.interactables.get(target, options && options.context);
}
/**
 * Add a global listener for an InteractEvent or adds a DOM event to `document`
 *
 * @alias module:interact.on
 *
 * @param {string | array | object} type The types of events to listen for
 * @param {function} listener The function event (s)
 * @param {object | boolean} [options] object or useCapture flag for
 * addEventListener
 * @return {object} interact
 */


interact.on = on;

function on(type, listener, options) {
  if (utils.is.string(type) && type.search(' ') !== -1) {
    type = type.trim().split(/ +/);
  }

  if (utils.is.array(type)) {
    for (var _i = 0; _i < type.length; _i++) {
      var _ref;

      _ref = type[_i];
      var eventType = _ref;
      interact.on(eventType, listener, options);
    }

    return interact;
  }

  if (utils.is.object(type)) {
    for (var prop in type) {
      interact.on(prop, type[prop], listener);
    }

    return interact;
  } // if it is an InteractEvent type, add listener to globalEvents


  if (utils.arr.contains(scope.actions.eventTypes, type)) {
    // if this type of event was never bound
    if (!globalEvents[type]) {
      globalEvents[type] = [listener];
    } else {
      globalEvents[type].push(listener);
    }
  } // If non InteractEvent type, addEventListener to document
  else {
      _events["default"].add(scope.document, type, listener, {
        options: options
      });
    }

  return interact;
}
/**
 * Removes a global InteractEvent listener or DOM event from `document`
 *
 * @alias module:interact.off
 *
 * @param {string | array | object} type The types of events that were listened
 * for
 * @param {function} listener The listener function to be removed
 * @param {object | boolean} options [options] object or useCapture flag for
 * removeEventListener
 * @return {object} interact
 */


interact.off = off;

function off(type, listener, options) {
  if (utils.is.string(type) && type.search(' ') !== -1) {
    type = type.trim().split(/ +/);
  }

  if (utils.is.array(type)) {
    for (var _i2 = 0; _i2 < type.length; _i2++) {
      var _ref2;

      _ref2 = type[_i2];
      var eventType = _ref2;
      interact.off(eventType, listener, options);
    }

    return interact;
  }

  if (utils.is.object(type)) {
    for (var prop in type) {
      interact.off(prop, type[prop], listener);
    }

    return interact;
  }

  if (!utils.arr.contains(scope.actions.eventTypes, type)) {
    _events["default"].remove(scope.document, type, listener, options);
  } else {
    var index;

    if (type in globalEvents && (index = globalEvents[type].indexOf(listener)) !== -1) {
      globalEvents[type].splice(index, 1);
    }
  }

  return interact;
}
/**
 * Returns an object which exposes internal data
 * @alias module:interact.debug
 *
 * @return {object} An object with properties that outline the current state
 * and expose internal functions and variables
 */


interact.debug = debug;

function debug() {
  return scope;
} // expose the functions used to calculate multi-touch properties


interact.getPointerAverage = utils.pointer.pointerAverage;
interact.getTouchBBox = utils.pointer.touchBBox;
interact.getTouchDistance = utils.pointer.touchDistance;
interact.getTouchAngle = utils.pointer.touchAngle;
interact.getElementRect = utils.dom.getElementRect;
interact.getElementClientRect = utils.dom.getElementClientRect;
interact.matchesSelector = utils.dom.matchesSelector;
interact.closest = utils.dom.closest;
/**
 * @alias module:interact.supportsTouch
 *
 * @return {boolean} Whether or not the browser supports touch input
 */

interact.supportsTouch = supportsTouch;

function supportsTouch() {
  return _browser["default"].supportsTouch;
}
/**
 * @alias module:interact.supportsPointerEvent
 *
 * @return {boolean} Whether or not the browser supports PointerEvents
 */


interact.supportsPointerEvent = supportsPointerEvent;

function supportsPointerEvent() {
  return _browser["default"].supportsPointerEvent;
}
/**
 * Cancels all interactions (end events are not fired)
 *
 * @alias module:interact.stop
 *
 * @return {object} interact
 */


interact.stop = stop;

function stop() {
  for (var _i3 = 0; _i3 < scope.interactions.list.length; _i3++) {
    var _ref3;

    _ref3 = scope.interactions.list[_i3];
    var interaction = _ref3;
    interaction.stop();
  }

  return interact;
}
/**
 * Returns or sets the distance the pointer must be moved before an action
 * sequence occurs. This also affects tolerance for tap events.
 *
 * @alias module:interact.pointerMoveTolerance
 *
 * @param {number} [newValue] The movement from the start position must be greater than this value
 * @return {interact | number}
 */


interact.pointerMoveTolerance = pointerMoveTolerance;

function pointerMoveTolerance(newValue) {
  if (utils.is.number(newValue)) {
    scope.interactions.pointerMoveTolerance = newValue;
    return interact;
  }

  return scope.interactions.pointerMoveTolerance;
}

scope.interactables.signals.on('unset', function (_ref4) {
  var interactable = _ref4.interactable;
  scope.interactables.list.splice(scope.interactables.list.indexOf(interactable), 1); // Stop related interactions when an Interactable is unset

  for (var _i4 = 0; _i4 < scope.interactions.list.length; _i4++) {
    var _ref5;

    _ref5 = scope.interactions.list[_i4];
    var interaction = _ref5;

    if (interaction.interactable === interactable && interaction.interacting() && interaction._ending) {
      interaction.stop();
    }
  }
});

interact.addDocument = function (doc, options) {
  return scope.addDocument(doc, options);
};

interact.removeDocument = function (doc) {
  return scope.removeDocument(doc);
};

scope.interact = interact;
var _default = interact;
exports["default"] = _default;

},{"@interactjs/core/scope":24,"@interactjs/utils":55,"@interactjs/utils/browser":47,"@interactjs/utils/events":51}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
exports["default"] = void 0;

var _interact = _interopRequireWildcard(require("@interactjs/interact"));

var modifiers = _interopRequireWildcard(require("@interactjs/modifiers"));

require("@interactjs/types");

var _extend = _interopRequireDefault(require("@interactjs/utils/extend"));

var snappers = _interopRequireWildcard(require("@interactjs/utils/snappers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object' && !!window) {
  init(window);
}

function init(win) {
  (0, _interact.init)(win);
  return _interact["default"].use({
    id: 'interactjs',
    install: function install(scope) {
      _interact["default"].modifiers = (0, _extend["default"])(scope.modifiers, modifiers);
      _interact["default"].snappers = snappers;
      _interact["default"].createSnapGrid = _interact["default"].snappers.grid;
    }
  });
}

var _default = _interact["default"];
exports["default"] = _default;
_interact["default"]['default'] = _interact["default"]; // tslint:disable-line no-string-literal

_interact["default"]['init'] = init; // tslint:disable-line no-string-literal

if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object' && !!module) {
  module.exports = _interact["default"];
}

},{"@interactjs/interact":27,"@interactjs/modifiers":31,"@interactjs/types":44,"@interactjs/utils/extend":52,"@interactjs/utils/snappers":64}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startAll = startAll;
exports.setAll = setAll;
exports.prepareStates = prepareStates;
exports.makeModifier = makeModifier;
exports["default"] = void 0;

var _extend = _interopRequireDefault(require("@interactjs/utils/extend"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function install(scope) {
  var interactions = scope.interactions;
  scope.defaults.perAction.modifiers = [];
  scope.modifiers = {};
  interactions.signals.on('new', function (_ref) {
    var interaction = _ref.interaction;
    interaction.modifiers = {
      startOffset: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      offsets: {},
      states: null,
      result: null
    };
  });
  interactions.signals.on('before-action-start', function (arg) {
    start(arg, arg.interaction.coords.start.page, scope.modifiers);
  });
  interactions.signals.on('action-resume', function (arg) {
    beforeMove(arg);
    start(arg, arg.interaction.coords.cur.page, scope.modifiers);
  });
  interactions.signals.on('after-action-move', restoreCoords);
  interactions.signals.on('before-action-move', beforeMove);
  interactions.signals.on('before-action-start', setCoords);
  interactions.signals.on('after-action-start', restoreCoords);
  interactions.signals.on('before-action-end', beforeEnd);
  interactions.signals.on('stop', stop);
}

function start(_ref2, pageCoords, registeredModifiers) {
  var interaction = _ref2.interaction,
      phase = _ref2.phase;
  var interactable = interaction.interactable,
      element = interaction.element;
  var modifierList = getModifierList(interaction, registeredModifiers);
  var states = prepareStates(modifierList);
  var rect = (0, _extend["default"])({}, interaction.rect);

  if (!('width' in rect)) {
    rect.width = rect.right - rect.left;
  }

  if (!('height' in rect)) {
    rect.height = rect.bottom - rect.top;
  }

  var startOffset = getRectOffset(rect, pageCoords);
  interaction.modifiers.startOffset = startOffset;
  interaction.modifiers.startDelta = {
    x: 0,
    y: 0
  };
  var arg = {
    interaction: interaction,
    interactable: interactable,
    element: element,
    pageCoords: pageCoords,
    phase: phase,
    rect: rect,
    startOffset: startOffset,
    states: states,
    preEnd: false,
    requireEndOnly: false
  };
  interaction.modifiers.states = states;
  interaction.modifiers.result = null;
  startAll(arg);
  arg.pageCoords = (0, _extend["default"])({}, interaction.coords.start.page);
  var result = interaction.modifiers.result = setAll(arg);
  return result;
}

function startAll(arg) {
  for (var _i = 0; _i < arg.states.length; _i++) {
    var _ref3;

    _ref3 = arg.states[_i];
    var state = _ref3;

    if (state.methods.start) {
      arg.state = state;
      state.methods.start(arg);
    }
  }
}

function setAll(arg) {
  var interaction = arg.interaction,
      _arg$modifiersState = arg.modifiersState,
      modifiersState = _arg$modifiersState === void 0 ? interaction.modifiers : _arg$modifiersState,
      _arg$prevCoords = arg.prevCoords,
      prevCoords = _arg$prevCoords === void 0 ? modifiersState.result ? modifiersState.result.coords : interaction.coords.prev.page : _arg$prevCoords,
      phase = arg.phase,
      preEnd = arg.preEnd,
      requireEndOnly = arg.requireEndOnly,
      rect = arg.rect,
      skipModifiers = arg.skipModifiers;
  var states = skipModifiers ? arg.states.slice(modifiersState.skip) : arg.states;
  arg.coords = (0, _extend["default"])({}, arg.pageCoords);
  arg.rect = (0, _extend["default"])({}, rect);
  var result = {
    delta: {
      x: 0,
      y: 0
    },
    rectDelta: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    coords: arg.coords,
    changed: true
  };

  for (var _i2 = 0; _i2 < states.length; _i2++) {
    var _ref4;

    _ref4 = states[_i2];
    var state = _ref4;
    var options = state.options;

    if (!state.methods.set || !shouldDo(options, preEnd, requireEndOnly, phase)) {
      continue;
    }

    arg.state = state;
    state.methods.set(arg);
  }

  result.delta.x = arg.coords.x - arg.pageCoords.x;
  result.delta.y = arg.coords.y - arg.pageCoords.y;
  var rectChanged = false;

  if (rect) {
    result.rectDelta.left = arg.rect.left - rect.left;
    result.rectDelta.right = arg.rect.right - rect.right;
    result.rectDelta.top = arg.rect.top - rect.top;
    result.rectDelta.bottom = arg.rect.bottom - rect.bottom;
    rectChanged = result.rectDelta.left !== 0 || result.rectDelta.right !== 0 || result.rectDelta.top !== 0 || result.rectDelta.bottom !== 0;
  }

  result.changed = prevCoords.x !== result.coords.x || prevCoords.y !== result.coords.y || rectChanged;
  return result;
}

function beforeMove(arg) {
  var interaction = arg.interaction,
      phase = arg.phase,
      preEnd = arg.preEnd,
      skipModifiers = arg.skipModifiers;
  var interactable = interaction.interactable,
      element = interaction.element;
  var modifierResult = setAll({
    interaction: interaction,
    interactable: interactable,
    element: element,
    preEnd: preEnd,
    phase: phase,
    pageCoords: interaction.coords.cur.page,
    rect: interaction.rect,
    states: interaction.modifiers.states,
    requireEndOnly: false,
    skipModifiers: skipModifiers
  });
  interaction.modifiers.result = modifierResult; // don't fire an action move if a modifier would keep the event in the same
  // cordinates as before

  if (!modifierResult.changed && interaction.interacting()) {
    return false;
  }

  setCoords(arg);
}

function beforeEnd(arg) {
  var interaction = arg.interaction,
      event = arg.event,
      noPreEnd = arg.noPreEnd;
  var states = interaction.modifiers.states;

  if (noPreEnd || !states || !states.length) {
    return;
  }

  var didPreEnd = false;

  for (var _i3 = 0; _i3 < states.length; _i3++) {
    var _ref5;

    _ref5 = states[_i3];
    var state = _ref5;
    arg.state = state;
    var options = state.options,
        methods = state.methods;
    var endResult = methods.beforeEnd && methods.beforeEnd(arg);

    if (endResult === false) {
      return false;
    } // if the endOnly option is true for any modifier


    if (!didPreEnd && shouldDo(options, true, true)) {
      // fire a move event at the modified coordinates
      interaction.move({
        event: event,
        preEnd: true
      });
      didPreEnd = true;
    }
  }
}

function stop(arg) {
  var interaction = arg.interaction;
  var states = interaction.modifiers.states;

  if (!states || !states.length) {
    return;
  }

  var modifierArg = (0, _extend["default"])({
    states: states,
    interactable: interaction.interactable,
    element: interaction.element
  }, arg);
  restoreCoords(arg);

  for (var _i4 = 0; _i4 < states.length; _i4++) {
    var _ref6;

    _ref6 = states[_i4];
    var state = _ref6;
    modifierArg.state = state;

    if (state.methods.stop) {
      state.methods.stop(modifierArg);
    }
  }

  arg.interaction.modifiers.states = null;
}

function getModifierList(interaction, registeredModifiers) {
  var actionOptions = interaction.interactable.options[interaction.prepared.name];
  var actionModifiers = actionOptions.modifiers;

  if (actionModifiers && actionModifiers.length) {
    return actionModifiers.filter(function (modifier) {
      return !modifier.options || modifier.options.enabled !== false;
    }).map(function (modifier) {
      if (!modifier.methods && modifier.type) {
        return registeredModifiers[modifier.type](modifier);
      }

      return modifier;
    });
  }

  return ['snap', 'snapSize', 'snapEdges', 'restrict', 'restrictEdges', 'restrictSize'].map(function (type) {
    var options = actionOptions[type];
    return options && options.enabled && {
      options: options,
      methods: options._methods
    };
  }).filter(function (m) {
    return !!m;
  });
}

function prepareStates(modifierList) {
  var states = [];

  for (var index = 0; index < modifierList.length; index++) {
    var _modifierList$index = modifierList[index],
        options = _modifierList$index.options,
        methods = _modifierList$index.methods,
        name = _modifierList$index.name;

    if (options && options.enabled === false) {
      continue;
    }

    var state = {
      options: options,
      methods: methods,
      index: index,
      name: name
    };
    states.push(state);
  }

  return states;
}

function setCoords(arg) {
  var interaction = arg.interaction,
      phase = arg.phase;
  var curCoords = arg.curCoords || interaction.coords.cur;
  var startCoords = arg.startCoords || interaction.coords.start;
  var _interaction$modifier = interaction.modifiers,
      result = _interaction$modifier.result,
      startDelta = _interaction$modifier.startDelta;
  var curDelta = result.delta;

  if (phase === 'start') {
    (0, _extend["default"])(interaction.modifiers.startDelta, result.delta);
  }

  var _arr = [[startCoords, startDelta], [curCoords, curDelta]];

  for (var _i5 = 0; _i5 < _arr.length; _i5++) {
    var _arr$_i = _slicedToArray(_arr[_i5], 2),
        coordsSet = _arr$_i[0],
        delta = _arr$_i[1];

    coordsSet.page.x += delta.x;
    coordsSet.page.y += delta.y;
    coordsSet.client.x += delta.x;
    coordsSet.client.y += delta.y;
  }

  var rectDelta = interaction.modifiers.result.rectDelta;
  var rect = arg.rect || interaction.rect;
  rect.left += rectDelta.left;
  rect.right += rectDelta.right;
  rect.top += rectDelta.top;
  rect.bottom += rectDelta.bottom;
  rect.width = rect.right - rect.left;
  rect.height = rect.bottom - rect.top;
}

function restoreCoords(_ref7) {
  var _ref7$interaction = _ref7.interaction,
      coords = _ref7$interaction.coords,
      rect = _ref7$interaction.rect,
      modifiers = _ref7$interaction.modifiers;

  if (!modifiers.result) {
    return;
  }

  var startDelta = modifiers.startDelta;
  var _modifiers$result = modifiers.result,
      curDelta = _modifiers$result.delta,
      rectDelta = _modifiers$result.rectDelta;
  var _arr2 = [[coords.start, startDelta], [coords.cur, curDelta]];

  for (var _i6 = 0; _i6 < _arr2.length; _i6++) {
    var _arr2$_i = _slicedToArray(_arr2[_i6], 2),
        coordsSet = _arr2$_i[0],
        delta = _arr2$_i[1];

    coordsSet.page.x -= delta.x;
    coordsSet.page.y -= delta.y;
    coordsSet.client.x -= delta.x;
    coordsSet.client.y -= delta.y;
  }

  rect.left -= rectDelta.left;
  rect.right -= rectDelta.right;
  rect.top -= rectDelta.top;
  rect.bottom -= rectDelta.bottom;
}

function shouldDo(options, preEnd, requireEndOnly, phase) {
  return options ? options.enabled !== false && (preEnd || !options.endOnly) && (!requireEndOnly || options.endOnly || options.alwaysOnEnd) && (options.setStart || phase !== 'start') : !requireEndOnly;
}

function getRectOffset(rect, coords) {
  return rect ? {
    left: coords.x - rect.left,
    top: coords.y - rect.top,
    right: rect.right - coords.x,
    bottom: rect.bottom - coords.y
  } : {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  };
}

function makeModifier(module, name) {
  var defaults = module.defaults;
  var methods = {
    start: module.start,
    set: module.set,
    beforeEnd: module.beforeEnd,
    stop: module.stop
  };

  var modifier = function modifier(options) {
    options = options || {}; // add missing defaults to options

    options.enabled = options.enabled !== false;

    for (var prop in defaults) {
      if (!(prop in options)) {
        options[prop] = defaults[prop];
      }
    }

    return {
      options: options,
      methods: methods,
      name: name
    };
  };

  if (typeof name === 'string') {
    Object.defineProperty(modifier, 'name', {
      value: name
    }); // for backwrads compatibility

    modifier._defaults = defaults;
    modifier._methods = methods;
  }

  return modifier;
}

var _default = {
  id: 'modifiers/base',
  install: install,
  startAll: startAll,
  setAll: setAll,
  prepareStates: prepareStates,
  start: start,
  beforeMove: beforeMove,
  beforeEnd: beforeEnd,
  stop: stop,
  shouldDo: shouldDo,
  getModifierList: getModifierList,
  getRectOffset: getRectOffset,
  makeModifier: makeModifier
};
exports["default"] = _default;

},{"@interactjs/utils/extend":52}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.restrictSize = exports.restrictEdges = exports.restrict = exports.snapEdges = exports.snapSize = exports.snap = void 0;

var _base = _interopRequireDefault(require("./base"));

var _edges = _interopRequireDefault(require("./restrict/edges"));

var _pointer = _interopRequireDefault(require("./restrict/pointer"));

var _size = _interopRequireDefault(require("./restrict/size"));

var _edges2 = _interopRequireDefault(require("./snap/edges"));

var _pointer2 = _interopRequireDefault(require("./snap/pointer"));

var _size2 = _interopRequireDefault(require("./snap/size"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var makeModifier = _base["default"].makeModifier;
var snap = makeModifier(_pointer2["default"], 'snap');
exports.snap = snap;
var snapSize = makeModifier(_size2["default"], 'snapSize');
exports.snapSize = snapSize;
var snapEdges = makeModifier(_edges2["default"], 'snapEdges');
exports.snapEdges = snapEdges;
var restrict = makeModifier(_pointer["default"], 'restrict');
exports.restrict = restrict;
var restrictEdges = makeModifier(_edges["default"], 'restrictEdges');
exports.restrictEdges = restrictEdges;
var restrictSize = makeModifier(_size["default"], 'restrictSize');
exports.restrictSize = restrictSize;

},{"./base":30,"./restrict/edges":32,"./restrict/pointer":33,"./restrict/size":34,"./snap/edges":35,"./snap/pointer":36,"./snap/size":37}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extend = _interopRequireDefault(require("@interactjs/utils/extend"));

var _rect = _interopRequireDefault(require("@interactjs/utils/rect"));

var _pointer = _interopRequireDefault(require("./pointer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// This module adds the options.resize.restrictEdges setting which sets min and
// max for the top, left, bottom and right edges of the target being resized.
//
// interact(target).resize({
//   edges: { top: true, left: true },
//   restrictEdges: {
//     inner: { top: 200, left: 200, right: 400, bottom: 400 },
//     outer: { top:   0, left:   0, right: 600, bottom: 600 },
//   },
// })
var getRestrictionRect = _pointer["default"].getRestrictionRect;
var noInner = {
  top: +Infinity,
  left: +Infinity,
  bottom: -Infinity,
  right: -Infinity
};
var noOuter = {
  top: -Infinity,
  left: -Infinity,
  bottom: +Infinity,
  right: +Infinity
};

function start(_ref) {
  var interaction = _ref.interaction,
      state = _ref.state;
  var options = state.options;
  var startOffset = interaction.modifiers.startOffset;
  var offset;

  if (options) {
    var offsetRect = getRestrictionRect(options.offset, interaction, interaction.coords.start.page);
    offset = _rect["default"].rectToXY(offsetRect);
  }

  offset = offset || {
    x: 0,
    y: 0
  };
  state.offset = {
    top: offset.y + startOffset.top,
    left: offset.x + startOffset.left,
    bottom: offset.y - startOffset.bottom,
    right: offset.x - startOffset.right
  };
}

function set(_ref2) {
  var coords = _ref2.coords,
      interaction = _ref2.interaction,
      state = _ref2.state;
  var offset = state.offset,
      options = state.options;
  var edges = interaction.prepared._linkedEdges || interaction.prepared.edges;

  if (!edges) {
    return;
  }

  var page = (0, _extend["default"])({}, coords);
  var inner = getRestrictionRect(options.inner, interaction, page) || {};
  var outer = getRestrictionRect(options.outer, interaction, page) || {};
  fixRect(inner, noInner);
  fixRect(outer, noOuter);

  if (edges.top) {
    coords.y = Math.min(Math.max(outer.top + offset.top, page.y), inner.top + offset.top);
  } else if (edges.bottom) {
    coords.y = Math.max(Math.min(outer.bottom + offset.bottom, page.y), inner.bottom + offset.bottom);
  }

  if (edges.left) {
    coords.x = Math.min(Math.max(outer.left + offset.left, page.x), inner.left + offset.left);
  } else if (edges.right) {
    coords.x = Math.max(Math.min(outer.right + offset.right, page.x), inner.right + offset.right);
  }
}

function fixRect(rect, defaults) {
  var _arr = ['top', 'left', 'bottom', 'right'];

  for (var _i = 0; _i < _arr.length; _i++) {
    var edge = _arr[_i];

    if (!(edge in rect)) {
      rect[edge] = defaults[edge];
    }
  }

  return rect;
}

var restrictEdges = {
  noInner: noInner,
  noOuter: noOuter,
  getRestrictionRect: getRestrictionRect,
  start: start,
  set: set,
  defaults: {
    enabled: false,
    inner: null,
    outer: null,
    offset: null
  }
};
var _default = restrictEdges;
exports["default"] = _default;

},{"./pointer":33,"@interactjs/utils/extend":52,"@interactjs/utils/rect":62}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var is = _interopRequireWildcard(require("@interactjs/utils/is"));

var _rect = _interopRequireDefault(require("@interactjs/utils/rect"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function start(_ref) {
  var rect = _ref.rect,
      startOffset = _ref.startOffset,
      state = _ref.state;
  var options = state.options;
  var elementRect = options.elementRect;
  var offset = {};

  if (rect && elementRect) {
    offset.left = startOffset.left - rect.width * elementRect.left;
    offset.top = startOffset.top - rect.height * elementRect.top;
    offset.right = startOffset.right - rect.width * (1 - elementRect.right);
    offset.bottom = startOffset.bottom - rect.height * (1 - elementRect.bottom);
  } else {
    offset.left = offset.top = offset.right = offset.bottom = 0;
  }

  state.offset = offset;
}

function set(_ref2) {
  var coords = _ref2.coords,
      interaction = _ref2.interaction,
      state = _ref2.state;
  var options = state.options,
      offset = state.offset;
  var restriction = getRestrictionRect(options.restriction, interaction, coords);

  if (!restriction) {
    return state;
  }

  var rect = restriction; // object is assumed to have
  // x, y, width, height or
  // left, top, right, bottom

  if ('x' in restriction && 'y' in restriction) {
    coords.x = Math.max(Math.min(rect.x + rect.width - offset.right, coords.x), rect.x + offset.left);
    coords.y = Math.max(Math.min(rect.y + rect.height - offset.bottom, coords.y), rect.y + offset.top);
  } else {
    coords.x = Math.max(Math.min(rect.right - offset.right, coords.x), rect.left + offset.left);
    coords.y = Math.max(Math.min(rect.bottom - offset.bottom, coords.y), rect.top + offset.top);
  }
}

function getRestrictionRect(value, interaction, coords) {
  if (is.func(value)) {
    return _rect["default"].resolveRectLike(value, interaction.interactable, interaction.element, [coords.x, coords.y, interaction]);
  } else {
    return _rect["default"].resolveRectLike(value, interaction.interactable, interaction.element);
  }
}

var restrict = {
  start: start,
  set: set,
  getRestrictionRect: getRestrictionRect,
  defaults: {
    enabled: false,
    restriction: null,
    elementRect: null
  }
};
var _default = restrict;
exports["default"] = _default;

},{"@interactjs/utils/is":56,"@interactjs/utils/rect":62}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extend = _interopRequireDefault(require("@interactjs/utils/extend"));

var _rect = _interopRequireDefault(require("@interactjs/utils/rect"));

var _edges = _interopRequireDefault(require("./edges"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// This module adds the options.resize.restrictSize setting which sets min and
// max width and height for the target being resized.
//
// interact(target).resize({
//   edges: { top: true, left: true },
//   restrictSize: {
//     min: { width: -600, height: -600 },
//     max: { width:  600, height:  600 },
//   },
// })
var noMin = {
  width: -Infinity,
  height: -Infinity
};
var noMax = {
  width: +Infinity,
  height: +Infinity
};

function start(arg) {
  return _edges["default"].start(arg);
}

function set(arg) {
  var interaction = arg.interaction,
      state = arg.state;
  var options = state.options;
  var edges = interaction.prepared.linkedEdges || interaction.prepared.edges;

  if (!edges) {
    return;
  }

  var rect = _rect["default"].xywhToTlbr(interaction.resizeRects.inverted);

  var minSize = _rect["default"].tlbrToXywh(_edges["default"].getRestrictionRect(options.min, interaction)) || noMin;
  var maxSize = _rect["default"].tlbrToXywh(_edges["default"].getRestrictionRect(options.max, interaction)) || noMax;
  state.options = {
    enabled: options.enabled,
    endOnly: options.endOnly,
    inner: (0, _extend["default"])({}, _edges["default"].noInner),
    outer: (0, _extend["default"])({}, _edges["default"].noOuter)
  };

  if (edges.top) {
    state.options.inner.top = rect.bottom - minSize.height;
    state.options.outer.top = rect.bottom - maxSize.height;
  } else if (edges.bottom) {
    state.options.inner.bottom = rect.top + minSize.height;
    state.options.outer.bottom = rect.top + maxSize.height;
  }

  if (edges.left) {
    state.options.inner.left = rect.right - minSize.width;
    state.options.outer.left = rect.right - maxSize.width;
  } else if (edges.right) {
    state.options.inner.right = rect.left + minSize.width;
    state.options.outer.right = rect.left + maxSize.width;
  }

  _edges["default"].set(arg);

  state.options = options;
}

var restrictSize = {
  start: start,
  set: set,
  defaults: {
    enabled: false,
    min: null,
    max: null
  }
};
var _default = restrictSize;
exports["default"] = _default;

},{"./edges":32,"@interactjs/utils/extend":52,"@interactjs/utils/rect":62}],35:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _clone = _interopRequireDefault(require("@interactjs/utils/clone"));

var _extend = _interopRequireDefault(require("@interactjs/utils/extend"));

var _size = _interopRequireDefault(require("./size"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @module modifiers/snapEdges
 *
 * @description
 * This module allows snapping of the edges of targets during resize
 * interactions.
 *
 * @example
 * interact(target).resizable({
 *   snapEdges: {
 *     targets: [interact.snappers.grid({ x: 100, y: 50 })],
 *   },
 * })
 *
 * interact(target).resizable({
 *   snapEdges: {
 *     targets: [
 *       interact.snappers.grid({
 *        top: 50,
 *        left: 50,
 *        bottom: 100,
 *        right: 100,
 *       }),
 *     ],
 *   },
 * })
 */
function start(arg) {
  var edges = arg.interaction.prepared.edges;

  if (!edges) {
    return null;
  }

  arg.state.targetFields = arg.state.targetFields || [[edges.left ? 'left' : 'right', edges.top ? 'top' : 'bottom']];
  return _size["default"].start(arg);
}

function set(arg) {
  return _size["default"].set(arg);
}

var snapEdges = {
  start: start,
  set: set,
  defaults: (0, _extend["default"])((0, _clone["default"])(_size["default"].defaults), {
    offset: {
      x: 0,
      y: 0
    }
  })
};
var _default = snapEdges;
exports["default"] = _default;

},{"./size":37,"@interactjs/utils/clone":48,"@interactjs/utils/extend":52}],36:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var utils = _interopRequireWildcard(require("@interactjs/utils"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function start(arg) {
  var interaction = arg.interaction,
      interactable = arg.interactable,
      element = arg.element,
      rect = arg.rect,
      state = arg.state,
      startOffset = arg.startOffset;
  var options = state.options;
  var offsets = [];
  var origin = options.offsetWithOrigin ? getOrigin(arg) : {
    x: 0,
    y: 0
  };
  var snapOffset;

  if (options.offset === 'startCoords') {
    snapOffset = {
      x: interaction.coords.start.page.x,
      y: interaction.coords.start.page.y
    };
  } else {
    var offsetRect = utils.rect.resolveRectLike(options.offset, interactable, element, [interaction]);
    snapOffset = utils.rect.rectToXY(offsetRect) || {
      x: 0,
      y: 0
    };
    snapOffset.x += origin.x;
    snapOffset.y += origin.y;
  }

  var relativePoints = options.relativePoints || [];

  if (rect && options.relativePoints && options.relativePoints.length) {
    for (var index = 0; index < relativePoints.length; index++) {
      var relativePoint = relativePoints[index];
      offsets.push({
        index: index,
        relativePoint: relativePoint,
        x: startOffset.left - rect.width * relativePoint.x + snapOffset.x,
        y: startOffset.top - rect.height * relativePoint.y + snapOffset.y
      });
    }
  } else {
    offsets.push(utils.extend({
      index: 0,
      relativePoint: null
    }, snapOffset));
  }

  state.offsets = offsets;
}

function set(arg) {
  var interaction = arg.interaction,
      coords = arg.coords,
      state = arg.state;
  var options = state.options,
      offsets = state.offsets;
  var origin = utils.getOriginXY(interaction.interactable, interaction.element, interaction.prepared.name);
  var page = utils.extend({}, coords);
  var targets = [];
  var target;

  if (!options.offsetWithOrigin) {
    page.x -= origin.x;
    page.y -= origin.y;
  }

  state.realX = page.x;
  state.realY = page.y;

  for (var _i = 0; _i < offsets.length; _i++) {
    var _ref;

    _ref = offsets[_i];
    var offset = _ref;
    var relativeX = page.x - offset.x;
    var relativeY = page.y - offset.y;

    for (var index = 0, _len = options.targets.length; index < _len; index++) {
      var snapTarget = options.targets[index];

      if (utils.is.func(snapTarget)) {
        target = snapTarget(relativeX, relativeY, interaction, offset, index);
      } else {
        target = snapTarget;
      }

      if (!target) {
        continue;
      }

      targets.push({
        x: (utils.is.number(target.x) ? target.x : relativeX) + offset.x,
        y: (utils.is.number(target.y) ? target.y : relativeY) + offset.y,
        range: utils.is.number(target.range) ? target.range : options.range
      });
    }
  }

  var closest = {
    target: null,
    inRange: false,
    distance: 0,
    range: 0,
    dx: 0,
    dy: 0
  };

  for (var i = 0, len = targets.length; i < len; i++) {
    target = targets[i];
    var range = target.range;
    var dx = target.x - page.x;
    var dy = target.y - page.y;
    var distance = utils.hypot(dx, dy);
    var inRange = distance <= range; // Infinite targets count as being out of range
    // compared to non infinite ones that are in range

    if (range === Infinity && closest.inRange && closest.range !== Infinity) {
      inRange = false;
    }

    if (!closest.target || (inRange // is the closest target in range?
    ? closest.inRange && range !== Infinity // the pointer is relatively deeper in this target
    ? distance / range < closest.distance / closest.range // this target has Infinite range and the closest doesn't
    : range === Infinity && closest.range !== Infinity || // OR this target is closer that the previous closest
    distance < closest.distance : // The other is not in range and the pointer is closer to this target
    !closest.inRange && distance < closest.distance)) {
      closest.target = target;
      closest.distance = distance;
      closest.range = range;
      closest.inRange = inRange;
      closest.dx = dx;
      closest.dy = dy;
      state.range = range;
    }
  }

  if (closest.inRange) {
    coords.x = closest.target.x;
    coords.y = closest.target.y;
  }

  state.closest = closest;
}

function getOrigin(arg) {
  var optionsOrigin = utils.rect.rectToXY(utils.rect.resolveRectLike(arg.state.options.origin));
  var origin = optionsOrigin || utils.getOriginXY(arg.interactable, arg.interaction.element, arg.interaction.prepared.name);
  return origin;
}

var snap = {
  start: start,
  set: set,
  defaults: {
    enabled: false,
    range: Infinity,
    targets: null,
    offset: null,
    offsetWithOrigin: true,
    relativePoints: null
  }
};
var _default = snap;
exports["default"] = _default;

},{"@interactjs/utils":55}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extend = _interopRequireDefault(require("@interactjs/utils/extend"));

var is = _interopRequireWildcard(require("@interactjs/utils/is"));

var _pointer = _interopRequireDefault(require("./pointer"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function start(arg) {
  var interaction = arg.interaction,
      state = arg.state;
  var options = state.options;
  var edges = interaction.prepared.edges;

  if (!edges) {
    return null;
  }

  arg.state = {
    options: {
      relativePoints: [{
        x: edges.left ? 0 : 1,
        y: edges.top ? 0 : 1
      }],
      origin: {
        x: 0,
        y: 0
      },
      offset: options.offset || 'self',
      range: options.range
    }
  };
  state.targetFields = state.targetFields || [['width', 'height'], ['x', 'y']];

  _pointer["default"].start(arg);

  state.offsets = arg.state.offsets;
  arg.state = state;
}

function set(arg) {
  var interaction = arg.interaction,
      state = arg.state,
      coords = arg.coords;
  var options = state.options,
      offsets = state.offsets;
  var relative = {
    x: coords.x - offsets[0].x,
    y: coords.y - offsets[0].y
  };
  state.options = (0, _extend["default"])({}, options);
  state.options.targets = [];

  for (var _i = 0; _i < (options.targets || []).length; _i++) {
    var _ref;

    _ref = (options.targets || [])[_i];
    var snapTarget = _ref;
    var target = void 0;

    if (is.func(snapTarget)) {
      target = snapTarget(relative.x, relative.y, interaction);
    } else {
      target = snapTarget;
    }

    if (!target) {
      continue;
    }

    for (var _i2 = 0; _i2 < state.targetFields.length; _i2++) {
      var _ref2;

      _ref2 = state.targetFields[_i2];

      var _ref3 = _ref2,
          _ref4 = _slicedToArray(_ref3, 2),
          xField = _ref4[0],
          yField = _ref4[1];

      if (xField in target || yField in target) {
        target.x = target[xField];
        target.y = target[yField];
        break;
      }
    }

    state.options.targets.push(target);
  }

  _pointer["default"].set(arg);

  state.options = options;
}

var snapSize = {
  start: start,
  set: set,
  defaults: {
    enabled: false,
    range: Infinity,
    targets: null,
    offset: null
  }
};
var _default = snapSize;
exports["default"] = _default;

},{"./pointer":36,"@interactjs/utils/extend":52,"@interactjs/utils/is":56}],38:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _BaseEvent2 = _interopRequireDefault(require("@interactjs/core/BaseEvent"));

var _pointerUtils = _interopRequireDefault(require("@interactjs/utils/pointerUtils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/** */
var PointerEvent =
/*#__PURE__*/
function (_BaseEvent) {
  _inherits(PointerEvent, _BaseEvent);

  /** */
  function PointerEvent(type, pointer, event, eventTarget, interaction, timeStamp) {
    var _this;

    _classCallCheck(this, PointerEvent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PointerEvent).call(this, interaction));

    _pointerUtils["default"].pointerExtend(_assertThisInitialized(_this), event);

    if (event !== pointer) {
      _pointerUtils["default"].pointerExtend(_assertThisInitialized(_this), pointer);
    }

    _this.timeStamp = timeStamp;
    _this.originalEvent = event;
    _this.type = type;
    _this.pointerId = _pointerUtils["default"].getPointerId(pointer);
    _this.pointerType = _pointerUtils["default"].getPointerType(pointer);
    _this.target = eventTarget;
    _this.currentTarget = null;

    if (type === 'tap') {
      var pointerIndex = interaction.getPointerIndex(pointer);
      _this.dt = _this.timeStamp - interaction.pointers[pointerIndex].downTime;
      var interval = _this.timeStamp - interaction.tapTime;
      _this["double"] = !!(interaction.prevTap && interaction.prevTap.type !== 'doubletap' && interaction.prevTap.target === _this.target && interval < 500);
    } else if (type === 'doubletap') {
      _this.dt = pointer.timeStamp - interaction.tapTime;
    }

    return _this;
  }

  _createClass(PointerEvent, [{
    key: "_subtractOrigin",
    value: function _subtractOrigin(_ref) {
      var originX = _ref.x,
          originY = _ref.y;
      this.pageX -= originX;
      this.pageY -= originY;
      this.clientX -= originX;
      this.clientY -= originY;
      return this;
    }
  }, {
    key: "_addOrigin",
    value: function _addOrigin(_ref2) {
      var originX = _ref2.x,
          originY = _ref2.y;
      this.pageX += originX;
      this.pageY += originY;
      this.clientX += originX;
      this.clientY += originY;
      return this;
    }
    /**
     * Prevent the default behaviour of the original Event
     */

  }, {
    key: "preventDefault",
    value: function preventDefault() {
      this.originalEvent.preventDefault();
    }
  }]);

  return PointerEvent;
}(_BaseEvent2["default"]);

exports["default"] = PointerEvent;

},{"@interactjs/core/BaseEvent":13,"@interactjs/utils/pointerUtils":60}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var utils = _interopRequireWildcard(require("@interactjs/utils"));

var _PointerEvent = _interopRequireDefault(require("./PointerEvent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var signals = new utils.Signals();
var simpleSignals = ['down', 'up', 'cancel'];
var simpleEvents = ['down', 'up', 'cancel'];
var defaults = {
  holdDuration: 600,
  ignoreFrom: null,
  allowFrom: null,
  origin: {
    x: 0,
    y: 0
  }
};
var pointerEvents = {
  id: 'pointer-events/base',
  install: install,
  signals: signals,
  PointerEvent: _PointerEvent["default"],
  fire: fire,
  collectEventTargets: collectEventTargets,
  createSignalListener: createSignalListener,
  defaults: defaults,
  types: ['down', 'move', 'up', 'cancel', 'tap', 'doubletap', 'hold']
};

function fire(arg, scope) {
  var interaction = arg.interaction,
      pointer = arg.pointer,
      event = arg.event,
      eventTarget = arg.eventTarget,
      _arg$type = arg.type,
      type = _arg$type === void 0 ? arg.pointerEvent.type : _arg$type,
      _arg$targets = arg.targets,
      targets = _arg$targets === void 0 ? collectEventTargets(arg) : _arg$targets;
  var _arg$pointerEvent = arg.pointerEvent,
      pointerEvent = _arg$pointerEvent === void 0 ? new _PointerEvent["default"](type, pointer, event, eventTarget, interaction, scope.now()) : _arg$pointerEvent;
  var signalArg = {
    interaction: interaction,
    pointer: pointer,
    event: event,
    eventTarget: eventTarget,
    targets: targets,
    type: type,
    pointerEvent: pointerEvent
  };

  for (var i = 0; i < targets.length; i++) {
    var target = targets[i];

    for (var prop in target.props || {}) {
      pointerEvent[prop] = target.props[prop];
    }

    var origin = utils.getOriginXY(target.eventable, target.element);

    pointerEvent._subtractOrigin(origin);

    pointerEvent.eventable = target.eventable;
    pointerEvent.currentTarget = target.element;
    target.eventable.fire(pointerEvent);

    pointerEvent._addOrigin(origin);

    if (pointerEvent.immediatePropagationStopped || pointerEvent.propagationStopped && i + 1 < targets.length && targets[i + 1].element !== pointerEvent.currentTarget) {
      break;
    }
  }

  signals.fire('fired', signalArg);

  if (type === 'tap') {
    // if pointerEvent should make a double tap, create and fire a doubletap
    // PointerEvent and use that as the prevTap
    var prevTap = pointerEvent["double"] ? fire({
      interaction: interaction,
      pointer: pointer,
      event: event,
      eventTarget: eventTarget,
      type: 'doubletap'
    }, scope) : pointerEvent;
    interaction.prevTap = prevTap;
    interaction.tapTime = prevTap.timeStamp;
  }

  return pointerEvent;
}

function collectEventTargets(_ref) {
  var interaction = _ref.interaction,
      pointer = _ref.pointer,
      event = _ref.event,
      eventTarget = _ref.eventTarget,
      type = _ref.type;
  var pointerIndex = interaction.getPointerIndex(pointer);
  var pointerInfo = interaction.pointers[pointerIndex]; // do not fire a tap event if the pointer was moved before being lifted

  if (type === 'tap' && (interaction.pointerWasMoved || // or if the pointerup target is different to the pointerdown target
  !(pointerInfo && pointerInfo.downTarget === eventTarget))) {
    return [];
  }

  var path = utils.dom.getPath(eventTarget);
  var signalArg = {
    interaction: interaction,
    pointer: pointer,
    event: event,
    eventTarget: eventTarget,
    type: type,
    path: path,
    targets: [],
    element: null
  };

  for (var _i = 0; _i < path.length; _i++) {
    var _ref2;

    _ref2 = path[_i];
    var element = _ref2;
    signalArg.element = element;
    signals.fire('collect-targets', signalArg);
  }

  if (type === 'hold') {
    signalArg.targets = signalArg.targets.filter(function (target) {
      return target.eventable.options.holdDuration === interaction.pointers[pointerIndex].hold.duration;
    });
  }

  return signalArg.targets;
}

function install(scope) {
  var interactions = scope.interactions;
  scope.pointerEvents = pointerEvents;
  scope.defaults.actions.pointerEvents = pointerEvents.defaults;
  interactions.signals.on('new', function (_ref3) {
    var interaction = _ref3.interaction;
    interaction.prevTap = null; // the most recent tap event on this interaction

    interaction.tapTime = 0; // time of the most recent tap event
  });
  interactions.signals.on('update-pointer', function (_ref4) {
    var down = _ref4.down,
        pointerInfo = _ref4.pointerInfo;

    if (!down && pointerInfo.hold) {
      return;
    }

    pointerInfo.hold = {
      duration: Infinity,
      timeout: null
    };
  });
  interactions.signals.on('move', function (_ref5) {
    var interaction = _ref5.interaction,
        pointer = _ref5.pointer,
        event = _ref5.event,
        eventTarget = _ref5.eventTarget,
        duplicateMove = _ref5.duplicateMove;
    var pointerIndex = interaction.getPointerIndex(pointer);

    if (!duplicateMove && (!interaction.pointerIsDown || interaction.pointerWasMoved)) {
      if (interaction.pointerIsDown) {
        clearTimeout(interaction.pointers[pointerIndex].hold.timeout);
      }

      fire({
        interaction: interaction,
        pointer: pointer,
        event: event,
        eventTarget: eventTarget,
        type: 'move'
      }, scope);
    }
  });
  interactions.signals.on('down', function (_ref6) {
    var interaction = _ref6.interaction,
        pointer = _ref6.pointer,
        event = _ref6.event,
        eventTarget = _ref6.eventTarget,
        pointerIndex = _ref6.pointerIndex;
    var timer = interaction.pointers[pointerIndex].hold;
    var path = utils.dom.getPath(eventTarget);
    var signalArg = {
      interaction: interaction,
      pointer: pointer,
      event: event,
      eventTarget: eventTarget,
      type: 'hold',
      targets: [],
      path: path,
      element: null
    };

    for (var _i2 = 0; _i2 < path.length; _i2++) {
      var _ref7;

      _ref7 = path[_i2];
      var element = _ref7;
      signalArg.element = element;
      signals.fire('collect-targets', signalArg);
    }

    if (!signalArg.targets.length) {
      return;
    }

    var minDuration = Infinity;

    for (var _i3 = 0; _i3 < signalArg.targets.length; _i3++) {
      var _ref8;

      _ref8 = signalArg.targets[_i3];
      var target = _ref8;
      var holdDuration = target.eventable.options.holdDuration;

      if (holdDuration < minDuration) {
        minDuration = holdDuration;
      }
    }

    timer.duration = minDuration;
    timer.timeout = setTimeout(function () {
      fire({
        interaction: interaction,
        eventTarget: eventTarget,
        pointer: pointer,
        event: event,
        type: 'hold'
      }, scope);
    }, minDuration);
  });
  var _arr = ['up', 'cancel'];

  for (var _i4 = 0; _i4 < _arr.length; _i4++) {
    var signalName = _arr[_i4];
    interactions.signals.on(signalName, function (_ref10) {
      var interaction = _ref10.interaction,
          pointerIndex = _ref10.pointerIndex;

      if (interaction.pointers[pointerIndex].hold) {
        clearTimeout(interaction.pointers[pointerIndex].hold.timeout);
      }
    });
  }

  for (var i = 0; i < simpleSignals.length; i++) {
    interactions.signals.on(simpleSignals[i], createSignalListener(simpleEvents[i], scope));
  }

  interactions.signals.on('up', function (_ref9) {
    var interaction = _ref9.interaction,
        pointer = _ref9.pointer,
        event = _ref9.event,
        eventTarget = _ref9.eventTarget;

    if (!interaction.pointerWasMoved) {
      fire({
        interaction: interaction,
        eventTarget: eventTarget,
        pointer: pointer,
        event: event,
        type: 'tap'
      }, scope);
    }
  });
}

function createSignalListener(type, scope) {
  return function (_ref11) {
    var interaction = _ref11.interaction,
        pointer = _ref11.pointer,
        event = _ref11.event,
        eventTarget = _ref11.eventTarget;
    fire({
      interaction: interaction,
      eventTarget: eventTarget,
      pointer: pointer,
      event: event,
      type: type
    }, scope);
  };
}

var _default = pointerEvents;
exports["default"] = _default;

},{"./PointerEvent":38,"@interactjs/utils":55}],40:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _base = _interopRequireDefault(require("./base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function install(scope) {
  var pointerEvents = scope.pointerEvents,
      interactions = scope.interactions;
  scope.usePlugin(_base["default"]);
  pointerEvents.signals.on('new', onNew);
  pointerEvents.signals.on('fired', function (arg) {
    return onFired(arg, scope);
  });
  var _arr = ['move', 'up', 'cancel', 'endall'];

  for (var _i = 0; _i < _arr.length; _i++) {
    var signal = _arr[_i];
    interactions.signals.on(signal, endHoldRepeat);
  } // don't repeat by default


  pointerEvents.defaults.holdRepeatInterval = 0;
  pointerEvents.types.push('holdrepeat');
}

function onNew(_ref) {
  var pointerEvent = _ref.pointerEvent;

  if (pointerEvent.type !== 'hold') {
    return;
  }

  pointerEvent.count = (pointerEvent.count || 0) + 1;
}

function onFired(_ref2, scope) {
  var interaction = _ref2.interaction,
      pointerEvent = _ref2.pointerEvent,
      eventTarget = _ref2.eventTarget,
      targets = _ref2.targets;

  if (pointerEvent.type !== 'hold' || !targets.length) {
    return;
  } // get the repeat interval from the first eventable


  var interval = targets[0].eventable.options.holdRepeatInterval; // don't repeat if the interval is 0 or less

  if (interval <= 0) {
    return;
  } // set a timeout to fire the holdrepeat event


  interaction.holdIntervalHandle = setTimeout(function () {
    scope.pointerEvents.fire({
      interaction: interaction,
      eventTarget: eventTarget,
      type: 'hold',
      pointer: pointerEvent,
      event: pointerEvent
    }, scope);
  }, interval);
}

function endHoldRepeat(_ref3) {
  var interaction = _ref3.interaction;

  // set the interaction's holdStopTime property
  // to stop further holdRepeat events
  if (interaction.holdIntervalHandle) {
    clearInterval(interaction.holdIntervalHandle);
    interaction.holdIntervalHandle = null;
  }
}

var _default = {
  id: 'pointer-events/holdRepeat',
  install: install
};
exports["default"] = _default;

},{"./base":39}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.install = install;
Object.defineProperty(exports, "pointerEvents", {
  enumerable: true,
  get: function get() {
    return _base["default"];
  }
});
Object.defineProperty(exports, "holdRepeat", {
  enumerable: true,
  get: function get() {
    return _holdRepeat["default"];
  }
});
Object.defineProperty(exports, "interactableTargets", {
  enumerable: true,
  get: function get() {
    return _interactableTargets["default"];
  }
});
exports.id = void 0;

var _base = _interopRequireDefault(require("./base"));

var _holdRepeat = _interopRequireDefault(require("./holdRepeat"));

var _interactableTargets = _interopRequireDefault(require("./interactableTargets"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function install(scope) {
  scope.usePlugin(_base["default"]);
  scope.usePlugin(_holdRepeat["default"]);
  scope.usePlugin(_interactableTargets["default"]);
}

var id = 'pointer-events';
exports.id = id;

},{"./base":39,"./holdRepeat":40,"./interactableTargets":42}],42:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _arr = require("@interactjs/utils/arr");

var _extend = _interopRequireDefault(require("@interactjs/utils/extend"));

var is = _interopRequireWildcard(require("@interactjs/utils/is"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function install(scope) {
  var pointerEvents = scope.pointerEvents,
      actions = scope.actions,
      Interactable = scope.Interactable,
      interactables = scope.interactables;
  pointerEvents.signals.on('collect-targets', function (_ref) {
    var targets = _ref.targets,
        element = _ref.element,
        type = _ref.type,
        eventTarget = _ref.eventTarget;
    scope.interactables.forEachMatch(element, function (interactable) {
      var eventable = interactable.events;
      var options = eventable.options;

      if (eventable.types[type] && eventable.types[type].length && is.element(element) && interactable.testIgnoreAllow(options, element, eventTarget)) {
        targets.push({
          element: element,
          eventable: eventable,
          props: {
            interactable: interactable
          }
        });
      }
    });
  });
  interactables.signals.on('new', function (_ref2) {
    var interactable = _ref2.interactable;

    interactable.events.getRect = function (element) {
      return interactable.getRect(element);
    };
  });
  interactables.signals.on('set', function (_ref3) {
    var interactable = _ref3.interactable,
        options = _ref3.options;
    (0, _extend["default"])(interactable.events.options, pointerEvents.defaults);
    (0, _extend["default"])(interactable.events.options, options.pointerEvents || {});
  });
  (0, _arr.merge)(actions.eventTypes, pointerEvents.types);
  Interactable.prototype.pointerEvents = pointerEventsMethod;
  var __backCompatOption = Interactable.prototype._backCompatOption;

  Interactable.prototype._backCompatOption = function (optionName, newValue) {
    var ret = __backCompatOption.call(this, optionName, newValue);

    if (ret === this) {
      this.events.options[optionName] = newValue;
    }

    return ret;
  };
}

function pointerEventsMethod(options) {
  (0, _extend["default"])(this.events.options, options);
  return this;
}

var _default = {
  id: 'pointer-events/interactableTargets',
  install: install
};
exports["default"] = _default;

},{"@interactjs/utils/arr":46,"@interactjs/utils/extend":52,"@interactjs/utils/is":56}],43:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.install = install;
exports["default"] = void 0;

var _InteractEvent = require("@interactjs/core/InteractEvent");

var _utils = require("@interactjs/utils");

_InteractEvent.EventPhase.Reflow = 'reflow';

function install(scope) {
  var actions = scope.actions,
      interactions = scope.interactions,
      Interactable = scope.Interactable; // add action reflow event types

  for (var _i = 0; _i < actions.names.length; _i++) {
    var _ref;

    _ref = actions.names[_i];
    var actionName = _ref;
    actions.eventTypes.push("".concat(actionName, "reflow"));
  } // remove completed reflow interactions


  interactions.signals.on('stop', function (_ref2) {
    var interaction = _ref2.interaction;

    if (interaction.pointerType === _InteractEvent.EventPhase.Reflow) {
      if (interaction._reflowResolve) {
        interaction._reflowResolve();
      }

      _utils.arr.remove(scope.interactions.list, interaction);
    }
  });
  /**
   * ```js
   * const interactable = interact(target)
   * const drag = { name: drag, axis: 'x' }
   * const resize = { name: resize, edges: { left: true, bottom: true }
   *
   * interactable.reflow(drag)
   * interactable.reflow(resize)
   * ```
   *
   * Start an action sequence to re-apply modifiers, check drops, etc.
   *
   * @param { Object } action The action to begin
   * @param { string } action.name The name of the action
   * @returns { Promise<Interactable> }
   */

  Interactable.prototype.reflow = function (action) {
    return reflow(this, action, scope);
  };
}

function reflow(interactable, action, scope) {
  var elements = _utils.is.string(interactable.target) ? _utils.arr.from(interactable._context.querySelectorAll(interactable.target)) : [interactable.target]; // tslint:disable-next-line variable-name

  var Promise = _utils.win.window.Promise;
  var promises = Promise ? [] : null;

  var _loop = function _loop() {
    _ref3 = elements[_i2];
    var element = _ref3;
    var rect = interactable.getRect(element);

    if (!rect) {
      return "break";
    }

    var runningInteraction = _utils.arr.find(scope.interactions.list, function (interaction) {
      return interaction.interacting() && interaction.interactable === interactable && interaction.element === element && interaction.prepared.name === action.name;
    });

    var reflowPromise = void 0;

    if (runningInteraction) {
      runningInteraction.move();

      if (promises) {
        reflowPromise = runningInteraction._reflowPromise || new Promise(function (resolve) {
          runningInteraction._reflowResolve = resolve;
        });
      }
    } else {
      var xywh = _utils.rect.tlbrToXywh(rect);

      var coords = {
        page: {
          x: xywh.x,
          y: xywh.y
        },
        client: {
          x: xywh.x,
          y: xywh.y
        },
        timeStamp: scope.now()
      };

      var event = _utils.pointer.coordsToEvent(coords);

      reflowPromise = startReflow(scope, interactable, element, action, event);
    }

    if (promises) {
      promises.push(reflowPromise);
    }
  };

  for (var _i2 = 0; _i2 < elements.length; _i2++) {
    var _ref3;

    var _ret = _loop();

    if (_ret === "break") break;
  }

  return promises && Promise.all(promises).then(function () {
    return interactable;
  });
}

function startReflow(scope, interactable, element, action, event) {
  var interaction = scope.interactions["new"]({
    pointerType: 'reflow'
  });
  var signalArg = {
    interaction: interaction,
    event: event,
    pointer: event,
    eventTarget: element,
    phase: _InteractEvent.EventPhase.Reflow
  };
  interaction.interactable = interactable;
  interaction.element = element;
  interaction.prepared = (0, _utils.extend)({}, action);
  interaction.prevEvent = event;
  interaction.updatePointer(event, event, element, true);

  interaction._doPhase(signalArg);

  var reflowPromise = _utils.win.window.Promise ? new _utils.win.window.Promise(function (resolve) {
    interaction._reflowResolve = resolve;
  }) : null;
  interaction._reflowPromise = reflowPromise;
  interaction.start(action, interactable, element);

  if (interaction._interacting) {
    interaction.move(signalArg);
    interaction.end(event);
  } else {
    interaction.stop();
  }

  interaction.removePointer(event, event);
  interaction.pointerIsDown = false;
  return reflowPromise;
}

var _default = {
  id: 'reflow',
  install: install
};
exports["default"] = _default;

},{"@interactjs/core/InteractEvent":15,"@interactjs/utils":55}],44:[function(require,module,exports){
/// <reference path="./types.d.ts" />
"use strict";

},{}],45:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Signals =
/*#__PURE__*/
function () {
  function Signals() {
    _classCallCheck(this, Signals);

    this.listeners = {};
  }

  _createClass(Signals, [{
    key: "on",
    value: function on(name, listener) {
      if (!this.listeners[name]) {
        this.listeners[name] = [listener];
        return;
      }

      this.listeners[name].push(listener);
    }
  }, {
    key: "off",
    value: function off(name, listener) {
      if (!this.listeners[name]) {
        return;
      }

      var index = this.listeners[name].indexOf(listener);

      if (index !== -1) {
        this.listeners[name].splice(index, 1);
      }
    }
  }, {
    key: "fire",
    value: function fire(name, arg) {
      var targetListeners = this.listeners[name];

      if (!targetListeners) {
        return;
      }

      for (var _i = 0; _i < targetListeners.length; _i++) {
        var _ref;

        _ref = targetListeners[_i];
        var listener = _ref;

        if (listener(arg, name) === false) {
          return false;
        }
      }
    }
  }]);

  return Signals;
}();

var _default = Signals;
exports["default"] = _default;

},{}],46:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.contains = contains;
exports.remove = remove;
exports.merge = merge;
exports.from = from;
exports.findIndex = findIndex;
exports.find = find;
exports.some = some;

function contains(array, target) {
  return array.indexOf(target) !== -1;
}

function remove(array, target) {
  return array.splice(array.indexOf(target), 1);
}

function merge(target, source) {
  for (var _i = 0; _i < source.length; _i++) {
    var _ref;

    _ref = source[_i];
    var item = _ref;
    target.push(item);
  }

  return target;
}

function from(source) {
  return merge([], source);
}

function findIndex(array, func) {
  for (var i = 0; i < array.length; i++) {
    if (func(array[i], i, array)) {
      return i;
    }
  }

  return -1;
}

function find(array, func) {
  return array[findIndex(array, func)];
}

function some(array, func) {
  return findIndex(array, func) !== -1;
}

},{}],47:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _domObjects = _interopRequireDefault(require("./domObjects"));

var is = _interopRequireWildcard(require("./is"));

var _window = _interopRequireDefault(require("./window"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var browser = {
  init: init,
  supportsTouch: null,
  supportsPointerEvent: null,
  isIOS7: null,
  isIOS: null,
  isIe9: null,
  isOperaMobile: null,
  prefixedMatchesSelector: null,
  pEventTypes: null,
  wheelEvent: null
};

function init(window) {
  var Element = _domObjects["default"].Element;
  var navigator = _window["default"].window.navigator; // Does the browser support touch input?

  browser.supportsTouch = 'ontouchstart' in window || is.func(window.DocumentTouch) && _domObjects["default"].document instanceof window.DocumentTouch; // Does the browser support PointerEvents

  browser.supportsPointerEvent = navigator.pointerEnabled !== false && !!_domObjects["default"].PointerEvent;
  browser.isIOS = /iP(hone|od|ad)/.test(navigator.platform); // scrolling doesn't change the result of getClientRects on iOS 7

  browser.isIOS7 = /iP(hone|od|ad)/.test(navigator.platform) && /OS 7[^\d]/.test(navigator.appVersion);
  browser.isIe9 = /MSIE 9/.test(navigator.userAgent); // Opera Mobile must be handled differently

  browser.isOperaMobile = navigator.appName === 'Opera' && browser.supportsTouch && /Presto/.test(navigator.userAgent); // prefix matchesSelector

  browser.prefixedMatchesSelector = 'matches' in Element.prototype ? 'matches' : 'webkitMatchesSelector' in Element.prototype ? 'webkitMatchesSelector' : 'mozMatchesSelector' in Element.prototype ? 'mozMatchesSelector' : 'oMatchesSelector' in Element.prototype ? 'oMatchesSelector' : 'msMatchesSelector';
  browser.pEventTypes = browser.supportsPointerEvent ? _domObjects["default"].PointerEvent === window.MSPointerEvent ? {
    up: 'MSPointerUp',
    down: 'MSPointerDown',
    over: 'mouseover',
    out: 'mouseout',
    move: 'MSPointerMove',
    cancel: 'MSPointerCancel'
  } : {
    up: 'pointerup',
    down: 'pointerdown',
    over: 'pointerover',
    out: 'pointerout',
    move: 'pointermove',
    cancel: 'pointercancel'
  } : null; // because Webkit and Opera still use 'mousewheel' event type

  browser.wheelEvent = 'onmousewheel' in _domObjects["default"].document ? 'mousewheel' : 'wheel';
}

var _default = browser;
exports["default"] = _default;

},{"./domObjects":49,"./is":56,"./window":65}],48:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = clone;

var arr = _interopRequireWildcard(require("./arr"));

var is = _interopRequireWildcard(require("./is"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function clone(source) {
  var dest = {};

  for (var prop in source) {
    var value = source[prop];

    if (is.plainObject(value)) {
      dest[prop] = clone(value);
    } else if (is.array(value)) {
      dest[prop] = arr.from(value);
    } else {
      dest[prop] = value;
    }
  }

  return dest;
}

},{"./arr":46,"./is":56}],49:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var domObjects = {
  init: init,
  document: null,
  DocumentFragment: null,
  SVGElement: null,
  SVGSVGElement: null,
  // eslint-disable-next-line no-undef
  SVGElementInstance: null,
  Element: null,
  HTMLElement: null,
  Event: null,
  Touch: null,
  PointerEvent: null
};

function blank() {}

var _default = domObjects;
exports["default"] = _default;

function init(window) {
  var win = window;
  domObjects.document = win.document;
  domObjects.DocumentFragment = win.DocumentFragment || blank;
  domObjects.SVGElement = win.SVGElement || blank;
  domObjects.SVGSVGElement = win.SVGSVGElement || blank;
  domObjects.SVGElementInstance = win.SVGElementInstance || blank;
  domObjects.Element = win.Element || blank;
  domObjects.HTMLElement = win.HTMLElement || domObjects.Element;
  domObjects.Event = win.Event;
  domObjects.Touch = win.Touch || blank;
  domObjects.PointerEvent = win.PointerEvent || win.MSPointerEvent;
}

},{}],50:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nodeContains = nodeContains;
exports.closest = closest;
exports.parentNode = parentNode;
exports.matchesSelector = matchesSelector;
exports.indexOfDeepestElement = indexOfDeepestElement;
exports.matchesUpTo = matchesUpTo;
exports.getActualElement = getActualElement;
exports.getScrollXY = getScrollXY;
exports.getElementClientRect = getElementClientRect;
exports.getElementRect = getElementRect;
exports.getPath = getPath;
exports.trySelector = trySelector;

var _browser = _interopRequireDefault(require("./browser"));

var _domObjects = _interopRequireDefault(require("./domObjects"));

var is = _interopRequireWildcard(require("./is"));

var _window = _interopRequireDefault(require("./window"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function nodeContains(parent, child) {
  while (child) {
    if (child === parent) {
      return true;
    }

    child = child.parentNode;
  }

  return false;
}

function closest(element, selector) {
  while (is.element(element)) {
    if (matchesSelector(element, selector)) {
      return element;
    }

    element = parentNode(element);
  }

  return null;
}

function parentNode(node) {
  var parent = node.parentNode;

  if (is.docFrag(parent)) {
    // skip past #shado-root fragments
    // tslint:disable-next-line
    while ((parent = parent.host) && is.docFrag(parent)) {
      continue;
    }

    return parent;
  }

  return parent;
}

function matchesSelector(element, selector) {
  // remove /deep/ from selectors if shadowDOM polyfill is used
  if (_window["default"].window !== _window["default"].realWindow) {
    selector = selector.replace(/\/deep\//g, ' ');
  }

  return element[_browser["default"].prefixedMatchesSelector](selector);
} // Test for the element that's "above" all other qualifiers


function indexOfDeepestElement(elements) {
  var deepestZoneParents = [];
  var dropzoneParents = [];
  var dropzone;
  var deepestZone = elements[0];
  var index = deepestZone ? 0 : -1;
  var parent;
  var child;
  var i;
  var n;

  for (i = 1; i < elements.length; i++) {
    dropzone = elements[i]; // an element might belong to multiple selector dropzones

    if (!dropzone || dropzone === deepestZone) {
      continue;
    }

    if (!deepestZone) {
      deepestZone = dropzone;
      index = i;
      continue;
    } // check if the deepest or current are document.documentElement or document.rootElement
    // - if the current dropzone is, do nothing and continue


    if (dropzone.parentNode === dropzone.ownerDocument) {
      continue;
    } // - if deepest is, update with the current dropzone and continue to next
    else if (deepestZone.parentNode === dropzone.ownerDocument) {
        deepestZone = dropzone;
        index = i;
        continue;
      }

    if (!deepestZoneParents.length) {
      parent = deepestZone;

      while (parent.parentNode && parent.parentNode !== parent.ownerDocument) {
        deepestZoneParents.unshift(parent);
        parent = parent.parentNode;
      }
    } // if this element is an svg element and the current deepest is
    // an HTMLElement


    if (deepestZone instanceof _domObjects["default"].HTMLElement && dropzone instanceof _domObjects["default"].SVGElement && !(dropzone instanceof _domObjects["default"].SVGSVGElement)) {
      if (dropzone === deepestZone.parentNode) {
        continue;
      }

      parent = dropzone.ownerSVGElement;
    } else {
      parent = dropzone;
    }

    dropzoneParents = [];

    while (parent.parentNode !== parent.ownerDocument) {
      dropzoneParents.unshift(parent);
      parent = parent.parentNode;
    }

    n = 0; // get (position of last common ancestor) + 1

    while (dropzoneParents[n] && dropzoneParents[n] === deepestZoneParents[n]) {
      n++;
    }

    var parents = [dropzoneParents[n - 1], dropzoneParents[n], deepestZoneParents[n]];
    child = parents[0].lastChild;

    while (child) {
      if (child === parents[1]) {
        deepestZone = dropzone;
        index = i;
        deepestZoneParents = [];
        break;
      } else if (child === parents[2]) {
        break;
      }

      child = child.previousSibling;
    }
  }

  return index;
}

function matchesUpTo(element, selector, limit) {
  while (is.element(element)) {
    if (matchesSelector(element, selector)) {
      return true;
    }

    element = parentNode(element);

    if (element === limit) {
      return matchesSelector(element, selector);
    }
  }

  return false;
}

function getActualElement(element) {
  return element instanceof _domObjects["default"].SVGElementInstance ? element.correspondingUseElement : element;
}

function getScrollXY(relevantWindow) {
  relevantWindow = relevantWindow || _window["default"].window;
  return {
    x: relevantWindow.scrollX || relevantWindow.document.documentElement.scrollLeft,
    y: relevantWindow.scrollY || relevantWindow.document.documentElement.scrollTop
  };
}

function getElementClientRect(element) {
  var clientRect = element instanceof _domObjects["default"].SVGElement ? element.getBoundingClientRect() : element.getClientRects()[0];
  return clientRect && {
    left: clientRect.left,
    right: clientRect.right,
    top: clientRect.top,
    bottom: clientRect.bottom,
    width: clientRect.width || clientRect.right - clientRect.left,
    height: clientRect.height || clientRect.bottom - clientRect.top
  };
}

function getElementRect(element) {
  var clientRect = getElementClientRect(element);

  if (!_browser["default"].isIOS7 && clientRect) {
    var scroll = getScrollXY(_window["default"].getWindow(element));
    clientRect.left += scroll.x;
    clientRect.right += scroll.x;
    clientRect.top += scroll.y;
    clientRect.bottom += scroll.y;
  }

  return clientRect;
}

function getPath(element) {
  var path = [];

  while (element) {
    path.push(element);
    element = parentNode(element);
  }

  return path;
}

function trySelector(value) {
  if (!is.string(value)) {
    return false;
  } // an exception will be raised if it is invalid


  _domObjects["default"].document.querySelector(value);

  return true;
}

},{"./browser":47,"./domObjects":49,"./is":56,"./window":65}],51:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.FakeEvent = void 0;

var _arr2 = require("./arr");

var domUtils = _interopRequireWildcard(require("./domUtils"));

var is = _interopRequireWildcard(require("./is"));

var _pointerExtend = _interopRequireDefault(require("./pointerExtend"));

var _pointerUtils = _interopRequireDefault(require("./pointerUtils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var elements = [];
var targets = [];
var delegatedEvents = {};
var documents = [];

function add(element, type, listener, optionalArg) {
  var options = getOptions(optionalArg);
  var elementIndex = elements.indexOf(element);
  var target = targets[elementIndex];

  if (!target) {
    target = {
      events: {},
      typeCount: 0
    };
    elementIndex = elements.push(element) - 1;
    targets.push(target);
  }

  if (!target.events[type]) {
    target.events[type] = [];
    target.typeCount++;
  }

  if (!(0, _arr2.contains)(target.events[type], listener)) {
    element.addEventListener(type, listener, events.supportsOptions ? options : !!options.capture);
    target.events[type].push(listener);
  }
}

function remove(element, type, listener, optionalArg) {
  var options = getOptions(optionalArg);
  var elementIndex = elements.indexOf(element);
  var target = targets[elementIndex];

  if (!target || !target.events) {
    return;
  }

  if (type === 'all') {
    for (type in target.events) {
      if (target.events.hasOwnProperty(type)) {
        remove(element, type, 'all');
      }
    }

    return;
  }

  if (target.events[type]) {
    var len = target.events[type].length;

    if (listener === 'all') {
      for (var i = 0; i < len; i++) {
        remove(element, type, target.events[type][i], options);
      }

      return;
    } else {
      for (var _i = 0; _i < len; _i++) {
        if (target.events[type][_i] === listener) {
          element.removeEventListener(type, listener, events.supportsOptions ? options : !!options.capture);
          target.events[type].splice(_i, 1);
          break;
        }
      }
    }

    if (target.events[type] && target.events[type].length === 0) {
      target.events[type] = null;
      target.typeCount--;
    }
  }

  if (!target.typeCount) {
    targets.splice(elementIndex, 1);
    elements.splice(elementIndex, 1);
  }
}

function addDelegate(selector, context, type, listener, optionalArg) {
  var options = getOptions(optionalArg);

  if (!delegatedEvents[type]) {
    delegatedEvents[type] = {
      contexts: [],
      listeners: [],
      selectors: []
    }; // add delegate listener functions

    for (var _i2 = 0; _i2 < documents.length; _i2++) {
      var doc = documents[_i2];
      add(doc, type, delegateListener);
      add(doc, type, delegateUseCapture, true);
    }
  }

  var delegated = delegatedEvents[type];
  var index;

  for (index = delegated.selectors.length - 1; index >= 0; index--) {
    if (delegated.selectors[index] === selector && delegated.contexts[index] === context) {
      break;
    }
  }

  if (index === -1) {
    index = delegated.selectors.length;
    delegated.selectors.push(selector);
    delegated.contexts.push(context);
    delegated.listeners.push([]);
  } // keep listener and capture and passive flags


  delegated.listeners[index].push([listener, !!options.capture, options.passive]);
}

function removeDelegate(selector, context, type, listener, optionalArg) {
  var options = getOptions(optionalArg);
  var delegated = delegatedEvents[type];
  var matchFound = false;
  var index;

  if (!delegated) {
    return;
  } // count from last index of delegated to 0


  for (index = delegated.selectors.length - 1; index >= 0; index--) {
    // look for matching selector and context Node
    if (delegated.selectors[index] === selector && delegated.contexts[index] === context) {
      var listeners = delegated.listeners[index]; // each item of the listeners array is an array: [function, capture, passive]

      for (var i = listeners.length - 1; i >= 0; i--) {
        var _listeners$i = _slicedToArray(listeners[i], 3),
            fn = _listeners$i[0],
            capture = _listeners$i[1],
            passive = _listeners$i[2]; // check if the listener functions and capture and passive flags match


        if (fn === listener && capture === !!options.capture && passive === options.passive) {
          // remove the listener from the array of listeners
          listeners.splice(i, 1); // if all listeners for this interactable have been removed
          // remove the interactable from the delegated arrays

          if (!listeners.length) {
            delegated.selectors.splice(index, 1);
            delegated.contexts.splice(index, 1);
            delegated.listeners.splice(index, 1); // remove delegate function from context

            remove(context, type, delegateListener);
            remove(context, type, delegateUseCapture, true); // remove the arrays if they are empty

            if (!delegated.selectors.length) {
              delegatedEvents[type] = null;
            }
          } // only remove one listener


          matchFound = true;
          break;
        }
      }

      if (matchFound) {
        break;
      }
    }
  }
} // bound to the interactable context when a DOM event
// listener is added to a selector interactable


function delegateListener(event, optionalArg) {
  var options = getOptions(optionalArg);
  var fakeEvent = new FakeEvent(event);
  var delegated = delegatedEvents[event.type];

  var _pointerUtils$getEven = _pointerUtils["default"].getEventTargets(event),
      _pointerUtils$getEven2 = _slicedToArray(_pointerUtils$getEven, 1),
      eventTarget = _pointerUtils$getEven2[0];

  var element = eventTarget; // climb up document tree looking for selector matches

  while (is.element(element)) {
    for (var i = 0; i < delegated.selectors.length; i++) {
      var selector = delegated.selectors[i];
      var context = delegated.contexts[i];

      if (domUtils.matchesSelector(element, selector) && domUtils.nodeContains(context, eventTarget) && domUtils.nodeContains(context, element)) {
        var listeners = delegated.listeners[i];
        fakeEvent.currentTarget = element;

        for (var _i3 = 0; _i3 < listeners.length; _i3++) {
          var _ref;

          _ref = listeners[_i3];

          var _ref2 = _ref,
              _ref3 = _slicedToArray(_ref2, 3),
              fn = _ref3[0],
              capture = _ref3[1],
              passive = _ref3[2];

          if (capture === !!options.capture && passive === options.passive) {
            fn(fakeEvent);
          }
        }
      }
    }

    element = domUtils.parentNode(element);
  }
}

function delegateUseCapture(event) {
  return delegateListener.call(this, event, true);
}

function getOptions(param) {
  return is.object(param) ? param : {
    capture: param
  };
}

var FakeEvent =
/*#__PURE__*/
function () {
  function FakeEvent(originalEvent) {
    _classCallCheck(this, FakeEvent);

    this.originalEvent = originalEvent; // duplicate the event so that currentTarget can be changed

    (0, _pointerExtend["default"])(this, originalEvent);
  }

  _createClass(FakeEvent, [{
    key: "preventOriginalDefault",
    value: function preventOriginalDefault() {
      this.originalEvent.preventDefault();
    }
  }, {
    key: "stopPropagation",
    value: function stopPropagation() {
      this.originalEvent.stopPropagation();
    }
  }, {
    key: "stopImmediatePropagation",
    value: function stopImmediatePropagation() {
      this.originalEvent.stopImmediatePropagation();
    }
  }]);

  return FakeEvent;
}();

exports.FakeEvent = FakeEvent;
var events = {
  add: add,
  remove: remove,
  addDelegate: addDelegate,
  removeDelegate: removeDelegate,
  delegateListener: delegateListener,
  delegateUseCapture: delegateUseCapture,
  delegatedEvents: delegatedEvents,
  documents: documents,
  supportsOptions: false,
  supportsPassive: false,
  _elements: elements,
  _targets: targets,
  init: function init(window) {
    window.document.createElement('div').addEventListener('test', null, {
      get capture() {
        return events.supportsOptions = true;
      },

      get passive() {
        return events.supportsPassive = true;
      }

    });
  }
};
var _default = events;
exports["default"] = _default;

},{"./arr":46,"./domUtils":50,"./is":56,"./pointerExtend":59,"./pointerUtils":60}],52:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = extend;

function extend(dest, source) {
  for (var prop in source) {
    dest[prop] = source[prop];
  }

  return dest;
}

},{}],53:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _rect = require("./rect");

function _default(target, element, action) {
  var actionOptions = target.options[action];
  var actionOrigin = actionOptions && actionOptions.origin;
  var origin = actionOrigin || target.options.origin;
  var originRect = (0, _rect.resolveRectLike)(origin, target, element, [target && element]);
  return (0, _rect.rectToXY)(originRect) || {
    x: 0,
    y: 0
  };
}

},{"./rect":62}],54:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(x, y) {
  return Math.sqrt(x * x + y * y);
};

exports["default"] = _default;

},{}],55:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.warnOnce = warnOnce;
exports._getQBezierValue = _getQBezierValue;
exports.getQuadraticCurvePoint = getQuadraticCurvePoint;
exports.easeOutQuad = easeOutQuad;
exports.copyAction = copyAction;
Object.defineProperty(exports, "win", {
  enumerable: true,
  get: function get() {
    return _window["default"];
  }
});
Object.defineProperty(exports, "browser", {
  enumerable: true,
  get: function get() {
    return _browser["default"];
  }
});
Object.defineProperty(exports, "clone", {
  enumerable: true,
  get: function get() {
    return _clone["default"];
  }
});
Object.defineProperty(exports, "events", {
  enumerable: true,
  get: function get() {
    return _events["default"];
  }
});
Object.defineProperty(exports, "extend", {
  enumerable: true,
  get: function get() {
    return _extend["default"];
  }
});
Object.defineProperty(exports, "getOriginXY", {
  enumerable: true,
  get: function get() {
    return _getOriginXY["default"];
  }
});
Object.defineProperty(exports, "hypot", {
  enumerable: true,
  get: function get() {
    return _hypot["default"];
  }
});
Object.defineProperty(exports, "normalizeListeners", {
  enumerable: true,
  get: function get() {
    return _normalizeListeners["default"];
  }
});
Object.defineProperty(exports, "pointer", {
  enumerable: true,
  get: function get() {
    return _pointerUtils["default"];
  }
});
Object.defineProperty(exports, "raf", {
  enumerable: true,
  get: function get() {
    return _raf["default"];
  }
});
Object.defineProperty(exports, "rect", {
  enumerable: true,
  get: function get() {
    return _rect["default"];
  }
});
Object.defineProperty(exports, "Signals", {
  enumerable: true,
  get: function get() {
    return _Signals["default"];
  }
});
exports.is = exports.dom = exports.arr = void 0;

var arr = _interopRequireWildcard(require("./arr"));

exports.arr = arr;

var dom = _interopRequireWildcard(require("./domUtils"));

exports.dom = dom;

var is = _interopRequireWildcard(require("./is"));

exports.is = is;

var _window = _interopRequireDefault(require("./window"));

var _browser = _interopRequireDefault(require("./browser"));

var _clone = _interopRequireDefault(require("./clone"));

var _events = _interopRequireDefault(require("./events"));

var _extend = _interopRequireDefault(require("./extend"));

var _getOriginXY = _interopRequireDefault(require("./getOriginXY"));

var _hypot = _interopRequireDefault(require("./hypot"));

var _normalizeListeners = _interopRequireDefault(require("./normalizeListeners"));

var _pointerUtils = _interopRequireDefault(require("./pointerUtils"));

var _raf = _interopRequireDefault(require("./raf"));

var _rect = _interopRequireDefault(require("./rect"));

var _Signals = _interopRequireDefault(require("./Signals"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function warnOnce(method, message) {
  var warned = false; // eslint-disable-next-line no-shadow

  return function () {
    if (!warned) {
      _window["default"].window.console.warn(message);

      warned = true;
    }

    return method.apply(this, arguments);
  };
} // http://stackoverflow.com/a/5634528/2280888


function _getQBezierValue(t, p1, p2, p3) {
  var iT = 1 - t;
  return iT * iT * p1 + 2 * iT * t * p2 + t * t * p3;
}

function getQuadraticCurvePoint(startX, startY, cpX, cpY, endX, endY, position) {
  return {
    x: _getQBezierValue(position, startX, cpX, endX),
    y: _getQBezierValue(position, startY, cpY, endY)
  };
} // http://gizma.com/easing/


function easeOutQuad(t, b, c, d) {
  t /= d;
  return -c * t * (t - 2) + b;
}

function copyAction(dest, src) {
  dest.name = src.name;
  dest.axis = src.axis;
  dest.edges = src.edges;
  return dest;
}

},{"./Signals":45,"./arr":46,"./browser":47,"./clone":48,"./domUtils":50,"./events":51,"./extend":52,"./getOriginXY":53,"./hypot":54,"./is":56,"./normalizeListeners":58,"./pointerUtils":60,"./raf":61,"./rect":62,"./window":65}],56:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.array = exports.plainObject = exports.element = exports.string = exports.bool = exports.number = exports.func = exports.object = exports.docFrag = exports.window = void 0;

var _isWindow = _interopRequireDefault(require("./isWindow"));

var _window2 = _interopRequireDefault(require("./window"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var window = function window(thing) {
  return thing === _window2["default"].window || (0, _isWindow["default"])(thing);
};

exports.window = window;

var docFrag = function docFrag(thing) {
  return object(thing) && thing.nodeType === 11;
};

exports.docFrag = docFrag;

var object = function object(thing) {
  return !!thing && _typeof(thing) === 'object';
};

exports.object = object;

var func = function func(thing) {
  return typeof thing === 'function';
};

exports.func = func;

var number = function number(thing) {
  return typeof thing === 'number';
};

exports.number = number;

var bool = function bool(thing) {
  return typeof thing === 'boolean';
};

exports.bool = bool;

var string = function string(thing) {
  return typeof thing === 'string';
};

exports.string = string;

var element = function element(thing) {
  if (!thing || _typeof(thing) !== 'object') {
    return false;
  }

  var _window = _window2["default"].getWindow(thing) || _window2["default"].window;

  return /object|function/.test(_typeof(_window.Element)) ? thing instanceof _window.Element // DOM2
  : thing.nodeType === 1 && typeof thing.nodeName === 'string';
};

exports.element = element;

var plainObject = function plainObject(thing) {
  return object(thing) && !!thing.constructor && /function Object\b/.test(thing.constructor.toString());
};

exports.plainObject = plainObject;

var array = function array(thing) {
  return object(thing) && typeof thing.length !== 'undefined' && func(thing.splice);
};

exports.array = array;

},{"./isWindow":57,"./window":65}],57:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(thing) {
  return !!(thing && thing.Window) && thing instanceof thing.Window;
};

exports["default"] = _default;

},{}],58:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = normalize;

var _extend = _interopRequireDefault(require("./extend"));

var is = _interopRequireWildcard(require("./is"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function normalize(type, listeners, result) {
  result = result || {};

  if (is.string(type) && type.search(' ') !== -1) {
    type = split(type);
  }

  if (is.array(type)) {
    return type.reduce(function (acc, t) {
      return (0, _extend["default"])(acc, normalize(t, listeners, result));
    }, result);
  } // ({ type: fn }) -> ('', { type: fn })


  if (is.object(type)) {
    listeners = type;
    type = '';
  }

  if (is.func(listeners)) {
    result[type] = result[type] || [];
    result[type].push(listeners);
  } else if (is.array(listeners)) {
    for (var _i = 0; _i < listeners.length; _i++) {
      var _ref;

      _ref = listeners[_i];
      var l = _ref;
      normalize(type, l, result);
    }
  } else if (is.object(listeners)) {
    for (var prefix in listeners) {
      var combinedTypes = split(prefix).map(function (p) {
        return "".concat(type).concat(p);
      });
      normalize(combinedTypes, listeners[prefix], result);
    }
  }

  return result;
}

function split(type) {
  return type.trim().split(/ +/);
}

},{"./extend":52,"./is":56}],59:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pointerExtend = pointerExtend;
exports["default"] = void 0;

function pointerExtend(dest, source) {
  for (var prop in source) {
    var prefixedPropREs = pointerExtend.prefixedPropREs;
    var deprecated = false; // skip deprecated prefixed properties

    for (var vendor in prefixedPropREs) {
      if (prop.indexOf(vendor) === 0 && prefixedPropREs[vendor].test(prop)) {
        deprecated = true;
        break;
      }
    }

    if (!deprecated && typeof source[prop] !== 'function') {
      dest[prop] = source[prop];
    }
  }

  return dest;
}

pointerExtend.prefixedPropREs = {
  webkit: /(Movement[XY]|Radius[XY]|RotationAngle|Force)$/
};
var _default = pointerExtend;
exports["default"] = _default;

},{}],60:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _browser = _interopRequireDefault(require("./browser"));

var _domObjects = _interopRequireDefault(require("./domObjects"));

var domUtils = _interopRequireWildcard(require("./domUtils"));

var _hypot = _interopRequireDefault(require("./hypot"));

var is = _interopRequireWildcard(require("./is"));

var _pointerExtend = _interopRequireDefault(require("./pointerExtend"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var pointerUtils = {
  copyCoords: function copyCoords(dest, src) {
    dest.page = dest.page || {};
    dest.page.x = src.page.x;
    dest.page.y = src.page.y;
    dest.client = dest.client || {};
    dest.client.x = src.client.x;
    dest.client.y = src.client.y;
    dest.timeStamp = src.timeStamp;
  },
  setCoordDeltas: function setCoordDeltas(targetObj, prev, cur) {
    targetObj.page.x = cur.page.x - prev.page.x;
    targetObj.page.y = cur.page.y - prev.page.y;
    targetObj.client.x = cur.client.x - prev.client.x;
    targetObj.client.y = cur.client.y - prev.client.y;
    targetObj.timeStamp = cur.timeStamp - prev.timeStamp;
  },
  setCoordVelocity: function setCoordVelocity(targetObj, delta) {
    var dt = Math.max(delta.timeStamp / 1000, 0.001);
    targetObj.page.x = delta.page.x / dt;
    targetObj.page.y = delta.page.y / dt;
    targetObj.client.x = delta.client.x / dt;
    targetObj.client.y = delta.client.y / dt;
    targetObj.timeStamp = dt;
  },
  isNativePointer: function isNativePointer(pointer) {
    return pointer instanceof _domObjects["default"].Event || pointer instanceof _domObjects["default"].Touch;
  },
  // Get specified X/Y coords for mouse or event.touches[0]
  getXY: function getXY(type, pointer, xy) {
    xy = xy || {};
    type = type || 'page';
    xy.x = pointer[type + 'X'];
    xy.y = pointer[type + 'Y'];
    return xy;
  },
  getPageXY: function getPageXY(pointer, page) {
    page = page || {
      x: 0,
      y: 0
    }; // Opera Mobile handles the viewport and scrolling oddly

    if (_browser["default"].isOperaMobile && pointerUtils.isNativePointer(pointer)) {
      pointerUtils.getXY('screen', pointer, page);
      page.x += window.scrollX;
      page.y += window.scrollY;
    } else {
      pointerUtils.getXY('page', pointer, page);
    }

    return page;
  },
  getClientXY: function getClientXY(pointer, client) {
    client = client || {};

    if (_browser["default"].isOperaMobile && pointerUtils.isNativePointer(pointer)) {
      // Opera Mobile handles the viewport and scrolling oddly
      pointerUtils.getXY('screen', pointer, client);
    } else {
      pointerUtils.getXY('client', pointer, client);
    }

    return client;
  },
  getPointerId: function getPointerId(pointer) {
    return is.number(pointer.pointerId) ? pointer.pointerId : pointer.identifier;
  },
  setCoords: function setCoords(targetObj, pointers, timeStamp) {
    var pointer = pointers.length > 1 ? pointerUtils.pointerAverage(pointers) : pointers[0];
    var tmpXY = {};
    pointerUtils.getPageXY(pointer, tmpXY);
    targetObj.page.x = tmpXY.x;
    targetObj.page.y = tmpXY.y;
    pointerUtils.getClientXY(pointer, tmpXY);
    targetObj.client.x = tmpXY.x;
    targetObj.client.y = tmpXY.y;
    targetObj.timeStamp = timeStamp;
  },
  pointerExtend: _pointerExtend["default"],
  getTouchPair: function getTouchPair(event) {
    var touches = []; // array of touches is supplied

    if (is.array(event)) {
      touches[0] = event[0];
      touches[1] = event[1];
    } // an event
    else {
        if (event.type === 'touchend') {
          if (event.touches.length === 1) {
            touches[0] = event.touches[0];
            touches[1] = event.changedTouches[0];
          } else if (event.touches.length === 0) {
            touches[0] = event.changedTouches[0];
            touches[1] = event.changedTouches[1];
          }
        } else {
          touches[0] = event.touches[0];
          touches[1] = event.touches[1];
        }
      }

    return touches;
  },
  pointerAverage: function pointerAverage(pointers) {
    var average = {
      pageX: 0,
      pageY: 0,
      clientX: 0,
      clientY: 0,
      screenX: 0,
      screenY: 0
    };

    for (var _i = 0; _i < pointers.length; _i++) {
      var _ref;

      _ref = pointers[_i];
      var pointer = _ref;

      for (var _prop in average) {
        average[_prop] += pointer[_prop];
      }
    }

    for (var prop in average) {
      average[prop] /= pointers.length;
    }

    return average;
  },
  touchBBox: function touchBBox(event) {
    if (!event.length && !(event.touches && event.touches.length > 1)) {
      return null;
    }

    var touches = pointerUtils.getTouchPair(event);
    var minX = Math.min(touches[0].pageX, touches[1].pageX);
    var minY = Math.min(touches[0].pageY, touches[1].pageY);
    var maxX = Math.max(touches[0].pageX, touches[1].pageX);
    var maxY = Math.max(touches[0].pageY, touches[1].pageY);
    return {
      x: minX,
      y: minY,
      left: minX,
      top: minY,
      right: maxX,
      bottom: maxY,
      width: maxX - minX,
      height: maxY - minY
    };
  },
  touchDistance: function touchDistance(event, deltaSource) {
    var sourceX = deltaSource + 'X';
    var sourceY = deltaSource + 'Y';
    var touches = pointerUtils.getTouchPair(event);
    var dx = touches[0][sourceX] - touches[1][sourceX];
    var dy = touches[0][sourceY] - touches[1][sourceY];
    return (0, _hypot["default"])(dx, dy);
  },
  touchAngle: function touchAngle(event, deltaSource) {
    var sourceX = deltaSource + 'X';
    var sourceY = deltaSource + 'Y';
    var touches = pointerUtils.getTouchPair(event);
    var dx = touches[1][sourceX] - touches[0][sourceX];
    var dy = touches[1][sourceY] - touches[0][sourceY];
    var angle = 180 * Math.atan2(dy, dx) / Math.PI;
    return angle;
  },
  getPointerType: function getPointerType(pointer) {
    return is.string(pointer.pointerType) ? pointer.pointerType : is.number(pointer.pointerType) ? [undefined, undefined, 'touch', 'pen', 'mouse'][pointer.pointerType] // if the PointerEvent API isn't available, then the "pointer" must
    // be either a MouseEvent, TouchEvent, or Touch object
    : /touch/.test(pointer.type) || pointer instanceof _domObjects["default"].Touch ? 'touch' : 'mouse';
  },
  // [ event.target, event.currentTarget ]
  getEventTargets: function getEventTargets(event) {
    var path = is.func(event.composedPath) ? event.composedPath() : event.path;
    return [domUtils.getActualElement(path ? path[0] : event.target), domUtils.getActualElement(event.currentTarget)];
  },
  newCoords: function newCoords() {
    return {
      page: {
        x: 0,
        y: 0
      },
      client: {
        x: 0,
        y: 0
      },
      timeStamp: 0
    };
  },
  coordsToEvent: function coordsToEvent(coords) {
    var event = {
      coords: coords,

      get page() {
        return this.coords.page;
      },

      get client() {
        return this.coords.client;
      },

      get timeStamp() {
        return this.coords.timeStamp;
      },

      get pageX() {
        return this.coords.page.x;
      },

      get pageY() {
        return this.coords.page.y;
      },

      get clientX() {
        return this.coords.client.x;
      },

      get clientY() {
        return this.coords.client.y;
      },

      get pointerId() {
        return this.coords.pointerId;
      },

      get target() {
        return this.coords.target;
      },

      get type() {
        return this.coords.type;
      },

      get pointerType() {
        return this.coords.pointerType;
      }

    };
    return event;
  }
};
var _default = pointerUtils;
exports["default"] = _default;

},{"./browser":47,"./domObjects":49,"./domUtils":50,"./hypot":54,"./is":56,"./pointerExtend":59}],61:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var lastTime = 0;

var _request;

var _cancel;

function init(window) {
  _request = window.requestAnimationFrame;
  _cancel = window.cancelAnimationFrame;

  if (!_request) {
    var vendors = ['ms', 'moz', 'webkit', 'o'];

    for (var _i = 0; _i < vendors.length; _i++) {
      var vendor = vendors[_i];
      _request = window["".concat(vendor, "RequestAnimationFrame")];
      _cancel = window["".concat(vendor, "CancelAnimationFrame")] || window["".concat(vendor, "CancelRequestAnimationFrame")];
    }
  }

  if (!_request) {
    _request = function request(callback) {
      var currTime = Date.now();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime)); // eslint-disable-next-line standard/no-callback-literal

      var token = setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return token;
    };

    _cancel = function cancel(token) {
      return clearTimeout(token);
    };
  }
}

var _default = {
  request: function request(callback) {
    return _request(callback);
  },
  cancel: function cancel(token) {
    return _cancel(token);
  },
  init: init
};
exports["default"] = _default;

},{}],62:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStringOptionResult = getStringOptionResult;
exports.resolveRectLike = resolveRectLike;
exports.rectToXY = rectToXY;
exports.xywhToTlbr = xywhToTlbr;
exports.tlbrToXywh = tlbrToXywh;
exports["default"] = void 0;

var _domUtils = require("./domUtils");

var _extend = _interopRequireDefault(require("./extend"));

var is = _interopRequireWildcard(require("./is"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function getStringOptionResult(value, interactable, element) {
  if (!is.string(value)) {
    return null;
  }

  if (value === 'parent') {
    value = (0, _domUtils.parentNode)(element);
  } else if (value === 'self') {
    value = interactable.getRect(element);
  } else {
    value = (0, _domUtils.closest)(element, value);
  }

  return value;
}

function resolveRectLike(value, interactable, element, functionArgs) {
  value = getStringOptionResult(value, interactable, element) || value;

  if (is.func(value)) {
    value = value.apply(null, functionArgs);
  }

  if (is.element(value)) {
    value = (0, _domUtils.getElementRect)(value);
  }

  return value;
}

function rectToXY(rect) {
  return rect && {
    x: 'x' in rect ? rect.x : rect.left,
    y: 'y' in rect ? rect.y : rect.top
  };
}

function xywhToTlbr(rect) {
  if (rect && !('left' in rect && 'top' in rect)) {
    rect = (0, _extend["default"])({}, rect);
    rect.left = rect.x || 0;
    rect.top = rect.y || 0;
    rect.right = rect.right || rect.left + rect.width;
    rect.bottom = rect.bottom || rect.top + rect.height;
  }

  return rect;
}

function tlbrToXywh(rect) {
  if (rect && !('x' in rect && 'y' in rect)) {
    rect = (0, _extend["default"])({}, rect);
    rect.x = rect.left || 0;
    rect.y = rect.top || 0;
    rect.width = rect.width || rect.right - rect.x;
    rect.height = rect.height || rect.bottom - rect.y;
  }

  return rect;
}

var _default = {
  getStringOptionResult: getStringOptionResult,
  resolveRectLike: resolveRectLike,
  rectToXY: rectToXY,
  xywhToTlbr: xywhToTlbr,
  tlbrToXywh: tlbrToXywh
};
exports["default"] = _default;

},{"./domUtils":50,"./extend":52,"./is":56}],63:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function createGrid(grid) {
  var coordFields = [['x', 'y'], ['left', 'top'], ['right', 'bottom'], ['width', 'height']].filter(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        xField = _ref2[0],
        yField = _ref2[1];

    return xField in grid || yField in grid;
  });
  return function (x, y) {
    var range = grid.range,
        _grid$limits = grid.limits,
        limits = _grid$limits === void 0 ? {
      left: -Infinity,
      right: Infinity,
      top: -Infinity,
      bottom: Infinity
    } : _grid$limits,
        _grid$offset = grid.offset,
        offset = _grid$offset === void 0 ? {
      x: 0,
      y: 0
    } : _grid$offset;
    var result = {
      range: range
    };

    for (var _i2 = 0; _i2 < coordFields.length; _i2++) {
      var _ref3;

      _ref3 = coordFields[_i2];

      var _ref4 = _ref3,
          _ref5 = _slicedToArray(_ref4, 2),
          xField = _ref5[0],
          yField = _ref5[1];

      var gridx = Math.round((x - offset.x) / grid[xField]);
      var gridy = Math.round((y - offset.y) / grid[yField]);
      result[xField] = Math.max(limits.left, Math.min(limits.right, gridx * grid[xField] + offset.x));
      result[yField] = Math.max(limits.top, Math.min(limits.bottom, gridy * grid[yField] + offset.y));
    }

    return result;
  };
}

var _default = createGrid;
exports["default"] = _default;

},{}],64:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "grid", {
  enumerable: true,
  get: function get() {
    return _grid["default"];
  }
});

var _grid = _interopRequireDefault(require("./grid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

},{"./grid":63}],65:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
exports.getWindow = getWindow;
exports["default"] = void 0;

var _isWindow = _interopRequireDefault(require("./isWindow"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var win = {
  realWindow: undefined,
  window: undefined,
  getWindow: getWindow,
  init: init
};

function init(window) {
  // get wrapped window if using Shadow DOM polyfill
  win.realWindow = window; // create a TextNode

  var el = window.document.createTextNode(''); // check if it's wrapped by a polyfill

  if (el.ownerDocument !== window.document && typeof window.wrap === 'function' && window.wrap(el) === el) {
    // use wrapped window
    window = window.wrap(window);
  }

  win.window = window;
}

if (typeof window === 'undefined') {
  win.window = undefined;
  win.realWindow = undefined;
} else {
  init(window);
}

function getWindow(node) {
  if ((0, _isWindow["default"])(node)) {
    return node;
  }

  var rootNode = node.ownerDocument || node;
  return rootNode.defaultView || win.window;
}

win.init = init;
var _default = win;
exports["default"] = _default;

},{"./isWindow":57}]},{},[29])(29)
});


//# sourceMappingURL=interact.js.map
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvaW50ZXJhY3Rqcy9kaXN0L2ludGVyYWN0LmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ludGVyYWN0anMvZGlzdC9pbnRlcmFjdC5qcz9mYjNhIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogaW50ZXJhY3QuanMgMS40LjAtcmMuMTNcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTItMjAxOSBUYXllIEFkZXllbWkgPGRldkB0YXllLm1lPlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS90YXllL2ludGVyYWN0LmpzL21hc3Rlci9MSUNFTlNFXG4gKi9cbihmdW5jdGlvbihmKXtpZih0eXBlb2YgZXhwb3J0cz09PVwib2JqZWN0XCImJnR5cGVvZiBtb2R1bGUhPT1cInVuZGVmaW5lZFwiKXttb2R1bGUuZXhwb3J0cz1mKCl9ZWxzZSBpZih0eXBlb2YgZGVmaW5lPT09XCJmdW5jdGlvblwiJiZkZWZpbmUuYW1kKXtkZWZpbmUoW10sZil9ZWxzZXt2YXIgZztpZih0eXBlb2Ygd2luZG93IT09XCJ1bmRlZmluZWRcIil7Zz13aW5kb3d9ZWxzZSBpZih0eXBlb2YgZ2xvYmFsIT09XCJ1bmRlZmluZWRcIil7Zz1nbG9iYWx9ZWxzZSBpZih0eXBlb2Ygc2VsZiE9PVwidW5kZWZpbmVkXCIpe2c9c2VsZn1lbHNle2c9dGhpc31nLmludGVyYWN0ID0gZigpfX0pKGZ1bmN0aW9uKCl7dmFyIGRlZmluZSxtb2R1bGUsZXhwb3J0cztyZXR1cm4gKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSh7MTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX3Njb3BlID0gcmVxdWlyZShcIkBpbnRlcmFjdGpzL2NvcmUvc2NvcGVcIik7XG5cbnZhciBhcnIgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChyZXF1aXJlKFwiQGludGVyYWN0anMvdXRpbHMvYXJyXCIpKTtcblxudmFyIGlzID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQocmVxdWlyZShcIkBpbnRlcmFjdGpzL3V0aWxzL2lzXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iajsgfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgeyB2YXIgZGVzYyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID8gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIGtleSkgOiB7fTsgaWYgKGRlc2MuZ2V0IHx8IGRlc2Muc2V0KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuZXdPYmosIGtleSwgZGVzYyk7IH0gZWxzZSB7IG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSB9IH0gbmV3T2JqW1wiZGVmYXVsdFwiXSA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cbl9zY29wZS5BY3Rpb25OYW1lLkRyYWcgPSAnZHJhZyc7XG5cbmZ1bmN0aW9uIGluc3RhbGwoc2NvcGUpIHtcbiAgdmFyIGFjdGlvbnMgPSBzY29wZS5hY3Rpb25zLFxuICAgICAgSW50ZXJhY3RhYmxlID0gc2NvcGUuSW50ZXJhY3RhYmxlLFxuICAgICAgaW50ZXJhY3Rpb25zID0gc2NvcGUuaW50ZXJhY3Rpb25zLFxuICAgICAgZGVmYXVsdHMgPSBzY29wZS5kZWZhdWx0cztcbiAgaW50ZXJhY3Rpb25zLnNpZ25hbHMub24oJ2JlZm9yZS1hY3Rpb24tbW92ZScsIGJlZm9yZU1vdmUpO1xuICBpbnRlcmFjdGlvbnMuc2lnbmFscy5vbignYWN0aW9uLXJlc3VtZScsIGJlZm9yZU1vdmUpOyAvLyBkcmFnbW92ZVxuXG4gIGludGVyYWN0aW9ucy5zaWduYWxzLm9uKCdhY3Rpb24tbW92ZScsIG1vdmUpO1xuICBJbnRlcmFjdGFibGUucHJvdG90eXBlLmRyYWdnYWJsZSA9IGRyYWcuZHJhZ2dhYmxlO1xuICBhY3Rpb25zW19zY29wZS5BY3Rpb25OYW1lLkRyYWddID0gZHJhZztcbiAgYWN0aW9ucy5uYW1lcy5wdXNoKF9zY29wZS5BY3Rpb25OYW1lLkRyYWcpO1xuICBhcnIubWVyZ2UoYWN0aW9ucy5ldmVudFR5cGVzLCBbJ2RyYWdzdGFydCcsICdkcmFnbW92ZScsICdkcmFnaW5lcnRpYXN0YXJ0JywgJ2RyYWdyZXN1bWUnLCAnZHJhZ2VuZCddKTtcbiAgYWN0aW9ucy5tZXRob2REaWN0LmRyYWcgPSAnZHJhZ2dhYmxlJztcbiAgZGVmYXVsdHMuYWN0aW9ucy5kcmFnID0gZHJhZy5kZWZhdWx0cztcbn1cblxuZnVuY3Rpb24gYmVmb3JlTW92ZShfcmVmKSB7XG4gIHZhciBpbnRlcmFjdGlvbiA9IF9yZWYuaW50ZXJhY3Rpb247XG5cbiAgaWYgKGludGVyYWN0aW9uLnByZXBhcmVkLm5hbWUgIT09ICdkcmFnJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBheGlzID0gaW50ZXJhY3Rpb24ucHJlcGFyZWQuYXhpcztcblxuICBpZiAoYXhpcyA9PT0gJ3gnKSB7XG4gICAgaW50ZXJhY3Rpb24uY29vcmRzLmN1ci5wYWdlLnkgPSBpbnRlcmFjdGlvbi5jb29yZHMuc3RhcnQucGFnZS55O1xuICAgIGludGVyYWN0aW9uLmNvb3Jkcy5jdXIuY2xpZW50LnkgPSBpbnRlcmFjdGlvbi5jb29yZHMuc3RhcnQuY2xpZW50Lnk7XG4gICAgaW50ZXJhY3Rpb24uY29vcmRzLnZlbG9jaXR5LmNsaWVudC55ID0gMDtcbiAgICBpbnRlcmFjdGlvbi5jb29yZHMudmVsb2NpdHkucGFnZS55ID0gMDtcbiAgfSBlbHNlIGlmIChheGlzID09PSAneScpIHtcbiAgICBpbnRlcmFjdGlvbi5jb29yZHMuY3VyLnBhZ2UueCA9IGludGVyYWN0aW9uLmNvb3Jkcy5zdGFydC5wYWdlLng7XG4gICAgaW50ZXJhY3Rpb24uY29vcmRzLmN1ci5jbGllbnQueCA9IGludGVyYWN0aW9uLmNvb3Jkcy5zdGFydC5jbGllbnQueDtcbiAgICBpbnRlcmFjdGlvbi5jb29yZHMudmVsb2NpdHkuY2xpZW50LnggPSAwO1xuICAgIGludGVyYWN0aW9uLmNvb3Jkcy52ZWxvY2l0eS5wYWdlLnggPSAwO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1vdmUoX3JlZjIpIHtcbiAgdmFyIGlFdmVudCA9IF9yZWYyLmlFdmVudCxcbiAgICAgIGludGVyYWN0aW9uID0gX3JlZjIuaW50ZXJhY3Rpb247XG5cbiAgaWYgKGludGVyYWN0aW9uLnByZXBhcmVkLm5hbWUgIT09ICdkcmFnJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBheGlzID0gaW50ZXJhY3Rpb24ucHJlcGFyZWQuYXhpcztcblxuICBpZiAoYXhpcyA9PT0gJ3gnIHx8IGF4aXMgPT09ICd5Jykge1xuICAgIHZhciBvcHBvc2l0ZSA9IGF4aXMgPT09ICd4JyA/ICd5JyA6ICd4JztcbiAgICBpRXZlbnQucGFnZVtvcHBvc2l0ZV0gPSBpbnRlcmFjdGlvbi5jb29yZHMuc3RhcnQucGFnZVtvcHBvc2l0ZV07XG4gICAgaUV2ZW50LmNsaWVudFtvcHBvc2l0ZV0gPSBpbnRlcmFjdGlvbi5jb29yZHMuc3RhcnQuY2xpZW50W29wcG9zaXRlXTtcbiAgICBpRXZlbnQuZGVsdGFbb3Bwb3NpdGVdID0gMDtcbiAgfVxufVxuLyoqXG4gKiBgYGBqc1xuICogaW50ZXJhY3QoZWxlbWVudCkuZHJhZ2dhYmxlKHtcbiAqICAgICBvbnN0YXJ0OiBmdW5jdGlvbiAoZXZlbnQpIHt9LFxuICogICAgIG9ubW92ZSA6IGZ1bmN0aW9uIChldmVudCkge30sXG4gKiAgICAgb25lbmQgIDogZnVuY3Rpb24gKGV2ZW50KSB7fSxcbiAqXG4gKiAgICAgLy8gdGhlIGF4aXMgaW4gd2hpY2ggdGhlIGZpcnN0IG1vdmVtZW50IG11c3QgYmVcbiAqICAgICAvLyBmb3IgdGhlIGRyYWcgc2VxdWVuY2UgdG8gc3RhcnRcbiAqICAgICAvLyAneHknIGJ5IGRlZmF1bHQgLSBhbnkgZGlyZWN0aW9uXG4gKiAgICAgc3RhcnRBeGlzOiAneCcgfHwgJ3knIHx8ICd4eScsXG4gKlxuICogICAgIC8vICd4eScgYnkgZGVmYXVsdCAtIGRvbid0IHJlc3RyaWN0IHRvIG9uZSBheGlzIChtb3ZlIGluIGFueSBkaXJlY3Rpb24pXG4gKiAgICAgLy8gJ3gnIG9yICd5JyB0byByZXN0cmljdCBtb3ZlbWVudCB0byBlaXRoZXIgYXhpc1xuICogICAgIC8vICdzdGFydCcgdG8gcmVzdHJpY3QgbW92ZW1lbnQgdG8gdGhlIGF4aXMgdGhlIGRyYWcgc3RhcnRlZCBpblxuICogICAgIGxvY2tBeGlzOiAneCcgfHwgJ3knIHx8ICd4eScgfHwgJ3N0YXJ0JyxcbiAqXG4gKiAgICAgLy8gbWF4IG51bWJlciBvZiBkcmFncyB0aGF0IGNhbiBoYXBwZW4gY29uY3VycmVudGx5XG4gKiAgICAgLy8gd2l0aCBlbGVtZW50cyBvZiB0aGlzIEludGVyYWN0YWJsZS4gSW5maW5pdHkgYnkgZGVmYXVsdFxuICogICAgIG1heDogSW5maW5pdHksXG4gKlxuICogICAgIC8vIG1heCBudW1iZXIgb2YgZHJhZ3MgdGhhdCBjYW4gdGFyZ2V0IHRoZSBzYW1lIGVsZW1lbnQrSW50ZXJhY3RhYmxlXG4gKiAgICAgLy8gMSBieSBkZWZhdWx0XG4gKiAgICAgbWF4UGVyRWxlbWVudDogMlxuICogfSlcbiAqXG4gKiB2YXIgaXNEcmFnZ2FibGUgPSBpbnRlcmFjdCgnZWxlbWVudCcpLmRyYWdnYWJsZSgpOyAvLyB0cnVlXG4gKiBgYGBcbiAqXG4gKiBHZXQgb3Igc2V0IHdoZXRoZXIgZHJhZyBhY3Rpb25zIGNhbiBiZSBwZXJmb3JtZWQgb24gdGhlIHRhcmdldFxuICpcbiAqIEBhbGlhcyBJbnRlcmFjdGFibGUucHJvdG90eXBlLmRyYWdnYWJsZVxuICpcbiAqIEBwYXJhbSB7Ym9vbGVhbiB8IG9iamVjdH0gW29wdGlvbnNdIHRydWUvZmFsc2Ugb3IgQW4gb2JqZWN0IHdpdGggZXZlbnRcbiAqIGxpc3RlbmVycyB0byBiZSBmaXJlZCBvbiBkcmFnIGV2ZW50cyAob2JqZWN0IG1ha2VzIHRoZSBJbnRlcmFjdGFibGVcbiAqIGRyYWdnYWJsZSlcbiAqIEByZXR1cm4ge2Jvb2xlYW4gfCBJbnRlcmFjdGFibGV9IGJvb2xlYW4gaW5kaWNhdGluZyBpZiB0aGlzIGNhbiBiZSB0aGVcbiAqIHRhcmdldCBvZiBkcmFnIGV2ZW50cywgb3IgdGhpcyBJbnRlcmN0YWJsZVxuICovXG5cblxudmFyIGRyYWdnYWJsZSA9IGZ1bmN0aW9uIGRyYWdnYWJsZShvcHRpb25zKSB7XG4gIGlmIChpcy5vYmplY3Qob3B0aW9ucykpIHtcbiAgICB0aGlzLm9wdGlvbnMuZHJhZy5lbmFibGVkID0gb3B0aW9ucy5lbmFibGVkICE9PSBmYWxzZTtcbiAgICB0aGlzLnNldFBlckFjdGlvbignZHJhZycsIG9wdGlvbnMpO1xuICAgIHRoaXMuc2V0T25FdmVudHMoJ2RyYWcnLCBvcHRpb25zKTtcblxuICAgIGlmICgvXih4eXx4fHl8c3RhcnQpJC8udGVzdChvcHRpb25zLmxvY2tBeGlzKSkge1xuICAgICAgdGhpcy5vcHRpb25zLmRyYWcubG9ja0F4aXMgPSBvcHRpb25zLmxvY2tBeGlzO1xuICAgIH1cblxuICAgIGlmICgvXih4eXx4fHkpJC8udGVzdChvcHRpb25zLnN0YXJ0QXhpcykpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5kcmFnLnN0YXJ0QXhpcyA9IG9wdGlvbnMuc3RhcnRBeGlzO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgaWYgKGlzLmJvb2wob3B0aW9ucykpIHtcbiAgICB0aGlzLm9wdGlvbnMuZHJhZy5lbmFibGVkID0gb3B0aW9ucztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJldHVybiB0aGlzLm9wdGlvbnMuZHJhZztcbn07XG5cbnZhciBkcmFnID0ge1xuICBpZDogJ2FjdGlvbnMvZHJhZycsXG4gIGluc3RhbGw6IGluc3RhbGwsXG4gIGRyYWdnYWJsZTogZHJhZ2dhYmxlLFxuICBiZWZvcmVNb3ZlOiBiZWZvcmVNb3ZlLFxuICBtb3ZlOiBtb3ZlLFxuICBkZWZhdWx0czoge1xuICAgIHN0YXJ0QXhpczogJ3h5JyxcbiAgICBsb2NrQXhpczogJ3h5J1xuICB9LFxuICBjaGVja2VyOiBmdW5jdGlvbiBjaGVja2VyKF9wb2ludGVyLCBfZXZlbnQsIGludGVyYWN0YWJsZSkge1xuICAgIHZhciBkcmFnT3B0aW9ucyA9IGludGVyYWN0YWJsZS5vcHRpb25zLmRyYWc7XG4gICAgcmV0dXJuIGRyYWdPcHRpb25zLmVuYWJsZWQgPyB7XG4gICAgICBuYW1lOiAnZHJhZycsXG4gICAgICBheGlzOiBkcmFnT3B0aW9ucy5sb2NrQXhpcyA9PT0gJ3N0YXJ0JyA/IGRyYWdPcHRpb25zLnN0YXJ0QXhpcyA6IGRyYWdPcHRpb25zLmxvY2tBeGlzXG4gICAgfSA6IG51bGw7XG4gIH0sXG4gIGdldEN1cnNvcjogZnVuY3Rpb24gZ2V0Q3Vyc29yKCkge1xuICAgIHJldHVybiAnbW92ZSc7XG4gIH1cbn07XG52YXIgX2RlZmF1bHQgPSBkcmFnO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBfZGVmYXVsdDtcblxufSx7XCJAaW50ZXJhY3Rqcy9jb3JlL3Njb3BlXCI6MjQsXCJAaW50ZXJhY3Rqcy91dGlscy9hcnJcIjo0NixcIkBpbnRlcmFjdGpzL3V0aWxzL2lzXCI6NTZ9XSwyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciBfQmFzZUV2ZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIkBpbnRlcmFjdGpzL2NvcmUvQmFzZUV2ZW50XCIpKTtcblxudmFyIGFyciA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy91dGlscy9hcnJcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7IHZhciBkZXNjID0gT2JqZWN0LmRlZmluZVByb3BlcnR5ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KSA6IHt9OyBpZiAoZGVzYy5nZXQgfHwgZGVzYy5zZXQpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5ld09iaiwga2V5LCBkZXNjKTsgfSBlbHNlIHsgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IH0gfSBuZXdPYmpbXCJkZWZhdWx0XCJdID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgfSByZXR1cm4gX3R5cGVvZihvYmopOyB9XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgcmV0dXJuIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHx8IF9pdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCBfbm9uSXRlcmFibGVTcHJlYWQoKTsgfVxuXG5mdW5jdGlvbiBfbm9uSXRlcmFibGVTcHJlYWQoKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gc3ByZWFkIG5vbi1pdGVyYWJsZSBpbnN0YW5jZVwiKTsgfVxuXG5mdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5KGl0ZXIpIHsgaWYgKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoaXRlcikgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGl0ZXIpID09PSBcIltvYmplY3QgQXJndW1lbnRzXVwiKSByZXR1cm4gQXJyYXkuZnJvbShpdGVyKTsgfVxuXG5mdW5jdGlvbiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfSB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkgeyByZXR1cm4gY2FsbDsgfSByZXR1cm4gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTsgfVxuXG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHsgaWYgKHNlbGYgPT09IHZvaWQgMCkgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIHNlbGY7IH1cblxuZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgX2dldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTsgfTsgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb25cIik7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgX3NldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTsgfVxuXG5mdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgby5fX3Byb3RvX18gPSBwOyByZXR1cm4gbzsgfTsgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTsgfVxuXG52YXIgRHJvcEV2ZW50ID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfQmFzZUV2ZW50KSB7XG4gIF9pbmhlcml0cyhEcm9wRXZlbnQsIF9CYXNlRXZlbnQpO1xuXG4gIC8qKlxuICAgKiBDbGFzcyBvZiBldmVudHMgZmlyZWQgb24gZHJvcHpvbmVzIGR1cmluZyBkcmFncyB3aXRoIGFjY2VwdGFibGUgdGFyZ2V0cy5cbiAgICovXG4gIGZ1bmN0aW9uIERyb3BFdmVudChkcm9wU3RhdGUsIGRyYWdFdmVudCwgdHlwZSkge1xuICAgIHZhciBfdGhpcztcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBEcm9wRXZlbnQpO1xuXG4gICAgX3RoaXMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoRHJvcEV2ZW50KS5jYWxsKHRoaXMsIGRyYWdFdmVudC5faW50ZXJhY3Rpb24pKTtcbiAgICBfdGhpcy5wcm9wYWdhdGlvblN0b3BwZWQgPSBmYWxzZTtcbiAgICBfdGhpcy5pbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQgPSBmYWxzZTtcblxuICAgIHZhciBfcmVmID0gdHlwZSA9PT0gJ2RyYWdsZWF2ZScgPyBkcm9wU3RhdGUucHJldiA6IGRyb3BTdGF0ZS5jdXIsXG4gICAgICAgIGVsZW1lbnQgPSBfcmVmLmVsZW1lbnQsXG4gICAgICAgIGRyb3B6b25lID0gX3JlZi5kcm9wem9uZTtcblxuICAgIF90aGlzLnR5cGUgPSB0eXBlO1xuICAgIF90aGlzLnRhcmdldCA9IGVsZW1lbnQ7XG4gICAgX3RoaXMuY3VycmVudFRhcmdldCA9IGVsZW1lbnQ7XG4gICAgX3RoaXMuZHJvcHpvbmUgPSBkcm9wem9uZTtcbiAgICBfdGhpcy5kcmFnRXZlbnQgPSBkcmFnRXZlbnQ7XG4gICAgX3RoaXMucmVsYXRlZFRhcmdldCA9IGRyYWdFdmVudC50YXJnZXQ7XG4gICAgX3RoaXMuZHJhZ2dhYmxlID0gZHJhZ0V2ZW50LmludGVyYWN0YWJsZTtcbiAgICBfdGhpcy50aW1lU3RhbXAgPSBkcmFnRXZlbnQudGltZVN0YW1wO1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuICAvKipcbiAgICogSWYgdGhpcyBpcyBhIGBkcm9wYWN0aXZhdGVgIGV2ZW50LCB0aGUgZHJvcHpvbmUgZWxlbWVudCB3aWxsIGJlXG4gICAqIGRlYWN0aXZhdGVkLlxuICAgKlxuICAgKiBJZiB0aGlzIGlzIGEgYGRyYWdtb3ZlYCBvciBgZHJhZ2VudGVyYCwgYSBgZHJhZ2xlYXZlYCB3aWxsIGJlIGZpcmVkIG9uIHRoZVxuICAgKiBkcm9wem9uZSBlbGVtZW50IGFuZCBtb3JlLlxuICAgKi9cblxuXG4gIF9jcmVhdGVDbGFzcyhEcm9wRXZlbnQsIFt7XG4gICAga2V5OiBcInJlamVjdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZWplY3QoKSB7XG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgdmFyIGRyb3BTdGF0ZSA9IHRoaXMuX2ludGVyYWN0aW9uLmRyb3BTdGF0ZTtcblxuICAgICAgaWYgKHRoaXMudHlwZSAhPT0gJ2Ryb3BhY3RpdmF0ZScgJiYgKCF0aGlzLmRyb3B6b25lIHx8IGRyb3BTdGF0ZS5jdXIuZHJvcHpvbmUgIT09IHRoaXMuZHJvcHpvbmUgfHwgZHJvcFN0YXRlLmN1ci5lbGVtZW50ICE9PSB0aGlzLnRhcmdldCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBkcm9wU3RhdGUucHJldi5kcm9wem9uZSA9IHRoaXMuZHJvcHpvbmU7XG4gICAgICBkcm9wU3RhdGUucHJldi5lbGVtZW50ID0gdGhpcy50YXJnZXQ7XG4gICAgICBkcm9wU3RhdGUucmVqZWN0ZWQgPSB0cnVlO1xuICAgICAgZHJvcFN0YXRlLmV2ZW50cy5lbnRlciA9IG51bGw7XG4gICAgICB0aGlzLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXG4gICAgICBpZiAodGhpcy50eXBlID09PSAnZHJvcGFjdGl2YXRlJykge1xuICAgICAgICB2YXIgYWN0aXZlRHJvcHMgPSBkcm9wU3RhdGUuYWN0aXZlRHJvcHM7XG4gICAgICAgIHZhciBpbmRleCA9IGFyci5maW5kSW5kZXgoYWN0aXZlRHJvcHMsIGZ1bmN0aW9uIChfcmVmMikge1xuICAgICAgICAgIHZhciBkcm9wem9uZSA9IF9yZWYyLmRyb3B6b25lLFxuICAgICAgICAgICAgICBlbGVtZW50ID0gX3JlZjIuZWxlbWVudDtcbiAgICAgICAgICByZXR1cm4gZHJvcHpvbmUgPT09IF90aGlzMi5kcm9wem9uZSAmJiBlbGVtZW50ID09PSBfdGhpczIudGFyZ2V0O1xuICAgICAgICB9KTtcbiAgICAgICAgZHJvcFN0YXRlLmFjdGl2ZURyb3BzID0gW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShhY3RpdmVEcm9wcy5zbGljZSgwLCBpbmRleCkpLCBfdG9Db25zdW1hYmxlQXJyYXkoYWN0aXZlRHJvcHMuc2xpY2UoaW5kZXggKyAxKSkpO1xuICAgICAgICB2YXIgZGVhY3RpdmF0ZUV2ZW50ID0gbmV3IERyb3BFdmVudChkcm9wU3RhdGUsIHRoaXMuZHJhZ0V2ZW50LCAnZHJvcGRlYWN0aXZhdGUnKTtcbiAgICAgICAgZGVhY3RpdmF0ZUV2ZW50LmRyb3B6b25lID0gdGhpcy5kcm9wem9uZTtcbiAgICAgICAgZGVhY3RpdmF0ZUV2ZW50LnRhcmdldCA9IHRoaXMudGFyZ2V0O1xuICAgICAgICB0aGlzLmRyb3B6b25lLmZpcmUoZGVhY3RpdmF0ZUV2ZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZHJvcHpvbmUuZmlyZShuZXcgRHJvcEV2ZW50KGRyb3BTdGF0ZSwgdGhpcy5kcmFnRXZlbnQsICdkcmFnbGVhdmUnKSk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInByZXZlbnREZWZhdWx0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHByZXZlbnREZWZhdWx0KCkge31cbiAgfSwge1xuICAgIGtleTogXCJzdG9wUHJvcGFnYXRpb25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3RvcFByb3BhZ2F0aW9uKCkge1xuICAgICAgdGhpcy5wcm9wYWdhdGlvblN0b3BwZWQgPSB0cnVlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCkge1xuICAgICAgdGhpcy5pbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQgPSB0aGlzLnByb3BhZ2F0aW9uU3RvcHBlZCA9IHRydWU7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIERyb3BFdmVudDtcbn0oX0Jhc2VFdmVudDJbXCJkZWZhdWx0XCJdKTtcblxudmFyIF9kZWZhdWx0ID0gRHJvcEV2ZW50O1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBfZGVmYXVsdDtcblxufSx7XCJAaW50ZXJhY3Rqcy9jb3JlL0Jhc2VFdmVudFwiOjEzLFwiQGludGVyYWN0anMvdXRpbHMvYXJyXCI6NDZ9XSwzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciB1dGlscyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy91dGlsc1wiKSk7XG5cbnZhciBfZHJhZyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uL2RyYWdcIikpO1xuXG52YXIgX0Ryb3BFdmVudCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vRHJvcEV2ZW50XCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHsgdmFyIGRlc2MgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkgJiYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBrZXkpIDoge307IGlmIChkZXNjLmdldCB8fCBkZXNjLnNldCkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkobmV3T2JqLCBrZXksIGRlc2MpOyB9IGVsc2UgeyBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gfSB9IG5ld09ialtcImRlZmF1bHRcIl0gPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXG5mdW5jdGlvbiBpbnN0YWxsKHNjb3BlKSB7XG4gIHZhciBhY3Rpb25zID0gc2NvcGUuYWN0aW9ucyxcbiAgICAgIGludGVyYWN0ID0gc2NvcGUuaW50ZXJhY3QsXG4gICAgICBJbnRlcmFjdGFibGUgPSBzY29wZS5JbnRlcmFjdGFibGUsXG4gICAgICBpbnRlcmFjdGlvbnMgPSBzY29wZS5pbnRlcmFjdGlvbnMsXG4gICAgICBkZWZhdWx0cyA9IHNjb3BlLmRlZmF1bHRzO1xuICBzY29wZS51c2VQbHVnaW4oX2RyYWdbXCJkZWZhdWx0XCJdKTtcbiAgaW50ZXJhY3Rpb25zLnNpZ25hbHMub24oJ2JlZm9yZS1hY3Rpb24tc3RhcnQnLCBmdW5jdGlvbiAoX3JlZikge1xuICAgIHZhciBpbnRlcmFjdGlvbiA9IF9yZWYuaW50ZXJhY3Rpb247XG5cbiAgICBpZiAoaW50ZXJhY3Rpb24ucHJlcGFyZWQubmFtZSAhPT0gJ2RyYWcnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaW50ZXJhY3Rpb24uZHJvcFN0YXRlID0ge1xuICAgICAgY3VyOiB7XG4gICAgICAgIGRyb3B6b25lOiBudWxsLFxuICAgICAgICBlbGVtZW50OiBudWxsXG4gICAgICB9LFxuICAgICAgcHJldjoge1xuICAgICAgICBkcm9wem9uZTogbnVsbCxcbiAgICAgICAgZWxlbWVudDogbnVsbFxuICAgICAgfSxcbiAgICAgIHJlamVjdGVkOiBudWxsLFxuICAgICAgZXZlbnRzOiBudWxsLFxuICAgICAgYWN0aXZlRHJvcHM6IG51bGxcbiAgICB9O1xuICB9KTtcbiAgaW50ZXJhY3Rpb25zLnNpZ25hbHMub24oJ2FmdGVyLWFjdGlvbi1zdGFydCcsIGZ1bmN0aW9uIChfcmVmMikge1xuICAgIHZhciBpbnRlcmFjdGlvbiA9IF9yZWYyLmludGVyYWN0aW9uLFxuICAgICAgICBldmVudCA9IF9yZWYyLmV2ZW50LFxuICAgICAgICBkcmFnRXZlbnQgPSBfcmVmMi5pRXZlbnQ7XG5cbiAgICBpZiAoaW50ZXJhY3Rpb24ucHJlcGFyZWQubmFtZSAhPT0gJ2RyYWcnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGRyb3BTdGF0ZSA9IGludGVyYWN0aW9uLmRyb3BTdGF0ZTsgLy8gcmVzZXQgYWN0aXZlIGRyb3B6b25lc1xuXG4gICAgZHJvcFN0YXRlLmFjdGl2ZURyb3BzID0gbnVsbDtcbiAgICBkcm9wU3RhdGUuZXZlbnRzID0gbnVsbDtcbiAgICBkcm9wU3RhdGUuYWN0aXZlRHJvcHMgPSBnZXRBY3RpdmVEcm9wcyhzY29wZSwgaW50ZXJhY3Rpb24uZWxlbWVudCk7XG4gICAgZHJvcFN0YXRlLmV2ZW50cyA9IGdldERyb3BFdmVudHMoaW50ZXJhY3Rpb24sIGV2ZW50LCBkcmFnRXZlbnQpO1xuXG4gICAgaWYgKGRyb3BTdGF0ZS5ldmVudHMuYWN0aXZhdGUpIHtcbiAgICAgIGZpcmVBY3RpdmF0aW9uRXZlbnRzKGRyb3BTdGF0ZS5hY3RpdmVEcm9wcywgZHJvcFN0YXRlLmV2ZW50cy5hY3RpdmF0ZSk7XG4gICAgfVxuICB9KTsgLy8gRklYTUUgcHJvcGVyIHNpZ25hbCB0eXBlc1xuXG4gIGludGVyYWN0aW9ucy5zaWduYWxzLm9uKCdhY3Rpb24tbW92ZScsIGZ1bmN0aW9uIChhcmcpIHtcbiAgICByZXR1cm4gb25FdmVudENyZWF0ZWQoYXJnLCBzY29wZSk7XG4gIH0pO1xuICBpbnRlcmFjdGlvbnMuc2lnbmFscy5vbignYWN0aW9uLWVuZCcsIGZ1bmN0aW9uIChhcmcpIHtcbiAgICByZXR1cm4gb25FdmVudENyZWF0ZWQoYXJnLCBzY29wZSk7XG4gIH0pO1xuICBpbnRlcmFjdGlvbnMuc2lnbmFscy5vbignYWZ0ZXItYWN0aW9uLW1vdmUnLCBmdW5jdGlvbiAoX3JlZjMpIHtcbiAgICB2YXIgaW50ZXJhY3Rpb24gPSBfcmVmMy5pbnRlcmFjdGlvbjtcblxuICAgIGlmIChpbnRlcmFjdGlvbi5wcmVwYXJlZC5uYW1lICE9PSAnZHJhZycpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmaXJlRHJvcEV2ZW50cyhpbnRlcmFjdGlvbiwgaW50ZXJhY3Rpb24uZHJvcFN0YXRlLmV2ZW50cyk7XG4gICAgaW50ZXJhY3Rpb24uZHJvcFN0YXRlLmV2ZW50cyA9IHt9O1xuICB9KTtcbiAgaW50ZXJhY3Rpb25zLnNpZ25hbHMub24oJ2FmdGVyLWFjdGlvbi1lbmQnLCBmdW5jdGlvbiAoX3JlZjQpIHtcbiAgICB2YXIgaW50ZXJhY3Rpb24gPSBfcmVmNC5pbnRlcmFjdGlvbjtcblxuICAgIGlmIChpbnRlcmFjdGlvbi5wcmVwYXJlZC5uYW1lICE9PSAnZHJhZycpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmaXJlRHJvcEV2ZW50cyhpbnRlcmFjdGlvbiwgaW50ZXJhY3Rpb24uZHJvcFN0YXRlLmV2ZW50cyk7XG4gIH0pO1xuICBpbnRlcmFjdGlvbnMuc2lnbmFscy5vbignc3RvcCcsIGZ1bmN0aW9uIChfcmVmNSkge1xuICAgIHZhciBpbnRlcmFjdGlvbiA9IF9yZWY1LmludGVyYWN0aW9uO1xuXG4gICAgaWYgKGludGVyYWN0aW9uLnByZXBhcmVkLm5hbWUgIT09ICdkcmFnJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBkcm9wU3RhdGUgPSBpbnRlcmFjdGlvbi5kcm9wU3RhdGU7XG4gICAgZHJvcFN0YXRlLmFjdGl2ZURyb3BzID0gbnVsbDtcbiAgICBkcm9wU3RhdGUuZXZlbnRzID0gbnVsbDtcbiAgICBkcm9wU3RhdGUuY3VyLmRyb3B6b25lID0gbnVsbDtcbiAgICBkcm9wU3RhdGUuY3VyLmVsZW1lbnQgPSBudWxsO1xuICAgIGRyb3BTdGF0ZS5wcmV2LmRyb3B6b25lID0gbnVsbDtcbiAgICBkcm9wU3RhdGUucHJldi5lbGVtZW50ID0gbnVsbDtcbiAgICBkcm9wU3RhdGUucmVqZWN0ZWQgPSBmYWxzZTtcbiAgfSk7XG4gIC8qKlxuICAgKlxuICAgKiBgYGBqc1xuICAgKiBpbnRlcmFjdCgnLmRyb3AnKS5kcm9wem9uZSh7XG4gICAqICAgYWNjZXB0OiAnLmNhbi1kcm9wJyB8fCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2luZ2xlLWRyb3AnKSxcbiAgICogICBvdmVybGFwOiAncG9pbnRlcicgfHwgJ2NlbnRlcicgfHwgemVyb1RvT25lXG4gICAqIH1cbiAgICogYGBgXG4gICAqXG4gICAqIFJldHVybnMgb3Igc2V0cyB3aGV0aGVyIGRyYWdnYWJsZXMgY2FuIGJlIGRyb3BwZWQgb250byB0aGlzIHRhcmdldCB0b1xuICAgKiB0cmlnZ2VyIGRyb3AgZXZlbnRzXG4gICAqXG4gICAqIERyb3B6b25lcyBjYW4gcmVjZWl2ZSB0aGUgZm9sbG93aW5nIGV2ZW50czpcbiAgICogIC0gYGRyb3BhY3RpdmF0ZWAgYW5kIGBkcm9wZGVhY3RpdmF0ZWAgd2hlbiBhbiBhY2NlcHRhYmxlIGRyYWcgc3RhcnRzIGFuZCBlbmRzXG4gICAqICAtIGBkcmFnZW50ZXJgIGFuZCBgZHJhZ2xlYXZlYCB3aGVuIGEgZHJhZ2dhYmxlIGVudGVycyBhbmQgbGVhdmVzIHRoZSBkcm9wem9uZVxuICAgKiAgLSBgZHJhZ21vdmVgIHdoZW4gYSBkcmFnZ2FibGUgdGhhdCBoYXMgZW50ZXJlZCB0aGUgZHJvcHpvbmUgaXMgbW92ZWRcbiAgICogIC0gYGRyb3BgIHdoZW4gYSBkcmFnZ2FibGUgaXMgZHJvcHBlZCBpbnRvIHRoaXMgZHJvcHpvbmVcbiAgICpcbiAgICogVXNlIHRoZSBgYWNjZXB0YCBvcHRpb24gdG8gYWxsb3cgb25seSBlbGVtZW50cyB0aGF0IG1hdGNoIHRoZSBnaXZlbiBDU1NcbiAgICogc2VsZWN0b3Igb3IgZWxlbWVudC4gVGhlIHZhbHVlIGNhbiBiZTpcbiAgICpcbiAgICogIC0gKiphbiBFbGVtZW50KiogLSBvbmx5IHRoYXQgZWxlbWVudCBjYW4gYmUgZHJvcHBlZCBpbnRvIHRoaXMgZHJvcHpvbmUuXG4gICAqICAtICoqYSBzdHJpbmcqKiwgLSB0aGUgZWxlbWVudCBiZWluZyBkcmFnZ2VkIG11c3QgbWF0Y2ggaXQgYXMgYSBDU1Mgc2VsZWN0b3IuXG4gICAqICAtICoqYG51bGxgKiogLSBhY2NlcHQgb3B0aW9ucyBpcyBjbGVhcmVkIC0gaXQgYWNjZXB0cyBhbnkgZWxlbWVudC5cbiAgICpcbiAgICogVXNlIHRoZSBgb3ZlcmxhcGAgb3B0aW9uIHRvIHNldCBob3cgZHJvcHMgYXJlIGNoZWNrZWQgZm9yLiBUaGUgYWxsb3dlZFxuICAgKiB2YWx1ZXMgYXJlOlxuICAgKlxuICAgKiAgIC0gYCdwb2ludGVyJ2AsIHRoZSBwb2ludGVyIG11c3QgYmUgb3ZlciB0aGUgZHJvcHpvbmUgKGRlZmF1bHQpXG4gICAqICAgLSBgJ2NlbnRlcidgLCB0aGUgZHJhZ2dhYmxlIGVsZW1lbnQncyBjZW50ZXIgbXVzdCBiZSBvdmVyIHRoZSBkcm9wem9uZVxuICAgKiAgIC0gYSBudW1iZXIgZnJvbSAwLTEgd2hpY2ggaXMgdGhlIGAoaW50ZXJzZWN0aW9uIGFyZWEpIC8gKGRyYWdnYWJsZSBhcmVhKWAuXG4gICAqICAgZS5nLiBgMC41YCBmb3IgZHJvcCB0byBoYXBwZW4gd2hlbiBoYWxmIG9mIHRoZSBhcmVhIG9mIHRoZSBkcmFnZ2FibGUgaXNcbiAgICogICBvdmVyIHRoZSBkcm9wem9uZVxuICAgKlxuICAgKiBVc2UgdGhlIGBjaGVja2VyYCBvcHRpb24gdG8gc3BlY2lmeSBhIGZ1bmN0aW9uIHRvIGNoZWNrIGlmIGEgZHJhZ2dlZCBlbGVtZW50XG4gICAqIGlzIG92ZXIgdGhpcyBJbnRlcmFjdGFibGUuXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbiB8IG9iamVjdCB8IG51bGx9IFtvcHRpb25zXSBUaGUgbmV3IG9wdGlvbnMgdG8gYmUgc2V0LlxuICAgKiBAcmV0dXJuIHtib29sZWFuIHwgSW50ZXJhY3RhYmxlfSBUaGUgY3VycmVudCBzZXR0aW5nIG9yIHRoaXMgSW50ZXJhY3RhYmxlXG4gICAqL1xuXG4gIEludGVyYWN0YWJsZS5wcm90b3R5cGUuZHJvcHpvbmUgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHJldHVybiBkcm9wem9uZU1ldGhvZCh0aGlzLCBvcHRpb25zKTtcbiAgfTtcbiAgLyoqXG4gICAqIGBgYGpzXG4gICAqIGludGVyYWN0KHRhcmdldClcbiAgICogLmRyb3BDaGVja2VyKGZ1bmN0aW9uKGRyYWdFdmVudCwgICAgICAgICAvLyByZWxhdGVkIGRyYWdtb3ZlIG9yIGRyYWdlbmQgZXZlbnRcbiAgICogICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LCAgICAgICAgICAgICAvLyBUb3VjaEV2ZW50L1BvaW50ZXJFdmVudC9Nb3VzZUV2ZW50XG4gICAqICAgICAgICAgICAgICAgICAgICAgICBkcm9wcGVkLCAgICAgICAgICAgLy8gYm9vbCByZXN1bHQgb2YgdGhlIGRlZmF1bHQgY2hlY2tlclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgZHJvcHpvbmUsICAgICAgICAgIC8vIGRyb3B6b25lIEludGVyYWN0YWJsZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgZHJvcEVsZW1lbnQsICAgICAgIC8vIGRyb3B6b25lIGVsZW1udFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgZHJhZ2dhYmxlLCAgICAgICAgIC8vIGRyYWdnYWJsZSBJbnRlcmFjdGFibGVcbiAgICogICAgICAgICAgICAgICAgICAgICAgIGRyYWdnYWJsZUVsZW1lbnQpIHsvLyBkcmFnZ2FibGUgZWxlbWVudFxuICAgKlxuICAgKiAgIHJldHVybiBkcm9wcGVkICYmIGV2ZW50LnRhcmdldC5oYXNBdHRyaWJ1dGUoJ2FsbG93LWRyb3AnKVxuICAgKiB9XG4gICAqIGBgYFxuICAgKi9cblxuXG4gIEludGVyYWN0YWJsZS5wcm90b3R5cGUuZHJvcENoZWNrID0gZnVuY3Rpb24gKGRyYWdFdmVudCwgZXZlbnQsIGRyYWdnYWJsZSwgZHJhZ2dhYmxlRWxlbWVudCwgZHJvcEVsZW1lbnQsIHJlY3QpIHtcbiAgICByZXR1cm4gZHJvcENoZWNrTWV0aG9kKHRoaXMsIGRyYWdFdmVudCwgZXZlbnQsIGRyYWdnYWJsZSwgZHJhZ2dhYmxlRWxlbWVudCwgZHJvcEVsZW1lbnQsIHJlY3QpO1xuICB9O1xuICAvKipcbiAgICogUmV0dXJucyBvciBzZXRzIHdoZXRoZXIgdGhlIGRpbWVuc2lvbnMgb2YgZHJvcHpvbmUgZWxlbWVudHMgYXJlIGNhbGN1bGF0ZWRcbiAgICogb24gZXZlcnkgZHJhZ21vdmUgb3Igb25seSBvbiBkcmFnc3RhcnQgZm9yIHRoZSBkZWZhdWx0IGRyb3BDaGVja2VyXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW25ld1ZhbHVlXSBUcnVlIHRvIGNoZWNrIG9uIGVhY2ggbW92ZS4gRmFsc2UgdG8gY2hlY2sgb25seVxuICAgKiBiZWZvcmUgc3RhcnRcbiAgICogQHJldHVybiB7Ym9vbGVhbiB8IGludGVyYWN0fSBUaGUgY3VycmVudCBzZXR0aW5nIG9yIGludGVyYWN0XG4gICAqL1xuXG5cbiAgaW50ZXJhY3QuZHluYW1pY0Ryb3AgPSBmdW5jdGlvbiAobmV3VmFsdWUpIHtcbiAgICBpZiAodXRpbHMuaXMuYm9vbChuZXdWYWx1ZSkpIHtcbiAgICAgIC8vIGlmIChkcmFnZ2luZyAmJiBzY29wZS5keW5hbWljRHJvcCAhPT0gbmV3VmFsdWUgJiYgIW5ld1ZhbHVlKSB7XG4gICAgICAvLyAgY2FsY1JlY3RzKGRyb3B6b25lcylcbiAgICAgIC8vIH1cbiAgICAgIHNjb3BlLmR5bmFtaWNEcm9wID0gbmV3VmFsdWU7XG4gICAgICByZXR1cm4gaW50ZXJhY3Q7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNjb3BlLmR5bmFtaWNEcm9wO1xuICB9O1xuXG4gIHV0aWxzLmFyci5tZXJnZShhY3Rpb25zLmV2ZW50VHlwZXMsIFsnZHJhZ2VudGVyJywgJ2RyYWdsZWF2ZScsICdkcm9wYWN0aXZhdGUnLCAnZHJvcGRlYWN0aXZhdGUnLCAnZHJvcG1vdmUnLCAnZHJvcCddKTtcbiAgYWN0aW9ucy5tZXRob2REaWN0LmRyb3AgPSAnZHJvcHpvbmUnO1xuICBzY29wZS5keW5hbWljRHJvcCA9IGZhbHNlO1xuICBkZWZhdWx0cy5hY3Rpb25zLmRyb3AgPSBkcm9wLmRlZmF1bHRzO1xufVxuXG5mdW5jdGlvbiBjb2xsZWN0RHJvcHMoX3JlZjYsIGRyYWdnYWJsZUVsZW1lbnQpIHtcbiAgdmFyIGludGVyYWN0YWJsZXMgPSBfcmVmNi5pbnRlcmFjdGFibGVzO1xuICB2YXIgZHJvcHMgPSBbXTsgLy8gY29sbGVjdCBhbGwgZHJvcHpvbmVzIGFuZCB0aGVpciBlbGVtZW50cyB3aGljaCBxdWFsaWZ5IGZvciBhIGRyb3BcblxuICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgaW50ZXJhY3RhYmxlcy5saXN0Lmxlbmd0aDsgX2krKykge1xuICAgIHZhciBfcmVmNztcblxuICAgIF9yZWY3ID0gaW50ZXJhY3RhYmxlcy5saXN0W19pXTtcbiAgICB2YXIgZHJvcHpvbmUgPSBfcmVmNztcblxuICAgIGlmICghZHJvcHpvbmUub3B0aW9ucy5kcm9wLmVuYWJsZWQpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHZhciBhY2NlcHQgPSBkcm9wem9uZS5vcHRpb25zLmRyb3AuYWNjZXB0OyAvLyB0ZXN0IHRoZSBkcmFnZ2FibGUgZHJhZ2dhYmxlRWxlbWVudCBhZ2FpbnN0IHRoZSBkcm9wem9uZSdzIGFjY2VwdCBzZXR0aW5nXG5cbiAgICBpZiAodXRpbHMuaXMuZWxlbWVudChhY2NlcHQpICYmIGFjY2VwdCAhPT0gZHJhZ2dhYmxlRWxlbWVudCB8fCB1dGlscy5pcy5zdHJpbmcoYWNjZXB0KSAmJiAhdXRpbHMuZG9tLm1hdGNoZXNTZWxlY3RvcihkcmFnZ2FibGVFbGVtZW50LCBhY2NlcHQpIHx8IHV0aWxzLmlzLmZ1bmMoYWNjZXB0KSAmJiAhYWNjZXB0KHtcbiAgICAgIGRyb3B6b25lOiBkcm9wem9uZSxcbiAgICAgIGRyYWdnYWJsZUVsZW1lbnQ6IGRyYWdnYWJsZUVsZW1lbnRcbiAgICB9KSkge1xuICAgICAgY29udGludWU7XG4gICAgfSAvLyBxdWVyeSBmb3IgbmV3IGVsZW1lbnRzIGlmIG5lY2Vzc2FyeVxuXG5cbiAgICB2YXIgZHJvcEVsZW1lbnRzID0gdXRpbHMuaXMuc3RyaW5nKGRyb3B6b25lLnRhcmdldCkgPyBkcm9wem9uZS5fY29udGV4dC5xdWVyeVNlbGVjdG9yQWxsKGRyb3B6b25lLnRhcmdldCkgOiB1dGlscy5pcy5hcnJheShkcm9wem9uZS50YXJnZXQpID8gZHJvcHpvbmUudGFyZ2V0IDogW2Ryb3B6b25lLnRhcmdldF07XG5cbiAgICBmb3IgKHZhciBfaTIgPSAwOyBfaTIgPCBkcm9wRWxlbWVudHMubGVuZ3RoOyBfaTIrKykge1xuICAgICAgdmFyIF9yZWY4O1xuXG4gICAgICBfcmVmOCA9IGRyb3BFbGVtZW50c1tfaTJdO1xuICAgICAgdmFyIGRyb3B6b25lRWxlbWVudCA9IF9yZWY4O1xuXG4gICAgICBpZiAoZHJvcHpvbmVFbGVtZW50ICE9PSBkcmFnZ2FibGVFbGVtZW50KSB7XG4gICAgICAgIGRyb3BzLnB1c2goe1xuICAgICAgICAgIGRyb3B6b25lOiBkcm9wem9uZSxcbiAgICAgICAgICBlbGVtZW50OiBkcm9wem9uZUVsZW1lbnRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRyb3BzO1xufVxuXG5mdW5jdGlvbiBmaXJlQWN0aXZhdGlvbkV2ZW50cyhhY3RpdmVEcm9wcywgZXZlbnQpIHtcbiAgLy8gbG9vcCB0aHJvdWdoIGFsbCBhY3RpdmUgZHJvcHpvbmVzIGFuZCB0cmlnZ2VyIGV2ZW50XG4gIGZvciAodmFyIF9pMyA9IDA7IF9pMyA8IGFjdGl2ZURyb3BzLmxlbmd0aDsgX2kzKyspIHtcbiAgICB2YXIgX3JlZjk7XG5cbiAgICBfcmVmOSA9IGFjdGl2ZURyb3BzW19pM107XG4gICAgdmFyIF9yZWYxMCA9IF9yZWY5LFxuICAgICAgICBkcm9wem9uZSA9IF9yZWYxMC5kcm9wem9uZSxcbiAgICAgICAgZWxlbWVudCA9IF9yZWYxMC5lbGVtZW50O1xuICAgIGV2ZW50LmRyb3B6b25lID0gZHJvcHpvbmU7IC8vIHNldCBjdXJyZW50IGVsZW1lbnQgYXMgZXZlbnQgdGFyZ2V0XG5cbiAgICBldmVudC50YXJnZXQgPSBlbGVtZW50O1xuICAgIGRyb3B6b25lLmZpcmUoZXZlbnQpO1xuICAgIGV2ZW50LnByb3BhZ2F0aW9uU3RvcHBlZCA9IGV2ZW50LmltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZCA9IGZhbHNlO1xuICB9XG59IC8vIHJldHVybiBhIG5ldyBhcnJheSBvZiBwb3NzaWJsZSBkcm9wcy4gZ2V0QWN0aXZlRHJvcHMgc2hvdWxkIGFsd2F5cyBiZVxuLy8gY2FsbGVkIHdoZW4gYSBkcmFnIGhhcyBqdXN0IHN0YXJ0ZWQgb3IgYSBkcmFnIGV2ZW50IGhhcHBlbnMgd2hpbGVcbi8vIGR5bmFtaWNEcm9wIGlzIHRydWVcblxuXG5mdW5jdGlvbiBnZXRBY3RpdmVEcm9wcyhzY29wZSwgZHJhZ0VsZW1lbnQpIHtcbiAgLy8gZ2V0IGRyb3B6b25lcyBhbmQgdGhlaXIgZWxlbWVudHMgdGhhdCBjb3VsZCByZWNlaXZlIHRoZSBkcmFnZ2FibGVcbiAgdmFyIGFjdGl2ZURyb3BzID0gY29sbGVjdERyb3BzKHNjb3BlLCBkcmFnRWxlbWVudCk7XG5cbiAgZm9yICh2YXIgX2k0ID0gMDsgX2k0IDwgYWN0aXZlRHJvcHMubGVuZ3RoOyBfaTQrKykge1xuICAgIHZhciBfcmVmMTE7XG5cbiAgICBfcmVmMTEgPSBhY3RpdmVEcm9wc1tfaTRdO1xuICAgIHZhciBhY3RpdmVEcm9wID0gX3JlZjExO1xuICAgIGFjdGl2ZURyb3AucmVjdCA9IGFjdGl2ZURyb3AuZHJvcHpvbmUuZ2V0UmVjdChhY3RpdmVEcm9wLmVsZW1lbnQpO1xuICB9XG5cbiAgcmV0dXJuIGFjdGl2ZURyb3BzO1xufVxuXG5mdW5jdGlvbiBnZXREcm9wKF9yZWYxMiwgZHJhZ0V2ZW50LCBwb2ludGVyRXZlbnQpIHtcbiAgdmFyIGRyb3BTdGF0ZSA9IF9yZWYxMi5kcm9wU3RhdGUsXG4gICAgICBkcmFnZ2FibGUgPSBfcmVmMTIuaW50ZXJhY3RhYmxlLFxuICAgICAgZHJhZ0VsZW1lbnQgPSBfcmVmMTIuZWxlbWVudDtcbiAgdmFyIHZhbGlkRHJvcHMgPSBbXTsgLy8gY29sbGVjdCBhbGwgZHJvcHpvbmVzIGFuZCB0aGVpciBlbGVtZW50cyB3aGljaCBxdWFsaWZ5IGZvciBhIGRyb3BcblxuICBmb3IgKHZhciBfaTUgPSAwOyBfaTUgPCBkcm9wU3RhdGUuYWN0aXZlRHJvcHMubGVuZ3RoOyBfaTUrKykge1xuICAgIHZhciBfcmVmMTM7XG5cbiAgICBfcmVmMTMgPSBkcm9wU3RhdGUuYWN0aXZlRHJvcHNbX2k1XTtcbiAgICB2YXIgX3JlZjE0ID0gX3JlZjEzLFxuICAgICAgICBkcm9wem9uZSA9IF9yZWYxNC5kcm9wem9uZSxcbiAgICAgICAgZHJvcHpvbmVFbGVtZW50ID0gX3JlZjE0LmVsZW1lbnQsXG4gICAgICAgIHJlY3QgPSBfcmVmMTQucmVjdDtcbiAgICB2YWxpZERyb3BzLnB1c2goZHJvcHpvbmUuZHJvcENoZWNrKGRyYWdFdmVudCwgcG9pbnRlckV2ZW50LCBkcmFnZ2FibGUsIGRyYWdFbGVtZW50LCBkcm9wem9uZUVsZW1lbnQsIHJlY3QpID8gZHJvcHpvbmVFbGVtZW50IDogbnVsbCk7XG4gIH0gLy8gZ2V0IHRoZSBtb3N0IGFwcHJvcHJpYXRlIGRyb3B6b25lIGJhc2VkIG9uIERPTSBkZXB0aCBhbmQgb3JkZXJcblxuXG4gIHZhciBkcm9wSW5kZXggPSB1dGlscy5kb20uaW5kZXhPZkRlZXBlc3RFbGVtZW50KHZhbGlkRHJvcHMpO1xuICByZXR1cm4gZHJvcFN0YXRlLmFjdGl2ZURyb3BzW2Ryb3BJbmRleF0gfHwgbnVsbDtcbn1cblxuZnVuY3Rpb24gZ2V0RHJvcEV2ZW50cyhpbnRlcmFjdGlvbiwgX3BvaW50ZXJFdmVudCwgZHJhZ0V2ZW50KSB7XG4gIHZhciBkcm9wU3RhdGUgPSBpbnRlcmFjdGlvbi5kcm9wU3RhdGU7XG4gIHZhciBkcm9wRXZlbnRzID0ge1xuICAgIGVudGVyOiBudWxsLFxuICAgIGxlYXZlOiBudWxsLFxuICAgIGFjdGl2YXRlOiBudWxsLFxuICAgIGRlYWN0aXZhdGU6IG51bGwsXG4gICAgbW92ZTogbnVsbCxcbiAgICBkcm9wOiBudWxsXG4gIH07XG5cbiAgaWYgKGRyYWdFdmVudC50eXBlID09PSAnZHJhZ3N0YXJ0Jykge1xuICAgIGRyb3BFdmVudHMuYWN0aXZhdGUgPSBuZXcgX0Ryb3BFdmVudFtcImRlZmF1bHRcIl0oZHJvcFN0YXRlLCBkcmFnRXZlbnQsICdkcm9wYWN0aXZhdGUnKTtcbiAgICBkcm9wRXZlbnRzLmFjdGl2YXRlLnRhcmdldCA9IG51bGw7XG4gICAgZHJvcEV2ZW50cy5hY3RpdmF0ZS5kcm9wem9uZSA9IG51bGw7XG4gIH1cblxuICBpZiAoZHJhZ0V2ZW50LnR5cGUgPT09ICdkcmFnZW5kJykge1xuICAgIGRyb3BFdmVudHMuZGVhY3RpdmF0ZSA9IG5ldyBfRHJvcEV2ZW50W1wiZGVmYXVsdFwiXShkcm9wU3RhdGUsIGRyYWdFdmVudCwgJ2Ryb3BkZWFjdGl2YXRlJyk7XG4gICAgZHJvcEV2ZW50cy5kZWFjdGl2YXRlLnRhcmdldCA9IG51bGw7XG4gICAgZHJvcEV2ZW50cy5kZWFjdGl2YXRlLmRyb3B6b25lID0gbnVsbDtcbiAgfVxuXG4gIGlmIChkcm9wU3RhdGUucmVqZWN0ZWQpIHtcbiAgICByZXR1cm4gZHJvcEV2ZW50cztcbiAgfVxuXG4gIGlmIChkcm9wU3RhdGUuY3VyLmVsZW1lbnQgIT09IGRyb3BTdGF0ZS5wcmV2LmVsZW1lbnQpIHtcbiAgICAvLyBpZiB0aGVyZSB3YXMgYSBwcmV2aW91cyBkcm9wem9uZSwgY3JlYXRlIGEgZHJhZ2xlYXZlIGV2ZW50XG4gICAgaWYgKGRyb3BTdGF0ZS5wcmV2LmRyb3B6b25lKSB7XG4gICAgICBkcm9wRXZlbnRzLmxlYXZlID0gbmV3IF9Ecm9wRXZlbnRbXCJkZWZhdWx0XCJdKGRyb3BTdGF0ZSwgZHJhZ0V2ZW50LCAnZHJhZ2xlYXZlJyk7XG4gICAgICBkcmFnRXZlbnQuZHJhZ0xlYXZlID0gZHJvcEV2ZW50cy5sZWF2ZS50YXJnZXQgPSBkcm9wU3RhdGUucHJldi5lbGVtZW50O1xuICAgICAgZHJhZ0V2ZW50LnByZXZEcm9wem9uZSA9IGRyb3BFdmVudHMubGVhdmUuZHJvcHpvbmUgPSBkcm9wU3RhdGUucHJldi5kcm9wem9uZTtcbiAgICB9IC8vIGlmIGRyb3B6b25lIGlzIG5vdCBudWxsLCBjcmVhdGUgYSBkcmFnZW50ZXIgZXZlbnRcblxuXG4gICAgaWYgKGRyb3BTdGF0ZS5jdXIuZHJvcHpvbmUpIHtcbiAgICAgIGRyb3BFdmVudHMuZW50ZXIgPSBuZXcgX0Ryb3BFdmVudFtcImRlZmF1bHRcIl0oZHJvcFN0YXRlLCBkcmFnRXZlbnQsICdkcmFnZW50ZXInKTtcbiAgICAgIGRyYWdFdmVudC5kcmFnRW50ZXIgPSBkcm9wU3RhdGUuY3VyLmVsZW1lbnQ7XG4gICAgICBkcmFnRXZlbnQuZHJvcHpvbmUgPSBkcm9wU3RhdGUuY3VyLmRyb3B6b25lO1xuICAgIH1cbiAgfVxuXG4gIGlmIChkcmFnRXZlbnQudHlwZSA9PT0gJ2RyYWdlbmQnICYmIGRyb3BTdGF0ZS5jdXIuZHJvcHpvbmUpIHtcbiAgICBkcm9wRXZlbnRzLmRyb3AgPSBuZXcgX0Ryb3BFdmVudFtcImRlZmF1bHRcIl0oZHJvcFN0YXRlLCBkcmFnRXZlbnQsICdkcm9wJyk7XG4gICAgZHJhZ0V2ZW50LmRyb3B6b25lID0gZHJvcFN0YXRlLmN1ci5kcm9wem9uZTtcbiAgICBkcmFnRXZlbnQucmVsYXRlZFRhcmdldCA9IGRyb3BTdGF0ZS5jdXIuZWxlbWVudDtcbiAgfVxuXG4gIGlmIChkcmFnRXZlbnQudHlwZSA9PT0gJ2RyYWdtb3ZlJyAmJiBkcm9wU3RhdGUuY3VyLmRyb3B6b25lKSB7XG4gICAgZHJvcEV2ZW50cy5tb3ZlID0gbmV3IF9Ecm9wRXZlbnRbXCJkZWZhdWx0XCJdKGRyb3BTdGF0ZSwgZHJhZ0V2ZW50LCAnZHJvcG1vdmUnKTtcbiAgICBkcm9wRXZlbnRzLm1vdmUuZHJhZ21vdmUgPSBkcmFnRXZlbnQ7XG4gICAgZHJhZ0V2ZW50LmRyb3B6b25lID0gZHJvcFN0YXRlLmN1ci5kcm9wem9uZTtcbiAgfVxuXG4gIHJldHVybiBkcm9wRXZlbnRzO1xufVxuXG5mdW5jdGlvbiBmaXJlRHJvcEV2ZW50cyhpbnRlcmFjdGlvbiwgZXZlbnRzKSB7XG4gIHZhciBkcm9wU3RhdGUgPSBpbnRlcmFjdGlvbi5kcm9wU3RhdGU7XG4gIHZhciBhY3RpdmVEcm9wcyA9IGRyb3BTdGF0ZS5hY3RpdmVEcm9wcyxcbiAgICAgIGN1ciA9IGRyb3BTdGF0ZS5jdXIsXG4gICAgICBwcmV2ID0gZHJvcFN0YXRlLnByZXY7XG5cbiAgaWYgKGV2ZW50cy5sZWF2ZSkge1xuICAgIHByZXYuZHJvcHpvbmUuZmlyZShldmVudHMubGVhdmUpO1xuICB9XG5cbiAgaWYgKGV2ZW50cy5tb3ZlKSB7XG4gICAgY3VyLmRyb3B6b25lLmZpcmUoZXZlbnRzLm1vdmUpO1xuICB9XG5cbiAgaWYgKGV2ZW50cy5lbnRlcikge1xuICAgIGN1ci5kcm9wem9uZS5maXJlKGV2ZW50cy5lbnRlcik7XG4gIH1cblxuICBpZiAoZXZlbnRzLmRyb3ApIHtcbiAgICBjdXIuZHJvcHpvbmUuZmlyZShldmVudHMuZHJvcCk7XG4gIH1cblxuICBpZiAoZXZlbnRzLmRlYWN0aXZhdGUpIHtcbiAgICBmaXJlQWN0aXZhdGlvbkV2ZW50cyhhY3RpdmVEcm9wcywgZXZlbnRzLmRlYWN0aXZhdGUpO1xuICB9XG5cbiAgZHJvcFN0YXRlLnByZXYuZHJvcHpvbmUgPSBjdXIuZHJvcHpvbmU7XG4gIGRyb3BTdGF0ZS5wcmV2LmVsZW1lbnQgPSBjdXIuZWxlbWVudDtcbn1cblxuZnVuY3Rpb24gb25FdmVudENyZWF0ZWQoX3JlZjE1LCBzY29wZSkge1xuICB2YXIgaW50ZXJhY3Rpb24gPSBfcmVmMTUuaW50ZXJhY3Rpb24sXG4gICAgICBpRXZlbnQgPSBfcmVmMTUuaUV2ZW50LFxuICAgICAgZXZlbnQgPSBfcmVmMTUuZXZlbnQ7XG5cbiAgaWYgKGlFdmVudC50eXBlICE9PSAnZHJhZ21vdmUnICYmIGlFdmVudC50eXBlICE9PSAnZHJhZ2VuZCcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgZHJvcFN0YXRlID0gaW50ZXJhY3Rpb24uZHJvcFN0YXRlO1xuXG4gIGlmIChzY29wZS5keW5hbWljRHJvcCkge1xuICAgIGRyb3BTdGF0ZS5hY3RpdmVEcm9wcyA9IGdldEFjdGl2ZURyb3BzKHNjb3BlLCBpbnRlcmFjdGlvbi5lbGVtZW50KTtcbiAgfVxuXG4gIHZhciBkcmFnRXZlbnQgPSBpRXZlbnQ7XG4gIHZhciBkcm9wUmVzdWx0ID0gZ2V0RHJvcChpbnRlcmFjdGlvbiwgZHJhZ0V2ZW50LCBldmVudCk7IC8vIHVwZGF0ZSByZWplY3RlZCBzdGF0dXNcblxuICBkcm9wU3RhdGUucmVqZWN0ZWQgPSBkcm9wU3RhdGUucmVqZWN0ZWQgJiYgISFkcm9wUmVzdWx0ICYmIGRyb3BSZXN1bHQuZHJvcHpvbmUgPT09IGRyb3BTdGF0ZS5jdXIuZHJvcHpvbmUgJiYgZHJvcFJlc3VsdC5lbGVtZW50ID09PSBkcm9wU3RhdGUuY3VyLmVsZW1lbnQ7XG4gIGRyb3BTdGF0ZS5jdXIuZHJvcHpvbmUgPSBkcm9wUmVzdWx0ICYmIGRyb3BSZXN1bHQuZHJvcHpvbmU7XG4gIGRyb3BTdGF0ZS5jdXIuZWxlbWVudCA9IGRyb3BSZXN1bHQgJiYgZHJvcFJlc3VsdC5lbGVtZW50O1xuICBkcm9wU3RhdGUuZXZlbnRzID0gZ2V0RHJvcEV2ZW50cyhpbnRlcmFjdGlvbiwgZXZlbnQsIGRyYWdFdmVudCk7XG59XG5cbmZ1bmN0aW9uIGRyb3B6b25lTWV0aG9kKGludGVyYWN0YWJsZSwgb3B0aW9ucykge1xuICBpZiAodXRpbHMuaXMub2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgaW50ZXJhY3RhYmxlLm9wdGlvbnMuZHJvcC5lbmFibGVkID0gb3B0aW9ucy5lbmFibGVkICE9PSBmYWxzZTtcblxuICAgIGlmIChvcHRpb25zLmxpc3RlbmVycykge1xuICAgICAgdmFyIG5vcm1hbGl6ZWQgPSB1dGlscy5ub3JtYWxpemVMaXN0ZW5lcnMob3B0aW9ucy5saXN0ZW5lcnMpOyAvLyByZW5hbWUgJ2Ryb3AnIHRvICcnIGFzIGl0IHdpbGwgYmUgcHJlZml4ZWQgd2l0aCAnZHJvcCdcblxuICAgICAgdmFyIGNvcnJlY3RlZCA9IE9iamVjdC5rZXlzKG5vcm1hbGl6ZWQpLnJlZHVjZShmdW5jdGlvbiAoYWNjLCB0eXBlKSB7XG4gICAgICAgIHZhciBjb3JyZWN0ZWRUeXBlID0gL14oZW50ZXJ8bGVhdmUpLy50ZXN0KHR5cGUpID8gXCJkcmFnXCIuY29uY2F0KHR5cGUpIDogL14oYWN0aXZhdGV8ZGVhY3RpdmF0ZXxtb3ZlKS8udGVzdCh0eXBlKSA/IFwiZHJvcFwiLmNvbmNhdCh0eXBlKSA6IHR5cGU7XG4gICAgICAgIGFjY1tjb3JyZWN0ZWRUeXBlXSA9IG5vcm1hbGl6ZWRbdHlwZV07XG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgICB9LCB7fSk7XG4gICAgICBpbnRlcmFjdGFibGUub2ZmKGludGVyYWN0YWJsZS5vcHRpb25zLmRyb3AubGlzdGVuZXJzKTtcbiAgICAgIGludGVyYWN0YWJsZS5vbihjb3JyZWN0ZWQpO1xuICAgICAgaW50ZXJhY3RhYmxlLm9wdGlvbnMuZHJvcC5saXN0ZW5lcnMgPSBjb3JyZWN0ZWQ7XG4gICAgfVxuXG4gICAgaWYgKHV0aWxzLmlzLmZ1bmMob3B0aW9ucy5vbmRyb3ApKSB7XG4gICAgICBpbnRlcmFjdGFibGUub24oJ2Ryb3AnLCBvcHRpb25zLm9uZHJvcCk7XG4gICAgfVxuXG4gICAgaWYgKHV0aWxzLmlzLmZ1bmMob3B0aW9ucy5vbmRyb3BhY3RpdmF0ZSkpIHtcbiAgICAgIGludGVyYWN0YWJsZS5vbignZHJvcGFjdGl2YXRlJywgb3B0aW9ucy5vbmRyb3BhY3RpdmF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKHV0aWxzLmlzLmZ1bmMob3B0aW9ucy5vbmRyb3BkZWFjdGl2YXRlKSkge1xuICAgICAgaW50ZXJhY3RhYmxlLm9uKCdkcm9wZGVhY3RpdmF0ZScsIG9wdGlvbnMub25kcm9wZGVhY3RpdmF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKHV0aWxzLmlzLmZ1bmMob3B0aW9ucy5vbmRyYWdlbnRlcikpIHtcbiAgICAgIGludGVyYWN0YWJsZS5vbignZHJhZ2VudGVyJywgb3B0aW9ucy5vbmRyYWdlbnRlcik7XG4gICAgfVxuXG4gICAgaWYgKHV0aWxzLmlzLmZ1bmMob3B0aW9ucy5vbmRyYWdsZWF2ZSkpIHtcbiAgICAgIGludGVyYWN0YWJsZS5vbignZHJhZ2xlYXZlJywgb3B0aW9ucy5vbmRyYWdsZWF2ZSk7XG4gICAgfVxuXG4gICAgaWYgKHV0aWxzLmlzLmZ1bmMob3B0aW9ucy5vbmRyb3Btb3ZlKSkge1xuICAgICAgaW50ZXJhY3RhYmxlLm9uKCdkcm9wbW92ZScsIG9wdGlvbnMub25kcm9wbW92ZSk7XG4gICAgfVxuXG4gICAgaWYgKC9eKHBvaW50ZXJ8Y2VudGVyKSQvLnRlc3Qob3B0aW9ucy5vdmVybGFwKSkge1xuICAgICAgaW50ZXJhY3RhYmxlLm9wdGlvbnMuZHJvcC5vdmVybGFwID0gb3B0aW9ucy5vdmVybGFwO1xuICAgIH0gZWxzZSBpZiAodXRpbHMuaXMubnVtYmVyKG9wdGlvbnMub3ZlcmxhcCkpIHtcbiAgICAgIGludGVyYWN0YWJsZS5vcHRpb25zLmRyb3Aub3ZlcmxhcCA9IE1hdGgubWF4KE1hdGgubWluKDEsIG9wdGlvbnMub3ZlcmxhcCksIDApO1xuICAgIH1cblxuICAgIGlmICgnYWNjZXB0JyBpbiBvcHRpb25zKSB7XG4gICAgICBpbnRlcmFjdGFibGUub3B0aW9ucy5kcm9wLmFjY2VwdCA9IG9wdGlvbnMuYWNjZXB0O1xuICAgIH1cblxuICAgIGlmICgnY2hlY2tlcicgaW4gb3B0aW9ucykge1xuICAgICAgaW50ZXJhY3RhYmxlLm9wdGlvbnMuZHJvcC5jaGVja2VyID0gb3B0aW9ucy5jaGVja2VyO1xuICAgIH1cblxuICAgIHJldHVybiBpbnRlcmFjdGFibGU7XG4gIH1cblxuICBpZiAodXRpbHMuaXMuYm9vbChvcHRpb25zKSkge1xuICAgIGludGVyYWN0YWJsZS5vcHRpb25zLmRyb3AuZW5hYmxlZCA9IG9wdGlvbnM7XG4gICAgcmV0dXJuIGludGVyYWN0YWJsZTtcbiAgfVxuXG4gIHJldHVybiBpbnRlcmFjdGFibGUub3B0aW9ucy5kcm9wO1xufVxuXG5mdW5jdGlvbiBkcm9wQ2hlY2tNZXRob2QoaW50ZXJhY3RhYmxlLCBkcmFnRXZlbnQsIGV2ZW50LCBkcmFnZ2FibGUsIGRyYWdnYWJsZUVsZW1lbnQsIGRyb3BFbGVtZW50LCByZWN0KSB7XG4gIHZhciBkcm9wcGVkID0gZmFsc2U7IC8vIGlmIHRoZSBkcm9wem9uZSBoYXMgbm8gcmVjdCAoZWcuIGRpc3BsYXk6IG5vbmUpXG4gIC8vIGNhbGwgdGhlIGN1c3RvbSBkcm9wQ2hlY2tlciBvciBqdXN0IHJldHVybiBmYWxzZVxuXG4gIGlmICghKHJlY3QgPSByZWN0IHx8IGludGVyYWN0YWJsZS5nZXRSZWN0KGRyb3BFbGVtZW50KSkpIHtcbiAgICByZXR1cm4gaW50ZXJhY3RhYmxlLm9wdGlvbnMuZHJvcC5jaGVja2VyID8gaW50ZXJhY3RhYmxlLm9wdGlvbnMuZHJvcC5jaGVja2VyKGRyYWdFdmVudCwgZXZlbnQsIGRyb3BwZWQsIGludGVyYWN0YWJsZSwgZHJvcEVsZW1lbnQsIGRyYWdnYWJsZSwgZHJhZ2dhYmxlRWxlbWVudCkgOiBmYWxzZTtcbiAgfVxuXG4gIHZhciBkcm9wT3ZlcmxhcCA9IGludGVyYWN0YWJsZS5vcHRpb25zLmRyb3Aub3ZlcmxhcDtcblxuICBpZiAoZHJvcE92ZXJsYXAgPT09ICdwb2ludGVyJykge1xuICAgIHZhciBvcmlnaW4gPSB1dGlscy5nZXRPcmlnaW5YWShkcmFnZ2FibGUsIGRyYWdnYWJsZUVsZW1lbnQsICdkcmFnJyk7XG4gICAgdmFyIHBhZ2UgPSB1dGlscy5wb2ludGVyLmdldFBhZ2VYWShkcmFnRXZlbnQpO1xuICAgIHBhZ2UueCArPSBvcmlnaW4ueDtcbiAgICBwYWdlLnkgKz0gb3JpZ2luLnk7XG4gICAgdmFyIGhvcml6b250YWwgPSBwYWdlLnggPiByZWN0LmxlZnQgJiYgcGFnZS54IDwgcmVjdC5yaWdodDtcbiAgICB2YXIgdmVydGljYWwgPSBwYWdlLnkgPiByZWN0LnRvcCAmJiBwYWdlLnkgPCByZWN0LmJvdHRvbTtcbiAgICBkcm9wcGVkID0gaG9yaXpvbnRhbCAmJiB2ZXJ0aWNhbDtcbiAgfVxuXG4gIHZhciBkcmFnUmVjdCA9IGRyYWdnYWJsZS5nZXRSZWN0KGRyYWdnYWJsZUVsZW1lbnQpO1xuXG4gIGlmIChkcmFnUmVjdCAmJiBkcm9wT3ZlcmxhcCA9PT0gJ2NlbnRlcicpIHtcbiAgICB2YXIgY3ggPSBkcmFnUmVjdC5sZWZ0ICsgZHJhZ1JlY3Qud2lkdGggLyAyO1xuICAgIHZhciBjeSA9IGRyYWdSZWN0LnRvcCArIGRyYWdSZWN0LmhlaWdodCAvIDI7XG4gICAgZHJvcHBlZCA9IGN4ID49IHJlY3QubGVmdCAmJiBjeCA8PSByZWN0LnJpZ2h0ICYmIGN5ID49IHJlY3QudG9wICYmIGN5IDw9IHJlY3QuYm90dG9tO1xuICB9XG5cbiAgaWYgKGRyYWdSZWN0ICYmIHV0aWxzLmlzLm51bWJlcihkcm9wT3ZlcmxhcCkpIHtcbiAgICB2YXIgb3ZlcmxhcEFyZWEgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihyZWN0LnJpZ2h0LCBkcmFnUmVjdC5yaWdodCkgLSBNYXRoLm1heChyZWN0LmxlZnQsIGRyYWdSZWN0LmxlZnQpKSAqIE1hdGgubWF4KDAsIE1hdGgubWluKHJlY3QuYm90dG9tLCBkcmFnUmVjdC5ib3R0b20pIC0gTWF0aC5tYXgocmVjdC50b3AsIGRyYWdSZWN0LnRvcCkpO1xuICAgIHZhciBvdmVybGFwUmF0aW8gPSBvdmVybGFwQXJlYSAvIChkcmFnUmVjdC53aWR0aCAqIGRyYWdSZWN0LmhlaWdodCk7XG4gICAgZHJvcHBlZCA9IG92ZXJsYXBSYXRpbyA+PSBkcm9wT3ZlcmxhcDtcbiAgfVxuXG4gIGlmIChpbnRlcmFjdGFibGUub3B0aW9ucy5kcm9wLmNoZWNrZXIpIHtcbiAgICBkcm9wcGVkID0gaW50ZXJhY3RhYmxlLm9wdGlvbnMuZHJvcC5jaGVja2VyKGRyYWdFdmVudCwgZXZlbnQsIGRyb3BwZWQsIGludGVyYWN0YWJsZSwgZHJvcEVsZW1lbnQsIGRyYWdnYWJsZSwgZHJhZ2dhYmxlRWxlbWVudCk7XG4gIH1cblxuICByZXR1cm4gZHJvcHBlZDtcbn1cblxudmFyIGRyb3AgPSB7XG4gIGlkOiAnYWN0aW9ucy9kcm9wJyxcbiAgaW5zdGFsbDogaW5zdGFsbCxcbiAgZ2V0QWN0aXZlRHJvcHM6IGdldEFjdGl2ZURyb3BzLFxuICBnZXREcm9wOiBnZXREcm9wLFxuICBnZXREcm9wRXZlbnRzOiBnZXREcm9wRXZlbnRzLFxuICBmaXJlRHJvcEV2ZW50czogZmlyZURyb3BFdmVudHMsXG4gIGRlZmF1bHRzOiB7XG4gICAgZW5hYmxlZDogZmFsc2UsXG4gICAgYWNjZXB0OiBudWxsLFxuICAgIG92ZXJsYXA6ICdwb2ludGVyJ1xuICB9XG59O1xudmFyIF9kZWZhdWx0ID0gZHJvcDtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5cbn0se1wiLi4vZHJhZ1wiOjEsXCIuL0Ryb3BFdmVudFwiOjIsXCJAaW50ZXJhY3Rqcy91dGlsc1wiOjU1fV0sNDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX0ludGVyYWN0RXZlbnQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy9jb3JlL0ludGVyYWN0RXZlbnRcIikpO1xuXG52YXIgX3Njb3BlID0gcmVxdWlyZShcIkBpbnRlcmFjdGpzL2NvcmUvc2NvcGVcIik7XG5cbnZhciB1dGlscyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy91dGlsc1wiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHsgdmFyIGRlc2MgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkgJiYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBrZXkpIDoge307IGlmIChkZXNjLmdldCB8fCBkZXNjLnNldCkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkobmV3T2JqLCBrZXksIGRlc2MpOyB9IGVsc2UgeyBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gfSB9IG5ld09ialtcImRlZmF1bHRcIl0gPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuX3Njb3BlLkFjdGlvbk5hbWUuR2VzdHVyZSA9ICdnZXN0dXJlJztcblxuZnVuY3Rpb24gaW5zdGFsbChzY29wZSkge1xuICB2YXIgYWN0aW9ucyA9IHNjb3BlLmFjdGlvbnMsXG4gICAgICBJbnRlcmFjdGFibGUgPSBzY29wZS5JbnRlcmFjdGFibGUsXG4gICAgICBpbnRlcmFjdGlvbnMgPSBzY29wZS5pbnRlcmFjdGlvbnMsXG4gICAgICBkZWZhdWx0cyA9IHNjb3BlLmRlZmF1bHRzO1xuICAvKipcbiAgICogYGBganNcbiAgICogaW50ZXJhY3QoZWxlbWVudCkuZ2VzdHVyYWJsZSh7XG4gICAqICAgICBvbnN0YXJ0OiBmdW5jdGlvbiAoZXZlbnQpIHt9LFxuICAgKiAgICAgb25tb3ZlIDogZnVuY3Rpb24gKGV2ZW50KSB7fSxcbiAgICogICAgIG9uZW5kICA6IGZ1bmN0aW9uIChldmVudCkge30sXG4gICAqXG4gICAqICAgICAvLyBsaW1pdCBtdWx0aXBsZSBnZXN0dXJlcy5cbiAgICogICAgIC8vIFNlZSB0aGUgZXhwbGFuYXRpb24gaW4ge0BsaW5rIEludGVyYWN0YWJsZS5kcmFnZ2FibGV9IGV4YW1wbGVcbiAgICogICAgIG1heDogSW5maW5pdHksXG4gICAqICAgICBtYXhQZXJFbGVtZW50OiAxLFxuICAgKiB9KVxuICAgKlxuICAgKiB2YXIgaXNHZXN0dXJlYWJsZSA9IGludGVyYWN0KGVsZW1lbnQpLmdlc3R1cmFibGUoKVxuICAgKiBgYGBcbiAgICpcbiAgICogR2V0cyBvciBzZXRzIHdoZXRoZXIgbXVsdGl0b3VjaCBnZXN0dXJlcyBjYW4gYmUgcGVyZm9ybWVkIG9uIHRoZSB0YXJnZXRcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFuIHwgb2JqZWN0fSBbb3B0aW9uc10gdHJ1ZS9mYWxzZSBvciBBbiBvYmplY3Qgd2l0aCBldmVudFxuICAgKiBsaXN0ZW5lcnMgdG8gYmUgZmlyZWQgb24gZ2VzdHVyZSBldmVudHMgKG1ha2VzIHRoZSBJbnRlcmFjdGFibGUgZ2VzdHVyYWJsZSlcbiAgICogQHJldHVybiB7Ym9vbGVhbiB8IEludGVyYWN0YWJsZX0gQSBib29sZWFuIGluZGljYXRpbmcgaWYgdGhpcyBjYW4gYmUgdGhlXG4gICAqIHRhcmdldCBvZiBnZXN0dXJlIGV2ZW50cywgb3IgdGhpcyBJbnRlcmFjdGFibGVcbiAgICovXG5cbiAgSW50ZXJhY3RhYmxlLnByb3RvdHlwZS5nZXN0dXJhYmxlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICBpZiAodXRpbHMuaXMub2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgICB0aGlzLm9wdGlvbnMuZ2VzdHVyZS5lbmFibGVkID0gb3B0aW9ucy5lbmFibGVkICE9PSBmYWxzZTtcbiAgICAgIHRoaXMuc2V0UGVyQWN0aW9uKCdnZXN0dXJlJywgb3B0aW9ucyk7XG4gICAgICB0aGlzLnNldE9uRXZlbnRzKCdnZXN0dXJlJywgb3B0aW9ucyk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBpZiAodXRpbHMuaXMuYm9vbChvcHRpb25zKSkge1xuICAgICAgdGhpcy5vcHRpb25zLmdlc3R1cmUuZW5hYmxlZCA9IG9wdGlvbnM7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmdlc3R1cmU7XG4gIH07XG5cbiAgaW50ZXJhY3Rpb25zLnNpZ25hbHMub24oJ2FjdGlvbi1zdGFydCcsIHVwZGF0ZUdlc3R1cmVQcm9wcyk7XG4gIGludGVyYWN0aW9ucy5zaWduYWxzLm9uKCdhY3Rpb24tbW92ZScsIHVwZGF0ZUdlc3R1cmVQcm9wcyk7XG4gIGludGVyYWN0aW9ucy5zaWduYWxzLm9uKCdhY3Rpb24tZW5kJywgdXBkYXRlR2VzdHVyZVByb3BzKTtcbiAgaW50ZXJhY3Rpb25zLnNpZ25hbHMub24oJ25ldycsIGZ1bmN0aW9uIChfcmVmKSB7XG4gICAgdmFyIGludGVyYWN0aW9uID0gX3JlZi5pbnRlcmFjdGlvbjtcbiAgICBpbnRlcmFjdGlvbi5nZXN0dXJlID0ge1xuICAgICAgYW5nbGU6IDAsXG4gICAgICBkaXN0YW5jZTogMCxcbiAgICAgIHNjYWxlOiAxLFxuICAgICAgc3RhcnRBbmdsZTogMCxcbiAgICAgIHN0YXJ0RGlzdGFuY2U6IDBcbiAgICB9O1xuICB9KTtcbiAgYWN0aW9uc1tfc2NvcGUuQWN0aW9uTmFtZS5HZXN0dXJlXSA9IGdlc3R1cmU7XG4gIGFjdGlvbnMubmFtZXMucHVzaChfc2NvcGUuQWN0aW9uTmFtZS5HZXN0dXJlKTtcbiAgdXRpbHMuYXJyLm1lcmdlKGFjdGlvbnMuZXZlbnRUeXBlcywgWydnZXN0dXJlc3RhcnQnLCAnZ2VzdHVyZW1vdmUnLCAnZ2VzdHVyZWVuZCddKTtcbiAgYWN0aW9ucy5tZXRob2REaWN0Lmdlc3R1cmUgPSAnZ2VzdHVyYWJsZSc7XG4gIGRlZmF1bHRzLmFjdGlvbnMuZ2VzdHVyZSA9IGdlc3R1cmUuZGVmYXVsdHM7XG59XG5cbnZhciBnZXN0dXJlID0ge1xuICBpZDogJ2FjdGlvbnMvZ2VzdHVyZScsXG4gIGluc3RhbGw6IGluc3RhbGwsXG4gIGRlZmF1bHRzOiB7fSxcbiAgY2hlY2tlcjogZnVuY3Rpb24gY2hlY2tlcihfcG9pbnRlciwgX2V2ZW50LCBfaW50ZXJhY3RhYmxlLCBfZWxlbWVudCwgaW50ZXJhY3Rpb24pIHtcbiAgICBpZiAoaW50ZXJhY3Rpb24ucG9pbnRlcnMubGVuZ3RoID49IDIpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6ICdnZXN0dXJlJ1xuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgZ2V0Q3Vyc29yOiBmdW5jdGlvbiBnZXRDdXJzb3IoKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG59O1xuXG5mdW5jdGlvbiB1cGRhdGVHZXN0dXJlUHJvcHMoX3JlZjIpIHtcbiAgdmFyIGludGVyYWN0aW9uID0gX3JlZjIuaW50ZXJhY3Rpb24sXG4gICAgICBpRXZlbnQgPSBfcmVmMi5pRXZlbnQsXG4gICAgICBldmVudCA9IF9yZWYyLmV2ZW50LFxuICAgICAgcGhhc2UgPSBfcmVmMi5waGFzZTtcblxuICBpZiAoaW50ZXJhY3Rpb24ucHJlcGFyZWQubmFtZSAhPT0gJ2dlc3R1cmUnKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHBvaW50ZXJzID0gaW50ZXJhY3Rpb24ucG9pbnRlcnMubWFwKGZ1bmN0aW9uIChwKSB7XG4gICAgcmV0dXJuIHAucG9pbnRlcjtcbiAgfSk7XG4gIHZhciBzdGFydGluZyA9IHBoYXNlID09PSAnc3RhcnQnO1xuICB2YXIgZW5kaW5nID0gcGhhc2UgPT09ICdlbmQnO1xuICB2YXIgZGVsdGFTb3VyY2UgPSBpbnRlcmFjdGlvbi5pbnRlcmFjdGFibGUub3B0aW9ucy5kZWx0YVNvdXJjZTtcbiAgaUV2ZW50LnRvdWNoZXMgPSBbcG9pbnRlcnNbMF0sIHBvaW50ZXJzWzFdXTtcblxuICBpZiAoc3RhcnRpbmcpIHtcbiAgICBpRXZlbnQuZGlzdGFuY2UgPSB1dGlscy5wb2ludGVyLnRvdWNoRGlzdGFuY2UocG9pbnRlcnMsIGRlbHRhU291cmNlKTtcbiAgICBpRXZlbnQuYm94ID0gdXRpbHMucG9pbnRlci50b3VjaEJCb3gocG9pbnRlcnMpO1xuICAgIGlFdmVudC5zY2FsZSA9IDE7XG4gICAgaUV2ZW50LmRzID0gMDtcbiAgICBpRXZlbnQuYW5nbGUgPSB1dGlscy5wb2ludGVyLnRvdWNoQW5nbGUocG9pbnRlcnMsIGRlbHRhU291cmNlKTtcbiAgICBpRXZlbnQuZGEgPSAwO1xuICAgIGludGVyYWN0aW9uLmdlc3R1cmUuc3RhcnREaXN0YW5jZSA9IGlFdmVudC5kaXN0YW5jZTtcbiAgICBpbnRlcmFjdGlvbi5nZXN0dXJlLnN0YXJ0QW5nbGUgPSBpRXZlbnQuYW5nbGU7XG4gIH0gZWxzZSBpZiAoZW5kaW5nIHx8IGV2ZW50IGluc3RhbmNlb2YgX0ludGVyYWN0RXZlbnRbXCJkZWZhdWx0XCJdKSB7XG4gICAgdmFyIHByZXZFdmVudCA9IGludGVyYWN0aW9uLnByZXZFdmVudDtcbiAgICBpRXZlbnQuZGlzdGFuY2UgPSBwcmV2RXZlbnQuZGlzdGFuY2U7XG4gICAgaUV2ZW50LmJveCA9IHByZXZFdmVudC5ib3g7XG4gICAgaUV2ZW50LnNjYWxlID0gcHJldkV2ZW50LnNjYWxlO1xuICAgIGlFdmVudC5kcyA9IDA7XG4gICAgaUV2ZW50LmFuZ2xlID0gcHJldkV2ZW50LmFuZ2xlO1xuICAgIGlFdmVudC5kYSA9IDA7XG4gIH0gZWxzZSB7XG4gICAgaUV2ZW50LmRpc3RhbmNlID0gdXRpbHMucG9pbnRlci50b3VjaERpc3RhbmNlKHBvaW50ZXJzLCBkZWx0YVNvdXJjZSk7XG4gICAgaUV2ZW50LmJveCA9IHV0aWxzLnBvaW50ZXIudG91Y2hCQm94KHBvaW50ZXJzKTtcbiAgICBpRXZlbnQuc2NhbGUgPSBpRXZlbnQuZGlzdGFuY2UgLyBpbnRlcmFjdGlvbi5nZXN0dXJlLnN0YXJ0RGlzdGFuY2U7XG4gICAgaUV2ZW50LmFuZ2xlID0gdXRpbHMucG9pbnRlci50b3VjaEFuZ2xlKHBvaW50ZXJzLCBkZWx0YVNvdXJjZSk7XG4gICAgaUV2ZW50LmRzID0gaUV2ZW50LnNjYWxlIC0gaW50ZXJhY3Rpb24uZ2VzdHVyZS5zY2FsZTtcbiAgICBpRXZlbnQuZGEgPSBpRXZlbnQuYW5nbGUgLSBpbnRlcmFjdGlvbi5nZXN0dXJlLmFuZ2xlO1xuICB9XG5cbiAgaW50ZXJhY3Rpb24uZ2VzdHVyZS5kaXN0YW5jZSA9IGlFdmVudC5kaXN0YW5jZTtcbiAgaW50ZXJhY3Rpb24uZ2VzdHVyZS5hbmdsZSA9IGlFdmVudC5hbmdsZTtcblxuICBpZiAodXRpbHMuaXMubnVtYmVyKGlFdmVudC5zY2FsZSkgJiYgaUV2ZW50LnNjYWxlICE9PSBJbmZpbml0eSAmJiAhaXNOYU4oaUV2ZW50LnNjYWxlKSkge1xuICAgIGludGVyYWN0aW9uLmdlc3R1cmUuc2NhbGUgPSBpRXZlbnQuc2NhbGU7XG4gIH1cbn1cblxudmFyIF9kZWZhdWx0ID0gZ2VzdHVyZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5cbn0se1wiQGludGVyYWN0anMvY29yZS9JbnRlcmFjdEV2ZW50XCI6MTUsXCJAaW50ZXJhY3Rqcy9jb3JlL3Njb3BlXCI6MjQsXCJAaW50ZXJhY3Rqcy91dGlsc1wiOjU1fV0sNTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuaW5zdGFsbCA9IGluc3RhbGw7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJkcmFnXCIsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9kcmFnW1wiZGVmYXVsdFwiXTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJkcm9wXCIsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9kcm9wW1wiZGVmYXVsdFwiXTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJnZXN0dXJlXCIsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9nZXN0dXJlW1wiZGVmYXVsdFwiXTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJyZXNpemVcIiwge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3Jlc2l6ZVtcImRlZmF1bHRcIl07XG4gIH1cbn0pO1xuZXhwb3J0cy5pZCA9IHZvaWQgMDtcblxudmFyIF9kcmFnID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9kcmFnXCIpKTtcblxudmFyIF9kcm9wID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9kcm9wXCIpKTtcblxudmFyIF9nZXN0dXJlID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9nZXN0dXJlXCIpKTtcblxudmFyIF9yZXNpemUgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL3Jlc2l6ZVwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBpbnN0YWxsKHNjb3BlKSB7XG4gIHNjb3BlLnVzZVBsdWdpbihfZ2VzdHVyZVtcImRlZmF1bHRcIl0pO1xuICBzY29wZS51c2VQbHVnaW4oX3Jlc2l6ZVtcImRlZmF1bHRcIl0pO1xuICBzY29wZS51c2VQbHVnaW4oX2RyYWdbXCJkZWZhdWx0XCJdKTtcbiAgc2NvcGUudXNlUGx1Z2luKF9kcm9wW1wiZGVmYXVsdFwiXSk7XG59XG5cbnZhciBpZCA9ICdhY3Rpb25zJztcbmV4cG9ydHMuaWQgPSBpZDtcblxufSx7XCIuL2RyYWdcIjoxLFwiLi9kcm9wXCI6MyxcIi4vZ2VzdHVyZVwiOjQsXCIuL3Jlc2l6ZVwiOjZ9XSw2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciBfc2NvcGUgPSByZXF1aXJlKFwiQGludGVyYWN0anMvY29yZS9zY29wZVwiKTtcblxudmFyIHV0aWxzID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQocmVxdWlyZShcIkBpbnRlcmFjdGpzL3V0aWxzXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iajsgfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgeyB2YXIgZGVzYyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID8gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIGtleSkgOiB7fTsgaWYgKGRlc2MuZ2V0IHx8IGRlc2Muc2V0KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuZXdPYmosIGtleSwgZGVzYyk7IH0gZWxzZSB7IG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSB9IH0gbmV3T2JqW1wiZGVmYXVsdFwiXSA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cbl9zY29wZS5BY3Rpb25OYW1lLlJlc2l6ZSA9ICdyZXNpemUnO1xuXG5mdW5jdGlvbiBpbnN0YWxsKHNjb3BlKSB7XG4gIHZhciBhY3Rpb25zID0gc2NvcGUuYWN0aW9ucyxcbiAgICAgIGJyb3dzZXIgPSBzY29wZS5icm93c2VyLFxuICAgICAgSW50ZXJhY3RhYmxlID0gc2NvcGUuSW50ZXJhY3RhYmxlLFxuICAgICAgaW50ZXJhY3Rpb25zID0gc2NvcGUuaW50ZXJhY3Rpb25zLFxuICAgICAgZGVmYXVsdHMgPSBzY29wZS5kZWZhdWx0czsgLy8gTGVzcyBQcmVjaXNpb24gd2l0aCB0b3VjaCBpbnB1dFxuXG4gIGludGVyYWN0aW9ucy5zaWduYWxzLm9uKCduZXcnLCBmdW5jdGlvbiAoaW50ZXJhY3Rpb24pIHtcbiAgICBpbnRlcmFjdGlvbi5yZXNpemVBeGVzID0gJ3h5JztcbiAgfSk7XG4gIGludGVyYWN0aW9ucy5zaWduYWxzLm9uKCdhY3Rpb24tc3RhcnQnLCBzdGFydCk7XG4gIGludGVyYWN0aW9ucy5zaWduYWxzLm9uKCdhY3Rpb24tbW92ZScsIG1vdmUpO1xuICBpbnRlcmFjdGlvbnMuc2lnbmFscy5vbignYWN0aW9uLXN0YXJ0JywgdXBkYXRlRXZlbnRBeGVzKTtcbiAgaW50ZXJhY3Rpb25zLnNpZ25hbHMub24oJ2FjdGlvbi1tb3ZlJywgdXBkYXRlRXZlbnRBeGVzKTtcbiAgcmVzaXplLmN1cnNvcnMgPSBpbml0Q3Vyc29ycyhicm93c2VyKTtcbiAgcmVzaXplLmRlZmF1bHRNYXJnaW4gPSBicm93c2VyLnN1cHBvcnRzVG91Y2ggfHwgYnJvd3Nlci5zdXBwb3J0c1BvaW50ZXJFdmVudCA/IDIwIDogMTA7XG4gIC8qKlxuICAgKiBgYGBqc1xuICAgKiBpbnRlcmFjdChlbGVtZW50KS5yZXNpemFibGUoe1xuICAgKiAgIG9uc3RhcnQ6IGZ1bmN0aW9uIChldmVudCkge30sXG4gICAqICAgb25tb3ZlIDogZnVuY3Rpb24gKGV2ZW50KSB7fSxcbiAgICogICBvbmVuZCAgOiBmdW5jdGlvbiAoZXZlbnQpIHt9LFxuICAgKlxuICAgKiAgIGVkZ2VzOiB7XG4gICAqICAgICB0b3AgICA6IHRydWUsICAgICAgIC8vIFVzZSBwb2ludGVyIGNvb3JkcyB0byBjaGVjayBmb3IgcmVzaXplLlxuICAgKiAgICAgbGVmdCAgOiBmYWxzZSwgICAgICAvLyBEaXNhYmxlIHJlc2l6aW5nIGZyb20gbGVmdCBlZGdlLlxuICAgKiAgICAgYm90dG9tOiAnLnJlc2l6ZS1zJywvLyBSZXNpemUgaWYgcG9pbnRlciB0YXJnZXQgbWF0Y2hlcyBzZWxlY3RvclxuICAgKiAgICAgcmlnaHQgOiBoYW5kbGVFbCAgICAvLyBSZXNpemUgaWYgcG9pbnRlciB0YXJnZXQgaXMgdGhlIGdpdmVuIEVsZW1lbnRcbiAgICogICB9LFxuICAgKlxuICAgKiAgICAgLy8gV2lkdGggYW5kIGhlaWdodCBjYW4gYmUgYWRqdXN0ZWQgaW5kZXBlbmRlbnRseS4gV2hlbiBgdHJ1ZWAsIHdpZHRoIGFuZFxuICAgKiAgICAgLy8gaGVpZ2h0IGFyZSBhZGp1c3RlZCBhdCBhIDE6MSByYXRpby5cbiAgICogICAgIHNxdWFyZTogZmFsc2UsXG4gICAqXG4gICAqICAgICAvLyBXaWR0aCBhbmQgaGVpZ2h0IGNhbiBiZSBhZGp1c3RlZCBpbmRlcGVuZGVudGx5LiBXaGVuIGB0cnVlYCwgd2lkdGggYW5kXG4gICAqICAgICAvLyBoZWlnaHQgbWFpbnRhaW4gdGhlIGFzcGVjdCByYXRpbyB0aGV5IGhhZCB3aGVuIHJlc2l6aW5nIHN0YXJ0ZWQuXG4gICAqICAgICBwcmVzZXJ2ZUFzcGVjdFJhdGlvOiBmYWxzZSxcbiAgICpcbiAgICogICAvLyBhIHZhbHVlIG9mICdub25lJyB3aWxsIGxpbWl0IHRoZSByZXNpemUgcmVjdCB0byBhIG1pbmltdW0gb2YgMHgwXG4gICAqICAgLy8gJ25lZ2F0ZScgd2lsbCBhbGxvdyB0aGUgcmVjdCB0byBoYXZlIG5lZ2F0aXZlIHdpZHRoL2hlaWdodFxuICAgKiAgIC8vICdyZXBvc2l0aW9uJyB3aWxsIGtlZXAgdGhlIHdpZHRoL2hlaWdodCBwb3NpdGl2ZSBieSBzd2FwcGluZ1xuICAgKiAgIC8vIHRoZSB0b3AgYW5kIGJvdHRvbSBlZGdlcyBhbmQvb3Igc3dhcHBpbmcgdGhlIGxlZnQgYW5kIHJpZ2h0IGVkZ2VzXG4gICAqICAgaW52ZXJ0OiAnbm9uZScgfHwgJ25lZ2F0ZScgfHwgJ3JlcG9zaXRpb24nXG4gICAqXG4gICAqICAgLy8gbGltaXQgbXVsdGlwbGUgcmVzaXplcy5cbiAgICogICAvLyBTZWUgdGhlIGV4cGxhbmF0aW9uIGluIHRoZSB7QGxpbmsgSW50ZXJhY3RhYmxlLmRyYWdnYWJsZX0gZXhhbXBsZVxuICAgKiAgIG1heDogSW5maW5pdHksXG4gICAqICAgbWF4UGVyRWxlbWVudDogMSxcbiAgICogfSlcbiAgICpcbiAgICogdmFyIGlzUmVzaXplYWJsZSA9IGludGVyYWN0KGVsZW1lbnQpLnJlc2l6YWJsZSgpXG4gICAqIGBgYFxuICAgKlxuICAgKiBHZXRzIG9yIHNldHMgd2hldGhlciByZXNpemUgYWN0aW9ucyBjYW4gYmUgcGVyZm9ybWVkIG9uIHRoZSB0YXJnZXRcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFuIHwgb2JqZWN0fSBbb3B0aW9uc10gdHJ1ZS9mYWxzZSBvciBBbiBvYmplY3Qgd2l0aCBldmVudFxuICAgKiBsaXN0ZW5lcnMgdG8gYmUgZmlyZWQgb24gcmVzaXplIGV2ZW50cyAob2JqZWN0IG1ha2VzIHRoZSBJbnRlcmFjdGFibGVcbiAgICogcmVzaXphYmxlKVxuICAgKiBAcmV0dXJuIHtib29sZWFuIHwgSW50ZXJhY3RhYmxlfSBBIGJvb2xlYW4gaW5kaWNhdGluZyBpZiB0aGlzIGNhbiBiZSB0aGVcbiAgICogdGFyZ2V0IG9mIHJlc2l6ZSBlbGVtZW50cywgb3IgdGhpcyBJbnRlcmFjdGFibGVcbiAgICovXG5cbiAgSW50ZXJhY3RhYmxlLnByb3RvdHlwZS5yZXNpemFibGUgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHJldHVybiByZXNpemFibGUodGhpcywgb3B0aW9ucywgc2NvcGUpO1xuICB9O1xuXG4gIGFjdGlvbnNbX3Njb3BlLkFjdGlvbk5hbWUuUmVzaXplXSA9IHJlc2l6ZTtcbiAgYWN0aW9ucy5uYW1lcy5wdXNoKF9zY29wZS5BY3Rpb25OYW1lLlJlc2l6ZSk7XG4gIHV0aWxzLmFyci5tZXJnZShhY3Rpb25zLmV2ZW50VHlwZXMsIFsncmVzaXplc3RhcnQnLCAncmVzaXplbW92ZScsICdyZXNpemVpbmVydGlhc3RhcnQnLCAncmVzaXplcmVzdW1lJywgJ3Jlc2l6ZWVuZCddKTtcbiAgYWN0aW9ucy5tZXRob2REaWN0LnJlc2l6ZSA9ICdyZXNpemFibGUnO1xuICBkZWZhdWx0cy5hY3Rpb25zLnJlc2l6ZSA9IHJlc2l6ZS5kZWZhdWx0cztcbn1cblxudmFyIHJlc2l6ZSA9IHtcbiAgaWQ6ICdhY3Rpb25zL3Jlc2l6ZScsXG4gIGluc3RhbGw6IGluc3RhbGwsXG4gIGRlZmF1bHRzOiB7XG4gICAgc3F1YXJlOiBmYWxzZSxcbiAgICBwcmVzZXJ2ZUFzcGVjdFJhdGlvOiBmYWxzZSxcbiAgICBheGlzOiAneHknLFxuICAgIC8vIHVzZSBkZWZhdWx0IG1hcmdpblxuICAgIG1hcmdpbjogTmFOLFxuICAgIC8vIG9iamVjdCB3aXRoIHByb3BzIGxlZnQsIHJpZ2h0LCB0b3AsIGJvdHRvbSB3aGljaCBhcmVcbiAgICAvLyB0cnVlL2ZhbHNlIHZhbHVlcyB0byByZXNpemUgd2hlbiB0aGUgcG9pbnRlciBpcyBvdmVyIHRoYXQgZWRnZSxcbiAgICAvLyBDU1Mgc2VsZWN0b3JzIHRvIG1hdGNoIHRoZSBoYW5kbGVzIGZvciBlYWNoIGRpcmVjdGlvblxuICAgIC8vIG9yIHRoZSBFbGVtZW50cyBmb3IgZWFjaCBoYW5kbGVcbiAgICBlZGdlczogbnVsbCxcbiAgICAvLyBhIHZhbHVlIG9mICdub25lJyB3aWxsIGxpbWl0IHRoZSByZXNpemUgcmVjdCB0byBhIG1pbmltdW0gb2YgMHgwXG4gICAgLy8gJ25lZ2F0ZScgd2lsbCBhbG93IHRoZSByZWN0IHRvIGhhdmUgbmVnYXRpdmUgd2lkdGgvaGVpZ2h0XG4gICAgLy8gJ3JlcG9zaXRpb24nIHdpbGwga2VlcCB0aGUgd2lkdGgvaGVpZ2h0IHBvc2l0aXZlIGJ5IHN3YXBwaW5nXG4gICAgLy8gdGhlIHRvcCBhbmQgYm90dG9tIGVkZ2VzIGFuZC9vciBzd2FwcGluZyB0aGUgbGVmdCBhbmQgcmlnaHQgZWRnZXNcbiAgICBpbnZlcnQ6ICdub25lJ1xuICB9LFxuICBjaGVja2VyOiBmdW5jdGlvbiBjaGVja2VyKF9wb2ludGVyLCBfZXZlbnQsIGludGVyYWN0YWJsZSwgZWxlbWVudCwgaW50ZXJhY3Rpb24sIHJlY3QpIHtcbiAgICBpZiAoIXJlY3QpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHZhciBwYWdlID0gdXRpbHMuZXh0ZW5kKHt9LCBpbnRlcmFjdGlvbi5jb29yZHMuY3VyLnBhZ2UpO1xuICAgIHZhciBvcHRpb25zID0gaW50ZXJhY3RhYmxlLm9wdGlvbnM7XG5cbiAgICBpZiAob3B0aW9ucy5yZXNpemUuZW5hYmxlZCkge1xuICAgICAgdmFyIHJlc2l6ZU9wdGlvbnMgPSBvcHRpb25zLnJlc2l6ZTtcbiAgICAgIHZhciByZXNpemVFZGdlcyA9IHtcbiAgICAgICAgbGVmdDogZmFsc2UsXG4gICAgICAgIHJpZ2h0OiBmYWxzZSxcbiAgICAgICAgdG9wOiBmYWxzZSxcbiAgICAgICAgYm90dG9tOiBmYWxzZVxuICAgICAgfTsgLy8gaWYgdXNpbmcgcmVzaXplLmVkZ2VzXG5cbiAgICAgIGlmICh1dGlscy5pcy5vYmplY3QocmVzaXplT3B0aW9ucy5lZGdlcykpIHtcbiAgICAgICAgZm9yICh2YXIgZWRnZSBpbiByZXNpemVFZGdlcykge1xuICAgICAgICAgIHJlc2l6ZUVkZ2VzW2VkZ2VdID0gY2hlY2tSZXNpemVFZGdlKGVkZ2UsIHJlc2l6ZU9wdGlvbnMuZWRnZXNbZWRnZV0sIHBhZ2UsIGludGVyYWN0aW9uLl9sYXRlc3RQb2ludGVyLmV2ZW50VGFyZ2V0LCBlbGVtZW50LCByZWN0LCByZXNpemVPcHRpb25zLm1hcmdpbiB8fCB0aGlzLmRlZmF1bHRNYXJnaW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzaXplRWRnZXMubGVmdCA9IHJlc2l6ZUVkZ2VzLmxlZnQgJiYgIXJlc2l6ZUVkZ2VzLnJpZ2h0O1xuICAgICAgICByZXNpemVFZGdlcy50b3AgPSByZXNpemVFZGdlcy50b3AgJiYgIXJlc2l6ZUVkZ2VzLmJvdHRvbTtcblxuICAgICAgICBpZiAocmVzaXplRWRnZXMubGVmdCB8fCByZXNpemVFZGdlcy5yaWdodCB8fCByZXNpemVFZGdlcy50b3AgfHwgcmVzaXplRWRnZXMuYm90dG9tKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5hbWU6ICdyZXNpemUnLFxuICAgICAgICAgICAgZWRnZXM6IHJlc2l6ZUVkZ2VzXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJpZ2h0ID0gb3B0aW9ucy5yZXNpemUuYXhpcyAhPT0gJ3knICYmIHBhZ2UueCA+IHJlY3QucmlnaHQgLSB0aGlzLmRlZmF1bHRNYXJnaW47XG4gICAgICAgIHZhciBib3R0b20gPSBvcHRpb25zLnJlc2l6ZS5heGlzICE9PSAneCcgJiYgcGFnZS55ID4gcmVjdC5ib3R0b20gLSB0aGlzLmRlZmF1bHRNYXJnaW47XG5cbiAgICAgICAgaWYgKHJpZ2h0IHx8IGJvdHRvbSkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBuYW1lOiAncmVzaXplJyxcbiAgICAgICAgICAgIGF4ZXM6IChyaWdodCA/ICd4JyA6ICcnKSArIChib3R0b20gPyAneScgOiAnJylcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG4gIGN1cnNvcnM6IG51bGwsXG4gIGdldEN1cnNvcjogZnVuY3Rpb24gZ2V0Q3Vyc29yKGFjdGlvbikge1xuICAgIHZhciBjdXJzb3JzID0gcmVzaXplLmN1cnNvcnM7XG5cbiAgICBpZiAoYWN0aW9uLmF4aXMpIHtcbiAgICAgIHJldHVybiBjdXJzb3JzW2FjdGlvbi5uYW1lICsgYWN0aW9uLmF4aXNdO1xuICAgIH0gZWxzZSBpZiAoYWN0aW9uLmVkZ2VzKSB7XG4gICAgICB2YXIgY3Vyc29yS2V5ID0gJyc7XG4gICAgICB2YXIgZWRnZU5hbWVzID0gWyd0b3AnLCAnYm90dG9tJywgJ2xlZnQnLCAncmlnaHQnXTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgaWYgKGFjdGlvbi5lZGdlc1tlZGdlTmFtZXNbaV1dKSB7XG4gICAgICAgICAgY3Vyc29yS2V5ICs9IGVkZ2VOYW1lc1tpXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gY3Vyc29yc1tjdXJzb3JLZXldO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9LFxuICBkZWZhdWx0TWFyZ2luOiBudWxsXG59O1xuXG5mdW5jdGlvbiByZXNpemFibGUoaW50ZXJhY3RhYmxlLCBvcHRpb25zLCBzY29wZSkge1xuICBpZiAodXRpbHMuaXMub2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgaW50ZXJhY3RhYmxlLm9wdGlvbnMucmVzaXplLmVuYWJsZWQgPSBvcHRpb25zLmVuYWJsZWQgIT09IGZhbHNlO1xuICAgIGludGVyYWN0YWJsZS5zZXRQZXJBY3Rpb24oJ3Jlc2l6ZScsIG9wdGlvbnMpO1xuICAgIGludGVyYWN0YWJsZS5zZXRPbkV2ZW50cygncmVzaXplJywgb3B0aW9ucyk7XG5cbiAgICBpZiAodXRpbHMuaXMuc3RyaW5nKG9wdGlvbnMuYXhpcykgJiYgL154JHxeeSR8Xnh5JC8udGVzdChvcHRpb25zLmF4aXMpKSB7XG4gICAgICBpbnRlcmFjdGFibGUub3B0aW9ucy5yZXNpemUuYXhpcyA9IG9wdGlvbnMuYXhpcztcbiAgICB9IGVsc2UgaWYgKG9wdGlvbnMuYXhpcyA9PT0gbnVsbCkge1xuICAgICAgaW50ZXJhY3RhYmxlLm9wdGlvbnMucmVzaXplLmF4aXMgPSBzY29wZS5kZWZhdWx0cy5hY3Rpb25zLnJlc2l6ZS5heGlzO1xuICAgIH1cblxuICAgIGlmICh1dGlscy5pcy5ib29sKG9wdGlvbnMucHJlc2VydmVBc3BlY3RSYXRpbykpIHtcbiAgICAgIGludGVyYWN0YWJsZS5vcHRpb25zLnJlc2l6ZS5wcmVzZXJ2ZUFzcGVjdFJhdGlvID0gb3B0aW9ucy5wcmVzZXJ2ZUFzcGVjdFJhdGlvO1xuICAgIH0gZWxzZSBpZiAodXRpbHMuaXMuYm9vbChvcHRpb25zLnNxdWFyZSkpIHtcbiAgICAgIGludGVyYWN0YWJsZS5vcHRpb25zLnJlc2l6ZS5zcXVhcmUgPSBvcHRpb25zLnNxdWFyZTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW50ZXJhY3RhYmxlO1xuICB9XG5cbiAgaWYgKHV0aWxzLmlzLmJvb2wob3B0aW9ucykpIHtcbiAgICBpbnRlcmFjdGFibGUub3B0aW9ucy5yZXNpemUuZW5hYmxlZCA9IG9wdGlvbnM7XG4gICAgcmV0dXJuIGludGVyYWN0YWJsZTtcbiAgfVxuXG4gIHJldHVybiBpbnRlcmFjdGFibGUub3B0aW9ucy5yZXNpemU7XG59XG5cbmZ1bmN0aW9uIGNoZWNrUmVzaXplRWRnZShuYW1lLCB2YWx1ZSwgcGFnZSwgZWxlbWVudCwgaW50ZXJhY3RhYmxlRWxlbWVudCwgcmVjdCwgbWFyZ2luKSB7XG4gIC8vIGZhbHNlLCAnJywgdW5kZWZpbmVkLCBudWxsXG4gIGlmICghdmFsdWUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gLy8gdHJ1ZSB2YWx1ZSwgdXNlIHBvaW50ZXIgY29vcmRzIGFuZCBlbGVtZW50IHJlY3RcblxuXG4gIGlmICh2YWx1ZSA9PT0gdHJ1ZSkge1xuICAgIC8vIGlmIGRpbWVuc2lvbnMgYXJlIG5lZ2F0aXZlLCBcInN3aXRjaFwiIGVkZ2VzXG4gICAgdmFyIHdpZHRoID0gdXRpbHMuaXMubnVtYmVyKHJlY3Qud2lkdGgpID8gcmVjdC53aWR0aCA6IHJlY3QucmlnaHQgLSByZWN0LmxlZnQ7XG4gICAgdmFyIGhlaWdodCA9IHV0aWxzLmlzLm51bWJlcihyZWN0LmhlaWdodCkgPyByZWN0LmhlaWdodCA6IHJlY3QuYm90dG9tIC0gcmVjdC50b3A7IC8vIGRvbid0IHVzZSBtYXJnaW4gZ3JlYXRlciB0aGFuIGhhbGYgdGhlIHJlbGV2ZW50IGRpbWVuc2lvblxuXG4gICAgbWFyZ2luID0gTWF0aC5taW4obWFyZ2luLCAobmFtZSA9PT0gJ2xlZnQnIHx8IG5hbWUgPT09ICdyaWdodCcgPyB3aWR0aCA6IGhlaWdodCkgLyAyKTtcblxuICAgIGlmICh3aWR0aCA8IDApIHtcbiAgICAgIGlmIChuYW1lID09PSAnbGVmdCcpIHtcbiAgICAgICAgbmFtZSA9ICdyaWdodCc7XG4gICAgICB9IGVsc2UgaWYgKG5hbWUgPT09ICdyaWdodCcpIHtcbiAgICAgICAgbmFtZSA9ICdsZWZ0JztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaGVpZ2h0IDwgMCkge1xuICAgICAgaWYgKG5hbWUgPT09ICd0b3AnKSB7XG4gICAgICAgIG5hbWUgPSAnYm90dG9tJztcbiAgICAgIH0gZWxzZSBpZiAobmFtZSA9PT0gJ2JvdHRvbScpIHtcbiAgICAgICAgbmFtZSA9ICd0b3AnO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChuYW1lID09PSAnbGVmdCcpIHtcbiAgICAgIHJldHVybiBwYWdlLnggPCAod2lkdGggPj0gMCA/IHJlY3QubGVmdCA6IHJlY3QucmlnaHQpICsgbWFyZ2luO1xuICAgIH1cblxuICAgIGlmIChuYW1lID09PSAndG9wJykge1xuICAgICAgcmV0dXJuIHBhZ2UueSA8IChoZWlnaHQgPj0gMCA/IHJlY3QudG9wIDogcmVjdC5ib3R0b20pICsgbWFyZ2luO1xuICAgIH1cblxuICAgIGlmIChuYW1lID09PSAncmlnaHQnKSB7XG4gICAgICByZXR1cm4gcGFnZS54ID4gKHdpZHRoID49IDAgPyByZWN0LnJpZ2h0IDogcmVjdC5sZWZ0KSAtIG1hcmdpbjtcbiAgICB9XG5cbiAgICBpZiAobmFtZSA9PT0gJ2JvdHRvbScpIHtcbiAgICAgIHJldHVybiBwYWdlLnkgPiAoaGVpZ2h0ID49IDAgPyByZWN0LmJvdHRvbSA6IHJlY3QudG9wKSAtIG1hcmdpbjtcbiAgICB9XG4gIH0gLy8gdGhlIHJlbWFpbmluZyBjaGVja3MgcmVxdWlyZSBhbiBlbGVtZW50XG5cblxuICBpZiAoIXV0aWxzLmlzLmVsZW1lbnQoZWxlbWVudCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdXRpbHMuaXMuZWxlbWVudCh2YWx1ZSkgLy8gdGhlIHZhbHVlIGlzIGFuIGVsZW1lbnQgdG8gdXNlIGFzIGEgcmVzaXplIGhhbmRsZVxuICA/IHZhbHVlID09PSBlbGVtZW50IC8vIG90aGVyd2lzZSBjaGVjayBpZiBlbGVtZW50IG1hdGNoZXMgdmFsdWUgYXMgc2VsZWN0b3JcbiAgOiB1dGlscy5kb20ubWF0Y2hlc1VwVG8oZWxlbWVudCwgdmFsdWUsIGludGVyYWN0YWJsZUVsZW1lbnQpO1xufVxuXG5mdW5jdGlvbiBpbml0Q3Vyc29ycyhicm93c2VyKSB7XG4gIHJldHVybiBicm93c2VyLmlzSWU5ID8ge1xuICAgIHg6ICdlLXJlc2l6ZScsXG4gICAgeTogJ3MtcmVzaXplJyxcbiAgICB4eTogJ3NlLXJlc2l6ZScsXG4gICAgdG9wOiAnbi1yZXNpemUnLFxuICAgIGxlZnQ6ICd3LXJlc2l6ZScsXG4gICAgYm90dG9tOiAncy1yZXNpemUnLFxuICAgIHJpZ2h0OiAnZS1yZXNpemUnLFxuICAgIHRvcGxlZnQ6ICdzZS1yZXNpemUnLFxuICAgIGJvdHRvbXJpZ2h0OiAnc2UtcmVzaXplJyxcbiAgICB0b3ByaWdodDogJ25lLXJlc2l6ZScsXG4gICAgYm90dG9tbGVmdDogJ25lLXJlc2l6ZSdcbiAgfSA6IHtcbiAgICB4OiAnZXctcmVzaXplJyxcbiAgICB5OiAnbnMtcmVzaXplJyxcbiAgICB4eTogJ253c2UtcmVzaXplJyxcbiAgICB0b3A6ICducy1yZXNpemUnLFxuICAgIGxlZnQ6ICdldy1yZXNpemUnLFxuICAgIGJvdHRvbTogJ25zLXJlc2l6ZScsXG4gICAgcmlnaHQ6ICdldy1yZXNpemUnLFxuICAgIHRvcGxlZnQ6ICdud3NlLXJlc2l6ZScsXG4gICAgYm90dG9tcmlnaHQ6ICdud3NlLXJlc2l6ZScsXG4gICAgdG9wcmlnaHQ6ICduZXN3LXJlc2l6ZScsXG4gICAgYm90dG9tbGVmdDogJ25lc3ctcmVzaXplJ1xuICB9O1xufVxuXG5mdW5jdGlvbiBzdGFydChfcmVmKSB7XG4gIHZhciBpRXZlbnQgPSBfcmVmLmlFdmVudCxcbiAgICAgIGludGVyYWN0aW9uID0gX3JlZi5pbnRlcmFjdGlvbjtcblxuICBpZiAoaW50ZXJhY3Rpb24ucHJlcGFyZWQubmFtZSAhPT0gJ3Jlc2l6ZScgfHwgIWludGVyYWN0aW9uLnByZXBhcmVkLmVkZ2VzKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHN0YXJ0UmVjdCA9IGludGVyYWN0aW9uLnJlY3Q7XG4gIHZhciByZXNpemVPcHRpb25zID0gaW50ZXJhY3Rpb24uaW50ZXJhY3RhYmxlLm9wdGlvbnMucmVzaXplO1xuICAvKlxuICAgKiBXaGVuIHVzaW5nIHRoZSBgcmVzaXphYmxlLnNxdWFyZWAgb3IgYHJlc2l6YWJsZS5wcmVzZXJ2ZUFzcGVjdFJhdGlvYCBvcHRpb25zLCByZXNpemluZyBmcm9tIG9uZSBlZGdlXG4gICAqIHdpbGwgYWZmZWN0IGFub3RoZXIuIEUuZy4gd2l0aCBgcmVzaXphYmxlLnNxdWFyZWAsIHJlc2l6aW5nIHRvIG1ha2UgdGhlIHJpZ2h0IGVkZ2UgbGFyZ2VyIHdpbGwgbWFrZVxuICAgKiB0aGUgYm90dG9tIGVkZ2UgbGFyZ2VyIGJ5IHRoZSBzYW1lIGFtb3VudC4gV2UgY2FsbCB0aGVzZSAnbGlua2VkJyBlZGdlcy4gQW55IGxpbmtlZCBlZGdlcyB3aWxsIGRlcGVuZFxuICAgKiBvbiB0aGUgYWN0aXZlIGVkZ2VzIGFuZCB0aGUgZWRnZSBiZWluZyBpbnRlcmFjdGVkIHdpdGguXG4gICAqL1xuXG4gIGlmIChyZXNpemVPcHRpb25zLnNxdWFyZSB8fCByZXNpemVPcHRpb25zLnByZXNlcnZlQXNwZWN0UmF0aW8pIHtcbiAgICB2YXIgbGlua2VkRWRnZXMgPSB1dGlscy5leHRlbmQoe30sIGludGVyYWN0aW9uLnByZXBhcmVkLmVkZ2VzKTtcbiAgICBsaW5rZWRFZGdlcy50b3AgPSBsaW5rZWRFZGdlcy50b3AgfHwgbGlua2VkRWRnZXMubGVmdCAmJiAhbGlua2VkRWRnZXMuYm90dG9tO1xuICAgIGxpbmtlZEVkZ2VzLmxlZnQgPSBsaW5rZWRFZGdlcy5sZWZ0IHx8IGxpbmtlZEVkZ2VzLnRvcCAmJiAhbGlua2VkRWRnZXMucmlnaHQ7XG4gICAgbGlua2VkRWRnZXMuYm90dG9tID0gbGlua2VkRWRnZXMuYm90dG9tIHx8IGxpbmtlZEVkZ2VzLnJpZ2h0ICYmICFsaW5rZWRFZGdlcy50b3A7XG4gICAgbGlua2VkRWRnZXMucmlnaHQgPSBsaW5rZWRFZGdlcy5yaWdodCB8fCBsaW5rZWRFZGdlcy5ib3R0b20gJiYgIWxpbmtlZEVkZ2VzLmxlZnQ7XG4gICAgaW50ZXJhY3Rpb24ucHJlcGFyZWQuX2xpbmtlZEVkZ2VzID0gbGlua2VkRWRnZXM7XG4gIH0gZWxzZSB7XG4gICAgaW50ZXJhY3Rpb24ucHJlcGFyZWQuX2xpbmtlZEVkZ2VzID0gbnVsbDtcbiAgfSAvLyBpZiB1c2luZyBgcmVzaXphYmxlLnByZXNlcnZlQXNwZWN0UmF0aW9gIG9wdGlvbiwgcmVjb3JkIGFzcGVjdCByYXRpbyBhdCB0aGUgc3RhcnQgb2YgdGhlIHJlc2l6ZVxuXG5cbiAgaWYgKHJlc2l6ZU9wdGlvbnMucHJlc2VydmVBc3BlY3RSYXRpbykge1xuICAgIGludGVyYWN0aW9uLnJlc2l6ZVN0YXJ0QXNwZWN0UmF0aW8gPSBzdGFydFJlY3Qud2lkdGggLyBzdGFydFJlY3QuaGVpZ2h0O1xuICB9XG5cbiAgaW50ZXJhY3Rpb24ucmVzaXplUmVjdHMgPSB7XG4gICAgc3RhcnQ6IHN0YXJ0UmVjdCxcbiAgICBjdXJyZW50OiB1dGlscy5leHRlbmQoe30sIHN0YXJ0UmVjdCksXG4gICAgaW52ZXJ0ZWQ6IHV0aWxzLmV4dGVuZCh7fSwgc3RhcnRSZWN0KSxcbiAgICBwcmV2aW91czogdXRpbHMuZXh0ZW5kKHt9LCBzdGFydFJlY3QpLFxuICAgIGRlbHRhOiB7XG4gICAgICBsZWZ0OiAwLFxuICAgICAgcmlnaHQ6IDAsXG4gICAgICB3aWR0aDogMCxcbiAgICAgIHRvcDogMCxcbiAgICAgIGJvdHRvbTogMCxcbiAgICAgIGhlaWdodDogMFxuICAgIH1cbiAgfTtcbiAgaUV2ZW50LnJlY3QgPSBpbnRlcmFjdGlvbi5yZXNpemVSZWN0cy5pbnZlcnRlZDtcbiAgaUV2ZW50LmRlbHRhUmVjdCA9IGludGVyYWN0aW9uLnJlc2l6ZVJlY3RzLmRlbHRhO1xufVxuXG5mdW5jdGlvbiBtb3ZlKF9yZWYyKSB7XG4gIHZhciBpRXZlbnQgPSBfcmVmMi5pRXZlbnQsXG4gICAgICBpbnRlcmFjdGlvbiA9IF9yZWYyLmludGVyYWN0aW9uO1xuXG4gIGlmIChpbnRlcmFjdGlvbi5wcmVwYXJlZC5uYW1lICE9PSAncmVzaXplJyB8fCAhaW50ZXJhY3Rpb24ucHJlcGFyZWQuZWRnZXMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgcmVzaXplT3B0aW9ucyA9IGludGVyYWN0aW9uLmludGVyYWN0YWJsZS5vcHRpb25zLnJlc2l6ZTtcbiAgdmFyIGludmVydCA9IHJlc2l6ZU9wdGlvbnMuaW52ZXJ0O1xuICB2YXIgaW52ZXJ0aWJsZSA9IGludmVydCA9PT0gJ3JlcG9zaXRpb24nIHx8IGludmVydCA9PT0gJ25lZ2F0ZSc7XG4gIHZhciBlZGdlcyA9IGludGVyYWN0aW9uLnByZXBhcmVkLmVkZ2VzOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2hhZG93XG5cbiAgdmFyIHN0YXJ0ID0gaW50ZXJhY3Rpb24ucmVzaXplUmVjdHMuc3RhcnQ7XG4gIHZhciBjdXJyZW50ID0gaW50ZXJhY3Rpb24ucmVzaXplUmVjdHMuY3VycmVudDtcbiAgdmFyIGludmVydGVkID0gaW50ZXJhY3Rpb24ucmVzaXplUmVjdHMuaW52ZXJ0ZWQ7XG4gIHZhciBkZWx0YVJlY3QgPSBpbnRlcmFjdGlvbi5yZXNpemVSZWN0cy5kZWx0YTtcbiAgdmFyIHByZXZpb3VzID0gdXRpbHMuZXh0ZW5kKGludGVyYWN0aW9uLnJlc2l6ZVJlY3RzLnByZXZpb3VzLCBpbnZlcnRlZCk7XG4gIHZhciBvcmlnaW5hbEVkZ2VzID0gZWRnZXM7XG4gIHZhciBldmVudERlbHRhID0gdXRpbHMuZXh0ZW5kKHt9LCBpRXZlbnQuZGVsdGEpO1xuXG4gIGlmIChyZXNpemVPcHRpb25zLnByZXNlcnZlQXNwZWN0UmF0aW8gfHwgcmVzaXplT3B0aW9ucy5zcXVhcmUpIHtcbiAgICAvLyBgcmVzaXplLnByZXNlcnZlQXNwZWN0UmF0aW9gIHRha2VzIHByZWNlZGVuY2Ugb3ZlciBgcmVzaXplLnNxdWFyZWBcbiAgICB2YXIgc3RhcnRBc3BlY3RSYXRpbyA9IHJlc2l6ZU9wdGlvbnMucHJlc2VydmVBc3BlY3RSYXRpbyA/IGludGVyYWN0aW9uLnJlc2l6ZVN0YXJ0QXNwZWN0UmF0aW8gOiAxO1xuICAgIGVkZ2VzID0gaW50ZXJhY3Rpb24ucHJlcGFyZWQuX2xpbmtlZEVkZ2VzO1xuXG4gICAgaWYgKG9yaWdpbmFsRWRnZXMubGVmdCAmJiBvcmlnaW5hbEVkZ2VzLmJvdHRvbSB8fCBvcmlnaW5hbEVkZ2VzLnJpZ2h0ICYmIG9yaWdpbmFsRWRnZXMudG9wKSB7XG4gICAgICBldmVudERlbHRhLnkgPSAtZXZlbnREZWx0YS54IC8gc3RhcnRBc3BlY3RSYXRpbztcbiAgICB9IGVsc2UgaWYgKG9yaWdpbmFsRWRnZXMubGVmdCB8fCBvcmlnaW5hbEVkZ2VzLnJpZ2h0KSB7XG4gICAgICBldmVudERlbHRhLnkgPSBldmVudERlbHRhLnggLyBzdGFydEFzcGVjdFJhdGlvO1xuICAgIH0gZWxzZSBpZiAob3JpZ2luYWxFZGdlcy50b3AgfHwgb3JpZ2luYWxFZGdlcy5ib3R0b20pIHtcbiAgICAgIGV2ZW50RGVsdGEueCA9IGV2ZW50RGVsdGEueSAqIHN0YXJ0QXNwZWN0UmF0aW87XG4gICAgfVxuICB9IC8vIHVwZGF0ZSB0aGUgJ2N1cnJlbnQnIHJlY3Qgd2l0aG91dCBtb2RpZmljYXRpb25zXG5cblxuICBpZiAoZWRnZXMudG9wKSB7XG4gICAgY3VycmVudC50b3AgKz0gZXZlbnREZWx0YS55O1xuICB9XG5cbiAgaWYgKGVkZ2VzLmJvdHRvbSkge1xuICAgIGN1cnJlbnQuYm90dG9tICs9IGV2ZW50RGVsdGEueTtcbiAgfVxuXG4gIGlmIChlZGdlcy5sZWZ0KSB7XG4gICAgY3VycmVudC5sZWZ0ICs9IGV2ZW50RGVsdGEueDtcbiAgfVxuXG4gIGlmIChlZGdlcy5yaWdodCkge1xuICAgIGN1cnJlbnQucmlnaHQgKz0gZXZlbnREZWx0YS54O1xuICB9XG5cbiAgaWYgKGludmVydGlibGUpIHtcbiAgICAvLyBpZiBpbnZlcnRpYmxlLCBjb3B5IHRoZSBjdXJyZW50IHJlY3RcbiAgICB1dGlscy5leHRlbmQoaW52ZXJ0ZWQsIGN1cnJlbnQpO1xuXG4gICAgaWYgKGludmVydCA9PT0gJ3JlcG9zaXRpb24nKSB7XG4gICAgICAvLyBzd2FwIGVkZ2UgdmFsdWVzIGlmIG5lY2Vzc2FyeSB0byBrZWVwIHdpZHRoL2hlaWdodCBwb3NpdGl2ZVxuICAgICAgdmFyIHN3YXA7XG5cbiAgICAgIGlmIChpbnZlcnRlZC50b3AgPiBpbnZlcnRlZC5ib3R0b20pIHtcbiAgICAgICAgc3dhcCA9IGludmVydGVkLnRvcDtcbiAgICAgICAgaW52ZXJ0ZWQudG9wID0gaW52ZXJ0ZWQuYm90dG9tO1xuICAgICAgICBpbnZlcnRlZC5ib3R0b20gPSBzd2FwO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW52ZXJ0ZWQubGVmdCA+IGludmVydGVkLnJpZ2h0KSB7XG4gICAgICAgIHN3YXAgPSBpbnZlcnRlZC5sZWZ0O1xuICAgICAgICBpbnZlcnRlZC5sZWZ0ID0gaW52ZXJ0ZWQucmlnaHQ7XG4gICAgICAgIGludmVydGVkLnJpZ2h0ID0gc3dhcDtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gaWYgbm90IGludmVydGlibGUsIHJlc3RyaWN0IHRvIG1pbmltdW0gb2YgMHgwIHJlY3RcbiAgICBpbnZlcnRlZC50b3AgPSBNYXRoLm1pbihjdXJyZW50LnRvcCwgc3RhcnQuYm90dG9tKTtcbiAgICBpbnZlcnRlZC5ib3R0b20gPSBNYXRoLm1heChjdXJyZW50LmJvdHRvbSwgc3RhcnQudG9wKTtcbiAgICBpbnZlcnRlZC5sZWZ0ID0gTWF0aC5taW4oY3VycmVudC5sZWZ0LCBzdGFydC5yaWdodCk7XG4gICAgaW52ZXJ0ZWQucmlnaHQgPSBNYXRoLm1heChjdXJyZW50LnJpZ2h0LCBzdGFydC5sZWZ0KTtcbiAgfVxuXG4gIGludmVydGVkLndpZHRoID0gaW52ZXJ0ZWQucmlnaHQgLSBpbnZlcnRlZC5sZWZ0O1xuICBpbnZlcnRlZC5oZWlnaHQgPSBpbnZlcnRlZC5ib3R0b20gLSBpbnZlcnRlZC50b3A7XG5cbiAgZm9yICh2YXIgZWRnZSBpbiBpbnZlcnRlZCkge1xuICAgIGRlbHRhUmVjdFtlZGdlXSA9IGludmVydGVkW2VkZ2VdIC0gcHJldmlvdXNbZWRnZV07XG4gIH1cblxuICBpRXZlbnQuZWRnZXMgPSBpbnRlcmFjdGlvbi5wcmVwYXJlZC5lZGdlcztcbiAgaUV2ZW50LnJlY3QgPSBpbnZlcnRlZDtcbiAgaUV2ZW50LmRlbHRhUmVjdCA9IGRlbHRhUmVjdDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlRXZlbnRBeGVzKF9yZWYzKSB7XG4gIHZhciBpbnRlcmFjdGlvbiA9IF9yZWYzLmludGVyYWN0aW9uLFxuICAgICAgaUV2ZW50ID0gX3JlZjMuaUV2ZW50LFxuICAgICAgYWN0aW9uID0gX3JlZjMuYWN0aW9uO1xuXG4gIGlmIChhY3Rpb24gIT09ICdyZXNpemUnIHx8ICFpbnRlcmFjdGlvbi5yZXNpemVBeGVzKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIG9wdGlvbnMgPSBpbnRlcmFjdGlvbi5pbnRlcmFjdGFibGUub3B0aW9ucztcblxuICBpZiAob3B0aW9ucy5yZXNpemUuc3F1YXJlKSB7XG4gICAgaWYgKGludGVyYWN0aW9uLnJlc2l6ZUF4ZXMgPT09ICd5Jykge1xuICAgICAgaUV2ZW50LmRlbHRhLnggPSBpRXZlbnQuZGVsdGEueTtcbiAgICB9IGVsc2Uge1xuICAgICAgaUV2ZW50LmRlbHRhLnkgPSBpRXZlbnQuZGVsdGEueDtcbiAgICB9XG5cbiAgICBpRXZlbnQuYXhlcyA9ICd4eSc7XG4gIH0gZWxzZSB7XG4gICAgaUV2ZW50LmF4ZXMgPSBpbnRlcmFjdGlvbi5yZXNpemVBeGVzO1xuXG4gICAgaWYgKGludGVyYWN0aW9uLnJlc2l6ZUF4ZXMgPT09ICd4Jykge1xuICAgICAgaUV2ZW50LmRlbHRhLnkgPSAwO1xuICAgIH0gZWxzZSBpZiAoaW50ZXJhY3Rpb24ucmVzaXplQXhlcyA9PT0gJ3knKSB7XG4gICAgICBpRXZlbnQuZGVsdGEueCA9IDA7XG4gICAgfVxuICB9XG59XG5cbnZhciBfZGVmYXVsdCA9IHJlc2l6ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5cbn0se1wiQGludGVyYWN0anMvY29yZS9zY29wZVwiOjI0LFwiQGludGVyYWN0anMvdXRpbHNcIjo1NX1dLDc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmdldENvbnRhaW5lciA9IGdldENvbnRhaW5lcjtcbmV4cG9ydHMuZ2V0U2Nyb2xsID0gZ2V0U2Nyb2xsO1xuZXhwb3J0cy5nZXRTY3JvbGxTaXplID0gZ2V0U2Nyb2xsU2l6ZTtcbmV4cG9ydHMuZ2V0U2Nyb2xsU2l6ZURlbHRhID0gZ2V0U2Nyb2xsU2l6ZURlbHRhO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciBkb21VdGlscyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy91dGlscy9kb21VdGlsc1wiKSk7XG5cbnZhciBpcyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy91dGlscy9pc1wiKSk7XG5cbnZhciBfcmFmID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiQGludGVyYWN0anMvdXRpbHMvcmFmXCIpKTtcblxudmFyIF9yZWN0ID0gcmVxdWlyZShcIkBpbnRlcmFjdGpzL3V0aWxzL3JlY3RcIik7XG5cbnZhciBfd2luZG93ID0gcmVxdWlyZShcIkBpbnRlcmFjdGpzL3V0aWxzL3dpbmRvd1wiKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHsgdmFyIGRlc2MgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkgJiYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBrZXkpIDoge307IGlmIChkZXNjLmdldCB8fCBkZXNjLnNldCkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkobmV3T2JqLCBrZXksIGRlc2MpOyB9IGVsc2UgeyBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gfSB9IG5ld09ialtcImRlZmF1bHRcIl0gPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXG5mdW5jdGlvbiBpbnN0YWxsKHNjb3BlKSB7XG4gIHZhciBpbnRlcmFjdGlvbnMgPSBzY29wZS5pbnRlcmFjdGlvbnMsXG4gICAgICBkZWZhdWx0cyA9IHNjb3BlLmRlZmF1bHRzLFxuICAgICAgYWN0aW9ucyA9IHNjb3BlLmFjdGlvbnM7XG4gIHNjb3BlLmF1dG9TY3JvbGwgPSBhdXRvU2Nyb2xsO1xuXG4gIGF1dG9TY3JvbGwubm93ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBzY29wZS5ub3coKTtcbiAgfTtcblxuICBpbnRlcmFjdGlvbnMuc2lnbmFscy5vbignbmV3JywgZnVuY3Rpb24gKF9yZWYpIHtcbiAgICB2YXIgaW50ZXJhY3Rpb24gPSBfcmVmLmludGVyYWN0aW9uO1xuICAgIGludGVyYWN0aW9uLmF1dG9TY3JvbGwgPSBudWxsO1xuICB9KTtcbiAgaW50ZXJhY3Rpb25zLnNpZ25hbHMub24oJ3N0b3AnLCBhdXRvU2Nyb2xsLnN0b3ApO1xuICBpbnRlcmFjdGlvbnMuc2lnbmFscy5vbignYWN0aW9uLW1vdmUnLCBmdW5jdGlvbiAoYXJnKSB7XG4gICAgcmV0dXJuIGF1dG9TY3JvbGwub25JbnRlcmFjdGlvbk1vdmUoYXJnKTtcbiAgfSk7XG4gIGFjdGlvbnMuZXZlbnRUeXBlcy5wdXNoKCdhdXRvc2Nyb2xsJyk7XG4gIGRlZmF1bHRzLnBlckFjdGlvbi5hdXRvU2Nyb2xsID0gYXV0b1Njcm9sbC5kZWZhdWx0cztcbn1cblxudmFyIGF1dG9TY3JvbGwgPSB7XG4gIGRlZmF1bHRzOiB7XG4gICAgZW5hYmxlZDogZmFsc2UsXG4gICAgbWFyZ2luOiA2MCxcbiAgICAvLyB0aGUgaXRlbSB0aGF0IGlzIHNjcm9sbGVkIChXaW5kb3cgb3IgSFRNTEVsZW1lbnQpXG4gICAgY29udGFpbmVyOiBudWxsLFxuICAgIC8vIHRoZSBzY3JvbGwgc3BlZWQgaW4gcGl4ZWxzIHBlciBzZWNvbmRcbiAgICBzcGVlZDogMzAwXG4gIH0sXG4gIG5vdzogRGF0ZS5ub3csXG4gIGludGVyYWN0aW9uOiBudWxsLFxuICBpOiBudWxsLFxuICB4OiAwLFxuICB5OiAwLFxuICBpc1Njcm9sbGluZzogZmFsc2UsXG4gIHByZXZUaW1lOiAwLFxuICBtYXJnaW46IDAsXG4gIHNwZWVkOiAwLFxuICBzdGFydDogZnVuY3Rpb24gc3RhcnQoaW50ZXJhY3Rpb24pIHtcbiAgICBhdXRvU2Nyb2xsLmlzU2Nyb2xsaW5nID0gdHJ1ZTtcblxuICAgIF9yYWZbXCJkZWZhdWx0XCJdLmNhbmNlbChhdXRvU2Nyb2xsLmkpO1xuXG4gICAgaW50ZXJhY3Rpb24uYXV0b1Njcm9sbCA9IGF1dG9TY3JvbGw7XG4gICAgYXV0b1Njcm9sbC5pbnRlcmFjdGlvbiA9IGludGVyYWN0aW9uO1xuICAgIGF1dG9TY3JvbGwucHJldlRpbWUgPSBhdXRvU2Nyb2xsLm5vdygpO1xuICAgIGF1dG9TY3JvbGwuaSA9IF9yYWZbXCJkZWZhdWx0XCJdLnJlcXVlc3QoYXV0b1Njcm9sbC5zY3JvbGwpO1xuICB9LFxuICBzdG9wOiBmdW5jdGlvbiBzdG9wKCkge1xuICAgIGF1dG9TY3JvbGwuaXNTY3JvbGxpbmcgPSBmYWxzZTtcblxuICAgIGlmIChhdXRvU2Nyb2xsLmludGVyYWN0aW9uKSB7XG4gICAgICBhdXRvU2Nyb2xsLmludGVyYWN0aW9uLmF1dG9TY3JvbGwgPSBudWxsO1xuICAgIH1cblxuICAgIF9yYWZbXCJkZWZhdWx0XCJdLmNhbmNlbChhdXRvU2Nyb2xsLmkpO1xuICB9LFxuICAvLyBzY3JvbGwgdGhlIHdpbmRvdyBieSB0aGUgdmFsdWVzIGluIHNjcm9sbC54L3lcbiAgc2Nyb2xsOiBmdW5jdGlvbiBzY3JvbGwoKSB7XG4gICAgdmFyIGludGVyYWN0aW9uID0gYXV0b1Njcm9sbC5pbnRlcmFjdGlvbjtcbiAgICB2YXIgaW50ZXJhY3RhYmxlID0gaW50ZXJhY3Rpb24uaW50ZXJhY3RhYmxlLFxuICAgICAgICBlbGVtZW50ID0gaW50ZXJhY3Rpb24uZWxlbWVudDtcbiAgICB2YXIgb3B0aW9ucyA9IGludGVyYWN0YWJsZS5vcHRpb25zW2F1dG9TY3JvbGwuaW50ZXJhY3Rpb24ucHJlcGFyZWQubmFtZV0uYXV0b1Njcm9sbDtcbiAgICB2YXIgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKG9wdGlvbnMuY29udGFpbmVyLCBpbnRlcmFjdGFibGUsIGVsZW1lbnQpO1xuICAgIHZhciBub3cgPSBhdXRvU2Nyb2xsLm5vdygpOyAvLyBjaGFuZ2UgaW4gdGltZSBpbiBzZWNvbmRzXG5cbiAgICB2YXIgZHQgPSAobm93IC0gYXV0b1Njcm9sbC5wcmV2VGltZSkgLyAxMDAwOyAvLyBkaXNwbGFjZW1lbnRcblxuICAgIHZhciBzID0gb3B0aW9ucy5zcGVlZCAqIGR0O1xuXG4gICAgaWYgKHMgPj0gMSkge1xuICAgICAgdmFyIHNjcm9sbEJ5ID0ge1xuICAgICAgICB4OiBhdXRvU2Nyb2xsLnggKiBzLFxuICAgICAgICB5OiBhdXRvU2Nyb2xsLnkgKiBzXG4gICAgICB9O1xuXG4gICAgICBpZiAoc2Nyb2xsQnkueCB8fCBzY3JvbGxCeS55KSB7XG4gICAgICAgIHZhciBwcmV2U2Nyb2xsID0gZ2V0U2Nyb2xsKGNvbnRhaW5lcik7XG5cbiAgICAgICAgaWYgKGlzLndpbmRvdyhjb250YWluZXIpKSB7XG4gICAgICAgICAgY29udGFpbmVyLnNjcm9sbEJ5KHNjcm9sbEJ5LngsIHNjcm9sbEJ5LnkpO1xuICAgICAgICB9IGVsc2UgaWYgKGNvbnRhaW5lcikge1xuICAgICAgICAgIGNvbnRhaW5lci5zY3JvbGxMZWZ0ICs9IHNjcm9sbEJ5Lng7XG4gICAgICAgICAgY29udGFpbmVyLnNjcm9sbFRvcCArPSBzY3JvbGxCeS55O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGN1clNjcm9sbCA9IGdldFNjcm9sbChjb250YWluZXIpO1xuICAgICAgICB2YXIgZGVsdGEgPSB7XG4gICAgICAgICAgeDogY3VyU2Nyb2xsLnggLSBwcmV2U2Nyb2xsLngsXG4gICAgICAgICAgeTogY3VyU2Nyb2xsLnkgLSBwcmV2U2Nyb2xsLnlcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoZGVsdGEueCB8fCBkZWx0YS55KSB7XG4gICAgICAgICAgaW50ZXJhY3RhYmxlLmZpcmUoe1xuICAgICAgICAgICAgdHlwZTogJ2F1dG9zY3JvbGwnLFxuICAgICAgICAgICAgdGFyZ2V0OiBlbGVtZW50LFxuICAgICAgICAgICAgaW50ZXJhY3RhYmxlOiBpbnRlcmFjdGFibGUsXG4gICAgICAgICAgICBkZWx0YTogZGVsdGEsXG4gICAgICAgICAgICBpbnRlcmFjdGlvbjogaW50ZXJhY3Rpb24sXG4gICAgICAgICAgICBjb250YWluZXI6IGNvbnRhaW5lclxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGF1dG9TY3JvbGwucHJldlRpbWUgPSBub3c7XG4gICAgfVxuXG4gICAgaWYgKGF1dG9TY3JvbGwuaXNTY3JvbGxpbmcpIHtcbiAgICAgIF9yYWZbXCJkZWZhdWx0XCJdLmNhbmNlbChhdXRvU2Nyb2xsLmkpO1xuXG4gICAgICBhdXRvU2Nyb2xsLmkgPSBfcmFmW1wiZGVmYXVsdFwiXS5yZXF1ZXN0KGF1dG9TY3JvbGwuc2Nyb2xsKTtcbiAgICB9XG4gIH0sXG4gIGNoZWNrOiBmdW5jdGlvbiBjaGVjayhpbnRlcmFjdGFibGUsIGFjdGlvbk5hbWUpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGludGVyYWN0YWJsZS5vcHRpb25zO1xuICAgIHJldHVybiBvcHRpb25zW2FjdGlvbk5hbWVdLmF1dG9TY3JvbGwgJiYgb3B0aW9uc1thY3Rpb25OYW1lXS5hdXRvU2Nyb2xsLmVuYWJsZWQ7XG4gIH0sXG4gIG9uSW50ZXJhY3Rpb25Nb3ZlOiBmdW5jdGlvbiBvbkludGVyYWN0aW9uTW92ZShfcmVmMikge1xuICAgIHZhciBpbnRlcmFjdGlvbiA9IF9yZWYyLmludGVyYWN0aW9uLFxuICAgICAgICBwb2ludGVyID0gX3JlZjIucG9pbnRlcjtcblxuICAgIGlmICghKGludGVyYWN0aW9uLmludGVyYWN0aW5nKCkgJiYgYXV0b1Njcm9sbC5jaGVjayhpbnRlcmFjdGlvbi5pbnRlcmFjdGFibGUsIGludGVyYWN0aW9uLnByZXBhcmVkLm5hbWUpKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChpbnRlcmFjdGlvbi5zaW11bGF0aW9uKSB7XG4gICAgICBhdXRvU2Nyb2xsLnggPSBhdXRvU2Nyb2xsLnkgPSAwO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciB0b3A7XG4gICAgdmFyIHJpZ2h0O1xuICAgIHZhciBib3R0b207XG4gICAgdmFyIGxlZnQ7XG4gICAgdmFyIGludGVyYWN0YWJsZSA9IGludGVyYWN0aW9uLmludGVyYWN0YWJsZSxcbiAgICAgICAgZWxlbWVudCA9IGludGVyYWN0aW9uLmVsZW1lbnQ7XG4gICAgdmFyIG9wdGlvbnMgPSBpbnRlcmFjdGFibGUub3B0aW9uc1tpbnRlcmFjdGlvbi5wcmVwYXJlZC5uYW1lXS5hdXRvU2Nyb2xsO1xuICAgIHZhciBjb250YWluZXIgPSBnZXRDb250YWluZXIob3B0aW9ucy5jb250YWluZXIsIGludGVyYWN0YWJsZSwgZWxlbWVudCk7XG5cbiAgICBpZiAoaXMud2luZG93KGNvbnRhaW5lcikpIHtcbiAgICAgIGxlZnQgPSBwb2ludGVyLmNsaWVudFggPCBhdXRvU2Nyb2xsLm1hcmdpbjtcbiAgICAgIHRvcCA9IHBvaW50ZXIuY2xpZW50WSA8IGF1dG9TY3JvbGwubWFyZ2luO1xuICAgICAgcmlnaHQgPSBwb2ludGVyLmNsaWVudFggPiBjb250YWluZXIuaW5uZXJXaWR0aCAtIGF1dG9TY3JvbGwubWFyZ2luO1xuICAgICAgYm90dG9tID0gcG9pbnRlci5jbGllbnRZID4gY29udGFpbmVyLmlubmVySGVpZ2h0IC0gYXV0b1Njcm9sbC5tYXJnaW47XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciByZWN0ID0gZG9tVXRpbHMuZ2V0RWxlbWVudENsaWVudFJlY3QoY29udGFpbmVyKTtcbiAgICAgIGxlZnQgPSBwb2ludGVyLmNsaWVudFggPCByZWN0LmxlZnQgKyBhdXRvU2Nyb2xsLm1hcmdpbjtcbiAgICAgIHRvcCA9IHBvaW50ZXIuY2xpZW50WSA8IHJlY3QudG9wICsgYXV0b1Njcm9sbC5tYXJnaW47XG4gICAgICByaWdodCA9IHBvaW50ZXIuY2xpZW50WCA+IHJlY3QucmlnaHQgLSBhdXRvU2Nyb2xsLm1hcmdpbjtcbiAgICAgIGJvdHRvbSA9IHBvaW50ZXIuY2xpZW50WSA+IHJlY3QuYm90dG9tIC0gYXV0b1Njcm9sbC5tYXJnaW47XG4gICAgfVxuXG4gICAgYXV0b1Njcm9sbC54ID0gcmlnaHQgPyAxIDogbGVmdCA/IC0xIDogMDtcbiAgICBhdXRvU2Nyb2xsLnkgPSBib3R0b20gPyAxIDogdG9wID8gLTEgOiAwO1xuXG4gICAgaWYgKCFhdXRvU2Nyb2xsLmlzU2Nyb2xsaW5nKSB7XG4gICAgICAvLyBzZXQgdGhlIGF1dG9TY3JvbGwgcHJvcGVydGllcyB0byB0aG9zZSBvZiB0aGUgdGFyZ2V0XG4gICAgICBhdXRvU2Nyb2xsLm1hcmdpbiA9IG9wdGlvbnMubWFyZ2luO1xuICAgICAgYXV0b1Njcm9sbC5zcGVlZCA9IG9wdGlvbnMuc3BlZWQ7XG4gICAgICBhdXRvU2Nyb2xsLnN0YXJ0KGludGVyYWN0aW9uKTtcbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGdldENvbnRhaW5lcih2YWx1ZSwgaW50ZXJhY3RhYmxlLCBlbGVtZW50KSB7XG4gIHJldHVybiAoaXMuc3RyaW5nKHZhbHVlKSA/ICgwLCBfcmVjdC5nZXRTdHJpbmdPcHRpb25SZXN1bHQpKHZhbHVlLCBpbnRlcmFjdGFibGUsIGVsZW1lbnQpIDogdmFsdWUpIHx8ICgwLCBfd2luZG93LmdldFdpbmRvdykoZWxlbWVudCk7XG59XG5cbmZ1bmN0aW9uIGdldFNjcm9sbChjb250YWluZXIpIHtcbiAgaWYgKGlzLndpbmRvdyhjb250YWluZXIpKSB7XG4gICAgY29udGFpbmVyID0gd2luZG93LmRvY3VtZW50LmJvZHk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHg6IGNvbnRhaW5lci5zY3JvbGxMZWZ0LFxuICAgIHk6IGNvbnRhaW5lci5zY3JvbGxUb3BcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0U2Nyb2xsU2l6ZShjb250YWluZXIpIHtcbiAgaWYgKGlzLndpbmRvdyhjb250YWluZXIpKSB7XG4gICAgY29udGFpbmVyID0gd2luZG93LmRvY3VtZW50LmJvZHk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHg6IGNvbnRhaW5lci5zY3JvbGxXaWR0aCxcbiAgICB5OiBjb250YWluZXIuc2Nyb2xsSGVpZ2h0XG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldFNjcm9sbFNpemVEZWx0YShfcmVmMywgZnVuYykge1xuICB2YXIgaW50ZXJhY3Rpb24gPSBfcmVmMy5pbnRlcmFjdGlvbixcbiAgICAgIGVsZW1lbnQgPSBfcmVmMy5lbGVtZW50O1xuICB2YXIgc2Nyb2xsT3B0aW9ucyA9IGludGVyYWN0aW9uICYmIGludGVyYWN0aW9uLmludGVyYWN0YWJsZS5vcHRpb25zW2ludGVyYWN0aW9uLnByZXBhcmVkLm5hbWVdLmF1dG9TY3JvbGw7XG5cbiAgaWYgKCFzY3JvbGxPcHRpb25zIHx8ICFzY3JvbGxPcHRpb25zLmVuYWJsZWQpIHtcbiAgICBmdW5jKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfTtcbiAgfVxuXG4gIHZhciBzY3JvbGxDb250YWluZXIgPSBnZXRDb250YWluZXIoc2Nyb2xsT3B0aW9ucy5jb250YWluZXIsIGludGVyYWN0aW9uLmludGVyYWN0YWJsZSwgZWxlbWVudCk7XG4gIHZhciBwcmV2U2l6ZSA9IGdldFNjcm9sbChzY3JvbGxDb250YWluZXIpO1xuICBmdW5jKCk7XG4gIHZhciBjdXJTaXplID0gZ2V0U2Nyb2xsKHNjcm9sbENvbnRhaW5lcik7XG4gIHJldHVybiB7XG4gICAgeDogY3VyU2l6ZS54IC0gcHJldlNpemUueCxcbiAgICB5OiBjdXJTaXplLnkgLSBwcmV2U2l6ZS55XG4gIH07XG59XG5cbnZhciBfZGVmYXVsdCA9IHtcbiAgaWQ6ICdhdXRvLXNjcm9sbCcsXG4gIGluc3RhbGw6IGluc3RhbGxcbn07XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0O1xuXG59LHtcIkBpbnRlcmFjdGpzL3V0aWxzL2RvbVV0aWxzXCI6NTAsXCJAaW50ZXJhY3Rqcy91dGlscy9pc1wiOjU2LFwiQGludGVyYWN0anMvdXRpbHMvcmFmXCI6NjEsXCJAaW50ZXJhY3Rqcy91dGlscy9yZWN0XCI6NjIsXCJAaW50ZXJhY3Rqcy91dGlscy93aW5kb3dcIjo2NX1dLDg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF91dGlscyA9IHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy91dGlsc1wiKTtcblxudmFyIGlzID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQocmVxdWlyZShcIkBpbnRlcmFjdGpzL3V0aWxzL2lzXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iajsgfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgeyB2YXIgZGVzYyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID8gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIGtleSkgOiB7fTsgaWYgKGRlc2MuZ2V0IHx8IGRlc2Muc2V0KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuZXdPYmosIGtleSwgZGVzYyk7IH0gZWxzZSB7IG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSB9IH0gbmV3T2JqW1wiZGVmYXVsdFwiXSA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cbmZ1bmN0aW9uIGluc3RhbGwoc2NvcGUpIHtcbiAgdmFyIEludGVyYWN0YWJsZSA9IHNjb3BlLkludGVyYWN0YWJsZSxcbiAgICAgIGFjdGlvbnMgPSBzY29wZS5hY3Rpb25zO1xuICBJbnRlcmFjdGFibGUucHJvdG90eXBlLmdldEFjdGlvbiA9IGdldEFjdGlvbjtcbiAgLyoqXG4gICAqIGBgYGpzXG4gICAqIGludGVyYWN0KGVsZW1lbnQsIHsgaWdub3JlRnJvbTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25vLWFjdGlvbicpIH0pXG4gICAqIC8vIG9yXG4gICAqIGludGVyYWN0KGVsZW1lbnQpLmlnbm9yZUZyb20oJ2lucHV0LCB0ZXh0YXJlYSwgYScpXG4gICAqIGBgYFxuICAgKiBAZGVwcmVjYXRlZFxuICAgKiBJZiB0aGUgdGFyZ2V0IG9mIHRoZSBgbW91c2Vkb3duYCwgYHBvaW50ZXJkb3duYCBvciBgdG91Y2hzdGFydGAgZXZlbnQgb3IgYW55XG4gICAqIG9mIGl0J3MgcGFyZW50cyBtYXRjaCB0aGUgZ2l2ZW4gQ1NTIHNlbGVjdG9yIG9yIEVsZW1lbnQsIG5vXG4gICAqIGRyYWcvcmVzaXplL2dlc3R1cmUgaXMgc3RhcnRlZC5cbiAgICpcbiAgICogRG9uJ3QgdXNlIHRoaXMgbWV0aG9kLiBJbnN0ZWFkIHNldCB0aGUgYGlnbm9yZUZyb21gIG9wdGlvbiBmb3IgZWFjaCBhY3Rpb25cbiAgICogb3IgZm9yIGBwb2ludGVyRXZlbnRzYFxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBpbnRlcmFjdCh0YXJnZXR0KVxuICAgKiAgIC5kcmFnZ2FibGUoe1xuICAgKiAgICAgaWdub3JlRnJvbTogJ2lucHV0LCB0ZXh0YXJlYSwgYVtocmVmXScnLFxuICAgKiAgIH0pXG4gICAqICAgLnBvaW50ZXJFdmVudHMoe1xuICAgKiAgICAgaWdub3JlRnJvbTogJ1tuby1wb2ludGVyXScsXG4gICAqICAgfSlcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBFbGVtZW50IHwgbnVsbH0gW25ld1ZhbHVlXSBhIENTUyBzZWxlY3RvciBzdHJpbmcsIGFuXG4gICAqIEVsZW1lbnQgb3IgYG51bGxgIHRvIG5vdCBpZ25vcmUgYW55IGVsZW1lbnRzXG4gICAqIEByZXR1cm4ge3N0cmluZyB8IEVsZW1lbnQgfCBvYmplY3R9IFRoZSBjdXJyZW50IGlnbm9yZUZyb20gdmFsdWUgb3IgdGhpc1xuICAgKiBJbnRlcmFjdGFibGVcbiAgICovXG5cbiAgSW50ZXJhY3RhYmxlLnByb3RvdHlwZS5pZ25vcmVGcm9tID0gKDAsIF91dGlscy53YXJuT25jZSkoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2JhY2tDb21wYXRPcHRpb24oJ2lnbm9yZUZyb20nLCBuZXdWYWx1ZSk7XG4gIH0sICdJbnRlcmFjdGFibGUuaWdub3JlRnJvbSgpIGhhcyBiZWVuIGRlcHJlY2F0ZWQuIFVzZSBJbnRlcmFjdGJsZS5kcmFnZ2FibGUoe2lnbm9yZUZyb206IG5ld1ZhbHVlfSkuJyk7XG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZFxuICAgKlxuICAgKiBBIGRyYWcvcmVzaXplL2dlc3R1cmUgaXMgc3RhcnRlZCBvbmx5IElmIHRoZSB0YXJnZXQgb2YgdGhlIGBtb3VzZWRvd25gLFxuICAgKiBgcG9pbnRlcmRvd25gIG9yIGB0b3VjaHN0YXJ0YCBldmVudCBvciBhbnkgb2YgaXQncyBwYXJlbnRzIG1hdGNoIHRoZSBnaXZlblxuICAgKiBDU1Mgc2VsZWN0b3Igb3IgRWxlbWVudC5cbiAgICpcbiAgICogRG9uJ3QgdXNlIHRoaXMgbWV0aG9kLiBJbnN0ZWFkIHNldCB0aGUgYGFsbG93RnJvbWAgb3B0aW9uIGZvciBlYWNoIGFjdGlvblxuICAgKiBvciBmb3IgYHBvaW50ZXJFdmVudHNgXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGludGVyYWN0KHRhcmdldHQpXG4gICAqICAgLnJlc2l6YWJsZSh7XG4gICAqICAgICBhbGxvd0Zyb206ICcucmVzaXplLWhhbmRsZScsXG4gICAqICAgLnBvaW50ZXJFdmVudHMoe1xuICAgKiAgICAgYWxsb3dGcm9tOiAnLmhhbmRsZScsLFxuICAgKiAgIH0pXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgRWxlbWVudCB8IG51bGx9IFtuZXdWYWx1ZV0gYSBDU1Mgc2VsZWN0b3Igc3RyaW5nLCBhblxuICAgKiBFbGVtZW50IG9yIGBudWxsYCB0byBhbGxvdyBmcm9tIGFueSBlbGVtZW50XG4gICAqIEByZXR1cm4ge3N0cmluZyB8IEVsZW1lbnQgfCBvYmplY3R9IFRoZSBjdXJyZW50IGFsbG93RnJvbSB2YWx1ZSBvciB0aGlzXG4gICAqIEludGVyYWN0YWJsZVxuICAgKi9cblxuICBJbnRlcmFjdGFibGUucHJvdG90eXBlLmFsbG93RnJvbSA9ICgwLCBfdXRpbHMud2Fybk9uY2UpKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLl9iYWNrQ29tcGF0T3B0aW9uKCdhbGxvd0Zyb20nLCBuZXdWYWx1ZSk7XG4gIH0sICdJbnRlcmFjdGFibGUuYWxsb3dGcm9tKCkgaGFzIGJlZW4gZGVwcmVjYXRlZC4gVXNlIEludGVyYWN0YmxlLmRyYWdnYWJsZSh7YWxsb3dGcm9tOiBuZXdWYWx1ZX0pLicpO1xuICAvKipcbiAgICogYGBganNcbiAgICogaW50ZXJhY3QoJy5yZXNpemUtZHJhZycpXG4gICAqICAgLnJlc2l6YWJsZSh0cnVlKVxuICAgKiAgIC5kcmFnZ2FibGUodHJ1ZSlcbiAgICogICAuYWN0aW9uQ2hlY2tlcihmdW5jdGlvbiAocG9pbnRlciwgZXZlbnQsIGFjdGlvbiwgaW50ZXJhY3RhYmxlLCBlbGVtZW50LCBpbnRlcmFjdGlvbikge1xuICAgKlxuICAgKiAgIGlmIChpbnRlcmFjdC5tYXRjaGVzU2VsZWN0b3IoZXZlbnQudGFyZ2V0LCAnLmRyYWctaGFuZGxlJykge1xuICAgKiAgICAgLy8gZm9yY2UgZHJhZyB3aXRoIGhhbmRsZSB0YXJnZXRcbiAgICogICAgIGFjdGlvbi5uYW1lID0gZHJhZ1xuICAgKiAgIH1cbiAgICogICBlbHNlIHtcbiAgICogICAgIC8vIHJlc2l6ZSBmcm9tIHRoZSB0b3AgYW5kIHJpZ2h0IGVkZ2VzXG4gICAqICAgICBhY3Rpb24ubmFtZSAgPSAncmVzaXplJ1xuICAgKiAgICAgYWN0aW9uLmVkZ2VzID0geyB0b3A6IHRydWUsIHJpZ2h0OiB0cnVlIH1cbiAgICogICB9XG4gICAqXG4gICAqICAgcmV0dXJuIGFjdGlvblxuICAgKiB9KVxuICAgKiBgYGBcbiAgICpcbiAgICogR2V0cyBvciBzZXRzIHRoZSBmdW5jdGlvbiB1c2VkIHRvIGNoZWNrIGFjdGlvbiB0byBiZSBwZXJmb3JtZWQgb25cbiAgICogcG9pbnRlckRvd25cbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbiB8IG51bGx9IFtjaGVja2VyXSBBIGZ1bmN0aW9uIHdoaWNoIHRha2VzIGEgcG9pbnRlciBldmVudCxcbiAgICogZGVmYXVsdEFjdGlvbiBzdHJpbmcsIGludGVyYWN0YWJsZSwgZWxlbWVudCBhbmQgaW50ZXJhY3Rpb24gYXMgcGFyYW1ldGVyc1xuICAgKiBhbmQgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCBuYW1lIHByb3BlcnR5ICdkcmFnJyAncmVzaXplJyBvciAnZ2VzdHVyZScgYW5kXG4gICAqIG9wdGlvbmFsbHkgYW4gYGVkZ2VzYCBvYmplY3Qgd2l0aCBib29sZWFuICd0b3AnLCAnbGVmdCcsICdib3R0b20nIGFuZCByaWdodFxuICAgKiBwcm9wcy5cbiAgICogQHJldHVybiB7RnVuY3Rpb24gfCBJbnRlcmFjdGFibGV9IFRoZSBjaGVja2VyIGZ1bmN0aW9uIG9yIHRoaXMgSW50ZXJhY3RhYmxlXG4gICAqL1xuXG4gIEludGVyYWN0YWJsZS5wcm90b3R5cGUuYWN0aW9uQ2hlY2tlciA9IGFjdGlvbkNoZWNrZXI7XG4gIC8qKlxuICAgKiBSZXR1cm5zIG9yIHNldHMgd2hldGhlciB0aGUgdGhlIGN1cnNvciBzaG91bGQgYmUgY2hhbmdlZCBkZXBlbmRpbmcgb24gdGhlXG4gICAqIGFjdGlvbiB0aGF0IHdvdWxkIGJlIHBlcmZvcm1lZCBpZiB0aGUgbW91c2Ugd2VyZSBwcmVzc2VkIGFuZCBkcmFnZ2VkLlxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtuZXdWYWx1ZV1cbiAgICogQHJldHVybiB7Ym9vbGVhbiB8IEludGVyYWN0YWJsZX0gVGhlIGN1cnJlbnQgc2V0dGluZyBvciB0aGlzIEludGVyYWN0YWJsZVxuICAgKi9cblxuICBJbnRlcmFjdGFibGUucHJvdG90eXBlLnN0eWxlQ3Vyc29yID0gc3R5bGVDdXJzb3I7XG5cbiAgSW50ZXJhY3RhYmxlLnByb3RvdHlwZS5kZWZhdWx0QWN0aW9uQ2hlY2tlciA9IGZ1bmN0aW9uIChwb2ludGVyLCBldmVudCwgaW50ZXJhY3Rpb24sIGVsZW1lbnQpIHtcbiAgICByZXR1cm4gZGVmYXVsdEFjdGlvbkNoZWNrZXIodGhpcywgcG9pbnRlciwgZXZlbnQsIGludGVyYWN0aW9uLCBlbGVtZW50LCBhY3Rpb25zKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0QWN0aW9uKHBvaW50ZXIsIGV2ZW50LCBpbnRlcmFjdGlvbiwgZWxlbWVudCkge1xuICB2YXIgYWN0aW9uID0gdGhpcy5kZWZhdWx0QWN0aW9uQ2hlY2tlcihwb2ludGVyLCBldmVudCwgaW50ZXJhY3Rpb24sIGVsZW1lbnQpO1xuXG4gIGlmICh0aGlzLm9wdGlvbnMuYWN0aW9uQ2hlY2tlcikge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuYWN0aW9uQ2hlY2tlcihwb2ludGVyLCBldmVudCwgYWN0aW9uLCB0aGlzLCBlbGVtZW50LCBpbnRlcmFjdGlvbik7XG4gIH1cblxuICByZXR1cm4gYWN0aW9uO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0QWN0aW9uQ2hlY2tlcihpbnRlcmFjdGFibGUsIHBvaW50ZXIsIGV2ZW50LCBpbnRlcmFjdGlvbiwgZWxlbWVudCwgYWN0aW9ucykge1xuICB2YXIgcmVjdCA9IGludGVyYWN0YWJsZS5nZXRSZWN0KGVsZW1lbnQpO1xuICB2YXIgYnV0dG9ucyA9IGV2ZW50LmJ1dHRvbnMgfHwge1xuICAgIDA6IDEsXG4gICAgMTogNCxcbiAgICAzOiA4LFxuICAgIDQ6IDE2XG4gIH1bZXZlbnQuYnV0dG9uXTtcbiAgdmFyIGFjdGlvbiA9IG51bGw7XG5cbiAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFjdGlvbnMubmFtZXMubGVuZ3RoOyBfaSsrKSB7XG4gICAgdmFyIF9yZWY7XG5cbiAgICBfcmVmID0gYWN0aW9ucy5uYW1lc1tfaV07XG4gICAgdmFyIGFjdGlvbk5hbWUgPSBfcmVmO1xuXG4gICAgLy8gY2hlY2sgbW91c2VCdXR0b24gc2V0dGluZyBpZiB0aGUgcG9pbnRlciBpcyBkb3duXG4gICAgaWYgKGludGVyYWN0aW9uLnBvaW50ZXJJc0Rvd24gJiYgL21vdXNlfHBvaW50ZXIvLnRlc3QoaW50ZXJhY3Rpb24ucG9pbnRlclR5cGUpICYmIChidXR0b25zICYgaW50ZXJhY3RhYmxlLm9wdGlvbnNbYWN0aW9uTmFtZV0ubW91c2VCdXR0b25zKSA9PT0gMCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgYWN0aW9uID0gYWN0aW9uc1thY3Rpb25OYW1lXS5jaGVja2VyKHBvaW50ZXIsIGV2ZW50LCBpbnRlcmFjdGFibGUsIGVsZW1lbnQsIGludGVyYWN0aW9uLCByZWN0KTtcblxuICAgIGlmIChhY3Rpb24pIHtcbiAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHN0eWxlQ3Vyc29yKG5ld1ZhbHVlKSB7XG4gIGlmIChpcy5ib29sKG5ld1ZhbHVlKSkge1xuICAgIHRoaXMub3B0aW9ucy5zdHlsZUN1cnNvciA9IG5ld1ZhbHVlO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgaWYgKG5ld1ZhbHVlID09PSBudWxsKSB7XG4gICAgZGVsZXRlIHRoaXMub3B0aW9ucy5zdHlsZUN1cnNvcjtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJldHVybiB0aGlzLm9wdGlvbnMuc3R5bGVDdXJzb3I7XG59XG5cbmZ1bmN0aW9uIGFjdGlvbkNoZWNrZXIoY2hlY2tlcikge1xuICBpZiAoaXMuZnVuYyhjaGVja2VyKSkge1xuICAgIHRoaXMub3B0aW9ucy5hY3Rpb25DaGVja2VyID0gY2hlY2tlcjtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGlmIChjaGVja2VyID09PSBudWxsKSB7XG4gICAgZGVsZXRlIHRoaXMub3B0aW9ucy5hY3Rpb25DaGVja2VyO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMub3B0aW9ucy5hY3Rpb25DaGVja2VyO1xufVxuXG52YXIgX2RlZmF1bHQgPSB7XG4gIGlkOiAnYXV0by1zdGFydC9pbnRlcmFjdGFibGVNZXRob2RzJyxcbiAgaW5zdGFsbDogaW5zdGFsbFxufTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5cbn0se1wiQGludGVyYWN0anMvdXRpbHNcIjo1NSxcIkBpbnRlcmFjdGpzL3V0aWxzL2lzXCI6NTZ9XSw5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciB1dGlscyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy91dGlsc1wiKSk7XG5cbnZhciBfSW50ZXJhY3RhYmxlTWV0aG9kcyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vSW50ZXJhY3RhYmxlTWV0aG9kc1wiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7IHZhciBkZXNjID0gT2JqZWN0LmRlZmluZVByb3BlcnR5ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KSA6IHt9OyBpZiAoZGVzYy5nZXQgfHwgZGVzYy5zZXQpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5ld09iaiwga2V5LCBkZXNjKTsgfSBlbHNlIHsgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IH0gfSBuZXdPYmpbXCJkZWZhdWx0XCJdID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblxuZnVuY3Rpb24gaW5zdGFsbChzY29wZSkge1xuICB2YXIgaW50ZXJhY3QgPSBzY29wZS5pbnRlcmFjdCxcbiAgICAgIGludGVyYWN0aW9ucyA9IHNjb3BlLmludGVyYWN0aW9ucyxcbiAgICAgIGRlZmF1bHRzID0gc2NvcGUuZGVmYXVsdHM7XG4gIHNjb3BlLnVzZVBsdWdpbihfSW50ZXJhY3RhYmxlTWV0aG9kc1tcImRlZmF1bHRcIl0pOyAvLyBzZXQgY3Vyc29yIHN0eWxlIG9uIG1vdXNlZG93blxuXG4gIGludGVyYWN0aW9ucy5zaWduYWxzLm9uKCdkb3duJywgZnVuY3Rpb24gKF9yZWYpIHtcbiAgICB2YXIgaW50ZXJhY3Rpb24gPSBfcmVmLmludGVyYWN0aW9uLFxuICAgICAgICBwb2ludGVyID0gX3JlZi5wb2ludGVyLFxuICAgICAgICBldmVudCA9IF9yZWYuZXZlbnQsXG4gICAgICAgIGV2ZW50VGFyZ2V0ID0gX3JlZi5ldmVudFRhcmdldDtcblxuICAgIGlmIChpbnRlcmFjdGlvbi5pbnRlcmFjdGluZygpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGFjdGlvbkluZm8gPSBnZXRBY3Rpb25JbmZvKGludGVyYWN0aW9uLCBwb2ludGVyLCBldmVudCwgZXZlbnRUYXJnZXQsIHNjb3BlKTtcbiAgICBwcmVwYXJlKGludGVyYWN0aW9uLCBhY3Rpb25JbmZvLCBzY29wZSk7XG4gIH0pOyAvLyBzZXQgY3Vyc29yIHN0eWxlIG9uIG1vdXNlbW92ZVxuXG4gIGludGVyYWN0aW9ucy5zaWduYWxzLm9uKCdtb3ZlJywgZnVuY3Rpb24gKF9yZWYyKSB7XG4gICAgdmFyIGludGVyYWN0aW9uID0gX3JlZjIuaW50ZXJhY3Rpb24sXG4gICAgICAgIHBvaW50ZXIgPSBfcmVmMi5wb2ludGVyLFxuICAgICAgICBldmVudCA9IF9yZWYyLmV2ZW50LFxuICAgICAgICBldmVudFRhcmdldCA9IF9yZWYyLmV2ZW50VGFyZ2V0O1xuXG4gICAgaWYgKGludGVyYWN0aW9uLnBvaW50ZXJUeXBlICE9PSAnbW91c2UnIHx8IGludGVyYWN0aW9uLnBvaW50ZXJJc0Rvd24gfHwgaW50ZXJhY3Rpb24uaW50ZXJhY3RpbmcoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBhY3Rpb25JbmZvID0gZ2V0QWN0aW9uSW5mbyhpbnRlcmFjdGlvbiwgcG9pbnRlciwgZXZlbnQsIGV2ZW50VGFyZ2V0LCBzY29wZSk7XG4gICAgcHJlcGFyZShpbnRlcmFjdGlvbiwgYWN0aW9uSW5mbywgc2NvcGUpO1xuICB9KTtcbiAgaW50ZXJhY3Rpb25zLnNpZ25hbHMub24oJ21vdmUnLCBmdW5jdGlvbiAoYXJnKSB7XG4gICAgdmFyIGludGVyYWN0aW9uID0gYXJnLmludGVyYWN0aW9uO1xuXG4gICAgaWYgKCFpbnRlcmFjdGlvbi5wb2ludGVySXNEb3duIHx8IGludGVyYWN0aW9uLmludGVyYWN0aW5nKCkgfHwgIWludGVyYWN0aW9uLnBvaW50ZXJXYXNNb3ZlZCB8fCAhaW50ZXJhY3Rpb24ucHJlcGFyZWQubmFtZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHNjb3BlLmF1dG9TdGFydC5zaWduYWxzLmZpcmUoJ2JlZm9yZS1zdGFydCcsIGFyZyk7XG4gICAgdmFyIGludGVyYWN0YWJsZSA9IGludGVyYWN0aW9uLmludGVyYWN0YWJsZTtcblxuICAgIGlmIChpbnRlcmFjdGlvbi5wcmVwYXJlZC5uYW1lICYmIGludGVyYWN0YWJsZSkge1xuICAgICAgLy8gY2hlY2sgbWFudWFsU3RhcnQgYW5kIGludGVyYWN0aW9uIGxpbWl0XG4gICAgICBpZiAoaW50ZXJhY3RhYmxlLm9wdGlvbnNbaW50ZXJhY3Rpb24ucHJlcGFyZWQubmFtZV0ubWFudWFsU3RhcnQgfHwgIXdpdGhpbkludGVyYWN0aW9uTGltaXQoaW50ZXJhY3RhYmxlLCBpbnRlcmFjdGlvbi5lbGVtZW50LCBpbnRlcmFjdGlvbi5wcmVwYXJlZCwgc2NvcGUpKSB7XG4gICAgICAgIGludGVyYWN0aW9uLnN0b3AoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGludGVyYWN0aW9uLnN0YXJ0KGludGVyYWN0aW9uLnByZXBhcmVkLCBpbnRlcmFjdGFibGUsIGludGVyYWN0aW9uLmVsZW1lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIGludGVyYWN0aW9ucy5zaWduYWxzLm9uKCdzdG9wJywgZnVuY3Rpb24gKF9yZWYzKSB7XG4gICAgdmFyIGludGVyYWN0aW9uID0gX3JlZjMuaW50ZXJhY3Rpb247XG4gICAgdmFyIGludGVyYWN0YWJsZSA9IGludGVyYWN0aW9uLmludGVyYWN0YWJsZTtcblxuICAgIGlmIChpbnRlcmFjdGFibGUgJiYgaW50ZXJhY3RhYmxlLm9wdGlvbnMuc3R5bGVDdXJzb3IpIHtcbiAgICAgIHNldEN1cnNvcihpbnRlcmFjdGlvbi5lbGVtZW50LCAnJywgc2NvcGUpO1xuICAgIH1cbiAgfSk7XG4gIGRlZmF1bHRzLmJhc2UuYWN0aW9uQ2hlY2tlciA9IG51bGw7XG4gIGRlZmF1bHRzLmJhc2Uuc3R5bGVDdXJzb3IgPSB0cnVlO1xuICB1dGlscy5leHRlbmQoZGVmYXVsdHMucGVyQWN0aW9uLCB7XG4gICAgbWFudWFsU3RhcnQ6IGZhbHNlLFxuICAgIG1heDogSW5maW5pdHksXG4gICAgbWF4UGVyRWxlbWVudDogMSxcbiAgICBhbGxvd0Zyb206IG51bGwsXG4gICAgaWdub3JlRnJvbTogbnVsbCxcbiAgICAvLyBvbmx5IGFsbG93IGxlZnQgYnV0dG9uIGJ5IGRlZmF1bHRcbiAgICAvLyBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL01vdXNlRXZlbnQvYnV0dG9ucyNSZXR1cm5fdmFsdWVcbiAgICBtb3VzZUJ1dHRvbnM6IDFcbiAgfSk7XG4gIC8qKlxuICAgKiBSZXR1cm5zIG9yIHNldHMgdGhlIG1heGltdW0gbnVtYmVyIG9mIGNvbmN1cnJlbnQgaW50ZXJhY3Rpb25zIGFsbG93ZWQuICBCeVxuICAgKiBkZWZhdWx0IG9ubHkgMSBpbnRlcmFjdGlvbiBpcyBhbGxvd2VkIGF0IGEgdGltZSAoZm9yIGJhY2t3YXJkc1xuICAgKiBjb21wYXRpYmlsaXR5KS4gVG8gYWxsb3cgbXVsdGlwbGUgaW50ZXJhY3Rpb25zIG9uIHRoZSBzYW1lIEludGVyYWN0YWJsZXMgYW5kXG4gICAqIGVsZW1lbnRzLCB5b3UgbmVlZCB0byBlbmFibGUgaXQgaW4gdGhlIGRyYWdnYWJsZSwgcmVzaXphYmxlIGFuZCBnZXN0dXJhYmxlXG4gICAqIGAnbWF4J2AgYW5kIGAnbWF4UGVyRWxlbWVudCdgIG9wdGlvbnMuXG4gICAqXG4gICAqIEBhbGlhcyBtb2R1bGU6aW50ZXJhY3QubWF4SW50ZXJhY3Rpb25zXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbbmV3VmFsdWVdIEFueSBudW1iZXIuIG5ld1ZhbHVlIDw9IDAgbWVhbnMgbm8gaW50ZXJhY3Rpb25zLlxuICAgKi9cblxuICBpbnRlcmFjdC5tYXhJbnRlcmFjdGlvbnMgPSBmdW5jdGlvbiAobmV3VmFsdWUpIHtcbiAgICByZXR1cm4gbWF4SW50ZXJhY3Rpb25zKG5ld1ZhbHVlLCBzY29wZSk7XG4gIH07XG5cbiAgc2NvcGUuYXV0b1N0YXJ0ID0ge1xuICAgIC8vIEFsbG93IHRoaXMgbWFueSBpbnRlcmFjdGlvbnMgdG8gaGFwcGVuIHNpbXVsdGFuZW91c2x5XG4gICAgbWF4SW50ZXJhY3Rpb25zOiBJbmZpbml0eSxcbiAgICB3aXRoaW5JbnRlcmFjdGlvbkxpbWl0OiB3aXRoaW5JbnRlcmFjdGlvbkxpbWl0LFxuICAgIGN1cnNvckVsZW1lbnQ6IG51bGwsXG4gICAgc2lnbmFsczogbmV3IHV0aWxzLlNpZ25hbHMoKVxuICB9O1xufSAvLyBDaGVjayBpZiB0aGUgY3VycmVudCBpbnRlcmFjdGFibGUgc3VwcG9ydHMgdGhlIGFjdGlvbi5cbi8vIElmIHNvLCByZXR1cm4gdGhlIHZhbGlkYXRlZCBhY3Rpb24uIE90aGVyd2lzZSwgcmV0dXJuIG51bGxcblxuXG5mdW5jdGlvbiB2YWxpZGF0ZUFjdGlvbihhY3Rpb24sIGludGVyYWN0YWJsZSwgZWxlbWVudCwgZXZlbnRUYXJnZXQsIHNjb3BlKSB7XG4gIGlmIChpbnRlcmFjdGFibGUudGVzdElnbm9yZUFsbG93KGludGVyYWN0YWJsZS5vcHRpb25zW2FjdGlvbi5uYW1lXSwgZWxlbWVudCwgZXZlbnRUYXJnZXQpICYmIGludGVyYWN0YWJsZS5vcHRpb25zW2FjdGlvbi5uYW1lXS5lbmFibGVkICYmIHdpdGhpbkludGVyYWN0aW9uTGltaXQoaW50ZXJhY3RhYmxlLCBlbGVtZW50LCBhY3Rpb24sIHNjb3BlKSkge1xuICAgIHJldHVybiBhY3Rpb247XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVNYXRjaGVzKGludGVyYWN0aW9uLCBwb2ludGVyLCBldmVudCwgbWF0Y2hlcywgbWF0Y2hFbGVtZW50cywgZXZlbnRUYXJnZXQsIHNjb3BlKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBtYXRjaGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgdmFyIG1hdGNoID0gbWF0Y2hlc1tpXTtcbiAgICB2YXIgbWF0Y2hFbGVtZW50ID0gbWF0Y2hFbGVtZW50c1tpXTtcbiAgICB2YXIgbWF0Y2hBY3Rpb24gPSBtYXRjaC5nZXRBY3Rpb24ocG9pbnRlciwgZXZlbnQsIGludGVyYWN0aW9uLCBtYXRjaEVsZW1lbnQpO1xuXG4gICAgaWYgKCFtYXRjaEFjdGlvbikge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdmFyIGFjdGlvbiA9IHZhbGlkYXRlQWN0aW9uKG1hdGNoQWN0aW9uLCBtYXRjaCwgbWF0Y2hFbGVtZW50LCBldmVudFRhcmdldCwgc2NvcGUpO1xuXG4gICAgaWYgKGFjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgYWN0aW9uOiBhY3Rpb24sXG4gICAgICAgIGludGVyYWN0YWJsZTogbWF0Y2gsXG4gICAgICAgIGVsZW1lbnQ6IG1hdGNoRWxlbWVudFxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGFjdGlvbjogbnVsbCxcbiAgICBpbnRlcmFjdGFibGU6IG51bGwsXG4gICAgZWxlbWVudDogbnVsbFxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRBY3Rpb25JbmZvKGludGVyYWN0aW9uLCBwb2ludGVyLCBldmVudCwgZXZlbnRUYXJnZXQsIHNjb3BlKSB7XG4gIHZhciBtYXRjaGVzID0gW107XG4gIHZhciBtYXRjaEVsZW1lbnRzID0gW107XG4gIHZhciBlbGVtZW50ID0gZXZlbnRUYXJnZXQ7XG5cbiAgZnVuY3Rpb24gcHVzaE1hdGNoZXMoaW50ZXJhY3RhYmxlKSB7XG4gICAgbWF0Y2hlcy5wdXNoKGludGVyYWN0YWJsZSk7XG4gICAgbWF0Y2hFbGVtZW50cy5wdXNoKGVsZW1lbnQpO1xuICB9XG5cbiAgd2hpbGUgKHV0aWxzLmlzLmVsZW1lbnQoZWxlbWVudCkpIHtcbiAgICBtYXRjaGVzID0gW107XG4gICAgbWF0Y2hFbGVtZW50cyA9IFtdO1xuICAgIHNjb3BlLmludGVyYWN0YWJsZXMuZm9yRWFjaE1hdGNoKGVsZW1lbnQsIHB1c2hNYXRjaGVzKTtcbiAgICB2YXIgYWN0aW9uSW5mbyA9IHZhbGlkYXRlTWF0Y2hlcyhpbnRlcmFjdGlvbiwgcG9pbnRlciwgZXZlbnQsIG1hdGNoZXMsIG1hdGNoRWxlbWVudHMsIGV2ZW50VGFyZ2V0LCBzY29wZSk7XG5cbiAgICBpZiAoYWN0aW9uSW5mby5hY3Rpb24gJiYgIWFjdGlvbkluZm8uaW50ZXJhY3RhYmxlLm9wdGlvbnNbYWN0aW9uSW5mby5hY3Rpb24ubmFtZV0ubWFudWFsU3RhcnQpIHtcbiAgICAgIHJldHVybiBhY3Rpb25JbmZvO1xuICAgIH1cblxuICAgIGVsZW1lbnQgPSB1dGlscy5kb20ucGFyZW50Tm9kZShlbGVtZW50KTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgYWN0aW9uOiBudWxsLFxuICAgIGludGVyYWN0YWJsZTogbnVsbCxcbiAgICBlbGVtZW50OiBudWxsXG4gIH07XG59XG5cbmZ1bmN0aW9uIHByZXBhcmUoaW50ZXJhY3Rpb24sIF9yZWY0LCBzY29wZSkge1xuICB2YXIgYWN0aW9uID0gX3JlZjQuYWN0aW9uLFxuICAgICAgaW50ZXJhY3RhYmxlID0gX3JlZjQuaW50ZXJhY3RhYmxlLFxuICAgICAgZWxlbWVudCA9IF9yZWY0LmVsZW1lbnQ7XG4gIGFjdGlvbiA9IGFjdGlvbiB8fCB7fTtcblxuICBpZiAoaW50ZXJhY3Rpb24uaW50ZXJhY3RhYmxlICYmIGludGVyYWN0aW9uLmludGVyYWN0YWJsZS5vcHRpb25zLnN0eWxlQ3Vyc29yKSB7XG4gICAgc2V0Q3Vyc29yKGludGVyYWN0aW9uLmVsZW1lbnQsICcnLCBzY29wZSk7XG4gIH1cblxuICBpbnRlcmFjdGlvbi5pbnRlcmFjdGFibGUgPSBpbnRlcmFjdGFibGU7XG4gIGludGVyYWN0aW9uLmVsZW1lbnQgPSBlbGVtZW50O1xuICB1dGlscy5jb3B5QWN0aW9uKGludGVyYWN0aW9uLnByZXBhcmVkLCBhY3Rpb24pO1xuICBpbnRlcmFjdGlvbi5yZWN0ID0gaW50ZXJhY3RhYmxlICYmIGFjdGlvbi5uYW1lID8gaW50ZXJhY3RhYmxlLmdldFJlY3QoZWxlbWVudCkgOiBudWxsO1xuXG4gIGlmIChpbnRlcmFjdGFibGUgJiYgaW50ZXJhY3RhYmxlLm9wdGlvbnMuc3R5bGVDdXJzb3IpIHtcbiAgICB2YXIgY3Vyc29yID0gYWN0aW9uID8gc2NvcGUuYWN0aW9uc1thY3Rpb24ubmFtZV0uZ2V0Q3Vyc29yKGFjdGlvbikgOiAnJztcbiAgICBzZXRDdXJzb3IoaW50ZXJhY3Rpb24uZWxlbWVudCwgY3Vyc29yLCBzY29wZSk7XG4gIH1cblxuICBzY29wZS5hdXRvU3RhcnQuc2lnbmFscy5maXJlKCdwcmVwYXJlZCcsIHtcbiAgICBpbnRlcmFjdGlvbjogaW50ZXJhY3Rpb25cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHdpdGhpbkludGVyYWN0aW9uTGltaXQoaW50ZXJhY3RhYmxlLCBlbGVtZW50LCBhY3Rpb24sIHNjb3BlKSB7XG4gIHZhciBvcHRpb25zID0gaW50ZXJhY3RhYmxlLm9wdGlvbnM7XG4gIHZhciBtYXhBY3Rpb25zID0gb3B0aW9uc1thY3Rpb24ubmFtZV0ubWF4O1xuICB2YXIgbWF4UGVyRWxlbWVudCA9IG9wdGlvbnNbYWN0aW9uLm5hbWVdLm1heFBlckVsZW1lbnQ7XG4gIHZhciBhdXRvU3RhcnRNYXggPSBzY29wZS5hdXRvU3RhcnQubWF4SW50ZXJhY3Rpb25zO1xuICB2YXIgYWN0aXZlSW50ZXJhY3Rpb25zID0gMDtcbiAgdmFyIGludGVyYWN0YWJsZUNvdW50ID0gMDtcbiAgdmFyIGVsZW1lbnRDb3VudCA9IDA7IC8vIG5vIGFjdGlvbnMgaWYgYW55IG9mIHRoZXNlIHZhbHVlcyA9PSAwXG5cbiAgaWYgKCEobWF4QWN0aW9ucyAmJiBtYXhQZXJFbGVtZW50ICYmIGF1dG9TdGFydE1heCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgc2NvcGUuaW50ZXJhY3Rpb25zLmxpc3QubGVuZ3RoOyBfaSsrKSB7XG4gICAgdmFyIF9yZWY1O1xuXG4gICAgX3JlZjUgPSBzY29wZS5pbnRlcmFjdGlvbnMubGlzdFtfaV07XG4gICAgdmFyIGludGVyYWN0aW9uID0gX3JlZjU7XG4gICAgdmFyIG90aGVyQWN0aW9uID0gaW50ZXJhY3Rpb24ucHJlcGFyZWQubmFtZTtcblxuICAgIGlmICghaW50ZXJhY3Rpb24uaW50ZXJhY3RpbmcoKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgYWN0aXZlSW50ZXJhY3Rpb25zKys7XG5cbiAgICBpZiAoYWN0aXZlSW50ZXJhY3Rpb25zID49IGF1dG9TdGFydE1heCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChpbnRlcmFjdGlvbi5pbnRlcmFjdGFibGUgIT09IGludGVyYWN0YWJsZSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaW50ZXJhY3RhYmxlQ291bnQgKz0gb3RoZXJBY3Rpb24gPT09IGFjdGlvbi5uYW1lID8gMSA6IDA7XG5cbiAgICBpZiAoaW50ZXJhY3RhYmxlQ291bnQgPj0gbWF4QWN0aW9ucykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChpbnRlcmFjdGlvbi5lbGVtZW50ID09PSBlbGVtZW50KSB7XG4gICAgICBlbGVtZW50Q291bnQrKztcblxuICAgICAgaWYgKG90aGVyQWN0aW9uID09PSBhY3Rpb24ubmFtZSAmJiBlbGVtZW50Q291bnQgPj0gbWF4UGVyRWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGF1dG9TdGFydE1heCA+IDA7XG59XG5cbmZ1bmN0aW9uIG1heEludGVyYWN0aW9ucyhuZXdWYWx1ZSwgc2NvcGUpIHtcbiAgaWYgKHV0aWxzLmlzLm51bWJlcihuZXdWYWx1ZSkpIHtcbiAgICBzY29wZS5hdXRvU3RhcnQubWF4SW50ZXJhY3Rpb25zID0gbmV3VmFsdWU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZXR1cm4gc2NvcGUuYXV0b1N0YXJ0Lm1heEludGVyYWN0aW9ucztcbn1cblxuZnVuY3Rpb24gc2V0Q3Vyc29yKGVsZW1lbnQsIGN1cnNvciwgc2NvcGUpIHtcbiAgaWYgKHNjb3BlLmF1dG9TdGFydC5jdXJzb3JFbGVtZW50KSB7XG4gICAgc2NvcGUuYXV0b1N0YXJ0LmN1cnNvckVsZW1lbnQuc3R5bGUuY3Vyc29yID0gJyc7XG4gIH1cblxuICBlbGVtZW50Lm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLmN1cnNvciA9IGN1cnNvcjtcbiAgZWxlbWVudC5zdHlsZS5jdXJzb3IgPSBjdXJzb3I7XG4gIHNjb3BlLmF1dG9TdGFydC5jdXJzb3JFbGVtZW50ID0gY3Vyc29yID8gZWxlbWVudCA6IG51bGw7XG59XG5cbnZhciBfZGVmYXVsdCA9IHtcbiAgaWQ6ICdhdXRvLXN0YXJ0L2Jhc2UnLFxuICBpbnN0YWxsOiBpbnN0YWxsLFxuICBtYXhJbnRlcmFjdGlvbnM6IG1heEludGVyYWN0aW9ucyxcbiAgd2l0aGluSW50ZXJhY3Rpb25MaW1pdDogd2l0aGluSW50ZXJhY3Rpb25MaW1pdCxcbiAgdmFsaWRhdGVBY3Rpb246IHZhbGlkYXRlQWN0aW9uXG59O1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBfZGVmYXVsdDtcblxufSx7XCIuL0ludGVyYWN0YWJsZU1ldGhvZHNcIjo4LFwiQGludGVyYWN0anMvdXRpbHNcIjo1NX1dLDEwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciBfc2NvcGUgPSByZXF1aXJlKFwiQGludGVyYWN0anMvY29yZS9zY29wZVwiKTtcblxudmFyIF9kb21VdGlscyA9IHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy91dGlscy9kb21VdGlsc1wiKTtcblxudmFyIGlzID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQocmVxdWlyZShcIkBpbnRlcmFjdGpzL3V0aWxzL2lzXCIpKTtcblxudmFyIF9iYXNlID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9iYXNlXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHsgdmFyIGRlc2MgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkgJiYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBrZXkpIDoge307IGlmIChkZXNjLmdldCB8fCBkZXNjLnNldCkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkobmV3T2JqLCBrZXksIGRlc2MpOyB9IGVsc2UgeyBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gfSB9IG5ld09ialtcImRlZmF1bHRcIl0gPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXG5mdW5jdGlvbiBpbnN0YWxsKHNjb3BlKSB7XG4gIHNjb3BlLmF1dG9TdGFydC5zaWduYWxzLm9uKCdiZWZvcmUtc3RhcnQnLCBmdW5jdGlvbiAoX3JlZikge1xuICAgIHZhciBpbnRlcmFjdGlvbiA9IF9yZWYuaW50ZXJhY3Rpb24sXG4gICAgICAgIGV2ZW50VGFyZ2V0ID0gX3JlZi5ldmVudFRhcmdldCxcbiAgICAgICAgZHggPSBfcmVmLmR4LFxuICAgICAgICBkeSA9IF9yZWYuZHk7XG5cbiAgICBpZiAoaW50ZXJhY3Rpb24ucHJlcGFyZWQubmFtZSAhPT0gJ2RyYWcnKSB7XG4gICAgICByZXR1cm47XG4gICAgfSAvLyBjaGVjayBpZiBhIGRyYWcgaXMgaW4gdGhlIGNvcnJlY3QgYXhpc1xuXG5cbiAgICB2YXIgYWJzWCA9IE1hdGguYWJzKGR4KTtcbiAgICB2YXIgYWJzWSA9IE1hdGguYWJzKGR5KTtcbiAgICB2YXIgdGFyZ2V0T3B0aW9ucyA9IGludGVyYWN0aW9uLmludGVyYWN0YWJsZS5vcHRpb25zLmRyYWc7XG4gICAgdmFyIHN0YXJ0QXhpcyA9IHRhcmdldE9wdGlvbnMuc3RhcnRBeGlzO1xuICAgIHZhciBjdXJyZW50QXhpcyA9IGFic1ggPiBhYnNZID8gJ3gnIDogYWJzWCA8IGFic1kgPyAneScgOiAneHknO1xuICAgIGludGVyYWN0aW9uLnByZXBhcmVkLmF4aXMgPSB0YXJnZXRPcHRpb25zLmxvY2tBeGlzID09PSAnc3RhcnQnID8gY3VycmVudEF4aXNbMF0gLy8gYWx3YXlzIGxvY2sgdG8gb25lIGF4aXMgZXZlbiBpZiBjdXJyZW50QXhpcyA9PT0gJ3h5J1xuICAgIDogdGFyZ2V0T3B0aW9ucy5sb2NrQXhpczsgLy8gaWYgdGhlIG1vdmVtZW50IGlzbid0IGluIHRoZSBzdGFydEF4aXMgb2YgdGhlIGludGVyYWN0YWJsZVxuXG4gICAgaWYgKGN1cnJlbnRBeGlzICE9PSAneHknICYmIHN0YXJ0QXhpcyAhPT0gJ3h5JyAmJiBzdGFydEF4aXMgIT09IGN1cnJlbnRBeGlzKSB7XG4gICAgICAvLyBjYW5jZWwgdGhlIHByZXBhcmVkIGFjdGlvblxuICAgICAgaW50ZXJhY3Rpb24ucHJlcGFyZWQubmFtZSA9IG51bGw7IC8vIHRoZW4gdHJ5IHRvIGdldCBhIGRyYWcgZnJvbSBhbm90aGVyIGluZXJhY3RhYmxlXG5cbiAgICAgIHZhciBlbGVtZW50ID0gZXZlbnRUYXJnZXQ7XG5cbiAgICAgIHZhciBnZXREcmFnZ2FibGUgPSBmdW5jdGlvbiBnZXREcmFnZ2FibGUoaW50ZXJhY3RhYmxlKSB7XG4gICAgICAgIGlmIChpbnRlcmFjdGFibGUgPT09IGludGVyYWN0aW9uLmludGVyYWN0YWJsZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBvcHRpb25zID0gaW50ZXJhY3Rpb24uaW50ZXJhY3RhYmxlLm9wdGlvbnMuZHJhZztcblxuICAgICAgICBpZiAoIW9wdGlvbnMubWFudWFsU3RhcnQgJiYgaW50ZXJhY3RhYmxlLnRlc3RJZ25vcmVBbGxvdyhvcHRpb25zLCBlbGVtZW50LCBldmVudFRhcmdldCkpIHtcbiAgICAgICAgICB2YXIgYWN0aW9uID0gaW50ZXJhY3RhYmxlLmdldEFjdGlvbihpbnRlcmFjdGlvbi5kb3duUG9pbnRlciwgaW50ZXJhY3Rpb24uZG93bkV2ZW50LCBpbnRlcmFjdGlvbiwgZWxlbWVudCk7XG5cbiAgICAgICAgICBpZiAoYWN0aW9uICYmIGFjdGlvbi5uYW1lID09PSBfc2NvcGUuQWN0aW9uTmFtZS5EcmFnICYmIGNoZWNrU3RhcnRBeGlzKGN1cnJlbnRBeGlzLCBpbnRlcmFjdGFibGUpICYmIF9iYXNlW1wiZGVmYXVsdFwiXS52YWxpZGF0ZUFjdGlvbihhY3Rpb24sIGludGVyYWN0YWJsZSwgZWxlbWVudCwgZXZlbnRUYXJnZXQsIHNjb3BlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGludGVyYWN0YWJsZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07IC8vIGNoZWNrIGFsbCBpbnRlcmFjdGFibGVzXG5cblxuICAgICAgd2hpbGUgKGlzLmVsZW1lbnQoZWxlbWVudCkpIHtcbiAgICAgICAgdmFyIGludGVyYWN0YWJsZSA9IHNjb3BlLmludGVyYWN0YWJsZXMuZm9yRWFjaE1hdGNoKGVsZW1lbnQsIGdldERyYWdnYWJsZSk7XG5cbiAgICAgICAgaWYgKGludGVyYWN0YWJsZSkge1xuICAgICAgICAgIGludGVyYWN0aW9uLnByZXBhcmVkLm5hbWUgPSBfc2NvcGUuQWN0aW9uTmFtZS5EcmFnO1xuICAgICAgICAgIGludGVyYWN0aW9uLmludGVyYWN0YWJsZSA9IGludGVyYWN0YWJsZTtcbiAgICAgICAgICBpbnRlcmFjdGlvbi5lbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGVsZW1lbnQgPSAoMCwgX2RvbVV0aWxzLnBhcmVudE5vZGUpKGVsZW1lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgZnVuY3Rpb24gY2hlY2tTdGFydEF4aXMoc3RhcnRBeGlzLCBpbnRlcmFjdGFibGUpIHtcbiAgICBpZiAoIWludGVyYWN0YWJsZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciB0aGlzQXhpcyA9IGludGVyYWN0YWJsZS5vcHRpb25zW19zY29wZS5BY3Rpb25OYW1lLkRyYWddLnN0YXJ0QXhpcztcbiAgICByZXR1cm4gc3RhcnRBeGlzID09PSAneHknIHx8IHRoaXNBeGlzID09PSAneHknIHx8IHRoaXNBeGlzID09PSBzdGFydEF4aXM7XG4gIH1cbn1cblxudmFyIF9kZWZhdWx0ID0ge1xuICBpZDogJ2F1dG8tc3RhcnQvZHJhZ0F4aXMnLFxuICBpbnN0YWxsOiBpbnN0YWxsXG59O1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBfZGVmYXVsdDtcblxufSx7XCIuL2Jhc2VcIjo5LFwiQGludGVyYWN0anMvY29yZS9zY29wZVwiOjI0LFwiQGludGVyYWN0anMvdXRpbHMvZG9tVXRpbHNcIjo1MCxcIkBpbnRlcmFjdGpzL3V0aWxzL2lzXCI6NTZ9XSwxMTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX2Jhc2UgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL2Jhc2VcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gaW5zdGFsbChzY29wZSkge1xuICB2YXIgYXV0b1N0YXJ0ID0gc2NvcGUuYXV0b1N0YXJ0LFxuICAgICAgaW50ZXJhY3Rpb25zID0gc2NvcGUuaW50ZXJhY3Rpb25zLFxuICAgICAgZGVmYXVsdHMgPSBzY29wZS5kZWZhdWx0cztcbiAgc2NvcGUudXNlUGx1Z2luKF9iYXNlW1wiZGVmYXVsdFwiXSk7XG4gIGRlZmF1bHRzLnBlckFjdGlvbi5ob2xkID0gMDtcbiAgZGVmYXVsdHMucGVyQWN0aW9uLmRlbGF5ID0gMDtcbiAgaW50ZXJhY3Rpb25zLnNpZ25hbHMub24oJ25ldycsIGZ1bmN0aW9uIChpbnRlcmFjdGlvbikge1xuICAgIGludGVyYWN0aW9uLmF1dG9TdGFydEhvbGRUaW1lciA9IG51bGw7XG4gIH0pO1xuICBhdXRvU3RhcnQuc2lnbmFscy5vbigncHJlcGFyZWQnLCBmdW5jdGlvbiAoX3JlZikge1xuICAgIHZhciBpbnRlcmFjdGlvbiA9IF9yZWYuaW50ZXJhY3Rpb247XG4gICAgdmFyIGhvbGQgPSBnZXRIb2xkRHVyYXRpb24oaW50ZXJhY3Rpb24pO1xuXG4gICAgaWYgKGhvbGQgPiAwKSB7XG4gICAgICBpbnRlcmFjdGlvbi5hdXRvU3RhcnRIb2xkVGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaW50ZXJhY3Rpb24uc3RhcnQoaW50ZXJhY3Rpb24ucHJlcGFyZWQsIGludGVyYWN0aW9uLmludGVyYWN0YWJsZSwgaW50ZXJhY3Rpb24uZWxlbWVudCk7XG4gICAgICB9LCBob2xkKTtcbiAgICB9XG4gIH0pO1xuICBpbnRlcmFjdGlvbnMuc2lnbmFscy5vbignbW92ZScsIGZ1bmN0aW9uIChfcmVmMikge1xuICAgIHZhciBpbnRlcmFjdGlvbiA9IF9yZWYyLmludGVyYWN0aW9uLFxuICAgICAgICBkdXBsaWNhdGUgPSBfcmVmMi5kdXBsaWNhdGU7XG5cbiAgICBpZiAoaW50ZXJhY3Rpb24ucG9pbnRlcldhc01vdmVkICYmICFkdXBsaWNhdGUpIHtcbiAgICAgIGNsZWFyVGltZW91dChpbnRlcmFjdGlvbi5hdXRvU3RhcnRIb2xkVGltZXIpO1xuICAgIH1cbiAgfSk7IC8vIHByZXZlbnQgcmVndWxhciBkb3duLT5tb3ZlIGF1dG9TdGFydFxuXG4gIGF1dG9TdGFydC5zaWduYWxzLm9uKCdiZWZvcmUtc3RhcnQnLCBmdW5jdGlvbiAoX3JlZjMpIHtcbiAgICB2YXIgaW50ZXJhY3Rpb24gPSBfcmVmMy5pbnRlcmFjdGlvbjtcbiAgICB2YXIgaG9sZCA9IGdldEhvbGREdXJhdGlvbihpbnRlcmFjdGlvbik7XG5cbiAgICBpZiAoaG9sZCA+IDApIHtcbiAgICAgIGludGVyYWN0aW9uLnByZXBhcmVkLm5hbWUgPSBudWxsO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldEhvbGREdXJhdGlvbihpbnRlcmFjdGlvbikge1xuICB2YXIgYWN0aW9uTmFtZSA9IGludGVyYWN0aW9uLnByZXBhcmVkICYmIGludGVyYWN0aW9uLnByZXBhcmVkLm5hbWU7XG5cbiAgaWYgKCFhY3Rpb25OYW1lKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2YXIgb3B0aW9ucyA9IGludGVyYWN0aW9uLmludGVyYWN0YWJsZS5vcHRpb25zO1xuICByZXR1cm4gb3B0aW9uc1thY3Rpb25OYW1lXS5ob2xkIHx8IG9wdGlvbnNbYWN0aW9uTmFtZV0uZGVsYXk7XG59XG5cbnZhciBfZGVmYXVsdCA9IHtcbiAgaWQ6ICdhdXRvLXN0YXJ0L2hvbGQnLFxuICBpbnN0YWxsOiBpbnN0YWxsLFxuICBnZXRIb2xkRHVyYXRpb246IGdldEhvbGREdXJhdGlvblxufTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5cbn0se1wiLi9iYXNlXCI6OX1dLDEyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5pbnN0YWxsID0gaW5zdGFsbDtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImF1dG9TdGFydFwiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfYmFzZVtcImRlZmF1bHRcIl07XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiZHJhZ0F4aXNcIiwge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2RyYWdBeGlzW1wiZGVmYXVsdFwiXTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJob2xkXCIsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9ob2xkW1wiZGVmYXVsdFwiXTtcbiAgfVxufSk7XG5leHBvcnRzLmlkID0gdm9pZCAwO1xuXG52YXIgX2Jhc2UgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL2Jhc2VcIikpO1xuXG52YXIgX2RyYWdBeGlzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9kcmFnQXhpc1wiKSk7XG5cbnZhciBfaG9sZCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vaG9sZFwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBpbnN0YWxsKHNjb3BlKSB7XG4gIHNjb3BlLnVzZVBsdWdpbihfYmFzZVtcImRlZmF1bHRcIl0pO1xuICBzY29wZS51c2VQbHVnaW4oX2hvbGRbXCJkZWZhdWx0XCJdKTtcbiAgc2NvcGUudXNlUGx1Z2luKF9kcmFnQXhpc1tcImRlZmF1bHRcIl0pO1xufVxuXG52YXIgaWQgPSAnYXV0by1zdGFydCc7XG5leHBvcnRzLmlkID0gaWQ7XG5cbn0se1wiLi9iYXNlXCI6OSxcIi4vZHJhZ0F4aXNcIjoxMCxcIi4vaG9sZFwiOjExfV0sMTM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGV4cG9ydHMuQmFzZUV2ZW50ID0gZXhwb3J0cy5FdmVudFBoYXNlID0gdm9pZCAwO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbnZhciBFdmVudFBoYXNlO1xuZXhwb3J0cy5FdmVudFBoYXNlID0gRXZlbnRQaGFzZTtcblxuKGZ1bmN0aW9uIChFdmVudFBoYXNlKSB7XG4gIEV2ZW50UGhhc2VbXCJTdGFydFwiXSA9IFwic3RhcnRcIjtcbiAgRXZlbnRQaGFzZVtcIk1vdmVcIl0gPSBcIm1vdmVcIjtcbiAgRXZlbnRQaGFzZVtcIkVuZFwiXSA9IFwiZW5kXCI7XG4gIEV2ZW50UGhhc2VbXCJfTk9ORVwiXSA9IFwiXCI7XG59KShFdmVudFBoYXNlIHx8IChleHBvcnRzLkV2ZW50UGhhc2UgPSBFdmVudFBoYXNlID0ge30pKTtcblxudmFyIEJhc2VFdmVudCA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEJhc2VFdmVudChpbnRlcmFjdGlvbikge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBCYXNlRXZlbnQpO1xuXG4gICAgdGhpcy5pbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQgPSBmYWxzZTtcbiAgICB0aGlzLnByb3BhZ2F0aW9uU3RvcHBlZCA9IGZhbHNlO1xuICAgIHRoaXMuX2ludGVyYWN0aW9uID0gaW50ZXJhY3Rpb247XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoQmFzZUV2ZW50LCBbe1xuICAgIGtleTogXCJwcmV2ZW50RGVmYXVsdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwcmV2ZW50RGVmYXVsdCgpIHt9XG4gICAgLyoqXG4gICAgICogRG9uJ3QgY2FsbCBhbnkgb3RoZXIgbGlzdGVuZXJzIChldmVuIG9uIHRoZSBjdXJyZW50IHRhcmdldClcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcInN0b3BQcm9wYWdhdGlvblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdG9wUHJvcGFnYXRpb24oKSB7XG4gICAgICB0aGlzLnByb3BhZ2F0aW9uU3RvcHBlZCA9IHRydWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIERvbid0IGNhbGwgbGlzdGVuZXJzIG9uIHRoZSByZW1haW5pbmcgdGFyZ2V0c1xuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwic3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpIHtcbiAgICAgIHRoaXMuaW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkID0gdGhpcy5wcm9wYWdhdGlvblN0b3BwZWQgPSB0cnVlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJpbnRlcmFjdGlvblwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2ludGVyYWN0aW9uLl9wcm94eTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gQmFzZUV2ZW50O1xufSgpO1xuXG5leHBvcnRzLkJhc2VFdmVudCA9IEJhc2VFdmVudDtcbnZhciBfZGVmYXVsdCA9IEJhc2VFdmVudDtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5cbn0se31dLDE0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciBhcnIgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChyZXF1aXJlKFwiQGludGVyYWN0anMvdXRpbHMvYXJyXCIpKTtcblxudmFyIF9leHRlbmQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy91dGlscy9leHRlbmRcIikpO1xuXG52YXIgX25vcm1hbGl6ZUxpc3RlbmVycyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIkBpbnRlcmFjdGpzL3V0aWxzL25vcm1hbGl6ZUxpc3RlbmVyc1wiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7IHZhciBkZXNjID0gT2JqZWN0LmRlZmluZVByb3BlcnR5ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KSA6IHt9OyBpZiAoZGVzYy5nZXQgfHwgZGVzYy5zZXQpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5ld09iaiwga2V5LCBkZXNjKTsgfSBlbHNlIHsgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IH0gfSBuZXdPYmpbXCJkZWZhdWx0XCJdID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG5mdW5jdGlvbiBmaXJlVW50aWxJbW1lZGlhdGVTdG9wcGVkKGV2ZW50LCBsaXN0ZW5lcnMpIHtcbiAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxpc3RlbmVycy5sZW5ndGg7IF9pKyspIHtcbiAgICB2YXIgX3JlZjtcblxuICAgIF9yZWYgPSBsaXN0ZW5lcnNbX2ldO1xuICAgIHZhciBsaXN0ZW5lciA9IF9yZWY7XG5cbiAgICBpZiAoZXZlbnQuaW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkKSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBsaXN0ZW5lcihldmVudCk7XG4gIH1cbn1cblxudmFyIEV2ZW50YWJsZSA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEV2ZW50YWJsZShvcHRpb25zKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEV2ZW50YWJsZSk7XG5cbiAgICB0aGlzLnR5cGVzID0ge307XG4gICAgdGhpcy5wcm9wYWdhdGlvblN0b3BwZWQgPSBmYWxzZTtcbiAgICB0aGlzLmltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZCA9IGZhbHNlO1xuICAgIHRoaXMub3B0aW9ucyA9ICgwLCBfZXh0ZW5kW1wiZGVmYXVsdFwiXSkoe30sIG9wdGlvbnMgfHwge30pO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEV2ZW50YWJsZSwgW3tcbiAgICBrZXk6IFwiZmlyZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmaXJlKGV2ZW50KSB7XG4gICAgICB2YXIgbGlzdGVuZXJzO1xuICAgICAgdmFyIGdsb2JhbCA9IHRoaXMuZ2xvYmFsOyAvLyBJbnRlcmFjdGFibGUjb24oKSBsaXN0ZW5lcnNcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlIG5vLWNvbmRpdGlvbmFsLWFzc2lnbm1lbnRcblxuICAgICAgaWYgKGxpc3RlbmVycyA9IHRoaXMudHlwZXNbZXZlbnQudHlwZV0pIHtcbiAgICAgICAgZmlyZVVudGlsSW1tZWRpYXRlU3RvcHBlZChldmVudCwgbGlzdGVuZXJzKTtcbiAgICAgIH0gLy8gaW50ZXJhY3Qub24oKSBsaXN0ZW5lcnNcblxuXG4gICAgICBpZiAoIWV2ZW50LnByb3BhZ2F0aW9uU3RvcHBlZCAmJiBnbG9iYWwgJiYgKGxpc3RlbmVycyA9IGdsb2JhbFtldmVudC50eXBlXSkpIHtcbiAgICAgICAgZmlyZVVudGlsSW1tZWRpYXRlU3RvcHBlZChldmVudCwgbGlzdGVuZXJzKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwib25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIHZhciBsaXN0ZW5lcnMgPSAoMCwgX25vcm1hbGl6ZUxpc3RlbmVyc1tcImRlZmF1bHRcIl0pKHR5cGUsIGxpc3RlbmVyKTtcblxuICAgICAgZm9yICh0eXBlIGluIGxpc3RlbmVycykge1xuICAgICAgICB0aGlzLnR5cGVzW3R5cGVdID0gYXJyLm1lcmdlKHRoaXMudHlwZXNbdHlwZV0gfHwgW10sIGxpc3RlbmVyc1t0eXBlXSk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm9mZlwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvZmYodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIHZhciBsaXN0ZW5lcnMgPSAoMCwgX25vcm1hbGl6ZUxpc3RlbmVyc1tcImRlZmF1bHRcIl0pKHR5cGUsIGxpc3RlbmVyKTtcblxuICAgICAgZm9yICh0eXBlIGluIGxpc3RlbmVycykge1xuICAgICAgICB2YXIgZXZlbnRMaXN0ID0gdGhpcy50eXBlc1t0eXBlXTtcblxuICAgICAgICBpZiAoIWV2ZW50TGlzdCB8fCAhZXZlbnRMaXN0Lmxlbmd0aCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgX2kyID0gMDsgX2kyIDwgbGlzdGVuZXJzW3R5cGVdLmxlbmd0aDsgX2kyKyspIHtcbiAgICAgICAgICB2YXIgX3JlZjI7XG5cbiAgICAgICAgICBfcmVmMiA9IGxpc3RlbmVyc1t0eXBlXVtfaTJdO1xuICAgICAgICAgIHZhciBzdWJMaXN0ZW5lciA9IF9yZWYyO1xuICAgICAgICAgIHZhciBpbmRleCA9IGV2ZW50TGlzdC5pbmRleE9mKHN1Ykxpc3RlbmVyKTtcblxuICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIGV2ZW50TGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBFdmVudGFibGU7XG59KCk7XG5cbnZhciBfZGVmYXVsdCA9IEV2ZW50YWJsZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5cbn0se1wiQGludGVyYWN0anMvdXRpbHMvYXJyXCI6NDYsXCJAaW50ZXJhY3Rqcy91dGlscy9leHRlbmRcIjo1MixcIkBpbnRlcmFjdGpzL3V0aWxzL25vcm1hbGl6ZUxpc3RlbmVyc1wiOjU4fV0sMTU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGV4cG9ydHMuSW50ZXJhY3RFdmVudCA9IGV4cG9ydHMuRXZlbnRQaGFzZSA9IHZvaWQgMDtcblxudmFyIF9leHRlbmQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy91dGlscy9leHRlbmRcIikpO1xuXG52YXIgX2dldE9yaWdpblhZID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiQGludGVyYWN0anMvdXRpbHMvZ2V0T3JpZ2luWFlcIikpO1xuXG52YXIgX2h5cG90ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiQGludGVyYWN0anMvdXRpbHMvaHlwb3RcIikpO1xuXG52YXIgX0Jhc2VFdmVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0Jhc2VFdmVudFwiKSk7XG5cbnZhciBfZGVmYXVsdE9wdGlvbnMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL2RlZmF1bHRPcHRpb25zXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgfSByZXR1cm4gX3R5cGVvZihvYmopOyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkgeyByZXR1cm4gY2FsbDsgfSByZXR1cm4gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTsgfVxuXG5mdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pOyB9OyByZXR1cm4gX2dldFByb3RvdHlwZU9mKG8pOyB9XG5cbmZ1bmN0aW9uIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZikgeyBpZiAoc2VsZiA9PT0gdm9pZCAwKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gc2VsZjsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb25cIik7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgX3NldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTsgfVxuXG5mdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgby5fX3Byb3RvX18gPSBwOyByZXR1cm4gbzsgfTsgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTsgfVxuXG52YXIgRXZlbnRQaGFzZTtcbmV4cG9ydHMuRXZlbnRQaGFzZSA9IEV2ZW50UGhhc2U7XG5cbihmdW5jdGlvbiAoRXZlbnRQaGFzZSkge1xuICBFdmVudFBoYXNlW1wiU3RhcnRcIl0gPSBcInN0YXJ0XCI7XG4gIEV2ZW50UGhhc2VbXCJNb3ZlXCJdID0gXCJtb3ZlXCI7XG4gIEV2ZW50UGhhc2VbXCJFbmRcIl0gPSBcImVuZFwiO1xuICBFdmVudFBoYXNlW1wiX05PTkVcIl0gPSBcIlwiO1xufSkoRXZlbnRQaGFzZSB8fCAoZXhwb3J0cy5FdmVudFBoYXNlID0gRXZlbnRQaGFzZSA9IHt9KSk7XG5cbnZhciBJbnRlcmFjdEV2ZW50ID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfQmFzZUV2ZW50KSB7XG4gIF9pbmhlcml0cyhJbnRlcmFjdEV2ZW50LCBfQmFzZUV2ZW50KTtcblxuICAvKiogKi9cbiAgZnVuY3Rpb24gSW50ZXJhY3RFdmVudChpbnRlcmFjdGlvbiwgZXZlbnQsIGFjdGlvbk5hbWUsIHBoYXNlLCBlbGVtZW50LCByZWxhdGVkLCBwcmVFbmQsIHR5cGUpIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgSW50ZXJhY3RFdmVudCk7XG5cbiAgICBfdGhpcyA9IF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihJbnRlcmFjdEV2ZW50KS5jYWxsKHRoaXMsIGludGVyYWN0aW9uKSk7XG4gICAgZWxlbWVudCA9IGVsZW1lbnQgfHwgaW50ZXJhY3Rpb24uZWxlbWVudDtcbiAgICB2YXIgdGFyZ2V0ID0gaW50ZXJhY3Rpb24uaW50ZXJhY3RhYmxlOyAvLyBGSVhNRTogYWRkIGRlbHRhU291cmNlIHRvIGRlZmF1bHRzXG5cbiAgICB2YXIgZGVsdGFTb3VyY2UgPSAodGFyZ2V0ICYmIHRhcmdldC5vcHRpb25zIHx8IF9kZWZhdWx0T3B0aW9uc1tcImRlZmF1bHRcIl0pLmRlbHRhU291cmNlO1xuICAgIHZhciBvcmlnaW4gPSAoMCwgX2dldE9yaWdpblhZW1wiZGVmYXVsdFwiXSkodGFyZ2V0LCBlbGVtZW50LCBhY3Rpb25OYW1lKTtcbiAgICB2YXIgc3RhcnRpbmcgPSBwaGFzZSA9PT0gJ3N0YXJ0JztcbiAgICB2YXIgZW5kaW5nID0gcGhhc2UgPT09ICdlbmQnO1xuICAgIHZhciBwcmV2RXZlbnQgPSBzdGFydGluZyA/IF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpIDogaW50ZXJhY3Rpb24ucHJldkV2ZW50O1xuICAgIHZhciBjb29yZHMgPSBzdGFydGluZyA/IGludGVyYWN0aW9uLmNvb3Jkcy5zdGFydCA6IGVuZGluZyA/IHtcbiAgICAgIHBhZ2U6IHByZXZFdmVudC5wYWdlLFxuICAgICAgY2xpZW50OiBwcmV2RXZlbnQuY2xpZW50LFxuICAgICAgdGltZVN0YW1wOiBpbnRlcmFjdGlvbi5jb29yZHMuY3VyLnRpbWVTdGFtcFxuICAgIH0gOiBpbnRlcmFjdGlvbi5jb29yZHMuY3VyO1xuICAgIF90aGlzLnBhZ2UgPSAoMCwgX2V4dGVuZFtcImRlZmF1bHRcIl0pKHt9LCBjb29yZHMucGFnZSk7XG4gICAgX3RoaXMuY2xpZW50ID0gKDAsIF9leHRlbmRbXCJkZWZhdWx0XCJdKSh7fSwgY29vcmRzLmNsaWVudCk7XG4gICAgX3RoaXMucmVjdCA9ICgwLCBfZXh0ZW5kW1wiZGVmYXVsdFwiXSkoe30sIGludGVyYWN0aW9uLnJlY3QpO1xuICAgIF90aGlzLnRpbWVTdGFtcCA9IGNvb3Jkcy50aW1lU3RhbXA7XG5cbiAgICBpZiAoIWVuZGluZykge1xuICAgICAgX3RoaXMucGFnZS54IC09IG9yaWdpbi54O1xuICAgICAgX3RoaXMucGFnZS55IC09IG9yaWdpbi55O1xuICAgICAgX3RoaXMuY2xpZW50LnggLT0gb3JpZ2luLng7XG4gICAgICBfdGhpcy5jbGllbnQueSAtPSBvcmlnaW4ueTtcbiAgICB9XG5cbiAgICBfdGhpcy5jdHJsS2V5ID0gZXZlbnQuY3RybEtleTtcbiAgICBfdGhpcy5hbHRLZXkgPSBldmVudC5hbHRLZXk7XG4gICAgX3RoaXMuc2hpZnRLZXkgPSBldmVudC5zaGlmdEtleTtcbiAgICBfdGhpcy5tZXRhS2V5ID0gZXZlbnQubWV0YUtleTtcbiAgICBfdGhpcy5idXR0b24gPSBldmVudC5idXR0b247XG4gICAgX3RoaXMuYnV0dG9ucyA9IGV2ZW50LmJ1dHRvbnM7XG4gICAgX3RoaXMudGFyZ2V0ID0gZWxlbWVudDtcbiAgICBfdGhpcy5jdXJyZW50VGFyZ2V0ID0gZWxlbWVudDtcbiAgICBfdGhpcy5yZWxhdGVkVGFyZ2V0ID0gcmVsYXRlZCB8fCBudWxsO1xuICAgIF90aGlzLnByZUVuZCA9IHByZUVuZDtcbiAgICBfdGhpcy50eXBlID0gdHlwZSB8fCBhY3Rpb25OYW1lICsgKHBoYXNlIHx8ICcnKTtcbiAgICBfdGhpcy5pbnRlcmFjdGFibGUgPSB0YXJnZXQ7XG4gICAgX3RoaXMudDAgPSBzdGFydGluZyA/IGludGVyYWN0aW9uLnBvaW50ZXJzW2ludGVyYWN0aW9uLnBvaW50ZXJzLmxlbmd0aCAtIDFdLmRvd25UaW1lIDogcHJldkV2ZW50LnQwO1xuICAgIF90aGlzLngwID0gaW50ZXJhY3Rpb24uY29vcmRzLnN0YXJ0LnBhZ2UueCAtIG9yaWdpbi54O1xuICAgIF90aGlzLnkwID0gaW50ZXJhY3Rpb24uY29vcmRzLnN0YXJ0LnBhZ2UueSAtIG9yaWdpbi55O1xuICAgIF90aGlzLmNsaWVudFgwID0gaW50ZXJhY3Rpb24uY29vcmRzLnN0YXJ0LmNsaWVudC54IC0gb3JpZ2luLng7XG4gICAgX3RoaXMuY2xpZW50WTAgPSBpbnRlcmFjdGlvbi5jb29yZHMuc3RhcnQuY2xpZW50LnkgLSBvcmlnaW4ueTtcblxuICAgIGlmIChzdGFydGluZyB8fCBlbmRpbmcpIHtcbiAgICAgIF90aGlzLmRlbHRhID0ge1xuICAgICAgICB4OiAwLFxuICAgICAgICB5OiAwXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBfdGhpcy5kZWx0YSA9IHtcbiAgICAgICAgeDogX3RoaXNbZGVsdGFTb3VyY2VdLnggLSBwcmV2RXZlbnRbZGVsdGFTb3VyY2VdLngsXG4gICAgICAgIHk6IF90aGlzW2RlbHRhU291cmNlXS55IC0gcHJldkV2ZW50W2RlbHRhU291cmNlXS55XG4gICAgICB9O1xuICAgIH1cblxuICAgIF90aGlzLmR0ID0gaW50ZXJhY3Rpb24uY29vcmRzLmRlbHRhLnRpbWVTdGFtcDtcbiAgICBfdGhpcy5kdXJhdGlvbiA9IF90aGlzLnRpbWVTdGFtcCAtIF90aGlzLnQwOyAvLyB2ZWxvY2l0eSBhbmQgc3BlZWQgaW4gcGl4ZWxzIHBlciBzZWNvbmRcblxuICAgIF90aGlzLnZlbG9jaXR5ID0gKDAsIF9leHRlbmRbXCJkZWZhdWx0XCJdKSh7fSwgaW50ZXJhY3Rpb24uY29vcmRzLnZlbG9jaXR5W2RlbHRhU291cmNlXSk7XG4gICAgX3RoaXMuc3BlZWQgPSAoMCwgX2h5cG90W1wiZGVmYXVsdFwiXSkoX3RoaXMudmVsb2NpdHkueCwgX3RoaXMudmVsb2NpdHkueSk7XG4gICAgX3RoaXMuc3dpcGUgPSBlbmRpbmcgfHwgcGhhc2UgPT09ICdpbmVydGlhc3RhcnQnID8gX3RoaXMuZ2V0U3dpcGUoKSA6IG51bGw7XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEludGVyYWN0RXZlbnQsIFt7XG4gICAga2V5OiBcImdldFN3aXBlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFN3aXBlKCkge1xuICAgICAgdmFyIGludGVyYWN0aW9uID0gdGhpcy5faW50ZXJhY3Rpb247XG5cbiAgICAgIGlmIChpbnRlcmFjdGlvbi5wcmV2RXZlbnQuc3BlZWQgPCA2MDAgfHwgdGhpcy50aW1lU3RhbXAgLSBpbnRlcmFjdGlvbi5wcmV2RXZlbnQudGltZVN0YW1wID4gMTUwKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICB2YXIgYW5nbGUgPSAxODAgKiBNYXRoLmF0YW4yKGludGVyYWN0aW9uLnByZXZFdmVudC52ZWxvY2l0eVksIGludGVyYWN0aW9uLnByZXZFdmVudC52ZWxvY2l0eVgpIC8gTWF0aC5QSTtcbiAgICAgIHZhciBvdmVybGFwID0gMjIuNTtcblxuICAgICAgaWYgKGFuZ2xlIDwgMCkge1xuICAgICAgICBhbmdsZSArPSAzNjA7XG4gICAgICB9XG5cbiAgICAgIHZhciBsZWZ0ID0gMTM1IC0gb3ZlcmxhcCA8PSBhbmdsZSAmJiBhbmdsZSA8IDIyNSArIG92ZXJsYXA7XG4gICAgICB2YXIgdXAgPSAyMjUgLSBvdmVybGFwIDw9IGFuZ2xlICYmIGFuZ2xlIDwgMzE1ICsgb3ZlcmxhcDtcbiAgICAgIHZhciByaWdodCA9ICFsZWZ0ICYmICgzMTUgLSBvdmVybGFwIDw9IGFuZ2xlIHx8IGFuZ2xlIDwgNDUgKyBvdmVybGFwKTtcbiAgICAgIHZhciBkb3duID0gIXVwICYmIDQ1IC0gb3ZlcmxhcCA8PSBhbmdsZSAmJiBhbmdsZSA8IDEzNSArIG92ZXJsYXA7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB1cDogdXAsXG4gICAgICAgIGRvd246IGRvd24sXG4gICAgICAgIGxlZnQ6IGxlZnQsXG4gICAgICAgIHJpZ2h0OiByaWdodCxcbiAgICAgICAgYW5nbGU6IGFuZ2xlLFxuICAgICAgICBzcGVlZDogaW50ZXJhY3Rpb24ucHJldkV2ZW50LnNwZWVkLFxuICAgICAgICB2ZWxvY2l0eToge1xuICAgICAgICAgIHg6IGludGVyYWN0aW9uLnByZXZFdmVudC52ZWxvY2l0eVgsXG4gICAgICAgICAgeTogaW50ZXJhY3Rpb24ucHJldkV2ZW50LnZlbG9jaXR5WVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJwcmV2ZW50RGVmYXVsdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwcmV2ZW50RGVmYXVsdCgpIHt9XG4gICAgLyoqXG4gICAgICogRG9uJ3QgY2FsbCBsaXN0ZW5lcnMgb24gdGhlIHJlbWFpbmluZyB0YXJnZXRzXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCkge1xuICAgICAgdGhpcy5pbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQgPSB0aGlzLnByb3BhZ2F0aW9uU3RvcHBlZCA9IHRydWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIERvbid0IGNhbGwgYW55IG90aGVyIGxpc3RlbmVycyAoZXZlbiBvbiB0aGUgY3VycmVudCB0YXJnZXQpXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJzdG9wUHJvcGFnYXRpb25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3RvcFByb3BhZ2F0aW9uKCkge1xuICAgICAgdGhpcy5wcm9wYWdhdGlvblN0b3BwZWQgPSB0cnVlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJwYWdlWFwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFnZS54O1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgIHRoaXMucGFnZS54ID0gdmFsdWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInBhZ2VZXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYWdlLnk7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuICAgICAgdGhpcy5wYWdlLnkgPSB2YWx1ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY2xpZW50WFwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2xpZW50Lng7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuICAgICAgdGhpcy5jbGllbnQueCA9IHZhbHVlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjbGllbnRZXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5jbGllbnQueTtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG4gICAgICB0aGlzLmNsaWVudC55ID0gdmFsdWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImR4XCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5kZWx0YS54O1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgIHRoaXMuZGVsdGEueCA9IHZhbHVlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkeVwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZGVsdGEueTtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG4gICAgICB0aGlzLmRlbHRhLnkgPSB2YWx1ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidmVsb2NpdHlYXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy52ZWxvY2l0eS54O1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgIHRoaXMudmVsb2NpdHkueCA9IHZhbHVlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ2ZWxvY2l0eVlcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnZlbG9jaXR5Lnk7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuICAgICAgdGhpcy52ZWxvY2l0eS55ID0gdmFsdWU7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEludGVyYWN0RXZlbnQ7XG59KF9CYXNlRXZlbnQyW1wiZGVmYXVsdFwiXSk7XG5cbmV4cG9ydHMuSW50ZXJhY3RFdmVudCA9IEludGVyYWN0RXZlbnQ7XG52YXIgX2RlZmF1bHQgPSBJbnRlcmFjdEV2ZW50O1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBfZGVmYXVsdDtcblxufSx7XCIuL0Jhc2VFdmVudFwiOjEzLFwiLi9kZWZhdWx0T3B0aW9uc1wiOjIwLFwiQGludGVyYWN0anMvdXRpbHMvZXh0ZW5kXCI6NTIsXCJAaW50ZXJhY3Rqcy91dGlscy9nZXRPcmlnaW5YWVwiOjUzLFwiQGludGVyYWN0anMvdXRpbHMvaHlwb3RcIjo1NH1dLDE2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBleHBvcnRzLkludGVyYWN0YWJsZSA9IHZvaWQgMDtcblxudmFyIGFyciA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy91dGlscy9hcnJcIikpO1xuXG52YXIgX2Jyb3dzZXIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy91dGlscy9icm93c2VyXCIpKTtcblxudmFyIF9jbG9uZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIkBpbnRlcmFjdGpzL3V0aWxzL2Nsb25lXCIpKTtcblxudmFyIF9kb21VdGlscyA9IHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy91dGlscy9kb21VdGlsc1wiKTtcblxudmFyIF9ldmVudHMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy91dGlscy9ldmVudHNcIikpO1xuXG52YXIgX2V4dGVuZCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIkBpbnRlcmFjdGpzL3V0aWxzL2V4dGVuZFwiKSk7XG5cbnZhciBpcyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy91dGlscy9pc1wiKSk7XG5cbnZhciBfbm9ybWFsaXplTGlzdGVuZXJzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiQGludGVyYWN0anMvdXRpbHMvbm9ybWFsaXplTGlzdGVuZXJzXCIpKTtcblxudmFyIF93aW5kb3cgPSByZXF1aXJlKFwiQGludGVyYWN0anMvdXRpbHMvd2luZG93XCIpO1xuXG52YXIgX0V2ZW50YWJsZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vRXZlbnRhYmxlXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHsgdmFyIGRlc2MgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkgJiYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBrZXkpIDoge307IGlmIChkZXNjLmdldCB8fCBkZXNjLnNldCkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkobmV3T2JqLCBrZXksIGRlc2MpOyB9IGVsc2UgeyBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gfSB9IG5ld09ialtcImRlZmF1bHRcIl0gPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbi8qKiAqL1xudmFyIEludGVyYWN0YWJsZSA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoKSB7XG4gIC8qKiAqL1xuICBmdW5jdGlvbiBJbnRlcmFjdGFibGUodGFyZ2V0LCBvcHRpb25zLCBkZWZhdWx0Q29udGV4dCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBJbnRlcmFjdGFibGUpO1xuXG4gICAgdGhpcy5ldmVudHMgPSBuZXcgX0V2ZW50YWJsZVtcImRlZmF1bHRcIl0oKTtcbiAgICB0aGlzLl9hY3Rpb25zID0gb3B0aW9ucy5hY3Rpb25zO1xuICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgIHRoaXMuX2NvbnRleHQgPSBvcHRpb25zLmNvbnRleHQgfHwgZGVmYXVsdENvbnRleHQ7XG4gICAgdGhpcy5fd2luID0gKDAsIF93aW5kb3cuZ2V0V2luZG93KSgoMCwgX2RvbVV0aWxzLnRyeVNlbGVjdG9yKSh0YXJnZXQpID8gdGhpcy5fY29udGV4dCA6IHRhcmdldCk7XG4gICAgdGhpcy5fZG9jID0gdGhpcy5fd2luLmRvY3VtZW50O1xuICAgIHRoaXMuc2V0KG9wdGlvbnMpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEludGVyYWN0YWJsZSwgW3tcbiAgICBrZXk6IFwic2V0T25FdmVudHNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0T25FdmVudHMoYWN0aW9uTmFtZSwgcGhhc2VzKSB7XG4gICAgICBpZiAoaXMuZnVuYyhwaGFzZXMub25zdGFydCkpIHtcbiAgICAgICAgdGhpcy5vbihcIlwiLmNvbmNhdChhY3Rpb25OYW1lLCBcInN0YXJ0XCIpLCBwaGFzZXMub25zdGFydCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpcy5mdW5jKHBoYXNlcy5vbm1vdmUpKSB7XG4gICAgICAgIHRoaXMub24oXCJcIi5jb25jYXQoYWN0aW9uTmFtZSwgXCJtb3ZlXCIpLCBwaGFzZXMub25tb3ZlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzLmZ1bmMocGhhc2VzLm9uZW5kKSkge1xuICAgICAgICB0aGlzLm9uKFwiXCIuY29uY2F0KGFjdGlvbk5hbWUsIFwiZW5kXCIpLCBwaGFzZXMub25lbmQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXMuZnVuYyhwaGFzZXMub25pbmVydGlhc3RhcnQpKSB7XG4gICAgICAgIHRoaXMub24oXCJcIi5jb25jYXQoYWN0aW9uTmFtZSwgXCJpbmVydGlhc3RhcnRcIiksIHBoYXNlcy5vbmluZXJ0aWFzdGFydCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ1cGRhdGVQZXJBY3Rpb25MaXN0ZW5lcnNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdXBkYXRlUGVyQWN0aW9uTGlzdGVuZXJzKGFjdGlvbk5hbWUsIHByZXYsIGN1cikge1xuICAgICAgaWYgKGlzLmFycmF5KHByZXYpIHx8IGlzLm9iamVjdChwcmV2KSkge1xuICAgICAgICB0aGlzLm9mZihhY3Rpb25OYW1lLCBwcmV2KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzLmFycmF5KGN1cikgfHwgaXMub2JqZWN0KGN1cikpIHtcbiAgICAgICAgdGhpcy5vbihhY3Rpb25OYW1lLCBjdXIpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzZXRQZXJBY3Rpb25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0UGVyQWN0aW9uKGFjdGlvbk5hbWUsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBkZWZhdWx0cyA9IHRoaXMuX2RlZmF1bHRzOyAvLyBmb3IgYWxsIHRoZSBkZWZhdWx0IHBlci1hY3Rpb24gb3B0aW9uc1xuXG4gICAgICBmb3IgKHZhciBvcHRpb25OYW1lIGluIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGFjdGlvbk9wdGlvbnMgPSB0aGlzLm9wdGlvbnNbYWN0aW9uTmFtZV07XG4gICAgICAgIHZhciBvcHRpb25WYWx1ZSA9IG9wdGlvbnNbb3B0aW9uTmFtZV07XG4gICAgICAgIHZhciBpc0FycmF5ID0gaXMuYXJyYXkob3B0aW9uVmFsdWUpOyAvLyByZW1vdmUgb2xkIGV2ZW50IGxpc3RlbmVycyBhbmQgYWRkIG5ldyBvbmVzXG5cbiAgICAgICAgaWYgKG9wdGlvbk5hbWUgPT09ICdsaXN0ZW5lcnMnKSB7XG4gICAgICAgICAgdGhpcy51cGRhdGVQZXJBY3Rpb25MaXN0ZW5lcnMoYWN0aW9uTmFtZSwgYWN0aW9uT3B0aW9ucy5saXN0ZW5lcnMsIG9wdGlvblZhbHVlKTtcbiAgICAgICAgfSAvLyBpZiB0aGUgb3B0aW9uIHZhbHVlIGlzIGFuIGFycmF5XG5cblxuICAgICAgICBpZiAoaXNBcnJheSkge1xuICAgICAgICAgIGFjdGlvbk9wdGlvbnNbb3B0aW9uTmFtZV0gPSBhcnIuZnJvbShvcHRpb25WYWx1ZSk7XG4gICAgICAgIH0gLy8gaWYgdGhlIG9wdGlvbiB2YWx1ZSBpcyBhbiBvYmplY3RcbiAgICAgICAgZWxzZSBpZiAoIWlzQXJyYXkgJiYgaXMucGxhaW5PYmplY3Qob3B0aW9uVmFsdWUpKSB7XG4gICAgICAgICAgICAvLyBjb3B5IHRoZSBvYmplY3RcbiAgICAgICAgICAgIGFjdGlvbk9wdGlvbnNbb3B0aW9uTmFtZV0gPSAoMCwgX2V4dGVuZFtcImRlZmF1bHRcIl0pKGFjdGlvbk9wdGlvbnNbb3B0aW9uTmFtZV0gfHwge30sICgwLCBfY2xvbmVbXCJkZWZhdWx0XCJdKShvcHRpb25WYWx1ZSkpOyAvLyBzZXQgYW5hYmxlZCBmaWVsZCB0byB0cnVlIGlmIGl0IGV4aXN0cyBpbiB0aGUgZGVmYXVsdHNcblxuICAgICAgICAgICAgaWYgKGlzLm9iamVjdChkZWZhdWx0cy5wZXJBY3Rpb25bb3B0aW9uTmFtZV0pICYmICdlbmFibGVkJyBpbiBkZWZhdWx0cy5wZXJBY3Rpb25bb3B0aW9uTmFtZV0pIHtcbiAgICAgICAgICAgICAgYWN0aW9uT3B0aW9uc1tvcHRpb25OYW1lXS5lbmFibGVkID0gb3B0aW9uVmFsdWUuZW5hYmxlZCAhPT0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSAvLyBpZiB0aGUgb3B0aW9uIHZhbHVlIGlzIGEgYm9vbGVhbiBhbmQgdGhlIGRlZmF1bHQgaXMgYW4gb2JqZWN0XG4gICAgICAgICAgZWxzZSBpZiAoaXMuYm9vbChvcHRpb25WYWx1ZSkgJiYgaXMub2JqZWN0KGRlZmF1bHRzLnBlckFjdGlvbltvcHRpb25OYW1lXSkpIHtcbiAgICAgICAgICAgICAgYWN0aW9uT3B0aW9uc1tvcHRpb25OYW1lXS5lbmFibGVkID0gb3B0aW9uVmFsdWU7XG4gICAgICAgICAgICB9IC8vIGlmIGl0J3MgYW55dGhpbmcgZWxzZSwgZG8gYSBwbGFpbiBhc3NpZ25tZW50XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBhY3Rpb25PcHRpb25zW29wdGlvbk5hbWVdID0gb3B0aW9uVmFsdWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgZnVuY3Rpb24gdG8gZ2V0IGFuIEludGVyYWN0YWJsZXMgYm91bmRpbmcgcmVjdC4gQ2FuIGJlXG4gICAgICogb3ZlcnJpZGRlbiB1c2luZyB7QGxpbmsgSW50ZXJhY3RhYmxlLnJlY3RDaGVja2VyfS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gW2VsZW1lbnRdIFRoZSBlbGVtZW50IHRvIG1lYXN1cmUuXG4gICAgICogQHJldHVybiB7b2JqZWN0fSBUaGUgb2JqZWN0J3MgYm91bmRpbmcgcmVjdGFuZ2xlLlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0UmVjdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRSZWN0KGVsZW1lbnQpIHtcbiAgICAgIGVsZW1lbnQgPSBlbGVtZW50IHx8IChpcy5lbGVtZW50KHRoaXMudGFyZ2V0KSA/IHRoaXMudGFyZ2V0IDogbnVsbCk7XG5cbiAgICAgIGlmIChpcy5zdHJpbmcodGhpcy50YXJnZXQpKSB7XG4gICAgICAgIGVsZW1lbnQgPSBlbGVtZW50IHx8IHRoaXMuX2NvbnRleHQucXVlcnlTZWxlY3Rvcih0aGlzLnRhcmdldCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoMCwgX2RvbVV0aWxzLmdldEVsZW1lbnRSZWN0KShlbGVtZW50KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBvciBzZXRzIHRoZSBmdW5jdGlvbiB1c2VkIHRvIGNhbGN1bGF0ZSB0aGUgaW50ZXJhY3RhYmxlJ3NcbiAgICAgKiBlbGVtZW50J3MgcmVjdGFuZ2xlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbY2hlY2tlcl0gQSBmdW5jdGlvbiB3aGljaCByZXR1cm5zIHRoaXMgSW50ZXJhY3RhYmxlJ3NcbiAgICAgKiBib3VuZGluZyByZWN0YW5nbGUuIFNlZSB7QGxpbmsgSW50ZXJhY3RhYmxlLmdldFJlY3R9XG4gICAgICogQHJldHVybiB7ZnVuY3Rpb24gfCBvYmplY3R9IFRoZSBjaGVja2VyIGZ1bmN0aW9uIG9yIHRoaXMgSW50ZXJhY3RhYmxlXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJyZWN0Q2hlY2tlclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZWN0Q2hlY2tlcihjaGVja2VyKSB7XG4gICAgICBpZiAoaXMuZnVuYyhjaGVja2VyKSkge1xuICAgICAgICB0aGlzLmdldFJlY3QgPSBjaGVja2VyO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgaWYgKGNoZWNrZXIgPT09IG51bGwpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuZ2V0UmVjdDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmdldFJlY3Q7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIl9iYWNrQ29tcGF0T3B0aW9uXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9iYWNrQ29tcGF0T3B0aW9uKG9wdGlvbk5hbWUsIG5ld1ZhbHVlKSB7XG4gICAgICBpZiAoKDAsIF9kb21VdGlscy50cnlTZWxlY3RvcikobmV3VmFsdWUpIHx8IGlzLm9iamVjdChuZXdWYWx1ZSkpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zW29wdGlvbk5hbWVdID0gbmV3VmFsdWU7XG5cbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IHRoaXMuX2FjdGlvbnMubmFtZXMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgdmFyIF9yZWY7XG5cbiAgICAgICAgICBfcmVmID0gdGhpcy5fYWN0aW9ucy5uYW1lc1tfaV07XG4gICAgICAgICAgdmFyIGFjdGlvbiA9IF9yZWY7XG4gICAgICAgICAgdGhpcy5vcHRpb25zW2FjdGlvbl1bb3B0aW9uTmFtZV0gPSBuZXdWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zW29wdGlvbk5hbWVdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIG9yIHNldHMgdGhlIG9yaWdpbiBvZiB0aGUgSW50ZXJhY3RhYmxlJ3MgZWxlbWVudC4gIFRoZSB4IGFuZCB5XG4gICAgICogb2YgdGhlIG9yaWdpbiB3aWxsIGJlIHN1YnRyYWN0ZWQgZnJvbSBhY3Rpb24gZXZlbnQgY29vcmRpbmF0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnQgfCBvYmplY3QgfCBzdHJpbmd9IFtvcmlnaW5dIEFuIEhUTUwgb3IgU1ZHIEVsZW1lbnQgd2hvc2VcbiAgICAgKiByZWN0IHdpbGwgYmUgdXNlZCwgYW4gb2JqZWN0IGVnLiB7IHg6IDAsIHk6IDAgfSBvciBzdHJpbmcgJ3BhcmVudCcsICdzZWxmJ1xuICAgICAqIG9yIGFueSBDU1Mgc2VsZWN0b3JcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge29iamVjdH0gVGhlIGN1cnJlbnQgb3JpZ2luIG9yIHRoaXMgSW50ZXJhY3RhYmxlXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJvcmlnaW5cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gb3JpZ2luKG5ld1ZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5fYmFja0NvbXBhdE9wdGlvbignb3JpZ2luJywgbmV3VmFsdWUpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIG9yIHNldHMgdGhlIG1vdXNlIGNvb3JkaW5hdGUgdHlwZXMgdXNlZCB0byBjYWxjdWxhdGUgdGhlXG4gICAgICogbW92ZW1lbnQgb2YgdGhlIHBvaW50ZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW25ld1ZhbHVlXSBVc2UgJ2NsaWVudCcgaWYgeW91IHdpbGwgYmUgc2Nyb2xsaW5nIHdoaWxlXG4gICAgICogaW50ZXJhY3Rpbmc7IFVzZSAncGFnZScgaWYgeW91IHdhbnQgYXV0b1Njcm9sbCB0byB3b3JrXG4gICAgICogQHJldHVybiB7c3RyaW5nIHwgb2JqZWN0fSBUaGUgY3VycmVudCBkZWx0YVNvdXJjZSBvciB0aGlzIEludGVyYWN0YWJsZVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiZGVsdGFTb3VyY2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGVsdGFTb3VyY2UobmV3VmFsdWUpIHtcbiAgICAgIGlmIChuZXdWYWx1ZSA9PT0gJ3BhZ2UnIHx8IG5ld1ZhbHVlID09PSAnY2xpZW50Jykge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZGVsdGFTb3VyY2UgPSBuZXdWYWx1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZGVsdGFTb3VyY2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHNlbGVjdG9yIGNvbnRleHQgTm9kZSBvZiB0aGUgSW50ZXJhY3RhYmxlLiBUaGUgZGVmYXVsdCBpc1xuICAgICAqIGB3aW5kb3cuZG9jdW1lbnRgLlxuICAgICAqXG4gICAgICogQHJldHVybiB7Tm9kZX0gVGhlIGNvbnRleHQgTm9kZSBvZiB0aGlzIEludGVyYWN0YWJsZVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiY29udGV4dFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjb250ZXh0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2NvbnRleHQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImluQ29udGV4dFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpbkNvbnRleHQoZWxlbWVudCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2NvbnRleHQgPT09IGVsZW1lbnQub3duZXJEb2N1bWVudCB8fCAoMCwgX2RvbVV0aWxzLm5vZGVDb250YWlucykodGhpcy5fY29udGV4dCwgZWxlbWVudCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInRlc3RJZ25vcmVBbGxvd1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0ZXN0SWdub3JlQWxsb3cob3B0aW9ucywgaW50ZXJhY3RhYmxlRWxlbWVudCwgZXZlbnRUYXJnZXQpIHtcbiAgICAgIHJldHVybiAhdGhpcy50ZXN0SWdub3JlKG9wdGlvbnMuaWdub3JlRnJvbSwgaW50ZXJhY3RhYmxlRWxlbWVudCwgZXZlbnRUYXJnZXQpICYmIHRoaXMudGVzdEFsbG93KG9wdGlvbnMuYWxsb3dGcm9tLCBpbnRlcmFjdGFibGVFbGVtZW50LCBldmVudFRhcmdldCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInRlc3RBbGxvd1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0ZXN0QWxsb3coYWxsb3dGcm9tLCBpbnRlcmFjdGFibGVFbGVtZW50LCBlbGVtZW50KSB7XG4gICAgICBpZiAoIWFsbG93RnJvbSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpcy5lbGVtZW50KGVsZW1lbnQpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzLnN0cmluZyhhbGxvd0Zyb20pKSB7XG4gICAgICAgIHJldHVybiAoMCwgX2RvbVV0aWxzLm1hdGNoZXNVcFRvKShlbGVtZW50LCBhbGxvd0Zyb20sIGludGVyYWN0YWJsZUVsZW1lbnQpO1xuICAgICAgfSBlbHNlIGlmIChpcy5lbGVtZW50KGFsbG93RnJvbSkpIHtcbiAgICAgICAgcmV0dXJuICgwLCBfZG9tVXRpbHMubm9kZUNvbnRhaW5zKShhbGxvd0Zyb20sIGVsZW1lbnQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInRlc3RJZ25vcmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdGVzdElnbm9yZShpZ25vcmVGcm9tLCBpbnRlcmFjdGFibGVFbGVtZW50LCBlbGVtZW50KSB7XG4gICAgICBpZiAoIWlnbm9yZUZyb20gfHwgIWlzLmVsZW1lbnQoZWxlbWVudCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXMuc3RyaW5nKGlnbm9yZUZyb20pKSB7XG4gICAgICAgIHJldHVybiAoMCwgX2RvbVV0aWxzLm1hdGNoZXNVcFRvKShlbGVtZW50LCBpZ25vcmVGcm9tLCBpbnRlcmFjdGFibGVFbGVtZW50KTtcbiAgICAgIH0gZWxzZSBpZiAoaXMuZWxlbWVudChpZ25vcmVGcm9tKSkge1xuICAgICAgICByZXR1cm4gKDAsIF9kb21VdGlscy5ub2RlQ29udGFpbnMpKGlnbm9yZUZyb20sIGVsZW1lbnQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhbGxzIGxpc3RlbmVycyBmb3IgdGhlIGdpdmVuIEludGVyYWN0RXZlbnQgdHlwZSBib3VuZCBnbG9iYWxseVxuICAgICAqIGFuZCBkaXJlY3RseSB0byB0aGlzIEludGVyYWN0YWJsZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtJbnRlcmFjdEV2ZW50fSBpRXZlbnQgVGhlIEludGVyYWN0RXZlbnQgb2JqZWN0IHRvIGJlIGZpcmVkIG9uIHRoaXNcbiAgICAgKiBJbnRlcmFjdGFibGVcbiAgICAgKiBAcmV0dXJuIHtJbnRlcmFjdGFibGV9IHRoaXMgSW50ZXJhY3RhYmxlXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJmaXJlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGZpcmUoaUV2ZW50KSB7XG4gICAgICB0aGlzLmV2ZW50cy5maXJlKGlFdmVudCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiX29uT2ZmXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9vbk9mZihtZXRob2QsIHR5cGVBcmcsIGxpc3RlbmVyQXJnLCBvcHRpb25zKSB7XG4gICAgICBpZiAoaXMub2JqZWN0KHR5cGVBcmcpICYmICFpcy5hcnJheSh0eXBlQXJnKSkge1xuICAgICAgICBvcHRpb25zID0gbGlzdGVuZXJBcmc7XG4gICAgICAgIGxpc3RlbmVyQXJnID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIGFkZFJlbW92ZSA9IG1ldGhvZCA9PT0gJ29uJyA/ICdhZGQnIDogJ3JlbW92ZSc7XG4gICAgICB2YXIgbGlzdGVuZXJzID0gKDAsIF9ub3JtYWxpemVMaXN0ZW5lcnNbXCJkZWZhdWx0XCJdKSh0eXBlQXJnLCBsaXN0ZW5lckFyZyk7XG5cbiAgICAgIGZvciAodmFyIHR5cGUgaW4gbGlzdGVuZXJzKSB7XG4gICAgICAgIGlmICh0eXBlID09PSAnd2hlZWwnKSB7XG4gICAgICAgICAgdHlwZSA9IF9icm93c2VyW1wiZGVmYXVsdFwiXS53aGVlbEV2ZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgX2kyID0gMDsgX2kyIDwgbGlzdGVuZXJzW3R5cGVdLmxlbmd0aDsgX2kyKyspIHtcbiAgICAgICAgICB2YXIgX3JlZjI7XG5cbiAgICAgICAgICBfcmVmMiA9IGxpc3RlbmVyc1t0eXBlXVtfaTJdO1xuICAgICAgICAgIHZhciBsaXN0ZW5lciA9IF9yZWYyO1xuXG4gICAgICAgICAgLy8gaWYgaXQgaXMgYW4gYWN0aW9uIGV2ZW50IHR5cGVcbiAgICAgICAgICBpZiAoYXJyLmNvbnRhaW5zKHRoaXMuX2FjdGlvbnMuZXZlbnRUeXBlcywgdHlwZSkpIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzW21ldGhvZF0odHlwZSwgbGlzdGVuZXIpO1xuICAgICAgICAgIH0gLy8gZGVsZWdhdGVkIGV2ZW50XG4gICAgICAgICAgZWxzZSBpZiAoaXMuc3RyaW5nKHRoaXMudGFyZ2V0KSkge1xuICAgICAgICAgICAgICBfZXZlbnRzW1wiZGVmYXVsdFwiXVtcIlwiLmNvbmNhdChhZGRSZW1vdmUsIFwiRGVsZWdhdGVcIildKHRoaXMudGFyZ2V0LCB0aGlzLl9jb250ZXh0LCB0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyk7XG4gICAgICAgICAgICB9IC8vIHJlbW92ZSBsaXN0ZW5lciBmcm9tIHRoaXMgSW50ZXJhdGFibGUncyBlbGVtZW50XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBfZXZlbnRzW1wiZGVmYXVsdFwiXVthZGRSZW1vdmVdKHRoaXMudGFyZ2V0LCB0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQmluZHMgYSBsaXN0ZW5lciBmb3IgYW4gSW50ZXJhY3RFdmVudCwgcG9pbnRlckV2ZW50IG9yIERPTSBldmVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nIHwgYXJyYXkgfCBvYmplY3R9IHR5cGVzIFRoZSB0eXBlcyBvZiBldmVudHMgdG8gbGlzdGVuXG4gICAgICogZm9yXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbiB8IGFycmF5IHwgb2JqZWN0fSBbbGlzdGVuZXJdIFRoZSBldmVudCBsaXN0ZW5lciBmdW5jdGlvbihzKVxuICAgICAqIEBwYXJhbSB7b2JqZWN0IHwgYm9vbGVhbn0gW29wdGlvbnNdIG9wdGlvbnMgb2JqZWN0IG9yIHVzZUNhcHR1cmUgZmxhZyBmb3JcbiAgICAgKiBhZGRFdmVudExpc3RlbmVyXG4gICAgICogQHJldHVybiB7SW50ZXJhY3RhYmxlfSBUaGlzIEludGVyYWN0YWJsZVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwib25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gb24odHlwZXMsIGxpc3RlbmVyLCBvcHRpb25zKSB7XG4gICAgICByZXR1cm4gdGhpcy5fb25PZmYoJ29uJywgdHlwZXMsIGxpc3RlbmVyLCBvcHRpb25zKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbiBJbnRlcmFjdEV2ZW50LCBwb2ludGVyRXZlbnQgb3IgRE9NIGV2ZW50IGxpc3RlbmVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmcgfCBhcnJheSB8IG9iamVjdH0gdHlwZXMgVGhlIHR5cGVzIG9mIGV2ZW50cyB0aGF0IHdlcmVcbiAgICAgKiBsaXN0ZW5lZCBmb3JcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uIHwgYXJyYXkgfCBvYmplY3R9IFtsaXN0ZW5lcl0gVGhlIGV2ZW50IGxpc3RlbmVyIGZ1bmN0aW9uKHMpXG4gICAgICogQHBhcmFtIHtvYmplY3QgfCBib29sZWFufSBbb3B0aW9uc10gb3B0aW9ucyBvYmplY3Qgb3IgdXNlQ2FwdHVyZSBmbGFnIGZvclxuICAgICAqIHJlbW92ZUV2ZW50TGlzdGVuZXJcbiAgICAgKiBAcmV0dXJuIHtJbnRlcmFjdGFibGV9IFRoaXMgSW50ZXJhY3RhYmxlXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJvZmZcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gb2ZmKHR5cGVzLCBsaXN0ZW5lciwgb3B0aW9ucykge1xuICAgICAgcmV0dXJuIHRoaXMuX29uT2ZmKCdvZmYnLCB0eXBlcywgbGlzdGVuZXIsIG9wdGlvbnMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXNldCB0aGUgb3B0aW9ucyBvZiB0aGlzIEludGVyYWN0YWJsZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgVGhlIG5ldyBzZXR0aW5ncyB0byBhcHBseVxuICAgICAqIEByZXR1cm4ge29iamVjdH0gVGhpcyBJbnRlcmFjdGFibGVcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcInNldFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXQob3B0aW9ucykge1xuICAgICAgdmFyIGRlZmF1bHRzID0gdGhpcy5fZGVmYXVsdHM7XG5cbiAgICAgIGlmICghaXMub2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5vcHRpb25zID0gKDAsIF9jbG9uZVtcImRlZmF1bHRcIl0pKGRlZmF1bHRzLmJhc2UpO1xuXG4gICAgICBmb3IgKHZhciBhY3Rpb25OYW1lIGluIHRoaXMuX2FjdGlvbnMubWV0aG9kRGljdCkge1xuICAgICAgICB2YXIgbWV0aG9kTmFtZSA9IHRoaXMuX2FjdGlvbnMubWV0aG9kRGljdFthY3Rpb25OYW1lXTtcbiAgICAgICAgdGhpcy5vcHRpb25zW2FjdGlvbk5hbWVdID0ge307XG4gICAgICAgIHRoaXMuc2V0UGVyQWN0aW9uKGFjdGlvbk5hbWUsICgwLCBfZXh0ZW5kW1wiZGVmYXVsdFwiXSkoKDAsIF9leHRlbmRbXCJkZWZhdWx0XCJdKSh7fSwgZGVmYXVsdHMucGVyQWN0aW9uKSwgZGVmYXVsdHMuYWN0aW9uc1thY3Rpb25OYW1lXSkpO1xuICAgICAgICB0aGlzW21ldGhvZE5hbWVdKG9wdGlvbnNbYWN0aW9uTmFtZV0pO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBzZXR0aW5nIGluIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKGlzLmZ1bmModGhpc1tzZXR0aW5nXSkpIHtcbiAgICAgICAgICB0aGlzW3NldHRpbmddKG9wdGlvbnNbc2V0dGluZ10pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgdGhpcyBpbnRlcmFjdGFibGUgZnJvbSB0aGUgbGlzdCBvZiBpbnRlcmFjdGFibGVzIGFuZCByZW1vdmUgaXQnc1xuICAgICAqIGFjdGlvbiBjYXBhYmlsaXRpZXMgYW5kIGV2ZW50IGxpc3RlbmVyc1xuICAgICAqXG4gICAgICogQHJldHVybiB7aW50ZXJhY3R9XG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJ1bnNldFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1bnNldCgpIHtcbiAgICAgIF9ldmVudHNbXCJkZWZhdWx0XCJdLnJlbW92ZSh0aGlzLnRhcmdldCwgJ2FsbCcpO1xuXG4gICAgICBpZiAoaXMuc3RyaW5nKHRoaXMudGFyZ2V0KSkge1xuICAgICAgICAvLyByZW1vdmUgZGVsZWdhdGVkIGV2ZW50c1xuICAgICAgICBmb3IgKHZhciB0eXBlIGluIF9ldmVudHNbXCJkZWZhdWx0XCJdLmRlbGVnYXRlZEV2ZW50cykge1xuICAgICAgICAgIHZhciBkZWxlZ2F0ZWQgPSBfZXZlbnRzW1wiZGVmYXVsdFwiXS5kZWxlZ2F0ZWRFdmVudHNbdHlwZV07XG5cbiAgICAgICAgICBpZiAoZGVsZWdhdGVkLnNlbGVjdG9yc1swXSA9PT0gdGhpcy50YXJnZXQgJiYgZGVsZWdhdGVkLmNvbnRleHRzWzBdID09PSB0aGlzLl9jb250ZXh0KSB7XG4gICAgICAgICAgICBkZWxlZ2F0ZWQuc2VsZWN0b3JzLnNwbGljZSgwLCAxKTtcbiAgICAgICAgICAgIGRlbGVnYXRlZC5jb250ZXh0cy5zcGxpY2UoMCwgMSk7XG4gICAgICAgICAgICBkZWxlZ2F0ZWQubGlzdGVuZXJzLnNwbGljZSgwLCAxKTsgLy8gcmVtb3ZlIHRoZSBhcnJheXMgaWYgdGhleSBhcmUgZW1wdHlcblxuICAgICAgICAgICAgaWYgKCFkZWxlZ2F0ZWQuc2VsZWN0b3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgICBkZWxlZ2F0ZWRbdHlwZV0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIF9ldmVudHNbXCJkZWZhdWx0XCJdLnJlbW92ZSh0aGlzLl9jb250ZXh0LCB0eXBlLCBfZXZlbnRzW1wiZGVmYXVsdFwiXS5kZWxlZ2F0ZUxpc3RlbmVyKTtcblxuICAgICAgICAgIF9ldmVudHNbXCJkZWZhdWx0XCJdLnJlbW92ZSh0aGlzLl9jb250ZXh0LCB0eXBlLCBfZXZlbnRzW1wiZGVmYXVsdFwiXS5kZWxlZ2F0ZVVzZUNhcHR1cmUsIHRydWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfZXZlbnRzW1wiZGVmYXVsdFwiXS5yZW1vdmUodGhpcy50YXJnZXQsICdhbGwnKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiX2RlZmF1bHRzXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBiYXNlOiB7fSxcbiAgICAgICAgcGVyQWN0aW9uOiB7fSxcbiAgICAgICAgYWN0aW9uczoge31cbiAgICAgIH07XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEludGVyYWN0YWJsZTtcbn0oKTtcblxuZXhwb3J0cy5JbnRlcmFjdGFibGUgPSBJbnRlcmFjdGFibGU7XG52YXIgX2RlZmF1bHQgPSBJbnRlcmFjdGFibGU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0O1xuXG59LHtcIi4vRXZlbnRhYmxlXCI6MTQsXCJAaW50ZXJhY3Rqcy91dGlscy9hcnJcIjo0NixcIkBpbnRlcmFjdGpzL3V0aWxzL2Jyb3dzZXJcIjo0NyxcIkBpbnRlcmFjdGpzL3V0aWxzL2Nsb25lXCI6NDgsXCJAaW50ZXJhY3Rqcy91dGlscy9kb21VdGlsc1wiOjUwLFwiQGludGVyYWN0anMvdXRpbHMvZXZlbnRzXCI6NTEsXCJAaW50ZXJhY3Rqcy91dGlscy9leHRlbmRcIjo1MixcIkBpbnRlcmFjdGpzL3V0aWxzL2lzXCI6NTYsXCJAaW50ZXJhY3Rqcy91dGlscy9ub3JtYWxpemVMaXN0ZW5lcnNcIjo1OCxcIkBpbnRlcmFjdGpzL3V0aWxzL3dpbmRvd1wiOjY1fV0sMTc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIGFyciA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy91dGlscy9hcnJcIikpO1xuXG52YXIgZG9tVXRpbHMgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChyZXF1aXJlKFwiQGludGVyYWN0anMvdXRpbHMvZG9tVXRpbHNcIikpO1xuXG52YXIgX2V4dGVuZCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIkBpbnRlcmFjdGpzL3V0aWxzL2V4dGVuZFwiKSk7XG5cbnZhciBpcyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy91dGlscy9pc1wiKSk7XG5cbnZhciBfU2lnbmFscyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIkBpbnRlcmFjdGpzL3V0aWxzL1NpZ25hbHNcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iajsgfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgeyB2YXIgZGVzYyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID8gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIGtleSkgOiB7fTsgaWYgKGRlc2MuZ2V0IHx8IGRlc2Muc2V0KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuZXdPYmosIGtleSwgZGVzYyk7IH0gZWxzZSB7IG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSB9IH0gbmV3T2JqW1wiZGVmYXVsdFwiXSA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxudmFyIEludGVyYWN0YWJsZVNldCA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEludGVyYWN0YWJsZVNldChzY29wZSkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgSW50ZXJhY3RhYmxlU2V0KTtcblxuICAgIHRoaXMuc2NvcGUgPSBzY29wZTtcbiAgICB0aGlzLnNpZ25hbHMgPSBuZXcgX1NpZ25hbHNbXCJkZWZhdWx0XCJdKCk7IC8vIGFsbCBzZXQgaW50ZXJhY3RhYmxlc1xuXG4gICAgdGhpcy5saXN0ID0gW107XG4gICAgdGhpcy5zZWxlY3Rvck1hcCA9IHt9O1xuICAgIHRoaXMuc2lnbmFscy5vbigndW5zZXQnLCBmdW5jdGlvbiAoX3JlZikge1xuICAgICAgdmFyIGludGVyYWN0YWJsZSA9IF9yZWYuaW50ZXJhY3RhYmxlO1xuICAgICAgdmFyIHRhcmdldCA9IGludGVyYWN0YWJsZS50YXJnZXQsXG4gICAgICAgICAgY29udGV4dCA9IGludGVyYWN0YWJsZS5fY29udGV4dDtcbiAgICAgIHZhciB0YXJnZXRNYXBwaW5ncyA9IGlzLnN0cmluZyh0YXJnZXQpID8gX3RoaXMuc2VsZWN0b3JNYXBbdGFyZ2V0XSA6IHRhcmdldFtfdGhpcy5zY29wZS5pZF07XG4gICAgICB0YXJnZXRNYXBwaW5ncy5zcGxpY2UodGFyZ2V0TWFwcGluZ3MuZmluZEluZGV4KGZ1bmN0aW9uIChtKSB7XG4gICAgICAgIHJldHVybiBtLmNvbnRleHQgPT09IGNvbnRleHQ7XG4gICAgICB9KSwgMSk7XG4gICAgfSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoSW50ZXJhY3RhYmxlU2V0LCBbe1xuICAgIGtleTogXCJuZXdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX25ldyh0YXJnZXQsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSAoMCwgX2V4dGVuZFtcImRlZmF1bHRcIl0pKG9wdGlvbnMgfHwge30sIHtcbiAgICAgICAgYWN0aW9uczogdGhpcy5zY29wZS5hY3Rpb25zXG4gICAgICB9KTtcbiAgICAgIHZhciBpbnRlcmFjdGFibGUgPSBuZXcgdGhpcy5zY29wZS5JbnRlcmFjdGFibGUodGFyZ2V0LCBvcHRpb25zLCB0aGlzLnNjb3BlLmRvY3VtZW50KTtcbiAgICAgIHZhciBtYXBwaW5nSW5mbyA9IHtcbiAgICAgICAgY29udGV4dDogaW50ZXJhY3RhYmxlLl9jb250ZXh0LFxuICAgICAgICBpbnRlcmFjdGFibGU6IGludGVyYWN0YWJsZVxuICAgICAgfTtcbiAgICAgIHRoaXMuc2NvcGUuYWRkRG9jdW1lbnQoaW50ZXJhY3RhYmxlLl9kb2MpO1xuICAgICAgdGhpcy5saXN0LnB1c2goaW50ZXJhY3RhYmxlKTtcblxuICAgICAgaWYgKGlzLnN0cmluZyh0YXJnZXQpKSB7XG4gICAgICAgIGlmICghdGhpcy5zZWxlY3Rvck1hcFt0YXJnZXRdKSB7XG4gICAgICAgICAgdGhpcy5zZWxlY3Rvck1hcFt0YXJnZXRdID0gW107XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNlbGVjdG9yTWFwW3RhcmdldF0ucHVzaChtYXBwaW5nSW5mbyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIWludGVyYWN0YWJsZS50YXJnZXRbdGhpcy5zY29wZS5pZF0pIHtcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCB0aGlzLnNjb3BlLmlkLCB7XG4gICAgICAgICAgICB2YWx1ZTogW10sXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRhcmdldFt0aGlzLnNjb3BlLmlkXS5wdXNoKG1hcHBpbmdJbmZvKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zaWduYWxzLmZpcmUoJ25ldycsIHtcbiAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICAgIG9wdGlvbnM6IG9wdGlvbnMsXG4gICAgICAgIGludGVyYWN0YWJsZTogaW50ZXJhY3RhYmxlLFxuICAgICAgICB3aW46IHRoaXMuc2NvcGUuX3dpblxuICAgICAgfSk7XG4gICAgICByZXR1cm4gaW50ZXJhY3RhYmxlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0KHRhcmdldCwgb3B0aW9ucykge1xuICAgICAgdmFyIGNvbnRleHQgPSBvcHRpb25zICYmIG9wdGlvbnMuY29udGV4dCB8fCB0aGlzLnNjb3BlLmRvY3VtZW50O1xuICAgICAgdmFyIGlzU2VsZWN0b3IgPSBpcy5zdHJpbmcodGFyZ2V0KTtcbiAgICAgIHZhciB0YXJnZXRNYXBwaW5ncyA9IGlzU2VsZWN0b3IgPyB0aGlzLnNlbGVjdG9yTWFwW3RhcmdldF0gOiB0YXJnZXRbdGhpcy5zY29wZS5pZF07XG5cbiAgICAgIGlmICghdGFyZ2V0TWFwcGluZ3MpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciBmb3VuZCA9IGFyci5maW5kKHRhcmdldE1hcHBpbmdzLCBmdW5jdGlvbiAobSkge1xuICAgICAgICByZXR1cm4gbS5jb250ZXh0ID09PSBjb250ZXh0ICYmIChpc1NlbGVjdG9yIHx8IG0uaW50ZXJhY3RhYmxlLmluQ29udGV4dCh0YXJnZXQpKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGZvdW5kICYmIGZvdW5kLmludGVyYWN0YWJsZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZm9yRWFjaE1hdGNoXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGZvckVhY2hNYXRjaChlbGVtZW50LCBjYWxsYmFjaykge1xuICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IHRoaXMubGlzdC5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgdmFyIF9yZWYyO1xuXG4gICAgICAgIF9yZWYyID0gdGhpcy5saXN0W19pXTtcbiAgICAgICAgdmFyIGludGVyYWN0YWJsZSA9IF9yZWYyO1xuICAgICAgICB2YXIgcmV0ID0gdm9pZCAwO1xuXG4gICAgICAgIGlmICgoaXMuc3RyaW5nKGludGVyYWN0YWJsZS50YXJnZXQpIC8vIHRhcmdldCBpcyBhIHNlbGVjdG9yIGFuZCB0aGUgZWxlbWVudCBtYXRjaGVzXG4gICAgICAgID8gaXMuZWxlbWVudChlbGVtZW50KSAmJiBkb21VdGlscy5tYXRjaGVzU2VsZWN0b3IoZWxlbWVudCwgaW50ZXJhY3RhYmxlLnRhcmdldCkgOiAvLyB0YXJnZXQgaXMgdGhlIGVsZW1lbnRcbiAgICAgICAgZWxlbWVudCA9PT0gaW50ZXJhY3RhYmxlLnRhcmdldCkgJiYgLy8gdGhlIGVsZW1lbnQgaXMgaW4gY29udGV4dFxuICAgICAgICBpbnRlcmFjdGFibGUuaW5Db250ZXh0KGVsZW1lbnQpKSB7XG4gICAgICAgICAgcmV0ID0gY2FsbGJhY2soaW50ZXJhY3RhYmxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gSW50ZXJhY3RhYmxlU2V0O1xufSgpO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEludGVyYWN0YWJsZVNldDtcblxufSx7XCJAaW50ZXJhY3Rqcy91dGlscy9TaWduYWxzXCI6NDUsXCJAaW50ZXJhY3Rqcy91dGlscy9hcnJcIjo0NixcIkBpbnRlcmFjdGpzL3V0aWxzL2RvbVV0aWxzXCI6NTAsXCJAaW50ZXJhY3Rqcy91dGlscy9leHRlbmRcIjo1MixcIkBpbnRlcmFjdGpzL3V0aWxzL2lzXCI6NTZ9XSwxODpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIlBvaW50ZXJJbmZvXCIsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9Qb2ludGVySW5mb1tcImRlZmF1bHRcIl07XG4gIH1cbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBleHBvcnRzLkludGVyYWN0aW9uID0gdm9pZCAwO1xuXG52YXIgdXRpbHMgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChyZXF1aXJlKFwiQGludGVyYWN0anMvdXRpbHNcIikpO1xuXG52YXIgX0ludGVyYWN0RXZlbnQgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChyZXF1aXJlKFwiLi9JbnRlcmFjdEV2ZW50XCIpKTtcblxudmFyIF9Qb2ludGVySW5mbyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vUG9pbnRlckluZm9cIikpO1xuXG52YXIgX3Njb3BlID0gcmVxdWlyZShcIi4vc2NvcGVcIik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7IHZhciBkZXNjID0gT2JqZWN0LmRlZmluZVByb3BlcnR5ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KSA6IHt9OyBpZiAoZGVzYy5nZXQgfHwgZGVzYy5zZXQpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5ld09iaiwga2V5LCBkZXNjKTsgfSBlbHNlIHsgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IH0gfSBuZXdPYmpbXCJkZWZhdWx0XCJdID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG52YXIgSW50ZXJhY3Rpb24gPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICAvKiogKi9cbiAgZnVuY3Rpb24gSW50ZXJhY3Rpb24oX3JlZikge1xuICAgIHZhciBwb2ludGVyVHlwZSA9IF9yZWYucG9pbnRlclR5cGUsXG4gICAgICAgIHNpZ25hbHMgPSBfcmVmLnNpZ25hbHM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgSW50ZXJhY3Rpb24pO1xuXG4gICAgLy8gY3VycmVudCBpbnRlcmFjdGFibGUgYmVpbmcgaW50ZXJhY3RlZCB3aXRoXG4gICAgdGhpcy5pbnRlcmFjdGFibGUgPSBudWxsOyAvLyB0aGUgdGFyZ2V0IGVsZW1lbnQgb2YgdGhlIGludGVyYWN0YWJsZVxuXG4gICAgdGhpcy5lbGVtZW50ID0gbnVsbDsgLy8gYWN0aW9uIHRoYXQncyByZWFkeSB0byBiZSBmaXJlZCBvbiBuZXh0IG1vdmUgZXZlbnRcblxuICAgIHRoaXMucHJlcGFyZWQgPSB7XG4gICAgICBuYW1lOiBudWxsLFxuICAgICAgYXhpczogbnVsbCxcbiAgICAgIGVkZ2VzOiBudWxsXG4gICAgfTsgLy8ga2VlcCB0cmFjayBvZiBhZGRlZCBwb2ludGVyc1xuXG4gICAgdGhpcy5wb2ludGVycyA9IFtdOyAvLyBwb2ludGVyZG93bi9tb3VzZWRvd24vdG91Y2hzdGFydCBldmVudFxuXG4gICAgdGhpcy5kb3duRXZlbnQgPSBudWxsO1xuICAgIHRoaXMuZG93blBvaW50ZXIgPSB7fTtcbiAgICB0aGlzLl9sYXRlc3RQb2ludGVyID0ge1xuICAgICAgcG9pbnRlcjogbnVsbCxcbiAgICAgIGV2ZW50OiBudWxsLFxuICAgICAgZXZlbnRUYXJnZXQ6IG51bGxcbiAgICB9OyAvLyBwcmV2aW91cyBhY3Rpb24gZXZlbnRcblxuICAgIHRoaXMucHJldkV2ZW50ID0gbnVsbDtcbiAgICB0aGlzLnBvaW50ZXJJc0Rvd24gPSBmYWxzZTtcbiAgICB0aGlzLnBvaW50ZXJXYXNNb3ZlZCA9IGZhbHNlO1xuICAgIHRoaXMuX2ludGVyYWN0aW5nID0gZmFsc2U7XG4gICAgdGhpcy5fZW5kaW5nID0gZmFsc2U7XG4gICAgdGhpcy5fcHJveHkgPSBudWxsO1xuICAgIHRoaXMuc2ltdWxhdGlvbiA9IG51bGw7XG4gICAgLyoqXG4gICAgICogQGFsaWFzIEludGVyYWN0aW9uLnByb3RvdHlwZS5tb3ZlXG4gICAgICovXG5cbiAgICB0aGlzLmRvTW92ZSA9IHV0aWxzLndhcm5PbmNlKGZ1bmN0aW9uIChzaWduYWxBcmcpIHtcbiAgICAgIHRoaXMubW92ZShzaWduYWxBcmcpO1xuICAgIH0sICdUaGUgaW50ZXJhY3Rpb24uZG9Nb3ZlKCkgbWV0aG9kIGhhcyBiZWVuIHJlbmFtZWQgdG8gaW50ZXJhY3Rpb24ubW92ZSgpJyk7XG4gICAgdGhpcy5jb29yZHMgPSB7XG4gICAgICAvLyBTdGFydGluZyBJbnRlcmFjdEV2ZW50IHBvaW50ZXIgY29vcmRpbmF0ZXNcbiAgICAgIHN0YXJ0OiB1dGlscy5wb2ludGVyLm5ld0Nvb3JkcygpLFxuICAgICAgLy8gUHJldmlvdXMgbmF0aXZlIHBvaW50ZXIgbW92ZSBldmVudCBjb29yZGluYXRlc1xuICAgICAgcHJldjogdXRpbHMucG9pbnRlci5uZXdDb29yZHMoKSxcbiAgICAgIC8vIGN1cnJlbnQgbmF0aXZlIHBvaW50ZXIgbW92ZSBldmVudCBjb29yZGluYXRlc1xuICAgICAgY3VyOiB1dGlscy5wb2ludGVyLm5ld0Nvb3JkcygpLFxuICAgICAgLy8gQ2hhbmdlIGluIGNvb3JkaW5hdGVzIGFuZCB0aW1lIG9mIHRoZSBwb2ludGVyXG4gICAgICBkZWx0YTogdXRpbHMucG9pbnRlci5uZXdDb29yZHMoKSxcbiAgICAgIC8vIHBvaW50ZXIgdmVsb2NpdHlcbiAgICAgIHZlbG9jaXR5OiB1dGlscy5wb2ludGVyLm5ld0Nvb3JkcygpXG4gICAgfTtcbiAgICB0aGlzLl9zaWduYWxzID0gc2lnbmFscztcbiAgICB0aGlzLnBvaW50ZXJUeXBlID0gcG9pbnRlclR5cGU7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHRoaXMuX3Byb3h5ID0ge1xuICAgICAgZ2V0IHBvaW50ZXJJc0Rvd24oKSB7XG4gICAgICAgIHJldHVybiB0aGF0LnBvaW50ZXJJc0Rvd247XG4gICAgICB9LFxuXG4gICAgICBnZXQgcG9pbnRlcldhc01vdmVkKCkge1xuICAgICAgICByZXR1cm4gdGhhdC5wb2ludGVyV2FzTW92ZWQ7XG4gICAgICB9LFxuXG4gICAgICBzdGFydDogZnVuY3Rpb24gc3RhcnQoYWN0aW9uLCBpLCBlKSB7XG4gICAgICAgIHJldHVybiB0aGF0LnN0YXJ0KGFjdGlvbiwgaSwgZSk7XG4gICAgICB9LFxuICAgICAgbW92ZTogZnVuY3Rpb24gbW92ZShhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoYXQubW92ZShhcmcpO1xuICAgICAgfSxcbiAgICAgIGVuZDogZnVuY3Rpb24gZW5kKGV2ZW50KSB7XG4gICAgICAgIHJldHVybiB0aGF0LmVuZChldmVudCk7XG4gICAgICB9LFxuICAgICAgc3RvcDogZnVuY3Rpb24gc3RvcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoYXQuc3RvcCgpO1xuICAgICAgfSxcbiAgICAgIGludGVyYWN0aW5nOiBmdW5jdGlvbiBpbnRlcmFjdGluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoYXQuaW50ZXJhY3RpbmcoKTtcbiAgICAgIH0sXG5cbiAgICAgIGdldCBfcHJveHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgfTtcblxuICAgIHRoaXMuX3NpZ25hbHMuZmlyZSgnbmV3Jywge1xuICAgICAgaW50ZXJhY3Rpb246IHRoaXNcbiAgICB9KTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhJbnRlcmFjdGlvbiwgW3tcbiAgICBrZXk6IFwicG9pbnRlckRvd25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcG9pbnRlckRvd24ocG9pbnRlciwgZXZlbnQsIGV2ZW50VGFyZ2V0KSB7XG4gICAgICB2YXIgcG9pbnRlckluZGV4ID0gdGhpcy51cGRhdGVQb2ludGVyKHBvaW50ZXIsIGV2ZW50LCBldmVudFRhcmdldCwgdHJ1ZSk7XG5cbiAgICAgIHRoaXMuX3NpZ25hbHMuZmlyZSgnZG93bicsIHtcbiAgICAgICAgcG9pbnRlcjogcG9pbnRlcixcbiAgICAgICAgZXZlbnQ6IGV2ZW50LFxuICAgICAgICBldmVudFRhcmdldDogZXZlbnRUYXJnZXQsXG4gICAgICAgIHBvaW50ZXJJbmRleDogcG9pbnRlckluZGV4LFxuICAgICAgICBpbnRlcmFjdGlvbjogdGhpc1xuICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGBgYGpzXG4gICAgICogaW50ZXJhY3QodGFyZ2V0KVxuICAgICAqICAgLmRyYWdnYWJsZSh7XG4gICAgICogICAgIC8vIGRpc2FibGUgdGhlIGRlZmF1bHQgZHJhZyBzdGFydCBieSBkb3duLT5tb3ZlXG4gICAgICogICAgIG1hbnVhbFN0YXJ0OiB0cnVlXG4gICAgICogICB9KVxuICAgICAqICAgLy8gc3RhcnQgZHJhZ2dpbmcgYWZ0ZXIgdGhlIHVzZXIgaG9sZHMgdGhlIHBvaW50ZXIgZG93blxuICAgICAqICAgLm9uKCdob2xkJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICogICAgIHZhciBpbnRlcmFjdGlvbiA9IGV2ZW50LmludGVyYWN0aW9uXG4gICAgICpcbiAgICAgKiAgICAgaWYgKCFpbnRlcmFjdGlvbi5pbnRlcmFjdGluZygpKSB7XG4gICAgICogICAgICAgaW50ZXJhY3Rpb24uc3RhcnQoeyBuYW1lOiAnZHJhZycgfSxcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5pbnRlcmFjdGFibGUsXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuY3VycmVudFRhcmdldClcbiAgICAgKiAgICAgfVxuICAgICAqIH0pXG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBTdGFydCBhbiBhY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gSW50ZXJhY3RhYmxlIGFuZCBFbGVtZW50IGFzIHRhcnRnZXRzLiBUaGVcbiAgICAgKiBhY3Rpb24gbXVzdCBiZSBlbmFibGVkIGZvciB0aGUgdGFyZ2V0IEludGVyYWN0YWJsZSBhbmQgYW4gYXBwcm9wcmlhdGVcbiAgICAgKiBudW1iZXIgb2YgcG9pbnRlcnMgbXVzdCBiZSBoZWxkIGRvd24gLSAxIGZvciBkcmFnL3Jlc2l6ZSwgMiBmb3IgZ2VzdHVyZS5cbiAgICAgKlxuICAgICAqIFVzZSBpdCB3aXRoIGBpbnRlcmFjdGFibGUuPGFjdGlvbj5hYmxlKHsgbWFudWFsU3RhcnQ6IGZhbHNlIH0pYCB0byBhbHdheXNcbiAgICAgKiBbc3RhcnQgYWN0aW9ucyBtYW51YWxseV0oaHR0cHM6Ly9naXRodWIuY29tL3RheWUvaW50ZXJhY3QuanMvaXNzdWVzLzExNClcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBhY3Rpb24gICBUaGUgYWN0aW9uIHRvIGJlIHBlcmZvcm1lZCAtIGRyYWcsIHJlc2l6ZSwgZXRjLlxuICAgICAqIEBwYXJhbSB7SW50ZXJhY3RhYmxlfSB0YXJnZXQgIFRoZSBJbnRlcmFjdGFibGUgdG8gdGFyZ2V0XG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IFRoZSBET00gRWxlbWVudCB0byB0YXJnZXRcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9IGludGVyYWN0XG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJzdGFydFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdGFydChhY3Rpb24sIGludGVyYWN0YWJsZSwgZWxlbWVudCkge1xuICAgICAgaWYgKHRoaXMuaW50ZXJhY3RpbmcoKSB8fCAhdGhpcy5wb2ludGVySXNEb3duIHx8IHRoaXMucG9pbnRlcnMubGVuZ3RoIDwgKGFjdGlvbi5uYW1lID09PSBfc2NvcGUuQWN0aW9uTmFtZS5HZXN0dXJlID8gMiA6IDEpIHx8ICFpbnRlcmFjdGFibGUub3B0aW9uc1thY3Rpb24ubmFtZV0uZW5hYmxlZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHV0aWxzLmNvcHlBY3Rpb24odGhpcy5wcmVwYXJlZCwgYWN0aW9uKTtcbiAgICAgIHRoaXMuaW50ZXJhY3RhYmxlID0gaW50ZXJhY3RhYmxlO1xuICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICAgIHRoaXMucmVjdCA9IGludGVyYWN0YWJsZS5nZXRSZWN0KGVsZW1lbnQpO1xuICAgICAgdGhpcy5lZGdlcyA9IHRoaXMucHJlcGFyZWQuZWRnZXM7XG4gICAgICB0aGlzLl9pbnRlcmFjdGluZyA9IHRoaXMuX2RvUGhhc2Uoe1xuICAgICAgICBpbnRlcmFjdGlvbjogdGhpcyxcbiAgICAgICAgZXZlbnQ6IHRoaXMuZG93bkV2ZW50LFxuICAgICAgICBwaGFzZTogX0ludGVyYWN0RXZlbnQuRXZlbnRQaGFzZS5TdGFydFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcy5faW50ZXJhY3Rpbmc7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInBvaW50ZXJNb3ZlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHBvaW50ZXJNb3ZlKHBvaW50ZXIsIGV2ZW50LCBldmVudFRhcmdldCkge1xuICAgICAgaWYgKCF0aGlzLnNpbXVsYXRpb24pIHtcbiAgICAgICAgdGhpcy51cGRhdGVQb2ludGVyKHBvaW50ZXIsIGV2ZW50LCBldmVudFRhcmdldCwgZmFsc2UpO1xuICAgICAgICB1dGlscy5wb2ludGVyLnNldENvb3Jkcyh0aGlzLmNvb3Jkcy5jdXIsIHRoaXMucG9pbnRlcnMubWFwKGZ1bmN0aW9uIChwKSB7XG4gICAgICAgICAgcmV0dXJuIHAucG9pbnRlcjtcbiAgICAgICAgfSksIHRoaXMuX25vdygpKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGR1cGxpY2F0ZU1vdmUgPSB0aGlzLmNvb3Jkcy5jdXIucGFnZS54ID09PSB0aGlzLmNvb3Jkcy5wcmV2LnBhZ2UueCAmJiB0aGlzLmNvb3Jkcy5jdXIucGFnZS55ID09PSB0aGlzLmNvb3Jkcy5wcmV2LnBhZ2UueSAmJiB0aGlzLmNvb3Jkcy5jdXIuY2xpZW50LnggPT09IHRoaXMuY29vcmRzLnByZXYuY2xpZW50LnggJiYgdGhpcy5jb29yZHMuY3VyLmNsaWVudC55ID09PSB0aGlzLmNvb3Jkcy5wcmV2LmNsaWVudC55O1xuICAgICAgdmFyIGR4O1xuICAgICAgdmFyIGR5OyAvLyByZWdpc3RlciBtb3ZlbWVudCBncmVhdGVyIHRoYW4gcG9pbnRlck1vdmVUb2xlcmFuY2VcblxuICAgICAgaWYgKHRoaXMucG9pbnRlcklzRG93biAmJiAhdGhpcy5wb2ludGVyV2FzTW92ZWQpIHtcbiAgICAgICAgZHggPSB0aGlzLmNvb3Jkcy5jdXIuY2xpZW50LnggLSB0aGlzLmNvb3Jkcy5zdGFydC5jbGllbnQueDtcbiAgICAgICAgZHkgPSB0aGlzLmNvb3Jkcy5jdXIuY2xpZW50LnkgLSB0aGlzLmNvb3Jkcy5zdGFydC5jbGllbnQueTtcbiAgICAgICAgdGhpcy5wb2ludGVyV2FzTW92ZWQgPSB1dGlscy5oeXBvdChkeCwgZHkpID4gdGhpcy5wb2ludGVyTW92ZVRvbGVyYW5jZTtcbiAgICAgIH1cblxuICAgICAgdmFyIHNpZ25hbEFyZyA9IHtcbiAgICAgICAgcG9pbnRlcjogcG9pbnRlcixcbiAgICAgICAgcG9pbnRlckluZGV4OiB0aGlzLmdldFBvaW50ZXJJbmRleChwb2ludGVyKSxcbiAgICAgICAgZXZlbnQ6IGV2ZW50LFxuICAgICAgICBldmVudFRhcmdldDogZXZlbnRUYXJnZXQsXG4gICAgICAgIGR4OiBkeCxcbiAgICAgICAgZHk6IGR5LFxuICAgICAgICBkdXBsaWNhdGU6IGR1cGxpY2F0ZU1vdmUsXG4gICAgICAgIGludGVyYWN0aW9uOiB0aGlzXG4gICAgICB9O1xuXG4gICAgICBpZiAoIWR1cGxpY2F0ZU1vdmUpIHtcbiAgICAgICAgLy8gc2V0IHBvaW50ZXIgY29vcmRpbmF0ZSwgdGltZSBjaGFuZ2VzIGFuZCB2ZWxvY2l0eVxuICAgICAgICB1dGlscy5wb2ludGVyLnNldENvb3JkRGVsdGFzKHRoaXMuY29vcmRzLmRlbHRhLCB0aGlzLmNvb3Jkcy5wcmV2LCB0aGlzLmNvb3Jkcy5jdXIpO1xuICAgICAgICB1dGlscy5wb2ludGVyLnNldENvb3JkVmVsb2NpdHkodGhpcy5jb29yZHMudmVsb2NpdHksIHRoaXMuY29vcmRzLmRlbHRhKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fc2lnbmFscy5maXJlKCdtb3ZlJywgc2lnbmFsQXJnKTtcblxuICAgICAgaWYgKCFkdXBsaWNhdGVNb3ZlKSB7XG4gICAgICAgIC8vIGlmIGludGVyYWN0aW5nLCBmaXJlIGFuICdhY3Rpb24tbW92ZScgc2lnbmFsIGV0Y1xuICAgICAgICBpZiAodGhpcy5pbnRlcmFjdGluZygpKSB7XG4gICAgICAgICAgdGhpcy5tb3ZlKHNpZ25hbEFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5wb2ludGVyV2FzTW92ZWQpIHtcbiAgICAgICAgICB1dGlscy5wb2ludGVyLmNvcHlDb29yZHModGhpcy5jb29yZHMucHJldiwgdGhpcy5jb29yZHMuY3VyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBgYGBqc1xuICAgICAqIGludGVyYWN0KHRhcmdldClcbiAgICAgKiAgIC5kcmFnZ2FibGUodHJ1ZSlcbiAgICAgKiAgIC5vbignZHJhZ21vdmUnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgKiAgICAgaWYgKHNvbWVDb25kaXRpb24pIHtcbiAgICAgKiAgICAgICAvLyBjaGFuZ2UgdGhlIHNuYXAgc2V0dGluZ3NcbiAgICAgKiAgICAgICBldmVudC5pbnRlcmFjdGFibGUuZHJhZ2dhYmxlKHsgc25hcDogeyB0YXJnZXRzOiBbXSB9fSlcbiAgICAgKiAgICAgICAvLyBmaXJlIGFub3RoZXIgbW92ZSBldmVudCB3aXRoIHJlLWNhbGN1bGF0ZWQgc25hcFxuICAgICAqICAgICAgIGV2ZW50LmludGVyYWN0aW9uLm1vdmUoKVxuICAgICAqICAgICB9XG4gICAgICogICB9KVxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogRm9yY2UgYSBtb3ZlIG9mIHRoZSBjdXJyZW50IGFjdGlvbiBhdCB0aGUgc2FtZSBjb29yZGluYXRlcy4gVXNlZnVsIGlmXG4gICAgICogc25hcC9yZXN0cmljdCBoYXMgYmVlbiBjaGFuZ2VkIGFuZCB5b3Ugd2FudCBhIG1vdmVtZW50IHdpdGggdGhlIG5ld1xuICAgICAqIHNldHRpbmdzLlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwibW92ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtb3ZlKHNpZ25hbEFyZykge1xuICAgICAgc2lnbmFsQXJnID0gdXRpbHMuZXh0ZW5kKHtcbiAgICAgICAgcG9pbnRlcjogdGhpcy5fbGF0ZXN0UG9pbnRlci5wb2ludGVyLFxuICAgICAgICBldmVudDogdGhpcy5fbGF0ZXN0UG9pbnRlci5ldmVudCxcbiAgICAgICAgZXZlbnRUYXJnZXQ6IHRoaXMuX2xhdGVzdFBvaW50ZXIuZXZlbnRUYXJnZXQsXG4gICAgICAgIGludGVyYWN0aW9uOiB0aGlzXG4gICAgICB9LCBzaWduYWxBcmcgfHwge30pO1xuICAgICAgc2lnbmFsQXJnLnBoYXNlID0gX0ludGVyYWN0RXZlbnQuRXZlbnRQaGFzZS5Nb3ZlO1xuXG4gICAgICB0aGlzLl9kb1BoYXNlKHNpZ25hbEFyZyk7XG4gICAgfSAvLyBFbmQgaW50ZXJhY3QgbW92ZSBldmVudHMgYW5kIHN0b3AgYXV0by1zY3JvbGwgdW5sZXNzIHNpbXVsYXRpb24gaXMgcnVubmluZ1xuXG4gIH0sIHtcbiAgICBrZXk6IFwicG9pbnRlclVwXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHBvaW50ZXJVcChwb2ludGVyLCBldmVudCwgZXZlbnRUYXJnZXQsIGN1ckV2ZW50VGFyZ2V0KSB7XG4gICAgICB2YXIgcG9pbnRlckluZGV4ID0gdGhpcy5nZXRQb2ludGVySW5kZXgocG9pbnRlcik7XG5cbiAgICAgIGlmIChwb2ludGVySW5kZXggPT09IC0xKSB7XG4gICAgICAgIHBvaW50ZXJJbmRleCA9IHRoaXMudXBkYXRlUG9pbnRlcihwb2ludGVyLCBldmVudCwgZXZlbnRUYXJnZXQsIGZhbHNlKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fc2lnbmFscy5maXJlKC9jYW5jZWwkL2kudGVzdChldmVudC50eXBlKSA/ICdjYW5jZWwnIDogJ3VwJywge1xuICAgICAgICBwb2ludGVyOiBwb2ludGVyLFxuICAgICAgICBwb2ludGVySW5kZXg6IHBvaW50ZXJJbmRleCxcbiAgICAgICAgZXZlbnQ6IGV2ZW50LFxuICAgICAgICBldmVudFRhcmdldDogZXZlbnRUYXJnZXQsXG4gICAgICAgIGN1ckV2ZW50VGFyZ2V0OiBjdXJFdmVudFRhcmdldCxcbiAgICAgICAgaW50ZXJhY3Rpb246IHRoaXNcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIXRoaXMuc2ltdWxhdGlvbikge1xuICAgICAgICB0aGlzLmVuZChldmVudCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucG9pbnRlcklzRG93biA9IGZhbHNlO1xuICAgICAgdGhpcy5yZW1vdmVQb2ludGVyKHBvaW50ZXIsIGV2ZW50KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZG9jdW1lbnRCbHVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRvY3VtZW50Qmx1cihldmVudCkge1xuICAgICAgdGhpcy5lbmQoZXZlbnQpO1xuXG4gICAgICB0aGlzLl9zaWduYWxzLmZpcmUoJ2JsdXInLCB7XG4gICAgICAgIGV2ZW50OiBldmVudCxcbiAgICAgICAgaW50ZXJhY3Rpb246IHRoaXNcbiAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBgYGBqc1xuICAgICAqIGludGVyYWN0KHRhcmdldClcbiAgICAgKiAgIC5kcmFnZ2FibGUodHJ1ZSlcbiAgICAgKiAgIC5vbignbW92ZScsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAqICAgICBpZiAoZXZlbnQucGFnZVggPiAxMDAwKSB7XG4gICAgICogICAgICAgLy8gZW5kIHRoZSBjdXJyZW50IGFjdGlvblxuICAgICAqICAgICAgIGV2ZW50LmludGVyYWN0aW9uLmVuZCgpXG4gICAgICogICAgICAgLy8gc3RvcCBhbGwgZnVydGhlciBsaXN0ZW5lcnMgZnJvbSBiZWluZyBjYWxsZWRcbiAgICAgKiAgICAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKVxuICAgICAqICAgICB9XG4gICAgICogICB9KVxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQHBhcmFtIHtQb2ludGVyRXZlbnR9IFtldmVudF1cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcImVuZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBlbmQoZXZlbnQpIHtcbiAgICAgIHRoaXMuX2VuZGluZyA9IHRydWU7XG4gICAgICBldmVudCA9IGV2ZW50IHx8IHRoaXMuX2xhdGVzdFBvaW50ZXIuZXZlbnQ7XG4gICAgICB2YXIgZW5kUGhhc2VSZXN1bHQ7XG5cbiAgICAgIGlmICh0aGlzLmludGVyYWN0aW5nKCkpIHtcbiAgICAgICAgZW5kUGhhc2VSZXN1bHQgPSB0aGlzLl9kb1BoYXNlKHtcbiAgICAgICAgICBldmVudDogZXZlbnQsXG4gICAgICAgICAgaW50ZXJhY3Rpb246IHRoaXMsXG4gICAgICAgICAgcGhhc2U6IF9JbnRlcmFjdEV2ZW50LkV2ZW50UGhhc2UuRW5kXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9lbmRpbmcgPSBmYWxzZTtcblxuICAgICAgaWYgKGVuZFBoYXNlUmVzdWx0ID09PSB0cnVlKSB7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjdXJyZW50QWN0aW9uXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGN1cnJlbnRBY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5faW50ZXJhY3RpbmcgPyB0aGlzLnByZXBhcmVkLm5hbWUgOiBudWxsO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJpbnRlcmFjdGluZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpbnRlcmFjdGluZygpIHtcbiAgICAgIHJldHVybiB0aGlzLl9pbnRlcmFjdGluZztcbiAgICB9XG4gICAgLyoqICovXG5cbiAgfSwge1xuICAgIGtleTogXCJzdG9wXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgICB0aGlzLl9zaWduYWxzLmZpcmUoJ3N0b3AnLCB7XG4gICAgICAgIGludGVyYWN0aW9uOiB0aGlzXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5pbnRlcmFjdGFibGUgPSB0aGlzLmVsZW1lbnQgPSBudWxsO1xuICAgICAgdGhpcy5faW50ZXJhY3RpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMucHJlcGFyZWQubmFtZSA9IHRoaXMucHJldkV2ZW50ID0gbnVsbDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0UG9pbnRlckluZGV4XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFBvaW50ZXJJbmRleChwb2ludGVyKSB7XG4gICAgICB2YXIgcG9pbnRlcklkID0gdXRpbHMucG9pbnRlci5nZXRQb2ludGVySWQocG9pbnRlcik7IC8vIG1vdXNlIGFuZCBwZW4gaW50ZXJhY3Rpb25zIG1heSBoYXZlIG9ubHkgb25lIHBvaW50ZXJcblxuICAgICAgcmV0dXJuIHRoaXMucG9pbnRlclR5cGUgPT09ICdtb3VzZScgfHwgdGhpcy5wb2ludGVyVHlwZSA9PT0gJ3BlbicgPyB0aGlzLnBvaW50ZXJzLmxlbmd0aCAtIDEgOiB1dGlscy5hcnIuZmluZEluZGV4KHRoaXMucG9pbnRlcnMsIGZ1bmN0aW9uIChjdXJQb2ludGVyKSB7XG4gICAgICAgIHJldHVybiBjdXJQb2ludGVyLmlkID09PSBwb2ludGVySWQ7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0UG9pbnRlckluZm9cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0UG9pbnRlckluZm8ocG9pbnRlcikge1xuICAgICAgcmV0dXJuIHRoaXMucG9pbnRlcnNbdGhpcy5nZXRQb2ludGVySW5kZXgocG9pbnRlcildO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ1cGRhdGVQb2ludGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZVBvaW50ZXIocG9pbnRlciwgZXZlbnQsIGV2ZW50VGFyZ2V0LCBkb3duKSB7XG4gICAgICB2YXIgaWQgPSB1dGlscy5wb2ludGVyLmdldFBvaW50ZXJJZChwb2ludGVyKTtcbiAgICAgIHZhciBwb2ludGVySW5kZXggPSB0aGlzLmdldFBvaW50ZXJJbmRleChwb2ludGVyKTtcbiAgICAgIHZhciBwb2ludGVySW5mbyA9IHRoaXMucG9pbnRlcnNbcG9pbnRlckluZGV4XTtcbiAgICAgIGRvd24gPSBkb3duID09PSBmYWxzZSA/IGZhbHNlIDogZG93biB8fCAvKGRvd258c3RhcnQpJC9pLnRlc3QoZXZlbnQudHlwZSk7XG5cbiAgICAgIGlmICghcG9pbnRlckluZm8pIHtcbiAgICAgICAgcG9pbnRlckluZm8gPSBuZXcgX1BvaW50ZXJJbmZvW1wiZGVmYXVsdFwiXShpZCwgcG9pbnRlciwgZXZlbnQsIG51bGwsIG51bGwpO1xuICAgICAgICBwb2ludGVySW5kZXggPSB0aGlzLnBvaW50ZXJzLmxlbmd0aDtcbiAgICAgICAgdGhpcy5wb2ludGVycy5wdXNoKHBvaW50ZXJJbmZvKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBvaW50ZXJJbmZvLnBvaW50ZXIgPSBwb2ludGVyO1xuICAgICAgfVxuXG4gICAgICBpZiAoZG93bikge1xuICAgICAgICB0aGlzLnBvaW50ZXJJc0Rvd24gPSB0cnVlO1xuXG4gICAgICAgIGlmICghdGhpcy5pbnRlcmFjdGluZygpKSB7XG4gICAgICAgICAgdXRpbHMucG9pbnRlci5zZXRDb29yZHModGhpcy5jb29yZHMuc3RhcnQsIHRoaXMucG9pbnRlcnMubWFwKGZ1bmN0aW9uIChwKSB7XG4gICAgICAgICAgICByZXR1cm4gcC5wb2ludGVyO1xuICAgICAgICAgIH0pLCB0aGlzLl9ub3coKSk7XG4gICAgICAgICAgdXRpbHMucG9pbnRlci5jb3B5Q29vcmRzKHRoaXMuY29vcmRzLmN1ciwgdGhpcy5jb29yZHMuc3RhcnQpO1xuICAgICAgICAgIHV0aWxzLnBvaW50ZXIuY29weUNvb3Jkcyh0aGlzLmNvb3Jkcy5wcmV2LCB0aGlzLmNvb3Jkcy5zdGFydCk7XG4gICAgICAgICAgdXRpbHMucG9pbnRlci5wb2ludGVyRXh0ZW5kKHRoaXMuZG93blBvaW50ZXIsIHBvaW50ZXIpO1xuICAgICAgICAgIHRoaXMuZG93bkV2ZW50ID0gZXZlbnQ7XG4gICAgICAgICAgcG9pbnRlckluZm8uZG93blRpbWUgPSB0aGlzLmNvb3Jkcy5jdXIudGltZVN0YW1wO1xuICAgICAgICAgIHBvaW50ZXJJbmZvLmRvd25UYXJnZXQgPSBldmVudFRhcmdldDtcbiAgICAgICAgICB0aGlzLnBvaW50ZXJXYXNNb3ZlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3VwZGF0ZUxhdGVzdFBvaW50ZXIocG9pbnRlciwgZXZlbnQsIGV2ZW50VGFyZ2V0KTtcblxuICAgICAgdGhpcy5fc2lnbmFscy5maXJlKCd1cGRhdGUtcG9pbnRlcicsIHtcbiAgICAgICAgcG9pbnRlcjogcG9pbnRlcixcbiAgICAgICAgZXZlbnQ6IGV2ZW50LFxuICAgICAgICBldmVudFRhcmdldDogZXZlbnRUYXJnZXQsXG4gICAgICAgIGRvd246IGRvd24sXG4gICAgICAgIHBvaW50ZXJJbmZvOiBwb2ludGVySW5mbyxcbiAgICAgICAgcG9pbnRlckluZGV4OiBwb2ludGVySW5kZXgsXG4gICAgICAgIGludGVyYWN0aW9uOiB0aGlzXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHBvaW50ZXJJbmRleDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVtb3ZlUG9pbnRlclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmVQb2ludGVyKHBvaW50ZXIsIGV2ZW50KSB7XG4gICAgICB2YXIgcG9pbnRlckluZGV4ID0gdGhpcy5nZXRQb2ludGVySW5kZXgocG9pbnRlcik7XG5cbiAgICAgIGlmIChwb2ludGVySW5kZXggPT09IC0xKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHBvaW50ZXJJbmZvID0gdGhpcy5wb2ludGVyc1twb2ludGVySW5kZXhdO1xuXG4gICAgICB0aGlzLl9zaWduYWxzLmZpcmUoJ3JlbW92ZS1wb2ludGVyJywge1xuICAgICAgICBwb2ludGVyOiBwb2ludGVyLFxuICAgICAgICBldmVudDogZXZlbnQsXG4gICAgICAgIHBvaW50ZXJJbmRleDogcG9pbnRlckluZGV4LFxuICAgICAgICBwb2ludGVySW5mbzogcG9pbnRlckluZm8sXG4gICAgICAgIGludGVyYWN0aW9uOiB0aGlzXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5wb2ludGVycy5zcGxpY2UocG9pbnRlckluZGV4LCAxKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiX3VwZGF0ZUxhdGVzdFBvaW50ZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX3VwZGF0ZUxhdGVzdFBvaW50ZXIocG9pbnRlciwgZXZlbnQsIGV2ZW50VGFyZ2V0KSB7XG4gICAgICB0aGlzLl9sYXRlc3RQb2ludGVyLnBvaW50ZXIgPSBwb2ludGVyO1xuICAgICAgdGhpcy5fbGF0ZXN0UG9pbnRlci5ldmVudCA9IGV2ZW50O1xuICAgICAgdGhpcy5fbGF0ZXN0UG9pbnRlci5ldmVudFRhcmdldCA9IGV2ZW50VGFyZ2V0O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJfY3JlYXRlUHJlcGFyZWRFdmVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfY3JlYXRlUHJlcGFyZWRFdmVudChldmVudCwgcGhhc2UsIHByZUVuZCwgdHlwZSkge1xuICAgICAgdmFyIGFjdGlvbk5hbWUgPSB0aGlzLnByZXBhcmVkLm5hbWU7XG4gICAgICByZXR1cm4gbmV3IF9JbnRlcmFjdEV2ZW50W1wiZGVmYXVsdFwiXSh0aGlzLCBldmVudCwgYWN0aW9uTmFtZSwgcGhhc2UsIHRoaXMuZWxlbWVudCwgbnVsbCwgcHJlRW5kLCB0eXBlKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiX2ZpcmVFdmVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfZmlyZUV2ZW50KGlFdmVudCkge1xuICAgICAgdGhpcy5pbnRlcmFjdGFibGUuZmlyZShpRXZlbnQpO1xuXG4gICAgICBpZiAoIXRoaXMucHJldkV2ZW50IHx8IGlFdmVudC50aW1lU3RhbXAgPj0gdGhpcy5wcmV2RXZlbnQudGltZVN0YW1wKSB7XG4gICAgICAgIHRoaXMucHJldkV2ZW50ID0gaUV2ZW50O1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJfZG9QaGFzZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfZG9QaGFzZShzaWduYWxBcmcpIHtcbiAgICAgIHZhciBldmVudCA9IHNpZ25hbEFyZy5ldmVudCxcbiAgICAgICAgICBwaGFzZSA9IHNpZ25hbEFyZy5waGFzZSxcbiAgICAgICAgICBwcmVFbmQgPSBzaWduYWxBcmcucHJlRW5kLFxuICAgICAgICAgIHR5cGUgPSBzaWduYWxBcmcudHlwZTtcblxuICAgICAgdmFyIGJlZm9yZVJlc3VsdCA9IHRoaXMuX3NpZ25hbHMuZmlyZShcImJlZm9yZS1hY3Rpb24tXCIuY29uY2F0KHBoYXNlKSwgc2lnbmFsQXJnKTtcblxuICAgICAgaWYgKGJlZm9yZVJlc3VsdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICB2YXIgaUV2ZW50ID0gc2lnbmFsQXJnLmlFdmVudCA9IHRoaXMuX2NyZWF0ZVByZXBhcmVkRXZlbnQoZXZlbnQsIHBoYXNlLCBwcmVFbmQsIHR5cGUpO1xuXG4gICAgICB2YXIgcmVjdCA9IHRoaXMucmVjdDtcblxuICAgICAgaWYgKHJlY3QpIHtcbiAgICAgICAgLy8gdXBkYXRlIHRoZSByZWN0IG1vZGlmaWNhdGlvbnNcbiAgICAgICAgdmFyIGVkZ2VzID0gdGhpcy5lZGdlcyB8fCB0aGlzLnByZXBhcmVkLmVkZ2VzIHx8IHtcbiAgICAgICAgICBsZWZ0OiB0cnVlLFxuICAgICAgICAgIHJpZ2h0OiB0cnVlLFxuICAgICAgICAgIHRvcDogdHJ1ZSxcbiAgICAgICAgICBib3R0b206IHRydWVcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoZWRnZXMudG9wKSB7XG4gICAgICAgICAgcmVjdC50b3AgKz0gaUV2ZW50LmRlbHRhLnk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZWRnZXMuYm90dG9tKSB7XG4gICAgICAgICAgcmVjdC5ib3R0b20gKz0gaUV2ZW50LmRlbHRhLnk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZWRnZXMubGVmdCkge1xuICAgICAgICAgIHJlY3QubGVmdCArPSBpRXZlbnQuZGVsdGEueDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlZGdlcy5yaWdodCkge1xuICAgICAgICAgIHJlY3QucmlnaHQgKz0gaUV2ZW50LmRlbHRhLng7XG4gICAgICAgIH1cblxuICAgICAgICByZWN0LndpZHRoID0gcmVjdC5yaWdodCAtIHJlY3QubGVmdDtcbiAgICAgICAgcmVjdC5oZWlnaHQgPSByZWN0LmJvdHRvbSAtIHJlY3QudG9wO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9zaWduYWxzLmZpcmUoXCJhY3Rpb24tXCIuY29uY2F0KHBoYXNlKSwgc2lnbmFsQXJnKTtcblxuICAgICAgdGhpcy5fZmlyZUV2ZW50KGlFdmVudCk7XG5cbiAgICAgIHRoaXMuX3NpZ25hbHMuZmlyZShcImFmdGVyLWFjdGlvbi1cIi5jb25jYXQocGhhc2UpLCBzaWduYWxBcmcpO1xuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiX25vd1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfbm93KCkge1xuICAgICAgcmV0dXJuIERhdGUubm93KCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInBvaW50ZXJNb3ZlVG9sZXJhbmNlXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gSW50ZXJhY3Rpb247XG59KCk7XG5cbmV4cG9ydHMuSW50ZXJhY3Rpb24gPSBJbnRlcmFjdGlvbjtcbnZhciBfZGVmYXVsdCA9IEludGVyYWN0aW9uO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBfZGVmYXVsdDtcblxufSx7XCIuL0ludGVyYWN0RXZlbnRcIjoxNSxcIi4vUG9pbnRlckluZm9cIjoxOSxcIi4vc2NvcGVcIjoyNCxcIkBpbnRlcmFjdGpzL3V0aWxzXCI6NTV9XSwxOTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gZXhwb3J0cy5Qb2ludGVySW5mbyA9IHZvaWQgMDtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIFBvaW50ZXJJbmZvID0gZnVuY3Rpb24gUG9pbnRlckluZm8oaWQsIHBvaW50ZXIsIGV2ZW50LCBkb3duVGltZSwgZG93blRhcmdldCkge1xuICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUG9pbnRlckluZm8pO1xuXG4gIHRoaXMuaWQgPSBpZDtcbiAgdGhpcy5wb2ludGVyID0gcG9pbnRlcjtcbiAgdGhpcy5ldmVudCA9IGV2ZW50O1xuICB0aGlzLmRvd25UaW1lID0gZG93blRpbWU7XG4gIHRoaXMuZG93blRhcmdldCA9IGRvd25UYXJnZXQ7XG59O1xuXG5leHBvcnRzLlBvaW50ZXJJbmZvID0gUG9pbnRlckluZm87XG52YXIgX2RlZmF1bHQgPSBQb2ludGVySW5mbztcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5cbn0se31dLDIwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBleHBvcnRzLmRlZmF1bHRzID0gdm9pZCAwO1xuLy8gdHNsaW50OmRpc2FibGUgbm8tZW1wdHktaW50ZXJmYWNlXG52YXIgZGVmYXVsdHMgPSB7XG4gIGJhc2U6IHtcbiAgICBwcmV2ZW50RGVmYXVsdDogJ2F1dG8nLFxuICAgIGRlbHRhU291cmNlOiAncGFnZSdcbiAgfSxcbiAgcGVyQWN0aW9uOiB7XG4gICAgZW5hYmxlZDogZmFsc2UsXG4gICAgb3JpZ2luOiB7XG4gICAgICB4OiAwLFxuICAgICAgeTogMFxuICAgIH1cbiAgfSxcbiAgYWN0aW9uczoge31cbn07XG5leHBvcnRzLmRlZmF1bHRzID0gZGVmYXVsdHM7XG52YXIgX2RlZmF1bHQgPSBkZWZhdWx0cztcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5cbn0se31dLDIxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5pbnN0YWxsID0gaW5zdGFsbDtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX2RvbVV0aWxzID0gcmVxdWlyZShcIkBpbnRlcmFjdGpzL3V0aWxzL2RvbVV0aWxzXCIpO1xuXG52YXIgX2V2ZW50cyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIkBpbnRlcmFjdGpzL3V0aWxzL2V2ZW50c1wiKSk7XG5cbnZhciBpcyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy91dGlscy9pc1wiKSk7XG5cbnZhciBfd2luZG93ID0gcmVxdWlyZShcIkBpbnRlcmFjdGpzL3V0aWxzL3dpbmRvd1wiKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iajsgfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgeyB2YXIgZGVzYyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID8gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIGtleSkgOiB7fTsgaWYgKGRlc2MuZ2V0IHx8IGRlc2Muc2V0KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuZXdPYmosIGtleSwgZGVzYyk7IH0gZWxzZSB7IG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSB9IH0gbmV3T2JqW1wiZGVmYXVsdFwiXSA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBwcmV2ZW50RGVmYXVsdChpbnRlcmFjdGFibGUsIG5ld1ZhbHVlKSB7XG4gIGlmICgvXihhbHdheXN8bmV2ZXJ8YXV0bykkLy50ZXN0KG5ld1ZhbHVlKSkge1xuICAgIGludGVyYWN0YWJsZS5vcHRpb25zLnByZXZlbnREZWZhdWx0ID0gbmV3VmFsdWU7XG4gICAgcmV0dXJuIGludGVyYWN0YWJsZTtcbiAgfVxuXG4gIGlmIChpcy5ib29sKG5ld1ZhbHVlKSkge1xuICAgIGludGVyYWN0YWJsZS5vcHRpb25zLnByZXZlbnREZWZhdWx0ID0gbmV3VmFsdWUgPyAnYWx3YXlzJyA6ICduZXZlcic7XG4gICAgcmV0dXJuIGludGVyYWN0YWJsZTtcbiAgfVxuXG4gIHJldHVybiBpbnRlcmFjdGFibGUub3B0aW9ucy5wcmV2ZW50RGVmYXVsdDtcbn1cblxuZnVuY3Rpb24gY2hlY2tBbmRQcmV2ZW50RGVmYXVsdChpbnRlcmFjdGFibGUsIHNjb3BlLCBldmVudCkge1xuICB2YXIgc2V0dGluZyA9IGludGVyYWN0YWJsZS5vcHRpb25zLnByZXZlbnREZWZhdWx0O1xuXG4gIGlmIChzZXR0aW5nID09PSAnbmV2ZXInKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHNldHRpbmcgPT09ICdhbHdheXMnKSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICByZXR1cm47XG4gIH0gLy8gc2V0dGluZyA9PT0gJ2F1dG8nXG4gIC8vIGlmIHRoZSBicm93c2VyIHN1cHBvcnRzIHBhc3NpdmUgZXZlbnQgbGlzdGVuZXJzIGFuZCBpc24ndCBydW5uaW5nIG9uIGlPUyxcbiAgLy8gZG9uJ3QgcHJldmVudERlZmF1bHQgb2YgdG91Y2h7c3RhcnQsbW92ZX0gZXZlbnRzLiBDU1MgdG91Y2gtYWN0aW9uIGFuZFxuICAvLyB1c2VyLXNlbGVjdCBzaG91bGQgYmUgdXNlZCBpbnN0ZWFkIG9mIGNhbGxpbmcgZXZlbnQucHJldmVudERlZmF1bHQoKS5cblxuXG4gIGlmIChfZXZlbnRzW1wiZGVmYXVsdFwiXS5zdXBwb3J0c1Bhc3NpdmUgJiYgL150b3VjaChzdGFydHxtb3ZlKSQvLnRlc3QoZXZlbnQudHlwZSkpIHtcbiAgICB2YXIgZG9jID0gKDAsIF93aW5kb3cuZ2V0V2luZG93KShldmVudC50YXJnZXQpLmRvY3VtZW50O1xuICAgIHZhciBkb2NPcHRpb25zID0gc2NvcGUuZ2V0RG9jT3B0aW9ucyhkb2MpO1xuXG4gICAgaWYgKCEoZG9jT3B0aW9ucyAmJiBkb2NPcHRpb25zLmV2ZW50cykgfHwgZG9jT3B0aW9ucy5ldmVudHMucGFzc2l2ZSAhPT0gZmFsc2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH0gLy8gZG9uJ3QgcHJldmVudERlZmF1bHQgb2YgcG9pbnRlcmRvd24gZXZlbnRzXG5cblxuICBpZiAoL14obW91c2V8cG9pbnRlcnx0b3VjaCkqKGRvd258c3RhcnQpL2kudGVzdChldmVudC50eXBlKSkge1xuICAgIHJldHVybjtcbiAgfSAvLyBkb24ndCBwcmV2ZW50RGVmYXVsdCBvbiBlZGl0YWJsZSBlbGVtZW50c1xuXG5cbiAgaWYgKGlzLmVsZW1lbnQoZXZlbnQudGFyZ2V0KSAmJiAoMCwgX2RvbVV0aWxzLm1hdGNoZXNTZWxlY3RvcikoZXZlbnQudGFyZ2V0LCAnaW5wdXQsc2VsZWN0LHRleHRhcmVhLFtjb250ZW50ZWRpdGFibGU9dHJ1ZV0sW2NvbnRlbnRlZGl0YWJsZT10cnVlXSAqJykpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xufVxuXG5mdW5jdGlvbiBvbkludGVyYWN0aW9uRXZlbnQoX3JlZikge1xuICB2YXIgaW50ZXJhY3Rpb24gPSBfcmVmLmludGVyYWN0aW9uLFxuICAgICAgZXZlbnQgPSBfcmVmLmV2ZW50O1xuXG4gIGlmIChpbnRlcmFjdGlvbi5pbnRlcmFjdGFibGUpIHtcbiAgICBpbnRlcmFjdGlvbi5pbnRlcmFjdGFibGUuY2hlY2tBbmRQcmV2ZW50RGVmYXVsdChldmVudCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5zdGFsbChzY29wZSkge1xuICAvKiogQGxlbmRzIEludGVyYWN0YWJsZSAqL1xuICB2YXIgSW50ZXJhY3RhYmxlID0gc2NvcGUuSW50ZXJhY3RhYmxlO1xuICAvKipcbiAgICogUmV0dXJucyBvciBzZXRzIHdoZXRoZXIgdG8gcHJldmVudCB0aGUgYnJvd3NlcidzIGRlZmF1bHQgYmVoYXZpb3VyIGluXG4gICAqIHJlc3BvbnNlIHRvIHBvaW50ZXIgZXZlbnRzLiBDYW4gYmUgc2V0IHRvOlxuICAgKiAgLSBgJ2Fsd2F5cydgIHRvIGFsd2F5cyBwcmV2ZW50XG4gICAqICAtIGAnbmV2ZXInYCB0byBuZXZlciBwcmV2ZW50XG4gICAqICAtIGAnYXV0bydgIHRvIGxldCBpbnRlcmFjdC5qcyB0cnkgdG8gZGV0ZXJtaW5lIHdoYXQgd291bGQgYmUgYmVzdFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gW25ld1ZhbHVlXSBgJ2Fsd2F5cydgLCBgJ25ldmVyJ2Agb3IgYCdhdXRvJ2BcbiAgICogQHJldHVybiB7c3RyaW5nIHwgSW50ZXJhY3RhYmxlfSBUaGUgY3VycmVudCBzZXR0aW5nIG9yIHRoaXMgSW50ZXJhY3RhYmxlXG4gICAqL1xuXG4gIEludGVyYWN0YWJsZS5wcm90b3R5cGUucHJldmVudERlZmF1bHQgPSBmdW5jdGlvbiAobmV3VmFsdWUpIHtcbiAgICByZXR1cm4gcHJldmVudERlZmF1bHQodGhpcywgbmV3VmFsdWUpO1xuICB9O1xuXG4gIEludGVyYWN0YWJsZS5wcm90b3R5cGUuY2hlY2tBbmRQcmV2ZW50RGVmYXVsdCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHJldHVybiBjaGVja0FuZFByZXZlbnREZWZhdWx0KHRoaXMsIHNjb3BlLCBldmVudCk7XG4gIH07XG5cbiAgdmFyIF9hcnIgPSBbJ2Rvd24nLCAnbW92ZScsICd1cCcsICdjYW5jZWwnXTtcblxuICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgX2Fyci5sZW5ndGg7IF9pKyspIHtcbiAgICB2YXIgZXZlbnRTaWduYWwgPSBfYXJyW19pXTtcbiAgICBzY29wZS5pbnRlcmFjdGlvbnMuc2lnbmFscy5vbihldmVudFNpZ25hbCwgb25JbnRlcmFjdGlvbkV2ZW50KTtcbiAgfSAvLyBwcmV2ZW50IG5hdGl2ZSBIVE1MNSBkcmFnIG9uIGludGVyYWN0LmpzIHRhcmdldCBlbGVtZW50c1xuXG5cbiAgc2NvcGUuaW50ZXJhY3Rpb25zLmV2ZW50TWFwLmRyYWdzdGFydCA9IGZ1bmN0aW9uIHByZXZlbnROYXRpdmVEcmFnKGV2ZW50KSB7XG4gICAgZm9yICh2YXIgX2kyID0gMDsgX2kyIDwgc2NvcGUuaW50ZXJhY3Rpb25zLmxpc3QubGVuZ3RoOyBfaTIrKykge1xuICAgICAgdmFyIF9yZWYyO1xuXG4gICAgICBfcmVmMiA9IHNjb3BlLmludGVyYWN0aW9ucy5saXN0W19pMl07XG4gICAgICB2YXIgaW50ZXJhY3Rpb24gPSBfcmVmMjtcblxuICAgICAgaWYgKGludGVyYWN0aW9uLmVsZW1lbnQgJiYgKGludGVyYWN0aW9uLmVsZW1lbnQgPT09IGV2ZW50LnRhcmdldCB8fCAoMCwgX2RvbVV0aWxzLm5vZGVDb250YWlucykoaW50ZXJhY3Rpb24uZWxlbWVudCwgZXZlbnQudGFyZ2V0KSkpIHtcbiAgICAgICAgaW50ZXJhY3Rpb24uaW50ZXJhY3RhYmxlLmNoZWNrQW5kUHJldmVudERlZmF1bHQoZXZlbnQpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG52YXIgX2RlZmF1bHQgPSB7XG4gIGlkOiAnY29yZS9pbnRlcmFjdGFibGVQcmV2ZW50RGVmYXVsdCcsXG4gIGluc3RhbGw6IGluc3RhbGxcbn07XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0O1xuXG59LHtcIkBpbnRlcmFjdGpzL3V0aWxzL2RvbVV0aWxzXCI6NTAsXCJAaW50ZXJhY3Rqcy91dGlscy9ldmVudHNcIjo1MSxcIkBpbnRlcmFjdGpzL3V0aWxzL2lzXCI6NTYsXCJAaW50ZXJhY3Rqcy91dGlscy93aW5kb3dcIjo2NX1dLDIyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciBfYXJyID0gcmVxdWlyZShcIkBpbnRlcmFjdGpzL3V0aWxzL2FyclwiKTtcblxudmFyIGRvbSA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy91dGlscy9kb21VdGlsc1wiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHsgdmFyIGRlc2MgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkgJiYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBrZXkpIDoge307IGlmIChkZXNjLmdldCB8fCBkZXNjLnNldCkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkobmV3T2JqLCBrZXksIGRlc2MpOyB9IGVsc2UgeyBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gfSB9IG5ld09ialtcImRlZmF1bHRcIl0gPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXG52YXIgZmluZGVyID0ge1xuICBtZXRob2RPcmRlcjogWydzaW11bGF0aW9uUmVzdW1lJywgJ21vdXNlT3JQZW4nLCAnaGFzUG9pbnRlcicsICdpZGxlJ10sXG4gIHNlYXJjaDogZnVuY3Rpb24gc2VhcmNoKGRldGFpbHMpIHtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgZmluZGVyLm1ldGhvZE9yZGVyLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9yZWY7XG5cbiAgICAgIF9yZWYgPSBmaW5kZXIubWV0aG9kT3JkZXJbX2ldO1xuICAgICAgdmFyIG1ldGhvZCA9IF9yZWY7XG4gICAgICB2YXIgaW50ZXJhY3Rpb24gPSBmaW5kZXJbbWV0aG9kXShkZXRhaWxzKTtcblxuICAgICAgaWYgKGludGVyYWN0aW9uKSB7XG4gICAgICAgIHJldHVybiBpbnRlcmFjdGlvbjtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIC8vIHRyeSB0byByZXN1bWUgc2ltdWxhdGlvbiB3aXRoIGEgbmV3IHBvaW50ZXJcbiAgc2ltdWxhdGlvblJlc3VtZTogZnVuY3Rpb24gc2ltdWxhdGlvblJlc3VtZShfcmVmMikge1xuICAgIHZhciBwb2ludGVyVHlwZSA9IF9yZWYyLnBvaW50ZXJUeXBlLFxuICAgICAgICBldmVudFR5cGUgPSBfcmVmMi5ldmVudFR5cGUsXG4gICAgICAgIGV2ZW50VGFyZ2V0ID0gX3JlZjIuZXZlbnRUYXJnZXQsXG4gICAgICAgIHNjb3BlID0gX3JlZjIuc2NvcGU7XG5cbiAgICBpZiAoIS9kb3dufHN0YXJ0L2kudGVzdChldmVudFR5cGUpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBfaTIgPSAwOyBfaTIgPCBzY29wZS5pbnRlcmFjdGlvbnMubGlzdC5sZW5ndGg7IF9pMisrKSB7XG4gICAgICB2YXIgX3JlZjM7XG5cbiAgICAgIF9yZWYzID0gc2NvcGUuaW50ZXJhY3Rpb25zLmxpc3RbX2kyXTtcbiAgICAgIHZhciBpbnRlcmFjdGlvbiA9IF9yZWYzO1xuICAgICAgdmFyIGVsZW1lbnQgPSBldmVudFRhcmdldDtcblxuICAgICAgaWYgKGludGVyYWN0aW9uLnNpbXVsYXRpb24gJiYgaW50ZXJhY3Rpb24uc2ltdWxhdGlvbi5hbGxvd1Jlc3VtZSAmJiBpbnRlcmFjdGlvbi5wb2ludGVyVHlwZSA9PT0gcG9pbnRlclR5cGUpIHtcbiAgICAgICAgd2hpbGUgKGVsZW1lbnQpIHtcbiAgICAgICAgICAvLyBpZiB0aGUgZWxlbWVudCBpcyB0aGUgaW50ZXJhY3Rpb24gZWxlbWVudFxuICAgICAgICAgIGlmIChlbGVtZW50ID09PSBpbnRlcmFjdGlvbi5lbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gaW50ZXJhY3Rpb247XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZWxlbWVudCA9IGRvbS5wYXJlbnROb2RlKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG4gIC8vIGlmIGl0J3MgYSBtb3VzZSBvciBwZW4gaW50ZXJhY3Rpb25cbiAgbW91c2VPclBlbjogZnVuY3Rpb24gbW91c2VPclBlbihfcmVmNCkge1xuICAgIHZhciBwb2ludGVySWQgPSBfcmVmNC5wb2ludGVySWQsXG4gICAgICAgIHBvaW50ZXJUeXBlID0gX3JlZjQucG9pbnRlclR5cGUsXG4gICAgICAgIGV2ZW50VHlwZSA9IF9yZWY0LmV2ZW50VHlwZSxcbiAgICAgICAgc2NvcGUgPSBfcmVmNC5zY29wZTtcblxuICAgIGlmIChwb2ludGVyVHlwZSAhPT0gJ21vdXNlJyAmJiBwb2ludGVyVHlwZSAhPT0gJ3BlbicpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHZhciBmaXJzdE5vbkFjdGl2ZTtcblxuICAgIGZvciAodmFyIF9pMyA9IDA7IF9pMyA8IHNjb3BlLmludGVyYWN0aW9ucy5saXN0Lmxlbmd0aDsgX2kzKyspIHtcbiAgICAgIHZhciBfcmVmNTtcblxuICAgICAgX3JlZjUgPSBzY29wZS5pbnRlcmFjdGlvbnMubGlzdFtfaTNdO1xuICAgICAgdmFyIGludGVyYWN0aW9uID0gX3JlZjU7XG5cbiAgICAgIGlmIChpbnRlcmFjdGlvbi5wb2ludGVyVHlwZSA9PT0gcG9pbnRlclR5cGUpIHtcbiAgICAgICAgLy8gaWYgaXQncyBhIGRvd24gZXZlbnQsIHNraXAgaW50ZXJhY3Rpb25zIHdpdGggcnVubmluZyBzaW11bGF0aW9uc1xuICAgICAgICBpZiAoaW50ZXJhY3Rpb24uc2ltdWxhdGlvbiAmJiAhaGFzUG9pbnRlcklkKGludGVyYWN0aW9uLCBwb2ludGVySWQpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gLy8gaWYgdGhlIGludGVyYWN0aW9uIGlzIGFjdGl2ZSwgcmV0dXJuIGl0IGltbWVkaWF0ZWx5XG5cblxuICAgICAgICBpZiAoaW50ZXJhY3Rpb24uaW50ZXJhY3RpbmcoKSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcmFjdGlvbjtcbiAgICAgICAgfSAvLyBvdGhlcndpc2Ugc2F2ZSBpdCBhbmQgbG9vayBmb3IgYW5vdGhlciBhY3RpdmUgaW50ZXJhY3Rpb25cbiAgICAgICAgZWxzZSBpZiAoIWZpcnN0Tm9uQWN0aXZlKSB7XG4gICAgICAgICAgICBmaXJzdE5vbkFjdGl2ZSA9IGludGVyYWN0aW9uO1xuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9IC8vIGlmIG5vIGFjdGl2ZSBtb3VzZSBpbnRlcmFjdGlvbiB3YXMgZm91bmQgdXNlIHRoZSBmaXJzdCBpbmFjdGl2ZSBtb3VzZVxuICAgIC8vIGludGVyYWN0aW9uXG5cblxuICAgIGlmIChmaXJzdE5vbkFjdGl2ZSkge1xuICAgICAgcmV0dXJuIGZpcnN0Tm9uQWN0aXZlO1xuICAgIH0gLy8gZmluZCBhbnkgbW91c2Ugb3IgcGVuIGludGVyYWN0aW9uLlxuICAgIC8vIGlnbm9yZSB0aGUgaW50ZXJhY3Rpb24gaWYgdGhlIGV2ZW50VHlwZSBpcyBhICpkb3duLCBhbmQgYSBzaW11bGF0aW9uXG4gICAgLy8gaXMgYWN0aXZlXG5cblxuICAgIGZvciAodmFyIF9pNCA9IDA7IF9pNCA8IHNjb3BlLmludGVyYWN0aW9ucy5saXN0Lmxlbmd0aDsgX2k0KyspIHtcbiAgICAgIHZhciBfcmVmNjtcblxuICAgICAgX3JlZjYgPSBzY29wZS5pbnRlcmFjdGlvbnMubGlzdFtfaTRdO1xuICAgICAgdmFyIF9pbnRlcmFjdGlvbiA9IF9yZWY2O1xuXG4gICAgICBpZiAoX2ludGVyYWN0aW9uLnBvaW50ZXJUeXBlID09PSBwb2ludGVyVHlwZSAmJiAhKC9kb3duL2kudGVzdChldmVudFR5cGUpICYmIF9pbnRlcmFjdGlvbi5zaW11bGF0aW9uKSkge1xuICAgICAgICByZXR1cm4gX2ludGVyYWN0aW9uO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9LFxuICAvLyBnZXQgaW50ZXJhY3Rpb24gdGhhdCBoYXMgdGhpcyBwb2ludGVyXG4gIGhhc1BvaW50ZXI6IGZ1bmN0aW9uIGhhc1BvaW50ZXIoX3JlZjcpIHtcbiAgICB2YXIgcG9pbnRlcklkID0gX3JlZjcucG9pbnRlcklkLFxuICAgICAgICBzY29wZSA9IF9yZWY3LnNjb3BlO1xuXG4gICAgZm9yICh2YXIgX2k1ID0gMDsgX2k1IDwgc2NvcGUuaW50ZXJhY3Rpb25zLmxpc3QubGVuZ3RoOyBfaTUrKykge1xuICAgICAgdmFyIF9yZWY4O1xuXG4gICAgICBfcmVmOCA9IHNjb3BlLmludGVyYWN0aW9ucy5saXN0W19pNV07XG4gICAgICB2YXIgaW50ZXJhY3Rpb24gPSBfcmVmODtcblxuICAgICAgaWYgKGhhc1BvaW50ZXJJZChpbnRlcmFjdGlvbiwgcG9pbnRlcklkKSkge1xuICAgICAgICByZXR1cm4gaW50ZXJhY3Rpb247XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG4gIC8vIGdldCBmaXJzdCBpZGxlIGludGVyYWN0aW9uIHdpdGggYSBtYXRjaGluZyBwb2ludGVyVHlwZVxuICBpZGxlOiBmdW5jdGlvbiBpZGxlKF9yZWY5KSB7XG4gICAgdmFyIHBvaW50ZXJUeXBlID0gX3JlZjkucG9pbnRlclR5cGUsXG4gICAgICAgIHNjb3BlID0gX3JlZjkuc2NvcGU7XG5cbiAgICBmb3IgKHZhciBfaTYgPSAwOyBfaTYgPCBzY29wZS5pbnRlcmFjdGlvbnMubGlzdC5sZW5ndGg7IF9pNisrKSB7XG4gICAgICB2YXIgX3JlZjEwO1xuXG4gICAgICBfcmVmMTAgPSBzY29wZS5pbnRlcmFjdGlvbnMubGlzdFtfaTZdO1xuICAgICAgdmFyIGludGVyYWN0aW9uID0gX3JlZjEwO1xuXG4gICAgICAvLyBpZiB0aGVyZSdzIGFscmVhZHkgYSBwb2ludGVyIGhlbGQgZG93blxuICAgICAgaWYgKGludGVyYWN0aW9uLnBvaW50ZXJzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICB2YXIgdGFyZ2V0ID0gaW50ZXJhY3Rpb24uaW50ZXJhY3RhYmxlOyAvLyBkb24ndCBhZGQgdGhpcyBwb2ludGVyIGlmIHRoZXJlIGlzIGEgdGFyZ2V0IGludGVyYWN0YWJsZSBhbmQgaXRcbiAgICAgICAgLy8gaXNuJ3QgZ2VzdHVyYWJsZVxuXG4gICAgICAgIGlmICh0YXJnZXQgJiYgIXRhcmdldC5vcHRpb25zLmdlc3R1cmUuZW5hYmxlZCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9IC8vIG1heGltdW0gb2YgMiBwb2ludGVycyBwZXIgaW50ZXJhY3Rpb25cbiAgICAgIGVsc2UgaWYgKGludGVyYWN0aW9uLnBvaW50ZXJzLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgaWYgKCFpbnRlcmFjdGlvbi5pbnRlcmFjdGluZygpICYmIHBvaW50ZXJUeXBlID09PSBpbnRlcmFjdGlvbi5wb2ludGVyVHlwZSkge1xuICAgICAgICByZXR1cm4gaW50ZXJhY3Rpb247XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGhhc1BvaW50ZXJJZChpbnRlcmFjdGlvbiwgcG9pbnRlcklkKSB7XG4gIHJldHVybiAoMCwgX2Fyci5zb21lKShpbnRlcmFjdGlvbi5wb2ludGVycywgZnVuY3Rpb24gKF9yZWYxMSkge1xuICAgIHZhciBpZCA9IF9yZWYxMS5pZDtcbiAgICByZXR1cm4gaWQgPT09IHBvaW50ZXJJZDtcbiAgfSk7XG59XG5cbnZhciBfZGVmYXVsdCA9IGZpbmRlcjtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5cbn0se1wiQGludGVyYWN0anMvdXRpbHMvYXJyXCI6NDYsXCJAaW50ZXJhY3Rqcy91dGlscy9kb21VdGlsc1wiOjUwfV0sMjM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF9icm93c2VyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiQGludGVyYWN0anMvdXRpbHMvYnJvd3NlclwiKSk7XG5cbnZhciBfZG9tT2JqZWN0cyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIkBpbnRlcmFjdGpzL3V0aWxzL2RvbU9iamVjdHNcIikpO1xuXG52YXIgX2V2ZW50cyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIkBpbnRlcmFjdGpzL3V0aWxzL2V2ZW50c1wiKSk7XG5cbnZhciBfcG9pbnRlclV0aWxzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiQGludGVyYWN0anMvdXRpbHMvcG9pbnRlclV0aWxzXCIpKTtcblxudmFyIF9TaWduYWxzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiQGludGVyYWN0anMvdXRpbHMvU2lnbmFsc1wiKSk7XG5cbnZhciBfSW50ZXJhY3Rpb24gPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0ludGVyYWN0aW9uXCIpKTtcblxudmFyIF9pbnRlcmFjdGlvbkZpbmRlciA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vaW50ZXJhY3Rpb25GaW5kZXJcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuZnVuY3Rpb24gX3NsaWNlZFRvQXJyYXkoYXJyLCBpKSB7IHJldHVybiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB8fCBfbm9uSXRlcmFibGVSZXN0KCk7IH1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlUmVzdCgpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2VcIik7IH1cblxuZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkgeyB2YXIgX2FyciA9IFtdOyB2YXIgX24gPSB0cnVlOyB2YXIgX2QgPSBmYWxzZTsgdmFyIF9lID0gdW5kZWZpbmVkOyB0cnkgeyBmb3IgKHZhciBfaSA9IGFycltTeW1ib2wuaXRlcmF0b3JdKCksIF9zOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7IF9hcnIucHVzaChfcy52YWx1ZSk7IGlmIChpICYmIF9hcnIubGVuZ3RoID09PSBpKSBicmVhazsgfSB9IGNhdGNoIChlcnIpIHsgX2QgPSB0cnVlOyBfZSA9IGVycjsgfSBmaW5hbGx5IHsgdHJ5IHsgaWYgKCFfbiAmJiBfaVtcInJldHVyblwiXSAhPSBudWxsKSBfaVtcInJldHVyblwiXSgpOyB9IGZpbmFsbHkgeyBpZiAoX2QpIHRocm93IF9lOyB9IH0gcmV0dXJuIF9hcnI7IH1cblxuZnVuY3Rpb24gX2FycmF5V2l0aEhvbGVzKGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gYXJyOyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkgeyByZXR1cm4gY2FsbDsgfSByZXR1cm4gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTsgfVxuXG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHsgaWYgKHNlbGYgPT09IHZvaWQgMCkgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIHNlbGY7IH1cblxuZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgX2dldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTsgfTsgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb25cIik7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgX3NldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTsgfVxuXG5mdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgby5fX3Byb3RvX18gPSBwOyByZXR1cm4gbzsgfTsgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTsgfVxuXG52YXIgbWV0aG9kTmFtZXMgPSBbJ3BvaW50ZXJEb3duJywgJ3BvaW50ZXJNb3ZlJywgJ3BvaW50ZXJVcCcsICd1cGRhdGVQb2ludGVyJywgJ3JlbW92ZVBvaW50ZXInLCAnd2luZG93Qmx1ciddO1xuXG5mdW5jdGlvbiBpbnN0YWxsKHNjb3BlKSB7XG4gIHZhciBzaWduYWxzID0gbmV3IF9TaWduYWxzW1wiZGVmYXVsdFwiXSgpO1xuICB2YXIgbGlzdGVuZXJzID0ge307XG5cbiAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IG1ldGhvZE5hbWVzLmxlbmd0aDsgX2krKykge1xuICAgIHZhciBtZXRob2QgPSBtZXRob2ROYW1lc1tfaV07XG4gICAgbGlzdGVuZXJzW21ldGhvZF0gPSBkb09uSW50ZXJhY3Rpb25zKG1ldGhvZCwgc2NvcGUpO1xuICB9XG5cbiAgdmFyIHBFdmVudFR5cGVzID0gX2Jyb3dzZXJbXCJkZWZhdWx0XCJdLnBFdmVudFR5cGVzO1xuICB2YXIgZXZlbnRNYXAgPSB7fTtcblxuICBpZiAoX2RvbU9iamVjdHNbXCJkZWZhdWx0XCJdLlBvaW50ZXJFdmVudCkge1xuICAgIGV2ZW50TWFwW3BFdmVudFR5cGVzLmRvd25dID0gbGlzdGVuZXJzLnBvaW50ZXJEb3duO1xuICAgIGV2ZW50TWFwW3BFdmVudFR5cGVzLm1vdmVdID0gbGlzdGVuZXJzLnBvaW50ZXJNb3ZlO1xuICAgIGV2ZW50TWFwW3BFdmVudFR5cGVzLnVwXSA9IGxpc3RlbmVycy5wb2ludGVyVXA7XG4gICAgZXZlbnRNYXBbcEV2ZW50VHlwZXMuY2FuY2VsXSA9IGxpc3RlbmVycy5wb2ludGVyVXA7XG4gIH0gZWxzZSB7XG4gICAgZXZlbnRNYXAubW91c2Vkb3duID0gbGlzdGVuZXJzLnBvaW50ZXJEb3duO1xuICAgIGV2ZW50TWFwLm1vdXNlbW92ZSA9IGxpc3RlbmVycy5wb2ludGVyTW92ZTtcbiAgICBldmVudE1hcC5tb3VzZXVwID0gbGlzdGVuZXJzLnBvaW50ZXJVcDtcbiAgICBldmVudE1hcC50b3VjaHN0YXJ0ID0gbGlzdGVuZXJzLnBvaW50ZXJEb3duO1xuICAgIGV2ZW50TWFwLnRvdWNobW92ZSA9IGxpc3RlbmVycy5wb2ludGVyTW92ZTtcbiAgICBldmVudE1hcC50b3VjaGVuZCA9IGxpc3RlbmVycy5wb2ludGVyVXA7XG4gICAgZXZlbnRNYXAudG91Y2hjYW5jZWwgPSBsaXN0ZW5lcnMucG9pbnRlclVwO1xuICB9XG5cbiAgZXZlbnRNYXAuYmx1ciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIGZvciAodmFyIF9pMiA9IDA7IF9pMiA8IHNjb3BlLmludGVyYWN0aW9ucy5saXN0Lmxlbmd0aDsgX2kyKyspIHtcbiAgICAgIHZhciBfcmVmO1xuXG4gICAgICBfcmVmID0gc2NvcGUuaW50ZXJhY3Rpb25zLmxpc3RbX2kyXTtcbiAgICAgIHZhciBpbnRlcmFjdGlvbiA9IF9yZWY7XG4gICAgICBpbnRlcmFjdGlvbi5kb2N1bWVudEJsdXIoZXZlbnQpO1xuICAgIH1cbiAgfTtcblxuICBzY29wZS5zaWduYWxzLm9uKCdhZGQtZG9jdW1lbnQnLCBvbkRvY1NpZ25hbCk7XG4gIHNjb3BlLnNpZ25hbHMub24oJ3JlbW92ZS1kb2N1bWVudCcsIG9uRG9jU2lnbmFsKTsgLy8gZm9yIGlnbm9yaW5nIGJyb3dzZXIncyBzaW11bGF0ZWQgbW91c2UgZXZlbnRzXG5cbiAgc2NvcGUucHJldlRvdWNoVGltZSA9IDA7XG5cbiAgc2NvcGUuSW50ZXJhY3Rpb24gPVxuICAvKiNfX1BVUkVfXyovXG4gIGZ1bmN0aW9uIChfSW50ZXJhY3Rpb25CYXNlKSB7XG4gICAgX2luaGVyaXRzKEludGVyYWN0aW9uLCBfSW50ZXJhY3Rpb25CYXNlKTtcblxuICAgIGZ1bmN0aW9uIEludGVyYWN0aW9uKCkge1xuICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEludGVyYWN0aW9uKTtcblxuICAgICAgcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihJbnRlcmFjdGlvbikuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKEludGVyYWN0aW9uLCBbe1xuICAgICAga2V5OiBcIl9ub3dcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfbm93KCkge1xuICAgICAgICByZXR1cm4gc2NvcGUubm93KCk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcInBvaW50ZXJNb3ZlVG9sZXJhbmNlXCIsXG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHNjb3BlLmludGVyYWN0aW9ucy5wb2ludGVyTW92ZVRvbGVyYW5jZTtcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuICAgICAgICBzY29wZS5pbnRlcmFjdGlvbnMucG9pbnRlck1vdmVUb2xlcmFuY2UgPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gSW50ZXJhY3Rpb247XG4gIH0oX0ludGVyYWN0aW9uW1wiZGVmYXVsdFwiXSk7XG5cbiAgc2NvcGUuaW50ZXJhY3Rpb25zID0ge1xuICAgIHNpZ25hbHM6IHNpZ25hbHMsXG4gICAgLy8gYWxsIGFjdGl2ZSBhbmQgaWRsZSBpbnRlcmFjdGlvbnNcbiAgICBsaXN0OiBbXSxcbiAgICBcIm5ld1wiOiBmdW5jdGlvbiBfbmV3KG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMuc2lnbmFscyA9IHNpZ25hbHM7XG4gICAgICB2YXIgaW50ZXJhY3Rpb24gPSBuZXcgc2NvcGUuSW50ZXJhY3Rpb24ob3B0aW9ucyk7XG4gICAgICBzY29wZS5pbnRlcmFjdGlvbnMubGlzdC5wdXNoKGludGVyYWN0aW9uKTtcbiAgICAgIHJldHVybiBpbnRlcmFjdGlvbjtcbiAgICB9LFxuICAgIGxpc3RlbmVyczogbGlzdGVuZXJzLFxuICAgIGV2ZW50TWFwOiBldmVudE1hcCxcbiAgICBwb2ludGVyTW92ZVRvbGVyYW5jZTogMVxuICB9O1xufVxuXG5mdW5jdGlvbiBkb09uSW50ZXJhY3Rpb25zKG1ldGhvZCwgc2NvcGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBpbnRlcmFjdGlvbnMgPSBzY29wZS5pbnRlcmFjdGlvbnMubGlzdDtcblxuICAgIHZhciBwb2ludGVyVHlwZSA9IF9wb2ludGVyVXRpbHNbXCJkZWZhdWx0XCJdLmdldFBvaW50ZXJUeXBlKGV2ZW50KTtcblxuICAgIHZhciBfcG9pbnRlclV0aWxzJGdldEV2ZW4gPSBfcG9pbnRlclV0aWxzW1wiZGVmYXVsdFwiXS5nZXRFdmVudFRhcmdldHMoZXZlbnQpLFxuICAgICAgICBfcG9pbnRlclV0aWxzJGdldEV2ZW4yID0gX3NsaWNlZFRvQXJyYXkoX3BvaW50ZXJVdGlscyRnZXRFdmVuLCAyKSxcbiAgICAgICAgZXZlbnRUYXJnZXQgPSBfcG9pbnRlclV0aWxzJGdldEV2ZW4yWzBdLFxuICAgICAgICBjdXJFdmVudFRhcmdldCA9IF9wb2ludGVyVXRpbHMkZ2V0RXZlbjJbMV07XG5cbiAgICB2YXIgbWF0Y2hlcyA9IFtdOyAvLyBbIFtwb2ludGVyLCBpbnRlcmFjdGlvbl0sIC4uLl1cblxuICAgIGlmIChfYnJvd3NlcltcImRlZmF1bHRcIl0uc3VwcG9ydHNUb3VjaCAmJiAvdG91Y2gvLnRlc3QoZXZlbnQudHlwZSkpIHtcbiAgICAgIHNjb3BlLnByZXZUb3VjaFRpbWUgPSBzY29wZS5ub3coKTtcblxuICAgICAgZm9yICh2YXIgX2kzID0gMDsgX2kzIDwgZXZlbnQuY2hhbmdlZFRvdWNoZXMubGVuZ3RoOyBfaTMrKykge1xuICAgICAgICB2YXIgX3JlZjI7XG5cbiAgICAgICAgX3JlZjIgPSBldmVudC5jaGFuZ2VkVG91Y2hlc1tfaTNdO1xuICAgICAgICB2YXIgY2hhbmdlZFRvdWNoID0gX3JlZjI7XG4gICAgICAgIHZhciBwb2ludGVyID0gY2hhbmdlZFRvdWNoO1xuXG4gICAgICAgIHZhciBwb2ludGVySWQgPSBfcG9pbnRlclV0aWxzW1wiZGVmYXVsdFwiXS5nZXRQb2ludGVySWQocG9pbnRlcik7XG5cbiAgICAgICAgdmFyIHNlYXJjaERldGFpbHMgPSB7XG4gICAgICAgICAgcG9pbnRlcjogcG9pbnRlcixcbiAgICAgICAgICBwb2ludGVySWQ6IHBvaW50ZXJJZCxcbiAgICAgICAgICBwb2ludGVyVHlwZTogcG9pbnRlclR5cGUsXG4gICAgICAgICAgZXZlbnRUeXBlOiBldmVudC50eXBlLFxuICAgICAgICAgIGV2ZW50VGFyZ2V0OiBldmVudFRhcmdldCxcbiAgICAgICAgICBjdXJFdmVudFRhcmdldDogY3VyRXZlbnRUYXJnZXQsXG4gICAgICAgICAgc2NvcGU6IHNjb3BlXG4gICAgICAgIH07XG4gICAgICAgIHZhciBpbnRlcmFjdGlvbiA9IGdldEludGVyYWN0aW9uKHNlYXJjaERldGFpbHMpO1xuICAgICAgICBtYXRjaGVzLnB1c2goW3NlYXJjaERldGFpbHMucG9pbnRlciwgc2VhcmNoRGV0YWlscy5ldmVudFRhcmdldCwgc2VhcmNoRGV0YWlscy5jdXJFdmVudFRhcmdldCwgaW50ZXJhY3Rpb25dKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGludmFsaWRQb2ludGVyID0gZmFsc2U7XG5cbiAgICAgIGlmICghX2Jyb3dzZXJbXCJkZWZhdWx0XCJdLnN1cHBvcnRzUG9pbnRlckV2ZW50ICYmIC9tb3VzZS8udGVzdChldmVudC50eXBlKSkge1xuICAgICAgICAvLyBpZ25vcmUgbW91c2UgZXZlbnRzIHdoaWxlIHRvdWNoIGludGVyYWN0aW9ucyBhcmUgYWN0aXZlXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW50ZXJhY3Rpb25zLmxlbmd0aCAmJiAhaW52YWxpZFBvaW50ZXI7IGkrKykge1xuICAgICAgICAgIGludmFsaWRQb2ludGVyID0gaW50ZXJhY3Rpb25zW2ldLnBvaW50ZXJUeXBlICE9PSAnbW91c2UnICYmIGludGVyYWN0aW9uc1tpXS5wb2ludGVySXNEb3duO1xuICAgICAgICB9IC8vIHRyeSB0byBpZ25vcmUgbW91c2UgZXZlbnRzIHRoYXQgYXJlIHNpbXVsYXRlZCBieSB0aGUgYnJvd3NlclxuICAgICAgICAvLyBhZnRlciBhIHRvdWNoIGV2ZW50XG5cblxuICAgICAgICBpbnZhbGlkUG9pbnRlciA9IGludmFsaWRQb2ludGVyIHx8IHNjb3BlLm5vdygpIC0gc2NvcGUucHJldlRvdWNoVGltZSA8IDUwMCB8fCAvLyBvbiBpT1MgYW5kIEZpcmVmb3ggTW9iaWxlLCBNb3VzZUV2ZW50LnRpbWVTdGFtcCBpcyB6ZXJvIGlmIHNpbXVsYXRlZFxuICAgICAgICBldmVudC50aW1lU3RhbXAgPT09IDA7XG4gICAgICB9XG5cbiAgICAgIGlmICghaW52YWxpZFBvaW50ZXIpIHtcbiAgICAgICAgdmFyIF9zZWFyY2hEZXRhaWxzID0ge1xuICAgICAgICAgIHBvaW50ZXI6IGV2ZW50LFxuICAgICAgICAgIHBvaW50ZXJJZDogX3BvaW50ZXJVdGlsc1tcImRlZmF1bHRcIl0uZ2V0UG9pbnRlcklkKGV2ZW50KSxcbiAgICAgICAgICBwb2ludGVyVHlwZTogcG9pbnRlclR5cGUsXG4gICAgICAgICAgZXZlbnRUeXBlOiBldmVudC50eXBlLFxuICAgICAgICAgIGN1ckV2ZW50VGFyZ2V0OiBjdXJFdmVudFRhcmdldCxcbiAgICAgICAgICBldmVudFRhcmdldDogZXZlbnRUYXJnZXQsXG4gICAgICAgICAgc2NvcGU6IHNjb3BlXG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9pbnRlcmFjdGlvbiA9IGdldEludGVyYWN0aW9uKF9zZWFyY2hEZXRhaWxzKTtcblxuICAgICAgICBtYXRjaGVzLnB1c2goW19zZWFyY2hEZXRhaWxzLnBvaW50ZXIsIF9zZWFyY2hEZXRhaWxzLmV2ZW50VGFyZ2V0LCBfc2VhcmNoRGV0YWlscy5jdXJFdmVudFRhcmdldCwgX2ludGVyYWN0aW9uXSk7XG4gICAgICB9XG4gICAgfSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2hhZG93XG5cblxuICAgIGZvciAodmFyIF9pNCA9IDA7IF9pNCA8IG1hdGNoZXMubGVuZ3RoOyBfaTQrKykge1xuICAgICAgdmFyIF9tYXRjaGVzJF9pID0gX3NsaWNlZFRvQXJyYXkobWF0Y2hlc1tfaTRdLCA0KSxcbiAgICAgICAgICBfcG9pbnRlciA9IF9tYXRjaGVzJF9pWzBdLFxuICAgICAgICAgIF9ldmVudFRhcmdldCA9IF9tYXRjaGVzJF9pWzFdLFxuICAgICAgICAgIF9jdXJFdmVudFRhcmdldCA9IF9tYXRjaGVzJF9pWzJdLFxuICAgICAgICAgIF9pbnRlcmFjdGlvbjIgPSBfbWF0Y2hlcyRfaVszXTtcblxuICAgICAgX2ludGVyYWN0aW9uMlttZXRob2RdKF9wb2ludGVyLCBldmVudCwgX2V2ZW50VGFyZ2V0LCBfY3VyRXZlbnRUYXJnZXQpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0SW50ZXJhY3Rpb24oc2VhcmNoRGV0YWlscykge1xuICB2YXIgcG9pbnRlclR5cGUgPSBzZWFyY2hEZXRhaWxzLnBvaW50ZXJUeXBlLFxuICAgICAgc2NvcGUgPSBzZWFyY2hEZXRhaWxzLnNjb3BlO1xuXG4gIHZhciBmb3VuZEludGVyYWN0aW9uID0gX2ludGVyYWN0aW9uRmluZGVyW1wiZGVmYXVsdFwiXS5zZWFyY2goc2VhcmNoRGV0YWlscyk7XG5cbiAgdmFyIHNpZ25hbEFyZyA9IHtcbiAgICBpbnRlcmFjdGlvbjogZm91bmRJbnRlcmFjdGlvbixcbiAgICBzZWFyY2hEZXRhaWxzOiBzZWFyY2hEZXRhaWxzXG4gIH07XG4gIHNjb3BlLmludGVyYWN0aW9ucy5zaWduYWxzLmZpcmUoJ2ZpbmQnLCBzaWduYWxBcmcpO1xuICByZXR1cm4gc2lnbmFsQXJnLmludGVyYWN0aW9uIHx8IHNjb3BlLmludGVyYWN0aW9uc1tcIm5ld1wiXSh7XG4gICAgcG9pbnRlclR5cGU6IHBvaW50ZXJUeXBlXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBvbkRvY1NpZ25hbChfcmVmMywgc2lnbmFsTmFtZSkge1xuICB2YXIgZG9jID0gX3JlZjMuZG9jLFxuICAgICAgc2NvcGUgPSBfcmVmMy5zY29wZSxcbiAgICAgIG9wdGlvbnMgPSBfcmVmMy5vcHRpb25zO1xuICB2YXIgZXZlbnRNYXAgPSBzY29wZS5pbnRlcmFjdGlvbnMuZXZlbnRNYXA7XG4gIHZhciBldmVudE1ldGhvZCA9IHNpZ25hbE5hbWUuaW5kZXhPZignYWRkJykgPT09IDAgPyBfZXZlbnRzW1wiZGVmYXVsdFwiXS5hZGQgOiBfZXZlbnRzW1wiZGVmYXVsdFwiXS5yZW1vdmU7XG5cbiAgaWYgKHNjb3BlLmJyb3dzZXIuaXNJT1MgJiYgIW9wdGlvbnMuZXZlbnRzKSB7XG4gICAgb3B0aW9ucy5ldmVudHMgPSB7XG4gICAgICBwYXNzaXZlOiBmYWxzZVxuICAgIH07XG4gIH0gLy8gZGVsZWdhdGUgZXZlbnQgbGlzdGVuZXJcblxuXG4gIGZvciAodmFyIGV2ZW50VHlwZSBpbiBfZXZlbnRzW1wiZGVmYXVsdFwiXS5kZWxlZ2F0ZWRFdmVudHMpIHtcbiAgICBldmVudE1ldGhvZChkb2MsIGV2ZW50VHlwZSwgX2V2ZW50c1tcImRlZmF1bHRcIl0uZGVsZWdhdGVMaXN0ZW5lcik7XG4gICAgZXZlbnRNZXRob2QoZG9jLCBldmVudFR5cGUsIF9ldmVudHNbXCJkZWZhdWx0XCJdLmRlbGVnYXRlVXNlQ2FwdHVyZSwgdHJ1ZSk7XG4gIH1cblxuICB2YXIgZXZlbnRPcHRpb25zID0gb3B0aW9ucyAmJiBvcHRpb25zLmV2ZW50cztcblxuICBmb3IgKHZhciBfZXZlbnRUeXBlIGluIGV2ZW50TWFwKSB7XG4gICAgZXZlbnRNZXRob2QoZG9jLCBfZXZlbnRUeXBlLCBldmVudE1hcFtfZXZlbnRUeXBlXSwgZXZlbnRPcHRpb25zKTtcbiAgfVxufVxuXG52YXIgX2RlZmF1bHQgPSB7XG4gIGlkOiAnY29yZS9pbnRlcmFjdGlvbnMnLFxuICBpbnN0YWxsOiBpbnN0YWxsLFxuICBvbkRvY1NpZ25hbDogb25Eb2NTaWduYWwsXG4gIGRvT25JbnRlcmFjdGlvbnM6IGRvT25JbnRlcmFjdGlvbnMsXG4gIG1ldGhvZE5hbWVzOiBtZXRob2ROYW1lc1xufTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5cbn0se1wiLi9JbnRlcmFjdGlvblwiOjE4LFwiLi9pbnRlcmFjdGlvbkZpbmRlclwiOjIyLFwiQGludGVyYWN0anMvdXRpbHMvU2lnbmFsc1wiOjQ1LFwiQGludGVyYWN0anMvdXRpbHMvYnJvd3NlclwiOjQ3LFwiQGludGVyYWN0anMvdXRpbHMvZG9tT2JqZWN0c1wiOjQ5LFwiQGludGVyYWN0anMvdXRpbHMvZXZlbnRzXCI6NTEsXCJAaW50ZXJhY3Rqcy91dGlscy9wb2ludGVyVXRpbHNcIjo2MH1dLDI0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5jcmVhdGVTY29wZSA9IGNyZWF0ZVNjb3BlO1xuZXhwb3J0cy5pbml0U2NvcGUgPSBpbml0U2NvcGU7XG5leHBvcnRzLlNjb3BlID0gZXhwb3J0cy5BY3Rpb25OYW1lID0gdm9pZCAwO1xuXG52YXIgdXRpbHMgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChyZXF1aXJlKFwiQGludGVyYWN0anMvdXRpbHNcIikpO1xuXG52YXIgX2RvbU9iamVjdHMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy91dGlscy9kb21PYmplY3RzXCIpKTtcblxudmFyIF9kZWZhdWx0T3B0aW9ucyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vZGVmYXVsdE9wdGlvbnNcIikpO1xuXG52YXIgX0V2ZW50YWJsZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vRXZlbnRhYmxlXCIpKTtcblxudmFyIF9JbnRlcmFjdGFibGUgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0ludGVyYWN0YWJsZVwiKSk7XG5cbnZhciBfSW50ZXJhY3RhYmxlU2V0ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9JbnRlcmFjdGFibGVTZXRcIikpO1xuXG52YXIgX0ludGVyYWN0RXZlbnQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0ludGVyYWN0RXZlbnRcIikpO1xuXG52YXIgX2ludGVyYWN0aW9ucyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vaW50ZXJhY3Rpb25zXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHsgdmFyIGRlc2MgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkgJiYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBrZXkpIDoge307IGlmIChkZXNjLmdldCB8fCBkZXNjLnNldCkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkobmV3T2JqLCBrZXksIGRlc2MpOyB9IGVsc2UgeyBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gfSB9IG5ld09ialtcImRlZmF1bHRcIl0gPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmIChjYWxsICYmIChfdHlwZW9mKGNhbGwpID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpKSB7IHJldHVybiBjYWxsOyB9IHJldHVybiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpOyB9XG5cbmZ1bmN0aW9uIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZikgeyBpZiAoc2VsZiA9PT0gdm9pZCAwKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gc2VsZjsgfVxuXG5mdW5jdGlvbiBfZ2V0KHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyKSB7IGlmICh0eXBlb2YgUmVmbGVjdCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBSZWZsZWN0LmdldCkgeyBfZ2V0ID0gUmVmbGVjdC5nZXQ7IH0gZWxzZSB7IF9nZXQgPSBmdW5jdGlvbiBfZ2V0KHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyKSB7IHZhciBiYXNlID0gX3N1cGVyUHJvcEJhc2UodGFyZ2V0LCBwcm9wZXJ0eSk7IGlmICghYmFzZSkgcmV0dXJuOyB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoYmFzZSwgcHJvcGVydHkpOyBpZiAoZGVzYy5nZXQpIHsgcmV0dXJuIGRlc2MuZ2V0LmNhbGwocmVjZWl2ZXIpOyB9IHJldHVybiBkZXNjLnZhbHVlOyB9OyB9IHJldHVybiBfZ2V0KHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyIHx8IHRhcmdldCk7IH1cblxuZnVuY3Rpb24gX3N1cGVyUHJvcEJhc2Uob2JqZWN0LCBwcm9wZXJ0eSkgeyB3aGlsZSAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KSkgeyBvYmplY3QgPSBfZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTsgaWYgKG9iamVjdCA9PT0gbnVsbCkgYnJlYWs7IH0gcmV0dXJuIG9iamVjdDsgfVxuXG5mdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pOyB9OyByZXR1cm4gX2dldFByb3RvdHlwZU9mKG8pOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpOyB9XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxudmFyIHdpbiA9IHV0aWxzLndpbixcbiAgICBicm93c2VyID0gdXRpbHMuYnJvd3NlcixcbiAgICByYWYgPSB1dGlscy5yYWYsXG4gICAgU2lnbmFscyA9IHV0aWxzLlNpZ25hbHMsXG4gICAgZXZlbnRzID0gdXRpbHMuZXZlbnRzO1xudmFyIEFjdGlvbk5hbWU7XG5leHBvcnRzLkFjdGlvbk5hbWUgPSBBY3Rpb25OYW1lO1xuXG4oZnVuY3Rpb24gKEFjdGlvbk5hbWUpIHt9KShBY3Rpb25OYW1lIHx8IChleHBvcnRzLkFjdGlvbk5hbWUgPSBBY3Rpb25OYW1lID0ge30pKTtcblxuZnVuY3Rpb24gY3JlYXRlU2NvcGUoKSB7XG4gIHJldHVybiBuZXcgU2NvcGUoKTtcbn1cblxudmFyIFNjb3BlID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gU2NvcGUoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBTY29wZSk7XG5cbiAgICB0aGlzLmlkID0gXCJfX2ludGVyYWN0X3Njb3BlX1wiLmNvbmNhdChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDApKTtcbiAgICB0aGlzLnNpZ25hbHMgPSBuZXcgU2lnbmFscygpO1xuICAgIHRoaXMuYnJvd3NlciA9IGJyb3dzZXI7XG4gICAgdGhpcy5ldmVudHMgPSBldmVudHM7XG4gICAgdGhpcy51dGlscyA9IHV0aWxzO1xuICAgIHRoaXMuZGVmYXVsdHMgPSB1dGlscy5jbG9uZShfZGVmYXVsdE9wdGlvbnNbXCJkZWZhdWx0XCJdKTtcbiAgICB0aGlzLkV2ZW50YWJsZSA9IF9FdmVudGFibGVbXCJkZWZhdWx0XCJdO1xuICAgIHRoaXMuYWN0aW9ucyA9IHtcbiAgICAgIG5hbWVzOiBbXSxcbiAgICAgIG1ldGhvZERpY3Q6IHt9LFxuICAgICAgZXZlbnRUeXBlczogW11cbiAgICB9O1xuICAgIHRoaXMuSW50ZXJhY3RFdmVudCA9IF9JbnRlcmFjdEV2ZW50W1wiZGVmYXVsdFwiXTtcbiAgICB0aGlzLmludGVyYWN0YWJsZXMgPSBuZXcgX0ludGVyYWN0YWJsZVNldFtcImRlZmF1bHRcIl0odGhpcyk7IC8vIGFsbCBkb2N1bWVudHMgYmVpbmcgbGlzdGVuZWQgdG9cblxuICAgIHRoaXMuZG9jdW1lbnRzID0gW107XG4gICAgdGhpcy5fcGx1Z2lucyA9IFtdO1xuICAgIHRoaXMuX3BsdWdpbk1hcCA9IHt9O1xuXG4gICAgdGhpcy5vbldpbmRvd1VubG9hZCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgcmV0dXJuIF90aGlzLnJlbW92ZURvY3VtZW50KGV2ZW50LnRhcmdldCk7XG4gICAgfTtcblxuICAgIHZhciBzY29wZSA9IHRoaXM7XG5cbiAgICB0aGlzLkludGVyYWN0YWJsZSA9XG4gICAgLyojX19QVVJFX18qL1xuICAgIGZ1bmN0aW9uIChfSW50ZXJhY3RhYmxlQmFzZSkge1xuICAgICAgX2luaGVyaXRzKEludGVyYWN0YWJsZSwgX0ludGVyYWN0YWJsZUJhc2UpO1xuXG4gICAgICBmdW5jdGlvbiBJbnRlcmFjdGFibGUoKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBJbnRlcmFjdGFibGUpO1xuXG4gICAgICAgIHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoSW50ZXJhY3RhYmxlKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgICAgIH1cblxuICAgICAgX2NyZWF0ZUNsYXNzKEludGVyYWN0YWJsZSwgW3tcbiAgICAgICAga2V5OiBcInNldFwiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gc2V0KG9wdGlvbnMpIHtcbiAgICAgICAgICBfZ2V0KF9nZXRQcm90b3R5cGVPZihJbnRlcmFjdGFibGUucHJvdG90eXBlKSwgXCJzZXRcIiwgdGhpcykuY2FsbCh0aGlzLCBvcHRpb25zKTtcblxuICAgICAgICAgIHNjb3BlLmludGVyYWN0YWJsZXMuc2lnbmFscy5maXJlKCdzZXQnLCB7XG4gICAgICAgICAgICBvcHRpb25zOiBvcHRpb25zLFxuICAgICAgICAgICAgaW50ZXJhY3RhYmxlOiB0aGlzXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiBcInVuc2V0XCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiB1bnNldCgpIHtcbiAgICAgICAgICBfZ2V0KF9nZXRQcm90b3R5cGVPZihJbnRlcmFjdGFibGUucHJvdG90eXBlKSwgXCJ1bnNldFwiLCB0aGlzKS5jYWxsKHRoaXMpO1xuXG4gICAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IHNjb3BlLmludGVyYWN0aW9ucy5saXN0Lmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIF9yZWY7XG5cbiAgICAgICAgICAgIF9yZWYgPSBzY29wZS5pbnRlcmFjdGlvbnMubGlzdFtfaV07XG4gICAgICAgICAgICB2YXIgaW50ZXJhY3Rpb24gPSBfcmVmO1xuXG4gICAgICAgICAgICBpZiAoaW50ZXJhY3Rpb24uaW50ZXJhY3RhYmxlID09PSB0aGlzKSB7XG4gICAgICAgICAgICAgIGludGVyYWN0aW9uLnN0b3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzY29wZS5pbnRlcmFjdGFibGVzLnNpZ25hbHMuZmlyZSgndW5zZXQnLCB7XG4gICAgICAgICAgICBpbnRlcmFjdGFibGU6IHRoaXNcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6IFwiX2RlZmF1bHRzXCIsXG4gICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgIHJldHVybiBzY29wZS5kZWZhdWx0cztcbiAgICAgICAgfVxuICAgICAgfV0pO1xuXG4gICAgICByZXR1cm4gSW50ZXJhY3RhYmxlO1xuICAgIH0oX0ludGVyYWN0YWJsZVtcImRlZmF1bHRcIl0pO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFNjb3BlLCBbe1xuICAgIGtleTogXCJpbml0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGluaXQod2luZG93KSB7XG4gICAgICByZXR1cm4gaW5pdFNjb3BlKHRoaXMsIHdpbmRvdyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInBsdWdpbklzSW5zdGFsbGVkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHBsdWdpbklzSW5zdGFsbGVkKHBsdWdpbikge1xuICAgICAgcmV0dXJuIHRoaXMuX3BsdWdpbk1hcFtwbHVnaW4uaWRdIHx8IHRoaXMuX3BsdWdpbnMuaW5kZXhPZihwbHVnaW4pICE9PSAtMTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidXNlUGx1Z2luXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHVzZVBsdWdpbihwbHVnaW4sIG9wdGlvbnMpIHtcbiAgICAgIGlmICh0aGlzLnBsdWdpbklzSW5zdGFsbGVkKHBsdWdpbikpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIGlmIChwbHVnaW4uaWQpIHtcbiAgICAgICAgdGhpcy5fcGx1Z2luTWFwW3BsdWdpbi5pZF0gPSBwbHVnaW47XG4gICAgICB9XG5cbiAgICAgIHBsdWdpbi5pbnN0YWxsKHRoaXMsIG9wdGlvbnMpO1xuXG4gICAgICB0aGlzLl9wbHVnaW5zLnB1c2gocGx1Z2luKTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImFkZERvY3VtZW50XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZERvY3VtZW50KGRvYywgb3B0aW9ucykge1xuICAgICAgLy8gZG8gbm90aGluZyBpZiBkb2N1bWVudCBpcyBhbHJlYWR5IGtub3duXG4gICAgICBpZiAodGhpcy5nZXREb2NJbmRleChkb2MpICE9PSAtMSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHZhciB3aW5kb3cgPSB3aW4uZ2V0V2luZG93KGRvYyk7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyA/IHV0aWxzLmV4dGVuZCh7fSwgb3B0aW9ucykgOiB7fTtcbiAgICAgIHRoaXMuZG9jdW1lbnRzLnB1c2goe1xuICAgICAgICBkb2M6IGRvYyxcbiAgICAgICAgb3B0aW9uczogb3B0aW9uc1xuICAgICAgfSk7XG4gICAgICBldmVudHMuZG9jdW1lbnRzLnB1c2goZG9jKTsgLy8gZG9uJ3QgYWRkIGFuIHVubG9hZCBldmVudCBmb3IgdGhlIG1haW4gZG9jdW1lbnRcbiAgICAgIC8vIHNvIHRoYXQgdGhlIHBhZ2UgbWF5IGJlIGNhY2hlZCBpbiBicm93c2VyIGhpc3RvcnlcblxuICAgICAgaWYgKGRvYyAhPT0gdGhpcy5kb2N1bWVudCkge1xuICAgICAgICBldmVudHMuYWRkKHdpbmRvdywgJ3VubG9hZCcsIHRoaXMub25XaW5kb3dVbmxvYWQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNpZ25hbHMuZmlyZSgnYWRkLWRvY3VtZW50Jywge1xuICAgICAgICBkb2M6IGRvYyxcbiAgICAgICAgd2luZG93OiB3aW5kb3csXG4gICAgICAgIHNjb3BlOiB0aGlzLFxuICAgICAgICBvcHRpb25zOiBvcHRpb25zXG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVtb3ZlRG9jdW1lbnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlRG9jdW1lbnQoZG9jKSB7XG4gICAgICB2YXIgaW5kZXggPSB0aGlzLmdldERvY0luZGV4KGRvYyk7XG4gICAgICB2YXIgd2luZG93ID0gd2luLmdldFdpbmRvdyhkb2MpO1xuICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLmRvY3VtZW50c1tpbmRleF0ub3B0aW9ucztcbiAgICAgIGV2ZW50cy5yZW1vdmUod2luZG93LCAndW5sb2FkJywgdGhpcy5vbldpbmRvd1VubG9hZCk7XG4gICAgICB0aGlzLmRvY3VtZW50cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgZXZlbnRzLmRvY3VtZW50cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgdGhpcy5zaWduYWxzLmZpcmUoJ3JlbW92ZS1kb2N1bWVudCcsIHtcbiAgICAgICAgZG9jOiBkb2MsXG4gICAgICAgIHdpbmRvdzogd2luZG93LFxuICAgICAgICBzY29wZTogdGhpcyxcbiAgICAgICAgb3B0aW9uczogb3B0aW9uc1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldERvY0luZGV4XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldERvY0luZGV4KGRvYykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmRvY3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5kb2N1bWVudHNbaV0uZG9jID09PSBkb2MpIHtcbiAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldERvY09wdGlvbnNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0RG9jT3B0aW9ucyhkb2MpIHtcbiAgICAgIHZhciBkb2NJbmRleCA9IHRoaXMuZ2V0RG9jSW5kZXgoZG9jKTtcbiAgICAgIHJldHVybiBkb2NJbmRleCA9PT0gLTEgPyBudWxsIDogdGhpcy5kb2N1bWVudHNbZG9jSW5kZXhdLm9wdGlvbnM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm5vd1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBub3coKSB7XG4gICAgICByZXR1cm4gKHRoaXMud2luZG93LkRhdGUgfHwgRGF0ZSkubm93KCk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFNjb3BlO1xufSgpO1xuXG5leHBvcnRzLlNjb3BlID0gU2NvcGU7XG5cbmZ1bmN0aW9uIGluaXRTY29wZShzY29wZSwgd2luZG93KSB7XG4gIHdpbi5pbml0KHdpbmRvdyk7XG5cbiAgX2RvbU9iamVjdHNbXCJkZWZhdWx0XCJdLmluaXQod2luZG93KTtcblxuICBicm93c2VyLmluaXQod2luZG93KTtcbiAgcmFmLmluaXQod2luZG93KTtcbiAgZXZlbnRzLmluaXQod2luZG93KTtcbiAgc2NvcGUudXNlUGx1Z2luKF9pbnRlcmFjdGlvbnNbXCJkZWZhdWx0XCJdKTtcbiAgc2NvcGUuZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG4gIHNjb3BlLndpbmRvdyA9IHdpbmRvdztcbiAgcmV0dXJuIHNjb3BlO1xufVxuXG59LHtcIi4vRXZlbnRhYmxlXCI6MTQsXCIuL0ludGVyYWN0RXZlbnRcIjoxNSxcIi4vSW50ZXJhY3RhYmxlXCI6MTYsXCIuL0ludGVyYWN0YWJsZVNldFwiOjE3LFwiLi9kZWZhdWx0T3B0aW9uc1wiOjIwLFwiLi9pbnRlcmFjdGlvbnNcIjoyMyxcIkBpbnRlcmFjdGpzL3V0aWxzXCI6NTUsXCJAaW50ZXJhY3Rqcy91dGlscy9kb21PYmplY3RzXCI6NDl9XSwyNTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMudG91Y2hBY3Rpb24gPSB0b3VjaEFjdGlvbjtcbmV4cG9ydHMuYm94U2l6aW5nID0gYm94U2l6aW5nO1xuZXhwb3J0cy5ub0xpc3RlbmVycyA9IG5vTGlzdGVuZXJzO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBleHBvcnRzLm5vTGlzdGVuZXJzTWVzc2FnZSA9IGV4cG9ydHMuYm94U2l6aW5nTWVzc2FnZSA9IGV4cG9ydHMudG91Y2hBY3Rpb25NZXNzYWdlID0gZXhwb3J0cy5pbnN0YWxsID0gZXhwb3J0cy5saW5rcyA9IHZvaWQgMDtcblxudmFyIF9kb21PYmplY3RzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiQGludGVyYWN0anMvdXRpbHMvZG9tT2JqZWN0c1wiKSk7XG5cbnZhciBfZG9tVXRpbHMgPSByZXF1aXJlKFwiQGludGVyYWN0anMvdXRpbHMvZG9tVXRpbHNcIik7XG5cbnZhciBpcyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy91dGlscy9pc1wiKSk7XG5cbnZhciBfd2luZG93ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiQGludGVyYWN0anMvdXRpbHMvd2luZG93XCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iajsgfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgeyB2YXIgZGVzYyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID8gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIGtleSkgOiB7fTsgaWYgKGRlc2MuZ2V0IHx8IGRlc2Muc2V0KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuZXdPYmosIGtleSwgZGVzYyk7IH0gZWxzZSB7IG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSB9IH0gbmV3T2JqW1wiZGVmYXVsdFwiXSA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5cbi8qIGdsb2JhbCBwcm9jZXNzICovXG52YXIgbGlua3MgPSB7XG4gIHRvdWNoQWN0aW9uOiAnaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQ1NTL3RvdWNoLWFjdGlvbicsXG4gIGJveFNpemluZzogJ2h0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0NTUy9ib3gtc2l6aW5nJ1xufTtcbmV4cG9ydHMubGlua3MgPSBsaW5rcztcbnZhciBpbnN0YWxsID0gdW5kZWZpbmVkID09PSAncHJvZHVjdGlvbicgPyBmdW5jdGlvbiAoKSB7fSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmVzdHJpY3RlZC1zeW50YXhcbjogZnVuY3Rpb24gaW5zdGFsbChzY29wZSkge1xuICB2YXIgX3JlZiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge30sXG4gICAgICBsb2dnZXIgPSBfcmVmLmxvZ2dlcjtcblxuICBsb2dnZXIgPSBsb2dnZXIgfHwgY29uc29sZTtcblxuICBpZiAodW5kZWZpbmVkICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBzY29wZS5sb2dnZXIgPSBsb2dnZXI7XG4gICAgc2NvcGUuaW50ZXJhY3Rpb25zLnNpZ25hbHMub24oJ2FjdGlvbi1zdGFydCcsIGZ1bmN0aW9uIChfcmVmMikge1xuICAgICAgdmFyIGludGVyYWN0aW9uID0gX3JlZjIuaW50ZXJhY3Rpb247XG4gICAgICB0b3VjaEFjdGlvbihpbnRlcmFjdGlvbiwgc2NvcGUubG9nZ2VyKTtcbiAgICAgIGJveFNpemluZyhpbnRlcmFjdGlvbiwgc2NvcGUubG9nZ2VyKTtcbiAgICAgIG5vTGlzdGVuZXJzKGludGVyYWN0aW9uLCBzY29wZS5sb2dnZXIpO1xuICAgIH0pO1xuICB9XG59O1xuZXhwb3J0cy5pbnN0YWxsID0gaW5zdGFsbDtcbnZhciB0b3VjaEFjdGlvbk1lc3NhZ2UgPSAnW2ludGVyYWN0LmpzXSBDb25zaWRlciBhZGRpbmcgQ1NTIFwidG91Y2gtYWN0aW9uOiBub25lXCIgdG8gdGhpcyBlbGVtZW50XFxuJztcbmV4cG9ydHMudG91Y2hBY3Rpb25NZXNzYWdlID0gdG91Y2hBY3Rpb25NZXNzYWdlO1xudmFyIGJveFNpemluZ01lc3NhZ2UgPSAnW2ludGVyYWN0LmpzXSBDb25zaWRlciBhZGRpbmcgQ1NTIFwiYm94LXNpemluZzogYm9yZGVyLWJveFwiIHRvIHRoaXMgcmVzaXphYmxlIGVsZW1lbnQnO1xuZXhwb3J0cy5ib3hTaXppbmdNZXNzYWdlID0gYm94U2l6aW5nTWVzc2FnZTtcbnZhciBub0xpc3RlbmVyc01lc3NhZ2UgPSAnW2ludGVyYWN0LmpzXSBUaGVyZSBhcmUgbm8gbGlzdGVuZXJzIHNldCBmb3IgdGhpcyBhY3Rpb24nO1xuZXhwb3J0cy5ub0xpc3RlbmVyc01lc3NhZ2UgPSBub0xpc3RlbmVyc01lc3NhZ2U7XG5cbmZ1bmN0aW9uIHRvdWNoQWN0aW9uKF9yZWYzLCBsb2dnZXIpIHtcbiAgdmFyIGVsZW1lbnQgPSBfcmVmMy5lbGVtZW50O1xuXG4gIGlmICghcGFyZW50SGFzU3R5bGUoZWxlbWVudCwgJ3RvdWNoQWN0aW9uJywgL3Bhbi18cGluY2h8bm9uZS8pKSB7XG4gICAgbG9nZ2VyLndhcm4odG91Y2hBY3Rpb25NZXNzYWdlLCBlbGVtZW50LCBsaW5rcy50b3VjaEFjdGlvbik7XG4gIH1cbn1cblxuZnVuY3Rpb24gYm94U2l6aW5nKGludGVyYWN0aW9uLCBsb2dnZXIpIHtcbiAgdmFyIGVsZW1lbnQgPSBpbnRlcmFjdGlvbi5lbGVtZW50O1xuXG4gIGlmIChpbnRlcmFjdGlvbi5wcmVwYXJlZC5uYW1lID09PSAncmVzaXplJyAmJiBlbGVtZW50IGluc3RhbmNlb2YgX2RvbU9iamVjdHNbXCJkZWZhdWx0XCJdLkhUTUxFbGVtZW50ICYmICFoYXNTdHlsZShlbGVtZW50LCAnYm94U2l6aW5nJywgL2JvcmRlci1ib3gvKSkge1xuICAgIGxvZ2dlci53YXJuKGJveFNpemluZ01lc3NhZ2UsIGVsZW1lbnQsIGxpbmtzLmJveFNpemluZyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbm9MaXN0ZW5lcnMoaW50ZXJhY3Rpb24sIGxvZ2dlcikge1xuICB2YXIgYWN0aW9uTmFtZSA9IGludGVyYWN0aW9uLnByZXBhcmVkLm5hbWU7XG4gIHZhciBtb3ZlTGlzdGVuZXJzID0gaW50ZXJhY3Rpb24uaW50ZXJhY3RhYmxlLmV2ZW50cy50eXBlc1tcIlwiLmNvbmNhdChhY3Rpb25OYW1lLCBcIm1vdmVcIildIHx8IFtdO1xuXG4gIGlmICghbW92ZUxpc3RlbmVycy5sZW5ndGgpIHtcbiAgICBsb2dnZXIud2Fybihub0xpc3RlbmVyc01lc3NhZ2UsIGFjdGlvbk5hbWUsIGludGVyYWN0aW9uLmludGVyYWN0YWJsZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFzU3R5bGUoZWxlbWVudCwgcHJvcCwgc3R5bGVSZSkge1xuICByZXR1cm4gc3R5bGVSZS50ZXN0KGVsZW1lbnQuc3R5bGVbcHJvcF0gfHwgX3dpbmRvd1tcImRlZmF1bHRcIl0ud2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudClbcHJvcF0pO1xufVxuXG5mdW5jdGlvbiBwYXJlbnRIYXNTdHlsZShlbGVtZW50LCBwcm9wLCBzdHlsZVJlKSB7XG4gIHZhciBwYXJlbnQgPSBlbGVtZW50O1xuXG4gIHdoaWxlIChpcy5lbGVtZW50KHBhcmVudCkpIHtcbiAgICBpZiAoaGFzU3R5bGUocGFyZW50LCBwcm9wLCBzdHlsZVJlKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcGFyZW50ID0gKDAsIF9kb21VdGlscy5wYXJlbnROb2RlKShwYXJlbnQpO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG52YXIgX2RlZmF1bHQgPSB7XG4gIGlkOiAnZGV2LXRvb2xzJyxcbiAgaW5zdGFsbDogaW5zdGFsbFxufTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5cbn0se1wiQGludGVyYWN0anMvdXRpbHMvZG9tT2JqZWN0c1wiOjQ5LFwiQGludGVyYWN0anMvdXRpbHMvZG9tVXRpbHNcIjo1MCxcIkBpbnRlcmFjdGpzL3V0aWxzL2lzXCI6NTYsXCJAaW50ZXJhY3Rqcy91dGlscy93aW5kb3dcIjo2NX1dLDI2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciBfSW50ZXJhY3RFdmVudCA9IHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy9jb3JlL0ludGVyYWN0RXZlbnRcIik7XG5cbnZhciBfYmFzZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIkBpbnRlcmFjdGpzL21vZGlmaWVycy9iYXNlXCIpKTtcblxudmFyIHV0aWxzID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQocmVxdWlyZShcIkBpbnRlcmFjdGpzL3V0aWxzXCIpKTtcblxudmFyIF9yYWYgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy91dGlscy9yYWZcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7IHZhciBkZXNjID0gT2JqZWN0LmRlZmluZVByb3BlcnR5ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KSA6IHt9OyBpZiAoZGVzYy5nZXQgfHwgZGVzYy5zZXQpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5ld09iaiwga2V5LCBkZXNjKTsgfSBlbHNlIHsgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IH0gfSBuZXdPYmpbXCJkZWZhdWx0XCJdID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbl9JbnRlcmFjdEV2ZW50LkV2ZW50UGhhc2UuUmVzdW1lID0gJ3Jlc3VtZSc7XG5fSW50ZXJhY3RFdmVudC5FdmVudFBoYXNlLkluZXJ0aWFTdGFydCA9ICdpbmVydGlhc3RhcnQnO1xuXG5mdW5jdGlvbiBpbnN0YWxsKHNjb3BlKSB7XG4gIHZhciBpbnRlcmFjdGlvbnMgPSBzY29wZS5pbnRlcmFjdGlvbnMsXG4gICAgICBkZWZhdWx0cyA9IHNjb3BlLmRlZmF1bHRzO1xuICBpbnRlcmFjdGlvbnMuc2lnbmFscy5vbignbmV3JywgZnVuY3Rpb24gKF9yZWYpIHtcbiAgICB2YXIgaW50ZXJhY3Rpb24gPSBfcmVmLmludGVyYWN0aW9uO1xuICAgIGludGVyYWN0aW9uLmluZXJ0aWEgPSB7XG4gICAgICBhY3RpdmU6IGZhbHNlLFxuICAgICAgc21vb3RoRW5kOiBmYWxzZSxcbiAgICAgIGFsbG93UmVzdW1lOiBmYWxzZSxcbiAgICAgIHVwQ29vcmRzOiB7fSxcbiAgICAgIHRpbWVvdXQ6IG51bGxcbiAgICB9O1xuICB9KTsgLy8gRklYTUUgcHJvcGVyIHNpZ25hbCB0eXBpbmdcblxuICBpbnRlcmFjdGlvbnMuc2lnbmFscy5vbignYmVmb3JlLWFjdGlvbi1lbmQnLCBmdW5jdGlvbiAoYXJnKSB7XG4gICAgcmV0dXJuIHJlbGVhc2UoYXJnLCBzY29wZSk7XG4gIH0pO1xuICBpbnRlcmFjdGlvbnMuc2lnbmFscy5vbignZG93bicsIGZ1bmN0aW9uIChhcmcpIHtcbiAgICByZXR1cm4gcmVzdW1lKGFyZywgc2NvcGUpO1xuICB9KTtcbiAgaW50ZXJhY3Rpb25zLnNpZ25hbHMub24oJ3N0b3AnLCBmdW5jdGlvbiAoYXJnKSB7XG4gICAgcmV0dXJuIHN0b3AoYXJnKTtcbiAgfSk7XG4gIGRlZmF1bHRzLnBlckFjdGlvbi5pbmVydGlhID0ge1xuICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgIHJlc2lzdGFuY2U6IDEwLFxuICAgIG1pblNwZWVkOiAxMDAsXG4gICAgZW5kU3BlZWQ6IDEwLFxuICAgIGFsbG93UmVzdW1lOiB0cnVlLFxuICAgIHNtb290aEVuZER1cmF0aW9uOiAzMDBcbiAgfTtcbiAgc2NvcGUudXNlUGx1Z2luKF9iYXNlW1wiZGVmYXVsdFwiXSk7XG59XG5cbmZ1bmN0aW9uIHJlc3VtZShfcmVmMiwgc2NvcGUpIHtcbiAgdmFyIGludGVyYWN0aW9uID0gX3JlZjIuaW50ZXJhY3Rpb24sXG4gICAgICBldmVudCA9IF9yZWYyLmV2ZW50LFxuICAgICAgcG9pbnRlciA9IF9yZWYyLnBvaW50ZXIsXG4gICAgICBldmVudFRhcmdldCA9IF9yZWYyLmV2ZW50VGFyZ2V0O1xuICB2YXIgc3RhdGUgPSBpbnRlcmFjdGlvbi5pbmVydGlhOyAvLyBDaGVjayBpZiB0aGUgZG93biBldmVudCBoaXRzIHRoZSBjdXJyZW50IGluZXJ0aWEgdGFyZ2V0XG5cbiAgaWYgKHN0YXRlLmFjdGl2ZSkge1xuICAgIHZhciBlbGVtZW50ID0gZXZlbnRUYXJnZXQ7IC8vIGNsaW1iIHVwIHRoZSBET00gdHJlZSBmcm9tIHRoZSBldmVudCB0YXJnZXRcblxuICAgIHdoaWxlICh1dGlscy5pcy5lbGVtZW50KGVsZW1lbnQpKSB7XG4gICAgICAvLyBpZiBpbnRlcmFjdGlvbiBlbGVtZW50IGlzIHRoZSBjdXJyZW50IGluZXJ0aWEgdGFyZ2V0IGVsZW1lbnRcbiAgICAgIGlmIChlbGVtZW50ID09PSBpbnRlcmFjdGlvbi5lbGVtZW50KSB7XG4gICAgICAgIC8vIHN0b3AgaW5lcnRpYVxuICAgICAgICBfcmFmW1wiZGVmYXVsdFwiXS5jYW5jZWwoc3RhdGUudGltZW91dCk7XG5cbiAgICAgICAgc3RhdGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIGludGVyYWN0aW9uLnNpbXVsYXRpb24gPSBudWxsOyAvLyB1cGRhdGUgcG9pbnRlcnMgdG8gdGhlIGRvd24gZXZlbnQncyBjb29yZGluYXRlc1xuXG4gICAgICAgIGludGVyYWN0aW9uLnVwZGF0ZVBvaW50ZXIocG9pbnRlciwgZXZlbnQsIGV2ZW50VGFyZ2V0LCB0cnVlKTtcbiAgICAgICAgdXRpbHMucG9pbnRlci5zZXRDb29yZHMoaW50ZXJhY3Rpb24uY29vcmRzLmN1ciwgaW50ZXJhY3Rpb24ucG9pbnRlcnMubWFwKGZ1bmN0aW9uIChwKSB7XG4gICAgICAgICAgcmV0dXJuIHAucG9pbnRlcjtcbiAgICAgICAgfSksIGludGVyYWN0aW9uLl9ub3coKSk7IC8vIGZpcmUgYXBwcm9wcmlhdGUgc2lnbmFsc1xuXG4gICAgICAgIHZhciBzaWduYWxBcmcgPSB7XG4gICAgICAgICAgaW50ZXJhY3Rpb246IGludGVyYWN0aW9uXG4gICAgICAgIH07XG4gICAgICAgIHNjb3BlLmludGVyYWN0aW9ucy5zaWduYWxzLmZpcmUoJ2FjdGlvbi1yZXN1bWUnLCBzaWduYWxBcmcpOyAvLyBmaXJlIGEgcmV1bWUgZXZlbnRcblxuICAgICAgICB2YXIgcmVzdW1lRXZlbnQgPSBuZXcgc2NvcGUuSW50ZXJhY3RFdmVudChpbnRlcmFjdGlvbiwgZXZlbnQsIGludGVyYWN0aW9uLnByZXBhcmVkLm5hbWUsIF9JbnRlcmFjdEV2ZW50LkV2ZW50UGhhc2UuUmVzdW1lLCBpbnRlcmFjdGlvbi5lbGVtZW50KTtcblxuICAgICAgICBpbnRlcmFjdGlvbi5fZmlyZUV2ZW50KHJlc3VtZUV2ZW50KTtcblxuICAgICAgICB1dGlscy5wb2ludGVyLmNvcHlDb29yZHMoaW50ZXJhY3Rpb24uY29vcmRzLnByZXYsIGludGVyYWN0aW9uLmNvb3Jkcy5jdXIpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgZWxlbWVudCA9IHV0aWxzLmRvbS5wYXJlbnROb2RlKGVsZW1lbnQpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiByZWxlYXNlKF9yZWYzLCBzY29wZSkge1xuICB2YXIgaW50ZXJhY3Rpb24gPSBfcmVmMy5pbnRlcmFjdGlvbixcbiAgICAgIGV2ZW50ID0gX3JlZjMuZXZlbnQsXG4gICAgICBub1ByZUVuZCA9IF9yZWYzLm5vUHJlRW5kO1xuICB2YXIgc3RhdGUgPSBpbnRlcmFjdGlvbi5pbmVydGlhO1xuXG4gIGlmICghaW50ZXJhY3Rpb24uaW50ZXJhY3RpbmcoKSB8fCBpbnRlcmFjdGlvbi5zaW11bGF0aW9uICYmIGludGVyYWN0aW9uLnNpbXVsYXRpb24uYWN0aXZlIHx8IG5vUHJlRW5kKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2YXIgb3B0aW9ucyA9IGdldE9wdGlvbnMoaW50ZXJhY3Rpb24pO1xuXG4gIHZhciBub3cgPSBpbnRlcmFjdGlvbi5fbm93KCk7XG5cbiAgdmFyIHZlbG9jaXR5Q2xpZW50ID0gaW50ZXJhY3Rpb24uY29vcmRzLnZlbG9jaXR5LmNsaWVudDtcbiAgdmFyIHBvaW50ZXJTcGVlZCA9IHV0aWxzLmh5cG90KHZlbG9jaXR5Q2xpZW50LngsIHZlbG9jaXR5Q2xpZW50LnkpO1xuICB2YXIgc21vb3RoRW5kID0gZmFsc2U7XG4gIHZhciBtb2RpZmllclJlc3VsdDsgLy8gY2hlY2sgaWYgaW5lcnRpYSBzaG91bGQgYmUgc3RhcnRlZFxuXG4gIHZhciBpbmVydGlhUG9zc2libGUgPSBvcHRpb25zICYmIG9wdGlvbnMuZW5hYmxlZCAmJiBpbnRlcmFjdGlvbi5wcmVwYXJlZC5uYW1lICE9PSAnZ2VzdHVyZScgJiYgZXZlbnQgIT09IHN0YXRlLnN0YXJ0RXZlbnQ7XG4gIHZhciBpbmVydGlhID0gaW5lcnRpYVBvc3NpYmxlICYmIG5vdyAtIGludGVyYWN0aW9uLmNvb3Jkcy5jdXIudGltZVN0YW1wIDwgNTAgJiYgcG9pbnRlclNwZWVkID4gb3B0aW9ucy5taW5TcGVlZCAmJiBwb2ludGVyU3BlZWQgPiBvcHRpb25zLmVuZFNwZWVkO1xuICB2YXIgbW9kaWZpZXJBcmcgPSB7XG4gICAgaW50ZXJhY3Rpb246IGludGVyYWN0aW9uLFxuICAgIHBhZ2VDb29yZHM6IHV0aWxzLmV4dGVuZCh7fSwgaW50ZXJhY3Rpb24uY29vcmRzLmN1ci5wYWdlKSxcbiAgICBzdGF0ZXM6IGluZXJ0aWFQb3NzaWJsZSAmJiBpbnRlcmFjdGlvbi5tb2RpZmllcnMuc3RhdGVzLm1hcChmdW5jdGlvbiAobW9kaWZpZXJTdGF0dXMpIHtcbiAgICAgIHJldHVybiB1dGlscy5leHRlbmQoe30sIG1vZGlmaWVyU3RhdHVzKTtcbiAgICB9KSxcbiAgICBwcmVFbmQ6IHRydWUsXG4gICAgcHJldkNvb3JkczogdW5kZWZpbmVkLFxuICAgIHJlcXVpcmVFbmRPbmx5OiBudWxsXG4gIH07IC8vIHNtb290aEVuZFxuXG4gIGlmIChpbmVydGlhUG9zc2libGUgJiYgIWluZXJ0aWEpIHtcbiAgICBtb2RpZmllckFyZy5wcmV2Q29vcmRzID0gaW50ZXJhY3Rpb24ucHJldkV2ZW50LnBhZ2U7XG4gICAgbW9kaWZpZXJBcmcucmVxdWlyZUVuZE9ubHkgPSBmYWxzZTtcbiAgICBtb2RpZmllclJlc3VsdCA9IF9iYXNlW1wiZGVmYXVsdFwiXS5zZXRBbGwobW9kaWZpZXJBcmcpO1xuXG4gICAgaWYgKG1vZGlmaWVyUmVzdWx0LmNoYW5nZWQpIHtcbiAgICAgIHNtb290aEVuZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKCEoaW5lcnRpYSB8fCBzbW9vdGhFbmQpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB1dGlscy5wb2ludGVyLmNvcHlDb29yZHMoc3RhdGUudXBDb29yZHMsIGludGVyYWN0aW9uLmNvb3Jkcy5jdXIpO1xuICBpbnRlcmFjdGlvbi5wb2ludGVyc1swXS5wb2ludGVyID0gc3RhdGUuc3RhcnRFdmVudCA9IG5ldyBzY29wZS5JbnRlcmFjdEV2ZW50KGludGVyYWN0aW9uLCBldmVudCwgLy8gRklYTUUgYWRkIHByb3BlciB0eXBpbmcgQWN0aW9uLm5hbWVcbiAgaW50ZXJhY3Rpb24ucHJlcGFyZWQubmFtZSwgX0ludGVyYWN0RXZlbnQuRXZlbnRQaGFzZS5JbmVydGlhU3RhcnQsIGludGVyYWN0aW9uLmVsZW1lbnQpO1xuICBzdGF0ZS50MCA9IG5vdztcbiAgc3RhdGUuYWN0aXZlID0gdHJ1ZTtcbiAgc3RhdGUuYWxsb3dSZXN1bWUgPSBvcHRpb25zLmFsbG93UmVzdW1lO1xuICBpbnRlcmFjdGlvbi5zaW11bGF0aW9uID0gc3RhdGU7XG4gIGludGVyYWN0aW9uLmludGVyYWN0YWJsZS5maXJlKHN0YXRlLnN0YXJ0RXZlbnQpO1xuXG4gIGlmIChpbmVydGlhKSB7XG4gICAgc3RhdGUudngwID0gaW50ZXJhY3Rpb24uY29vcmRzLnZlbG9jaXR5LmNsaWVudC54O1xuICAgIHN0YXRlLnZ5MCA9IGludGVyYWN0aW9uLmNvb3Jkcy52ZWxvY2l0eS5jbGllbnQueTtcbiAgICBzdGF0ZS52MCA9IHBvaW50ZXJTcGVlZDtcbiAgICBjYWxjSW5lcnRpYShpbnRlcmFjdGlvbiwgc3RhdGUpO1xuICAgIHV0aWxzLmV4dGVuZChtb2RpZmllckFyZy5wYWdlQ29vcmRzLCBpbnRlcmFjdGlvbi5jb29yZHMuY3VyLnBhZ2UpO1xuICAgIG1vZGlmaWVyQXJnLnBhZ2VDb29yZHMueCArPSBzdGF0ZS54ZTtcbiAgICBtb2RpZmllckFyZy5wYWdlQ29vcmRzLnkgKz0gc3RhdGUueWU7XG4gICAgbW9kaWZpZXJBcmcucHJldkNvb3JkcyA9IHVuZGVmaW5lZDtcbiAgICBtb2RpZmllckFyZy5yZXF1aXJlRW5kT25seSA9IHRydWU7XG4gICAgbW9kaWZpZXJSZXN1bHQgPSBfYmFzZVtcImRlZmF1bHRcIl0uc2V0QWxsKG1vZGlmaWVyQXJnKTtcbiAgICBzdGF0ZS5tb2RpZmllZFhlICs9IG1vZGlmaWVyUmVzdWx0LmRlbHRhLng7XG4gICAgc3RhdGUubW9kaWZpZWRZZSArPSBtb2RpZmllclJlc3VsdC5kZWx0YS55O1xuICAgIHN0YXRlLnRpbWVvdXQgPSBfcmFmW1wiZGVmYXVsdFwiXS5yZXF1ZXN0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBpbmVydGlhVGljayhpbnRlcmFjdGlvbik7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgc3RhdGUuc21vb3RoRW5kID0gdHJ1ZTtcbiAgICBzdGF0ZS54ZSA9IG1vZGlmaWVyUmVzdWx0LmRlbHRhLng7XG4gICAgc3RhdGUueWUgPSBtb2RpZmllclJlc3VsdC5kZWx0YS55O1xuICAgIHN0YXRlLnN4ID0gc3RhdGUuc3kgPSAwO1xuICAgIHN0YXRlLnRpbWVvdXQgPSBfcmFmW1wiZGVmYXVsdFwiXS5yZXF1ZXN0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBzbW90aEVuZFRpY2soaW50ZXJhY3Rpb24pO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBzdG9wKF9yZWY0KSB7XG4gIHZhciBpbnRlcmFjdGlvbiA9IF9yZWY0LmludGVyYWN0aW9uO1xuICB2YXIgc3RhdGUgPSBpbnRlcmFjdGlvbi5pbmVydGlhO1xuXG4gIGlmIChzdGF0ZS5hY3RpdmUpIHtcbiAgICBfcmFmW1wiZGVmYXVsdFwiXS5jYW5jZWwoc3RhdGUudGltZW91dCk7XG5cbiAgICBzdGF0ZS5hY3RpdmUgPSBmYWxzZTtcbiAgICBpbnRlcmFjdGlvbi5zaW11bGF0aW9uID0gbnVsbDtcbiAgfVxufVxuXG5mdW5jdGlvbiBjYWxjSW5lcnRpYShpbnRlcmFjdGlvbiwgc3RhdGUpIHtcbiAgdmFyIG9wdGlvbnMgPSBnZXRPcHRpb25zKGludGVyYWN0aW9uKTtcbiAgdmFyIGxhbWJkYSA9IG9wdGlvbnMucmVzaXN0YW5jZTtcbiAgdmFyIGluZXJ0aWFEdXIgPSAtTWF0aC5sb2cob3B0aW9ucy5lbmRTcGVlZCAvIHN0YXRlLnYwKSAvIGxhbWJkYTtcbiAgc3RhdGUueDAgPSBpbnRlcmFjdGlvbi5wcmV2RXZlbnQucGFnZS54O1xuICBzdGF0ZS55MCA9IGludGVyYWN0aW9uLnByZXZFdmVudC5wYWdlLnk7XG4gIHN0YXRlLnQwID0gc3RhdGUuc3RhcnRFdmVudC50aW1lU3RhbXAgLyAxMDAwO1xuICBzdGF0ZS5zeCA9IHN0YXRlLnN5ID0gMDtcbiAgc3RhdGUubW9kaWZpZWRYZSA9IHN0YXRlLnhlID0gKHN0YXRlLnZ4MCAtIGluZXJ0aWFEdXIpIC8gbGFtYmRhO1xuICBzdGF0ZS5tb2RpZmllZFllID0gc3RhdGUueWUgPSAoc3RhdGUudnkwIC0gaW5lcnRpYUR1cikgLyBsYW1iZGE7XG4gIHN0YXRlLnRlID0gaW5lcnRpYUR1cjtcbiAgc3RhdGUubGFtYmRhX3YwID0gbGFtYmRhIC8gc3RhdGUudjA7XG4gIHN0YXRlLm9uZV92ZV92MCA9IDEgLSBvcHRpb25zLmVuZFNwZWVkIC8gc3RhdGUudjA7XG59XG5cbmZ1bmN0aW9uIGluZXJ0aWFUaWNrKGludGVyYWN0aW9uKSB7XG4gIHVwZGF0ZUluZXJ0aWFDb29yZHMoaW50ZXJhY3Rpb24pO1xuICB1dGlscy5wb2ludGVyLnNldENvb3JkRGVsdGFzKGludGVyYWN0aW9uLmNvb3Jkcy5kZWx0YSwgaW50ZXJhY3Rpb24uY29vcmRzLnByZXYsIGludGVyYWN0aW9uLmNvb3Jkcy5jdXIpO1xuICB1dGlscy5wb2ludGVyLnNldENvb3JkVmVsb2NpdHkoaW50ZXJhY3Rpb24uY29vcmRzLnZlbG9jaXR5LCBpbnRlcmFjdGlvbi5jb29yZHMuZGVsdGEpO1xuICB2YXIgc3RhdGUgPSBpbnRlcmFjdGlvbi5pbmVydGlhO1xuICB2YXIgb3B0aW9ucyA9IGdldE9wdGlvbnMoaW50ZXJhY3Rpb24pO1xuICB2YXIgbGFtYmRhID0gb3B0aW9ucy5yZXNpc3RhbmNlO1xuICB2YXIgdCA9IGludGVyYWN0aW9uLl9ub3coKSAvIDEwMDAgLSBzdGF0ZS50MDtcblxuICBpZiAodCA8IHN0YXRlLnRlKSB7XG4gICAgdmFyIHByb2dyZXNzID0gMSAtIChNYXRoLmV4cCgtbGFtYmRhICogdCkgLSBzdGF0ZS5sYW1iZGFfdjApIC8gc3RhdGUub25lX3ZlX3YwO1xuXG4gICAgaWYgKHN0YXRlLm1vZGlmaWVkWGUgPT09IHN0YXRlLnhlICYmIHN0YXRlLm1vZGlmaWVkWWUgPT09IHN0YXRlLnllKSB7XG4gICAgICBzdGF0ZS5zeCA9IHN0YXRlLnhlICogcHJvZ3Jlc3M7XG4gICAgICBzdGF0ZS5zeSA9IHN0YXRlLnllICogcHJvZ3Jlc3M7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBxdWFkUG9pbnQgPSB1dGlscy5nZXRRdWFkcmF0aWNDdXJ2ZVBvaW50KDAsIDAsIHN0YXRlLnhlLCBzdGF0ZS55ZSwgc3RhdGUubW9kaWZpZWRYZSwgc3RhdGUubW9kaWZpZWRZZSwgcHJvZ3Jlc3MpO1xuICAgICAgc3RhdGUuc3ggPSBxdWFkUG9pbnQueDtcbiAgICAgIHN0YXRlLnN5ID0gcXVhZFBvaW50Lnk7XG4gICAgfVxuXG4gICAgaW50ZXJhY3Rpb24ubW92ZSgpO1xuICAgIHN0YXRlLnRpbWVvdXQgPSBfcmFmW1wiZGVmYXVsdFwiXS5yZXF1ZXN0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBpbmVydGlhVGljayhpbnRlcmFjdGlvbik7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgc3RhdGUuc3ggPSBzdGF0ZS5tb2RpZmllZFhlO1xuICAgIHN0YXRlLnN5ID0gc3RhdGUubW9kaWZpZWRZZTtcbiAgICBpbnRlcmFjdGlvbi5tb3ZlKCk7XG4gICAgaW50ZXJhY3Rpb24uZW5kKHN0YXRlLnN0YXJ0RXZlbnQpO1xuICAgIHN0YXRlLmFjdGl2ZSA9IGZhbHNlO1xuICAgIGludGVyYWN0aW9uLnNpbXVsYXRpb24gPSBudWxsO1xuICB9XG5cbiAgdXRpbHMucG9pbnRlci5jb3B5Q29vcmRzKGludGVyYWN0aW9uLmNvb3Jkcy5wcmV2LCBpbnRlcmFjdGlvbi5jb29yZHMuY3VyKTtcbn1cblxuZnVuY3Rpb24gc21vdGhFbmRUaWNrKGludGVyYWN0aW9uKSB7XG4gIHVwZGF0ZUluZXJ0aWFDb29yZHMoaW50ZXJhY3Rpb24pO1xuICB2YXIgc3RhdGUgPSBpbnRlcmFjdGlvbi5pbmVydGlhO1xuICB2YXIgdCA9IGludGVyYWN0aW9uLl9ub3coKSAtIHN0YXRlLnQwO1xuXG4gIHZhciBfZ2V0T3B0aW9ucyA9IGdldE9wdGlvbnMoaW50ZXJhY3Rpb24pLFxuICAgICAgZHVyYXRpb24gPSBfZ2V0T3B0aW9ucy5zbW9vdGhFbmREdXJhdGlvbjtcblxuICBpZiAodCA8IGR1cmF0aW9uKSB7XG4gICAgc3RhdGUuc3ggPSB1dGlscy5lYXNlT3V0UXVhZCh0LCAwLCBzdGF0ZS54ZSwgZHVyYXRpb24pO1xuICAgIHN0YXRlLnN5ID0gdXRpbHMuZWFzZU91dFF1YWQodCwgMCwgc3RhdGUueWUsIGR1cmF0aW9uKTtcbiAgICBpbnRlcmFjdGlvbi5tb3ZlKCk7XG4gICAgc3RhdGUudGltZW91dCA9IF9yYWZbXCJkZWZhdWx0XCJdLnJlcXVlc3QoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHNtb3RoRW5kVGljayhpbnRlcmFjdGlvbik7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgc3RhdGUuc3ggPSBzdGF0ZS54ZTtcbiAgICBzdGF0ZS5zeSA9IHN0YXRlLnllO1xuICAgIGludGVyYWN0aW9uLm1vdmUoKTtcbiAgICBpbnRlcmFjdGlvbi5lbmQoc3RhdGUuc3RhcnRFdmVudCk7XG4gICAgc3RhdGUuc21vb3RoRW5kID0gc3RhdGUuYWN0aXZlID0gZmFsc2U7XG4gICAgaW50ZXJhY3Rpb24uc2ltdWxhdGlvbiA9IG51bGw7XG4gIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlSW5lcnRpYUNvb3JkcyhpbnRlcmFjdGlvbikge1xuICB2YXIgc3RhdGUgPSBpbnRlcmFjdGlvbi5pbmVydGlhOyAvLyByZXR1cm4gaWYgaW5lcnRpYSBpc24ndCBydW5uaW5nXG5cbiAgaWYgKCFzdGF0ZS5hY3RpdmUpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgcGFnZVVwID0gc3RhdGUudXBDb29yZHMucGFnZTtcbiAgdmFyIGNsaWVudFVwID0gc3RhdGUudXBDb29yZHMuY2xpZW50O1xuICB1dGlscy5wb2ludGVyLnNldENvb3JkcyhpbnRlcmFjdGlvbi5jb29yZHMuY3VyLCBbe1xuICAgIHBhZ2VYOiBwYWdlVXAueCArIHN0YXRlLnN4LFxuICAgIHBhZ2VZOiBwYWdlVXAueSArIHN0YXRlLnN5LFxuICAgIGNsaWVudFg6IGNsaWVudFVwLnggKyBzdGF0ZS5zeCxcbiAgICBjbGllbnRZOiBjbGllbnRVcC55ICsgc3RhdGUuc3lcbiAgfV0sIGludGVyYWN0aW9uLl9ub3coKSk7XG59XG5cbmZ1bmN0aW9uIGdldE9wdGlvbnMoX3JlZjUpIHtcbiAgdmFyIGludGVyYWN0YWJsZSA9IF9yZWY1LmludGVyYWN0YWJsZSxcbiAgICAgIHByZXBhcmVkID0gX3JlZjUucHJlcGFyZWQ7XG4gIHJldHVybiBpbnRlcmFjdGFibGUgJiYgaW50ZXJhY3RhYmxlLm9wdGlvbnMgJiYgcHJlcGFyZWQubmFtZSAmJiBpbnRlcmFjdGFibGUub3B0aW9uc1twcmVwYXJlZC5uYW1lXS5pbmVydGlhO1xufVxuXG52YXIgX2RlZmF1bHQgPSB7XG4gIGlkOiAnaW5lcnRpYScsXG4gIGluc3RhbGw6IGluc3RhbGwsXG4gIGNhbGNJbmVydGlhOiBjYWxjSW5lcnRpYSxcbiAgaW5lcnRpYVRpY2s6IGluZXJ0aWFUaWNrLFxuICBzbW90aEVuZFRpY2s6IHNtb3RoRW5kVGljayxcbiAgdXBkYXRlSW5lcnRpYUNvb3JkczogdXBkYXRlSW5lcnRpYUNvb3Jkc1xufTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5cbn0se1wiQGludGVyYWN0anMvY29yZS9JbnRlcmFjdEV2ZW50XCI6MTUsXCJAaW50ZXJhY3Rqcy9tb2RpZmllcnMvYmFzZVwiOjMwLFwiQGludGVyYWN0anMvdXRpbHNcIjo1NSxcIkBpbnRlcmFjdGpzL3V0aWxzL3JhZlwiOjYxfV0sMjc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmluaXQgPSBpbml0O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiYXV0b1Njcm9sbFwiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfYXV0b1Njcm9sbFtcImRlZmF1bHRcIl07XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaW50ZXJhY3RhYmxlUHJldmVudERlZmF1bHRcIiwge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2ludGVyYWN0YWJsZVByZXZlbnREZWZhdWx0W1wiZGVmYXVsdFwiXTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJpbmVydGlhXCIsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pbmVydGlhW1wiZGVmYXVsdFwiXTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJtb2RpZmllcnNcIiwge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2Jhc2VbXCJkZWZhdWx0XCJdO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcInJlZmxvd1wiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfcmVmbG93W1wiZGVmYXVsdFwiXTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJpbnRlcmFjdFwiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW50ZXJhY3RbXCJkZWZhdWx0XCJdO1xuICB9XG59KTtcbmV4cG9ydHMucG9pbnRlckV2ZW50cyA9IGV4cG9ydHMuYWN0aW9ucyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgYWN0aW9ucyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy9hY3Rpb25zXCIpKTtcblxuZXhwb3J0cy5hY3Rpb25zID0gYWN0aW9ucztcblxudmFyIF9hdXRvU2Nyb2xsID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiQGludGVyYWN0anMvYXV0by1zY3JvbGxcIikpO1xuXG52YXIgYXV0b1N0YXJ0ID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQocmVxdWlyZShcIkBpbnRlcmFjdGpzL2F1dG8tc3RhcnRcIikpO1xuXG52YXIgX2ludGVyYWN0YWJsZVByZXZlbnREZWZhdWx0ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiQGludGVyYWN0anMvY29yZS9pbnRlcmFjdGFibGVQcmV2ZW50RGVmYXVsdFwiKSk7XG5cbnZhciBfZGV2VG9vbHMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy9kZXYtdG9vbHNcIikpO1xuXG52YXIgX2luZXJ0aWEgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy9pbmVydGlhXCIpKTtcblxudmFyIG1vZGlmaWVycyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy9tb2RpZmllcnNcIikpO1xuXG52YXIgX2Jhc2UgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy9tb2RpZmllcnMvYmFzZVwiKSk7XG5cbnZhciBwb2ludGVyRXZlbnRzID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQocmVxdWlyZShcIkBpbnRlcmFjdGpzL3BvaW50ZXItZXZlbnRzXCIpKTtcblxuZXhwb3J0cy5wb2ludGVyRXZlbnRzID0gcG9pbnRlckV2ZW50cztcblxudmFyIF9yZWZsb3cgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy9yZWZsb3dcIikpO1xuXG52YXIgX2ludGVyYWN0ID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQocmVxdWlyZShcIi4vaW50ZXJhY3RcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iajsgfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgeyB2YXIgZGVzYyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID8gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIGtleSkgOiB7fTsgaWYgKGRlc2MuZ2V0IHx8IGRlc2Muc2V0KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuZXdPYmosIGtleSwgZGVzYyk7IH0gZWxzZSB7IG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSB9IH0gbmV3T2JqW1wiZGVmYXVsdFwiXSA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cbmZ1bmN0aW9uIGluaXQod2luZG93KSB7XG4gIF9pbnRlcmFjdC5zY29wZS5pbml0KHdpbmRvdyk7XG5cbiAgX2ludGVyYWN0W1wiZGVmYXVsdFwiXS51c2UoX2ludGVyYWN0YWJsZVByZXZlbnREZWZhdWx0W1wiZGVmYXVsdFwiXSk7IC8vIGluZXJ0aWFcblxuXG4gIF9pbnRlcmFjdFtcImRlZmF1bHRcIl0udXNlKF9pbmVydGlhW1wiZGVmYXVsdFwiXSk7IC8vIHBvaW50ZXJFdmVudHNcblxuXG4gIF9pbnRlcmFjdFtcImRlZmF1bHRcIl0udXNlKHBvaW50ZXJFdmVudHMpOyAvLyBhdXRvU3RhcnQsIGhvbGRcblxuXG4gIF9pbnRlcmFjdFtcImRlZmF1bHRcIl0udXNlKGF1dG9TdGFydCk7IC8vIGRyYWcgYW5kIGRyb3AsIHJlc2l6ZSwgZ2VzdHVyZVxuXG5cbiAgX2ludGVyYWN0W1wiZGVmYXVsdFwiXS51c2UoYWN0aW9ucyk7IC8vIHNuYXAsIHJlc2l6ZSwgZXRjLlxuXG5cbiAgX2ludGVyYWN0W1wiZGVmYXVsdFwiXS51c2UoX2Jhc2VbXCJkZWZhdWx0XCJdKTsgLy8gZm9yIGJhY2t3cmFkcyBjb21wYXRpYmlsaXR5XG5cblxuICBmb3IgKHZhciB0eXBlIGluIG1vZGlmaWVycykge1xuICAgIHZhciBfbW9kaWZpZXJzJHR5cGUgPSBtb2RpZmllcnNbdHlwZV0sXG4gICAgICAgIF9kZWZhdWx0cyA9IF9tb2RpZmllcnMkdHlwZS5fZGVmYXVsdHMsXG4gICAgICAgIF9tZXRob2RzID0gX21vZGlmaWVycyR0eXBlLl9tZXRob2RzO1xuICAgIF9kZWZhdWx0cy5fbWV0aG9kcyA9IF9tZXRob2RzO1xuICAgIF9pbnRlcmFjdC5zY29wZS5kZWZhdWx0cy5wZXJBY3Rpb25bdHlwZV0gPSBfZGVmYXVsdHM7XG4gIH0gLy8gYXV0b1Njcm9sbFxuXG5cbiAgX2ludGVyYWN0W1wiZGVmYXVsdFwiXS51c2UoX2F1dG9TY3JvbGxbXCJkZWZhdWx0XCJdKTsgLy8gcmVmbG93XG5cblxuICBfaW50ZXJhY3RbXCJkZWZhdWx0XCJdLnVzZShfcmVmbG93W1wiZGVmYXVsdFwiXSk7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuXG5cbiAgaWYgKHVuZGVmaW5lZCAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgX2ludGVyYWN0W1wiZGVmYXVsdFwiXS51c2UoX2RldlRvb2xzW1wiZGVmYXVsdFwiXSk7XG4gIH1cblxuICByZXR1cm4gX2ludGVyYWN0W1wiZGVmYXVsdFwiXTtcbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG5cblxuX2ludGVyYWN0W1wiZGVmYXVsdFwiXS52ZXJzaW9uID0gaW5pdC52ZXJzaW9uID0gXCIxLjQuMC1yYy4xM1wiO1xudmFyIF9kZWZhdWx0ID0gX2ludGVyYWN0W1wiZGVmYXVsdFwiXTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5cbn0se1wiLi9pbnRlcmFjdFwiOjI4LFwiQGludGVyYWN0anMvYWN0aW9uc1wiOjUsXCJAaW50ZXJhY3Rqcy9hdXRvLXNjcm9sbFwiOjcsXCJAaW50ZXJhY3Rqcy9hdXRvLXN0YXJ0XCI6MTIsXCJAaW50ZXJhY3Rqcy9jb3JlL2ludGVyYWN0YWJsZVByZXZlbnREZWZhdWx0XCI6MjEsXCJAaW50ZXJhY3Rqcy9kZXYtdG9vbHNcIjoyNSxcIkBpbnRlcmFjdGpzL2luZXJ0aWFcIjoyNixcIkBpbnRlcmFjdGpzL21vZGlmaWVyc1wiOjMxLFwiQGludGVyYWN0anMvbW9kaWZpZXJzL2Jhc2VcIjozMCxcIkBpbnRlcmFjdGpzL3BvaW50ZXItZXZlbnRzXCI6NDEsXCJAaW50ZXJhY3Rqcy9yZWZsb3dcIjo0M31dLDI4OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBleHBvcnRzLnNjb3BlID0gZXhwb3J0cy5pbnRlcmFjdCA9IHZvaWQgMDtcblxudmFyIF9zY29wZSA9IHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy9jb3JlL3Njb3BlXCIpO1xuXG52YXIgdXRpbHMgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChyZXF1aXJlKFwiQGludGVyYWN0anMvdXRpbHNcIikpO1xuXG52YXIgX2Jyb3dzZXIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy91dGlscy9icm93c2VyXCIpKTtcblxudmFyIF9ldmVudHMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy91dGlscy9ldmVudHNcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iajsgfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgeyB2YXIgZGVzYyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID8gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIGtleSkgOiB7fTsgaWYgKGRlc2MuZ2V0IHx8IGRlc2Muc2V0KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuZXdPYmosIGtleSwgZGVzYyk7IH0gZWxzZSB7IG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSB9IH0gbmV3T2JqW1wiZGVmYXVsdFwiXSA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cbi8qKiBAbW9kdWxlIGludGVyYWN0ICovXG52YXIgZ2xvYmFsRXZlbnRzID0ge307XG52YXIgc2NvcGUgPSBuZXcgX3Njb3BlLlNjb3BlKCk7XG4vKipcbiAqIGBgYGpzXG4gKiBpbnRlcmFjdCgnI2RyYWdnYWJsZScpLmRyYWdnYWJsZSh0cnVlKVxuICpcbiAqIHZhciByZWN0YWJsZXMgPSBpbnRlcmFjdCgncmVjdCcpXG4gKiByZWN0YWJsZXNcbiAqICAgLmdlc3R1cmFibGUodHJ1ZSlcbiAqICAgLm9uKCdnZXN0dXJlbW92ZScsIGZ1bmN0aW9uIChldmVudCkge1xuICogICAgICAgLy8gLi4uXG4gKiAgIH0pXG4gKiBgYGBcbiAqXG4gKiBUaGUgbWV0aG9kcyBvZiB0aGlzIHZhcmlhYmxlIGNhbiBiZSB1c2VkIHRvIHNldCBlbGVtZW50cyBhcyBpbnRlcmFjdGFibGVzXG4gKiBhbmQgYWxzbyB0byBjaGFuZ2UgdmFyaW91cyBkZWZhdWx0IHNldHRpbmdzLlxuICpcbiAqIENhbGxpbmcgaXQgYXMgYSBmdW5jdGlvbiBhbmQgcGFzc2luZyBhbiBlbGVtZW50IG9yIGEgdmFsaWQgQ1NTIHNlbGVjdG9yXG4gKiBzdHJpbmcgcmV0dXJucyBhbiBJbnRlcmFjdGFibGUgb2JqZWN0IHdoaWNoIGhhcyB2YXJpb3VzIG1ldGhvZHMgdG8gY29uZmlndXJlXG4gKiBpdC5cbiAqXG4gKiBAZ2xvYmFsXG4gKlxuICogQHBhcmFtIHtFbGVtZW50IHwgc3RyaW5nfSB0YXJnZXQgVGhlIEhUTUwgb3IgU1ZHIEVsZW1lbnQgdG8gaW50ZXJhY3Qgd2l0aFxuICogb3IgQ1NTIHNlbGVjdG9yXG4gKiBAcmV0dXJuIHtJbnRlcmFjdGFibGV9XG4gKi9cblxuZXhwb3J0cy5zY29wZSA9IHNjb3BlO1xuXG52YXIgaW50ZXJhY3QgPSBmdW5jdGlvbiBpbnRlcmFjdCh0YXJnZXQsIG9wdGlvbnMpIHtcbiAgdmFyIGludGVyYWN0YWJsZSA9IHNjb3BlLmludGVyYWN0YWJsZXMuZ2V0KHRhcmdldCwgb3B0aW9ucyk7XG5cbiAgaWYgKCFpbnRlcmFjdGFibGUpIHtcbiAgICBpbnRlcmFjdGFibGUgPSBzY29wZS5pbnRlcmFjdGFibGVzW1wibmV3XCJdKHRhcmdldCwgb3B0aW9ucyk7XG4gICAgaW50ZXJhY3RhYmxlLmV2ZW50cy5nbG9iYWwgPSBnbG9iYWxFdmVudHM7XG4gIH1cblxuICByZXR1cm4gaW50ZXJhY3RhYmxlO1xufTtcbi8qKlxuICogVXNlIGEgcGx1Z2luXG4gKlxuICogQGFsaWFzIG1vZHVsZTppbnRlcmFjdC51c2VcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcGx1Z2luXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBwbHVnaW4uaW5zdGFsbFxuICogQHJldHVybiB7aW50ZXJhY3R9XG4gKi9cblxuXG5leHBvcnRzLmludGVyYWN0ID0gaW50ZXJhY3Q7XG5pbnRlcmFjdC51c2UgPSB1c2U7XG5cbmZ1bmN0aW9uIHVzZShwbHVnaW4sIG9wdGlvbnMpIHtcbiAgc2NvcGUudXNlUGx1Z2luKHBsdWdpbiwgb3B0aW9ucyk7XG4gIHJldHVybiBpbnRlcmFjdDtcbn1cbi8qKlxuICogQ2hlY2sgaWYgYW4gZWxlbWVudCBvciBzZWxlY3RvciBoYXMgYmVlbiBzZXQgd2l0aCB0aGUge0BsaW5rIGludGVyYWN0fVxuICogZnVuY3Rpb25cbiAqXG4gKiBAYWxpYXMgbW9kdWxlOmludGVyYWN0LmlzU2V0XG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IFRoZSBFbGVtZW50IGJlaW5nIHNlYXJjaGVkIGZvclxuICogQHJldHVybiB7Ym9vbGVhbn0gSW5kaWNhdGVzIGlmIHRoZSBlbGVtZW50IG9yIENTUyBzZWxlY3RvciB3YXMgcHJldmlvdXNseVxuICogcGFzc2VkIHRvIGludGVyYWN0XG4gKi9cblxuXG5pbnRlcmFjdC5pc1NldCA9IGlzU2V0O1xuXG5mdW5jdGlvbiBpc1NldCh0YXJnZXQsIG9wdGlvbnMpIHtcbiAgcmV0dXJuICEhc2NvcGUuaW50ZXJhY3RhYmxlcy5nZXQodGFyZ2V0LCBvcHRpb25zICYmIG9wdGlvbnMuY29udGV4dCk7XG59XG4vKipcbiAqIEFkZCBhIGdsb2JhbCBsaXN0ZW5lciBmb3IgYW4gSW50ZXJhY3RFdmVudCBvciBhZGRzIGEgRE9NIGV2ZW50IHRvIGBkb2N1bWVudGBcbiAqXG4gKiBAYWxpYXMgbW9kdWxlOmludGVyYWN0Lm9uXG4gKlxuICogQHBhcmFtIHtzdHJpbmcgfCBhcnJheSB8IG9iamVjdH0gdHlwZSBUaGUgdHlwZXMgb2YgZXZlbnRzIHRvIGxpc3RlbiBmb3JcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyIFRoZSBmdW5jdGlvbiBldmVudCAocylcbiAqIEBwYXJhbSB7b2JqZWN0IHwgYm9vbGVhbn0gW29wdGlvbnNdIG9iamVjdCBvciB1c2VDYXB0dXJlIGZsYWcgZm9yXG4gKiBhZGRFdmVudExpc3RlbmVyXG4gKiBAcmV0dXJuIHtvYmplY3R9IGludGVyYWN0XG4gKi9cblxuXG5pbnRlcmFjdC5vbiA9IG9uO1xuXG5mdW5jdGlvbiBvbih0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucykge1xuICBpZiAodXRpbHMuaXMuc3RyaW5nKHR5cGUpICYmIHR5cGUuc2VhcmNoKCcgJykgIT09IC0xKSB7XG4gICAgdHlwZSA9IHR5cGUudHJpbSgpLnNwbGl0KC8gKy8pO1xuICB9XG5cbiAgaWYgKHV0aWxzLmlzLmFycmF5KHR5cGUpKSB7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IHR5cGUubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX3JlZjtcblxuICAgICAgX3JlZiA9IHR5cGVbX2ldO1xuICAgICAgdmFyIGV2ZW50VHlwZSA9IF9yZWY7XG4gICAgICBpbnRlcmFjdC5vbihldmVudFR5cGUsIGxpc3RlbmVyLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW50ZXJhY3Q7XG4gIH1cblxuICBpZiAodXRpbHMuaXMub2JqZWN0KHR5cGUpKSB7XG4gICAgZm9yICh2YXIgcHJvcCBpbiB0eXBlKSB7XG4gICAgICBpbnRlcmFjdC5vbihwcm9wLCB0eXBlW3Byb3BdLCBsaXN0ZW5lcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGludGVyYWN0O1xuICB9IC8vIGlmIGl0IGlzIGFuIEludGVyYWN0RXZlbnQgdHlwZSwgYWRkIGxpc3RlbmVyIHRvIGdsb2JhbEV2ZW50c1xuXG5cbiAgaWYgKHV0aWxzLmFyci5jb250YWlucyhzY29wZS5hY3Rpb25zLmV2ZW50VHlwZXMsIHR5cGUpKSB7XG4gICAgLy8gaWYgdGhpcyB0eXBlIG9mIGV2ZW50IHdhcyBuZXZlciBib3VuZFxuICAgIGlmICghZ2xvYmFsRXZlbnRzW3R5cGVdKSB7XG4gICAgICBnbG9iYWxFdmVudHNbdHlwZV0gPSBbbGlzdGVuZXJdO1xuICAgIH0gZWxzZSB7XG4gICAgICBnbG9iYWxFdmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gICAgfVxuICB9IC8vIElmIG5vbiBJbnRlcmFjdEV2ZW50IHR5cGUsIGFkZEV2ZW50TGlzdGVuZXIgdG8gZG9jdW1lbnRcbiAgZWxzZSB7XG4gICAgICBfZXZlbnRzW1wiZGVmYXVsdFwiXS5hZGQoc2NvcGUuZG9jdW1lbnQsIHR5cGUsIGxpc3RlbmVyLCB7XG4gICAgICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgICAgIH0pO1xuICAgIH1cblxuICByZXR1cm4gaW50ZXJhY3Q7XG59XG4vKipcbiAqIFJlbW92ZXMgYSBnbG9iYWwgSW50ZXJhY3RFdmVudCBsaXN0ZW5lciBvciBET00gZXZlbnQgZnJvbSBgZG9jdW1lbnRgXG4gKlxuICogQGFsaWFzIG1vZHVsZTppbnRlcmFjdC5vZmZcbiAqXG4gKiBAcGFyYW0ge3N0cmluZyB8IGFycmF5IHwgb2JqZWN0fSB0eXBlIFRoZSB0eXBlcyBvZiBldmVudHMgdGhhdCB3ZXJlIGxpc3RlbmVkXG4gKiBmb3JcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyIFRoZSBsaXN0ZW5lciBmdW5jdGlvbiB0byBiZSByZW1vdmVkXG4gKiBAcGFyYW0ge29iamVjdCB8IGJvb2xlYW59IG9wdGlvbnMgW29wdGlvbnNdIG9iamVjdCBvciB1c2VDYXB0dXJlIGZsYWcgZm9yXG4gKiByZW1vdmVFdmVudExpc3RlbmVyXG4gKiBAcmV0dXJuIHtvYmplY3R9IGludGVyYWN0XG4gKi9cblxuXG5pbnRlcmFjdC5vZmYgPSBvZmY7XG5cbmZ1bmN0aW9uIG9mZih0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucykge1xuICBpZiAodXRpbHMuaXMuc3RyaW5nKHR5cGUpICYmIHR5cGUuc2VhcmNoKCcgJykgIT09IC0xKSB7XG4gICAgdHlwZSA9IHR5cGUudHJpbSgpLnNwbGl0KC8gKy8pO1xuICB9XG5cbiAgaWYgKHV0aWxzLmlzLmFycmF5KHR5cGUpKSB7XG4gICAgZm9yICh2YXIgX2kyID0gMDsgX2kyIDwgdHlwZS5sZW5ndGg7IF9pMisrKSB7XG4gICAgICB2YXIgX3JlZjI7XG5cbiAgICAgIF9yZWYyID0gdHlwZVtfaTJdO1xuICAgICAgdmFyIGV2ZW50VHlwZSA9IF9yZWYyO1xuICAgICAgaW50ZXJhY3Qub2ZmKGV2ZW50VHlwZSwgbGlzdGVuZXIsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiBpbnRlcmFjdDtcbiAgfVxuXG4gIGlmICh1dGlscy5pcy5vYmplY3QodHlwZSkpIHtcbiAgICBmb3IgKHZhciBwcm9wIGluIHR5cGUpIHtcbiAgICAgIGludGVyYWN0Lm9mZihwcm9wLCB0eXBlW3Byb3BdLCBsaXN0ZW5lcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGludGVyYWN0O1xuICB9XG5cbiAgaWYgKCF1dGlscy5hcnIuY29udGFpbnMoc2NvcGUuYWN0aW9ucy5ldmVudFR5cGVzLCB0eXBlKSkge1xuICAgIF9ldmVudHNbXCJkZWZhdWx0XCJdLnJlbW92ZShzY29wZS5kb2N1bWVudCwgdHlwZSwgbGlzdGVuZXIsIG9wdGlvbnMpO1xuICB9IGVsc2Uge1xuICAgIHZhciBpbmRleDtcblxuICAgIGlmICh0eXBlIGluIGdsb2JhbEV2ZW50cyAmJiAoaW5kZXggPSBnbG9iYWxFdmVudHNbdHlwZV0uaW5kZXhPZihsaXN0ZW5lcikpICE9PSAtMSkge1xuICAgICAgZ2xvYmFsRXZlbnRzW3R5cGVdLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGludGVyYWN0O1xufVxuLyoqXG4gKiBSZXR1cm5zIGFuIG9iamVjdCB3aGljaCBleHBvc2VzIGludGVybmFsIGRhdGFcbiAqIEBhbGlhcyBtb2R1bGU6aW50ZXJhY3QuZGVidWdcbiAqXG4gKiBAcmV0dXJuIHtvYmplY3R9IEFuIG9iamVjdCB3aXRoIHByb3BlcnRpZXMgdGhhdCBvdXRsaW5lIHRoZSBjdXJyZW50IHN0YXRlXG4gKiBhbmQgZXhwb3NlIGludGVybmFsIGZ1bmN0aW9ucyBhbmQgdmFyaWFibGVzXG4gKi9cblxuXG5pbnRlcmFjdC5kZWJ1ZyA9IGRlYnVnO1xuXG5mdW5jdGlvbiBkZWJ1ZygpIHtcbiAgcmV0dXJuIHNjb3BlO1xufSAvLyBleHBvc2UgdGhlIGZ1bmN0aW9ucyB1c2VkIHRvIGNhbGN1bGF0ZSBtdWx0aS10b3VjaCBwcm9wZXJ0aWVzXG5cblxuaW50ZXJhY3QuZ2V0UG9pbnRlckF2ZXJhZ2UgPSB1dGlscy5wb2ludGVyLnBvaW50ZXJBdmVyYWdlO1xuaW50ZXJhY3QuZ2V0VG91Y2hCQm94ID0gdXRpbHMucG9pbnRlci50b3VjaEJCb3g7XG5pbnRlcmFjdC5nZXRUb3VjaERpc3RhbmNlID0gdXRpbHMucG9pbnRlci50b3VjaERpc3RhbmNlO1xuaW50ZXJhY3QuZ2V0VG91Y2hBbmdsZSA9IHV0aWxzLnBvaW50ZXIudG91Y2hBbmdsZTtcbmludGVyYWN0LmdldEVsZW1lbnRSZWN0ID0gdXRpbHMuZG9tLmdldEVsZW1lbnRSZWN0O1xuaW50ZXJhY3QuZ2V0RWxlbWVudENsaWVudFJlY3QgPSB1dGlscy5kb20uZ2V0RWxlbWVudENsaWVudFJlY3Q7XG5pbnRlcmFjdC5tYXRjaGVzU2VsZWN0b3IgPSB1dGlscy5kb20ubWF0Y2hlc1NlbGVjdG9yO1xuaW50ZXJhY3QuY2xvc2VzdCA9IHV0aWxzLmRvbS5jbG9zZXN0O1xuLyoqXG4gKiBAYWxpYXMgbW9kdWxlOmludGVyYWN0LnN1cHBvcnRzVG91Y2hcbiAqXG4gKiBAcmV0dXJuIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgYnJvd3NlciBzdXBwb3J0cyB0b3VjaCBpbnB1dFxuICovXG5cbmludGVyYWN0LnN1cHBvcnRzVG91Y2ggPSBzdXBwb3J0c1RvdWNoO1xuXG5mdW5jdGlvbiBzdXBwb3J0c1RvdWNoKCkge1xuICByZXR1cm4gX2Jyb3dzZXJbXCJkZWZhdWx0XCJdLnN1cHBvcnRzVG91Y2g7XG59XG4vKipcbiAqIEBhbGlhcyBtb2R1bGU6aW50ZXJhY3Quc3VwcG9ydHNQb2ludGVyRXZlbnRcbiAqXG4gKiBAcmV0dXJuIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgYnJvd3NlciBzdXBwb3J0cyBQb2ludGVyRXZlbnRzXG4gKi9cblxuXG5pbnRlcmFjdC5zdXBwb3J0c1BvaW50ZXJFdmVudCA9IHN1cHBvcnRzUG9pbnRlckV2ZW50O1xuXG5mdW5jdGlvbiBzdXBwb3J0c1BvaW50ZXJFdmVudCgpIHtcbiAgcmV0dXJuIF9icm93c2VyW1wiZGVmYXVsdFwiXS5zdXBwb3J0c1BvaW50ZXJFdmVudDtcbn1cbi8qKlxuICogQ2FuY2VscyBhbGwgaW50ZXJhY3Rpb25zIChlbmQgZXZlbnRzIGFyZSBub3QgZmlyZWQpXG4gKlxuICogQGFsaWFzIG1vZHVsZTppbnRlcmFjdC5zdG9wXG4gKlxuICogQHJldHVybiB7b2JqZWN0fSBpbnRlcmFjdFxuICovXG5cblxuaW50ZXJhY3Quc3RvcCA9IHN0b3A7XG5cbmZ1bmN0aW9uIHN0b3AoKSB7XG4gIGZvciAodmFyIF9pMyA9IDA7IF9pMyA8IHNjb3BlLmludGVyYWN0aW9ucy5saXN0Lmxlbmd0aDsgX2kzKyspIHtcbiAgICB2YXIgX3JlZjM7XG5cbiAgICBfcmVmMyA9IHNjb3BlLmludGVyYWN0aW9ucy5saXN0W19pM107XG4gICAgdmFyIGludGVyYWN0aW9uID0gX3JlZjM7XG4gICAgaW50ZXJhY3Rpb24uc3RvcCgpO1xuICB9XG5cbiAgcmV0dXJuIGludGVyYWN0O1xufVxuLyoqXG4gKiBSZXR1cm5zIG9yIHNldHMgdGhlIGRpc3RhbmNlIHRoZSBwb2ludGVyIG11c3QgYmUgbW92ZWQgYmVmb3JlIGFuIGFjdGlvblxuICogc2VxdWVuY2Ugb2NjdXJzLiBUaGlzIGFsc28gYWZmZWN0cyB0b2xlcmFuY2UgZm9yIHRhcCBldmVudHMuXG4gKlxuICogQGFsaWFzIG1vZHVsZTppbnRlcmFjdC5wb2ludGVyTW92ZVRvbGVyYW5jZVxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBbbmV3VmFsdWVdIFRoZSBtb3ZlbWVudCBmcm9tIHRoZSBzdGFydCBwb3NpdGlvbiBtdXN0IGJlIGdyZWF0ZXIgdGhhbiB0aGlzIHZhbHVlXG4gKiBAcmV0dXJuIHtpbnRlcmFjdCB8IG51bWJlcn1cbiAqL1xuXG5cbmludGVyYWN0LnBvaW50ZXJNb3ZlVG9sZXJhbmNlID0gcG9pbnRlck1vdmVUb2xlcmFuY2U7XG5cbmZ1bmN0aW9uIHBvaW50ZXJNb3ZlVG9sZXJhbmNlKG5ld1ZhbHVlKSB7XG4gIGlmICh1dGlscy5pcy5udW1iZXIobmV3VmFsdWUpKSB7XG4gICAgc2NvcGUuaW50ZXJhY3Rpb25zLnBvaW50ZXJNb3ZlVG9sZXJhbmNlID0gbmV3VmFsdWU7XG4gICAgcmV0dXJuIGludGVyYWN0O1xuICB9XG5cbiAgcmV0dXJuIHNjb3BlLmludGVyYWN0aW9ucy5wb2ludGVyTW92ZVRvbGVyYW5jZTtcbn1cblxuc2NvcGUuaW50ZXJhY3RhYmxlcy5zaWduYWxzLm9uKCd1bnNldCcsIGZ1bmN0aW9uIChfcmVmNCkge1xuICB2YXIgaW50ZXJhY3RhYmxlID0gX3JlZjQuaW50ZXJhY3RhYmxlO1xuICBzY29wZS5pbnRlcmFjdGFibGVzLmxpc3Quc3BsaWNlKHNjb3BlLmludGVyYWN0YWJsZXMubGlzdC5pbmRleE9mKGludGVyYWN0YWJsZSksIDEpOyAvLyBTdG9wIHJlbGF0ZWQgaW50ZXJhY3Rpb25zIHdoZW4gYW4gSW50ZXJhY3RhYmxlIGlzIHVuc2V0XG5cbiAgZm9yICh2YXIgX2k0ID0gMDsgX2k0IDwgc2NvcGUuaW50ZXJhY3Rpb25zLmxpc3QubGVuZ3RoOyBfaTQrKykge1xuICAgIHZhciBfcmVmNTtcblxuICAgIF9yZWY1ID0gc2NvcGUuaW50ZXJhY3Rpb25zLmxpc3RbX2k0XTtcbiAgICB2YXIgaW50ZXJhY3Rpb24gPSBfcmVmNTtcblxuICAgIGlmIChpbnRlcmFjdGlvbi5pbnRlcmFjdGFibGUgPT09IGludGVyYWN0YWJsZSAmJiBpbnRlcmFjdGlvbi5pbnRlcmFjdGluZygpICYmIGludGVyYWN0aW9uLl9lbmRpbmcpIHtcbiAgICAgIGludGVyYWN0aW9uLnN0b3AoKTtcbiAgICB9XG4gIH1cbn0pO1xuXG5pbnRlcmFjdC5hZGREb2N1bWVudCA9IGZ1bmN0aW9uIChkb2MsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIHNjb3BlLmFkZERvY3VtZW50KGRvYywgb3B0aW9ucyk7XG59O1xuXG5pbnRlcmFjdC5yZW1vdmVEb2N1bWVudCA9IGZ1bmN0aW9uIChkb2MpIHtcbiAgcmV0dXJuIHNjb3BlLnJlbW92ZURvY3VtZW50KGRvYyk7XG59O1xuXG5zY29wZS5pbnRlcmFjdCA9IGludGVyYWN0O1xudmFyIF9kZWZhdWx0ID0gaW50ZXJhY3Q7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0O1xuXG59LHtcIkBpbnRlcmFjdGpzL2NvcmUvc2NvcGVcIjoyNCxcIkBpbnRlcmFjdGpzL3V0aWxzXCI6NTUsXCJAaW50ZXJhY3Rqcy91dGlscy9icm93c2VyXCI6NDcsXCJAaW50ZXJhY3Rqcy91dGlscy9ldmVudHNcIjo1MX1dLDI5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5pbml0ID0gaW5pdDtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX2ludGVyYWN0ID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQocmVxdWlyZShcIkBpbnRlcmFjdGpzL2ludGVyYWN0XCIpKTtcblxudmFyIG1vZGlmaWVycyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy9tb2RpZmllcnNcIikpO1xuXG5yZXF1aXJlKFwiQGludGVyYWN0anMvdHlwZXNcIik7XG5cbnZhciBfZXh0ZW5kID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiQGludGVyYWN0anMvdXRpbHMvZXh0ZW5kXCIpKTtcblxudmFyIHNuYXBwZXJzID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQocmVxdWlyZShcIkBpbnRlcmFjdGpzL3V0aWxzL3NuYXBwZXJzXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHsgdmFyIGRlc2MgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkgJiYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBrZXkpIDoge307IGlmIChkZXNjLmdldCB8fCBkZXNjLnNldCkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkobmV3T2JqLCBrZXksIGRlc2MpOyB9IGVsc2UgeyBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gfSB9IG5ld09ialtcImRlZmF1bHRcIl0gPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG5pZiAoKHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIgPyBcInVuZGVmaW5lZFwiIDogX3R5cGVvZih3aW5kb3cpKSA9PT0gJ29iamVjdCcgJiYgISF3aW5kb3cpIHtcbiAgaW5pdCh3aW5kb3cpO1xufVxuXG5mdW5jdGlvbiBpbml0KHdpbikge1xuICAoMCwgX2ludGVyYWN0LmluaXQpKHdpbik7XG4gIHJldHVybiBfaW50ZXJhY3RbXCJkZWZhdWx0XCJdLnVzZSh7XG4gICAgaWQ6ICdpbnRlcmFjdGpzJyxcbiAgICBpbnN0YWxsOiBmdW5jdGlvbiBpbnN0YWxsKHNjb3BlKSB7XG4gICAgICBfaW50ZXJhY3RbXCJkZWZhdWx0XCJdLm1vZGlmaWVycyA9ICgwLCBfZXh0ZW5kW1wiZGVmYXVsdFwiXSkoc2NvcGUubW9kaWZpZXJzLCBtb2RpZmllcnMpO1xuICAgICAgX2ludGVyYWN0W1wiZGVmYXVsdFwiXS5zbmFwcGVycyA9IHNuYXBwZXJzO1xuICAgICAgX2ludGVyYWN0W1wiZGVmYXVsdFwiXS5jcmVhdGVTbmFwR3JpZCA9IF9pbnRlcmFjdFtcImRlZmF1bHRcIl0uc25hcHBlcnMuZ3JpZDtcbiAgICB9XG4gIH0pO1xufVxuXG52YXIgX2RlZmF1bHQgPSBfaW50ZXJhY3RbXCJkZWZhdWx0XCJdO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBfZGVmYXVsdDtcbl9pbnRlcmFjdFtcImRlZmF1bHRcIl1bJ2RlZmF1bHQnXSA9IF9pbnRlcmFjdFtcImRlZmF1bHRcIl07IC8vIHRzbGludDpkaXNhYmxlLWxpbmUgbm8tc3RyaW5nLWxpdGVyYWxcblxuX2ludGVyYWN0W1wiZGVmYXVsdFwiXVsnaW5pdCddID0gaW5pdDsgLy8gdHNsaW50OmRpc2FibGUtbGluZSBuby1zdHJpbmctbGl0ZXJhbFxuXG5pZiAoKHR5cGVvZiBtb2R1bGUgPT09IFwidW5kZWZpbmVkXCIgPyBcInVuZGVmaW5lZFwiIDogX3R5cGVvZihtb2R1bGUpKSA9PT0gJ29iamVjdCcgJiYgISFtb2R1bGUpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBfaW50ZXJhY3RbXCJkZWZhdWx0XCJdO1xufVxuXG59LHtcIkBpbnRlcmFjdGpzL2ludGVyYWN0XCI6MjcsXCJAaW50ZXJhY3Rqcy9tb2RpZmllcnNcIjozMSxcIkBpbnRlcmFjdGpzL3R5cGVzXCI6NDQsXCJAaW50ZXJhY3Rqcy91dGlscy9leHRlbmRcIjo1MixcIkBpbnRlcmFjdGpzL3V0aWxzL3NuYXBwZXJzXCI6NjR9XSwzMDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuc3RhcnRBbGwgPSBzdGFydEFsbDtcbmV4cG9ydHMuc2V0QWxsID0gc2V0QWxsO1xuZXhwb3J0cy5wcmVwYXJlU3RhdGVzID0gcHJlcGFyZVN0YXRlcztcbmV4cG9ydHMubWFrZU1vZGlmaWVyID0gbWFrZU1vZGlmaWVyO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciBfZXh0ZW5kID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiQGludGVyYWN0anMvdXRpbHMvZXh0ZW5kXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9zbGljZWRUb0FycmF5KGFyciwgaSkgeyByZXR1cm4gX2FycmF5V2l0aEhvbGVzKGFycikgfHwgX2l0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkgfHwgX25vbkl0ZXJhYmxlUmVzdCgpOyB9XG5cbmZ1bmN0aW9uIF9ub25JdGVyYWJsZVJlc3QoKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlXCIpOyB9XG5cbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHsgdmFyIF9hcnIgPSBbXTsgdmFyIF9uID0gdHJ1ZTsgdmFyIF9kID0gZmFsc2U7IHZhciBfZSA9IHVuZGVmaW5lZDsgdHJ5IHsgZm9yICh2YXIgX2kgPSBhcnJbU3ltYm9sLml0ZXJhdG9yXSgpLCBfczsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkgeyBfYXJyLnB1c2goX3MudmFsdWUpOyBpZiAoaSAmJiBfYXJyLmxlbmd0aCA9PT0gaSkgYnJlYWs7IH0gfSBjYXRjaCAoZXJyKSB7IF9kID0gdHJ1ZTsgX2UgPSBlcnI7IH0gZmluYWxseSB7IHRyeSB7IGlmICghX24gJiYgX2lbXCJyZXR1cm5cIl0gIT0gbnVsbCkgX2lbXCJyZXR1cm5cIl0oKTsgfSBmaW5hbGx5IHsgaWYgKF9kKSB0aHJvdyBfZTsgfSB9IHJldHVybiBfYXJyOyB9XG5cbmZ1bmN0aW9uIF9hcnJheVdpdGhIb2xlcyhhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgcmV0dXJuIGFycjsgfVxuXG5mdW5jdGlvbiBpbnN0YWxsKHNjb3BlKSB7XG4gIHZhciBpbnRlcmFjdGlvbnMgPSBzY29wZS5pbnRlcmFjdGlvbnM7XG4gIHNjb3BlLmRlZmF1bHRzLnBlckFjdGlvbi5tb2RpZmllcnMgPSBbXTtcbiAgc2NvcGUubW9kaWZpZXJzID0ge307XG4gIGludGVyYWN0aW9ucy5zaWduYWxzLm9uKCduZXcnLCBmdW5jdGlvbiAoX3JlZikge1xuICAgIHZhciBpbnRlcmFjdGlvbiA9IF9yZWYuaW50ZXJhY3Rpb247XG4gICAgaW50ZXJhY3Rpb24ubW9kaWZpZXJzID0ge1xuICAgICAgc3RhcnRPZmZzZXQ6IHtcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgIHRvcDogMCxcbiAgICAgICAgYm90dG9tOiAwXG4gICAgICB9LFxuICAgICAgb2Zmc2V0czoge30sXG4gICAgICBzdGF0ZXM6IG51bGwsXG4gICAgICByZXN1bHQ6IG51bGxcbiAgICB9O1xuICB9KTtcbiAgaW50ZXJhY3Rpb25zLnNpZ25hbHMub24oJ2JlZm9yZS1hY3Rpb24tc3RhcnQnLCBmdW5jdGlvbiAoYXJnKSB7XG4gICAgc3RhcnQoYXJnLCBhcmcuaW50ZXJhY3Rpb24uY29vcmRzLnN0YXJ0LnBhZ2UsIHNjb3BlLm1vZGlmaWVycyk7XG4gIH0pO1xuICBpbnRlcmFjdGlvbnMuc2lnbmFscy5vbignYWN0aW9uLXJlc3VtZScsIGZ1bmN0aW9uIChhcmcpIHtcbiAgICBiZWZvcmVNb3ZlKGFyZyk7XG4gICAgc3RhcnQoYXJnLCBhcmcuaW50ZXJhY3Rpb24uY29vcmRzLmN1ci5wYWdlLCBzY29wZS5tb2RpZmllcnMpO1xuICB9KTtcbiAgaW50ZXJhY3Rpb25zLnNpZ25hbHMub24oJ2FmdGVyLWFjdGlvbi1tb3ZlJywgcmVzdG9yZUNvb3Jkcyk7XG4gIGludGVyYWN0aW9ucy5zaWduYWxzLm9uKCdiZWZvcmUtYWN0aW9uLW1vdmUnLCBiZWZvcmVNb3ZlKTtcbiAgaW50ZXJhY3Rpb25zLnNpZ25hbHMub24oJ2JlZm9yZS1hY3Rpb24tc3RhcnQnLCBzZXRDb29yZHMpO1xuICBpbnRlcmFjdGlvbnMuc2lnbmFscy5vbignYWZ0ZXItYWN0aW9uLXN0YXJ0JywgcmVzdG9yZUNvb3Jkcyk7XG4gIGludGVyYWN0aW9ucy5zaWduYWxzLm9uKCdiZWZvcmUtYWN0aW9uLWVuZCcsIGJlZm9yZUVuZCk7XG4gIGludGVyYWN0aW9ucy5zaWduYWxzLm9uKCdzdG9wJywgc3RvcCk7XG59XG5cbmZ1bmN0aW9uIHN0YXJ0KF9yZWYyLCBwYWdlQ29vcmRzLCByZWdpc3RlcmVkTW9kaWZpZXJzKSB7XG4gIHZhciBpbnRlcmFjdGlvbiA9IF9yZWYyLmludGVyYWN0aW9uLFxuICAgICAgcGhhc2UgPSBfcmVmMi5waGFzZTtcbiAgdmFyIGludGVyYWN0YWJsZSA9IGludGVyYWN0aW9uLmludGVyYWN0YWJsZSxcbiAgICAgIGVsZW1lbnQgPSBpbnRlcmFjdGlvbi5lbGVtZW50O1xuICB2YXIgbW9kaWZpZXJMaXN0ID0gZ2V0TW9kaWZpZXJMaXN0KGludGVyYWN0aW9uLCByZWdpc3RlcmVkTW9kaWZpZXJzKTtcbiAgdmFyIHN0YXRlcyA9IHByZXBhcmVTdGF0ZXMobW9kaWZpZXJMaXN0KTtcbiAgdmFyIHJlY3QgPSAoMCwgX2V4dGVuZFtcImRlZmF1bHRcIl0pKHt9LCBpbnRlcmFjdGlvbi5yZWN0KTtcblxuICBpZiAoISgnd2lkdGgnIGluIHJlY3QpKSB7XG4gICAgcmVjdC53aWR0aCA9IHJlY3QucmlnaHQgLSByZWN0LmxlZnQ7XG4gIH1cblxuICBpZiAoISgnaGVpZ2h0JyBpbiByZWN0KSkge1xuICAgIHJlY3QuaGVpZ2h0ID0gcmVjdC5ib3R0b20gLSByZWN0LnRvcDtcbiAgfVxuXG4gIHZhciBzdGFydE9mZnNldCA9IGdldFJlY3RPZmZzZXQocmVjdCwgcGFnZUNvb3Jkcyk7XG4gIGludGVyYWN0aW9uLm1vZGlmaWVycy5zdGFydE9mZnNldCA9IHN0YXJ0T2Zmc2V0O1xuICBpbnRlcmFjdGlvbi5tb2RpZmllcnMuc3RhcnREZWx0YSA9IHtcbiAgICB4OiAwLFxuICAgIHk6IDBcbiAgfTtcbiAgdmFyIGFyZyA9IHtcbiAgICBpbnRlcmFjdGlvbjogaW50ZXJhY3Rpb24sXG4gICAgaW50ZXJhY3RhYmxlOiBpbnRlcmFjdGFibGUsXG4gICAgZWxlbWVudDogZWxlbWVudCxcbiAgICBwYWdlQ29vcmRzOiBwYWdlQ29vcmRzLFxuICAgIHBoYXNlOiBwaGFzZSxcbiAgICByZWN0OiByZWN0LFxuICAgIHN0YXJ0T2Zmc2V0OiBzdGFydE9mZnNldCxcbiAgICBzdGF0ZXM6IHN0YXRlcyxcbiAgICBwcmVFbmQ6IGZhbHNlLFxuICAgIHJlcXVpcmVFbmRPbmx5OiBmYWxzZVxuICB9O1xuICBpbnRlcmFjdGlvbi5tb2RpZmllcnMuc3RhdGVzID0gc3RhdGVzO1xuICBpbnRlcmFjdGlvbi5tb2RpZmllcnMucmVzdWx0ID0gbnVsbDtcbiAgc3RhcnRBbGwoYXJnKTtcbiAgYXJnLnBhZ2VDb29yZHMgPSAoMCwgX2V4dGVuZFtcImRlZmF1bHRcIl0pKHt9LCBpbnRlcmFjdGlvbi5jb29yZHMuc3RhcnQucGFnZSk7XG4gIHZhciByZXN1bHQgPSBpbnRlcmFjdGlvbi5tb2RpZmllcnMucmVzdWx0ID0gc2V0QWxsKGFyZyk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHN0YXJ0QWxsKGFyZykge1xuICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJnLnN0YXRlcy5sZW5ndGg7IF9pKyspIHtcbiAgICB2YXIgX3JlZjM7XG5cbiAgICBfcmVmMyA9IGFyZy5zdGF0ZXNbX2ldO1xuICAgIHZhciBzdGF0ZSA9IF9yZWYzO1xuXG4gICAgaWYgKHN0YXRlLm1ldGhvZHMuc3RhcnQpIHtcbiAgICAgIGFyZy5zdGF0ZSA9IHN0YXRlO1xuICAgICAgc3RhdGUubWV0aG9kcy5zdGFydChhcmcpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRBbGwoYXJnKSB7XG4gIHZhciBpbnRlcmFjdGlvbiA9IGFyZy5pbnRlcmFjdGlvbixcbiAgICAgIF9hcmckbW9kaWZpZXJzU3RhdGUgPSBhcmcubW9kaWZpZXJzU3RhdGUsXG4gICAgICBtb2RpZmllcnNTdGF0ZSA9IF9hcmckbW9kaWZpZXJzU3RhdGUgPT09IHZvaWQgMCA/IGludGVyYWN0aW9uLm1vZGlmaWVycyA6IF9hcmckbW9kaWZpZXJzU3RhdGUsXG4gICAgICBfYXJnJHByZXZDb29yZHMgPSBhcmcucHJldkNvb3JkcyxcbiAgICAgIHByZXZDb29yZHMgPSBfYXJnJHByZXZDb29yZHMgPT09IHZvaWQgMCA/IG1vZGlmaWVyc1N0YXRlLnJlc3VsdCA/IG1vZGlmaWVyc1N0YXRlLnJlc3VsdC5jb29yZHMgOiBpbnRlcmFjdGlvbi5jb29yZHMucHJldi5wYWdlIDogX2FyZyRwcmV2Q29vcmRzLFxuICAgICAgcGhhc2UgPSBhcmcucGhhc2UsXG4gICAgICBwcmVFbmQgPSBhcmcucHJlRW5kLFxuICAgICAgcmVxdWlyZUVuZE9ubHkgPSBhcmcucmVxdWlyZUVuZE9ubHksXG4gICAgICByZWN0ID0gYXJnLnJlY3QsXG4gICAgICBza2lwTW9kaWZpZXJzID0gYXJnLnNraXBNb2RpZmllcnM7XG4gIHZhciBzdGF0ZXMgPSBza2lwTW9kaWZpZXJzID8gYXJnLnN0YXRlcy5zbGljZShtb2RpZmllcnNTdGF0ZS5za2lwKSA6IGFyZy5zdGF0ZXM7XG4gIGFyZy5jb29yZHMgPSAoMCwgX2V4dGVuZFtcImRlZmF1bHRcIl0pKHt9LCBhcmcucGFnZUNvb3Jkcyk7XG4gIGFyZy5yZWN0ID0gKDAsIF9leHRlbmRbXCJkZWZhdWx0XCJdKSh7fSwgcmVjdCk7XG4gIHZhciByZXN1bHQgPSB7XG4gICAgZGVsdGE6IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfSxcbiAgICByZWN0RGVsdGE6IHtcbiAgICAgIGxlZnQ6IDAsXG4gICAgICByaWdodDogMCxcbiAgICAgIHRvcDogMCxcbiAgICAgIGJvdHRvbTogMFxuICAgIH0sXG4gICAgY29vcmRzOiBhcmcuY29vcmRzLFxuICAgIGNoYW5nZWQ6IHRydWVcbiAgfTtcblxuICBmb3IgKHZhciBfaTIgPSAwOyBfaTIgPCBzdGF0ZXMubGVuZ3RoOyBfaTIrKykge1xuICAgIHZhciBfcmVmNDtcblxuICAgIF9yZWY0ID0gc3RhdGVzW19pMl07XG4gICAgdmFyIHN0YXRlID0gX3JlZjQ7XG4gICAgdmFyIG9wdGlvbnMgPSBzdGF0ZS5vcHRpb25zO1xuXG4gICAgaWYgKCFzdGF0ZS5tZXRob2RzLnNldCB8fCAhc2hvdWxkRG8ob3B0aW9ucywgcHJlRW5kLCByZXF1aXJlRW5kT25seSwgcGhhc2UpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBhcmcuc3RhdGUgPSBzdGF0ZTtcbiAgICBzdGF0ZS5tZXRob2RzLnNldChhcmcpO1xuICB9XG5cbiAgcmVzdWx0LmRlbHRhLnggPSBhcmcuY29vcmRzLnggLSBhcmcucGFnZUNvb3Jkcy54O1xuICByZXN1bHQuZGVsdGEueSA9IGFyZy5jb29yZHMueSAtIGFyZy5wYWdlQ29vcmRzLnk7XG4gIHZhciByZWN0Q2hhbmdlZCA9IGZhbHNlO1xuXG4gIGlmIChyZWN0KSB7XG4gICAgcmVzdWx0LnJlY3REZWx0YS5sZWZ0ID0gYXJnLnJlY3QubGVmdCAtIHJlY3QubGVmdDtcbiAgICByZXN1bHQucmVjdERlbHRhLnJpZ2h0ID0gYXJnLnJlY3QucmlnaHQgLSByZWN0LnJpZ2h0O1xuICAgIHJlc3VsdC5yZWN0RGVsdGEudG9wID0gYXJnLnJlY3QudG9wIC0gcmVjdC50b3A7XG4gICAgcmVzdWx0LnJlY3REZWx0YS5ib3R0b20gPSBhcmcucmVjdC5ib3R0b20gLSByZWN0LmJvdHRvbTtcbiAgICByZWN0Q2hhbmdlZCA9IHJlc3VsdC5yZWN0RGVsdGEubGVmdCAhPT0gMCB8fCByZXN1bHQucmVjdERlbHRhLnJpZ2h0ICE9PSAwIHx8IHJlc3VsdC5yZWN0RGVsdGEudG9wICE9PSAwIHx8IHJlc3VsdC5yZWN0RGVsdGEuYm90dG9tICE9PSAwO1xuICB9XG5cbiAgcmVzdWx0LmNoYW5nZWQgPSBwcmV2Q29vcmRzLnggIT09IHJlc3VsdC5jb29yZHMueCB8fCBwcmV2Q29vcmRzLnkgIT09IHJlc3VsdC5jb29yZHMueSB8fCByZWN0Q2hhbmdlZDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gYmVmb3JlTW92ZShhcmcpIHtcbiAgdmFyIGludGVyYWN0aW9uID0gYXJnLmludGVyYWN0aW9uLFxuICAgICAgcGhhc2UgPSBhcmcucGhhc2UsXG4gICAgICBwcmVFbmQgPSBhcmcucHJlRW5kLFxuICAgICAgc2tpcE1vZGlmaWVycyA9IGFyZy5za2lwTW9kaWZpZXJzO1xuICB2YXIgaW50ZXJhY3RhYmxlID0gaW50ZXJhY3Rpb24uaW50ZXJhY3RhYmxlLFxuICAgICAgZWxlbWVudCA9IGludGVyYWN0aW9uLmVsZW1lbnQ7XG4gIHZhciBtb2RpZmllclJlc3VsdCA9IHNldEFsbCh7XG4gICAgaW50ZXJhY3Rpb246IGludGVyYWN0aW9uLFxuICAgIGludGVyYWN0YWJsZTogaW50ZXJhY3RhYmxlLFxuICAgIGVsZW1lbnQ6IGVsZW1lbnQsXG4gICAgcHJlRW5kOiBwcmVFbmQsXG4gICAgcGhhc2U6IHBoYXNlLFxuICAgIHBhZ2VDb29yZHM6IGludGVyYWN0aW9uLmNvb3Jkcy5jdXIucGFnZSxcbiAgICByZWN0OiBpbnRlcmFjdGlvbi5yZWN0LFxuICAgIHN0YXRlczogaW50ZXJhY3Rpb24ubW9kaWZpZXJzLnN0YXRlcyxcbiAgICByZXF1aXJlRW5kT25seTogZmFsc2UsXG4gICAgc2tpcE1vZGlmaWVyczogc2tpcE1vZGlmaWVyc1xuICB9KTtcbiAgaW50ZXJhY3Rpb24ubW9kaWZpZXJzLnJlc3VsdCA9IG1vZGlmaWVyUmVzdWx0OyAvLyBkb24ndCBmaXJlIGFuIGFjdGlvbiBtb3ZlIGlmIGEgbW9kaWZpZXIgd291bGQga2VlcCB0aGUgZXZlbnQgaW4gdGhlIHNhbWVcbiAgLy8gY29yZGluYXRlcyBhcyBiZWZvcmVcblxuICBpZiAoIW1vZGlmaWVyUmVzdWx0LmNoYW5nZWQgJiYgaW50ZXJhY3Rpb24uaW50ZXJhY3RpbmcoKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHNldENvb3JkcyhhcmcpO1xufVxuXG5mdW5jdGlvbiBiZWZvcmVFbmQoYXJnKSB7XG4gIHZhciBpbnRlcmFjdGlvbiA9IGFyZy5pbnRlcmFjdGlvbixcbiAgICAgIGV2ZW50ID0gYXJnLmV2ZW50LFxuICAgICAgbm9QcmVFbmQgPSBhcmcubm9QcmVFbmQ7XG4gIHZhciBzdGF0ZXMgPSBpbnRlcmFjdGlvbi5tb2RpZmllcnMuc3RhdGVzO1xuXG4gIGlmIChub1ByZUVuZCB8fCAhc3RhdGVzIHx8ICFzdGF0ZXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGRpZFByZUVuZCA9IGZhbHNlO1xuXG4gIGZvciAodmFyIF9pMyA9IDA7IF9pMyA8IHN0YXRlcy5sZW5ndGg7IF9pMysrKSB7XG4gICAgdmFyIF9yZWY1O1xuXG4gICAgX3JlZjUgPSBzdGF0ZXNbX2kzXTtcbiAgICB2YXIgc3RhdGUgPSBfcmVmNTtcbiAgICBhcmcuc3RhdGUgPSBzdGF0ZTtcbiAgICB2YXIgb3B0aW9ucyA9IHN0YXRlLm9wdGlvbnMsXG4gICAgICAgIG1ldGhvZHMgPSBzdGF0ZS5tZXRob2RzO1xuICAgIHZhciBlbmRSZXN1bHQgPSBtZXRob2RzLmJlZm9yZUVuZCAmJiBtZXRob2RzLmJlZm9yZUVuZChhcmcpO1xuXG4gICAgaWYgKGVuZFJlc3VsdCA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IC8vIGlmIHRoZSBlbmRPbmx5IG9wdGlvbiBpcyB0cnVlIGZvciBhbnkgbW9kaWZpZXJcblxuXG4gICAgaWYgKCFkaWRQcmVFbmQgJiYgc2hvdWxkRG8ob3B0aW9ucywgdHJ1ZSwgdHJ1ZSkpIHtcbiAgICAgIC8vIGZpcmUgYSBtb3ZlIGV2ZW50IGF0IHRoZSBtb2RpZmllZCBjb29yZGluYXRlc1xuICAgICAgaW50ZXJhY3Rpb24ubW92ZSh7XG4gICAgICAgIGV2ZW50OiBldmVudCxcbiAgICAgICAgcHJlRW5kOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIGRpZFByZUVuZCA9IHRydWU7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHN0b3AoYXJnKSB7XG4gIHZhciBpbnRlcmFjdGlvbiA9IGFyZy5pbnRlcmFjdGlvbjtcbiAgdmFyIHN0YXRlcyA9IGludGVyYWN0aW9uLm1vZGlmaWVycy5zdGF0ZXM7XG5cbiAgaWYgKCFzdGF0ZXMgfHwgIXN0YXRlcy5sZW5ndGgpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgbW9kaWZpZXJBcmcgPSAoMCwgX2V4dGVuZFtcImRlZmF1bHRcIl0pKHtcbiAgICBzdGF0ZXM6IHN0YXRlcyxcbiAgICBpbnRlcmFjdGFibGU6IGludGVyYWN0aW9uLmludGVyYWN0YWJsZSxcbiAgICBlbGVtZW50OiBpbnRlcmFjdGlvbi5lbGVtZW50XG4gIH0sIGFyZyk7XG4gIHJlc3RvcmVDb29yZHMoYXJnKTtcblxuICBmb3IgKHZhciBfaTQgPSAwOyBfaTQgPCBzdGF0ZXMubGVuZ3RoOyBfaTQrKykge1xuICAgIHZhciBfcmVmNjtcblxuICAgIF9yZWY2ID0gc3RhdGVzW19pNF07XG4gICAgdmFyIHN0YXRlID0gX3JlZjY7XG4gICAgbW9kaWZpZXJBcmcuc3RhdGUgPSBzdGF0ZTtcblxuICAgIGlmIChzdGF0ZS5tZXRob2RzLnN0b3ApIHtcbiAgICAgIHN0YXRlLm1ldGhvZHMuc3RvcChtb2RpZmllckFyZyk7XG4gICAgfVxuICB9XG5cbiAgYXJnLmludGVyYWN0aW9uLm1vZGlmaWVycy5zdGF0ZXMgPSBudWxsO1xufVxuXG5mdW5jdGlvbiBnZXRNb2RpZmllckxpc3QoaW50ZXJhY3Rpb24sIHJlZ2lzdGVyZWRNb2RpZmllcnMpIHtcbiAgdmFyIGFjdGlvbk9wdGlvbnMgPSBpbnRlcmFjdGlvbi5pbnRlcmFjdGFibGUub3B0aW9uc1tpbnRlcmFjdGlvbi5wcmVwYXJlZC5uYW1lXTtcbiAgdmFyIGFjdGlvbk1vZGlmaWVycyA9IGFjdGlvbk9wdGlvbnMubW9kaWZpZXJzO1xuXG4gIGlmIChhY3Rpb25Nb2RpZmllcnMgJiYgYWN0aW9uTW9kaWZpZXJzLmxlbmd0aCkge1xuICAgIHJldHVybiBhY3Rpb25Nb2RpZmllcnMuZmlsdGVyKGZ1bmN0aW9uIChtb2RpZmllcikge1xuICAgICAgcmV0dXJuICFtb2RpZmllci5vcHRpb25zIHx8IG1vZGlmaWVyLm9wdGlvbnMuZW5hYmxlZCAhPT0gZmFsc2U7XG4gICAgfSkubWFwKGZ1bmN0aW9uIChtb2RpZmllcikge1xuICAgICAgaWYgKCFtb2RpZmllci5tZXRob2RzICYmIG1vZGlmaWVyLnR5cGUpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdGVyZWRNb2RpZmllcnNbbW9kaWZpZXIudHlwZV0obW9kaWZpZXIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbW9kaWZpZXI7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gWydzbmFwJywgJ3NuYXBTaXplJywgJ3NuYXBFZGdlcycsICdyZXN0cmljdCcsICdyZXN0cmljdEVkZ2VzJywgJ3Jlc3RyaWN0U2l6ZSddLm1hcChmdW5jdGlvbiAodHlwZSkge1xuICAgIHZhciBvcHRpb25zID0gYWN0aW9uT3B0aW9uc1t0eXBlXTtcbiAgICByZXR1cm4gb3B0aW9ucyAmJiBvcHRpb25zLmVuYWJsZWQgJiYge1xuICAgICAgb3B0aW9uczogb3B0aW9ucyxcbiAgICAgIG1ldGhvZHM6IG9wdGlvbnMuX21ldGhvZHNcbiAgICB9O1xuICB9KS5maWx0ZXIoZnVuY3Rpb24gKG0pIHtcbiAgICByZXR1cm4gISFtO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcHJlcGFyZVN0YXRlcyhtb2RpZmllckxpc3QpIHtcbiAgdmFyIHN0YXRlcyA9IFtdO1xuXG4gIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBtb2RpZmllckxpc3QubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgdmFyIF9tb2RpZmllckxpc3QkaW5kZXggPSBtb2RpZmllckxpc3RbaW5kZXhdLFxuICAgICAgICBvcHRpb25zID0gX21vZGlmaWVyTGlzdCRpbmRleC5vcHRpb25zLFxuICAgICAgICBtZXRob2RzID0gX21vZGlmaWVyTGlzdCRpbmRleC5tZXRob2RzLFxuICAgICAgICBuYW1lID0gX21vZGlmaWVyTGlzdCRpbmRleC5uYW1lO1xuXG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5lbmFibGVkID09PSBmYWxzZSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdmFyIHN0YXRlID0ge1xuICAgICAgb3B0aW9uczogb3B0aW9ucyxcbiAgICAgIG1ldGhvZHM6IG1ldGhvZHMsXG4gICAgICBpbmRleDogaW5kZXgsXG4gICAgICBuYW1lOiBuYW1lXG4gICAgfTtcbiAgICBzdGF0ZXMucHVzaChzdGF0ZSk7XG4gIH1cblxuICByZXR1cm4gc3RhdGVzO1xufVxuXG5mdW5jdGlvbiBzZXRDb29yZHMoYXJnKSB7XG4gIHZhciBpbnRlcmFjdGlvbiA9IGFyZy5pbnRlcmFjdGlvbixcbiAgICAgIHBoYXNlID0gYXJnLnBoYXNlO1xuICB2YXIgY3VyQ29vcmRzID0gYXJnLmN1ckNvb3JkcyB8fCBpbnRlcmFjdGlvbi5jb29yZHMuY3VyO1xuICB2YXIgc3RhcnRDb29yZHMgPSBhcmcuc3RhcnRDb29yZHMgfHwgaW50ZXJhY3Rpb24uY29vcmRzLnN0YXJ0O1xuICB2YXIgX2ludGVyYWN0aW9uJG1vZGlmaWVyID0gaW50ZXJhY3Rpb24ubW9kaWZpZXJzLFxuICAgICAgcmVzdWx0ID0gX2ludGVyYWN0aW9uJG1vZGlmaWVyLnJlc3VsdCxcbiAgICAgIHN0YXJ0RGVsdGEgPSBfaW50ZXJhY3Rpb24kbW9kaWZpZXIuc3RhcnREZWx0YTtcbiAgdmFyIGN1ckRlbHRhID0gcmVzdWx0LmRlbHRhO1xuXG4gIGlmIChwaGFzZSA9PT0gJ3N0YXJ0Jykge1xuICAgICgwLCBfZXh0ZW5kW1wiZGVmYXVsdFwiXSkoaW50ZXJhY3Rpb24ubW9kaWZpZXJzLnN0YXJ0RGVsdGEsIHJlc3VsdC5kZWx0YSk7XG4gIH1cblxuICB2YXIgX2FyciA9IFtbc3RhcnRDb29yZHMsIHN0YXJ0RGVsdGFdLCBbY3VyQ29vcmRzLCBjdXJEZWx0YV1dO1xuXG4gIGZvciAodmFyIF9pNSA9IDA7IF9pNSA8IF9hcnIubGVuZ3RoOyBfaTUrKykge1xuICAgIHZhciBfYXJyJF9pID0gX3NsaWNlZFRvQXJyYXkoX2FycltfaTVdLCAyKSxcbiAgICAgICAgY29vcmRzU2V0ID0gX2FyciRfaVswXSxcbiAgICAgICAgZGVsdGEgPSBfYXJyJF9pWzFdO1xuXG4gICAgY29vcmRzU2V0LnBhZ2UueCArPSBkZWx0YS54O1xuICAgIGNvb3Jkc1NldC5wYWdlLnkgKz0gZGVsdGEueTtcbiAgICBjb29yZHNTZXQuY2xpZW50LnggKz0gZGVsdGEueDtcbiAgICBjb29yZHNTZXQuY2xpZW50LnkgKz0gZGVsdGEueTtcbiAgfVxuXG4gIHZhciByZWN0RGVsdGEgPSBpbnRlcmFjdGlvbi5tb2RpZmllcnMucmVzdWx0LnJlY3REZWx0YTtcbiAgdmFyIHJlY3QgPSBhcmcucmVjdCB8fCBpbnRlcmFjdGlvbi5yZWN0O1xuICByZWN0LmxlZnQgKz0gcmVjdERlbHRhLmxlZnQ7XG4gIHJlY3QucmlnaHQgKz0gcmVjdERlbHRhLnJpZ2h0O1xuICByZWN0LnRvcCArPSByZWN0RGVsdGEudG9wO1xuICByZWN0LmJvdHRvbSArPSByZWN0RGVsdGEuYm90dG9tO1xuICByZWN0LndpZHRoID0gcmVjdC5yaWdodCAtIHJlY3QubGVmdDtcbiAgcmVjdC5oZWlnaHQgPSByZWN0LmJvdHRvbSAtIHJlY3QudG9wO1xufVxuXG5mdW5jdGlvbiByZXN0b3JlQ29vcmRzKF9yZWY3KSB7XG4gIHZhciBfcmVmNyRpbnRlcmFjdGlvbiA9IF9yZWY3LmludGVyYWN0aW9uLFxuICAgICAgY29vcmRzID0gX3JlZjckaW50ZXJhY3Rpb24uY29vcmRzLFxuICAgICAgcmVjdCA9IF9yZWY3JGludGVyYWN0aW9uLnJlY3QsXG4gICAgICBtb2RpZmllcnMgPSBfcmVmNyRpbnRlcmFjdGlvbi5tb2RpZmllcnM7XG5cbiAgaWYgKCFtb2RpZmllcnMucmVzdWx0KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHN0YXJ0RGVsdGEgPSBtb2RpZmllcnMuc3RhcnREZWx0YTtcbiAgdmFyIF9tb2RpZmllcnMkcmVzdWx0ID0gbW9kaWZpZXJzLnJlc3VsdCxcbiAgICAgIGN1ckRlbHRhID0gX21vZGlmaWVycyRyZXN1bHQuZGVsdGEsXG4gICAgICByZWN0RGVsdGEgPSBfbW9kaWZpZXJzJHJlc3VsdC5yZWN0RGVsdGE7XG4gIHZhciBfYXJyMiA9IFtbY29vcmRzLnN0YXJ0LCBzdGFydERlbHRhXSwgW2Nvb3Jkcy5jdXIsIGN1ckRlbHRhXV07XG5cbiAgZm9yICh2YXIgX2k2ID0gMDsgX2k2IDwgX2FycjIubGVuZ3RoOyBfaTYrKykge1xuICAgIHZhciBfYXJyMiRfaSA9IF9zbGljZWRUb0FycmF5KF9hcnIyW19pNl0sIDIpLFxuICAgICAgICBjb29yZHNTZXQgPSBfYXJyMiRfaVswXSxcbiAgICAgICAgZGVsdGEgPSBfYXJyMiRfaVsxXTtcblxuICAgIGNvb3Jkc1NldC5wYWdlLnggLT0gZGVsdGEueDtcbiAgICBjb29yZHNTZXQucGFnZS55IC09IGRlbHRhLnk7XG4gICAgY29vcmRzU2V0LmNsaWVudC54IC09IGRlbHRhLng7XG4gICAgY29vcmRzU2V0LmNsaWVudC55IC09IGRlbHRhLnk7XG4gIH1cblxuICByZWN0LmxlZnQgLT0gcmVjdERlbHRhLmxlZnQ7XG4gIHJlY3QucmlnaHQgLT0gcmVjdERlbHRhLnJpZ2h0O1xuICByZWN0LnRvcCAtPSByZWN0RGVsdGEudG9wO1xuICByZWN0LmJvdHRvbSAtPSByZWN0RGVsdGEuYm90dG9tO1xufVxuXG5mdW5jdGlvbiBzaG91bGREbyhvcHRpb25zLCBwcmVFbmQsIHJlcXVpcmVFbmRPbmx5LCBwaGFzZSkge1xuICByZXR1cm4gb3B0aW9ucyA/IG9wdGlvbnMuZW5hYmxlZCAhPT0gZmFsc2UgJiYgKHByZUVuZCB8fCAhb3B0aW9ucy5lbmRPbmx5KSAmJiAoIXJlcXVpcmVFbmRPbmx5IHx8IG9wdGlvbnMuZW5kT25seSB8fCBvcHRpb25zLmFsd2F5c09uRW5kKSAmJiAob3B0aW9ucy5zZXRTdGFydCB8fCBwaGFzZSAhPT0gJ3N0YXJ0JykgOiAhcmVxdWlyZUVuZE9ubHk7XG59XG5cbmZ1bmN0aW9uIGdldFJlY3RPZmZzZXQocmVjdCwgY29vcmRzKSB7XG4gIHJldHVybiByZWN0ID8ge1xuICAgIGxlZnQ6IGNvb3Jkcy54IC0gcmVjdC5sZWZ0LFxuICAgIHRvcDogY29vcmRzLnkgLSByZWN0LnRvcCxcbiAgICByaWdodDogcmVjdC5yaWdodCAtIGNvb3Jkcy54LFxuICAgIGJvdHRvbTogcmVjdC5ib3R0b20gLSBjb29yZHMueVxuICB9IDoge1xuICAgIGxlZnQ6IDAsXG4gICAgdG9wOiAwLFxuICAgIHJpZ2h0OiAwLFxuICAgIGJvdHRvbTogMFxuICB9O1xufVxuXG5mdW5jdGlvbiBtYWtlTW9kaWZpZXIobW9kdWxlLCBuYW1lKSB7XG4gIHZhciBkZWZhdWx0cyA9IG1vZHVsZS5kZWZhdWx0cztcbiAgdmFyIG1ldGhvZHMgPSB7XG4gICAgc3RhcnQ6IG1vZHVsZS5zdGFydCxcbiAgICBzZXQ6IG1vZHVsZS5zZXQsXG4gICAgYmVmb3JlRW5kOiBtb2R1bGUuYmVmb3JlRW5kLFxuICAgIHN0b3A6IG1vZHVsZS5zdG9wXG4gIH07XG5cbiAgdmFyIG1vZGlmaWVyID0gZnVuY3Rpb24gbW9kaWZpZXIob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9OyAvLyBhZGQgbWlzc2luZyBkZWZhdWx0cyB0byBvcHRpb25zXG5cbiAgICBvcHRpb25zLmVuYWJsZWQgPSBvcHRpb25zLmVuYWJsZWQgIT09IGZhbHNlO1xuXG4gICAgZm9yICh2YXIgcHJvcCBpbiBkZWZhdWx0cykge1xuICAgICAgaWYgKCEocHJvcCBpbiBvcHRpb25zKSkge1xuICAgICAgICBvcHRpb25zW3Byb3BdID0gZGVmYXVsdHNbcHJvcF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIG9wdGlvbnM6IG9wdGlvbnMsXG4gICAgICBtZXRob2RzOiBtZXRob2RzLFxuICAgICAgbmFtZTogbmFtZVxuICAgIH07XG4gIH07XG5cbiAgaWYgKHR5cGVvZiBuYW1lID09PSAnc3RyaW5nJykge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2RpZmllciwgJ25hbWUnLCB7XG4gICAgICB2YWx1ZTogbmFtZVxuICAgIH0pOyAvLyBmb3IgYmFja3dyYWRzIGNvbXBhdGliaWxpdHlcblxuICAgIG1vZGlmaWVyLl9kZWZhdWx0cyA9IGRlZmF1bHRzO1xuICAgIG1vZGlmaWVyLl9tZXRob2RzID0gbWV0aG9kcztcbiAgfVxuXG4gIHJldHVybiBtb2RpZmllcjtcbn1cblxudmFyIF9kZWZhdWx0ID0ge1xuICBpZDogJ21vZGlmaWVycy9iYXNlJyxcbiAgaW5zdGFsbDogaW5zdGFsbCxcbiAgc3RhcnRBbGw6IHN0YXJ0QWxsLFxuICBzZXRBbGw6IHNldEFsbCxcbiAgcHJlcGFyZVN0YXRlczogcHJlcGFyZVN0YXRlcyxcbiAgc3RhcnQ6IHN0YXJ0LFxuICBiZWZvcmVNb3ZlOiBiZWZvcmVNb3ZlLFxuICBiZWZvcmVFbmQ6IGJlZm9yZUVuZCxcbiAgc3RvcDogc3RvcCxcbiAgc2hvdWxkRG86IHNob3VsZERvLFxuICBnZXRNb2RpZmllckxpc3Q6IGdldE1vZGlmaWVyTGlzdCxcbiAgZ2V0UmVjdE9mZnNldDogZ2V0UmVjdE9mZnNldCxcbiAgbWFrZU1vZGlmaWVyOiBtYWtlTW9kaWZpZXJcbn07XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0O1xuXG59LHtcIkBpbnRlcmFjdGpzL3V0aWxzL2V4dGVuZFwiOjUyfV0sMzE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLnJlc3RyaWN0U2l6ZSA9IGV4cG9ydHMucmVzdHJpY3RFZGdlcyA9IGV4cG9ydHMucmVzdHJpY3QgPSBleHBvcnRzLnNuYXBFZGdlcyA9IGV4cG9ydHMuc25hcFNpemUgPSBleHBvcnRzLnNuYXAgPSB2b2lkIDA7XG5cbnZhciBfYmFzZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vYmFzZVwiKSk7XG5cbnZhciBfZWRnZXMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL3Jlc3RyaWN0L2VkZ2VzXCIpKTtcblxudmFyIF9wb2ludGVyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9yZXN0cmljdC9wb2ludGVyXCIpKTtcblxudmFyIF9zaXplID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9yZXN0cmljdC9zaXplXCIpKTtcblxudmFyIF9lZGdlczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL3NuYXAvZWRnZXNcIikpO1xuXG52YXIgX3BvaW50ZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9zbmFwL3BvaW50ZXJcIikpO1xuXG52YXIgX3NpemUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9zbmFwL3NpemVcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxudmFyIG1ha2VNb2RpZmllciA9IF9iYXNlW1wiZGVmYXVsdFwiXS5tYWtlTW9kaWZpZXI7XG52YXIgc25hcCA9IG1ha2VNb2RpZmllcihfcG9pbnRlcjJbXCJkZWZhdWx0XCJdLCAnc25hcCcpO1xuZXhwb3J0cy5zbmFwID0gc25hcDtcbnZhciBzbmFwU2l6ZSA9IG1ha2VNb2RpZmllcihfc2l6ZTJbXCJkZWZhdWx0XCJdLCAnc25hcFNpemUnKTtcbmV4cG9ydHMuc25hcFNpemUgPSBzbmFwU2l6ZTtcbnZhciBzbmFwRWRnZXMgPSBtYWtlTW9kaWZpZXIoX2VkZ2VzMltcImRlZmF1bHRcIl0sICdzbmFwRWRnZXMnKTtcbmV4cG9ydHMuc25hcEVkZ2VzID0gc25hcEVkZ2VzO1xudmFyIHJlc3RyaWN0ID0gbWFrZU1vZGlmaWVyKF9wb2ludGVyW1wiZGVmYXVsdFwiXSwgJ3Jlc3RyaWN0Jyk7XG5leHBvcnRzLnJlc3RyaWN0ID0gcmVzdHJpY3Q7XG52YXIgcmVzdHJpY3RFZGdlcyA9IG1ha2VNb2RpZmllcihfZWRnZXNbXCJkZWZhdWx0XCJdLCAncmVzdHJpY3RFZGdlcycpO1xuZXhwb3J0cy5yZXN0cmljdEVkZ2VzID0gcmVzdHJpY3RFZGdlcztcbnZhciByZXN0cmljdFNpemUgPSBtYWtlTW9kaWZpZXIoX3NpemVbXCJkZWZhdWx0XCJdLCAncmVzdHJpY3RTaXplJyk7XG5leHBvcnRzLnJlc3RyaWN0U2l6ZSA9IHJlc3RyaWN0U2l6ZTtcblxufSx7XCIuL2Jhc2VcIjozMCxcIi4vcmVzdHJpY3QvZWRnZXNcIjozMixcIi4vcmVzdHJpY3QvcG9pbnRlclwiOjMzLFwiLi9yZXN0cmljdC9zaXplXCI6MzQsXCIuL3NuYXAvZWRnZXNcIjozNSxcIi4vc25hcC9wb2ludGVyXCI6MzYsXCIuL3NuYXAvc2l6ZVwiOjM3fV0sMzI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF9leHRlbmQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy91dGlscy9leHRlbmRcIikpO1xuXG52YXIgX3JlY3QgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy91dGlscy9yZWN0XCIpKTtcblxudmFyIF9wb2ludGVyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9wb2ludGVyXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbi8vIFRoaXMgbW9kdWxlIGFkZHMgdGhlIG9wdGlvbnMucmVzaXplLnJlc3RyaWN0RWRnZXMgc2V0dGluZyB3aGljaCBzZXRzIG1pbiBhbmRcbi8vIG1heCBmb3IgdGhlIHRvcCwgbGVmdCwgYm90dG9tIGFuZCByaWdodCBlZGdlcyBvZiB0aGUgdGFyZ2V0IGJlaW5nIHJlc2l6ZWQuXG4vL1xuLy8gaW50ZXJhY3QodGFyZ2V0KS5yZXNpemUoe1xuLy8gICBlZGdlczogeyB0b3A6IHRydWUsIGxlZnQ6IHRydWUgfSxcbi8vICAgcmVzdHJpY3RFZGdlczoge1xuLy8gICAgIGlubmVyOiB7IHRvcDogMjAwLCBsZWZ0OiAyMDAsIHJpZ2h0OiA0MDAsIGJvdHRvbTogNDAwIH0sXG4vLyAgICAgb3V0ZXI6IHsgdG9wOiAgIDAsIGxlZnQ6ICAgMCwgcmlnaHQ6IDYwMCwgYm90dG9tOiA2MDAgfSxcbi8vICAgfSxcbi8vIH0pXG52YXIgZ2V0UmVzdHJpY3Rpb25SZWN0ID0gX3BvaW50ZXJbXCJkZWZhdWx0XCJdLmdldFJlc3RyaWN0aW9uUmVjdDtcbnZhciBub0lubmVyID0ge1xuICB0b3A6ICtJbmZpbml0eSxcbiAgbGVmdDogK0luZmluaXR5LFxuICBib3R0b206IC1JbmZpbml0eSxcbiAgcmlnaHQ6IC1JbmZpbml0eVxufTtcbnZhciBub091dGVyID0ge1xuICB0b3A6IC1JbmZpbml0eSxcbiAgbGVmdDogLUluZmluaXR5LFxuICBib3R0b206ICtJbmZpbml0eSxcbiAgcmlnaHQ6ICtJbmZpbml0eVxufTtcblxuZnVuY3Rpb24gc3RhcnQoX3JlZikge1xuICB2YXIgaW50ZXJhY3Rpb24gPSBfcmVmLmludGVyYWN0aW9uLFxuICAgICAgc3RhdGUgPSBfcmVmLnN0YXRlO1xuICB2YXIgb3B0aW9ucyA9IHN0YXRlLm9wdGlvbnM7XG4gIHZhciBzdGFydE9mZnNldCA9IGludGVyYWN0aW9uLm1vZGlmaWVycy5zdGFydE9mZnNldDtcbiAgdmFyIG9mZnNldDtcblxuICBpZiAob3B0aW9ucykge1xuICAgIHZhciBvZmZzZXRSZWN0ID0gZ2V0UmVzdHJpY3Rpb25SZWN0KG9wdGlvbnMub2Zmc2V0LCBpbnRlcmFjdGlvbiwgaW50ZXJhY3Rpb24uY29vcmRzLnN0YXJ0LnBhZ2UpO1xuICAgIG9mZnNldCA9IF9yZWN0W1wiZGVmYXVsdFwiXS5yZWN0VG9YWShvZmZzZXRSZWN0KTtcbiAgfVxuXG4gIG9mZnNldCA9IG9mZnNldCB8fCB7XG4gICAgeDogMCxcbiAgICB5OiAwXG4gIH07XG4gIHN0YXRlLm9mZnNldCA9IHtcbiAgICB0b3A6IG9mZnNldC55ICsgc3RhcnRPZmZzZXQudG9wLFxuICAgIGxlZnQ6IG9mZnNldC54ICsgc3RhcnRPZmZzZXQubGVmdCxcbiAgICBib3R0b206IG9mZnNldC55IC0gc3RhcnRPZmZzZXQuYm90dG9tLFxuICAgIHJpZ2h0OiBvZmZzZXQueCAtIHN0YXJ0T2Zmc2V0LnJpZ2h0XG4gIH07XG59XG5cbmZ1bmN0aW9uIHNldChfcmVmMikge1xuICB2YXIgY29vcmRzID0gX3JlZjIuY29vcmRzLFxuICAgICAgaW50ZXJhY3Rpb24gPSBfcmVmMi5pbnRlcmFjdGlvbixcbiAgICAgIHN0YXRlID0gX3JlZjIuc3RhdGU7XG4gIHZhciBvZmZzZXQgPSBzdGF0ZS5vZmZzZXQsXG4gICAgICBvcHRpb25zID0gc3RhdGUub3B0aW9ucztcbiAgdmFyIGVkZ2VzID0gaW50ZXJhY3Rpb24ucHJlcGFyZWQuX2xpbmtlZEVkZ2VzIHx8IGludGVyYWN0aW9uLnByZXBhcmVkLmVkZ2VzO1xuXG4gIGlmICghZWRnZXMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgcGFnZSA9ICgwLCBfZXh0ZW5kW1wiZGVmYXVsdFwiXSkoe30sIGNvb3Jkcyk7XG4gIHZhciBpbm5lciA9IGdldFJlc3RyaWN0aW9uUmVjdChvcHRpb25zLmlubmVyLCBpbnRlcmFjdGlvbiwgcGFnZSkgfHwge307XG4gIHZhciBvdXRlciA9IGdldFJlc3RyaWN0aW9uUmVjdChvcHRpb25zLm91dGVyLCBpbnRlcmFjdGlvbiwgcGFnZSkgfHwge307XG4gIGZpeFJlY3QoaW5uZXIsIG5vSW5uZXIpO1xuICBmaXhSZWN0KG91dGVyLCBub091dGVyKTtcblxuICBpZiAoZWRnZXMudG9wKSB7XG4gICAgY29vcmRzLnkgPSBNYXRoLm1pbihNYXRoLm1heChvdXRlci50b3AgKyBvZmZzZXQudG9wLCBwYWdlLnkpLCBpbm5lci50b3AgKyBvZmZzZXQudG9wKTtcbiAgfSBlbHNlIGlmIChlZGdlcy5ib3R0b20pIHtcbiAgICBjb29yZHMueSA9IE1hdGgubWF4KE1hdGgubWluKG91dGVyLmJvdHRvbSArIG9mZnNldC5ib3R0b20sIHBhZ2UueSksIGlubmVyLmJvdHRvbSArIG9mZnNldC5ib3R0b20pO1xuICB9XG5cbiAgaWYgKGVkZ2VzLmxlZnQpIHtcbiAgICBjb29yZHMueCA9IE1hdGgubWluKE1hdGgubWF4KG91dGVyLmxlZnQgKyBvZmZzZXQubGVmdCwgcGFnZS54KSwgaW5uZXIubGVmdCArIG9mZnNldC5sZWZ0KTtcbiAgfSBlbHNlIGlmIChlZGdlcy5yaWdodCkge1xuICAgIGNvb3Jkcy54ID0gTWF0aC5tYXgoTWF0aC5taW4ob3V0ZXIucmlnaHQgKyBvZmZzZXQucmlnaHQsIHBhZ2UueCksIGlubmVyLnJpZ2h0ICsgb2Zmc2V0LnJpZ2h0KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmaXhSZWN0KHJlY3QsIGRlZmF1bHRzKSB7XG4gIHZhciBfYXJyID0gWyd0b3AnLCAnbGVmdCcsICdib3R0b20nLCAncmlnaHQnXTtcblxuICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgX2Fyci5sZW5ndGg7IF9pKyspIHtcbiAgICB2YXIgZWRnZSA9IF9hcnJbX2ldO1xuXG4gICAgaWYgKCEoZWRnZSBpbiByZWN0KSkge1xuICAgICAgcmVjdFtlZGdlXSA9IGRlZmF1bHRzW2VkZ2VdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZWN0O1xufVxuXG52YXIgcmVzdHJpY3RFZGdlcyA9IHtcbiAgbm9Jbm5lcjogbm9Jbm5lcixcbiAgbm9PdXRlcjogbm9PdXRlcixcbiAgZ2V0UmVzdHJpY3Rpb25SZWN0OiBnZXRSZXN0cmljdGlvblJlY3QsXG4gIHN0YXJ0OiBzdGFydCxcbiAgc2V0OiBzZXQsXG4gIGRlZmF1bHRzOiB7XG4gICAgZW5hYmxlZDogZmFsc2UsXG4gICAgaW5uZXI6IG51bGwsXG4gICAgb3V0ZXI6IG51bGwsXG4gICAgb2Zmc2V0OiBudWxsXG4gIH1cbn07XG52YXIgX2RlZmF1bHQgPSByZXN0cmljdEVkZ2VzO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBfZGVmYXVsdDtcblxufSx7XCIuL3BvaW50ZXJcIjozMyxcIkBpbnRlcmFjdGpzL3V0aWxzL2V4dGVuZFwiOjUyLFwiQGludGVyYWN0anMvdXRpbHMvcmVjdFwiOjYyfV0sMzM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIGlzID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQocmVxdWlyZShcIkBpbnRlcmFjdGpzL3V0aWxzL2lzXCIpKTtcblxudmFyIF9yZWN0ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiQGludGVyYWN0anMvdXRpbHMvcmVjdFwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7IHZhciBkZXNjID0gT2JqZWN0LmRlZmluZVByb3BlcnR5ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KSA6IHt9OyBpZiAoZGVzYy5nZXQgfHwgZGVzYy5zZXQpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5ld09iaiwga2V5LCBkZXNjKTsgfSBlbHNlIHsgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IH0gfSBuZXdPYmpbXCJkZWZhdWx0XCJdID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblxuZnVuY3Rpb24gc3RhcnQoX3JlZikge1xuICB2YXIgcmVjdCA9IF9yZWYucmVjdCxcbiAgICAgIHN0YXJ0T2Zmc2V0ID0gX3JlZi5zdGFydE9mZnNldCxcbiAgICAgIHN0YXRlID0gX3JlZi5zdGF0ZTtcbiAgdmFyIG9wdGlvbnMgPSBzdGF0ZS5vcHRpb25zO1xuICB2YXIgZWxlbWVudFJlY3QgPSBvcHRpb25zLmVsZW1lbnRSZWN0O1xuICB2YXIgb2Zmc2V0ID0ge307XG5cbiAgaWYgKHJlY3QgJiYgZWxlbWVudFJlY3QpIHtcbiAgICBvZmZzZXQubGVmdCA9IHN0YXJ0T2Zmc2V0LmxlZnQgLSByZWN0LndpZHRoICogZWxlbWVudFJlY3QubGVmdDtcbiAgICBvZmZzZXQudG9wID0gc3RhcnRPZmZzZXQudG9wIC0gcmVjdC5oZWlnaHQgKiBlbGVtZW50UmVjdC50b3A7XG4gICAgb2Zmc2V0LnJpZ2h0ID0gc3RhcnRPZmZzZXQucmlnaHQgLSByZWN0LndpZHRoICogKDEgLSBlbGVtZW50UmVjdC5yaWdodCk7XG4gICAgb2Zmc2V0LmJvdHRvbSA9IHN0YXJ0T2Zmc2V0LmJvdHRvbSAtIHJlY3QuaGVpZ2h0ICogKDEgLSBlbGVtZW50UmVjdC5ib3R0b20pO1xuICB9IGVsc2Uge1xuICAgIG9mZnNldC5sZWZ0ID0gb2Zmc2V0LnRvcCA9IG9mZnNldC5yaWdodCA9IG9mZnNldC5ib3R0b20gPSAwO1xuICB9XG5cbiAgc3RhdGUub2Zmc2V0ID0gb2Zmc2V0O1xufVxuXG5mdW5jdGlvbiBzZXQoX3JlZjIpIHtcbiAgdmFyIGNvb3JkcyA9IF9yZWYyLmNvb3JkcyxcbiAgICAgIGludGVyYWN0aW9uID0gX3JlZjIuaW50ZXJhY3Rpb24sXG4gICAgICBzdGF0ZSA9IF9yZWYyLnN0YXRlO1xuICB2YXIgb3B0aW9ucyA9IHN0YXRlLm9wdGlvbnMsXG4gICAgICBvZmZzZXQgPSBzdGF0ZS5vZmZzZXQ7XG4gIHZhciByZXN0cmljdGlvbiA9IGdldFJlc3RyaWN0aW9uUmVjdChvcHRpb25zLnJlc3RyaWN0aW9uLCBpbnRlcmFjdGlvbiwgY29vcmRzKTtcblxuICBpZiAoIXJlc3RyaWN0aW9uKSB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgdmFyIHJlY3QgPSByZXN0cmljdGlvbjsgLy8gb2JqZWN0IGlzIGFzc3VtZWQgdG8gaGF2ZVxuICAvLyB4LCB5LCB3aWR0aCwgaGVpZ2h0IG9yXG4gIC8vIGxlZnQsIHRvcCwgcmlnaHQsIGJvdHRvbVxuXG4gIGlmICgneCcgaW4gcmVzdHJpY3Rpb24gJiYgJ3knIGluIHJlc3RyaWN0aW9uKSB7XG4gICAgY29vcmRzLnggPSBNYXRoLm1heChNYXRoLm1pbihyZWN0LnggKyByZWN0LndpZHRoIC0gb2Zmc2V0LnJpZ2h0LCBjb29yZHMueCksIHJlY3QueCArIG9mZnNldC5sZWZ0KTtcbiAgICBjb29yZHMueSA9IE1hdGgubWF4KE1hdGgubWluKHJlY3QueSArIHJlY3QuaGVpZ2h0IC0gb2Zmc2V0LmJvdHRvbSwgY29vcmRzLnkpLCByZWN0LnkgKyBvZmZzZXQudG9wKTtcbiAgfSBlbHNlIHtcbiAgICBjb29yZHMueCA9IE1hdGgubWF4KE1hdGgubWluKHJlY3QucmlnaHQgLSBvZmZzZXQucmlnaHQsIGNvb3Jkcy54KSwgcmVjdC5sZWZ0ICsgb2Zmc2V0LmxlZnQpO1xuICAgIGNvb3Jkcy55ID0gTWF0aC5tYXgoTWF0aC5taW4ocmVjdC5ib3R0b20gLSBvZmZzZXQuYm90dG9tLCBjb29yZHMueSksIHJlY3QudG9wICsgb2Zmc2V0LnRvcCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0UmVzdHJpY3Rpb25SZWN0KHZhbHVlLCBpbnRlcmFjdGlvbiwgY29vcmRzKSB7XG4gIGlmIChpcy5mdW5jKHZhbHVlKSkge1xuICAgIHJldHVybiBfcmVjdFtcImRlZmF1bHRcIl0ucmVzb2x2ZVJlY3RMaWtlKHZhbHVlLCBpbnRlcmFjdGlvbi5pbnRlcmFjdGFibGUsIGludGVyYWN0aW9uLmVsZW1lbnQsIFtjb29yZHMueCwgY29vcmRzLnksIGludGVyYWN0aW9uXSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIF9yZWN0W1wiZGVmYXVsdFwiXS5yZXNvbHZlUmVjdExpa2UodmFsdWUsIGludGVyYWN0aW9uLmludGVyYWN0YWJsZSwgaW50ZXJhY3Rpb24uZWxlbWVudCk7XG4gIH1cbn1cblxudmFyIHJlc3RyaWN0ID0ge1xuICBzdGFydDogc3RhcnQsXG4gIHNldDogc2V0LFxuICBnZXRSZXN0cmljdGlvblJlY3Q6IGdldFJlc3RyaWN0aW9uUmVjdCxcbiAgZGVmYXVsdHM6IHtcbiAgICBlbmFibGVkOiBmYWxzZSxcbiAgICByZXN0cmljdGlvbjogbnVsbCxcbiAgICBlbGVtZW50UmVjdDogbnVsbFxuICB9XG59O1xudmFyIF9kZWZhdWx0ID0gcmVzdHJpY3Q7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0O1xuXG59LHtcIkBpbnRlcmFjdGpzL3V0aWxzL2lzXCI6NTYsXCJAaW50ZXJhY3Rqcy91dGlscy9yZWN0XCI6NjJ9XSwzNDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX2V4dGVuZCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIkBpbnRlcmFjdGpzL3V0aWxzL2V4dGVuZFwiKSk7XG5cbnZhciBfcmVjdCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIkBpbnRlcmFjdGpzL3V0aWxzL3JlY3RcIikpO1xuXG52YXIgX2VkZ2VzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9lZGdlc1wiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG4vLyBUaGlzIG1vZHVsZSBhZGRzIHRoZSBvcHRpb25zLnJlc2l6ZS5yZXN0cmljdFNpemUgc2V0dGluZyB3aGljaCBzZXRzIG1pbiBhbmRcbi8vIG1heCB3aWR0aCBhbmQgaGVpZ2h0IGZvciB0aGUgdGFyZ2V0IGJlaW5nIHJlc2l6ZWQuXG4vL1xuLy8gaW50ZXJhY3QodGFyZ2V0KS5yZXNpemUoe1xuLy8gICBlZGdlczogeyB0b3A6IHRydWUsIGxlZnQ6IHRydWUgfSxcbi8vICAgcmVzdHJpY3RTaXplOiB7XG4vLyAgICAgbWluOiB7IHdpZHRoOiAtNjAwLCBoZWlnaHQ6IC02MDAgfSxcbi8vICAgICBtYXg6IHsgd2lkdGg6ICA2MDAsIGhlaWdodDogIDYwMCB9LFxuLy8gICB9LFxuLy8gfSlcbnZhciBub01pbiA9IHtcbiAgd2lkdGg6IC1JbmZpbml0eSxcbiAgaGVpZ2h0OiAtSW5maW5pdHlcbn07XG52YXIgbm9NYXggPSB7XG4gIHdpZHRoOiArSW5maW5pdHksXG4gIGhlaWdodDogK0luZmluaXR5XG59O1xuXG5mdW5jdGlvbiBzdGFydChhcmcpIHtcbiAgcmV0dXJuIF9lZGdlc1tcImRlZmF1bHRcIl0uc3RhcnQoYXJnKTtcbn1cblxuZnVuY3Rpb24gc2V0KGFyZykge1xuICB2YXIgaW50ZXJhY3Rpb24gPSBhcmcuaW50ZXJhY3Rpb24sXG4gICAgICBzdGF0ZSA9IGFyZy5zdGF0ZTtcbiAgdmFyIG9wdGlvbnMgPSBzdGF0ZS5vcHRpb25zO1xuICB2YXIgZWRnZXMgPSBpbnRlcmFjdGlvbi5wcmVwYXJlZC5saW5rZWRFZGdlcyB8fCBpbnRlcmFjdGlvbi5wcmVwYXJlZC5lZGdlcztcblxuICBpZiAoIWVkZ2VzKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHJlY3QgPSBfcmVjdFtcImRlZmF1bHRcIl0ueHl3aFRvVGxicihpbnRlcmFjdGlvbi5yZXNpemVSZWN0cy5pbnZlcnRlZCk7XG5cbiAgdmFyIG1pblNpemUgPSBfcmVjdFtcImRlZmF1bHRcIl0udGxiclRvWHl3aChfZWRnZXNbXCJkZWZhdWx0XCJdLmdldFJlc3RyaWN0aW9uUmVjdChvcHRpb25zLm1pbiwgaW50ZXJhY3Rpb24pKSB8fCBub01pbjtcbiAgdmFyIG1heFNpemUgPSBfcmVjdFtcImRlZmF1bHRcIl0udGxiclRvWHl3aChfZWRnZXNbXCJkZWZhdWx0XCJdLmdldFJlc3RyaWN0aW9uUmVjdChvcHRpb25zLm1heCwgaW50ZXJhY3Rpb24pKSB8fCBub01heDtcbiAgc3RhdGUub3B0aW9ucyA9IHtcbiAgICBlbmFibGVkOiBvcHRpb25zLmVuYWJsZWQsXG4gICAgZW5kT25seTogb3B0aW9ucy5lbmRPbmx5LFxuICAgIGlubmVyOiAoMCwgX2V4dGVuZFtcImRlZmF1bHRcIl0pKHt9LCBfZWRnZXNbXCJkZWZhdWx0XCJdLm5vSW5uZXIpLFxuICAgIG91dGVyOiAoMCwgX2V4dGVuZFtcImRlZmF1bHRcIl0pKHt9LCBfZWRnZXNbXCJkZWZhdWx0XCJdLm5vT3V0ZXIpXG4gIH07XG5cbiAgaWYgKGVkZ2VzLnRvcCkge1xuICAgIHN0YXRlLm9wdGlvbnMuaW5uZXIudG9wID0gcmVjdC5ib3R0b20gLSBtaW5TaXplLmhlaWdodDtcbiAgICBzdGF0ZS5vcHRpb25zLm91dGVyLnRvcCA9IHJlY3QuYm90dG9tIC0gbWF4U2l6ZS5oZWlnaHQ7XG4gIH0gZWxzZSBpZiAoZWRnZXMuYm90dG9tKSB7XG4gICAgc3RhdGUub3B0aW9ucy5pbm5lci5ib3R0b20gPSByZWN0LnRvcCArIG1pblNpemUuaGVpZ2h0O1xuICAgIHN0YXRlLm9wdGlvbnMub3V0ZXIuYm90dG9tID0gcmVjdC50b3AgKyBtYXhTaXplLmhlaWdodDtcbiAgfVxuXG4gIGlmIChlZGdlcy5sZWZ0KSB7XG4gICAgc3RhdGUub3B0aW9ucy5pbm5lci5sZWZ0ID0gcmVjdC5yaWdodCAtIG1pblNpemUud2lkdGg7XG4gICAgc3RhdGUub3B0aW9ucy5vdXRlci5sZWZ0ID0gcmVjdC5yaWdodCAtIG1heFNpemUud2lkdGg7XG4gIH0gZWxzZSBpZiAoZWRnZXMucmlnaHQpIHtcbiAgICBzdGF0ZS5vcHRpb25zLmlubmVyLnJpZ2h0ID0gcmVjdC5sZWZ0ICsgbWluU2l6ZS53aWR0aDtcbiAgICBzdGF0ZS5vcHRpb25zLm91dGVyLnJpZ2h0ID0gcmVjdC5sZWZ0ICsgbWF4U2l6ZS53aWR0aDtcbiAgfVxuXG4gIF9lZGdlc1tcImRlZmF1bHRcIl0uc2V0KGFyZyk7XG5cbiAgc3RhdGUub3B0aW9ucyA9IG9wdGlvbnM7XG59XG5cbnZhciByZXN0cmljdFNpemUgPSB7XG4gIHN0YXJ0OiBzdGFydCxcbiAgc2V0OiBzZXQsXG4gIGRlZmF1bHRzOiB7XG4gICAgZW5hYmxlZDogZmFsc2UsXG4gICAgbWluOiBudWxsLFxuICAgIG1heDogbnVsbFxuICB9XG59O1xudmFyIF9kZWZhdWx0ID0gcmVzdHJpY3RTaXplO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBfZGVmYXVsdDtcblxufSx7XCIuL2VkZ2VzXCI6MzIsXCJAaW50ZXJhY3Rqcy91dGlscy9leHRlbmRcIjo1MixcIkBpbnRlcmFjdGpzL3V0aWxzL3JlY3RcIjo2Mn1dLDM1OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciBfY2xvbmUgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy91dGlscy9jbG9uZVwiKSk7XG5cbnZhciBfZXh0ZW5kID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiQGludGVyYWN0anMvdXRpbHMvZXh0ZW5kXCIpKTtcblxudmFyIF9zaXplID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9zaXplXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbi8qKlxuICogQG1vZHVsZSBtb2RpZmllcnMvc25hcEVkZ2VzXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBUaGlzIG1vZHVsZSBhbGxvd3Mgc25hcHBpbmcgb2YgdGhlIGVkZ2VzIG9mIHRhcmdldHMgZHVyaW5nIHJlc2l6ZVxuICogaW50ZXJhY3Rpb25zLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbnRlcmFjdCh0YXJnZXQpLnJlc2l6YWJsZSh7XG4gKiAgIHNuYXBFZGdlczoge1xuICogICAgIHRhcmdldHM6IFtpbnRlcmFjdC5zbmFwcGVycy5ncmlkKHsgeDogMTAwLCB5OiA1MCB9KV0sXG4gKiAgIH0sXG4gKiB9KVxuICpcbiAqIGludGVyYWN0KHRhcmdldCkucmVzaXphYmxlKHtcbiAqICAgc25hcEVkZ2VzOiB7XG4gKiAgICAgdGFyZ2V0czogW1xuICogICAgICAgaW50ZXJhY3Quc25hcHBlcnMuZ3JpZCh7XG4gKiAgICAgICAgdG9wOiA1MCxcbiAqICAgICAgICBsZWZ0OiA1MCxcbiAqICAgICAgICBib3R0b206IDEwMCxcbiAqICAgICAgICByaWdodDogMTAwLFxuICogICAgICAgfSksXG4gKiAgICAgXSxcbiAqICAgfSxcbiAqIH0pXG4gKi9cbmZ1bmN0aW9uIHN0YXJ0KGFyZykge1xuICB2YXIgZWRnZXMgPSBhcmcuaW50ZXJhY3Rpb24ucHJlcGFyZWQuZWRnZXM7XG5cbiAgaWYgKCFlZGdlcykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgYXJnLnN0YXRlLnRhcmdldEZpZWxkcyA9IGFyZy5zdGF0ZS50YXJnZXRGaWVsZHMgfHwgW1tlZGdlcy5sZWZ0ID8gJ2xlZnQnIDogJ3JpZ2h0JywgZWRnZXMudG9wID8gJ3RvcCcgOiAnYm90dG9tJ11dO1xuICByZXR1cm4gX3NpemVbXCJkZWZhdWx0XCJdLnN0YXJ0KGFyZyk7XG59XG5cbmZ1bmN0aW9uIHNldChhcmcpIHtcbiAgcmV0dXJuIF9zaXplW1wiZGVmYXVsdFwiXS5zZXQoYXJnKTtcbn1cblxudmFyIHNuYXBFZGdlcyA9IHtcbiAgc3RhcnQ6IHN0YXJ0LFxuICBzZXQ6IHNldCxcbiAgZGVmYXVsdHM6ICgwLCBfZXh0ZW5kW1wiZGVmYXVsdFwiXSkoKDAsIF9jbG9uZVtcImRlZmF1bHRcIl0pKF9zaXplW1wiZGVmYXVsdFwiXS5kZWZhdWx0cyksIHtcbiAgICBvZmZzZXQ6IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfVxuICB9KVxufTtcbnZhciBfZGVmYXVsdCA9IHNuYXBFZGdlcztcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5cbn0se1wiLi9zaXplXCI6MzcsXCJAaW50ZXJhY3Rqcy91dGlscy9jbG9uZVwiOjQ4LFwiQGludGVyYWN0anMvdXRpbHMvZXh0ZW5kXCI6NTJ9XSwzNjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgdXRpbHMgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChyZXF1aXJlKFwiQGludGVyYWN0anMvdXRpbHNcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7IHZhciBkZXNjID0gT2JqZWN0LmRlZmluZVByb3BlcnR5ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KSA6IHt9OyBpZiAoZGVzYy5nZXQgfHwgZGVzYy5zZXQpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5ld09iaiwga2V5LCBkZXNjKTsgfSBlbHNlIHsgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IH0gfSBuZXdPYmpbXCJkZWZhdWx0XCJdID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblxuZnVuY3Rpb24gc3RhcnQoYXJnKSB7XG4gIHZhciBpbnRlcmFjdGlvbiA9IGFyZy5pbnRlcmFjdGlvbixcbiAgICAgIGludGVyYWN0YWJsZSA9IGFyZy5pbnRlcmFjdGFibGUsXG4gICAgICBlbGVtZW50ID0gYXJnLmVsZW1lbnQsXG4gICAgICByZWN0ID0gYXJnLnJlY3QsXG4gICAgICBzdGF0ZSA9IGFyZy5zdGF0ZSxcbiAgICAgIHN0YXJ0T2Zmc2V0ID0gYXJnLnN0YXJ0T2Zmc2V0O1xuICB2YXIgb3B0aW9ucyA9IHN0YXRlLm9wdGlvbnM7XG4gIHZhciBvZmZzZXRzID0gW107XG4gIHZhciBvcmlnaW4gPSBvcHRpb25zLm9mZnNldFdpdGhPcmlnaW4gPyBnZXRPcmlnaW4oYXJnKSA6IHtcbiAgICB4OiAwLFxuICAgIHk6IDBcbiAgfTtcbiAgdmFyIHNuYXBPZmZzZXQ7XG5cbiAgaWYgKG9wdGlvbnMub2Zmc2V0ID09PSAnc3RhcnRDb29yZHMnKSB7XG4gICAgc25hcE9mZnNldCA9IHtcbiAgICAgIHg6IGludGVyYWN0aW9uLmNvb3Jkcy5zdGFydC5wYWdlLngsXG4gICAgICB5OiBpbnRlcmFjdGlvbi5jb29yZHMuc3RhcnQucGFnZS55XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgb2Zmc2V0UmVjdCA9IHV0aWxzLnJlY3QucmVzb2x2ZVJlY3RMaWtlKG9wdGlvbnMub2Zmc2V0LCBpbnRlcmFjdGFibGUsIGVsZW1lbnQsIFtpbnRlcmFjdGlvbl0pO1xuICAgIHNuYXBPZmZzZXQgPSB1dGlscy5yZWN0LnJlY3RUb1hZKG9mZnNldFJlY3QpIHx8IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfTtcbiAgICBzbmFwT2Zmc2V0LnggKz0gb3JpZ2luLng7XG4gICAgc25hcE9mZnNldC55ICs9IG9yaWdpbi55O1xuICB9XG5cbiAgdmFyIHJlbGF0aXZlUG9pbnRzID0gb3B0aW9ucy5yZWxhdGl2ZVBvaW50cyB8fCBbXTtcblxuICBpZiAocmVjdCAmJiBvcHRpb25zLnJlbGF0aXZlUG9pbnRzICYmIG9wdGlvbnMucmVsYXRpdmVQb2ludHMubGVuZ3RoKSB7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHJlbGF0aXZlUG9pbnRzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIHJlbGF0aXZlUG9pbnQgPSByZWxhdGl2ZVBvaW50c1tpbmRleF07XG4gICAgICBvZmZzZXRzLnB1c2goe1xuICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgIHJlbGF0aXZlUG9pbnQ6IHJlbGF0aXZlUG9pbnQsXG4gICAgICAgIHg6IHN0YXJ0T2Zmc2V0LmxlZnQgLSByZWN0LndpZHRoICogcmVsYXRpdmVQb2ludC54ICsgc25hcE9mZnNldC54LFxuICAgICAgICB5OiBzdGFydE9mZnNldC50b3AgLSByZWN0LmhlaWdodCAqIHJlbGF0aXZlUG9pbnQueSArIHNuYXBPZmZzZXQueVxuICAgICAgfSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG9mZnNldHMucHVzaCh1dGlscy5leHRlbmQoe1xuICAgICAgaW5kZXg6IDAsXG4gICAgICByZWxhdGl2ZVBvaW50OiBudWxsXG4gICAgfSwgc25hcE9mZnNldCkpO1xuICB9XG5cbiAgc3RhdGUub2Zmc2V0cyA9IG9mZnNldHM7XG59XG5cbmZ1bmN0aW9uIHNldChhcmcpIHtcbiAgdmFyIGludGVyYWN0aW9uID0gYXJnLmludGVyYWN0aW9uLFxuICAgICAgY29vcmRzID0gYXJnLmNvb3JkcyxcbiAgICAgIHN0YXRlID0gYXJnLnN0YXRlO1xuICB2YXIgb3B0aW9ucyA9IHN0YXRlLm9wdGlvbnMsXG4gICAgICBvZmZzZXRzID0gc3RhdGUub2Zmc2V0cztcbiAgdmFyIG9yaWdpbiA9IHV0aWxzLmdldE9yaWdpblhZKGludGVyYWN0aW9uLmludGVyYWN0YWJsZSwgaW50ZXJhY3Rpb24uZWxlbWVudCwgaW50ZXJhY3Rpb24ucHJlcGFyZWQubmFtZSk7XG4gIHZhciBwYWdlID0gdXRpbHMuZXh0ZW5kKHt9LCBjb29yZHMpO1xuICB2YXIgdGFyZ2V0cyA9IFtdO1xuICB2YXIgdGFyZ2V0O1xuXG4gIGlmICghb3B0aW9ucy5vZmZzZXRXaXRoT3JpZ2luKSB7XG4gICAgcGFnZS54IC09IG9yaWdpbi54O1xuICAgIHBhZ2UueSAtPSBvcmlnaW4ueTtcbiAgfVxuXG4gIHN0YXRlLnJlYWxYID0gcGFnZS54O1xuICBzdGF0ZS5yZWFsWSA9IHBhZ2UueTtcblxuICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgb2Zmc2V0cy5sZW5ndGg7IF9pKyspIHtcbiAgICB2YXIgX3JlZjtcblxuICAgIF9yZWYgPSBvZmZzZXRzW19pXTtcbiAgICB2YXIgb2Zmc2V0ID0gX3JlZjtcbiAgICB2YXIgcmVsYXRpdmVYID0gcGFnZS54IC0gb2Zmc2V0Lng7XG4gICAgdmFyIHJlbGF0aXZlWSA9IHBhZ2UueSAtIG9mZnNldC55O1xuXG4gICAgZm9yICh2YXIgaW5kZXggPSAwLCBfbGVuID0gb3B0aW9ucy50YXJnZXRzLmxlbmd0aDsgaW5kZXggPCBfbGVuOyBpbmRleCsrKSB7XG4gICAgICB2YXIgc25hcFRhcmdldCA9IG9wdGlvbnMudGFyZ2V0c1tpbmRleF07XG5cbiAgICAgIGlmICh1dGlscy5pcy5mdW5jKHNuYXBUYXJnZXQpKSB7XG4gICAgICAgIHRhcmdldCA9IHNuYXBUYXJnZXQocmVsYXRpdmVYLCByZWxhdGl2ZVksIGludGVyYWN0aW9uLCBvZmZzZXQsIGluZGV4KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldCA9IHNuYXBUYXJnZXQ7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB0YXJnZXRzLnB1c2goe1xuICAgICAgICB4OiAodXRpbHMuaXMubnVtYmVyKHRhcmdldC54KSA/IHRhcmdldC54IDogcmVsYXRpdmVYKSArIG9mZnNldC54LFxuICAgICAgICB5OiAodXRpbHMuaXMubnVtYmVyKHRhcmdldC55KSA/IHRhcmdldC55IDogcmVsYXRpdmVZKSArIG9mZnNldC55LFxuICAgICAgICByYW5nZTogdXRpbHMuaXMubnVtYmVyKHRhcmdldC5yYW5nZSkgPyB0YXJnZXQucmFuZ2UgOiBvcHRpb25zLnJhbmdlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICB2YXIgY2xvc2VzdCA9IHtcbiAgICB0YXJnZXQ6IG51bGwsXG4gICAgaW5SYW5nZTogZmFsc2UsXG4gICAgZGlzdGFuY2U6IDAsXG4gICAgcmFuZ2U6IDAsXG4gICAgZHg6IDAsXG4gICAgZHk6IDBcbiAgfTtcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGFyZ2V0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIHRhcmdldCA9IHRhcmdldHNbaV07XG4gICAgdmFyIHJhbmdlID0gdGFyZ2V0LnJhbmdlO1xuICAgIHZhciBkeCA9IHRhcmdldC54IC0gcGFnZS54O1xuICAgIHZhciBkeSA9IHRhcmdldC55IC0gcGFnZS55O1xuICAgIHZhciBkaXN0YW5jZSA9IHV0aWxzLmh5cG90KGR4LCBkeSk7XG4gICAgdmFyIGluUmFuZ2UgPSBkaXN0YW5jZSA8PSByYW5nZTsgLy8gSW5maW5pdGUgdGFyZ2V0cyBjb3VudCBhcyBiZWluZyBvdXQgb2YgcmFuZ2VcbiAgICAvLyBjb21wYXJlZCB0byBub24gaW5maW5pdGUgb25lcyB0aGF0IGFyZSBpbiByYW5nZVxuXG4gICAgaWYgKHJhbmdlID09PSBJbmZpbml0eSAmJiBjbG9zZXN0LmluUmFuZ2UgJiYgY2xvc2VzdC5yYW5nZSAhPT0gSW5maW5pdHkpIHtcbiAgICAgIGluUmFuZ2UgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIWNsb3Nlc3QudGFyZ2V0IHx8IChpblJhbmdlIC8vIGlzIHRoZSBjbG9zZXN0IHRhcmdldCBpbiByYW5nZT9cbiAgICA/IGNsb3Nlc3QuaW5SYW5nZSAmJiByYW5nZSAhPT0gSW5maW5pdHkgLy8gdGhlIHBvaW50ZXIgaXMgcmVsYXRpdmVseSBkZWVwZXIgaW4gdGhpcyB0YXJnZXRcbiAgICA/IGRpc3RhbmNlIC8gcmFuZ2UgPCBjbG9zZXN0LmRpc3RhbmNlIC8gY2xvc2VzdC5yYW5nZSAvLyB0aGlzIHRhcmdldCBoYXMgSW5maW5pdGUgcmFuZ2UgYW5kIHRoZSBjbG9zZXN0IGRvZXNuJ3RcbiAgICA6IHJhbmdlID09PSBJbmZpbml0eSAmJiBjbG9zZXN0LnJhbmdlICE9PSBJbmZpbml0eSB8fCAvLyBPUiB0aGlzIHRhcmdldCBpcyBjbG9zZXIgdGhhdCB0aGUgcHJldmlvdXMgY2xvc2VzdFxuICAgIGRpc3RhbmNlIDwgY2xvc2VzdC5kaXN0YW5jZSA6IC8vIFRoZSBvdGhlciBpcyBub3QgaW4gcmFuZ2UgYW5kIHRoZSBwb2ludGVyIGlzIGNsb3NlciB0byB0aGlzIHRhcmdldFxuICAgICFjbG9zZXN0LmluUmFuZ2UgJiYgZGlzdGFuY2UgPCBjbG9zZXN0LmRpc3RhbmNlKSkge1xuICAgICAgY2xvc2VzdC50YXJnZXQgPSB0YXJnZXQ7XG4gICAgICBjbG9zZXN0LmRpc3RhbmNlID0gZGlzdGFuY2U7XG4gICAgICBjbG9zZXN0LnJhbmdlID0gcmFuZ2U7XG4gICAgICBjbG9zZXN0LmluUmFuZ2UgPSBpblJhbmdlO1xuICAgICAgY2xvc2VzdC5keCA9IGR4O1xuICAgICAgY2xvc2VzdC5keSA9IGR5O1xuICAgICAgc3RhdGUucmFuZ2UgPSByYW5nZTtcbiAgICB9XG4gIH1cblxuICBpZiAoY2xvc2VzdC5pblJhbmdlKSB7XG4gICAgY29vcmRzLnggPSBjbG9zZXN0LnRhcmdldC54O1xuICAgIGNvb3Jkcy55ID0gY2xvc2VzdC50YXJnZXQueTtcbiAgfVxuXG4gIHN0YXRlLmNsb3Nlc3QgPSBjbG9zZXN0O1xufVxuXG5mdW5jdGlvbiBnZXRPcmlnaW4oYXJnKSB7XG4gIHZhciBvcHRpb25zT3JpZ2luID0gdXRpbHMucmVjdC5yZWN0VG9YWSh1dGlscy5yZWN0LnJlc29sdmVSZWN0TGlrZShhcmcuc3RhdGUub3B0aW9ucy5vcmlnaW4pKTtcbiAgdmFyIG9yaWdpbiA9IG9wdGlvbnNPcmlnaW4gfHwgdXRpbHMuZ2V0T3JpZ2luWFkoYXJnLmludGVyYWN0YWJsZSwgYXJnLmludGVyYWN0aW9uLmVsZW1lbnQsIGFyZy5pbnRlcmFjdGlvbi5wcmVwYXJlZC5uYW1lKTtcbiAgcmV0dXJuIG9yaWdpbjtcbn1cblxudmFyIHNuYXAgPSB7XG4gIHN0YXJ0OiBzdGFydCxcbiAgc2V0OiBzZXQsXG4gIGRlZmF1bHRzOiB7XG4gICAgZW5hYmxlZDogZmFsc2UsXG4gICAgcmFuZ2U6IEluZmluaXR5LFxuICAgIHRhcmdldHM6IG51bGwsXG4gICAgb2Zmc2V0OiBudWxsLFxuICAgIG9mZnNldFdpdGhPcmlnaW46IHRydWUsXG4gICAgcmVsYXRpdmVQb2ludHM6IG51bGxcbiAgfVxufTtcbnZhciBfZGVmYXVsdCA9IHNuYXA7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0O1xuXG59LHtcIkBpbnRlcmFjdGpzL3V0aWxzXCI6NTV9XSwzNzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX2V4dGVuZCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIkBpbnRlcmFjdGpzL3V0aWxzL2V4dGVuZFwiKSk7XG5cbnZhciBpcyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy91dGlscy9pc1wiKSk7XG5cbnZhciBfcG9pbnRlciA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vcG9pbnRlclwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHsgdmFyIGRlc2MgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkgJiYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBrZXkpIDoge307IGlmIChkZXNjLmdldCB8fCBkZXNjLnNldCkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkobmV3T2JqLCBrZXksIGRlc2MpOyB9IGVsc2UgeyBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gfSB9IG5ld09ialtcImRlZmF1bHRcIl0gPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gX3NsaWNlZFRvQXJyYXkoYXJyLCBpKSB7IHJldHVybiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB8fCBfbm9uSXRlcmFibGVSZXN0KCk7IH1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlUmVzdCgpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2VcIik7IH1cblxuZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkgeyB2YXIgX2FyciA9IFtdOyB2YXIgX24gPSB0cnVlOyB2YXIgX2QgPSBmYWxzZTsgdmFyIF9lID0gdW5kZWZpbmVkOyB0cnkgeyBmb3IgKHZhciBfaSA9IGFycltTeW1ib2wuaXRlcmF0b3JdKCksIF9zOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7IF9hcnIucHVzaChfcy52YWx1ZSk7IGlmIChpICYmIF9hcnIubGVuZ3RoID09PSBpKSBicmVhazsgfSB9IGNhdGNoIChlcnIpIHsgX2QgPSB0cnVlOyBfZSA9IGVycjsgfSBmaW5hbGx5IHsgdHJ5IHsgaWYgKCFfbiAmJiBfaVtcInJldHVyblwiXSAhPSBudWxsKSBfaVtcInJldHVyblwiXSgpOyB9IGZpbmFsbHkgeyBpZiAoX2QpIHRocm93IF9lOyB9IH0gcmV0dXJuIF9hcnI7IH1cblxuZnVuY3Rpb24gX2FycmF5V2l0aEhvbGVzKGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gYXJyOyB9XG5cbmZ1bmN0aW9uIHN0YXJ0KGFyZykge1xuICB2YXIgaW50ZXJhY3Rpb24gPSBhcmcuaW50ZXJhY3Rpb24sXG4gICAgICBzdGF0ZSA9IGFyZy5zdGF0ZTtcbiAgdmFyIG9wdGlvbnMgPSBzdGF0ZS5vcHRpb25zO1xuICB2YXIgZWRnZXMgPSBpbnRlcmFjdGlvbi5wcmVwYXJlZC5lZGdlcztcblxuICBpZiAoIWVkZ2VzKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBhcmcuc3RhdGUgPSB7XG4gICAgb3B0aW9uczoge1xuICAgICAgcmVsYXRpdmVQb2ludHM6IFt7XG4gICAgICAgIHg6IGVkZ2VzLmxlZnQgPyAwIDogMSxcbiAgICAgICAgeTogZWRnZXMudG9wID8gMCA6IDFcbiAgICAgIH1dLFxuICAgICAgb3JpZ2luOiB7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IDBcbiAgICAgIH0sXG4gICAgICBvZmZzZXQ6IG9wdGlvbnMub2Zmc2V0IHx8ICdzZWxmJyxcbiAgICAgIHJhbmdlOiBvcHRpb25zLnJhbmdlXG4gICAgfVxuICB9O1xuICBzdGF0ZS50YXJnZXRGaWVsZHMgPSBzdGF0ZS50YXJnZXRGaWVsZHMgfHwgW1snd2lkdGgnLCAnaGVpZ2h0J10sIFsneCcsICd5J11dO1xuXG4gIF9wb2ludGVyW1wiZGVmYXVsdFwiXS5zdGFydChhcmcpO1xuXG4gIHN0YXRlLm9mZnNldHMgPSBhcmcuc3RhdGUub2Zmc2V0cztcbiAgYXJnLnN0YXRlID0gc3RhdGU7XG59XG5cbmZ1bmN0aW9uIHNldChhcmcpIHtcbiAgdmFyIGludGVyYWN0aW9uID0gYXJnLmludGVyYWN0aW9uLFxuICAgICAgc3RhdGUgPSBhcmcuc3RhdGUsXG4gICAgICBjb29yZHMgPSBhcmcuY29vcmRzO1xuICB2YXIgb3B0aW9ucyA9IHN0YXRlLm9wdGlvbnMsXG4gICAgICBvZmZzZXRzID0gc3RhdGUub2Zmc2V0cztcbiAgdmFyIHJlbGF0aXZlID0ge1xuICAgIHg6IGNvb3Jkcy54IC0gb2Zmc2V0c1swXS54LFxuICAgIHk6IGNvb3Jkcy55IC0gb2Zmc2V0c1swXS55XG4gIH07XG4gIHN0YXRlLm9wdGlvbnMgPSAoMCwgX2V4dGVuZFtcImRlZmF1bHRcIl0pKHt9LCBvcHRpb25zKTtcbiAgc3RhdGUub3B0aW9ucy50YXJnZXRzID0gW107XG5cbiAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IChvcHRpb25zLnRhcmdldHMgfHwgW10pLmxlbmd0aDsgX2krKykge1xuICAgIHZhciBfcmVmO1xuXG4gICAgX3JlZiA9IChvcHRpb25zLnRhcmdldHMgfHwgW10pW19pXTtcbiAgICB2YXIgc25hcFRhcmdldCA9IF9yZWY7XG4gICAgdmFyIHRhcmdldCA9IHZvaWQgMDtcblxuICAgIGlmIChpcy5mdW5jKHNuYXBUYXJnZXQpKSB7XG4gICAgICB0YXJnZXQgPSBzbmFwVGFyZ2V0KHJlbGF0aXZlLngsIHJlbGF0aXZlLnksIGludGVyYWN0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0ID0gc25hcFRhcmdldDtcbiAgICB9XG5cbiAgICBpZiAoIXRhcmdldCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgX2kyID0gMDsgX2kyIDwgc3RhdGUudGFyZ2V0RmllbGRzLmxlbmd0aDsgX2kyKyspIHtcbiAgICAgIHZhciBfcmVmMjtcblxuICAgICAgX3JlZjIgPSBzdGF0ZS50YXJnZXRGaWVsZHNbX2kyXTtcblxuICAgICAgdmFyIF9yZWYzID0gX3JlZjIsXG4gICAgICAgICAgX3JlZjQgPSBfc2xpY2VkVG9BcnJheShfcmVmMywgMiksXG4gICAgICAgICAgeEZpZWxkID0gX3JlZjRbMF0sXG4gICAgICAgICAgeUZpZWxkID0gX3JlZjRbMV07XG5cbiAgICAgIGlmICh4RmllbGQgaW4gdGFyZ2V0IHx8IHlGaWVsZCBpbiB0YXJnZXQpIHtcbiAgICAgICAgdGFyZ2V0LnggPSB0YXJnZXRbeEZpZWxkXTtcbiAgICAgICAgdGFyZ2V0LnkgPSB0YXJnZXRbeUZpZWxkXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGUub3B0aW9ucy50YXJnZXRzLnB1c2godGFyZ2V0KTtcbiAgfVxuXG4gIF9wb2ludGVyW1wiZGVmYXVsdFwiXS5zZXQoYXJnKTtcblxuICBzdGF0ZS5vcHRpb25zID0gb3B0aW9ucztcbn1cblxudmFyIHNuYXBTaXplID0ge1xuICBzdGFydDogc3RhcnQsXG4gIHNldDogc2V0LFxuICBkZWZhdWx0czoge1xuICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgIHJhbmdlOiBJbmZpbml0eSxcbiAgICB0YXJnZXRzOiBudWxsLFxuICAgIG9mZnNldDogbnVsbFxuICB9XG59O1xudmFyIF9kZWZhdWx0ID0gc25hcFNpemU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0O1xuXG59LHtcIi4vcG9pbnRlclwiOjM2LFwiQGludGVyYWN0anMvdXRpbHMvZXh0ZW5kXCI6NTIsXCJAaW50ZXJhY3Rqcy91dGlscy9pc1wiOjU2fV0sMzg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF9CYXNlRXZlbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiQGludGVyYWN0anMvY29yZS9CYXNlRXZlbnRcIikpO1xuXG52YXIgX3BvaW50ZXJVdGlscyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIkBpbnRlcmFjdGpzL3V0aWxzL3BvaW50ZXJVdGlsc1wiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKGNhbGwgJiYgKF90eXBlb2YoY2FsbCkgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikpIHsgcmV0dXJuIGNhbGw7IH0gcmV0dXJuIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZik7IH1cblxuZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgX2dldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTsgfTsgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTsgfVxuXG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHsgaWYgKHNlbGYgPT09IHZvaWQgMCkgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIHNlbGY7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7IH1cblxuZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IG8uX19wcm90b19fID0gcDsgcmV0dXJuIG87IH07IHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7IH1cblxuLyoqICovXG52YXIgUG9pbnRlckV2ZW50ID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfQmFzZUV2ZW50KSB7XG4gIF9pbmhlcml0cyhQb2ludGVyRXZlbnQsIF9CYXNlRXZlbnQpO1xuXG4gIC8qKiAqL1xuICBmdW5jdGlvbiBQb2ludGVyRXZlbnQodHlwZSwgcG9pbnRlciwgZXZlbnQsIGV2ZW50VGFyZ2V0LCBpbnRlcmFjdGlvbiwgdGltZVN0YW1wKSB7XG4gICAgdmFyIF90aGlzO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFBvaW50ZXJFdmVudCk7XG5cbiAgICBfdGhpcyA9IF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihQb2ludGVyRXZlbnQpLmNhbGwodGhpcywgaW50ZXJhY3Rpb24pKTtcblxuICAgIF9wb2ludGVyVXRpbHNbXCJkZWZhdWx0XCJdLnBvaW50ZXJFeHRlbmQoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIGV2ZW50KTtcblxuICAgIGlmIChldmVudCAhPT0gcG9pbnRlcikge1xuICAgICAgX3BvaW50ZXJVdGlsc1tcImRlZmF1bHRcIl0ucG9pbnRlckV4dGVuZChfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgcG9pbnRlcik7XG4gICAgfVxuXG4gICAgX3RoaXMudGltZVN0YW1wID0gdGltZVN0YW1wO1xuICAgIF90aGlzLm9yaWdpbmFsRXZlbnQgPSBldmVudDtcbiAgICBfdGhpcy50eXBlID0gdHlwZTtcbiAgICBfdGhpcy5wb2ludGVySWQgPSBfcG9pbnRlclV0aWxzW1wiZGVmYXVsdFwiXS5nZXRQb2ludGVySWQocG9pbnRlcik7XG4gICAgX3RoaXMucG9pbnRlclR5cGUgPSBfcG9pbnRlclV0aWxzW1wiZGVmYXVsdFwiXS5nZXRQb2ludGVyVHlwZShwb2ludGVyKTtcbiAgICBfdGhpcy50YXJnZXQgPSBldmVudFRhcmdldDtcbiAgICBfdGhpcy5jdXJyZW50VGFyZ2V0ID0gbnVsbDtcblxuICAgIGlmICh0eXBlID09PSAndGFwJykge1xuICAgICAgdmFyIHBvaW50ZXJJbmRleCA9IGludGVyYWN0aW9uLmdldFBvaW50ZXJJbmRleChwb2ludGVyKTtcbiAgICAgIF90aGlzLmR0ID0gX3RoaXMudGltZVN0YW1wIC0gaW50ZXJhY3Rpb24ucG9pbnRlcnNbcG9pbnRlckluZGV4XS5kb3duVGltZTtcbiAgICAgIHZhciBpbnRlcnZhbCA9IF90aGlzLnRpbWVTdGFtcCAtIGludGVyYWN0aW9uLnRhcFRpbWU7XG4gICAgICBfdGhpc1tcImRvdWJsZVwiXSA9ICEhKGludGVyYWN0aW9uLnByZXZUYXAgJiYgaW50ZXJhY3Rpb24ucHJldlRhcC50eXBlICE9PSAnZG91YmxldGFwJyAmJiBpbnRlcmFjdGlvbi5wcmV2VGFwLnRhcmdldCA9PT0gX3RoaXMudGFyZ2V0ICYmIGludGVydmFsIDwgNTAwKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdkb3VibGV0YXAnKSB7XG4gICAgICBfdGhpcy5kdCA9IHBvaW50ZXIudGltZVN0YW1wIC0gaW50ZXJhY3Rpb24udGFwVGltZTtcbiAgICB9XG5cbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoUG9pbnRlckV2ZW50LCBbe1xuICAgIGtleTogXCJfc3VidHJhY3RPcmlnaW5cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX3N1YnRyYWN0T3JpZ2luKF9yZWYpIHtcbiAgICAgIHZhciBvcmlnaW5YID0gX3JlZi54LFxuICAgICAgICAgIG9yaWdpblkgPSBfcmVmLnk7XG4gICAgICB0aGlzLnBhZ2VYIC09IG9yaWdpblg7XG4gICAgICB0aGlzLnBhZ2VZIC09IG9yaWdpblk7XG4gICAgICB0aGlzLmNsaWVudFggLT0gb3JpZ2luWDtcbiAgICAgIHRoaXMuY2xpZW50WSAtPSBvcmlnaW5ZO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIl9hZGRPcmlnaW5cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2FkZE9yaWdpbihfcmVmMikge1xuICAgICAgdmFyIG9yaWdpblggPSBfcmVmMi54LFxuICAgICAgICAgIG9yaWdpblkgPSBfcmVmMi55O1xuICAgICAgdGhpcy5wYWdlWCArPSBvcmlnaW5YO1xuICAgICAgdGhpcy5wYWdlWSArPSBvcmlnaW5ZO1xuICAgICAgdGhpcy5jbGllbnRYICs9IG9yaWdpblg7XG4gICAgICB0aGlzLmNsaWVudFkgKz0gb3JpZ2luWTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQcmV2ZW50IHRoZSBkZWZhdWx0IGJlaGF2aW91ciBvZiB0aGUgb3JpZ2luYWwgRXZlbnRcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcInByZXZlbnREZWZhdWx0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHByZXZlbnREZWZhdWx0KCkge1xuICAgICAgdGhpcy5vcmlnaW5hbEV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFBvaW50ZXJFdmVudDtcbn0oX0Jhc2VFdmVudDJbXCJkZWZhdWx0XCJdKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBQb2ludGVyRXZlbnQ7XG5cbn0se1wiQGludGVyYWN0anMvY29yZS9CYXNlRXZlbnRcIjoxMyxcIkBpbnRlcmFjdGpzL3V0aWxzL3BvaW50ZXJVdGlsc1wiOjYwfV0sMzk6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIHV0aWxzID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQocmVxdWlyZShcIkBpbnRlcmFjdGpzL3V0aWxzXCIpKTtcblxudmFyIF9Qb2ludGVyRXZlbnQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL1BvaW50ZXJFdmVudFwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7IHZhciBkZXNjID0gT2JqZWN0LmRlZmluZVByb3BlcnR5ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KSA6IHt9OyBpZiAoZGVzYy5nZXQgfHwgZGVzYy5zZXQpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5ld09iaiwga2V5LCBkZXNjKTsgfSBlbHNlIHsgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IH0gfSBuZXdPYmpbXCJkZWZhdWx0XCJdID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblxudmFyIHNpZ25hbHMgPSBuZXcgdXRpbHMuU2lnbmFscygpO1xudmFyIHNpbXBsZVNpZ25hbHMgPSBbJ2Rvd24nLCAndXAnLCAnY2FuY2VsJ107XG52YXIgc2ltcGxlRXZlbnRzID0gWydkb3duJywgJ3VwJywgJ2NhbmNlbCddO1xudmFyIGRlZmF1bHRzID0ge1xuICBob2xkRHVyYXRpb246IDYwMCxcbiAgaWdub3JlRnJvbTogbnVsbCxcbiAgYWxsb3dGcm9tOiBudWxsLFxuICBvcmlnaW46IHtcbiAgICB4OiAwLFxuICAgIHk6IDBcbiAgfVxufTtcbnZhciBwb2ludGVyRXZlbnRzID0ge1xuICBpZDogJ3BvaW50ZXItZXZlbnRzL2Jhc2UnLFxuICBpbnN0YWxsOiBpbnN0YWxsLFxuICBzaWduYWxzOiBzaWduYWxzLFxuICBQb2ludGVyRXZlbnQ6IF9Qb2ludGVyRXZlbnRbXCJkZWZhdWx0XCJdLFxuICBmaXJlOiBmaXJlLFxuICBjb2xsZWN0RXZlbnRUYXJnZXRzOiBjb2xsZWN0RXZlbnRUYXJnZXRzLFxuICBjcmVhdGVTaWduYWxMaXN0ZW5lcjogY3JlYXRlU2lnbmFsTGlzdGVuZXIsXG4gIGRlZmF1bHRzOiBkZWZhdWx0cyxcbiAgdHlwZXM6IFsnZG93bicsICdtb3ZlJywgJ3VwJywgJ2NhbmNlbCcsICd0YXAnLCAnZG91YmxldGFwJywgJ2hvbGQnXVxufTtcblxuZnVuY3Rpb24gZmlyZShhcmcsIHNjb3BlKSB7XG4gIHZhciBpbnRlcmFjdGlvbiA9IGFyZy5pbnRlcmFjdGlvbixcbiAgICAgIHBvaW50ZXIgPSBhcmcucG9pbnRlcixcbiAgICAgIGV2ZW50ID0gYXJnLmV2ZW50LFxuICAgICAgZXZlbnRUYXJnZXQgPSBhcmcuZXZlbnRUYXJnZXQsXG4gICAgICBfYXJnJHR5cGUgPSBhcmcudHlwZSxcbiAgICAgIHR5cGUgPSBfYXJnJHR5cGUgPT09IHZvaWQgMCA/IGFyZy5wb2ludGVyRXZlbnQudHlwZSA6IF9hcmckdHlwZSxcbiAgICAgIF9hcmckdGFyZ2V0cyA9IGFyZy50YXJnZXRzLFxuICAgICAgdGFyZ2V0cyA9IF9hcmckdGFyZ2V0cyA9PT0gdm9pZCAwID8gY29sbGVjdEV2ZW50VGFyZ2V0cyhhcmcpIDogX2FyZyR0YXJnZXRzO1xuICB2YXIgX2FyZyRwb2ludGVyRXZlbnQgPSBhcmcucG9pbnRlckV2ZW50LFxuICAgICAgcG9pbnRlckV2ZW50ID0gX2FyZyRwb2ludGVyRXZlbnQgPT09IHZvaWQgMCA/IG5ldyBfUG9pbnRlckV2ZW50W1wiZGVmYXVsdFwiXSh0eXBlLCBwb2ludGVyLCBldmVudCwgZXZlbnRUYXJnZXQsIGludGVyYWN0aW9uLCBzY29wZS5ub3coKSkgOiBfYXJnJHBvaW50ZXJFdmVudDtcbiAgdmFyIHNpZ25hbEFyZyA9IHtcbiAgICBpbnRlcmFjdGlvbjogaW50ZXJhY3Rpb24sXG4gICAgcG9pbnRlcjogcG9pbnRlcixcbiAgICBldmVudDogZXZlbnQsXG4gICAgZXZlbnRUYXJnZXQ6IGV2ZW50VGFyZ2V0LFxuICAgIHRhcmdldHM6IHRhcmdldHMsXG4gICAgdHlwZTogdHlwZSxcbiAgICBwb2ludGVyRXZlbnQ6IHBvaW50ZXJFdmVudFxuICB9O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGFyZ2V0cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciB0YXJnZXQgPSB0YXJnZXRzW2ldO1xuXG4gICAgZm9yICh2YXIgcHJvcCBpbiB0YXJnZXQucHJvcHMgfHwge30pIHtcbiAgICAgIHBvaW50ZXJFdmVudFtwcm9wXSA9IHRhcmdldC5wcm9wc1twcm9wXTtcbiAgICB9XG5cbiAgICB2YXIgb3JpZ2luID0gdXRpbHMuZ2V0T3JpZ2luWFkodGFyZ2V0LmV2ZW50YWJsZSwgdGFyZ2V0LmVsZW1lbnQpO1xuXG4gICAgcG9pbnRlckV2ZW50Ll9zdWJ0cmFjdE9yaWdpbihvcmlnaW4pO1xuXG4gICAgcG9pbnRlckV2ZW50LmV2ZW50YWJsZSA9IHRhcmdldC5ldmVudGFibGU7XG4gICAgcG9pbnRlckV2ZW50LmN1cnJlbnRUYXJnZXQgPSB0YXJnZXQuZWxlbWVudDtcbiAgICB0YXJnZXQuZXZlbnRhYmxlLmZpcmUocG9pbnRlckV2ZW50KTtcblxuICAgIHBvaW50ZXJFdmVudC5fYWRkT3JpZ2luKG9yaWdpbik7XG5cbiAgICBpZiAocG9pbnRlckV2ZW50LmltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZCB8fCBwb2ludGVyRXZlbnQucHJvcGFnYXRpb25TdG9wcGVkICYmIGkgKyAxIDwgdGFyZ2V0cy5sZW5ndGggJiYgdGFyZ2V0c1tpICsgMV0uZWxlbWVudCAhPT0gcG9pbnRlckV2ZW50LmN1cnJlbnRUYXJnZXQpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHNpZ25hbHMuZmlyZSgnZmlyZWQnLCBzaWduYWxBcmcpO1xuXG4gIGlmICh0eXBlID09PSAndGFwJykge1xuICAgIC8vIGlmIHBvaW50ZXJFdmVudCBzaG91bGQgbWFrZSBhIGRvdWJsZSB0YXAsIGNyZWF0ZSBhbmQgZmlyZSBhIGRvdWJsZXRhcFxuICAgIC8vIFBvaW50ZXJFdmVudCBhbmQgdXNlIHRoYXQgYXMgdGhlIHByZXZUYXBcbiAgICB2YXIgcHJldlRhcCA9IHBvaW50ZXJFdmVudFtcImRvdWJsZVwiXSA/IGZpcmUoe1xuICAgICAgaW50ZXJhY3Rpb246IGludGVyYWN0aW9uLFxuICAgICAgcG9pbnRlcjogcG9pbnRlcixcbiAgICAgIGV2ZW50OiBldmVudCxcbiAgICAgIGV2ZW50VGFyZ2V0OiBldmVudFRhcmdldCxcbiAgICAgIHR5cGU6ICdkb3VibGV0YXAnXG4gICAgfSwgc2NvcGUpIDogcG9pbnRlckV2ZW50O1xuICAgIGludGVyYWN0aW9uLnByZXZUYXAgPSBwcmV2VGFwO1xuICAgIGludGVyYWN0aW9uLnRhcFRpbWUgPSBwcmV2VGFwLnRpbWVTdGFtcDtcbiAgfVxuXG4gIHJldHVybiBwb2ludGVyRXZlbnQ7XG59XG5cbmZ1bmN0aW9uIGNvbGxlY3RFdmVudFRhcmdldHMoX3JlZikge1xuICB2YXIgaW50ZXJhY3Rpb24gPSBfcmVmLmludGVyYWN0aW9uLFxuICAgICAgcG9pbnRlciA9IF9yZWYucG9pbnRlcixcbiAgICAgIGV2ZW50ID0gX3JlZi5ldmVudCxcbiAgICAgIGV2ZW50VGFyZ2V0ID0gX3JlZi5ldmVudFRhcmdldCxcbiAgICAgIHR5cGUgPSBfcmVmLnR5cGU7XG4gIHZhciBwb2ludGVySW5kZXggPSBpbnRlcmFjdGlvbi5nZXRQb2ludGVySW5kZXgocG9pbnRlcik7XG4gIHZhciBwb2ludGVySW5mbyA9IGludGVyYWN0aW9uLnBvaW50ZXJzW3BvaW50ZXJJbmRleF07IC8vIGRvIG5vdCBmaXJlIGEgdGFwIGV2ZW50IGlmIHRoZSBwb2ludGVyIHdhcyBtb3ZlZCBiZWZvcmUgYmVpbmcgbGlmdGVkXG5cbiAgaWYgKHR5cGUgPT09ICd0YXAnICYmIChpbnRlcmFjdGlvbi5wb2ludGVyV2FzTW92ZWQgfHwgLy8gb3IgaWYgdGhlIHBvaW50ZXJ1cCB0YXJnZXQgaXMgZGlmZmVyZW50IHRvIHRoZSBwb2ludGVyZG93biB0YXJnZXRcbiAgIShwb2ludGVySW5mbyAmJiBwb2ludGVySW5mby5kb3duVGFyZ2V0ID09PSBldmVudFRhcmdldCkpKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgdmFyIHBhdGggPSB1dGlscy5kb20uZ2V0UGF0aChldmVudFRhcmdldCk7XG4gIHZhciBzaWduYWxBcmcgPSB7XG4gICAgaW50ZXJhY3Rpb246IGludGVyYWN0aW9uLFxuICAgIHBvaW50ZXI6IHBvaW50ZXIsXG4gICAgZXZlbnQ6IGV2ZW50LFxuICAgIGV2ZW50VGFyZ2V0OiBldmVudFRhcmdldCxcbiAgICB0eXBlOiB0eXBlLFxuICAgIHBhdGg6IHBhdGgsXG4gICAgdGFyZ2V0czogW10sXG4gICAgZWxlbWVudDogbnVsbFxuICB9O1xuXG4gIGZvciAodmFyIF9pID0gMDsgX2kgPCBwYXRoLmxlbmd0aDsgX2krKykge1xuICAgIHZhciBfcmVmMjtcblxuICAgIF9yZWYyID0gcGF0aFtfaV07XG4gICAgdmFyIGVsZW1lbnQgPSBfcmVmMjtcbiAgICBzaWduYWxBcmcuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgc2lnbmFscy5maXJlKCdjb2xsZWN0LXRhcmdldHMnLCBzaWduYWxBcmcpO1xuICB9XG5cbiAgaWYgKHR5cGUgPT09ICdob2xkJykge1xuICAgIHNpZ25hbEFyZy50YXJnZXRzID0gc2lnbmFsQXJnLnRhcmdldHMuZmlsdGVyKGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgIHJldHVybiB0YXJnZXQuZXZlbnRhYmxlLm9wdGlvbnMuaG9sZER1cmF0aW9uID09PSBpbnRlcmFjdGlvbi5wb2ludGVyc1twb2ludGVySW5kZXhdLmhvbGQuZHVyYXRpb247XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gc2lnbmFsQXJnLnRhcmdldHM7XG59XG5cbmZ1bmN0aW9uIGluc3RhbGwoc2NvcGUpIHtcbiAgdmFyIGludGVyYWN0aW9ucyA9IHNjb3BlLmludGVyYWN0aW9ucztcbiAgc2NvcGUucG9pbnRlckV2ZW50cyA9IHBvaW50ZXJFdmVudHM7XG4gIHNjb3BlLmRlZmF1bHRzLmFjdGlvbnMucG9pbnRlckV2ZW50cyA9IHBvaW50ZXJFdmVudHMuZGVmYXVsdHM7XG4gIGludGVyYWN0aW9ucy5zaWduYWxzLm9uKCduZXcnLCBmdW5jdGlvbiAoX3JlZjMpIHtcbiAgICB2YXIgaW50ZXJhY3Rpb24gPSBfcmVmMy5pbnRlcmFjdGlvbjtcbiAgICBpbnRlcmFjdGlvbi5wcmV2VGFwID0gbnVsbDsgLy8gdGhlIG1vc3QgcmVjZW50IHRhcCBldmVudCBvbiB0aGlzIGludGVyYWN0aW9uXG5cbiAgICBpbnRlcmFjdGlvbi50YXBUaW1lID0gMDsgLy8gdGltZSBvZiB0aGUgbW9zdCByZWNlbnQgdGFwIGV2ZW50XG4gIH0pO1xuICBpbnRlcmFjdGlvbnMuc2lnbmFscy5vbigndXBkYXRlLXBvaW50ZXInLCBmdW5jdGlvbiAoX3JlZjQpIHtcbiAgICB2YXIgZG93biA9IF9yZWY0LmRvd24sXG4gICAgICAgIHBvaW50ZXJJbmZvID0gX3JlZjQucG9pbnRlckluZm87XG5cbiAgICBpZiAoIWRvd24gJiYgcG9pbnRlckluZm8uaG9sZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHBvaW50ZXJJbmZvLmhvbGQgPSB7XG4gICAgICBkdXJhdGlvbjogSW5maW5pdHksXG4gICAgICB0aW1lb3V0OiBudWxsXG4gICAgfTtcbiAgfSk7XG4gIGludGVyYWN0aW9ucy5zaWduYWxzLm9uKCdtb3ZlJywgZnVuY3Rpb24gKF9yZWY1KSB7XG4gICAgdmFyIGludGVyYWN0aW9uID0gX3JlZjUuaW50ZXJhY3Rpb24sXG4gICAgICAgIHBvaW50ZXIgPSBfcmVmNS5wb2ludGVyLFxuICAgICAgICBldmVudCA9IF9yZWY1LmV2ZW50LFxuICAgICAgICBldmVudFRhcmdldCA9IF9yZWY1LmV2ZW50VGFyZ2V0LFxuICAgICAgICBkdXBsaWNhdGVNb3ZlID0gX3JlZjUuZHVwbGljYXRlTW92ZTtcbiAgICB2YXIgcG9pbnRlckluZGV4ID0gaW50ZXJhY3Rpb24uZ2V0UG9pbnRlckluZGV4KHBvaW50ZXIpO1xuXG4gICAgaWYgKCFkdXBsaWNhdGVNb3ZlICYmICghaW50ZXJhY3Rpb24ucG9pbnRlcklzRG93biB8fCBpbnRlcmFjdGlvbi5wb2ludGVyV2FzTW92ZWQpKSB7XG4gICAgICBpZiAoaW50ZXJhY3Rpb24ucG9pbnRlcklzRG93bikge1xuICAgICAgICBjbGVhclRpbWVvdXQoaW50ZXJhY3Rpb24ucG9pbnRlcnNbcG9pbnRlckluZGV4XS5ob2xkLnRpbWVvdXQpO1xuICAgICAgfVxuXG4gICAgICBmaXJlKHtcbiAgICAgICAgaW50ZXJhY3Rpb246IGludGVyYWN0aW9uLFxuICAgICAgICBwb2ludGVyOiBwb2ludGVyLFxuICAgICAgICBldmVudDogZXZlbnQsXG4gICAgICAgIGV2ZW50VGFyZ2V0OiBldmVudFRhcmdldCxcbiAgICAgICAgdHlwZTogJ21vdmUnXG4gICAgICB9LCBzY29wZSk7XG4gICAgfVxuICB9KTtcbiAgaW50ZXJhY3Rpb25zLnNpZ25hbHMub24oJ2Rvd24nLCBmdW5jdGlvbiAoX3JlZjYpIHtcbiAgICB2YXIgaW50ZXJhY3Rpb24gPSBfcmVmNi5pbnRlcmFjdGlvbixcbiAgICAgICAgcG9pbnRlciA9IF9yZWY2LnBvaW50ZXIsXG4gICAgICAgIGV2ZW50ID0gX3JlZjYuZXZlbnQsXG4gICAgICAgIGV2ZW50VGFyZ2V0ID0gX3JlZjYuZXZlbnRUYXJnZXQsXG4gICAgICAgIHBvaW50ZXJJbmRleCA9IF9yZWY2LnBvaW50ZXJJbmRleDtcbiAgICB2YXIgdGltZXIgPSBpbnRlcmFjdGlvbi5wb2ludGVyc1twb2ludGVySW5kZXhdLmhvbGQ7XG4gICAgdmFyIHBhdGggPSB1dGlscy5kb20uZ2V0UGF0aChldmVudFRhcmdldCk7XG4gICAgdmFyIHNpZ25hbEFyZyA9IHtcbiAgICAgIGludGVyYWN0aW9uOiBpbnRlcmFjdGlvbixcbiAgICAgIHBvaW50ZXI6IHBvaW50ZXIsXG4gICAgICBldmVudDogZXZlbnQsXG4gICAgICBldmVudFRhcmdldDogZXZlbnRUYXJnZXQsXG4gICAgICB0eXBlOiAnaG9sZCcsXG4gICAgICB0YXJnZXRzOiBbXSxcbiAgICAgIHBhdGg6IHBhdGgsXG4gICAgICBlbGVtZW50OiBudWxsXG4gICAgfTtcblxuICAgIGZvciAodmFyIF9pMiA9IDA7IF9pMiA8IHBhdGgubGVuZ3RoOyBfaTIrKykge1xuICAgICAgdmFyIF9yZWY3O1xuXG4gICAgICBfcmVmNyA9IHBhdGhbX2kyXTtcbiAgICAgIHZhciBlbGVtZW50ID0gX3JlZjc7XG4gICAgICBzaWduYWxBcmcuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICBzaWduYWxzLmZpcmUoJ2NvbGxlY3QtdGFyZ2V0cycsIHNpZ25hbEFyZyk7XG4gICAgfVxuXG4gICAgaWYgKCFzaWduYWxBcmcudGFyZ2V0cy5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbWluRHVyYXRpb24gPSBJbmZpbml0eTtcblxuICAgIGZvciAodmFyIF9pMyA9IDA7IF9pMyA8IHNpZ25hbEFyZy50YXJnZXRzLmxlbmd0aDsgX2kzKyspIHtcbiAgICAgIHZhciBfcmVmODtcblxuICAgICAgX3JlZjggPSBzaWduYWxBcmcudGFyZ2V0c1tfaTNdO1xuICAgICAgdmFyIHRhcmdldCA9IF9yZWY4O1xuICAgICAgdmFyIGhvbGREdXJhdGlvbiA9IHRhcmdldC5ldmVudGFibGUub3B0aW9ucy5ob2xkRHVyYXRpb247XG5cbiAgICAgIGlmIChob2xkRHVyYXRpb24gPCBtaW5EdXJhdGlvbikge1xuICAgICAgICBtaW5EdXJhdGlvbiA9IGhvbGREdXJhdGlvbjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aW1lci5kdXJhdGlvbiA9IG1pbkR1cmF0aW9uO1xuICAgIHRpbWVyLnRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGZpcmUoe1xuICAgICAgICBpbnRlcmFjdGlvbjogaW50ZXJhY3Rpb24sXG4gICAgICAgIGV2ZW50VGFyZ2V0OiBldmVudFRhcmdldCxcbiAgICAgICAgcG9pbnRlcjogcG9pbnRlcixcbiAgICAgICAgZXZlbnQ6IGV2ZW50LFxuICAgICAgICB0eXBlOiAnaG9sZCdcbiAgICAgIH0sIHNjb3BlKTtcbiAgICB9LCBtaW5EdXJhdGlvbik7XG4gIH0pO1xuICB2YXIgX2FyciA9IFsndXAnLCAnY2FuY2VsJ107XG5cbiAgZm9yICh2YXIgX2k0ID0gMDsgX2k0IDwgX2Fyci5sZW5ndGg7IF9pNCsrKSB7XG4gICAgdmFyIHNpZ25hbE5hbWUgPSBfYXJyW19pNF07XG4gICAgaW50ZXJhY3Rpb25zLnNpZ25hbHMub24oc2lnbmFsTmFtZSwgZnVuY3Rpb24gKF9yZWYxMCkge1xuICAgICAgdmFyIGludGVyYWN0aW9uID0gX3JlZjEwLmludGVyYWN0aW9uLFxuICAgICAgICAgIHBvaW50ZXJJbmRleCA9IF9yZWYxMC5wb2ludGVySW5kZXg7XG5cbiAgICAgIGlmIChpbnRlcmFjdGlvbi5wb2ludGVyc1twb2ludGVySW5kZXhdLmhvbGQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KGludGVyYWN0aW9uLnBvaW50ZXJzW3BvaW50ZXJJbmRleF0uaG9sZC50aW1lb3V0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc2ltcGxlU2lnbmFscy5sZW5ndGg7IGkrKykge1xuICAgIGludGVyYWN0aW9ucy5zaWduYWxzLm9uKHNpbXBsZVNpZ25hbHNbaV0sIGNyZWF0ZVNpZ25hbExpc3RlbmVyKHNpbXBsZUV2ZW50c1tpXSwgc2NvcGUpKTtcbiAgfVxuXG4gIGludGVyYWN0aW9ucy5zaWduYWxzLm9uKCd1cCcsIGZ1bmN0aW9uIChfcmVmOSkge1xuICAgIHZhciBpbnRlcmFjdGlvbiA9IF9yZWY5LmludGVyYWN0aW9uLFxuICAgICAgICBwb2ludGVyID0gX3JlZjkucG9pbnRlcixcbiAgICAgICAgZXZlbnQgPSBfcmVmOS5ldmVudCxcbiAgICAgICAgZXZlbnRUYXJnZXQgPSBfcmVmOS5ldmVudFRhcmdldDtcblxuICAgIGlmICghaW50ZXJhY3Rpb24ucG9pbnRlcldhc01vdmVkKSB7XG4gICAgICBmaXJlKHtcbiAgICAgICAgaW50ZXJhY3Rpb246IGludGVyYWN0aW9uLFxuICAgICAgICBldmVudFRhcmdldDogZXZlbnRUYXJnZXQsXG4gICAgICAgIHBvaW50ZXI6IHBvaW50ZXIsXG4gICAgICAgIGV2ZW50OiBldmVudCxcbiAgICAgICAgdHlwZTogJ3RhcCdcbiAgICAgIH0sIHNjb3BlKTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVTaWduYWxMaXN0ZW5lcih0eXBlLCBzY29wZSkge1xuICByZXR1cm4gZnVuY3Rpb24gKF9yZWYxMSkge1xuICAgIHZhciBpbnRlcmFjdGlvbiA9IF9yZWYxMS5pbnRlcmFjdGlvbixcbiAgICAgICAgcG9pbnRlciA9IF9yZWYxMS5wb2ludGVyLFxuICAgICAgICBldmVudCA9IF9yZWYxMS5ldmVudCxcbiAgICAgICAgZXZlbnRUYXJnZXQgPSBfcmVmMTEuZXZlbnRUYXJnZXQ7XG4gICAgZmlyZSh7XG4gICAgICBpbnRlcmFjdGlvbjogaW50ZXJhY3Rpb24sXG4gICAgICBldmVudFRhcmdldDogZXZlbnRUYXJnZXQsXG4gICAgICBwb2ludGVyOiBwb2ludGVyLFxuICAgICAgZXZlbnQ6IGV2ZW50LFxuICAgICAgdHlwZTogdHlwZVxuICAgIH0sIHNjb3BlKTtcbiAgfTtcbn1cblxudmFyIF9kZWZhdWx0ID0gcG9pbnRlckV2ZW50cztcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5cbn0se1wiLi9Qb2ludGVyRXZlbnRcIjozOCxcIkBpbnRlcmFjdGpzL3V0aWxzXCI6NTV9XSw0MDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX2Jhc2UgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL2Jhc2VcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gaW5zdGFsbChzY29wZSkge1xuICB2YXIgcG9pbnRlckV2ZW50cyA9IHNjb3BlLnBvaW50ZXJFdmVudHMsXG4gICAgICBpbnRlcmFjdGlvbnMgPSBzY29wZS5pbnRlcmFjdGlvbnM7XG4gIHNjb3BlLnVzZVBsdWdpbihfYmFzZVtcImRlZmF1bHRcIl0pO1xuICBwb2ludGVyRXZlbnRzLnNpZ25hbHMub24oJ25ldycsIG9uTmV3KTtcbiAgcG9pbnRlckV2ZW50cy5zaWduYWxzLm9uKCdmaXJlZCcsIGZ1bmN0aW9uIChhcmcpIHtcbiAgICByZXR1cm4gb25GaXJlZChhcmcsIHNjb3BlKTtcbiAgfSk7XG4gIHZhciBfYXJyID0gWydtb3ZlJywgJ3VwJywgJ2NhbmNlbCcsICdlbmRhbGwnXTtcblxuICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgX2Fyci5sZW5ndGg7IF9pKyspIHtcbiAgICB2YXIgc2lnbmFsID0gX2FycltfaV07XG4gICAgaW50ZXJhY3Rpb25zLnNpZ25hbHMub24oc2lnbmFsLCBlbmRIb2xkUmVwZWF0KTtcbiAgfSAvLyBkb24ndCByZXBlYXQgYnkgZGVmYXVsdFxuXG5cbiAgcG9pbnRlckV2ZW50cy5kZWZhdWx0cy5ob2xkUmVwZWF0SW50ZXJ2YWwgPSAwO1xuICBwb2ludGVyRXZlbnRzLnR5cGVzLnB1c2goJ2hvbGRyZXBlYXQnKTtcbn1cblxuZnVuY3Rpb24gb25OZXcoX3JlZikge1xuICB2YXIgcG9pbnRlckV2ZW50ID0gX3JlZi5wb2ludGVyRXZlbnQ7XG5cbiAgaWYgKHBvaW50ZXJFdmVudC50eXBlICE9PSAnaG9sZCcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBwb2ludGVyRXZlbnQuY291bnQgPSAocG9pbnRlckV2ZW50LmNvdW50IHx8IDApICsgMTtcbn1cblxuZnVuY3Rpb24gb25GaXJlZChfcmVmMiwgc2NvcGUpIHtcbiAgdmFyIGludGVyYWN0aW9uID0gX3JlZjIuaW50ZXJhY3Rpb24sXG4gICAgICBwb2ludGVyRXZlbnQgPSBfcmVmMi5wb2ludGVyRXZlbnQsXG4gICAgICBldmVudFRhcmdldCA9IF9yZWYyLmV2ZW50VGFyZ2V0LFxuICAgICAgdGFyZ2V0cyA9IF9yZWYyLnRhcmdldHM7XG5cbiAgaWYgKHBvaW50ZXJFdmVudC50eXBlICE9PSAnaG9sZCcgfHwgIXRhcmdldHMubGVuZ3RoKSB7XG4gICAgcmV0dXJuO1xuICB9IC8vIGdldCB0aGUgcmVwZWF0IGludGVydmFsIGZyb20gdGhlIGZpcnN0IGV2ZW50YWJsZVxuXG5cbiAgdmFyIGludGVydmFsID0gdGFyZ2V0c1swXS5ldmVudGFibGUub3B0aW9ucy5ob2xkUmVwZWF0SW50ZXJ2YWw7IC8vIGRvbid0IHJlcGVhdCBpZiB0aGUgaW50ZXJ2YWwgaXMgMCBvciBsZXNzXG5cbiAgaWYgKGludGVydmFsIDw9IDApIHtcbiAgICByZXR1cm47XG4gIH0gLy8gc2V0IGEgdGltZW91dCB0byBmaXJlIHRoZSBob2xkcmVwZWF0IGV2ZW50XG5cblxuICBpbnRlcmFjdGlvbi5ob2xkSW50ZXJ2YWxIYW5kbGUgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICBzY29wZS5wb2ludGVyRXZlbnRzLmZpcmUoe1xuICAgICAgaW50ZXJhY3Rpb246IGludGVyYWN0aW9uLFxuICAgICAgZXZlbnRUYXJnZXQ6IGV2ZW50VGFyZ2V0LFxuICAgICAgdHlwZTogJ2hvbGQnLFxuICAgICAgcG9pbnRlcjogcG9pbnRlckV2ZW50LFxuICAgICAgZXZlbnQ6IHBvaW50ZXJFdmVudFxuICAgIH0sIHNjb3BlKTtcbiAgfSwgaW50ZXJ2YWwpO1xufVxuXG5mdW5jdGlvbiBlbmRIb2xkUmVwZWF0KF9yZWYzKSB7XG4gIHZhciBpbnRlcmFjdGlvbiA9IF9yZWYzLmludGVyYWN0aW9uO1xuXG4gIC8vIHNldCB0aGUgaW50ZXJhY3Rpb24ncyBob2xkU3RvcFRpbWUgcHJvcGVydHlcbiAgLy8gdG8gc3RvcCBmdXJ0aGVyIGhvbGRSZXBlYXQgZXZlbnRzXG4gIGlmIChpbnRlcmFjdGlvbi5ob2xkSW50ZXJ2YWxIYW5kbGUpIHtcbiAgICBjbGVhckludGVydmFsKGludGVyYWN0aW9uLmhvbGRJbnRlcnZhbEhhbmRsZSk7XG4gICAgaW50ZXJhY3Rpb24uaG9sZEludGVydmFsSGFuZGxlID0gbnVsbDtcbiAgfVxufVxuXG52YXIgX2RlZmF1bHQgPSB7XG4gIGlkOiAncG9pbnRlci1ldmVudHMvaG9sZFJlcGVhdCcsXG4gIGluc3RhbGw6IGluc3RhbGxcbn07XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0O1xuXG59LHtcIi4vYmFzZVwiOjM5fV0sNDE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmluc3RhbGwgPSBpbnN0YWxsO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwicG9pbnRlckV2ZW50c1wiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfYmFzZVtcImRlZmF1bHRcIl07XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaG9sZFJlcGVhdFwiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaG9sZFJlcGVhdFtcImRlZmF1bHRcIl07XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaW50ZXJhY3RhYmxlVGFyZ2V0c1wiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW50ZXJhY3RhYmxlVGFyZ2V0c1tcImRlZmF1bHRcIl07XG4gIH1cbn0pO1xuZXhwb3J0cy5pZCA9IHZvaWQgMDtcblxudmFyIF9iYXNlID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9iYXNlXCIpKTtcblxudmFyIF9ob2xkUmVwZWF0ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9ob2xkUmVwZWF0XCIpKTtcblxudmFyIF9pbnRlcmFjdGFibGVUYXJnZXRzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9pbnRlcmFjdGFibGVUYXJnZXRzXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIGluc3RhbGwoc2NvcGUpIHtcbiAgc2NvcGUudXNlUGx1Z2luKF9iYXNlW1wiZGVmYXVsdFwiXSk7XG4gIHNjb3BlLnVzZVBsdWdpbihfaG9sZFJlcGVhdFtcImRlZmF1bHRcIl0pO1xuICBzY29wZS51c2VQbHVnaW4oX2ludGVyYWN0YWJsZVRhcmdldHNbXCJkZWZhdWx0XCJdKTtcbn1cblxudmFyIGlkID0gJ3BvaW50ZXItZXZlbnRzJztcbmV4cG9ydHMuaWQgPSBpZDtcblxufSx7XCIuL2Jhc2VcIjozOSxcIi4vaG9sZFJlcGVhdFwiOjQwLFwiLi9pbnRlcmFjdGFibGVUYXJnZXRzXCI6NDJ9XSw0MjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX2FyciA9IHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy91dGlscy9hcnJcIik7XG5cbnZhciBfZXh0ZW5kID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiQGludGVyYWN0anMvdXRpbHMvZXh0ZW5kXCIpKTtcblxudmFyIGlzID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQocmVxdWlyZShcIkBpbnRlcmFjdGpzL3V0aWxzL2lzXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iajsgfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgeyB2YXIgZGVzYyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID8gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIGtleSkgOiB7fTsgaWYgKGRlc2MuZ2V0IHx8IGRlc2Muc2V0KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuZXdPYmosIGtleSwgZGVzYyk7IH0gZWxzZSB7IG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSB9IH0gbmV3T2JqW1wiZGVmYXVsdFwiXSA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBpbnN0YWxsKHNjb3BlKSB7XG4gIHZhciBwb2ludGVyRXZlbnRzID0gc2NvcGUucG9pbnRlckV2ZW50cyxcbiAgICAgIGFjdGlvbnMgPSBzY29wZS5hY3Rpb25zLFxuICAgICAgSW50ZXJhY3RhYmxlID0gc2NvcGUuSW50ZXJhY3RhYmxlLFxuICAgICAgaW50ZXJhY3RhYmxlcyA9IHNjb3BlLmludGVyYWN0YWJsZXM7XG4gIHBvaW50ZXJFdmVudHMuc2lnbmFscy5vbignY29sbGVjdC10YXJnZXRzJywgZnVuY3Rpb24gKF9yZWYpIHtcbiAgICB2YXIgdGFyZ2V0cyA9IF9yZWYudGFyZ2V0cyxcbiAgICAgICAgZWxlbWVudCA9IF9yZWYuZWxlbWVudCxcbiAgICAgICAgdHlwZSA9IF9yZWYudHlwZSxcbiAgICAgICAgZXZlbnRUYXJnZXQgPSBfcmVmLmV2ZW50VGFyZ2V0O1xuICAgIHNjb3BlLmludGVyYWN0YWJsZXMuZm9yRWFjaE1hdGNoKGVsZW1lbnQsIGZ1bmN0aW9uIChpbnRlcmFjdGFibGUpIHtcbiAgICAgIHZhciBldmVudGFibGUgPSBpbnRlcmFjdGFibGUuZXZlbnRzO1xuICAgICAgdmFyIG9wdGlvbnMgPSBldmVudGFibGUub3B0aW9ucztcblxuICAgICAgaWYgKGV2ZW50YWJsZS50eXBlc1t0eXBlXSAmJiBldmVudGFibGUudHlwZXNbdHlwZV0ubGVuZ3RoICYmIGlzLmVsZW1lbnQoZWxlbWVudCkgJiYgaW50ZXJhY3RhYmxlLnRlc3RJZ25vcmVBbGxvdyhvcHRpb25zLCBlbGVtZW50LCBldmVudFRhcmdldCkpIHtcbiAgICAgICAgdGFyZ2V0cy5wdXNoKHtcbiAgICAgICAgICBlbGVtZW50OiBlbGVtZW50LFxuICAgICAgICAgIGV2ZW50YWJsZTogZXZlbnRhYmxlLFxuICAgICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgICBpbnRlcmFjdGFibGU6IGludGVyYWN0YWJsZVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICBpbnRlcmFjdGFibGVzLnNpZ25hbHMub24oJ25ldycsIGZ1bmN0aW9uIChfcmVmMikge1xuICAgIHZhciBpbnRlcmFjdGFibGUgPSBfcmVmMi5pbnRlcmFjdGFibGU7XG5cbiAgICBpbnRlcmFjdGFibGUuZXZlbnRzLmdldFJlY3QgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgcmV0dXJuIGludGVyYWN0YWJsZS5nZXRSZWN0KGVsZW1lbnQpO1xuICAgIH07XG4gIH0pO1xuICBpbnRlcmFjdGFibGVzLnNpZ25hbHMub24oJ3NldCcsIGZ1bmN0aW9uIChfcmVmMykge1xuICAgIHZhciBpbnRlcmFjdGFibGUgPSBfcmVmMy5pbnRlcmFjdGFibGUsXG4gICAgICAgIG9wdGlvbnMgPSBfcmVmMy5vcHRpb25zO1xuICAgICgwLCBfZXh0ZW5kW1wiZGVmYXVsdFwiXSkoaW50ZXJhY3RhYmxlLmV2ZW50cy5vcHRpb25zLCBwb2ludGVyRXZlbnRzLmRlZmF1bHRzKTtcbiAgICAoMCwgX2V4dGVuZFtcImRlZmF1bHRcIl0pKGludGVyYWN0YWJsZS5ldmVudHMub3B0aW9ucywgb3B0aW9ucy5wb2ludGVyRXZlbnRzIHx8IHt9KTtcbiAgfSk7XG4gICgwLCBfYXJyLm1lcmdlKShhY3Rpb25zLmV2ZW50VHlwZXMsIHBvaW50ZXJFdmVudHMudHlwZXMpO1xuICBJbnRlcmFjdGFibGUucHJvdG90eXBlLnBvaW50ZXJFdmVudHMgPSBwb2ludGVyRXZlbnRzTWV0aG9kO1xuICB2YXIgX19iYWNrQ29tcGF0T3B0aW9uID0gSW50ZXJhY3RhYmxlLnByb3RvdHlwZS5fYmFja0NvbXBhdE9wdGlvbjtcblxuICBJbnRlcmFjdGFibGUucHJvdG90eXBlLl9iYWNrQ29tcGF0T3B0aW9uID0gZnVuY3Rpb24gKG9wdGlvbk5hbWUsIG5ld1ZhbHVlKSB7XG4gICAgdmFyIHJldCA9IF9fYmFja0NvbXBhdE9wdGlvbi5jYWxsKHRoaXMsIG9wdGlvbk5hbWUsIG5ld1ZhbHVlKTtcblxuICAgIGlmIChyZXQgPT09IHRoaXMpIHtcbiAgICAgIHRoaXMuZXZlbnRzLm9wdGlvbnNbb3B0aW9uTmFtZV0gPSBuZXdWYWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9O1xufVxuXG5mdW5jdGlvbiBwb2ludGVyRXZlbnRzTWV0aG9kKG9wdGlvbnMpIHtcbiAgKDAsIF9leHRlbmRbXCJkZWZhdWx0XCJdKSh0aGlzLmV2ZW50cy5vcHRpb25zLCBvcHRpb25zKTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbnZhciBfZGVmYXVsdCA9IHtcbiAgaWQ6ICdwb2ludGVyLWV2ZW50cy9pbnRlcmFjdGFibGVUYXJnZXRzJyxcbiAgaW5zdGFsbDogaW5zdGFsbFxufTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5cbn0se1wiQGludGVyYWN0anMvdXRpbHMvYXJyXCI6NDYsXCJAaW50ZXJhY3Rqcy91dGlscy9leHRlbmRcIjo1MixcIkBpbnRlcmFjdGpzL3V0aWxzL2lzXCI6NTZ9XSw0MzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuaW5zdGFsbCA9IGluc3RhbGw7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF9JbnRlcmFjdEV2ZW50ID0gcmVxdWlyZShcIkBpbnRlcmFjdGpzL2NvcmUvSW50ZXJhY3RFdmVudFwiKTtcblxudmFyIF91dGlscyA9IHJlcXVpcmUoXCJAaW50ZXJhY3Rqcy91dGlsc1wiKTtcblxuX0ludGVyYWN0RXZlbnQuRXZlbnRQaGFzZS5SZWZsb3cgPSAncmVmbG93JztcblxuZnVuY3Rpb24gaW5zdGFsbChzY29wZSkge1xuICB2YXIgYWN0aW9ucyA9IHNjb3BlLmFjdGlvbnMsXG4gICAgICBpbnRlcmFjdGlvbnMgPSBzY29wZS5pbnRlcmFjdGlvbnMsXG4gICAgICBJbnRlcmFjdGFibGUgPSBzY29wZS5JbnRlcmFjdGFibGU7IC8vIGFkZCBhY3Rpb24gcmVmbG93IGV2ZW50IHR5cGVzXG5cbiAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFjdGlvbnMubmFtZXMubGVuZ3RoOyBfaSsrKSB7XG4gICAgdmFyIF9yZWY7XG5cbiAgICBfcmVmID0gYWN0aW9ucy5uYW1lc1tfaV07XG4gICAgdmFyIGFjdGlvbk5hbWUgPSBfcmVmO1xuICAgIGFjdGlvbnMuZXZlbnRUeXBlcy5wdXNoKFwiXCIuY29uY2F0KGFjdGlvbk5hbWUsIFwicmVmbG93XCIpKTtcbiAgfSAvLyByZW1vdmUgY29tcGxldGVkIHJlZmxvdyBpbnRlcmFjdGlvbnNcblxuXG4gIGludGVyYWN0aW9ucy5zaWduYWxzLm9uKCdzdG9wJywgZnVuY3Rpb24gKF9yZWYyKSB7XG4gICAgdmFyIGludGVyYWN0aW9uID0gX3JlZjIuaW50ZXJhY3Rpb247XG5cbiAgICBpZiAoaW50ZXJhY3Rpb24ucG9pbnRlclR5cGUgPT09IF9JbnRlcmFjdEV2ZW50LkV2ZW50UGhhc2UuUmVmbG93KSB7XG4gICAgICBpZiAoaW50ZXJhY3Rpb24uX3JlZmxvd1Jlc29sdmUpIHtcbiAgICAgICAgaW50ZXJhY3Rpb24uX3JlZmxvd1Jlc29sdmUoKTtcbiAgICAgIH1cblxuICAgICAgX3V0aWxzLmFyci5yZW1vdmUoc2NvcGUuaW50ZXJhY3Rpb25zLmxpc3QsIGludGVyYWN0aW9uKTtcbiAgICB9XG4gIH0pO1xuICAvKipcbiAgICogYGBganNcbiAgICogY29uc3QgaW50ZXJhY3RhYmxlID0gaW50ZXJhY3QodGFyZ2V0KVxuICAgKiBjb25zdCBkcmFnID0geyBuYW1lOiBkcmFnLCBheGlzOiAneCcgfVxuICAgKiBjb25zdCByZXNpemUgPSB7IG5hbWU6IHJlc2l6ZSwgZWRnZXM6IHsgbGVmdDogdHJ1ZSwgYm90dG9tOiB0cnVlIH1cbiAgICpcbiAgICogaW50ZXJhY3RhYmxlLnJlZmxvdyhkcmFnKVxuICAgKiBpbnRlcmFjdGFibGUucmVmbG93KHJlc2l6ZSlcbiAgICogYGBgXG4gICAqXG4gICAqIFN0YXJ0IGFuIGFjdGlvbiBzZXF1ZW5jZSB0byByZS1hcHBseSBtb2RpZmllcnMsIGNoZWNrIGRyb3BzLCBldGMuXG4gICAqXG4gICAqIEBwYXJhbSB7IE9iamVjdCB9IGFjdGlvbiBUaGUgYWN0aW9uIHRvIGJlZ2luXG4gICAqIEBwYXJhbSB7IHN0cmluZyB9IGFjdGlvbi5uYW1lIFRoZSBuYW1lIG9mIHRoZSBhY3Rpb25cbiAgICogQHJldHVybnMgeyBQcm9taXNlPEludGVyYWN0YWJsZT4gfVxuICAgKi9cblxuICBJbnRlcmFjdGFibGUucHJvdG90eXBlLnJlZmxvdyA9IGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICByZXR1cm4gcmVmbG93KHRoaXMsIGFjdGlvbiwgc2NvcGUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiByZWZsb3coaW50ZXJhY3RhYmxlLCBhY3Rpb24sIHNjb3BlKSB7XG4gIHZhciBlbGVtZW50cyA9IF91dGlscy5pcy5zdHJpbmcoaW50ZXJhY3RhYmxlLnRhcmdldCkgPyBfdXRpbHMuYXJyLmZyb20oaW50ZXJhY3RhYmxlLl9jb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwoaW50ZXJhY3RhYmxlLnRhcmdldCkpIDogW2ludGVyYWN0YWJsZS50YXJnZXRdOyAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmUgdmFyaWFibGUtbmFtZVxuXG4gIHZhciBQcm9taXNlID0gX3V0aWxzLndpbi53aW5kb3cuUHJvbWlzZTtcbiAgdmFyIHByb21pc2VzID0gUHJvbWlzZSA/IFtdIDogbnVsbDtcblxuICB2YXIgX2xvb3AgPSBmdW5jdGlvbiBfbG9vcCgpIHtcbiAgICBfcmVmMyA9IGVsZW1lbnRzW19pMl07XG4gICAgdmFyIGVsZW1lbnQgPSBfcmVmMztcbiAgICB2YXIgcmVjdCA9IGludGVyYWN0YWJsZS5nZXRSZWN0KGVsZW1lbnQpO1xuXG4gICAgaWYgKCFyZWN0KSB7XG4gICAgICByZXR1cm4gXCJicmVha1wiO1xuICAgIH1cblxuICAgIHZhciBydW5uaW5nSW50ZXJhY3Rpb24gPSBfdXRpbHMuYXJyLmZpbmQoc2NvcGUuaW50ZXJhY3Rpb25zLmxpc3QsIGZ1bmN0aW9uIChpbnRlcmFjdGlvbikge1xuICAgICAgcmV0dXJuIGludGVyYWN0aW9uLmludGVyYWN0aW5nKCkgJiYgaW50ZXJhY3Rpb24uaW50ZXJhY3RhYmxlID09PSBpbnRlcmFjdGFibGUgJiYgaW50ZXJhY3Rpb24uZWxlbWVudCA9PT0gZWxlbWVudCAmJiBpbnRlcmFjdGlvbi5wcmVwYXJlZC5uYW1lID09PSBhY3Rpb24ubmFtZTtcbiAgICB9KTtcblxuICAgIHZhciByZWZsb3dQcm9taXNlID0gdm9pZCAwO1xuXG4gICAgaWYgKHJ1bm5pbmdJbnRlcmFjdGlvbikge1xuICAgICAgcnVubmluZ0ludGVyYWN0aW9uLm1vdmUoKTtcblxuICAgICAgaWYgKHByb21pc2VzKSB7XG4gICAgICAgIHJlZmxvd1Byb21pc2UgPSBydW5uaW5nSW50ZXJhY3Rpb24uX3JlZmxvd1Byb21pc2UgfHwgbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgICBydW5uaW5nSW50ZXJhY3Rpb24uX3JlZmxvd1Jlc29sdmUgPSByZXNvbHZlO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHh5d2ggPSBfdXRpbHMucmVjdC50bGJyVG9YeXdoKHJlY3QpO1xuXG4gICAgICB2YXIgY29vcmRzID0ge1xuICAgICAgICBwYWdlOiB7XG4gICAgICAgICAgeDogeHl3aC54LFxuICAgICAgICAgIHk6IHh5d2gueVxuICAgICAgICB9LFxuICAgICAgICBjbGllbnQ6IHtcbiAgICAgICAgICB4OiB4eXdoLngsXG4gICAgICAgICAgeTogeHl3aC55XG4gICAgICAgIH0sXG4gICAgICAgIHRpbWVTdGFtcDogc2NvcGUubm93KClcbiAgICAgIH07XG5cbiAgICAgIHZhciBldmVudCA9IF91dGlscy5wb2ludGVyLmNvb3Jkc1RvRXZlbnQoY29vcmRzKTtcblxuICAgICAgcmVmbG93UHJvbWlzZSA9IHN0YXJ0UmVmbG93KHNjb3BlLCBpbnRlcmFjdGFibGUsIGVsZW1lbnQsIGFjdGlvbiwgZXZlbnQpO1xuICAgIH1cblxuICAgIGlmIChwcm9taXNlcykge1xuICAgICAgcHJvbWlzZXMucHVzaChyZWZsb3dQcm9taXNlKTtcbiAgICB9XG4gIH07XG5cbiAgZm9yICh2YXIgX2kyID0gMDsgX2kyIDwgZWxlbWVudHMubGVuZ3RoOyBfaTIrKykge1xuICAgIHZhciBfcmVmMztcblxuICAgIHZhciBfcmV0ID0gX2xvb3AoKTtcblxuICAgIGlmIChfcmV0ID09PSBcImJyZWFrXCIpIGJyZWFrO1xuICB9XG5cbiAgcmV0dXJuIHByb21pc2VzICYmIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gaW50ZXJhY3RhYmxlO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gc3RhcnRSZWZsb3coc2NvcGUsIGludGVyYWN0YWJsZSwgZWxlbWVudCwgYWN0aW9uLCBldmVudCkge1xuICB2YXIgaW50ZXJhY3Rpb24gPSBzY29wZS5pbnRlcmFjdGlvbnNbXCJuZXdcIl0oe1xuICAgIHBvaW50ZXJUeXBlOiAncmVmbG93J1xuICB9KTtcbiAgdmFyIHNpZ25hbEFyZyA9IHtcbiAgICBpbnRlcmFjdGlvbjogaW50ZXJhY3Rpb24sXG4gICAgZXZlbnQ6IGV2ZW50LFxuICAgIHBvaW50ZXI6IGV2ZW50LFxuICAgIGV2ZW50VGFyZ2V0OiBlbGVtZW50LFxuICAgIHBoYXNlOiBfSW50ZXJhY3RFdmVudC5FdmVudFBoYXNlLlJlZmxvd1xuICB9O1xuICBpbnRlcmFjdGlvbi5pbnRlcmFjdGFibGUgPSBpbnRlcmFjdGFibGU7XG4gIGludGVyYWN0aW9uLmVsZW1lbnQgPSBlbGVtZW50O1xuICBpbnRlcmFjdGlvbi5wcmVwYXJlZCA9ICgwLCBfdXRpbHMuZXh0ZW5kKSh7fSwgYWN0aW9uKTtcbiAgaW50ZXJhY3Rpb24ucHJldkV2ZW50ID0gZXZlbnQ7XG4gIGludGVyYWN0aW9uLnVwZGF0ZVBvaW50ZXIoZXZlbnQsIGV2ZW50LCBlbGVtZW50LCB0cnVlKTtcblxuICBpbnRlcmFjdGlvbi5fZG9QaGFzZShzaWduYWxBcmcpO1xuXG4gIHZhciByZWZsb3dQcm9taXNlID0gX3V0aWxzLndpbi53aW5kb3cuUHJvbWlzZSA/IG5ldyBfdXRpbHMud2luLndpbmRvdy5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgaW50ZXJhY3Rpb24uX3JlZmxvd1Jlc29sdmUgPSByZXNvbHZlO1xuICB9KSA6IG51bGw7XG4gIGludGVyYWN0aW9uLl9yZWZsb3dQcm9taXNlID0gcmVmbG93UHJvbWlzZTtcbiAgaW50ZXJhY3Rpb24uc3RhcnQoYWN0aW9uLCBpbnRlcmFjdGFibGUsIGVsZW1lbnQpO1xuXG4gIGlmIChpbnRlcmFjdGlvbi5faW50ZXJhY3RpbmcpIHtcbiAgICBpbnRlcmFjdGlvbi5tb3ZlKHNpZ25hbEFyZyk7XG4gICAgaW50ZXJhY3Rpb24uZW5kKGV2ZW50KTtcbiAgfSBlbHNlIHtcbiAgICBpbnRlcmFjdGlvbi5zdG9wKCk7XG4gIH1cblxuICBpbnRlcmFjdGlvbi5yZW1vdmVQb2ludGVyKGV2ZW50LCBldmVudCk7XG4gIGludGVyYWN0aW9uLnBvaW50ZXJJc0Rvd24gPSBmYWxzZTtcbiAgcmV0dXJuIHJlZmxvd1Byb21pc2U7XG59XG5cbnZhciBfZGVmYXVsdCA9IHtcbiAgaWQ6ICdyZWZsb3cnLFxuICBpbnN0YWxsOiBpbnN0YWxsXG59O1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBfZGVmYXVsdDtcblxufSx7XCJAaW50ZXJhY3Rqcy9jb3JlL0ludGVyYWN0RXZlbnRcIjoxNSxcIkBpbnRlcmFjdGpzL3V0aWxzXCI6NTV9XSw0NDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi90eXBlcy5kLnRzXCIgLz5cblwidXNlIHN0cmljdFwiO1xuXG59LHt9XSw0NTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbnZhciBTaWduYWxzID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gU2lnbmFscygpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgU2lnbmFscyk7XG5cbiAgICB0aGlzLmxpc3RlbmVycyA9IHt9O1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFNpZ25hbHMsIFt7XG4gICAga2V5OiBcIm9uXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uKG5hbWUsIGxpc3RlbmVyKSB7XG4gICAgICBpZiAoIXRoaXMubGlzdGVuZXJzW25hbWVdKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzW25hbWVdID0gW2xpc3RlbmVyXTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmxpc3RlbmVyc1tuYW1lXS5wdXNoKGxpc3RlbmVyKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwib2ZmXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9mZihuYW1lLCBsaXN0ZW5lcikge1xuICAgICAgaWYgKCF0aGlzLmxpc3RlbmVyc1tuYW1lXSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBpbmRleCA9IHRoaXMubGlzdGVuZXJzW25hbWVdLmluZGV4T2YobGlzdGVuZXIpO1xuXG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzW25hbWVdLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImZpcmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZmlyZShuYW1lLCBhcmcpIHtcbiAgICAgIHZhciB0YXJnZXRMaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVyc1tuYW1lXTtcblxuICAgICAgaWYgKCF0YXJnZXRMaXN0ZW5lcnMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgdGFyZ2V0TGlzdGVuZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgICB2YXIgX3JlZjtcblxuICAgICAgICBfcmVmID0gdGFyZ2V0TGlzdGVuZXJzW19pXTtcbiAgICAgICAgdmFyIGxpc3RlbmVyID0gX3JlZjtcblxuICAgICAgICBpZiAobGlzdGVuZXIoYXJnLCBuYW1lKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gU2lnbmFscztcbn0oKTtcblxudmFyIF9kZWZhdWx0ID0gU2lnbmFscztcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5cbn0se31dLDQ2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5jb250YWlucyA9IGNvbnRhaW5zO1xuZXhwb3J0cy5yZW1vdmUgPSByZW1vdmU7XG5leHBvcnRzLm1lcmdlID0gbWVyZ2U7XG5leHBvcnRzLmZyb20gPSBmcm9tO1xuZXhwb3J0cy5maW5kSW5kZXggPSBmaW5kSW5kZXg7XG5leHBvcnRzLmZpbmQgPSBmaW5kO1xuZXhwb3J0cy5zb21lID0gc29tZTtcblxuZnVuY3Rpb24gY29udGFpbnMoYXJyYXksIHRhcmdldCkge1xuICByZXR1cm4gYXJyYXkuaW5kZXhPZih0YXJnZXQpICE9PSAtMTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlKGFycmF5LCB0YXJnZXQpIHtcbiAgcmV0dXJuIGFycmF5LnNwbGljZShhcnJheS5pbmRleE9mKHRhcmdldCksIDEpO1xufVxuXG5mdW5jdGlvbiBtZXJnZSh0YXJnZXQsIHNvdXJjZSkge1xuICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgc291cmNlLmxlbmd0aDsgX2krKykge1xuICAgIHZhciBfcmVmO1xuXG4gICAgX3JlZiA9IHNvdXJjZVtfaV07XG4gICAgdmFyIGl0ZW0gPSBfcmVmO1xuICAgIHRhcmdldC5wdXNoKGl0ZW0pO1xuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuZnVuY3Rpb24gZnJvbShzb3VyY2UpIHtcbiAgcmV0dXJuIG1lcmdlKFtdLCBzb3VyY2UpO1xufVxuXG5mdW5jdGlvbiBmaW5kSW5kZXgoYXJyYXksIGZ1bmMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChmdW5jKGFycmF5W2ldLCBpLCBhcnJheSkpIHtcbiAgICAgIHJldHVybiBpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAtMTtcbn1cblxuZnVuY3Rpb24gZmluZChhcnJheSwgZnVuYykge1xuICByZXR1cm4gYXJyYXlbZmluZEluZGV4KGFycmF5LCBmdW5jKV07XG59XG5cbmZ1bmN0aW9uIHNvbWUoYXJyYXksIGZ1bmMpIHtcbiAgcmV0dXJuIGZpbmRJbmRleChhcnJheSwgZnVuYykgIT09IC0xO1xufVxuXG59LHt9XSw0NzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX2RvbU9iamVjdHMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL2RvbU9iamVjdHNcIikpO1xuXG52YXIgaXMgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChyZXF1aXJlKFwiLi9pc1wiKSk7XG5cbnZhciBfd2luZG93ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi93aW5kb3dcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7IHZhciBkZXNjID0gT2JqZWN0LmRlZmluZVByb3BlcnR5ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KSA6IHt9OyBpZiAoZGVzYy5nZXQgfHwgZGVzYy5zZXQpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5ld09iaiwga2V5LCBkZXNjKTsgfSBlbHNlIHsgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IH0gfSBuZXdPYmpbXCJkZWZhdWx0XCJdID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbnZhciBicm93c2VyID0ge1xuICBpbml0OiBpbml0LFxuICBzdXBwb3J0c1RvdWNoOiBudWxsLFxuICBzdXBwb3J0c1BvaW50ZXJFdmVudDogbnVsbCxcbiAgaXNJT1M3OiBudWxsLFxuICBpc0lPUzogbnVsbCxcbiAgaXNJZTk6IG51bGwsXG4gIGlzT3BlcmFNb2JpbGU6IG51bGwsXG4gIHByZWZpeGVkTWF0Y2hlc1NlbGVjdG9yOiBudWxsLFxuICBwRXZlbnRUeXBlczogbnVsbCxcbiAgd2hlZWxFdmVudDogbnVsbFxufTtcblxuZnVuY3Rpb24gaW5pdCh3aW5kb3cpIHtcbiAgdmFyIEVsZW1lbnQgPSBfZG9tT2JqZWN0c1tcImRlZmF1bHRcIl0uRWxlbWVudDtcbiAgdmFyIG5hdmlnYXRvciA9IF93aW5kb3dbXCJkZWZhdWx0XCJdLndpbmRvdy5uYXZpZ2F0b3I7IC8vIERvZXMgdGhlIGJyb3dzZXIgc3VwcG9ydCB0b3VjaCBpbnB1dD9cblxuICBicm93c2VyLnN1cHBvcnRzVG91Y2ggPSAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgfHwgaXMuZnVuYyh3aW5kb3cuRG9jdW1lbnRUb3VjaCkgJiYgX2RvbU9iamVjdHNbXCJkZWZhdWx0XCJdLmRvY3VtZW50IGluc3RhbmNlb2Ygd2luZG93LkRvY3VtZW50VG91Y2g7IC8vIERvZXMgdGhlIGJyb3dzZXIgc3VwcG9ydCBQb2ludGVyRXZlbnRzXG5cbiAgYnJvd3Nlci5zdXBwb3J0c1BvaW50ZXJFdmVudCA9IG5hdmlnYXRvci5wb2ludGVyRW5hYmxlZCAhPT0gZmFsc2UgJiYgISFfZG9tT2JqZWN0c1tcImRlZmF1bHRcIl0uUG9pbnRlckV2ZW50O1xuICBicm93c2VyLmlzSU9TID0gL2lQKGhvbmV8b2R8YWQpLy50ZXN0KG5hdmlnYXRvci5wbGF0Zm9ybSk7IC8vIHNjcm9sbGluZyBkb2Vzbid0IGNoYW5nZSB0aGUgcmVzdWx0IG9mIGdldENsaWVudFJlY3RzIG9uIGlPUyA3XG5cbiAgYnJvd3Nlci5pc0lPUzcgPSAvaVAoaG9uZXxvZHxhZCkvLnRlc3QobmF2aWdhdG9yLnBsYXRmb3JtKSAmJiAvT1MgN1teXFxkXS8udGVzdChuYXZpZ2F0b3IuYXBwVmVyc2lvbik7XG4gIGJyb3dzZXIuaXNJZTkgPSAvTVNJRSA5Ly50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpOyAvLyBPcGVyYSBNb2JpbGUgbXVzdCBiZSBoYW5kbGVkIGRpZmZlcmVudGx5XG5cbiAgYnJvd3Nlci5pc09wZXJhTW9iaWxlID0gbmF2aWdhdG9yLmFwcE5hbWUgPT09ICdPcGVyYScgJiYgYnJvd3Nlci5zdXBwb3J0c1RvdWNoICYmIC9QcmVzdG8vLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7IC8vIHByZWZpeCBtYXRjaGVzU2VsZWN0b3JcblxuICBicm93c2VyLnByZWZpeGVkTWF0Y2hlc1NlbGVjdG9yID0gJ21hdGNoZXMnIGluIEVsZW1lbnQucHJvdG90eXBlID8gJ21hdGNoZXMnIDogJ3dlYmtpdE1hdGNoZXNTZWxlY3RvcicgaW4gRWxlbWVudC5wcm90b3R5cGUgPyAnd2Via2l0TWF0Y2hlc1NlbGVjdG9yJyA6ICdtb3pNYXRjaGVzU2VsZWN0b3InIGluIEVsZW1lbnQucHJvdG90eXBlID8gJ21vek1hdGNoZXNTZWxlY3RvcicgOiAnb01hdGNoZXNTZWxlY3RvcicgaW4gRWxlbWVudC5wcm90b3R5cGUgPyAnb01hdGNoZXNTZWxlY3RvcicgOiAnbXNNYXRjaGVzU2VsZWN0b3InO1xuICBicm93c2VyLnBFdmVudFR5cGVzID0gYnJvd3Nlci5zdXBwb3J0c1BvaW50ZXJFdmVudCA/IF9kb21PYmplY3RzW1wiZGVmYXVsdFwiXS5Qb2ludGVyRXZlbnQgPT09IHdpbmRvdy5NU1BvaW50ZXJFdmVudCA/IHtcbiAgICB1cDogJ01TUG9pbnRlclVwJyxcbiAgICBkb3duOiAnTVNQb2ludGVyRG93bicsXG4gICAgb3ZlcjogJ21vdXNlb3ZlcicsXG4gICAgb3V0OiAnbW91c2VvdXQnLFxuICAgIG1vdmU6ICdNU1BvaW50ZXJNb3ZlJyxcbiAgICBjYW5jZWw6ICdNU1BvaW50ZXJDYW5jZWwnXG4gIH0gOiB7XG4gICAgdXA6ICdwb2ludGVydXAnLFxuICAgIGRvd246ICdwb2ludGVyZG93bicsXG4gICAgb3ZlcjogJ3BvaW50ZXJvdmVyJyxcbiAgICBvdXQ6ICdwb2ludGVyb3V0JyxcbiAgICBtb3ZlOiAncG9pbnRlcm1vdmUnLFxuICAgIGNhbmNlbDogJ3BvaW50ZXJjYW5jZWwnXG4gIH0gOiBudWxsOyAvLyBiZWNhdXNlIFdlYmtpdCBhbmQgT3BlcmEgc3RpbGwgdXNlICdtb3VzZXdoZWVsJyBldmVudCB0eXBlXG5cbiAgYnJvd3Nlci53aGVlbEV2ZW50ID0gJ29ubW91c2V3aGVlbCcgaW4gX2RvbU9iamVjdHNbXCJkZWZhdWx0XCJdLmRvY3VtZW50ID8gJ21vdXNld2hlZWwnIDogJ3doZWVsJztcbn1cblxudmFyIF9kZWZhdWx0ID0gYnJvd3NlcjtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5cbn0se1wiLi9kb21PYmplY3RzXCI6NDksXCIuL2lzXCI6NTYsXCIuL3dpbmRvd1wiOjY1fV0sNDg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGNsb25lO1xuXG52YXIgYXJyID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQocmVxdWlyZShcIi4vYXJyXCIpKTtcblxudmFyIGlzID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQocmVxdWlyZShcIi4vaXNcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7IHZhciBkZXNjID0gT2JqZWN0LmRlZmluZVByb3BlcnR5ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KSA6IHt9OyBpZiAoZGVzYy5nZXQgfHwgZGVzYy5zZXQpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5ld09iaiwga2V5LCBkZXNjKTsgfSBlbHNlIHsgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IH0gfSBuZXdPYmpbXCJkZWZhdWx0XCJdID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblxuZnVuY3Rpb24gY2xvbmUoc291cmNlKSB7XG4gIHZhciBkZXN0ID0ge307XG5cbiAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICB2YXIgdmFsdWUgPSBzb3VyY2VbcHJvcF07XG5cbiAgICBpZiAoaXMucGxhaW5PYmplY3QodmFsdWUpKSB7XG4gICAgICBkZXN0W3Byb3BdID0gY2xvbmUodmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoaXMuYXJyYXkodmFsdWUpKSB7XG4gICAgICBkZXN0W3Byb3BdID0gYXJyLmZyb20odmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZXN0W3Byb3BdID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRlc3Q7XG59XG5cbn0se1wiLi9hcnJcIjo0NixcIi4vaXNcIjo1Nn1dLDQ5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG52YXIgZG9tT2JqZWN0cyA9IHtcbiAgaW5pdDogaW5pdCxcbiAgZG9jdW1lbnQ6IG51bGwsXG4gIERvY3VtZW50RnJhZ21lbnQ6IG51bGwsXG4gIFNWR0VsZW1lbnQ6IG51bGwsXG4gIFNWR1NWR0VsZW1lbnQ6IG51bGwsXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICBTVkdFbGVtZW50SW5zdGFuY2U6IG51bGwsXG4gIEVsZW1lbnQ6IG51bGwsXG4gIEhUTUxFbGVtZW50OiBudWxsLFxuICBFdmVudDogbnVsbCxcbiAgVG91Y2g6IG51bGwsXG4gIFBvaW50ZXJFdmVudDogbnVsbFxufTtcblxuZnVuY3Rpb24gYmxhbmsoKSB7fVxuXG52YXIgX2RlZmF1bHQgPSBkb21PYmplY3RzO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBfZGVmYXVsdDtcblxuZnVuY3Rpb24gaW5pdCh3aW5kb3cpIHtcbiAgdmFyIHdpbiA9IHdpbmRvdztcbiAgZG9tT2JqZWN0cy5kb2N1bWVudCA9IHdpbi5kb2N1bWVudDtcbiAgZG9tT2JqZWN0cy5Eb2N1bWVudEZyYWdtZW50ID0gd2luLkRvY3VtZW50RnJhZ21lbnQgfHwgYmxhbms7XG4gIGRvbU9iamVjdHMuU1ZHRWxlbWVudCA9IHdpbi5TVkdFbGVtZW50IHx8IGJsYW5rO1xuICBkb21PYmplY3RzLlNWR1NWR0VsZW1lbnQgPSB3aW4uU1ZHU1ZHRWxlbWVudCB8fCBibGFuaztcbiAgZG9tT2JqZWN0cy5TVkdFbGVtZW50SW5zdGFuY2UgPSB3aW4uU1ZHRWxlbWVudEluc3RhbmNlIHx8IGJsYW5rO1xuICBkb21PYmplY3RzLkVsZW1lbnQgPSB3aW4uRWxlbWVudCB8fCBibGFuaztcbiAgZG9tT2JqZWN0cy5IVE1MRWxlbWVudCA9IHdpbi5IVE1MRWxlbWVudCB8fCBkb21PYmplY3RzLkVsZW1lbnQ7XG4gIGRvbU9iamVjdHMuRXZlbnQgPSB3aW4uRXZlbnQ7XG4gIGRvbU9iamVjdHMuVG91Y2ggPSB3aW4uVG91Y2ggfHwgYmxhbms7XG4gIGRvbU9iamVjdHMuUG9pbnRlckV2ZW50ID0gd2luLlBvaW50ZXJFdmVudCB8fCB3aW4uTVNQb2ludGVyRXZlbnQ7XG59XG5cbn0se31dLDUwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5ub2RlQ29udGFpbnMgPSBub2RlQ29udGFpbnM7XG5leHBvcnRzLmNsb3Nlc3QgPSBjbG9zZXN0O1xuZXhwb3J0cy5wYXJlbnROb2RlID0gcGFyZW50Tm9kZTtcbmV4cG9ydHMubWF0Y2hlc1NlbGVjdG9yID0gbWF0Y2hlc1NlbGVjdG9yO1xuZXhwb3J0cy5pbmRleE9mRGVlcGVzdEVsZW1lbnQgPSBpbmRleE9mRGVlcGVzdEVsZW1lbnQ7XG5leHBvcnRzLm1hdGNoZXNVcFRvID0gbWF0Y2hlc1VwVG87XG5leHBvcnRzLmdldEFjdHVhbEVsZW1lbnQgPSBnZXRBY3R1YWxFbGVtZW50O1xuZXhwb3J0cy5nZXRTY3JvbGxYWSA9IGdldFNjcm9sbFhZO1xuZXhwb3J0cy5nZXRFbGVtZW50Q2xpZW50UmVjdCA9IGdldEVsZW1lbnRDbGllbnRSZWN0O1xuZXhwb3J0cy5nZXRFbGVtZW50UmVjdCA9IGdldEVsZW1lbnRSZWN0O1xuZXhwb3J0cy5nZXRQYXRoID0gZ2V0UGF0aDtcbmV4cG9ydHMudHJ5U2VsZWN0b3IgPSB0cnlTZWxlY3RvcjtcblxudmFyIF9icm93c2VyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9icm93c2VyXCIpKTtcblxudmFyIF9kb21PYmplY3RzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9kb21PYmplY3RzXCIpKTtcblxudmFyIGlzID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQocmVxdWlyZShcIi4vaXNcIikpO1xuXG52YXIgX3dpbmRvdyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vd2luZG93XCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iajsgfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgeyB2YXIgZGVzYyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID8gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIGtleSkgOiB7fTsgaWYgKGRlc2MuZ2V0IHx8IGRlc2Muc2V0KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuZXdPYmosIGtleSwgZGVzYyk7IH0gZWxzZSB7IG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSB9IH0gbmV3T2JqW1wiZGVmYXVsdFwiXSA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBub2RlQ29udGFpbnMocGFyZW50LCBjaGlsZCkge1xuICB3aGlsZSAoY2hpbGQpIHtcbiAgICBpZiAoY2hpbGQgPT09IHBhcmVudCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgY2hpbGQgPSBjaGlsZC5wYXJlbnROb2RlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBjbG9zZXN0KGVsZW1lbnQsIHNlbGVjdG9yKSB7XG4gIHdoaWxlIChpcy5lbGVtZW50KGVsZW1lbnQpKSB7XG4gICAgaWYgKG1hdGNoZXNTZWxlY3RvcihlbGVtZW50LCBzZWxlY3RvcikpIHtcbiAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH1cblxuICAgIGVsZW1lbnQgPSBwYXJlbnROb2RlKGVsZW1lbnQpO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIHBhcmVudE5vZGUobm9kZSkge1xuICB2YXIgcGFyZW50ID0gbm9kZS5wYXJlbnROb2RlO1xuXG4gIGlmIChpcy5kb2NGcmFnKHBhcmVudCkpIHtcbiAgICAvLyBza2lwIHBhc3QgI3NoYWRvLXJvb3QgZnJhZ21lbnRzXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG4gICAgd2hpbGUgKChwYXJlbnQgPSBwYXJlbnQuaG9zdCkgJiYgaXMuZG9jRnJhZyhwYXJlbnQpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyZW50O1xuICB9XG5cbiAgcmV0dXJuIHBhcmVudDtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlc1NlbGVjdG9yKGVsZW1lbnQsIHNlbGVjdG9yKSB7XG4gIC8vIHJlbW92ZSAvZGVlcC8gZnJvbSBzZWxlY3RvcnMgaWYgc2hhZG93RE9NIHBvbHlmaWxsIGlzIHVzZWRcbiAgaWYgKF93aW5kb3dbXCJkZWZhdWx0XCJdLndpbmRvdyAhPT0gX3dpbmRvd1tcImRlZmF1bHRcIl0ucmVhbFdpbmRvdykge1xuICAgIHNlbGVjdG9yID0gc2VsZWN0b3IucmVwbGFjZSgvXFwvZGVlcFxcLy9nLCAnICcpO1xuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnRbX2Jyb3dzZXJbXCJkZWZhdWx0XCJdLnByZWZpeGVkTWF0Y2hlc1NlbGVjdG9yXShzZWxlY3Rvcik7XG59IC8vIFRlc3QgZm9yIHRoZSBlbGVtZW50IHRoYXQncyBcImFib3ZlXCIgYWxsIG90aGVyIHF1YWxpZmllcnNcblxuXG5mdW5jdGlvbiBpbmRleE9mRGVlcGVzdEVsZW1lbnQoZWxlbWVudHMpIHtcbiAgdmFyIGRlZXBlc3Rab25lUGFyZW50cyA9IFtdO1xuICB2YXIgZHJvcHpvbmVQYXJlbnRzID0gW107XG4gIHZhciBkcm9wem9uZTtcbiAgdmFyIGRlZXBlc3Rab25lID0gZWxlbWVudHNbMF07XG4gIHZhciBpbmRleCA9IGRlZXBlc3Rab25lID8gMCA6IC0xO1xuICB2YXIgcGFyZW50O1xuICB2YXIgY2hpbGQ7XG4gIHZhciBpO1xuICB2YXIgbjtcblxuICBmb3IgKGkgPSAxOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBkcm9wem9uZSA9IGVsZW1lbnRzW2ldOyAvLyBhbiBlbGVtZW50IG1pZ2h0IGJlbG9uZyB0byBtdWx0aXBsZSBzZWxlY3RvciBkcm9wem9uZXNcblxuICAgIGlmICghZHJvcHpvbmUgfHwgZHJvcHpvbmUgPT09IGRlZXBlc3Rab25lKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoIWRlZXBlc3Rab25lKSB7XG4gICAgICBkZWVwZXN0Wm9uZSA9IGRyb3B6b25lO1xuICAgICAgaW5kZXggPSBpO1xuICAgICAgY29udGludWU7XG4gICAgfSAvLyBjaGVjayBpZiB0aGUgZGVlcGVzdCBvciBjdXJyZW50IGFyZSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgb3IgZG9jdW1lbnQucm9vdEVsZW1lbnRcbiAgICAvLyAtIGlmIHRoZSBjdXJyZW50IGRyb3B6b25lIGlzLCBkbyBub3RoaW5nIGFuZCBjb250aW51ZVxuXG5cbiAgICBpZiAoZHJvcHpvbmUucGFyZW50Tm9kZSA9PT0gZHJvcHpvbmUub3duZXJEb2N1bWVudCkge1xuICAgICAgY29udGludWU7XG4gICAgfSAvLyAtIGlmIGRlZXBlc3QgaXMsIHVwZGF0ZSB3aXRoIHRoZSBjdXJyZW50IGRyb3B6b25lIGFuZCBjb250aW51ZSB0byBuZXh0XG4gICAgZWxzZSBpZiAoZGVlcGVzdFpvbmUucGFyZW50Tm9kZSA9PT0gZHJvcHpvbmUub3duZXJEb2N1bWVudCkge1xuICAgICAgICBkZWVwZXN0Wm9uZSA9IGRyb3B6b25lO1xuICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgaWYgKCFkZWVwZXN0Wm9uZVBhcmVudHMubGVuZ3RoKSB7XG4gICAgICBwYXJlbnQgPSBkZWVwZXN0Wm9uZTtcblxuICAgICAgd2hpbGUgKHBhcmVudC5wYXJlbnROb2RlICYmIHBhcmVudC5wYXJlbnROb2RlICE9PSBwYXJlbnQub3duZXJEb2N1bWVudCkge1xuICAgICAgICBkZWVwZXN0Wm9uZVBhcmVudHMudW5zaGlmdChwYXJlbnQpO1xuICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50Tm9kZTtcbiAgICAgIH1cbiAgICB9IC8vIGlmIHRoaXMgZWxlbWVudCBpcyBhbiBzdmcgZWxlbWVudCBhbmQgdGhlIGN1cnJlbnQgZGVlcGVzdCBpc1xuICAgIC8vIGFuIEhUTUxFbGVtZW50XG5cblxuICAgIGlmIChkZWVwZXN0Wm9uZSBpbnN0YW5jZW9mIF9kb21PYmplY3RzW1wiZGVmYXVsdFwiXS5IVE1MRWxlbWVudCAmJiBkcm9wem9uZSBpbnN0YW5jZW9mIF9kb21PYmplY3RzW1wiZGVmYXVsdFwiXS5TVkdFbGVtZW50ICYmICEoZHJvcHpvbmUgaW5zdGFuY2VvZiBfZG9tT2JqZWN0c1tcImRlZmF1bHRcIl0uU1ZHU1ZHRWxlbWVudCkpIHtcbiAgICAgIGlmIChkcm9wem9uZSA9PT0gZGVlcGVzdFpvbmUucGFyZW50Tm9kZSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgcGFyZW50ID0gZHJvcHpvbmUub3duZXJTVkdFbGVtZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJlbnQgPSBkcm9wem9uZTtcbiAgICB9XG5cbiAgICBkcm9wem9uZVBhcmVudHMgPSBbXTtcblxuICAgIHdoaWxlIChwYXJlbnQucGFyZW50Tm9kZSAhPT0gcGFyZW50Lm93bmVyRG9jdW1lbnQpIHtcbiAgICAgIGRyb3B6b25lUGFyZW50cy51bnNoaWZ0KHBhcmVudCk7XG4gICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50Tm9kZTtcbiAgICB9XG5cbiAgICBuID0gMDsgLy8gZ2V0IChwb3NpdGlvbiBvZiBsYXN0IGNvbW1vbiBhbmNlc3RvcikgKyAxXG5cbiAgICB3aGlsZSAoZHJvcHpvbmVQYXJlbnRzW25dICYmIGRyb3B6b25lUGFyZW50c1tuXSA9PT0gZGVlcGVzdFpvbmVQYXJlbnRzW25dKSB7XG4gICAgICBuKys7XG4gICAgfVxuXG4gICAgdmFyIHBhcmVudHMgPSBbZHJvcHpvbmVQYXJlbnRzW24gLSAxXSwgZHJvcHpvbmVQYXJlbnRzW25dLCBkZWVwZXN0Wm9uZVBhcmVudHNbbl1dO1xuICAgIGNoaWxkID0gcGFyZW50c1swXS5sYXN0Q2hpbGQ7XG5cbiAgICB3aGlsZSAoY2hpbGQpIHtcbiAgICAgIGlmIChjaGlsZCA9PT0gcGFyZW50c1sxXSkge1xuICAgICAgICBkZWVwZXN0Wm9uZSA9IGRyb3B6b25lO1xuICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgIGRlZXBlc3Rab25lUGFyZW50cyA9IFtdO1xuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSBpZiAoY2hpbGQgPT09IHBhcmVudHNbMl0pIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGNoaWxkID0gY2hpbGQucHJldmlvdXNTaWJsaW5nO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpbmRleDtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlc1VwVG8oZWxlbWVudCwgc2VsZWN0b3IsIGxpbWl0KSB7XG4gIHdoaWxlIChpcy5lbGVtZW50KGVsZW1lbnQpKSB7XG4gICAgaWYgKG1hdGNoZXNTZWxlY3RvcihlbGVtZW50LCBzZWxlY3RvcikpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGVsZW1lbnQgPSBwYXJlbnROb2RlKGVsZW1lbnQpO1xuXG4gICAgaWYgKGVsZW1lbnQgPT09IGxpbWl0KSB7XG4gICAgICByZXR1cm4gbWF0Y2hlc1NlbGVjdG9yKGVsZW1lbnQsIHNlbGVjdG9yKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGdldEFjdHVhbEVsZW1lbnQoZWxlbWVudCkge1xuICByZXR1cm4gZWxlbWVudCBpbnN0YW5jZW9mIF9kb21PYmplY3RzW1wiZGVmYXVsdFwiXS5TVkdFbGVtZW50SW5zdGFuY2UgPyBlbGVtZW50LmNvcnJlc3BvbmRpbmdVc2VFbGVtZW50IDogZWxlbWVudDtcbn1cblxuZnVuY3Rpb24gZ2V0U2Nyb2xsWFkocmVsZXZhbnRXaW5kb3cpIHtcbiAgcmVsZXZhbnRXaW5kb3cgPSByZWxldmFudFdpbmRvdyB8fCBfd2luZG93W1wiZGVmYXVsdFwiXS53aW5kb3c7XG4gIHJldHVybiB7XG4gICAgeDogcmVsZXZhbnRXaW5kb3cuc2Nyb2xsWCB8fCByZWxldmFudFdpbmRvdy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCxcbiAgICB5OiByZWxldmFudFdpbmRvdy5zY3JvbGxZIHx8IHJlbGV2YW50V2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3BcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0RWxlbWVudENsaWVudFJlY3QoZWxlbWVudCkge1xuICB2YXIgY2xpZW50UmVjdCA9IGVsZW1lbnQgaW5zdGFuY2VvZiBfZG9tT2JqZWN0c1tcImRlZmF1bHRcIl0uU1ZHRWxlbWVudCA/IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkgOiBlbGVtZW50LmdldENsaWVudFJlY3RzKClbMF07XG4gIHJldHVybiBjbGllbnRSZWN0ICYmIHtcbiAgICBsZWZ0OiBjbGllbnRSZWN0LmxlZnQsXG4gICAgcmlnaHQ6IGNsaWVudFJlY3QucmlnaHQsXG4gICAgdG9wOiBjbGllbnRSZWN0LnRvcCxcbiAgICBib3R0b206IGNsaWVudFJlY3QuYm90dG9tLFxuICAgIHdpZHRoOiBjbGllbnRSZWN0LndpZHRoIHx8IGNsaWVudFJlY3QucmlnaHQgLSBjbGllbnRSZWN0LmxlZnQsXG4gICAgaGVpZ2h0OiBjbGllbnRSZWN0LmhlaWdodCB8fCBjbGllbnRSZWN0LmJvdHRvbSAtIGNsaWVudFJlY3QudG9wXG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldEVsZW1lbnRSZWN0KGVsZW1lbnQpIHtcbiAgdmFyIGNsaWVudFJlY3QgPSBnZXRFbGVtZW50Q2xpZW50UmVjdChlbGVtZW50KTtcblxuICBpZiAoIV9icm93c2VyW1wiZGVmYXVsdFwiXS5pc0lPUzcgJiYgY2xpZW50UmVjdCkge1xuICAgIHZhciBzY3JvbGwgPSBnZXRTY3JvbGxYWShfd2luZG93W1wiZGVmYXVsdFwiXS5nZXRXaW5kb3coZWxlbWVudCkpO1xuICAgIGNsaWVudFJlY3QubGVmdCArPSBzY3JvbGwueDtcbiAgICBjbGllbnRSZWN0LnJpZ2h0ICs9IHNjcm9sbC54O1xuICAgIGNsaWVudFJlY3QudG9wICs9IHNjcm9sbC55O1xuICAgIGNsaWVudFJlY3QuYm90dG9tICs9IHNjcm9sbC55O1xuICB9XG5cbiAgcmV0dXJuIGNsaWVudFJlY3Q7XG59XG5cbmZ1bmN0aW9uIGdldFBhdGgoZWxlbWVudCkge1xuICB2YXIgcGF0aCA9IFtdO1xuXG4gIHdoaWxlIChlbGVtZW50KSB7XG4gICAgcGF0aC5wdXNoKGVsZW1lbnQpO1xuICAgIGVsZW1lbnQgPSBwYXJlbnROb2RlKGVsZW1lbnQpO1xuICB9XG5cbiAgcmV0dXJuIHBhdGg7XG59XG5cbmZ1bmN0aW9uIHRyeVNlbGVjdG9yKHZhbHVlKSB7XG4gIGlmICghaXMuc3RyaW5nKHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSAvLyBhbiBleGNlcHRpb24gd2lsbCBiZSByYWlzZWQgaWYgaXQgaXMgaW52YWxpZFxuXG5cbiAgX2RvbU9iamVjdHNbXCJkZWZhdWx0XCJdLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodmFsdWUpO1xuXG4gIHJldHVybiB0cnVlO1xufVxuXG59LHtcIi4vYnJvd3NlclwiOjQ3LFwiLi9kb21PYmplY3RzXCI6NDksXCIuL2lzXCI6NTYsXCIuL3dpbmRvd1wiOjY1fV0sNTE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGV4cG9ydHMuRmFrZUV2ZW50ID0gdm9pZCAwO1xuXG52YXIgX2FycjIgPSByZXF1aXJlKFwiLi9hcnJcIik7XG5cbnZhciBkb21VdGlscyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKHJlcXVpcmUoXCIuL2RvbVV0aWxzXCIpKTtcblxudmFyIGlzID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQocmVxdWlyZShcIi4vaXNcIikpO1xuXG52YXIgX3BvaW50ZXJFeHRlbmQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL3BvaW50ZXJFeHRlbmRcIikpO1xuXG52YXIgX3BvaW50ZXJVdGlscyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vcG9pbnRlclV0aWxzXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHsgdmFyIGRlc2MgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkgJiYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBrZXkpIDoge307IGlmIChkZXNjLmdldCB8fCBkZXNjLnNldCkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkobmV3T2JqLCBrZXksIGRlc2MpOyB9IGVsc2UgeyBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gfSB9IG5ld09ialtcImRlZmF1bHRcIl0gPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbmZ1bmN0aW9uIF9zbGljZWRUb0FycmF5KGFyciwgaSkgeyByZXR1cm4gX2FycmF5V2l0aEhvbGVzKGFycikgfHwgX2l0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkgfHwgX25vbkl0ZXJhYmxlUmVzdCgpOyB9XG5cbmZ1bmN0aW9uIF9ub25JdGVyYWJsZVJlc3QoKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlXCIpOyB9XG5cbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHsgdmFyIF9hcnIgPSBbXTsgdmFyIF9uID0gdHJ1ZTsgdmFyIF9kID0gZmFsc2U7IHZhciBfZSA9IHVuZGVmaW5lZDsgdHJ5IHsgZm9yICh2YXIgX2kgPSBhcnJbU3ltYm9sLml0ZXJhdG9yXSgpLCBfczsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkgeyBfYXJyLnB1c2goX3MudmFsdWUpOyBpZiAoaSAmJiBfYXJyLmxlbmd0aCA9PT0gaSkgYnJlYWs7IH0gfSBjYXRjaCAoZXJyKSB7IF9kID0gdHJ1ZTsgX2UgPSBlcnI7IH0gZmluYWxseSB7IHRyeSB7IGlmICghX24gJiYgX2lbXCJyZXR1cm5cIl0gIT0gbnVsbCkgX2lbXCJyZXR1cm5cIl0oKTsgfSBmaW5hbGx5IHsgaWYgKF9kKSB0aHJvdyBfZTsgfSB9IHJldHVybiBfYXJyOyB9XG5cbmZ1bmN0aW9uIF9hcnJheVdpdGhIb2xlcyhhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgcmV0dXJuIGFycjsgfVxuXG52YXIgZWxlbWVudHMgPSBbXTtcbnZhciB0YXJnZXRzID0gW107XG52YXIgZGVsZWdhdGVkRXZlbnRzID0ge307XG52YXIgZG9jdW1lbnRzID0gW107XG5cbmZ1bmN0aW9uIGFkZChlbGVtZW50LCB0eXBlLCBsaXN0ZW5lciwgb3B0aW9uYWxBcmcpIHtcbiAgdmFyIG9wdGlvbnMgPSBnZXRPcHRpb25zKG9wdGlvbmFsQXJnKTtcbiAgdmFyIGVsZW1lbnRJbmRleCA9IGVsZW1lbnRzLmluZGV4T2YoZWxlbWVudCk7XG4gIHZhciB0YXJnZXQgPSB0YXJnZXRzW2VsZW1lbnRJbmRleF07XG5cbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0YXJnZXQgPSB7XG4gICAgICBldmVudHM6IHt9LFxuICAgICAgdHlwZUNvdW50OiAwXG4gICAgfTtcbiAgICBlbGVtZW50SW5kZXggPSBlbGVtZW50cy5wdXNoKGVsZW1lbnQpIC0gMTtcbiAgICB0YXJnZXRzLnB1c2godGFyZ2V0KTtcbiAgfVxuXG4gIGlmICghdGFyZ2V0LmV2ZW50c1t0eXBlXSkge1xuICAgIHRhcmdldC5ldmVudHNbdHlwZV0gPSBbXTtcbiAgICB0YXJnZXQudHlwZUNvdW50Kys7XG4gIH1cblxuICBpZiAoISgwLCBfYXJyMi5jb250YWlucykodGFyZ2V0LmV2ZW50c1t0eXBlXSwgbGlzdGVuZXIpKSB7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCBldmVudHMuc3VwcG9ydHNPcHRpb25zID8gb3B0aW9ucyA6ICEhb3B0aW9ucy5jYXB0dXJlKTtcbiAgICB0YXJnZXQuZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZShlbGVtZW50LCB0eXBlLCBsaXN0ZW5lciwgb3B0aW9uYWxBcmcpIHtcbiAgdmFyIG9wdGlvbnMgPSBnZXRPcHRpb25zKG9wdGlvbmFsQXJnKTtcbiAgdmFyIGVsZW1lbnRJbmRleCA9IGVsZW1lbnRzLmluZGV4T2YoZWxlbWVudCk7XG4gIHZhciB0YXJnZXQgPSB0YXJnZXRzW2VsZW1lbnRJbmRleF07XG5cbiAgaWYgKCF0YXJnZXQgfHwgIXRhcmdldC5ldmVudHMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAodHlwZSA9PT0gJ2FsbCcpIHtcbiAgICBmb3IgKHR5cGUgaW4gdGFyZ2V0LmV2ZW50cykge1xuICAgICAgaWYgKHRhcmdldC5ldmVudHMuaGFzT3duUHJvcGVydHkodHlwZSkpIHtcbiAgICAgICAgcmVtb3ZlKGVsZW1lbnQsIHR5cGUsICdhbGwnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAodGFyZ2V0LmV2ZW50c1t0eXBlXSkge1xuICAgIHZhciBsZW4gPSB0YXJnZXQuZXZlbnRzW3R5cGVdLmxlbmd0aDtcblxuICAgIGlmIChsaXN0ZW5lciA9PT0gJ2FsbCcpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgcmVtb3ZlKGVsZW1lbnQsIHR5cGUsIHRhcmdldC5ldmVudHNbdHlwZV1baV0sIG9wdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsZW47IF9pKyspIHtcbiAgICAgICAgaWYgKHRhcmdldC5ldmVudHNbdHlwZV1bX2ldID09PSBsaXN0ZW5lcikge1xuICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgZXZlbnRzLnN1cHBvcnRzT3B0aW9ucyA/IG9wdGlvbnMgOiAhIW9wdGlvbnMuY2FwdHVyZSk7XG4gICAgICAgICAgdGFyZ2V0LmV2ZW50c1t0eXBlXS5zcGxpY2UoX2ksIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRhcmdldC5ldmVudHNbdHlwZV0gJiYgdGFyZ2V0LmV2ZW50c1t0eXBlXS5sZW5ndGggPT09IDApIHtcbiAgICAgIHRhcmdldC5ldmVudHNbdHlwZV0gPSBudWxsO1xuICAgICAgdGFyZ2V0LnR5cGVDb3VudC0tO1xuICAgIH1cbiAgfVxuXG4gIGlmICghdGFyZ2V0LnR5cGVDb3VudCkge1xuICAgIHRhcmdldHMuc3BsaWNlKGVsZW1lbnRJbmRleCwgMSk7XG4gICAgZWxlbWVudHMuc3BsaWNlKGVsZW1lbnRJbmRleCwgMSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkRGVsZWdhdGUoc2VsZWN0b3IsIGNvbnRleHQsIHR5cGUsIGxpc3RlbmVyLCBvcHRpb25hbEFyZykge1xuICB2YXIgb3B0aW9ucyA9IGdldE9wdGlvbnMob3B0aW9uYWxBcmcpO1xuXG4gIGlmICghZGVsZWdhdGVkRXZlbnRzW3R5cGVdKSB7XG4gICAgZGVsZWdhdGVkRXZlbnRzW3R5cGVdID0ge1xuICAgICAgY29udGV4dHM6IFtdLFxuICAgICAgbGlzdGVuZXJzOiBbXSxcbiAgICAgIHNlbGVjdG9yczogW11cbiAgICB9OyAvLyBhZGQgZGVsZWdhdGUgbGlzdGVuZXIgZnVuY3Rpb25zXG5cbiAgICBmb3IgKHZhciBfaTIgPSAwOyBfaTIgPCBkb2N1bWVudHMubGVuZ3RoOyBfaTIrKykge1xuICAgICAgdmFyIGRvYyA9IGRvY3VtZW50c1tfaTJdO1xuICAgICAgYWRkKGRvYywgdHlwZSwgZGVsZWdhdGVMaXN0ZW5lcik7XG4gICAgICBhZGQoZG9jLCB0eXBlLCBkZWxlZ2F0ZVVzZUNhcHR1cmUsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBkZWxlZ2F0ZWQgPSBkZWxlZ2F0ZWRFdmVudHNbdHlwZV07XG4gIHZhciBpbmRleDtcblxuICBmb3IgKGluZGV4ID0gZGVsZWdhdGVkLnNlbGVjdG9ycy5sZW5ndGggLSAxOyBpbmRleCA+PSAwOyBpbmRleC0tKSB7XG4gICAgaWYgKGRlbGVnYXRlZC5zZWxlY3RvcnNbaW5kZXhdID09PSBzZWxlY3RvciAmJiBkZWxlZ2F0ZWQuY29udGV4dHNbaW5kZXhdID09PSBjb250ZXh0KSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgaW5kZXggPSBkZWxlZ2F0ZWQuc2VsZWN0b3JzLmxlbmd0aDtcbiAgICBkZWxlZ2F0ZWQuc2VsZWN0b3JzLnB1c2goc2VsZWN0b3IpO1xuICAgIGRlbGVnYXRlZC5jb250ZXh0cy5wdXNoKGNvbnRleHQpO1xuICAgIGRlbGVnYXRlZC5saXN0ZW5lcnMucHVzaChbXSk7XG4gIH0gLy8ga2VlcCBsaXN0ZW5lciBhbmQgY2FwdHVyZSBhbmQgcGFzc2l2ZSBmbGFnc1xuXG5cbiAgZGVsZWdhdGVkLmxpc3RlbmVyc1tpbmRleF0ucHVzaChbbGlzdGVuZXIsICEhb3B0aW9ucy5jYXB0dXJlLCBvcHRpb25zLnBhc3NpdmVdKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlRGVsZWdhdGUoc2VsZWN0b3IsIGNvbnRleHQsIHR5cGUsIGxpc3RlbmVyLCBvcHRpb25hbEFyZykge1xuICB2YXIgb3B0aW9ucyA9IGdldE9wdGlvbnMob3B0aW9uYWxBcmcpO1xuICB2YXIgZGVsZWdhdGVkID0gZGVsZWdhdGVkRXZlbnRzW3R5cGVdO1xuICB2YXIgbWF0Y2hGb3VuZCA9IGZhbHNlO1xuICB2YXIgaW5kZXg7XG5cbiAgaWYgKCFkZWxlZ2F0ZWQpIHtcbiAgICByZXR1cm47XG4gIH0gLy8gY291bnQgZnJvbSBsYXN0IGluZGV4IG9mIGRlbGVnYXRlZCB0byAwXG5cblxuICBmb3IgKGluZGV4ID0gZGVsZWdhdGVkLnNlbGVjdG9ycy5sZW5ndGggLSAxOyBpbmRleCA+PSAwOyBpbmRleC0tKSB7XG4gICAgLy8gbG9vayBmb3IgbWF0Y2hpbmcgc2VsZWN0b3IgYW5kIGNvbnRleHQgTm9kZVxuICAgIGlmIChkZWxlZ2F0ZWQuc2VsZWN0b3JzW2luZGV4XSA9PT0gc2VsZWN0b3IgJiYgZGVsZWdhdGVkLmNvbnRleHRzW2luZGV4XSA9PT0gY29udGV4dCkge1xuICAgICAgdmFyIGxpc3RlbmVycyA9IGRlbGVnYXRlZC5saXN0ZW5lcnNbaW5kZXhdOyAvLyBlYWNoIGl0ZW0gb2YgdGhlIGxpc3RlbmVycyBhcnJheSBpcyBhbiBhcnJheTogW2Z1bmN0aW9uLCBjYXB0dXJlLCBwYXNzaXZlXVxuXG4gICAgICBmb3IgKHZhciBpID0gbGlzdGVuZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIHZhciBfbGlzdGVuZXJzJGkgPSBfc2xpY2VkVG9BcnJheShsaXN0ZW5lcnNbaV0sIDMpLFxuICAgICAgICAgICAgZm4gPSBfbGlzdGVuZXJzJGlbMF0sXG4gICAgICAgICAgICBjYXB0dXJlID0gX2xpc3RlbmVycyRpWzFdLFxuICAgICAgICAgICAgcGFzc2l2ZSA9IF9saXN0ZW5lcnMkaVsyXTsgLy8gY2hlY2sgaWYgdGhlIGxpc3RlbmVyIGZ1bmN0aW9ucyBhbmQgY2FwdHVyZSBhbmQgcGFzc2l2ZSBmbGFncyBtYXRjaFxuXG5cbiAgICAgICAgaWYgKGZuID09PSBsaXN0ZW5lciAmJiBjYXB0dXJlID09PSAhIW9wdGlvbnMuY2FwdHVyZSAmJiBwYXNzaXZlID09PSBvcHRpb25zLnBhc3NpdmUpIHtcbiAgICAgICAgICAvLyByZW1vdmUgdGhlIGxpc3RlbmVyIGZyb20gdGhlIGFycmF5IG9mIGxpc3RlbmVyc1xuICAgICAgICAgIGxpc3RlbmVycy5zcGxpY2UoaSwgMSk7IC8vIGlmIGFsbCBsaXN0ZW5lcnMgZm9yIHRoaXMgaW50ZXJhY3RhYmxlIGhhdmUgYmVlbiByZW1vdmVkXG4gICAgICAgICAgLy8gcmVtb3ZlIHRoZSBpbnRlcmFjdGFibGUgZnJvbSB0aGUgZGVsZWdhdGVkIGFycmF5c1xuXG4gICAgICAgICAgaWYgKCFsaXN0ZW5lcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBkZWxlZ2F0ZWQuc2VsZWN0b3JzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICBkZWxlZ2F0ZWQuY29udGV4dHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIGRlbGVnYXRlZC5saXN0ZW5lcnMuc3BsaWNlKGluZGV4LCAxKTsgLy8gcmVtb3ZlIGRlbGVnYXRlIGZ1bmN0aW9uIGZyb20gY29udGV4dFxuXG4gICAgICAgICAgICByZW1vdmUoY29udGV4dCwgdHlwZSwgZGVsZWdhdGVMaXN0ZW5lcik7XG4gICAgICAgICAgICByZW1vdmUoY29udGV4dCwgdHlwZSwgZGVsZWdhdGVVc2VDYXB0dXJlLCB0cnVlKTsgLy8gcmVtb3ZlIHRoZSBhcnJheXMgaWYgdGhleSBhcmUgZW1wdHlcblxuICAgICAgICAgICAgaWYgKCFkZWxlZ2F0ZWQuc2VsZWN0b3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgICBkZWxlZ2F0ZWRFdmVudHNbdHlwZV0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gLy8gb25seSByZW1vdmUgb25lIGxpc3RlbmVyXG5cblxuICAgICAgICAgIG1hdGNoRm91bmQgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChtYXRjaEZvdW5kKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSAvLyBib3VuZCB0byB0aGUgaW50ZXJhY3RhYmxlIGNvbnRleHQgd2hlbiBhIERPTSBldmVudFxuLy8gbGlzdGVuZXIgaXMgYWRkZWQgdG8gYSBzZWxlY3RvciBpbnRlcmFjdGFibGVcblxuXG5mdW5jdGlvbiBkZWxlZ2F0ZUxpc3RlbmVyKGV2ZW50LCBvcHRpb25hbEFyZykge1xuICB2YXIgb3B0aW9ucyA9IGdldE9wdGlvbnMob3B0aW9uYWxBcmcpO1xuICB2YXIgZmFrZUV2ZW50ID0gbmV3IEZha2VFdmVudChldmVudCk7XG4gIHZhciBkZWxlZ2F0ZWQgPSBkZWxlZ2F0ZWRFdmVudHNbZXZlbnQudHlwZV07XG5cbiAgdmFyIF9wb2ludGVyVXRpbHMkZ2V0RXZlbiA9IF9wb2ludGVyVXRpbHNbXCJkZWZhdWx0XCJdLmdldEV2ZW50VGFyZ2V0cyhldmVudCksXG4gICAgICBfcG9pbnRlclV0aWxzJGdldEV2ZW4yID0gX3NsaWNlZFRvQXJyYXkoX3BvaW50ZXJVdGlscyRnZXRFdmVuLCAxKSxcbiAgICAgIGV2ZW50VGFyZ2V0ID0gX3BvaW50ZXJVdGlscyRnZXRFdmVuMlswXTtcblxuICB2YXIgZWxlbWVudCA9IGV2ZW50VGFyZ2V0OyAvLyBjbGltYiB1cCBkb2N1bWVudCB0cmVlIGxvb2tpbmcgZm9yIHNlbGVjdG9yIG1hdGNoZXNcblxuICB3aGlsZSAoaXMuZWxlbWVudChlbGVtZW50KSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGVsZWdhdGVkLnNlbGVjdG9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNlbGVjdG9yID0gZGVsZWdhdGVkLnNlbGVjdG9yc1tpXTtcbiAgICAgIHZhciBjb250ZXh0ID0gZGVsZWdhdGVkLmNvbnRleHRzW2ldO1xuXG4gICAgICBpZiAoZG9tVXRpbHMubWF0Y2hlc1NlbGVjdG9yKGVsZW1lbnQsIHNlbGVjdG9yKSAmJiBkb21VdGlscy5ub2RlQ29udGFpbnMoY29udGV4dCwgZXZlbnRUYXJnZXQpICYmIGRvbVV0aWxzLm5vZGVDb250YWlucyhjb250ZXh0LCBlbGVtZW50KSkge1xuICAgICAgICB2YXIgbGlzdGVuZXJzID0gZGVsZWdhdGVkLmxpc3RlbmVyc1tpXTtcbiAgICAgICAgZmFrZUV2ZW50LmN1cnJlbnRUYXJnZXQgPSBlbGVtZW50O1xuXG4gICAgICAgIGZvciAodmFyIF9pMyA9IDA7IF9pMyA8IGxpc3RlbmVycy5sZW5ndGg7IF9pMysrKSB7XG4gICAgICAgICAgdmFyIF9yZWY7XG5cbiAgICAgICAgICBfcmVmID0gbGlzdGVuZXJzW19pM107XG5cbiAgICAgICAgICB2YXIgX3JlZjIgPSBfcmVmLFxuICAgICAgICAgICAgICBfcmVmMyA9IF9zbGljZWRUb0FycmF5KF9yZWYyLCAzKSxcbiAgICAgICAgICAgICAgZm4gPSBfcmVmM1swXSxcbiAgICAgICAgICAgICAgY2FwdHVyZSA9IF9yZWYzWzFdLFxuICAgICAgICAgICAgICBwYXNzaXZlID0gX3JlZjNbMl07XG5cbiAgICAgICAgICBpZiAoY2FwdHVyZSA9PT0gISFvcHRpb25zLmNhcHR1cmUgJiYgcGFzc2l2ZSA9PT0gb3B0aW9ucy5wYXNzaXZlKSB7XG4gICAgICAgICAgICBmbihmYWtlRXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGVsZW1lbnQgPSBkb21VdGlscy5wYXJlbnROb2RlKGVsZW1lbnQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGRlbGVnYXRlVXNlQ2FwdHVyZShldmVudCkge1xuICByZXR1cm4gZGVsZWdhdGVMaXN0ZW5lci5jYWxsKHRoaXMsIGV2ZW50LCB0cnVlKTtcbn1cblxuZnVuY3Rpb24gZ2V0T3B0aW9ucyhwYXJhbSkge1xuICByZXR1cm4gaXMub2JqZWN0KHBhcmFtKSA/IHBhcmFtIDoge1xuICAgIGNhcHR1cmU6IHBhcmFtXG4gIH07XG59XG5cbnZhciBGYWtlRXZlbnQgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBGYWtlRXZlbnQob3JpZ2luYWxFdmVudCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBGYWtlRXZlbnQpO1xuXG4gICAgdGhpcy5vcmlnaW5hbEV2ZW50ID0gb3JpZ2luYWxFdmVudDsgLy8gZHVwbGljYXRlIHRoZSBldmVudCBzbyB0aGF0IGN1cnJlbnRUYXJnZXQgY2FuIGJlIGNoYW5nZWRcblxuICAgICgwLCBfcG9pbnRlckV4dGVuZFtcImRlZmF1bHRcIl0pKHRoaXMsIG9yaWdpbmFsRXZlbnQpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEZha2VFdmVudCwgW3tcbiAgICBrZXk6IFwicHJldmVudE9yaWdpbmFsRGVmYXVsdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwcmV2ZW50T3JpZ2luYWxEZWZhdWx0KCkge1xuICAgICAgdGhpcy5vcmlnaW5hbEV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInN0b3BQcm9wYWdhdGlvblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdG9wUHJvcGFnYXRpb24oKSB7XG4gICAgICB0aGlzLm9yaWdpbmFsRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKSB7XG4gICAgICB0aGlzLm9yaWdpbmFsRXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEZha2VFdmVudDtcbn0oKTtcblxuZXhwb3J0cy5GYWtlRXZlbnQgPSBGYWtlRXZlbnQ7XG52YXIgZXZlbnRzID0ge1xuICBhZGQ6IGFkZCxcbiAgcmVtb3ZlOiByZW1vdmUsXG4gIGFkZERlbGVnYXRlOiBhZGREZWxlZ2F0ZSxcbiAgcmVtb3ZlRGVsZWdhdGU6IHJlbW92ZURlbGVnYXRlLFxuICBkZWxlZ2F0ZUxpc3RlbmVyOiBkZWxlZ2F0ZUxpc3RlbmVyLFxuICBkZWxlZ2F0ZVVzZUNhcHR1cmU6IGRlbGVnYXRlVXNlQ2FwdHVyZSxcbiAgZGVsZWdhdGVkRXZlbnRzOiBkZWxlZ2F0ZWRFdmVudHMsXG4gIGRvY3VtZW50czogZG9jdW1lbnRzLFxuICBzdXBwb3J0c09wdGlvbnM6IGZhbHNlLFxuICBzdXBwb3J0c1Bhc3NpdmU6IGZhbHNlLFxuICBfZWxlbWVudHM6IGVsZW1lbnRzLFxuICBfdGFyZ2V0czogdGFyZ2V0cyxcbiAgaW5pdDogZnVuY3Rpb24gaW5pdCh3aW5kb3cpIHtcbiAgICB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykuYWRkRXZlbnRMaXN0ZW5lcigndGVzdCcsIG51bGwsIHtcbiAgICAgIGdldCBjYXB0dXJlKCkge1xuICAgICAgICByZXR1cm4gZXZlbnRzLnN1cHBvcnRzT3B0aW9ucyA9IHRydWU7XG4gICAgICB9LFxuXG4gICAgICBnZXQgcGFzc2l2ZSgpIHtcbiAgICAgICAgcmV0dXJuIGV2ZW50cy5zdXBwb3J0c1Bhc3NpdmUgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgfSk7XG4gIH1cbn07XG52YXIgX2RlZmF1bHQgPSBldmVudHM7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0O1xuXG59LHtcIi4vYXJyXCI6NDYsXCIuL2RvbVV0aWxzXCI6NTAsXCIuL2lzXCI6NTYsXCIuL3BvaW50ZXJFeHRlbmRcIjo1OSxcIi4vcG9pbnRlclV0aWxzXCI6NjB9XSw1MjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gZXh0ZW5kO1xuXG5mdW5jdGlvbiBleHRlbmQoZGVzdCwgc291cmNlKSB7XG4gIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgZGVzdFtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgfVxuXG4gIHJldHVybiBkZXN0O1xufVxuXG59LHt9XSw1MzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5cbnZhciBfcmVjdCA9IHJlcXVpcmUoXCIuL3JlY3RcIik7XG5cbmZ1bmN0aW9uIF9kZWZhdWx0KHRhcmdldCwgZWxlbWVudCwgYWN0aW9uKSB7XG4gIHZhciBhY3Rpb25PcHRpb25zID0gdGFyZ2V0Lm9wdGlvbnNbYWN0aW9uXTtcbiAgdmFyIGFjdGlvbk9yaWdpbiA9IGFjdGlvbk9wdGlvbnMgJiYgYWN0aW9uT3B0aW9ucy5vcmlnaW47XG4gIHZhciBvcmlnaW4gPSBhY3Rpb25PcmlnaW4gfHwgdGFyZ2V0Lm9wdGlvbnMub3JpZ2luO1xuICB2YXIgb3JpZ2luUmVjdCA9ICgwLCBfcmVjdC5yZXNvbHZlUmVjdExpa2UpKG9yaWdpbiwgdGFyZ2V0LCBlbGVtZW50LCBbdGFyZ2V0ICYmIGVsZW1lbnRdKTtcbiAgcmV0dXJuICgwLCBfcmVjdC5yZWN0VG9YWSkob3JpZ2luUmVjdCkgfHwge1xuICAgIHg6IDAsXG4gICAgeTogMFxuICB9O1xufVxuXG59LHtcIi4vcmVjdFwiOjYyfV0sNTQ6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF9kZWZhdWx0ID0gZnVuY3Rpb24gX2RlZmF1bHQoeCwgeSkge1xuICByZXR1cm4gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xufTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBfZGVmYXVsdDtcblxufSx7fV0sNTU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLndhcm5PbmNlID0gd2Fybk9uY2U7XG5leHBvcnRzLl9nZXRRQmV6aWVyVmFsdWUgPSBfZ2V0UUJlemllclZhbHVlO1xuZXhwb3J0cy5nZXRRdWFkcmF0aWNDdXJ2ZVBvaW50ID0gZ2V0UXVhZHJhdGljQ3VydmVQb2ludDtcbmV4cG9ydHMuZWFzZU91dFF1YWQgPSBlYXNlT3V0UXVhZDtcbmV4cG9ydHMuY29weUFjdGlvbiA9IGNvcHlBY3Rpb247XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJ3aW5cIiwge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3dpbmRvd1tcImRlZmF1bHRcIl07XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiYnJvd3NlclwiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfYnJvd3NlcltcImRlZmF1bHRcIl07XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiY2xvbmVcIiwge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2Nsb25lW1wiZGVmYXVsdFwiXTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJldmVudHNcIiwge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2V2ZW50c1tcImRlZmF1bHRcIl07XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiZXh0ZW5kXCIsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9leHRlbmRbXCJkZWZhdWx0XCJdO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImdldE9yaWdpblhZXCIsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9nZXRPcmlnaW5YWVtcImRlZmF1bHRcIl07XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaHlwb3RcIiwge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2h5cG90W1wiZGVmYXVsdFwiXTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJub3JtYWxpemVMaXN0ZW5lcnNcIiwge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX25vcm1hbGl6ZUxpc3RlbmVyc1tcImRlZmF1bHRcIl07XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwicG9pbnRlclwiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfcG9pbnRlclV0aWxzW1wiZGVmYXVsdFwiXTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJyYWZcIiwge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3JhZltcImRlZmF1bHRcIl07XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwicmVjdFwiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfcmVjdFtcImRlZmF1bHRcIl07XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiU2lnbmFsc1wiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfU2lnbmFsc1tcImRlZmF1bHRcIl07XG4gIH1cbn0pO1xuZXhwb3J0cy5pcyA9IGV4cG9ydHMuZG9tID0gZXhwb3J0cy5hcnIgPSB2b2lkIDA7XG5cbnZhciBhcnIgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChyZXF1aXJlKFwiLi9hcnJcIikpO1xuXG5leHBvcnRzLmFyciA9IGFycjtcblxudmFyIGRvbSA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKHJlcXVpcmUoXCIuL2RvbVV0aWxzXCIpKTtcblxuZXhwb3J0cy5kb20gPSBkb207XG5cbnZhciBpcyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKHJlcXVpcmUoXCIuL2lzXCIpKTtcblxuZXhwb3J0cy5pcyA9IGlzO1xuXG52YXIgX3dpbmRvdyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vd2luZG93XCIpKTtcblxudmFyIF9icm93c2VyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9icm93c2VyXCIpKTtcblxudmFyIF9jbG9uZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vY2xvbmVcIikpO1xuXG52YXIgX2V2ZW50cyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vZXZlbnRzXCIpKTtcblxudmFyIF9leHRlbmQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL2V4dGVuZFwiKSk7XG5cbnZhciBfZ2V0T3JpZ2luWFkgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL2dldE9yaWdpblhZXCIpKTtcblxudmFyIF9oeXBvdCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vaHlwb3RcIikpO1xuXG52YXIgX25vcm1hbGl6ZUxpc3RlbmVycyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vbm9ybWFsaXplTGlzdGVuZXJzXCIpKTtcblxudmFyIF9wb2ludGVyVXRpbHMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL3BvaW50ZXJVdGlsc1wiKSk7XG5cbnZhciBfcmFmID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9yYWZcIikpO1xuXG52YXIgX3JlY3QgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL3JlY3RcIikpO1xuXG52YXIgX1NpZ25hbHMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL1NpZ25hbHNcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iajsgfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgeyB2YXIgZGVzYyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID8gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIGtleSkgOiB7fTsgaWYgKGRlc2MuZ2V0IHx8IGRlc2Muc2V0KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuZXdPYmosIGtleSwgZGVzYyk7IH0gZWxzZSB7IG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSB9IH0gbmV3T2JqW1wiZGVmYXVsdFwiXSA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cbmZ1bmN0aW9uIHdhcm5PbmNlKG1ldGhvZCwgbWVzc2FnZSkge1xuICB2YXIgd2FybmVkID0gZmFsc2U7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zaGFkb3dcblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICBfd2luZG93W1wiZGVmYXVsdFwiXS53aW5kb3cuY29uc29sZS53YXJuKG1lc3NhZ2UpO1xuXG4gICAgICB3YXJuZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBtZXRob2QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcbn0gLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTYzNDUyOC8yMjgwODg4XG5cblxuZnVuY3Rpb24gX2dldFFCZXppZXJWYWx1ZSh0LCBwMSwgcDIsIHAzKSB7XG4gIHZhciBpVCA9IDEgLSB0O1xuICByZXR1cm4gaVQgKiBpVCAqIHAxICsgMiAqIGlUICogdCAqIHAyICsgdCAqIHQgKiBwMztcbn1cblxuZnVuY3Rpb24gZ2V0UXVhZHJhdGljQ3VydmVQb2ludChzdGFydFgsIHN0YXJ0WSwgY3BYLCBjcFksIGVuZFgsIGVuZFksIHBvc2l0aW9uKSB7XG4gIHJldHVybiB7XG4gICAgeDogX2dldFFCZXppZXJWYWx1ZShwb3NpdGlvbiwgc3RhcnRYLCBjcFgsIGVuZFgpLFxuICAgIHk6IF9nZXRRQmV6aWVyVmFsdWUocG9zaXRpb24sIHN0YXJ0WSwgY3BZLCBlbmRZKVxuICB9O1xufSAvLyBodHRwOi8vZ2l6bWEuY29tL2Vhc2luZy9cblxuXG5mdW5jdGlvbiBlYXNlT3V0UXVhZCh0LCBiLCBjLCBkKSB7XG4gIHQgLz0gZDtcbiAgcmV0dXJuIC1jICogdCAqICh0IC0gMikgKyBiO1xufVxuXG5mdW5jdGlvbiBjb3B5QWN0aW9uKGRlc3QsIHNyYykge1xuICBkZXN0Lm5hbWUgPSBzcmMubmFtZTtcbiAgZGVzdC5heGlzID0gc3JjLmF4aXM7XG4gIGRlc3QuZWRnZXMgPSBzcmMuZWRnZXM7XG4gIHJldHVybiBkZXN0O1xufVxuXG59LHtcIi4vU2lnbmFsc1wiOjQ1LFwiLi9hcnJcIjo0NixcIi4vYnJvd3NlclwiOjQ3LFwiLi9jbG9uZVwiOjQ4LFwiLi9kb21VdGlsc1wiOjUwLFwiLi9ldmVudHNcIjo1MSxcIi4vZXh0ZW5kXCI6NTIsXCIuL2dldE9yaWdpblhZXCI6NTMsXCIuL2h5cG90XCI6NTQsXCIuL2lzXCI6NTYsXCIuL25vcm1hbGl6ZUxpc3RlbmVyc1wiOjU4LFwiLi9wb2ludGVyVXRpbHNcIjo2MCxcIi4vcmFmXCI6NjEsXCIuL3JlY3RcIjo2MixcIi4vd2luZG93XCI6NjV9XSw1NjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuYXJyYXkgPSBleHBvcnRzLnBsYWluT2JqZWN0ID0gZXhwb3J0cy5lbGVtZW50ID0gZXhwb3J0cy5zdHJpbmcgPSBleHBvcnRzLmJvb2wgPSBleHBvcnRzLm51bWJlciA9IGV4cG9ydHMuZnVuYyA9IGV4cG9ydHMub2JqZWN0ID0gZXhwb3J0cy5kb2NGcmFnID0gZXhwb3J0cy53aW5kb3cgPSB2b2lkIDA7XG5cbnZhciBfaXNXaW5kb3cgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL2lzV2luZG93XCIpKTtcblxudmFyIF93aW5kb3cyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi93aW5kb3dcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxudmFyIHdpbmRvdyA9IGZ1bmN0aW9uIHdpbmRvdyh0aGluZykge1xuICByZXR1cm4gdGhpbmcgPT09IF93aW5kb3cyW1wiZGVmYXVsdFwiXS53aW5kb3cgfHwgKDAsIF9pc1dpbmRvd1tcImRlZmF1bHRcIl0pKHRoaW5nKTtcbn07XG5cbmV4cG9ydHMud2luZG93ID0gd2luZG93O1xuXG52YXIgZG9jRnJhZyA9IGZ1bmN0aW9uIGRvY0ZyYWcodGhpbmcpIHtcbiAgcmV0dXJuIG9iamVjdCh0aGluZykgJiYgdGhpbmcubm9kZVR5cGUgPT09IDExO1xufTtcblxuZXhwb3J0cy5kb2NGcmFnID0gZG9jRnJhZztcblxudmFyIG9iamVjdCA9IGZ1bmN0aW9uIG9iamVjdCh0aGluZykge1xuICByZXR1cm4gISF0aGluZyAmJiBfdHlwZW9mKHRoaW5nKSA9PT0gJ29iamVjdCc7XG59O1xuXG5leHBvcnRzLm9iamVjdCA9IG9iamVjdDtcblxudmFyIGZ1bmMgPSBmdW5jdGlvbiBmdW5jKHRoaW5nKSB7XG4gIHJldHVybiB0eXBlb2YgdGhpbmcgPT09ICdmdW5jdGlvbic7XG59O1xuXG5leHBvcnRzLmZ1bmMgPSBmdW5jO1xuXG52YXIgbnVtYmVyID0gZnVuY3Rpb24gbnVtYmVyKHRoaW5nKSB7XG4gIHJldHVybiB0eXBlb2YgdGhpbmcgPT09ICdudW1iZXInO1xufTtcblxuZXhwb3J0cy5udW1iZXIgPSBudW1iZXI7XG5cbnZhciBib29sID0gZnVuY3Rpb24gYm9vbCh0aGluZykge1xuICByZXR1cm4gdHlwZW9mIHRoaW5nID09PSAnYm9vbGVhbic7XG59O1xuXG5leHBvcnRzLmJvb2wgPSBib29sO1xuXG52YXIgc3RyaW5nID0gZnVuY3Rpb24gc3RyaW5nKHRoaW5nKSB7XG4gIHJldHVybiB0eXBlb2YgdGhpbmcgPT09ICdzdHJpbmcnO1xufTtcblxuZXhwb3J0cy5zdHJpbmcgPSBzdHJpbmc7XG5cbnZhciBlbGVtZW50ID0gZnVuY3Rpb24gZWxlbWVudCh0aGluZykge1xuICBpZiAoIXRoaW5nIHx8IF90eXBlb2YodGhpbmcpICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBfd2luZG93ID0gX3dpbmRvdzJbXCJkZWZhdWx0XCJdLmdldFdpbmRvdyh0aGluZykgfHwgX3dpbmRvdzJbXCJkZWZhdWx0XCJdLndpbmRvdztcblxuICByZXR1cm4gL29iamVjdHxmdW5jdGlvbi8udGVzdChfdHlwZW9mKF93aW5kb3cuRWxlbWVudCkpID8gdGhpbmcgaW5zdGFuY2VvZiBfd2luZG93LkVsZW1lbnQgLy8gRE9NMlxuICA6IHRoaW5nLm5vZGVUeXBlID09PSAxICYmIHR5cGVvZiB0aGluZy5ub2RlTmFtZSA9PT0gJ3N0cmluZyc7XG59O1xuXG5leHBvcnRzLmVsZW1lbnQgPSBlbGVtZW50O1xuXG52YXIgcGxhaW5PYmplY3QgPSBmdW5jdGlvbiBwbGFpbk9iamVjdCh0aGluZykge1xuICByZXR1cm4gb2JqZWN0KHRoaW5nKSAmJiAhIXRoaW5nLmNvbnN0cnVjdG9yICYmIC9mdW5jdGlvbiBPYmplY3RcXGIvLnRlc3QodGhpbmcuY29uc3RydWN0b3IudG9TdHJpbmcoKSk7XG59O1xuXG5leHBvcnRzLnBsYWluT2JqZWN0ID0gcGxhaW5PYmplY3Q7XG5cbnZhciBhcnJheSA9IGZ1bmN0aW9uIGFycmF5KHRoaW5nKSB7XG4gIHJldHVybiBvYmplY3QodGhpbmcpICYmIHR5cGVvZiB0aGluZy5sZW5ndGggIT09ICd1bmRlZmluZWQnICYmIGZ1bmModGhpbmcuc3BsaWNlKTtcbn07XG5cbmV4cG9ydHMuYXJyYXkgPSBhcnJheTtcblxufSx7XCIuL2lzV2luZG93XCI6NTcsXCIuL3dpbmRvd1wiOjY1fV0sNTc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF9kZWZhdWx0ID0gZnVuY3Rpb24gX2RlZmF1bHQodGhpbmcpIHtcbiAgcmV0dXJuICEhKHRoaW5nICYmIHRoaW5nLldpbmRvdykgJiYgdGhpbmcgaW5zdGFuY2VvZiB0aGluZy5XaW5kb3c7XG59O1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0O1xuXG59LHt9XSw1ODpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gbm9ybWFsaXplO1xuXG52YXIgX2V4dGVuZCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vZXh0ZW5kXCIpKTtcblxudmFyIGlzID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQocmVxdWlyZShcIi4vaXNcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7IHZhciBkZXNjID0gT2JqZWN0LmRlZmluZVByb3BlcnR5ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KSA6IHt9OyBpZiAoZGVzYy5nZXQgfHwgZGVzYy5zZXQpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5ld09iaiwga2V5LCBkZXNjKTsgfSBlbHNlIHsgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IH0gfSBuZXdPYmpbXCJkZWZhdWx0XCJdID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZSh0eXBlLCBsaXN0ZW5lcnMsIHJlc3VsdCkge1xuICByZXN1bHQgPSByZXN1bHQgfHwge307XG5cbiAgaWYgKGlzLnN0cmluZyh0eXBlKSAmJiB0eXBlLnNlYXJjaCgnICcpICE9PSAtMSkge1xuICAgIHR5cGUgPSBzcGxpdCh0eXBlKTtcbiAgfVxuXG4gIGlmIChpcy5hcnJheSh0eXBlKSkge1xuICAgIHJldHVybiB0eXBlLnJlZHVjZShmdW5jdGlvbiAoYWNjLCB0KSB7XG4gICAgICByZXR1cm4gKDAsIF9leHRlbmRbXCJkZWZhdWx0XCJdKShhY2MsIG5vcm1hbGl6ZSh0LCBsaXN0ZW5lcnMsIHJlc3VsdCkpO1xuICAgIH0sIHJlc3VsdCk7XG4gIH0gLy8gKHsgdHlwZTogZm4gfSkgLT4gKCcnLCB7IHR5cGU6IGZuIH0pXG5cblxuICBpZiAoaXMub2JqZWN0KHR5cGUpKSB7XG4gICAgbGlzdGVuZXJzID0gdHlwZTtcbiAgICB0eXBlID0gJyc7XG4gIH1cblxuICBpZiAoaXMuZnVuYyhsaXN0ZW5lcnMpKSB7XG4gICAgcmVzdWx0W3R5cGVdID0gcmVzdWx0W3R5cGVdIHx8IFtdO1xuICAgIHJlc3VsdFt0eXBlXS5wdXNoKGxpc3RlbmVycyk7XG4gIH0gZWxzZSBpZiAoaXMuYXJyYXkobGlzdGVuZXJzKSkge1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsaXN0ZW5lcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX3JlZjtcblxuICAgICAgX3JlZiA9IGxpc3RlbmVyc1tfaV07XG4gICAgICB2YXIgbCA9IF9yZWY7XG4gICAgICBub3JtYWxpemUodHlwZSwgbCwgcmVzdWx0KTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXMub2JqZWN0KGxpc3RlbmVycykpIHtcbiAgICBmb3IgKHZhciBwcmVmaXggaW4gbGlzdGVuZXJzKSB7XG4gICAgICB2YXIgY29tYmluZWRUeXBlcyA9IHNwbGl0KHByZWZpeCkubWFwKGZ1bmN0aW9uIChwKSB7XG4gICAgICAgIHJldHVybiBcIlwiLmNvbmNhdCh0eXBlKS5jb25jYXQocCk7XG4gICAgICB9KTtcbiAgICAgIG5vcm1hbGl6ZShjb21iaW5lZFR5cGVzLCBsaXN0ZW5lcnNbcHJlZml4XSwgcmVzdWx0KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBzcGxpdCh0eXBlKSB7XG4gIHJldHVybiB0eXBlLnRyaW0oKS5zcGxpdCgvICsvKTtcbn1cblxufSx7XCIuL2V4dGVuZFwiOjUyLFwiLi9pc1wiOjU2fV0sNTk6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLnBvaW50ZXJFeHRlbmQgPSBwb2ludGVyRXh0ZW5kO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbmZ1bmN0aW9uIHBvaW50ZXJFeHRlbmQoZGVzdCwgc291cmNlKSB7XG4gIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgdmFyIHByZWZpeGVkUHJvcFJFcyA9IHBvaW50ZXJFeHRlbmQucHJlZml4ZWRQcm9wUkVzO1xuICAgIHZhciBkZXByZWNhdGVkID0gZmFsc2U7IC8vIHNraXAgZGVwcmVjYXRlZCBwcmVmaXhlZCBwcm9wZXJ0aWVzXG5cbiAgICBmb3IgKHZhciB2ZW5kb3IgaW4gcHJlZml4ZWRQcm9wUkVzKSB7XG4gICAgICBpZiAocHJvcC5pbmRleE9mKHZlbmRvcikgPT09IDAgJiYgcHJlZml4ZWRQcm9wUkVzW3ZlbmRvcl0udGVzdChwcm9wKSkge1xuICAgICAgICBkZXByZWNhdGVkID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFkZXByZWNhdGVkICYmIHR5cGVvZiBzb3VyY2VbcHJvcF0gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGRlc3RbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRlc3Q7XG59XG5cbnBvaW50ZXJFeHRlbmQucHJlZml4ZWRQcm9wUkVzID0ge1xuICB3ZWJraXQ6IC8oTW92ZW1lbnRbWFldfFJhZGl1c1tYWV18Um90YXRpb25BbmdsZXxGb3JjZSkkL1xufTtcbnZhciBfZGVmYXVsdCA9IHBvaW50ZXJFeHRlbmQ7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0O1xuXG59LHt9XSw2MDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX2Jyb3dzZXIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL2Jyb3dzZXJcIikpO1xuXG52YXIgX2RvbU9iamVjdHMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL2RvbU9iamVjdHNcIikpO1xuXG52YXIgZG9tVXRpbHMgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChyZXF1aXJlKFwiLi9kb21VdGlsc1wiKSk7XG5cbnZhciBfaHlwb3QgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL2h5cG90XCIpKTtcblxudmFyIGlzID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQocmVxdWlyZShcIi4vaXNcIikpO1xuXG52YXIgX3BvaW50ZXJFeHRlbmQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL3BvaW50ZXJFeHRlbmRcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7IHZhciBkZXNjID0gT2JqZWN0LmRlZmluZVByb3BlcnR5ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KSA6IHt9OyBpZiAoZGVzYy5nZXQgfHwgZGVzYy5zZXQpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5ld09iaiwga2V5LCBkZXNjKTsgfSBlbHNlIHsgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IH0gfSBuZXdPYmpbXCJkZWZhdWx0XCJdID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbnZhciBwb2ludGVyVXRpbHMgPSB7XG4gIGNvcHlDb29yZHM6IGZ1bmN0aW9uIGNvcHlDb29yZHMoZGVzdCwgc3JjKSB7XG4gICAgZGVzdC5wYWdlID0gZGVzdC5wYWdlIHx8IHt9O1xuICAgIGRlc3QucGFnZS54ID0gc3JjLnBhZ2UueDtcbiAgICBkZXN0LnBhZ2UueSA9IHNyYy5wYWdlLnk7XG4gICAgZGVzdC5jbGllbnQgPSBkZXN0LmNsaWVudCB8fCB7fTtcbiAgICBkZXN0LmNsaWVudC54ID0gc3JjLmNsaWVudC54O1xuICAgIGRlc3QuY2xpZW50LnkgPSBzcmMuY2xpZW50Lnk7XG4gICAgZGVzdC50aW1lU3RhbXAgPSBzcmMudGltZVN0YW1wO1xuICB9LFxuICBzZXRDb29yZERlbHRhczogZnVuY3Rpb24gc2V0Q29vcmREZWx0YXModGFyZ2V0T2JqLCBwcmV2LCBjdXIpIHtcbiAgICB0YXJnZXRPYmoucGFnZS54ID0gY3VyLnBhZ2UueCAtIHByZXYucGFnZS54O1xuICAgIHRhcmdldE9iai5wYWdlLnkgPSBjdXIucGFnZS55IC0gcHJldi5wYWdlLnk7XG4gICAgdGFyZ2V0T2JqLmNsaWVudC54ID0gY3VyLmNsaWVudC54IC0gcHJldi5jbGllbnQueDtcbiAgICB0YXJnZXRPYmouY2xpZW50LnkgPSBjdXIuY2xpZW50LnkgLSBwcmV2LmNsaWVudC55O1xuICAgIHRhcmdldE9iai50aW1lU3RhbXAgPSBjdXIudGltZVN0YW1wIC0gcHJldi50aW1lU3RhbXA7XG4gIH0sXG4gIHNldENvb3JkVmVsb2NpdHk6IGZ1bmN0aW9uIHNldENvb3JkVmVsb2NpdHkodGFyZ2V0T2JqLCBkZWx0YSkge1xuICAgIHZhciBkdCA9IE1hdGgubWF4KGRlbHRhLnRpbWVTdGFtcCAvIDEwMDAsIDAuMDAxKTtcbiAgICB0YXJnZXRPYmoucGFnZS54ID0gZGVsdGEucGFnZS54IC8gZHQ7XG4gICAgdGFyZ2V0T2JqLnBhZ2UueSA9IGRlbHRhLnBhZ2UueSAvIGR0O1xuICAgIHRhcmdldE9iai5jbGllbnQueCA9IGRlbHRhLmNsaWVudC54IC8gZHQ7XG4gICAgdGFyZ2V0T2JqLmNsaWVudC55ID0gZGVsdGEuY2xpZW50LnkgLyBkdDtcbiAgICB0YXJnZXRPYmoudGltZVN0YW1wID0gZHQ7XG4gIH0sXG4gIGlzTmF0aXZlUG9pbnRlcjogZnVuY3Rpb24gaXNOYXRpdmVQb2ludGVyKHBvaW50ZXIpIHtcbiAgICByZXR1cm4gcG9pbnRlciBpbnN0YW5jZW9mIF9kb21PYmplY3RzW1wiZGVmYXVsdFwiXS5FdmVudCB8fCBwb2ludGVyIGluc3RhbmNlb2YgX2RvbU9iamVjdHNbXCJkZWZhdWx0XCJdLlRvdWNoO1xuICB9LFxuICAvLyBHZXQgc3BlY2lmaWVkIFgvWSBjb29yZHMgZm9yIG1vdXNlIG9yIGV2ZW50LnRvdWNoZXNbMF1cbiAgZ2V0WFk6IGZ1bmN0aW9uIGdldFhZKHR5cGUsIHBvaW50ZXIsIHh5KSB7XG4gICAgeHkgPSB4eSB8fCB7fTtcbiAgICB0eXBlID0gdHlwZSB8fCAncGFnZSc7XG4gICAgeHkueCA9IHBvaW50ZXJbdHlwZSArICdYJ107XG4gICAgeHkueSA9IHBvaW50ZXJbdHlwZSArICdZJ107XG4gICAgcmV0dXJuIHh5O1xuICB9LFxuICBnZXRQYWdlWFk6IGZ1bmN0aW9uIGdldFBhZ2VYWShwb2ludGVyLCBwYWdlKSB7XG4gICAgcGFnZSA9IHBhZ2UgfHwge1xuICAgICAgeDogMCxcbiAgICAgIHk6IDBcbiAgICB9OyAvLyBPcGVyYSBNb2JpbGUgaGFuZGxlcyB0aGUgdmlld3BvcnQgYW5kIHNjcm9sbGluZyBvZGRseVxuXG4gICAgaWYgKF9icm93c2VyW1wiZGVmYXVsdFwiXS5pc09wZXJhTW9iaWxlICYmIHBvaW50ZXJVdGlscy5pc05hdGl2ZVBvaW50ZXIocG9pbnRlcikpIHtcbiAgICAgIHBvaW50ZXJVdGlscy5nZXRYWSgnc2NyZWVuJywgcG9pbnRlciwgcGFnZSk7XG4gICAgICBwYWdlLnggKz0gd2luZG93LnNjcm9sbFg7XG4gICAgICBwYWdlLnkgKz0gd2luZG93LnNjcm9sbFk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvaW50ZXJVdGlscy5nZXRYWSgncGFnZScsIHBvaW50ZXIsIHBhZ2UpO1xuICAgIH1cblxuICAgIHJldHVybiBwYWdlO1xuICB9LFxuICBnZXRDbGllbnRYWTogZnVuY3Rpb24gZ2V0Q2xpZW50WFkocG9pbnRlciwgY2xpZW50KSB7XG4gICAgY2xpZW50ID0gY2xpZW50IHx8IHt9O1xuXG4gICAgaWYgKF9icm93c2VyW1wiZGVmYXVsdFwiXS5pc09wZXJhTW9iaWxlICYmIHBvaW50ZXJVdGlscy5pc05hdGl2ZVBvaW50ZXIocG9pbnRlcikpIHtcbiAgICAgIC8vIE9wZXJhIE1vYmlsZSBoYW5kbGVzIHRoZSB2aWV3cG9ydCBhbmQgc2Nyb2xsaW5nIG9kZGx5XG4gICAgICBwb2ludGVyVXRpbHMuZ2V0WFkoJ3NjcmVlbicsIHBvaW50ZXIsIGNsaWVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvaW50ZXJVdGlscy5nZXRYWSgnY2xpZW50JywgcG9pbnRlciwgY2xpZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2xpZW50O1xuICB9LFxuICBnZXRQb2ludGVySWQ6IGZ1bmN0aW9uIGdldFBvaW50ZXJJZChwb2ludGVyKSB7XG4gICAgcmV0dXJuIGlzLm51bWJlcihwb2ludGVyLnBvaW50ZXJJZCkgPyBwb2ludGVyLnBvaW50ZXJJZCA6IHBvaW50ZXIuaWRlbnRpZmllcjtcbiAgfSxcbiAgc2V0Q29vcmRzOiBmdW5jdGlvbiBzZXRDb29yZHModGFyZ2V0T2JqLCBwb2ludGVycywgdGltZVN0YW1wKSB7XG4gICAgdmFyIHBvaW50ZXIgPSBwb2ludGVycy5sZW5ndGggPiAxID8gcG9pbnRlclV0aWxzLnBvaW50ZXJBdmVyYWdlKHBvaW50ZXJzKSA6IHBvaW50ZXJzWzBdO1xuICAgIHZhciB0bXBYWSA9IHt9O1xuICAgIHBvaW50ZXJVdGlscy5nZXRQYWdlWFkocG9pbnRlciwgdG1wWFkpO1xuICAgIHRhcmdldE9iai5wYWdlLnggPSB0bXBYWS54O1xuICAgIHRhcmdldE9iai5wYWdlLnkgPSB0bXBYWS55O1xuICAgIHBvaW50ZXJVdGlscy5nZXRDbGllbnRYWShwb2ludGVyLCB0bXBYWSk7XG4gICAgdGFyZ2V0T2JqLmNsaWVudC54ID0gdG1wWFkueDtcbiAgICB0YXJnZXRPYmouY2xpZW50LnkgPSB0bXBYWS55O1xuICAgIHRhcmdldE9iai50aW1lU3RhbXAgPSB0aW1lU3RhbXA7XG4gIH0sXG4gIHBvaW50ZXJFeHRlbmQ6IF9wb2ludGVyRXh0ZW5kW1wiZGVmYXVsdFwiXSxcbiAgZ2V0VG91Y2hQYWlyOiBmdW5jdGlvbiBnZXRUb3VjaFBhaXIoZXZlbnQpIHtcbiAgICB2YXIgdG91Y2hlcyA9IFtdOyAvLyBhcnJheSBvZiB0b3VjaGVzIGlzIHN1cHBsaWVkXG5cbiAgICBpZiAoaXMuYXJyYXkoZXZlbnQpKSB7XG4gICAgICB0b3VjaGVzWzBdID0gZXZlbnRbMF07XG4gICAgICB0b3VjaGVzWzFdID0gZXZlbnRbMV07XG4gICAgfSAvLyBhbiBldmVudFxuICAgIGVsc2Uge1xuICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ3RvdWNoZW5kJykge1xuICAgICAgICAgIGlmIChldmVudC50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgdG91Y2hlc1swXSA9IGV2ZW50LnRvdWNoZXNbMF07XG4gICAgICAgICAgICB0b3VjaGVzWzFdID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF07XG4gICAgICAgICAgfSBlbHNlIGlmIChldmVudC50b3VjaGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdG91Y2hlc1swXSA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdO1xuICAgICAgICAgICAgdG91Y2hlc1sxXSA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzFdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0b3VjaGVzWzBdID0gZXZlbnQudG91Y2hlc1swXTtcbiAgICAgICAgICB0b3VjaGVzWzFdID0gZXZlbnQudG91Y2hlc1sxXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgcmV0dXJuIHRvdWNoZXM7XG4gIH0sXG4gIHBvaW50ZXJBdmVyYWdlOiBmdW5jdGlvbiBwb2ludGVyQXZlcmFnZShwb2ludGVycykge1xuICAgIHZhciBhdmVyYWdlID0ge1xuICAgICAgcGFnZVg6IDAsXG4gICAgICBwYWdlWTogMCxcbiAgICAgIGNsaWVudFg6IDAsXG4gICAgICBjbGllbnRZOiAwLFxuICAgICAgc2NyZWVuWDogMCxcbiAgICAgIHNjcmVlblk6IDBcbiAgICB9O1xuXG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IHBvaW50ZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9yZWY7XG5cbiAgICAgIF9yZWYgPSBwb2ludGVyc1tfaV07XG4gICAgICB2YXIgcG9pbnRlciA9IF9yZWY7XG5cbiAgICAgIGZvciAodmFyIF9wcm9wIGluIGF2ZXJhZ2UpIHtcbiAgICAgICAgYXZlcmFnZVtfcHJvcF0gKz0gcG9pbnRlcltfcHJvcF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yICh2YXIgcHJvcCBpbiBhdmVyYWdlKSB7XG4gICAgICBhdmVyYWdlW3Byb3BdIC89IHBvaW50ZXJzLmxlbmd0aDtcbiAgICB9XG5cbiAgICByZXR1cm4gYXZlcmFnZTtcbiAgfSxcbiAgdG91Y2hCQm94OiBmdW5jdGlvbiB0b3VjaEJCb3goZXZlbnQpIHtcbiAgICBpZiAoIWV2ZW50Lmxlbmd0aCAmJiAhKGV2ZW50LnRvdWNoZXMgJiYgZXZlbnQudG91Y2hlcy5sZW5ndGggPiAxKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIHRvdWNoZXMgPSBwb2ludGVyVXRpbHMuZ2V0VG91Y2hQYWlyKGV2ZW50KTtcbiAgICB2YXIgbWluWCA9IE1hdGgubWluKHRvdWNoZXNbMF0ucGFnZVgsIHRvdWNoZXNbMV0ucGFnZVgpO1xuICAgIHZhciBtaW5ZID0gTWF0aC5taW4odG91Y2hlc1swXS5wYWdlWSwgdG91Y2hlc1sxXS5wYWdlWSk7XG4gICAgdmFyIG1heFggPSBNYXRoLm1heCh0b3VjaGVzWzBdLnBhZ2VYLCB0b3VjaGVzWzFdLnBhZ2VYKTtcbiAgICB2YXIgbWF4WSA9IE1hdGgubWF4KHRvdWNoZXNbMF0ucGFnZVksIHRvdWNoZXNbMV0ucGFnZVkpO1xuICAgIHJldHVybiB7XG4gICAgICB4OiBtaW5YLFxuICAgICAgeTogbWluWSxcbiAgICAgIGxlZnQ6IG1pblgsXG4gICAgICB0b3A6IG1pblksXG4gICAgICByaWdodDogbWF4WCxcbiAgICAgIGJvdHRvbTogbWF4WSxcbiAgICAgIHdpZHRoOiBtYXhYIC0gbWluWCxcbiAgICAgIGhlaWdodDogbWF4WSAtIG1pbllcbiAgICB9O1xuICB9LFxuICB0b3VjaERpc3RhbmNlOiBmdW5jdGlvbiB0b3VjaERpc3RhbmNlKGV2ZW50LCBkZWx0YVNvdXJjZSkge1xuICAgIHZhciBzb3VyY2VYID0gZGVsdGFTb3VyY2UgKyAnWCc7XG4gICAgdmFyIHNvdXJjZVkgPSBkZWx0YVNvdXJjZSArICdZJztcbiAgICB2YXIgdG91Y2hlcyA9IHBvaW50ZXJVdGlscy5nZXRUb3VjaFBhaXIoZXZlbnQpO1xuICAgIHZhciBkeCA9IHRvdWNoZXNbMF1bc291cmNlWF0gLSB0b3VjaGVzWzFdW3NvdXJjZVhdO1xuICAgIHZhciBkeSA9IHRvdWNoZXNbMF1bc291cmNlWV0gLSB0b3VjaGVzWzFdW3NvdXJjZVldO1xuICAgIHJldHVybiAoMCwgX2h5cG90W1wiZGVmYXVsdFwiXSkoZHgsIGR5KTtcbiAgfSxcbiAgdG91Y2hBbmdsZTogZnVuY3Rpb24gdG91Y2hBbmdsZShldmVudCwgZGVsdGFTb3VyY2UpIHtcbiAgICB2YXIgc291cmNlWCA9IGRlbHRhU291cmNlICsgJ1gnO1xuICAgIHZhciBzb3VyY2VZID0gZGVsdGFTb3VyY2UgKyAnWSc7XG4gICAgdmFyIHRvdWNoZXMgPSBwb2ludGVyVXRpbHMuZ2V0VG91Y2hQYWlyKGV2ZW50KTtcbiAgICB2YXIgZHggPSB0b3VjaGVzWzFdW3NvdXJjZVhdIC0gdG91Y2hlc1swXVtzb3VyY2VYXTtcbiAgICB2YXIgZHkgPSB0b3VjaGVzWzFdW3NvdXJjZVldIC0gdG91Y2hlc1swXVtzb3VyY2VZXTtcbiAgICB2YXIgYW5nbGUgPSAxODAgKiBNYXRoLmF0YW4yKGR5LCBkeCkgLyBNYXRoLlBJO1xuICAgIHJldHVybiBhbmdsZTtcbiAgfSxcbiAgZ2V0UG9pbnRlclR5cGU6IGZ1bmN0aW9uIGdldFBvaW50ZXJUeXBlKHBvaW50ZXIpIHtcbiAgICByZXR1cm4gaXMuc3RyaW5nKHBvaW50ZXIucG9pbnRlclR5cGUpID8gcG9pbnRlci5wb2ludGVyVHlwZSA6IGlzLm51bWJlcihwb2ludGVyLnBvaW50ZXJUeXBlKSA/IFt1bmRlZmluZWQsIHVuZGVmaW5lZCwgJ3RvdWNoJywgJ3BlbicsICdtb3VzZSddW3BvaW50ZXIucG9pbnRlclR5cGVdIC8vIGlmIHRoZSBQb2ludGVyRXZlbnQgQVBJIGlzbid0IGF2YWlsYWJsZSwgdGhlbiB0aGUgXCJwb2ludGVyXCIgbXVzdFxuICAgIC8vIGJlIGVpdGhlciBhIE1vdXNlRXZlbnQsIFRvdWNoRXZlbnQsIG9yIFRvdWNoIG9iamVjdFxuICAgIDogL3RvdWNoLy50ZXN0KHBvaW50ZXIudHlwZSkgfHwgcG9pbnRlciBpbnN0YW5jZW9mIF9kb21PYmplY3RzW1wiZGVmYXVsdFwiXS5Ub3VjaCA/ICd0b3VjaCcgOiAnbW91c2UnO1xuICB9LFxuICAvLyBbIGV2ZW50LnRhcmdldCwgZXZlbnQuY3VycmVudFRhcmdldCBdXG4gIGdldEV2ZW50VGFyZ2V0czogZnVuY3Rpb24gZ2V0RXZlbnRUYXJnZXRzKGV2ZW50KSB7XG4gICAgdmFyIHBhdGggPSBpcy5mdW5jKGV2ZW50LmNvbXBvc2VkUGF0aCkgPyBldmVudC5jb21wb3NlZFBhdGgoKSA6IGV2ZW50LnBhdGg7XG4gICAgcmV0dXJuIFtkb21VdGlscy5nZXRBY3R1YWxFbGVtZW50KHBhdGggPyBwYXRoWzBdIDogZXZlbnQudGFyZ2V0KSwgZG9tVXRpbHMuZ2V0QWN0dWFsRWxlbWVudChldmVudC5jdXJyZW50VGFyZ2V0KV07XG4gIH0sXG4gIG5ld0Nvb3JkczogZnVuY3Rpb24gbmV3Q29vcmRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBwYWdlOiB7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IDBcbiAgICAgIH0sXG4gICAgICBjbGllbnQ6IHtcbiAgICAgICAgeDogMCxcbiAgICAgICAgeTogMFxuICAgICAgfSxcbiAgICAgIHRpbWVTdGFtcDogMFxuICAgIH07XG4gIH0sXG4gIGNvb3Jkc1RvRXZlbnQ6IGZ1bmN0aW9uIGNvb3Jkc1RvRXZlbnQoY29vcmRzKSB7XG4gICAgdmFyIGV2ZW50ID0ge1xuICAgICAgY29vcmRzOiBjb29yZHMsXG5cbiAgICAgIGdldCBwYWdlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb29yZHMucGFnZTtcbiAgICAgIH0sXG5cbiAgICAgIGdldCBjbGllbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvb3Jkcy5jbGllbnQ7XG4gICAgICB9LFxuXG4gICAgICBnZXQgdGltZVN0YW1wKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb29yZHMudGltZVN0YW1wO1xuICAgICAgfSxcblxuICAgICAgZ2V0IHBhZ2VYKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb29yZHMucGFnZS54O1xuICAgICAgfSxcblxuICAgICAgZ2V0IHBhZ2VZKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb29yZHMucGFnZS55O1xuICAgICAgfSxcblxuICAgICAgZ2V0IGNsaWVudFgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvb3Jkcy5jbGllbnQueDtcbiAgICAgIH0sXG5cbiAgICAgIGdldCBjbGllbnRZKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb29yZHMuY2xpZW50Lnk7XG4gICAgICB9LFxuXG4gICAgICBnZXQgcG9pbnRlcklkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb29yZHMucG9pbnRlcklkO1xuICAgICAgfSxcblxuICAgICAgZ2V0IHRhcmdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29vcmRzLnRhcmdldDtcbiAgICAgIH0sXG5cbiAgICAgIGdldCB0eXBlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb29yZHMudHlwZTtcbiAgICAgIH0sXG5cbiAgICAgIGdldCBwb2ludGVyVHlwZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29vcmRzLnBvaW50ZXJUeXBlO1xuICAgICAgfVxuXG4gICAgfTtcbiAgICByZXR1cm4gZXZlbnQ7XG4gIH1cbn07XG52YXIgX2RlZmF1bHQgPSBwb2ludGVyVXRpbHM7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0O1xuXG59LHtcIi4vYnJvd3NlclwiOjQ3LFwiLi9kb21PYmplY3RzXCI6NDksXCIuL2RvbVV0aWxzXCI6NTAsXCIuL2h5cG90XCI6NTQsXCIuL2lzXCI6NTYsXCIuL3BvaW50ZXJFeHRlbmRcIjo1OX1dLDYxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG52YXIgbGFzdFRpbWUgPSAwO1xuXG52YXIgX3JlcXVlc3Q7XG5cbnZhciBfY2FuY2VsO1xuXG5mdW5jdGlvbiBpbml0KHdpbmRvdykge1xuICBfcmVxdWVzdCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG4gIF9jYW5jZWwgPSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWU7XG5cbiAgaWYgKCFfcmVxdWVzdCkge1xuICAgIHZhciB2ZW5kb3JzID0gWydtcycsICdtb3onLCAnd2Via2l0JywgJ28nXTtcblxuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCB2ZW5kb3JzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIHZlbmRvciA9IHZlbmRvcnNbX2ldO1xuICAgICAgX3JlcXVlc3QgPSB3aW5kb3dbXCJcIi5jb25jYXQodmVuZG9yLCBcIlJlcXVlc3RBbmltYXRpb25GcmFtZVwiKV07XG4gICAgICBfY2FuY2VsID0gd2luZG93W1wiXCIuY29uY2F0KHZlbmRvciwgXCJDYW5jZWxBbmltYXRpb25GcmFtZVwiKV0gfHwgd2luZG93W1wiXCIuY29uY2F0KHZlbmRvciwgXCJDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcIildO1xuICAgIH1cbiAgfVxuXG4gIGlmICghX3JlcXVlc3QpIHtcbiAgICBfcmVxdWVzdCA9IGZ1bmN0aW9uIHJlcXVlc3QoY2FsbGJhY2spIHtcbiAgICAgIHZhciBjdXJyVGltZSA9IERhdGUubm93KCk7XG4gICAgICB2YXIgdGltZVRvQ2FsbCA9IE1hdGgubWF4KDAsIDE2IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKTsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHN0YW5kYXJkL25vLWNhbGxiYWNrLWxpdGVyYWxcblxuICAgICAgdmFyIHRva2VuID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNhbGxiYWNrKGN1cnJUaW1lICsgdGltZVRvQ2FsbCk7XG4gICAgICB9LCB0aW1lVG9DYWxsKTtcbiAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xuICAgICAgcmV0dXJuIHRva2VuO1xuICAgIH07XG5cbiAgICBfY2FuY2VsID0gZnVuY3Rpb24gY2FuY2VsKHRva2VuKSB7XG4gICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KHRva2VuKTtcbiAgICB9O1xuICB9XG59XG5cbnZhciBfZGVmYXVsdCA9IHtcbiAgcmVxdWVzdDogZnVuY3Rpb24gcmVxdWVzdChjYWxsYmFjaykge1xuICAgIHJldHVybiBfcmVxdWVzdChjYWxsYmFjayk7XG4gIH0sXG4gIGNhbmNlbDogZnVuY3Rpb24gY2FuY2VsKHRva2VuKSB7XG4gICAgcmV0dXJuIF9jYW5jZWwodG9rZW4pO1xuICB9LFxuICBpbml0OiBpbml0XG59O1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBfZGVmYXVsdDtcblxufSx7fV0sNjI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmdldFN0cmluZ09wdGlvblJlc3VsdCA9IGdldFN0cmluZ09wdGlvblJlc3VsdDtcbmV4cG9ydHMucmVzb2x2ZVJlY3RMaWtlID0gcmVzb2x2ZVJlY3RMaWtlO1xuZXhwb3J0cy5yZWN0VG9YWSA9IHJlY3RUb1hZO1xuZXhwb3J0cy54eXdoVG9UbGJyID0geHl3aFRvVGxicjtcbmV4cG9ydHMudGxiclRvWHl3aCA9IHRsYnJUb1h5d2g7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF9kb21VdGlscyA9IHJlcXVpcmUoXCIuL2RvbVV0aWxzXCIpO1xuXG52YXIgX2V4dGVuZCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vZXh0ZW5kXCIpKTtcblxudmFyIGlzID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQocmVxdWlyZShcIi4vaXNcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7IHZhciBkZXNjID0gT2JqZWN0LmRlZmluZVByb3BlcnR5ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KSA6IHt9OyBpZiAoZGVzYy5nZXQgfHwgZGVzYy5zZXQpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5ld09iaiwga2V5LCBkZXNjKTsgfSBlbHNlIHsgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IH0gfSBuZXdPYmpbXCJkZWZhdWx0XCJdID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIGdldFN0cmluZ09wdGlvblJlc3VsdCh2YWx1ZSwgaW50ZXJhY3RhYmxlLCBlbGVtZW50KSB7XG4gIGlmICghaXMuc3RyaW5nKHZhbHVlKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKHZhbHVlID09PSAncGFyZW50Jykge1xuICAgIHZhbHVlID0gKDAsIF9kb21VdGlscy5wYXJlbnROb2RlKShlbGVtZW50KTtcbiAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ3NlbGYnKSB7XG4gICAgdmFsdWUgPSBpbnRlcmFjdGFibGUuZ2V0UmVjdChlbGVtZW50KTtcbiAgfSBlbHNlIHtcbiAgICB2YWx1ZSA9ICgwLCBfZG9tVXRpbHMuY2xvc2VzdCkoZWxlbWVudCwgdmFsdWUpO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlUmVjdExpa2UodmFsdWUsIGludGVyYWN0YWJsZSwgZWxlbWVudCwgZnVuY3Rpb25BcmdzKSB7XG4gIHZhbHVlID0gZ2V0U3RyaW5nT3B0aW9uUmVzdWx0KHZhbHVlLCBpbnRlcmFjdGFibGUsIGVsZW1lbnQpIHx8IHZhbHVlO1xuXG4gIGlmIChpcy5mdW5jKHZhbHVlKSkge1xuICAgIHZhbHVlID0gdmFsdWUuYXBwbHkobnVsbCwgZnVuY3Rpb25BcmdzKTtcbiAgfVxuXG4gIGlmIChpcy5lbGVtZW50KHZhbHVlKSkge1xuICAgIHZhbHVlID0gKDAsIF9kb21VdGlscy5nZXRFbGVtZW50UmVjdCkodmFsdWUpO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiByZWN0VG9YWShyZWN0KSB7XG4gIHJldHVybiByZWN0ICYmIHtcbiAgICB4OiAneCcgaW4gcmVjdCA/IHJlY3QueCA6IHJlY3QubGVmdCxcbiAgICB5OiAneScgaW4gcmVjdCA/IHJlY3QueSA6IHJlY3QudG9wXG4gIH07XG59XG5cbmZ1bmN0aW9uIHh5d2hUb1RsYnIocmVjdCkge1xuICBpZiAocmVjdCAmJiAhKCdsZWZ0JyBpbiByZWN0ICYmICd0b3AnIGluIHJlY3QpKSB7XG4gICAgcmVjdCA9ICgwLCBfZXh0ZW5kW1wiZGVmYXVsdFwiXSkoe30sIHJlY3QpO1xuICAgIHJlY3QubGVmdCA9IHJlY3QueCB8fCAwO1xuICAgIHJlY3QudG9wID0gcmVjdC55IHx8IDA7XG4gICAgcmVjdC5yaWdodCA9IHJlY3QucmlnaHQgfHwgcmVjdC5sZWZ0ICsgcmVjdC53aWR0aDtcbiAgICByZWN0LmJvdHRvbSA9IHJlY3QuYm90dG9tIHx8IHJlY3QudG9wICsgcmVjdC5oZWlnaHQ7XG4gIH1cblxuICByZXR1cm4gcmVjdDtcbn1cblxuZnVuY3Rpb24gdGxiclRvWHl3aChyZWN0KSB7XG4gIGlmIChyZWN0ICYmICEoJ3gnIGluIHJlY3QgJiYgJ3knIGluIHJlY3QpKSB7XG4gICAgcmVjdCA9ICgwLCBfZXh0ZW5kW1wiZGVmYXVsdFwiXSkoe30sIHJlY3QpO1xuICAgIHJlY3QueCA9IHJlY3QubGVmdCB8fCAwO1xuICAgIHJlY3QueSA9IHJlY3QudG9wIHx8IDA7XG4gICAgcmVjdC53aWR0aCA9IHJlY3Qud2lkdGggfHwgcmVjdC5yaWdodCAtIHJlY3QueDtcbiAgICByZWN0LmhlaWdodCA9IHJlY3QuaGVpZ2h0IHx8IHJlY3QuYm90dG9tIC0gcmVjdC55O1xuICB9XG5cbiAgcmV0dXJuIHJlY3Q7XG59XG5cbnZhciBfZGVmYXVsdCA9IHtcbiAgZ2V0U3RyaW5nT3B0aW9uUmVzdWx0OiBnZXRTdHJpbmdPcHRpb25SZXN1bHQsXG4gIHJlc29sdmVSZWN0TGlrZTogcmVzb2x2ZVJlY3RMaWtlLFxuICByZWN0VG9YWTogcmVjdFRvWFksXG4gIHh5d2hUb1RsYnI6IHh5d2hUb1RsYnIsXG4gIHRsYnJUb1h5d2g6IHRsYnJUb1h5d2hcbn07XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0O1xuXG59LHtcIi4vZG9tVXRpbHNcIjo1MCxcIi4vZXh0ZW5kXCI6NTIsXCIuL2lzXCI6NTZ9XSw2MzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG5mdW5jdGlvbiBfc2xpY2VkVG9BcnJheShhcnIsIGkpIHsgcmV0dXJuIF9hcnJheVdpdGhIb2xlcyhhcnIpIHx8IF9pdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHx8IF9ub25JdGVyYWJsZVJlc3QoKTsgfVxuXG5mdW5jdGlvbiBfbm9uSXRlcmFibGVSZXN0KCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZVwiKTsgfVxuXG5mdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB7IHZhciBfYXJyID0gW107IHZhciBfbiA9IHRydWU7IHZhciBfZCA9IGZhbHNlOyB2YXIgX2UgPSB1bmRlZmluZWQ7IHRyeSB7IGZvciAodmFyIF9pID0gYXJyW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3M7ICEoX24gPSAoX3MgPSBfaS5uZXh0KCkpLmRvbmUpOyBfbiA9IHRydWUpIHsgX2Fyci5wdXNoKF9zLnZhbHVlKTsgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrOyB9IH0gY2F0Y2ggKGVycikgeyBfZCA9IHRydWU7IF9lID0gZXJyOyB9IGZpbmFsbHkgeyB0cnkgeyBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdICE9IG51bGwpIF9pW1wicmV0dXJuXCJdKCk7IH0gZmluYWxseSB7IGlmIChfZCkgdGhyb3cgX2U7IH0gfSByZXR1cm4gX2FycjsgfVxuXG5mdW5jdGlvbiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBhcnI7IH1cblxuZnVuY3Rpb24gY3JlYXRlR3JpZChncmlkKSB7XG4gIHZhciBjb29yZEZpZWxkcyA9IFtbJ3gnLCAneSddLCBbJ2xlZnQnLCAndG9wJ10sIFsncmlnaHQnLCAnYm90dG9tJ10sIFsnd2lkdGgnLCAnaGVpZ2h0J11dLmZpbHRlcihmdW5jdGlvbiAoX3JlZikge1xuICAgIHZhciBfcmVmMiA9IF9zbGljZWRUb0FycmF5KF9yZWYsIDIpLFxuICAgICAgICB4RmllbGQgPSBfcmVmMlswXSxcbiAgICAgICAgeUZpZWxkID0gX3JlZjJbMV07XG5cbiAgICByZXR1cm4geEZpZWxkIGluIGdyaWQgfHwgeUZpZWxkIGluIGdyaWQ7XG4gIH0pO1xuICByZXR1cm4gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICB2YXIgcmFuZ2UgPSBncmlkLnJhbmdlLFxuICAgICAgICBfZ3JpZCRsaW1pdHMgPSBncmlkLmxpbWl0cyxcbiAgICAgICAgbGltaXRzID0gX2dyaWQkbGltaXRzID09PSB2b2lkIDAgPyB7XG4gICAgICBsZWZ0OiAtSW5maW5pdHksXG4gICAgICByaWdodDogSW5maW5pdHksXG4gICAgICB0b3A6IC1JbmZpbml0eSxcbiAgICAgIGJvdHRvbTogSW5maW5pdHlcbiAgICB9IDogX2dyaWQkbGltaXRzLFxuICAgICAgICBfZ3JpZCRvZmZzZXQgPSBncmlkLm9mZnNldCxcbiAgICAgICAgb2Zmc2V0ID0gX2dyaWQkb2Zmc2V0ID09PSB2b2lkIDAgPyB7XG4gICAgICB4OiAwLFxuICAgICAgeTogMFxuICAgIH0gOiBfZ3JpZCRvZmZzZXQ7XG4gICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgIHJhbmdlOiByYW5nZVxuICAgIH07XG5cbiAgICBmb3IgKHZhciBfaTIgPSAwOyBfaTIgPCBjb29yZEZpZWxkcy5sZW5ndGg7IF9pMisrKSB7XG4gICAgICB2YXIgX3JlZjM7XG5cbiAgICAgIF9yZWYzID0gY29vcmRGaWVsZHNbX2kyXTtcblxuICAgICAgdmFyIF9yZWY0ID0gX3JlZjMsXG4gICAgICAgICAgX3JlZjUgPSBfc2xpY2VkVG9BcnJheShfcmVmNCwgMiksXG4gICAgICAgICAgeEZpZWxkID0gX3JlZjVbMF0sXG4gICAgICAgICAgeUZpZWxkID0gX3JlZjVbMV07XG5cbiAgICAgIHZhciBncmlkeCA9IE1hdGgucm91bmQoKHggLSBvZmZzZXQueCkgLyBncmlkW3hGaWVsZF0pO1xuICAgICAgdmFyIGdyaWR5ID0gTWF0aC5yb3VuZCgoeSAtIG9mZnNldC55KSAvIGdyaWRbeUZpZWxkXSk7XG4gICAgICByZXN1bHRbeEZpZWxkXSA9IE1hdGgubWF4KGxpbWl0cy5sZWZ0LCBNYXRoLm1pbihsaW1pdHMucmlnaHQsIGdyaWR4ICogZ3JpZFt4RmllbGRdICsgb2Zmc2V0LngpKTtcbiAgICAgIHJlc3VsdFt5RmllbGRdID0gTWF0aC5tYXgobGltaXRzLnRvcCwgTWF0aC5taW4obGltaXRzLmJvdHRvbSwgZ3JpZHkgKiBncmlkW3lGaWVsZF0gKyBvZmZzZXQueSkpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbnZhciBfZGVmYXVsdCA9IGNyZWF0ZUdyaWQ7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0O1xuXG59LHt9XSw2NDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImdyaWRcIiwge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2dyaWRbXCJkZWZhdWx0XCJdO1xuICB9XG59KTtcblxudmFyIF9ncmlkID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9ncmlkXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbn0se1wiLi9ncmlkXCI6NjN9XSw2NTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuaW5pdCA9IGluaXQ7XG5leHBvcnRzLmdldFdpbmRvdyA9IGdldFdpbmRvdztcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX2lzV2luZG93ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9pc1dpbmRvd1wiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG52YXIgd2luID0ge1xuICByZWFsV2luZG93OiB1bmRlZmluZWQsXG4gIHdpbmRvdzogdW5kZWZpbmVkLFxuICBnZXRXaW5kb3c6IGdldFdpbmRvdyxcbiAgaW5pdDogaW5pdFxufTtcblxuZnVuY3Rpb24gaW5pdCh3aW5kb3cpIHtcbiAgLy8gZ2V0IHdyYXBwZWQgd2luZG93IGlmIHVzaW5nIFNoYWRvdyBET00gcG9seWZpbGxcbiAgd2luLnJlYWxXaW5kb3cgPSB3aW5kb3c7IC8vIGNyZWF0ZSBhIFRleHROb2RlXG5cbiAgdmFyIGVsID0gd2luZG93LmRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTsgLy8gY2hlY2sgaWYgaXQncyB3cmFwcGVkIGJ5IGEgcG9seWZpbGxcblxuICBpZiAoZWwub3duZXJEb2N1bWVudCAhPT0gd2luZG93LmRvY3VtZW50ICYmIHR5cGVvZiB3aW5kb3cud3JhcCA9PT0gJ2Z1bmN0aW9uJyAmJiB3aW5kb3cud3JhcChlbCkgPT09IGVsKSB7XG4gICAgLy8gdXNlIHdyYXBwZWQgd2luZG93XG4gICAgd2luZG93ID0gd2luZG93LndyYXAod2luZG93KTtcbiAgfVxuXG4gIHdpbi53aW5kb3cgPSB3aW5kb3c7XG59XG5cbmlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICB3aW4ud2luZG93ID0gdW5kZWZpbmVkO1xuICB3aW4ucmVhbFdpbmRvdyA9IHVuZGVmaW5lZDtcbn0gZWxzZSB7XG4gIGluaXQod2luZG93KTtcbn1cblxuZnVuY3Rpb24gZ2V0V2luZG93KG5vZGUpIHtcbiAgaWYgKCgwLCBfaXNXaW5kb3dbXCJkZWZhdWx0XCJdKShub2RlKSkge1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgdmFyIHJvb3ROb2RlID0gbm9kZS5vd25lckRvY3VtZW50IHx8IG5vZGU7XG4gIHJldHVybiByb290Tm9kZS5kZWZhdWx0VmlldyB8fCB3aW4ud2luZG93O1xufVxuXG53aW4uaW5pdCA9IGluaXQ7XG52YXIgX2RlZmF1bHQgPSB3aW47XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0O1xuXG59LHtcIi4vaXNXaW5kb3dcIjo1N31dfSx7fSxbMjldKSgyOSlcbn0pO1xuXG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWludGVyYWN0LmpzLm1hcFxuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=webpack-internal:///./node_modules/interactjs/dist/interact.js
