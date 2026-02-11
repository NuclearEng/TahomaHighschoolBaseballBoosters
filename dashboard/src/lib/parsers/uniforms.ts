import { readWorkbook, getSheetData } from './excel';
import { UniformItem, UniformInventory } from '../types/operational';
import { cachedParse } from '../data/cache';
import { resolveLogical } from '../data/file-resolver';

// Uniform inventory structure (EDITING 2026 Uniform Return & Inventory List.xlsx):
// Sheet "2026 Inventory": Row 1 headers, Row 2+ data
// Headers: Jersey #, Player Name, Royal Jersey, [returned], White Jersey, [returned], Black Jersey, [returned],
//          Grey Jersey, [returned], BP Jacket, [returned], Backpack, Duffel, Coat, Helmet, Belt, Hat, Wristband, J-Bands, Optional Pants
// Alternating columns after jersey types are "returned" indicators (contain "X" or blank)
//
// Sheet "Sheet4": Fines sheet - players with unreturned items and fine amounts

const ITEM_COLUMNS = [
  { name: 'Royal Jersey', sizeCol: 2, returnedCol: 3 },
  { name: 'White Jersey', sizeCol: 4, returnedCol: 5 },
  { name: 'Black Jersey', sizeCol: 6, returnedCol: 7 },
  { name: 'Grey Jersey', sizeCol: 8, returnedCol: 9 },
  { name: 'BP Jacket', sizeCol: 10, returnedCol: 11 },
];

function parseUniformFile(filePath: string): UniformInventory {
  const wb = readWorkbook(filePath);
  const items: UniformItem[] = [];

  // Parse 2026 Inventory sheet (current inventory by number)
  const invSheet = wb.SheetNames.find(n => n.includes('2026')) || wb.SheetNames[0];
  const invData = getSheetData(wb, invSheet);

  for (let i = 2; i < invData.length; i++) {
    const row = invData[i];
    if (!row) continue;

    const jerseyNum = String(row[0] || '').trim();
    if (!jerseyNum || isNaN(Number(jerseyNum))) continue;

    const playerName = String(row[1] || '').trim();

    for (const item of ITEM_COLUMNS) {
      const size = String(row[item.sizeCol] || '').trim();
      if (!size) continue;

      const returnedIndicator = String(row[item.returnedCol] || '').trim().toUpperCase();
      const isMissing = size.toLowerCase().includes('missing');
      const isNoItem = size.toLowerCase().startsWith('no ');

      let status: UniformItem['status'];
      if (isNoItem) {
        status = 'available'; // Item doesn't exist for this number
        continue; // Skip non-existent items
      } else if (isMissing) {
        status = 'missing';
      } else if (returnedIndicator === 'X') {
        status = 'returned';
      } else if (playerName) {
        status = 'checked-out';
      } else {
        status = 'available';
      }

      items.push({
        jerseyNumber: jerseyNum,
        playerName: playerName || undefined,
        item: item.name,
        size: size.replace(/\s*-\s*missing/i, '').trim(),
        status,
        notes: isMissing ? 'Reported missing' : undefined,
      });
    }
  }

  // Parse fines sheet (Sheet4) if it exists
  const finesSheet = wb.SheetNames.find(n => n === 'Sheet4');
  if (finesSheet) {
    const finesData = getSheetData(wb, finesSheet);
    for (let i = 1; i < finesData.length; i++) {
      const row = finesData[i];
      if (!row) continue;

      const jerseyNum = String(row[0] || '').trim();
      const playerName = String(row[1] || '').trim();
      if (!playerName) continue;

      // Check each item column for unreturned items
      const finesCols = [
        { name: 'Royal Jersey', sizeCol: 2, returnedCol: 3 },
        { name: 'White Jersey', sizeCol: 4, returnedCol: 5 },
        { name: 'Black Jersey', sizeCol: 6, returnedCol: 7 },
        { name: 'BP Jacket', sizeCol: 8, returnedCol: 9 },
        { name: 'Bag', sizeCol: 10, returnedCol: 11 },
        { name: 'Coat', sizeCol: 12, returnedCol: 13 },
        { name: 'Helmet', sizeCol: 14, returnedCol: 15 },
        { name: 'Belt', sizeCol: 16, returnedCol: 17 },
      ];

      for (const col of finesCols) {
        const size = String(row[col.sizeCol] || '').trim();
        const returned = String(row[col.returnedCol] || '').trim().toUpperCase();

        if (size && returned !== 'X' && !size.toLowerCase().startsWith('no ')) {
          // Find existing item and update, or it's already tracked
          const existing = items.find(
            it => it.jerseyNumber === jerseyNum && it.item === col.name
          );
          if (existing) {
            existing.status = 'checked-out';
            existing.playerName = playerName;
          }
        }
      }
    }
  }

  const checkedOut = items.filter(i => i.status === 'checked-out').length;
  const returned = items.filter(i => i.status === 'returned').length;
  const missing = items.filter(i => i.status === 'missing').length;
  const available = items.filter(i => i.status === 'available').length;

  return {
    items,
    totalItems: items.length,
    checkedOut,
    returned,
    missing,
    available,
  };
}

export async function getUniformInventory(): Promise<UniformInventory> {
  const filePath = resolveLogical('uniformInventory');
  return cachedParse(filePath, async (fp) => parseUniformFile(fp));
}
