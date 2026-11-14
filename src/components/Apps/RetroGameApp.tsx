import React, { useState, useEffect, useRef } from 'react'
import { 
  Gamepad2, 
  RotateCcw, 
  Trophy, 
  Sparkles, 
  Play, 
  Bomb,
  Flag,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  CheckCircle2,
  Download
} from 'lucide-react'
import { useGame } from '../../context/GameContext'
import { soundEngine } from '../../utils/soundEngine'

type Point = { x: number; y: number }

export const RetroGameApp: React.FC<{ initialGame?: 'store' | 'snake' | 'minesweeper' }> = ({ initialGame = 'store' }) => {
  const { setSanity, setHype, ownedGames, buyGame, personalCash } = useGame()
  const [activeTab, setActiveTab] = useState<'store' | 'snake' | 'minesweeper'>(initialGame)
  const [storeNotice, setStoreNotice] = useState<string | null>(null)

  // --- SNAKE STATE ---
  const GRID_SIZE = 16
  const [snake, setSnake] = useState<Point[]>([
    { x: 8, y: 8 },
    { x: 7, y: 8 },
    { x: 6, y: 8 }
  ])
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 })
  const [food, setFood] = useState<Point>({ x: 12, y: 8 })
  const [isSnakeRunning, setIsSnakeRunning] = useState(false)
  const [snakeScore, setSnakeScore] = useState(0)
  const [snakeHighScore, setSnakeHighScore] = useState(12)
  const [snakeGameOver, setSnakeGameOver] = useState(false)
  const dirRef = useRef<Point>(direction)
  dirRef.current = direction

  // --- MINESWEEPER STATE ---
  const MINE_ROWS = 8
  const MINE_COLS = 8
  const TOTAL_MINES = 8
  type Cell = { row: number; col: number; isMine: boolean; isRevealed: boolean; isFlagged: boolean; count: number }
  const [mineGrid, setMineGrid] = useState<Cell[][]>([])
  const [mineGameOver, setMineGameOver] = useState(false)
  const [mineGameWon, setMineGameWon] = useState(false)
  const [flagsRemaining, setFlagsRemaining] = useState(TOTAL_MINES)

  // Initialize Minesweeper
  const initMinesweeper = () => {
    let grid: Cell[][] = []
    for (let r = 0; r < MINE_ROWS; r++) {
      grid[r] = []
      for (let c = 0; c < MINE_COLS; c++) {
        grid[r][c] = { row: r, col: c, isMine: false, isRevealed: false, isFlagged: false, count: 0 }
      }
    }

    // Place mines randomly
    let placed = 0
    while (placed < TOTAL_MINES) {
      const r = Math.floor(Math.random() * MINE_ROWS)
      const c = Math.floor(Math.random() * MINE_COLS)
      if (!grid[r][c].isMine) {
        grid[r][c].isMine = true
        placed++
      }
    }

    // Calculate neighboring mine count
    for (let r = 0; r < MINE_ROWS; r++) {
      for (let c = 0; c < MINE_COLS; c++) {
        if (grid[r][c].isMine) continue
        let cnt = 0
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr
            const nc = c + dc
            if (nr >= 0 && nr < MINE_ROWS && nc >= 0 && nc < MINE_COLS && grid[nr][nc].isMine) {
              cnt++
            }
          }
        }
        grid[r][c].count = cnt
      }
    }

    setMineGrid(grid)
    setMineGameOver(false)
    setMineGameWon(false)
    setFlagsRemaining(TOTAL_MINES)
  }

  useEffect(() => {
    initMinesweeper()
  }, [])

  // Reveal Cell in Minesweeper
  const revealCell = (r: number, c: number) => {
    if (mineGameOver || mineGameWon || mineGrid[r][c].isRevealed || mineGrid[r][c].isFlagged) return
    soundEngine.playKeyClick()

    if (mineGrid[r][c].isMine) {
      // Hit mine!
      const newGrid = mineGrid.map((row) =>
        row.map((cell) => (cell.isMine ? { ...cell, isRevealed: true } : cell))
      )
      setMineGrid(newGrid)
      setMineGameOver(true)
      return
    }

    // Flood fill reveal
    const newGrid = mineGrid.map((row) => row.map((cell) => ({ ...cell })))
    const queue: [number, number][] = [[r, c]]
    newGrid[r][c].isRevealed = true

    while (queue.length > 0) {
      const [cr, cc] = queue.shift()!
      if (newGrid[cr][cc].count === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = cr + dr
            const nc = cc + dc
            if (nr >= 0 && nr < MINE_ROWS && nc >= 0 && nc < MINE_COLS) {
              if (!newGrid[nr][nc].isRevealed && !newGrid[nr][nc].isFlagged && !newGrid[nr][nc].isMine) {
                newGrid[nr][nc].isRevealed = true
                if (newGrid[nr][nc].count === 0) queue.push([nr, nc])
              }
            }
          }
        }
      }
    }

    // Check Win
    let unrevealedSafe = 0
    for (let row of newGrid) {
      for (let cell of row) {
        if (!cell.isMine && !cell.isRevealed) unrevealedSafe++
      }
    }

    setMineGrid(newGrid)
    if (unrevealedSafe === 0) {
      setMineGameWon(true)
      soundEngine.playCoinChime()
      setSanity((s) => Math.min(100, s + 20))
    }
  }

  // Toggle Flag in Minesweeper
  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault()
    if (mineGameOver || mineGameWon || mineGrid[r][c].isRevealed) return
    soundEngine.playKeyClick()

    const newGrid = mineGrid.map((row) => row.map((cell) => ({ ...cell })))
    const isNowFlagged = !newGrid[r][c].isFlagged
    newGrid[r][c].isFlagged = isNowFlagged
    setMineGrid(newGrid)
    setFlagsRemaining((prev) => (isNowFlagged ? prev - 1 : prev + 1))
  }

  // --- SNAKE GAME ENGINE ---
  const spawnFood = (currentSnake: Point[]): Point => {
    while (true) {
      const fx = Math.floor(Math.random() * GRID_SIZE)
      const fy = Math.floor(Math.random() * GRID_SIZE)
      if (!currentSnake.some((p) => p.x === fx && p.y === fy)) {
        return { x: fx, y: fy }
      }
    }
  }

  const restartSnake = () => {
    const initSnake = [
      { x: 8, y: 8 },
      { x: 7, y: 8 },
      { x: 6, y: 8 }
    ]
    setSnake(initSnake)
    setDirection({ x: 1, y: 0 })
    dirRef.current = { x: 1, y: 0 }
    setFood(spawnFood(initSnake))
    setSnakeScore(0)
    setSnakeGameOver(false)
    setIsSnakeRunning(true)
  }

  useEffect(() => {
    if (!isSnakeRunning || snakeGameOver) return

    const timer = setInterval(() => {
      setSnake((prevSnake) => {
        const curDir = dirRef.current
        const head = prevSnake[0]
        const newHead: Point = {
          x: head.x + curDir.x,
          y: head.y + curDir.y
        }

        // Wall Collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setSnakeGameOver(true)
          setIsSnakeRunning(false)
          return prevSnake
        }

        // Self Collision
        if (prevSnake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
          setSnakeGameOver(true)
          setIsSnakeRunning(false)
          return prevSnake
        }

        const ateFood = newHead.x === food.x && newHead.y === food.y
        const nextSnake = [newHead, ...prevSnake]

        if (ateFood) {
          soundEngine.playKeyClick()
          setSnakeScore((s) => {
            const next = s + 1
            if (next > snakeHighScore) setSnakeHighScore(next)
            if (next % 3 === 0) {
              setSanity((prev) => Math.min(100, prev + 5))
            }
            return next
          })
          setFood(spawnFood(nextSnake))
        } else {
          nextSnake.pop()
        }

        return nextSnake
      })
    }, 125)

    return () => clearInterval(timer)
  }, [isSnakeRunning, snakeGameOver, food, snakeHighScore, setSanity])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== 'snake') return
      const cur = dirRef.current

      if (e.key === 'ArrowUp' && cur.y === 0) {
        dirRef.current = { x: 0, y: -1 }
        setDirection({ x: 0, y: -1 })
      } else if (e.key === 'ArrowDown' && cur.y === 0) {
        dirRef.current = { x: 0, y: 1 }
        setDirection({ x: 0, y: 1 })
      } else if (e.key === 'ArrowLeft' && cur.x === 0) {
        dirRef.current = { x: -1, y: 0 }
        setDirection({ x: -1, y: 0 })
      } else if (e.key === 'ArrowRight' && cur.x === 0) {
        dirRef.current = { x: 1, y: 0 }
        setDirection({ x: 1, y: 0 })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeTab])

  // Mini distraction penalty timer: if game window is played continuously, slight Hype decay
  useEffect(() => {
    const distractionTimer = setInterval(() => {
      if (activeTab !== 'store' && (isSnakeRunning || (!mineGameOver && !mineGameWon))) {
        setHype((h: number) => Math.max(10, h - 1))
      }
    }, 20000)
    return () => clearInterval(distractionTimer)
  }, [activeTab, isSnakeRunning, mineGameOver, mineGameWon, setHype])

  const handlePurchaseGame = (gameId: 'snake98' | 'minesweeper', cost: number) => {
    const res = buyGame(gameId, cost)
    setStoreNotice(res.message)
    setTimeout(() => setStoreNotice(null), 3500)
  }

  return (
    <div 
      className="flex flex-col h-full w-full bg-[#0c1017] text-zinc-200 font-mono select-none overflow-hidden"
      onContextMenu={(e) => {
        if (activeTab !== 'minesweeper') {
          e.preventDefault()
          e.stopPropagation()
        }
      }}
    >
      {/* Top Header */}
      <div className="h-14 px-5 bg-[#131924] border-b border-[#20293d] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Gamepad2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Stam Client & RetroGames v1.4</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Cüzdan: {personalCash}₺
              </span>
            </div>
            <div className="text-[10px] text-zinc-400">
              Stam Mağazasından oyun satın al, masaüstü kısayolundan başlat!
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#0b0e15] p-1 rounded-lg border border-[#1e2638]">
          <button
            onClick={() => setActiveTab('store')}
            className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'store'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Mağaza & Kütüphane</span>
          </button>
          {ownedGames.includes('snake98') && (
            <button
              onClick={() => setActiveTab('snake')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'snake'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              🐍 Snake 98
            </button>
          )}
          {ownedGames.includes('minesweeper') && (
            <button
              onClick={() => setActiveTab('minesweeper')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'minesweeper'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              💣 Mayın Tarlası
            </button>
          )}
        </div>
      </div>

      {/* Main Game Screen */}
      <div className="flex-1 p-4 flex flex-col items-center justify-center overflow-auto">
        {storeNotice && (
          <div className="mb-4 px-4 py-2 rounded-lg bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-bold shadow-lg">
            {storeNotice}
          </div>
        )}

        {/* --- STAM STORE & LIBRARY TAB --- */}
        {activeTab === 'store' && (
          <div className="w-full max-w-2xl space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#131d2e] to-[#17263c] border border-sky-500/30 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-wide">
                  Stam Dijital Retro Oyun Mağazası
                </h2>
                <p className="text-xs text-zinc-300 mt-1">
                  Satın aldığınız oyunların kısayolları otomatik olarak ModOS masaüstünüze eklenir.
                </p>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-zinc-400 uppercase">Şahsi Bakiye</div>
                <div className="text-base font-black text-emerald-400">{personalCash}₺</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Snake 98 Card */}
              <div className="p-4 rounded-xl bg-[#131824] border border-[#222c42] flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🐍</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                      {ownedGames.includes('snake98') ? 'KÜTÜPHANEDE' : '120₺'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">Retro Snake 98 (Nokia Edition)</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Klasik yılan efsanesi! Elmaları toplayarak rekor kırın. Her 3 elmada bir <span className="text-emerald-400 font-bold">+5 Akıl Sağlığı (Sanity)</span> kazandırır.
                  </p>
                </div>

                {ownedGames.includes('snake98') ? (
                  <div className="space-y-2">
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Masaüstü kısayolu oluşturuldu</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('snake')}
                      className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Hemen Oyna</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handlePurchaseGame('snake98', 120)}
                    className="w-full py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Satın Al & Masaüstüne Kur (120₺)</span>
                  </button>
                )}
              </div>

              {/* Minesweeper Card */}
              <div className="p-4 rounded-xl bg-[#131824] border border-[#222c42] flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">💣</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                      {ownedGames.includes('minesweeper') ? 'KÜTÜPHANEDE' : '95₺'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">Cyber Minesweeper 2000</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    8x8 stratejik mayın tarlası! Tüm güvenli hücreleri temizlediğinizde <span className="text-emerald-400 font-bold">+20 Akıl Sağlığı (Sanity)</span> yeniler.
                  </p>
                </div>

                {ownedGames.includes('minesweeper') ? (
                  <div className="space-y-2">
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Masaüstü kısayolu oluşturuldu</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('minesweeper')}
                      className="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Hemen Oyna</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handlePurchaseGame('minesweeper', 95)}
                    className="w-full py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Satın Al & Masaüstüne Kur (95₺)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- SNAKE TAB --- */}
        {activeTab === 'snake' && (
          <div className="flex flex-col items-center gap-3">
            {/* Score Bar */}
            <div className="w-80 flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#141a27] border border-[#212b3f] text-xs">
              <span className="text-emerald-400 font-bold">Skor: {snakeScore}</span>
              <span className="text-amber-400 flex items-center gap-1 font-bold">
                <Trophy className="w-3.5 h-3.5" /> En Yüksek: {snakeHighScore}
              </span>
            </div>

            {/* Snake Canvas Grid */}
            <div
              className="relative w-80 h-80 bg-[#07090e] border-2 border-[#1f283d] rounded-xl overflow-hidden shadow-2xl p-1 grid gap-[1px]"
              style={{
                gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
              }}
            >
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
                const x = idx % GRID_SIZE
                const y = Math.floor(idx / GRID_SIZE)
                const isHead = snake[0].x === x && snake[0].y === y
                const isBody = snake.slice(1).some((s) => s.x === x && s.y === y)
                const isFood = food.x === x && food.y === y

                return (
                  <div
                    key={idx}
                    className={`w-full h-full rounded-[2px] transition-colors ${
                      isHead
                        ? 'bg-emerald-400 shadow-sm shadow-emerald-400'
                        : isBody
                        ? 'bg-emerald-600'
                        : isFood
                        ? 'bg-rose-500 animate-pulse'
                        : 'bg-[#0e131d]/40'
                    }`}
                  />
                )
              })}

              {/* Game Over / Pause Overlay */}
              {(!isSnakeRunning || snakeGameOver) && (
                <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center gap-3 p-4 text-center">
                  {snakeGameOver ? (
                    <>
                      <div className="text-red-400 font-bold text-base">💥 OYUN BİTTİ!</div>
                      <div className="text-xs text-zinc-300">
                        Toplanan Elma: {snakeScore} • Akıl Sağlığı +{Math.min(20, snakeScore * 2)}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-emerald-400 font-bold text-base">RETRO SNAKE 98</div>
                      <div className="text-xs text-zinc-400">
                        Ok tuşlarıyla yönlendir, elmaları toplayarak kafayı dağıt!
                      </div>
                    </>
                  )}

                  <button
                    onClick={restartSnake}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{snakeGameOver ? 'Yeniden Oyna' : 'Oyunu Başlat'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* D-Pad on-screen buttons for mouse / trackpad play */}
            <div className="flex flex-col items-center gap-1 pt-1">
              <button
                onClick={() => {
                  if (dirRef.current.y === 0) {
                    dirRef.current = { x: 0, y: -1 }
                    setDirection({ x: 0, y: -1 })
                  }
                }}
                className="w-8 h-8 rounded bg-[#182030] hover:bg-emerald-600 text-white flex items-center justify-center font-bold"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (dirRef.current.x === 0) {
                      dirRef.current = { x: -1, y: 0 }
                      setDirection({ x: -1, y: 0 })
                    }
                  }}
                  className="w-8 h-8 rounded bg-[#182030] hover:bg-emerald-600 text-white flex items-center justify-center font-bold"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (dirRef.current.y === 0) {
                      dirRef.current = { x: 0, y: 1 }
                      setDirection({ x: 0, y: 1 })
                    }
                  }}
                  className="w-8 h-8 rounded bg-[#182030] hover:bg-emerald-600 text-white flex items-center justify-center font-bold"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (dirRef.current.x === 0) {
                      dirRef.current = { x: 1, y: 0 }
                      setDirection({ x: 1, y: 0 })
                    }
                  }}
                  className="w-8 h-8 rounded bg-[#182030] hover:bg-emerald-600 text-white flex items-center justify-center font-bold"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- MINESWEEPER TAB --- */}
        {activeTab === 'minesweeper' && (
          <div className="flex flex-col items-center gap-3">
            {/* Top Info Bar */}
            <div className="w-80 flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#141a27] border border-[#212b3f] text-xs">
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Flag className="w-3.5 h-3.5" /> Kalan Bayrak: {flagsRemaining}
              </span>
              <button
                onClick={initMinesweeper}
                className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Yeniden</span>
              </button>
            </div>

            {/* Minesweeper Grid */}
            <div className="p-2 bg-[#080b11] border-2 border-[#1f283d] rounded-xl shadow-2xl relative">
              <div className="grid grid-cols-8 gap-1 w-72 h-72">
                {mineGrid.map((row, r) =>
                  row.map((cell, c) => (
                    <button
                      key={`${r}-${c}`}
                      onClick={() => revealCell(r, c)}
                      onContextMenu={(e) => toggleFlag(e, r, c)}
                      className={`w-full h-full rounded text-xs font-black flex items-center justify-center transition-colors cursor-pointer ${
                        cell.isRevealed
                          ? cell.isMine
                            ? 'bg-red-700 text-white animate-bounce'
                            : 'bg-[#151c2a] text-zinc-300'
                          : 'bg-[#222b3e] hover:bg-[#2c374e] border-t border-l border-white/10 text-white'
                      }`}
                    >
                      {cell.isRevealed ? (
                        cell.isMine ? (
                          <Bomb className="w-4 h-4 text-white" />
                        ) : cell.count > 0 ? (
                          <span
                            style={{
                              color:
                                cell.count === 1
                                  ? '#3498db'
                                  : cell.count === 2
                                  ? '#2ecc71'
                                  : cell.count === 3
                                  ? '#e74c3c'
                                  : '#9b59b6'
                            }}
                          >
                            {cell.count}
                          </span>
                        ) : null
                      ) : cell.isFlagged ? (
                        <Flag className="w-3.5 h-3.5 text-amber-400" />
                      ) : null}
                    </button>
                  ))
                )}
              </div>

              {/* Game Over / Won Overlay */}
              {(mineGameOver || mineGameWon) && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center gap-3 p-4 rounded-xl text-center">
                  {mineGameWon ? (
                    <>
                      <div className="text-emerald-400 font-bold text-base flex items-center gap-1.5">
                        <Sparkles className="w-5 h-5 text-emerald-400" />
                        <span>TEBRİKLER! MAYINLAR TEMİZLENDİ</span>
                      </div>
                      <div className="text-xs text-zinc-300">
                        Zihnin rahatladı! Akıl Sağlığı +20 yenilendi.
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-rose-500 font-bold text-base">💥 MAYINA BASTIN!</div>
                      <div className="text-xs text-zinc-400">
                        Tüm mayınlar patladı. Tekrar deneyin.
                      </div>
                    </>
                  )}

                  <button
                    onClick={initMinesweeper}
                    className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase shadow transition-transform active:scale-95 cursor-pointer"
                  >
                    Tekrar Oyna
                  </button>
                </div>
              )}
            </div>
            <div className="text-[10px] text-zinc-500 text-center">
              Sol Tık: Aç • Sağ Tık: Bayrak Koy
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
