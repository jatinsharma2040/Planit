import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, MapPin, Users, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '@/components/AuthModal';
import TripCard from '@/components/TripCard';
import CreateTripModal from '@/components/CreateTripModal';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
}

interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  budget?: number;
  createdBy: string;
  participants: string[];
  tripCode: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCreateTrip, setShowCreateTrip] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored user
    const storedUser = localStorage.getItem('planit_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Load user's trips
    const storedTrips = localStorage.getItem('planit_trips');
    if (storedTrips) {
      setTrips(JSON.parse(storedTrips));
    }
  }, []);

  const handleAuth = (userData: User) => {
    setUser(userData);
    localStorage.setItem('planit_user', JSON.stringify(userData));
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('planit_user');
    localStorage.removeItem('planit_current_trip');
  };

  const handleCreateTrip = (tripData: Omit<Trip, 'id' | 'createdBy' | 'participants' | 'tripCode'>) => {
    if (!user) return;

    const newTrip: Trip = {
      ...tripData,
      id: Date.now().toString(),
      createdBy: user.id,
      participants: [user.id],
      tripCode: Math.random().toString(36).substring(2, 8).toUpperCase()
    };

    const updatedTrips = [...trips, newTrip];
    setTrips(updatedTrips);
    localStorage.setItem('planit_trips', JSON.stringify(updatedTrips));
    setShowCreateTrip(false);
  };

  const handleDeleteTrip = (tripId: string) => {
    const updatedTrips = trips.filter(trip => trip.id !== tripId);
    setTrips(updatedTrips);
    localStorage.setItem('planit_trips', JSON.stringify(updatedTrips));
    
    toast({
      title: "Trip deleted",
      description: "The trip has been successfully deleted."
    });
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleFeatureCardClick = () => {
    if (!user) {
      setAuthMode('login');
      setShowAuthModal(true);
    }
  };

  const userTrips = trips.filter(trip => trip.participants.includes(user?.id || ''));

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleLogoClick}
            >
              Planit
            </h1>
            <div className="flex gap-4">
              <Button 
                onClick={() => {
                  setAuthMode('register');
                  setShowAuthModal(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                Get Started
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setAuthMode('login');
                  setShowAuthModal(true);
                }}
              >
                Sign In
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent mb-6">
              Planit
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Plan epic group trips with friends. Create itineraries, vote on activities, and track budgets together.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card 
              className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
              onClick={handleFeatureCardClick}
            >
              <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Plan Together</h3>
              <p className="text-gray-600">Create shared itineraries and add activities collaboratively</p>
            </Card>
            <Card 
              className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
              onClick={handleFeatureCardClick}
            >
              <Users className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Vote & Decide</h3>
              <p className="text-gray-600">Vote on activities and let the group decide what makes it in</p>
            </Card>
            <Card 
              className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
              onClick={handleFeatureCardClick}
            >
              <Calendar className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Track Budgets</h3>
              <p className="text-gray-600">Keep everyone on budget with real-time expense tracking</p>
            </Card>
          </div>
        </div>

        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode={authMode}
          onAuth={handleAuth}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleLogoClick}
          >
            Planit
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user.name}!</span>
            <Button variant="outline" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Trips</h2>
            <p className="text-gray-600">Plan, collaborate, and create memories together</p>
          </div>
          <Button 
            onClick={() => setShowCreateTrip(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Trip
          </Button>
        </div>

        {userTrips.length === 0 ? (
          <Card className="p-12 text-center">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No trips yet</h3>
            <p className="text-gray-500 mb-6">Create your first trip to get started planning with friends</p>
            <Button 
              onClick={() => setShowCreateTrip(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Trip
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userTrips.map(trip => (
              <TripCard 
                key={trip.id} 
                trip={trip} 
                onDelete={handleDeleteTrip}
                currentUserId={user.id}
              />
            ))}
          </div>
        )}
      </main>

      <CreateTripModal 
        isOpen={showCreateTrip}
        onClose={() => setShowCreateTrip(false)}
        onCreateTrip={handleCreateTrip}
      />
    </div>
  );
};

export default Index;
