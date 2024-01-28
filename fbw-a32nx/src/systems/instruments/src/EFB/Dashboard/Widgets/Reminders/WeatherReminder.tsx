// Copyright (c) 2021-2023 FlyByWire Simulations
//
// SPDX-License-Identifier: GPL-3.0

import React from 'react';
import { t } from '../../../translation';
import { WeatherWidget } from '../WeatherWidget';
import { RemindersSection } from './RemindersSection';
import { useAppSelector } from '../../../Store/store';

export const WeatherReminder = () => {
    const { departingAirport, arrivingAirport } = useAppSelector((state) => state.simbrief.data);
    const { userDepartureIcao, userDestinationIcao } = useAppSelector((state) => state.dashboard);

    return (
        <RemindersSection title={t('Dashboard.ImportantInformation.Weather.Title')} noLink>
            <div className="space-y-6">
                <WeatherWidget name="origin" simbriefIcao={departingAirport} userIcao={userDepartureIcao} />
                <div className="bg-theme-accent h-1 w-full rounded-full" />
                <WeatherWidget name="destination" simbriefIcao={arrivingAirport} userIcao={userDestinationIcao} />
            </div>
        </RemindersSection>
    );
};
