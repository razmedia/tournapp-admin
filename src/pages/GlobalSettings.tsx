import React, { useState } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import ConfirmDialog from '../components/UI/ConfirmDialog';
import { useGlobalSettings } from '../context/GlobalSettingsContext';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Settings, 
  Users, 
  MapPin, 
  Trophy, 
  Circle, 
  Globe, 
  DollarSign,
  Tag,
  Target,
  Award,
  CreditCard,
  Package,
  Coins,
  Layers,
  X
} from 'lucide-react';

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

export default function GlobalSettings() {
  const { settings, addClassification, deleteClassification, addGender, deleteGender, addRegion, deleteRegion, addCurrency, deleteCurrency } = useGlobalSettings();
  
  const tabs = [
    { id: 'classifications', label: 'Classifications', icon: <Tag className="h-4 w-4" /> },
    { id: 'gender', label: 'Gender', icon: <Users className="h-4 w-4" /> },
    { id: 'categories', label: 'Categories name', icon: <Target className="h-4 w-4" /> },
    { id: 'regions', label: 'Regions', icon: <MapPin className="h-4 w-4" /> },
    { id: 'court-size', label: 'Court size', icon: <Trophy className="h-4 w-4" /> },
    { id: 'ball-type', label: 'Ball type', icon: <Circle className="h-4 w-4" /> },
    { id: 'levels', label: 'Levels', icon: <Layers className="h-4 w-4" /> },
    { id: 'ranking-orgs', label: 'Ranking organizations', icon: <Award className="h-4 w-4" /> },
    { id: 'membership', label: 'Membership types', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'products', label: 'Products', icon: <Package className="h-4 w-4" /> },
    { id: 'currencies', label: 'Currencies', icon: <Coins className="h-4 w-4" /> },
    { id: 'stages', label: 'Stages', icon: <Settings className="h-4 w-4" /> }
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [newClassification, setNewClassification] = useState('');
  const [newGender, setNewGender] = useState('');
  const [newRegion, setNewRegion] = useState('');
  const [newRankingOrg, setNewRankingOrg] = useState('');
  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState('');
  
  // Modal states
  const [isAddCurrencyModalOpen, setIsAddCurrencyModalOpen] = useState(false);
  const [isAddLevelSystemModalOpen, setIsAddLevelSystemModalOpen] = useState(false);
  const [isAddLevelModalOpen, setIsAddLevelModalOpen] = useState(false);
  const [isAddStageModalOpen, setIsAddStageModalOpen] = useState(false);
  
  // Form states
  const [newCurrency, setNewCurrency] = useState<Currency>({ code: '', symbol: '' });
  const [newLevelSystem, setNewLevelSystem] = useState({ name: '' });
  const [newLevel, setNewLevel] = useState<Level>({ name: '', description: '' });
  const [newStage, setNewStage] = useState<Omit<Stage, 'id'>>({
    name: '',
    type: 'KO',
    matchType: 'singles',
    description: '',
    minParticipants: undefined,
    maxParticipants: undefined,
    active: true
  });

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'classification' | 'gender' | 'region' | 'currency' | 'ranking-org' | 'level-system' | 'level' | 'stage';
    item: any;
    itemName: string;
  }>({
    isOpen: false,
    type: 'classification',
    item: null,
    itemName: ''
  });

  // Additional state for complex sections
  const [regions, setRegions] = useState<Region[]>([
    { id: '1', name: 'North' },
    { id: '2', name: 'South' },
    { id: '3', name: 'Center' }
  ]);

  const [selectedLevelSystem, setSelectedLevelSystem] = useState<string>('General');
  const [rankingOrgs, setRankingOrgs] = useState<RankingOrg[]>([
    { id: '1', name: 'ITA' },
    { id: '2', name: 'ATP' },
    { id: '3', name: 'WTA' },
    { id: '4', name: 'ITF' }
  ]);

  const [selectedMembershipType, setSelectedMembershipType] = useState<'player' | 'coach' | 'club'>('player');
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Health Test', items: [] },
    { id: '2', name: 'Insurance', items: [] },
    { id: '3', name: 'T-Shirt', items: ['10', '12', '14', '16', '18', 'S', 'M', 'L', 'XL', 'XXL'] }
  ]);

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

  const [selectedStageMatchType, setSelectedStageMatchType] = useState<'singles' | 'doubles'>('singles');
  const [selectedStageType, setSelectedStageType] = useState<'KO' | 'RR'>('KO');
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

  // Event handlers
  const handleAddClassification = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClassification.trim()) {
      addClassification({
        id: Date.now().toString(),
        name: newClassification.trim()
      });
      setNewClassification('');
    }
  };

  const handleDeleteClassification = (id: string, name: string) => {
    setConfirmDialog({
      isOpen: true,
      type: 'classification',
      item: { id },
      itemName: name
    });
  };

  const handleAddGender = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGender.trim()) {
      addGender({
        id: Date.now().toString(),
        name: newGender.trim()
      });
      setNewGender('');
    }
  };

  const handleDeleteGender = (id: string, name: string) => {
    setConfirmDialog({
      isOpen: true,
      type: 'gender',
      item: { id },
      itemName: name
    });
  };

  const handleAddRegion = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRegion.trim()) {
      setRegions(prev => [...prev, {
        id: Date.now().toString(),
        name: newRegion.trim()
      }]);
      setNewRegion('');
    }
  };

  const handleDeleteRegion = (id: string, name: string) => {
    setConfirmDialog({
      isOpen: true,
      type: 'region',
      item: { id },
      itemName: name
    });
  };

  const handleAddRankingOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRankingOrg.trim()) {
      setRankingOrgs(prev => [...prev, {
        id: Date.now().toString(),
        name: newRankingOrg.trim()
      }]);
      setNewRankingOrg('');
    }
  };

  const handleDeleteRankingOrg = (id: string, name: string) => {
    setConfirmDialog({
      isOpen: true,
      type: 'ranking-org',
      item: { id },
      itemName: name
    });
  };

  const handleAddCurrency = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCurrency.code && newCurrency.symbol) {
      addCurrency(newCurrency);
      setNewCurrency({ code: '', symbol: '' });
      setIsAddCurrencyModalOpen(false);
    }
  };

  const handleDeleteCurrency = (code: string) => {
    setConfirmDialog({
      isOpen: true,
      type: 'currency',
      item: { code },
      itemName: code
    });
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
    setConfirmDialog({
      isOpen: true,
      type: 'level-system',
      item: { name: systemName },
      itemName: systemName
    });
  };

  const handleDeleteLevel = (systemName: string, levelName: string) => {
    setConfirmDialog({
      isOpen: true,
      type: 'level',
      item: { systemName, levelName },
      itemName: levelName
    });
  };

  const handleAddStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStage.name.trim()) {
      const stage: Stage = {
        ...newStage,
        id: Date.now().toString(),
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

  const handleDeleteStage = (id: string, name: string) => {
    setConfirmDialog({
      isOpen: true,
      type: 'stage',
      item: { id },
      itemName: name
    });
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
              id: Date.now().toString(),
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

  const handleConfirmDelete = () => {
    const { type, item } = confirmDialog;
    
    switch (type) {
      case 'classification':
        deleteClassification(item.id);
        break;
      case 'gender':
        deleteGender(item.id);
        break;
      case 'region':
        setRegions(prev => prev.filter(r => r.id !== item.id));
        break;
      case 'currency':
        deleteCurrency(item.code);
        break;
      case 'ranking-org':
        setRankingOrgs(prev => prev.filter(org => org.id !== item.id));
        break;
      case 'level-system':
        setLevelSystems(prev => prev.filter(system => system.name !== item.name));
        if (selectedLevelSystem === item.name) {
          setSelectedLevelSystem(levelSystems[0]?.name || '');
        }
        break;
      case 'level':
        setLevelSystems(prev => prev.map(system => 
          system.name === item.systemName
            ? { ...system, levels: system.levels.filter(level => level.name !== item.levelName) }
            : system
        ));
        break;
      case 'stage':
        setStages(prev => prev.filter(stage => stage.id !== item.id));
        break;
    }
    
    setConfirmDialog({ isOpen: false, type: 'classification', item: null, itemName: '' });
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
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <span className="text-text-primary font-medium">{membership.name}</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={membership.price}
                className="w-24 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                readOnly
              />
              <span className="text-text-secondary">
                {settings.currencies[0]?.symbol || '₹'}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'classifications':
        return (
          <div className="space-y-6">
            <form onSubmit={handleAddClassification} className="flex gap-4">
              <input
                type="text"
                value={newClassification}
                onChange={(e) => setNewClassification(e.target.value)}
                placeholder="Enter new classification"
                className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              <Button type="submit" className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Classification
              </Button>
            </form>

            <div className="space-y-2">
              {settings.classifications.map((classification) => (
                <div
                  key={classification.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-text-primary font-medium">{classification.name}</span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClassification(classification.id, classification.name)}
                    className="flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'gender':
        return (
          <div className="space-y-6">
            <form onSubmit={handleAddGender} className="flex gap-4">
              <input
                type="text"
                value={newGender}
                onChange={(e) => setNewGender(e.target.value)}
                placeholder="Enter new gender"
                className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              <Button type="submit" className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Gender
              </Button>
            </form>

            <div className="space-y-2">
              {settings.genders.map((gender) => (
                <div
                  key={gender.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-text-primary font-medium">{gender.name}</span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteGender(gender.id, gender.name)}
                    className="flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'court-size':
        return (
          <div className="space-y-4">
            {courtSizes.map((size, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <span className="text-text-primary font-medium">{size}</span>
              </div>
            ))}
          </div>
        );

      case 'ball-type':
        return (
          <div className="space-y-4">
            {ballTypes.map((ball, index) => (
              <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className={`w-6 h-6 rounded-full ${ball.color} mr-3 shadow-sm`}></div>
                <span className="text-text-primary font-medium">{ball.name}</span>
              </div>
            ))}
          </div>
        );

      case 'regions':
        return (
          <div className="space-y-6">
            <form onSubmit={handleAddRegion} className="flex gap-4">
              <input
                type="text"
                value={newRegion}
                onChange={(e) => setNewRegion(e.target.value)}
                placeholder="Enter new region"
                className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              <Button type="submit" className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Region
              </Button>
            </form>

            <div className="space-y-2">
              {regions.map((region) => (
                <div
                  key={region.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-text-primary font-medium">{region.name}</span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteRegion(region.id, region.name)}
                    className="flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'levels':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4">
                {levelSystems.map((system) => (
                  <button
                    key={system.name}
                    onClick={() => setSelectedLevelSystem(system.name)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedLevelSystem === system.name
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                    }`}
                  >
                    {system.name}
                  </button>
                ))}
              </div>
              <Button
                onClick={() => setIsAddLevelSystemModalOpen(true)}
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Level System
              </Button>
            </div>

            {selectedLevelSystem && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-text-primary">
                    {selectedLevelSystem} Levels
                  </h3>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => setIsAddLevelModalOpen(true)}
                      className="flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Level
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteLevelSystem(selectedLevelSystem)}
                      className="flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete System
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {levelSystems
                    .find(system => system.name === selectedLevelSystem)
                    ?.levels.map((level, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg relative">
                        <button
                          onClick={() => handleDeleteLevel(selectedLevelSystem, level.name)}
                          className="absolute top-3 right-3 text-danger-600 hover:text-danger-800 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <h4 className="font-semibold text-text-primary pr-8">{level.name}</h4>
                        {level.description && (
                          <p className="mt-2 text-sm text-text-secondary whitespace-pre-line">
                            {level.description}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'ranking-orgs':
        return (
          <div className="space-y-6">
            <form onSubmit={handleAddRankingOrg} className="flex gap-4">
              <input
                type="text"
                value={newRankingOrg}
                onChange={(e) => setNewRankingOrg(e.target.value)}
                placeholder="Enter new organization"
                className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              <Button type="submit" className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Organization
              </Button>
            </form>

            <div className="space-y-2">
              {rankingOrgs.map((org) => (
                <div
                  key={org.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-text-primary font-medium">{org.name}</span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteRankingOrg(org.id, org.name)}
                    className="flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'membership':
        return (
          <div className="space-y-6">
            <div className="flex gap-4 mb-6">
              {(['player', 'coach', 'club'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedMembershipType(type)}
                  className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                    selectedMembershipType === type
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            {renderMembershipSection()}
          </div>
        );

      case 'products':
        return (
          <div className="space-y-6">
            {products.map((product) => (
              <div key={product.id} className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-text-primary">{product.name}</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {product.items.map((item) => (
                      <div
                        key={item}
                        className="flex items-center bg-white rounded-full px-3 py-1 shadow-sm"
                      >
                        <span className="text-sm text-text-primary">{item}</span>
                        <button
                          onClick={() => handleDeleteItem(product.id, item)}
                          className="ml-2 text-gray-400 hover:text-danger-600 transition-colors"
                        >
                          <X className="h-3 w-3" />
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
                      className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                    <Button type="submit" className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        );

      case 'currencies':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-text-primary">Currencies</h3>
              <Button
                onClick={() => setIsAddCurrencyModalOpen(true)}
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Currency
              </Button>
            </div>

            <div className="space-y-2">
              {settings.currencies.map((currency) => (
                <div
                  key={currency.code}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-text-primary font-medium">{currency.code}</span>
                    <span className="text-text-secondary">{currency.symbol}</span>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteCurrency(currency.code)}
                    className="flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'categories':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-2">Gender</h3>
                <div className="flex gap-2">
                  {(['male', 'female', 'mixed'] as const).map((gender) => (
                    <button
                      key={gender}
                      onClick={() => setSelectedGender(gender)}
                      className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                        selectedGender === gender
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-2">Match Type</h3>
                <div className="flex gap-2">
                  {(['singles', 'doubles'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedMatchType(type)}
                      className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                        selectedMatchType === type
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-2">Age Group</h3>
                <div className="flex gap-2">
                  {(['junior', 'senior'] as const).map((group) => (
                    <button
                      key={group}
                      onClick={() => setSelectedAgeGroup(group)}
                      className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                        selectedAgeGroup === group
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
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
                <h3 className="text-lg font-semibold text-text-primary">Categories</h3>
                <div className="text-sm text-text-muted">
                  {selectedGender} / {selectedMatchType} / {selectedAgeGroup}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  {getCurrentCategories().map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-text-primary font-medium">{category.name}</span>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddCategory} className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Add new category"
                    className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                  <Button type="submit" className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </form>
              </div>
            </div>
          </div>
        );

      case 'stages':
        return (
          <div className="space-y-6">
            {/* Singles & Doubles Segmented Control */}
            <div className="flex justify-center">
              <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                <button
                  onClick={() => setSelectedStageMatchType('singles')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    selectedStageMatchType === 'singles'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Singles
                </button>
                <button
                  onClick={() => setSelectedStageMatchType('doubles')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    selectedStageMatchType === 'doubles'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
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
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedStageType === 'KO'
                      ? 'bg-success-100 text-success-800 border border-success-200'
                      : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                  }`}
                >
                  KO
                </button>
                <button
                  onClick={() => setSelectedStageType('RR')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedStageType === 'RR'
                      ? 'bg-warning-100 text-warning-800 border border-warning-200'
                      : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                  }`}
                >
                  RR
                </button>
              </div>
            </div>

            {/* Add Stage Button */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-text-primary">
                {selectedStageMatchType.charAt(0).toUpperCase() + selectedStageMatchType.slice(1)} - {selectedStageType} Stages
              </h3>
              <Button
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
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Stage
              </Button>
            </div>

            {/* Stages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredStages().map((stage) => (
                <div
                  key={stage.id}
                  className="bg-white border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-text-primary">{stage.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        stage.type === 'KO' 
                          ? 'bg-success-100 text-success-800' 
                          : 'bg-warning-100 text-warning-800'
                      }`}>
                        {stage.type}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteStage(stage.id, stage.name)}
                      className="text-gray-400 hover:text-danger-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-2 text-sm text-text-secondary">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Type:</span>
                      <span className="capitalize">{stage.matchType}</span>
                    </div>
                    
                    {stage.description && (
                      <div>
                        <span className="font-medium">Description:</span>
                        <p className="text-text-secondary mt-1">{stage.description}</p>
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
                  
                  <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={stage.active}
                        onChange={() => handleToggleStageActive(stage.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className={stage.active ? 'text-success-600' : 'text-text-muted'}>
                        {stage.active ? 'Active' : 'Inactive'}
                      </span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {getFilteredStages().length === 0 && (
              <div className="text-center py-8 text-text-muted">
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
                  className="text-primary-600 hover:text-primary-800 ml-1"
                >
                  Add the first one
                </button>
              </div>
            )}
          </div>
        );

      default:
        return (
          <p className="text-text-secondary">Content for {activeTab} will go here</p>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Global Preference</h1>
        <p className="text-text-secondary mt-1">Configure global settings and preferences for the system</p>
      </div>

      <Card padding="none">
        {/* Tab Navigation */}
        <div className="border-b border-border overflow-x-auto">
          <div className="flex min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600 bg-primary-50'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </Card>

      {/* Add Currency Modal */}
      <Modal
        isOpen={isAddCurrencyModalOpen}
        onClose={() => setIsAddCurrencyModalOpen(false)}
        title="Add Currency"
        size="sm"
      >
        <form onSubmit={handleAddCurrency} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Currency Code
            </label>
            <input
              type="text"
              value={newCurrency.code}
              onChange={(e) => setNewCurrency(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
              placeholder="e.g., USD"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Symbol
            </label>
            <input
              type="text"
              value={newCurrency.symbol}
              onChange={(e) => setNewCurrency(prev => ({ ...prev, symbol: e.target.value }))}
              placeholder="e.g., $"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              variant="secondary" 
              onClick={() => setIsAddCurrencyModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Add Currency
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Level System Modal */}
      <Modal
        isOpen={isAddLevelSystemModalOpen}
        onClose={() => setIsAddLevelSystemModalOpen(false)}
        title="Add Level System"
        size="sm"
      >
        <form onSubmit={handleAddLevelSystem} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              System Name
            </label>
            <input
              type="text"
              value={newLevelSystem.name}
              onChange={(e) => setNewLevelSystem({ name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              variant="secondary" 
              onClick={() => setIsAddLevelSystemModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Add System
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Level Modal */}
      <Modal
        isOpen={isAddLevelModalOpen}
        onClose={() => setIsAddLevelModalOpen(false)}
        title="Add Level"
        size="md"
      >
        <form onSubmit={handleAddLevel} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Level Name
            </label>
            <input
              type="text"
              value={newLevel.name}
              onChange={(e) => setNewLevel(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Description
            </label>
            <textarea
              value={newLevel.description}
              onChange={(e) => setNewLevel(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              variant="secondary" 
              onClick={() => setIsAddLevelModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Add Level
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Stage Modal */}
      <Modal
        isOpen={isAddStageModalOpen}
        onClose={() => setIsAddStageModalOpen(false)}
        title={`Add ${selectedStageType} Stage for ${selectedStageMatchType.charAt(0).toUpperCase() + selectedStageMatchType.slice(1)}`}
        size="md"
      >
        <form onSubmit={handleAddStage} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Stage Name
            </label>
            <input
              type="text"
              value={newStage.name}
              onChange={(e) => setNewStage(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder={`e.g., ${selectedStageType} ${selectedStageType === 'KO' ? 'qualifying' : 'Group Stage'}`}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Description
            </label>
            <textarea
              value={newStage.description}
              onChange={(e) => setNewStage(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Describe this stage..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Min Participants
              </label>
              <input
                type="number"
                value={newStage.minParticipants || ''}
                onChange={(e) => setNewStage(prev => ({ 
                  ...prev, 
                  minParticipants: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 8"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Max Participants
              </label>
              <input
                type="number"
                value={newStage.maxParticipants || ''}
                onChange={(e) => setNewStage(prev => ({ 
                  ...prev, 
                  maxParticipants: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 64"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={newStage.active}
              onChange={(e) => setNewStage(prev => ({ ...prev, active: e.target.checked }))}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label className="ml-2 text-sm text-text-primary">Active</label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              variant="secondary" 
              onClick={() => setIsAddStageModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Add Stage
            </Button>
          </div>
        </form>
      </Modal>

      {/* Enhanced Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, type: 'classification', item: null, itemName: '' })}
        onConfirm={handleConfirmDelete}
        title={`Delete ${confirmDialog.type.charAt(0).toUpperCase() + confirmDialog.type.slice(1).replace('-', ' ')}`}
        message={`Are you sure you want to permanently delete this ${confirmDialog.type.replace('-', ' ')}?`}
        itemName={confirmDialog.itemName}
        itemType={confirmDialog.type.charAt(0).toUpperCase() + confirmDialog.type.slice(1).replace('-', ' ')}
        details={[
          `This ${confirmDialog.type.replace('-', ' ')} will be removed from all related records`,
          'Any forms or dropdowns using this option will be updated',
          'Historical data referencing this item will be preserved but marked as archived'
        ]}
        warningLevel="medium"
        confirmText={`Delete ${confirmDialog.type.charAt(0).toUpperCase() + confirmDialog.type.slice(1).replace('-', ' ')}`}
        cancelText="Keep Item"
      />
    </div>
  );
}