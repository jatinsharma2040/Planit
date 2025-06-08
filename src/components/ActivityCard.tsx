
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, Clock, DollarSign, MapPin } from 'lucide-react';

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

interface ActivityCardProps {
  activity: Activity;
  onVote: (activityId: string) => void;
  currentUserId: string;
  participantCount: number;
}

const ActivityCard = ({ activity, onVote, currentUserId, participantCount }: ActivityCardProps) => {
  const hasVoted = activity.votes.includes(currentUserId);
  const voteCount = activity.votes.length;
  const isLockedIn = voteCount >= Math.ceil(participantCount / 2);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Adventure':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Food':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Sightseeing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Card className={`transition-all hover:shadow-md ${isLockedIn ? 'ring-2 ring-green-500 bg-green-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {activity.title}
              {isLockedIn && (
                <Badge className="bg-green-500 text-white">
                  Locked In
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTime(activity.time)}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                ${activity.estimatedCost}
              </span>
            </div>
          </div>
          <Badge variant="outline" className={getCategoryColor(activity.category)}>
            {activity.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {activity.notes && (
          <p className="text-gray-600 text-sm">{activity.notes}</p>
        )}

        <div className="flex justify-between items-center pt-2 border-t">
          <div className="flex items-center gap-2">
            <Button
              variant={hasVoted ? "default" : "outline"}
              size="sm"
              onClick={() => onVote(activity.id)}
              className={hasVoted ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              <ThumbsUp className={`h-4 w-4 mr-1 ${hasVoted ? 'fill-current' : ''}`} />
              {voteCount}
            </Button>
            <span className="text-sm text-gray-500">
              {voteCount === 0 ? 'No votes yet' : 
               voteCount === 1 ? '1 vote' : 
               `${voteCount} votes`}
            </span>
          </div>

          {isLockedIn && (
            <div className="text-sm text-green-600 font-medium">
              ✓ Added to itinerary
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
