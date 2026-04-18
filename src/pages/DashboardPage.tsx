import { useQuery } from "@tanstack/react-query";
import { fetchMessagesAndCheckins } from "../lib/api";

function DashboardPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["messages-and-checkins"],
    queryFn: fetchMessagesAndCheckins,
  });

  if (isLoading) {
    return <div style={{ padding: 24 }}>Loading combined records...</div>;
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
      <h1>Combined records loaded</h1>
      <p>Count: {Array.isArray(data) ? data.length : 0}</p>

      <pre style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>
        {JSON.stringify(data?.slice(0, 3), null, 2)}
      </pre>
    </div>
  );
}

export default DashboardPage;
