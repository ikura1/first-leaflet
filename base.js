function get_json(url) {
  // jsonファイルの取得
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", url, false);
  xmlhttp.send();
  return JSON.parse(xmlhttp.response);
}

let mymap = L.map("mapid", {
  // Map初期値
  center: [34.691695541638275, 135.19788582261447],
  // PluginのPanコントロールのオンオフ
  panControl: true,
  // 初期のZoom値
  zoom: 16,
  // Zoomの最小最大
  minZoom: 2,
  maxZoom: 18,
  // Pluginのスライダーのオンオフ
  zoomsliderControl: true,
  // デフォルトのZoomコントロールのオンオフ
  zoomControl: false
});

// mapbox
let mapbox = L.tileLayer(
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken:
      "pk.eyJ1IjoiaWt1cmExIiwiYSI6ImNqbWFxYjJ6azBkMWIzd3IxYmZ2bXowbHAifQ.RmON_TolsCqKnyOamXEGCQ"
  }
);

// osm
let osm = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  // 権利関係?右したとかに出る
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});

let polygon_json = get_json("geojson/9001reproject.geojson");
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
  }
}).addTo(mymap);

let point_json = get_json("./geojson/9003reproject.geojson");
let point_layer = L.geoJson(point_json, {}).addTo(mymap);

// 同時に表示できるLayer
let Map_o = {
  polygon: polygon_layer,
  point: point_layer
};
// markerClusterGroup グループレイヤー登録ができる?
// 同時に表示できないLayer(背景)
let Map_b = {
  MapBox: mapbox,
  OpenStreetMap: osm
};
L.control.scale({ maxWidth: 250, imperial: false }).addTo(mymap);

L.control.layers(Map_b, Map_o, { collapsed: false }).addTo(mymap);
let hash = L.hash(mymap);
