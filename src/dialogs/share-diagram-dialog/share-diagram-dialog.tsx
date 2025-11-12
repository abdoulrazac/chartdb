import React, { useCallback, useEffect, useState } from 'react';
import { useDialog } from '@/hooks/use-dialog';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/dialog/dialog';
import { Button } from '@/components/button/button';
import type { BaseDialogProps } from '../common/base-dialog-props';
import { useTranslation } from 'react-i18next';
import { Spinner } from '@/components/spinner/spinner';
import { AlertCircle, CheckCircle, Copy, Share2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/alert/alert';
import { useShareDiagram } from '@/hooks/use-share-diagram';
import { Input } from '@/components/input/input';

export interface ShareDiagramDialogProps extends BaseDialogProps {}

export const ShareDiagramDialog: React.FC<ShareDiagramDialogProps> = ({
    dialog,
}) => {
    const { t } = useTranslation();
    const { closeShareDiagramDialog } = useDialog();
    const { shareDiagram, isSharing, error } = useShareDiagram();
    const [shareUrl, setShareUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!dialog.open) {
            setShareUrl(null);
            setCopied(false);
        }
    }, [dialog.open]);

    const handleShare = useCallback(async () => {
        const result = await shareDiagram();
        if (result) {
            setShareUrl(result.shareUrl);
        }
    }, [shareDiagram]);

    const handleCopy = useCallback(async () => {
        if (!shareUrl) return;

        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }, [shareUrl]);

    return (
        <Dialog
            {...dialog}
            onOpenChange={(open) => {
                if (!open) {
                    closeShareDiagramDialog();
                }
            }}
        >
            <DialogContent className="flex flex-col" showClose>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Share2 className="size-5" />
                        {t('share_diagram_dialog.title', 'Share Diagram')}
                    </DialogTitle>
                    <DialogDescription>
                        {t(
                            'share_diagram_dialog.description',
                            'Generate a shareable link for this diagram. Anyone with the link can view it.'
                        )}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-2">
                    {!shareUrl ? (
                        <>
                            <Alert>
                                <AlertCircle className="size-4" />
                                <AlertTitle>
                                    {t(
                                        'share_diagram_dialog.info.title',
                                        'Important'
                                    )}
                                </AlertTitle>
                                <AlertDescription>
                                    {t(
                                        'share_diagram_dialog.info.description',
                                        'Shared diagrams expire after 30 days. The link will be publicly accessible to anyone who has it.'
                                    )}
                                </AlertDescription>
                            </Alert>

                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="size-4" />
                                    <AlertTitle>
                                        {t(
                                            'share_diagram_dialog.error.title',
                                            'Error'
                                        )}
                                    </AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                        </>
                    ) : (
                        <>
                            <Alert className="bg-green-50 dark:bg-green-900/20">
                                <CheckCircle className="size-4 text-green-600" />
                                <AlertTitle className="text-green-600">
                                    {t(
                                        'share_diagram_dialog.success.title',
                                        'Link Created!'
                                    )}
                                </AlertTitle>
                                <AlertDescription>
                                    {t(
                                        'share_diagram_dialog.success.description',
                                        'Your diagram has been shared. Copy the link below.'
                                    )}
                                </AlertDescription>
                            </Alert>

                            <div className="flex gap-2">
                                <Input
                                    value={shareUrl}
                                    readOnly
                                    className="font-mono text-sm"
                                />
                                <Button
                                    onClick={handleCopy}
                                    variant="outline"
                                    className="shrink-0"
                                >
                                    {copied ? (
                                        <>
                                            <CheckCircle className="mr-2 size-4" />
                                            {t(
                                                'share_diagram_dialog.copied',
                                                'Copied!'
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="mr-2 size-4" />
                                            {t(
                                                'share_diagram_dialog.copy',
                                                'Copy'
                                            )}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </>
                    )}
                </div>

                <DialogFooter className="flex gap-1 md:justify-between">
                    <DialogClose asChild>
                        <Button variant="secondary">
                            {shareUrl
                                ? t('share_diagram_dialog.close', 'Close')
                                : t('share_diagram_dialog.cancel', 'Cancel')}
                        </Button>
                    </DialogClose>
                    {!shareUrl && (
                        <Button onClick={handleShare} disabled={isSharing}>
                            {isSharing ? (
                                <Spinner className="mr-2 size-4 text-primary-foreground" />
                            ) : (
                                <Share2 className="mr-2 size-4" />
                            )}
                            {t(
                                'share_diagram_dialog.generate_link',
                                'Generate Link'
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
