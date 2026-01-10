import { useRef, useState } from "react";
import type { WeatherData } from "@shared/api/weather/types";

interface HourlyWeatherProps {
  data: WeatherData;
}

export const HourlyWeather = ({ data }: HourlyWeatherProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (scrollRef.current) {
      setStartX(e.pageX - scrollRef.current.offsetLeft);
      setScrollLeft(scrollRef.current.scrollLeft);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scrollRef.current) {
      setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
      setScrollLeft(scrollRef.current.scrollLeft);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 shadow-xl">
      <h3 className="text-xl md:text-2xl font-bold text-white mb-4">시간대별 기온</h3>
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className="overflow-x-auto cursor-grab active:cursor-grabbing scrollbar-hide"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex gap-3 md:gap-4 min-w-max pb-2">
          {data.hourlyTemps.map((item, index) => (
            <div
              key={`${item.date || ""}-${item.time}-${index}`}
              className="flex flex-col items-center bg-white/10 rounded-lg p-3 md:p-4 min-w-[60px] md:min-w-[80px] flex-shrink-0"
            >
              <div className="text-white/70 text-sm md:text-base mb-2 text-center">{item.time}</div>
              <div className="text-white text-xl md:text-2xl font-bold">
                {Math.round(item.temp)}°
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
