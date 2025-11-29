import { buildFileTree, getMarkdownFileByPath } from "@/lib/markdown";
import FileExplorer from "@/components/FileExplorer";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function Home() {
  const fileTree = buildFileTree();
  const homeFile = getMarkdownFileByPath("home");

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - File Explorer */}
      <aside className="w-64 border-r border-gray-200 bg-white flex-shrink-0 flex flex-col">
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
          {homeFile ? (
            <article className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
              <header className="mb-8 border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-gray-900">{homeFile.title}</h1>
                <p className="mt-2 text-sm text-gray-500">
                  Last modified: {homeFile.lastModified.toLocaleDateString()}
                </p>
              </header>
              <MarkdownRenderer content={homeFile.content} />
            </article>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to My Memory
              </h1>
              <p className="text-gray-600">
                Create a <code className="rounded bg-gray-100 px-2 py-1 text-xs">content/home.md</code> file to get started.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
