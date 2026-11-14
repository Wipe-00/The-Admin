import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Minus, Square, X, Copy } from 'lucide-react'
import type { WindowState } from '../../types/os'

interface WindowFrameProps {
  windowData: WindowState
  isActive: boolean
  onFocus: () => void
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  onUpdatePosition: (pos: { x: number; y: number }) => void
  onUpdateSize?: (size: { width: number; height: number }) => void
  children: React.ReactNode
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  windowData,
  isActive,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onUpdatePosition,
  onUpdateSize,
  children
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [isSnapPreview, setIsSnapPreview] = useState(false)
  const wasMaximizedOnDragRef = useRef(false)
  const prevViewportRef = useRef<{ w: number; h: number }>({
    w: globalThis.window.innerWidth,
    h: globalThis.window.innerHeight
  })

  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0
  })

  const resizeStartRef = useRef<{ mouseX: number; mouseY: number; startWidth: number; startHeight: number }>({
    mouseX: 0,
    mouseY: 0,
    startWidth: 0,
    startHeight: 0
  })

  // Proportional Window Scaling on Screen Resize / Fullscreen Toggle (Item #3)
  useEffect(() => {
    const handleViewportResize = () => {
      const newVw = globalThis.window.innerWidth
      const newVh = globalThis.window.innerHeight
      const oldVw = prevViewportRef.current.w
      const oldVh = prevViewportRef.current.h

      if (oldVw > 0 && oldVh > 0 && (Math.abs(newVw - oldVw) > 4 || Math.abs(newVh - oldVh) > 4)) {
        const scaleX = newVw / oldVw
        const scaleY = newVh / oldVh

        prevViewportRef.current = { w: newVw, h: newVh }

        if (!windowData.isMaximized) {
          const scaledW = Math.round(
            Math.max(480, Math.min(windowData.size.width * scaleX, newVw - 24))
          )
          const scaledH = Math.round(
            Math.max(340, Math.min(windowData.size.height * scaleY, newVh - 54))
          )
          const scaledX = Math.round(
            Math.max(0, Math.min(windowData.position.x * scaleX, Math.max(0, newVw - scaledW)))
          )
          const scaledY = Math.round(
            Math.max(0, Math.min(windowData.position.y * scaleY, Math.max(0, newVh - scaledH - 42)))
          )

          if (onUpdateSize) {
            onUpdateSize({ width: scaledW, height: scaledH })
          }
          onUpdatePosition({ x: scaledX, y: scaledY })
        }
      }
    }

    globalThis.window.addEventListener('resize', handleViewportResize)
    return () => globalThis.window.removeEventListener('resize', handleViewportResize)
  }, [windowData.isMaximized, windowData.size.width, windowData.size.height, windowData.position.x, windowData.position.y, onUpdatePosition, onUpdateSize])

  // Handle Dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    if ((e.target as HTMLElement).closest('button')) return

    onFocus()
    setIsDragging(true)
    wasMaximizedOnDragRef.current = windowData.isMaximized

    if (windowData.isMaximized) {
      dragStartRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        startX: 0,
        startY: 0
      }
    } else {
      dragStartRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        startX: windowData.position.x,
        startY: windowData.position.y
      }
    }
  }

  // Handle Resizing
  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || windowData.isMaximized) return
    e.stopPropagation()
    onFocus()
    setIsResizing(true)
    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startWidth: windowData.size.width,
      startHeight: windowData.size.height
    }
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        if (wasMaximizedOnDragRef.current && windowData.isMaximized) {
          const deltaY = Math.abs(e.clientY - dragStartRef.current.mouseY)
          const deltaX = Math.abs(e.clientX - dragStartRef.current.mouseX)
          if (deltaY > 5 || deltaX > 5) {
            onMaximize()
            wasMaximizedOnDragRef.current = false
            const ratio = Math.max(0.1, Math.min(0.9, e.clientX / globalThis.window.innerWidth))
            const targetW = windowData.size.width || 800
            const newX = Math.max(0, Math.min(e.clientX - targetW * ratio, globalThis.window.innerWidth - targetW))
            const newY = Math.max(0, e.clientY - 16)
            dragStartRef.current = {
              mouseX: e.clientX,
              mouseY: e.clientY,
              startX: newX,
              startY: newY
            }
            onUpdatePosition({ x: newX, y: newY })
            return
          }
          return
        }

        const deltaX = e.clientX - dragStartRef.current.mouseX
        const deltaY = e.clientY - dragStartRef.current.mouseY
        
        const newX = Math.max(0, Math.min(dragStartRef.current.startX + deltaX, globalThis.window.innerWidth - 100))
        const newY = Math.max(0, Math.min(dragStartRef.current.startY + deltaY, globalThis.window.innerHeight - 80))
        
        onUpdatePosition({ x: newX, y: newY })

        if (e.clientY <= 8) {
          setIsSnapPreview(true)
        } else {
          setIsSnapPreview(false)
        }
      } else if (isResizing && onUpdateSize) {
        const deltaW = e.clientX - resizeStartRef.current.mouseX
        const deltaH = e.clientY - resizeStartRef.current.mouseY

        const newW = Math.max(480, Math.min(resizeStartRef.current.startWidth + deltaW, globalThis.window.innerWidth - 40))
        const newH = Math.max(340, Math.min(resizeStartRef.current.startHeight + deltaH, globalThis.window.innerHeight - 60))

        onUpdateSize({ width: newW, height: newH })
      }
    },
    [isDragging, isResizing, windowData.isMaximized, windowData.size.width, onMaximize, onUpdatePosition, onUpdateSize]
  )

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        setIsDragging(false)
        setIsSnapPreview(false)
        wasMaximizedOnDragRef.current = false
        if (e.clientY <= 8 && !windowData.isMaximized) {
          onMaximize()
        }
      }
      if (isResizing) setIsResizing(false)
    },
    [isDragging, isResizing, windowData.isMaximized, onMaximize]
  )

  useEffect(() => {
    if (isDragging || isResizing) {
      globalThis.window.addEventListener('mousemove', handleMouseMove)
      globalThis.window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      globalThis.window.removeEventListener('mousemove', handleMouseMove)
      globalThis.window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp])

  if (windowData.isMinimized) return null

  const style: React.CSSProperties = windowData.isMaximized
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 'calc(100vh - 42px)',
        zIndex: windowData.zIndex
      }
    : {
        position: 'absolute',
        top: `${windowData.position.y}px`,
        left: `${windowData.position.x}px`,
        width: `${windowData.size.width}px`,
        height: `${windowData.size.height}px`,
        zIndex: windowData.zIndex
      }

  return (
    <>
      {isSnapPreview && (
        <div className="fixed inset-x-2 top-2 h-[calc(100vh-50px)] border-2 border-sky-400/60 bg-sky-500/10 rounded-xl pointer-events-none z-[9999] animate-pulse shadow-[0_0_30px_rgba(56,189,248,0.3)]" />
      )}
      <div
        style={style}
        onMouseDown={onFocus}
        onContextMenu={(e) => e.stopPropagation()}
        className={`flex flex-col bg-[#1e2025] rounded-t-lg rounded-b-sm border shadow-2xl transition-shadow overflow-hidden relative ${
          isActive
            ? 'border-[#383d47] ring-1 ring-black/40'
            : 'border-[#282b33] opacity-95'
        }`}
      >
        {/* Titlebar */}
        <div
          onMouseDown={handleMouseDown}
          onDoubleClick={onMaximize}
          className={`h-9 px-3 flex items-center justify-between select-none cursor-default border-b shrink-0 ${
            isActive
              ? 'bg-[#15171b] border-[#2b2e37] text-zinc-200'
              : 'bg-[#111215] border-[#22242b] text-zinc-400'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-semibold tracking-wide truncate">
              {windowData.title}
            </span>
          </div>

          {/* Window controls */}
          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMinimize()
              }}
              title="Küçült"
              className="w-7 h-6 flex items-center justify-center rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMaximize()
              }}
              title={windowData.isMaximized ? "Geri Yükle" : "Büyüt"}
              className="w-7 h-6 flex items-center justify-center rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              {windowData.isMaximized ? (
                <Copy className="w-3 h-3 rotate-180" />
              ) : (
                <Square className="w-3 h-3" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              title="Kapat"
              className="w-7 h-6 flex items-center justify-center rounded hover:bg-[#e81123] text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Window Body */}
        <div className="relative flex-1 overflow-hidden bg-[#181a1f]">
          {children}
        </div>

        {/* Resize Handle (Bottom-Right Corner) */}
        {!windowData.isMaximized && onUpdateSize && (
          <div
            onMouseDown={handleResizeMouseDown}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50 flex items-end justify-end p-0.5 opacity-40 hover:opacity-100"
            title="Yeniden Boyutlandır"
          >
            <svg className="w-2.5 h-2.5 text-zinc-400 fill-current" viewBox="0 0 6 6">
              <circle cx="5" cy="5" r="1" />
              <circle cx="5" cy="2" r="1" />
              <circle cx="2" cy="5" r="1" />
            </svg>
          </div>
        )}
      </div>
    </>
  )
}
