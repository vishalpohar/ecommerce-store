import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      <div className="flex-1 flex flex-col justify-end">
        <h1 className="text-9xl font-bold text-zinc-400">404</h1>
      </div>

      <div className="bg-zinc-200 w-full flex-1 flex flex-col items-center text-center gap-6 p-6">
        <p className="text-5xl text-zinc-500 font-light text-">
          Sorry, Page Not Found
        </p>
        <p className="text-zinc-500">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <Link
          to="/"
          className="inline-flex items-center text-zinc-500 border-2 border-zinc-400 rounded-full text-lg font-bold px-5 py-2">
          <ArrowLeft />
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
