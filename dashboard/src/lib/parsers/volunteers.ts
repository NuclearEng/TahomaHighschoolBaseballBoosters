import { readWorkbook, getSheetData } from './excel';
import { VolunteerNeed, VolunteerSummary } from '../types/operational';
import { cachedMultiParse } from '../data/cache';
import { getVolunteerFiles } from '../data/file-resolver';
import path from 'path';

// Volunteer files structure (2026 * Team Needs.xlsx):
// Row 0: "VARSITY TEAM NEEDS:" (or JV, C TEAM)
// Row 1: "Throughout Season"
// Rows 3+: Role descriptions with numbered slots (1), 2), etc.)
// Role headers are descriptive text, followed by numbered empty slots for names
// Format: ["Role description", "", ""]
//         ["1)", "", ""]
//         ["2)", "", ""]

function parseVolunteerFile(filePath: string): VolunteerNeed[] {
  const wb = readWorkbook(filePath);
  const data = getSheetData(wb);
  const needs: VolunteerNeed[] = [];

  // Determine team from filename or first row
  const fileName = path.basename(filePath).toLowerCase();
  let team: 'Varsity' | 'JV' | 'C Team' = 'Varsity';
  if (fileName.includes('jv')) team = 'JV';
  else if (fileName.includes('c team')) team = 'C Team';
  else {
    const firstRow = String(data[0]?.[0] || '').toLowerCase();
    if (firstRow.includes('jv')) team = 'JV';
    else if (firstRow.includes('c team')) team = 'C Team';
  }

  let currentRole = '';

  for (let i = 2; i < data.length; i++) {
    const row = data[i];
    if (!row) continue;

    const cell0 = String(row[0] || '').trim();
    if (!cell0) continue;

    // Check if this is a role description (longer text, not a number slot)
    const isSlot = /^\d+\)/.test(cell0);

    if (!isSlot && cell0.length > 5) {
      // This is a role description
      // Extract the role name (before the colon or parenthetical)
      currentRole = cell0.split(':')[0].split('(')[0].trim();
    } else if (isSlot && currentRole) {
      // This is a volunteer slot
      const name = String(row[1] || '').trim() || String(row[0] || '').replace(/^\d+\)\s*/, '').trim();
      const hasName = name.length > 2 && !/^\d+\)/.test(name);

      needs.push({
        role: currentRole,
        description: currentRole,
        team,
        filled: hasName,
        volunteerName: hasName ? name : undefined,
      });
    }
  }

  return needs;
}

export async function getVolunteerSummary(): Promise<VolunteerSummary> {
  const files = await getVolunteerFiles();

  return cachedMultiParse(files, async (fps) => {
    const allNeeds: VolunteerNeed[] = [];

    for (const fp of fps) {
      try {
        const needs = parseVolunteerFile(fp);
        allNeeds.push(...needs);
      } catch {
        // Skip files that can't be parsed
      }
    }

    const varsity = allNeeds.filter(n => n.team === 'Varsity');
    const jv = allNeeds.filter(n => n.team === 'JV');
    const cTeam = allNeeds.filter(n => n.team === 'C Team');

    return {
      varsity,
      jv,
      cTeam,
      totalNeeds: allNeeds.length,
      totalFilled: allNeeds.filter(n => n.filled).length,
    };
  }, 'volunteer-summary');
}
