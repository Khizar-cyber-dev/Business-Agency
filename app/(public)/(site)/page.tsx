import React from 'react'
import HeroSection from './components/HeroSection';
import Services from './components/Services';
import Testemonials from './components/Testemonials';
import Footer from './components/Footer';

export const revalidate = 60 ;

export default async function HomePage() {

  return (
    <main>
      <div className='min-h-screen bg-gray-100'>
      <HeroSection />
      </div>
      <Services />
      <Testemonials />
      <Footer />
    </main>
  )
}