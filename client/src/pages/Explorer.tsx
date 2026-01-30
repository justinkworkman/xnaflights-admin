//explorer page for searching for deals and creating them
import { ExplorerForm } from "@/components/deals/ExplorerForm";
import { ExplorerGrid } from "@/components/deals/ExplorerGrid";
import { Sidebar } from "@/components/layout/Sidebar";
import React from "react";

async function handleSubmit(values: any): Promise<any> {
    //for now just log the values
    console.log("Explorer form submitted with values:", values);
    const res = fetch('/api/search-deals', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    });
    const data = await res.then((r) => r.json());
    console.log("Search results:", data);
    
    return data;
}
const defaultValues = {
    destination: "CDG",
    departureDate: new Date().toISOString().split("T")[0],
    returnDate: new Date().toISOString().split("T")[0]
};
export default function ExplorerPage() {    
    //a form with destination, departure date and return date. On submit, it shows a list of deals from an external travel api matching the criteria.
    const [searchValue, setSearchValue] = React.useState([]);
    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Sidebar */}
            <Sidebar />
            {/* Main Content */}
       <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
            <h1 className="text-2xl font-bold mb-4">Explorer Page</h1>
            <ExplorerForm onSubmit={(values) => handleSubmit(values).then((v) => {console.log(v); setSearchValue(v.data);})} defaultValues={defaultValues}/> 
            <ExplorerGrid deals={searchValue} />
            {searchValue.length === 0 && (
                <p className="mt-6 text-center text-muted-foreground">No deals found. Please enter search criteria and click "Search" to find deals.</p>
            )}
        </main>
        </div>
    );
}