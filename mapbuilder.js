var bounds = new google.maps.LatLngBounds();
//var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

var mapOptions = {
    	zoom: 2,
    	center: new google.maps.LatLng(0, 0),
}

var markers = [];

function radixBucketSort (arr) {
    var idx1, idx2, idx3, len1, len2, radix, radixKey;
    var radices = {}, buckets = {}, num, curr;
    var currLen, radixStr, currBucket;

    len1 = arr.length;
    len2 = 10;  // radix sort uses ten buckets

    // find the relevant radices to process for efficiency        
    for (idx1 = 0;idx1 < len1;idx1++) {
      radices[arr[idx1].toString().length] = 0;
    }

    // loop for each radix. For each radix we put all the items
    // in buckets, and then pull them out of the buckets.
    for (radix in radices) {          
      // put each array item in a bucket based on its radix value
      len1 = arr.length;
      for (idx1 = 0;idx1 < len1;idx1++) {
        curr = arr[idx1];
        // item length is used to find its current radix value
        currLen = curr.toString().length;
        // only put the item in a radix bucket if the item
        // key is as long as the radix
        if (currLen >= radix) {
          // radix starts from beginning of key, so need to
          // adjust to get redix values from start of stringified key
          radixKey = curr.toString()[currLen - radix];
          // create the bucket if it does not already exist
          if (!buckets.hasOwnProperty(radixKey)) {
            buckets[radixKey] = [];
          }
          // put the array value in the bucket
          buckets[radixKey].push(curr);          
        } else {
          if (!buckets.hasOwnProperty('0')) {
            buckets['0'] = [];
          }
          buckets['0'].push(curr);          
        }
      }
      // for current radix, items are in buckets, now put them
      // back in the array based on their buckets
      // this index moves us through the array as we insert items
      idx1 = 0;
      // go through all the buckets
      for (idx2 = 0;idx2 < len2;idx2++) {
        // only process buckets with items
        if (buckets[idx2] != null) {
          currBucket = buckets[idx2];
          // insert all bucket items into array
          len1 = currBucket.length;
          for (idx3 = 0;idx3 < len1;idx3++) {
            arr[idx1++] = currBucket[idx3];
          }
        }
      }
      buckets = {};
    }
}

$(document).ready(async function () {
	var script = document.createElement('script');
	/*script.onload = function () {
	    //do stuff with the script
	};*/
	script.src = "https://appulance.com/mapbuilder/js/infobox.min.js";

	document.head.appendChild(script); //or something of the likes

//	alert("This is a test version of Map Builder and could stop working at any time.");

	await sleep(400);

	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

	ga('create', 'UA-60890786-8', 'auto');
	ga('set', 'checkProtocolTask', null); // Disable file protocol checking.
	ga('set', 'checkStorageTask', null); // Disable cookie storage checking.
	ga('set', 'historyImportTask', null); // Disable history checking (requires reading from cookies).
	ga(function(tracker) {
 		localStorage.setItem(someKey, tracker.get('clientId'));
	})
	ga('set', 'page', 'testViewMapWithTimelineAndLabels');
	ga('send', 'pageview');

	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

	addMarkers();
	//console.log(radixBucketSort(markers));
//	radixBucketSort(markers);
	sortMarkers(markers);
	addMarkersToTimeline(markers);
	addMarkersToAliases(markers);
	$("#map-form").show();

        $("#map-form").append("<div id='info'></div>");
	$("#info").hide();

	$("#timeline").change(function() {
		selected = $(this).val(); 
		selected_alias = $("#aliases").val();
		//console.log("Selected: " + selected);
		selected_times_count = $(this).val().length;

		//bounds = new google.maps.LatLngBounds();

//	        ga('set', 'page', 'timelineChange');
//	        ga('send', 'pageview');
		ga('send', 'event', 'Timeline', 'Time Selected');

		for (var i = 0; i < markers.length; i++) {
			//console.log("iterating...");
			current = markers[i].serial.toString();
			current_alias = markers[i].alias.toString();
			label_id = ".infobox-" + markers[i].serial.toString();
			//console.log(selected + "=" + current + "? " + selected.includes(current));

			if (selected.includes(current) == true && selected_alias.includes(current_alias)) {
				markers[i].setVisible(true);
				//bounds.extend(markers[i].position);
				if (label_status) $(label_id).show();

				if (selected_times_count == 1) {
				//	$("#info").remove();
				//	$("#map-form").append("<div id='info'></div>");
					tooltip = markers[i].title.replace(/\n/g, "<br />");
					$("#info").html(tooltip);
					$("#info").show();
				} else if (selected_times_count != 1) {
					$("#info").hide();
				}
			} else {
				markers[i].setVisible(false);
				if (label_status) $(label_id).hide();
			}
		}
	});

	var label_status = $("#label-toggle").is(":checked");
	var night_status = $("#night-toggle").is(":checked");

	$("#label-toggle").change(function() {
		label_status = $("#label-toggle").is(":checked");

		if (label_status == true) {
			// check what aliases and timelines are selected, and show them
			$(".infobox").show();
		} else  {
			// otherwise hide
			$(".infobox").hide();
		}
	});

	$("#night-toggle").change(function() {
		night_status = $("#night-toggle").is(":checked");

		if (night_status == true) {
			// check what aliases and timelines are selected, and show them
			map.setOptions({ styles: styles['dark'] });
			$("#map-form").css('color', 'white');
		} else  {
			// otherwise hide
			map.setOptions({ styles: [] });
			$("#map-form").css('color', 'black');
		}
	});

	$("#aliases").change(function() {
                selected = $(this).val(); 
                //console.log("Selected: " + selected);
		bounds = new google.maps.LatLngBounds();
		$("#timeline").empty(); 

//                ga('set', 'page', 'aliasChange');
 //               ga('send', 'pageview');
		ga('send', 'event', 'Aliases', 'Alias Change');

                for (var i = 0; i < markers.length; i++) {
                        //console.log("iterating...");
//                        current = markers[i].alias.toString();
			current = markers[i].alias; 
                        label_id = ".infobox-" + markers[i].serial.toString();

                       //console.log(selected + "=" + current + "? " + selected.includes(current));

                        if (selected.includes(current) == true) {
                                markers[i].setVisible(true);
				if (label_status) $(label_id).show();

				bounds.extend(markers[i].position);
//				serial = markers[i].serial.toString();
				serial = markers[i].serial;
				datetime = new Date(markers[i].serial);
				$('#timeline').append(new Option(datetime.toLocaleDateString("en-AU") + " " + datetime.toLocaleTimeString("en-AU"), serial, true, true));
                        } else {
                                markers[i].setVisible(false);
				if (label_status) $(label_id).hide();
                        }
                }
		map.fitBounds(bounds);
        });
});

Object.defineProperty(String.prototype, 'hashCode', {
  value: function() {
    var hash = 0, i, chr;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
});

var stringToColour = function(str) {
	var hash = 0;
	for (var i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	var colour = '#';
	for (var i = 0; i < 3; i++) {
		var value = (hash >> (i * 8)) & 0xFF;
		colour += ('00' + value.toString(16)).substr(-2);
	}
	return colour;
}

function getMarkerURLWithLabel (str, lab) {
        var color = stringToColour(str).substr(1);
        return "http://www.googlemapsmarkers.com/v1/" + "test" + "/" + "FFFFFF" + "/"  + color + "/" + ldColour(color, 40) + "/";
}

function getMarkerURL(str) {
	var color = stringToColour(str).substr(1);
	return "http://www.googlemapsmarkers.com/v1/" + "0" + "/" + color + "/"  + color + "/" + ldColour(color, 40) + "/";
}

function ldColour(col,amt) {
    var usePound = false;
    if ( col[0] == "#" ) {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col,16);

    var r = (num >> 16) + amt;

    if ( r > 255 ) r = 255;
    else if  (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if ( b > 255 ) b = 255;
    else if  (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if ( g > 255 ) g = 255;
    else if  ( g < 0 ) g = 0;

    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}

function addMarker(lat, lon, datetime, alias="Single", label = "", color = "blue") {
	var position = new google.maps.LatLng(lat, lon);

	var date = new Date(datetime);
//	var time = date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0') + ":" + date.getSeconds().toString().padStart(2, '0');
	var time = date.toLocaleString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
//	var pinUrl = getPinUrlByHour(date.getHours());
	var pinUrl = getMarkerURL(alias);
	var serial = date.getTime();
	var colour = stringToColour(alias);

 //       ga('set', 'page', 'addMarker');
  //      ga('send', 'pageview');
	ga('send', 'event', 'Markers', 'Add Marker');

//	console.log(serialNumber);
//	console.log(stringToHex(alias));

	let marker = new google.maps.Marker({
		map: map,
		position: position,
		icon: {
			url: pinUrl,
//			path: google.maps.SymbolPath.CIRCLE,
//			path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
//			scale: 0.3,
//			strokeWeight: 0.1,
//			strokeColor: 'black',
//			fillColor: colour,
//			fillOpacity: 1,
		},
		serial: serial,
		alias: alias,
		title: label,
	//	label: "test"
	});

			var myOptions = {
			 content: time
			,boxClass: "infobox infobox-" + serial
			,disableAutoPan: true
			,pixelOffset: new google.maps.Size(-25, 0)
			,position: position
			,closeBoxURL: ""
			,isHidden: false
			,pane: "mapPane"
			,enableEventPropagation: true
		};

		var ibLabel = new InfoBox(myOptions);
		ibLabel.open(map);

	marker.addListener("click", () => {
 		//map.setZoom(8);
 		//map.setCenter(marker.getPosition() as google.maps.LatLng);
//		var $select = $('#aliases');
//		$select.children().filter(function(){
//			return this.text == marker.alias;
//		}).prop('selected', true);
		markerClickHandler(marker.serial, marker.alias);
	});

	//store the marker object drawn in global array
	markers.push(marker);

	// zoom viewport
	bounds.extend(position);
	map.fitBounds(bounds);

}

function markerClickHandler(serial, alias="Single") {
//                ga('set', 'page', 'markerClicked');
  //              ga('send', 'pageview');

	ga('send', 'event', 'Markers', 'Marker Clicked');

	$("#aliases").val([]);
	$('#aliases option[value="' + alias + '"]').prop("selected", true).change();

	$("#timeline").val([]);
	$("#timeline option[value='" + serial + "']").prop("selected", true).change();

	scrollToOption($("#aliases"), alias);
	scrollToOption($("#timeline"), serial);

	$("#timeline").focus();
	$("#timeline option[value='" + serial + "']").select();
	$("#timeline option[value='" + serial + "']").focus();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function resetSelectElement(el) {
	el.selectedIndex = 0;  // first option is selected, or
                               // -1 for no option selected
}

async function scrollToOption(select, value) {
	await sleep(100);
	var options = select.find("option");
	var option = select.find("option[value='" + value + "']");
	var optionTop = option.offset().top
	var selectTop = select.offset().top;
	select.scrollTop(select.scrollTop() + (optionTop - selectTop) - 20);
}

function sortMarkers(arr) {
	var save = Object.prototype.toString;
	Object.prototype.toString = function () { return this.key; };

	arr.sort((a, b) => {
		return a.serial - b.serial;
	});

	Object.prototype.toString = save;
}

function addMarkersToTimeline(arr) {
        const unique = arr.reduce((acc, current) => {
                x = acc.find(item => item.serial === current.serial);
                if (!x) {
                        return acc.concat([current]);
                } else {
                        return acc;
                }
        }, []);

//	unique.reverse();
	$("#timeline").parent().prepend("<button id='timeline-all' type='button'>Select All Times for Vehicle</button>");

	$("#timeline-all").on('click', function() {
//		                ga('set', 'page', 'timelineSelectAll');
//                ga('send', 'pageview');
		ga('send', 'event', 'Timeline', 'Select All');
		$("select#timeline >  option").prop("selected", true);
		$("select#timeline").change();
	});

        for (var i = 0; i < unique.length; i++) {
                //console.log(arr[i].serial);
                serial = unique[i].serial;
                datetime = new Date(serial);
                $('#timeline').append(new Option(datetime.toLocaleDateString("en-AU") + " " + datetime.toLocaleTimeString("en-AU"), serial, true, true));
        }
}

function addMarkersToAliases(arr) {
	const unique = arr.reduce((acc, current) => {
		x = acc.find(item => item.alias === current.alias);
		if (!x) {
			return acc.concat([current]);
  		} else {
    			return acc;
  		}
	}, []);

        $("#aliases").parent().append("<button id='aliases-all' type='button'>Select All Vehicles</button>");

	$("#aliases").parent().prepend("<div id='label-toggle-container'><label for='label-toggle'><input type='checkbox' id='label-toggle' /> Show labels?</label></div>");

	$("#aliases").parent().prepend("<div id='night-toggle-container'><label for='night-toggle'><input type='checkbox' id='night-toggle' /> Dark mode?</label></div>");

        $("#aliases-all").on('click', function() {
//                ga('set', 'page', 'aliasesSelectAll');
//                ga('send', 'pageview');
		ga('send', 'event', 'Aliases', 'Select All');
                $("select#aliases >  option").prop("selected", true);
                $("select#aliases").change();
        });

	for (var i = 0; i < unique.length; i++) {
	//	console.log(arr[i].alias);
		alias = unique[i].alias;
		$('#aliases').append(new Option(alias, alias, true, true));
	}
}

function getPinColourByHour(hour) {
	if (hour > 6 && hour < 18) {
		// if day shift
		return "blue";
	} else {
		return "red";
	}
}

function getPinUrlByHour(hour) {
	colour = getPinColourByHour(hour);
	var url = "http://maps.google.com/mapfiles/ms/icons/";
	url += colour + "-dot.png";

	return url;
}


const styles = {
  default: [],
  silver: [
    {
      elementType: "geometry",
      stylers: [{ color: "#f5f5f5" }],
    },
    {
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#616161" }],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#f5f5f5" }],
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels.text.fill",
      stylers: [{ color: "#bdbdbd" }],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#eeeeee" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#757575" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#e5e5e5" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "road.arterial",
      elementType: "labels.text.fill",
      stylers: [{ color: "#757575" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#dadada" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#616161" }],
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }],
    },
    {
      featureType: "transit.line",
      elementType: "geometry",
      stylers: [{ color: "#e5e5e5" }],
    },
    {
      featureType: "transit.station",
      elementType: "geometry",
      stylers: [{ color: "#eeeeee" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#c9c9c9" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }],
    },
  ],
  night: [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
  ],
  retro: [
    { elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#523735" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#f5f1e6" }] },
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [{ color: "#c9b2a6" }],
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "geometry.stroke",
      stylers: [{ color: "#dcd2be" }],
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels.text.fill",
      stylers: [{ color: "#ae9e90" }],
    },
    {
      featureType: "landscape.natural",
      elementType: "geometry",
      stylers: [{ color: "#dfd2ae" }],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#dfd2ae" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#93817c" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry.fill",
      stylers: [{ color: "#a5b076" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#447530" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#f5f1e6" }],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [{ color: "#fdfcf8" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#f8c967" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#e9bc62" }],
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "geometry",
      stylers: [{ color: "#e98d58" }],
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "geometry.stroke",
      stylers: [{ color: "#db8555" }],
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [{ color: "#806b63" }],
    },
    {
      featureType: "transit.line",
      elementType: "geometry",
      stylers: [{ color: "#dfd2ae" }],
    },
    {
      featureType: "transit.line",
      elementType: "labels.text.fill",
      stylers: [{ color: "#8f7d77" }],
    },
    {
      featureType: "transit.line",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#ebe3cd" }],
    },
    {
      featureType: "transit.station",
      elementType: "geometry",
      stylers: [{ color: "#dfd2ae" }],
    },
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [{ color: "#b9d3c2" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#92998d" }],
    },
  ],
  hiding: [
    {
      featureType: "poi.business",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
  ],
  dark: [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.medical",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "weight": 7.5
      }
    ]
  },
  {
    "featureType": "poi.medical",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "weight": 7.5
      }
    ]
  },
  {
    "featureType": "poi.medical",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
],
};
