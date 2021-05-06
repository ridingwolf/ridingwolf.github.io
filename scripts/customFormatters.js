import { formatSectionHeader } from './formatters.js'
import { createHtmlTag } from './htmlRendering.js'
import { renderCameraIcon } from './svgAssets.js';

const sectionHeaderFormatters = [
    {
        canFormat: section => (section || '').match(/photography/gi),
        formatHeader: section => formatSectionHeader(
            createHtmlTag(
                'a', 
                `${renderCameraIcon()}${section} `,
                { href : 'https://portfolio.wolfcraft.io', target: '_blank' }))
    }
]

function getCustomFormattersForSection(sectionName) {
    const formatters = sectionHeaderFormatters
        .filter(({ canFormat = () => false }) => canFormat(sectionName))
        .map(({ formatHeader }) => formatHeader)
        .filter(formatter => formatter !== undefined);

    if (formatters.length === 0)
        return {};

    if (formatters.length > 1)
        console.warn(`multiple section-header formatters found for '${sectionName}'`);
    
    return {
        formatHeader: formatters[0]
    }
}

export { getCustomFormattersForSection };