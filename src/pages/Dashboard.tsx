import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import StatCard from '../components/UI/StatCard';
import Card from '../components/UI/Card';
import { mockStats, userGrowthData, tournamentActivityData } from '../data/mockData';
import { Users, Trophy, Building, Award, TrendingUp, Activity } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const chartData = userGrowthData.labels.map((label, index) => ({
    day: label,
    users: userGrowthData.datasets[0].data[index],
  }));

  const pieData = tournamentActivityData.labels.map((label, index) => ({
    name: label,
    value: tournamentActivityData.datasets[0].data[index],
  }));

  const iconMap = {
    'Total Users': { icon: <Users className="h-6 w-6" />, color: 'blue' as const },
    'Active Organizations': { icon: <Building className="h-6 w-6" />, color: 'green' as const },
    'Ongoing Tournaments': { icon: <Trophy className="h-6 w-6" />, color: 'yellow' as const },
    'Active Clubs': { icon: <Building className="h-6 w-6" />, color: 'purple' as const },
    'Total Players': { icon: <Users className="h-6 w-6" />, color: 'blue' as const },
  };

  const recentActivities = [
    {
      id: 1,
      type: 'user_registered',
      message: 'New user registered: john@example.com',
      time: '2 hours ago',
      color: 'success'
    },
    {
      id: 2,
      type: 'tournament_updated',
      message: 'Tournament "Summer Open 2025" status updated to ongoing',
      time: '4 hours ago',
      color: 'blue'
    },
    {
      id: 3,
      type: 'organization_created',
      message: 'New organization "City Sports" created',
      time: '1 day ago',
      color: 'warning'
    },
    {
      id: 4,
      type: 'match_completed',
      message: 'Match completed: John Doe vs Jane Smith',
      time: '2 days ago',
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary mt-1">Welcome back, Harry! Here's what's happening with your tournaments.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-text-muted">
          <Activity className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {mockStats.slice(0, 5).map((stat, index) => {
          const iconData = iconMap[stat.label as keyof typeof iconMap];
          return (
            <StatCard
              key={index}
              label={stat.label}
              value={stat.value}
              icon={iconData?.icon}
              color={iconData?.color}
              trend={{
                value: Math.floor(Math.random() * 20) + 1,
                isPositive: Math.random() > 0.5
              }}
            />
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card 
          title="User Growth Trend" 
          subtitle="New user registrations over the last 30 days"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="day" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card 
          title="Tournament Activity" 
          subtitle="Distribution of tournament statuses"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card title="Recent Activity" subtitle="Latest system activities and updates">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.color === 'success' ? 'bg-success-500' :
                    activity.color === 'blue' ? 'bg-primary-500' :
                    activity.color === 'warning' ? 'bg-warning-500' :
                    'bg-purple-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary font-medium">{activity.message}</p>
                    <p className="text-xs text-text-muted mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card title="System Health" subtitle="Current system status">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">Server Status</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                  Online
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">Database</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                  Connected
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">Uptime</span>
                <span className="text-sm font-semibold text-text-primary">99.9%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">Active Sessions</span>
                <span className="text-sm font-semibold text-text-primary">24</span>
              </div>
            </div>
          </Card>

          <Card title="Quick Actions">
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm text-text-primary">Create Tournament</div>
                <div className="text-xs text-text-muted">Start a new tournament</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm text-text-primary">Add User</div>
                <div className="text-xs text-text-muted">Register new user</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm text-text-primary">Generate Report</div>
                <div className="text-xs text-text-muted">Create system report</div>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}