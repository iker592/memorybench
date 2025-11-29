#!/usr/bin/env python3
"""
Query Enhancer Script
Enhances search queries for better memory retrieval.
"""

import sys
import json

# Simple synonym expansion
SYNONYMS = {
    "remember": ["recall", "memory", "note"],
    "idea": ["thought", "concept", "notion"],
    "task": ["todo", "action", "work"],
    "learn": ["study", "understand", "knowledge"],
    "project": ["work", "initiative", "effort"]
}

def expand_query(query: str) -> dict:
    """Expand query with synonyms and related terms."""
    words = query.lower().split()
    expanded_terms = set(words)
    
    for word in words:
        if word in SYNONYMS:
            expanded_terms.update(SYNONYMS[word])
    
    return {
        "original": query,
        "expanded_terms": list(expanded_terms),
        "search_mode": "semantic" if len(words) > 2 else "exact"
    }

def main():
    if len(sys.argv) < 2:
        print("Usage: enhance-query.py <query>")
        sys.exit(1)
    
    query = " ".join(sys.argv[1:])
    result = expand_query(query)
    
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()

