export interface Coord {
  x: number;
  y: number;
}

export interface PieceDef {
  id: number;
  cells: Coord[];
  minX: number;
  minY: number;
  width: number;
  height: number;
  localCells: Coord[];
  name?: string;
  anatomy?: string;
}

export interface PuzzleResult {
  gridSize: number;
  shapeMap: number[][]; // [y][x] -> pieceId
  pieces: PieceDef[];
}

export type PuzzleDifficulty = "Mudah" | "Menengah" | "Sulit";

const DIFFICULTY_PIECE_COUNT: Record<PuzzleDifficulty, { min: number; max: number }> = {
  Mudah: { min: 3, max: 4 },
  Menengah: { min: 5, max: 6 },
  Sulit: { min: 7, max: 8 },
};

function getNeighbors(x: number, y: number, gridSize: number): Coord[] {
  const neighbors: Coord[] = [];
  if (x > 0) neighbors.push({ x: x - 1, y });
  if (x < gridSize - 1) neighbors.push({ x: x + 1, y });
  if (y > 0) neighbors.push({ x, y: y - 1 });
  if (y < gridSize - 1) neighbors.push({ x, y: y + 1 });
  return neighbors;
}

export function generateDynamicPuzzle(
  gridSize: number = 6,
  difficulty: PuzzleDifficulty = "Mudah"
): PuzzleResult {
  const totalCells = gridSize * gridSize;
  const { min, max } = DIFFICULTY_PIECE_COUNT[difficulty];
  const numPieces = Math.floor(Math.random() * (max - min + 1)) + min;

  // 1. Initialize grid with 0
  const grid: number[][] = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill(0)
  );

  // 2. Select K seed locations spread across the grid
  const pieceSizes: Record<number, number> = {};
  const seeds: Coord[] = [];
  const candidateCells: Coord[] = [];

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      candidateCells.push({ x, y });
    }
  }
  // Shuffle candidate cells
  candidateCells.sort(() => Math.random() - 0.5);

  let pieceId = 1;
  for (const cell of candidateCells) {
    // Try to ensure seeds are somewhat spaced out
    const isClose = seeds.some(
      (s) => Math.abs(s.x - cell.x) + Math.abs(s.y - cell.y) <= 1
    );
    if (!isClose || seeds.length + candidateCells.length - seeds.length <= numPieces) {
      grid[cell.y][cell.x] = pieceId;
      pieceSizes[pieceId] = 1;
      seeds.push(cell);
      pieceId++;
      if (seeds.length >= numPieces) break;
    }
  }

  // If we couldn't place enough separated seeds, just place anywhere
  while (seeds.length < numPieces) {
    const unassigned = candidateCells.find((c) => grid[c.y][c.x] === 0);
    if (!unassigned) break;
    grid[unassigned.y][unassigned.x] = pieceId;
    pieceSizes[pieceId] = 1;
    seeds.push(unassigned);
    pieceId++;
  }

  // 3. Iterative growth using randomized breadth-first expansion
  let assignedCount = seeds.length;

  while (assignedCount < totalCells) {
    // Find pieces with lowest sizes to grow evenly
    const sortedPieceIds = Object.keys(pieceSizes)
      .map(Number)
      .sort((a, b) => pieceSizes[a] - pieceSizes[b]);

    let expanded = false;

    for (const pid of sortedPieceIds) {
      // Find all empty neighbors adjacent to this piece
      const adjacentEmpty: Coord[] = [];

      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          if (grid[y][x] === pid) {
            const neighbors = getNeighbors(x, y, gridSize);
            for (const n of neighbors) {
              if (grid[n.y][n.x] === 0 && !adjacentEmpty.some((c) => c.x === n.x && c.y === n.y)) {
                adjacentEmpty.push(n);
              }
            }
          }
        }
      }

      if (adjacentEmpty.length > 0) {
        // Pick one neighbor at random
        const chosen = adjacentEmpty[Math.floor(Math.random() * adjacentEmpty.length)];
        grid[chosen.y][chosen.x] = pid;
        pieceSizes[pid]++;
        assignedCount++;
        expanded = true;
        break;
      }
    }

    // Safety fallback in case of isolated gaps
    if (!expanded) {
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          if (grid[y][x] === 0) {
            const neighbors = getNeighbors(x, y, gridSize);
            const assignedNeighbor = neighbors.find((n) => grid[n.y][n.x] > 0);
            if (assignedNeighbor) {
              const pid = grid[assignedNeighbor.y][assignedNeighbor.x];
              grid[y][x] = pid;
              pieceSizes[pid]++;
              assignedCount++;
              expanded = true;
              break;
            }
          }
        }
        if (expanded) break;
      }
    }
  }

  // 4. Extract PieceDef structures
  const piecesMap = new Map<number, Coord[]>();
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const pid = grid[y][x];
      if (!piecesMap.has(pid)) piecesMap.set(pid, []);
      piecesMap.get(pid)!.push({ x, y });
    }
  }

  const pieces: PieceDef[] = [];
  piecesMap.forEach((cells, id) => {
    const minX = Math.min(...cells.map((c) => c.x));
    const maxX = Math.max(...cells.map((c) => c.x));
    const minY = Math.min(...cells.map((c) => c.y));
    const maxY = Math.max(...cells.map((c) => c.y));
    const width = maxX - minX + 1;
    const height = maxY - minY + 1;

    const localCells = cells.map((c) => ({ x: c.x - minX, y: c.y - minY }));

    // Generate descriptive anatomy label
    const centerX = minX + width / 2;
    const centerY = minY + height / 2;
    const horizontalLoc = centerX < gridSize / 3 ? "Kiri" : centerX > (gridSize * 2) / 3 ? "Kanan" : "Tengah";
    const verticalLoc = centerY < gridSize / 3 ? "Atas" : centerY > (gridSize * 2) / 3 ? "Bawah" : "Tengah";

    const name = `Cap Balok #${id} (${horizontalLoc}-${verticalLoc})`;
    const anatomy = `area ${horizontalLoc.toLowerCase()} ${verticalLoc.toLowerCase()} kanvas mori`;

    pieces.push({
      id,
      cells,
      minX,
      minY,
      width,
      height,
      localCells,
      name,
      anatomy,
    });
  });

  return {
    gridSize,
    shapeMap: grid,
    pieces: pieces.sort((a, b) => a.id - b.id),
  };
}
