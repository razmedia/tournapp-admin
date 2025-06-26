import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface Classification {
  id: string;
  name: string;
}

interface Level {
  name: string;
  description?: string;
}

interface LevelSystem {
  name: string;
  levels: Level[];
}

interface Region {
  id: string;
  name: string;
}

interface RankingOrg {
  id: string;
  name: string;
}

interface Membership {
  id: string;
  name: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  items: string[];
}

interface Category {
  id: string;
  name: string;
}

interface Currency {
  code: string;
  symbol: string;
}

interface CategoryGroup {
  gender: 'male' | 'female' | 'mixed';
  matchType: 'singles' | 'doubles';
  ageGroup: 'junior' | 'senior';
  categories: Category[];
}

interface Stage {
  id: string;
  name: string;
  type: 'KO' | 'RR';
  matchType: 'singles' | 'doubles';
  description?: string;
  minParticipants?: number;
  maxParticipants?: number;
  active: boolean;
}

export default function Preferences() {
  const tabs = [
    'Classifications',
    'Gender',
    'Categories name',
    'Regions',
    'Court size',
    'Ball type',
    'Levels',
    'Ranking organizations',
    'Membership types',
    'Products',
    'Currencies',
    'Stages'
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [classifications, setClassifications] = useState<Classification[]>([
    { id: '1', name: 'Juniors' },
    { id: '2', name: 'Seniors' },
    { id: '3', name: 'Handicapped' }
  ]);
  const [newClassification, setNewClassification] = useState('');
  const [regions, setRegions] = useState<Region[]>([
    { id: '1', name: 'North' },
    { id: '2', name: 'South' },
    { id: '3', name: 'Center' }
  ]);
  const [newRegion, setNewRegion] = useState('');
  const [selectedLevelSystem, setSelectedLevelSystem] = useState<string>('General');
  const [isAddLevelSystemModalOpen, setIsAddLevelSystemModalOpen] = useState(false);
  const [isAddLevelModalOpen, setIsAddLevelModalOpen] = useState(false);
  const [newLevelSystem, setNewLevelSystem] = useState({ name: '' });
  const [newLevel, setNewLevel] = useState<Level>({ name: '', description: '' });
  const [rankingOrgs, setRankingOrgs] = useState<RankingOrg[]>([
    { id: '1', name: 'ITA' },
    { id: '2', name: 'ATP' },
    { id: '3', name: 'WTA' },
    { id: '4', name: 'ITF' }
  ]);
  const [newRankingOrg, setNewRankingOrg] = useState('');
  const [selectedMembershipType, setSelectedMembershipType] = useState<'player' | 'coach' | 'club'>('player');
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Health Test', items: [] },
    { id: '2', name: 'Insurance', items: [] },
    { id: '3', name: 'T-Shirt', items: ['10', '12', '14', '16', '18', 'S', 'M', 'L', 'XL', 'XXL'] }
  ]);
  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [isAddCurrencyModalOpen, setIsAddCurrencyModalOpen] = useState(false);
  const [newCurrency, setNewCurrency] = useState<Currency>({ code: '', symbol: '' });

  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'mixed'>('male');
  const [selectedMatchType, setSelectedMatchType] = useState<'singles' | 'doubles'>('singles');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<'junior' | 'senior'>('junior');
  
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([
    {
      gender: 'male',
      matchType: 'singles',
      ageGroup: 'junior',
      categories: [
        { id: '1', name: 'Boys 10 (S)' },
        { id: '2', name: 'Boys 12 (S)' },
        { id: '3', name: 'Boys 14 (S)' },
        { id: '4', name: 'Boys 16 (S)' },
        { id: '5', name: 'Boys 18 (S)' }
      ]
    },
    {
      gender: 'female',
      matchType: 'singles',
      ageGroup: 'junior',
      categories: [
        { id: '6', name: 'Girls 10 (S)' },
        { id: '7', name: 'Girls 12 (S)' },
        { id: '8', name: 'Girls 14 (S)' },
        { id: '9', name: 'Girls 16 (S)' },
        { id: '10', name: 'Girls 18 (S)' }
      ]
    },
    {
      gender: 'male',
      matchType: 'doubles',
      ageGroup: 'junior',
      categories: [
        { id: '11', name: 'Boys 10 (D)' },
        { id: '12', name: 'Boys 12 (D)' },
        { id: '13', name: 'Boys 14 (D)' },
        { id: '14', name: 'Boys 16 (D)' },
        { id: '15', name: 'Boys 18 (D)' }
      ]
    },
    {
      gender: 'mixed',
      matchType: 'singles',
      ageGroup: 'junior',
      categories: [
        { id: '16', name: 'Boys and Girls Mini Tennis (S)' }
      ]
    }
  ]);

  // Stages state
  const [selectedStageMatchType, setSelectedStageMatchType] = useState<'singles' | 'doubles'>('singles');
  const [selectedStageType, setSelectedStageType] = useState<'KO' | 'RR'>('KO');
  const [isAddStageModalOpen, setIsAddStageModalOpen] = useState(false);
  const [newStage, setNewStage] = useState<Omit<Stage, 'id'>>({
    name: '',
    type: 'KO',
    matchType: 'singles',
    description: '',
    minParticipants: undefined,
    maxParticipants: undefined,
    active: true
  });

  const [stages, setStages] = useState<Stage[]>([
    // Singles KO stages
    { id: '1', name: 'KO qualifying', type: 'KO', matchType: 'singles', description: 'Qualifying round for knockout tournament', minParticipants: 16, maxParticipants: 128, active: true },
    { id: '2', name: 'KO main draw', type: 'KO', matchType: 'singles', description: 'Main draw knockout rounds', minParticipants: 32, maxParticipants: 128, active: true },
    { id: '3', name: 'KO consolation', type: 'KO', matchType: 'singles', description: 'Consolation bracket for early round losers', minParticipants: 8, maxParticipants: 64, active: true },
    
    // Singles RR stages
    { id: '4', name: 'RR Group Stage', type: 'RR', matchType: 'singles', description: 'Round robin group stage', minParticipants: 8, maxParticipants: 32, active: true },
    { id: '5', name: 'RR Pool Play', type: 'RR', matchType: 'singles', description: 'Pool play round robin format', minParticipants: 6, maxParticipants: 24, active: true },
    { id: '6', name: 'RR Final Round', type: 'RR', matchType: 'singles', description: 'Final round robin stage', minParticipants: 4, maxParticipants: 8, active: true },
    
    // Doubles KO stages
    { id: '7', name: 'KO qualifying', type: 'KO', matchType: 'doubles', description: 'Qualifying round for doubles knockout', minParticipants: 8, maxParticipants: 64, active: true },
    { id: '8', name: 'KO main draw', type: 'KO', matchType: 'doubles', description: 'Main draw doubles knockout', minParticipants: 16, maxParticipants: 64, active: true },
    { id: '9', name: 'KO consolation', type: 'KO', matchType: 'doubles', description: 'Doubles consolation bracket', minParticipants: 4, maxParticipants: 32, active: true },
    
    // Doubles RR stages
    { id: '10', name: 'RR Group Stage', type: 'RR', matchType: 'doubles', description: 'Doubles round robin groups', minParticipants: 4, maxParticipants: 16, active: true },
    { id: '11', name: 'RR Pool Play', type: 'RR', matchType: 'doubles', description: 'Doubles pool play format', minParticipants: 6, maxParticipants: 12, active: true },
    { id: '12', name: 'RR Final Round', type: 'RR', matchType: 'doubles', description: 'Final doubles round robin', minParticipants: 4, maxParticipants: 6, active: true }
  ]);

  const courtSizes = [
    'Full Court',
    'Half Court',
    '3/4 Court',
    'Mini Tennis'
  ];

  const ballTypes = [
    { name: 'Yellow', color: 'bg-yellow-400' },
    { name: 'Green', color: 'bg-green-500' },
    { name: 'Orange', color: 'bg-orange-500' },
    { name: 'Red', color: 'bg-red-500' }
  ];

  const [currencies, setCurrencies] = useState<Currency[]>([
    { code: 'NIS', symbol: '₪' },
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' }
  ]);

  const playerMemberships: Membership[] = [
    { id: '1', name: 'Junior National', price: 70 },
    { id: '2', name: 'Junior Sectional', price: 60 },
    { id: '3', name: 'Junior Other', price: 30 },
    { id: '4', name: 'Junior Beginners', price: 0 },
    { id: '5', name: 'Seniors', price: 80 }
  ];

  const coachMemberships: Membership[] = [
    { id: '1', name: 'Coach Membership', price: 70 }
  ];

  const clubMemberships: Membership[] = [
    { id: '1', name: 'Premium', price: 400 },
    { id: '2', name: 'Regular', price: 200 },
    { id: '3', name: 'Basic', price: 0 }
  ];

  const [levelSystems, setLevelSystems] = useState<LevelSystem[]>([
    {
      name: 'General',
      levels: [
        { name: 'National' },
        { name: 'Sectional' },
        { name: 'Sectional 2' },
        { name: 'Other locals' }
      ]
    },
    {
      name: 'N.T.R.P',
      levels: [
        { name: 'NTRP 1.0', description: 'This player is just starting to play tennis.' },
        { name: 'NTRP 1.5', description: 'This player has had limited experience with stroke development and is still working primarily on getting the ball into play. This player is not yet ready to compete.' },
        { name: 'NTRP 2.0', description: 'This player needs on-court experience, with an emphasis on play. This player struggles to find an appropriate contact point, needs stroke development/lessons and is not yet familiar with basic positions for singles and doubles.' },
        { name: 'NTRP 2.5', description: 'This player is learning to judge where the oncoming ball is going and how much swing is needed to return it consistently. Movement to the ball and recovery are often not efficient. Can sustain a backcourt rally of slow pace with other players of similar ability and is beginning to develop strokes. This player is becoming more familiar with the basic positions for singles and doubles, and is ready to play social matches, leagues and low-level tournaments.\nPotential limitations: grip weaknesses; limited swing and inconsistent toss on serve; limited transitions to the net.' },
        { name: 'NTRP 3.0', description: 'This player is fairly consistent when hitting medium-paced shots, but is not comfortable with all strokes and lacks accuracy when trying for directional control, depth, pace or altering distance of shots. Most common doubles formation is one up, one back.\nPotential limitations: inconsistency when applying or handling pace; difficulty handling shots outside of their strike zone; can be uncomfortable at the net.' },
        { name: 'NTRP 3.5', description: 'This player has achieved stroke dependability with directional control on moderate shots, but still lacks depth, variety and the ability to alter distance of shots. The effective use of lobs, overheads, approach shots, and volleys is limited. This player is more comfortable at the net, has improved court awareness, and is developing teamwork in doubles.\nPotential strengths: Players can generally rally from the baseliner opposite a net player. Players at this level may start to utilize mental skills related to concentration, tactics and strategy.' },
        { name: 'NTRP 4.0', description: 'This player has dependable strokes with directional control and the ability to alter depth of shots on both forehand and backhand sides during moderately paced play. This player also has the ability to use lobs, overheads, approach shots, and volleys with success. This player occasionally forces errors when serving. Points may be lost due to impatience. Teamwork in doubles is evident.\nPotential strengths: dependable second serve; recognize opportunities to finish points.' },
        { name: 'NTRP 4.5', description: 'This player can vary the use of pace and spins, has effective court coverage, can control depth of shots, and is able to develop game plans according to strengths and weaknesses. This player can hit the first serve with power and accuracy and can place the second serve. This player tends to overhit on difficult shots. Aggressive net play is common in doubles.\nPotential strengths: points are frequently won off the serve or return of serve; able to offset weaknesses; may have a weapon around which their game can be built.' },
        { name: 'NTRP 5.0', description: 'This player has good shot anticipation and frequently has an outstanding shot or attribute around which his or her game can be structured. This player can regularly hit winners or force errors off of short balls and puts away volleys. He or she can successfully execute lobs, drop shots, half volleys, overheads, and has good depth and spin on most second serves.\nPotential strengths: covers and disguises weaknesses well; can hit offensive volleys and half-volleys from mid-court; can employ physical or mental fitness as a weapon.' },
        { name: 'NTRP 5.5', description: 'This player has developed pace and/or consistency as a major weapon. This player can vary strategies and styles of play in competitive situations and hit dependable shots in stress situations.\nStrengths: can hit offensively at any time; can vary strategies and styles of play in competitive situations; first and second serves can be depended upon in stress situations.' },
        { name: 'NTRP 6.0-7.0', description: 'The 6.0 player typically has had intensive training for national tournaments or top level collegiate competition, and has obtained a national ranking.\nThe 6.5 and 7.0 are world-class players.' }
      ]
    }
  ]);

  // Stage handlers
  const handleAddStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStage.name.trim()) {
      const stage: Stage = {
        ...newStage,
        id: (stages.length + 1).toString(),
        matchType: selectedStageMatchType,
        type: selectedStageType
      };
      setStages(prev => [...prev, stage]);
      setNewStage({
        name: '',
        type: selectedStageType,
        matchType: selectedStageMatchType,
        description: '',
        minParticipants: undefined,
        maxParticipants: undefined,
        active: true
      });
      setIsAddStageModalOpen(false);
    }
  };

  const handleDeleteStage = (id: string) => {
    if (confirm('Are you sure you want to delete this stage?')) {
      setStages(prev => prev.filter(stage => stage.id !== id));
    }
  };

  const handleToggleStageActive = (id: string) => {
    setStages(prev => prev.map(stage => 
      stage.id === id ? { ...stage, active: !stage.active } : stage
    ));
  };

  const getFilteredStages = () => {
    return stages.filter(stage => 
      stage.matchType === selectedStageMatchType && stage.type === selectedStageType
    );
  };

  const handleAddClassification = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClassification.trim()) {
      setClassifications(prev => [...prev, {
        id: (prev.length + 1).toString(),
        name: newClassification.trim()
      }]);
      setNewClassification('');
    }
  };

  const handleDeleteClassification = (id: string) => {
    setClassifications(prev => prev.filter(c => c.id !== id));
  };

  const handleAddRegion = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRegion.trim()) {
      setRegions(prev => [...prev, {
        id: (prev.length + 1).toString(),
        name: newRegion.trim()
      }]);
      setNewRegion('');
    }
  };

  const handleDeleteRegion = (id: string) => {
    setRegions(prev => prev.filter(r => r.id !== id));
  };

  const handleAddRankingOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRankingOrg.trim()) {
      setRankingOrgs(prev => [...prev, {
        id: (prev.length + 1).toString(),
        name: newRankingOrg.trim()
      }]);
      setNewRankingOrg('');
    }
  };

  const handleDeleteRankingOrg = (id: string) => {
    setRankingOrgs(prev => prev.filter(org => org.id !== id));
  };

  const handleAddItem = (productId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      setProducts(prev => prev.map(product => 
        product.id === productId
          ? { ...product, items: [...product.items, newItem.trim()] }
          : product
      ));
      setNewItem('');
    }
  };

  const handleDeleteItem = (productId: string, item: string) => {
    setProducts(prev => prev.map(product => 
      product.id === productId
        ? { ...product, items: product.items.filter(i => i !== item) }
        : product
    ));
  };

  const handleAddCurrency = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCurrency.code && newCurrency.symbol) {
      setCurrencies(prev => [...prev, newCurrency]);
      setNewCurrency({ code: '', symbol: '' });
      setIsAddCurrencyModalOpen(false);
    }
  };

  const handleDeleteCurrency = (code: string) => {
    if (confirm('Are you sure you want to delete this currency?')) {
      setCurrencies(prev => prev.filter(currency => currency.code !== code));
    }
  };

  const handleAddLevelSystem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLevelSystem.name.trim()) {
      setLevelSystems(prev => [...prev, { name: newLevelSystem.name, levels: [] }]);
      setNewLevelSystem({ name: '' });
      setIsAddLevelSystemModalOpen(false);
    }
  };

  const handleAddLevel = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLevel.name.trim() && selectedLevelSystem) {
      setLevelSystems(prev => prev.map(system => 
        system.name === selectedLevelSystem
          ? { ...system, levels: [...system.levels, newLevel] }
          : system
      ));
      setNewLevel({ name: '', description: '' });
      setIsAddLevelModalOpen(false);
    }
  };

  const handleDeleteLevelSystem = (systemName: string) => {
    if (confirm('Are you sure you want to delete this level system?')) {
      setLevelSystems(prev => prev.filter(system => system.name !== systemName));
      if (selectedLevelSystem === systemName) {
        setSelectedLevelSystem(prev => prev === systemName ? null : prev);
      }
    }
  };

  const handleDeleteLevel = (systemName: string, levelName: string) => {
    if (confirm('Are you sure you want to delete this level?')) {
      setLevelSystems(prev => prev.map(system => 
        system.name === systemName
          ? { ...system, levels: system.levels.filter(level => level.name !== levelName) }
          : system
      ));
    }
  };

  const getCurrentCategories = () => {
    return categoryGroups.find(group => 
      group.gender === selectedGender && 
      group.matchType === selectedMatchType && 
      group.ageGroup === selectedAgeGroup
    )?.categories || [];
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      setCategoryGroups(prev => prev.map(group => {
        if (
          group.gender === selectedGender &&
          group.matchType === selectedMatchType &&
          group.ageGroup === selectedAgeGroup
        ) {
          return {
            ...group,
            categories: [...group.categories, {
              id: Math.random().toString(),
              name: newCategory.trim()
            }]
          };
        }
        return group;
      }));
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategoryGroups(prev => prev.map(group => {
      if (
        group.gender === selectedGender &&
        group.matchType === selectedMatchType &&
        group.ageGroup === selectedAgeGroup
      ) {
        return {
          ...group,
          categories: group.categories.filter(cat => cat.id !== categoryId)
        };
      }
      return group;
    }));
  };

  const renderMembershipSection = () => {
    let memberships: Membership[] = [];
    switch (selectedMembershipType) {
      case 'player':
        memberships = playerMemberships;
        break;
      case 'coach':
        memberships = coachMemberships;
        break;
      case 'club':
        memberships = clubMemberships;
        break;
    }

    return (
      <div className="space-y-4">
        {memberships.map((membership) => (
          <div
            key={membership.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
          >
            <span className="text-gray-900">{membership.name}</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={membership.price}
                className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="text-gray-600">NIS</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Classifications':
        return (
          <div className="space-y-6">
            <form onSubmit={handleAddClassification} className="flex gap-4">
              <input
                type="text"
                value={newClassification}
                onChange={(e) => setNewClassification(e.target.value)}
                placeholder="Enter new classification"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Classification
              </button>
            </form>

            <div className="space-y-2">
              {classifications.map((classification) => (
                <div
                  key={classification.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <span className="text-gray-900">{classification.name}</span>
                  <button
                    onClick={() => handleDeleteClassification(classification.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Gender':
        return (
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-md">
              <span className="text-gray-900">Male</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-md">
              <span className="text-gray-900">Female</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-md">
              <span className="text-gray-900">Mixed</span>
            </div>
          </div>
        );

      case 'Court size':
        return (
          <div className="space-y-4">
            {courtSizes.map((size, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-md">
                <span className="text-gray-900">{size}</span>
              </div>
            ))}
          </div>
        );

      case 'Ball type':
        return (
          <div className="space-y-4">
            {ballTypes.map((ball, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-md">
                <div className={`w-6 h-6 rounded-full ${ball.color} mr-3`}></div>
                <span className="text-gray-900">{ball.name}</span>
              </div>
            ))}
          </div>
        );

      case 'Regions':
        return (
          <div className="space-y-6">
            <form onSubmit={handleAddRegion} className="flex gap-4">
              <input
                type="text"
                value={newRegion}
                onChange={(e) => setNewRegion(e.target.value)}
                placeholder="Enter new region"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Region
              </button>
            </form>

            <div className="space-y-2">
              {regions.map((region) => (
                <div
                  key={region.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <span className="text-gray-900">{region.name}</span>
                  <button
                    onClick={() => handleDeleteRegion(region.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Levels':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4">
                {levelSystems.map((system) => (
                  <button
                    key={system.name}
                    onClick={() => setSelectedLevelSystem(system.name)}
                    className={`px-4 py-2 rounded-md ${
                      selectedLevelSystem === system.name
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {system.name}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setIsAddLevelSystemModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Level System
              </button>
            </div>

            {selectedLevelSystem && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedLevelSystem} Levels
                  </h3>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setIsAddLevelModalOpen(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add Level
                    </button>
                    <button
                      onClick={() => handleDeleteLevelSystem(selectedLevelSystem)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Delete System
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {levelSystems
                    .find(system => system.name === selectedLevelSystem)
                    ?.levels.map((level, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-md relative">
                        <button
                          onClick={() => handleDeleteLevel(selectedLevelSystem, level.name)}
                          className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                        <h3 className="font-medium text-gray-900">{level.name}</h3>
                        {level.description && (
                          <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">
                            {level.description}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Add Level System Modal */}
            <Transition appear show={isAddLevelSystemModalOpen} as={Fragment}>
              <Dialog
                as="div"
                className="relative z-10"
                onClose={() => setIsAddLevelSystemModalOpen(false)}
              >
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          Add Level System
                        </Dialog.Title>
                        <form onSubmit={handleAddLevelSystem} className="mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              System Name
                            </label>
                            <input
                              type="text"
                              value={newLevelSystem.name}
                              onChange={(e) => setNewLevelSystem({ name: e.target.value })}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              required
                            />
                          </div>
                          <div className="mt-4 flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setIsAddLevelSystemModalOpen(false)}
                              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                              Add System
                            </button>
                          </div>
                        </form>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>

            {/* Add Level Modal */}
            <Transition appear show={isAddLevelModalOpen} as={Fragment}>
              <Dialog
                as="div"
                className="relative z-10"
                onClose={() => setIsAddLevelModalOpen(false)}
              >
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          Add Level
                        </Dialog.Title>
                        <form onSubmit={handleAddLevel} className="mt-4">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Level Name
                              </label>
                              <input
                                type="text"
                                value={newLevel.name}
                                onChange={(e) => setNewLevel(prev => ({ ...prev, name: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Description
                              </label>
                              <textarea
                                value={newLevel.description}
                                onChange={(e) => setNewLevel(prev => ({ ...prev, description: e.target.value }))}
                                rows={4}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setIsAddLevelModalOpen(false)}
                              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                              Add Level
                            </button>
                          </div>
                        </form>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>
          </div>
        );

      case 'Ranking organizations':
        return (
          <div className="space-y-6">
            <form onSubmit={handleAddRankingOrg} className="flex gap-4">
              <input
                type="text"
                value={newRankingOrg}
                onChange={(e) => setNewRankingOrg(e.target.value)}
                placeholder="Enter new organization"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Organization
              </button>
            </form>

            <div className="space-y-2">
              {rankingOrgs.map((org) => (
                <div
                  key={org.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <span className="text-gray-900">{org.name}</span>
                  <button
                    onClick={() => handleDeleteRankingOrg(org.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Membership types':
        return (
          <div className="space-y-6">
            <div className="flex gap-4 mb-6">
              {(['player', 'coach', 'club'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedMembershipType(type)}
                  className={`px-4 py-2 rounded-md capitalize ${
                    selectedMembershipType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            {renderMembershipSection()}
          </div>
        );

      case 'Products':
        return (
          <div className="space-y-6">
            {products.map((product) => (
              <div key={product.id} className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {product.items.map((item) => (
                      <div
                        key={item}
                        className="flex items-center bg-white rounded-full px-3 py-1"
                      >
                        <span className="text-sm text-gray-700">{item}</span>
                        <button
                          onClick={() => handleDeleteItem(product.id, item)}
                          className="ml-2 text-gray-400 hover:text-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <form
                    onSubmit={(e) => handleAddItem(product.id, e)}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      placeholder="Add new item"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        );

      case 'Currencies':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Currencies</h3>
              <button
                onClick={() => setIsAddCurrencyModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Currency
              </button>
            </div>

            <div className="space-y-2">
              {currencies.map((currency) => (
                <div
                  key={currency.code}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-gray-900">{currency.code}</span>
                    <span className="text-gray-600">{currency.symbol}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteCurrency(currency.code)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            <Transition appear show={isAddCurrencyModalOpen} as={Fragment}>
              <Dialog
                as="div"
                className="relative z-10"
                onClose={() => setIsAddCurrencyModalOpen(false)}
              >
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          Add Currency
                        </Dialog.Title>
                        <form onSubmit={handleAddCurrency} className="mt-4">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Currency Code
                              </label>
                              <input
                                type="text"
                                value={newCurrency.code}
                                onChange={(e) => setNewCurrency(prev => ({ ...prev, code: e.target.value }))}
                                placeholder="e.g., USD"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Symbol
                              </label>
                              <input
                                type="text"
                                value={newCurrency.symbol}
                                onChange={(e) => setNewCurrency(prev => ({ ...prev, symbol: e.target.value }))}
                                placeholder="e.g., $"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                              />
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setIsAddCurrencyModalOpen(false)}
                              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                              Add Currency
                            </button>
                          </div>
                        </form>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>
          </div>
        );

      case 'Categories name':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Gender</h3>
                <div className="flex gap-2">
                  {(['male', 'female', 'mixed'] as const).map((gender) => (
                    <button
                      key={gender}
                      onClick={() => setSelectedGender(gender)}
                      className={`px-4 py-2 rounded-md capitalize ${
                        selectedGender === gender
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Match Type</h3>
                <div className="flex gap-2">
                  {(['singles', 'doubles'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedMatchType(type)}
                      className={`px-4 py-2 rounded-md capitalize ${
                        selectedMatchType === type
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Age Group</h3>
                <div className="flex gap-2">
                  {(['junior', 'senior'] as const).map((group) => (
                    <button
                      key={group}
                      onClick={() => setSelectedAgeGroup(group)}
                      className={`px-4 py-2 rounded-md capitalize ${
                        selectedAgeGroup === group
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Categories</h3>
                <div className="text-sm text-gray-500">
                  {selectedGender} / {selectedMatchType} / {selectedAgeGroup}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  {getCurrentCategories().map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <span className="text-gray-900">{category.name}</span>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddCategory} className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Add new category"
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </form>
              </div>
            </div>
          </div>
        );

      case 'Stages':
        return (
          <div className="space-y-6">
            {/* Singles & Doubles Segmented Control */}
            <div className="flex justify-center">
              <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                <button
                  onClick={() => setSelectedStageMatchType('singles')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    selectedStageMatchType === 'singles'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Singles
                </button>
                <button
                  onClick={() => setSelectedStageMatchType('doubles')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    selectedStageMatchType === 'doubles'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Doubles
                </button>
              </div>
            </div>

            {/* KO & RR Sub-tabs */}
            <div className="flex justify-center">
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedStageType('KO')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedStageType === 'KO'
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  KO
                </button>
                <button
                  onClick={() => setSelectedStageType('RR')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedStageType === 'RR'
                      ? 'bg-orange-100 text-orange-800 border border-orange-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  RR
                </button>
              </div>
            </div>

            {/* Add Stage Button */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedStageMatchType.charAt(0).toUpperCase() + selectedStageMatchType.slice(1)} - {selectedStageType} Stages
              </h3>
              <button
                onClick={() => {
                  setNewStage({
                    name: '',
                    type: selectedStageType,
                    matchType: selectedStageMatchType,
                    description: '',
                    minParticipants: undefined,
                    maxParticipants: undefined,
                    active: true
                  });
                  setIsAddStageModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Stage
              </button>
            </div>

            {/* Stages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredStages().map((stage) => (
                <div
                  key={stage.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">{stage.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        stage.type === 'KO' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {stage.type}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteStage(stage.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Type:</span>
                      <span className="capitalize">{stage.matchType}</span>
                    </div>
                    
                    {stage.description && (
                      <div>
                        <span className="font-medium">Description:</span>
                        <p className="text-gray-600 mt-1">{stage.description}</p>
                      </div>
                    )}
                    
                    {(stage.minParticipants || stage.maxParticipants) && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Participants:</span>
                        <span>
                          {stage.minParticipants && stage.maxParticipants 
                            ? `${stage.minParticipants}-${stage.maxParticipants}`
                            : stage.minParticipants 
                              ? `${stage.minParticipants}+`
                              : `Up to ${stage.maxParticipants}`
                          }
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={stage.active}
                        onChange={() => handleToggleStageActive(stage.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className={stage.active ? 'text-green-600' : 'text-gray-500'}>
                        {stage.active ? 'Active' : 'Inactive'}
                      </span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {getFilteredStages().length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No {selectedStageType} stages found for {selectedStageMatchType}. 
                <button
                  onClick={() => {
                    setNewStage({
                      name: '',
                      type: selectedStageType,
                      matchType: selectedStageMatchType,
                      description: '',
                      minParticipants: undefined,
                      maxParticipants: undefined,
                      active: true
                    });
                    setIsAddStageModalOpen(true);
                  }}
                  className="text-blue-600 hover:text-blue-800 ml-1"
                >
                  Add the first one
                </button>
              </div>
            )}

            {/* Add Stage Modal */}
            <Transition appear show={isAddStageModalOpen} as={Fragment}>
              <Dialog
                as="div"
                className="relative z-10"
                onClose={() => setIsAddStageModalOpen(false)}
              >
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          Add {selectedStageType} Stage for {selectedStageMatchType.charAt(0).toUpperCase() + selectedStageMatchType.slice(1)}
                        </Dialog.Title>
                        <form onSubmit={handleAddStage} className="mt-4">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Stage Name
                              </label>
                              <input
                                type="text"
                                value={newStage.name}
                                onChange={(e) => setNewStage(prev => ({ ...prev, name: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder={`e.g., ${selectedStageType} ${selectedStageType === 'KO' ? 'qualifying' : 'Group Stage'}`}
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Description
                              </label>
                              <textarea
                                value={newStage.description}
                                onChange={(e) => setNewStage(prev => ({ ...prev, description: e.target.value }))}
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Describe this stage..."
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Min Participants
                                </label>
                                <input
                                  type="number"
                                  value={newStage.minParticipants || ''}
                                  onChange={(e) => setNewStage(prev => ({ 
                                    ...prev, 
                                    minParticipants: e.target.value ? parseInt(e.target.value) : undefined 
                                  }))}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  placeholder="e.g., 8"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Max Participants
                                </label>
                                <input
                                  type="number"
                                  value={newStage.maxParticipants || ''}
                                  onChange={(e) => setNewStage(prev => ({ 
                                    ...prev, 
                                    maxParticipants: e.target.value ? parseInt(e.target.value) : undefined 
                                  }))}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  placeholder="e.g., 64"
                                />
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={newStage.active}
                                onChange={(e) => setNewStage(prev => ({ ...prev, active: e.target.checked }))}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <label className="ml-2 text-sm text-gray-700">Active</label>
                            </div>
                          </div>
                          
                          <div className="mt-6 flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setIsAddStageModalOpen(false)}
                              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                              Add Stage
                            </button>
                          </div>
                        </form>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>
          </div>
        );

      default:
        return (
          <p className="text-gray-600">Content for {activeTab} will go here</p>
        );
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Preferences</h2>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <div className="border-b border-gray-200 min-w-full">
          <div className="flex flex-nowrap">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  whitespace-nowrap py-2 px-3 text-center text-sm font-medium flex-shrink-0
                  transition-colors duration-200 ease-in-out
                  ${activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-b border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
                `}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}