
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Calendar, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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

interface User {
  id: string;
  email: string;
  name: string;
}

const JoinTrip = () => {
  const { tripCode } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [codeInput, setCodeInput] = useState(tripCode || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for stored user
    const storedUser = localStorage.getItem('planit_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // If we have a trip code from URL, try to find the trip
    if (tripCode) {
      findTripByCode(tripCode);
    }
  }, [tripCode]);

  const findTripByCode = (code: string) => {
    const storedTrips = localStorage.getItem('planit_trips');
    if (storedTrips) {
      const trips = JSON.parse(storedTrips);
      const foundTrip = trips.find((t: Trip) => t.tripCode.toLowerCase() === code.toLowerCase());
      setTrip(foundTrip || null);
    }
  };

  const handleSearchTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter a trip code",
        variant: "destructive"
      });
      return;
    }

    findTripByCode(codeInput.trim());
    
    if (!trip) {
      toast({
        title: "Trip Not Found",
        description: "No trip found with that code",
        variant: "destructive"
      });
    }
  };

  const handleJoinTrip = async () => {
    if (!user) {
      toast({
        title: "Please Sign In",
        description: "You need to sign in to join a trip",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    if (!trip) return;

    if (trip.participants.includes(user.id)) {
      toast({
        title: "Already Joined",
        description: "You're already a member of this trip!"
      });
      navigate(`/trip/${trip.id}`);
      return;
    }

    setLoading(true);

    try {
      // Add user to trip participants
      const storedTrips = localStorage.getItem('planit_trips');
      if (storedTrips) {
        const trips = JSON.parse(storedTrips);
        const updatedTrips = trips.map((t: Trip) => 
          t.id === trip.id 
            ? { ...t, participants: [...t.participants, user.id] }
            : t
        );
        localStorage.setItem('planit_trips', JSON.stringify(updatedTrips));
      }

      toast({
        title: "Success!",
        description: `You've joined ${trip.name}!`
      });

      navigate(`/trip/${trip.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join trip. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent mb-2">
            Join Trip
          </h1>
          <p className="text-gray-600">
            Enter a trip code to join an existing trip
          </p>
        </div>

        {!trip ? (
          <Card>
            <CardHeader>
              <CardTitle>Find Trip</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearchTrip} className="space-y-4">
                <div>
                  <Label htmlFor="tripCode">Trip Code</Label>
                  <Input
                    id="tripCode"
                    type="text"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                    placeholder="Enter 6-character code"
                    maxLength={6}
                    className="font-mono text-center text-lg"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Find Trip
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {trip.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{trip.participants.length} participant{trip.participants.length !== 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="pt-4 border-t space-y-3">
                {!user ? (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-3">
                      You need to sign in to join this trip
                    </p>
                    <Button onClick={() => navigate('/')} className="w-full">
                      Sign In to Join
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={handleJoinTrip} 
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Joining...' : 'Join This Trip'}
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  onClick={() => setTrip(null)}
                  className="w-full"
                >
                  Search Different Code
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center">
          <Button variant="ghost" onClick={() => navigate('/')}>
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JoinTrip;
