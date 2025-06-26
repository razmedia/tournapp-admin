import React, { useState } from 'react';
import Tabs from '../components/UI/Tabs';
import Table from '../components/UI/Table';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { mockLeagues } from '../data/mockData';
import { League } from '../types';

export default function Leagues() {
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);

  const leagueColumns = [
    { header: 'League ID', key: 'id' },
    { header: 'League Name', key: 'name' },
    { header: 'Organization', key: 'organization' },
    { header: 'Format', key: 'format' },
    { 
      header: 'Status', 
      key: 'status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'ongoing' ? 'bg-green-100 text-green-800' :
          value === 'setup' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    { header: 'Start Date', key: 'startDate' },
    { header: 'End Date', key: 'endDate' },
    { header: 'Total Teams/Players', key: 'totalTeamsPlayers' },
  ];

  const leagueActions = [
    { label: 'Edit', action: 'edit' },
    { label: 'Delete', action: 'delete', variant: 'danger' as const },
    { label: 'Generate Schedule', action: 'generateSchedule' },
    { label: 'Update Standings', action: 'updateStandings' },
    { label: 'Publish Results', action: 'publishResults' },
  ];

  const matchColumns = [
    { header: 'Match ID', key: 'id' },
    { header: 'League Name', key: 'leagueName' },
    { header: 'Teams/Players', key: 'teamsPlayers' },
    { header: 'Date/Time', key: 'dateTime' },
    { 
      header: 'Status', 
      key: 'status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'scheduled' ? 'bg-blue-100 text-blue-800' :
          value === 'completed' ? 'bg-green-100 text-green-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      )
    },
    { header: 'Score', key: 'score' },
  ];

  const matchActions = [
    { label: 'Edit', action: 'edit' },
    { label: 'Record Score', action: 'recordScore' },
    { label: 'Complete Match', action: 'completeMatch' },
  ];

  const standingsColumns = [
    { header: 'Rank', key: 'rank' },
    { header: 'Team/Player', key: 'teamPlayer' },
    { header: 'Wins', key: 'wins' },
    { header: 'Losses', key: 'losses' },
    { header: 'Points', key: 'points' },
    { header: 'Matches Played', key: 'matchesPlayed' },
  ];

  const standingsActions = [
    { label: 'Adjust Points', action: 'adjustPoints' },
    { label: 'Refresh Standings', action: 'refreshStandings' },
  ];

  const mockMatches = [
    {
      id: 'm1',
      leagueName: 'City League 2025',
      teamsPlayers: 'Team A vs Team B',
      dateTime: '2025-06-12 10:00',
      status: 'scheduled',
      score: '',
    },
    {
      id: 'm2',
      leagueName: 'City League 2025',
      teamsPlayers: 'John Doe vs Jane Smith',
      dateTime: '2025-06-13 14:00',
      status: 'completed',
      score: '6-4, 7-5',
    },
  ];

  const mockStandings = [
    {
      rank: 1,
      teamPlayer: 'Team A',
      wins: 2,
      losses: 0,
      points: 6,
      matchesPlayed: 2,
    },
    {
      rank: 2,
      teamPlayer: 'John Doe',
      wins: 1,
      losses: 1,
      points: 3,
      matchesPlayed: 2,
    },
  ];

  const handleAction = (action: string, item: any) => {
    alert(`${action} action for: ${item.name || item.id}`);
  };

  const leagueListTab = (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">League Management</h2>
        <Button>Add League</Button>
      </div>
      <Card>
        <Table
          columns={leagueColumns}
          data={mockLeagues}
          actions={leagueActions}
          onAction={handleAction}
        />
      </Card>
    </div>
  );

  const matchManagementTab = (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Match Management</h2>
        <Button>Add Match</Button>
      </div>
      <Card>
        <Table
          columns={matchColumns}
          data={mockMatches}
          actions={matchActions}
          onAction={handleAction}
        />
      </Card>
    </div>
  );

  const standingsTab = (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">League Standings</h2>
        <Button variant="secondary">Export Standings</Button>
      </div>
      <Card>
        <Table
          columns={standingsColumns}
          data={mockStandings}
          actions={standingsActions}
          onAction={handleAction}
        />
      </Card>
    </div>
  );

  const tabs = [
    { id: 'list', label: 'League List', content: leagueListTab },
    { id: 'matches', label: 'League Match Management', content: matchManagementTab },
    { id: 'standings', label: 'League Standings', content: standingsTab },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">Leagues</h1>
        <p className="text-gray-600">Manage leagues, matches, and standings</p>
      </div>

      <Tabs tabs={tabs} />
    </div>
  );
}