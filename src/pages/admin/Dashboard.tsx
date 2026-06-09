import {
  Hotel, Tag, TrendingUp, Plus, ArrowUpRight, ChevronRight, Briefcase
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { useHotels } from '@/hooks/useHotels';
import { usePromotions } from '@/hooks/usePromotions';
import { useEnquiries } from '@/hooks/useEnquiries';
import { usePackagesAdmin } from '@/hooks/usePackageAdmin';

export default function Dashboard() {
  const { data: hotels = [], isLoading: hotelsLoading } = useHotels();
  const { data: promotions = [], isLoading: promotionsLoading } = usePromotions();
  const { data: enquiries = [], isLoading: enquiriesLoading } = useEnquiries();
  const { data: packages = [], isLoading: packagesLoading } = usePackagesAdmin();

  const isLoading = hotelsLoading || promotionsLoading || enquiriesLoading || packagesLoading;
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'new').length;
  const featuredPackagesCount = packages.filter((pkg) => pkg.featured).length;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
          <div className="h-12 w-12 border-4 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-slate-400 font-serif italic">Loading dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
            <p className="text-slate-500 mt-1">Operational status for Southern Maldives</p>
          </div>
          <Link to="/admin/hotels/new">
            <Button className="rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-md gap-2 px-6 h-11">
              <Plus className="h-4 w-4" /> Add Resort
            </Button>
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Highlight: New Enquiries */}
          <div className="md:col-span-4 bg-emerald-600 rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl shadow-emerald-600/30">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-white/20 rounded-2xl"><TrendingUp className="h-6 w-6" /></div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-100">Action Needed</span>
            </div>
            <div>
              <h2 className="text-5xl font-bold mb-2">{newEnquiriesCount}</h2>
              <p className="text-emerald-100 font-medium">New guest enquiries awaiting your review.</p>
            </div>
            <Link to="/admin/enquiries" className="mt-6 inline-flex items-center text-sm font-bold underline underline-offset-4 hover:text-white">
              Process now <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {/* Secondary Stats */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: 'Active Resorts', value: hotels.length, icon: Hotel, color: 'bg-emerald-50 text-emerald-700' },
              { label: 'Featured Packages', value: featuredPackagesCount, icon: Briefcase, color: 'bg-cyan-50 text-cyan-700' },
              { label: 'Live Promotions', value: promotions.filter(p => p.is_active).length, icon: Tag, color: 'bg-teal-50 text-teal-600' },
            ].map((stat, i) => (
              <Card key={i} className="rounded-3xl border-slate-100 shadow-sm p-6 flex items-center gap-6">
                <div className={`p-4 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </Card>
            ))}

            {/* Quick Links */}
            <div className="sm:col-span-2 bg-slate-900 rounded-3xl p-6 flex flex-wrap gap-4 items-center justify-between text-white">
              <span className="font-serif italic text-slate-400">Quick Access:</span>
              {[
                { label: 'Enquiries', path: '/admin/enquiries' },
                { label: 'Packages', path: '/admin/packages' },
                { label: 'Promotions', path: '/admin/promotions' },
                { label: 'Resorts', path: '/admin/hotels' }
              ].map(link => (
                <Link key={link.label} to={link.path} className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-emerald-400 transition-colors">
                  {link.label} <ArrowUpRight className="h-3 w-3" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <h3 className="font-serif text-xl mb-8">Latest Updates</h3>
          <div className="space-y-6">
            {[
              { title: 'New Enquiry', subtitle: 'John Doe via Alpine Mountain', time: '2h ago' },
              { title: 'Resort Updated', subtitle: 'Paradise Beach Pricing', time: '5h ago' },
              { title: 'New Promo', subtitle: 'Winter Special Launch', time: '1d ago' }
            ].map((act, i) => (
              <div key={i} className="flex gap-6 group">
                <div className="relative flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 z-10 mt-1.5" />
                  {i !== 2 && <div className="absolute top-4 w-px h-full bg-slate-100" />}
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-bold text-slate-900">{act.title}</p>
                  <p className="text-sm text-slate-500">{act.subtitle}</p>
                </div>
                <span className="text-xs text-slate-400 font-mono">{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
