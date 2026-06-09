"use client";

import { useFormContext } from 'react-hook-form';
import AmenitySelector from '../components/AmenitySelector';

export default function AmenitySection() {
   const { control, setValue, watch } = useFormContext();
   return <AmenitySelector control={control} setValue={setValue} watch={watch} />;
}
