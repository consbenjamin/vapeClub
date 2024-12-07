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
    <div className="relative w-full mx-auto py-8 bg-gray-50">
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
                <div key={product._id} className="w-1/3 flex-shrink-0 px-4">
                  <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <Image
                      src={product.imagen}
                      alt={product.nombre}
                      width={180}
                      height={180}
                      quality={90}
                      layout="responsive"
                      className="w-full h-auto mb-4 rounded-md object-cover"
                    />
                    <h3 className="text-base font-semibold text-gray-800 truncate">{product.nombre}</h3>
                    <p className="text-sm font-medium text-gray-600 mt-2">${product.precio.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800/70 p-2 rounded-full hover:bg-gray-800 transition-colors z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800/70 p-2 rounded-full hover:bg-gray-800 transition-colors z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-white">
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
