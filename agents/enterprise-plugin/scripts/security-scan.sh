#!/bin/bash

# Security Scan Script
# Scans content for potential security issues

echo "Running security scan..."

# Check for sensitive patterns
grep -r -E "(password|secret|api_key|token)" . --include="*.md" --include="*.json" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "Warning: Potential sensitive data found"
    exit 1
fi

echo "Security scan complete. No issues found."
exit 0

