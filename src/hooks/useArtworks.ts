import { useCallback, useEffect, useMemo, useState } from "react";

export type Artwork = {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
};

type ApiResponse = {
  data: Artwork[];
  pagination: { total: number };
};

const API_URL = "https://api.artic.edu/api/v1/artworks";
const DEFAULT_PAGE_SIZE = 12;

const useArtworks = (pageSize = DEFAULT_PAGE_SIZE) => {
  const [page, setPage] = useState(1);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<String | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deselectedIds, setDeselectedIds] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [autoSelectCount, setAutoSelectCount] = useState<number>(0);

  const fetchArtworksPage = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    try {
      const Response = await fetch(
        `${API_URL}?page=${page}&limit=${pageSize}`,
        {
          signal: controller.signal,
        }
      );
      if (!Response.ok) throw new Error("Something went wrong");
      const data: ApiResponse = await Response.json();
      setArtworks(data.data);
      if (!total) setTotal(data.pagination.total);
    } catch (error) {
      setError("Failed to load artworks");
    } finally {
      setLoading(false);
    }

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    fetchArtworksPage(page);
  }, [page]);

  const handlePageChange = useCallback((number: number) => {
    setPage(number);
  }, []);

  // Update selection state when rows are selected or deselected
  const handleRowSelectionChange = (selectedArtworks: Artwork[]) => {
    const newIds = selectedArtworks.map((a) => a.id);
    const pageIds = artworks.map((a) => a.id);

    // Find artworks on this page that were deselected
    const newlyDeselected = pageIds.filter(
      (id) => selectedIds.includes(id) && !newIds.includes(id)
    );

    setDeselectedIds((prev) => [...prev, ...newlyDeselected]);

    setSelectedIds((prev) => {
      // Keep selections from other pages
      const retained = prev.filter((id) => !pageIds.includes(id));
      // Combine with current page selections
      return [...retained, ...newIds];
    });
  };

  // Handle Input Change
  const handleInputChange = (value: string) => {
    const val = Number(value);
    if (!isNaN(val)) {
      setInputValue(value);
    }
  };
  
  // Auto-select artworks based on the desired selection count
  useEffect(() => {
    if (!autoSelectCount || !artworks?.length) return;

    const alreadySelectedCount = (page - 1) * pageSize;
    const remainingToSelect = autoSelectCount - alreadySelectedCount;
    if (remainingToSelect <= 0) return;

    const currentArtworksIds = artworks.map((artwork) => artwork.id);

    const newSelections = currentArtworksIds
      .filter((id) => !deselectedIds.includes(id))
      .slice(0, remainingToSelect - deselectedIds.length);

    if (newSelections.length > 0) {
      setSelectedIds((prev) => [...prev, ...newSelections]);
    }
  }, [autoSelectCount, artworks]);

  // Handle auto selection based on the user’s input value
  const applyAutoSelection = () => {
    // Reset all previously selected and deselected rows
    setSelectedIds([]);
    setDeselectedIds([]);

    // Set the target number of rows to auto-select
    setAutoSelectCount(Number(inputValue));
  };

  const selectedArtworks = useMemo(
    () => artworks.filter((a) => selectedIds.includes(a.id)),
    [artworks, selectedIds]
  );

  return {
    page,
    artworks,
    total,
    loading,
    error,
    pageSize,
    selectedIds,
    selectedArtworks,
    inputValue,
    handleInputChange,
    handlePageChange,
    handleRowSelectionChange,
    applyAutoSelection,
  };
};

export default useArtworks;
