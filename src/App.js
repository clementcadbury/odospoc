import "./App.css";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

let provider = null;
let signer = null;

function App() {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [amountIn, setAmountIn] = useState("");

  useEffect(() => {
    if (window.ethereum) {
      // check initial wallet authorizations
      provider = new ethers.BrowserProvider(window.ethereum);
      (async () => {
        const hasWalletPermissions = await provider.send("wallet_getPermissions");
        console.log(hasWalletPermissions);
        if (hasWalletPermissions.length > 0 && hasWalletPermissions[0].parentCapability === "eth_accounts") {
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
        }
      })();
    }
  }, []);

  async function connectwalletHandler() {
    if (window.ethereum) {
      provider = new ethers.BrowserProvider(window.ethereum);
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
    }
  }

  return (
    <div className="container App">
      <div className="mb-1">
        <button className="btn btn-primary" onClick={connectwalletHandler}>
          {connected ? "Connected" : "Connect Wallet"}
        </button>{" "}
        <span className="wal-add">{walletAddress}</span>
      </div>
      <div>
        <div className="input-group mb-3">
          <input type="text" className="form-control" placeholder="Amount" value={amountIn} onChange={(e) => setAmountIn(e.target.value)} />
          <span className="input-group-text">USDC</span>
        </div>
      </div>
    </div>
  );
}

export default App;
