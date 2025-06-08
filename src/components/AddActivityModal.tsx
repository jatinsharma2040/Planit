
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface Activity {
  title: string;
  date: string;
  time: string;
  category: 'Adventure' | 'Food' | 'Sightseeing' | 'Other';
  estimatedCost: number;
  notes?: string;
}

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddActivity: (activity: Activity) => void;
  tripStartDate: string;
  tripEndDate: string;
}

const AddActivityModal = ({ isOpen, onClose, onAddActivity, tripStartDate, tripEndDate }: AddActivityModalProps) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState<Activity['category']>('Adventure');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter an activity title",
        variant: "destructive"
      });
      return;
    }

    if (!date || !time) {
      toast({
        title: "Error",
        description: "Please select date and time",
        variant: "destructive"
      });
      return;
    }

    if (!estimatedCost || parseFloat(estimatedCost) < 0) {
      toast({
        title: "Error",
        description: "Please enter a valid cost",
        variant: "destructive"
      });
      return;
    }

    // Validate date is within trip range
    if (date < tripStartDate || date > tripEndDate) {
      toast({
        title: "Error",
        description: "Activity date must be within the trip dates",
        variant: "destructive"
      });
      return;
    }

    const activityData: Activity = {
      title: title.trim(),
      date,
      time,
      category,
      estimatedCost: parseFloat(estimatedCost),
      notes: notes.trim() || undefined
    };

    onAddActivity(activityData);

    // Reset form
    setTitle('');
    setDate('');
    setTime('');
    setCategory('Adventure');
    setEstimatedCost('');
    setNotes('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Activity</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Activity Title</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Kayaking at Baga Beach"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={tripStartDate}
                max={tripEndDate}
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value: Activity['category']) => setCategory(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Adventure">Adventure</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Sightseeing">Sightseeing</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="cost">Estimated Cost ($)</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              min="0"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
              placeholder="e.g., 45.00"
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional details or requirements..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Add Activity
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddActivityModal;
