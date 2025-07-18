import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Navbar = () => {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-5xl backdrop-blur-md bg-white/10 border border-white/20 shadow-xl rounded-2xl px-6 py-3 flex justify-between items-center">
      <motion.div
        className="text-xl font-semibold text-white"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Potato Disease Classification
      </motion.div>

      <div className="hidden md:flex gap-6 text-sm font-medium text-blue-300">
        {['Home', 'About', 'Services', 'Contact'].map((item) => (
          <motion.div
            key={item}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Link to={`/${item.toLowerCase()}`} className="hover:underline">
              {item}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
