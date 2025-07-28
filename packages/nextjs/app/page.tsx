"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import { 
  CalendarDaysIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon,
  UserGroupIcon,
  QrCodeIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const router = useRouter();

  const handleViewEvents = () => {
    if (connectedAddress) {
      router.push(`/organizer/dashboard?address=${connectedAddress}`);
    }
  };

  const features = [
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: "Zero-Knowledge Privacy",
      description: "Protect your identity while proving ticket ownership with cutting-edge cryptography"
    },
    {
      icon: <QrCodeIcon className="w-8 h-8" />,
      title: "Instant Verification",
      description: "QR code-based entry system with real-time blockchain verification"
    },
    {
      icon: <CurrencyDollarIcon className="w-8 h-8" />,
      title: "Direct Payments",
      description: "Cryptocurrency payments with automatic revenue distribution to organizers"
    },
    {
      icon: <UserGroupIcon className="w-8 h-8" />,
      title: "Anti-Scalping",
      description: "Non-transferable NFT tickets prevent black market reselling"
    }
  ];

  const stats = [
    { label: "Events Created", value: "10,000+", color: "text-primary" },
    { label: "Tickets Sold", value: "250,000+", color: "text-secondary" },
    { label: "Revenue Generated", value: "$2.5M+", color: "text-accent" },
    { label: "Zero Frauds", value: "100%", color: "text-success" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium"
              >
                <SparklesIcon className="w-4 h-4 mr-2" />
                Powered by Zero-Knowledge Proofs
              </motion.div>
            </div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                EventChain
              </span>
              <br />
              <span className="text-base-content/80 text-4xl md:text-5xl">
                Web3 Events
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-base-content/70 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              The future of event management is here. Create, sell, and verify tickets with 
              blockchain security, zero-knowledge privacy, and fraud-proof technology.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                href="/events/create"
                className="btn btn-primary btn-lg px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
              >
                <CalendarDaysIcon className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Create Event
              </Link>
              <Link
                href="/events/explore"
                className="btn btn-outline btn-lg px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Explore Events
              </Link>
              <Link
                href="/tickets/verify"
                className="btn btn-secondary btn-lg px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <QrCodeIcon className="w-5 h-5 mr-2" />
                Verify Ticket
              </Link>
            </motion.div>

            {connectedAddress && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="mt-8"
              >
                <button
                  onClick={handleViewEvents}
                  className="btn btn-accent btn-outline px-6 py-3 hover:scale-105 transition-all duration-300"
                >
                  <UserGroupIcon className="w-5 h-5 mr-2" />
                  Organizer Dashboard
                </button>
                <div className="mt-4 text-sm text-base-content/60">
                  Connected as: <Address address={connectedAddress} />
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="py-16 bg-base-200/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className={`text-3xl lg:text-4xl font-bold ${stat.color} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-base-content/60 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Why Choose EventChain?
            </h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Built on cutting-edge blockchain technology with privacy-first design principles
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                className="card bg-base-200/50 backdrop-blur-sm border border-base-300/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div className="card-body text-center p-8">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 text-primary">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="card-title text-xl font-bold mb-3 justify-center">
                    {feature.title}
                  </h3>
                  <p className="text-base-content/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="py-20 bg-gradient-to-r from-primary to-secondary"
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Events?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of organizers who trust EventChain for secure, 
            transparent, and fraud-free event management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="btn btn-accent btn-lg px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Get Started Free
            </Link>
            <Link
              href="/docs"
              className="btn btn-outline btn-lg px-8 py-4 text-lg font-semibold text-white border-white hover:bg-white hover:text-primary shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;