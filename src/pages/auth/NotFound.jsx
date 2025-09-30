import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bay-of-many-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-bay-of-many-100 mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-bay-of-many-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-bay-of-many-900 mb-2">
          Page Non Trouvée
        </h1>

        <p className="text-bay-of-many-700 mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        <Link
          to="/"
          className="inline-block px-6 py-3 bg-bay-of-many-600 hover:bg-bay-of-many-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
