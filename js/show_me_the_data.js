function loadResumeData(callback) {
	// nicked from http://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
    var request = new XMLHttpRequest();
    request.overrideMimeType("application/json");
    request.open('GET', './Curriculum_vitae.json', true); 
    request.onreadystatechange = function () {
          if (request.readyState == 4 && request.status == "200") {
            callback(JSON.parse(request.responseText));
        }
    };
    request.send(null);  
}

function setPageTitle(data){
	document
		.getElementsByTagName('title')[0]
		.innerHTML += ': ' + data['Personal Summary']['Name'] || 'Sloppy developer';
}

function getKeys(data){
	return Object.keys(data || {});
}

function formatArrayData(data){
	if(data.len === 0)
		return '';

	if(typeof data[0] === 'string')
		return data.toString().replace(/,/g, ', ');

	return 'data.len';
}

function formatSectionData(sectionData){
	console.log(sectionData)
	if(!sectionData)
		return '';

	if(sectionData instanceof Array)
		return formatArrayData(sectionData);
	else
		return 'object formatting not yet supported';
}

function createSection(name, sectionData){
	return '' + 
		'<h2>' + name + '</h2>' +
		'<div class="section">' + 
			formatSectionData(sectionData) + 
		'</div>';
}

function showData(data){
	var sections = '';
	_.forEach(getKeys(data), function processSection(name){
		sections += createSection(name, data[name]);
	});

	document.getElementById('resume').innerHTML = sections;
}

(function automaticloading(){
	loadResumeData(function processData(data){
		setPageTitle(data);
		setTimeout(function delayedLoading(){ showData(data); }, 1500);
	});
})();