import { Route, Routes } from "react-router";
import { Home } from "./pages/Home";
import { Navbar } from "./components/Navbar";
import { CreatePostPage } from "./pages/CreatePostPage";
import { PostPage } from "./pages/PostPage";
import { UserPage } from "./pages/UserPage";
import { Footer } from "./pages/Footer";
import TermsOfUse from "./pages/Terms";
import PrivacyPolicy from "./pages/Privacy";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-gray-100 transition-opacity duration-700">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6 pt-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/user/:username" element={<UserPage />} />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
