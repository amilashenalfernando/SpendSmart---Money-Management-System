"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import toast from "react-hot-toast";

export function SettingsClient({ name: initialName, email: initialEmail }: { name: string; email: string }) {
  const { update } = useSession();
  const { currency, setCurrency } = useCurrency();

  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      if (res.ok) {
        toast.success("Profile updated");
        await update({ name, email });
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to update profile");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    setIsPasswordLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        toast.success("Password updated");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to update password");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/settings", { method: "DELETE" });
      if (res.ok) {
        toast.success("Account deleted");
        signOut({ callbackUrl: "/" });
      } else {
        toast.error("Failed to delete account");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const currencyOptions = [
    { value: "$", label: "USD ($)" },
    { value: "Rs", label: "LKR (Rs)" },
    { value: "€", label: "EUR (€)" },
    { value: "£", label: "GBP (£)" },
    { value: "¥", label: "JPY (¥)" },
  ];

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Profile */}
      <div className="glass-card p-6 md:p-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Profile Information</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-5">
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <div className="pt-2">
            <Button type="submit" isLoading={isProfileLoading}>Save Changes</Button>
          </div>
        </form>
      </div>

      {/* Preferences */}
      <div className="glass-card p-6 md:p-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Preferences</h2>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as "$" | "€" | "£" | "Rs" | "¥")}
              className="flex w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
            >
              {currencyOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <p className="text-xs text-slate-400 mt-1">Saved on this device.</p>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="glass-card p-6 md:p-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Change Password</h2>
        <form onSubmit={handleUpdatePassword} className="space-y-5">
          <Input label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          <Input label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <div className="pt-2">
            <Button type="submit" isLoading={isPasswordLoading} disabled={!currentPassword || !newPassword}>
              Update Password
            </Button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="glass-card p-6 md:p-8 border border-red-100">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Danger Zone</h2>
        <p className="text-slate-500 text-sm mb-6">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>Delete Account</Button>
      </div>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Account">
        <div className="space-y-4">
          <p className="text-slate-600">
            Are you sure you want to completely delete your account? All your transactions and data will be permanently removed. This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteAccount} isLoading={isDeleting}>
              Yes, Delete My Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
