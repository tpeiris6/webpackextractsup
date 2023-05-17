__webpack_require__.r(__webpack_exports__);
/* harmony import */ var interactjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! interactjs */ "./node_modules/interactjs/dist/interact.js");
/* harmony import */ var interactjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(interactjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./store */ "./src/js/mask/store.js");



/**
 * 创建一个新的元素
 * @param cls　元素class
 * @param width 宽度
 * @param height　高度
 * @returns {HTMLDivElement}
 */
function newElement(cls, width, height) {
    let element = document.createElement('div')
    if (cls) {
        cls.split(' ').forEach(c => {
            if (c.trim()) {
                element.classList.add(c.trim())
            }
        })
    }
    if (width) {
        element.style.width = width + 'px'
    }
    if (height) {
        element.style.height = height + 'px'
    }
    return element
}

function parseTranslate(transform) {
    if (transform) {
        transform = transform.replace('translate(', '').replace(')', '')
        let szArr = transform.split(',')
        return {
            x: parseInt(szArr[0].replace('px', '')),
            y: parseInt(szArr[1].replace('px', ''))
        }
    }
}

class Mask {
    constructor() {
        this.targetElement = document.fullscreenElement || document.body
        this.mask = newElement('video-mask')
        this.box = newElement('box')
        this.lastBoxPosition = {x: 0, y: 0}
        this.lastMaskPosition = {x: 0, y: 0}
        let _this = this
        interactjs__WEBPACK_IMPORTED_MODULE_0___default()(this.box)
            .draggable({
                onstart(e) {
                    let transform = e.target.style.transform
                    if (transform) {
                        _this.lastBoxPosition = parseTranslate(transform)
                    } else {
                        _this.lastBoxPosition = {x: 0, y: 0}
                    }
                },
                onmove(event) {
                    const position = _this.lastBoxPosition
                    position.x += event.dx
                    position.y += event.dy
                    event.target.style.transform = `translate(${position.x}px, ${position.y}px)`
                }
            })
            .resizable({edges: {top: true, left: true, bottom: true, right: true}})
            .on('resizemove', event => {
                let {x, y} = event.target.dataset
                x = parseFloat(x) || 0
                y = parseFloat(y) || 0
                Object.assign(event.target.style, {
                    width: `${event.rect.width}px`,
                    height: `${event.rect.height}px`,
                    transform: `translate(${event.rect.left}px, ${event.rect.top}px)`
                })
                Object.assign(event.target.dataset, {x, y})
            })
            .on('doubletap', e => {
                _this.mask.style.visibility = 'gone'
            })
        interactjs__WEBPACK_IMPORTED_MODULE_0___default()(this.mask)
            .draggable({
                listeners: {
                    start(e) {
                        _this.lastMaskPosition = {x: 0, y: 0}
                        let style = _this.box.style
                        style.width = '0px'
                        style.height = '0px'
                        style.transform = `translate(${e.clientX0}px, ${e.clientY0}px)`
                    },
                    move(event) {
                        const position = _this.lastMaskPosition
                        position.x += event.dx
                        position.y += event.dy
                        let style = _this.box.style
                        style.width = `${Math.abs(position.x)}px`
                        style.height = `${Math.abs(position.y)}px`
                    }
                }
            })
    }

    show() {
        _store__WEBPACK_IMPORTED_MODULE_1__["default"].getData().then(d => {
            if (!d || !d.width) {
                this.targetElement.appendChild(this.mask)
                this.mask.style.visibility = 'visible'
            }
            this.targetElement.appendChild(this.box)
            let style = this.box.style
            style.visibility = 'visible'
            if (d) {
                style.width = d.width
                style.height = d.height
                if (d.x) {
                    style.transform = `translate(${d.x}px, ${d.y}px)`
                }
            }
        })
    }

    hide() {
        let style = this.box.style
        let data = {width: style.width, height: style.height}
        data = Object.assign(data, parseTranslate(style.transform))
        _store__WEBPACK_IMPORTED_MODULE_1__["default"].saveData(data).then(() => {
            this.mask.style.visibility = 'hidden'
            this.box.style.visibility = 'hidden'
        })
    }

    fullscreen() {
        this.targetElement = document.fullscreenElement || document.body
        if (this.mask.parentNode && this.mask.parentElement !== this.targetElement) {
            this.targetElement.appendChild(this.mask)
        }
        if (this.box.parentNode && this.box.parentElement !== this.targetElement) {
            this.targetElement.appendChild(this.box)
        }
    }
}

/* harmony default export */ __webpack_exports__["default"] = (Mask);//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvanMvbWFzay9tYXNrLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21hc2svbWFzay5qcz9jMTBkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBpbnRlcmFjdCBmcm9tIFwiaW50ZXJhY3Rqc1wiO1xuaW1wb3J0IHN0b3JlIGZyb20gJy4vc3RvcmUnXG5cbi8qKlxuICog5Yib5bu65LiA5Liq5paw55qE5YWD57SgXG4gKiBAcGFyYW0gY2xz44CA5YWD57SgY2xhc3NcbiAqIEBwYXJhbSB3aWR0aCDlrr3luqZcbiAqIEBwYXJhbSBoZWlnaHTjgIDpq5jluqZcbiAqIEByZXR1cm5zIHtIVE1MRGl2RWxlbWVudH1cbiAqL1xuZnVuY3Rpb24gbmV3RWxlbWVudChjbHMsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgaWYgKGNscykge1xuICAgICAgICBjbHMuc3BsaXQoJyAnKS5mb3JFYWNoKGMgPT4ge1xuICAgICAgICAgICAgaWYgKGMudHJpbSgpKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKGMudHJpbSgpKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbiAgICBpZiAod2lkdGgpIHtcbiAgICAgICAgZWxlbWVudC5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4J1xuICAgIH1cbiAgICBpZiAoaGVpZ2h0KSB7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4J1xuICAgIH1cbiAgICByZXR1cm4gZWxlbWVudFxufVxuXG5mdW5jdGlvbiBwYXJzZVRyYW5zbGF0ZSh0cmFuc2Zvcm0pIHtcbiAgICBpZiAodHJhbnNmb3JtKSB7XG4gICAgICAgIHRyYW5zZm9ybSA9IHRyYW5zZm9ybS5yZXBsYWNlKCd0cmFuc2xhdGUoJywgJycpLnJlcGxhY2UoJyknLCAnJylcbiAgICAgICAgbGV0IHN6QXJyID0gdHJhbnNmb3JtLnNwbGl0KCcsJylcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHBhcnNlSW50KHN6QXJyWzBdLnJlcGxhY2UoJ3B4JywgJycpKSxcbiAgICAgICAgICAgIHk6IHBhcnNlSW50KHN6QXJyWzFdLnJlcGxhY2UoJ3B4JywgJycpKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5jbGFzcyBNYXNrIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy50YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQgfHwgZG9jdW1lbnQuYm9keVxuICAgICAgICB0aGlzLm1hc2sgPSBuZXdFbGVtZW50KCd2aWRlby1tYXNrJylcbiAgICAgICAgdGhpcy5ib3ggPSBuZXdFbGVtZW50KCdib3gnKVxuICAgICAgICB0aGlzLmxhc3RCb3hQb3NpdGlvbiA9IHt4OiAwLCB5OiAwfVxuICAgICAgICB0aGlzLmxhc3RNYXNrUG9zaXRpb24gPSB7eDogMCwgeTogMH1cbiAgICAgICAgbGV0IF90aGlzID0gdGhpc1xuICAgICAgICBpbnRlcmFjdCh0aGlzLmJveClcbiAgICAgICAgICAgIC5kcmFnZ2FibGUoe1xuICAgICAgICAgICAgICAgIG9uc3RhcnQoZSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdHJhbnNmb3JtID0gZS50YXJnZXQuc3R5bGUudHJhbnNmb3JtXG4gICAgICAgICAgICAgICAgICAgIGlmICh0cmFuc2Zvcm0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmxhc3RCb3hQb3NpdGlvbiA9IHBhcnNlVHJhbnNsYXRlKHRyYW5zZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmxhc3RCb3hQb3NpdGlvbiA9IHt4OiAwLCB5OiAwfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvbm1vdmUoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSBfdGhpcy5sYXN0Qm94UG9zaXRpb25cbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24ueCArPSBldmVudC5keFxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbi55ICs9IGV2ZW50LmR5XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7cG9zaXRpb24ueH1weCwgJHtwb3NpdGlvbi55fXB4KWBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnJlc2l6YWJsZSh7ZWRnZXM6IHt0b3A6IHRydWUsIGxlZnQ6IHRydWUsIGJvdHRvbTogdHJ1ZSwgcmlnaHQ6IHRydWV9fSlcbiAgICAgICAgICAgIC5vbigncmVzaXplbW92ZScsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgICBsZXQge3gsIHl9ID0gZXZlbnQudGFyZ2V0LmRhdGFzZXRcbiAgICAgICAgICAgICAgICB4ID0gcGFyc2VGbG9hdCh4KSB8fCAwXG4gICAgICAgICAgICAgICAgeSA9IHBhcnNlRmxvYXQoeSkgfHwgMFxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oZXZlbnQudGFyZ2V0LnN0eWxlLCB7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBgJHtldmVudC5yZWN0LndpZHRofXB4YCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBgJHtldmVudC5yZWN0LmhlaWdodH1weGAsXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZSgke2V2ZW50LnJlY3QubGVmdH1weCwgJHtldmVudC5yZWN0LnRvcH1weClgXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKGV2ZW50LnRhcmdldC5kYXRhc2V0LCB7eCwgeX0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm9uKCdkb3VibGV0YXAnLCBlID0+IHtcbiAgICAgICAgICAgICAgICBfdGhpcy5tYXNrLnN0eWxlLnZpc2liaWxpdHkgPSAnZ29uZSdcbiAgICAgICAgICAgIH0pXG4gICAgICAgIGludGVyYWN0KHRoaXMubWFzaylcbiAgICAgICAgICAgIC5kcmFnZ2FibGUoe1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyczoge1xuICAgICAgICAgICAgICAgICAgICBzdGFydChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5sYXN0TWFza1Bvc2l0aW9uID0ge3g6IDAsIHk6IDB9XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3R5bGUgPSBfdGhpcy5ib3guc3R5bGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlLndpZHRoID0gJzBweCdcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlLmhlaWdodCA9ICcwcHgnXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7ZS5jbGllbnRYMH1weCwgJHtlLmNsaWVudFkwfXB4KWBcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbW92ZShldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSBfdGhpcy5sYXN0TWFza1Bvc2l0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbi54ICs9IGV2ZW50LmR4XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbi55ICs9IGV2ZW50LmR5XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3R5bGUgPSBfdGhpcy5ib3guc3R5bGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlLndpZHRoID0gYCR7TWF0aC5hYnMocG9zaXRpb24ueCl9cHhgXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZS5oZWlnaHQgPSBgJHtNYXRoLmFicyhwb3NpdGlvbi55KX1weGBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgICAgc3RvcmUuZ2V0RGF0YSgpLnRoZW4oZCA9PiB7XG4gICAgICAgICAgICBpZiAoIWQgfHwgIWQud2lkdGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5tYXNrKVxuICAgICAgICAgICAgICAgIHRoaXMubWFzay5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnRhcmdldEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5ib3gpXG4gICAgICAgICAgICBsZXQgc3R5bGUgPSB0aGlzLmJveC5zdHlsZVxuICAgICAgICAgICAgc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJ1xuICAgICAgICAgICAgaWYgKGQpIHtcbiAgICAgICAgICAgICAgICBzdHlsZS53aWR0aCA9IGQud2lkdGhcbiAgICAgICAgICAgICAgICBzdHlsZS5oZWlnaHQgPSBkLmhlaWdodFxuICAgICAgICAgICAgICAgIGlmIChkLngpIHtcbiAgICAgICAgICAgICAgICAgICAgc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke2QueH1weCwgJHtkLnl9cHgpYFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgICBsZXQgc3R5bGUgPSB0aGlzLmJveC5zdHlsZVxuICAgICAgICBsZXQgZGF0YSA9IHt3aWR0aDogc3R5bGUud2lkdGgsIGhlaWdodDogc3R5bGUuaGVpZ2h0fVxuICAgICAgICBkYXRhID0gT2JqZWN0LmFzc2lnbihkYXRhLCBwYXJzZVRyYW5zbGF0ZShzdHlsZS50cmFuc2Zvcm0pKVxuICAgICAgICBzdG9yZS5zYXZlRGF0YShkYXRhKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMubWFzay5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbidcbiAgICAgICAgICAgIHRoaXMuYm94LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJ1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIGZ1bGxzY3JlZW4oKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0RWxlbWVudCA9IGRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50IHx8IGRvY3VtZW50LmJvZHlcbiAgICAgICAgaWYgKHRoaXMubWFzay5wYXJlbnROb2RlICYmIHRoaXMubWFzay5wYXJlbnRFbGVtZW50ICE9PSB0aGlzLnRhcmdldEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0RWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLm1hc2spXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuYm94LnBhcmVudE5vZGUgJiYgdGhpcy5ib3gucGFyZW50RWxlbWVudCAhPT0gdGhpcy50YXJnZXRFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLnRhcmdldEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5ib3gpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hc2siXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=webpack-internal:///./src/js/mask/mask.js
