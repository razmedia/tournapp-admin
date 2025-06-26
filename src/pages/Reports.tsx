import React from 'react';
import Tabs from '../components/UI/Tabs';
import Table from '../components/UI/Table';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

export default function Reports() {
  const mockTournamentReports = [
    {
      id: 't1',
      name: 'Summer Open 2025',
      status: 'ongoing',
      generatedDate: '2025-06-15',
    },
  ];

  const mockUserActivityReports = [
    {
      id: 'u1',
      email: 'john@example.com',
      lastActivity: '2025-06-19 09:00',
      actionType: 'login',
      role: 'Player',
    },
    {
      id: 'u2',
      email: 'jane@example.com',
      lastActivity: '2025-06-18 14:00',
      actionType: 'sign-up',
      role: 'Coach',
    },
  ];

  const handleAction = (action: string, item: any) => {
    if (action === 'downloadExcel') {
      alert(`Downloading Excel report for: ${item.name || item.email}`);
    } else {
      alert(`${action} action for: ${item.name || item.email}`);
    }
  };

  const tournamentReportsTab = (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Tournament Reports</h2>
      <Card>
        <Table
          columns={[
            { header: 'Tournament ID', key: 'id' },
            { header: 'Name', key: 'name' },
            { 
              header: 'Status', 
              key: 'status',
              render: (value: string) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  value === 'ongoing' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {value}
                </span>
              )
            },
            { header: 'Generated Date', key: 'generatedDate' },
          ]}
          data={mockTournamentReports}
          actions={[
            { label: 'Download (Excel)', action: 'downloadExcel' },
          ]}
          onAction={handleAction}
        />
      </Card>

      <Card title="Generate Report">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
            <select className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
              <option value="all">All</option>
              <option value="create">Create</option>
              <option value="sign up">Sign Up</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <Button>Generate Report</Button>
        </div>
      </Card>
    </div>
  );

  const userActivityReportsTab = (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">User Activity Reports</h2>
      <Card>
        <Table
          columns={[
            { header: 'User ID', key: 'id' },
            { header: 'Email', key: 'email' },
            { header: 'Last Activity', key: 'lastActivity' },
            { header: 'Action Type', key: 'actionType' },
            { header: 'Role', key: 'role' },
          ]}
          data={mockUserActivityReports}
          actions={[
            { label: 'Download (Excel)', action: 'downloadExcel' },
          ]}
          onAction={handleAction}
        />
      </Card>

      <Card title="Generate Report">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role Filter</label>
            <select className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
              <option value="all">All</option>
              <option value="admin">Admin</option>
              <option value="player">Player</option>
              <option value="coach">Coach</option>
              <option value="referee">Referee</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <Button>Generate Report</Button>
        </div>
      </Card>
    </div>
  );

  const tabs = [
    { id: 'tournament', label: 'Tournament Reports', content: tournamentReportsTab },
    { id: 'user-activity', label: 'User Activity Reports', content: userActivityReportsTab },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">Reports</h1>
        <p className="text-gray-600">Generate and download system reports</p>
      </div>

      <Tabs tabs={tabs} />
    </div>
  );
}