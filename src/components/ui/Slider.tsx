'use client';

import React from 'react';
import {
  Label,
  Slider as RACSlider,
  SliderOutput,
  SliderThumb,
  SliderTrack,
  type SliderProps as RACSliderProps,
} from 'react-aria-components';
import { cn } from '@/lib/utils';

interface SliderProps<T> extends RACSliderProps<T> {
  label?: string;
  thumbLabels?: string[];
  formatValue?: (value: T) => string;
}

export function Slider<T extends number | number[]>({
  label,
  thumbLabels = ['start', 'end'],
  formatValue,
  className,
  ...props
}: SliderProps<T>) {
  return (
    <RACSlider {...props} className={cn('space-y-3 w-full', className)}>
      <div className="flex justify-between items-center">
        {label && (
          <Label className="text-sm font-semibold text-slate-300">
            {label}
          </Label>
        )}
        <SliderOutput className="text-sm font-bold text-indigo-400">
          {({ state }) =>
            formatValue
              ? formatValue(state.values as T)
              : state.values.map((v) => v.toLocaleString()).join(' – ')
          }
        </SliderOutput>
      </div>

      {/* Track wrapper */}
      <div className="relative py-3 w-full">
        <SliderTrack className="relative w-full h-2 bg-slate-800 rounded-full cursor-pointer">
          {({ state }) => {
            const isRange = state.values.length > 1;
            const start = isRange ? state.getThumbPercent(0) * 100 : 0;
            const end = isRange
              ? state.getThumbPercent(1) * 100
              : state.getThumbPercent(0) * 100;

            return (
              <>
                {/* Active range bar */}
                <div
                  className="absolute h-full bg-indigo-500 rounded-full"
                  style={{
                    left: `${start}%`,
                    width: `${end - start}%`,
                  }}
                />

                {/* Thumbs with forced inline style override */}
                {state.values.map((_, i) => (
                  <SliderThumb
                    key={i}
                    index={i}
                    aria-label={thumbLabels[i] || `Thumb ${i + 1}`}
                    className="absolute !top-1/2 w-5 h-5 bg-indigo-400 rounded-full focus:outline-none data-[focused]:ring-4 data-[focused]:ring-indigo-500/30 cursor-grab active:cursor-grabbing border-2 border-slate-950 shadow-md transition-shadow"
                  />
                ))}
              </>
            );
          }}
        </SliderTrack>
      </div>
    </RACSlider>
  );
}