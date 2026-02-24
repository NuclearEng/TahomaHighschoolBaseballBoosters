import { readWorkbook, getSheetData } from './excel';
import { VolunteerNeed, VolunteerSummary } from '../types/operational';
import { cachedMultiParse } from '../data/cache';
import { getVolunteerFiles } from '../data/file-resolver';
import path from 'path';

// Volunteer files structure (2026 * Team Needs.xlsx):
// Row 0: "VARSITY TEAM NEEDS:" (or JV Blue, JV Gold, C TEAM)
// Row 1: "Throughout Season"
// Rows 3+: Role descriptions with numbered slots (1), 2), etc.)
// Role headers are descriptive text, followed by numbered empty slots for names
// Format: ["Role description", "", ""]
//         ["1)", "", ""]
//         ["2)", "", ""]

type TeamName = VolunteerNeed['team'];

function detectTeam(filePath: string, data: unknown[][]): TeamName {
  const fileName = path.basename(filePath).toLowerCase();
  const firstRow = String(data[0]?.[0] || '').toLowerCase();

  // Check specific teams first (order matters — check specific before generic)
  if (fileName.includes('jv blue') || firstRow.includes('jv blue')) return 'JV Blue';
  if (fileName.includes('jv gold') || firstRow.includes('jv gold')) return 'JV Gold';
  if (fileName.includes('c team') || firstRow.includes('c team')) return 'C Team';
  if (fileName.includes('varsity') || firstRow.includes('varsity')) return 'Varsity Gold';
  // Generic JV → JV Blue as default
  if (fileName.includes('jv') || firstRow.includes('jv')) return 'JV Blue';

  return 'Varsity Gold';
}

function parseVolunteerFile(filePath: string): VolunteerNeed[] {
  const wb = readWorkbook(filePath);
  const data = getSheetData(wb);
  const needs: VolunteerNeed[] = [];

  const team = detectTeam(filePath, data);

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

    // Track which specific teams we've seen to skip generic files
    const teamsFromSpecific = new Set<string>();

    // First pass: parse specific team files (JV Blue, JV Gold, Varsity Gold)
    const specificFiles = fps.filter(fp => {
      const name = path.basename(fp).toLowerCase();
      return name.includes('jv blue') || name.includes('jv gold') || name.includes('varsity gold');
    });
    for (const fp of specificFiles) {
      try {
        const needs = parseVolunteerFile(fp);
        allNeeds.push(...needs);
        if (needs.length > 0) teamsFromSpecific.add(needs[0].team);
      } catch {
        // Skip files that can't be parsed
      }
    }

    // Second pass: parse remaining files, skipping generic versions of teams we already have
    for (const fp of fps) {
      if (specificFiles.includes(fp)) continue;
      try {
        const needs = parseVolunteerFile(fp);
        // Skip if we already have specific data for this team
        if (needs.length > 0 && teamsFromSpecific.has(needs[0].team)) continue;
        allNeeds.push(...needs);
      } catch {
        // Skip files that can't be parsed
      }
    }

    const varsityGold = allNeeds.filter(n => n.team === 'Varsity Gold');
    const jvBlue = allNeeds.filter(n => n.team === 'JV Blue');
    const jvGold = allNeeds.filter(n => n.team === 'JV Gold');
    const cTeam = allNeeds.filter(n => n.team === 'C Team');

    return {
      varsityGold,
      jvBlue,
      jvGold,
      cTeam,
      totalNeeds: allNeeds.length,
      totalFilled: allNeeds.filter(n => n.filled).length,
    };
  }, 'volunteer-summary');
}
