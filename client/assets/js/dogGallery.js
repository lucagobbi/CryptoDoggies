$(document).ready(function (){
    window.ethereum.enable().then(function(accounts){
        instance = new web3.eth.Contract(abi, contractAddress, {from:accounts[0]})
        renderDogs();
    })
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

    var dogBox = `<div class="col-md-4 my-4">
                    <div class="dogGender">`+ genderIcon(genderDna) + `</div>
                    <div class="dog dog-gallery ml-4" id="dog` + id + `" style="background: #` + colors[bodyDna] + `">
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
                    <div class="traits">
                    <div>DNA: ` + genes + `</div>
                    <div>Mum ID: ` + mumId + `</div>
                    <div>Dad ID:` + dadId + `</div>
                    <div>Generation: ` + generation + `</div>
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
