import { useState } from "react";
import IntroSection from "../components/IntroSection";
import Navbar from "../components/Navbar";
import Login from "./Login";
import Signup from "../components/Signup";

export default function Homepage() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <>
      <Navbar />
      <section className="grid grid-cols-1 md:grid-cols-2 bg-indigo-50 min-h-screen pt-36 overflow-hidden">
        <IntroSection />
        {showLogin ? (
          <Login onToggleSignup={() => setShowLogin(false)} />
        ) : (
          <Signup onToggleLogin={() => setShowLogin(true)} />
        )}
      </section>
    </>
  );
}
