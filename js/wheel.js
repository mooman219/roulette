var rotationsTime = 4;
var wheelSpinTime = 3;
var ballSpinTime = 2;
var numorder = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
var numred = [32, 19, 21, 25, 34, 27, 36, 30, 23, 5, 16, 1, 14, 9, 18, 7, 12, 3];
var numblack = [15, 4, 2, 17, 6, 13, 11, 8, 10, 24, 33, 20, 31, 22, 29, 28, 35, 26];
var numgreen = [0];
var numbg = $(".pieContainer");
var ballbg = $(".ball");
var toppart = $("#toppart");
var pfx = $.keyframe.getVendorPrefix();
var transform = pfx + "transform";
var rinner = $("#rcircle");
var numberLoc = [];
$.keyframe.debug = true;
(function setup() {
    var temparc = 360 / numorder.length;
    for (var i = 0; i < numorder.length; i++) {
      numberLoc[numorder[i]] = [];
      numberLoc[numorder[i]][0] = i * temparc;
    }
})();
function randomRed() {
    spinTo(numred[Math.floor(Math.random() * numred.length)]);
}
function randomBlack() {
    spinTo(numblack[Math.floor(Math.random() * numblack.length)]);
}
function resetAnimation() {
    animationPlayState = "animation-play-state";
    playStateRunning = "running";

    $(ballbg)
        .css(pfx + animationPlayState, playStateRunning)
        .css(pfx + "animation", "none");

    $(numbg)
        .css(pfx + animationPlayState, playStateRunning)
        .css(pfx + "animation", "none");
    $(toppart)
        .css(pfx + animationPlayState, playStateRunning)
        .css(pfx + "animation", "none");

    $("#rotate2").html("");
    $("#rotate").html("");
}

function spinTo(num) {
    //get location
    var temp = numberLoc[num][0] + 4;

    //randomize
    var rndSpace = Math.floor(Math.random() * 360 + 1);

    resetAnimation();
    setTimeout(function () {
        bgrotateTo(rndSpace);
        ballrotateTo(rndSpace + temp);
    }, 500);
}

function ballrotateTo(deg) {
    var temptime = rotationsTime + 's';
    var dest = -360 * ballSpinTime - (360 - deg);
    $.keyframe.define({
        name: "rotate2",
        from: {
            transform: "rotate(0deg)"
        },
        to: {
            transform: "rotate(" + dest + "deg)"
        }
    });

    $(ballbg).playKeyframe({
        name: "rotate2", // name of the keyframe you want to bind to the selected element
        duration: temptime, // [optional, default: 0, in ms] how long you want it to last in milliseconds
        timingFunction: "ease-in-out", // [optional, default: ease] specifies the speed curve of the animation
        complete: function () {
            console.log("Spin done.");
        } //[optional]  Function fired after the animation is complete. If repeat is infinite, the function will be fired every time the animation is restarted.
    });
}

function bgrotateTo(deg) {
    var dest = 360 * wheelSpinTime + deg;
    var temptime = (rotationsTime * 1000 - 1000) / 1000 + 's';

    $.keyframe.define({
        name: "rotate",
        from: {
            transform: "rotate(0deg)"
        },
        to: {
            transform: "rotate(" + dest + "deg)"
        }
    });

    $(numbg).playKeyframe({
        name: "rotate", // name of the keyframe you want to bind to the selected element
        duration: temptime, // [optional, default: 0, in ms] how long you want it to last in milliseconds
        timingFunction: "ease-in-out", // [optional, default: ease] specifies the speed curve of the animation
        complete: function () { } //[optional]  Function fired after the animation is complete. If repeat is infinite, the function will be fired every time the animation is restarted.
    });

    $(toppart).playKeyframe({
        name: "rotate", // name of the keyframe you want to bind to the selected element
        duration: temptime, // [optional, default: 0, in ms] how long you want it to last in milliseconds
        timingFunction: "ease-in-out", // [optional, default: ease] specifies the speed curve of the animation
        complete: function () { } //[optional]  Function fired after the animation is complete. If repeat is infinite, the function will be fired every time the animation is restarted.
    });
}
