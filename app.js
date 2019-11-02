function getRandomRgb() {
    var num = Math.round(0xffffff * Math.random());
    var r = num >> 16;
    var g = num >> 8 & 255;
    var b = num & 255;
    return {r:r,g:g,b:b};
}


function downloadPairsAsJson() {
    var data ={
        x_colors: added_x,
        y_colors: added_y,
    }

    var fileName = "pairs-" + added_x.length;

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", fileName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function toRGBString(obj){
    return 'rgb(' + obj.r + ', ' + obj.g + ', ' + obj.b + ')';
}
var randomColor1;
var randomColor2;

var added_x = []
var added_y = []


var model_gb;

var addedCount = 0;

// var pair_list_elm = '<li><div class="color-box colA"></div><div class="color-box colB"></div><div class="remove-btn" title="Remove Pair"><i class="fas fa-times"></i></div></li>';

function repopulateList(){
    var ol = document.getElementById("ol-pairs");
    ol.innerHTML = "";
    if (added_x.length>0){
        for (var itr_m = 0; itr_m < added_x.length; itr_m++) {
            pushPairToList(itr_m, added_x[itr_m], added_y[itr_m]);
        }
    }else{
        showEmpty();
    }
    
}


function deletePairBtn(btn){
    console.log(btn.id);
    var btn_id = btn.id;
    var pair_id = (btn.id+"").split("-")[1];

    var btn = document.getElementById(btn_id);
    btn.parentNode.remove();
    console.log(pair_id);

    added_x.splice(pair_id, 1);
    added_y.splice(pair_id, 1);
    addedCount = added_x.length;

    repopulateList();
    updateCount();
}

function updateCount(){
    console.log("sdhjbfsdkjh")
    var pair_sin = "pairs"
    if (addedCount == 1) {
        pair_sin = "pair"
    }
    var addedCountlabel = document.getElementById("addedCount");
    addedCountlabel.innerText = addedCount + " " + pair_sin;
}

function pushPairToList(index, col_A, col_B){
      var ol = document.getElementById("ol-pairs");
      var pair_list_elm = '<li><div style="background: ' + toRGBString(col_A) + '" class="color-box colA"></div><div style="background: ' + toRGBString(col_B) + '"  class="color-box colB"></div><div class="remove-btn" id="pair-' + index + '" onclick="deletePairBtn(this);" title="Remove Pair"><i class="fas fa-times"></i></div></li>';
      ol.insertAdjacentHTML('afterbegin', pair_list_elm);
      
}


function addButtonClickEvent(){

    hideEmpty();
    if(addedCount==1){
        enableTraining();
    }

    
    added_x.push(randomColor1);
    added_y.push(randomColor2);


    
    addedCount = added_x.length;

    pushPairToList((addedCount - 1), randomColor1, randomColor2);

    // var pair_sin = "pair"
    // if(addedCount>1){
    //     pair_sin = "pairs"
    // // }
    // if(addedCount==1){
    //     enableTraining()
    // }
    // var addedCountlabel = document.getElementById("addedCount");
    // addedCountlabel.innerText = addedCount+" "+pair_sin;
    updateCount();
    genColors();
}

function nextButtonClickEvent() {
    genColors();
}

function startTraining(){
    console.log("Training!!");
    trainModel((model)=>{
        console.log("Complete?")
        model_gb = model;
        enableExporting();
    },added_x,added_y);
}

function showEmpty(){
    var empty = document.getElementById("empty-list");
    empty.style.display = "block";
}

function hideEmpty() {
    var empty = document.getElementById("empty-list");
    empty.style.display = "none";
}

function disableAdding(){
    var train = document.getElementsByClassName("add")[0];
    train.disabled = true;
}
function disableGen(){
    var train = document.getElementsByClassName("next")[0];
    train.disabled = true;
}

async function startExporting() {
    await model_gb.save('downloads://my-model');
    var train = document.getElementsByClassName("train")[0];
    train.innerText = "Training Complete!"
}

function enableTraining(){
    var train = document.getElementsByClassName("train")[0];
    train.disabled = false;
}

function disableTraining() {
    var train = document.getElementsByClassName("train")[0];
    train.disabled = true;
    // train.innerText = "Training Complete!"
}

function enableExporting() {
    var exportBtn = document.getElementsByClassName("export")[0];
    exportBtn.disabled = false;
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

function genColors(id){
    if(id == "color1"){
        randomColor1 = getRandomRgb();
        var color1 = document.getElementsByClassName("color1");
        var color1Label = document.getElementById("col1label");
        color1Label.innerText = "#" + fullColorHex(randomColor1);
        color1[0].style.backgroundColor = toRGBString(randomColor1);

    }
    else if(id == "color2"){
        randomColor2 = getRandomRgb();
        var color2 = document.getElementsByClassName("color2");
        var color2Label = document.getElementById("col2label");
        color2Label.innerText = "#" + fullColorHex(randomColor2);
        color2[0].style.backgroundColor = toRGBString(randomColor2);
    }
    else
    {
        randomColor1 = getRandomRgb();
        randomColor2 = getRandomRgb();

        var color1 = document.getElementsByClassName("color1");
        var color1Label = document.getElementById("col1label");
        color1Label.innerText = "#" + fullColorHex(randomColor1);

        var color2 = document.getElementsByClassName("color2");
        var color2Label = document.getElementById("col2label");
        color2Label.innerText = "#" + fullColorHex(randomColor2);

        color1[0].style.backgroundColor = toRGBString(randomColor1);
        color2[0].style.backgroundColor = toRGBString(randomColor2);
    }
    
}



document.addEventListener("DOMContentLoaded", function (event) {
    // console.log(getRandomRgb());

    var color1 = document.getElementsByClassName("color1")[0];
    var color2 = document.getElementsByClassName("color2")[0];

    color1.addEventListener('click', function (e) {
        genColors("color1");
    });

    color2.addEventListener('click', function (e) {
        genColors("color2");
    });

    genColors();
    var addBtn = document.getElementsByClassName("add")[0];
    var trainBtn = document.getElementsByClassName("train")[0];
    var exportBtn = document.getElementsByClassName("export")[0];
    var nextBtn = document.getElementsByClassName("next")[0];

    addBtn.addEventListener('click',function(e){
        addButtonClickEvent();
    });
    trainBtn.addEventListener('click', function (e) {
        startTraining();
    });
    exportBtn.addEventListener('click', function (e) {
        startExporting();
    });
    nextBtn.addEventListener('click', function (e) {
        nextButtonClickEvent();
    });
});



async function trainModel(runCallback, colors_x, colors_y) {
    
    function normalizeColor(col_val){
        return col_val/255;
    }

    var newArrX = []
    for(var itr_e = 0;itr_e<colors_x.length;itr_e++){
        // console.log(colors_x[itr_e]);
        var tempr = new Array();
        tempr[0] = normalizeColor(colors_x[itr_e].r);
        console.log(tempr)
        var tempg = new Array();
        tempg[0] = normalizeColor(colors_x[itr_e].g);

        var tempb = new Array();
        tempb[0] = normalizeColor(colors_x[itr_e].b);

        newArrX[itr_e] = [tempr, tempg, tempb]
        // console.log(x_array[itr_e]);
    }

    var newArrY = []

    for (var itr_e = 0; itr_e < colors_y.length; itr_e++) {
        // console.log(colors_x[itr_e]);
        var tempr = new Array();
        tempr[0] = normalizeColor(colors_y[itr_e].r);
        console.log(tempr)
        var tempg = new Array();
        tempg[0] = normalizeColor(colors_y[itr_e].g);

        var tempb = new Array();
        tempb[0] = normalizeColor(colors_y[itr_e].b);

        newArrY[itr_e] = [tempr, tempg, tempb]
        // console.log(x_array[itr_e]);
    }

    console.log(newArrX);
    console.log(newArrY);
    
    var xs = tf.tensor3d(newArrX);
    var ys = tf.tensor3d(newArrY);
    const model = tf.sequential();

    const hidden = tf.layers.lstm({
        units: 3,
        activation: 'sigmoid',
        inputShape: [3, 1],
        returnSequences: true
    });
    model.add(hidden);
    const output = tf.layers.lstm({
        units: 1,
        activation: 'sigmoid',
        returnSequences: true
    });
    model.add(output);
    const sgdoptimizer = tf.train.sgd(0.1)
    model.compile({
        optimizer: sgdoptimizer,
        loss: tf.losses.meanSquaredError
    });
    function onEpochEnd(){
        NProgress.inc();
    }

    function onTrainBegin(){
        NProgress.start();
        disableTraining();
        disableGen();
        disableAdding();
    }

    function onTrainEnd(){
        NProgress.done();
    }

    await model.fit(xs, ys, {
            epochs: 200,
            callbacks: {
                onEpochEnd,
                onTrainBegin,
                onTrainEnd
            }
        }).then(() => {
            runCallback(model);
    });

}
