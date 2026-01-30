import type { Express } from "express";
import type { Server } from "http";
// import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/create-social-card", async (req, res) => {
    try {
      
      // Process the request here (e.g., generate the social card)
      const fres = await fetch('https://ag80gw0g88g8cowk8okcgo8c.xnaflights.com/social-card-minio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });
      // Respond with success
      const response = await fres.json();
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: error.errors[0].message,
          field: error.errors[0].path.join("."),
        });
      }
      console.error("Error processing social card request:", error);
      res.status(500).json({ message: "Internal server error" });
    }});
  // app.get(api.deals.list.path, async (req, res) => {
  //   const deals = await storage.getDeals();
  //   res.json(deals);
  // });

  // app.get(api.deals.get.path, async (req, res) => {
  //   const deal = await storage.getDeal(Number(req.params.id));
  //   if (!deal) {
  //     return res.status(404).json({ message: "Deal not found" });
  //   }
  //   res.json(deal);
  // });

  // app.post(api.deals.create.path, async (req, res) => {
  //   console.log(req.body)
  //   try {
  //     const input = api.deals.create.input.parse(req.body);
  //     const deal = await storage.createDeal(input);
  //     res.status(201).json(deal);
  //   } catch (err) {
  //     if (err instanceof z.ZodError) {
  //       return res.status(400).json({
  //         message: err.errors[0].message,
  //         field: err.errors[0].path.join("."),
  //       });
  //     }
  //     throw err;
  //   }
  // });

  // app.put(api.deals.update.path, async (req, res) => {
  //   try {
  //     const input = api.deals.update.input.parse(req.body);
  //     const updatedDeal = await storage.updateDeal(Number(req.params.id), input);
  //     if (!updatedDeal) {
  //       return res.status(404).json({ message: "Deal not found" });
  //     }
  //     res.json(updatedDeal);
  //   } catch (err) {
  //     if (err instanceof z.ZodError) {
  //       return res.status(400).json({
  //         message: err.errors[0].message,
  //         field: err.errors[0].path.join("."),
  //       });
  //     }
  //     throw err;
  //   }
  // });

  // app.delete(api.deals.delete.path, async (req, res) => {
  //   await storage.deleteDeal(Number(req.params.id));
  //   res.status(204).send();
  // });

  // Seed data if empty
//   const existingDeals = await storage.getDeals();
//   if (existingDeals.length === 0) {
//     console.log("Seeding database with initial deals...");
//     await storage.createDeal({
//       airline: "Example Air",
//       departureDate: "2024-12-15",
//       returnDate: "2024-12-22",
//       description: "Enjoy 7 nights in a luxury villa with flights included.",
//       originalPrice: 1500,
//       price: 999,
//       destination: "Bali, Indonesia",
//       imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
//       bookingLink: "https://example.com/book/bali",
//       isActive: true,
//     });
//     await storage.createDeal({
//     airline: "Example Air",
//       departureDate: "2024-12-15",
//       returnDate: "2024-12-22",
//       description: "Romantic getaway including Seine cruise tickets.",
//       originalPrice: 800  ,
//       price: 550,
      
//       destination: "Paris, France",
//       imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
//       bookingLink: "https://example.com/book/paris",
//       isActive: true,
//     });
//     await storage.createDeal({
//  airline: "Example Air",
//       departureDate: "2024-12-15",
//       returnDate: "2024-12-22",
//       description: "Direct flights + 5 nights hotel in Shinjuku.",
//       originalPrice: 2200,
//       price: 1800,
//       destination: "Tokyo, Japan",
//       imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
//       bookingLink: "https://example.com/book/tokyo",
//       isActive: true,
//     });
//   }

  return httpServer;
}
