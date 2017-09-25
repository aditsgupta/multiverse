
var QUERY;
var MULTIVERSEOBJECT = JSON.parse(readJSONFile('searchengines.json')); //Get all categories and search engines from JSON file
var SELECTEDCATEGORY = 'all'; //default
var ALLSEARCHENGINESINCATEGORY = MULTIVERSEOBJECT[SELECTEDCATEGORY]; 
var SELECTEDSEARCHENGINES = [ALLSEARCHENGINESINCATEGORY.names[0]]; //default Array object
buildCategoriesHTML(SELECTEDCATEGORY); 

//Trigger selected search engines on pressing Enter & All engines on pressing Shift + Enter
document.onkeydown = function(){
    if(window.event.keyCode =='13'){    	
        if(event.shiftKey){
        	SELECTEDSEARCHENGINES = ALLSEARCHENGINESINCATEGORY; //All search engines in the category
        }
        QUERY = document.getElementById("searchbar").value;
        buildSearchURL();
        //alert(JSON.stringify(urlArray, null, 4));
    }
}


function buildCategoriesHTML(selectedCategory){
	var allCategories = Object.keys(MULTIVERSEOBJECT);
	var categoryHTML = '';
	for (var i = 0; i < allCategories.length; i++) {
		if (allCategories[i] == selectedCategory) {
			categoryHTML += '<div class="categoryselected" id="' + allCategories[i] +'" onclick ="categoryOnClick()"> '+ allCategories[i] +' </div>';
		} 
		else {
			categoryHTML += '<div class="categoryunselected" id="' + allCategories[i] +'" onclick ="categoryOnClick()"> '+ allCategories[i] +' </div>';
		}
	}
	document.querySelector('.categories').innerHTML = categoryHTML;

	//Logic for Category single selection
	var categoryDivs = document.querySelectorAll('.categories div');
	for (var i = 0; i < categoryDivs.length; i++) {
		categoryDivs[i].onclick = function(){
			buildCategoriesHTML(this.id);
		}
	}
	ALLSEARCHENGINESINCATEGORY = MULTIVERSEOBJECT[selectedCategory];
	SELECTEDCATEGORY = selectedCategory;
	SELECTEDSEARCHENGINES = [ALLSEARCHENGINESINCATEGORY.names[0]]; // Again defaultng on the first tab;
	buildTabsHTML(selectedCategory, SELECTEDSEARCHENGINES);	
}

function buildTabsHTML(selectedCategory, selectedTabs){
	ALLSEARCHENGINESINCATEGORY = MULTIVERSEOBJECT[selectedCategory];
	var tabsHTML = '';

	for (var i = 0; i < ALLSEARCHENGINESINCATEGORY.names.length; i++) {

		if (SELECTEDSEARCHENGINES.indexOf(ALLSEARCHENGINESINCATEGORY.names[i]) > -1) {
			tabsHTML += '<div class="searchtabselected" id='+ ALLSEARCHENGINESINCATEGORY.names[i]+' value=' + ALLSEARCHENGINESINCATEGORY.urls[i] +'> <img src="' + ALLSEARCHENGINESINCATEGORY.favicons[i] + '"> <p>' + ALLSEARCHENGINESINCATEGORY.names[i] +'</p> </div>';
		}
		else{
			tabsHTML += '<div class="searchtabunselected" id='+ALLSEARCHENGINESINCATEGORY.names[i]+' value=' + ALLSEARCHENGINESINCATEGORY.urls[i] +'> <img src="' + ALLSEARCHENGINESINCATEGORY.favicons[i] + '"> <p>' + ALLSEARCHENGINESINCATEGORY.names[i] +'</p> </div>';
		}
	}
	document.querySelector('.tabs').innerHTML = tabsHTML;

	//Logic for Search tabs multiple selection
	var tabDivs = document.querySelectorAll('.tabs div');
	for (var i = 0; i < tabDivs.length; i++) {
		tabDivs[i].onclick = function(){
			if(this.className == 'searchtabselected'){
				this.setAttribute('class', 'searchtabunselected');
				var idToRemove = this.id;
				SELECTEDSEARCHENGINES = SELECTEDSEARCHENGINES.filter(removeSearchEngine);
				function removeSearchEngine(a){
					return a != idToRemove
				}
				alert(JSON.stringify(SELECTEDSEARCHENGINES));
				//Remove from the array
			}
			else{
				this.setAttribute('class', 'searchtabselected');
				SELECTEDSEARCHENGINES.push(this.id);
				alert(JSON.stringify(SELECTEDSEARCHENGINES));
			}
		}
	}
}



function buildSearchURL() {
	var url = [];
	var selectedTabsObject = document.querySelectorAll('.searchtabselected');
	for (var i = 0; i < selectedTabsObject.length; i++) {
		url[i] = selectedTabsObject[i].getAttribute('value').replace('{searchTerms}',QUERY);		
	}
	alert(JSON.stringify(url, null, 4));//Debug
	//return url;
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

