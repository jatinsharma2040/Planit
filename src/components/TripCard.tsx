
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, DollarSign, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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
  onDelete?: (tripId: string) => void;
  currentUserId?: string;
}

const TripCard = ({ trip, onDelete, currentUserId }: TripCardProps) => {
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

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when delete button is clicked
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(trip.id);
    }
  };

  const canDelete = currentUserId === trip.createdBy;

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer group relative"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
            {trip.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {trip.tripCode}
            </Badge>
            {canDelete && onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={handleDeleteClick}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Trip</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{trip.name}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
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
