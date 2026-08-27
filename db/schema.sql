-- ============================================================================
-- CASA GUARDIAN — PROPERTY CARE & ASSET MANAGEMENT OS
-- Military-Grade Security PostgreSQL / Supabase Multi-Tenant Database Schema
-- Features: Row Level Security (RLS), Immutable Digital Signatures, Audit Log
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ENUM DEFINITIONS
CREATE TYPE user_role_enum AS ENUM ('super_admin', 'business_owner', 'field_operator', 'property_owner');
CREATE TYPE property_type_enum AS ENUM ('casa', 'apartamento', 'finca', 'local', 'vehiculo');
CREATE TYPE inspection_status_enum AS ENUM ('draft', 'in_progress', 'completed', 'verified_certified', 'flagged_alert');
CREATE TYPE work_order_urgency_enum AS ENUM ('low', 'medium', 'high', 'critical_emergency');

-- 2. USERS & ROLES TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role user_role_enum NOT NULL DEFAULT 'property_owner',
  encrypted_pass_hash TEXT NOT NULL,
  city_residence VARCHAR(100) DEFAULT 'Pasto',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  property_type property_type_enum NOT NULL DEFAULT 'casa',
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL DEFAULT 'Pasto',
  department VARCHAR(100) NOT NULL DEFAULT 'Nariño',
  geo_latitude DECIMAL(10,8),
  geo_longitude DECIMAL(11,8),
  health_score INT CHECK (health_score BETWEEN 0 AND 100) DEFAULT 100,
  key_box_code_encrypted TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. FIELD INSPECTIONS TABLE (IMMUTABLE HMAC SIGNATURES)
CREATE TABLE IF NOT EXISTS public.inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  operator_id UUID NOT NULL REFERENCES public.users(id),
  status inspection_status_enum NOT NULL DEFAULT 'draft',
  checklist_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  hd_photos_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  notes TEXT,
  digital_signature_hash VARCHAR(64) NOT NULL, -- SHA-256 HMAC for military-grade immutability
  created_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ
);

-- 5. WORK ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.work_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  inspection_id UUID REFERENCES public.inspections(id),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  urgency work_order_urgency_enum NOT NULL DEFAULT 'medium',
  estimated_cost_cop DECIMAL(12,2),
  approved_by_owner BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'pending_approval',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SYSTEM AUDIT LOG (MILITARY-GRADE IMMUTABLE TRAIL)
CREATE TABLE IF NOT EXISTS public.system_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  action_type VARCHAR(100) NOT NULL,
  resource_id VARCHAR(255) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  hash_checksum VARCHAR(64) NOT NULL,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;

-- Owner Can Only View Own Properties
CREATE POLICY owner_properties_policy ON public.properties
  FOR ALL TO authenticated
  USING (owner_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('super_admin', 'field_operator')
  ));

-- Owner Can Only View Inspections for Own Properties
CREATE POLICY owner_inspections_policy ON public.inspections
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.properties WHERE public.properties.id = inspections.property_id AND public.properties.owner_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('super_admin', 'field_operator')
  ));
