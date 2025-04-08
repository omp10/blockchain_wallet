import { useState } from "react";
import { ethers } from "ethers";

const GANACHE_RPC_URL = "http://127.0.0.1:7545";
const PRIVATE_KEY = "0xf7685985fb81c6ace2ced5322e34faa904df6e0192483c11599b6420592e70e9";

export default function WalletGenerator() {
  const [balance, setBalance] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");

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
      getBalance();
    } catch (err) {
      console.error("Transaction failed:", err);
      alert("Transaction Failed: " + err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🦊 Ganache Wallet</h2>
        <p><strong>Wallet Address:</strong></p>
        <p style={styles.address}>{wallet.address}</p>

        <button style={styles.button} onClick={getBalance}>Check Balance</button>
        {balance && <p style={styles.balance}><strong>Balance:</strong> {balance} ETH</p>}

        <hr style={styles.separator} />

        <h3 style={styles.subTitle}>Send ETH</h3>
        <input
          style={styles.input}
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input
          style={styles.input}
          type="number"
          placeholder="Amount in ETH"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button style={styles.button} onClick={sendEth}>Send ETH</button>

        {txHash && (
          <p style={styles.txHash}>
            ✅ <strong>Tx Hash:</strong> <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">{txHash}</a>
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 12,
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    maxWidth: 400,
    width: "100%",
    textAlign: "center",
  },
  title: {
    color: "#2e86de",
    marginBottom: 10,
  },
  subTitle: {
    color: "#222",
    marginTop: 20,
    marginBottom: 10,
  },
  address: {
    fontSize: "0.9rem",
    color: "#333",
    wordBreak: "break-all",
    marginBottom: 10,
  },
  balance: {
    color: "#27ae60",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: 10,
    margin: "10px 0",
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    backgroundColor: "#2e86de",
    color: "#fff",
    padding: "10px 16px",
    border: "none",
    borderRadius: 8,
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: 10,
    transition: "0.3s ease",
  },
  txHash: {
    fontSize: "0.85rem",
    marginTop: 12,
    wordBreak: "break-all",
  },
  separator: {
    margin: "20px 0",
    borderColor: "#eee",
  },
};
