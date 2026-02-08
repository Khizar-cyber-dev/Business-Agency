import React from 'react'

const Testemonials = () => {
  const testemonials = [
    {
      id: "1",
      name: "Usman Ali",
      role: "Startup Founder",
      image: "https://cdn.pixabay.com/photo/2023/03/17/16/55/man-7859085_640.jpg",
      feedback:
      "As a client, the process felt smooth and professional. I could contact the business only after login, which made the platform feel secure and serious.",
    },
    {
      id: "2",
      name: "Hassan Riaz",
      role: "Business Owner",
      image: "https://cdn.pixabay.com/photo/2016/11/29/12/52/face-1869641_640.jpg",
      feedback:
      "The admin dashboard is simple but powerful. Adding services and managing inquiries takes minutes instead of hours.",
    },
    {
      id: "3",
      name: "Sara Ahmed",
      role: "Marketing Manager",
      image: "https://cdn.pixabay.com/photo/2025/08/06/22/31/close-up-portrait-9759768_640.jpg",
      feedback:
      "I love how portfolios are displayed. It builds instant trust and clearly shows what the business is capable of.",
    },
    {
      id: "4",
      name: "Bilal Qureshi",
      role: "Freelance Developer",
      image: "https://cdn.pixabay.com/photo/2019/12/10/05/11/serious-4684970_1280.jpg",
       feedback:
      "Becoming an admin after approval feels like a real-world workflow. It doesn’t feel fake or rushed like many platforms.",
    },
    {
      id: "5",
      name: "Danish Malik",
      role: "Agency Partner",
      image: "https://cdn.pixabay.com/photo/2019/10/04/13/19/woman-4525646_1280.jpg",
      feedback:
      "Managing multiple services and inquiries from one dashboard is a big win. It feels built for real businesses, not demos.",
    },
    {
      id: "6",
      name: "Ayesha Noor",
      role: "Client",
      image: "https://cdn.pixabay.com/photo/2016/01/18/05/09/woman-1146038_640.jpg",
      feedback:
      "The website feels premium and trustworthy. I felt confident reaching out because everything was well-structured.",
    },
  ]

  return (
    <section className='w-full mx-auto py-20 md:py-24 relative z-10'>
      <div className='text-center'>
        <h1 className='text-3xl md:text-4xl font-bold tracking-tight text-gray-900'>
          What{' '}
          <span className='text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text'>
            people
          </span>{' '}
          say about this{' '}
          <span className='text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text'>
            application
          </span>
        </h1>
        <p className='mt-3 text-gray-600'>
          Real feedback from founders, partners, and freelancers using the platform.
        </p>
      </div>

      <div className='mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6'>
        {testemonials.map((item) => (
          <div
            key={item.id}
            className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg'
          >
            <div className='flex items-center gap-4'>
              <div className='h-14 w-14 overflow-hidden rounded-full border border-gray-200'>
                <img
                  src={item.image}
                  alt={item.name}
                  className='h-full w-full object-cover'
                  loading='lazy'
                />
              </div>
              <div>
                <p className='text-base font-semibold text-gray-900'>{item.name}</p>
                <p className='text-sm text-gray-500'>{item.role}</p>
              </div>
            </div>
            <p className='mt-4 text-sm leading-relaxed text-gray-700'>
              “{item.feedback}”
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Testemonials
