import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MoreHorizontal, Eye, Check, X, CreditCard, UserMinus, Calendar, IndianRupee, Clock } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useOrganisers } from '@/context/OrganiserContext';
import { useAdmin } from '@/context/AdminContext';
import { useToast } from '@/hooks/use-toast';

const AdminOrganisers = () => {
  const { organisers, approveOrganiser, rejectOrganiser, setOrganiserInactive, updateSubscription } = useOrganisers();
  const { isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrganiser, setSelectedOrganiser] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
  const [subscriptionForm, setSubscriptionForm] = useState({
    plan: 'Annual Premium',
    amount: '25000',
    expiryDate: '',
    eventsAllowed: '50',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const filteredOrganisers = organisers.filter((o) => {
    const matchesSearch = o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const handleApprove = (org) => {
    approveOrganiser(org.id);
    toast({
      title: 'Organiser Approved',
      description: `${org.name} has been approved successfully.`,
    });
  };

  const handleReject = (org) => {
    rejectOrganiser(org.id);
    toast({
      title: 'Organiser Rejected',
      description: `${org.name} has been rejected.`,
      variant: 'destructive',
    });
  };

  const handleSetInactive = (org) => {
    setOrganiserInactive(org.id);
    toast({
      title: 'Organiser Deactivated',
      description: `${org.name} has been set to inactive.`,
    });
  };

  const handleOpenSubscriptionDialog = (org) => {
    setSelectedOrganiser(org);
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    setSubscriptionForm({
      plan: 'Annual Premium',
      amount: '25000',
      expiryDate: nextYear.toISOString().split('T')[0],
      eventsAllowed: '50',
    });
    setSubscriptionDialogOpen(true);
  };

  const handleSaveSubscription = () => {
    if (!selectedOrganiser) return;

    updateSubscription(selectedOrganiser.id, {
      status: 'active',
      plan: subscriptionForm.plan,
      amount: parseInt(subscriptionForm.amount),
      expiryDate: subscriptionForm.expiryDate,
      eventsAllowed: parseInt(subscriptionForm.eventsAllowed),
    });

    toast({
      title: 'Subscription Updated',
      description: `Subscription for ${selectedOrganiser.name} has been activated.`,
    });
    setSubscriptionDialogOpen(false);
    setSelectedOrganiser(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/10 text-green-600 border border-green-500/20">Active</Badge>;
      case 'pending':
        return <Badge className="bg-accent/10 text-accent border border-accent/20">Pending</Badge>;
      case 'inactive':
        return <Badge className="bg-muted text-muted-foreground border border-border">Inactive</Badge>;
      case 'rejected':
        return <Badge className="bg-destructive/10 text-destructive border border-destructive/20">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getSubscriptionBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/10 text-green-600 border border-green-500/20">Active</Badge>;
      case 'expired':
        return <Badge className="bg-destructive/10 text-destructive border border-destructive/20">Expired</Badge>;
      case 'pending':
        return <Badge className="bg-accent/10 text-accent border border-accent/20">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Manage Organisers</h1>
          <p className="text-muted-foreground">
            Approve registrations, manage subscriptions, and track organiser activity
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{organisers.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{organisers.filter(o => o.status === 'pending').length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{organisers.filter(o => o.status === 'active').length}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  ₹{organisers.filter(o => o.subscription.status === 'active').reduce((sum, o) => sum + o.subscription.amount, 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Revenue</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="bg-card border-border mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Organisers Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Organisers ({filteredOrganisers.length})</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Organiser</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Contact</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Subscription</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Events</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrganisers.map((org) => (
                    <tr key={org.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                            {org.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{org.name}</p>
                            <p className="text-sm text-muted-foreground">{org.company}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <p className="text-foreground">{org.email}</p>
                        <p className="text-sm text-muted-foreground">{org.phone}</p>
                      </td>

                      <td className="py-4 px-4">
                        {getStatusBadge(org.status)}
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          {getSubscriptionBadge(org.subscription.status)}
                          {org.subscription.status === 'active' && (
                            <p className="text-xs text-muted-foreground">
                              Expires: {new Date(org.subscription.expiryDate).toLocaleDateString('en-IN')}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="text-foreground font-medium">{org.eventsManaged}</span>
                        <span className="text-muted-foreground"> / {org.subscription.eventsAllowed || '0'}</span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        {org.status === 'pending' ? (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" onClick={() => handleApprove(org)} className="bg-green-600 hover:bg-green-700 text-white">
                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(org)}>
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <MoreHorizontal className="w-5 h-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setSelectedOrganiser(org); setViewDialogOpen(true); }}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenSubscriptionDialog(org)}>
                                <CreditCard className="w-4 h-4 mr-2" />
                                Manage Subscription
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {org.status === 'active' && (
                                <DropdownMenuItem onClick={() => handleSetInactive(org)} className="text-destructive">
                                  <UserMinus className="w-4 h-4 mr-2" />
                                  Set Inactive
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredOrganisers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No organisers found.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* View Details Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Organiser Details</DialogTitle>
            </DialogHeader>
            {selectedOrganiser && (
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                    {selectedOrganiser.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{selectedOrganiser.name}</h3>
                    <p className="text-muted-foreground">{selectedOrganiser.company}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{selectedOrganiser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">{selectedOrganiser.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    {getStatusBadge(selectedOrganiser.status)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="font-medium text-foreground">{new Date(selectedOrganiser.joinedDate).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Subscription</p>
                    {getSubscriptionBadge(selectedOrganiser.subscription.status)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Plan</p>
                    <p className="font-medium text-foreground">{selectedOrganiser.subscription.plan}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Events Managed</p>
                    <p className="font-medium text-foreground">{selectedOrganiser.eventsManaged} / {selectedOrganiser.subscription.eventsAllowed || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Subscription Amount</p>
                    <p className="font-medium text-foreground">₹{selectedOrganiser.subscription.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Subscription Dialog */}
        <Dialog open={subscriptionDialogOpen} onOpenChange={setSubscriptionDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Manage Subscription</DialogTitle>
              <DialogDescription>
                Update subscription details for {selectedOrganiser?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Subscription Plan</Label>
                <Select value={subscriptionForm.plan} onValueChange={(value) => setSubscriptionForm({ ...subscriptionForm, plan: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Annual Basic">Annual Basic (₹15,000 - 20 Events)</SelectItem>
                    <SelectItem value="Annual Premium">Annual Premium (₹25,000 - 50 Events)</SelectItem>
                    <SelectItem value="Annual Enterprise">Annual Enterprise (₹50,000 - Unlimited)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Amount (₹)</Label>
                <Input
                  type="number"
                  value={subscriptionForm.amount}
                  onChange={(e) => setSubscriptionForm({ ...subscriptionForm, amount: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Events Allowed</Label>
                <Input
                  type="number"
                  value={subscriptionForm.eventsAllowed}
                  onChange={(e) => setSubscriptionForm({ ...subscriptionForm, eventsAllowed: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input
                  type="date"
                  value={subscriptionForm.expiryDate}
                  onChange={(e) => setSubscriptionForm({ ...subscriptionForm, expiryDate: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSubscriptionDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveSubscription} className="gradient-primary text-primary-foreground">
                Activate Subscription
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminOrganisers;
