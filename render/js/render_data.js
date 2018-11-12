import {
	createDiv,
	createHtmlTag,
	createElements,
 } from './htmlRendering.js';

import { 
	formatString,
	formatClassName,
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

function setPageTitle(data){
	document
		.getElementsByTagName('title')[0]
		.innerHTML += ': ' + data['Personal Summary']['Name'] || 'Sloppy developer';
}

function formatArray(data){
	if((data || []).length === 0)
		return '';

	if(typeof data[0] === 'string')
		return createDiv(
			createElements(data, item => createDiv(item, { class: "item" })),
			{ class: "simple-list" }
		);
			
	return createDiv(
		createElements(data, formatData),
		{ class: "complex-list" }
	);
}

function formatObject(data){
	if(!data)
		return '';

	return createDiv(
		createDiv( 	
			createElements(
				data,
				name =>
					createDiv(
						name, 
						{ class: `name ${formatClassName(name)}`}
					) + 
					createDiv(
						formatData(data[name]), 
						{ class: `content ${formatClassName(name)}` }
					)	
			),
			{ class: "object-property" }
		),
		{ class: "object"}
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
		createElements(data, sectionName => renderSection(sectionName, data[sectionName]));
}

function renderSection(name, contentData){
	return createDiv(
		createHtmlTag('h2', name) + formatData(contentData), 
		{ class: `section ${formatClassName(name)}` }
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
