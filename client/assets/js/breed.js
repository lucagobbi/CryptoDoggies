$(document).ready(function (){
    window.ethereum.enable().then(function(accounts){
        instance = new web3.eth.Contract(abi, contractAddress, {from:accounts[0]})
        renderDogs()
    })

    instance.events.Birth().on('data', function(event){
        let owner = event.returnValues.owner;
        let mumId = event.returnValues.mumId;
        let dadId = event.returnValues.dadId;
        let genes = event.returnValues.genes;
        $("#doggyCreation").css("display", "block");
        $("#doggyCreation").text("owner: " + owner 
                                 +"\n mumId: " + mumId
                                 +"\n dadId: " + dadId
                                 +"\n genes: " + genes)
    }).on('error', console.error)
})

async function renderDogs() {

    var Owner;
    let currentUser = ethereum.selectedAddress;
    var ownedDogs = [];
    var dogsCount = await instance.methods.countDoggies().call();

    for (let i = 0; i < dogsCount; i++) {
        Owner = await instance.methods._own(currentUser, i).call();
        if(Owner) {
            ownedDogs.push(i);
        }
    }

    for (let i = 0; i < ownedDogs.length; i++) {
        dogId = ownedDogs[i];
        let dog = await instance.methods.getDoggy(dogId).call();
        let dogGenes = dog[0];
        if (dogGenes[8] == 0) {
            prepareDoggies(dogId, dogGenes, 'dogBoxes2')
        } else {
            prepareDoggies(dogId, dogGenes, 'dogBoxes1')
        }
    }
}

function prepareDoggies(id, genes, box) {

    let bodyDna = genes.substring(0, 2);
    let eyesDna = genes.substring(2, 4);
    let earsDna = genes.substring(4, 6);
    let spotDna = genes.substring(6, 8);
    let genderDna = genes.substring(8, 9);

    var dogBox = `<div class="col-md-4 my-4">
                    <div class="dogGender">`+ genderIcon(genderDna) +`</div>
                    <div class="dog dog-modal ml-4" id="`+id+`" onclick=appendDoggy(this.id) style="background: #` + colors[bodyDna] + `">
                        <div class="eye-spot-left" style="background: #` + colors[spotDna] + `"></div>
                        <div class="eye-left" style="background: #` + colors[eyesDna] + `">
                            <div class="pupil"></div>
                        </div>
                        <div class="eye-spot-right" style="background: #` + colors[spotDna] + `"></div>
                        <div class="eye-right" style="background: #` + colors[eyesDna] + `">
                            <div class="pupil"></div>
                        </div>
                        <div class="lower-lip" style="background: #` + colors[bodyDna] + `">
                            <div class="lower-lip-pink"></div>
                        </div>
                        <div class="snout-left" style="background: #` + colors[bodyDna] + `"></div>
                        <div class="snout-right" style="background: #` + colors[bodyDna] + `"></div>
                        <div class="nose">
                            <div class="nostril"></div>
                            <div class="nostril"></div>
                        </div>
                        <div class="body" style="background: #` + colors[bodyDna] + `">
                            <div class="foot foot-left" style="background: #` + colors[bodyDna] + `"></div>
                            <div class="foot foot-right" style="background: #` + colors[bodyDna] + `"></div>
                        </div>
                        <div class="tail" style="background: #` + colors[bodyDna] + `"></div>
                        <div class="ear-left" style="background: #` + colors[earsDna] + `"></div>
                        <div class="ear-right" style="background: #` + colors[earsDna] + `"></div>
                    </div>
                    </div>
                `;

    document.getElementById(box).innerHTML += dogBox;
}

let icon;

function genderIcon(gender) {
    if (gender == 0) {
        return icon = '<i class="fas fa-mars"></i>'
    } else {
        return icon = '<i class="fas fa-venus"></i>'
    }
}

async function appendDoggy(id) {

    let genderModal;
    let sex;
    let dog = await instance.methods.getDoggy(id).call();
    let genes = dog[0];

    let bodyDna = genes.substring(0, 2);
    let eyesDna = genes.substring(2, 4);
    let earsDna = genes.substring(4, 6);
    let spotDna = genes.substring(6, 8);
    let genderDna = genes.substring(8, 9);

    if (genderDna == 0) {
        $('#sir i').remove()
        $('#sir .dog').remove()
        genderModal = '#sir'
        sex = "m";
    } else {
        $('#dame i').remove()
        $('#dame .dog').remove()
        genderModal = '#dame';
        sex = "f";
    }

    var dogBox = `<div class="dog dog-breed ml-4" data-gender="`+sex+`" id="`+id+`" style="background: #` + colors[bodyDna] + `">
                    <div class="eye-spot-left" style="background: #` + colors[spotDna] + `"></div>
                        <div class="eye-left" style="background: #` + colors[eyesDna] + `">
                            <div class="pupil"></div>
                        </div>
                        <div class="eye-spot-right" style="background: #` + colors[spotDna] + `"></div>
                        <div class="eye-right" style="background: #` + colors[eyesDna] + `">
                            <div class="pupil"></div>
                        </div>
                        <div class="lower-lip" style="background: #` + colors[bodyDna] + `">
                            <div class="lower-lip-pink"></div>
                        </div>
                        <div class="snout-left" style="background: #` + colors[bodyDna] + `"></div>
                        <div class="snout-right" style="background: #` + colors[bodyDna] + `"></div>
                        <div class="nose">
                            <div class="nostril"></div>
                            <div class="nostril"></div>
                        </div>
                        <div class="body" style="background: #` + colors[bodyDna] + `">
                            <div class="foot foot-left" style="background: #` + colors[bodyDna] + `"></div>
                            <div class="foot foot-right" style="background: #` + colors[bodyDna] + `"></div>
                        </div>
                        <div class="tail tail-breed" style="background: #` + colors[bodyDna] + `"></div>
                        <div class="ear-left" style="background: #` + colors[earsDna] + `"></div>
                        <div class="ear-right" style="background: #` + colors[earsDna] + `"></div>
                </div>`;
    $(genderModal).append(dogBox)

    let doggies = $('.dog-breed')
    if(doggies.length == 2) {
        let breedBtn = `<button class="btn btn-success light-b-shadow my-4" id="breedBtn"><span>Breed</span></button>`
        $('.container').append(breedBtn)
        $('#breedBtn').click(breedDoggies)
    }
}

async function breedDoggies() {

    mumId = $('div[data-gender="f"').attr('id')
    dadId = $('div[data-gender="m"').attr('id')
    console.log(mumId + " " + dadId)

    let currentUser = ethereum.selectedAddress;

    await instance.methods.breed(dadId, mumId).send(
        {from: currentUser},
        function(error, txHash) {
            if(error) {
                console.log(error);
            } else {
                console.log(txHash);
            }
        }
    );
}
