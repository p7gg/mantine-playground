import { Chip, MultiSelect, Tooltip, type ComboboxItem } from "@mantine/core";
import { useUncontrolled } from "@mantine/hooks";

interface MultiSelectWithChips
  extends React.ComponentProps<typeof MultiSelect> {
  hideList?: boolean;
}
export function MultiSelectWithChips({
  classNames,
  defaultValue,
  value,
  onChange,
  hideList,
  ...props
}: MultiSelectWithChips) {
  const [_value, setValue] = useUncontrolled({
    defaultValue,
    value,
    onChange,
    finalValue: [],
  });

  const chipsOptions: Array<ComboboxItem> = [];

  if (!hideList) {
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
  }

  const isAllChecked =
    chipsOptions && chipsOptions?.length > 0
      ? chipsOptions.every((chip) => _value.includes(chip.value))
      : false;
  const handleCheckAll = (checked: boolean) => {
    setValue(checked ? chipsOptions.map((chip) => chip.value) : []);
  };

  const multiSelect = (
    <MultiSelect
      value={_value}
      onChange={setValue}
      classNames={{
        ...classNames,
        ...(!hideList && { pill: "hidden" }),
      }}
      {...props}
    />
  );

  if (hideList) {
    return multiSelect;
  }

  return (
    <div className="flex flex-col gap-2">
      {multiSelect}

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
                    label: "px-2 [&>span:nth-of-type(2)]:line-clamp-1",
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
