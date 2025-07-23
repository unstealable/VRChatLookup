'use client'

import { useEffect, useState } from 'react'
import DisclaimerPopup from './DisclaimerPopup'
import Footer from './Footer'

interface ClientWrapperProps {
  children: React.ReactNode
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const [showPopup, setShowPopup] = useState(false)
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('vrchatlookup-disclaimer-accepted')
    if (accepted === 'true') {
      setDisclaimerAccepted(true)
    } else {
      setShowPopup(true)
    }
  }, [])

  const handleDisclaimerClose = () => {
    setShowPopup(false)
    setDisclaimerAccepted(true)
    localStorage.setItem('vrchatlookup-disclaimer-accepted', 'true')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {children}
      </main>
      
      <Footer showDisclaimer={disclaimerAccepted} />
      
      {showPopup && <DisclaimerPopup onClose={handleDisclaimerClose} />}
    </div>
  )
}