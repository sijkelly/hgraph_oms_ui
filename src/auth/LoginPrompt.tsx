import { useState } from "react";
import { useAuth } from "./AuthContext";

interface LoginPromptProps {
  message?: string;
}

export default function LoginPrompt({ message }: LoginPromptProps) {
  const { setUserId } = useAuth();
  const [input, setInput] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim()) {
      setUserId(input.trim());
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Sign In</h2>
        <p className="text-sm text-slate-500 mb-4">
          {message ?? "Enter your user ID to access the OMS."}
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="User ID (e.g. trader1)"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
