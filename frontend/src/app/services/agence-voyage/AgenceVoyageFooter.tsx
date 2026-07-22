import React from "react";

export default function AgenceVoyageFooter() {
  return (
    <footer className="w-full bg-white text-black py-10 px-6 mt-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex-1 flex flex-col items-start">
          <h2 className="text-2xl font-extrabold mb-2">Explore the World with Asmyne Groupe</h2>
          <p className="text-gray-700 mb-4">Your trusted partner for unforgettable journeys and the best travel deals.</p>
          <span className="text-gray-500 text-sm">© 2026 Asmyne Groupe. All rights reserved.</span>
        </div>
        <div className="flex-1 flex flex-col items-end">
          <div className="flex gap-4 mb-2">
            <a href="#" className="text-blue-600 hover:text-blue-800" aria-label="Instagram"><i className="fab fa-instagram text-2xl"></i></a>
            <a href="#" className="text-blue-600 hover:text-blue-800" aria-label="Facebook"><i className="fab fa-facebook text-2xl"></i></a>
            <a href="#" className="text-blue-600 hover:text-blue-800" aria-label="YouTube"><i className="fab fa-youtube text-2xl"></i></a>
            <a href="#" className="text-blue-600 hover:text-blue-800" aria-label="TikTok"><i className="fab fa-tiktok text-2xl"></i></a>
          </div>
          <div className="flex gap-6 text-blue-600 text-sm">
            <a href="#" className="hover:text-blue-800 underline">Privacy Policy</a>
            <a href="#" className="hover:text-blue-800 underline">Terms of Service</a>
            <a href="#" className="hover:text-blue-800 underline">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
