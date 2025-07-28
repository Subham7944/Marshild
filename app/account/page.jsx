"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Key, 
  Bell, 
  Shield, 
  Download, 
  Trash2, 
  Eye, 
  EyeOff, 
  Save, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Copy,
  ExternalLink
} from 'lucide-react';

export default function AccountSettingsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  
  // Profile settings state
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    role: '',
    industry: '',
    location: '',
    bio: ''
  });

  // API Keys state
  const [apiKeys, setApiKeys] = useState({
    googleNews: '',
    eventRegistry: '',
    crunchbase: '',
    twitter: '',
    rapidApi: ''
  });
  const [showApiKeys, setShowApiKeys] = useState({});

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    marketingEmails: false,
    analysisComplete: true,
    weeklyDigest: true,
    securityAlerts: true
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'private',
    dataSharing: false,
    analyticsTracking: true,
    thirdPartyIntegrations: false
  });

  useEffect(() => {
    if (isLoaded && user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.primaryEmailAddress?.emailAddress || '',
        company: user.publicMetadata?.company || '',
        role: user.publicMetadata?.role || '',
        industry: user.publicMetadata?.industry || '',
        location: user.publicMetadata?.location || '',
        bio: user.publicMetadata?.bio || ''
      });

      // Load saved preferences from localStorage
      const savedNotifications = localStorage.getItem('marshild_notifications');
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }

      const savedPrivacy = localStorage.getItem('marshild_privacy');
      if (savedPrivacy) {
        setPrivacy(JSON.parse(savedPrivacy));
      }

      const savedApiKeys = localStorage.getItem('marshild_api_keys');
      if (savedApiKeys) {
        setApiKeys(JSON.parse(savedApiKeys));
      }
    }
  }, [isLoaded, user]);

  const showMessage = (type, content) => {
    setMessage({ type, content });
    setTimeout(() => setMessage({ type: '', content: '' }), 5000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await user.update({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        publicMetadata: {
          ...user.publicMetadata,
          company: profileData.company,
          role: profileData.role,
          industry: profileData.industry,
          location: profileData.location,
          bio: profileData.bio
        }
      });

      showMessage('success', 'Profile updated successfully!');
    } catch (error) {
      showMessage('error', 'Failed to update profile: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeysSave = () => {
    localStorage.setItem('marshild_api_keys', JSON.stringify(apiKeys));
    showMessage('success', 'API keys saved successfully!');
  };

  const handleNotificationsSave = () => {
    localStorage.setItem('marshild_notifications', JSON.stringify(notifications));
    showMessage('success', 'Notification preferences saved!');
  };

  const handlePrivacySave = () => {
    localStorage.setItem('marshild_privacy', JSON.stringify(privacy));
    showMessage('success', 'Privacy settings saved!');
  };

  const toggleApiKeyVisibility = (keyName) => {
    setShowApiKeys(prev => ({
      ...prev,
      [keyName]: !prev[keyName]
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showMessage('success', 'Copied to clipboard!');
  };

  const handleExportData = () => {
    const exportData = {
      profile: profileData,
      notifications,
      privacy,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marshild-account-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showMessage('success', 'Account data exported successfully!');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      const confirmation = window.prompt('Type "DELETE" to confirm account deletion:');
      if (confirmation === 'DELETE') {
        try {
          await user.delete();
          router.push('/');
        } catch (error) {
          showMessage('error', 'Failed to delete account: ' + error.message);
        }
      }
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'apikeys', label: 'API Keys', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield }
  ];

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/sign-in');
    return null;
  }

  return (
    <div className="space-y-6 pt-16 md:pt-10">
      {/* Header */}
      <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-1">⚙️ Account Settings</h1>
        <p className="opacity-90">Manage your profile, preferences, and account security</p>
      </div>

      {/* Message Display */}
      {message.content && (
        <div className={`p-4 rounded-md border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
            {message.content}
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Profile Information</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed here. Use Clerk's user profile.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Company</label>
                    <input
                      type="text"
                      value={profileData.company}
                      onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Role</label>
                    <select
                      value={profileData.role}
                      onChange={(e) => setProfileData(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                    >
                      <option value="">Select Role</option>
                      <option value="founder">Founder</option>
                      <option value="entrepreneur">Entrepreneur</option>
                      <option value="investor">Investor</option>
                      <option value="consultant">Consultant</option>
                      <option value="student">Student</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Industry</label>
                    <select
                      value={profileData.industry}
                      onChange={(e) => setProfileData(prev => ({ ...prev, industry: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                    >
                      <option value="">Select Industry</option>
                      <option value="fintech">FinTech</option>
                      <option value="healthtech">HealthTech</option>
                      <option value="edtech">EdTech</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="saas">SaaS</option>
                      <option value="ai">AI/ML</option>
                      <option value="blockchain">Blockchain</option>
                      <option value="iot">IoT</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g., San Francisco, CA"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    rows="3"
                    placeholder="Tell us about yourself and your entrepreneurial journey..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? 'Saving...' : 'Save Profile'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* API Keys Tab */}
        {activeTab === 'apikeys' && (
          <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">API Keys Management</h2>
              <p className="text-sm text-gray-600 mb-6">
                Configure your API keys to enable advanced features. Keys are stored locally in your browser.
              </p>

              <div className="space-y-4">
                {[
                  { key: 'googleNews', label: 'Google News API Key', placeholder: 'your-google-news-key', description: 'For industry news analysis' },
                  { key: 'eventRegistry', label: 'Event Registry API Key', placeholder: 'your-event-registry-key', description: 'Alternative news source' },
                  { key: 'crunchbase', label: 'Crunchbase API Key', placeholder: 'your-crunchbase-key', description: 'For competitor and funding data' },
                  { key: 'twitter', label: 'Twitter Bearer Token', placeholder: 'your-twitter-bearer-token', description: 'For social media sentiment analysis' },
                  { key: 'rapidApi', label: 'RapidAPI Key', placeholder: 'your-rapidapi-key', description: 'For additional data sources' }
                ].map(({ key, label, placeholder, description }) => (
                  <div key={key} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium">{label}</label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleApiKeyVisibility(key)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {showApiKeys[key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        {apiKeys[key] && (
                          <button
                            type="button"
                            onClick={() => copyToClipboard(apiKeys[key])}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <input
                      type={showApiKeys[key] ? 'text' : 'password'}
                      value={apiKeys[key]}
                      onChange={(e) => setApiKeys(prev => ({ ...prev, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                    />
                    <p className="text-xs text-gray-500 mt-1">{description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-4">
                <button
                  onClick={handleApiKeysSave}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  Save API Keys
                </button>

              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { key: 'emailUpdates', label: 'Email Updates', description: 'Receive updates about new features and improvements' },
                  { key: 'marketingEmails', label: 'Marketing Emails', description: 'Promotional content and special offers' },
                  { key: 'analysisComplete', label: 'Analysis Complete', description: 'Notifications when your analysis is ready' },
                  { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Summary of your startup validation activities' },
                  { key: 'securityAlerts', label: 'Security Alerts', description: 'Important security and account notifications' }
                ].map(({ key, label, description }) => (
                  <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{label}</div>
                      <div className="text-sm text-gray-600">{description}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications[key]}
                        onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>

              <button
                onClick={handleNotificationsSave}
                className="mt-6 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* Privacy & Security Tab */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Privacy Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Profile Visibility</div>
                      <div className="text-sm text-gray-600">Control who can see your profile information</div>
                    </div>
                    <select
                      value={privacy.profileVisibility}
                      onChange={(e) => setPrivacy(prev => ({ ...prev, profileVisibility: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                    >
                      <option value="private">Private</option>
                      <option value="public">Public</option>
                      <option value="contacts">Contacts Only</option>
                    </select>
                  </div>

                  {[
                    { key: 'dataSharing', label: 'Data Sharing', description: 'Allow sharing anonymized data for research purposes' },
                    { key: 'analyticsTracking', label: 'Analytics Tracking', description: 'Help improve our service with usage analytics' },
                    { key: 'thirdPartyIntegrations', label: 'Third-party Integrations', description: 'Allow integration with external services' }
                  ].map(({ key, label, description }) => (
                    <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{label}</div>
                        <div className="text-sm text-gray-600">{description}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacy[key]}
                          onChange={(e) => setPrivacy(prev => ({ ...prev, [key]: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handlePrivacySave}
                  className="mt-6 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  Save Privacy Settings
                </button>
              </div>
            </div>

            <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Data Management</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Export Account Data</div>
                      <div className="text-sm text-gray-600">Download all your account data and settings</div>
                    </div>
                    <button
                      onClick={handleExportData}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Export Data
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                    <div>
                      <div className="font-medium text-red-800">Delete Account</div>
                      <div className="text-sm text-red-600">Permanently delete your account and all associated data</div>
                    </div>
                    <button
                      onClick={handleDeleteAccount}
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Back to Dashboard Button */}
      <div className="flex justify-center">
        <button 
          onClick={() => router.push('/dashboard')}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
