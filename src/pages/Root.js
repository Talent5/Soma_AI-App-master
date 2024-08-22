import { Dashboard } from '../components/Home/Dashboard';

export const Root = () => {
  return (
    <div className="bg-gradient-to-r from-purple-100 to-pink-100 min-h-screen flex items-center justify-center px-4 py-8"> {/* Add padding to the top */}
      <div className="max-w-md w-full">
        <Dashboard />
      </div>
    </div>
  );
};





