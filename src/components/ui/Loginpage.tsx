// src/pages/LoginPage.tsx
import React, { useState, useEffect, useRef, FormEvent } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import toast, { Toaster } from "react-hot-toast";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import { EgtAuthLayout } from "./EgtAuthLayout";
// import WAValidator from "multicoin-address-validator";

// Types
interface LoginFormData {
  wallet_address: string;
}

declare global {
  interface Window {
    // ethereum?: any;
  }
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [walletError, setWalletError] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Toast notifications
  const showToast = (message: string, type: "success" | "error" | "info") => {
    if (type === "success") toast.success(message);
    else if (type === "error") toast.error(message);
    // else toast.info(message);
  };

  // Connect wallet function
  const connectWallet = async (): Promise<void> => {
    if (!window.ethereum) {
      setWalletError("No wallet provider detected. Please install a compatible wallet.");
      return;
    }

    setIsConnecting(true);
    setWalletError("");

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts) {
        // setWalletAddress(accounts[0]);
        setWalletError("");
        toast.success("Wallet connected successfully!");
      } else {
        setWalletError("No wallet address found.");
      }
    } catch (err: any) {
      console.error("Wallet connection error:", err);
      if (err.code === 4001) {
        setWalletError("Wallet connection rejected by user.");
      } else {
        setWalletError("Wallet connection failed. Please try again.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Verify wallet signature (ethers v6)
  const verifyWallet = async (address: string): Promise<boolean> => {
    try {
      if (!window.ethereum) {
        toast.error("No wallet provider detected.");
        return false;
      }

      // Use BrowserProvider for ethers v6
      const provider = new BrowserProvider(window.ethereum);
      const signer: JsonRpcSigner = await provider.getSigner();

      // Sign a message to verify ownership
      await signer.signMessage("Wallet verification");

      return true;
    } catch (err) {
      console.error("Verification error:", err);
      toast.error(
        "Watch-only wallet detected. Please use a regular wallet account."
      );
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!walletAddress) {
      setWalletError("Please connect your wallet!");
      return;
    }

    // Validate wallet address
    // if (!WAValidator.validate(walletAddress, "ETH")) {
    //   setWalletError("Please enter a valid Ethereum wallet address!");
    //   return;
    // }

    if (isVerifying) return;

    setIsVerifying(true);
    setWalletError("");

    try {
      const isValidWallet = await verifyWallet(walletAddress);

      if (isValidWallet) {
        // Create hidden input for form submission
        const form = formRef.current;
        if (form) {
          // Add login_submit field if not exists
          let submitInput = form.querySelector(
            'input[name="login_submit"]'
          ) as HTMLInputElement;
          if (!submitInput) {
            submitInput = document.createElement("input");
            submitInput.type = "hidden";
            submitInput.name = "login_submit";
            submitInput.value = "Login";
            form.appendChild(submitInput);
          }

          // Submit the form
          form.submit();
        }
      } else {
        setWalletError("Wallet verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setWalletError("An error occurred during verification.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Auto-connect wallet on component mount
  useEffect(() => {
    let mounted = true;

    const autoConnect = async () => {
      if (isInitializing) return;
      setIsInitializing(true);

      try {
        // Wait a bit for wallet to initialize
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (mounted && window.ethereum) {
          // Check if already connected
          try {
            const accounts = await window.ethereum.request({
              method: "eth_accounts",
            });
            // if (accounts && accounts.length > 0) {
            //   setWalletAddress(accounts[0]);
            // }
          } catch (err) {
            console.error("Auto-connect error:", err);
          }
        }
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        if (mounted) {
          setIsInitializing(false);
        }
      }
    };

    autoConnect();

    return () => {
      mounted = false;
    };
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setWalletError("");
          console.log("Account changed to:", accounts[0]);
        } else {
          setWalletAddress("");
          setWalletError("No wallet address found.");
        }
      };

    //   window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        // window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, []);

  const hasWallet = typeof window !== "undefined" && window.ethereum;

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 5000,
            style: {
              background: "#22c55e",
              color: "#fff",
            },
          },
          error: {
            duration: 5000,
            style: {
              background: "#ef4444",
              color: "#fff",
            },
          },
        }}
      />

      <EgtAuthLayout title="Login">
        {hasWallet ? (
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
                className="egt-auth-secondary"
                type="button"
                onClick={connectWallet}
                disabled={isConnecting || isVerifying}
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
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
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </form>
        ) : (
          <div className="egt-auth-alert">
            <span>Please install a Web3 wallet (like MetaMask) to login.</span>
          </div>
        )}
      </EgtAuthLayout>
    </>
  );
};

export default LoginPage;
