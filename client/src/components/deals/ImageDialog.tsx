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
import { ImageForm } from "./ImageForm";

interface ImageDialogProps {
  mode: "create" | "edit";
  deal?: Deal;
  trigger?: React.ReactNode;
}

export function ImageDialog({ mode, deal, trigger }: ImageDialogProps) {
  const [open, setOpen] = useState(false);
  const createDeal = useCreateDeal();
  const updateDeal = useUpdateDeal();

  const isCreate = mode === "create";

  const handleSubmit = async (values: any) => {
    try {
      if (deal) {
        console.log(deal)
        //post to image creation api
        const postBody = {
            title: deal.destination,
            eyebrow: deal.destination,
            background: deal.imageUrl,
            airport: deal.airport,
            price: deal.price,
            dates: `${new Date(deal.departureDate).toLocaleDateString('en-US', {month: 'short', day:'numeric'})} - ${new Date(deal.returnDate).toLocaleDateString('en-US', {month: 'short', day:'numeric'})}`,
        }
        await fetch('/api/create-social-card', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postBody),
        });
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
          <DialogTitle>{isCreate ? "Create New Deal" : `Create Image ${deal?.id}`}</DialogTitle>
          <DialogDescription>
            {isCreate
              ? "Create a new social card image."
              : `Create a social card image for deal ${deal?.id}`}
          </DialogDescription>
        </DialogHeader>
        <ImageForm
          defaultValues={deal ? {
            title: deal.destination,
            eyebrow: deal.destination,
            background: deal.imageUrl,
            airport: deal.airport||'',
            airline: deal.airline||'',
            price: deal.price,
            dates: `${new Date(deal.departureDate).toLocaleDateString('en-US', {month: 'short', day:'numeric'})} - ${new Date(deal.returnDate).toLocaleDateString('en-US', {month: 'short', day:'numeric'})}`,
          } : undefined}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
