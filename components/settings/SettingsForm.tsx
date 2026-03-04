'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PASSPORT_COLORS } from '@/lib/passportColors';

interface SettingsFormProps {
  username: string;
  currentInternetYear: number;
  currentBio: string;
  currentAvatar: string | null;
  currentPassportColor: string;
}

/** Resize an image file to 200x200 and return as base64 JPEG data URL */
async function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d')!;
        // Crop to square from center
        const size = Math.min(img.width, img.height);
        const x = (img.width - size) / 2;
        const y = (img.height - size) / 2;
        ctx.drawImage(img, x, y, size, size, 0, 0, 200, 200);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function SettingsForm({
  username,
  currentInternetYear,
  currentBio,
  currentAvatar,
  currentPassportColor,
}: SettingsFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [internetYear, setInternetYear] = useState(String(currentInternetYear));
  const [bio, setBio] = useState(currentBio);
  const [avatar, setAvatar] = useState<string | null>(currentAvatar);
  const [avatarChanged, setAvatarChanged] = useState(false);
  const [passportColor, setPassportColor] = useState(currentPassportColor);

  const currentYear = new Date().getFullYear();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10 MB');
      return;
    }
    try {
      const resized = await resizeImage(file);
      setAvatar(resized);
      setAvatarChanged(true);
      setError('');
    } catch {
      setError('Could not process image. Try a different file.');
    }
    // Reset input so the same file can be reselected if needed
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const body: Record<string, unknown> = {
      internetYear: Number(internetYear),
      bio,
      passportColor,
    };
    if (avatarChanged) body.avatar = avatar;

    const res = await fetch('/api/user/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || 'Update failed');
      return;
    }

    setSuccess(true);
    setAvatarChanged(false);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-sm text-slate-500">
        Editing profile for <strong>@{username}</strong>
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
          Profile updated! ✅
        </div>
      )}

      {/* ── Avatar upload ── */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">Profile Photo</label>
        <div className="flex items-center gap-5">
          {/* Preview */}
          <div
            className="w-20 h-20 rounded-2xl flex-shrink-0 overflow-hidden shadow-md border-2 border-white cursor-pointer hover:opacity-80 transition-opacity"
            style={{ background: 'linear-gradient(135deg,#FF6EC7,#7B61FF)' }}
            onClick={() => fileInputRef.current?.click()}
            title="Click to change photo"
          >
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-black text-white">
                {username[0].toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-white border-2 border-slate-200 text-slate-700 hover:border-[#7B61FF] hover:text-[#7B61FF] transition-all"
            >
              {avatar ? 'Change Photo' : 'Upload Photo'}
            </button>
            {avatar && avatarChanged && (
              <button
                type="button"
                onClick={() => { setAvatar(currentAvatar); setAvatarChanged(false); }}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-red-400 transition-colors"
              >
                Cancel
              </button>
            )}
            <p className="text-[11px] text-slate-400">JPG, PNG, GIF · Max 10 MB</p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* ── Internet year ── */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          When did you start using the internet?
        </label>
        <select
          value={internetYear}
          onChange={(e) => setInternetYear(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-[#7B61FF] transition-colors"
        >
          {Array.from({ length: currentYear - 1990 + 1 }, (_, i) => currentYear - i).map((year) => (
            <option key={year} value={year}>
              {year} {year === currentYear ? '(this year)' : `(${currentYear - year} yr${currentYear - year !== 1 ? 's' : ''} online)`}
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-400 mt-1">Sets your Internet Age on your passport.</p>
      </div>

      {/* ── Bio ── */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Bio <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          maxLength={160}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-[#7B61FF] transition-colors resize-none"
          placeholder="Professional internet lurker. Part-time meme archivist."
        />
        <p className="text-xs text-slate-400 mt-1">{bio.length}/160</p>
      </div>

      {/* ── Passport cover color ── */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          Passport Cover Color
        </label>
        <div className="flex flex-wrap gap-3">
          {PASSPORT_COLORS.map((preset) => (
            <button
              key={preset.slug}
              type="button"
              onClick={() => setPassportColor(preset.slug)}
              title={preset.label}
              className="relative w-10 h-10 rounded-full transition-all hover:scale-110"
              style={{
                background: preset.gradient,
                outline: passportColor === preset.slug ? `3px solid ${preset.ring}` : 'none',
                outlineOffset: '2px',
              }}
            >
              {passportColor === preset.slug && (
                <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-black">✓</span>
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {PASSPORT_COLORS.find((c) => c.slug === passportColor)?.label}
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#FF6EC7] to-[#7B61FF] hover:opacity-90 hover:scale-[1.02] transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Saving...' : 'Save Changes ✅'}
      </button>
    </form>
  );
}
