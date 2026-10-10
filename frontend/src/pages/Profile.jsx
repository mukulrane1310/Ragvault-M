import { useState } from "react";
import { Lock, Mail } from "lucide-react";
import { updateProfile, changePassword } from "../services/auth";
import { useAuth } from "../context/useAuth";

export default function Profile() {
  const { user, token, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [nameMsg, setNameMsg] = useState("");
  const [nameSaving, setNameSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  const handleNameSave = async (e) => {
    e.preventDefault();
    setNameSaving(true);
    setNameMsg("");
    try {
      await updateProfile(name, token);
      await refreshUser();
      setNameMsg("Name updated!");
    } catch (err) {
      setNameMsg(err.message);
    } finally {
      setNameSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwSaving(true);
    setPwMsg("");
    setPwError("");
    try {
      await changePassword(currentPassword, newPassword, token);
      setPwMsg("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setPwError(err.message);
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage your account information
        </p>
      </div>

      {/* Account info */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Mail size={16} className="text-blue-500" />
          <h2 className="font-semibold">Account</h2>
        </div>
        <p className="text-sm text-slate-400 mb-4">{user?.email}</p>

        <form onSubmit={handleNameSave} className="flex flex-col gap-3">
          <label className="text-xs font-medium text-slate-400">
            Display Name
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="flex-1 px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-200 text-sm focus:outline-none focus:border-blue-600"
            />
            <button
              type="submit"
              disabled={nameSaving}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium disabled:bg-slate-700"
            >
              {nameSaving ? "Saving..." : "Save"}
            </button>
          </div>
          {nameMsg && <p className="text-sm text-sky-400">{nameMsg}</p>}
        </form>
      </div>

      {/* Change password */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock size={16} className="text-blue-500" />
          <h2 className="font-semibold">Change Password</h2>
        </div>

        <form onSubmit={handlePasswordChange} className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-200 text-sm focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-200 text-sm focus:outline-none focus:border-blue-600"
            />
          </div>

          {pwError && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {pwError}
            </p>
          )}
          {pwMsg && <p className="text-sm text-sky-400">{pwMsg}</p>}

          <button
            type="submit"
            disabled={pwSaving}
            className="self-start px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium disabled:bg-slate-700"
          >
            {pwSaving ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}