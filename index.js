import L from "leaflet";
import {} from "leaflet.vectorgrid/dist/Leaflet.VectorGrid.bundled.js";
import "leaflet/dist/leaflet.css";
import "./css/style.css";

function get_json(url) {
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", url, false);
  xmlhttp.send();
  return JSON.parse(xmlhttp.response);
}

// window.onload = function () {
let mymap = L.map("mapid", {
  center: [34.691695541638275, 135.19788582261447],
  // center: [42.7450, 141.9123],
  panControl: true,
  zoom: 16,
  minZoom: 2,
  maxZoom: 18,
  zoomsliderControl: true,
  zoomControl: false
});
// layer追加まで行くと出力される

var myStyle = {
  color: "#ff7800",
  weight: 5,
  opacity: 0.65
};

const polygon_json = get_json("geojson/9001reproject.geojson");
let polygon_layer = L.geoJson(polygon_json, {
  onEachFeature: function(feat, layer) {
    // 1. geojsonのpropertiesから情報を取得(座標系回りや渡す座標を考える必要がある)
    // 2. APIに座標を投げる
    const columns = ["遺跡名", "区番号", "所在地", "時代", "種類", "備考"];
    const headers = columns.map(value => "<th>" + value + "</th>").join("");

    const values = columns
      .map(value => (feat.properties[value] ? feat.properties[value] : ""))
      .map(value => "<td>" + value + "</td>")
      .join("");
    // let values = values.map(value => "<td>" + value + "</td>").join("")
    const table =
      "<table><tr>" + headers + "</tr>" + "<tr>" + values + "</tr></table>";
    layer.bindPopup(table);
  },
  style: myStyle
});
/*
let tile = L.tileLayer(
  "https://cyberjapandata.gsi.go.jp/xyz/experimental_rdcl/{z}/{x}/{y}.geojson"
);

let vtile = L.vectorGrid.slicer(
  "https://cyberjapandata.gsi.go.jp/xyz/experimental_rdcl/{z}/{x}/{y}.geojson",
  { rendererFactory: L.svg.tile }
);
*/

// うまく作成できてない見直す
// tippecanoe -l gs_map -rg -z18 -Z6 -o mvt.mbtiles 9001reproject.geojson
// tippecanoe -o mvt.mbtiles 9001reproject.geojson
// mb-util --image_format=pdf mvt.mbtiles mvt_tile
// cd mvt_tile
// gzip -d -v -r -S .pbf *
// find . -type f -exec mv -v '{}' '{}'.pbf \;
let mvt_layer = L.vectorGrid.protobuf("geojson/mvt_tile/{z}/{x}/{y}.pbf", {
  vectorTileLayerStyles: {}
});
// ogr2ogr -f MVT ogr_tile 9001reproject.geojson -dsco MAXZOOM=19
// cd mvt_tile
// gzip -d -v -r -S .pbf *
// find . -type f -exec mv -v '{}' '{}'.pbf \;
let ogr_layer = L.vectorGrid.protobuf("geojson/ogr_tile/{z}/{x}/{y}.pbf", {
  vectorTileLayerStyles: {}
});

//  .addTo(mymap);
// tippecanoe -e veg 9001reproject.geojson
// gzip -d -v -r -S .pbf *
// find . -type f -exec mv -v '{}' '{}'.pbf \;
let protobuf_layer = L.vectorGrid.protobuf("geojson/hoge/veg/{z}/{x}/{y}.pbf", {
  maxNativeZoom: 14,
  minNativeZoom: 2,
  minZoom: 14,
  maxZoom: 22,
  indexMaxZoom: 5, // max zoom in the initial tile index
  interactive: true,
  rendererFactory: L.canvas.tile,
  vectorTileLayerStyles: {
    "9001reproject": {
      weight: 2,
      color: "#ff3088",
      opacity: 0.5,
      fill: true
    }
  }
});

// no zip option
// tippecanoe -e tipp_veg -pC -z19  9001reproject.geojson
// TODO: tilel option test
let tipp_layer = L.vectorGrid.protobuf("geojson/tipp_veg/{z}/{x}/{y}.pdf", {
  maxNativeZoom: 14,
  minNativeZoom: 2,
  minZoom: 14,
  maxZoom: 22,
  indexMaxZoom: 5, // max zoom in the initial tile index
  interactive: true,
  rendererFactory: L.canvas.tile,
  vectorTileLayerStyles: {
    "9001reproject": {
      weight: 2,
      color: "red",
      opacity: 0.5,
      fill: true
    }
  }
});

var slicer_layer = L.vectorGrid.slicer(polygon_json, {
  rendererFactory: L.canvas.tile,
  maxZoom: 22,
  indexMaxZoom: 5, // max zoom in the initial tile index
  interactive: true,
  vectorTileLayerStyles: {
    // A plain set of L.Path options.
    sliced: {
      weight: 2,
      color: "#ffff00",
      fill: true,
      opacity: 0.65
    }
  }
});

let Map_o = {
  mvt: mvt_layer,
  ogr: ogr_layer,
  polygon: polygon_layer,
  slicer: slicer_layer,
  protobuf: protobuf_layer,
  tipp_layer: tipp_layer
};

// markerClusterGroup グループレイヤー登録ができる?
let Map_b = {};
L.control.scale({ maxWidth: 250, imperial: false }).addTo(mymap);
L.control.layers(Map_b, Map_o, { collapsed: false }).addTo(mymap);
// let hash = L.hash(mymap);
// };
