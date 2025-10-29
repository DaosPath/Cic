import { useEffect } from 'react';
import type { CyclePhase } from '../types.ts';

/**
 * Hook to apply phase-specific theme colors via data attribute
 * This enables CSS variables to change based on the current cycle phase
 */
export const usePhaseTheme = (phase: CyclePhase) => {
    useEffect(() => {
        // Apply data-phase attribute to document root
        document.documentElement.setAttribute('data-phase', phase);
        
        // Cleanup on unmount
        return () => {
            document.documentElement.removeAttribute('data-phase');
        };
    }, [phase]);
};
