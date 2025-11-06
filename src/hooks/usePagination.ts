/**
 * React hooks for pagination engine
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { PaginationEngine } from '../core/PaginationEngine';
import {
  ContentBlock,
  PaginationEngineConfig,
  PaginationState,
} from '../types';

/**
 * Main pagination hook
 */
export function usePagination(
  contentBlocks: ContentBlock[],
  config: PaginationEngineConfig
) {
  const [state, setState] = useState<PaginationState>({
    pages: [],
    totalPages: 0,
    currentPage: 1,
    isProcessing: false,
  });

  const engineRef = useRef<PaginationEngine | null>(null);

  // Initialize engine
  useEffect(() => {
    engineRef.current = new PaginationEngine(config);
  }, []);

  // Update config when it changes
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.updateConfig(config);
    }
  }, [config]);

  // Paginate content
  const paginate = useCallback(() => {
    if (!engineRef.current) return;

    setState((prev) => ({ ...prev, isProcessing: true }));

    // Use setTimeout to allow UI to update before heavy computation
    setTimeout(() => {
      try {
        const pages = engineRef.current!.paginate(contentBlocks);
        setState({
          pages,
          totalPages: pages.length,
          currentPage: 1,
          isProcessing: false,
        });
      } catch (error) {
        console.error('Pagination error:', error);
        setState((prev) => ({ ...prev, isProcessing: false }));
      }
    }, 0);
  }, [contentBlocks]);

  // Repaginate when content or config changes
  useEffect(() => {
    paginate();
  }, [paginate]);

  const goToPage = useCallback((pageNumber: number) => {
    setState((prev) => ({
      ...prev,
      currentPage: Math.max(1, Math.min(pageNumber, prev.totalPages)),
    }));
  }, []);

  const nextPage = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentPage: Math.min(prev.currentPage + 1, prev.totalPages),
    }));
  }, []);

  const previousPage = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentPage: Math.max(prev.currentPage - 1, 1),
    }));
  }, []);

  return {
    ...state,
    paginate,
    goToPage,
    nextPage,
    previousPage,
  };
}

/**
 * Live pagination hook with debouncing
 */
export function useLivePagination(
  contentBlocks: ContentBlock[],
  config: PaginationEngineConfig,
  debounceMs: number = 300
) {
  const [debouncedContent, setDebouncedContent] = useState(contentBlocks);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedContent(contentBlocks);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [contentBlocks, debounceMs]);

  return usePagination(debouncedContent, config);
}

/**
 * Hook for pagination configuration
 */
export function usePaginationConfig(initialConfig: PaginationEngineConfig) {
  const [config, setConfig] = useState(initialConfig);

  const updatePageSize = useCallback(
    (size: PaginationEngineConfig['pageConfig']['size']) => {
      setConfig((prev) => ({
        ...prev,
        pageConfig: { ...prev.pageConfig, size },
      }));
    },
    []
  );

  const updateOrientation = useCallback(
    (orientation: PaginationEngineConfig['pageConfig']['orientation']) => {
      setConfig((prev) => ({
        ...prev,
        pageConfig: { ...prev.pageConfig, orientation },
      }));
    },
    []
  );

  const updateMargins = useCallback(
    (margins: Partial<PaginationEngineConfig['pageConfig']['margins']>) => {
      setConfig((prev) => ({
        ...prev,
        pageConfig: {
          ...prev.pageConfig,
          margins: { ...prev.pageConfig.margins, ...margins },
        },
      }));
    },
    []
  );

  const updateBreakRules = useCallback(
    (breakRules: Partial<PaginationEngineConfig['breakRules']>) => {
      setConfig((prev) => ({
        ...prev,
        breakRules: { ...prev.breakRules, ...breakRules },
      }));
    },
    []
  );

  return {
    config,
    setConfig,
    updatePageSize,
    updateOrientation,
    updateMargins,
    updateBreakRules,
  };
}

/**
 * Hook for content management
 */
export function useContentBlocks(initialBlocks: ContentBlock[] = []) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialBlocks);

  const addBlock = useCallback((block: ContentBlock) => {
    setBlocks((prev) => [...prev, block]);
  }, []);

  const removeBlock = useCallback((index: number) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateBlock = useCallback((index: number, block: ContentBlock) => {
    setBlocks((prev) => prev.map((b, i) => (i === index ? block : b)));
  }, []);

  const insertBlock = useCallback((index: number, block: ContentBlock) => {
    setBlocks((prev) => [
      ...prev.slice(0, index),
      block,
      ...prev.slice(index),
    ]);
  }, []);

  const moveBlock = useCallback((fromIndex: number, toIndex: number) => {
    setBlocks((prev) => {
      const newBlocks = [...prev];
      const [removed] = newBlocks.splice(fromIndex, 1);
      newBlocks.splice(toIndex, 0, removed);
      return newBlocks;
    });
  }, []);

  const clear = useCallback(() => {
    setBlocks([]);
  }, []);

  return {
    blocks,
    setBlocks,
    addBlock,
    removeBlock,
    updateBlock,
    insertBlock,
    moveBlock,
    clear,
  };
}
