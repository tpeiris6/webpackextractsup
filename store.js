__webpack_require__.r(__webpack_exports__);
const STORE_KEY = "video_mask_key"

const getData = () => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(STORE_KEY, result => {
            resolve(result[STORE_KEY])
        })
    })
}
const saveData = (v) => {
    return new Promise((resolve, reject) => {
        let data = {}
        data[STORE_KEY] = v
        chrome.storage.sync.set(data, () => {
            resolve()
        })
    })
}
/* harmony default export */ __webpack_exports__["default"] = ({
    getData,
    saveData
});
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvanMvbWFzay9zdG9yZS5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9qcy9tYXNrL3N0b3JlLmpzPzI4OTMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgU1RPUkVfS0VZID0gXCJ2aWRlb19tYXNrX2tleVwiXG5cbmNvbnN0IGdldERhdGEgPSAoKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoU1RPUkVfS0VZLCByZXN1bHQgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHRbU1RPUkVfS0VZXSlcbiAgICAgICAgfSlcbiAgICB9KVxufVxuY29uc3Qgc2F2ZURhdGEgPSAodikgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGxldCBkYXRhID0ge31cbiAgICAgICAgZGF0YVtTVE9SRV9LRVldID0gdlxuICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldChkYXRhLCAoKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfSlcbiAgICB9KVxufVxuZXhwb3J0IGRlZmF1bHQge1xuICAgIGdldERhdGEsXG4gICAgc2F2ZURhdGFcbn1cbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTsiLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=webpack-internal:///./src/js/mask/store.js
