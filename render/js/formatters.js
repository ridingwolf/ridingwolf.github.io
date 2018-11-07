import { createHtmlTag } from './htmlRendering.js';

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


export {
    formatString,
}