import "./App.css";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getAssemble, getQuote, sendTransaction } from "./odosCall";
import { getEarnings } from "./angleCalls";

let provider = null;
let signer = null;

function App() {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [amountIn, setAmountIn] = useState("");
  const [quote, setQuote] = useState(null);
  const [agAddress, setAgAddress] = useState("");
  const [agEarnings, setAgEarnings] = useState(0);

  /**
   * called once at page load
   */
  useEffect(() => {
    connectwalletHandler();
  }, []);

  /**
   * check if wallet is installed, unlocked and authorized or ask for permission
   * then set connected and address states
   */
  async function connectwalletHandler() {
    if (window.ethereum) {
      provider = new ethers.BrowserProvider(window.ethereum);
      //const hasWalletPermissions = await provider.send("wallet_getPermissions");
      //console.log(hasWalletPermissions);
      //if (hasWalletPermissions.length > 0 && hasWalletPermissions[0].parentCapability === "eth_accounts") {
      //connectwalletHandler();
      let _walletAddress;
      try {
        signer = await provider.getSigner();
        _walletAddress = await signer.getAddress();
        setConnected(true);
        setWalletAddress(_walletAddress);
      } catch (e) {
        alert("unlock metamask");
        //console.log(e);
      }
      //}
    } else {
      alert("install metamask");
    }
  }

  async function handleAmountInOnBlur(e) {
    //console.log("blur");
    setQuote(null);
    const _quote = await getQuote(walletAddress, amountIn);
    console.log(_quote);
    if (_quote !== false) {
      setQuote(_quote);
    }
  }

  function handleAmountInFocus() {
    setQuote(null);
  }

  async function convertHandler() {
    const assemble = await getAssemble(walletAddress, quote);
    console.log(assemble);
    if (assemble !== null) {
      const resp = sendTransaction(assemble.transaction, await provider.getSigner());
      console.log(resp);
    }
  }

  async function btnAgCheckHandle() {
    const earnings = await getEarnings(agAddress);
    console.log(earnings);
    setAgEarnings(earnings);
  }

  return (
    <div className="container App">
      <div className="mb-3">
        <button className="btn btn-primary" onClick={connectwalletHandler}>
          {connected ? "Connected" : "Connect Wallet"}
        </button>{" "}
        <span className="wal-add">{walletAddress}</span>
      </div>

      <div className="input-group mb-3">
        <input type="text" className="form-control" placeholder="Amount" value={amountIn} onFocus={handleAmountInFocus} onChange={(e) => setAmountIn(e.target.value)} onBlur={handleAmountInOnBlur} />
        <span className="input-group-text">USDC</span>
      </div>
      <div className="mb-3">USDA : {quote ? ethers.formatEther(quote.outAmounts[0]) : ""}</div>
      <div className="mb-3">
        <ul>
          <li>chain must be Arbitrum</li>
          <li>
            before swap, approve manualy <a href="https://arbiscan.io/token/0xaf88d065e77c8cc2239327c5edb3a432268e5831#writeProxyContract#F1">here</a> for address
            0xa669e7A0d4b3e4Fa48af2dE86BD4CD7126Be4e13 to spend your USDC (and add six 0)
          </li>
        </ul>
      </div>
      <div className="mb-3">
        <button className="btn btn-primary" onClick={convertHandler} disabled={quote !== null ? false : true}>
          Swap
        </button>
      </div>
      <div className="input-group mb-3">Check stUSD earnings on Arbitrum :</div>
      <div className="input-group mb-3">
        <input type="text" className="form-control" value={agAddress} onChange={(e) => setAgAddress(e.target.value)} placeholder="Angle Arbitrum Address" />
        <button className="btn btn-primary" type="button" id="btnAgCheck" onClick={btnAgCheckHandle}>
          Check
        </button>
      </div>
      <div>lifetime earnings : ${agEarnings}</div>
    </div>
  );
}

export default App;
