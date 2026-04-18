type ErrorStateProps = {
  title?: string;
  description: string;
};

function ErrorState({
  title = "Something went wrong",
  description,
}: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
      <h3 className="text-sm font-semibold text-red-800">{title}</h3>
      <p className="mt-1 text-sm text-red-700">{description}</p>
    </div>
  );
}

export default ErrorState;
