import { getRosters } from "@/lib/parsers/roster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Users } from "lucide-react";
import type { Player } from "@/lib/types/operational";

function PlayerTable({ players }: { players: Player[] }) {
  if (players.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No players found for this team.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-[#00357b]/5">
          <TableHead className="font-semibold text-[#00357b]">Name</TableHead>
          <TableHead className="font-semibold text-[#00357b]">
            Number
          </TableHead>
          <TableHead className="font-semibold text-[#00357b]">Grade</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player, idx) => (
          <TableRow key={`${player.name}-${idx}`}>
            <TableCell className="font-medium">{player.name}</TableCell>
            <TableCell>
              {player.number ? (
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#00357b] text-xs font-bold text-white">
                  {player.number}
                </span>
              ) : (
                <span className="text-muted-foreground">--</span>
              )}
            </TableCell>
            <TableCell>
              {player.grade ? (
                <Badge variant="outline" className="text-xs">
                  {player.grade}
                </Badge>
              ) : (
                <span className="text-muted-foreground">--</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function RosterTabs({
  varsity,
  jvBlue,
  jvGold,
}: {
  varsity: Player[];
  jvBlue: Player[];
  jvGold: Player[];
}) {
  return (
    <Tabs defaultValue="varsity">
      <TabsList>
        <TabsTrigger value="varsity" className="gap-1.5">
          Varsity
          <Badge
            variant="secondary"
            className="ml-1 h-5 min-w-5 bg-[#00357b] text-white text-[11px]"
          >
            {varsity.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="jv-blue" className="gap-1.5">
          JV Blue
          <Badge
            variant="secondary"
            className="ml-1 h-5 min-w-5 bg-[#00357b] text-white text-[11px]"
          >
            {jvBlue.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="jv-gold" className="gap-1.5">
          JV Gold
          <Badge
            variant="secondary"
            className="ml-1 h-5 min-w-5 bg-[#FFCB1E] text-white text-[11px]"
          >
            {jvGold.length}
          </Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="varsity">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-[#00357b]">
              <Users className="h-4 w-4" />
              Varsity Roster
              <span className="text-sm font-normal text-muted-foreground">
                ({varsity.length} players)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PlayerTable players={varsity} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="jv-blue">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-[#00357b]">
              <Users className="h-4 w-4" />
              JV Blue Roster
              <span className="text-sm font-normal text-muted-foreground">
                ({jvBlue.length} players)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PlayerTable players={jvBlue} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="jv-gold">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-[#FFCB1E]">
              <Users className="h-4 w-4" />
              JV Gold Roster
              <span className="text-sm font-normal text-muted-foreground">
                ({jvGold.length} players)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PlayerTable players={jvGold} />
          </CardContent>
        </Card>
      </TabsContent>

    </Tabs>
  );
}

export default async function RostersPage() {
  const rosters = await getRosters();
  const totalPlayers =
    rosters.varsity.length + rosters.jvBlue.length + rosters.jvGold.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#00357b]">Rosters</h1>
          <p className="text-sm text-muted-foreground">
            {totalPlayers} total players across 3 teams
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-[#00357b] text-white">
            V: {rosters.varsity.length}
          </Badge>
          <Badge className="bg-[#00357b] text-white">
            JV Blue: {rosters.jvBlue.length}
          </Badge>
          <Badge className="bg-[#FFCB1E] text-white">
            JV Gold: {rosters.jvGold.length}
          </Badge>
        </div>
      </div>

      <RosterTabs
        varsity={rosters.varsity}
        jvBlue={rosters.jvBlue}
        jvGold={rosters.jvGold}
      />
    </div>
  );
}
