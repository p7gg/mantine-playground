import {
  Chip,
  MultiSelect,
  Tooltip,
  type ComboboxItem,
  type MultiSelectProps,
} from "@mantine/core";
import { useUncontrolled } from "@mantine/hooks";

export function MultiSelectWithChips({
  classNames,
  defaultValue,
  value,
  onChange,
  ...props
}: MultiSelectProps) {
  const [_value, setValue] = useUncontrolled({
    defaultValue,
    value,
    onChange,
    finalValue: [],
  });

  const chipsOptions: Array<ComboboxItem> = [];

  for (const item of props.data ?? []) {
    if (typeof item === "string") {
      chipsOptions.push({ value: item, label: item });
      continue;
    }

    if ("group" in item) {
      for (const subItem of item.items) {
        const value = typeof subItem === "string" ? subItem : subItem.value;
        chipsOptions.push(
          typeof subItem === "string" ? { value, label: value } : subItem
        );
      }
      continue;
    }

    chipsOptions.push(item);
  }

  const isAllChecked =
    chipsOptions && chipsOptions?.length > 0
      ? chipsOptions.every((chip) => _value.includes(chip.value))
      : false;
  const handleCheckAll = (checked: boolean) => {
    setValue(checked ? chipsOptions.map((chip) => chip.value) : []);
  };

  return (
    <div className="flex flex-col gap-2">
      <MultiSelect
        value={_value}
        onChange={setValue}
        classNames={{ ...classNames, pill: "hidden" }}
        {...props}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Chip
          variant="light"
          size="xs"
          radius="sm"
          classNames={{ iconWrapper: "hidden", label: "!px-2" }}
          checked={isAllChecked}
          onChange={handleCheckAll}
          disabled={props.disabled || chipsOptions.length === 0}
        >
          Selecionar todas
        </Chip>

        <Chip.Group multiple value={_value} onChange={setValue}>
          {chipsOptions.map((option) =>
            !option.disabled && _value.includes(option.value) ? (
              <Tooltip
                key={option.value}
                refProp="rootRef"
                label={option.label}
                openDelay={500}
                maw={200}
                multiline
                className="text-balance"
                withArrow
              >
                <Chip
                  value={option.value}
                  variant="light"
                  size="xs"
                  radius="sm"
                  maw={200}
                  classNames={{
                    iconWrapper: "hidden",
                    label:
                      "px-2 [&>span:nth-of-type(2)]:line-clamp-1 [&>span:nth-of-type(2)]:break-all [&>span:nth-of-type(2)]:whitespace-break-spaces",
                  }}
                >
                  {option.label}
                </Chip>
              </Tooltip>
            ) : null
          )}
        </Chip.Group>
      </div>
    </div>
  );
}
