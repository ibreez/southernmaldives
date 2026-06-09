import { 
  Mail, Calendar, Users, Phone, MessageSquare, 
  CheckCircle2, Trash2, Search, MapPin, 
  ArrowUpRight, Inbox, Clock
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/AdminLayout';
import { useEnquiries, useUpdateEnquiryStatus, useDeleteEnquiry } from '@/hooks/useEnquiries';
import { Enquiry } from '@/types/enquiry';
import { format } from 'date-fns';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Enquiries() {
  const { data: enquiries = [], isLoading } = useEnquiries();
  const updateStatus = useUpdateEnquiryStatus();
  const deleteEnquiry = useDeleteEnquiry();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleStatusChange = async (enquiry: Enquiry, status: Enquiry['status']) => {
    await updateStatus.mutateAsync({ id: enquiry.id, status });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      await deleteEnquiry.mutateAsync(id);
    }
  };

  const filteredEnquiries = enquiries.filter(e => {
    const matchesSearch = 
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
      e.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      new: "bg-emerald-50 text-emerald-700 border-emerald-100",
      replied: "bg-blue-50 text-blue-700 border-blue-100",
      closed: "bg-slate-50 text-slate-500 border-slate-100"
    };
    return (
      <Badge variant="outline" className={cn("rounded-md px-2 py-0.5 font-medium capitalize", styles[status as keyof typeof styles])}>
        {status}
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-3">
              <Inbox className="h-8 w-8 text-emerald-600" />
              Guest Desk
            </h1>
            <p className="text-slate-500 mt-1 font-light">
              Managing <span className="font-semibold text-slate-900">{enquiries.length}</span> luxury travel requests.
            </p>
          </div>
          
          <div className="flex bg-slate-100/50 p-1 rounded-xl border border-slate-200">
            {['all', 'new', 'replied', 'closed'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-4 py-2 text-xs font-bold uppercase tracking-tighter transition-all rounded-lg",
                  statusFilter === s 
                    ? "bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200" 
                    : "text-slate-500 hover:text-slate-800"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* --- Search Bar --- */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
          <Input 
            placeholder="Search guests or destinations..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 rounded-2xl border-slate-200 bg-white shadow-sm focus:ring-emerald-500 transition-all text-lg font-light"
          />
        </div>

        {/* --- Main Content --- */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
             <div className="h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
             <p className="font-serif italic text-slate-400">Refreshing your desk...</p>
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="text-center py-24 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-300">
             <div className="bg-white h-16 w-16 rounded-full flex items-center justify-center mx-auto shadow-sm mb-4">
                <Search className="h-6 w-6 text-slate-300" />
             </div>
             <h3 className="text-lg font-bold text-slate-800">Clear Horizon</h3>
             <p className="text-slate-500 mt-1 max-w-xs mx-auto">No inquiries match your current filters or search terms.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredEnquiries.map((e) => (
              <Card key={e.id} className="group border-slate-200 overflow-hidden hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300">
                <div className="flex flex-col md:flex-row">
                  {/* Status Bar (Visual Indicator) */}
                  <div className={cn(
                    "w-1 md:w-1.5 shrink-0",
                    e.status === 'new' ? "bg-emerald-500" : e.status === 'replied' ? "bg-blue-400" : "bg-slate-300"
                  )} />

                  <div className="flex-1 p-6 md:p-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                      
                      {/* Left: Guest Profile */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            {getStatusBadge(e.status)}
                            <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
                              {e.name}
                              <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                            </h2>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 font-light">
                              <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {e.email}</span>
                              <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {e.phone}</span>
                            </div>
                          </div>
                          <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inquiry Date</p>
                            <p className="text-xs text-slate-600 mt-0.5">{format(new Date(e.created_at), 'MMM d, yyyy')}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="space-y-1">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><MapPin className="h-3 w-3" /> Resort</span>
                            <p className="text-sm font-semibold text-slate-800 line-clamp-1">{e.destination}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><Calendar className="h-3 w-3" /> Stay</span>
                            <p className="text-sm font-semibold text-slate-800">{format(new Date(e.check_in), 'MMM d')} - {format(new Date(e.check_out), 'MMM d')}</p>
                          </div>
                           <div className="space-y-1 col-span-2 lg:col-span-1">
                             <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><Users className="h-3 w-3" /> Party</span>
                             <p className="text-sm font-semibold text-slate-800">
                               {e.adults > 0 ? `${e.adults} Adult${e.adults > 1 ? 's' : ''}` : ''}
                               {e.adults > 0 && e.children > 0 ? ', ' : ''}
                               {e.children > 0 ? `${e.children} Child${e.children > 1 ? 'ren' : ''}` : ''}
                               <span className="text-slate-400 font-normal"> ({e.guests} Guest{e.guests !== 1 ? 's' : ''})</span>
                             </p>
                           </div>
                        </div>

                        {e.special_requests && (
                          <div className="flex gap-3 items-start bg-emerald-50/30 p-4 rounded-xl border border-emerald-100/50">
                            <MessageSquare className="h-4 w-4 text-emerald-600 mt-1 shrink-0" />
                            <p className="text-sm text-slate-600 italic font-light leading-relaxed">
                              "{e.special_requests}"
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div className="lg:w-44 flex flex-row lg:flex-col gap-2 justify-end lg:justify-start">
                        {e.status === 'new' && (
                          <Button 
                            onClick={() => handleStatusChange(e, 'replied')}
                            className="flex-1 lg:w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-sm text-white"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" /> Mark Replied
                          </Button>
                        )}
                        {e.status !== 'closed' && (
                          <Button 
                            onClick={() => handleStatusChange(e, 'closed')}
                            variant="outline"
                            className={cn(
                              "flex-1 lg:w-full rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors",
                              e.status === 'replied' && "border-blue-200 text-blue-600 hover:bg-blue-50"
                            )}
                          >
                            <Clock className="h-4 w-4 mr-2" /> Close Desk
                          </Button>
                        )}
                        <Button 
                          onClick={() => handleDelete(e.id)}
                          variant="ghost" 
                          className="rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 lg:px-4"
                        >
                          <Trash2 className="h-4 w-4 lg:mr-2" /> 
                          <span className="hidden lg:inline">Delete</span>
                        </Button>
                      </div>

                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}