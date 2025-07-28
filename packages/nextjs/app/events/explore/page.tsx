"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarDaysIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ClockIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

interface Event {
  id: string;
  eventId: string;
  organizer: string;
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
  ticketPrice: string;
  maxAttendees: string;
  ticketsSold?: string;
  category?: string;
  imageCID?: string;
  isOnline?: boolean;
  city?: string;
  country?: string;
  blockTimestamp: string;
}

interface EventsResponse {
  eventCreateds: Event[];
}

const query = gql`
  query GetEvents($first: Int, $category: String) {
    eventCreateds(
      first: $first
      orderBy: blockTimestamp
      orderDirection: desc
      where: { organizer_not: null }
    ) {
      id
      eventId
      organizer
      name
      startTime
      endTime
      ticketPrice
      maxAttendees
      blockTimestamp
    }
  }
`;

const url = "https://api.studio.thegraph.com/query/97295/zkonnect-polygon-amoy-1/version/latest";

const categories = [
  { value: "all", label: "All Events", color: "primary" },
  { value: "conference", label: "Conference", color: "secondary" },
  { value: "concert", label: "Concert", color: "accent" },
  { value: "sports", label: "Sports", color: "success" },
  { value: "workshop", label: "Workshop", color: "warning" },
  { value: "meetup", label: "Meetup", color: "info" },
  { value: "festival", label: "Festival", color: "error" },
];

const EventCard = ({ event }: { event: Event }) => {
  const [isLiked, setIsLiked] = useState(false);
  
  const startDate = new Date(parseInt(event.startTime) * 1000);
  const endDate = new Date(parseInt(event.endTime) * 1000);
  const priceInEth = parseFloat(event.ticketPrice) / 1e18;
  
  const isUpcoming = startDate > new Date();
  const isLive = new Date() >= startDate && new Date() <= endDate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-300/50 hover:border-primary/30 group"
    >
      <figure className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          {isLive ? (
            <div className="badge badge-error gap-2 text-white">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              LIVE
            </div>
          ) : isUpcoming ? (
            <div className="badge badge-primary">UPCOMING</div>
          ) : (
            <div className="badge badge-neutral">ENDED</div>
          )}
        </div>

        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 right-4 btn btn-circle btn-sm bg-base-100/80 hover:bg-base-100 border-none"
        >
          <HeartSolid className={`w-4 h-4 ${isLiked ? "text-error" : "text-base-content/50"}`} />
        </button>

        {/* Event Image Placeholder */}
        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10">
          <CalendarDaysIcon className="w-16 h-16 text-primary/50" />
        </div>
      </figure>

      <div className="card-body p-6">
        <div className="flex items-start justify-between mb-3">
          <h2 className="card-title text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
            {event.name}
          </h2>
          <div className="badge badge-outline text-xs">
            #{event.eventId}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-base-content/70">
            <ClockIcon className="w-4 h-4" />
            <span>{startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-base-content/70">
            <MapPinIcon className="w-4 h-4" />
            <span>Virtual Event</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-base-content/70">
            <UsersIcon className="w-4 h-4" />
            <span>{event.maxAttendees} max attendees</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CurrencyDollarIcon className="w-5 h-5 text-success" />
            <span className="text-lg font-bold text-success">
              {priceInEth.toFixed(4)} ETH
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <StarIcon className="w-4 h-4 text-warning fill-current" />
            <span className="text-sm font-medium">4.8</span>
            <span className="text-xs text-base-content/50">(24)</span>
          </div>
        </div>

        <div className="card-actions justify-between items-center">
          <div className="text-xs text-base-content/50">
            by {event.organizer.slice(0, 8)}...
          </div>
          
          <div className="flex gap-2">
            <Link href={`/events/${event.eventId}`} className="btn btn-outline btn-sm">
              View Details
            </Link>
            {isUpcoming && (
              <Link href={`/events/${event.eventId}/purchase`} className="btn btn-primary btn-sm">
                Buy Ticket
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ExploreEventsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, error } = useQuery<EventsResponse>({
    queryKey: ["events"],
    queryFn: async () => {
      try {
        return await request<EventsResponse>(url, query, { first: 50 });
      } catch (error) {
        console.error("GraphQL query error:", error);
        throw error;
      }
    },
  });

  const filteredEvents = useMemo(() => {
    if (!data?.eventCreateds) return [];

    return data.eventCreateds.filter((event) => {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || true; // Add category filtering logic
      const matchesPrice = priceRange === "all" || true; // Add price filtering logic

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [data?.eventCreateds, searchTerm, selectedCategory, priceRange]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😵</div>
          <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="text-base-content/70">Unable to load events. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing Events
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
              Explore the future of events on EventChain. From conferences to concerts, 
              find your next unforgettable experience.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-base-100 rounded-2xl shadow-xl p-6 mb-8 border border-base-300/50"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />
              <input
                type="text"
                placeholder="Search events..."
                className="input input-bordered w-full pl-10 pr-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`btn btn-sm ${
                    selectedCategory === category.value
                      ? `btn-${category.color}`
                      : "btn-outline"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline btn-square"
            >
              <FunnelIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t border-base-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">Price Range</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                  >
                    <option value="all">All Prices</option>
                    <option value="free">Free</option>
                    <option value="low">Under 0.1 ETH</option>
                    <option value="medium">0.1 - 1 ETH</option>
                    <option value="high">Over 1 ETH</option>
                  </select>
                </div>
                
                <div>
                  <label className="label">
                    <span className="label-text">Date</span>
                  </label>
                  <select className="select select-bordered w-full">
                    <option>Any Date</option>
                    <option>Today</option>
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>Next Month</option>
                  </select>
                </div>
                
                <div>
                  <label className="label">
                    <span className="label-text">Location</span>
                  </label>
                  <select className="select select-bordered w-full">
                    <option>All Locations</option>
                    <option>Virtual</option>
                    <option>In-Person</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-base-content/70">
            {isLoading ? "Loading..." : `${filteredEvents.length} events found`}
          </p>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-base-content/50">Sort by:</span>
            <select className="select select-bordered select-sm">
              <option>Latest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Most Popular</option>
              <option>Date: Soonest</option>
            </select>
          </div>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="card bg-base-200 shadow">
                  <div className="h-48 bg-base-300"></div>
                  <div className="card-body">
                    <div className="h-4 bg-base-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-base-300 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-base-300 rounded w-full mb-2"></div>
                    <div className="h-3 bg-base-300 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No events found</h3>
            <p className="text-base-content/70 mb-6">
              Try adjusting your search criteria or check back later for new events.
            </p>
            <Link href="/events/create" className="btn btn-primary">
              Create Your Own Event
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreEventsPage;