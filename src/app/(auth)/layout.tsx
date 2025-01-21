export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/login-bg.jpg')" }}
    >
      <div className="w-full max-w-6xl mx-auto p-4">{children}</div>
    </div>
  );
}
