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
		title: this.id,
		serial: "hospital",
		alias: "hospital",
		zIndex: 1000
	});
	marker.setMap(map);
//markers.push(marker);
}

/*Hospital.prototype.showInformation = function() {
	showHospitalInformation(this.id);
}

Hospital.prototype.quantifyTravel = function(from) {
	var self = this;
	return new Promise(
		function (resolve, reject) {
			var origin = from;
			var dest = new google.maps.LatLng(self.lat, self.lon);
			
			GGetTravelTimeBetweenLocations([from], [dest])
			.then(function(result) {
				distance = result.rows[0].elements[0].distance.text;
				time = result.rows[0].elements[0].duration.text;
				traffic = result.rows[0].elements[0].duration_in_traffic.text;
				ticks = result.rows[0].elements[0].duration_in_traffic.value;
				
				data = { travel: [ { to: self.id, "distance": distance, "time": time, "time_in_traffic": traffic, "ticks": ticks } ] };
				resolve(data)
			})
			.catch(function(error) {
				var reason = new Error('[BMGenerateLocationFromAddress] ' + error);
	            reject(reason);
			});	
	    }
	);
}*/

////////////////////////////////////////////////////////////////////////////////
// Hospital Utility Functions
////////////////////////////////////////////////////////////////////////////////

function HospitalsIterator() {
	$.getJSON("https://appulance.com/mapbuilder/hospitals/hospitals2.json", function(data) {
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
