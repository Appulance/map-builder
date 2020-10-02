////////////////////////////////////////////////////////////////////////////////
// Hospital Prototype
////////////////////////////////////////////////////////////////////////////////

const GMap = "#map-canvas";
var Hospitals = [];

function Hospital(id, name, lat, lon) {
	this.id = id;
	this.name = name;
//	this.region = region;
	this.lat = lat;
	this.lon = lon;
	
	// Add new Hospital to Map
	this.addMarker();
	
	Hospitals.push(this);
}

Hospital.prototype.getLat = function() {
	return this.lat;
}

Hospital.prototype.getName = function() {
	return this.name;
}

Hospital.prototype.getLon = function() {
	return this.lon;
}

Hospital.prototype.getLatLon = function() {
	return [this.lat, this.lon];
}

Hospital.prototype.getUUID = function() {
	str = this.id.toLowerCase();
	return str;
}

Hospital.prototype.zoomTo = function () {
	$(GMap).zoomTo(this.getLatLon(), 13);
}

Hospital.prototype.addMarker = function() {
	var self = this;
	
	let position = new google.maps.LatLng(this.lat, this.lon);

	let marker = new google.maps.Marker({
		map: map,
		position: position,
		icon: {
			url: 'https://appulance.com/mapbuilder/hospitals/hospital.svg'
		},
		id: "hospital-" + this.id,
		title: this.name,
		zIndex: 1000
	});
	marker.setMap(map);
}

////////////////////////////////////////////////////////////////////////////////
// Hospital Utility Functions
////////////////////////////////////////////////////////////////////////////////

function HospitalsIterator() {
	$.getJSON("https://appulance.com/mapbuilder/hospitals/hospitals.json", function(data) {
	}).done(function(data) {
		$.each(data.hospitals, function(index, hospital) {
			console.log("Adding hospital " + hospital.name);
			new Hospital(hospital.id, hospital.name, hospital.lat, hospital.lon);
		});
	});
}

function ListHospitalsIterator(hospitals) {
	hospitalKey = [];
	
	$.each(hospitals, function(index, value) {
		hospitalKey.push(value.id);
	});

	return hospitalKey;
}
