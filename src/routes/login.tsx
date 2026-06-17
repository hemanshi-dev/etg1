// src/routes/login.tsx
import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "../components/ui/Loginpage";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login - EGT Verse" },
      { name: "description", content: "Login to your EGT Verse account and continue your Web3 journey." },
    ],
  }),
  component: LoginPage,
});
