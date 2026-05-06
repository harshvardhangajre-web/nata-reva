"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";

export default function ProfilePage() {
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    useEffect(() => {
        async function loadProfile() {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) {
                router.push("/login");
                return;
            }
            const authEmail = authUser.email || "";
            setUser({
                id: authUser.id,
                email: authEmail,
                name: authUser.user_metadata?.full_name || (authEmail ? authEmail.split("@")[0] : "Student"),
            });

            // Fetch existing profile
            const { data: profile, error } = await supabase
                .from("profiles")
                .select("phone_number")
                .eq("id", authUser.id)
                .single();

            if (profile?.phone_number) {
                setPhoneNumber(profile.phone_number);
            } else if (authUser.phone) {
                // If they logged in via OTP, set it directly
                setPhoneNumber(authUser.phone.startsWith("+") ? authUser.phone : `+${authUser.phone}`);
            }
            setLoading(false);
        }
        loadProfile();
    }, [router, supabase]);

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        if (!user) return;

        setSaving(true);
        setMessage(null);

        const { error } = await supabase.from("profiles").upsert({
            id: user.id,
            phone_number: phoneNumber,
        });

        setSaving(false);

        if (error) {
            console.error(error);
            setMessage({ text: "Failed to save profile. Please try again.", type: "error" });
        } else {
            setMessage({ text: "Profile updated successfully!", type: "success" });
            setTimeout(() => setMessage(null), 3000);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-ink-200 border-t-ink-900 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#F5F5F5]">
            <Sidebar userName={user?.name || "Student"} />

            <main className="flex-1 overflow-auto p-8">
                <div className="max-w-2xl">
                    {/* Header */}
                    <div className="mb-10 animate-fade-up">
                        <h1 className="font-display text-4xl font-semibold text-ink-900">
                            Your <span style={{ color: "#E8A940" }}>Profile</span>
                        </h1>
                        <p className="text-ink-400 mt-1">Manage your account details and contact information.</p>
                    </div>

                    {/* Profile Form Card */}
                    <div className="card p-8 animate-fade-up stagger-1" style={{ opacity: 0 }}>
                        <form onSubmit={handleSave} className="space-y-6">

                            <div className="space-y-4">
                                {/* Email (Read-only) */}
                                <div>
                                    <label className="block text-sm font-medium text-ink-900 mb-1.5">
                                        Email Address
                                    </label>
                                    <input
                                        type="text"
                                        value={user?.email || "Phone Login (No Email)"}
                                        disabled
                                        className="w-full px-4 py-2.5 rounded-xl border border-ink-200 bg-ink-50 text-ink-500 font-body text-sm cursor-not-allowed"
                                    />
                                    {user?.email ? (
                                        <p className="text-xs text-ink-400 mt-1.5">Your email address cannot be changed here.</p>
                                    ) : (
                                        <p className="text-xs text-ink-400 mt-1.5">You logged in using a Phone Number.</p>
                                    )}
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="block text-sm font-medium text-ink-900 mb-1.5" htmlFor="phone">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-ink-400">
                                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </span>
                                        <input
                                            id="phone"
                                            type="tel"
                                            placeholder="+91 98765 43210"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 bg-white text-ink-900 font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#E8A940]/50 focus:border-[#E8A940] transition-shadow"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Message Toast inside form */}
                            {message && (
                                <div
                                    className={`px-4 py-3 rounded-lg text-sm font-medium ${message.type === "success"
                                        ? "bg-[#6B8F71]/10 text-[#6B8F71] border border-[#6B8F71]/20"
                                        : "bg-[#E07060]/10 text-[#E07060] border border-[#E07060]/20"
                                        }`}
                                >
                                    {message.text}
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    style={{ background: "#E8A940" }}
                                >
                                    {saving && (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    )}
                                    {saving ? "Saving Changes..." : "Save Profile"}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
