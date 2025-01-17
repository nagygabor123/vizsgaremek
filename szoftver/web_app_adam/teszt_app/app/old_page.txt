"use client";

import { useState, useEffect } from "react";

export default function HomePage() {
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [isButtonVisible, setButtonVisible] = useState(true);

  // Ellenőrizzük a localStorage-t a komponens betöltésekor
  useEffect(() => {
    const hasClickedBefore = localStorage.getItem("hasClickedOverlayButton");
    if (hasClickedBefore === "true") {
      setButtonVisible(false);
    }
  }, []);

  // Gomb kattintás kezelése
  const handleButtonClick = () => {
    setOverlayVisible(true);
    setButtonVisible(false);
    localStorage.setItem("hasClickedOverlayButton", "true");
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
      {/* Gomb csak akkor jelenik meg, ha az isButtonVisible true */}
      {isButtonVisible && (
        <button
          onClick={handleButtonClick}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Mutasd az ablakot
        </button>
      )}

      {isOverlayVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          {/* Bal felső sarokban szöveg */}
          <div className="absolute top-4 left-4 text-white text-lg font-semibold">
            Ez egy bal felső sarokban lévő szöveg
          </div>

          {/* Középen tartalom */}
          <div className="text-center text-white">
            <p className="mb-6 text-2xl font-bold">Ez egy teljes képernyős felugró ablak!</p>
            <button
              onClick={() => setOverlayVisible(false)}
              className="px-4 py-2 text-black bg-white rounded hover:bg-gray-200"
            >
              Bezárás
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
