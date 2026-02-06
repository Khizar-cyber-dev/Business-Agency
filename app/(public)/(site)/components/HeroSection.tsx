import React from 'react'
import { ArrowRight, CheckCircle, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'
import Navbar from './Navbar'

const HeroSection = () => {
  return (
    <section className='relative min-h-[calc(100vh-80px)] w-full overflow-hidden'>
      <div className='absolute top-0 left-0 w-full z-50'>
        <Navbar />
      </div>
      <div className="absolute top-0 left-0 h-full w-full z-0 bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(80,77,188,0.55),rgba(121,134,255,0.26),rgba(255,255,255,0.0))]"></div>
      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          <div className='space-y-8 z-10'>
            <div className='inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mt-4 md:mt-0'>
              <TrendingUp className='w-4 h-4' />
              <span>Trusted by 1000+ Businesses</span>
            </div>

            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight'>
              Transform Your Business with{' '}
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'>
                Expert Solutions
              </span>
            </h1>

            <p className='text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl'>
              Connect with professional service providers and transform your business vision into 
              measurable results. Get expert guidance, proven strategies, and dedicated execution.
            </p>

            <div>
              <Link 
                href='/services'
                className='group inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5'
              >
                Explore Services
                <ArrowRight className='ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform' />
              </Link>
            </div>

            <div className='grid sm:grid-cols-2 gap-4 pt-4'>
              <div className='flex items-center gap-3'>
                <CheckCircle className='w-5 h-5 text-blue-600 flex-shrink-0' />
                <span className='text-gray-700 font-medium'>Verified Professionals</span>
              </div>
              <div className='flex items-center gap-3'>
                <CheckCircle className='w-5 h-5 text-blue-600 flex-shrink-0' />
                <span className='text-gray-700 font-medium'>Portfolio Showcase</span>
              </div>
              <div className='flex items-center gap-3'>
                <CheckCircle className='w-5 h-5 text-blue-600 flex-shrink-0' />
                <span className='text-gray-700 font-medium'>Transparent Pricing</span>
              </div>
              <div className='flex items-center gap-3'>
                <CheckCircle className='w-5 h-5 text-blue-600 flex-shrink-0' />
                <span className='text-gray-700 font-medium'>Quick Response</span>
              </div>
            </div>
          </div>

          <div className='relative lg:block hidden'>
            <div className='relative'>
              {/* Main Card */}
              <div className='relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 transform rotate-3 hover:rotate-0 transition-transform duration-300'>
                <div className='space-y-6'>
                  <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center'>
                      <Users className='w-6 h-6 text-white' />
                    </div>
                    <div>
                      <h3 className='font-bold text-gray-900'>Active Projects</h3>
                      <p className='text-sm text-gray-500'>This month</p>
                    </div>
                  </div>
                  <div className='text-4xl font-bold text-gray-900'>1,247</div>
                  <div className='flex items-center gap-2 text-green-600'>
                    <TrendingUp className='w-5 h-5' />
                    <span className='font-semibold'>+23% from last month</span>
                  </div>
                </div>
              </div>

              {/* Floating Card 1 */}
              <div className='absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform -rotate-6 hover:rotate-0 transition-transform duration-300'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                    <CheckCircle className='w-5 h-5 text-blue-600' />
                  </div>
                  <div>
                    <div className='text-2xl font-bold text-gray-900'>98%</div>
                    <div className='text-sm text-gray-500'>Satisfaction Rate</div>
                  </div>
                </div>
              </div>

              {/* Floating Card 2 */}
              <div className='absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform rotate-6 hover:rotate-0 transition-transform duration-300'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center'>
                    <Users className='w-5 h-5 text-indigo-600' />
                  </div>
                  <div>
                    <div className='text-2xl font-bold text-gray-900'>500+</div>
                    <div className='text-sm text-gray-500'>Expert Providers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;