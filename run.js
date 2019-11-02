var col1Input;
var model;
var modelLoaded = false;

function toRGBString(obj) {
    return 'rgb(' + obj[0] + ', ' + obj[1] + ', ' + obj[2] + ')';
}
function toRGBObject(obj) {
    return {
        r: obj[0],
        g: obj[1],
        b: obj[2]
    };
}

function getRandomRgb() {
    var num = Math.round(0xffffff * Math.random());
    var r = num >> 16;
    var g = num >> 8 & 255;
    var b = num & 255;
    return {
        r: r,
        g: g,
        b: b
    };
}

function normalizeColor(col_val) {
    return col_val / 255;
}

function denormalizeColor(col_val) {
    return Math.floor(col_val * 255);
}

var rgbToHex = function (rgb) {
    var hex = Number(rgb).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
};
var fullColorHex = function (obj) {
    var red = rgbToHex(obj.r);
    var green = rgbToHex(obj.g);
    var blue = rgbToHex(obj.b);
    return red + green + blue;
};


function setInitialColor(){
    var randomColor = getRandomRgb();
    var randomHex = fullColorHex(randomColor);


    var color1Label = document.getElementById("col1label");
    color1Label.innerText = "#"+randomHex;

    var color1 = document.getElementsByClassName("color1")[0];

    color1.style.backgroundColor = "#"+randomHex;

   
    predictColor2(randomColor);
}


function predictColor2(color1Input){
        console.log(color1Input);
        
     if (modelLoaded) {

        var color2 = document.getElementsByClassName("color2")[0];
        var color2Label = document.getElementById("col2label");

         const inputs = tf.tensor3d([
             [
                 [normalizeColor(color1Input.r)],
                 [normalizeColor(color1Input.g)],
                 [normalizeColor(color1Input.b)]
             ]
         ]);
         let outputs = model.predict(inputs);
         var op = outputs.data();
         op.then((odd) => {
             // console.log(odd);
             var tempr = [];
             for (var i = 0; i < odd.length; i++) {
                 tempr[i] = denormalizeColor(odd[i]);
             }
             // console.log(tempr);
             color2.style.backgroundColor = toRGBString(tempr);
             color2Label.innerText = "#" + fullColorHex(toRGBObject(tempr));
         })
         // console.log(op);
     }
}

async function loadTensorFlowModel(){
    model = await tf.loadModel('my-model.json');
    modelLoaded = true;
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

document.addEventListener("DOMContentLoaded", function (event) {
    col1Input = document.getElementById("col1");
    var addbtn = document.getElementsByClassName("add")[0];
    var randombtn = document.getElementsByClassName("random")[0];
    var color1 = document.getElementsByClassName("color1")[0];
    var color1Label = document.getElementById("col1label");
    var color2Label = document.getElementById("col2label");

    color2Label.innerText = "#000000";
    loadTensorFlowModel();

    setInitialColor();
    color1Label.addEventListener('click', () => {
        col1Input.click();
    })


    col1Input.addEventListener('change', () => {
        console.log(col1Input.value);
        color1.style.backgroundColor = col1Input.value;
        color1Label.innerText = col1Input.value;
        predictColor2(hexToRgb(col1Input.value));
    })
    addbtn.addEventListener('click', () => {
        col1Input.click();
    })
    randombtn.addEventListener('click',()=>{
        setInitialColor();
    })
})