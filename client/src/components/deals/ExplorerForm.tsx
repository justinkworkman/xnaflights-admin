import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertDealSchema } from "@shared/schema";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Link2 } from "lucide-react";
import { get } from "http";
import { date } from "drizzle-orm/mysql-core";

interface ExplorerFormProps {
  defaultValues?: Partial<FormValues>;
  onSubmit: (values: FormValues) => Promise<void>;
  isSubmitting?: boolean;
}
type FormValues = z.infer<typeof formSchema>;

const formSchema = insertDealSchema.extend({
  originalPrice: z.coerce.number().optional(),
  price: z.coerce.number(),
});
export function ExplorerForm({ defaultValues, onSubmit, isSubmitting }: ExplorerFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
     
      description: "",
      price: 0,
      originalPrice: 0,
      departureDate: "",
      returnDate: "",
      destination: "",
      imageUrl: "",
      bookingLink: "",
      isActive: true,
      ...defaultValues,
    },
    mode: "onBlur",
  });

  function getSearchUrl() {
    const destination = form.getValues().destination || "";
    const dateDeparture = new Date(form.getValues().departureDate);
    const departureDate = (dateDeparture.getDate() + 1).toString().padStart(2, '0') + (dateDeparture.getMonth() + 1).toString().padStart(2, '0');
    const dateReturn = new Date(form.getValues().returnDate);
    const returnDate =  (dateReturn.getDate() + 1).toString().padStart(2, '0') + (dateReturn.getMonth() + 1).toString().padStart(2, '0');
    return `https://www.aviasales.com/search/XNA${departureDate}${destination}${returnDate}`;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          

          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Paris, France" {...field} onChange={(e) => field.onChange(e.target.value.toString())} value={field.value ?? ""}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="departureDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departure Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} onChange={(e) => field.onChange(e.target.value.toString())} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="returnDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Return Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} onChange={(e) => field.onChange(e.target.value.toString())} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" type="button" onClick={() => { window.open(getSearchUrl(), "_blank"); }} className="w-full md:w-auto">
            <Link2 className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
