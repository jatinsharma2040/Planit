
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, Share2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripCode: string;
  tripName: string;
}

const InviteModal = ({ isOpen, onClose, tripCode, tripName }: InviteModalProps) => {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');

  const inviteLink = `${window.location.origin}/join/${tripCode}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Invite link copied to clipboard"
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive"
      });
    }
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    // Mock email sending - in real app would call API
    toast({
      title: "Invitation Sent!",
      description: `Invitation sent to ${email}`
    });
    
    setEmail('');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join my trip: ${tripName}`,
          text: `You're invited to join "${tripName}" on Planit! Use code: ${tripCode}`,
          url: inviteLink
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Friends</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Trip Code */}
          <div>
            <Label>Trip Code</Label>
            <div className="flex gap-2 mt-1">
              <Input 
                value={tripCode} 
                readOnly 
                className="font-mono text-center text-lg font-bold"
              />
              <Button variant="outline" onClick={handleCopyLink}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Share this code for friends to join your trip
            </p>
          </div>

          {/* Share Link */}
          <div>
            <Label>Invite Link</Label>
            <div className="flex gap-2 mt-1">
              <Input 
                value={inviteLink} 
                readOnly 
                className="text-sm"
              />
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Email Invitation */}
          <form onSubmit={handleSendEmail} className="space-y-3">
            <Label htmlFor="email">Send Email Invitation</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="friend@example.com"
                className="flex-1"
              />
              <Button type="submit">Send</Button>
            </div>
          </form>

          <div className="pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="w-full">
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
