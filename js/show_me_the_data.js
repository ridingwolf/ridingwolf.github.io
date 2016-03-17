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

function formatArray(data){
	if((data || []).length === 0)
		return '';

	if(typeof data[0] === 'string')
		return data
			.map(function(item){ return '<span>' + item + ',</span>'; })
			.join('')
			.replace(/,(<\/[^<]+>)$/, '$1');

	return data.map(formatData);
}

function formatObject(data){
	if(!data)
		return '';

	var names = getKeys(data),
	objectProperties = '';
	_.forEach(names, function(name){
		objectProperties += '<div><span>' + name + '</span>:<div>' + formatData(data[name]) + '</div></div>' 
	})
	return objectProperties;
}

var formatters = {
	'Array' : formatArray,
	'Object' : formatObject,
	'String' : function(data){ return data; }
};

function formatData(data){
	console.log(data.constructor.name);
	return data ? formatters[data.constructor.name](data) : '';
}

function createSection(name, sectionData){
	return '<h2>' + name + '</h2>' +
		'<div class="section">' + 
			formatData(sectionData) + 
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