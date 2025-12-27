import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Edit,
  Trash2,
  UserMinus,
} from "lucide-react";

const AdminDashboard = () => {
  const { admin, isLoading, logoutAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [organizers, setOrganizers] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrganizers: 0,
    totalEvents: 0,
    pendingApprovals: 0,
  });
  const [loadingData, setLoadingData] = useState(true);
  
  // Organizer management dialogs
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    status: "active",
    amount: "",
    notes: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (!isLoading && !admin) {
      navigate("/admin/login");
    }
  }, [admin, isLoading, navigate]);

  useEffect(() => {
    if (admin) {
      fetchDashboardData();
    }
  }, [admin]);

  const fetchDashboardData = async () => {
    setLoadingData(true);
    try {
      // Fetch all organizers with their profile info
      const { data: organizerRoles } = await supabase
        .from("user_roles")
        .select(`
          user_id,
          role,
          created_at
        `)
        .eq("role", "organizer");

      // Fetch profiles for organizers
      const organizerUserIds = organizerRoles?.map(o => o.user_id) || [];
      let organizersWithProfiles = [];
      
      if (organizerUserIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("*")
          .in("user_id", organizerUserIds);

        // Fetch event counts for each organizer
        const { data: eventCounts } = await supabase
          .from("events")
          .select("organizer_id")
          .in("organizer_id", organizerUserIds);

        const eventCountMap = eventCounts?.reduce((acc, e) => {
          acc[e.organizer_id] = (acc[e.organizer_id] || 0) + 1;
          return acc;
        }, {}) || {};

        organizersWithProfiles = organizerRoles?.map(org => ({
          ...org,
          profile: profiles?.find(p => p.user_id === org.user_id),
          eventCount: eventCountMap[org.user_id] || 0,
        })) || [];
      }

      // Fetch pending events (not published)
      const { data: events } = await supabase
        .from("events")
        .select("*")
        .eq("is_published", false)
        .order("created_at", { ascending: false });

      // Get stats
      const { count: userCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      const { count: organizerCount } = await supabase
        .from("user_roles")
        .select("*", { count: "exact", head: true })
        .eq("role", "organizer");

      const { count: eventCount } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true });

      setOrganizers(organizersWithProfiles);
      setPendingEvents(events || []);
      setStats({
        totalUsers: userCount || 0,
        totalOrganizers: organizerCount || 0,
        totalEvents: eventCount || 0,
        pendingApprovals: (events?.length || 0),
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const handleApproveEvent = async (eventId) => {
    try {
      const { error } = await supabase
        .from("events")
        .update({ is_published: true })
        .eq("id", eventId);

      if (error) throw error;

      toast({
        title: "Event Approved",
        description: "The event is now live and visible to users",
      });
      fetchDashboardData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve event",
        variant: "destructive",
      });
    }
  };

  const handleRejectEvent = async (eventId) => {
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

      if (error) throw error;

      toast({
        title: "Event Rejected",
        description: "The event has been removed",
      });
      fetchDashboardData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject event",
        variant: "destructive",
      });
    }
  };

  const handleViewOrganizer = (org) => {
    setSelectedOrganizer(org);
    setViewDialogOpen(true);
  };

  const handleOpenPaymentDialog = (org) => {
    setSelectedOrganizer(org);
    setPaymentForm({
      status: "active",
      amount: "",
      notes: "",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    setPaymentDialogOpen(true);
  };

  const handleRecordPayment = async () => {
    if (!selectedOrganizer || !paymentForm.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Payment Recorded",
      description: `Subscription payment of ₹${paymentForm.amount} recorded for ${selectedOrganizer.profile?.full_name}`,
    });
    setPaymentDialogOpen(false);
    setSelectedOrganizer(null);
  };

  const handleDeleteOrganizer = async () => {
    if (!selectedOrganizer) return;

    try {
      // Remove organizer role (demote to attendee)
      const { error } = await supabase
        .from("user_roles")
        .update({ role: "attendee" })
        .eq("user_id", selectedOrganizer.user_id)
        .eq("role", "organizer");

      if (error) throw error;

      toast({
        title: "Organizer Removed",
        description: "The user has been demoted to attendee",
      });
      setDeleteDialogOpen(false);
      setSelectedOrganizer(null);
      fetchDashboardData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove organizer",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    navigate("/admin/login");
  };

  if (isLoading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-secondary text-secondary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">EventMitra Admin</h1>
                <p className="text-sm text-secondary-foreground/70">
                  Welcome, {admin.full_name || "Admin"}
                </p>
              </div>
            </div>
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
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover-lift border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Total Users</p>
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift border-l-4 border-l-accent">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-xl">
                  <UserCheck className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Organizers</p>
                  <p className="text-3xl font-bold">{stats.totalOrganizers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift border-l-4 border-l-secondary">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-xl">
                  <Calendar className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Total Events</p>
                  <p className="text-3xl font-bold">{stats.totalEvents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift border-l-4 border-l-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-destructive/10 rounded-xl">
                  <Clock className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Pending</p>
                  <p className="text-3xl font-bold">{stats.pendingApprovals}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Management */}
        <Tabs defaultValue="organizers" className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-2 p-1 bg-muted">
            <TabsTrigger value="organizers" className="flex items-center gap-2 data-[state=active]:bg-background">
              <UserCheck className="w-4 h-4" />
              Manage Organizers
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2 data-[state=active]:bg-background">
              <CalendarCheck className="w-4 h-4" />
              Event Approvals
            </TabsTrigger>
          </TabsList>

          {/* Organizers Tab */}
          <TabsContent value="organizers">
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Organizer Management
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Manage organizer subscriptions and track payments
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {organizers.length} Total
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {organizers.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">No organizers registered yet</p>
                    <p className="text-sm">Organizers will appear here once they sign up</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {organizers.map((org) => (
                      <div
                        key={org.user_id}
                        className="flex flex-col lg:flex-row lg:items-center justify-between p-5 border rounded-xl gap-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-bold">
                                {org.profile?.full_name?.charAt(0)?.toUpperCase() || "O"}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {org.profile?.full_name || "Unknown Organizer"}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {org.profile?.phone || "No phone provided"}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 mt-3">
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {org.eventCount} Events
                            </Badge>
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Joined {new Date(org.created_at).toLocaleDateString()}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
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
                            Record Payment
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
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Pending Event Approvals
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Review and approve events submitted by organizers
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {pendingEvents.length} Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {pendingEvents.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500 opacity-50" />
                    <p className="text-lg font-medium">All caught up!</p>
                    <p className="text-sm">No pending events to approve</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex flex-col lg:flex-row lg:items-center justify-between p-5 border rounded-xl gap-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-foreground">{event.title}</h3>
                            <Badge>{event.category}</Badge>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              📍 {event.location}, {event.city}
                            </span>
                            <span className="flex items-center gap-1">
                              📅 {new Date(event.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <IndianRupee className="w-3 h-3" />
                              {event.price || "Free"}
                            </span>
                            <span className="flex items-center gap-1">
                              🎫 {event.total_tickets} tickets
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectEvent(event.id)}
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApproveEvent(event.id)}
                            className="gradient-primary text-primary-foreground"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* View Organizer Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              Organizer Details
            </DialogTitle>
          </DialogHeader>
          {selectedOrganizer && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {selectedOrganizer.profile?.full_name?.charAt(0)?.toUpperCase() || "O"}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedOrganizer.profile?.full_name}</h3>
                  <Badge className="mt-1">Organizer</Badge>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{selectedOrganizer.profile?.phone || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Events:</span>
                  <span className="font-medium">{selectedOrganizer.eventCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Joined:</span>
                  <span className="font-medium">
                    {new Date(selectedOrganizer.created_at).toLocaleDateString()}
                  </span>
                </div>
                {selectedOrganizer.profile?.bio && (
                  <div className="pt-2">
                    <span className="text-muted-foreground">Bio:</span>
                    <p className="mt-1 text-sm">{selectedOrganizer.profile.bio}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
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
              Record Subscription Payment
            </DialogTitle>
            <DialogDescription>
              Record annual subscription payment for {selectedOrganizer?.profile?.full_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount (₹)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  className="pl-9"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={paymentForm.startDate}
                  onChange={(e) => setPaymentForm({ ...paymentForm, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={paymentForm.endDate}
                  onChange={(e) => setPaymentForm({ ...paymentForm, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Subscription Status</Label>
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
                placeholder="Payment reference, receipt number, etc."
                value={paymentForm.notes}
                onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRecordPayment} className="gradient-primary text-primary-foreground">
              Record Payment
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
              Are you sure you want to remove <strong>{selectedOrganizer?.profile?.full_name}</strong> as an organizer? 
              They will be demoted to a regular attendee and won't be able to create events.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteOrganizer}>
              Remove Organizer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;