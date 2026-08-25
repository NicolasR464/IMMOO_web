'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ky from 'ky';
import {
  Button as RACButton,
  Input,
  Label,
  Separator,
  Tag,
  TagGroup,
  TagList,
  TextField,
} from 'react-aria-components';
import { AlertCircle, CheckCircle2, ExternalLink, Loader2, Play, Plus, X } from 'lucide-react';
import { NumberField } from '@/components/ui/NumberField';
import { Slider } from '@/components/ui/Slider';
import { sliderToPrice } from '@/utils/slider';
import { endpoints } from '@/utils/constants';

const Home = () => {
  const [locations, setLocations] = useState<{ id: string; name: string }[]>([]);
  const [newLocation, setNewLocation] = useState('');
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);

  // Use undefined so 0 is not hardcoded into input values
  const [minSurface, setMinSurface] = useState<number | undefined>(undefined);
  const [minRooms, setMinRooms] = useState<number | undefined>(undefined);
  const [minBedrooms, setMinBedrooms] = useState<number | undefined>(undefined);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleBedroomsChange = (val: number) => {
    const newBedrooms = isNaN(val) ? undefined : val;
    setMinBedrooms(newBedrooms);

    if (newBedrooms !== undefined && (minRooms === undefined || newBedrooms > minRooms)) {
      setMinRooms(newBedrooms);
    }
  };

  const handleRoomsChange = (val: number) => {
    const newRooms = isNaN(val) ? undefined : val;
    setMinRooms(newRooms);
  };

  const handleAddLocation = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (newLocation.trim()) {
      setLocations((prev) => [
        ...prev,
        { id: Date.now().toString(), name: newLocation.trim() },
      ]);
      setNewLocation('');
    }
  };

  const handleRemoveLocation = (id: string) => {
    setLocations((prev) => prev.filter((loc) => loc.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      handleAddLocation();
    }
  };

  // Validation logic
  const roomsVal = minRooms ?? 0;
  const bedroomsVal = minBedrooms ?? 0;
  const isInvalidRoomCount = roomsVal > 0 && bedroomsVal > roomsVal;

  const handleRunPipeline = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Guard: Block execution if room validation fails
    if (isInvalidRoomCount) {
      setIsError(true);
      setStatus('Total rooms cannot be fewer than bedrooms.');
      return;
    }

    // Auto-commit pending text in the input box
    let finalLocations = locations.map((loc) => loc.name);
    if (newLocation.trim()) {
      const pendingLoc = newLocation.trim();
      finalLocations = [...finalLocations, pendingLoc];
      setLocations((prev) => [...prev, { id: Date.now().toString(), name: pendingLoc }]);
      setNewLocation('');
    }

    if (finalLocations.length === 0) {
      setIsError(true);
      setStatus('Please enter at least one target location.');
      return;
    }

    setLoading(true);
    setIsError(false);
    setStatus('Triggering search pipeline...');

    const minPrice = sliderToPrice(priceRange[0]);
    const maxPrice = sliderToPrice(priceRange[1]);

    const payload = {
      locations: finalLocations,
      minPrice,
      maxPrice,
      minSpace: minSurface ?? 0,
      minRooms: roomsVal,
      minBedrooms: bedroomsVal,
    };

    ky.post(endpoints.internal.SCRAPE, {
      json: payload,
      timeout: 60000,
    })
      .json<{ status: string; message: string }>()
      .then((response) => {
        setLoading(false);
        if (response.status === 'success') {
          setIsError(false);
          setStatus(response.message || 'Property search completed successfully!');
        } else {
          setIsError(true);
          setStatus(response.message || 'Search pipeline returned an unexpected status.');
        }
      })
      .catch((err: Error) => {
        setLoading(false);
        setIsError(true);
        setStatus(err?.message || 'Failed to communicate with the search server.');
      });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center p-6 sm:p-12 font-sans">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header Logo */}
        <div className="w-full flex justify-center pt-2">
          <Image
            src="/logo_immoo_txt.png"
            alt="IMMOO Logo"
            width={600}
            height={150}
            className="w-full h-auto object-contain brightness-0 invert opacity-95"
            priority
          />
        </div>

        <Separator />

        {/* Subheader */}
        <div className="flex justify-between items-center pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Search Control Center
            </h1>
          </div>
          <a
            href="https://docs.google.com/spreadsheets"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-800 px-3.5 py-2 rounded-full hover:bg-emerald-900/50 transition"
          >
            Google Sheet <ExternalLink size={14} />
          </a>
        </div>

        {/* Form Container */}
        <form onSubmit={handleRunPipeline} className="space-y-6">
          {/* Target Locations */}
          <div className="space-y-3">
            <Label className="text-sm font-bold uppercase tracking-wider text-slate-300 block">
              Target Locations
            </Label>

            {locations.length > 0 && (
              <TagGroup aria-label="Target Locations">
                <TagList className="flex flex-wrap gap-2 mb-3">
                  {locations.map((loc) => (
                    <Tag
                      key={loc.id}
                      id={loc.id}
                      className="inline-flex items-center gap-2 text-sm font-medium bg-indigo-950/80 text-indigo-200 border border-indigo-800 px-3 py-1.5 rounded-lg hover:bg-indigo-900 transition cursor-default"
                    >
                      <span>{loc.name}</span>
                      <RACButton
                        slot="remove"
                        onPress={() => handleRemoveLocation(loc.id)}
                        aria-label={`Remove ${loc.name}`}
                        className="text-indigo-400 hover:text-white transition cursor-pointer focus:outline-none"
                      >
                        <X size={14} />
                      </RACButton>
                    </Tag>
                  ))}
                </TagList>
              </TagGroup>
            )}

            <div className="flex gap-2">
              <TextField
                aria-label="New target location input"
                value={newLocation}
                onChange={setNewLocation}
                className="flex-1"
              >
                <Input
                  onKeyDown={handleKeyDown}
                  placeholder="Enter city or zip code (Press Enter to add)..."
                  className="w-full bg-slate-900 border border-slate-800 text-base px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-100 placeholder:text-slate-500 transition"
                />
              </TextField>

              <RACButton
                onPress={() => handleAddLocation()}
                className="bg-slate-900 hover:bg-indigo-600 border border-slate-800 hover:border-indigo-500 px-5 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:text-white transition flex items-center gap-1.5 cursor-pointer focus:outline-none"
              >
                <Plus size={16} /> Add
              </RACButton>
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="bg-slate-900/60 p-5 border border-slate-800 rounded-2xl">
            <Slider<number[]>
              label="Price Range"
              value={priceRange}
              onChange={(val) => setPriceRange(val)}
              minValue={0}
              maxValue={100}
              step={1}
              thumbLabels={['Min Price', 'Max Price']}
              formatValue={(vals) =>
                `€${sliderToPrice(vals[0]).toLocaleString()} – €${sliderToPrice(vals[1]).toLocaleString()}`
              }
            />
          </div>

          {/* Stepper Inputs */}
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <NumberField
                label="Min Surface (m²)"
                value={minSurface}
                onChange={(val) => setMinSurface(isNaN(val) ? undefined : val)}
                minValue={0}
                maxValue={1000}
                placeholder="0"
                formatOptions={{ style: 'decimal' }}
              />

              <NumberField
                label="Min Rooms"
                value={minRooms}
                onChange={handleRoomsChange}
                minValue={0}
                maxValue={20}
                placeholder="0"
                formatOptions={{ style: 'decimal' }}
              />

              <NumberField
                label="Min Bedrooms"
                value={minBedrooms}
                onChange={handleBedroomsChange}
                minValue={0}
                maxValue={10}
                placeholder="0"
                formatOptions={{ style: 'decimal' }}
              />
            </div>

            {isInvalidRoomCount && (
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 bg-rose-950/40 border border-rose-900/60 p-3 rounded-xl">
                <AlertCircle size={14} />
                <span>Total rooms cannot be fewer than bedrooms.</span>
              </div>
            )}
          </div>

          {/* Status Banner */}
          {status && (
            <div
              className={`flex items-center gap-3 p-4 border text-sm font-medium rounded-xl transition-all ${
                isError
                  ? 'bg-rose-950/40 border-rose-900/80 text-rose-200'
                  : 'bg-emerald-950/40 border-emerald-900/80 text-emerald-200'
              }`}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin text-indigo-400" />
              ) : isError ? (
                <AlertCircle size={18} className="text-rose-400" />
              ) : (
                <CheckCircle2 size={18} className="text-emerald-400" />
              )}
              <span>{status}</span>
            </div>
          )}

          {/* Submit Action Button */}
          <RACButton
            type="submit"
            isDisabled={loading || isInvalidRoomCount}
            className="w-full bg-indigo-600 hover:bg-indigo-500 data-[disabled]:bg-slate-800 data-[disabled]:text-slate-500 data-[disabled]:cursor-not-allowed text-white font-bold text-base py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-[0.99] cursor-pointer focus:outline-none"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Executing Search...
              </>
            ) : (
              <>
                <Play size={18} fill="currentColor" />
                Search
              </>
            )}
          </RACButton>
        </form>
      </div>
    </div>
  );
};

export default Home;