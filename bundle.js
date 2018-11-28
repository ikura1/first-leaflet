/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function get_json(url) {\n  let xmlhttp = new XMLHttpRequest();\n  xmlhttp.open(\"GET\", url, false);\n  xmlhttp.send();\n  return JSON.parse(xmlhttp.response);\n}\n\n// window.onload = function () {\nlet mymap = L.map(\"mapid\", {\n  center: [34.691695541638275, 135.19788582261447],\n  // center: [42.7450, 141.9123],\n  panControl: true,\n  zoom: 16,\n  minZoom: 2,\n  maxZoom: 18,\n  zoomsliderControl: true,\n  zoomControl: false\n});\n// layer追加まで行くと出力される\n\nvar myStyle = {\n  color: \"#ff7800\",\n  weight: 5,\n  opacity: 0.65\n};\n\nconst polygon_json = get_json(\"geojson/9001reproject.geojson\");\nlet polygon_layer = L.geoJson(polygon_json, {\n  onEachFeature: function(feat, layer) {\n    // 1. geojsonのpropertiesから情報を取得(座標系回りや渡す座標を考える必要がある)\n    // 2. APIに座標を投げる\n    const columns = [\"遺跡名\", \"区番号\", \"所在地\", \"時代\", \"種類\", \"備考\"];\n    const headers = columns.map(value => \"<th>\" + value + \"</th>\").join(\"\");\n\n    const values = columns\n      .map(value => (feat.properties[value] ? feat.properties[value] : \"\"))\n      .map(value => \"<td>\" + value + \"</td>\")\n      .join(\"\");\n    // let values = values.map(value => \"<td>\" + value + \"</td>\").join(\"\")\n    const table =\n      \"<table><tr>\" + headers + \"</tr>\" + \"<tr>\" + values + \"</tr></table>\";\n    layer.bindPopup(table);\n  },\n  style: myStyle\n});\n/*\nlet tile = L.tileLayer(\n  \"https://cyberjapandata.gsi.go.jp/xyz/experimental_rdcl/{z}/{x}/{y}.geojson\"\n);\n\nlet vtile = L.vectorGrid.slicer(\n  \"https://cyberjapandata.gsi.go.jp/xyz/experimental_rdcl/{z}/{x}/{y}.geojson\",\n  { rendererFactory: L.svg.tile }\n);\n*/\n\n// うまく作成できてない見直す\n// tippecanoe -l gs_map -rg -z18 -Z6 -o mvt.mbtiles 9001reproject.geojson\n// tippecanoe -o mvt.mbtiles 9001reproject.geojson\n// mb-util --image_format=pdf mvt.mbtiles mvt_tile\n// cd mvt_tile\n// gzip -d -v -r -S .pbf *\n// find . -type f -exec mv -v '{}' '{}'.pbf \\;\nlet mvt_layer = L.vectorGrid.protobuf(\"geojson/mvt_tile/{z}/{x}/{y}.pbf\", {\n  vectorTileLayerStyles: {}\n});\n// ogr2ogr -f MVT ogr_tile 9001reproject.geojson -dsco MAXZOOM=19\n// cd mvt_tile\n// gzip -d -v -r -S .pbf *\n// find . -type f -exec mv -v '{}' '{}'.pbf \\;\nlet ogr_layer = L.vectorGrid.protobuf(\"geojson/ogr_tile/{z}/{x}/{y}.pbf\", {\n  vectorTileLayerStyles: {}\n});\n\n//  .addTo(mymap);\n// tippecanoe -e veg 9001reproject.geojson\n// gzip -d -v -r -S .pbf *\n// find . -type f -exec mv -v '{}' '{}'.pbf \\;\nlet protobuf_layer = L.vectorGrid.protobuf(\"geojson/hoge/veg/{z}/{x}/{y}.pbf\", {\n  maxNativeZoom: 14,\n  minNativeZoom: 2,\n  minZoom: 14,\n  maxZoom: 22,\n  indexMaxZoom: 5, // max zoom in the initial tile index\n  interactive: true,\n  rendererFactory: L.canvas.tile,\n  vectorTileLayerStyles: {\n    \"9001reproject\": {\n      weight: 2,\n      color: \"#ff3088\",\n      opacity: 0.5,\n      fill: true\n    }\n  }\n});\n\n// no zip option\n// tippecanoe -e tipp_veg -pC -z19  9001reproject.geojson\n// TODO: tilel option test\nlet tipp_layer = L.vectorGrid.protobuf(\"geojson/tipp_veg/{z}/{x}/{y}.pdf\", {\n  maxNativeZoom: 14,\n  minNativeZoom: 2,\n  minZoom: 14,\n  maxZoom: 22,\n  indexMaxZoom: 5, // max zoom in the initial tile index\n  interactive: true,\n  rendererFactory: L.canvas.tile,\n  vectorTileLayerStyles: {\n    \"9001reproject\": {\n      weight: 2,\n      color: \"red\",\n      opacity: 0.5,\n      fill: true\n    }\n  }\n});\n\nvar slicer_layer = L.vectorGrid.slicer(polygon_json, {\n  rendererFactory: L.canvas.tile,\n  maxZoom: 22,\n  indexMaxZoom: 5, // max zoom in the initial tile index\n  interactive: true,\n  vectorTileLayerStyles: {\n    // A plain set of L.Path options.\n    sliced: {\n      weight: 2,\n      color: \"#ffff00\",\n      fill: true,\n      opacity: 0.65\n    }\n  }\n});\n\nlet Map_o = {\n  mvt: mvt_layer,\n  ogr: ogr_layer,\n  polygon: polygon_layer,\n  slicer: slicer_layer,\n  protobuf: protobuf_layer,\n  tipp_layer: tipp_layer\n};\n\n// markerClusterGroup グループレイヤー登録ができる?\nlet Map_b = {};\nL.control.scale({ maxWidth: 250, imperial: false }).addTo(mymap);\nL.control.layers(Map_b, Map_o, { collapsed: false }).addTo(mymap);\n// let hash = L.hash(mymap);\n// };\n\n\n//# sourceURL=webpack:///./index.js?");

/***/ })

/******/ });