import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/contexts/AuthContext'
import { LocationProvider } from '@/contexts/LocationContext'
import ToastProvider from '@/components/ToastProvider'
import LocationModal from '@/components/LocationModal'

export const metadata = {
  title: 'Kidigo - Event Ticket Booking',
  description: 'Book tickets for your favorite events',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ colorScheme: 'light' }}>
      <body style={{ colorScheme: 'light' }} className="flex flex-col min-h-screen">
        <AuthProvider>
          <LocationProvider>
            <Navbar />
            <ToastProvider />
            <LocationModal />
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
