-- ============================================================
-- SHAURYA MITTAL | DEVELOPER PROFILE DATABASE
-- File: query.sql
-- Database: SQLite 3
-- Purpose: Store and query structured developer information
-- ============================================================

PRAGMA foreign_keys = ON;

-- ============================================================
-- 1. IDENTITY
-- ============================================================

CREATE TABLE IF NOT EXISTS identity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    professional_title TEXT,
    location TEXT,
    biography TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. PROJECTS
-- ============================================================

CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_name TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT,
    status TEXT DEFAULT 'In Development',
    project_url TEXT,
    repository_url TEXT,
    featured INTEGER DEFAULT 0 CHECK (featured IN (0, 1)),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. PROJECT TECHNOLOGIES
-- ============================================================

CREATE TABLE IF NOT EXISTS technologies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    technology_name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS project_technologies (
    project_id INTEGER NOT NULL,
    technology_id INTEGER NOT NULL,

    PRIMARY KEY (project_id, technology_id),

    FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    FOREIGN KEY (technology_id)
        REFERENCES technologies(id)
        ON DELETE CASCADE
);

-- ============================================================
-- 4. INTERESTS
-- ============================================================

CREATE TABLE IF NOT EXISTS interests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    interest_name TEXT NOT NULL UNIQUE,
    category TEXT,
    description TEXT
);

-- ============================================================
-- 5. SOCIAL LINKS
-- ============================================================

CREATE TABLE IF NOT EXISTS social_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform TEXT NOT NULL UNIQUE,
    profile_url TEXT NOT NULL,
    is_public INTEGER DEFAULT 1 CHECK (is_public IN (0, 1))
);

-- ============================================================
-- 6. OBJECTIVES
-- ============================================================

CREATE TABLE IF NOT EXISTS objectives (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    objective TEXT NOT NULL,
    category TEXT,
    priority INTEGER DEFAULT 3,
    status TEXT DEFAULT 'Planned',
    target_date TEXT,
    CHECK (priority BETWEEN 1 AND 5)
);

-- ============================================================
-- 7. DEVELOPMENT PRINCIPLES
-- ============================================================

CREATE TABLE IF NOT EXISTS development_principles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    principle TEXT NOT NULL UNIQUE,
    explanation TEXT
);

-- ============================================================
-- 8. USEFUL INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_projects_category
ON projects(category);

CREATE INDEX IF NOT EXISTS idx_projects_status
ON projects(status);

CREATE INDEX IF NOT EXISTS idx_projects_featured
ON projects(featured);

CREATE INDEX IF NOT EXISTS idx_interests_category
ON interests(category);

CREATE INDEX IF NOT EXISTS idx_objectives_status
ON objectives(status);

-- ============================================================
-- 9. PROFILE QUERIES
-- ============================================================

-- Retrieve the complete identity profile.
SELECT *
FROM identity;

-- Retrieve a profile using the GitHub username.
SELECT *
FROM identity
WHERE username = 'shaurya1233';

-- ============================================================
-- 10. PROJECT QUERIES
-- ============================================================

-- Retrieve all projects.
SELECT *
FROM projects
ORDER BY project_name ASC;

-- Retrieve featured projects.
SELECT *
FROM projects
WHERE featured = 1;

-- Retrieve projects by category.
SELECT *
FROM projects
WHERE category = 'Web Development';

-- Retrieve projects by development status.
SELECT *
FROM projects
WHERE status = 'Completed';

-- Retrieve the total number of projects.
SELECT COUNT(*) AS total_projects
FROM projects;

-- Retrieve projects with their technologies.
SELECT
    p.project_name,
    p.description,
    p.project_url,
    GROUP_CONCAT(t.technology_name, ', ') AS technologies
FROM projects AS p
LEFT JOIN project_technologies AS pt
    ON p.id = pt.project_id
LEFT JOIN technologies AS t
    ON pt.technology_id = t.id
GROUP BY p.id
ORDER BY p.project_name;

-- ============================================================
-- 11. TECHNOLOGY QUERIES
-- ============================================================

-- Retrieve all technologies.
SELECT *
FROM technologies
ORDER BY technology_name;

-- Find projects using a particular technology.
SELECT
    p.project_name,
    p.project_url
FROM projects AS p
JOIN project_technologies AS pt
    ON p.id = pt.project_id
JOIN technologies AS t
    ON pt.technology_id = t.id
WHERE t.technology_name = 'JavaScript';

-- ============================================================
-- 12. INTEREST QUERIES
-- ============================================================

-- Retrieve all interests.
SELECT *
FROM interests
ORDER BY category, interest_name;

-- Retrieve interests from a specific category.
SELECT *
FROM interests
WHERE category = 'Technology';

-- Count interests by category.
SELECT
    category,
    COUNT(*) AS total_interests
FROM interests
GROUP BY category
ORDER BY total_interests DESC;

-- ============================================================
-- 13. SOCIAL LINK QUERIES
-- ============================================================

-- Retrieve public social profiles.
SELECT platform, profile_url
FROM social_links
WHERE is_public = 1
ORDER BY platform;

-- Find a specific social profile.
SELECT *
FROM social_links
WHERE platform = 'GitHub';

-- ============================================================
-- 14. OBJECTIVE QUERIES
-- ============================================================

-- Retrieve all objectives.
SELECT *
FROM objectives
ORDER BY priority ASC;

-- Retrieve planned objectives.
SELECT *
FROM objectives
WHERE status = 'Planned';

-- Retrieve high-priority objectives.
SELECT *
FROM objectives
WHERE priority <= 2
ORDER BY priority ASC;

-- ============================================================
-- 15. DATABASE OVERVIEW
-- ============================================================

-- Generate a basic database summary.
SELECT 'Identity Records' AS data_type,
       COUNT(*) AS total
FROM identity

UNION ALL

SELECT 'Projects',
       COUNT(*)
FROM projects

UNION ALL

SELECT 'Technologies',
       COUNT(*)
FROM technologies

UNION ALL

SELECT 'Interests',
       COUNT(*)
FROM interests

UNION ALL

SELECT 'Social Links',
       COUNT(*)
FROM social_links

UNION ALL

SELECT 'Objectives',
       COUNT(*)
FROM objectives

UNION ALL

SELECT 'Development Principles',
       COUNT(*)
FROM development_principles;

-- ============================================================
-- END OF QUERY LIBRARY
-- ============================================================
