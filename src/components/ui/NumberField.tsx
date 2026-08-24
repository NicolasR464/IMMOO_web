'use client';

import {
  Button as ButtonPrimitive,
  Group,
  Input,
  Label,
  NumberField as NumberFieldPrimitive,
  type NumberFieldProps as NumberFieldPrimitiveProps,
  Text,
} from 'react-aria-components';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NumberFieldProps extends NumberFieldPrimitiveProps {
  label?: string;
  description?: string;
  errorMessage?: string;
}

const NumberField = ({
  label,
  description,
  errorMessage,
  className,
  formatOptions,
  ...props
}: NumberFieldProps) => {
  return (
    <NumberFieldPrimitive
      formatOptions={formatOptions}
      className={cn('space-y-2', className)}
      {...props}
    >
      {label && (
        <Label className="text-sm font-semibold text-slate-300 block">
          {label}
        </Label>
      )}

      <Group className="flex items-center h-11 rounded-xl bg-slate-950 border border-slate-800 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 overflow-hidden transition-all">
        <Input className="w-full bg-transparent text-base px-3.5 py-2 text-indigo-400 font-bold focus:outline-none placeholder:text-slate-600 placeholder:font-normal" />
        <div className="flex h-full border-l border-slate-800 bg-slate-900/60 shrink-0">
          <ButtonPrimitive
            slot="decrement"
            className="w-9 h-full flex items-center justify-center border-r border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80 active:bg-slate-700 transition cursor-pointer focus:outline-none"
          >
            <Minus size={14} />
          </ButtonPrimitive>
          <ButtonPrimitive
            slot="increment"
            className="w-9 h-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/80 active:bg-slate-700 transition cursor-pointer focus:outline-none"
          >
            <Plus size={14} />
          </ButtonPrimitive>
        </div>
      </Group>

      {description && (
        <Text slot="description" className="text-xs text-slate-500">
          {description}
        </Text>
      )}
    </NumberFieldPrimitive>
  );
};

export { NumberField };