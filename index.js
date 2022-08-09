import { Contract, ethers } from './EthersMain.js';
import{abi , address} from "./constant.js"
const ConnectionButton = document.getElementById("connectButton")
const FundThisContract = document.getElementById("fundButton")
const getBalance = document.getElementById("getBalance");
const Withdraw = document.getElementById("Withdraw");

ConnectionButton.onclick = connect;
FundThisContract.onclick= Fund;
getBalance.onclick = balance;
Withdraw.onclick = withdraw;
console.log(ethers)



//So to send a transaction form webBrowser we need to have a contract address and abi and the wallet address who is sending the transaction
async function connect(){
    if(typeof window.ethereum !== "undefined"){
        await window.ethereum.request({method : "eth_requestAccounts"});
        ConnectionButton.innerHTML = "Connected";
    }else{
        console.log("There is no metamask");
        ConnectionButton.innerHTML = "Please Install metamask!"
    }
}

async function Fund(){
    const ethAmount = document.getElementById("amount").value
    if(typeof window.ethereum !== 'undefined'){
        // console.log("Working")
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner() //This will return us the contract which is there in our wallet
        //Getting the contract address and abi
        const contract = new ethers.Contract(address , abi , signer)              
        try {
            const transactionResponse = await contract.fund({value : ethers.utils.parseEther(ethAmount)})
            // console.log(signer)    
            await ListenForEvents(transactionResponse , provider)
            console.log("Done");
        } catch (e) {
            console.log(e);        
           }
        
    }
}
async function balance(){
    if(typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // console.log("Working")
        const balance = await provider.getBalance(address);
        document.getElementById("splitBalance").innerHTML = `${ethers.utils.formatEther(balance)} ether`;
        // console.log("Working(2)")
    }else{
    console.log("Need to install metamask");        
    }
}

async function withdraw(){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const sign = provider.getSigner()
    
    const contract = new ethers.Contract(address , abi, sign);

    try{
        const transactionReps = await contract.draw();
        await ListenForEvents(transactionReps , provider)
        document.getElementById("SplitWithdraw").innerHTML = `SuccessFully Withdrawn !! : ${ await provider.getBalance(address)} `     
    }catch (e){
        console.log(e);
    }
}
function ListenForEvents(transactionResponse , provider){
    console.log(`Transaction Hash ${transactionResponse.hash} ...`)
    // return new Promise
    return new Promise ((resolve , rej) =>{
        provider.once(transactionResponse.hash , (transactionRecipets)=>{
            console.log(`Transaction recipets : ${transactionRecipets.confirmations}`);
            resolve()
        })
        // resolve()
    })
    
}