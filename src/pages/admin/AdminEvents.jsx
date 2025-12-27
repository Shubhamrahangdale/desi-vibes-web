import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Check, X, MoreHorizontal, Calendar, MapPin } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useEvents } from '@/context/EventContext';
import { useAdmin } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const AdminEvents = () => {
  const { events, approveEvent, rejectEvent } = useEvents();
  const { isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin');
  }, [isAuthenticated, navigate]);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || event.organiserName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (event) => { approveEvent(event.id); toast({ title: 'Event Approved', description: `"${event.title}" is now visible to users.` }); };
  const handleReject = (event) => { rejectEvent(event.id); toast({ title: 'Event Rejected', description: `"${event.title}" has been rejected.`, variant: 'destructive' }); };

  const getStatusBadge = (status) => {
    if (status === 'approved') return <Badge className="bg-green-500/10 text-green-600 border border-green-500/20">Approved</Badge>;
    if (status === 'rejected') return <Badge className="bg-destructive/10 text-destructive border border-destructive/20">Rejected</Badge>;
    return <Badge className="bg-accent/10 text-accent border border-accent/20">Pending</Badge>;
  };

  if (!isAuthenticated) return null;

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8 animate-fade-in"><h1 className="text-3xl font-display font-bold text-foreground mb-2">Event Management</h1><p className="text-muted-foreground">Review and approve events created by organisers</p></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-card border-border"><CardContent className="p-4 flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center"><Calendar className="w-6 h-6 text-accent" /></div><div><p className="text-2xl font-bold text-foreground">{events.filter(e => e.status === 'pending').length}</p><p className="text-sm text-muted-foreground">Pending</p></div></CardContent></Card>
          <Card className="bg-card border-border"><CardContent className="p-4 flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center"><Check className="w-6 h-6 text-green-600" /></div><div><p className="text-2xl font-bold text-foreground">{events.filter(e => e.status === 'approved').length}</p><p className="text-sm text-muted-foreground">Approved</p></div></CardContent></Card>
          <Card className="bg-card border-border"><CardContent className="p-4 flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center"><X className="w-6 h-6 text-destructive" /></div><div><p className="text-2xl font-bold text-foreground">{events.filter(e => e.status === 'rejected').length}</p><p className="text-sm text-muted-foreground">Rejected</p></div></CardContent></Card>
        </div>

        <Card className="bg-card border-border mb-6"><CardContent className="p-4"><div className="flex flex-col md:flex-row gap-4"><div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /><Input placeholder="Search events..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12" /></div><Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-full md:w-48"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="approved">Approved</SelectItem><SelectItem value="rejected">Rejected</SelectItem></SelectContent></Select></div></CardContent></Card>

        <Card className="bg-card border-border">
          <CardHeader><CardTitle>Events ({filteredEvents.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-border"><th className="text-left py-4 px-4 text-sm text-muted-foreground">Event</th><th className="text-left py-4 px-4 text-sm text-muted-foreground">Organiser</th><th className="text-left py-4 px-4 text-sm text-muted-foreground">Date</th><th className="text-left py-4 px-4 text-sm text-muted-foreground">Status</th><th className="text-right py-4 px-4 text-sm text-muted-foreground">Actions</th></tr></thead>
                <tbody>
                  {filteredEvents.map((event) => (
                    <tr key={event.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-4 px-4"><div className="flex items-center gap-3"><img src={event.image} alt={event.title} className="w-12 h-12 rounded-lg object-cover" /><div><p className="font-medium text-foreground">{event.title}</p><p className="text-sm text-muted-foreground">{event.category}</p></div></div></td>
                      <td className="py-4 px-4 text-sm text-foreground">{event.organiserName}</td>
                      <td className="py-4 px-4 text-sm text-foreground">{new Date(event.date).toLocaleDateString('en-IN')}</td>
                      <td className="py-4 px-4">{getStatusBadge(event.status)}</td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {event.status === 'pending' && <><Button variant="ghost" size="icon" className="text-green-600 hover:bg-green-500/10" onClick={() => handleApprove(event)}><Check className="w-5 h-5" /></Button><Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleReject(event)}><X className="w-5 h-5" /></Button></>}
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedEvent(event); setViewDialogOpen(true); }}><Eye className="w-5 h-5" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredEvents.length === 0 && <div className="text-center py-12"><p className="text-muted-foreground">No events found.</p></div>}
            </div>
          </CardContent>
        </Card>

        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Event Details</DialogTitle></DialogHeader>
            {selectedEvent && <div className="space-y-4 pt-4"><img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-48 rounded-lg object-cover" /><h3 className="text-xl font-semibold text-foreground">{selectedEvent.title}</h3><p className="text-muted-foreground">{selectedEvent.description}</p><div className="grid grid-cols-2 gap-4 text-sm"><div><span className="text-muted-foreground">Date:</span> {selectedEvent.date}</div><div><span className="text-muted-foreground">Time:</span> {selectedEvent.time}</div><div><span className="text-muted-foreground">Venue:</span> {selectedEvent.venue}</div><div><span className="text-muted-foreground">Price:</span> ₹{selectedEvent.price}</div></div></div>}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminEvents;
