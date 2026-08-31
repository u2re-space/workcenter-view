/**
 * Local-first preparation for attachments sent from the Work Center composer.
 *
 * FIND:workcenter-document-preparation
 * WHY: PDF and Office bytes must never be passed through `File#text()` and
 * silently become unreadable model input.
 */
export type WorkCenterAttachmentKind =
    | "image"
    | "text"
    | "pdf"
    | "docx"
    | "xlsx"
    | "unknown";

export type PreparedAttachment = {
    original: File;
    kind: WorkCenterAttachmentKind;
    fallbackText?: string;
    images: File[];
    error?: string;
};

export type DocumentExtraction = {
    text: string;
    images?: File[];
};

export type WorkCenterDocumentParserAdapters = {
    pdf: (file: File) => Promise<DocumentExtraction>;
    docx: (file: File) => Promise<DocumentExtraction>;
    xlsx: (file: File) => Promise<DocumentExtraction>;
};

const extensionOf = (file: File): string =>
    file.name.split(".").pop()?.trim().toLowerCase() || "";

const kindOf = (file: File): WorkCenterAttachmentKind => {
    const type = file.type.toLowerCase();
    const extension = extensionOf(file);
    if (type.startsWith("image/")) return "image";
    if (type.startsWith("text/") || [
        "json", "xml", "yaml", "yml", "toml", "ini", "cfg", "conf",
        "js", "ts", "tsx", "jsx", "css", "scss", "html", "htm", "md"
    ].includes(extension)) return "text";
    if (type === "application/pdf" || extension === "pdf") return "pdf";
    if (
        type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        extension === "docx"
    ) return "docx";
    if (
        type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        extension === "xlsx"
    ) return "xlsx";
    return "unknown";
};

const dataUrlToFile = async (url: string, name: string): Promise<File | null> => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], name, { type: blob.type || "image/png" });
    } catch {
        return null;
    }
};

const extractPdf = async (file: File): Promise<DocumentExtraction> => {
    const [{ getDocument, GlobalWorkerOptions }, worker] = await Promise.all([
        import("pdfjs-dist/build/pdf.mjs"),
        import("pdfjs-dist/build/pdf.worker.mjs?url")
    ]);
    if (!GlobalWorkerOptions.workerSrc) GlobalWorkerOptions.workerSrc = worker.default;

    const document = await getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
    const pages: string[] = [];
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
        const page = await document.getPage(pageNumber);
        const content = await page.getTextContent();
        const text = content.items
            .map((item) => "str" in item ? item.str : "")
            .join(" ")
            .trim();
        if (text) pages.push(`## Page ${pageNumber}\n${text}`);
    }
    return { text: pages.join("\n\n") };
};

const extractDocx = async (file: File): Promise<DocumentExtraction> => {
    const mammothModule = await import("mammoth");
    const mammoth = (mammothModule.default ?? mammothModule) as {
        convertToHtml: (input: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }>;
    };
    const html = (await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() })).value;
    const document = new DOMParser().parseFromString(html, "text/html");
    const images = await Promise.all(
        [...document.querySelectorAll("img[src^='data:image/']")]
            .map((image, index) => dataUrlToFile(
                image.getAttribute("src") || "",
                `${file.name.replace(/\.docx$/i, "")}-image-${index + 1}.png`
            ))
    );
    return {
        text: document.body.textContent?.trim() || "",
        images: images.filter((image): image is File => image instanceof File)
    };
};

const extractXlsx = async (file: File): Promise<DocumentExtraction> => {
    const xlsxModule = await import("xlsx");
    const xlsx = (xlsxModule.default ?? xlsxModule) as typeof import("xlsx");
    const workbook = xlsx.read(await file.arrayBuffer(), { type: "array" });
    const sheets = workbook.SheetNames.map((name) => {
        const sheet = workbook.Sheets[name];
        const csv = sheet ? xlsx.utils.sheet_to_csv(sheet) : "";
        return `## Sheet: ${name}\n${csv}`.trim();
    }).filter(Boolean);
    return { text: sheets.join("\n\n") };
};

const defaultParsers: WorkCenterDocumentParserAdapters = {
    pdf: extractPdf,
    docx: extractDocx,
    xlsx: extractXlsx
};

/** Local document preparation facade with injectable parsers for contract tests. */
export class WorkCenterDocumentPreparer {
    private parsers: WorkCenterDocumentParserAdapters;

    constructor(parsers: Partial<WorkCenterDocumentParserAdapters> = {}) {
        this.parsers = { ...defaultParsers, ...parsers };
    }

    async prepare(original: File): Promise<PreparedAttachment> {
        const kind = kindOf(original);
        try {
            if (kind === "image") return { original, kind, images: [] };
            if (kind === "text") {
                return { original, kind, fallbackText: await original.text(), images: [] };
            }
            if (kind === "unknown") {
                return {
                    original,
                    kind,
                    images: [],
                    error: `Unsupported attachment type: ${original.type || original.name}`
                };
            }

            const result = await this.parsers[kind](original);
            return {
                original,
                kind,
                fallbackText: result.text,
                images: result.images ?? []
            };
        } catch (error) {
            return {
                original,
                kind,
                images: [],
                error: error instanceof Error ? error.message : String(error)
            };
        }
    }
}

export const createWorkCenterDocumentPreparer = (
    parsers?: Partial<WorkCenterDocumentParserAdapters>
): WorkCenterDocumentPreparer => new WorkCenterDocumentPreparer(parsers);
