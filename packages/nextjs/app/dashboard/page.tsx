"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import {
  CalendarDaysIcon,
  TicketIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  EyeIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  MapPinIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

interface DashboardStats {
  totalEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  averageRating: number;
  trendEvents: number;
  trendRevenue: number;
}

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  ticketsSold: number;
  maxAttendees: number;
  revenue: number;
  status: "upcoming" | "live" | "completed" | "cancelled";
}

interface Ticket {
  id: string;
  eventName: string;
  eventDate: string;
  location: string;
  price: number;
  status: "valid" | "used" | "expired";
}

const DashboardPage = () => {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"overview" | "events" | "tickets" | "analytics">("overview");

  // Mock data - in real app, this would come from API/blockchain
  const stats: DashboardStats = {
    totalEvents: 12,
    totalTicketsSold: 1247,
    totalRevenue: 45.67,
    averageRating: 4.8,
    trendEvents: 15,
    trendRevenue: 23,
  };

  const recentEvents: Event[] = [
    {
      id: "1",
      name: "Web3 Developer Conference 2024",
      date: "2024-02-15",
      location: "Virtual",
      ticketsSold: 245,
      maxAttendees: 500,
      revenue: 12.5,
      status: "upcoming"
    },
    {
      id: "2", 
      name: "Blockchain Meetup Singapore",
      date: "2024-01-28",
      location: "Singapore",
      ticketsSold: 89,
      maxAttendees: 100,
      revenue: 4.5,
      status: "live"
    },
    {
      id: "3",
      name: "DeFi Summit",
      date: "2024-01-15",
      location: "New York",
      ticketsSold: 156,
      maxAttendees: 200,
      revenue: 15.6,
      status: "completed"
    }
  ];

  const myTickets: Ticket[] = [
    {
      id: "1",
      eventName: "ETH Global Hackathon",
      eventDate: "2024-03-01",
      location: "San Francisco",
      price: 0.15,
      status: "valid"
    },
    {
      id: "2",
      eventName: "Polygon zkDay",
      eventDate: "2024-02-20",
      location: "Virtual",
      price: 0.08,
      status: "valid"
    }
  ];

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 to-base-200">
        <div className="text-center">
          <div className="text-6xl mb-6">🔐</div>
          <h2 className="text-3xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-base-content/70 mb-8 max-w-md">
            Please connect your Web3 wallet to access your EventChain dashboard and manage your events.
          </p>
          <div className="bg-base-100 p-6 rounded-xl shadow-lg border border-base-300">
            <p className="text-sm text-base-content/60 mb-4">
              Connect with any supported wallet to get started
            </p>
          </div>
        </div>
      </div>
    );
  }

  const StatCard = ({ 
    title, 
    value, 
    trend, 
    icon, 
    color = "primary" 
  }: { 
    title: string; 
    value: string | number; 
    trend?: number; 
    icon: React.ReactNode; 
    color?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card bg-base-100 shadow-xl border border-base-300/50"
    >
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base-content/60 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {trend !== undefined && (
              <div className="flex items-center mt-2">
                {trend > 0 ? (
                  <ArrowTrendingUpIcon className="w-4 h-4 text-success mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="w-4 h-4 text-error mr-1" />
                )}
                <span className={`text-sm ${trend > 0 ? 'text-success' : 'text-error'}`}>
                  {Math.abs(trend)}% vs last month
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full bg-${color}/20 text-${color}`}>
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const QuickAction = ({ title, description, icon, href, color = "primary" }: {
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
    color?: string;
  }) => (
    <Link href={href} className="block">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300/50 hover:border-primary/30"
      >
        <div className="card-body p-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full bg-${color}/20 text-${color}`}>
              {icon}
            </div>
            <div>
              <h3 className="font-bold text-lg">{title}</h3>
              <p className="text-base-content/60 text-sm">{description}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome back! 👋
              </h1>
              <p className="text-xl opacity-90 mb-4">
                Manage your events and tickets on EventChain
              </p>
              <div className="flex items-center gap-2 text-sm opacity-75">
                <span>Connected as:</span>
                <Address address={address} />
              </div>
            </div>
            <div className="mt-6 md:mt-0">
              <Link href="/events/create" className="btn btn-accent btn-lg">
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Event
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Tabs */}
        <div className="tabs tabs-boxed bg-base-100 shadow-lg mb-8 p-1">
          {[
            { key: "overview", label: "Overview", icon: <ChartBarIcon className="w-4 h-4" /> },
            { key: "events", label: "My Events", icon: <CalendarDaysIcon className="w-4 h-4" /> },
            { key: "tickets", label: "My Tickets", icon: <TicketIcon className="w-4 h-4" /> },
            { key: "analytics", label: "Analytics", icon: <ChartBarIcon className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`tab tab-lg gap-2 ${activeTab === tab.key ? "tab-active" : ""}`}
              onClick={() => setActiveTab(tab.key as any)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Events"
                value={stats.totalEvents}
                trend={stats.trendEvents}
                icon={<CalendarDaysIcon className="w-6 h-6" />}
                color="primary"
              />
              <StatCard
                title="Tickets Sold"
                value={stats.totalTicketsSold.toLocaleString()}
                trend={12}
                icon={<TicketIcon className="w-6 h-6" />}
                color="secondary"
              />
              <StatCard
                title="Total Revenue"
                value={`${stats.totalRevenue} ETH`}
                trend={stats.trendRevenue}
                icon={<CurrencyDollarIcon className="w-6 h-6" />}
                color="success"
              />
              <StatCard
                title="Avg Rating"
                value={`${stats.averageRating} ⭐`}
                icon={<StarIcon className="w-6 h-6" />}
                color="warning"
              />
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <QuickAction
                  title="Create Event"
                  description="Host a new event on EventChain"
                  icon={<PlusIcon className="w-6 h-6" />}
                  href="/events/create"
                  color="primary"
                />
                <QuickAction
                  title="Explore Events"
                  description="Discover amazing events to attend"
                  icon={<EyeIcon className="w-6 h-6" />}
                  href="/events/explore"
                  color="secondary"
                />
                <QuickAction
                  title="Verify Ticket"
                  description="Verify ticket authenticity with ZK proofs"
                  icon={<TicketIcon className="w-6 h-6" />}
                  href="/tickets/verify"
                  color="accent"
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Events */}
              <div className="card bg-base-100 shadow-xl border border-base-300/50">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="card-title">Recent Events</h3>
                    <Link href="/events/my-events" className="btn btn-outline btn-sm">
                      View All
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {recentEvents.slice(0, 3).map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-base-200/50">
                        <div>
                          <p className="font-semibold">{event.name}</p>
                          <div className="flex items-center gap-4 text-sm text-base-content/60 mt-1">
                            <span className="flex items-center gap-1">
                              <ClockIcon className="w-3 h-3" />
                              {event.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPinIcon className="w-3 h-3" />
                              {event.location}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`badge ${
                            event.status === 'live' ? 'badge-error' :
                            event.status === 'upcoming' ? 'badge-primary' :
                            event.status === 'completed' ? 'badge-success' :
                            'badge-neutral'
                          }`}>
                            {event.status.toUpperCase()}
                          </div>
                          <p className="text-sm text-base-content/60 mt-1">
                            {event.ticketsSold}/{event.maxAttendees} tickets
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* My Tickets */}
              <div className="card bg-base-100 shadow-xl border border-base-300/50">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="card-title">My Tickets</h3>
                    <Link href="/tickets/my-tickets" className="btn btn-outline btn-sm">
                      View All
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {myTickets.map((ticket) => (
                      <div key={ticket.id} className="flex items-center justify-between p-3 rounded-lg bg-base-200/50">
                        <div>
                          <p className="font-semibold">{ticket.eventName}</p>
                          <div className="flex items-center gap-4 text-sm text-base-content/60 mt-1">
                            <span className="flex items-center gap-1">
                              <ClockIcon className="w-3 h-3" />
                              {ticket.eventDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPinIcon className="w-3 h-3" />
                              {ticket.location}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`badge ${
                            ticket.status === 'valid' ? 'badge-success' :
                            ticket.status === 'used' ? 'badge-neutral' :
                            'badge-error'
                          }`}>
                            {ticket.status.toUpperCase()}
                          </div>
                          <p className="text-sm text-base-content/60 mt-1">
                            {ticket.price} ETH
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">My Events</h2>
              <Link href="/events/create" className="btn btn-primary">
                <PlusIcon className="w-5 h-5 mr-2" />
                Create New Event
              </Link>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {recentEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="card bg-base-100 shadow-xl border border-base-300/50"
                >
                  <div className="card-body">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="card-title text-lg">{event.name}</h3>
                      <div className={`badge ${
                        event.status === 'live' ? 'badge-error' :
                        event.status === 'upcoming' ? 'badge-primary' :
                        event.status === 'completed' ? 'badge-success' :
                        'badge-neutral'
                      }`}>
                        {event.status.toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-base-content/70">
                        <ClockIcon className="w-4 h-4" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-base-content/70">
                        <MapPinIcon className="w-4 h-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-base-content/70">
                        <UsersIcon className="w-4 h-4" />
                        {event.ticketsSold}/{event.maxAttendees} tickets sold
                      </div>
                      <div className="flex items-center gap-2 text-sm text-base-content/70">
                        <CurrencyDollarIcon className="w-4 h-4" />
                        {event.revenue} ETH revenue
                      </div>
                    </div>
                    
                    <div className="card-actions justify-end">
                      <Link href={`/events/${event.id}/manage`} className="btn btn-outline btn-sm">
                        Manage
                      </Link>
                      <Link href={`/events/${event.id}/analytics`} className="btn btn-primary btn-sm">
                        Analytics
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === "tickets" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Tickets</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {myTickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="card bg-base-100 shadow-xl border border-base-300/50"
                >
                  <div className="card-body">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="card-title text-lg">{ticket.eventName}</h3>
                      <div className={`badge ${
                        ticket.status === 'valid' ? 'badge-success' :
                        ticket.status === 'used' ? 'badge-neutral' :
                        'badge-error'
                      }`}>
                        {ticket.status.toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-base-content/70">
                        <ClockIcon className="w-4 h-4" />
                        {ticket.eventDate}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-base-content/70">
                        <MapPinIcon className="w-4 h-4" />
                        {ticket.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-base-content/70">
                        <CurrencyDollarIcon className="w-4 h-4" />
                        {ticket.price} ETH
                      </div>
                    </div>
                    
                    <div className="card-actions justify-end">
                      <Link href={`/tickets/${ticket.id}`} className="btn btn-outline btn-sm">
                        View Details
                      </Link>
                      {ticket.status === 'valid' && (
                        <Link href={`/tickets/${ticket.id}/qr`} className="btn btn-primary btn-sm">
                          Show QR
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Analytics</h2>
            <div className="text-center py-20">
              <ChartBarIcon className="w-20 h-20 mx-auto text-base-content/30 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
              <p className="text-base-content/60 mb-6">
                Detailed analytics and insights for your events will be available here.
              </p>
              <div className="badge badge-primary">Coming Soon</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;