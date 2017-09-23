
var QUERY;
var MULTIVERSEOBJECT = JSON.parse(readJSONFile('searchengines.json')); //Get all categories and search engines from JSON file
var SELECTEDSEARCHENGINES;
buildCategoriesHTML('all'); //default


function buildCategoriesHTML(selectedCategory){
	var allCategories = Object.keys(MULTIVERSEOBJECT);
	var categoryHTML = '';
	for (var i = 0; i < allCategories.length; i++) {
		if (allCategories[i] == selectedCategory) {
			categoryHTML += '<div class="categoryselected" id="'+ allCategories[i]+'" > '+allCategories[i]+' </div>';
		} 
		else {
			categoryHTML += '<div class="categoryunselected" id="'+ allCategories[i]+'" > '+allCategories[i]+' </div>';
		}
	}
	document.querySelector('.categories').innerHTML = categoryHTML;

	//Category selector (Single selection)
	var categories = document.querySelectorAll('.categories div');
	for (var i = 0; i < categories.length; i++) {
		categories[i].onclick = function(){
			for (var j = 0; j < categories.length; j++) {
				categories[j].setAttribute('class','categoryunselected');
				if(this == categories[j]){
					categories[j].setAttribute('class','categoryselected');
					buildTabsHTML(this.id);
				}
			}	
		}
	}
	buildTabsHTML(selectedCategory);
}

function buildTabsHTML(selectedCategory){
	var allSearchEngines = MULTIVERSEOBJECT[selectedCategory];
	var tabsHTML = '';
	for (var i = 0; i < allSearchEngines.names.length; i++) {
		if (i == 0) {
			tabsHTML += '<div class="searchtabselected" id='+ allSearchEngines.names[i]+' value=' + allSearchEngines.urls[i] +'> <img src="' + allSearchEngines.favicons[i] + '"> <p>' + allSearchEngines.names[i] +'</p> </div>';
			//defaulting on the first tab as selected
		} 
		else {
			tabsHTML += '<div class="searchtabunselected" id='+allSearchEngines.names[i]+' value=' + allSearchEngines.urls[i] +'> <img src="' + allSearchEngines.favicons[i] + '"> <p>' + allSearchEngines.names[i] +'</p> </div>';
		}
		
	}
	document.querySelector('.tabs').innerHTML = tabsHTML;

	//Search engine tabs selector (Multiple selection)
	var searchTabs = document.querySelectorAll('.tabs div');
	for (var i = 0; i < searchTabs.length; i++) {
		searchTabs[i].onclick = function(){
			for (var j = 0; j < searchTabs.length; j++) {
				if (this == searchTabs[j] && this.className == 'searchtabselected') {
					searchTabs[j].setAttribute('class','searchtabunselected');
					SELECTEDSEARCHENGINES = document.querySelectorAll('.searchtabselected'); //Reset the selected search engines
					return;
				}
				if(this == searchTabs[j] && this.className == 'searchtabunselected'){
					searchTabs[j].setAttribute('class','searchtabselected');
					SELECTEDSEARCHENGINES = document.querySelectorAll('.searchtabselected'); //Reset the selected search engines
					return;
				}
			}	
		}
	}

}


//Trigger selected search engines on pressing Enter & All search engines on pressing Shift + Enter
document.onkeydown = function(){
	
    if(window.event.keyCode =='13'){
    	QUERY = document.getElementById("searchbar").value;
        if(event.shiftKey){
        	SELECTEDSEARCHENGINES = MULTIVERSEOBJECT[selectedCategory]
        }
        var urlArray = buildSearchURL();
        //alert(JSON.stringify(urlArray, null, 4));
    }
}


function buildSearchURL() {
	var url = [];
	for (var i = 0; i < SELECTEDSEARCHENGINES.length; i++) {
		var urlTemplate = SELECTEDSEARCHENGINES[i].getAttribute('value')
		url[i] = urlTemplate.replace('{searchTerms}',QUERY);		
	}
	alert(JSON.stringify(url, null, 4));//Debug
	return url;
}


//Read the JSON file
function readJSONFile(file)
{ var allText
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
    return allText;
}




