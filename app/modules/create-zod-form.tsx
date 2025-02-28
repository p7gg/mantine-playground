import { zodResolver } from "@hookform/resolvers/zod";
import { useMergedRef } from "@mantine/hooks";
import * as m from "@mantine/core";
import React from "react";
import { z } from "zod";
import { MultiSelectWithChips as BaseMultiSelectWithChips } from "~/components/multi-select-with-chips";
import * as rhf from "react-hook-form";

export function createZodForm<TSchema extends z.ZodType>(
  schema: TSchema,
  schemaOptions?: Partial<z.ParseParams>,
  {
    raw = true,
    mode,
  }: {
    mode?: "async" | "sync";
    raw?: boolean;
  } = {}
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

  type Control = rhf.Control<FormInput>;
  type ControlledKeys = "value" | keyof rhf.UseControllerProps<FormInput, any>;
  type Rules<TFieldName extends rhf.FieldPath<FormInput>> = Omit<
    rhf.RegisterOptions<FormInput, TFieldName>,
    "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"
  >;
  type ZodControllerValue<T> = T extends Array<string>
    ? {
        value?: T;
        onChange?: (value: T) => void;
      }
    : T extends Array<any>
    ? {
        value: (value: T) => Array<string>;
        onChange: (value: Array<string>) => T;
      }
    : never;

  interface TextInputProps<
    TFieldName extends rhf.FieldPathByValue<FormInput, string>
  > extends Omit<m.TextInputProps, ControlledKeys> {
    ref?: React.Ref<HTMLInputElement>;

    name: TFieldName;
    control?: Control;
    defaultValue?: rhf.FieldPathValue<FormInput, TFieldName>;
    shouldUnregister?: boolean;
    disabled?: boolean;
    rules?: Rules<TFieldName>;
  }
  function TextInput<
    TFieldName extends rhf.FieldPathByValue<FormInput, string>
  >({
    control,
    name,
    defaultValue,
    rules,
    shouldUnregister,
    disabled,
    ...props
  }: TextInputProps<TFieldName>) {
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
              value={field.value}
              disabled={field.disabled}
              error={fieldState.error?.message}
              onChange={(e) => {
                field.onChange(e);
                props.onChange?.(e);
              }}
              onBlur={(e) => {
                field.onBlur();
                props.onBlur?.(e);
              }}
              {...props}
            />
          );
        }}
      />
    );
  }

  type NumberInputProps<
    TFieldName extends rhf.FieldPathByValue<FormInput, number>
  > = Omit<m.NumberInputProps, ControlledKeys> & {
    ref?: React.Ref<HTMLInputElement>;

    name: TFieldName;
    control?: Control;
    defaultValue?: rhf.FieldPathValue<FormInput, TFieldName> | "";
    shouldUnregister?: boolean;
    disabled?: boolean;
    rules?: Rules<TFieldName>;
  };
  function NumberInput<
    TFieldName extends rhf.FieldPathByValue<FormInput, number>
  >({
    control,
    name,
    defaultValue,
    rules,
    shouldUnregister,
    disabled,
    ...props
  }: NumberInputProps<TFieldName>) {
    return (
      <Controller
        control={control}
        name={name}
        defaultValue={
          defaultValue as rhf.FieldPathValue<FormInput, TFieldName> | undefined
        }
        rules={rules}
        shouldUnregister={shouldUnregister}
        disabled={disabled}
        render={({ field, fieldState }) => {
          const mergeRef = useMergedRef(field.ref, props.ref);
          return (
            <m.NumberInput
              ref={mergeRef}
              name={field.name}
              value={field.value}
              disabled={field.disabled}
              error={fieldState.error?.message}
              onChange={(e) => {
                field.onChange(e);
                props.onChange?.(e);
              }}
              onBlur={(e) => {
                field.onBlur();
                props.onBlur?.(e);
              }}
              {...props}
            />
          );
        }}
      />
    );
  }

  type CheckboxProps<
    TFieldName extends rhf.FieldPathByValue<FormInput, boolean>
  > = Omit<m.CheckboxProps, ControlledKeys> & {
    ref?: React.Ref<HTMLInputElement>;
    name: TFieldName;
    defaultValue?: rhf.FieldPathValue<FormInput, TFieldName>;
    control?: Control;
    shouldUnregister?: boolean;
    disabled?: boolean;
    rules?: Rules<TFieldName>;
  };
  function Checkbox<
    TFieldName extends rhf.FieldPathByValue<FormInput, boolean>
  >({
    control,
    name,
    defaultValue,
    rules,
    shouldUnregister,
    disabled,
    ...props
  }: CheckboxProps<TFieldName>) {
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
              checked={field.value}
              disabled={field.disabled}
              error={fieldState.error?.message}
              onChange={(e) => {
                field.onChange(e);
                props.onChange?.(e);
              }}
              onBlur={(e) => {
                field.onBlur();
                props.onBlur?.(e);
              }}
              {...props}
            />
          );
        }}
      />
    );
  }

  type CheckboxGroupProps<
    TFieldName extends rhf.FieldPathByValue<FormInput, Array<any>>
  > = Omit<m.CheckboxGroupProps, ControlledKeys> &
    ZodControllerValue<rhf.FieldPathValue<FormInput, TFieldName>> & {
      ref?: React.Ref<HTMLInputElement>;
      name: TFieldName;
      defaultValue?: rhf.FieldPathValue<FormInput, TFieldName>;
      control?: Control;
      shouldUnregister?: boolean;
      disabled?: boolean;
      rules?: Rules<TFieldName>;
    };
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
              onChange={(e) => {
                const _ = onChange?.(e);
                field.onChange(_ ?? e);
              }}
              onBlur={(e) => {
                field.onBlur();
                props.onBlur?.(e);
              }}
              {...props}
            />
          );
        }}
      />
    );
  }

  type SwitchProps<
    TFieldName extends rhf.FieldPathByValue<FormInput, boolean>
  > = Omit<m.SwitchProps, ControlledKeys> & {
    ref?: React.Ref<HTMLInputElement>;
    name: TFieldName;
    defaultValue?: rhf.FieldPathValue<FormInput, TFieldName>;
    control?: Control;
    shouldUnregister?: boolean;
    disabled?: boolean;
    rules?: Rules<TFieldName>;
  };
  function Switch<TFieldName extends rhf.FieldPathByValue<FormInput, boolean>>({
    control,
    name,
    defaultValue,
    rules,
    shouldUnregister,
    disabled,
    ...props
  }: SwitchProps<TFieldName>) {
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
              checked={field.value}
              disabled={field.disabled}
              error={fieldState.error?.message}
              onChange={(e) => {
                field.onChange(e);
                props.onChange?.(e);
              }}
              onBlur={(e) => {
                field.onBlur();
                props.onBlur?.(e);
              }}
              {...props}
            />
          );
        }}
      />
    );
  }

  type SwitchGroupProps<
    TFieldName extends rhf.FieldPathByValue<FormInput, Array<any>>
  > = Omit<m.SwitchGroupProps, ControlledKeys> &
    ZodControllerValue<rhf.FieldPathValue<FormInput, TFieldName>> & {
      ref?: React.Ref<HTMLInputElement>;
      name: TFieldName;
      defaultValue?: rhf.FieldPathValue<FormInput, TFieldName>;
      control?: Control;
      shouldUnregister?: boolean;
      disabled?: boolean;
      rules?: Rules<TFieldName>;
    };
  function SwitchGroup<
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
  }: SwitchGroupProps<TFieldName>) {
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
              onChange={(e) => {
                const _ = onChange?.(e);
                field.onChange(_ ?? e);
              }}
              onBlur={(e) => {
                field.onBlur();
                props.onBlur?.(e);
              }}
              {...props}
            />
          );
        }}
      />
    );
  }

  type SelectProps<
    TFieldName extends rhf.FieldPathByValue<
      FormInput,
      string | Record<string, any>
    >
  > = Omit<m.SelectProps, ControlledKeys | "onChange"> &
    (rhf.FieldPathValue<FormInput, TFieldName> extends string
      ? { value?: never; onChange?: (value: string | null) => void }
      : {
          value: (
            value: rhf.FieldPathValue<FormInput, TFieldName>
          ) => string | null;
          onChange: (
            value: string | null
          ) => rhf.FieldPathValue<FormInput, TFieldName>;
        }) & {
      ref?: React.Ref<HTMLInputElement>;
      name: TFieldName;
      defaultValue?: rhf.FieldPathValue<FormInput, TFieldName> | null;
      control?: Control;
      shouldUnregister?: boolean;
      disabled?: boolean;
      rules?: Rules<TFieldName>;
    };
  function Select<
    TFieldName extends rhf.FieldPathByValue<
      FormInput,
      string | Record<string, any>
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
  }: SelectProps<TFieldName>) {
    return (
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue as rhf.FieldPathValue<FormInput, TFieldName>}
        rules={rules}
        shouldUnregister={shouldUnregister}
        disabled={disabled}
        render={({ field, fieldState }) => {
          const mergeRef = useMergedRef(field.ref, props.ref);
          return (
            <m.Select
              ref={mergeRef}
              value={
                typeof value === "function" ? value(field.value) : field.value
              }
              error={fieldState.error?.message}
              onChange={(e) => {
                const _ = onChange?.(e);
                field.onChange(_ ?? e);
              }}
              onBlur={(e) => {
                field.onBlur();
                props.onBlur?.(e);
              }}
              {...props}
            />
          );
        }}
      />
    );
  }

  type MultiSelectProps<
    TFieldName extends rhf.FieldPathByValue<FormInput, Array<any>>
  > = Omit<m.MultiSelectProps, ControlledKeys> &
    ZodControllerValue<rhf.FieldPathValue<FormInput, TFieldName>> & {
      ref?: React.Ref<HTMLInputElement>;
      name: TFieldName;
      defaultValue?: rhf.FieldPathValue<FormInput, TFieldName>;
      control?: Control;
      shouldUnregister?: boolean;
      disabled?: boolean;
      rules?: Rules<TFieldName>;
    };
  function MultiSelect<
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
  }: MultiSelectProps<TFieldName>) {
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
            <m.MultiSelect
              ref={mergeRef}
              value={
                typeof value === "function" ? value(field.value) : field.value
              }
              error={fieldState.error?.message}
              onChange={(e) => {
                const _ = onChange?.(e);
                field.onChange(_ ?? e);
              }}
              onBlur={(e) => {
                field.onBlur();
                props.onBlur?.(e);
              }}
              {...props}
            />
          );
        }}
      />
    );
  }

  type MultiSelectWithChipsProps<
    TFieldName extends rhf.FieldPathByValue<FormInput, Array<any>>
  > = Omit<m.MultiSelectProps, ControlledKeys> &
    ZodControllerValue<rhf.FieldPathValue<FormInput, TFieldName>> & {
      ref?: React.Ref<HTMLInputElement>;
      name: TFieldName;
      defaultValue?: rhf.FieldPathValue<FormInput, TFieldName>;
      control?: Control;
      shouldUnregister?: boolean;
      disabled?: boolean;
      rules?: Rules<TFieldName>;
    };
  function MultiSelectWithChips<
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
  }: MultiSelectProps<TFieldName>) {
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
            <BaseMultiSelectWithChips
              ref={mergeRef}
              value={
                typeof value === "function" ? value(field.value) : field.value
              }
              error={fieldState.error?.message}
              onChange={(e) => {
                const _ = onChange?.(e);
                field.onChange(_ ?? e);
              }}
              onBlur={(e) => {
                field.onBlur();
                props.onBlur?.(e);
              }}
              {...props}
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
    Select,
    MultiSelect,
    MultiSelectWithChips,
    _input: undefined as FormInput,
    _output: undefined as FormOutput,
  };
}
