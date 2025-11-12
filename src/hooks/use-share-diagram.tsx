import { useCallback, useState } from 'react';
import { useChartDB } from './use-chartdb';
import { uploadDiagram } from '@/lib/api/diagram-api';

export interface ShareDiagramResult {
    shareUrl: string;
    diagramId: string;
}

export const useShareDiagram = () => {
    const { currentDiagram } = useChartDB();
    const [isSharing, setIsSharing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const shareDiagram = useCallback(async (): Promise<
        ShareDiagramResult | null
    > => {
        if (!currentDiagram) {
            setError('No diagram to share');
            return null;
        }

        setIsSharing(true);
        setError(null);

        try {
            // Upload diagram to backend
            const diagramId = await uploadDiagram(currentDiagram);

            // Generate shareable URL
            const shareUrl = `${window.location.origin}/diagrams/${diagramId}`;

            // Copy to clipboard
            try {
                await navigator.clipboard.writeText(shareUrl);
            } catch (clipboardError) {
                console.warn(
                    'Failed to copy to clipboard:',
                    clipboardError
                );
                // Continue anyway, user can manually copy
            }

            return {
                shareUrl,
                diagramId,
            };
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : 'Failed to share diagram';
            setError(errorMessage);
            console.error('Error sharing diagram:', err);
            return null;
        } finally {
            setIsSharing(false);
        }
    }, [currentDiagram]);

    return {
        shareDiagram,
        isSharing,
        error,
    };
};
