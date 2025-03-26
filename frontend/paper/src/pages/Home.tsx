
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import MainNews from "@/components/MainNews";
import Sidebar from "@/components/Sidebar";
import StocksSports from "@/components/StocksSports";
import NewsGrid from "@/components/NewsGrid";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Navbar />
      {/* <main className="grid grid-cols-3 gap-4 p-4">
        <MainNews />
        <Sidebar />
      </main>
      <StocksSports />
      <NewsGrid />
      <Footer /> */}
    </div>
  );
};

export default Home;