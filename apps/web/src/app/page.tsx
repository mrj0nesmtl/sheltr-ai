import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🏠</span>
              </div>
              <span className="text-xl font-bold text-gray-900">SHELTR-AI</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-900 hover:text-blue-600">Home</Link>
              <Link href="/about" className="text-gray-600 hover:text-blue-600">About</Link>
              <Link href="/features" className="text-gray-600 hover:text-blue-600">Features</Link>
              <Link href="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link>
            </div>
            <div className="flex space-x-4">
              <button className="text-gray-600 hover:text-blue-600">Sign In</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Hacking Homelessness Through Technology
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              SHELTR-AI revolutionizes charitable giving through QR-code donations, 
              blockchain transparency, and AI-driven insights. Every donation follows our 
              SmartFund™ distribution: 80% direct support, 15% housing fund, 5% operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
                Start Giving
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SmartFund Distribution */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">SmartFund™ Distribution</h2>
            <p className="text-lg text-gray-600">Every donation automatically distributed through smart contracts</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="text-4xl font-bold text-emerald-600 mb-2">80%</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Direct Support</h3>
              <p className="text-gray-600">Goes directly to participants for immediate needs</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-4xl font-bold text-blue-600 mb-2">15%</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Housing Fund</h3>
              <p className="text-gray-600">Builds sustainable long-term housing solutions</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-amber-50 border border-amber-200">
              <div className="text-4xl font-bold text-amber-600 mb-2">5%</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Operations</h3>
              <p className="text-gray-600">Maintains and improves the platform</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Simple, secure, transparent giving in three steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Scan QR Code</h3>
              <p className="text-gray-600">Use any smartphone to scan a participant&apos;s unique QR code</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">💳</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Choose Amount</h3>
              <p className="text-gray-600">Select donation amount and payment method securely</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Instant Impact</h3>
              <p className="text-gray-600">Funds distributed immediately via blockchain smart contracts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gunnar Memorial */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">In Loving Memory</h2>
          <p className="text-xl mb-6">
            SHELTR-AI is dedicated to <strong>Gunnar Blaze (2010-2025)</strong>, a faithful German Shepherd 
            who embodied the loyalty, protection, and unconditional love that inspires our mission 
            to care for those without shelter.
          </p>
          <p className="text-lg opacity-90">
            &quot;Every feature we build honors Gunnar&apos;s values: loyalty to our users, protection of their dignity, 
            and unconditional care for those who need it most.&quot;
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🏠</span>
                </div>
                <span className="text-xl font-bold">SHELTR-AI</span>
              </div>
              <p className="text-gray-400">Hacking homelessness through technology.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">GitHub</a></li>
                <li><a href="#" className="hover:text-white">Discord</a></li>
                <li><a href="#" className="hover:text-white">Twitter</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SHELTR-AI. Built with ❤️ in memory of Gunnar Blaze.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 