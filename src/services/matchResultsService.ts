
import { supabase } from '@/integrations/supabase/client';
import { MatchedCandidate } from './groqCloudService';
import type { Database } from '@/integrations/supabase/types';

export interface MatchResultRecord {
  id?: string;
  created_at?: string;
  character_data: any;
  character_image: string;
  matched_candidates: MatchedCandidate[];
}

export const saveMatchResults = async (
  characterData: any,
  characterImage: string,
  matchedCandidates: MatchedCandidate[]
): Promise<{ success: boolean; error?: any; data?: any }> => {
  try {
    const { data, error } = await supabase
      .from('match_results')
      .insert({
        character_data: characterData as any,
        character_image: characterImage,
        matched_candidates: matchedCandidates as any
      })
      .select();

    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error saving match results:', error);
    return { success: false, error };
  }
};

export const getRecentMatchResults = async (limit = 5): Promise<MatchResultRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('match_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    // Transform the data to match our interface
    const transformedData: MatchResultRecord[] = (data || []).map(item => ({
      id: item.id,
      created_at: item.created_at || undefined,
      character_data: item.character_data,
      character_image: item.character_image,
      matched_candidates: item.matched_candidates as MatchedCandidate[]
    }));
    
    return transformedData;
  } catch (error) {
    console.error('Error fetching match results:', error);
    return [];
  }
};
