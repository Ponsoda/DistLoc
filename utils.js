var map;//global variable for map object

/*
Init a Leaflet map object.
*/
function leafletfInitMap(mapId){
    // initialize map container
    map = L.map(mapId).setView([38.6253, -0.5722], 13);
    // get the stamen toner-lite tiles
    var Stamen_Toner = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> — Map data © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20,
        ext: 'png'
    });

    // add the tiles to the map
    Stamen_Toner.addTo(map); 

    //disable scroll wheel zoom 
    map.scrollWheelZoom.disable();
}
/* 
Add a pair lon-lat to the map. 
isMyposition is a boolean flag to determine the style of 
the circle marker. 
*/
function leafletAddPointToMap(lon, lat, isMyPosition) {
    if (map) {
        var defaultMarkerOptions = {
            radius: 4,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        var myPositionMarkerOptions = {
            radius: 4,
            fillColor: "green",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
        var marker = turf.point([lon, lat]);
        L.geoJson(marker, {
            pointToLayer: function (feature, latlng) {
                
                if (isMyPosition) {
                    return L.circleMarker(latlng, myPositionMarkerOptions);
                } else {
                    return L.circleMarker(latlng, defaultMarkerOptions);
                }                
            } 
        }).addTo(map);
        myPos = turf.getCoord(marker); //get my position
        
    }
}

/* 
Add a line to the map by passing start and end points as input parameters. 
*/
function leafletAddLineToMap(coord, i) { //get coordinates and number of row
    // define coordinates for line

if(isNaN(myPos)){
    var latlngs = [
        myPos,
        coord
    ];

    // add line to the map
    var line = turf.lineString(latlngs);
    L.geoJson(line, {color:"red"}).addTo(map);

    //add remove cell and add distance to the table

    var newRow = table.rows[i + 1]; 
    newRow.deleteCell(2); 
    var newCell = newRow.insertCell(2); 
    var distkm = turfDistance(coord);
    var add = document.createTextNode(distkm + " km"); 
    newCell.appendChild(add);
} else {alert("Your location is needed");}
}

/* 
Add a polygon to the map by passing a boundig box declaration as input parameter. 
*/
function leafletAddPolygonToMap(bbox) {
    var polygon = turfToPolygon(bbox);
    L.geoJson(polygon, {color:"blue"}).addTo(map);
}

/* 
Return a Turf Point object. 
*/
function turfToPoint(lon, lat) {
    return turf.point([lon, lat]);
}

/* 
Return a Turf Polygon object. 
*/
function turfToPolygon(bbox) {
    return turf.bboxPolygon(bbox);
}

/* 
Return "num" random points within a determined bounding box (bbox). 
*/
function turfGenerateRamdomPoints() {
     var numPoints = document.getElementById("num").value; 
    if(numPoints > 0){ 
     var marker =  turf.randomPoint(numPoints, {bbox: bbox});
     drawTable(numPoints, marker);

    } else{
        alert("Error, you need at least one point");
    }
}

//Draw points and create a new cell with a new botton

function drawPoints(marker,select, i, coord){

    var defaultMarkerOptions = {
        radius: 4,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
   
var point = L.geoJson(marker.features[select], {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, defaultMarkerOptions);
    }
})
point.addTo(map);
 
var distance = document.createElement("button"); 
var modRow = table.rows[i + 1]; 
var add = document.createTextNode("Distance"); 
modRow.deleteCell(2);
var newCell = modRow.insertCell(2); 
distance.appendChild(add); 
newCell.appendChild(distance); 
distance.coord = coord; 
distance.i = i; 
distance.setAttribute("onCLick", "leafletAddLineToMap(this.coord, this.i)")
 }

/* 
Return the distance (kms) between two points given as input parameters. 
*/
function turfDistance(coord) {
    var options = {units: 'kilometers'};
  
    var dist = turf.distance(myPos, coord, options);
    return parseFloat(dist).toFixed(2);
  }
 