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
const polygon_json = get_json("geojson/9001.geojson");
var tate = new L.StripePattern({ color: "#ff5500" });
tate.addTo(mymap);

let polygon_layer = L.geoJson(polygon_json, {
  onEachFeature: function(feat, layer) {
    // 地物をクリックしたら、起る動作
    const columns = ["遺跡名", "区番号", "所在地", "時代", "種類", "備考"];
    const headers = columns.map(value => "<th>" + value + "</th>").join("");

    const values = columns
      .map(value => (feat.properties[value] ? feat.properties[value] : ""))
      .map(value => "<td>" + value + "</td>")
      .join("");
    const table =
      "<table><tr>" + headers + "</tr>" + "<tr>" + values + "</tr></table>";
    layer.bindPopup(table);
  },
  style: {
    weight: 2,
    color: "#ff5500",
    // fill: true,
    opacity: 0.65,
    fillPattern: tate
  }
}).addTo(mymap);

let osm = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  // 権利関係?右したとかに出る
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});
// EPSG:4326に変換
// ogr2ogr -f MVT haikei_tile ./shp/gyousei.shp -dsco MAXZOOM=19
// cd mvt_tile
// gzip -d -v -r -S .pbf *
// find . -type f -exec mv -v '{}' '{}'.pbf \;
let ogr_layer = L.vectorGrid
  .protobuf("./geojson/haikei_tile/{z}/{x}/{y}.pbf", {
    minZoom: 1,
    maxZoom: 19,
    indexMaxZoom: 5, // max zoom in the initial tile index
    interactive: true,
    rendererFactory: L.canvas.tile,
    vectorTileLayerStyles: {
      // layerごとのスタイル設定
      gyousei: {
        weight: 0.1,
        color: "#00ff00"
      }
    }
  })
  .addTo(mymap);

let Map_o = {
  ogr: ogr_layer,
  polygon: polygon_layer
};

let Map_b = { osm: osm };
L.control.scale({ maxWidth: 250, imperial: false }).addTo(mymap);
L.control.layers(Map_b, Map_o, { collapsed: false }).addTo(mymap);
// let hash = L.hash(mymap);
// };
