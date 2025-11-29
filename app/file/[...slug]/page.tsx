import { notFound } from "next/navigation";
import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getMarkdownFileByPath, getAllMarkdownFiles, buildFileTree } from "@/lib/markdown";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import FileExplorer from "@/components/FileExplorer";

export async function generateStaticParams() {
  const files = getAllMarkdownFiles();
  return files.map((file) => ({
    slug: file.slug.split("/"), // Split path into array for catch-all route
  }));
}

export default function MarkdownPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = use(params);
  const filePath = Array.isArray(slug) ? slug.join("/") : slug;
  const file = getMarkdownFileByPath(filePath);
  const fileTree = buildFileTree();

  if (!file) {
    notFound();
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - File Explorer */}
      <aside className="w-64 border-r border-gray-200 bg-white flex-shrink-0 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            Files
          </h2>
        </div>
        <FileExplorer tree={fileTree} />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <article className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <header className="mb-8 border-b border-gray-200 pb-4">
              <h1 className="text-3xl font-bold text-gray-900">{file.title}</h1>
              <p className="mt-2 text-sm text-gray-500">
                Last modified: {file.lastModified.toLocaleDateString()}
              </p>
            </header>

            <MarkdownRenderer content={file.content} />
          </article>
        </div>
      </main>
    </div>
  );
}

