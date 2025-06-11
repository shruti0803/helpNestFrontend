import React, { useRef } from 'react';

const videos = [
  'https://videos.pexels.com/video-files/7516770/7516770-uhd_1440_2560_25fps.mp4',
  'https://videos.pexels.com/video-files/7172888/7172888-sd_640_360_25fps.mp4',
  'https://videos.pexels.com/video-files/7517687/7517687-sd_640_360_25fps.mp4',
  'https://videos.pexels.com/video-files/7947521/7947521-sd_640_360_30fps.mp4',
];

const Hero = () => {
  const videoRefs = useRef([]);

  const handleMouseEnter = (index) => {
    videoRefs.current[index].play();
  };

  const handleMouseLeave = (index) => {
    videoRefs.current[index].pause();
    videoRefs.current[index].currentTime = 0;
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between min-h-screen bg-gradient-to-r from-fuchsia-50 via-purple-200 to-purple-300
 px-6 md:px-16 py-24 ">
      {/* Left Text Section */}
      <div className="w-full md:w-1/2 mb-10 md:mb-0 p-8 ">
        <h1 className="text-6xl md:text-5xl font-roboto font-bold text-purple-900 mb-6">
          Welcome to HelpNest
        </h1>
        <p className="text-lg text-gray-700 mb-6 mr-4">
         A trusted platform for health, independence, and everyday support.
        
Designed to help elders manage medicines, track wellness, and connect with reliable helpers—while staying safe, confident, and connected to their community.
        </p>
        
        <div className='flex gap-4 py-4'>
        <button className="px-6 py-3 bg-purple-600 text-white rounded-2xl shadow-md hover:bg-purple-800 transition">
          Get Started
        </button>
        <button className="px-6 py-3 text-black bg-white border-2 border-purple-300 rounded-2xl shadow-md hover:bg-purple-800 transition">
          Explore
        </button>
       </div>
      </div>

      {/* Right Video Section */}
      <div className="w-full mt-10 md:w-1/2 grid grid-cols-2 gap-4 bg-purple-50  p-4">
        {videos.map((src, index) => (
          <video
            key={index}
            className="w-full h-48 object-cover  shadow-lg cursor-pointer"
            muted
            loop
            playsInline
            ref={(el) => (videoRefs.current[index] = el)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ))}
      </div>
      
    </div>
  );
};

export default Hero;
