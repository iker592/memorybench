"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen } from "lucide-react";
import { FileTreeNode } from "@/lib/markdown";

interface FileExplorerProps {
  tree: FileTreeNode[];
  basePath?: string;
}

export default function FileExplorer({ tree, basePath = "/file" }: FileExplorerProps) {
  const pathname = usePathname();
  
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-2">
        {tree.map((node) => (
          <TreeNode
            key={node.path}
            node={node}
            basePath={basePath}
            pathname={pathname}
            level={0}
          />
        ))}
      </div>
    </div>
  );
}

interface TreeNodeProps {
  node: FileTreeNode;
  basePath: string;
  pathname: string;
  level: number;
}

function TreeNode({ node, basePath, pathname, level }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Expand first 2 levels by default
  const isActive = pathname === `${basePath}/${node.path}`;

  if (node.type === "file") {
    return (
      <Link
        href={`${basePath}/${node.path}`}
        className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${
          isActive
            ? "bg-blue-100 text-blue-700 font-medium"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        <FileText className="h-4 w-4 flex-shrink-0" />
        <span className="truncate">{node.name.replace(".md", "")}</span>
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm w-full text-left transition-colors hover:bg-gray-100 ${
          isActive ? "bg-blue-50" : ""
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-500" />
        ) : (
          <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-500" />
        )}
        {isExpanded ? (
          <FolderOpen className="h-4 w-4 flex-shrink-0 text-blue-600" />
        ) : (
          <Folder className="h-4 w-4 flex-shrink-0 text-blue-600" />
        )}
        <span className="truncate font-medium">{node.name}</span>
      </button>
      {isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              basePath={basePath}
              pathname={pathname}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

