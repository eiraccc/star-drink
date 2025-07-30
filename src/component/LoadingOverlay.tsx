const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[999] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingOverlay;
