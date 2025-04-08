import { useState } from "react";
import {
  JsonRpcProvider,
  Wallet,
  parseEther,
  formatEther
} from "ethers";

// Update this to match Ganache's RPC URL (UI: 7545, CLI: 8545)
const GANACHE_RPC_URL = "http://127.0.0.1:7545";

// Replace with a private key from Ganache (⚠️ keep private in real apps)
const PRIVATE_KEY = "0xf7685985fb81c6ace2ced5322e34faa904df6e0192483c11599b6420592e70e9";

export default function GanacheWallet() {
  const [balance, setBalance] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");

  // Setup provider and wallet
  const provider = new JsonRpcProvider(GANACHE_RPC_URL);
  const wallet = new Wallet(PRIVATE_KEY, provider);

  const getBalance = async () => {
    const bal = await wallet.getBalance();
    setBalance(formatEther(bal));
  };

  const sendEth = async () => {
    if (!recipient || !amount) return alert("Enter valid address and amount");
    try {
      const tx = await wallet.sendTransaction({
        to: recipient,
        value: parseEther(amount),
      });
      await tx.wait();
      setTxHash(tx.hash);
      getBalance(); // refresh balance
    } catch (err) {
      alert("Transaction Failed: " + err.message);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>🦊 Ganache Wallet</h2>
      <p><strong>Address:</strong> {wallet.address}</p>

      <button onClick={getBalance}>Check Balance</button>
      {balance && <p><strong>Balance:</strong> {balance} ETH</p>}

      <h3>Send ETH</h3>
      <input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <br />
      <input
        type="number"
        placeholder="Amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <br />
      <button onClick={sendEth}>Send ETH</button>
      {txHash && <p><strong>Transaction Hash:</strong> {txHash}</p>}
    </div>
  );
}
