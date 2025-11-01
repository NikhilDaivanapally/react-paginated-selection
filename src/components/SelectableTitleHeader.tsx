import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useRef, type ChangeEvent } from "react";

type SelectableTitleHeaderProps = {
  value: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
};

const SelectableTitleHeader = ({
  value,
  onInputChange,
  onSubmit,
}: SelectableTitleHeaderProps) => {
  const overlay = useRef<OverlayPanel>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    onInputChange(event.target.value);

  const handleSubmit = () => {
    if (!value || isNaN(Number(value))) return;
    overlay.current?.hide();
    onSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };
  return (
    <div className="flex gap-2 items-center">
      <Button
        icon="pi pi-angle-down"
        text
        rounded
        size="large"
        aria-label="Enter value to select rows"
        onClick={(e) => overlay.current?.toggle(e)}
      />
      <OverlayPanel ref={overlay}>
        <div className="flex flex-col gap-2 w-[180px]">
          <InputText
            placeholder="Select rows..."
            value={value}
            autoFocus
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <Button
            label="Submit"
            disabled={!Boolean(value)}
            onClick={handleSubmit}
            size="small"
          />
        </div>
      </OverlayPanel>
      <span>Title</span>
    </div>
  );
};

export default SelectableTitleHeader;
