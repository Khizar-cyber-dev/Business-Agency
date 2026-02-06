'use client'

import { makeAdmin } from '@/lib/action'
import { Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const AuthForm = () => {
  const router = useRouter()
  const [formData, setFormData] = useState<{
    businessName: string
    businessEmail: string
    role: 'OWNER' | 'PARTNER' | 'FREELANCER'
    experience: string
    joinReason: string
  }>({
    businessName: '',
    businessEmail: '',
    role: 'OWNER',
    experience: '',
    joinReason: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      console.log('Submitting form data:', formData)
      await makeAdmin(formData)
      alert('Form submitted successfully!')
      setFormData({
        businessName: '',
        businessEmail: '',
        role: 'OWNER',
        experience: '',
        joinReason: ''
      })
      // Redirect to dashboard after successful submission
      router.push('/admin/dashboard')
    } catch (error) {
      console.error('Error:', error)
      alert('Error submitting form')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center h-full p-8'>
      <div className='w-full max-w-md bg-white p-6 rounded-lg shadow-md'>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Get Started</h1>
        <p className="text-gray-600 mb-8">Fill out the form to join our platform</p>
        <form className='flex flex-col gap-4 w-full' onSubmit={handleSubmit}>
          <div>
            <label className='labels' htmlFor="business-name">
              Business Name
            </label>
            <input 
              type="text" 
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder='business-name' 
              className='w-full p-3 bg-gray-100 rounded-xl inputs' 
              required
            />
          </div>
          <div>
            <label className='labels' htmlFor="business-email">
              Business Email
            </label>
            <input 
              type="email" 
              name="businessEmail"
              value={formData.businessEmail}
              onChange={handleChange}
              placeholder='business-email' 
              className='w-full p-3 bg-gray-100 rounded-xl inputs' 
              required
            />
          </div>
          <div>
            <label className='labels' htmlFor="business-role">
              Role
            </label>
          <select 
            name="role"
            value={formData.role}
            onChange={handleChange}
            className='w-full p-3 bg-gray-100 rounded-xl inputs appearance-none' 
            required
          >
            <option value="OWNER">OWNER</option>
            <option value="PARTNER">PARTNER</option>
            <option value="FREELANCER">FREELANCER</option>
          </select>
          </div>
         <div>
            <label className='labels' htmlFor="business-experience">
               Experience
            </label>
            <input 
              type="text" 
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder='e.g., 5 years in marketing'
              className='w-full p-3 bg-gray-100 rounded-xl inputs' 
              required
            />
          </div>
          <div>
            <label htmlFor="joinReason" className="labels">
              Why do you want to join our platform?
            </label>
          <textarea 
            name="joinReason"
            value={formData.joinReason}
            onChange={handleChange}
            placeholder="why do you want to join our platform?" 
            className='w-full px-4 py-3 rounded-lg bg-gray-100 inputs resize-none'
            required
          ></textarea>
          </div>
          <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center itmes-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-800 transform hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader className='animate-spin bg-transparent'/>: 'Submit Application'}
            </button>
        </form>
      </div>
    </div>
  )
}

export default AuthForm
