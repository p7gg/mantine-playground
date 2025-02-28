import { NumberInput as BaseNumberInput } from "@mantine/core";
import { useUncontrolled } from "@mantine/hooks";

function isNumber(data: unknown): data is number {
  return typeof data === "number" && !Number.isNaN(data);
}

function insert<T>(data: T[], index: number, value: T): T[] {
  return [...data.slice(0, index), value, ...data.slice(index)];
}

function swap<T>(data: T[], indexA: number, indexB: number): void {
  [data[indexA], data[indexB]] = [data[indexB], data[indexA]];
}

interface RtlNumberInputProps
  extends React.ComponentProps<typeof BaseNumberInput> {}
export function RtlNumberInput(props: RtlNumberInputProps) {
  const [value, setValue] = useUncontrolled({
    value: props.value,
    onChange: props.onChange,
    defaultValue: props.defaultValue,
    finalValue: "",
  });

  const thousandSeparator = props.thousandSeparator ?? ".";
  const decimalSeparator = props.decimalSeparator ?? ",";

  return (
    <BaseNumberInput
      allowLeadingZeros={false}
      allowNegative={false}
      clampBehavior="blur"
      step={0.01}
      {...props}
      allowDecimal
      fixedDecimalScale
      decimalScale={2}
      decimalSeparator={decimalSeparator}
      thousandSeparator={thousandSeparator}
      value={value}
      onKeyDown={(e) => {
        const key = e.key;
        const keyAsNumber = Number(key);

        if (key === "Backspace") {
          return;
        }

        if (isNumber(keyAsNumber)) {
          if (typeof value === "string") {
            return;
          }

          // Get the cursor position to insert the new key at this index
          const cursorPositionIndex = e.currentTarget.selectionStart;
          if (!isNumber(cursorPositionIndex)) {
            return;
          }

          // Measure the current input value info
          const inputValue = e.currentTarget.value;
          const lastIndex = inputValue.length - (props.suffix?.length ?? 0);
          const decimalSepIndex = inputValue.indexOf(decimalSeparator);

          // Don't do anything if the cursor is after the decimal separator
          if (cursorPositionIndex <= decimalSepIndex) {
            return;
          }

          // Don't do anything if the cursor is not at the end
          if (lastIndex !== cursorPositionIndex) {
            return;
          }

          // Convert the amount to decimal scale, remove dots and commas and split the digits
          const currentValueDigits = value
            .toFixed(2)
            .replace(/\D/g, "")
            .split("");

          // Shift the last digit to the left
          swap(
            currentValueDigits,
            currentValueDigits.length,
            currentValueDigits.length - 1
          );

          // Replace last digit with the pressed key
          const newValueDigits = insert(
            currentValueDigits,
            currentValueDigits.length,
            key
          );

          // Convert it back to number
          const newValue = Number(newValueDigits.join("")) / 100;
          if (isNumber(newValue)) {
            setValue(newValue);
          }
        }

        props.onKeyDown?.(e);
      }}
      onChange={(value) => {
        setValue(value === "0.00" ? 0 : value);
      }}
    />
  );
}
