
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Share2, Users, Calendar, DollarSign } from 'lucide-react';
import ActivityCard from '@/components/ActivityCard';
import AddActivityModal from '@/components/AddActivityModal';
import BudgetOverview from '@/components/BudgetOverview';
import InviteModal from '@/components/InviteModal';
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

interface Activity {
  id: string;
  tripId: string;
  title: string;
  date: string;
  time: string;
  category: 'Adventure' | 'Food' | 'Sightseeing' | 'Other';
  estimatedCost: number;
  notes?: string;
  createdBy: string;
  votes: string[];
}

interface User {
  id: string;
  email: string;
  name: string;
}

const TripDetail = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get current user
    const storedUser = localStorage.getItem('planit_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/');
      return;
    }

    // Load trip data
    const storedTrips = localStorage.getItem('planit_trips');
    if (storedTrips) {
      const trips = JSON.parse(storedTrips);
      const currentTrip = trips.find((t: Trip) => t.id === tripId);
      if (currentTrip) {
        setTrip(currentTrip);
      } else {
        toast({
          title: "Error",
          description: "Trip not found",
          variant: "destructive"
        });
        navigate('/');
        return;
      }
    }

    // Load activities for this trip
    const storedActivities = localStorage.getItem('planit_activities');
    if (storedActivities) {
      const allActivities = JSON.parse(storedActivities);
      const tripActivities = allActivities.filter((a: Activity) => a.tripId === tripId);
      setActivities(tripActivities);
    }
  }, [tripId, navigate]);

  const handleAddActivity = (activityData: Omit<Activity, 'id' | 'tripId' | 'createdBy' | 'votes'>) => {
    if (!user || !trip) return;

    const newActivity: Activity = {
      ...activityData,
      id: Date.now().toString(),
      tripId: trip.id,
      createdBy: user.id,
      votes: []
    };

    const updatedActivities = [...activities, newActivity];
    setActivities(updatedActivities);

    // Update localStorage
    const storedActivities = localStorage.getItem('planit_activities');
    const allActivities = storedActivities ? JSON.parse(storedActivities) : [];
    const otherTripActivities = allActivities.filter((a: Activity) => a.tripId !== tripId);
    const newAllActivities = [...otherTripActivities, ...updatedActivities];
    localStorage.setItem('planit_activities', JSON.stringify(newAllActivities));

    setShowAddActivity(false);
    toast({
      title: "Success",
      description: "Activity added successfully!"
    });
  };

  const handleVote = (activityId: string) => {
    if (!user) return;

    const updatedActivities = activities.map(activity => {
      if (activity.id === activityId) {
        const hasVoted = activity.votes.includes(user.id);
        const newVotes = hasVoted 
          ? activity.votes.filter(id => id !== user.id)
          : [...activity.votes, user.id];
        
        return { ...activity, votes: newVotes };
      }
      return activity;
    });

    setActivities(updatedActivities);

    // Update localStorage
    const storedActivities = localStorage.getItem('planit_activities');
    const allActivities = storedActivities ? JSON.parse(storedActivities) : [];
    const otherTripActivities = allActivities.filter((a: Activity) => a.tripId !== tripId);
    const newAllActivities = [...otherTripActivities, ...updatedActivities];
    localStorage.setItem('planit_activities', JSON.stringify(newAllActivities));
  };

  const groupActivitiesByDate = () => {
    const grouped: { [date: string]: Activity[] } = {};
    activities.forEach(activity => {
      if (!grouped[activity.date]) {
        grouped[activity.date] = [];
      }
      grouped[activity.date].push(activity);
    });
    
    // Sort activities within each date by time
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => a.time.localeCompare(b.time));
    });

    return grouped;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!trip || !user) {
    return <div>Loading...</div>;
  }

  const groupedActivities = groupActivitiesByDate();
  const sortedDates = Object.keys(groupedActivities).sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Trips
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{trip.name}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {trip.participants.length} participant{trip.participants.length !== 1 ? 's' : ''}
                  </span>
                  {trip.budget && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      Budget: ${trip.budget}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Code: {trip.tripCode}</Badge>
              <Button variant="outline" onClick={() => setShowInviteModal(true)}>
                <Share2 className="h-4 w-4 mr-2" />
                Invite
              </Button>
              <Button onClick={() => setShowAddActivity(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Activity
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-6">
            {sortedDates.length === 0 ? (
              <Card className="p-12 text-center">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No activities yet</h3>
                <p className="text-gray-500 mb-6">Start planning by adding your first activity</p>
                <Button onClick={() => setShowAddActivity(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Activity
                </Button>
              </Card>
            ) : (
              sortedDates.map(date => (
                <div key={date} className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                    {formatDate(date)}
                  </h3>
                  <div className="grid gap-4">
                    {groupedActivities[date].map(activity => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        onVote={handleVote}
                        currentUserId={user.id}
                        participantCount={trip.participants.length}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="budget">
            <BudgetOverview
              activities={activities}
              totalBudget={trip.budget}
            />
          </TabsContent>
        </Tabs>
      </main>

      <AddActivityModal
        isOpen={showAddActivity}
        onClose={() => setShowAddActivity(false)}
        onAddActivity={handleAddActivity}
        tripStartDate={trip.startDate}
        tripEndDate={trip.endDate}
      />

      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        tripCode={trip.tripCode}
        tripName={trip.name}
      />
    </div>
  );
};

export default TripDetail;
