import {
	createDiv,
	createHtmlTag,
 } from './htmlRendering.js';

import { 
	formatString,
} from './formatters.js';

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
		return createDiv(
			data.render(item => createDiv(item, { class: "item" })),
			{ class: "simple-list" }
		);
			
	return createDiv(data.render(formatData), { class: "complex-list" });
}

function formatObject(data){
	if(!data)
		return '';

	return createDiv(
		getKeys(data).render(name =>
			createDiv( 	
				createDiv(name, { class: `name ${name.toClassName()}`}) + 
				createDiv(formatData(data[name]), { class: `content ${name.toClassName()}` }),
				{ class: "object-property" }
			),
			{ class: "object"}
		)
	);
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
	resume.innerHTML = 
		createHtmlTag('h1', 'Curriculum vitae') + 
		getKeys(data).render(sectionName => renderSection(sectionName, data[sectionName]));
}

function renderSection(name, contentData){
	return createDiv(
		createHtmlTag('h2', name) + formatData(contentData), 
		{ class: `section ${name.toClassName()}` }
	);
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