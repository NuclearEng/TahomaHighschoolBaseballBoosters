import { getUniformInventory } from "@/lib/parsers/uniforms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shirt,
  Package,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";
import { InventoryTable } from "./inventory-table";

export default async function UniformsPage() {
  const inventory = await getUniformInventory();

  // Filter to show only items with a player or notable status (not "available" without assignment)
  const displayItems = inventory.items.filter(
    (item) => item.status !== "available"
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#00357b]">
          Uniform Inventory
        </h1>
        <p className="text-sm text-muted-foreground">
          Track uniform items, checkouts, returns, and missing gear
        </p>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-[#00357b]">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Items
                </p>
                <p className="text-2xl font-bold tabular-nums tracking-tight">
                  {inventory.totalItems}
                </p>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <Shirt className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Checked Out
                </p>
                <p className="text-2xl font-bold tabular-nums tracking-tight text-amber-600">
                  {inventory.checkedOut}
                </p>
              </div>
              <div className="rounded-lg bg-amber-50 p-2">
                <Package className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Returned
                </p>
                <p className="text-2xl font-bold tabular-nums tracking-tight text-emerald-600">
                  {inventory.returned}
                </p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Missing
                </p>
                <p className="text-2xl font-bold tabular-nums tracking-tight text-rose-600">
                  {inventory.missing}
                </p>
              </div>
              <div className="rounded-lg bg-rose-50 p-2">
                <AlertTriangle className="h-5 w-5 text-rose-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Source Info */}
      <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-200">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Uniform data is synced from Google Drive.{" "}
          To update inventory, edit the spreadsheet in the{" "}
          <span className="font-medium">Uniforms</span> folder.
        </p>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base text-[#00357b]">
            <Shirt className="h-4 w-4" />
            Inventory Detail
            <span className="text-sm font-normal text-muted-foreground">
              ({displayItems.length} tracked items)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {displayItems.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No uniform items tracked yet.
            </div>
          ) : (
            <InventoryTable data={displayItems} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
