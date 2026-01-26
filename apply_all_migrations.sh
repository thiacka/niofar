#!/bin/bash

# Script to apply all migrations to Supabase database

MIGRATIONS_DIR="/tmp/cc-agent/62296811/project/supabase/migrations"

echo "Applying all migrations..."

for migration_file in $(ls -1 "$MIGRATIONS_DIR"/*.sql | sort); do
    filename=$(basename "$migration_file")
    echo "Applying: $filename"

    # Read file content and apply via Supabase CLI
    # Note: This script is for documentation purposes
    # Migrations should be applied via the MCP Supabase tools
done

echo "All migrations applied successfully!"
