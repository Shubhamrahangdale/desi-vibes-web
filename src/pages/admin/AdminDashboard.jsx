import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
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
} from "lucide-react";

const AdminDashboard = () => {
  const { admin, isLoading, logoutAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [pendingOrganizers, setPendingOrganizers] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrganizers: 0,
    totalEvents: 0,
    pendingApprovals: 0,
  });
  const [loadingData, setLoadingData] = useState(true);

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
      // Fetch pending organizer applications (users with organizer role but no approved status)
      const { data: organizerRoles } = await supabase
        .from("user_roles")
        .select(`
          user_id,
          role,
          created_at,
          profiles!inner(full_name, phone)
        `)
        .eq("role", "organizer");

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

      setPendingOrganizers(organizerRoles || []);
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
              <Shield className="w-8 h-8 text-primary" />
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
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <UserCheck className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Organizers</p>
                  <p className="text-2xl font-bold">{stats.totalOrganizers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Calendar className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                  <p className="text-2xl font-bold">{stats.totalEvents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-destructive/10 rounded-lg">
                  <Clock className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Management */}
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="events" className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4" />
              Event Approvals
            </TabsTrigger>
            <TabsTrigger value="organizers" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Organizers
            </TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Pending Event Approvals
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingEvents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                    <p>No pending events to approve</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{event.title}</h3>
                            <Badge variant="secondary">{event.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {event.location} • {event.city} • {new Date(event.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Price: ₹{event.price || "Free"} • Tickets: {event.total_tickets}
                          </p>
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
                            className="gradient-primary"
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

          {/* Organizers Tab */}
          <TabsContent value="organizers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Registered Organizers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingOrganizers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4" />
                    <p>No organizers registered yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingOrganizers.map((org) => (
                      <div
                        key={org.user_id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">
                              {org.profiles?.full_name || "Unknown"}
                            </h3>
                            <Badge className="bg-green-100 text-green-800">
                              {org.role}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Phone: {org.profiles?.phone || "N/A"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Joined: {new Date(org.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
