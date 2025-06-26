import React from 'react';
import Tabs from '../components/UI/Tabs';
import Table from '../components/UI/Table';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

export default function Publishing() {
  const mockPublications = [
    {
      id: 't1',
      name: 'Summer Open 2025',
      publicationDate: '2025-06-10',
      status: 'published',
    },
  ];

  const handleAction = (action: string, item: any) => {
    alert(`${action} action for: ${item.name}`);
  };

  const drawsPublicationTab = (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Draws Publication</h2>
      <Card>
        <Table
          columns={[
            { header: 'Tournament ID', key: 'id' },
            { header: 'Name', key: 'name' },
            { header: 'Publication Date', key: 'publicationDate' },
            { 
              header: 'Status', 
              key: 'status',
              render: (value: string) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  value === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {value}
                </span>
              )
            },
          ]}
          data={mockPublications}
          actions={[
            { label: 'Publish', action: 'publish' },
            { label: 'Retract', action: 'retract', variant: 'danger' as const },
          ]}
          onAction={handleAction}
        />
      </Card>

      <Card title="Publish Draws">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tournament ID</label>
            <select className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
              <option value="t1">t1 - Summer Open 2025</option>
              <option value="t2">t2 - Winter League</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Draw Data</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Enter draw data..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Publication Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <Button>Save & Publish</Button>
        </div>
      </Card>
    </div>
  );

  const timesPublicationTab = (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Times Publication</h2>
      <Card>
        <Table
          columns={[
            { header: 'Tournament ID', key: 'id' },
            { header: 'Name', key: 'name' },
            { header: 'Publication Date', key: 'publicationDate' },
            { 
              header: 'Status', 
              key: 'status',
              render: (value: string) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  value === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {value}
                </span>
              )
            },
          ]}
          data={mockPublications}
          actions={[
            { label: 'Publish', action: 'publish' },
            { label: 'Update', action: 'update' },
          ]}
          onAction={handleAction}
        />
      </Card>
    </div>
  );

  const resultsPublicationTab = (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Results Publication</h2>
      <Card>
        <Table
          columns={[
            { header: 'Match ID', key: 'id' },
            { header: 'Tournament Name', key: 'name' },
            { header: 'Publication Date', key: 'publicationDate' },
            { 
              header: 'Status', 
              key: 'status',
              render: (value: string) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  value === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {value}
                </span>
              )
            },
          ]}
          data={[{...mockPublications[0], id: 'm1'}]}
          actions={[
            { label: 'Publish', action: 'publish' },
            { label: 'Retract', action: 'retract', variant: 'danger' as const },
          ]}
          onAction={handleAction}
        />
      </Card>
    </div>
  );

  const tabs = [
    { id: 'draws', label: 'Draws Publication', content: drawsPublicationTab },
    { id: 'times', label: 'Times Publication', content: timesPublicationTab },
    { id: 'results', label: 'Results Publication', content: resultsPublicationTab },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">Publishing</h1>
        <p className="text-gray-600">Publish draws, schedules, and results</p>
      </div>

      <Tabs tabs={tabs} />
    </div>
  );
}