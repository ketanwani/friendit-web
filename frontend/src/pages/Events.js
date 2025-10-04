import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import EventCard from '../components/EventCard';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: ''
  });
  const searchTimeoutRef = useRef(null);
  const hasInitialized = useRef(false);

  const fetchEvents = async (searchTerm = '', category = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (category) params.append('category', category);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await api.get(`/events/?${params.toString()}`);
      setEvents(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load only
  useEffect(() => {
    if (!hasInitialized.current) {
      fetchEvents();
      hasInitialized.current = true;
    }
  }, []);

  // Handle search with debouncing - completely separate from component lifecycle
  const handleSearch = useCallback((searchTerm, category) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      fetchEvents(searchTerm, category);
    }, 300);
  }, []);

  const handleFilterChange = useCallback((e) => {
    const newFilters = {
      ...filters,
      [e.target.name]: e.target.value
    };
    setFilters(newFilters);
    
    // Trigger search with new values
    handleSearch(newFilters.search, newFilters.category);
  }, [filters, handleSearch]);

  const clearFilters = useCallback(() => {
    const newFilters = {
      category: '',
      search: ''
    };
    setFilters(newFilters);
    
    // Trigger search with cleared values
    handleSearch('', '');
  }, [handleSearch]);

  const categories = useMemo(() => [
    { value: '', label: 'All Categories' },
    { value: 'tech', label: 'Technology' },
    { value: 'business', label: 'Business' },
    { value: 'social', label: 'Social' },
    { value: 'education', label: 'Education' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'arts', label: 'Arts & Culture' },
    { value: 'sports', label: 'Sports & Fitness' },
    { value: 'food', label: 'Food & Drink' },
    { value: 'travel', label: 'Travel' },
    { value: 'other', label: 'Other' }
  ], []);

  // Memoized search input component
  const SearchInput = useMemo(() => (
    <input
      type="text"
      id="search"
      name="search"
      value={filters.search}
      onChange={handleFilterChange}
      placeholder="Search events..."
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
    />
  ), [filters.search, handleFilterChange]);

  // Memoized category select component
  const CategorySelect = useMemo(() => (
    <select
      id="category"
      name="category"
      value={filters.category}
      onChange={handleFilterChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
    >
      {categories.map(category => (
        <option key={category.value} value={category.value}>
          {category.label}
        </option>
      ))}
    </select>
  ), [filters.category, handleFilterChange, categories]);

  // Memoized events grid component
  const EventsGrid = useMemo(() => {
    if (events.length === 0) {
      return (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters or create a new event.
          </p>
          <div className="mt-6">
            <Link
              to="/create-event"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Create Event
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    );
  }, [events]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h1>
          <p className="text-gray-600">
            Discover amazing events happening today and in the future. Connect with like-minded people and join exciting activities.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              {SearchInput}
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              {CategorySelect}
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Events Grid */}
        {EventsGrid}
      </div>
    </div>
  );
};

export default Events;