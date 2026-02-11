interface DocumentViewerProps {
  htmlContent: string;
  title?: string;
}

export function DocumentViewer({ htmlContent, title }: DocumentViewerProps) {
  return (
    <div className="rounded-lg border bg-card">
      {title && (
        <div className="border-b px-6 py-4">
          <h3 className="font-semibold">{title}</h3>
        </div>
      )}
      <div
        className="prose prose-sm max-w-none p-6 prose-headings:text-[#00357b] prose-h1:text-xl prose-h1:font-bold prose-h2:text-lg prose-h2:font-semibold prose-h3:text-base prose-h3:font-medium prose-a:text-gold-link prose-strong:text-[#00357b] prose-table:text-sm prose-th:bg-muted prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2 prose-td:border prose-th:border"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}
