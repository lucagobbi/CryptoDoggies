
var colors = Object.values(allColors())

var defaultDNA = {
    "headColor" : 10,
    "eyesColor" : 13,
    "earsColor" : 96,
    "spotColor" : 10,
    "gender" :  0
}

// when page load
$( document ).ready(function() {
  $('#dnahead').html(defaultDNA.headColor);
  $('#dnaeyes').html(defaultDNA.eyesColor);
  $('#dnaears').html(defaultDNA.earsColor);
  $('#dnaspot').html(defaultDNA.spotColor);
  $('#dnagender').html(defaultDNA.gender);

  renderDog(defaultDNA)
});

function getDna(){
    var dna = ''
    dna += $('#dnahead').html()
    dna += $('#dnaeyes').html()
    dna += $('#dnaears').html()
    dna += $('#dnaspot').html()
    dna += $('#dnagender').html()
    return parseInt(dna)
}

function renderDog(dna){
    headColor(colors[dna.headColor],dna.headColor)
    $('#headcolor').val(dna.headColor)
    eyesColor(colors[dna.eyesColor],dna.eyesColor)
    $('#eyescolor').val(dna.eyesColor)
    earsColor(colors[dna.earsColor],dna.earsColor)
    $('#earscolor').val(dna.earsColor)
    spotColor(colors[dna.spotColor],dna.spotColor)
    $('#spotcolor').val(dna.spotColor)
    genderSymbol(dna.gender)
    $('#gender').val(dna.gender)
}

// Changing dog colors

$('#headcolor').change(()=>{
  var colorVal = $('#headcolor').val()
  headColor(colors[colorVal],colorVal)
})
$('#eyescolor').change(()=>{
  var colorVal = $('#eyescolor').val()
  eyesColor(colors[colorVal],colorVal)
})
$('#earscolor').change(()=>{
  var colorVal = $('#earscolor').val()
  earsColor(colors[colorVal],colorVal)
})
$('#spotcolor').change(()=>{
  var colorVal = $('#spotcolor').val()
  spotColor(colors[colorVal],colorVal)
})
$('#gender').change(() => {
  var genderVal = $('#gender').val()
  genderSymbol(genderVal)
})


// Default doggy button

$('#getDefaultDoggy').click(() => {
  $('#dnahead').html(defaultDNA.headColor)
  $('#dnaeyes').html(defaultDNA.eyesColor)
  $('#dnaears').html(defaultDNA.earsColor)
  $('#dnaspot').html(defaultDNA.spotColor)
  $('#dnagender').html(defaultDNA.gender)
  renderDog(defaultDNA)
})

// Random doggy button

$('#getRandomDoggy').click(() => {
  
  var head = Math.floor(Math.random() * 89) + 10
  $('#headcolor').val(head)
  headColor(colors[head], head)
  var eyes = Math.floor(Math.random() * 89) + 10
  $('#eyescolor').val(eyes)
  eyesColor(colors[eyes], eyes)
  var ears = Math.floor(Math.random() * 89) + 10
  $('#earscolor').val(ears)
  earsColor(colors[ears], ears)
  var spot = Math.floor(Math.random() * 89) + 10
  $('#spotcolor').val(spot)
  spotColor(colors[spot], spot)
  var gender = Math.round(Math.random())
  $('#gender').val(gender)
  genderSymbol(gender)
})