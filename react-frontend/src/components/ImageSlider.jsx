
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
  'https://ehealth.kerala.gov.in/themes/medicare_zymphonies_theme/images/slider/ehk1.jpg',
  'https://images.unsplash.com/photo-1581056781163-c76d58623528?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1603398938378-e54eab446dde?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1580281657527-47f249e8f4df?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1602216056096-3b404039b790?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
];

const kenBurnsAnimations = [
  'ken-burns-1',
  'ken-burns-2',
  'ken-burns-3',
  'ken-burns-4',
  'ken-burns-1', // repeat for the 5th image
];

const ImageSlider = ({ children, scrollY }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    return () => clearInterval(slideInterval);
  }, [currentIndex]);

  return (
    <div className="relative w-full h-96 md:h-[500px] overflow-hidden group">
      {images.map((src, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={src} alt={`Slide ${index + 1}`} className={`w-full h-full object-cover ${kenBurnsAnimations[index]}`} />
        </div>
      ))}

      <div
        className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-white z-10 p-4"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        {children}
      </div>

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 text-gray-800 rounded-full p-2 z-20 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:translate-x-2"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 text-gray-800 rounded-full p-2 z-20 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:-translate-x-2"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-125 ${index === currentIndex ? 'bg-white scale-125' : 'bg-gray-400'}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
