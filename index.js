function get_json(url) {
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", url, false);
  xmlhttp.send();
  return JSON.parse(xmlhttp.response);
}

// LeafletのMap部分
let mymap = L.map("mapid", {
  center: [34.691695541638275, 135.19788582261447],
  panControl: true,
  zoom: 16,
  minZoom: 2,
  maxZoom: 18,
  zoomsliderControl: true,
  zoomControl: false
});

var myStyle = {
  color: "#ff7800",
  weight: 5,
  opacity: 0.65
};

// vectortileとの比較用レイヤ
// 普通のgeojson
const polygon_json = get_json("geojson/9001reproject.geojson");
var slicer_layer = L.vectorGrid.slicer(polygon_json, {
  rendererFactory: L.canvas.tile,
  maxZoom: 22,
  indexMaxZoom: 5, // max zoom in the initial tile index
  interactive: true,
  vectorTileLayerStyles: {
    // A plain set of L.Path options.
    sliced: {
      weight: 2,
      color: "#ff5500",
      fill: true,
      opacity: 0.65
    }
  }
});

// ogr2ogr -f MVT ogr_tile 9001reproject.geojson -dsco MAXZOOM=19
// cd mvt_tile
// gzip -d -v -r -S .pbf *
// find . -type f -exec mv -v '{}' '{}'.pbf \;
let ogr_layer = L.vectorGrid
  .protobuf("geojson/ogr_tile/{z}/{x}/{y}.pbf", {
    maxNativeZoom: 14,
    minNativeZoom: 2,
    minZoom: 14,
    maxZoom: 22,
    indexMaxZoom: 5, // max zoom in the initial tile index
    interactive: true,
    rendererFactory: L.canvas.tile,
    vectorTileLayerStyles: {
      // layerごとのスタイル設定
      "9001reproject": {
        weight: 2,
        color: "#00ff00",
        opacity: 0.5,
        fill: true
      }
    }
  })
  .addTo(mymap);

let Map_o = {
  ogr: ogr_layer,
  slicer: slicer_layer
};

let Map_b = {};
L.control.scale({ maxWidth: 250, imperial: false }).addTo(mymap);
L.control.layers(Map_b, Map_o, { collapsed: false }).addTo(mymap);
// let hash = L.hash(mymap);
// };
