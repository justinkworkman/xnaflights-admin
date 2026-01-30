## Packages
@supabase/supabase-js | Supabase client for authentication
react-hook-form | Form state management
@hookform/resolvers | Zod resolver for react-hook-form
zod | Schema validation
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility for merging Tailwind CSS classes
lucide-react | Icons

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  sans: ["Inter", "sans-serif"],
  display: ["Space Grotesk", "sans-serif"],
}

Supabase Authentication:
- Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.
- Login page should use Supabase Auth `signInWithPassword`.
- Auth state should be managed with `onAuthStateChange`.
