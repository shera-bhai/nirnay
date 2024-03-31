// Import the web3.js library
import Web3 from 'web3';

const Web3 = require('web3');
const web3 = new Web3('http://127.0.0.1:8080'); // Replace with your node URL
const votingArtifacts = require('../../build/contracts/Voting.json');
const votingContract = new web3.eth.Contract(votingContractArtifact.abi, "0xFb36d34b16891E4be33E0176d39cc17e9cB56fb7");

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("voteButton").addEventListener("click", function() {
  console.log("Vote Button Pressed!");
  var selectedCandidateID = document.querySelector("input[name='candidate']:checked");
  if (!selectedCandidateID) {
    alert("Please Select a Party!");
    return;
  }
  selectedCandidateID = selectedCandidateID.value;

  // Call the voteAndTransferEther function with the selected candidate ID
//   voteAndTransferEther(selectedCandidateID);

  var storedScores = localStorage.getItem("candidateScores");
  var candidateScores = storedScores ? JSON.parse(storedScores) : {};
  candidateScores[selectedCandidateID] = (candidateScores[selectedCandidateID] || 0) + 1;
  localStorage.setItem("candidateScores", JSON.stringify(candidateScores));
  voteAndTransferEther();
  alert("Vote Casted Successfully!")
  updateScores(candidateScores);
  increaseCount();
});

async function voteAndTransferEther(candidateId) {
try {
// Request accounts from MetaMask
const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
const fromAccount = accounts[0];

// Perform the voting transaction
const voteTransaction = await votingContract.methods.vote(candidateId).send({ from: fromAccount });

// Get gas used for the vote transaction
const gasUsed = voteTransaction.gasUsed;

// Transfer Ether to another account with the same amount of gas used
const toAccount = "0x2E948F7BcB9078f94aD6cbf1DAfA86f225EE8F41"; // Replace with the recipient's Ethereum address
const gasPrice = await web3.eth.getGasPrice();
const gasCost = gasPrice * gasUsed;
const amountToSend = gasCost.toString();

await web3.eth.sendTransaction({
from: fromAccount,
to: toAccount,
value: amountToSend
});

console.log("Ether Transferred successfully.");
alert("Ether Transferred successfully.");

} catch (error) {
console.error("Error:", error);
alert("Error: " + error.message);
}
}

function home() {
window.location.href = "/";
}
function updateScores(candidateScores) {
  for (var i = 0; i < 3; i++) {
      var candidateID = "candidate" + (i + 1);
      var score = candidateScores[candidateID] || 0;
      document.getElementById("scoreCell" + (i + 1)).textContent = score;
  }
}

function increaseCount() {
  var countElement = document.getElementById("voteCount");
  var count = parseInt(countElement.textContent);
  count++;
  countElement.textContent = count;
}

var storedScores = localStorage.getItem("candidateScores");
if (storedScores) {
  var candidateScores = JSON.parse(storedScores);
  updateScores(candidateScores);
}
});