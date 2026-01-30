//a grid component that takes search results from a travel search api and displays them in a grid layout
import React, { useEffect, useState } from "react";
import { Deal } from "@shared/schema";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useCreateDeal } from "@/hooks/use-deals";

interface ExplorerGridProps {
    deals: TravelDeal[];
}

interface TravelDeal {
    flight_number: string;
    link: string;
    origin_airport: string;
    destination_airport: string;
    departure_at: string;
    airline: string;
    destination: string;
    return_at: string;
    origin: string;
    price: number;
    return_transfers: number;
    duration: number;
    duration_to: number;
    duration_back: number;
    transfers: number;
}

function adaptDeal(apiDeal: TravelDeal): Deal {
    return {
        destination: apiDeal.destination,
        departureDate: apiDeal.departure_at,
        returnDate: apiDeal.return_at,
        price: apiDeal.price,   
        imageUrl: "", // No image URL from API
        bookingLink: "https://www.aviasales.com" + apiDeal.link.split("?")[0],
        description: `Flight from ${apiDeal.origin} to ${apiDeal.destination} via ${apiDeal.airline}`,
        airline: apiDeal.airline,
        airport: apiDeal.origin_airport,
        isActive: false,
        isFeatured: false,
    } as Deal;
}   
const defaultImageUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop";


export function ExplorerGrid({ deals }: ExplorerGridProps) {
    const [filteredDeals, setFilteredDeals] = useState<TravelDeal[]>([]);
    const createDeal = useCreateDeal();

    const handleCreateDeal = async (deal: Deal) => {
        try {
            await createDeal.mutateAsync(deal); 
        } catch (error) {
            console.error("Error creating deal:", error);
        }
    };

    useEffect(() => {
        //filter deals based on search params
        let results = deals;
        setFilteredDeals(results);
    }, [ deals]); 
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {filteredDeals.map((deal) => (
                <Card key={deal.flight_number} className="shadow-lg hover:shadow-xl transition-shadow">    
                    <img src={defaultImageUrl} alt={deal.destination} className="w-full h-48 object-cover rounded-t-lg" />
                    <div className="p-4">
                        <h3 className="text-lg font-semibold">{deal.destination}</h3>   
                        <p className="text-sm text-muted-foreground">{new Date(deal.departure_at).toLocaleDateString()} - {new Date(deal.return_at).toLocaleDateString()}</p>
                        <p className="text-primary font-bold text-xl mt-2">${deal.price}</p>
                        <Button className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => window.open("https://www.aviasales.com" + deal.link.split("?")[0])}>Validate</Button>
                        
                        <Button className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleCreateDeal(adaptDeal(deal))}>Create Deal</Button>
                    </div>
                </Card>
            ))}
        </div>
    );
}
