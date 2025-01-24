import React from 'react';
import bgVideo from '../assets/vdo.mp4';

const VideoBackground = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute z-0 w-full h-full object-cover"
        style={{
          filter: 'brightness(0.4) contrast(1.2)'
        }}
      >
        <source src={bgVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Cyberpunk grid overlay */}
      <div 
        className="absolute inset-0 z-10 opacity-10 pointer-events-none" 
        style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(32, 255, 0, 0.04) 25%, rgba(32, 255, 0, 0.04) 26%, transparent 27%, transparent 74%, rgba(32, 255, 0, 0.04) 75%, rgba(32, 255, 0, 0.04) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(32, 255, 0, 0.04) 25%, rgba(32, 255, 0, 0.04) 26%, transparent 27%, transparent 74%, rgba(32, 255, 0, 0.04) 75%, rgba(32, 255, 0, 0.04) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Content */}
      <div className="relative z-20 flex items-center justify-center min-h-screen px-4">
        {children}
      </div>
    </div>
  );
};

export default VideoBackground;
