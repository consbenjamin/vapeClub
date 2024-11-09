'use client'

import React, { useState } from 'react'
import Image from 'next/image'

const products = [
  { id: 1, name: "Vape Pen Deluxe", price: 39.99, image: "/placeholder.svg?height=200&width=200" },
  { id: 2, name: "Cloud Master Kit", price: 59.99, image: "/placeholder.svg?height=200&width=200" },
  { id: 3, name: "Flavor Burst Pod", price: 24.99, image: "/placeholder.svg?height=200&width=200" },
  { id: 4, name: "Stealth Vape Mini", price: 34.99, image: "/placeholder.svg?height=200&width=200" },
  { id: 5, name: "Vapor King XL", price: 79.99, image: "/placeholder.svg?height=200&width=200" },
  { id: 6, name: "Aroma Cloud Pro", price: 54.99, image: "/placeholder.svg?height=200&width=200" },
  { id: 7, name: "Mist Maker Elite", price: 64.99, image: "/placeholder.svg?height=200&width=200" },
  { id: 8, name: "Vapor Bliss Kit", price: 44.99, image: "/placeholder.svg?height=200&width=200" },
]

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % (products.length - 4))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + (products.length - 4)) % (products.length - 4))
  }

  return (
    <div className="relative w-full mx-auto py-4">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out" 
          style={{ transform: `translateX(-${currentIndex * 20}%)` }}
        >
          {products.map((product) => (
            <div key={product.id} className="w-1/5 flex-shrink-0 px-2">
              <div className="p-3 bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={150}
                  height={150}
                  className="w-full h-auto mb-2 rounded-md"
                />
                <h3 className="text-sm font-medium text-gray-800 truncate">{product.name}</h3>
                <p className="text-xs text-gray-600">${product.price.toFixed(2)}</p>
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
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/50 p-1.5 rounded-full shadow-md hover:bg-white/80 transition-colors z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-gray-800">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}