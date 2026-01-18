import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'Kidigo - Event Ticket Booking',
  description: 'Book tickets for your favorite events',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ colorScheme: 'light' }}>
      <body style={{ colorScheme: 'light' }}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
