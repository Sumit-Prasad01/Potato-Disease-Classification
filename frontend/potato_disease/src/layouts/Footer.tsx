export const Footer = () => {
  return (
     <footer className="fixed bottom-0 left-1/2 transform -translate-x-1/2 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-6 py-3 text-sm text-white shadow-lg z-40 min-w-screen">
      <div className="flex flex-col items-center text-center">
        <p className="text-white/80">
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
        <div className="flex gap-4 mt-1 text-blue-300">
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Contact</a>
        </div>
      </div>
    </footer>
  );
};
