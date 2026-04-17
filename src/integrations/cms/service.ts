/**
 * Pagination options for querying collections
 */
export interface PaginationOptions {
  /** Number of items per page (default: 50, max: 1000) */
  limit?: number;
  /** Number of items to skip (for offset-based pagination) */
  skip?: number;
}

/**
 * Metadata for a multi-reference field (available on item._refMeta[fieldName])
 * Only populated by getById, not getAll
 */
export interface RefFieldMeta {
  /** Total count of referenced items */
  totalCount: number;
  /** Number of items returned */
  returnedCount: number;
  /** Whether there are more items beyond what was returned */
  hasMore: boolean;
}

/**
 * Paginated result with metadata for infinite scroll
 */
export interface PaginatedResult<T> {
  /** Array of items for current page */
  items: T[];
  /** Total number of items in the collection */
  totalCount: number;
  /** Whether there are more items after current page */
  hasNext: boolean;
  /** Current page number (0-indexed) */
  currentPage: number;
  /** Number of items per page */
  pageSize: number;
  /** Offset to use for next page */
  nextSkip: number | null;
}

function cmsApiRoot(): string {
  return "/api/cms";
}

async function readJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(text || res.statusText || "Invalid JSON");
  }
  if (!res.ok) {
    const err =
      typeof body === "object" &&
      body !== null &&
      "error" in body &&
      typeof (body as { error: unknown }).error === "string"
        ? (body as { error: string }).error
        : text || res.statusText;
    throw new Error(err);
  }
  return body as T;
}

/**
 * Generic CRUD Service backed by MongoDB via Astro API routes.
 */
export class BaseCrudService {
  static async create<T>(
    collectionId: string,
    itemData: Partial<T> | Record<string, unknown>,
    _multiReferences?: Record<string, unknown>,
  ): Promise<T> {
    const res = await fetch(`${cmsApiRoot()}/${encodeURIComponent(collectionId)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itemData),
    });
    return readJson<T>(res);
  }

  static async getAll<T>(
    collectionId: string,
    _includeRefs?: { singleRef?: string[]; multiRef?: string[] } | string[],
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<T>> {
    const limit = Math.min(pagination?.limit ?? 50, 1000);
    const skip = pagination?.skip ?? 0;
    const q = new URLSearchParams({
      limit: String(limit),
      skip: String(skip),
    });
    const res = await fetch(
      `${cmsApiRoot()}/${encodeURIComponent(collectionId)}?${q}`,
    );
    return readJson<PaginatedResult<T>>(res);
  }

  static async getById<T>(
    collectionId: string,
    itemId: string,
    _includeRefs?: { singleRef?: string[]; multiRef?: string[] } | string[],
  ): Promise<T | null> {
    const res = await fetch(
      `${cmsApiRoot()}/${encodeURIComponent(collectionId)}/${encodeURIComponent(itemId)}`,
    );
    if (res.status === 404) return null;
    return readJson<T>(res);
  }

  static async update<T>(
    collectionId: string,
    itemData: T,
  ): Promise<T> {
    if (!itemData._id) {
      throw new Error(`${collectionId} ID is required for update`);
    }
    const res = await fetch(
      `${cmsApiRoot()}/${encodeURIComponent(collectionId)}/${encodeURIComponent(itemData._id)}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      },
    );
    return readJson<T>(res);
  }

  static async delete<T>(
    collectionId: string,
    itemId: string,
  ): Promise<T> {
    if (!itemId) {
      throw new Error(`${collectionId} ID is required for deletion`);
    }
    const res = await fetch(
      `${cmsApiRoot()}/${encodeURIComponent(collectionId)}/${encodeURIComponent(itemId)}`,
      { method: "DELETE" },
    );
    return readJson<T>(res);
  }

  static async addReferences(
    _collectionId: string,
    _itemId: string,
    _references: Record<string, string[]>,
  ): Promise<void> {
    return;
  }

  static async removeReferences(
    _collectionId: string,
    _itemId: string,
    _references: Record<string, string[]>,
  ): Promise<void> {
    return;
  }
}
