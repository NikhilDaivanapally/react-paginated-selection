import useArtworks, { type Artwork } from "../hooks/useArtworks";
import {
  DataTable,
  type DataTablePageEvent,
  type DataTableSelectionMultipleChangeEvent,
} from "primereact/datatable";
import { Column } from "primereact/column";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";

import { useCallback } from "react";
import SelectableTitleHeader from "./SelectableTitleHeader";

const ArtworkTable = () => {
  const {
    page,
    artworks,
    total,
    loading,
    error,
    pageSize,
    selectedArtworks,
    inputValue,
    handleInputChange,
    handlePageChange,
    handleRowSelectionChange,
    applyAutoSelection,
  } = useArtworks();

  const onPageChange = useCallback(
    (event: DataTablePageEvent) => handlePageChange(Number(event.page) + 1),
    [handlePageChange]
  );

  const onSelectionChange = useCallback(
    (event: DataTableSelectionMultipleChangeEvent<Artwork[]>) =>
      handleRowSelectionChange(event.value),
    [handleRowSelectionChange]
  );

  if (error)
    return <div className="w-full h-screen text-red-500 text-lg">{error}</div>;

  return (
    <DataTable
      value={artworks}
      loading={loading}
      paginator
      rows={pageSize}
      totalRecords={total}
      lazy
      dataKey="id"
      first={(page - 1) * pageSize}
      onPage={onPageChange}
      selection={selectedArtworks}
      selectionMode="checkbox"
      onSelectionChange={onSelectionChange}
      emptyMessage="No artworks found."
    >
      <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
      <Column
        header={
          <SelectableTitleHeader
            value={inputValue}
            onInputChange={handleInputChange}
            onSubmit={applyAutoSelection}
          />
        }
        field="title"
      />
      <Column header="Place Of Origin" field="place_of_origin" />
      <Column header="Artist Display" field="artist_display" />
      <Column header="Inscriptions" field="inscriptions" />
      <Column header="Start Date" field="date_start" />
      <Column header="End Date" field="date_end" />
    </DataTable>
  );
};

export default ArtworkTable;
