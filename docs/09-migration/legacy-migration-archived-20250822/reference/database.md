# 🗄️ SHELTR Database Documentation
*Last Updated: January 25, 2024 23:45 EST*
*Version: 0.6.6*
*Status: STABLE* 🟢

## Database Connection
```bash
export PGHOST=db.oinjrlzuc1zztdstagqg.supabase.co
export PGDATABASE=postgres
export PGUSER=postgres
export PGPASSWORD='xxxxxxxxxxxxx'
psql
```

## Schema Overview

### Public Schema
The `public` schema contains tables related to core functionality, including role-based navigation, path validation, and security monitoring.

### Auth Schema
The `auth` schema manages authentication, role-based access control, and Super Admin privileges.

## Table Definitions

### Public Schema Tables

#### Super Admin Analytics
```sql
CREATE TABLE public.admin_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_type VARCHAR NOT NULL,
    metric_value JSONB NOT NULL,
    ai_insights JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE public.system_health (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status VARCHAR NOT NULL,
    metrics JSONB NOT NULL,
    alerts JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Role Management
```sql
CREATE TABLE public.role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID REFERENCES auth.roles(id),
    path VARCHAR NOT NULL,
    access_level VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE public.path_validations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    path VARCHAR NOT NULL,
    required_role VARCHAR NOT NULL,
    security_level INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE public.security_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    path VARCHAR NOT NULL,
    access_type VARCHAR NOT NULL,
    success BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Users
- **id**: UUID, Primary Key
- **email**: VARCHAR, Unique
- **first_name**: VARCHAR
- **last_name**: VARCHAR
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP
- **preferred_language**: VARCHAR(5)
- **ui_preferences**: JSONB

#### Donations
- **id**: UUID, Primary Key
- **user_id**: UUID, Foreign Key (references Users)
- **amount**: DECIMAL
- **created_at**: TIMESTAMP

#### Navigation States
- **id**: UUID, Primary Key
- **user_id**: UUID, Foreign Key (references Users)
- **current_route**: VARCHAR
- **history**: JSONB
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

#### Translations
- **id**: UUID, Primary Key
- **key**: VARCHAR
- **language**: VARCHAR(5)
- **content**: TEXT
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

#### Performance Metrics
- **id**: UUID, Primary Key
- **user_id**: UUID, Foreign Key (references Users)
- **navigation_mount_time**: INTEGER
- **language_switch_time**: INTEGER
- **route**: VARCHAR
- **created_at**: TIMESTAMP

#### AI Metrics
- **id**: UUID, Primary Key
- **metric_type**: VARCHAR
- **data**: JSONB
- **predictions**: JSONB
- **confidence**: DECIMAL
- **created_at**: TIMESTAMP

#### Blockchain Tracking
- **id**: UUID, Primary Key
- **transaction_hash**: VARCHAR
- **data**: JSONB
- **verification**: JSONB
- **created_at**: TIMESTAMP

### Auth Schema Tables

#### Roles
```sql
CREATE TABLE auth.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL UNIQUE,
    permissions JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Auth Users
- **id**: UUID, Primary Key
- **email**: VARCHAR, Unique
- **password_hash**: VARCHAR
- **role**: ENUM('super_admin', 'shelter_admin', 'donor', 'participant')
- **created_at**: TIMESTAMP

#### Sessions
- **id**: UUID, Primary Key
- **user_id**: UUID, Foreign Key (references Auth Users)
- **expires_at**: TIMESTAMP
- **created_at**: TIMESTAMP

## Relationships and Indexes
- **Users** table has a foreign key relationship with **Donations**.
- **Navigation States** table has a foreign key relationship with **Users**
- **Performance Metrics** table has a foreign key relationship with **Users**
- Indexes on `email` for fast lookup in both **Users** and **Auth Users** tables.
- Indexes on `language` and `key` in **Translations** table
- Index on `user_id` and `route` in **Performance Metrics**

## Sample Queries

### Retrieve User Information
```sql
SELECT * FROM public.users WHERE email = 'example@example.com';
```

### Update User Profile
```sql
UPDATE public.users SET first_name = 'John', last_name = 'Doe' WHERE id = 'user-uuid';
```

### Retrieve User Language Preference
```sql
SELECT preferred_language, ui_preferences 
FROM public.users 
WHERE id = 'user-uuid';
```

### Get Navigation History
```sql
SELECT current_route, history 
FROM public.navigation_states 
WHERE user_id = 'user-uuid' 
ORDER BY created_at DESC 
LIMIT 1;
```

### Fetch Translations
```sql
SELECT key, content 
FROM public.translations 
WHERE language = 'en' 
AND key = ANY($1);
```

### Track Performance Metrics
```sql
INSERT INTO public.performance_metrics 
(user_id, navigation_mount_time, language_switch_time, route) 
VALUES ('user-uuid', 45, 95, '/dashboard');
```

## New Sample Queries

### Super Admin Analytics
```sql
SELECT 
    metric_type,
    metric_value,
    ai_insights
FROM public.admin_analytics
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

### System Health Monitoring
```sql
SELECT 
    status,
    metrics->>'performance' as performance,
    metrics->>'security' as security,
    alerts
FROM public.system_health
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC
LIMIT 1;
```

### AI Analytics
```sql
SELECT 
    metric_type,
    data,
    predictions,
    confidence
FROM public.ai_metrics
WHERE confidence > 0.85
ORDER BY created_at DESC
LIMIT 10;
```

### Role Validation
```sql
SELECT rp.access_level 
FROM public.role_permissions rp
JOIN auth.roles r ON r.id = rp.role_id
WHERE r.name = $1 AND rp.path = $2;
```

### Path Security Check
```sql
SELECT required_role, security_level
FROM public.path_validations
WHERE path = $1;
```

### Security Monitoring
```sql
INSERT INTO public.security_logs 
(user_id, path, access_type, success)
VALUES ($1, $2, $3, $4);
```

### Access Analytics
```sql
SELECT 
    path,
    COUNT(*) as total_attempts,
    SUM(CASE WHEN success THEN 1 ELSE 0 END) as successful_attempts,
    AVG(CASE WHEN success THEN 1 ELSE 0 END)::DECIMAL(4,2) as success_rate
FROM public.security_logs
GROUP BY path
ORDER BY total_attempts DESC;
```

## Performance Metrics

### Role Resolution Time
```sql
SELECT 
    path,
    AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) * 1000) as avg_resolution_ms
FROM public.role_permissions
GROUP BY path
HAVING AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) * 1000) > 10;
```

### Security Validation Performance
```sql
SELECT 
    DATE_TRUNC('hour', created_at) as time_bucket,
    COUNT(*) as validation_count,
    AVG(CASE WHEN success THEN 1 ELSE 0 END)::DECIMAL(4,2) as success_rate
FROM public.security_logs
GROUP BY time_bucket
ORDER BY time_bucket DESC;
```

## Security Considerations
- Implement row-level security for role permissions
- Encrypt sensitive path data
- Log all access attempts
- Monitor validation performance
- Track security violations
- Implement role hierarchy
- Validate path patterns
- Cache common validations

## Indexes
```sql
CREATE INDEX idx_role_permissions_path ON public.role_permissions(path);
CREATE INDEX idx_path_validations_path ON public.path_validations(path);
CREATE INDEX idx_security_logs_user_path ON public.security_logs(user_id, path);
CREATE INDEX idx_security_logs_created_at ON public.security_logs(created_at);
```

## Monitoring Queries

### Role Access Patterns
```sql
SELECT 
    r.name as role,
    rp.path,
    COUNT(*) as access_count
FROM auth.roles r
JOIN public.role_permissions rp ON r.id = rp.role_id
JOIN public.security_logs sl ON rp.path = sl.path
GROUP BY r.name, rp.path
ORDER BY access_count DESC;
```

### Security Violations
```sql
SELECT 
    user_id,
    path,
    COUNT(*) as failed_attempts
FROM public.security_logs
WHERE NOT success
GROUP BY user_id, path
HAVING COUNT(*) > 5
ORDER BY failed_attempts DESC;
```

---
*For implementation details, see [implementation.md](./implementation.md)*
