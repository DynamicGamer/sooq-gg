import { Routes, Route } from 'react-router-dom'
import { LangProvider } from './context/LangContext'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Listings from './pages/Listings'
import ListingDetail from './pages/ListingDetail'
import Auth from './pages/Auth'
import Cart from './pages/Cart'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <main>
            <Routes>
              <Route path="/"                  element={<Home />} />
              <Route path="/listings/:category" element={<Listings />} />
              <Route path="/listing/:id"        element={<ListingDetail />} />
              <Route path="/auth"               element={<Auth />} />
              <Route path="/cart"               element={<Cart />} />
              <Route path="/dashboard"          element={<Dashboard />} />
            </Routes>
          </main>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </LangProvider>
  )
}
