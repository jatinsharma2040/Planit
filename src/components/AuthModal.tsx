
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onAuth: (user: User) => void;
}

const AuthModal = ({ isOpen, onClose, mode, onAuth }: AuthModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock authentication - in real app would call API
    try {
      if (mode === 'register') {
        if (!name.trim()) {
          toast({
            title: "Error",
            description: "Please enter your name",
            variant: "destructive"
          });
          return;
        }

        // Check if user already exists
        const existingUsers = JSON.parse(localStorage.getItem('planit_users') || '[]');
        if (existingUsers.find((u: User) => u.email === email)) {
          toast({
            title: "Error", 
            description: "User already exists with this email",
            variant: "destructive"
          });
          return;
        }

        // Create new user
        const newUser: User = {
          id: Date.now().toString(),
          email,
          name: name.trim()
        };

        existingUsers.push(newUser);
        localStorage.setItem('planit_users', JSON.stringify(existingUsers));
        
        toast({
          title: "Success",
          description: "Account created successfully!"
        });
        
        onAuth(newUser);
      } else {
        // Login
        const existingUsers = JSON.parse(localStorage.getItem('planit_users') || '[]');
        const user = existingUsers.find((u: User) => u.email === email);
        
        if (!user) {
          toast({
            title: "Error",
            description: "No account found with this email",
            variant: "destructive"
          });
          return;
        }

        toast({
          title: "Success", 
          description: "Logged in successfully!"
        });
        
        onAuth(user);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            disabled={loading}
          >
            {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
