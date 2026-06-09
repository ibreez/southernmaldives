import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Index from './pages/Index';
import Hotels from './pages/Hotels';
import HotelDetail from './pages/HotelDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import { TravelPackages } from './pages/TravelPackages';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminHotels from './pages/admin/HotelsExtendedComplete';
import HotelFormPage from './pages/admin/HotelFormPage';
import Promotions from './pages/admin/Promotions';
import Enquiries from './pages/admin/Enquiries';
import InstagramFeeds from './pages/admin/InstagramFeeds';
import Testimonials from './pages/admin/Testimonials';
import Packages from './pages/admin/Packages';
import EmailTemplates from './pages/admin/EmailTemplates';
import EmailServiceTest from './components/EmailServiceTest';
import NotFound from './pages/NotFound';
import Terms from './pages/Terms';
import ScrollRestoration from './components/ScrollRestoration';
import { useEnquiryModalStore } from '@/stores/enquiryModalStore';
import EnquiryModal from '@/components/EnquiryModal';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <ScrollRestoration />
            {/* Global Enquiry Modal */}
            <EnquiryModal />

            <Routes>
              {/* Public routes with Navbar and Footer */}
              <Route
                path="/"
                element={
                  <>
                    <Navbar />
                    <Index />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/hotels"
                element={
                  <>
                    <Navbar />
                    <Hotels />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/hotels/:id"
                element={
                  <>
                    <Navbar />
                    <HotelDetail />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/packages"
                element={
                  <>
                    <Navbar />
                    <TravelPackages />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/about"
                element={
                  <>
                    <Navbar />
                    <About />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/contact"
                element={
                  <>
                    <Navbar />
                    <Contact />
                    <Footer />
                  </>
                }
              />

              <Route
                path="/terms"
                element={
                  <>
                    <Navbar />
                    <Terms />
                    <Footer />
                  </>
                }
              />

              {/* Email Service Test Route */}
              <Route
                path="/test-email"
                element={
                  <>
                    <Navbar />
                    <EmailServiceTest />
                    <Footer />
                  </>
                }
              />

              {/* Admin routes without Navbar and Footer */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/hotels" element={<AdminHotels />} />
              <Route path="/admin/hotels/new" element={<HotelFormPage />} />
              <Route path="/admin/hotels/edit/:id" element={<HotelFormPage />} />
               <Route path="/admin/promotions" element={<Promotions />} />
               <Route path="/admin/packages" element={<Packages />} />
               <Route path="/admin/enquiries" element={<Enquiries />} />
               <Route path="/admin/instagram-feeds" element={<InstagramFeeds />} />
               <Route path="/admin/testimonials" element={<Testimonials />} />
               <Route path="/admin/email-templates" element={<EmailTemplates />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;