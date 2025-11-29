#!/usr/bin/env python3
"""
Code Formatter Script
Formats code snippets before saving to the knowledge base.
"""

import sys
import json

def format_code(content: str) -> str:
    """Apply basic formatting to code content."""
    # Remove trailing whitespace
    lines = [line.rstrip() for line in content.split('\n')]
    # Ensure single newline at end
    return '\n'.join(lines).strip() + '\n'

def main():
    if len(sys.argv) < 2:
        print("Usage: format-code.py <file>")
        sys.exit(1)
    
    filepath = sys.argv[1]
    
    try:
        with open(filepath, 'r') as f:
            content = f.read()
        
        formatted = format_code(content)
        
        with open(filepath, 'w') as f:
            f.write(formatted)
        
        print(f"Formatted: {filepath}")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

