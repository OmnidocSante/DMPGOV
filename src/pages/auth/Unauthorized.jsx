import { Link } from "react-router-dom";

export default function Unauthorized() {
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-bay-of-many-900 mb-2">
          Accès Refusé
        </h1>

        <p className="text-bay-of-many-700 mb-8">
          Vous n'avez pas l'autorisation d'accéder à cette page. Veuillez
          contacter votre administrateur si vous pensez qu'il s'agit d'une
          erreur.
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