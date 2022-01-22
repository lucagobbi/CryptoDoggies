let sirIcon = '<i class="fas fa-mars"></i>'
let dameIcon = '<i class="fas fa-venus"></i>'

//Random color
function getColor() {
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return randomColor
}

function genColors(){
    var colors = []
    for(var i = 10; i < 99; i ++){
      var color = getColor()
      colors[i] = color
    }
    return colors
}

//This function code needs to modified so that it works with Your cat code.
function headColor(color,code) {
    $('.dog, .body, .tail, .snout-left, .snout-right, .lower-lip, .foot').css('background', '#' + color)  //This changes the color of the cat
    $('#headcode').html('code: '+code) //This updates text of the badge next to the slider
    $('#dnahead').html(code) //This updates the body color part of the DNA that is displayed below the cat
}
function eyesColor(color,code) {
    $('.eye-left, .eye-right').css('background', '#' + color)
    $('#eyescode').html('code: '+code)
    $('#dnaeyes').html(code)
}
function earsColor(color,code) {
    $('.ear-left, .ear-right').css('background', '#' + color)
    $('#earscode').html('code: '+code) 
    $('#dnaears').html(code)
}
function spotColor(color,code) {
    $('.eye-spot-left, .eye-spot-right').css('background', '#' + color)
    $('#spotcode').html('code: '+code)
    $('#dnaspot').html(code) 
}
function genderSymbol(code) {
    if (code == 0) {
        $('#dogGender').append(sirIcon)
        $('#gendercode').html('code: ' + sirIcon)
    } else {
        $('#dogGender').append(dameIcon)
        $('#gendercode').html('code: ' + dameIcon)
    }
    $('#dnagender').html(code)
}