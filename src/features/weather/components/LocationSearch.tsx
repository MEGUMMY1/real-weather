import { useState, useEffect, useRef } from "react";
import { searchLocations, type LocationItem } from "@shared/lib/locationSearch";
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
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

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
      setSelectedIndex(-1);
    } else {
      setQuery("");
      setResults([]);
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  }, [selectedLocation]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [results]);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);

    if (!searchQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      setSelectedIndex(-1);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);

    try {
      const locations = await searchLocations(searchQuery, 10);
      setResults(locations);
      setSelectedIndex(-1);
    } catch (error) {
      console.error("장소 검색 오류:", error);
      setResults([]);
      setSelectedIndex(-1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (location: LocationItem) => {
    setQuery(location.displayName);
    setIsOpen(false);
    setSelectedIndex(-1);
    onSelectLocation(location);
  };

  useEffect(() => {
    if (selectedIndex >= 0 && itemRefs.current[selectedIndex] && resultsRef.current) {
      const selectedElement = itemRefs.current[selectedIndex];
      const resultsContainer = resultsRef.current;

      if (selectedElement) {
        const itemTop = selectedElement.offsetTop;
        const itemBottom = itemTop + selectedElement.offsetHeight;
        const containerTop = resultsContainer.scrollTop;
        const containerBottom = containerTop + resultsContainer.offsetHeight;

        if (itemTop < containerTop) {
          resultsContainer.scrollTop = itemTop;
        } else if (itemBottom > containerBottom) {
          resultsContainer.scrollTop = itemBottom - resultsContainer.offsetHeight;
        }
      }
    }
  }, [selectedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) {
      if (e.key === "Enter" && query.trim() && !isLoading) {
        handleSearch(query);
      } else if (e.key === "Escape") {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => {
          const nextIndex = prev < results.length - 1 ? prev + 1 : prev;
          return nextIndex >= 0 ? nextIndex : 0;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => {
          const nextIndex = prev > 0 ? prev - 1 : -1;
          return nextIndex;
        });
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelect(results[selectedIndex]);
        } else if (results.length > 0) {
          handleSelect(results[0]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

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
        <div
          ref={resultsRef}
          className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-md rounded-lg shadow-xl max-h-60 overflow-y-auto"
        >
          {results.map((location, index) => (
            <button
              key={index}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              onClick={() => handleSelect(location)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`w-full px-4 py-3 text-left transition-colors border-b border-gray-100 last:border-b-0 ${
                selectedIndex === index
                  ? "bg-blue-100 text-blue-900"
                  : "hover:bg-blue-50 text-gray-800"
              }`}
            >
              <div className="font-medium">{location.displayName}</div>
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
