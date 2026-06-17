import { Link } from "@tanstack/react-router";
import toast, { Toaster } from "react-hot-toast";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import { EgtAuthLayout } from "./EgtAuthLayout";
import { useEffect, useRef, useState, type FormEvent } from "react";

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

const LoginPage = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [walletError, setWalletError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [mounted, setMounted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const verifyWallet = async (): Promise<boolean> => {
    try {
      if (!window.ethereum) {
        toast.error("No wallet provider detected.");
        return false;
      }
      const provider = new BrowserProvider(window.ethereum as Parameters<typeof BrowserProvider>[0]);
      const signer: JsonRpcSigner = await provider.getSigner();
      await signer.signMessage("Wallet verification");
      return true;
    } catch {
      toast.error("Watch-only wallet detected. Please use a regular wallet account.");
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!walletAddress) {
      setWalletError("Please connect your wallet!");
      return;
    }

    if (isVerifying) return;
    setIsVerifying(true);
    setWalletError("");

    try {
      const isValid = await verifyWallet();
      if (isValid && formRef.current) {
        let submitInput = formRef.current.querySelector(
          'input[name="login_submit"]',
        ) as HTMLInputElement | null;
        if (!submitInput) {
          submitInput = document.createElement("input");
          submitInput.type = "hidden";
          submitInput.name = "login_submit";
          submitInput.value = "Login";
          formRef.current.appendChild(submitInput);
        }
        formRef.current.submit();
      } else {
        setWalletError("Wallet verification failed. Please try again.");
      }
    } catch {
      setWalletError("An error occurred during verification.");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    setMounted(true);

    if (!window.ethereum) return;

    let initializing = false;

    const autoConnect = async () => {
      if (initializing) return;
      initializing = true;

      // small delay to let wallet extension inject
      await new Promise((r) => setTimeout(r, 800));

      try {
        const accounts = await window.ethereum!.request({ method: "eth_requestAccounts" });
        const accs = Array.isArray(accounts) ? accounts : [];
        if (accs.length > 0 && typeof accs[0] === "string") {
          setWalletAddress(accs[0]);
          setWalletError("");
        } else {
          setWalletError("No wallet address found.");
        }
      } catch (err: unknown) {
        const e = err as { code?: number; message?: string };
        if (e.code === 4001) {
          setWalletError("Wallet connection rejected by user.");
        } else {
          setWalletError(e.message || "Wallet connection failed. Please try again.");
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

      <EgtAuthLayout title="Login">
        {noWalletDetected ? (
          <div className="egt-auth-alert">
            <span>You can only log in using the DApp browser.</span>
          </div>
        ) : (
          <form
            ref={formRef}
            id="login-form"
            name="login-form"
            className="egt-auth-form"
            method="post"
            action="/login"
            onSubmit={handleSubmit}
          >
            <div>
              <input
                name="username"
                id="wallet_address"
                className="egt-auth-field"
                type="text"
                placeholder="Connect your wallet"
                value={walletAddress}
                readOnly
                required
              />
              {walletError && <span className="egt-auth-error">{walletError}</span>}
            </div>

            <div className="egt-auth-btn-row">
              <button
                className="egt-auth-submit"
                type="submit"
                name="login_submit"
                value="Login"
                disabled={isVerifying || !walletAddress}
              >
                {isVerifying ? "Verifying..." : "Login"}
              </button>
            </div>

            <p className="egt-auth-account">
              Don&apos;t have an account? <Link to="/register">Register</Link>
            </p>
          </form>
        )}
      </EgtAuthLayout>
    </>
  );
};

export default LoginPage;
