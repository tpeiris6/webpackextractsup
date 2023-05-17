__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mask_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mask.css */ "./src/js/mask/mask.css");
/* harmony import */ var _mask_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_mask_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mask__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mask */ "./src/js/mask/mask.js");



let msk
chrome.runtime.onMessage.addListener((request, sender, response) => {
    if (request && request.cmd) {
        if (request.cmd === 'show') {
            if (!msk) msk = new _mask__WEBPACK_IMPORTED_MODULE_1__["default"]()
            msk.show()
        } else if (request.cmd === 'hide') {
            if (msk) {
                msk.hide()
            }
        }
    }
})
document.onfullscreenchange = (e) => {
    if (msk) {
        msk.fullscreen(e)
    }
}//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvanMvbWFzay9pbmRleC5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9qcy9tYXNrL2luZGV4LmpzPzNlYTUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuL21hc2suY3NzJ1xuaW1wb3J0IG1hc2sgZnJvbSAnLi9tYXNrJ1xuXG5sZXQgbXNrXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKHJlcXVlc3QsIHNlbmRlciwgcmVzcG9uc2UpID0+IHtcbiAgICBpZiAocmVxdWVzdCAmJiByZXF1ZXN0LmNtZCkge1xuICAgICAgICBpZiAocmVxdWVzdC5jbWQgPT09ICdzaG93Jykge1xuICAgICAgICAgICAgaWYgKCFtc2spIG1zayA9IG5ldyBtYXNrKClcbiAgICAgICAgICAgIG1zay5zaG93KClcbiAgICAgICAgfSBlbHNlIGlmIChyZXF1ZXN0LmNtZCA9PT0gJ2hpZGUnKSB7XG4gICAgICAgICAgICBpZiAobXNrKSB7XG4gICAgICAgICAgICAgICAgbXNrLmhpZGUoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSlcbmRvY3VtZW50Lm9uZnVsbHNjcmVlbmNoYW5nZSA9IChlKSA9PiB7XG4gICAgaWYgKG1zaykge1xuICAgICAgICBtc2suZnVsbHNjcmVlbihlKVxuICAgIH1cbn0iXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9
//# sourceURL=webpack-internal:///./src/js/mask/index.js
