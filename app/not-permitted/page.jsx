const ForbiddenPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-white text-primary text-xl  gap-4 ">
      <h1 className="text-3xl font-semibold">401 (Unauthorized)</h1>
      <p className="text-4xl font-bold">
        | You do not have permission to access this page!
      </p>
      <p>Contact the admin for more information.</p>
    </div>
  );
};

export default ForbiddenPage;
