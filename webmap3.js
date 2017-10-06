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
//Search features on map
function btnQuery_OnClick()
{
	var title, keyword2, lowcase;
	var keyword=document.getElementById('txtKeyword').value.replace(/'/g, "\\\'"); 
	keyword2= keyword.toLowerCase();
	//alert(keyword2);
    /*if (/[^A-Za-z]/.test(keyword)){
		alert("Please input a valid name")
		return false;
	}
	else{
		var whereclause = "'Title' CONTAINS IGNORING CASE '" + keyword + "'"
		layer.setOptions ({
			query: {
			    select: 'geometry',
				from: '1s24ZMnYrmyZTDTy84t1gCUY_hGLpmZMxbmGS0pU',
				where: whereclause
			}
		});
		layer.setMap(map);
	}*/
	var features= document.getElementsByName('legendlist');
	for (i=0; i< features.length; i++){features[i].checked= false};
	map.data.forEach(function(feature) {
		title = feature.getProperty('Title');
		name=feature.getProperty('Name');
		title_low = String(title).toLowerCase();
		name_low = String(name).toLowerCase();
		//lowcase = lowcase;
		//if (lowcase == keyword2){
		//if (title == keyword){ //"'Title' CONTAINS IGNORING CASE '"
		if ((title_low.indexOf(keyword2)> -1)|(name_low.indexOf(keyword2)> -1)){ //"'Title' CONTAINS IGNORING CASE '"
			//alert(title2+ ' '+keyword2);
			//alert(title);
			feature.setProperty('Display',true);
			for (i=0; i< features.length; i++){
				if (features[i].value == feature.getProperty('Type')){
					features[i].checked = true;
					features[0].checked = false;
				}
			}
		}
		else{
			feature.setProperty('Display',false);
		}
	})
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
			document.getElementById(shID).style.height = '150px';
			document.getElementById('HelpTab').style.top = '510px';

        }
        else {
            document.getElementById(shID+'-show').style.display = 'inline';
            document.getElementById(shID+'-hide').style.display = 'none';
            //document.getElementById(shID).style.display = 'none';
			document.getElementById(shID).style.height = '0px';
			document.getElementById('HelpTab').style.top = '650px';
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