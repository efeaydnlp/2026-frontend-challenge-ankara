type AppShellProps = {
  children: React.ReactNode;
};

function AppShell({ children }: AppShellProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl p-4 md:p-6">{children}</div>
    </main>
  );
}

export default AppShell;
