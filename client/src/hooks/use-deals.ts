import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type DealInput, type DealUpdateInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";

export function useDeals() {
  const { session } = useAuth();
  return useQuery({
    queryKey: ["deals", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: !!session,
  });
}

export function useDeal(id: number) {
  const { session } = useAuth();
  return useQuery({
    queryKey: ["deals", id, session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error && error.code === "PGRST116") return null; // Not found
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!id && !!session,
  });
}

export function useCreateDeal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: DealInput) => {
      const { data: deal, error } = await supabase
        .from("deals")
        .insert([data])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return deal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      toast({
        title: "Success",
        description: "Deal created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateDeal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & DealUpdateInput) => {
      console.log("Updating deal with data:", id, updates);
      const { data: deal, error } = await supabase
        .from("deals")
        .update(updates)
        .eq("id", id)
        
        

      if (error) throw new Error(error.message);
      return deal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      toast({
        title: "Success",
        description: "Deal updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteDeal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("deals")
        .delete()
        .eq("id", id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      toast({
        title: "Deleted",
        description: "Deal has been removed",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
