import * as m from "@mantine/core";
import { z } from "zod";
import { createZodForm } from "~/modules/create-zod-form";
import React from "react";
import { useUncontrolled } from "@mantine/hooks";
import { RtlNumberInput } from "~/components/rtl-number-input";

const Zod = createZodForm(
  z.object({
    name: z.string(),
    age: z.number(),
    price: z.number(),
    rememberMe: z.boolean(),
    items: z.object({ id: z.string() }).array(),
    bar: z.string().array(),
    cliente: z.object({ id: z.string() }).nullable(),
    date: z.date().nullable(),
    dates: z.tuple([z.date().nullable(), z.date().nullable()]),
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

export default function Page() {
  const form = Zod.useForm({
    defaultValues: {
      age: 18,
      price: 10,
      cliente: null,
      items: [],
      name: "",
      rememberMe: true,
      bar: [],
      date: null,
      dates: [null, null],
    },
  });

  const [amount, setAmount] = React.useState<number | string>(0);
  console.log("🚀 ~ amount:", amount);

  const handleItemsChange = (ids: string[]): { id: string }[] =>
    ITEMS.filter((item) => ids.includes(item.id)).map((item) => ({
      id: item.id,
    }));

  return (
    <Zod.FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(
          (payload) => console.log("🚀 ~ payload:", payload),
          (errors) => console.log("🚀 ~ errors:", errors)
        )}
      >
        <m.Stack p={10}>
          <Zod.TextInput name="name" />
          <Zod.NumberInput label="Age" name="age" />

          <Zod.Select
            clearable
            name="name"
            data={[{ value: "1", label: "1" }]}
          />

          <Zod.CheckboxGroup
            name="items"
            label="Items"
            value={(items) => items.map((i) => i.id)}
            onChange={handleItemsChange}
          >
            {ITEMS.map((item) => (
              <m.Checkbox key={item.id} value={item.id} label={item.nome} />
            ))}
          </Zod.CheckboxGroup>

          <Zod.MultiSelect
            clearable
            name="items"
            label="Items"
            value={(items) => items.map((i) => i.id)}
            onChange={handleItemsChange}
            data={ITEMS.map((item) => ({ value: item.id, label: item.nome }))}
          />

          <Zod.RadioGroup name="name" label="Select a name">
            <m.Group>
              <m.Radio value="foo" label="foo" />
              <m.Radio value="bar" label="bar" />
            </m.Group>
          </Zod.RadioGroup>

          <Zod.NumberInput name="age" label="price" />
          <Zod.NumberInput rtl name="price" prefix="R$ " label="Price" />
          {/* <RtlNumberInput prefix="R$ " value={amount} onChange={setAmount} />
          <RtlNumberInput suffix=" %" defaultValue={0} /> */}

          <Zod.DateRangePicker name="dates" />

          {/* <CurrencyInput value={amount} onChange={setAmount} /> */}

          {/* <Zod.Switch name="rememberMe" />*/}

          <m.Button type="submit">Save</m.Button>
        </m.Stack>
      </form>
    </Zod.FormProvider>
  );
}
