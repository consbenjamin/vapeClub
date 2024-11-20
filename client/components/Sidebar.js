import React from 'react';

const Sidebar = ({ isOpen, onClose, onAddProduct }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-4 transition-transform transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:static md:block`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold mb-2">Panel de Control</h2>
        
        <button className="md:hidden text-white" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <button 
        onClick={onAddProduct}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mb-4"
      >
        Agregar Producto
      </button>
    </div>
  );
};

export default Sidebar;
