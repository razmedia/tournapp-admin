import React from 'react';
import Tabs from '../components/UI/Tabs';
import Table from '../components/UI/Table';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { mockFAQs } from '../data/mockData';

export default function Information() {
  const handleAction = (action: string, item: any) => {
    alert(`${action} action for: ${item.title || item.question}`);
  };

  const mockUserGuides = [
    {
      version: '1.0',
      title: 'Admin Guide',
      lastUpdated: '2025-06-15',
      status: 'published',
    },
  ];

  const userGuideTab = (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">User Guides</h2>
        <Button>Create Guide</Button>
      </div>
      <Card>
        <Table
          columns={[
            { header: 'Version', key: 'version' },
            { header: 'Title', key: 'title' },
            { header: 'Last Updated', key: 'lastUpdated' },
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
          data={mockUserGuides}
          actions={[
            { label: 'Update', action: 'update' },
            { label: 'Publish', action: 'publish' },
            { label: 'Delete', action: 'delete', variant: 'danger' as const },
            { label: 'Download (PDF)', action: 'downloadPdf' },
          ]}
          onAction={handleAction}
        />
      </Card>
    </div>
  );

  const faqTab = (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
        <Button>Add FAQ</Button>
      </div>
      <Card>
        <Table
          columns={[
            { header: 'Question', key: 'question' },
            { header: 'Category', key: 'category' },
            { header: 'Last Updated', key: 'lastUpdated' },
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
          data={mockFAQs}
          actions={[
            { label: 'Edit', action: 'edit' },
            { label: 'Delete', action: 'delete', variant: 'danger' as const },
          ]}
          onAction={handleAction}
        />
      </Card>
    </div>
  );

  const tabs = [
    { id: 'user-guide', label: 'User Guide', content: userGuideTab },
    { id: 'faq', label: 'FAQ', content: faqTab },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">Information</h1>
        <p className="text-gray-600">Manage user guides and frequently asked questions</p>
      </div>

      <Tabs tabs={tabs} />
    </div>
  );
}