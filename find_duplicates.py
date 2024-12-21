#!/usr/bin/env python3

import os
import hashlib
from collections import defaultdict
from pathlib import Path
import argparse

def calculate_file_hash(filepath, block_size=65536):
    """Calculate SHA256 hash of a file."""
    sha256_hash = hashlib.sha256()
    with open(filepath, "rb") as f:
        for block in iter(lambda: f.read(block_size), b""):
            sha256_hash.update(block)
    return sha256_hash.hexdigest()

def find_duplicates(directory):
    """Find duplicate files in the given directory."""
    hash_dict = defaultdict(list)
    file_count = 0
    duplicate_count = 0
    
    # Walk through directory
    for root, _, files in os.walk(directory):
        for filename in files:
            file_count += 1
            filepath = os.path.join(root, filename)
            try:
                file_hash = calculate_file_hash(filepath)
                hash_dict[file_hash].append(filepath)
            except (IOError, OSError) as e:
                print(f"Error processing {filepath}: {e}")

    # Print results in a tree-like structure
    print(f"\nScanned {file_count} files")
    print("\nDuplicate files found:")
    
    for file_hash, file_list in hash_dict.items():
        if len(file_list) > 1:
            duplicate_count += len(file_list) - 1
            print(f"\n{'='*50}")
            print(f"Duplicate set (size: {os.path.getsize(file_list[0])} bytes):")
            for filepath in file_list:
                print(f"├── {filepath}")

    print(f"\nTotal duplicate files found: {duplicate_count}")

def main():
    parser = argparse.ArgumentParser(description="Find duplicate files in a directory")
    parser.add_argument("directory", nargs="?", default=".", 
                      help="Directory to scan (default: current directory)")
    args = parser.parse_args()
    
    directory = os.path.abspath(args.directory)
    if not os.path.exists(directory):
        print(f"Error: Directory '{directory}' does not exist")
        return
    
    print(f"Scanning directory: {directory}")
    find_duplicates(directory)

if __name__ == "__main__":
    main()
