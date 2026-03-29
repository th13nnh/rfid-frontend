'use client';
import { useEffect, useRef, useCallback } from 'react';

interface UseRfidScannerOptions {
    onScan: (cardId: string) => void;
    flushDelay?: number;
}

export function useRfidScanner({ onScan, flushDelay = 300 }: UseRfidScannerOptions) {
    const bufferRef = useRef('');
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const flush = useCallback(() => {
        const scanned = bufferRef.current.trim();
        bufferRef.current = '';
        if (scanned.length > 1) onScan(scanned);
    }, [onScan]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.altKey || e.metaKey) return;
            if (e.key === 'Enter') {
                if (timerRef.current) clearTimeout(timerRef.current);
                flush();
                return;
            }
            if (e.key.length === 1) {
                bufferRef.current += e.key;
                if (timerRef.current) clearTimeout(timerRef.current);
                timerRef.current = setTimeout(flush, flushDelay);
            }
        };
        window.addEventListener('keydown', handler);
        return () => {
            window.removeEventListener('keydown', handler);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [flush, flushDelay]);
}