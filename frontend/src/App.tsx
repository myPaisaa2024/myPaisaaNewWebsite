import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Stats from "@/pages/Stats";
import HomeV2 from "@/pages/HomeV2";
import HomeV3 from "@/pages/HomeV3";
import HomeV4 from "@/pages/HomeV4";
import HomeV5 from "@/pages/HomeV5";
import HomeV6 from "@/pages/HomeV6";
import Leads from "@/pages/Leads";

// One <Route> per page in src/pages; BrowserRouter already wraps this in main.tsx.
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/v2" element={<HomeV2 />} />
      <Route path="/v3" element={<HomeV3 />} />
      <Route path="/v4" element={<HomeV4 />} />
      <Route path="/v5" element={<HomeV5 />} />
      <Route path="/v6" element={<HomeV6 />} />
      <Route path="/leads" element={<Leads />} />
      <Route path="/stats" element={<Stats />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
