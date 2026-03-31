import { FeatureExplorer } from '@/components/FeatureExplorer';
import { getSupabaseClient } from '@/lib/supabaseClient';
import type { Feature } from '@/types/feature';
import fallbackData from '@/data/features.json';

async function fetchFeatures(): Promise<Feature[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase.from('features').select('*');
    if (!error && data && data.length) {
      return data as Feature[];
    }
  }
  return fallbackData as Feature[];
}

export default async function Page() {
  const features = await fetchFeatures();
  return <FeatureExplorer features={features} />;
}
