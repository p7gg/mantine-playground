import * as m from "@mantine/core";
import { z } from "zod";
import { createZodForm } from "~/modules/create-zod-form";
import { NumberFormatBase } from "react-number-format";
import React from "react";

const Zod = createZodForm(
  z.object({
    name: z.string(),
    age: z.number(),
    price: z.number(),
    rememberMe: z.boolean(),
    items: z.object({ id: z.string() }).array(),
    cliente: z.object({ id: z.string() }).nullable(),
  })
);

const ITEMS = [
  { id: "1", nome: "Item 1" },
  { id: "2", nome: "Item 2" },
  { id: "3", nome: "Item 3" },
  { id: "4", nome: "Item 4" },
  { id: "5", nome: "Item 5" },
  { id: "6", nome: "Item 6" },
  {
    id: "7",
    nome: "Item 7 ou um outro nome qualquer bem grande soh pra testar a resiliencia do componente q eu fiz",
  },
  { id: "8", nome: "Item 8" },
  { id: "9", nome: "Item 9" },
];

function isNumber(data: unknown): data is number {
  return typeof data === "number" && !Number.isNaN(data);
}

function insert<T>(data: T[], index: number, value: T): T[] {
  return [...data.slice(0, index), value, ...data.slice(index)];
}

function swap<T>(data: T[], indexA: number, indexB: number): void {
  [data[indexA], data[indexB]] = [data[indexB], data[indexA]];
}

const prefix = "R$ ";

export default function Page() {
  const form = Zod.useForm({
    defaultValues: {
      age: 18,
      price: 10,
      cliente: null,
      items: [],
      name: "",
      rememberMe: true,
    },
  });

  const [amount, setAmount] = React.useState<number | string>(0);

  const handleItemsChange = (ids: string[]): { id: string }[] =>
    ITEMS.filter((item) => ids.includes(item.id)).map((item) => ({
      id: item.id,
    }));

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.select();
  };

  return (
    <Zod.FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(
          (payload) => console.log("🚀 ~ payload:", payload),
          (errors) => console.log("🚀 ~ errors:", errors)
        )}
      >
        <m.Stack p={10}>
          {/* <Zod.NumberInput label="Age" name="age" />

          <Zod.Select
            clearable
            name="name"
            data={[{ value: "1", label: "1" }]}
          />

          <Zod.SwitchGroup
            name="items"
            label="Items"
            value={(items) => items.map((i) => i.id)}
            onChange={handleItemsChange}
          >
            {ITEMS.map((item) => (
              <m.Switch key={item.id} value={item.id} label={item.nome} />
            ))}
          </Zod.SwitchGroup> */}

          <Zod.MultiSelectWithChips
            clearable
            name="items"
            label="Items"
            value={(items) => items.map((i) => i.id)}
            onChange={handleItemsChange}
            data={ITEMS.map((item) => ({ value: item.id, label: item.nome }))}
          />

          <m.NumberInput
            allowDecimal
            allowLeadingZeros={false}
            allowNegative={false}
            clampBehavior="blur"
            fixedDecimalScale
            decimalScale={2}
            decimalSeparator=","
            thousandSeparator="."
            prefix={prefix}
            value={amount}
            onKeyDown={(e) => {
              const key = e.key;
              const keyAsNumber = Number(key);

              if (key === "Backspace") {
                return;
              }

              if (isNumber(keyAsNumber)) {
                if (typeof amount === "string") {
                  return;
                }

                // Get the cursor position to insert the new key at this index
                const cursorPositionIndex = e.currentTarget.selectionStart;
                if (!isNumber(cursorPositionIndex)) {
                  return;
                }

                // Measure the current input value info
                const inputValue = e.currentTarget.value;
                const lastIndex = inputValue.length;
                const commaIndex = inputValue.indexOf(",");

                // Don't do anything if the cursor is after the comma
                if (cursorPositionIndex <= commaIndex) {
                  return;
                }

                // Don't do anything if the cursor is not at the end
                if (lastIndex !== cursorPositionIndex) {
                  return;
                }

                // Convert the amount to decimal scale, remove dots and commas and split the digits
                const currentValueDigits = amount
                  .toFixed(2)
                  .replace(/\D/g, "")
                  .split("");

                // shift the last digit to the left
                swap(
                  currentValueDigits,
                  currentValueDigits.length,
                  currentValueDigits.length - 1
                );

                // replace last digit with the pressed key
                const newValueDigits = insert(
                  currentValueDigits,
                  currentValueDigits.length,
                  key
                );

                // Convert it back to number
                const newValue = Number(newValueDigits.join("")) / 100;
                if (isNumber(newValue)) {
                  setAmount(newValue);
                }
              }
            }}
            onChange={setAmount}
          />

          {/* <CurrencyInput value={amount} onChange={setAmount} /> */}

          {/* <Zod.Switch name="rememberMe" />

          <m.Button type="submit">Save</m.Button> */}
        </m.Stack>
      </form>
    </Zod.FormProvider>
  );
}
