#!/usr/bin/env python3
"""
Memory Parser Script
Parses and extracts metadata from memories before saving.
"""

import sys
import json
import re
from datetime import datetime

def extract_entities(content: str) -> dict:
    """Extract entities from memory content."""
    entities = {
        "dates": [],
        "urls": [],
        "mentions": [],
        "tags": []
    }
    
    # Extract dates (simple patterns)
    date_patterns = re.findall(r'\d{4}-\d{2}-\d{2}', content)
    entities["dates"] = date_patterns
    
    # Extract URLs
    url_pattern = re.findall(r'https?://[^\s]+', content)
    entities["urls"] = url_pattern
    
    # Extract hashtags
    tags = re.findall(r'#(\w+)', content)
    entities["tags"] = tags
    
    # Extract @mentions
    mentions = re.findall(r'@(\w+)', content)
    entities["mentions"] = mentions
    
    return entities

def main():
    if len(sys.argv) < 2:
        print("Usage: parse-memory.py <memory_content>")
        sys.exit(1)
    
    content = sys.argv[1]
    entities = extract_entities(content)
    
    result = {
        "parsed_at": datetime.now().isoformat(),
        "entities": entities,
        "word_count": len(content.split()),
        "char_count": len(content)
    }
    
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()

