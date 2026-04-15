"use client";

import type { ServiceResult } from "@/components/dashboard/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

type PrintViewProps = {
  latestService?: ServiceResult;
};

export function PrintView({ latestService }: PrintViewProps) {
  const handlePrint = () => window.print();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="lg" disabled={!latestService}>
          Print Receipt
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Receipt Preview (90 x 90 mm)</DialogTitle>
          <DialogDescription>Use this preview for sticker/receipt printing</DialogDescription>
        </DialogHeader>

        {!latestService ? (
          <p className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
            Save a service first to enable printing.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="secondary">Al-Asad for Oil & Filters Trading</Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Print Options</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handlePrint}>Print 90 x 90</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div id="print-receipt" className="print-ticket rounded-lg border p-4">
              <h3 className="mb-3 text-center text-base font-semibold">Service Receipt</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Customer:</strong> {latestService.customer.name}
                </p>
                <p>
                  <strong>Oil Type:</strong> {latestService.service.oilType}
                </p>
                <p>
                  <strong>Mileage:</strong> {latestService.service.mileage.toLocaleString()} km
                </p>
                <p>
                  <strong>Date:</strong> {new Date(latestService.service.date).toLocaleString()}
                </p>
                <p>
                  <strong>Technician:</strong> {latestService.service.technician || "-"}
                </p>
              </div>
            </div>

            <Button onClick={handlePrint} className="w-full">
              Print Now
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
