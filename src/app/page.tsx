'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ky from 'ky';
import {
  Button as RACButton,
  Form,
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
  const [minSurface, setMinSurface] = useState<number>(0);
  const [minRooms, setMinRooms] = useState<number>(0);
  const [minBedrooms, setMinBedrooms] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleBedroomsChange = (val: number) => {
    const newBedrooms = isNaN(val) ? 0 : val;
    setMinBedrooms(newBedrooms);
    if (newBedrooms > minRooms) {
      setMinRooms(newBedrooms);
    }
  };

  const handleRoomsChange = (val: number) => {
    const newRooms = isNaN(val) ? 0 : val;
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

  const handleRunPipeline = async (e: React.FormEvent) => {
  e.preventDefault();

  setLoading(true);
  setIsError(false);
  setStatus('Triggering pipeline & background worker...');

  const minPrice = sliderToPrice(priceRange[0]);
  const maxPrice = sliderToPrice(priceRange[1]);
  const locationList = locations.map((loc) => loc.name);


  const response = await ky
    .post(endpoints.internal.SCRAPE, {
      json: {
        locations: locationList,
        minPrice,
        maxPrice,
        minSpace: minSurface,
        minRooms,
        minBedrooms,
      },
    })
    .json<{ success: boolean; message: string }>()
    .catch((err: Error) => {
      setIsError(true);
      return { success: false, message: err.message || 'Failed to trigger scraping pipeline.' };
    });

  setLoading(false);

  if (response.success) {
    setStatus(response.message || 'Scraping job queued successfully! Check Google Sheets.');
    return;
  }

  setIsError(true);
  setStatus(response.message);
};

  const isInvalidRoomCount = minRooms < minBedrooms;

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

        <Form onSubmit={handleRunPipeline} className="space-y-6">
          
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

          {/* Official React Aria Multi-Thumb Price Slider */}
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

          {/* Steppers */}
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <NumberField
                label="Min Surface (m²)"
                value={minSurface}
                onChange={setMinSurface}
                minValue={0}
                maxValue={1000}
                formatOptions={{ style: 'decimal' }}
              />

              <NumberField
                label="Min Rooms"
                value={minRooms}
                onChange={handleRoomsChange}
                minValue={minBedrooms}
                maxValue={20}
                formatOptions={{ style: 'decimal' }}
              />

              <NumberField
                label="Min Bedrooms"
                value={minBedrooms}
                onChange={handleBedroomsChange}
                minValue={0}
                maxValue={10}
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

          {/* Status Notification */}
          {status && (
            <div
              className={`flex items-center gap-3 p-4 border text-sm font-medium rounded-xl ${
                isError
                  ? 'bg-rose-950/40 border-rose-900/80 text-rose-200'
                  : 'bg-slate-900 border-slate-800 text-slate-200'
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
            className="w-full bg-indigo-600 hover:bg-indigo-500 data-[disabled]:bg-slate-800 data-[disabled]:text-slate-500 text-white font-bold text-base py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-[0.99] cursor-pointer focus:outline-none"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Executing Pipeline...
              </>
            ) : (
              <>
                <Play size={18} fill="currentColor" />
                Search
              </>
            )}
          </RACButton>
        </Form>
      </div>
    </div>
  );
};

export default Home;