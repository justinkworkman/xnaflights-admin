import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { DealForm } from "./DealForm";
import { useCreateDeal, useUpdateDeal } from "@/hooks/use-deals";
import type { Deal } from "@shared/schema";

interface DealDialogProps {
  mode: "create" | "edit";
  deal?: Deal;
  trigger?: React.ReactNode;
}

export function DealDialog({ mode, deal, trigger }: DealDialogProps) {
  const [open, setOpen] = useState(false);
  const createDeal = useCreateDeal();
  const updateDeal = useUpdateDeal();

  const isCreate = mode === "create";

  const handleSubmit = async (values: any) => {
    try {
      if (isCreate) {
        await createDeal.mutateAsync(values);
      } else if (deal) {
        await updateDeal.mutateAsync({ id: deal.id, ...values });
      }
      setOpen(false);
    } catch (error) {
      console.error(error);
      // Toast is handled in the hook
    }
  };

  const isSubmitting = createDeal.isPending || updateDeal.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : isCreate ? (
          <Button className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
            <Plus className="w-4 h-4 mr-2" />
            New Deal
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
            <Pencil className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isCreate ? "Create New Deal" : `Edit Deal ${deal?.id}`}</DialogTitle>
          <DialogDescription>
            {isCreate
              ? "Add a new flight deal to the system."
              : `Modify details for ${deal?.id}`}
          </DialogDescription>
        </DialogHeader>
        <DealForm
          defaultValues={deal ? {
            destination: deal.destination,
            price: deal.price,
            departureDate: deal.departureDate,
            returnDate: deal.returnDate,
            imageUrl: deal.imageUrl,
            bookingLink: deal.bookingLink,
            ...(deal.originalPrice !== null && { originalPrice: deal.originalPrice }),

            ...(deal.description !== null && { description: deal.description }),
            ...(deal.airline !== null && { airline: deal.airline }),
            ...(deal.airport !== null && { airport: deal.airport }),
            ...(deal.isActive !== null && { isActive: deal.isActive }),
          } : undefined}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
