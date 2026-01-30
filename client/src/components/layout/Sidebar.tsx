import { Link, useLocation } from "wouter";
import { LayoutDashboard, Plane, LogOut, Settings, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const [location] = useLocation();
  const { signOut } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Plane, label: "Active Deals", href: "/active" }, // Filtered view placeholder
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <aside className="w-64 h-screen bg-card border-r border-border fixed left-0 top-0 hidden md:flex flex-col z-20 shadow-2xl">
      <div className="p-8 pb-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          XNA Flights
        </h1>
        <p className="text-xs text-muted-foreground mt-1 tracking-wider uppercase">Admin Portal</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group hover:bg-white/5",
                location === item.href
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", location === item.href ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border bg-black/20">
        <div className="mb-4">
           {/* Placeholder for admin profile */}
           <div className="flex items-center gap-3 px-2 mb-4">
             <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs">AD</div>
             <div>
               <p className="text-sm font-medium text-foreground">Admin User</p>
               <p className="text-xs text-muted-foreground">admin@xna.com</p>
             </div>
           </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
          onClick={() => signOut()}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
