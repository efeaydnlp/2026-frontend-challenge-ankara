import { useQuery } from "@tanstack/react-query";
import { fetchAllSources } from "../lib/api";

function DashboardPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["all-sources"],
    queryFn: fetchAllSources,
  });

  if (isLoading) {
    return <div style={{ padding: 24 }}>Loading all sources...</div>;
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
      <h1>All sources loaded</h1>
      <p>Count: {Array.isArray(data) ? data.length : 0}</p>

      <pre style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>
        {JSON.stringify(data?.slice(0, 8), null, 2)}
      </pre>
    </div>
  );
}

export default DashboardPage;
