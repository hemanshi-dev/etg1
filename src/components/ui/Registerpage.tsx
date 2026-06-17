import { Link } from "@tanstack/react-router";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import toast, { Toaster } from "react-hot-toast";
import { EgtAuthLayout } from "./EgtAuthLayout";
import { useEffect, useState, type FormEvent } from "react";

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, callback: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, callback: (...args: unknown[]) => void) => void;
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

const ensureBscMainnet = async () => {
  const provider = window.ethereum;
  if (!provider) throw new Error("No wallet provider detected.");

  const currentChainId = await provider.request({ method: "eth_chainId" });
  if (currentChainId === bscMainnetParams.chainId) return;

  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: bscMainnetParams.chainId }],
    });
    await new Promise((r) => setTimeout(r, 1000));
  } catch (error: unknown) {
    const e = error as { code?: number };
    if (e.code === 4902) {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [bscMainnetParams],
      });
      await new Promise((r) => setTimeout(r, 1000));
    } else {
      throw new Error("Please switch your wallet to BSC Mainnet.");
    }
  }
};

function RegisterPage() {
  const [sponsorCode, setSponsorCode] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [walletError, setWalletError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSponsorCode(getInitialSponsorCode());

    if (!window.ethereum) return;

    let initializing = false;

    const autoConnect = async () => {
      if (initializing) return;
      initializing = true;

      // small delay to let wallet extension inject
      await new Promise((r) => setTimeout(r, 800));

      try {
        const accountsValue = await window.ethereum!.request({
          method: "eth_requestAccounts",
        });
        const accounts = Array.isArray(accountsValue) ? accountsValue : [];
        if (accounts.length > 0 && typeof accounts[0] === "string") {
          setWalletAddress(accounts[0]);
          setWalletError("");
          await ensureBscMainnet();
        } else {
          setWalletError("No wallet address found.");
        }
      } catch (err: unknown) {
        const e = err as { code?: number; message?: string };
        if (e.code === 4001) {
          setWalletError("Wallet connection rejected by user.");
        } else {
          setWalletError(e.message || "Wallet connection failed.");
        }
      } finally {
        initializing = false;
      }
    };

    autoConnect();

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = Array.isArray(args[0]) ? args[0] : [];
      if (accounts.length > 0 && typeof accounts[0] === "string") {
        setWalletAddress(accounts[0]);
        setWalletError("");
      } else {
        setWalletAddress("");
        setWalletError("No wallet address found.");
      }
    };

    window.ethereum.on?.("accountsChanged", handleAccountsChanged);
    return () => {
      window.ethereum?.removeListener?.("accountsChanged", handleAccountsChanged);
    };
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!sponsorCode.trim()) {
      setWalletError("Please enter sponsor code!");
      return;
    }

    if (!walletAddress || !isEthAddress(walletAddress)) {
      setWalletError("Please connect a valid wallet address!");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    setWalletError("");

    try {
      await ensureBscMainnet();

      const provider = new BrowserProvider(
        window.ethereum as Parameters<typeof BrowserProvider>[0],
      );
      const signer: JsonRpcSigner = await provider.getSigner();
      const userAddress = await signer.getAddress();

      if (userAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        throw new Error("Wallet address mismatch. Please reconnect.");
      }

      toast.success("Registration successful! Please login and upgrade your package.");
      console.log("Register attempt:", { sponsorCode, walletAddress });
    } catch (err: unknown) {
      const e = err as { code?: number; reason?: string; message?: string };
      if (e.code === 4001) {
        toast.error("Transaction rejected by user.");
      } else {
        toast.error(e.reason || e.message || "Registration failed.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // After mount, check if wallet is available at all
  const noWalletDetected = mounted && !window.ethereum;

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: { background: "#363636", color: "#fff" },
          success: { duration: 5000, style: { background: "#22c55e", color: "#fff" } },
          error: { duration: 5000, style: { background: "#ef4444", color: "#fff" } },
        }}
      />

      <EgtAuthLayout title="Register">
        {noWalletDetected ? (
          <div className="egt-auth-alert">
            <span>You can only register using the DApp browser.</span>
          </div>
        ) : (
          <form id="register-form" className="egt-auth-form" onSubmit={handleSubmit}>
            <input
              id="sponser_id"
              name="sponser_id"
              type="text"
              value={sponsorCode}
              onChange={(e) => setSponsorCode(e.target.value)}
              placeholder="Enter Sponsor Code"
              required
              className="egt-auth-field egt-auth-field--dark"
            />

            <div>
              <input
                id="wallet_address"
                name="wallet_address"
                type="text"
                value={walletAddress}
                readOnly
                placeholder="Connect your wallet"
                required
                className="egt-auth-field"
              />
              {walletError && <span className="egt-auth-error">{walletError}</span>}
            </div>

            <div className="egt-auth-btn-row">
              <button
                type="submit"
                id="register_btn"
                name="register_submit"
                value="Register"
                disabled={isSubmitting || !walletAddress}
                className="egt-auth-submit"
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>
            </div>

            <p className="egt-auth-account">
              Already Have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        )}
      </EgtAuthLayout>
    </>
  );
}

export default RegisterPage;
