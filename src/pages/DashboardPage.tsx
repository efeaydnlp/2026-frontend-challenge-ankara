import { useQuery } from "@tanstack/react-query";
import { fetchMessagesOnly } from "../lib/api";

function DashboardPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["messages-only"],
    queryFn: fetchMessagesOnly,
  });

  if (isLoading) {
    return <div style={{ padding: 24 }}>Loading normalized messages...</div>;
  }

  if (isError) {
    return (
      <div style={{ padding: 24 }}>
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Normalized messages loaded</h1>
      <p>Count: {Array.isArray(data) ? data.length : 0}</p>
      <p>Open browser console and inspect the first normalized record.</p>

      <pre style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>
        {JSON.stringify(data?.[0], null, 2)}
      </pre>
    </div>
  );
}

export default DashboardPage;
