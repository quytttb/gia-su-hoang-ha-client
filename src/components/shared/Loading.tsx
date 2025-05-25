interface LoadingProps {
  message?: string;
}

const Loading = ({ message = 'Đang tải...' }: LoadingProps) => {
  return (
    <div className="flex justify-center items-center min-h-[400px]" data-testid="loading-container">
      <div className="text-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"
          data-testid="loading-spinner"
        ></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
