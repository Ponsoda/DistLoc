var myPos = ""; 

var table = document.getElementById("tbl");

var myLat;

var myLon;

var bbox = [ -0.5522,38.6153, -0.5922,38.6353];

var btnPoints = document.getElementById("btn-points");
btnPoints.addEventListener("click", turfGenerateRamdomPoints);

var btnMyposition = document.getElementById("btn-myposition");
btnMyposition.addEventListener("click", getLocation);

var btnBbox = document.getElementById("btn-bbox");
btnBbox.addEventListener("click", leafletAddPolygonToMap);

function getLocation() {
	if (navigator && navigator.geolocation) { 
		// Geolocation is supported!
		navigator.geolocation.getCurrentPosition(
			getMyCurrentPosition, 
			displayError)		
	} else {
		console.log("Geolocation API is not supported!");
	}
	
}

function getMyCurrentPosition(position) {
	
	startPos = position;
	myLat = document.getElementById('my-lat').innerHTML = 
	startPos.coords.latitude;
	myLon = document.getElementById('my-lon').innerHTML = 
	startPos.coords.longitude;
	leafletAddPointToMap( myLon,myLat, true);
} 

function displayError(error) {
	var errors = { 
		0: 'unknown error',
		1: 'Permission denied',
		2: 'Position unavailable',
		3: 'Request timeout'
	};
	alert("Error occurred: " + errors[error.code]);
}

function leafletAddPolygonToMap() {
	
    
	var polygon = turf.bboxPolygon(bbox);
    L.geoJson(polygon, {color:"blue"}).addTo(map);
}

function turfToPolygon(bbox) {
    return turf.bboxPolygon(bbox);
}

//draw table checking if there is previous table

function drawTable(numPoints,marker){

	if(table.rows[1]){
		var i = 1;
		while(table.rows[i]){
		table.deleteRow(i);
		}
	}


	for(var i = 0; numPoints > i; i ++ ){

	var row = table.insertRow(i + 1);
	var cell1 = row.insertCell(0);
	var coord = turf.getCoord(marker.features[i]);
	cell1.innerHTML = coord[1];
	var cell2 = row.insertCell(1);
	cell2.innerHTML = coord[0];
	var cell3 = row.insertCell(2);
	var button = document.createElement("BUTTON");
	var view = document.createTextNode("View");
	var onePoint = Object.getOwnPropertyNames(marker.features);
	button.select = onePoint[i];
	button.appendChild(view);
	cell3.appendChild(button);
	button.marker = marker;
	button.i = i;

	button.coord = coord;

	button.setAttribute("onCLick", "drawPoints(this.marker, this.select, this.i, this.coord)");
	
	}

}


 
