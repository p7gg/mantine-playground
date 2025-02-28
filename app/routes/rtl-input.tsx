import { NumberInput, type NumberInputProps } from "@mantine/core";
import React from "react";

function isNumber(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value);
}

type OnValueChange = NonNullable<NumberInputProps["onValueChange"]>;
type NumberFormatValues = Parameters<OnValueChange>[0];
type SourceInfo = Parameters<OnValueChange>[1];
const prefix = "R$ ";

export default function Page() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState<string | number>(0);

  const handleChange = (value: string | number) => {
    setValue(value);
  };

  const handleValueChange = (
    values: NumberFormatValues,
    sourceInfo: SourceInfo
  ) => {};

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const caretStart = inputRef.current?.selectionStart;
    const caretEnd = inputRef.current?.selectionEnd;
    const keyAsNumber = Number(e.key);

    if (
      !isNumber(caretStart) ||
      !isNumber(caretEnd) ||
      !isNumber(keyAsNumber)
    ) {
      return;
    }

    // e.preventDefault(); // Evita o comportamento padrão

    const valueNum = isNumber(value) ? value : 0;
    const valueChars = valueNum.toFixed(2).split("");
    const positionMinusPrefix = caretStart - prefix.length;

    const editingIndex = Math.max(positionMinusPrefix - 1, 0);
    const isAtDot = valueChars[editingIndex] === ".";

    console.log("🚀 ~ editingIndex:", editingIndex);
    console.log("🚀 ~ valueChars:", valueChars);

    if (editingIndex === 0) {
      valueChars.unshift(e.key);
    } else {
      valueChars[editingIndex] = e.key;
    }

    // console.log("🚀 ~ start:", inputRef.current?.selectionStart);
    // console.log("🚀 ~ end:", inputRef.current?.selectionEnd);
    // console.log("🚀 ~ keyAsNumber:", keyAsNumber);
    // console.log("🚀 ~ e:", e);
  };

  return (
    <div className="p-6">
      <NumberInput
        ref={inputRef}
        fixedDecimalScale
        decimalScale={2}
        prefix={prefix}
        value={value}
        onChange={handleChange}
        onValueChange={handleValueChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
