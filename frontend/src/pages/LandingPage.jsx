import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Shield, Zap, Users } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import Logo from "../components/Logo";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <Logo className="w-10 h-10" textSize="text-2xl" />
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-full font-semibold text-sm transition-all
              bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:shadow-md
              dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2.5 rounded-full font-semibold text-sm text-white transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50
              bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20 text-center relative overflow-hidden">
        {/* Background Blobs (Neon Effects) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/20 rounded-full blur-[100px] -z-10" />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6"
        >
          Your Voice. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500">
            Your Campus. Resolved.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          The modern way to report issues, track progress, and improve campus
          life. Anonymous, fast, and AI-powered.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/signup"
            className="px-8 py-4 rounded-full font-bold text-lg text-white shadow-xl shadow-blue-600/20 transition-transform hover:scale-105
              bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center gap-2"
          >
            Report an Issue <ArrowRight size={20} />
          </Link>
          <Link // Demo link logic
            to="/login"
            className="px-8 py-4 rounded-full font-bold text-lg text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Officer Login
          </Link>
        </motion.div>
      </main>

      {/* Features Grid */}
      <section className="py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="text-blue-500" size={32} />}
              title="Anonymous & Secure"
              desc="Report sensitive issues without fear. Your identity is protected with industry-standard encryption."
            />
            <FeatureCard
              icon={<Zap className="text-purple-500" size={32} />}
              title="AI-Powered Triage"
              desc="Smart AI analyzes urgency and categorizes tickets instantly, ensuring critical issues get solved first."
            />
            <FeatureCard
              icon={<Users className="text-pink-500" size={32} />}
              title="Community Voting"
              desc="See what matters to others. Upvote shared grievances to prioritize campus-wide improvements."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

// Simple reusable card component
const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow">
    <div className="mb-4 bg-gray-50 dark:bg-gray-700/50 w-14 h-14 rounded-xl flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
      {title}
    </h3>
    <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;
