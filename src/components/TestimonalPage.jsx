import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Ritu Sharma',
    role: 'User',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    quote:
      'HelpNest has changed my life. I get reminders for my medicines and can call for help anytime. The design is simple, easy to use, and has been a true companion in my daily life.',
  },
  {
    id: 2,
    name: 'Aman Verma',
    role: 'Family Member',
    image: 'https://randomuser.me/api/portraits/men/36.jpg',
    quote:
      'With HelpNest, I feel secure knowing my parents are just a tap away from help. Their happiness is priceless, and this app makes a difference.',
  },
  {
    id: 3,
    name: 'Sunita Desai',
    role: 'Helper',
    image: 'https://randomuser.me/api/portraits/women/58.jpg',
    quote:
      'The platform is easy to use, and I get tasks and payments on time. Truly empowering for independent workers like me.',
  },
  {
    id: 4,
    name: 'Rajesh Kumar',
    role: 'Helper',
    image: 'https://randomuser.me/api/portraits/men/42.jpg',
    quote:
      'Proud to help people through HelpNest. The platform is smooth and intuitive, which makes volunteering a joy.',
  },
  {
    id: 5,
    name: 'Meena Joshi',
    role: 'User',
    image: 'https://randomuser.me/api/portraits/women/33.jpg',
    quote:
      'I feel supported and safe using HelpNest. Thank you for building this wonderful support system!',
  },
];

const TestimonialPage = () => {
  const [startIndex, setStartIndex] = useState(0);
  const total = testimonials.length;

  const prev = () => setStartIndex((i) => (i - 1 + total) % total);
  const next = () => setStartIndex((i) => (i + 1) % total);

  // three visible on ≥640 px (sm:), one otherwise
  const visibleCount = 3;

  const getVisibleCards = () =>
    Array.from({ length: visibleCount }, (_, i) => testimonials[(startIndex + i) % total]);

  const visibleCards = getVisibleCards();

  return (
  <div
      className="bg-white min-h-screen py-16 px-4 bg-cover bg-center"
   
    >
      {/* Heading */}
     <h2 className="text-4xl font-mont font-bold text-center pb-16  mb-12">
        Testimonials
      </h2>

      <div className="relative max-w-7xl mx-auto flex items-center">
        {/* Arrows (hide on mobile) */}
        <button
          onClick={prev}
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-purple-100 hover:bg-purple-200 p-2 rounded-full shadow"
        >
          <ChevronLeft className="text-purple-700 w-6 h-6" />
        </button>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-12">

          {visibleCards.map((item, idx) => {
            const isMiddle = visibleCount === 1 || idx === 1; // center card in desktop, only card in mobile
            return (
              <div
                key={item.id}
                className={`relative flex flex-col items-center text-center rounded-2xl shadow-lg transition-all duration-300
                  ${isMiddle ? 'bg-purple-300 scale-105' : 'bg-purple-100'}
                 w-full

                  p-6 sm:p-8 pt-20
                `}
              >
                {/* Profile pic */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
                  />
                </div>

                <p className="text-sm text-gray-800 italic m-8 px-2 break-words leading-relaxed">
                  “{item.quote}”
                </p>
                <h3 className="text-base sm:text-lg font-semibold text-purple-800">{item.name}</h3>
                <span className="text-xs sm:text-sm text-purple-600">{item.role}</span>
              </div>
            );
          })}
        </div>

        <button
          onClick={next}
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-purple-100 hover:bg-purple-200 p-2 rounded-full shadow"
        >
          <ChevronRight className="text-purple-700 w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default TestimonialPage;
