import HeroSection from './components/HeroSection';
import Services from './components/Services';
import Testemonials from './components/Testemonials';

export const revalidate = 60 ;

export default async function HomePage() {

  return (
    <main className='px-2'>
      <HeroSection />
      <Services />
      <Testemonials />
    </main>
  )
}