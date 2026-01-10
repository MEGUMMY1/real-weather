import { useState, useEffect, useRef } from "react";
import { searchLocations, type LocationItem } from "@shared/lib/locationSearch";
import { useEnterKeyHandler } from "@shared/lib/useEnterKey";
import { Icon } from "@shared/ui/Icon";

interface LocationSearchProps {
  onSelectLocation: (location: LocationItem) => void;
  selectedLocation?: LocationItem | null;
}

export const LocationSearch = ({ onSelectLocation, selectedLocation }: LocationSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      setQuery(selectedLocation.displayName);
    } else {
      setQuery("");
      setResults([]);
      setIsOpen(false);
    }
  }, [selectedLocation]);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);

    if (!searchQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);

    try {
      const locations = await searchLocations(searchQuery, 10);
      setResults(locations);
    } catch (error) {
      console.error("장소 검색 오류:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (location: LocationItem) => {
    setQuery(location.displayName);
    setIsOpen(false);
    onSelectLocation(location);
  };

  const handleEnter = () => {
    if (results.length > 0) {
      // 첫 번째 검색 결과 선택
      handleSelect(results[0]);
    } else if (query.trim() && !isLoading) {
      // 검색 결과가 없으면 검색 시도
      handleSearch(query);
    }
  };

  const handleEscape = () => {
    setIsOpen(false);
  };

  const handleKeyDown = useEnterKeyHandler(handleEnter, handleEscape);

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none z-10">
          <Icon icon="search" size="md" className="text-white/60" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0 || query.trim()) {
              setIsOpen(true);
            }
          }}
          placeholder="장소를 검색하세요 (예: 서울특별시, 종로구, 청운동)"
          className="w-full pl-12 pr-8 py-3 rounded-lg bg-white/20 backdrop-blur-md text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
        />
        {isLoading ? (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
                setIsOpen(false);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            >
              <Icon icon="close" size="sm" />
            </button>
          )
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-md rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {results.map((location, index) => (
            <button
              key={index}
              onClick={() => handleSelect(location)}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="text-gray-800 font-medium">{location.displayName}</div>
              <div className="text-sm text-gray-500 mt-1">
                {location.parts.si}
                {location.parts.gu && ` > ${location.parts.gu}`}
                {location.parts.dong && ` > ${location.parts.dong}`}
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.trim() && results.length === 0 && !isLoading && (
        <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-md rounded-lg shadow-xl p-4">
          <p className="text-gray-600 text-center">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
};
