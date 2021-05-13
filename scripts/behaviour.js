const behaviourNotDefinedClassName = 'behaviour-not-defined'; 

const initializePrintButton = () => {
    for(const print of document.querySelectorAll(`.printer.icon.${behaviourNotDefinedClassName}`)) {
        print.addEventListener('click', () => window.print());
        print.classList.remove(behaviourNotDefinedClassName);
    }
}

export default () => { 
    initializePrintButton();
}; 