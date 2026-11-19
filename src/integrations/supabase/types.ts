export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      app_state: {
        Row: {
          user_id: string
          state: Json
          updated_at: string
        }
        Insert: {
          user_id: string
          state?: Json
          updated_at?: string
        }
        Update: {
          user_id?: string
          state?: Json
          updated_at?: string
        }
        Relationships: []
      }
      data_requests: {
        Row: {
          id: string
          user_id: string
          kind: Database["public"]["Enums"]["data_request_kind"]
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          kind: Database["public"]["Enums"]["data_request_kind"]
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          kind?: Database["public"]["Enums"]["data_request_kind"]
          status?: string
          created_at?: string
        }
        Relationships: []
      }
      medical_profiles: {
        Row: {
          user_id: string
          date_of_birth: string | null
          blood_group: string | null
          genotype: string | null
          previous_pregnancies: number | null
          previous_births: number | null
          previous_caesarean: boolean | null
          conditions: string[]
          allergies: string | null
          current_medicines: string | null
          facility_name: string | null
          updated_at: string
        }
        Insert: {
          user_id: string
          date_of_birth?: string | null
          blood_group?: string | null
          genotype?: string | null
          previous_pregnancies?: number | null
          previous_births?: number | null
          previous_caesarean?: boolean | null
          conditions?: string[]
          allergies?: string | null
          current_medicines?: string | null
          facility_name?: string | null
          updated_at?: string
        }
        Update: {
          user_id?: string
          date_of_birth?: string | null
          blood_group?: string | null
          genotype?: string | null
          previous_pregnancies?: number | null
          previous_births?: number | null
          previous_caesarean?: boolean | null
          conditions?: string[]
          allergies?: string | null
          current_medicines?: string | null
          facility_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      pregnancies: {
        Row: {
          id: string
          user_id: string
          last_period_date: string | null
          gestational_weeks_at_entry: number | null
          entered_on: string
          due_date: string
          doctor_due_date: string | null
          baby_nickname: string | null
          status: Database["public"]["Enums"]["pregnancy_status"]
          outcome_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          last_period_date?: string | null
          gestational_weeks_at_entry?: number | null
          entered_on?: string
          due_date: string
          doctor_due_date?: string | null
          baby_nickname?: string | null
          status?: Database["public"]["Enums"]["pregnancy_status"]
          outcome_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          last_period_date?: string | null
          gestational_weeks_at_entry?: number | null
          entered_on?: string
          due_date?: string
          doctor_due_date?: string | null
          baby_nickname?: string | null
          status?: Database["public"]["Enums"]["pregnancy_status"]
          outcome_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          full_name: string
          role: Database["public"]["Enums"]["neema_role"]
          phone: string | null
          city: string | null
          language: string
          journey: Database["public"]["Enums"]["neema_journey"]
          faith: string | null
          discreet_mode: boolean
          consent_version: string | null
          consent_terms_at: string | null
          consent_health_data_at: string | null
          consent_sms: boolean
          consent_partner_sharing: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string
          role?: Database["public"]["Enums"]["neema_role"]
          phone?: string | null
          city?: string | null
          language?: string
          journey?: Database["public"]["Enums"]["neema_journey"]
          faith?: string | null
          discreet_mode?: boolean
          consent_version?: string | null
          consent_terms_at?: string | null
          consent_health_data_at?: string | null
          consent_sms?: boolean
          consent_partner_sharing?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          role?: Database["public"]["Enums"]["neema_role"]
          phone?: string | null
          city?: string | null
          language?: string
          journey?: Database["public"]["Enums"]["neema_journey"]
          faith?: string | null
          discreet_mode?: boolean
          consent_version?: string | null
          consent_terms_at?: string | null
          consent_health_data_at?: string | null
          consent_sms?: boolean
          consent_partner_sharing?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      data_request_kind: "export" | "delete"
      neema_journey: "ttc" | "preg" | "pp" | "avoid"
      neema_role: "mother" | "partner"
      pregnancy_status: "active" | "born" | "loss" | "ended"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      data_request_kind: ["export", "delete"],
      neema_journey: ["ttc", "preg", "pp", "avoid"],
      neema_role: ["mother", "partner"],
      pregnancy_status: ["active", "born", "loss", "ended"],
    },
  },
} as const
