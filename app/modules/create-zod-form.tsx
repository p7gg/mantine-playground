import { zodResolver } from "@hookform/resolvers/zod";
import { useMergedRef } from "@mantine/hooks";
import { DatePickerInput, type DatePickerInputProps } from "@mantine/dates";
import * as m from "@mantine/core";
import React from "react";
import { z } from "zod";
import { MultiSelectWithChips } from "~/components/multi-select-with-chips";
import * as rhf from "react-hook-form";
import { RtlNumberInput } from "~/components/rtl-number-input";

type SchemaOptions = Parameters<typeof zodResolver>[1];
type ResolverOptions = Parameters<typeof zodResolver>[2];

export function createZodForm<TSchema extends z.ZodObject<any>>(
  schema: TSchema,
  schemaOptions?: SchemaOptions,
  { raw = true, mode }: ResolverOptions = {}
) {
  type FormInput = TSchema["_input"];
  type FormOutput = TSchema["_output"];
  type FormContext = unknown;

  const resolver = zodResolver(schema, schemaOptions, { raw, mode });

  interface UseZodFormProps
    extends Omit<rhf.UseFormProps<FormInput, FormContext>, "resolver"> {}
  interface UseZodFormReturn
    extends rhf.UseFormReturn<FormInput, FormContext, FormOutput> {
    /**
     * A unique ID for this form.
     */
    id: string;
  }
  function useForm(options?: UseZodFormProps) {
    const form = rhf.useForm({
      resolver,
      mode: "onSubmit",
      reValidateMode: "onChange",
      ...options,
    }) as UseZodFormReturn;
    form.id = React.useId();
    return form;
  }

  type UseFormContext = () => UseZodFormReturn;
  const useFormContext = rhf.useFormContext as unknown as UseFormContext;

  const useFormState = rhf.useFormState<FormInput>;

  type UseController = <TFieldName extends rhf.FieldPath<FormInput>>(
    props: rhf.UseControllerProps<FormInput, TFieldName>
  ) => rhf.UseControllerReturn<FormInput, TFieldName>;
  const useController = rhf.useController as UseController;

  type UseFieldArray = <
    TFieldArrayName extends rhf.FieldArrayPath<FormInput>,
    TKeyName extends string = "id"
  >(
    props: rhf.UseFieldArrayProps<FormInput, TFieldArrayName, TKeyName>
  ) => rhf.UseFieldArrayReturn<FormInput, TFieldArrayName, TKeyName>;
  const useFieldArray = rhf.useFieldArray as UseFieldArray;

  function useWatch(props: {
    defaultValue?: rhf.DeepPartialSkipArrayKey<FormInput>;
    control?: rhf.Control<FormInput>;
    disabled?: boolean;
    exact?: boolean;
  }): rhf.DeepPartialSkipArrayKey<FormInput>;
  function useWatch<
    TFieldName extends rhf.FieldPath<FormInput> = rhf.FieldPath<FormInput>
  >(props: {
    name: TFieldName;
    defaultValue?: rhf.FieldPathValue<FormInput, TFieldName>;
    control?: rhf.Control<FormInput>;
    disabled?: boolean;
    exact?: boolean;
  }): rhf.FieldPathValue<FormInput, TFieldName>;
  function useWatch<
    TFieldNames extends ReadonlyArray<rhf.FieldPath<FormInput>> = ReadonlyArray<
      rhf.FieldPath<FormInput>
    >
  >(props: {
    name: readonly [...TFieldNames];
    defaultValue?: rhf.DeepPartialSkipArrayKey<FormInput>;
    control?: rhf.Control<FormInput>;
    disabled?: boolean;
    exact?: boolean;
  }): rhf.FieldPathValues<FormInput, TFieldNames>;
  function useWatch(): rhf.DeepPartialSkipArrayKey<FormInput>;
  function useWatch(props?: rhf.UseWatchProps<FormInput>) {
    return rhf.useWatch(props as any);
  }

  type Controller = <TFieldName extends rhf.FieldPath<FormInput>>(
    props: rhf.ControllerProps<FormInput, TFieldName>
  ) => React.ReactElement;
  const Controller = rhf.Controller as Controller;

  const FormProvider = rhf.FormProvider<FormInput, FormContext, FormOutput>;

  type ControlledKeys = keyof UseControllerProps | "value" | "onChange";
  interface UseControllerProps<
    TName extends rhf.FieldPath<FormInput> = rhf.FieldPath<FormInput>
  > extends rhf.UseControllerProps<FormInput, TName> {}

  type ArrayValueProps<T extends Array<any>> = T extends Array<string>
    ? {
        value?: never;
        onChange?: (value: T) => void | T;
      }
    : {
        value: (value: T) => Array<string>;
        onChange: (value: Array<string>) => T;
      };
  type RecordValueProps<T extends string | Record<string, any>> =
    T extends string
      ? {
          value?: never;
          onChange?: (value: T) => void | T;
        }
      : {
          value: (value: T) => string | null;
          onChange: (value: string | null) => T;
        };

  interface TextInputProps<
    TName extends rhf.FieldPathByValue<FormInput, string>,
    TValue = rhf.FieldPathValue<FormInput, TName>
  > extends Omit<React.ComponentProps<typeof m.TextInput>, ControlledKeys>,
      UseControllerProps<TName> {
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => TValue | void;
  }
  function TextInput<TName extends rhf.FieldPathByValue<FormInput, string>>({
    control,
    name,
    defaultValue,
    rules,
    shouldUnregister,
    disabled,
    ...props
  }: TextInputProps<TName>) {
    return (
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={rules}
        shouldUnregister={shouldUnregister}
        disabled={disabled}
        render={({ field, fieldState }) => {
          const mergeRef = useMergedRef(field.ref, props.ref);
          return (
            <m.TextInput
              ref={mergeRef}
              name={field.name}
              value={field.value ?? ""}
              disabled={field.disabled}
              error={fieldState.error?.message}
              {...props}
              onChange={(e) => {
                const _ = props.onChange?.(e);
                field.onChange(_ !== undefined ? _ : e);
              }}
              onBlur={(e) => {
                field.onBlur();
                props.onBlur?.(e);
              }}
            />
          );
        }}
      />
    );
  }

  interface NumberInputProps<
    TName extends rhf.FieldPathByValue<FormInput, number>,
    TValue = rhf.FieldPathValue<FormInput, TName>
  > extends Omit<React.ComponentProps<typeof m.NumberInput>, ControlledKeys>,
      Omit<UseControllerProps<TName>, "defaultValue"> {
    rtl?: true;
    defaultValue?: rhf.FieldPathValue<FormInput, TName> | "";
    onChange?: (value: string | number) => void | TValue;
  }
  function NumberInput<TName extends rhf.FieldPathByValue<FormInput, number>>({
    control,
    name,
    defaultValue,
    rules,
    shouldUnregister,
    disabled,
    rtl,
    ...props
  }: NumberInputProps<TName>) {
    const NumberInput = rtl ? RtlNumberInput : m.NumberInput;

    return (
      <Controller
        control={control}
        name={name}
        defaultValue={
          defaultValue as rhf.FieldPathValue<FormInput, TName> | undefined
        }
        rules={rules}
        shouldUnregister={shouldUnregister}
        disabled={disabled}
        render={({ field, fieldState }) => {
          const mergeRef = useMergedRef(field.ref, props.ref);
          return (
            <NumberInput
              ref={mergeRef}
              name={field.name}
              value={field.value ?? ""}
              disabled={field.disabled}
              error={fieldState.error?.message}
              {...props}
              onChange={(e) => {
                const _ = props.onChange?.(e);
                field.onChange(_ !== undefined ? _ : e);
              }}
              onBlur={(e) => {
                field.onBlur();
                props.onBlur?.(e);
              }}
            />
          );
        }}
      />
    );
  }

  interface CheckboxProps<
    TName extends rhf.FieldPathByValue<FormInput, boolean>,
    TValue = rhf.FieldPathValue<FormInput, TName>
  > extends Omit<React.ComponentProps<typeof m.Checkbox>, ControlledKeys>,
      UseControllerProps<TName> {
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void | TValue;
  }
  function Checkbox<TName extends rhf.FieldPathByValue<FormInput, boolean>>({
    control,
    name,
    defaultValue,
    rules,
    shouldUnregister,
    disabled,
    ...props
  }: CheckboxProps<TName>) {
    return (
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={rules}
        shouldUnregister={shouldUnregister}
        disabled={disabled}
        render={({ field, fieldState }) => {
          const mergeRef = useMergedRef(field.ref, props.ref);
          return (
            <m.Checkbox
              ref={mergeRef}
              name={field.name}
              checked={field.value ?? false}
              disabled={field.disabled}
              error={fieldState.error?.message}
              {...props}
              onChange={(e) => {
                const _ = props.onChange?.(e);
                field.onChange(_ !== undefined ? _ : e);
              }}
              onBlur={(e) => {
                field.onBlur();
                props.onBlur?.(e);
              }}
            />
          );
        }}
      />
    );
  }

  type CheckboxGroupProps<
    TName extends rhf.FieldPathByValue<FormInput, Array<any>>
  > = Omit<React.ComponentProps<typeof m.CheckboxGroup>, ControlledKeys> &
    UseControllerProps<TName> &
    ArrayValueProps<rhf.FieldPathValue<FormInput, TName>>;
  function CheckboxGroup<
    TFieldName extends rhf.FieldPathByValue<FormInput, Array<any>>
  >({
    control,
    name,
    defaultValue,
    rules,
    shouldUnregister,
    disabled,

    value,
    onChange,
    ...props
  }: CheckboxGroupProps<TFieldName>) {
    return (
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={rules}
        shouldUnregister={shouldUnregister}
        disabled={disabled}
        render={({ field, fieldState }) => {
          const mergeRef = useMergedRef(field.ref, props.ref);
          return (
            <m.Checkbox.Group
              ref={mergeRef}
              value={
                typeof value === "function" ? value(field.value) : field.value
              }
              error={fieldState.error?.message}
              disabled={field.disabled}
              {...props}
              onChange={(e) => {
                const _ = onChange?.(e);
                field.onChange(_ !== undefined ? _ : e);
              }}
              onBlur={(e) => {
                field.onBlur();
                props.onBlur?.(e);
              }}
            />
          );
        }}
      />
    );
  }

  interface SwitchProps<
    TName extends rhf.FieldPathByValue<FormInput, boolean>,
    TValue = rhf.FieldPathValue<FormInput, TName>
  > extends Omit<React.ComponentProps<typeof m.Switch>, ControlledKeys>,
      UseControllerProps<TName> {
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void | TValue;
  }
  function Switch<TName extends rhf.FieldPathByValue<FormInput, boolean>>({
    control,
    name,
    defaultValue,
    rules,
    shouldUnregister,
    disabled,
    ...props
  }: SwitchProps<TName>) {
    return (
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={rules}
        shouldUnregister={shouldUnregister}
        disabled={disabled}
        render={({ field, fieldState }) => {
          const mergeRef = useMergedRef(field.ref, props.ref);
          return (
            <m.Switch
              ref={mergeRef}
              name={field.name}
              checked={field.value ?? false}
              disabled={field.disabled}
              error={fieldState.error?.message}
              {...props}
              onChange={(e) => {
                const _ = props.onChange?.(e);
                field.onChange(_ !== undefined ? _ : e);
              }}
              onBlur={(e) => {
                field.onBlur();
                props.onBlur?.(e);
              }}
            />
          );
        }}
      />
    );
  }

  type SwitchGroupProps<
    TName extends rhf.FieldPathByValue<FormInput, Array<any>>
  > = Omit<React.ComponentProps<typeof m.SwitchGroup>, ControlledKeys> &
    UseControllerProps<TName> &
    ArrayValueProps<rhf.FieldPathValue<FormInput, TName>>;
  function SwitchGroup<
    TName extends rhf.FieldPathByValue<FormInput, Array<any>>
  >({
    control,
    name,
    defaultValue,
    rules,
    shouldUnregister,
    disabled,

    value,
    onChange,
    ...props
  }: SwitchGroupProps<TName>) {
    return (
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={rules}
        shouldUnregister={shouldUnregister}
        disabled={disabled}
        render={({ field, fieldState }) => {
          const mergeRef = useMergedRef(field.ref, props.ref);
          return (
            <m.Switch.Group
              ref={mergeRef}
              value={
                typeof value === "function" ? value(field.value) : field.value
              }
              error={fieldState.error?.message}
              disabled={field.disabled}
              {...props}
              onChange={(e) => {
                const _ = onChange?.(e);
                field.onChange(_ ?? e);
              }}
              onBlur={(e) => {
                field.onBlur();
                props.onBlur?.(e);
              }}
            />
          );
        }}
      />
    );
  }

  interface RadioProps<
    TName extends rhf.FieldPathByValue<FormInput, boolean>,
    TValue = rhf.FieldPathValue<FormInput, TName>
  > extends Omit<React.ComponentProps<typeof m.Radio>, ControlledKeys>,
      UseControllerProps<TName> {
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void | TValue;
  }
  function Radio<TName extends rhf.FieldPathByValue<FormInput, boolean>>({
    control,
    name,
    defaultValue,
    rules,
    shouldUnregister,
    disabled,
    ...props
  }: RadioProps<TName>) {
    return (
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={rules}
        shouldUnregister={shouldUnregister}
        disabled={disabled}
        render={({ field, fieldState }) => {
          const mergeRef = useMergedRef(field.ref, props.ref);
          return (
            <m.Radio
              ref={mergeRef}
              name={field.name}
              checked={field.value ?? false}
              disabled={field.disabled}
              error={fieldState.error?.message}
              {...props}
              onChange={(e) => {
                const _ = props.onChange?.(e);
                field.onChange(_ !== undefined ? _ : e);
              }}
              onBlur={(e) => {
                field.onBlur();
                props.onBlur?.(e);
              }}
            />
          );
        }}
      />
    );
  }

  interface RadioGroupProps<
    TName extends rhf.FieldPathByValue<FormInput, string>,
    TValue = rhf.FieldPathValue<FormInput, TName>
  > extends Omit<React.ComponentProps<typeof m.RadioGroup>, ControlledKeys>,
      UseControllerProps<TName> {
    onChange?: (value: string) => void | TValue;
  }
  function RadioGroup<TName extends rhf.FieldPathByValue<FormInput, string>>({
    control,
    name,
    defaultValue,
    rules,
    shouldUnregister,
    disabled,
    ...props
  }: RadioGroupProps<TName>) {
    return (
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={rules}
        shouldUnregister={shouldUnregister}
        disabled={disabled}
        render={({ field, fieldState }) => {
          const mergeRef = useMergedRef(field.ref, props.ref);
          return (
            <m.Radio.Group
              ref={mergeRef}
              name={field.name}
              value={field.value}
              error={fieldState.error?.message}
              {...props}
              onChange={(e) => {
                const _ = props.onChange?.(e);
                field.onChange(_ !== undefined ? _ : e);
              }}
              onBlur={(e) => {
                field.onBlur();
                props.onBlur?.(e);
              }}
            />
          );
        }}
      />
    );
  }

  type SelectProps<
    TName extends rhf.FieldPathByValue<
      FormInput,
      string | (Record<string, any> | null)
    >
  > = Omit<React.ComponentProps<typeof m.Select>, ControlledKeys> &
    UseControllerProps<TName> &
    RecordValueProps<rhf.FieldPathValue<FormInput, TName>>;
  function Select<
    TName extends rhf.FieldPathByValue<
      FormInput,
      string | (Record<string, any> | null)
    >
  >({
    control,
    name,
    defaultValue,
    rules,
    shouldUnregister,
    disabled,

    value,
    onChange,
    ...props
  }: SelectProps<TName>) {
    return (
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue as rhf.FieldPathValue<FormInput, TName>}
        rules={rules}
        shouldUnregister={shouldUnregister}
        disabled={disabled}
        render={({ field, fieldState }) => {
          const mergeRef = useMergedRef(field.ref, props.ref);
          return (
            <m.Select
              ref={mergeRef}
              name={field.name}
              value={
                typeof value === "function" ? value(field.value) : field.value
              }
              error={fieldState.error?.message}
              disabled={field.disabled}
              {...props}
              onChange={(e) => {
                const _ = onChange?.(e);
                field.onChange(_ ?? e);
              }}
              onBlur={(e) => {
                field.onBlur();
                props.onBlur?.(e);
              }}
            />
          );
        }}
      />
    );
  }

  type MultiSelectProps<
    TName extends rhf.FieldPathByValue<FormInput, Array<any>>
  > = Omit<React.ComponentProps<typeof MultiSelectWithChips>, ControlledKeys> &
    UseControllerProps<TName> &
    ArrayValueProps<rhf.FieldPathValue<FormInput, TName>>;
  function MultiSelect<
    TName extends rhf.FieldPathByValue<FormInput, Array<any>>
  >({
    control,
    name,
    defaultValue,
    rules,
    shouldUnregister,
    disabled,

    value,
    onChange,
    ...props
  }: MultiSelectProps<TName>) {
    return (
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={rules}
        shouldUnregister={shouldUnregister}
        disabled={disabled}
        render={({ field, fieldState }) => {
          const mergeRef = useMergedRef(field.ref, props.ref);
          return (
            <MultiSelectWithChips
              ref={mergeRef}
              name={field.name}
              value={
                typeof value === "function" ? value(field.value) : field.value
              }
              error={fieldState.error?.message}
              disabled={field.disabled}
              {...props}
              onChange={(e) => {
                const _ = onChange?.(e);
                field.onChange(_ ?? e);
              }}
              onBlur={(e) => {
                field.onBlur();
                props.onBlur?.(e);
              }}
            />
          );
        }}
      />
    );
  }

  interface DatePickerProps<
    TName extends rhf.FieldPathByValue<FormInput, Date | null>,
    TValue = rhf.FieldPathValue<FormInput, TName>
  > extends Omit<DatePickerInputProps<"default">, ControlledKeys | "type">,
      UseControllerProps<TName> {
    ref?: React.Ref<HTMLButtonElement>;
    onChange?: (value: Date | null) => void | TValue;
  }
  function DatePicker<
    TName extends rhf.FieldPathByValue<FormInput, Date | null>
  >({
    control,
    name,
    defaultValue,
    rules,
    shouldUnregister,
    disabled,
    ...props
  }: DatePickerProps<TName>) {
    return (
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={rules}
        shouldUnregister={shouldUnregister}
        disabled={disabled}
        render={({ field, fieldState }) => {
          const mergedRef = useMergedRef(field.ref, props.ref);
          return (
            <DatePickerInput
              type="default"
              ref={mergedRef}
              name={field.name}
              value={field.value ?? null}
              error={fieldState.error?.message}
              disabled={field.disabled}
              {...props}
              onChange={(e) => {
                const _ = props.onChange?.(e);
                field.onChange(_ !== undefined ? _ : e);
              }}
              onBlur={field.onBlur}
            />
          );
        }}
      />
    );
  }

  interface DateRangePickerProps<
    TName extends rhf.FieldPathByValue<FormInput, [Date | null, Date | null]>,
    TValue = rhf.FieldPathValue<FormInput, TName>
  > extends Omit<DatePickerInputProps<"range">, ControlledKeys | "type">,
      UseControllerProps<TName> {
    ref?: React.Ref<HTMLButtonElement>;
    onChange?: (value: [Date | null, Date | null]) => void | TValue;
  }
  function DateRangePicker<
    TName extends rhf.FieldPathByValue<FormInput, [Date | null, Date | null]>
  >({
    control,
    name,
    defaultValue,
    rules,
    shouldUnregister,
    disabled,
    ...props
  }: DateRangePickerProps<TName>) {
    return (
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={rules}
        shouldUnregister={shouldUnregister}
        disabled={disabled}
        render={({ field, fieldState }) => {
          const mergedRef = useMergedRef(field.ref, props.ref);
          return (
            <DatePickerInput
              type="range"
              ref={mergedRef}
              name={field.name}
              value={[field.value[0] ?? null, field.value[1] ?? null]}
              error={fieldState.error?.message}
              disabled={field.disabled}
              {...props}
              onChange={(e) => {
                const _ = props.onChange?.(e);
                field.onChange(_ !== undefined ? _ : e);
              }}
              onBlur={field.onBlur}
            />
          );
        }}
      />
    );
  }

  return {
    useForm,
    useController,
    useFieldArray,
    useFormContext,
    useFormState,
    useWatch,
    Controller,
    FormProvider,
    TextInput,
    NumberInput,
    Checkbox,
    CheckboxGroup,
    Switch,
    SwitchGroup,
    Radio,
    RadioGroup,
    Select,
    MultiSelect,
    DatePicker,
    DateRangePicker,
    _input: undefined as unknown as FormInput,
    _output: undefined as unknown as FormOutput,
  };
}
