import React from 'react';
import Tabs from '../components/UI/Tabs';
import Table from '../components/UI/Table';
import Card from '../components/UI/Card';

export default function Ranking() {
  const mockRankingOverview = [
    {
      orgId: 'o1',
      orgName: 'Tennis Federation',
      tourId: 't1',
      tourName: 'Summer Open 2025',
      totalPlayers: 50,
      topRank: 1,
    },
  ];

  const mockPlayerRankings = [
    {
      id: 'u1',
      firstName: 'John',
      lastName: 'Doe',
      rank: 1,
      points: 1000,
      lastUpdated: '2025-06-19',
    },
    {
      id: 'u2',
      firstName: 'Jane',
      lastName: 'Smith',
      rank: 2,
      points: 800,
      lastUpdated: '2025-06-18',
    },
  ];

  const handleAction = (action: string, item: any) => {
    alert(`${action} action for player: ${item.firstName} ${item.lastName}`);
  };

  const rankingOverviewTab = (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Ranking Overview</h2>
      <Card>
        <Table
          columns={[
            { header: 'Organization ID', key: 'orgId' },
            { header: 'Organization Name', key: 'orgName' },
            { header: 'Tournament ID', key: 'tourId' },
            { header: 'Tournament Name', key: 'tourName' },
            { header: 'Total Players', key: 'totalPlayers' },
            { header: 'Top Rank', key: 'topRank' },
          ]}
          data={mockRankingOverview}
        />
      </Card>
    </div>
  );

  const playerRankingsTab = (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Player Rankings</h2>
      <Card>
        <Table
          columns={[
            { header: 'Player ID', key: 'id' },
            { header: 'First Name', key: 'firstName' },
            { header: 'Last Name', key: 'lastName' },
            { 
              header: 'Rank', 
              key: 'rank',
              render: (value: number) => (
                <span className="font-bold text-primary">#{value}</span>
              )
            },
            { header: 'Points', key: 'points' },
            { header: 'Last Updated', key: 'lastUpdated' },
          ]}
          data={mockPlayerRankings}
          actions={[
            { label: 'View History', action: 'viewHistory' },
          ]}
          onAction={handleAction}
        />
      </Card>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Ranking Overview', content: rankingOverviewTab },
    { id: 'players', label: 'Player Rankings', content: playerRankingsTab },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">Ranking</h1>
        <p className="text-gray-600">View and manage player rankings</p>
      </div>

      <Tabs tabs={tabs} />
    </div>
  );
}