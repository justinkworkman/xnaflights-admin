import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DealImage} from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";

interface ImageFormProps {
  defaultValues?: Partial<DealImage>;
  onSubmit: (values: DealImage) => Promise<void>;
  isSubmitting?: boolean;
}

export function ImageForm({ defaultValues, onSubmit, isSubmitting }: ImageFormProps) {
  const form = useForm<DealImage>({
    defaultValues: {
      eyebrow: defaultValues?.eyebrow || "France",
      title: defaultValues?.title || "Paris",
      price: defaultValues?.price || 506,
      dates: defaultValues?.dates || "Mar 3–10",
      airport: defaultValues?.airport || "CDG",
      airline: defaultValues?.airline || "Air France",
      backgroundSize: defaultValues?.backgroundSize || "150",
      background: defaultValues?.background || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop"
    },
    mode: "onBlur",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Paris" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eyebrow"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country or State</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. France" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="airline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Airline</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Air France" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0.00" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="airport"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Airport</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="e.g. CDG" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <FormField
            control={form.control}
            name="dates"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dates</FormLabel>
                <FormControl>
                  <Input type="text" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="backgroundSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Size</FormLabel>
                <FormControl>
                  <Input type="text" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          


        </div>
        <FormField
            control={form.control}
            name="background"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image URL</FormLabel>
                <FormControl>
                  <Input type="text" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />



        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Create Image"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
