import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const EventDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchEvent = useCallback(async () => {
    try {
      const response = await api.get(`/events/${id}/`);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event:', error);
      navigate('/events');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await api.get(`/events/${id}/comments/`);
      // Ensure we always set an array
      const commentsData = Array.isArray(response.data) ? response.data : [];
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
    fetchComments();
  }, [fetchEvent, fetchComments]);

  const handleJoinEvent = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setJoining(true);
      await api.post(`/events/${id}/join/`);
      fetchEvent(); // Refresh event data
    } catch (error) {
      console.error('Error joining event:', error);
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveEvent = async () => {
    try {
      setJoining(true);
      await api.post(`/events/${id}/leave/`);
      fetchEvent(); // Refresh event data
    } catch (error) {
      console.error('Error leaving event:', error);
    } finally {
      setJoining(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      await api.post(`/events/${id}/comments/`, { text: newComment });
      setNewComment('');
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  const isAttending = event && user && event.attendees.some(attendee => attendee.id === user.id);
  const isHost = event && user && event.host.id === user.id;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h1>
          <button
            onClick={() => navigate('/events')}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Event Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(event.category)}`}>
                  {event.category}
                </span>
                <span className="text-sm text-gray-500">
                  {event.attendee_count} attending
                  {event.max_attendees && ` / ${event.max_attendees} max`}
                </span>
              </div>
            </div>
            {isAuthenticated && !isHost && (
              <div className="ml-4">
                {isAttending ? (
                  <button
                    onClick={handleLeaveEvent}
                    disabled={joining}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    {joining ? 'Leaving...' : 'Leave Event'}
                  </button>
                ) : (
                  <button
                    onClick={handleJoinEvent}
                    disabled={joining || event.is_full}
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
                  >
                    {joining ? 'Joining...' : event.is_full ? 'Event Full' : 'Join Event'}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Event Details</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(event.date_time)}
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Hosted by {event.host.first_name} {event.host.last_name}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{event.description}</p>
            </div>
          </div>
        </div>

        {/* Attendees */}
        {event.attendees.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendees ({event.attendee_count})</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {event.attendees.map(attendee => (
                <div key={attendee.id} className="text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary-600 font-semibold">
                      {attendee.first_name.charAt(0)}{attendee.last_name.charAt(0)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{attendee.first_name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments ({Array.isArray(comments) ? comments.length : 0})</h3>
          
          {isAuthenticated && (
            <form onSubmit={handleSubmitComment} className="mb-6">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  type="submit"
                  disabled={submittingComment || !newComment.trim()}
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  {submittingComment ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          )}

          {(!comments || !Array.isArray(comments) || comments.length === 0) ? (
            <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
          ) : (
            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-primary-600 font-semibold text-sm">
                        {comment.user.first_name.charAt(0)}{comment.user.last_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {comment.user.first_name} {comment.user.last_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 ml-11">{comment.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
