"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function UpdatePasswordPage() {
    const router = useRouter();
    const supabase = createClient();
    const [password, setPassword] = useState("");

    useEffect(() => {
        const checkSession = async () => {
            const params = new URLSearchParams(window.location.search);
            const code = params.get("code");
            if (code) {
                const { error } = await supabase.auth.exchangeCodeForSession(code);
                if (error) setError("Reset link expired or invalid.");
            }
        };
        checkSession();
    }, [supabase]);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleUpdatePassword(e: React.FormEvent) {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        setError("");

        const { error } = await supabase.auth.updateUser({ password });

        setLoading(false);

        if (error) {
            setError(error.message);
        } else {
            router.push("/dashboard");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "linear-gradient(135deg, #F8F7F4 0%, #F0EFEC 50%, #E8E7E2 100%)" }}>
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#F0EFEC] animate-fade-up">

                {/* Logo */}
                <div className="flex items-center gap-2 mb-8 justify-center">
                    <div className="w-8 h-8 rounded-lg" style={{ background: "linear-gradient(135deg, #E8A940, #F5D08A)" }} />
                    <span className="font-mono text-sm font-medium tracking-widest text-[#0D0D0D] uppercase">NATA-REVA</span>
                </div>

                <div className="mb-8 text-center">
                    <h1 className="font-display text-2xl font-semibold text-ink-900 mb-2">
                        Update Password
                    </h1>
                    <p className="text-ink-400 font-body text-sm">
                        Please enter your new password below.
                    </p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div>
                        <label className="label">New Password</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Min 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    <div>
                        <label className="label">Confirm New Password</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg text-sm mt-4" style={{ background: "rgba(224,112,96,0.08)", color: "#C4503A", border: "1px solid rgba(224,112,96,0.2)" }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Saving...
                            </span>
                        ) : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
