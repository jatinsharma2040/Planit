
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

interface TripCardProps {
  trip: Trip;
}

const TripCard = ({ trip }: TripCardProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysDifference = () => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  const handleCardClick = () => {
    localStorage.setItem('planit_current_trip', trip.id);
    navigate(`/trip/${trip.id}`);
  };

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
            {trip.name}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {trip.tripCode}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)} 
            <span className="text-gray-400 ml-1">({getDaysDifference()} days)</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>{trip.participants.length} participant{trip.participants.length !== 1 ? 's' : ''}</span>
        </div>

        {trip.budget && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="h-4 w-4" />
            <span>Budget: ${trip.budget}</span>
          </div>
        )}

        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500">
            Click to view and manage this trip
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripCard;
