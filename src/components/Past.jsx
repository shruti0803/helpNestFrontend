import React, { useRef } from 'react';

const videoData = [
  { src: 'https://videos.pexels.com/video-files/7516770/7516770-uhd_1440_2560_25fps.mp4', size: 'w-40 h-40' },
  { src: 'https://media.istockphoto.com/id/1067843836/video/so-yes-everythings-looking-good.mp4?s=mp4-480x480-is&k=20&c=E75hnpf8mAAsK-eUxzIigqie2orM07kOIb3HN7f5sKg=', size: 'w-64 h-40' },
  { src: 'https://videos.pexels.com/video-files/8400728/8400728-sd_640_360_25fps.mp4', size: 'w-48 h-48' },
  { src: 'https://videos.pexels.com/video-files/7821854/7821854-sd_640_360_30fps.mp4', size: 'w-56 h-48' },
  { src: 'https://videos.pexels.com/video-files/6646677/6646677-hd_1920_1080_24fps.mp4', size: 'w-40 h-40' },
  { src: 'https://videos.pexels.com/video-files/6651084/6651084-sd_506_960_25fps.mp4', size: 'w-64 h-36' },
  { src: 'https://cdn.pixabay.com/video/2024/08/31/229069_tiny.mp4', size: 'w-44 h-44' },
  { src: 'https://videos.pexels.com/video-files/6520252/6520252-uhd_1440_2560_24fps.mp4', size: 'w-48 h-40' },
];

const Past = () => {
  const videoRefs = useRef([]);

  const handleHover = (index) => {
    videoRefs.current.forEach((video, i) => {
      if (i !== index && video) {
        video.pause();
        video.currentTime = 0;
      }
    });
    const current = videoRefs.current[index];
    if (current) {
      current.play();
    }
  };

  const handleLeave = (index) => {
    const current = videoRefs.current[index];
    if (current) {
      current.pause();
      current.currentTime = 0;
    }
  };

  return (
    <div className=" bg-gradient-to-r from-fuchsia-50 to-purple-300 py-20 px-6 min-h-screen">
      <h2 className="text-4xl font-bold text-center  mb-12">
        Our Journey So Far
      </h2>
      <div className="flex flex-wrap  justify-center gap-6 max-w-6xl mx-auto">
        {videoData.map((video, index) => (
          <div
            key={index}
            className={`relative ${video.size}  overflow-hidden transition-transform p-2 bg-purple-50 duration-300 transform hover:scale-110 hover:z-10 shadow-lg`}
            onMouseEnter={() => handleHover(index)}
            onMouseLeave={() => handleLeave(index)}
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
            >
              <source src={video.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Past;
