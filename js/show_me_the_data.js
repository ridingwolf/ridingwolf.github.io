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

Array.prototype.render = function(formatData) {
	return this.map(formatData).join('');
}

String.prototype.in = function (element) {
	return element + this + element.replace(/^<([a-z0-9]+).*>$/gi, '</$1>');
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
			.render(function(item){ return item.in('<div class="item">'); })
			.in('<div class="simple-list">');
			
	return data.render(formatData);
}

function formatObject(data){
	if(!data)
		return '';

	return getKeys(data).render(function (name) {
		var objContent = name.in('<div class="name">') + 
						formatData(data[name]).in('<div class="content">');
		return 	objContent.in('<div class="object-item">');
	});
}

function formatString(data){ 
	if(!data)
		return '';

	var date = new Date(data);
	if(date !== "Invalid Date" && !isNaN(date))
		return date.toLocaleString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

	return data; 
}

var formatters = {
	'Array' : formatArray,
	'Object' : formatObject,
	'String' : formatString
};

function formatData(data){
	return data ? formatters[data.constructor.name](data) : '';
}

function render(data){
	document
		.getElementById('resume')
		.innerHTML = 'Curriculum vitae'.in('<h1>') + 
			getKeys(data)
			.render(function renderSection(name){ 
				var className = name.toLowerCase().replace(/ /, '-'),
				sectionContent = name.in('<h2>') + formatData(data[name]);
				return 	sectionContent.in('<div class="section '+ className + '">');
		});
}

(function automaticloading(){
	loadResumeData(function processData(data){
		setPageTitle(data);
		render(data);
	});
})();