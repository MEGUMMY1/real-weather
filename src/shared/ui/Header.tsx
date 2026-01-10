import { useNavigate, useLocation } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const handleLogoClick = () => {
    if (!isHome) {
      navigate("/");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-2 md:py-4">
        <div
          onClick={handleLogoClick}
          className="max-w-4xl mx-auto flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <img src="/image/realweather.png" alt="리얼웨더" className="w-8 h-8 md:w-10 md:h-10" />
          <h1 className="text-2xl md:text-3xl font-bold text-white">리얼웨더</h1>
        </div>
      </div>
    </header>
  );
};
