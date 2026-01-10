interface ErrorProps {
  message: string;
  onRetry?: () => void;
}

export const Error = ({ message, onRetry }: ErrorProps) => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center bg-red-500/20 rounded-lg p-6 max-w-md mx-4">
        <div className="text-red-200 text-4xl mb-4">⚠️</div>
        <p className="text-white text-lg mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
};

