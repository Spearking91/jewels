"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { User, Phone, CheckCircle, Asterisk } from "@boxicons/react";

export default function ProfilePage() {
  const router = useRouter();

  // State management
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Form fields state
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    // Fetch authenticated user and profile on mount
    supabase.auth.getUser().then(({ data: { user }, error: authError }) => {
      if (authError || !user) {
        router.push("/login");
        return;
      }
      setUser(user);

      supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setProfile(data);
            setUsername(data.username || "");
            setPhone(data.phone || "");
            setPreviewUrl(data.avatar_url || "");
          }
          setLoading(false);
        });
    });
  }, [router]);

  // Handle file selection and preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle Profile Update client-side
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    setError("");
    setSuccess("");

    let avatar_url = profile?.avatar_url;

    const saveProfileData = (finalAvatarUrl: string) => {
      supabase
        .from("users")
        .update({
          username: username.trim(),
          phone: phone.trim(),
          avatar_url: finalAvatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .then(({ error: updateError }) => {
          setSubmitting(false);
          if (updateError) {
            setError(updateError.message);
          } else {
            setSuccess("Profile updated successfully!");
          }
        });
    };

    // Upload avatar if a new file was selected
    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      supabase.storage
        .from("avatars")
        .upload(fileName, avatarFile, { upsert: true })
        .then(({ error: uploadError }) => {
          if (uploadError) {
            setSubmitting(false);
            setError(uploadError.message);
            return;
          }

          const { data: publicUrlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(fileName);

          avatar_url = publicUrlData.publicUrl;
          saveProfileData(avatar_url);
        });
    } else {
      saveProfileData(avatar_url);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-2xl mx-auto flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account Profile</h1>
        <p className="text-xs text-base-content/60 mt-1">
          Manage your personal account settings and profile details.
        </p>
      </div>

      {success && (
        <div className="alert alert-success text-xs py-3">
          <CheckCircle className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error text-xs py-3">
          <span>{error}</span>
        </div>
      )}

      <div className="card bg-base-100 border border-base-200 shadow-sm p-6 rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar Preview & Upload */}
          <div className="flex items-center gap-4 pb-4 border-b border-base-200">
            <div className="avatar">
              <div className="w-16 h-16 rounded-full bg-base-200 border border-base-300 overflow-hidden">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-base-content/40">
                    <User className="w-8 h-8" />
                  </div>
                )}
              </div>
            </div>
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text text-xs font-semibold">
                  Change Avatar
                </span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input file-input-bordered file-input-xs w-full max-w-xs text-xs"
              />
            </div>
          </div>

          {/* Email (Read-only) */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-xs font-semibold">
                Email Address
              </span>
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ""}
              className="input input-bordered input-sm w-full bg-base-200/50 text-xs font-mono"
            />
            <label className="label py-0.5">
              <span className="label-text-alt text-[10px] text-base-content/50">
                Email cannot be changed directly here.
              </span>
            </label>
          </div>

          {/* Username */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-xs font-semibold">
                Username (Min 3 characters)
              </span>
            </label>
            <div className="relative flex items-center">
              <Asterisk className="w-4 h-4 absolute left-3 text-base-content/40" />
              <input
                type="text"
                required
                minLength={3}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your_username"
                className="input input-bordered input-sm w-full pl-9 text-xs"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-xs font-semibold">
                Phone Number
              </span>
            </label>
            <div className="relative flex items-center">
              <Phone className="w-4 h-4 absolute left-3 text-base-content/40" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+233 XX XXX XXXX"
                className="input input-bordered input-sm w-full pl-9 text-xs font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-base-200 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-sm btn-primary 
               normal-case"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
