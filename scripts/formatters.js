import { 
	createHtmlTag,
	createDiv,
	createElements,
} from './htmlRendering.js';

function isEmail(str){
	return str && str.match(/^[^@]+@([a-z0-9]+\.)+[a-z0-9]+$/);
}

function formatEmail(email){
    const emailFormat = 
        createHtmlTag('span', '$1') +
        createHtmlTag('span', 'keep crawling little bots', { class: 'email-split' }) +
        createHtmlTag('span', '$2');

	return email.replace(/^([^@]+)@(.+)/, emailFormat);
}

function formatClassName(name){
	return (name || '').toLowerCase().replace(/ /, '-');
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

function formatArray(data){
	if((data || []).length === 0)
		return '';

	if(typeof data[0] === 'string')
		return createDiv(
			createElements(data, item => createDiv(formatString(item), { class: "item" })),
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
		createElements(
			data,
			name => createDiv(
				createDiv(
					name, 
					{ class: `name ${formatClassName(name)}`}
				) + 
				createDiv(
					formatData(data[name]), 
					{ class: `content ${formatClassName(name)}` }
				), 
				{ class: "object-property" }
			)
		),
		{ class: "object"}
	);
}

const defaultFormatters = {
	'Array' : formatArray,
	'Object' : formatObject,
	'String' : formatString
};

function formatData(data){
	if(!data)
		return '';

	const formatter = defaultFormatters[data.constructor.name];
	return formatter ? formatter(data) : '';
}

function formatSectionHeader(sectionName){
	return createHtmlTag('h2', sectionName);
}

function formatSection(sectionName, sectionData, customFormatters = {}){
	const { formatHeader = formatSectionHeader } = customFormatters;
	return createDiv(
		formatHeader(sectionName) + formatData(sectionData),
		{ class: `section ${formatClassName(sectionName)}` }
	);
}

export {
	formatClassName,
	formatData,
	formatSectionHeader,
	formatSection,
}