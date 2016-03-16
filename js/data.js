// nicked from http://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
(function loadResumeData() {
    var request = new XMLHttpRequest();
    request.overrideMimeType("application/json");
    request.open('GET', './Curriculum_vitae.json', false); 
    request.onreadystatechange = function () {
          if (request.readyState == 4 && request.status == "200") {
            window.resume = JSON.parse(request.responseText);
        }
    };
    request.send(null);  
})();