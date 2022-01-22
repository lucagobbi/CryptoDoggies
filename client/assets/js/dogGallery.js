let ownedDogs = [];

$(document).ready(function (){
    window.ethereum.enable().then(function(accounts){
        instance = new web3.eth.Contract(abi, contractAddress, {from:accounts[0]})
        renderDogs();
    })
})

async function renderDogs() {

    var Owner;
    let currentUser = ethereum.selectedAddress;
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
        let mumId = dog[2];
        let dadId = dog[3];
        let generation = dog[4];
        createDogBox(dogId, mumId, dadId, generation, dogGenes);
    }
}

function createDogBox(id, mumId, dadId, generation, genes) {

    let bodyDna = genes.substring(0, 2);
    let eyesDna = genes.substring(2, 4);
    let earsDna = genes.substring(4, 6);
    let spotDna = genes.substring(6, 8);
    let genderDna = genes.substring(8, 9);

    var dogBox = `<div class="col-md-4">
                    <div class="dogBed light-b-shadow">
                        <div class="dogGender" style="padding: 2% 3%; font-size: 1.2rem; color: #5f807f">`+ genderIcon(genderDna) + `</div>
                        <div class="dog dog-gallery ml-4" id="` + id + `" style="background: #` + colors[bodyDna] + `">
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
                    <div class="traits" style="display: none;">
                        <div>ID: ` + id + `</div>
                        <div>DNA: ` + genes + `</div>
                        <div>Mum ID: ` + mumId + `</div>
                        <div>Dad ID:` + dadId + `</div>
                        <div>Generation: ` + generation + `</div>
                    </div>
                  </div>
                </div>
                `;

    document.getElementById("dogBoxes").innerHTML += dogBox;
}



let icon;

function genderIcon(gender) {
    if (gender == 0) {
        return icon = '<i class="fas fa-mars"></i>'
    } else {
        return icon = '<i class="fas fa-venus"></i>'
    }
}


$('.row').on('mouseover', '.dogBed', function () {
    let id = $(this).find('.dog').attr('id')
    $('#'+id).parent().find('.traits').css('display', 'block')
    $('#'+id).css('opacity', '0.14')
})

$('.row').on('mouseout', '.dogBed', function () {
    let id = $(this).find('.dog').attr('id')
    $('#'+id).parent().find('.traits').css('display', 'none')
    $('#'+id).css('opacity', '1')
})