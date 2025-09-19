import { createBrowserClient, createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Client-side Supabase client
export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

// Server-side Supabase client
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

// Database types
export interface User {
  id: string
  email: string
  name: string
  plan: "free" | "pro" | "enterprise"
  usage_count: number
  max_usage: number
  created_at: string
  updated_at: string
}

export interface Scenario {
  id: string
  user_id: string
  name: string
  description?: string
  tags: string[]
  base_inputs: any
  levers: any
  kpis: any
  created_at: string
  updated_at: string
}

export interface UsageLog {
  id: string
  user_id: string
  action: "export_pdf" | "save_scenario" | "load_scenario"
  scenario_id?: string
  metadata?: any
  created_at: string
}
