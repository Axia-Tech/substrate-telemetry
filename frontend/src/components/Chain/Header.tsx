// Source code for the Substrate Telemetry Server.
// Copyright (C) 2021 AXIA Technologies (UK) Ltd.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

import * as React from 'react';
import { Types, Maybe } from '../../common';
import { State as AppState, Update as AppUpdate } from '../../state';
import { formatNumber, secondsWithPrecision } from '../../utils';
import { Tab, Chain } from './';
import { Tile, Ago } from '../';
import { Map } from '../Map';

import blockIcon from '../../icons/cube.svg';
import finalizedIcon from '../../icons/cube-alt.svg';
import blockTimeIcon from '../../icons/history.svg';
import lastTimeIcon from '../../icons/watch.svg';
import listIcon from '../../icons/server.svg';
import worldIcon from '../../icons/location.svg';
import settingsIcon from '../../icons/settings.svg';
import consensusIcon from '../../icons/cube-alt.svg';
import dollar from '../../icons/dollar-sign-solid.svg';
import hourClock from '../../icons/hourglass-solid.svg';

import './Header.css';

export namespace Header {
  export interface Props {
    appState: Readonly<AppState>;
    best: Types.BlockNumber;
    finalized: Types.BlockNumber;
    blockTimestamp: Types.Timestamp;
    blockAverage: Maybe<Types.Milliseconds>;
    currentTab: Chain.Display;
    setDisplay: (display: Chain.Display) => void;
  }
}

export class Header extends React.Component<Header.Props, {}> {
  public shouldComponentUpdate(nextProps: Header.Props) {
    return (
      this.props.best !== nextProps.best ||
      this.props.finalized !== nextProps.finalized ||
      this.props.blockTimestamp !== nextProps.blockTimestamp ||
      this.props.blockAverage !== nextProps.blockAverage ||
      this.props.currentTab !== nextProps.currentTab
    );
  }

  public render() {
    const { appState } = this.props;
    const { best, finalized, blockTimestamp, blockAverage } = appState;
    const { currentTab, setDisplay } = this.props;

    return (
      <div className="Header">
        <div className="Header-Tile">
          <Tile icon={blockIcon} title="Best Block">
            #{formatNumber(best)}
          </Tile>
          <Tile icon={finalizedIcon} title="Finalized Block">
            #{formatNumber(finalized)}
          </Tile>
          <Tile icon={blockTimeIcon} title="Average Time">
            {blockAverage == null
              ? '-'
              : secondsWithPrecision(blockAverage / 1000)}
          </Tile>
          <Tile icon={lastTimeIcon} title="Last Block">
            <Ago when={blockTimestamp} />
          </Tile>
        </div>
        <div>
          <Map appState={appState} />
        </div>
      </div>
    );
  }
}
