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

// ogr2ogr -f MVT ogr_tile 9001reproject.geojson -dsco MAXZOOM=19
// cd mvt_tile
// gzip -d -v -r -S .pbf *
// find . -type f -exec mv -v '{}' '{}'.pbf \;
let ogr_layer = L.vectorGrid.protobuf("geojson/ogr_tile/{z}/{x}/{y}.pbf", {
  vectorTileLayerStyles: {}
});


let Map_o = {
  mvt: mvt_layer,
  ogr: ogr_layer,
  polygon: polygon_layer,
  slicer: slicer_layer,
  protobuf: protobuf_layer,
  tipp_layer: tipp_layer
};

let Map_b = {};
L.control.scale({ maxWidth: 250, imperial: false }).addTo(mymap);
L.control.layers(Map_b, Map_o, { collapsed: false }).addTo(mymap);
// let hash = L.hash(mymap);
// };
