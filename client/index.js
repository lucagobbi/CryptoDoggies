var web3 = new Web3(Web3.givenProvider);

var instance;
var user;
var contractAddress = '0x1B44882286f6ADd96F131a0CDe7f6B7c70e59eC5';


$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
        let currentUser = ethereum.selectedAddress;
        let address1 = currentUser.substring(0, 4)
        let address2 = currentUser.substring(28, 32)
        $('#wallet').text(address1 + " . . . " + address2)
        $('#wallet').attr('title', currentUser)
        instance = new web3.eth.Contract(abi, contractAddress, {from: accounts[0]})
        console.log(instance)
        user = accounts[0];

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
})

$('#createDoggy').click(createDoggy)

async function createDoggy() {

    var dnaStr = getDna();
    console.log(dnaStr)
    await instance.methods.createDoggyGen0(dnaStr).send(
        {}, 
        function(error, txHash) {
        if(error) {
            console.log(error);
        } else {
            console.log(txHash);
        }
    })
}