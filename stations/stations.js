////////////////////////////////////////////////////////////////////////////////
// Station Prototype
////////////////////////////////////////////////////////////////////////////////

var Stations = [];

function Station(id, name, lat, lon) {
	this.id = id;
	this.name = name;
	this.lat = lat;
	this.lon = lon;
	
	// Add new Station to Map
	this.addMarker();
	
	Stations.push(this);
}

Station.prototype.getLat = function() {
	return this.lat;
}

Station.prototype.getName = function() {
	return this.name;
}

Station.prototype.getLon = function() {
	return this.lon;
}

Station.prototype.getLatLon = function() {
	return [this.lat, this.lon];
}

Station.prototype.getUUID = function() {
	str = this.id.toLowerCase();
	return str;
}

Station.prototype.zoomTo = function () {
	$(GMap).zoomTo(this.getLatLon(), 13);
}

Station.prototype.addMarker = function() {
	var self = this;
	
	let position = new google.maps.LatLng(this.lat, this.lon);

	let marker = new google.maps.Marker({
		map: map,
		position: position,
		icon: {
			url: 'https://appulance.com/mapbuilder/stations/station.svg'
		},
		title: this.id,
		alias: "station",
		zIndex: 1000,
		serial: "station"
	});

	marker.setMap(map);
	//markers.push(marker);
}


////////////////////////////////////////////////////////////////////////////////
// Station Utility Functions
////////////////////////////////////////////////////////////////////////////////

function StationsIterator() {
	$.getJSON("https://appulance.com/mapbuilder/stations/stations.json", function(data) {
	}).done(function(data) {
		$.each(data.stations, function(index, station) {
			console.log("Adding Station " + station.station);
			new Station(station.id, station.station, station.lat, station.lon);
		});
	});
}

function ListStationsIterator(Stations) {
	StationKey = [];
	
	$.each(Stations, function(index, value) {
		StationKey.push(value.id);
	});

	return StationKey;
}
