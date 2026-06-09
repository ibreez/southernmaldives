/**
 * Admin Dining Management Form Component
 * Handles CRUD operations for hotel dining data including restaurants, breakfast, and bar info
 */

import { useState } from 'react';
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Upload, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DiningFormSchema, type DiningFormData, type Restaurant } from '@/lib/diningValidationSchema';
import { uploadImage, isValidImageFile, formatFileSize } from '@/lib/cloudinaryService';

interface DiningFormProps {
  hotelId: string;
  initialData?: any;
  onSubmit: (data: DiningFormData) => Promise<void>;
  isLoading?: boolean;
}

export function DiningForm({
  hotelId,
  initialData,
  onSubmit,
  isLoading = false,
}: DiningFormProps) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.hero_image_url || null
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<DiningFormData>({
    resolver: zodResolver(DiningFormSchema),
    defaultValues: initialData || {
      main_description: '',
      hero_image_url: '',
      section_label: 'Culinary',
      heading_main: 'Island',
      heading_italic: 'Flavors',
      restaurants: [
        {
          name: '',
          type: 'Signature Dining',
          cuisine: '',
          images: [],
          schedules: [{ label: 'Daily', start: '', end: '' }],
          menu_link: '',
        },
      ],
      breakfast_types: [],
      bar_info: {},
    },
  });

  const {
    fields: restaurantFields,
    append: appendRestaurant,
    remove: removeRestaurant,
  } = useFieldArray({
    control,
    name: 'restaurants',
  });

  const {
    fields: breakfastFields,
    append: appendBreakfast,
    remove: removeBreakfast,
  } = useFieldArray({
    control,
    name: 'breakfast_types',
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      setSubmitError('Please upload a valid image file (max 10MB, JPEG/PNG/WebP)');
      return;
    }

    try {
      setUploadingImage(true);
      setSubmitError(null);

      const response = await uploadImage(file);

      setImagePreview(response.secure_url);
      setValue('hero_image_url', response.secure_url);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Failed to upload image'
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRestaurantImagesChange = (index: number, value: string) => {
    // Convert comma-separated or newline-separated string to array, filtering empty strings
    const images = value
      .split(/[\n,]+/)
      .map((url) => url.trim())
      .filter(Boolean);
    setValue(`restaurants.${index}.images`, images);
  };

  const handleRestaurantImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!isValidImageFile(file)) {
          setSubmitError('Please upload valid image files (max 10MB, JPEG/PNG/WebP)');
          return;
        }
        try {
          const response = await uploadImage(file);
          newImages.push(response.secure_url);
        } catch (err) {
          setSubmitError('Failed to upload one or more images');
          return;
        }
      }

      const current = watch(`restaurants.${index}.images`);
      let currentArray: string[];
      if (Array.isArray(current)) {
        currentArray = current;
      } else if (typeof current === 'string') {
        currentArray = current.split(/[\n,]+/).map((url: string) => url.trim()).filter(Boolean);
      } else {
        currentArray = [];
      }
      setValue(`restaurants.${index}.images`, [...currentArray, ...newImages]);
    } catch (error) {
      setSubmitError('Failed to upload images');
    }
  };

  const removeRestaurantImage = (index: number, imgIdx: number) => {
    const currentImages = watch(`restaurants.${index}.images`) as string[] || [];
    const filtered = currentImages.filter((_: string, i: number) => i !== imgIdx);
    setValue(`restaurants.${index}.images`, filtered);
  };

  const handleFormSubmit = async (data: DiningFormData) => {
    try {
      setSubmitError(null);
      await onSubmit(data);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to save dining data'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {submitError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      {/* Section Heading Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Section Heading</CardTitle>
          <CardDescription>Customize the Culinary section heading on the frontend</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="section_label">Section Label</Label>
              <Input
                id="section_label"
                placeholder="Culinary"
                {...register('section_label')}
                className={errors.section_label ? 'border-red-500' : ''}
              />
              <p className="text-xs text-slate-500">Small uppercase label above title</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="heading_main">Main Heading</Label>
              <Input
                id="heading_main"
                placeholder="Island"
                {...register('heading_main')}
                className={errors.heading_main ? 'border-red-500' : ''}
              />
              <p className="text-xs text-slate-500">First part of the title</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="heading_italic">Italic Heading</Label>
              <Input
                id="heading_italic"
                placeholder="Flavors"
                {...register('heading_italic')}
                className={errors.heading_italic ? 'border-red-500' : ''}
              />
              <p className="text-xs text-slate-500">Italicized second part</p>
            </div>
          </div>
          {(watch('heading_main') || watch('heading_italic')) && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-500 mb-2">Preview</p>
              <h2 className="font-serif text-4xl text-slate-900 leading-tight">
                {watch('heading_main') || 'Island'} <span className="italic text-emerald-600/40 font-light">{watch('heading_italic') || 'Flavors'}</span>
              </h2>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hero Image Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dining Hero Image</CardTitle>
          <CardDescription>High-quality image for the dining section hero</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <Label>Image Preview</Label>
              <div className="mt-2 relative aspect-video bg-slate-100 rounded-lg overflow-hidden border-2 border-dashed border-slate-300">
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Dining preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setValue('hero_image_url', '');
                      }}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                    No image selected
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-1 space-y-2">
              <Label htmlFor="image-upload">Upload Image</Label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-4">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  disabled={uploadingImage}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadingImage ? 'Uploading...' : 'Choose Image'}
                </Button>
                <p className="text-xs text-slate-500 mt-2">Max 10MB, JPEG/PNG/WebP</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Description Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Culinary Vision</CardTitle>
          <CardDescription>Main description for the dining section</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="main_description">Main Description *</Label>
          <Textarea
            id="main_description"
            placeholder="A curated journey through international palettes and local Maldivian spices..."
            rows={4}
            {...register('main_description')}
            className={errors.main_description ? 'border-red-500' : ''}
          />
          {errors.main_description && (
            <p className="text-sm text-red-500">{errors.main_description.message}</p>
          )}
          <p className="text-xs text-slate-500">Required. 10-500 characters.</p>
        </CardContent>
      </Card>

      {/* Restaurants Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Restaurants</CardTitle>
              <CardDescription>
                Add and manage restaurant information {restaurantFields.length}/10
              </CardDescription>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={() =>
                appendRestaurant({
                  name: '',
                  type: 'Signature Dining',
                  cuisine: '',
                  images: [],
                  schedules: [{ label: 'Daily', start: '', end: '' }],
                  menu_link: '',
                })
              }
              disabled={restaurantFields.length >= 10}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Restaurant
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {errors.restaurants && (
            <p className="text-sm text-red-500">{errors.restaurants.message}</p>
          )}

          {restaurantFields.map((field, idx) => (
            <div key={field.id} className="border rounded-lg p-4 space-y-4 relative bg-slate-50">
              <button
                type="button"
                onClick={() => removeRestaurant(idx)}
                className="absolute top-2 right-2 text-red-600 hover:bg-red-50 p-1 rounded"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                <div className="space-y-2">
                  <Label htmlFor={`restaurants.${idx}.name`}>Name *</Label>
                  <Input
                    id={`restaurants.${idx}.name`}
                    placeholder="Ocean Grill"
                    {...register(`restaurants.${idx}.name`)}
                    className={errors.restaurants?.[idx]?.name ? 'border-red-500' : ''}
                  />
                  {errors.restaurants?.[idx]?.name && (
                    <p className="text-xs text-red-500">
                      {errors.restaurants[idx]?.name?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`restaurants.${idx}.type`}>Type *</Label>
                  <Controller
                    name={`restaurants.${idx}.type`}
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Signature Dining">Signature Dining</SelectItem>
                          <SelectItem value="Casual">Casual</SelectItem>
                          <SelectItem value="Bar">Bar</SelectItem>
                          <SelectItem value="Café">Café</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`restaurants.${idx}.cuisine`}>Cuisine *</Label>
                  <Input
                    id={`restaurants.${idx}.cuisine`}
                    placeholder="Seafood"
                    {...register(`restaurants.${idx}.cuisine`)}
                    className={errors.restaurants?.[idx]?.cuisine ? 'border-red-500' : ''}
                  />
                  {errors.restaurants?.[idx]?.cuisine && (
                    <p className="text-xs text-red-500">
                      {errors.restaurants[idx]?.cuisine?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                 <Label>Restaurant Images</Label>
                  <div className="space-y-3">
                    {/* Image URL Input */}
                    {(() => {
                      const rawImages = watch(`restaurants.${idx}.images`);
                      const textareaValue = Array.isArray(rawImages)
                        ? rawImages.join('\n')
                        : typeof rawImages === 'string'
                          ? rawImages
                          : '';
                      return (
                        <Textarea
                          {...register(`restaurants.${idx}.images` as any)}
                          placeholder="Paste image URLs, one per line or comma separated..."
                          rows={3}
                          value={textareaValue}
                          onChange={(e) => handleRestaurantImagesChange(idx, e.target.value)}
                          className={errors.restaurants?.[idx]?.images ? 'border-red-500' : ''}
                        />
                      );
                    })()}

                   {/* Image Preview */}
                   {(() => {
                     const imgs = watch(`restaurants.${idx}.images`);
                     const normalizedImgs = Array.isArray(imgs)
                       ? imgs
                       : typeof imgs === 'string'
                         ? imgs.split(/[\n,]+/).map((url: string) => url.trim()).filter(Boolean)
                         : [];
                     return normalizedImgs.length > 0 ? (
                       <div className="flex flex-wrap gap-2 mt-2">
                         {normalizedImgs.map((imgUrl: string, imgIdx: number) => (
                           <div key={imgIdx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 group">
                             <img
                               src={imgUrl}
                               alt={`Restaurant ${idx + 1} image ${imgIdx + 1}`}
                               className="w-full h-full object-cover"
                               onError={(e) => {
                                 (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+URL';
                               }}
                             />
                             <button
                               type="button"
                               onClick={() => {
                                 const current = watch(`restaurants.${idx}.images`);
                                 let arr: string[];
                                 if (Array.isArray(current)) {
                                   arr = current.filter((_: string, i: number) => i !== imgIdx);
                                 } else if (typeof current === 'string') {
                                   arr = current.split(/[\n,]+/).map((s: string) => s.trim()).filter(Boolean).filter((_: string, i: number) => i !== imgIdx);
                                 } else {
                                   arr = [];
                                 }
                                 setValue(`restaurants.${idx}.images`, arr);
                               }}
                               className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                             >
                               <X className="h-3 w-3" />
                             </button>
                           </div>
                         ))}
                       </div>
                     ) : null;
                   })()}
                  </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Button */}
                  <div className="relative">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleRestaurantImageUpload(idx, e)}
                      className="hidden"
                      id={`restaurant-upload-${idx}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`restaurant-upload-${idx}`)?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Images
                    </Button>
                  </div>
                </div>
              </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`restaurants.${idx}.menu_link`}>Menu URL (Optional)</Label>
                  <Input
                    id={`restaurants.${idx}.menu_link`}
                    placeholder="https://example.com/menu.pdf"
                    type="url"
                    {...register(`restaurants.${idx}.menu_link`)}
                  />
                  {errors.restaurants?.[idx]?.menu_link && (
                    <p className="text-xs text-red-500">
                      {errors.restaurants[idx]?.menu_link?.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Dynamic Schedules */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <Label>Operating Schedules *</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const currentSchedules = watch(`restaurants.${idx}.schedules`) || [];
                      setValue(`restaurants.${idx}.schedules`, [...currentSchedules, { label: '', start: '', end: '' }]);
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add
                  </Button>
                </div>
                
                {(watch(`restaurants.${idx}.schedules`) || []).map((schedule: any, schedIdx: number) => (
                  <div key={schedIdx} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 p-3 bg-white rounded-lg border">
                    <Input
                      {...register(`restaurants.${idx}.schedules.${schedIdx}.label`)}
                      placeholder="Label (e.g., Lunch)"
                      className="h-9"
                    />
                    <Input
                      {...register(`restaurants.${idx}.schedules.${schedIdx}.start`)}
                      placeholder="Start (HH:MM)"
                      className="h-9"
                    />
                    <Input
                      {...register(`restaurants.${idx}.schedules.${schedIdx}.end`)}
                      placeholder="End (HH:MM)"
                      className="h-9"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const currentSchedules = watch(`restaurants.${idx}.schedules`) || [];
                        const newSchedules = [...currentSchedules];
                        newSchedules.splice(schedIdx, 1);
                        setValue(`restaurants.${idx}.schedules`, newSchedules);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {restaurantFields.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <p className="text-slate-500 text-sm">No restaurants added yet</p>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() =>
                  appendRestaurant({
                    name: '',
                    type: 'Signature Dining',
                    cuisine: '',
                    images: [],
                    schedules: [{ label: 'Daily', start: '', end: '' }],
                    menu_link: '',
                  })
                }
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Restaurant
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Breakfast Types Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Breakfast Options</CardTitle>
              <CardDescription>
                Configure breakfast types available {breakfastFields.length}/5
              </CardDescription>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={() =>
                appendBreakfast({
                  name: '',
                  items: [],
                })
              }
              disabled={breakfastFields.length >= 5}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Breakfast
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {breakfastFields.map((field, idx) => (
            <div key={field.id} className="border rounded-lg p-4 space-y-4 relative bg-slate-50">
              <button
                type="button"
                onClick={() => removeBreakfast(idx)}
                className="absolute top-2 right-2 text-red-600 hover:bg-red-50 p-1 rounded"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="space-y-4 pr-8">
                <div className="space-y-2">
                  <Label htmlFor={`breakfast_types.${idx}.name`}>Breakfast Name *</Label>
                  <Input
                    id={`breakfast_types.${idx}.name`}
                    placeholder="Continental Breakfast"
                    {...register(`breakfast_types.${idx}.name`)}
                    className={
                      errors.breakfast_types?.[idx]?.name ? 'border-red-500' : ''
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`breakfast_types.${idx}.items`}>Items (comma-separated) *</Label>
                  <Textarea
                    id={`breakfast_types.${idx}.items`}
                    placeholder="Croissants, Fruit, Coffee, Toast..."
                    rows={2}
                    value={
                      (watch(`breakfast_types.${idx}.items`) as string[]).join(', ') || ''
                    }
                    onChange={(e) => {
                      const items = e.target.value
                        .split(',')
                        .map((item) => item.trim())
                        .filter(Boolean);
                      setValue(`breakfast_types.${idx}.items`, items);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Bar Info Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bar & Beverages</CardTitle>
          <CardDescription>Optional bar and room service information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bar_info.name">Bar Name</Label>
              <Input
                id="bar_info.name"
                placeholder="The Island Bar"
                {...register('bar_info.name')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bar_info.hours">Hours</Label>
              <Input
                id="bar_info.hours"
                placeholder="11:00 - 23:00"
                {...register('bar_info.hours')}
              />
            </div>

            <div className="col-span-1 md:col-span-2 space-y-2">
              <Label htmlFor="bar_info.specialties">Specialties & Signature Cocktails</Label>
              <Textarea
                id="bar_info.specialties"
                placeholder="Tropical mojitos, tropical margaritas, signature island punch..."
                rows={3}
                {...register('bar_info.specialties')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="submit" disabled={isLoading || uploadingImage} className="bg-emerald-600 hover:bg-emerald-700">
          {isLoading ? 'Saving...' : 'Save Dining Information'}
        </Button>
      </div>
    </form>
  );
}