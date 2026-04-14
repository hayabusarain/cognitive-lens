// ============================================================
// Supabase Database Types
// 対人課題解決プラットフォーム — 手動生成型定義
// ============================================================

export type MbtiType =
  | 'INTJ' | 'INTP' | 'INFJ' | 'INFP'
  | 'ISTJ' | 'ISTP' | 'ISFJ' | 'ISFP'
  | 'ENTJ' | 'ENTP' | 'ENFJ' | 'ENFP'
  | 'ESTJ' | 'ESTP' | 'ESFJ' | 'ESFP'

export type ProtocolCategory = '短期' | '長期' | '教育'

// ------------------------------------------------------------
// protocols
// ------------------------------------------------------------
export interface Protocol {
  id: string
  target_type: MbtiType
  category: ProtocolCategory
  content: string
  ng_words: string[]
  created_at: string
}

export type ProtocolInsert = Omit<Protocol, 'id' | 'created_at'> & {
  id?: string
  created_at?: string
}

export type ProtocolUpdate = Partial<ProtocolInsert>

// ------------------------------------------------------------
// ugc_feedbacks
// ------------------------------------------------------------
export interface UgcFeedback {
  id: string
  target_type: MbtiType
  category: ProtocolCategory
  is_effective: boolean
  user_story: string | null
  created_at: string
}

export type UgcFeedbackInsert = Omit<UgcFeedback, 'id' | 'created_at'> & {
  id?: string
  created_at?: string
}

// ------------------------------------------------------------
// analytics_logs
// ------------------------------------------------------------
export interface AnalyticsLog {
  id: string
  feature_name: string
  input_data: Record<string, unknown> | null
  created_at: string
}

export type AnalyticsLogInsert = Omit<AnalyticsLog, 'id' | 'created_at'> & {
  id?: string
  created_at?: string
}

// ------------------------------------------------------------
// Supabase Database 型マップ（createClient<Database>() で使用）
// ------------------------------------------------------------
export interface Database {
  public: {
    Tables: {
      protocols: {
        Row: Protocol
        Insert: ProtocolInsert
        Update: ProtocolUpdate
      }
      ugc_feedbacks: {
        Row: UgcFeedback
        Insert: UgcFeedbackInsert
        Update: never
      }
      analytics_logs: {
        Row: AnalyticsLog
        Insert: AnalyticsLogInsert
        Update: never
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      mbti_type: MbtiType
      protocol_category: ProtocolCategory
    }
  }
}
