import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalSettingsProvider } from './context/GlobalSettingsContext';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { DataPersistenceProvider } from './context/DataPersistenceContext';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Login from './pages/Login';

// Import pages
import Dashboard from './pages/Dashboard';
import Tournaments from './pages/Tournaments';
import Leagues from './pages/Leagues';
import Users from './pages/Users';
import Clubs from './pages/Clubs';
import Coaches from './pages/Coaches';
import Referees from './pages/Referees';
import Players from './pages/Players';
import Organizations from './pages/Organizations';
import GlobalSettings from './pages/GlobalSettings';
import SystemSettings from './pages/SystemSettings';
import Information from './pages/Information';
import Support from './pages/Support';
import Ranking from './pages/Ranking';
import Reports from './pages/Reports';
import Publishing from './pages/Publishing';
import Advertising from './pages/Advertising';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <GlobalSettingsProvider>
          <DataPersistenceProvider>
            <Router>
              <Routes>
                {/* Public route */}
                <Route path="/login" element={<Login />} />
                
                {/* Protected routes */}
                <Route path="/*" element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-gray-25 font-inter">
                      <Sidebar isCollapsed={false} setIsCollapsed={() => {}} />
                      <Header />
                      
                      <main className="ml-64 pt-16 p-6">
                        <div className="pt-6">
                          <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/tournaments" element={<Tournaments />} />
                            <Route path="/leagues" element={<Leagues />} />
                            <Route path="/users" element={<Users />} />
                            <Route path="/clubs" element={<Clubs />} />
                            <Route path="/coaches" element={<Coaches />} />
                            <Route path="/referees" element={<Referees />} />
                            <Route path="/players" element={<Players />} />
                            <Route path="/organizations" element={<Organizations />} />
                            <Route path="/global-settings" element={<GlobalSettings />} />
                            <Route path="/system-settings" element={<SystemSettings />} />
                            <Route path="/information" element={<Information />} />
                            <Route path="/support" element={<Support />} />
                            <Route path="/ranking" element={<Ranking />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/publishing" element={<Publishing />} />
                            <Route path="/advertising" element={<Advertising />} />
                            <Route path="/profile" element={<Profile />} />
                          </Routes>
                        </div>
                      </main>
                    </div>
                  </ProtectedRoute>
                } />
              </Routes>
            </Router>
          </DataPersistenceProvider>
        </GlobalSettingsProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;