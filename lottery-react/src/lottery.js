import web3 from "./web3";
import ABI from "./ABI.json"

const abi = JSON.parse(ABI.interface);
const address = ABI.address;

export default new web3.eth.Contract(abi,address);