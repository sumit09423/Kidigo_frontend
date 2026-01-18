export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to Kidigo
          </h1>
          <p className="text-xl text-gray-600">
            Your premier destination for event ticket booking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎫</div>
            <h2 className="text-2xl font-semibold mb-2">Browse Events</h2>
            <p className="text-gray-600">
              Discover amazing events happening near you
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎭</div>
            <h2 className="text-2xl font-semibold mb-2">Book Tickets</h2>
            <p className="text-gray-600">
              Secure your spot with easy booking process
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-2xl font-semibold mb-2">Enjoy Events</h2>
            <p className="text-gray-600">
              Experience unforgettable moments
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors">
            Explore Events
          </button>
        </div>
      </div>
    </main>
  )
}
