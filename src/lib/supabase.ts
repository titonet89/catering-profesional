import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);

export type GalleryItem = {
  id: string;
  title: string;
  categoria: string;
  storage_path: string;
  tipo: "foto" | "video";
  activo: boolean;
  created_at: string;
};

export type ContactoSubmission = {
  id?: string;
  nombre: string;
  email: string;
  evento?: string;
  mensaje?: string;
};
