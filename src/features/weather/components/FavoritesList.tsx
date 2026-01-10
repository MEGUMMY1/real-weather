import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useFavoritesStore, type FavoriteLocation } from "@shared/lib/useFavoritesStore";
import { fetchWeatherData } from "@shared/api/weather/api";
import { addressToCoordinates } from "@shared/lib/geocoding";
import { FavoriteCard } from "./FavoriteCard";
import { Icon } from "@shared/ui/Icon";

interface FavoritesListProps {
  onFavoriteClick: (favorite: FavoriteLocation) => void;
}

export const FavoritesList = ({ onFavoriteClick }: FavoritesListProps) => {
  const favorites = useFavoritesStore((state) => state.favorites);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const updateFavoriteAlias = useFavoritesStore((state) => state.updateFavoriteAlias);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const checkScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    if (favorites.length === 0) return;
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);
      return () => {
        container.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("resize", checkScrollButtons);
      };
    }
  }, [favorites]);

  if (favorites.length === 0) {
    return null;
  }

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const isDesktop = window.innerWidth >= 1024;
    const cardWidth = container.offsetWidth / (isDesktop ? 3 : 2);
    const gap = 16;
    const scrollAmount = direction === "left" ? -(cardWidth + gap) : cardWidth + gap;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && canScrollRight) {
      scroll("right");
    }
    if (isRightSwipe && canScrollLeft) {
      scroll("left");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mb-6">
      <h2 className="text-white text-xl font-bold mb-4">즐겨찾기</h2>
      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/20 backdrop-blur-md rounded-full p-2 text-white hover:bg-white/30 transition-colors shadow-lg"
            aria-label="이전"
          >
            <Icon icon="chevron_left" size="md" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {favorites.map((favorite) => (
            <div
              key={favorite.id}
              className="flex-none snap-start w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)]"
            >
              <FavoriteWeatherCard
                favorite={favorite}
                onRemove={() => removeFavorite(favorite.id)}
                onUpdateAlias={(alias) => updateFavoriteAlias(favorite.id, alias)}
                onClick={() => onFavoriteClick(favorite)}
              />
            </div>
          ))}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/20 backdrop-blur-md rounded-full p-2 text-white hover:bg-white/30 transition-colors shadow-lg"
            aria-label="다음"
          >
            <Icon icon="chevron_right" size="md" />
          </button>
        )}
      </div>
    </div>
  );
};

interface FavoriteWeatherCardProps {
  favorite: FavoriteLocation;
  onClick: () => void;
  onRemove: () => void;
  onUpdateAlias: (alias: string) => void;
}

const FavoriteWeatherCard = ({
  favorite,
  onClick,
  onRemove,
  onUpdateAlias,
}: FavoriteWeatherCardProps) => {
  const { data } = useQuery({
    queryKey: ["favorite-weather", favorite.id],
    queryFn: async () => {
      const coords = addressToCoordinates(favorite.fullName);
      if (!coords) {
        throw new Error("좌표를 찾을 수 없습니다.");
      }
      return await fetchWeatherData(coords.lat, coords.lon);
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <FavoriteCard
      favorite={favorite}
      weatherData={data}
      onClick={onClick}
      onRemove={onRemove}
      onUpdateAlias={onUpdateAlias}
    />
  );
};
