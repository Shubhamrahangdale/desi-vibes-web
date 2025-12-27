import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, Mail, Lock, Eye, EyeOff, Calendar } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Demo admin credentials
  const ADMIN_EMAIL = "admin@eventmitra.com";
  const ADMIN_PASSWORD = "admin123";

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Store admin session
      localStorage.setItem("adminAuth", JSON.stringify({ 
        email: ADMIN_EMAIL, 
        name: "Admin",
        role: "admin",
        loginTime: new Date().toISOString()
      }));
      
      toast({
        title: "Welcome Admin!",
        description: "Successfully logged in to admin panel",
      });
      navigate("/admin/dashboard");
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 pattern-overlay opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/95 to-primary/20" />
        
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
              <Calendar className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <span className="font-display text-3xl font-bold text-secondary-foreground">
                Event<span className="text-primary">Mitra</span>
              </span>
              <p className="text-secondary-foreground/60 text-sm">Admin Portal</p>
            </div>
          </div>
          
          <h1 className="font-display text-4xl xl:text-5xl font-bold text-secondary-foreground leading-tight mb-6">
            Manage Your
            <span className="block text-primary">Event Platform</span>
          </h1>
          
          <p className="text-secondary-foreground/70 text-lg max-w-md mb-12">
            Control organizer subscriptions, approve events, and monitor your platform's growth from one powerful dashboard.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-secondary-foreground/5 rounded-xl p-4 backdrop-blur">
              <p className="text-3xl font-bold text-primary">500+</p>
              <p className="text-secondary-foreground/60 text-sm">Active Events</p>
            </div>
            <div className="bg-secondary-foreground/5 rounded-xl p-4 backdrop-blur">
              <p className="text-3xl font-bold text-primary">150+</p>
              <p className="text-secondary-foreground/60 text-sm">Organizers</p>
            </div>
            <div className="bg-secondary-foreground/5 rounded-xl p-4 backdrop-blur">
              <p className="text-3xl font-bold text-primary">50K+</p>
              <p className="text-secondary-foreground/60 text-sm">Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-md">
              <Calendar className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold text-foreground">
              Event<span className="text-primary">Mitra</span>
            </span>
          </div>

          <Card className="border-0 shadow-2xl shadow-primary/5">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-display text-center">Admin Login</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access the admin panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@eventmitra.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 pr-11 h-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 gradient-primary text-primary-foreground font-semibold text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Sign In to Admin Panel
                    </>
                  )}
                </Button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-border/50">
                <p className="text-sm font-medium text-foreground mb-2">Demo Credentials:</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Email: <span className="font-mono text-foreground">admin@eventmitra.com</span></p>
                  <p>Password: <span className="font-mono text-foreground">admin123</span></p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Secure admin access only</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;