// Copyright (c) 2022 FlyByWire Simulations
// SPDX-License-Identifier: GPL-3.0

import React, { useEffect, useState } from 'react';
import { CloudArrowDown } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { ClientState, Viewer } from '@simbridge/index';

import { t } from '../../../translation';
import { LocalFileChartUI } from './LocalFileChartUI';

enum ConnectionState {
    ATTEMPTING,
    FAILED,
    ESTABLISHED,
}

export const getPdfUrl = async (fileName: string, pageNumber: number): Promise<string> => {
    const id = 'loading-file';
    try {
        toast.loading(t('NavigationAndCharts.LoadingPdf'), { toastId: id, pauseOnFocusLoss: false });
        const objectURL = await Viewer.getPDFPageUrl(fileName, pageNumber);
        toast.update(id, { toastId: id, render: '', type: 'success', isLoading: false, pauseOnFocusLoss: false });
        toast.dismiss(id);
        return objectURL;
    } catch (err) {
        toast.dismiss(id);
        toast.error(t('NavigationAndCharts.LoadingPdfFailed'), { autoClose: 1000 });
        return Promise.reject();
    }
};

export const getImageUrl = async (fileName: string): Promise<string> => {
    const id = 'loading-file';
    try {
        toast.loading(t('NavigationAndCharts.LoadingImage'), { toastId: id, pauseOnFocusLoss: false });
        const objectURL = await Viewer.getImageUrl(fileName);
        toast.update(id, { toastId: id, render: '', type: 'success', isLoading: false, pauseOnFocusLoss: false });
        toast.dismiss(id);
        return objectURL;
    } catch (err) {
        toast.dismiss(id);
        toast.error(t('NavigationAndCharts.LoadingImageFailed'), { autoClose: 1000 });
        return Promise.reject();
    }
};

export const LocalFilesPage = () => {
    const [connectionState, setConnectionState] = useState(ConnectionState.ATTEMPTING);

    const setConnectedState = async () => {
        if (!ClientState.getInstance().isAvailable()) {
            window.setTimeout(() => {
                setConnectionState(ConnectionState.FAILED);
            }, 500);
            return;
        }
        setConnectionState(ConnectionState.ESTABLISHED);
    };

    const handleConnectionRetry = () => {
        setConnectionState(ConnectionState.ATTEMPTING);
        setConnectedState();
    };

    useEffect(() => {
        setConnectedState();
    }, []);

    switch (connectionState) {
    case ConnectionState.ATTEMPTING:
        return (
            <div className="h-content-section-reduced border-theme-accent flex flex-col items-center justify-center
                            space-y-8 rounded-lg border-2"
            >
                <h1>{t('NavigationAndCharts.LocalFiles.EstablishingConnection')}</h1>
                <CloudArrowDown size={40} className="animate-bounce" />
            </div>
        );
    case ConnectionState.ESTABLISHED:
        return <LocalFileChartUI />;
    case ConnectionState.FAILED:
        return (
            <div className="h-content-section-reduced border-theme-accent flex items-center justify-center rounded-lg border-2">
                <div className="space-y-4">
                    <h1>{t('NavigationAndCharts.LocalFiles.FailedToEstablishConnection')}</h1>
                    <button
                        type="button"
                        className="text-theme-body hover:text-theme-highlight bg-theme-highlight hover:bg-theme-body border-theme-highlight flex w-full
                         items-center justify-center space-x-4 rounded-md border-2
                         py-2 transition duration-100"
                        onClick={handleConnectionRetry}
                    >
                        {t('NavigationAndCharts.LocalFiles.Retry')}
                    </button>
                </div>
            </div>
        );
    default: return <></>;
    }
};
