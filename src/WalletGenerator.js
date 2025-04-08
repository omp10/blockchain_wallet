import { useState } from "react";
import { ethers } from "ethers";

// Ganache settings
const GANACHE_RPC_URL = "http://127.0.0.1:7545";
const PRIVATE_KEY = "0xf7685985fb81c6ace2ced5322e34faa904df6e0192483c11599b6420592e70e9";

export default function WalletGenerator() {
  const [balance, setBalance] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");

  // Setup provider and wallet
  const provider = new ethers.providers.JsonRpcProvider(GANACHE_RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const getBalance = async () => {
    try {
      const bal = await wallet.getBalance();
      setBalance(ethers.utils.formatEther(bal));
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  };

  const sendEth = async () => {
    if (!recipient || !amount) {
      alert("Please enter recipient and amount.");
      return;
    }
    try {
      const tx = await wallet.sendTransaction({
        to: recipient,
        value: ethers.utils.parseEther(amount),
      });
      await tx.wait();
      setTxHash(tx.hash);
      getBalance(); // refresh balance
    } catch (err) {
      console.error("Transaction failed:", err);
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
