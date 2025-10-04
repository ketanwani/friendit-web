import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const [userEvents, setUserEvents] = useState([]);
  const [attendingEvents, setAttendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hosted');

  useEffect(() => {
    fetchUserEvents();
  }, []);

  const fetchUserEvents = async () => {
    try {
      setLoading(true);
      const [hostedResponse, attendingResponse] = await Promise.all([
        api.get('/events/?host=' + user.id),
        api.get('/events/')
      ]);
      
      setUserEvents(hostedResponse.data.results || hostedResponse.data);
      
      // Filter events where user is attending
      const allEvents = attendingResponse.data.results || attendingResponse.data;
      const attending = allEvents.filter(event => 
        event.attendees.some(attendee => attendee.id === user.id)
      );
      setAttendingEvents(attending);
    } catch (error) {
      console.error('Error fetching user events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      tech: 'bg-blue-100 text-blue-800',
      business: 'bg-green-100 text-green-800',
      social: 'bg-purple-100 text-purple-800',
      education: 'bg-yellow-100 text-yellow-800',
      health: 'bg-red-100 text-red-800',
      arts: 'bg-pink-100 text-pink-800',
      sports: 'bg-orange-100 text-orange-800',
      food: 'bg-indigo-100 text-indigo-800',
      travel: 'bg-teal-100 text-teal-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
  };

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
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-bold text-2xl">
                {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {user?.first_name} {user?.last_name}
              </h1>
              <p className="text-gray-600">@{user?.username}</p>
              <p className="text-gray-500">{user?.email}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Events Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('hosted')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'hosted'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Hosted Events ({userEvents.length})
              </button>
              <button
                onClick={() => setActiveTab('attending')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'attending'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Attending Events ({attendingEvents.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'hosted' ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Events You're Hosting</h2>
                  <a
                    href="/create-event"
                    className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
                  >
                    Create New Event
                  </a>
                </div>
                
                {userEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hosted events</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You haven't created any events yet.
                    </p>
                    <div className="mt-6">
                      <a
                        href="/create-event"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                      >
                        Create Your First Event
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userEvents.map(event => (
                      <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900 line-clamp-2">{event.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                            {event.category}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
                        <div className="space-y-1 text-sm text-gray-500">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(event.date_time)}
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {event.location}
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                            {event.attendee_count} attending
                          </div>
                        </div>
                        <div className="mt-4">
                          <a
                            href={`/events/${event.id}`}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            View Details →
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Events You're Attending</h2>
                
                {attendingEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No attending events</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You're not attending any events yet.
                    </p>
                    <div className="mt-6">
                      <a
                        href="/events"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                      >
                        Browse Events
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {attendingEvents.map(event => (
                      <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900 line-clamp-2">{event.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                            {event.category}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
                        <div className="space-y-1 text-sm text-gray-500">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(event.date_time)}
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {event.location}
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                            {event.attendee_count} attending
                          </div>
                        </div>
                        <div className="mt-4">
                          <a
                            href={`/events/${event.id}`}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            View Details →
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
