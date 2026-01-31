import { useState } from "react";
import { useDeals, useDeleteDeal } from "@/hooks/use-deals";
import { Sidebar } from "@/components/layout/Sidebar";
import { DealDialog } from "@/components/deals/DealDialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  RotateCw,
  FileBarChart,
  Trash2,
  MoreVertical,
  Pencil,
  ChevronUp,
  ChevronDown,
  Copy
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: deals, isLoading, error } = useDeals();
  const deleteDeal = useDeleteDeal();
  const [search, setSearch] = useState("");
  const [selectedDealIds, setSelectedDealIds] = useState<number[]>([]);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | "none">("none");

  const toggleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
      return;
    }
    if (sortDir === "asc") {
      setSortDir("desc");
      return;
    }
    // cycle to none
    setSortKey(null);
    setSortDir("none");
  };

  const filteredDeals = deals?.filter(
    (deal) =>
      deal.destination.toLowerCase().includes(search.toLowerCase()) ||
      deal.description?.toLowerCase().includes(search.toLowerCase()) ||
      deal.airline?.toLowerCase().includes(search.toLowerCase()) ||
      deal.id?.toString().includes(search.toLowerCase()) ||
      deal.departureDate.toLowerCase().includes(search.toLowerCase())
  );

  const sortedDeals = (() => {
    if (!filteredDeals) return [];
    if (!sortKey || sortDir === "none") return filteredDeals;
    const copy = [...filteredDeals];
    const getDiscount = (d: any) =>
      d.originalPrice ? 1 - d.price / d.originalPrice : 0;
    copy.sort((a: any, b: any) => {
      let cmp = 0;
      if (sortKey === "destination" || sortKey === "dealInfo") {
        cmp = a.destination.localeCompare(b.destination);
      } else if (sortKey === "price") {
        cmp = (a.price || 0) - (b.price || 0);
      } else if (sortKey === "discount") {
        cmp = getDiscount(a) - getDiscount(b);
      } else if (sortKey === "status") {
        cmp = (a.isActive ? 1 : 0) - (b.isActive ? 1 : 0);
      } else if (sortKey === "departureDate") {
        cmp =
          new Date(a.departureDate).getTime() -
          new Date(b.departureDate).getTime();
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  })();

  const handleSync = () => {
    console.log("Syncing flights...");
    // refresh deal data
    window.location.reload();
  };

  const handleReport = () => {
    //export to json
    const selectedDeals = deals
      ?.filter((deal) => selectedDealIds.includes(deal.id))
      .map((d) => ({
        ...d,
        percentage: d.originalPrice
          ? Math.round((1 - d.price / d.originalPrice) * 100)
          : 0
      }));
    console.log(selectedDeals);
    const json = JSON.stringify(
      selectedDeals,
      [
        "destination",
        "price",
        "airline",
        "originalPrice",
        "departureDate",
        "imageUrl",
        "returnDate",
        "percentage"
      ],
      2
    );
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "selected-deals.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold">Flight Deals</h1>
            <p className="text-muted-foreground mt-1">
              Manage current offers and promotions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleSync}
              className="hidden sm:flex items-center gap-2"
            >
              <RotateCw className="w-4 h-4" /> Sync
            </Button>
            <Button
              variant="outline"
              onClick={handleReport}
              className="hidden sm:flex items-center gap-2"
            >
              <FileBarChart className="w-4 h-4" /> Reports
            </Button>
            <DealDialog mode="create" />
          </div>
        </header>

        {/* Filters */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search deals..."
              className="pl-10 bg-card border-border focus:ring-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden animate-enter">
          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground">
              <RotateCw className="w-8 h-8 animate-spin mx-auto mb-4 opacity-50" />
              Loading deals...
            </div>
          ) : error ? (
            <div className="p-12 text-center text-destructive">
              Error loading deals. Please try again.
            </div>
          ) : filteredDeals?.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground flex flex-col items-center">
              <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 opacity-50" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                No deals found
              </h3>
              <p className="max-w-xs mx-auto mt-2">
                Try adjusting your search or create a new deal to get started.
              </p>
              <div className="mt-6">
                <DealDialog mode="create" />
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-border bg-background focus-ring-primary/20"
                      checked={selectedDealIds.length === (deals?.length || 0)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDealIds(
                            deals ? deals.map((deal) => deal.id) : []
                          );
                        } else {
                          setSelectedDealIds([]);
                        }
                      }}
                    />

                    <button
                      onClick={() => toggleSort("dealInfo")}
                      className="flex items-center gap-2"
                    >
                      Deal Info
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      {sortKey === "dealInfo" &&
                        (sortDir === "asc" ? <span>▲</span> : <span>▼</span>)}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => toggleSort("destination")}
                      className="flex items-center gap-2"
                    >
                      Destination
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      {sortKey === "destination" &&
                        (sortDir === "asc" ? <span>▲</span> : <span>▼</span>)}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => toggleSort("price")}
                      className="flex items-center gap-2"
                    >
                      Price
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      {sortKey === "price" &&
                        (sortDir === "asc" ? <span>▲</span> : <span>▼</span>)}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => toggleSort("discount")}
                      className="flex items-center gap-2"
                    >
                      Discount
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      {sortKey === "discount" &&
                        (sortDir === "asc" ? <span>▲</span> : <span>▼</span>)}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => toggleSort("departureDate")}
                      className="flex items-center gap-2"
                    >
                      Departure Date
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      {sortKey === "departureDate" &&
                        (sortDir === "asc" ? <span>▲</span> : <span>▼</span>)}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => toggleSort("status")}
                      className="flex items-center gap-2"
                    >
                      Status
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      {sortKey === "status" &&
                        (sortDir === "asc" ? <span>▲</span> : <span>▼</span>)}
                    </button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedDeals?.map((deal) => (
                  <TableRow
                    key={deal.id}
                    className="border-border hover:bg-muted/10 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-border bg-background focus-ring-primary/20"
                          checked={selectedDealIds.includes(deal.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDealIds([...selectedDealIds, deal.id]);
                            } else {
                              setSelectedDealIds(
                                selectedDealIds.filter((id) => id !== deal.id)
                              );
                            }
                          }}
                        />
                        <div className="w-10 h-10 rounded-lg bg-muted/50 overflow-hidden shrink-0">
                          {/* Using Unsplash for fallback logic if needed, but mainly relying on input */}
                          <img
                            src={
                              deal.imageUrl ||
                              "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&h=100&fit=crop"
                            }
                            alt={deal.destination}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {deal.destination}
                          </div>
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {deal.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{deal.destination}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-primary">
                          {deal.price}
                        </span>
                        <span className="text-xs text-muted-foreground line-through">
                          {deal.originalPrice}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-primary">
                          {deal.price / deal.originalPrice
                            ? Math.round(
                                (1 - deal.price / deal.originalPrice) * 100
                              )
                            : 0}
                          % Off
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-primary">
                          {deal.departureDate}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={deal.isActive ? "default" : "secondary"}
                        className={
                          deal.isActive
                            ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
                            : ""
                        }
                      >
                        {deal.isActive ? "Active" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <DealDialog
                          mode="create"
                          deal={{ ...deal, id: undefined, isActive: false }}
                          trigger={
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                            >
                              <span className="sr-only">Copy</span>
                              <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                            </Button>
                          }
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() =>
                            window.open(
                              deal.bookingLink.replace("marker=696525", "")
                            )
                          }
                        >
                          <span className="sr-only">Validate</span>
                          <MoreVertical className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </Button>
                        <DealDialog
                          mode="edit"
                          deal={deal}
                          trigger={
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                            >
                              <span className="sr-only">Edit</span>
                              <Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                            </Button>
                          }
                        />

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                            >
                              <span className="sr-only">Delete</span>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-card border-border">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the deal for{" "}
                                <span className="font-semibold text-foreground">
                                  {deal.destination}
                                </span>
                                .
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-border hover:bg-muted">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteDeal.mutate(deal.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {deleteDeal.isPending
                                  ? "Deleting..."
                                  : "Delete Deal"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
    </div>
  );
}
