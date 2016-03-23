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

Array.prototype.render = function() {
	return this.join('');
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
			.map(function(item){ return '<div class="item">' + item + ',</div>'; })
			.render()
			.replace(/,(<\/[^<]+>)$/, '$1');
			
	return data.map(formatData).render();
}

function formatObject(data){
	if(!data)
		return '';

	return getKeys(data).map(function (name) {
		return '<div class="object-item">' + 
					'<div class="name">' + name + '</div>' + 
					'<div class="content">' + formatData(data[name]) + '</div>' + 
				'</div>';
	}).render();
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
		.innerHTML = getKeys(data)
			.map(function (name){ 
				return 	'<div class="section '+ name.toLowerCase().replace(/ /, '-') + '">' +
							'<h2>' + name + '</h2>' +
							formatData(data[name]) + 
						'</div>';
		}).render();
}

(function automaticloading(){
	loadResumeData(function processData(data){
		setPageTitle(data);
		render(data);
	});
})();