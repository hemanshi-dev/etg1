import { createFileRoute } from "@tanstack/react-router";
import RegisterPage from "../components/ui/Registerpage";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register - EGT Verse" },
      { name: "description", content: "Create your EGT Verse account with a sponsor code and wallet address." },
    ],
  }),
  component: RegisterPage,
});
