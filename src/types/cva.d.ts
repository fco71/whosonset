declare module 'class-variance-authority' {
  import * as React from 'react';

  type ClassValue = string | number | boolean | undefined | null | Record<string, boolean>;

  type ClassProp = {
    class?: string;
    className?: string;
    [key: `class:${string}`]: string | boolean;
  };

  type ClassPropKey = keyof ClassProp;
  type ClassPropValue = ClassProp[ClassPropKey];

  type ConfigSchemaType<T> = {
    variants: {
      [Name in keyof T]: {
        [Variant: string]: ClassValue;
      };
    };
    defaultVariants?: {
      [Name in keyof T]?: keyof T[Name] | undefined;
    };
    compoundVariants?: Array<
      {
        [Name in keyof T]?: keyof T[Name] | undefined;
      } & {
        class: ClassValue;
      }
    >;
  };

  type ConfigVariants<T> = ConfigSchemaType<T>['variants'];
  type ConfigVariantsMulti<T> = {
    [Name in keyof T]: T[Name] extends object ? keyof T[Name] : never;
  };

  type ConfigVariantsSingle<T> = {
    [Name in keyof T]?: T[Name] extends object ? keyof T[Name] : never;
  };

  type ConfigVariantsMultiRequired<T> = {
    [Name in keyof T]-?: T[Name] extends object ? keyof T[Name] : never;
  };

  type ConfigVariantsMultiValue<T> = {
    [Name in keyof T]?: T[Name] extends object ? keyof T[Name] | undefined : never;
  };

  type ConfigVariantsMultiRequiredValue<T> = {
    [Name in keyof T]-?: T[Name] extends object ? keyof T[Name] : never;
  };

  type VariantProps<T> = ConfigVariantsMultiValue<ConfigVariants<T>>;

  type VariantPropsWithRequired<T, RequiredKeys extends keyof T> = Omit<
    VariantProps<T>,
    RequiredKeys
  > &
    Required<Pick<VariantProps<T>, RequiredKeys>>;

  type VariantPropsWithDefaults<T> = {
    [K in keyof T]?: T[K] | undefined;
  };

  type VariantPropsWithRequiredAndDefaults<T, RequiredKeys extends keyof T> = Omit<
    VariantPropsWithDefaults<T>,
    RequiredKeys
  > &
    Required<Pick<VariantPropsWithDefaults<T>, RequiredKeys>>;

  type VariantPropsWithRequiredAndOptional<
    T,
    RequiredKeys extends keyof T,
    OptionalKeys extends keyof T = never
  > = Omit<VariantPropsWithRequired<T, RequiredKeys>, OptionalKeys> &
    Partial<Pick<VariantPropsWithRequired<T, RequiredKeys>, OptionalKeys>>;

  export function cva<T extends ConfigSchemaType<T>>(
    base?: ClassValue,
    config?: T
  ): (
    props?: VariantProps<ConfigVariants<T>> & {
      class?: ClassValue;
      className?: ClassValue;
      [key: `class:${string}`]: ClassValue;
    }
  ) => string;

  export function cva<T extends ConfigSchemaType<T>, RequiredKeys extends keyof T>(
    base: ClassValue,
    config: T,
    requiredKeys: RequiredKeys[]
  ): (
    props: VariantPropsWithRequired<ConfigVariants<T>, RequiredKeys> & {
      class?: ClassValue;
      className?: ClassValue;
      [key: `class:${string}`]: ClassValue;
    }
  ) => string;

  export function cva<T extends ConfigSchemaType<T>>(
    base: ClassValue,
    config: T,
    requiredKeys: (keyof T)[]
  ): (
    props: VariantProps<ConfigVariants<T>> & {
      class?: ClassValue;
      className?: ClassValue;
      [key: `class:${string}`]: ClassValue;
    }
  ) => string;

  export function cva<T extends ConfigSchemaType<T>>(
    base: ClassValue,
    config: T,
    requiredKeys: (keyof T)[]
  ): (
    props: VariantProps<ConfigVariants<T>> & {
      class?: ClassValue;
      className?: ClassValue;
      [key: `class:${string}`]: ClassValue;
    }
  ) => string;

  export default cva;
}
