"use client"

import { X, ZoomIn, ZoomOut, RotateCw } from "lucide-react"
import { useState } from "react"

interface ImageViewerProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  productName: string
}

export function ImageViewer({ isOpen, onClose, imageUrl, productName }: ImageViewerProps) {
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5))
  }

  const handleRotate = () => {
    setRotation(prev => prev + 90)
  }

  const handleReset = () => {
    setScale(1)
    setRotation(0)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === '+' || e.key === '=') handleZoomIn()
    if (e.key === '-' || e.key === '_') handleZoomOut()
    if (e.key === 'r') handleRotate()
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
        >
          <X size={24} />
        </button>

        {/* Controls */}
        <div className="absolute top-4 left-4 z-10 bg-white/10 backdrop-blur-sm rounded-lg p-2 flex gap-2">
          <button
            onClick={handleZoomOut}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded transition-colors"
            title="Zoom Out (-)"
          >
            <ZoomOut size={20} />
          </button>
          <button
            onClick={handleZoomIn}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded transition-colors"
            title="Zoom In (+)"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={handleRotate}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded transition-colors"
            title="Rotate (R)"
          >
            <RotateCw size={20} />
          </button>
          <button
            onClick={handleReset}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded transition-colors text-xs"
            title="Reset"
          >
            1:1
          </button>
        </div>

        {/* Scale Info */}
        <div className="absolute bottom-4 left-4 z-10 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
          <span className="text-white text-sm font-medium">
            {Math.round(scale * 100)}%
          </span>
        </div>

        {/* Product Name */}
        <div className="absolute bottom-4 right-4 z-10 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 max-w-xs">
          <span className="text-white text-sm font-medium truncate">
            {productName}
          </span>
        </div>

        {/* Image Container */}
        <div 
          className="relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={imageUrl}
            alt={productName}
            className="max-w-full max-h-full object-contain select-none transition-transform duration-300 ease-out"
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              cursor: scale > 1 ? 'move' : 'default'
            }}
            draggable={false}
          />
        </div>
      </div>
    </div>
  )
}
