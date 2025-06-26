import React from 'react';
import Tabs from '../components/UI/Tabs';
import Table from '../components/UI/Table';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { mockCampaigns } from '../data/mockData';

export default function Advertising() {
  const handleAction = (action: string, campaign: any) => {
    alert(`${action} action for campaign: ${campaign.name}`);
  };

  const adCampaignsTab = (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Ad Campaigns</h2>
        <Button>Create Campaign</Button>
      </div>
      <Card>
        <Table
          columns={[
            { header: 'Campaign ID', key: 'id' },
            { header: 'Name', key: 'name' },
            { header: 'Target Audience', key: 'targetAudience' },
            { header: 'Start Date', key: 'startDate' },
            { header: 'End Date', key: 'endDate' },
            { 
              header: 'Status', 
              key: 'status',
              render: (value: string) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {value}
                </span>
              )
            },
          ]}
          data={mockCampaigns}
          actions={[
            { label: 'Edit', action: 'edit' },
            { label: 'Delete', action: 'delete', variant: 'danger' as const },
          ]}
          onAction={handleAction}
        />
      </Card>

      <Card title="Create/Edit Ad Campaign">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Campaign name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
              <select className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                <option value="all">All</option>
                <option value="country">Country</option>
                <option value="role">Role</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
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
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Banner</label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <Button>Save Campaign</Button>
        </div>
      </Card>
    </div>
  );

  const adAnalyticsTab = (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Ad Analytics</h2>
      <Card>
        <Table
          columns={[
            { header: 'Campaign ID', key: 'id' },
            { header: 'Name', key: 'name' },
            { header: 'Clicks', key: 'clicks' },
            { header: 'Impressions', key: 'impressions' },
            { header: 'CTR', 
              key: 'ctr',
              render: (_, row) => {
                const ctr = row.clicks && row.impressions ? 
                  ((row.clicks / row.impressions) * 100).toFixed(2) + '%' : 'N/A';
                return <span>{ctr}</span>;
              }
            },
            { header: 'Last Updated', key: 'lastUpdated' },
          ]}
          data={mockCampaigns.filter(c => c.clicks !== undefined)}
          actions={[
            { label: 'Generate Report', action: 'generateReport' },
          ]}
          onAction={handleAction}
        />
      </Card>

      <Card title="Filter Analytics">
        <div className="grid grid-cols-2 gap-4">
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
        </div>
        <div className="mt-4">
          <Button>Filter Results</Button>
        </div>
      </Card>
    </div>
  );

  const tabs = [
    { id: 'campaigns', label: 'Ad Campaigns', content: adCampaignsTab },
    { id: 'analytics', label: 'Ad Analytics', content: adAnalyticsTab },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">Advertising</h1>
        <p className="text-gray-600">Manage advertising campaigns and analytics</p>
      </div>

      <Tabs tabs={tabs} />
    </div>
  );
}