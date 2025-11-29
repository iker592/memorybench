import fs from "fs";
import path from "path";

const contentDirectory = path.join(process.cwd(), "content");

export interface MarkdownFile {
  slug: string;
  path: string; // Full path relative to content directory
  title: string;
  content: string;
  lastModified: Date;
}

export interface FileTreeNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileTreeNode[];
  lastModified?: Date;
}

function isMarkdownFile(fileName: string): boolean {
  return fileName.endsWith(".md");
}

function getFileTitle(filePath: string): string {
  const fileContents = fs.readFileSync(filePath, "utf8");
  const titleMatch = fileContents.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    return titleMatch[1];
  }
  const fileName = path.basename(filePath, ".md");
  return fileName;
}

export function buildFileTree(dirPath: string = contentDirectory, relativePath: string = ""): FileTreeNode[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const items: FileTreeNode[] = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  // Sort: directories first, then files, both alphabetically
  entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const itemRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      const children = buildFileTree(fullPath, itemRelativePath);
      if (children.length > 0) {
        items.push({
          name: entry.name,
          path: itemRelativePath,
          type: "directory",
          children,
        });
      }
    } else if (isMarkdownFile(entry.name)) {
      const stats = fs.statSync(fullPath);
      items.push({
        name: entry.name,
        path: itemRelativePath.replace(/\.md$/, ""), // Remove .md extension
        type: "file",
        lastModified: stats.mtime,
      });
    }
  }

  return items;
}

export function getAllMarkdownFiles(): MarkdownFile[] {
  const files: MarkdownFile[] = [];

  function traverseDirectory(dirPath: string, relativePath: string = "") {
    if (!fs.existsSync(dirPath)) {
      return;
    }

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const itemRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        traverseDirectory(fullPath, itemRelativePath);
      } else if (isMarkdownFile(entry.name)) {
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const stats = fs.statSync(fullPath);
        const title = getFileTitle(fullPath);
        const slug = itemRelativePath.replace(/\.md$/, "");

        files.push({
          slug,
          path: itemRelativePath,
          title,
          content: fileContents,
          lastModified: stats.mtime,
        });
      }
    }
  }

  traverseDirectory(contentDirectory);
  return files.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
}

export function getMarkdownFileByPath(filePath: string): MarkdownFile | null {
  // Handle both slug format (projects/web/react-project) and full path
  const normalizedPath = filePath.startsWith("content/") 
    ? filePath.replace("content/", "") 
    : filePath;
  
  const fullPath = path.join(contentDirectory, `${normalizedPath}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const stats = fs.statSync(fullPath);
  const title = getFileTitle(fullPath);

  return {
    slug: normalizedPath,
    path: normalizedPath,
    title,
    content: fileContents,
    lastModified: stats.mtime,
  };
}
