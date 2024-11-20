'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Carousel() {
  const [products, setProducts] = useState([]) 
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/productos')
        const data = await response.json()
        const featuredProducts = data.filter(product => product.destacado === true)
        setProducts(featuredProducts)
      } catch (error) {
        console.error('Error al obtener productos destacados:', error)
      }
    }

    fetchProducts()
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length)
  }

  return (
    <div className="relative w-full mx-auto py-4">
      {products.length > 0 ? (
        <>
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${(currentIndex * 100) / Math.max(products.length, 1)}%)`,
              }}
            >
              {products.map((product) => (
                <div key={product._id} className="w-1/6 flex-shrink-0 px-2 py-3">
                  <div className="p-3 bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
                    <Image
                      src={product.imagen}
                      alt={product.nombre}
                      width={120}
                      height={120}
                      quality={90}
                      layout="responsive"
                      className="w-full h-auto mb-2 rounded-md object-cover"
                    />
                    <h3 className="text-sm font-medium text-gray-800 truncate">{product.nombre}</h3>
                    <p className="text-xs text-gray-600">${product.precio.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/50 p-1.5 rounded-full shadow-md hover:bg-white/80 transition-colors z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-gray-800">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/50 p-1.5 rounded-full shadow-md hover:bg-white/80 transition-colores z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-gray-800">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      ) : (
        <p className="text-center text-gray-500">Cargando productos destacados...</p>
      )}
    </div>
  )
}
