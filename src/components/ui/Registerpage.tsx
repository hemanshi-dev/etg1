import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Home,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wallet,
  Zap,
} from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import heroGlobe from "@/assets/hero-globe.jpg";
import { EgtAuthLayout } from "./EgtAuthLayout";

type StatusType = "idle" | "success" | "error" | "warning";

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: "accountsChanged", callback: (accounts: unknown) => void) => void;
  removeListener?: (event: "accountsChanged", callback: (accounts: unknown) => void) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

const bscMainnetParams = {
  chainId: "0x38",
  chainName: "Binance Smart Chain Mainnet",
  nativeCurrency: { name: "Binance Coin", symbol: "BNB", decimals: 18 },
  rpcUrls: ["https://bsc-dataseed.binance.org/"],
  blockExplorerUrls: ["https://bscscan.com"],
};

const isEthAddress = (value: string) => /^0x[a-fA-F0-9]{40}$/.test(value);

function getInitialSponsorCode() {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  return params.get("sponser_id") || params.get("sponsor_id") || params.get("sp_id") || "";
}

function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [sponsorCode, setSponsorCode] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [status, setStatus] = useState<{ type: StatusType; text: string }>({ type: "idle", text: "" });
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setSponsorCode(getInitialSponsorCode());
  }, []);

  useEffect(() => {
    const provider = window.ethereum;
    if (!provider?.on) return;

    const handleAccountsChanged = (accountsValue: unknown) => {
      const accounts = Array.isArray(accountsValue) ? accountsValue : [];
      const nextAddress = typeof accounts[0] === "string" ? accounts[0] : "";
      setWalletAddress(nextAddress);
      setStatus(
        nextAddress
          ? { type: "success", text: "Wallet account updated." }
          : { type: "warning", text: "Wallet disconnected. Please connect again." }
      );
    };

    provider.on("accountsChanged", handleAccountsChanged);
    return () => provider.removeListener?.("accountsChanged", handleAccountsChanged);
  }, []);

  const ensureBscMainnet = async () => {
    const provider = window.ethereum;
    if (!provider) {
      throw new Error("No wallet provider detected. Please use a DApp browser or install MetaMask.");
    }

    const currentChainId = await provider.request({ method: "eth_chainId" });
    if (currentChainId === bscMainnetParams.chainId) return;

    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: bscMainnetParams.chainId }],
      });
    } catch (error) {
      const switchError = error as { code?: number };
      if (switchError.code !== 4902) {
        throw new Error("Please switch your wallet to BSC Mainnet.");
      }
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [bscMainnetParams],
      });
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    setStatus({ type: "idle", text: "" });

    try {
      const provider = window.ethereum;
      if (!provider) {
        throw new Error("No wallet provider detected. Please use a DApp browser or install MetaMask.");
      }

      const accountsValue = await provider.request({ method: "eth_requestAccounts" });
      const accounts = Array.isArray(accountsValue) ? accountsValue : [];
      const nextAddress = typeof accounts[0] === "string" ? accounts[0] : "";

      if (!isEthAddress(nextAddress)) {
        throw new Error("Wallet connection failed. Please try again.");
      }

      await ensureBscMainnet();
      setWalletAddress(nextAddress);
      setStatus({ type: "success", text: "Wallet connected on BSC Mainnet." });
    } catch (error) {
      setStatus({ type: "error", text: error instanceof Error ? error.message : "Wallet connection failed." });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fullName.trim()) {
      setStatus({ type: "error", text: "Please enter name." });
      return;
    }

    if (!email.trim()) {
      setStatus({ type: "error", text: "Please enter email." });
      return;
    }

    if (!sponsorCode.trim()) {
      setStatus({ type: "error", text: "Please enter sponsor code." });
      return;
    }

    if (!walletAddress || !isEthAddress(walletAddress)) {
      setStatus({ type: "error", text: "Please connect a valid wallet address." });
      return;
    }

    setIsSubmitting(true);

    try {
      await ensureBscMainnet();
      await new Promise((resolve) => setTimeout(resolve, 900));
      setStatus({
        type: "success",
        text: "Registration details are ready. Connect this handler to your API or smart contract submit flow.",
      });
      console.log("Register attempt:", { fullName, email, sponsorCode, walletAddress });
    } catch (error) {
      setStatus({ type: "error", text: error instanceof Error ? error.message : "Registration failed." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EgtAuthLayout title="Register">
      {status.type !== "idle" && (
        <div className={`egt-auth-status egt-auth-status--${status.type}`}>
          <span>{status.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="egt-auth-form">
        <input
          id="fullName"
          name="fullName"
          type="text"
          value={fullName}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setFullName(event.target.value)}
          placeholder="Enter Name"
          required
          className="egt-auth-field egt-auth-field--dark"
        />

        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
          placeholder="Enter Email"
          required
          className="egt-auth-field egt-auth-field--dark"
        />

        <input
          id="sponsorCode"
          name="sponsorCode"
          type="text"
          value={sponsorCode}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setSponsorCode(event.target.value)}
          placeholder="Enter Sponsor Code"
          required
          className="egt-auth-field egt-auth-field--dark"
        />

        <input
          id="walletAddress"
          name="walletAddress"
          type="text"
          value={walletAddress}
          readOnly
          placeholder="Connect your wallet"
          className="egt-auth-field"
        />

        <div className="egt-auth-btn-row egt-auth-btn-row--compact">
          <button
            type="button"
            onClick={connectWallet}
            disabled={isConnecting || isSubmitting}
            className="egt-auth-secondary"
          >
            {isConnecting ? "Connecting..." : walletAddress ? "Reconnect Wallet" : "Connect Wallet"}
          </button>
        </div>

        <div className="egt-auth-btn-row egt-auth-btn-row--compact">
          <button type="submit" disabled={isSubmitting || isConnecting} className="egt-auth-submit">
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </div>

        <p className="egt-auth-account">
          Already Have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </EgtAuthLayout>
  );
}

export default RegisterPage;
