import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  LogOut,
  Eye,
  UserCheck,
  CalendarCheck,
  IndianRupee,
  CreditCard,
  UserMinus,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  Bell,
} from "lucide-react";

// Demo organizer data
const demoOrganizers = [
  {
    id: "1",
    name: "Rajesh Kumar",
    email: "rajesh@events.com",
    phone: "+91 9876543210",
    company: "Raj Events Pvt Ltd",
    eventsCount: 15,
    subscriptionStatus: "active",
    subscriptionStart: "2024-01-15",
    subscriptionEnd: "2025-01-15",
    paymentAmount: 25000,
    joinedDate: "2023-06-20",
  },
  {
    id: "2",
    name: "Priya Sharma",
    email: "priya@celebrations.in",
    phone: "+91 9123456789",
    company: "Celebrations India",
    eventsCount: 28,
    subscriptionStatus: "active",
    subscriptionStart: "2024-03-01",
    subscriptionEnd: "2025-03-01",
    paymentAmount: 25000,
    joinedDate: "2023-08-15",
  },
  {
    id: "3",
    name: "Amit Patel",
    email: "amit@festive.co",
    phone: "+91 8765432109",
    company: "Festive Co",
    eventsCount: 8,
    subscriptionStatus: "expired",
    subscriptionStart: "2023-06-01",
    subscriptionEnd: "2024-06-01",
    paymentAmount: 20000,
    joinedDate: "2023-02-10",
  },
  {
    id: "4",
    name: "Sunita Reddy",
    email: "sunita@eventsplus.in",
    phone: "+91 7654321098",
    company: "Events Plus",
    eventsCount: 0,
    subscriptionStatus: "pending",
    subscriptionStart: null,
    subscriptionEnd: null,
    paymentAmount: 0,
    joinedDate: "2024-12-15",
  },
  {
    id: "5",
    name: "Vikram Singh",
    email: "vikram@royalevents.com",
    phone: "+91 9988776655",
    company: "Royal Events",
    eventsCount: 42,
    subscriptionStatus: "active",
    subscriptionStart: "2024-02-20",
    subscriptionEnd: "2025-02-20",
    paymentAmount: 30000,
    joinedDate: "2022-11-05",
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [admin, setAdmin] = useState(null);
  const [organizers, setOrganizers] = useState(demoOrganizers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Dialog states
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addOrganizerDialogOpen, setAddOrganizerDialogOpen] = useState(false);
  
  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    status: "active",
    amount: "25000",
    notes: "",
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  // New organizer form
  const [newOrganizerForm, setNewOrganizerForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth");
    if (!adminAuth) {
      navigate("/admin/login");
      return;
    }
    setAdmin(JSON.parse(adminAuth));
  }, [navigate]);

  // Stats calculations
  const stats = {
    totalOrganizers: organizers.length,
    activeSubscriptions: organizers.filter(o => o.subscriptionStatus === "active").length,
    pendingApprovals: organizers.filter(o => o.subscriptionStatus === "pending").length,
    totalRevenue: organizers.reduce((sum, o) => sum + o.paymentAmount, 0),
  };

  // Filter organizers
  const filteredOrganizers = organizers.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || org.subscriptionStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    navigate("/admin/login");
  };

  const handleViewOrganizer = (org) => {
    setSelectedOrganizer(org);
    setViewDialogOpen(true);
  };

  const handleOpenPaymentDialog = (org) => {
    setSelectedOrganizer(org);
    setPaymentForm({
      status: "active",
      amount: "25000",
      notes: "",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    setPaymentDialogOpen(true);
  };

  const handleRecordPayment = () => {
    if (!selectedOrganizer || !paymentForm.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Update organizer in state
    setOrganizers(prev => prev.map(org => 
      org.id === selectedOrganizer.id 
        ? {
            ...org,
            subscriptionStatus: paymentForm.status,
            subscriptionStart: paymentForm.startDate,
            subscriptionEnd: paymentForm.endDate,
            paymentAmount: parseInt(paymentForm.amount),
          }
        : org
    ));

    toast({
      title: "Payment Recorded",
      description: `Subscription payment of ₹${paymentForm.amount} recorded for ${selectedOrganizer.name}`,
    });
    setPaymentDialogOpen(false);
    setSelectedOrganizer(null);
  };

  const handleDeleteOrganizer = () => {
    if (!selectedOrganizer) return;

    setOrganizers(prev => prev.filter(org => org.id !== selectedOrganizer.id));

    toast({
      title: "Organizer Removed",
      description: `${selectedOrganizer.name} has been removed from the platform`,
    });
    setDeleteDialogOpen(false);
    setSelectedOrganizer(null);
  };

  const handleAddOrganizer = () => {
    if (!newOrganizerForm.name || !newOrganizerForm.email) {
      toast({
        title: "Error",
        description: "Please fill in name and email",
        variant: "destructive",
      });
      return;
    }

    const newOrganizer = {
      id: Date.now().toString(),
      ...newOrganizerForm,
      eventsCount: 0,
      subscriptionStatus: "pending",
      subscriptionStart: null,
      subscriptionEnd: null,
      paymentAmount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
    };

    setOrganizers(prev => [newOrganizer, ...prev]);
    setNewOrganizerForm({ name: "", email: "", phone: "", company: "" });
    setAddOrganizerDialogOpen(false);

    toast({
      title: "Organizer Added",
      description: `${newOrganizerForm.name} has been added as a new organizer`,
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 border-green-200">Active</Badge>;
      case "expired":
        return <Badge className="bg-red-100 text-red-700 border-red-200">Expired</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="bg-secondary text-secondary-foreground shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/20 rounded-xl">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-display">EventMitra Admin</h1>
                <p className="text-sm text-secondary-foreground/70">
                  Welcome back, {admin.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-secondary-foreground/70 hover:text-secondary-foreground">
                <Bell className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover-lift border-l-4 border-l-primary bg-card/50 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Total Organizers</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalOrganizers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift border-l-4 border-l-green-500 bg-card/50 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <UserCheck className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Active Subscriptions</p>
                  <p className="text-3xl font-bold text-foreground">{stats.activeSubscriptions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift border-l-4 border-l-yellow-500 bg-card/50 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-500/10 rounded-xl">
                  <Clock className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Pending Approvals</p>
                  <p className="text-3xl font-bold text-foreground">{stats.pendingApprovals}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift border-l-4 border-l-accent bg-card/50 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-foreground">₹{stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-card/50 backdrop-blur">
          <CardHeader className="border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Users className="w-5 h-5 text-primary" />
                  Organizer Management
                </CardTitle>
                <CardDescription className="mt-1">
                  Manage organizer subscriptions and track annual payments
                </CardDescription>
              </div>
              <Button onClick={() => setAddOrganizerDialogOpen(true)} className="gradient-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Organizer
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Organizers List */}
            {filteredOrganizers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">No organizers found</p>
                <p className="text-sm">Try adjusting your search or filter</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrganizers.map((org) => (
                  <div
                    key={org.id}
                    className="flex flex-col lg:flex-row lg:items-center justify-between p-5 border rounded-xl gap-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-primary">
                          {org.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate">{org.name}</h3>
                          {getStatusBadge(org.subscriptionStatus)}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{org.email}</p>
                        <p className="text-sm text-muted-foreground">{org.company}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {org.eventsCount} Events
                          </Badge>
                          {org.subscriptionStatus === "active" && org.subscriptionEnd && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Expires: {new Date(org.subscriptionEnd).toLocaleDateString()}
                            </Badge>
                          )}
                          {org.paymentAmount > 0 && (
                            <Badge variant="outline" className="flex items-center gap-1 text-green-600">
                              <IndianRupee className="w-3 h-3" />
                              {org.paymentAmount.toLocaleString()}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewOrganizer(org)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        className="gradient-primary text-primary-foreground"
                        onClick={() => handleOpenPaymentDialog(org)}
                      >
                        <CreditCard className="w-4 h-4 mr-1" />
                        {org.subscriptionStatus === "pending" ? "Activate" : "Renew"}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => {
                          setSelectedOrganizer(org);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <UserMinus className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* View Organizer Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              Organizer Details
            </DialogTitle>
          </DialogHeader>
          {selectedOrganizer && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">
                    {selectedOrganizer.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-xl">{selectedOrganizer.name}</h3>
                  <p className="text-muted-foreground">{selectedOrganizer.company}</p>
                  {getStatusBadge(selectedOrganizer.subscriptionStatus)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedOrganizer.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="font-medium">{selectedOrganizer.phone}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Total Events</Label>
                  <p className="font-medium">{selectedOrganizer.eventsCount}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Joined Date</Label>
                  <p className="font-medium">{new Date(selectedOrganizer.joinedDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-3">Subscription Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedOrganizer.subscriptionStatus)}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Payment Amount</Label>
                    <p className="font-medium">₹{selectedOrganizer.paymentAmount.toLocaleString()}</p>
                  </div>
                  {selectedOrganizer.subscriptionStart && (
                    <div>
                      <Label className="text-muted-foreground">Start Date</Label>
                      <p className="font-medium">{new Date(selectedOrganizer.subscriptionStart).toLocaleDateString()}</p>
                    </div>
                  )}
                  {selectedOrganizer.subscriptionEnd && (
                    <div>
                      <Label className="text-muted-foreground">End Date</Label>
                      <p className="font-medium">{new Date(selectedOrganizer.subscriptionEnd).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            <Button 
              onClick={() => {
                setViewDialogOpen(false);
                handleOpenPaymentDialog(selectedOrganizer);
              }}
              className="gradient-primary text-primary-foreground"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Manage Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Record Annual Subscription
            </DialogTitle>
            <DialogDescription>
              Record subscription payment for {selectedOrganizer?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount (₹) *</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="25000"
                  className="pl-9"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                />
              </div>
              <p className="text-xs text-muted-foreground">Standard annual subscription: ₹25,000</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={paymentForm.startDate}
                  onChange={(e) => setPaymentForm({ ...paymentForm, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={paymentForm.endDate}
                  onChange={(e) => setPaymentForm({ ...paymentForm, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Subscription Status *</Label>
              <Select
                value={paymentForm.status}
                onValueChange={(value) => setPaymentForm({ ...paymentForm, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Payment reference, receipt number, bank details..."
                value={paymentForm.notes}
                onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRecordPayment} className="gradient-primary text-primary-foreground">
              <CheckCircle className="w-4 h-4 mr-2" />
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Organizer Dialog */}
      <Dialog open={addOrganizerDialogOpen} onOpenChange={setAddOrganizerDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Add New Organizer
            </DialogTitle>
            <DialogDescription>
              Add a new organizer to the platform
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Full Name *</Label>
              <Input
                id="orgName"
                placeholder="Enter organizer name"
                value={newOrganizerForm.name}
                onChange={(e) => setNewOrganizerForm({ ...newOrganizerForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orgEmail">Email Address *</Label>
              <Input
                id="orgEmail"
                type="email"
                placeholder="organizer@example.com"
                value={newOrganizerForm.email}
                onChange={(e) => setNewOrganizerForm({ ...newOrganizerForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orgPhone">Phone Number</Label>
              <Input
                id="orgPhone"
                placeholder="+91 9876543210"
                value={newOrganizerForm.phone}
                onChange={(e) => setNewOrganizerForm({ ...newOrganizerForm, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orgCompany">Company Name</Label>
              <Input
                id="orgCompany"
                placeholder="Event Company Pvt Ltd"
                value={newOrganizerForm.company}
                onChange={(e) => setNewOrganizerForm({ ...newOrganizerForm, company: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOrganizerDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddOrganizer} className="gradient-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Organizer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="w-5 h-5" />
              Remove Organizer
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <strong>{selectedOrganizer?.name}</strong> from the platform? 
              This action cannot be undone and they will lose access to create events.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteOrganizer}>
              <Trash2 className="w-4 h-4 mr-2" />
              Remove Organizer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;