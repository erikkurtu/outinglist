import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/lib/auth'
import { ToastProvider } from '@/components/Toast'
import { Home } from '@/pages/Home'
import { Browse } from '@/pages/Browse'
import { EventDetail } from '@/pages/EventDetail'
import { CreateEvent } from '@/pages/CreateEvent'
import { Lists } from '@/pages/Lists'
import { Profile } from '@/pages/Profile'
import { SignIn } from '@/pages/SignIn'
import { SignUp } from '@/pages/SignUp'
import './styles/globals.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/events/new" element={<CreateEvent />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/lists" element={<Lists />} />
            <Route path="/lists/:id" element={<Lists />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
