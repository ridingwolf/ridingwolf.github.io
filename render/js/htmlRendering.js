function writeAttributes (attributes = {}) {
    const attributeNames = Object.keys(attributes || {});
    if(attributeNames.length === 0)
        return '';

    return ' ' + attributeNames 
        .map(name => `${name}="${attributes[name]}"`)
        .join(' ');
}

function createHtmlTag(type = '', content = '', attributes = {}){
    if(!type || '' === type.trim())
        return '';    
    
    return `<${type}${writeAttributes(attributes)}>${content}</${type}>`;
}

function createDiv(content, attributes){
    return createHtmlTag('div', content, attributes);
}

export {
    createDiv,
    createHtmlTag,
}