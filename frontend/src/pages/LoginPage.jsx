import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";
import { Mail, Lock, Loader2 } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import Logo from "../components/Logo";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* LEFT SIDE: Form */}
      <div className="flex flex-col justify-center items-center p-8 sm:p-12 relative">
        {/* Absolute Toggle */}
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md space-y-8">
          {/* Logo Redirect */}
          <div className="flex justify-center mb-8">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <Logo className="w-12 h-12" textSize="text-3xl" />
            </Link>
          </div>

          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Sign in to resolve your campus issues.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900 dark:text-white"
                    placeholder="you@college.edu"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="password"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900 dark:text-white"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? <Loader2 className="animate-spin" /> : "Sign in"}
            </button>

            {/* DEMO CREDENTIALS BOX */}
            <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
              <h3 className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider mb-3">
                🚀 Demo Credentials
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm p-2 bg-white dark:bg-gray-800 rounded border border-blue-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">
                    Student:
                  </span>
                  <div className="text-right">
                    <p className="font-mono font-medium text-gray-900 dark:text-white">
                      student.lenni@university.edu
                    </p>
                    <p className="font-mono text-xs text-gray-500">Pass@1234</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm p-2 bg-white dark:bg-gray-800 rounded border border-blue-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">
                    Officer:
                  </span>
                  <div className="text-right">
                    <p className="font-mono font-medium text-gray-900 dark:text-white">
                      officer.cooper@university.edu
                    </p>
                    <p className="font-mono text-xs text-gray-500">Pass@1234</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE: Image (Hidden on Mobile) */}
      <div className="hidden lg:block relative bg-gray-900">
        <div className="absolute inset-0 bg-blue-600/20 mix-blend-multiply" />
        <img
          className="absolute inset-0 w-full h-full object-cover opacity-90"
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop"
          alt="College Campus"
        />
        <div className="absolute bottom-0 left-0 p-12 text-white z-10">
          <h2 className="text-4xl font-bold mb-4">Empower Your Voice.</h2>
          <p className="text-lg text-blue-100 max-w-md">
            Join thousands of students making their campus better, one
            resolution at a time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
