// Centered layout for Login & Register pages
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen animated-bg flex items-center justify-center p-4">
      {children}
    </div>
  );
}
