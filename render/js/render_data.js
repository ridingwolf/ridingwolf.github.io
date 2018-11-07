function loadResumeData(callback) {
	// nicked from http://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
    var request = new XMLHttpRequest();
    request.overrideMimeType("application/json");
    request.open('GET', '../../Curriculum_vitae.json', true); 
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

String.prototype.toClassName = function(){
	return this.toLowerCase().replace(/ /, '-');
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
			
	return data.render(formatData).in('<div class="complex-list">');
}

function formatObject(data){
	if(!data)
		return '';

	return getKeys(data)
		.render(function (name) {
			var objContent = 	name.in('<div class="name ' + name.toClassName() + '">') + 
								formatData(data[name]).in('<div class="content ' + name.toClassName() + '">');
		return 	objContent.in('<div class="object-property">');
	}).in('<div class="object">');
}

function isEmail(data){
	return data.match(/^[^@]+@([a-z0-9]+\.)+[a-z0-9]+$/);
}

function formatEmail(data){
	return data.replace(/^([^@]+)@(.+)/, '<span>$1</span><span class="email-split"> keep crawling little bots </span><span>$2</span>');
}

function formatString(data){ 
	if(!data)
		return '';
	
	if(isEmail(data))
		return formatEmail(data);

	// chrome casts an string "month year" to a date, day 1 of that month, which gives wrong output
	var date = new Date(data);
	if(date !== "Invalid Date" && !isNaN(date) && date.getDate() !== 1)
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
	var resume = document.getElementById('loading-screen');
	resume.setAttribute('id', 'resume')
	resume.innerHTML = 'Curriculum vitae'.in('<h1>') + 
			getKeys(data)
			.render(function renderSection(name){ 
				var sectionContent = name.in('<h2>') + formatData(data[name]);
				return 	sectionContent.in('<div class="section '+ name.toClassName() + '">');
		});
}

function usesInternetExploder(){
	return navigator.appName == "Microsoft Internet Explorer" || (navigator.appName == "Netscape" && navigator.appVersion.indexOf("Trident") >= 0);
}

function showErrorMessage(message){
	var warning = document.getElementById('loading-screen') || document.getElementById('resume');
	if(null == warning)
		alert('Something went horribly wrong, could not find warning box.');

	warning.removeAttribute('id');
	warning.setAttribute('class', 'warning');
	warning.innerHTML = message;
}

(function automaticloading(){
	loadResumeData(function processData(data){
		setPageTitle(data);
		try{
			if(usesInternetExploder())
				showErrorMessage('This site is not supported in Internet Explorer. <br/><br/>Please upgrade to <em>Microsoft Edge</em> or use a <em>different browser</em> to view this content.');
			else
				render(data);

		} catch (exception) {
			var errorMessage = 'Something went wrong.<br/><br/>' + 
								'Please <a href="https://github.com/ridingwolf/ridingwolf.github.io/issues">log the issue</a>, so I can fix it.<br/><br/>' +
								'<em>Error:</em> ' + exception + '<br/>' +
								'<em>Browser:</em> ' + navigator.appName + '; ' + navigator.appVersion;
			showErrorMessage(errorMessage);
		}
	});
})();