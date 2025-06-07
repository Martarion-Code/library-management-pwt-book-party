#!/bin/bash

PGPASSWORD=postgres psql -U postgres -h localhost -p 5432 <<EOF
DROP DATABASE IF EXISTS library_management;
CREATE DATABASE library_management;
EOF

echo "Database created successfully!"
