import { FaCheckCircle } from "react-icons/fa";

export function Link({
  title,
  onNewClick,
}: {
  title: string;
  onNewClick: () => void;
}): JSX.Element {
  return (
    <div className="my-8">
      <span className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">
        <FaCheckCircle />
        Your mounted url
      </span>

      <div className="p-6 bg-gray-50 border border-gray-300   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 rounded text-medium text-lg break-words underline">
        <a href={title} target="_blank">
          {title}
        </a>
      </div>

      <button
        type="button"
        className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center mt-6 border"
        onClick={onNewClick}
      >
        New link
      </button>
    </div>
  );
}
