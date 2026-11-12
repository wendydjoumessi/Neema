import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Mail, Lock, User as UserIcon, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { User } from '@/types/pregnancy';
import pregnantWoman1 from '@/assets/pregnant-woman-1.jpg';
import logo from '@/assets/logo.png';

interface AuthScreenProps {
  onAuth: (user: User) => void;
  onBack: () => void;
  defaultRole: 'mother' | 'partner';
}

export function AuthScreen({ onAuth, onBack, defaultRole }: AuthScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate auth
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: Date.now().toString(),
      name: loginEmail.split('@')[0],
      email: loginEmail,
      role: defaultRole,
    };
    
    onAuth(user);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate auth
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: Date.now().toString(),
      name: signupName,
      email: signupEmail,
      role: defaultRole,
    };
    
    onAuth(user);
  };

  const handleGuestLogin = () => {
    const user: User = {
      id: 'guest',
      name: 'Guest User',
      email: 'guest@neema.app',
      role: defaultRole,
    };
    onAuth(user);
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={pregnantWoman1} 
          alt="" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex flex-col px-6 md:px-8 lg:px-12 pt-safe-top pb-8">
        {/* Header with Back and Logo */}
        <div className="flex items-center justify-between mb-6 mt-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <img src={logo} alt="Neema" className="h-12 md:h-14 w-auto" />
        </div>

        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Welcome to Neema
          </h1>
          <p className="text-muted-foreground mt-2">
            {defaultRole === 'mother' 
              ? 'Create your pregnancy journey account'
              : 'Join as a supportive partner'}
          </p>
        </div>

        <div className="flex-1 max-w-md mx-auto w-full">
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 mb-6 h-12 bg-muted/50 backdrop-blur">
              <TabsTrigger value="login" className="text-sm font-medium">Log In</TabsTrigger>
              <TabsTrigger value="signup" className="text-sm font-medium">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <Card className="border-0 shadow-xl bg-card/95 backdrop-blur">
                  <CardContent className="p-5 space-y-4">
                    <div>
                      <Label htmlFor="login-email" className="text-sm font-medium mb-2 block">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="your@email.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="h-12 pl-10 bg-background/50"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="login-password" className="text-sm font-medium mb-2 block">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="h-12 pl-10 pr-10 bg-background/50"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button variant="link" className="px-0 text-sm text-primary">
                      Forgot password?
                    </Button>
                  </CardContent>
                </Card>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full h-14 text-lg neema-gradient-primary text-primary-foreground shadow-xl"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Log In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <Card className="border-0 shadow-xl bg-card/95 backdrop-blur">
                  <CardContent className="p-5 space-y-4">
                    <div>
                      <Label htmlFor="signup-name" className="text-sm font-medium mb-2 block">
                        Full Name
                      </Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Your name"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          className="h-12 pl-10 bg-background/50"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="signup-email" className="text-sm font-medium mb-2 block">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="your@email.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          className="h-12 pl-10 bg-background/50"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="signup-password" className="text-sm font-medium mb-2 block">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a password"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className="h-12 pl-10 pr-10 bg-background/50"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        At least 6 characters
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full h-14 text-lg neema-gradient-primary text-primary-foreground shadow-xl"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-muted-foreground">or</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="lg" 
              className="w-full mt-4 h-14 bg-card/50 backdrop-blur border-2"
              onClick={handleGuestLogin}
            >
              Continue as Guest
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
