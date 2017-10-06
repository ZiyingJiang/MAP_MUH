/**Functions of the interactive MUM campus map
 @author jiangz5
 
//researved for future
function detectBrowser() {
  var useragent = navigator.userAgent;
  var mapdiv = document.getElementById("map-canvas");
	console.log('browser detected');
  if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
    mapdiv.width = '100%';
    mapdiv.height = '100%';
  } else {
    mapdiv.width = '600px';
    mapdiv.height = '800px';
  }
  console.log('browser detected');
};
*/

//Display all features; function only responds to 'All' checkbox
function DisplayAllFeatures()
{
	var features= document.getElementsByName('legendlist');

	if (features[0].checked){
		for (i=1; i< features.length; i++){features[i].checked=false;}
		map.data.setStyle({visible: true});
		map.data.forEach(function(feature) {
			feature.setProperty('Display',true);
		})		
	}
    else{
    	map.data.forEach(function(feature) {
			feature.setProperty('Display',false);
		})
    }
	map.data.setStyle(StyleFeature);
}

//Display other features; function responds to any checkbox other than 'All'    
function DisplayFeatures()
{
	var features= document.getElementsByName('legendlist');
	
	for (i=1; i< features.length; i++){
		if (features[i].checked){
			features[0].checked = false; 	//uncheck the 'Display All'
			//iterate through the map.data features
			map.data.forEach(function(feature) {
				if (feature.getProperty('Type')==features[i].value){
					feature.setProperty('Display',true);
				}
			})
		}
		else{
			map.data.forEach(function(feature) {
			if (feature.getProperty('Type')==features[i].value){
						feature.setProperty('Display',false);
					}
			})
		}
	};
	map.data.setStyle(StyleFeature);
}

function DisplayFeatures2()
{
	map.data.forEach(function(feature) {
			feature.setProperty('Display',false);});
	var features = $('#legendlist2').val();
	message="selected are";
	//check the first item, if it is not "ALL" then examine the rest, remove "ALL" if it is among the selection
	// then turn all selected features on;
	// if the first item is "ALL", simply turn all the features 
	if (features[0]!="ALL") {
		for (i=0; i< features.length; i++) {
			if (features[i]=="ALL"){
				//features.splice(i, 1) //remove the item from the array
			}
			else{
				map.data.forEach(function(feature) {
				if (feature.getProperty('Type')==features[i]){
						feature.setProperty('Display',true);
					}
				})
			}
		}
	}
	else{
			map.data.setStyle({visible: true});
			map.data.forEach(function(feature) {
					feature.setProperty('Display',true);
			})
	};
	map.data.setStyle(StyleFeature);
}
	
//Switch base map between roadmap and satellite 
function btnRoadMap_OnClick()
{
	map.setMapTypeId(google.maps.MapTypeId.ROADMAP);	
}

function btnSateMap_OnClick()
{
	map.setMapTypeId(google.maps.MapTypeId.SATELLITE);	
}
function btnBaseMap_OnClick()
{
	var base= map.getMapTypeId(map);
	if (base=='satellite'){
		map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
		document.getElementById('btnBaseMap').textContent='Satellite';			
	}
	else if (base =='roadmap'){ 
		map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
		document.getElementById('btnBaseMap').textContent='Map';
	}	
}

//find my location
function btnMyLocation_OnClick() {
	if (document.getElementById('btnMyLocation').textContent=='My location'){
		if (navigator.geolocation) {
			   navigator.geolocation.getCurrentPosition(
				   function(position) {
					   var pos = {
						   lat: position.coords.latitude,
						   lng: position.coords.longitude
					   };
	
					   var marker = new google.maps.Marker({
						   position: pos,
						   map: map,
						   title: "You are here.",
					   });
						MyLoc.push(marker); //MyLoc is a global variable to store the marker
					   map.setCenter(pos);
					   document.getElementById('btnMyLocation').textContent='Map center';
				   }, function() {
					 handleLocationError(true, marker, map.getCenter());
				   });
		} else {
		  // Browser doesn't support Geolocation
		  handleLocationError(false, infoWindow, map.getCenter());
		}
	}else{
		for (var i = 0; i < MyLoc.length; i++) {
				MyLoc[i].setMap(null);
			}
		MyLoc= [];
		//above code not only hide marker but delete it
		map.setCenter(Mcenter);
		map.data.setStyle(StyleFeature);
		document.getElementById('btnMyLocation').textContent='My location';

	}
}

//Search features on map
function btnQuery_OnClick()
{
	map.data.revertStyle();
	infowindow.close(map);
	Qcenter= Mcenter;
	message='Feature is not found';
	var title, keyword2;
	var keyword=document.getElementById('txtKeyword').value.replace(/'/g, "\\\'"); 
	var keyword2= keyword.toLowerCase();

    /*if (/[^A-Za-z]/.test(keyword)){
		alert("Please input a valid name")
		return false;
	}*/
	var features= document.getElementsByName('legendlist');
	if (!features[0].checked) {
		for (i=0; i< features.length; i++){features[i].checked= false};
	}
	map.data.forEach(function(feature) {
		var title = feature.getProperty('Title');
		var name=feature.getProperty('Name');
		var title_low = String(title).toLowerCase();
		var name_low = String(name).toLowerCase();

		if ((title_low.indexOf(keyword2)> -1)|(name_low.indexOf(keyword2)> -1)){ //"'Title' CONTAINS IGNORING CASE '"
			feature.setProperty('Display',true);
			if (title){message = title} else {message = name};
			map.data.overrideStyle(feature,{ //highlight the queried feature
				icon: {				
					path: google.maps.SymbolPath.CIRCLE,
					scale: 8,
					fillColor:'purple',
					fillOpacity:1,
					strokeColor:'purple',
					strokeWeight: 3
					},
				fillColor:'yellow', 
				fillOpacity: 0.8,
				strokeColor:'yellow',
				strokeWeight: 3
			});
			
			/*if (feature.getGeometry().getLength()< 2){
				Qcenter= feature.getGeometry().getAt(0); 
				if (Qcenter instanceof google.maps.LatLng){ //single point
					alert('single point')
				}
				else {
					Qcenter=Qcenter.getAt(0);//single feature with multiple coordinates
					if (Qcenter instanceof google.maps.LatLng){ 
						alert('single feature with multiple coordinates')
					}
					else{ //single Multi-feature with multiple coordinates
						Qcenter=feature.getGeometry().getAt(0).getArray();
						Qcenter=Qcenter[0].getAt(0);
						alert('single Multi-feature with multiple coordinates');
					};
				};
			}
			else{
				//alert('option 2');	
				Qcenter= feature.getGeometry().getArray();//multiple features with multiple coordinates
				Qcenter=Qcenter[0];
				if (Qcenter instanceof google.maps.LatLng){alert('multiple features with multiple coordinates')};
			};*/

			if (feature.getGeometry().getType()==='Point'){//get the latlng of the point
				Qcenter= feature.getGeometry().get();
				//if (Qcenter instanceof google.maps.LatLng){alert('valid point latlong')};
			}
			else{
				/*len=feature.getGeometry().getLength();
				//alert(len);
				//if (feature.getGeometry().getLength()> 1)
				Qcenter= feature.getGeometry().getAt(0);//get the latlng of the point
				//Qcenter=Qcenter[0].getAt(0);
				if (Qcenter instanceof google.maps.LatLng){alert('valid getAt0')};
				if (feature.getGeometry().getType()==='LineString') {
					Qcenter=Qlatlng[0].getAg
					if (Qcenter instanceof google.maps.LatLng){alert('valid line latlong')};
				}
				else{
				
				}*/
				if (feature.getGeometry().getLength()<2) {
                    Qcenter=feature.getGeometry().getAt(0);//single feature with multiple coordinates
					Qcenter=Qcenter.getAt(0);
					if (Qcenter instanceof google.maps.LatLng){ 
						//alert('single feature with multiple coordinates')
					}
					else{ //single Multi-feature with multiple coordinates
						Qcenter=feature.getGeometry().getAt(0).getArray();
						Qcenter=Qcenter[0].getAt(0);
						//alert('single Multi-feature with multiple coordinates');
					};
                }
				else{
					Qcenter= feature.getGeometry().getArray();//multiple features with multiple coordinates
					Qcenter=Qcenter[0];
					//if (Qcenter instanceof google.maps.LatLng){alert('multiple features with multiple coordinates')};					
				}
				
			}
			//alert(feature.getProperty('Type'));
			for (i=0; i< features.length; i++){
				if (features[i].value == feature.getProperty('Type')){
					features[i].checked = true;
					features[0].checked = false;
				}
			}
			
		}
		else{feature.setProperty('Display',false);}
	})
	map.setCenter(Qcenter);
	/*var marker = new google.maps.Marker({
       position: Qcenter,
       map: map,
	   //title:message,
       //labelContent: message,
       //labelAnchor: new google.maps.Point(22, 0),
	   animation:google.maps.Animation.BOUNCE,
      //labelClass: "labels" // the CSS class for the label
     });
	var infowindow = new google.maps.InfoWindow({
      content: message,
	  maxWidth:200,
	  //position: Qcenter,
	  //map: map
	});*/
	
	//add an infowindow to display the name of the found feature, if not found, show default message"feature is not found" 
	infoWindowContent = infowindow.setContent(message);
	infowindow.setPosition(Qcenter);
	infowindow.open(map);
	map.data.setStyle(StyleFeature);
	
}
//Toggle instruction
function btnInstr_OnClick()
{
	if (document.getElementById('instruction').style.display =='none')
	{
		document.getElementById('btnInstr').textContent='Hide help';
		document.getElementById('instruction').style.display='inline-block';
	}
	else {
		document.getElementById('btnInstr').textContent='Show help';
		document.getElementById('instruction').style.display='none';
	}
}
//tailored from http://jsfiddle.net/Bq6eK/13/
//see original question here  http://stackoverflow.com/questions/21504484/how-hard-is-it-to-make-an-expanding-tab-in-css
function showHide(shID) {
    if (document.getElementById(shID)) {
        if (document.getElementById(shID+'-show').style.display != 'none') {
            document.getElementById(shID+'-show').style.display = 'none';
            document.getElementById(shID+'-hide').style.display = 'inline';
            //document.getElementById(shID).style.display = 'block';
			document.getElementById(shID).style.height = '160px';
			document.getElementById('HelpTab').style.top = '530px';

        }
        else {
            document.getElementById(shID+'-show').style.display = 'inline';
            document.getElementById(shID+'-hide').style.display = 'none';
            //document.getElementById(shID).style.display = 'none';
			document.getElementById(shID).style.height = '0px';
			document.getElementById('HelpTab').style.top = '670px';
        }
    }
}

function ExpandCollapse(shID) {
    if (document.getElementById(shID)) {
        if (document.getElementById(shID).innerHTML == 'Read more...') {
            document.getElementById(shID).innerHTML = 'Hide full story';
			//document.getElementById(shID).style.top = '-10px';
			document.getElementById('info-panel-id').style.Height = 'auto';
            document.getElementById('info-panel-id').style.maxHeight = 'auto';
        }
        else {
            document.getElementById(shID).innerHTML = 'Read more...';
			//document.getElementById(shID).style.top = '-10px';
			document.getElementById('info-panel-id').style.Height = '180px';
            document.getElementById('info-panel-id').style.maxHeight = '180px';
        }
	}
}

//autocompletion of search input
function AutoComplete() {
    // Retrieve the unique feature names using GROUP BY workaround.
    var queryText = encodeURIComponent(
        "SELECT 'Title', COUNT() " +
        'FROM ' + '1s24ZMnYrmyZTDTy84t1gCUY_hGLpmZMxbmGS0pU' + " GROUP BY 'Title'");
    var query = new google.visualization.Query(
        'http://www.google.com/fusiontables/gvizdata?tq='  + queryText);

    query.send(function(response) {
      var numRows = response.getDataTable().getNumberOfRows();

      // Create the list of results for display of autocomplete.
      var results = [];
      for (var i = 0; i < numRows; i++) {
        results.push(response.getDataTable().getValue(i, 0));
      }

      // Use the results to create the autocomplete options.
      $('#txtKeyword').autocomplete({
        source: results,
        minLength: 1
      });
    });
}