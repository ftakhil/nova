import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Globe, MessageSquare, Video, Clock, Star, Filter } from 'lucide-react';
import { CurrentPage } from '../App';

interface UserConnectProps {
  onNavigate: (page: CurrentPage) => void;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  nativeLanguage: string;
  learningLanguage: string;
  level: string;
  rating: number;
  isOnline: boolean;
  interests: string[];
}

const UserConnect: React.FC<UserConnectProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'my-connections'>('browse');
  const [search, setSearch] = useState('');
  const [filterLang, setFilterLang] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'online'>('all');
  const [profileModal, setProfileModal] = useState<User | null>(null);
  const [messageModal, setMessageModal] = useState<User | null>(null);

  // Get user language preferences from localStorage
  const knownLang = localStorage.getItem('knownLang') || 'es';
  const learnLang = localStorage.getItem('learnLang') || 'en';

  const sampleUsers: User[] = [
    {
      id: '1',
      name: 'Maria Garcia',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      nativeLanguage: 'Spanish',
      learningLanguage: 'English',
      level: 'Intermediate',
      rating: 4.8,
      isOnline: true,
      interests: ['Travel', 'Culture', 'Music']
    },
    {
      id: '2',
      name: 'Jean-Pierre Dubois',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      nativeLanguage: 'French',
      learningLanguage: 'English',
      level: 'Advanced',
      rating: 4.9,
      isOnline: false,
      interests: ['Literature', 'History', 'Art']
    },
    {
      id: '3',
      name: 'Yuki Tanaka',
      avatar: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      nativeLanguage: 'Japanese',
      learningLanguage: 'English',
      level: 'Beginner',
      rating: 4.7,
      isOnline: true,
      interests: ['Technology', 'Anime', 'Food']
    },
    {
      id: '4',
      name: 'Klaus Weber',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      nativeLanguage: 'German',
      learningLanguage: 'English',
      level: 'Intermediate',
      rating: 4.6,
      isOnline: true,
      interests: ['Engineering', 'Music', 'Sports']
    }
  ];

  const [users] = useState<User[]>(sampleUsers);
  const [connections] = useState<User[]>([sampleUsers[0], sampleUsers[2]]);

  // Filtered users
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.nativeLanguage.toLowerCase().includes(search.toLowerCase()) ||
      user.learningLanguage.toLowerCase().includes(search.toLowerCase());
    const matchesLang = filterLang === 'all' || user.nativeLanguage === filterLang || user.learningLanguage === filterLang;
    const matchesStatus = filterStatus === 'all' || user.isOnline;
    return matchesSearch && matchesLang && matchesStatus;
  });

  // Highlight if user matches language preferences
  const isMatch = (user: User) =>
    user.nativeLanguage.toLowerCase() === learnLang.toLowerCase() &&
    user.learningLanguage.toLowerCase() === knownLang.toLowerCase();

  const startConversation = (user: User, type: 'text' | 'video') => {
    // Simulate starting a conversation
    alert(`Starting ${type} conversation with ${user.name}!`);
  };

  // Updated renderUserCard with highlight and profile modal
  const renderUserCard = (user: User, isConnection = false) => (
    <div
      key={user.id}
      className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 cursor-pointer ${isMatch(user) ? 'border-green-400 ring-2 ring-green-200' : 'border-gray-100'}`}
      onClick={() => setProfileModal(user)}
    >
      <div className="flex items-start space-x-4">
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover border-4 border-white shadow"
          />
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-gray-600">{user.rating}</span>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Globe className="w-4 h-4" />
              <span>Native: {user.nativeLanguage} • Learning: {user.learningLanguage}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.level === 'Beginner' ? 'bg-green-100 text-green-700' : user.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{user.level}</span>
              {user.isOnline && <span className="text-green-600 text-xs font-medium">Online</span>}
            </div>
          </div>
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{interest}</span>
              ))}
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={e => { e.stopPropagation(); setMessageModal(user); }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Message</span>
            </button>
            <button
              onClick={e => { e.stopPropagation(); startConversation(user, 'video'); }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <Video className="w-4 h-4" />
              <span>Video Call</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8e8ff] via-[#f3f8ff] to-[#ffe8f8] flex flex-col items-center justify-start p-4">
      <div className="max-w-4xl w-full bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 mt-16 border border-white/60 relative">
        {/* Back Button */}
        {onNavigate && (
          <button
            className="absolute -top-6 left-6 flex items-center text-indigo-600 hover:text-indigo-800 font-semibold focus:outline-none bg-white/80 backdrop-blur rounded-full px-4 py-2 shadow-md border border-indigo-100 transition-all hover:scale-105"
            onClick={() => onNavigate('dashboard')}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
        )}
        <div className="flex items-center space-x-4 mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-3 shadow-lg">
            <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M4 9v6a2 2 0 002 2h6a2 2 0 002-2V9a2 2 0 00-2-2H6a2 2 0 00-2 2z" /></svg>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">User Connect</h1>
            <p className="text-md text-gray-500 mt-1">Meet and practice with language learners</p>
          </div>
        </div>
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <input
            type="text"
            className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full md:w-1/3"
            placeholder="Search by name or language..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={filterLang}
            onChange={e => setFilterLang(e.target.value)}
          >
            <option value="all">All Languages</option>
            {[...new Set(users.flatMap(u => [u.nativeLanguage, u.learningLanguage]))].map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          <select
            className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as 'all' | 'online')}
          >
            <option value="all">All Status</option>
            <option value="online">Online Only</option>
          </select>
        </div>
        {/* User Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredUsers.map(user => renderUserCard(user))}
        </div>
        {/* Profile Modal */}
        {profileModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative border-4 border-indigo-300 flex flex-col items-center">
              <button className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold" onClick={() => setProfileModal(null)}>×</button>
              <img src={profileModal.avatar} alt={profileModal.name} className="w-24 h-24 rounded-full border-4 border-indigo-200 shadow mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-indigo-800">{profileModal.name}</h2>
              <div className="mb-2 text-gray-600">Native: {profileModal.nativeLanguage} • Learning: {profileModal.learningLanguage}</div>
              <div className="mb-2 text-gray-600">Level: {profileModal.level}</div>
              <div className="mb-2 text-gray-600">Rating: {profileModal.rating} ⭐</div>
              <div className="mb-4 flex flex-wrap gap-2">
                {profileModal.interests.map((interest, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{interest}</span>
                ))}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => { setMessageModal(profileModal); setProfileModal(null); }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Message</span>
                </button>
                <button
                  onClick={() => { startConversation(profileModal, 'video'); setProfileModal(null); }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  <Video className="w-4 h-4" />
                  <span>Video Call</span>
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Message Modal (scaffold) */}
        {messageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative border-4 border-blue-300 flex flex-col items-center">
              <button className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold" onClick={() => setMessageModal(null)}>×</button>
              <h2 className="text-2xl font-bold mb-4 text-blue-700">Message {messageModal.name}</h2>
              <div className="w-full h-40 bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-gray-400">(Chat UI coming soon)</div>
              <input className="w-full px-4 py-2 rounded-xl border border-gray-300 mb-2" placeholder="Type a message..." disabled />
              <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold shadow hover:bg-blue-700 mt-2" disabled>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserConnect;