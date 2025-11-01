# react-paginated-selection

A lightweight React utility for managing **selection and deselection across paginated lists**.  
Ideal for data tables, product lists, or gallery-style UIs where users select items across pages.

---

## ✨ Features

- Maintains selections across multiple pages  
- Handles auto-selection up to a target count  
- Tracks deselected items accurately  
- Simple, hook-based implementation  
- Written in TypeScript for type safety  

---

## 🧩 Example Code

### Auto-select logic

```tsx
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
```

### Handle selection changes

```tsx
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
```

## Setup

git clone https://github.com/NikhilDaivanapally/react-paginated-selection.git                                                                                                                                        

cd react-paginated-selection

npm install

npm run dev


