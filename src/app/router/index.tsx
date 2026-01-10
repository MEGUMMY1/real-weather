import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";
import { HomePage } from "@pages/home/index";
import { DetailPage } from "@pages/detail/index";
import { useFavoritesStore } from "@shared/lib/useFavoritesStore";
import { Header } from "@shared/ui/Header";

const DetailPageWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const favorites = useFavoritesStore((state) => state.favorites);

  const favorite = favorites.find((fav) => fav.id === id);

  if (!favorite) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 pt-16 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-lg mb-4">즐겨찾기를 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30"
          >
            홈으로
          </button>
        </div>
      </div>
    );
  }

  return <DetailPage location={favorite} onBack={() => navigate("/")} />;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/detail/:id" element={<DetailPageWrapper />} />
      </Routes>
    </BrowserRouter>
  );
};
