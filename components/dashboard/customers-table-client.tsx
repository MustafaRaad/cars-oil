"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Filter } from "lucide-react";

import { useOilData } from "@/lib/use-oil-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type SearchMode = "all" | "name" | "phone" | "carType";

export function CustomersTableClient() {
  const { customers } = useOilData();
  const [searchMode, setSearchMode] = useState<SearchMode>("all");
  const [searchText, setSearchText] = useState("");
  const [carFilter, setCarFilter] = useState("");

  const filteredCustomers = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();
    const normalizedCar = carFilter.trim().toLowerCase();

    return customers.filter((customer) => {
      const name = customer.name.toLowerCase();
      const phone = customer.phone.toLowerCase();
      const carType = customer.carType.toLowerCase();
      const matchesCar = !normalizedCar || carType.includes(normalizedCar);

      if (!normalizedSearch) return matchesCar;

      const matchesSearch =
        searchMode === "all"
          ? name.includes(normalizedSearch) || phone.includes(normalizedSearch) || carType.includes(normalizedSearch)
          : searchMode === "name"
            ? name.includes(normalizedSearch)
            : searchMode === "phone"
              ? phone.includes(normalizedSearch)
              : carType.includes(normalizedSearch);

      return matchesSearch && matchesCar;
    });
  }, [carFilter, customers, searchMode, searchText]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 p-4 md:p-6">
      <header className="rounded-xl border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">All Customers</h1>
            <p className="text-sm text-muted-foreground">Search and manage workshop customers quickly</p>
          </div>
          <Button asChild size="lg">
            <Link href="/dashboard/create">Add Customer</Link>
          </Button>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Customer Directory</CardTitle>
          <CardDescription>Multiple search options by name, phone, and car type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-[180px_1fr_1fr_auto]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <Filter className="size-4" />
                    Search: {searchMode}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSearchMode("all")}>All fields</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchMode("name")}>Name only</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchMode("phone")}>Phone only</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchMode("carType")}>Car type only</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search..."
            />
            <Input
              value={carFilter}
              onChange={(event) => setCarFilter(event.target.value)}
              placeholder="Extra car type filter..."
            />
            <Badge variant="secondary" className="h-11 rounded-lg px-3 text-sm">
              {filteredCustomers.length} results
            </Badge>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Car Type</TableHead>
                <TableHead>Total Services</TableHead>
                <TableHead>Last Service Date</TableHead>
                <TableHead>Last Mileage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => {
                  const lastService = customer.history[0];
                  return (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{customer.carType}</TableCell>
                      <TableCell>{customer.history.length}</TableCell>
                      <TableCell>
                        {lastService ? new Date(lastService.date).toLocaleDateString() : "No history"}
                      </TableCell>
                      <TableCell>
                        {lastService ? `${lastService.mileage.toLocaleString()} km` : "-"}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
