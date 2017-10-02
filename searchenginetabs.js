
var MULTIVERSEOBJECT = JSON.parse(readJSONFile('searchengines.json')); //Get all categories and search engines from JSON file
var SELECTEDCATEGORY = 'All'; //default
var ALLSEARCHENGINESINCATEGORY = MULTIVERSEOBJECT[SELECTEDCATEGORY]; 
var SELECTEDSEARCHENGINES = [ALLSEARCHENGINESINCATEGORY.names[0]]; //default Array object
var QUERY;
buildCategoriesHTML(SELECTEDCATEGORY); 

window.onload = function(){
	document.getElementById("searchbar").focus();
}

//Trigger search
document.onkeydown = function(){
	QUERY = document.getElementById("searchbar").value; 
	var selectedTabsObject = document.querySelectorAll('.searchtabselected');
	if(event.shiftKey){
		var tabDivsActivated = document.querySelectorAll('.tabs div');
		for (var i = 0; i < tabDivsActivated.length; i++) {
			tabDivsActivated[i].setAttribute('class', 'searchtabselected');
		}
	}
	if (window.event.keyCode == '13'){
		launchSearchTabs(selectedTabsObject);
	}
}

document.onkeyup = function(){
	buildTabsHTML(SELECTEDCATEGORY,SELECTEDSEARCHENGINES);
}

function launchSearchTabs(selectedTabsObject){
	var url = [];
	for (var i = 0; i < selectedTabsObject.length; i++) {
		url[i] = selectedTabsObject[i].getAttribute('value').replace('{searchTerms}', QUERY);
		
		if(i == 0){
			chrome.tabs.update(null, {url : url[i], active : true});
			//chrome.tabs.create({url : url[i] , active : true});	
		}
		else{
			chrome.tabs.create({url : url[i] , active : false});	
		}	
	}
}


//html for category with onClick logic
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

//html for Search tabs with onClick logic
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
				//alert(JSON.stringify(SELECTEDSEARCHENGINES));
				//Remove from the array
			}
			else{
				this.setAttribute('class', 'searchtabselected');
				SELECTEDSEARCHENGINES.push(this.id);
				//alert(JSON.stringify(SELECTEDSEARCHENGINES));
			}
		}
	}
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

