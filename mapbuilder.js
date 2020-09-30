var bounds = new google.maps.LatLngBounds();
//var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

var mapOptions = {
    	zoom: 2,
    	center: new google.maps.LatLng(0, 0)
 };

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

$(document).ready(function () {
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
	ga('set', 'page', 'viewMapWithTimeline');
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
			//console.log(selected + "=" + current + "? " + selected.includes(current));

			if (selected.includes(current) == true && selected_alias.includes(current_alias)) {
				markers[i].setVisible(true);
				//bounds.extend(markers[i].position);

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
			}
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
                       //console.log(selected + "=" + current + "? " + selected.includes(current));

                        if (selected.includes(current) == true) {
                                markers[i].setVisible(true);
				bounds.extend(markers[i].position);
//				serial = markers[i].serial.toString();
				serial = markers[i].serial;
				datetime = new Date(markers[i].serial);
				$('#timeline').append(new Option(datetime.toLocaleDateString("en-AU") + " " + datetime.toLocaleTimeString("en-AU"), serial, true, true));
                        } else {
                                markers[i].setVisible(false);
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
		title: label
	});

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
