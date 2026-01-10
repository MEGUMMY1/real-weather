import { useQuery } from "@tanstack/react-query";
import { useFavoritesStore, type FavoriteLocation } from "@shared/lib/useFavoritesStore";
import { fetchWeatherData } from "@shared/api/weather/api";
import { addressToCoordinates } from "@shared/lib/geocoding";
import { FavoriteCard } from "./FavoriteCard";

interface FavoritesListProps {
  onFavoriteClick: (favorite: FavoriteLocation) => void;
}

export const FavoritesList = ({ onFavoriteClick }: FavoritesListProps) => {
  const favorites = useFavoritesStore((state) => state.favorites);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const updateFavoriteAlias = useFavoritesStore((state) => state.updateFavoriteAlias);

  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto mb-6">
      <h2 className="text-white text-xl font-bold mb-4">즐겨찾기</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((favorite) => (
          <FavoriteWeatherCard
            key={favorite.id}
            favorite={favorite}
            onRemove={() => removeFavorite(favorite.id)}
            onUpdateAlias={(alias) => updateFavoriteAlias(favorite.id, alias)}
            onClick={() => onFavoriteClick(favorite)}
          />
        ))}
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
