import React, { useState } from 'react';
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
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

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

  const startConversation = (user: User, type: 'text' | 'video') => {
    // Simulate starting a conversation
    alert(`Starting ${type} conversation with ${user.name}!`);
  };

  const renderUserCard = (user: User, isConnection = false) => (
    <div key={user.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex items-start space-x-4">
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
            user.isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}></div>
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
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                user.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {user.level}
              </span>
              {user.isOnline && <span className="text-green-600 text-xs font-medium">Online</span>}
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {interest}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => startConversation(user, 'text')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Message</span>
            </button>
            
            <button
              onClick={() => startConversation(user, 'video')}
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('dashboard')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full p-2">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Connect with Users</h1>
                  <p className="text-sm text-gray-600">Join our global learning community</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'browse'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Browse Users
          </button>
          <button
            onClick={() => setActiveTab('my-connections')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'my-connections'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            My Connections ({connections.length})
          </button>
        </div>

        {activeTab === 'browse' && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Languages</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                    <option value="japanese">Japanese</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="all">All Users</option>
                    <option value="online">Online Only</option>
                  </select>
                </div>
              </div>
            </div>

            {/* User Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {users.map(user => renderUserCard(user))}
            </div>
          </>
        )}

        {activeTab === 'my-connections' && (
          <div className="space-y-6">
            {connections.length > 0 ? (
              <>
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <Clock className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-700">
                        You had a 30-minute conversation with Maria Garcia yesterday
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-700">
                        Yuki Tanaka sent you a message 2 hours ago
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-6">
                  {connections.map(user => renderUserCard(user, true))}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No connections yet</h3>
                <p className="text-gray-600 mb-6">
                  Start by browsing users and making your first connection!
                </p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-300"
                >
                  Browse Users
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserConnect;