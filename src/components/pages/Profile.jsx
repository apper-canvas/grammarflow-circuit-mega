import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import userService from '@/services/api/userService';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [preferences, setPreferences] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getProfile();
      setProfile(data);
      setFormData({
        name: data.name,
        email: data.email,
        currentLevel: data.currentLevel
      });
      setPreferences(data.preferences || {});
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await userService.updateProfile(formData);
      await userService.updatePreferences(preferences);
      
      setProfile(prev => ({ ...prev, ...formData, preferences }));
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (preference, value) => {
    setPreferences(prev => ({ ...prev, [preference]: value }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProfile} />;
  if (!profile) return <Error message="Profile not found" />;

  const achievements = [
    { id: 1, name: 'First Lesson', description: 'Completed your first lesson', icon: 'BookOpen', earned: true },
    { id: 2, name: 'Week Streak', description: 'Practiced for 7 days in a row', icon: 'Calendar', earned: true },
    { id: 3, name: 'Grammar Master', description: 'Achieved 90% accuracy', icon: 'Award', earned: false },
    { id: 4, name: 'Speed Learner', description: 'Completed 10 lessons in a week', icon: 'Zap', earned: false }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account and learning preferences</p>
        </div>
        <Button
          onClick={editing ? handleSaveProfile : () => setEditing(true)}
          disabled={saving}
          className="button-glow"
        >
          <ApperIcon name={editing ? "Save" : "Edit"} size={16} />
          {editing ? (saving ? 'Saving...' : 'Save Changes') : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl">
                  <ApperIcon name="User" size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                  <p className="text-gray-600">Update your personal details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  {editing ? (
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your name"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profile.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  {editing ? (
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profile.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Level</label>
                  {editing ? (
                    <select
                      value={formData.currentLevel}
                      onChange={(e) => handleInputChange('currentLevel', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  ) : (
                    <Badge variant="primary">{profile.currentLevel}</Badge>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                  <p className="text-gray-900 font-medium">{formatDate(profile.joinedDate)}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-accent-100 rounded-xl">
                  <ApperIcon name="Settings" size={24} className="text-accent-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Learning Preferences</h2>
                  <p className="text-gray-600">Customize your learning experience</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'notifications', label: 'Push Notifications', description: 'Receive notifications for lessons and reminders' },
                  { key: 'dailyReminders', label: 'Daily Reminders', description: 'Get reminded to practice daily' },
                  { key: 'soundEffects', label: 'Sound Effects', description: 'Play sounds for correct and incorrect answers' }
                ].map((pref) => (
                  <div key={pref.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{pref.label}</p>
                      <p className="text-sm text-gray-600">{pref.description}</p>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange(pref.key, !preferences[pref.key])}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences[pref.key] ? 'bg-primary-500' : 'bg-gray-200'
                      }`}
                      disabled={!editing}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences[pref.key] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Stats & Achievements */}
        <div className="space-y-6">
          {/* Learning Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Flame" size={20} className="text-accent-500" />
                    <span className="text-gray-700">Current Streak</span>
                  </div>
                  <Badge variant="accent">{profile.streak} days</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="BookOpen" size={20} className="text-primary-500" />
                    <span className="text-gray-700">Lessons Completed</span>
                  </div>
                  <Badge variant="primary">{profile.completedLessons?.length || 0}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Clock" size={20} className="text-success-500" />
                    <span className="text-gray-700">Total Practice Time</span>
                  </div>
                  <Badge variant="success">{profile.totalMinutes} min</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Target" size={20} className="text-secondary-500" />
                    <span className="text-gray-700">Average Accuracy</span>
                  </div>
                  <Badge variant="secondary">{profile.averageAccuracy}%</Badge>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      achievement.earned ? 'bg-success-50 border border-success-200' : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      achievement.earned ? 'bg-success-200' : 'bg-gray-200'
                    }`}>
                      <ApperIcon
                        name={achievement.icon}
                        size={16}
                        className={achievement.earned ? 'text-success-700' : 'text-gray-500'}
                      />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        achievement.earned ? 'text-success-900' : 'text-gray-500'
                      }`}>
                        {achievement.name}
                      </p>
                      <p className={`text-sm ${
                        achievement.earned ? 'text-success-700' : 'text-gray-400'
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.earned && (
                      <ApperIcon name="CheckCircle" size={20} className="text-success-500" />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;