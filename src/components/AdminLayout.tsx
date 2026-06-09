import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Hotel,
  Briefcase,
  Tag,
  Mail,
  Image,
  ShieldCheck,
  Star,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, signOut } = useAuth();

  // State for mobile drawer vs desktop collapse
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!session) navigate('/admin/login');
  }, [session, navigate]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/admin/login');
    } catch {
      toast.error('Error logging out');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/hotels', label: 'Hotel Collection', icon: Hotel },
    { path: '/admin/packages', label: 'Travel Packages', icon: Briefcase },
    { path: '/admin/promotions', label: 'Offers & Promotions', icon: Tag },
    { path: '/admin/instagram-feeds', label: 'Instagram Gallery', icon: Image },
    { path: '/admin/testimonials', label: 'Testimonials', icon: Star },
    { path: '/admin/enquiries', label: 'Guest Enquiries', icon: Mail },
    { path: '/admin/email-templates', label: 'Email Templates', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFA] flex">
      {/* Mobile Overlay - Only visible when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative z-50 h-screen bg-emerald-950 text-white transition-all duration-300 ease-in-out border-r border-emerald-900 shadow-2xl flex flex-col ${isSidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
          }`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-emerald-900/50">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <img src="/logo.jpg" className="h-8 w-8 rounded-full border border-emerald-800 shrink-0" alt="Logo" />
            {isSidebarOpen && (
              <div className="whitespace-nowrap animate-in fade-in duration-300">
                <p className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-emerald-400">Admin Portal</p>
                <p className="font-serif italic text-sm text-white">Southern Maldives</p>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  className={`w-full h-12 transition-all duration-200 ${active
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
                      : 'text-emerald-300/60 hover:text-white hover:bg-emerald-900/50'
                    } ${isSidebarOpen ? 'justify-start px-4' : 'justify-center px-0'}`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {isSidebarOpen && <span className="ml-3 font-medium text-sm">{item.label}</span>}
                  {active && isSidebarOpen && <ChevronRight className="h-4 w-4 ml-auto opacity-50" />}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-emerald-900/50">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={`w-full h-12 text-emerald-400/60 hover:text-red-400 hover:bg-red-900/20 ${isSidebarOpen ? 'justify-start px-4' : 'justify-center'}`}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {isSidebarOpen && <span className="ml-3 text-sm">Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-slate-500 hover:bg-slate-100"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="h-6 w-px bg-slate-200" />
            <div className="font-serif italic text-slate-400 text-sm hidden sm:block">Below the Equator</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900 uppercase tracking-widest">{session?.user?.email?.split('@')[0]}</p>
              <p className="text-[0.6rem] text-emerald-600 font-semibold uppercase tracking-wider">Management</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
              {session?.user?.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-12">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}