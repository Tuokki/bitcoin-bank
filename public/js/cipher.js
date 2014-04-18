'use strict';

/* jshint ignore:start */

var caesarCipher = new Object();
caesarCipher.name = "Caesar cipher";
caesarCipher.source = "function crypt(text) {var shift = 25;var key = parseInt(shift, 10);if (key < 0 || key >= 26) {console.log('Shift is out of range (0-25)');return}key = (26 - key) % 26;var input = text; var output = '';for (var i = 0; i < input.length; i++) {var c = input.charCodeAt(i);if (c >= 65 && c <= 90) {output += String.fromCharCode((c - 65 + key) % 26 + 65)} else if (c >= 97 && c <= 122) {output += String.fromCharCode((c - 97 + key) % 26 + 97)} else {output += input.charAt(i)}} var cipheredText = output;return cipheredText}";

var vigenereCipher = new Object();
vigenereCipher.name = "Vigenere cipher";
vigenereCipher.source = "function crypt(text) {var msg = text;var key = 'VIGENERECIPHER';var i = 0;key = key.toUpperCase();msg = msg.toUpperCase();return msg.replace(/([A-Z])/g,function($1) {return String.fromCharCode((26 + $1.charCodeAt(0) + key[i++ % key.length].charCodeAt(0) - 'A'.charCodeAt(0) * 2) % 26 + 'A'.charCodeAt(0)) });}";

var ownCipher1 = new Object();
ownCipher1.name = "Own cipher 1";
ownCipher1.source = "function crypt(text){return text;}";

var ownCipher2 = new Object();
ownCipher2.name = "Own cipher 2";
ownCipher2.source = "function crypt(text){return text;}";

var ownCipher3 = new Object();
ownCipher3.name = "Own cipher 3";
ownCipher3.source = "function crypt(text){return text;}";

var ciphers = new Array();
ciphers[0] = caesarCipher;
ciphers[1] = ownCipher1;
ciphers[2] = ownCipher2;
ciphers[3] = ownCipher3;
ciphers[4] = vigenereCipher;

function allowDrop(ev){
    ev.preventDefault();
}

function drag(ev){
    ev.dataTransfer.setData("Text", ev.target.id);
}

function drop(ev){

    var target = ev.target;
   
    if(_.isEqual(target.tagName, 'DIV') == false){
        target = target.parentNode;
    }
   
    ev.preventDefault();
    var data = ev.dataTransfer.getData("Text");
   
    var text = document.getElementById(data).innerHTML;
    var style = document.getElementById(data).getAttribute("style");
   
    target.textContent = text;
    target.style = style;
   
}

var selectedSourceName = "";

function dropSource(ev) {

    ev.preventDefault();
    var data = ev.dataTransfer.getData("Text");
   
    var name = document.getElementById(data).innerHTML;
    selectedSourceName = name;
   
    var i = 0;
   
    while (ciphers[i]){
   
        if(_.isEqual(ciphers[i].name.trim(), name.trim()) == true){
            var source = _.clone(ciphers[i].source, true);
           
            var style = document.getElementById(data).getAttribute("style");
   
            ev.target.className = "sourceReviewContains";
            ev.target.textContent = js_beautify(source, {
                'indent_size': 1,
                'indent_char': '\t'
            });
           
            ev.target.value = js_beautify(source, {
                'indent_size': 1,
                'indent_char': '\t'
            });
            ev.target.style = style;
            return;
        }
        i++;
    }    
   
}

function saveSource(){

    var i = 0;
   
    while (ciphers[i]){
   
        if(_.isEqual(ciphers[i].name.trim(), selectedSourceName.trim()) == true){
       
            var newSource = document.getElementById("sourceElement").getAttribute("data-value");
           
            ciphers[i].source = _.clone(newSource.toString(), true);
           
            // TODO tallenna muutettu kantaan asti
           
            return;
        }
        i++;
    }
}

function run() {

    var canRun = false;
    var canRun1 = false;

    // ********** ensimmäinen laatikko alkaa
    var runnalbeSource = "document.getElementById('result').innerHTML = crypt('Text to be crypted');";

    // ladataan valittujen algoritmien nimet
    var alg1 = document.getElementById("div1");
   
    if(alg1.children[0] == null){
   
        var i = 0;
        while (ciphers[i]){
            if(_.isEqual(ciphers[i].name.trim(), alg1.innerHTML.trim()) == true){
                runnalbeSource = runnalbeSource + ciphers[i].source;
                canRun = true;
                canRun1 = true;
            }
            i++;
        }
   
    }
   
    if(canRun == false){
        document.getElementById('result').innerHTML = "Text to be crypted";
    }
   
    // ********** toinen laatikko alkaa
    var canRun2 = false;
   
    var runnalbeSource2 = "document.getElementById('result').innerHTML = crypt(document.getElementById('result').innerHTML);";

    // ladataan valittujen algoritmien nimet
    var alg2 = document.getElementById("div2");
   
    if(alg2.children[0] == null){
   
        var i = 0;
        while (ciphers[i]){
            if(_.isEqual(ciphers[i].name.trim(), alg2.innerHTML.trim()) == true){
                runnalbeSource2 = runnalbeSource2 + ciphers[i].source;
                canRun2 = true;
                canRun = true;
            }
            i++;
        }
   
    }
   
    // ********** kolmas laatikko alkaa
    var canRun3 = false;
   
    var runnalbeSource3 = "document.getElementById('result').innerHTML = crypt(document.getElementById('result').innerHTML);";

    // ladataan valittujen algoritmien nimet
    var alg3 = document.getElementById("div3");
   
    if(alg3.children[0] == null){
   
        var i = 0;
        while (ciphers[i]){
            if(_.isEqual(ciphers[i].name.trim(), alg3.innerHTML.trim()) == true){
                runnalbeSource3 = runnalbeSource3 + ciphers[i].source;
                canRun3 = true;
                canRun = true;
            }
            i++;
        }
   
    }
   
    if(canRun){
        if(canRun1) {
            eval(runnalbeSource);
        }
        if(canRun2){
            eval(runnalbeSource2);
        }
        if(canRun3){
            eval(runnalbeSource3);
        }
    }else{
        alert("You must drag atleast one algorithm to place.");
        document.getElementById('result').innerHTML = "";
    }
   
}

function resetSource() {
    var element = document.getElementById('sourceElement');
    element.value='Drop algorithm here to view/edit source';
    element.className='sourceReview';
    element.style='';
   
}

function removeAllCiphers() {
        document.getElementById('div1').innerHTML = '';
        document.getElementById('div2').innerHTML = '';
        document.getElementById('div3').innerHTML = '';
}

/* jshint ignore:end */