import Navbar from "../components/Navbar";

const NotFound = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center mt-40">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-6">Oops! Page not found</p>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <a
          href="/"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Go Home
        </a>
      </div>
    </>
  );
};

export default NotFound;
