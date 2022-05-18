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
import { Connection } from '../Connection';
import { Icon } from './Icon';
import { Types, Maybe } from '../common';
import { ChainData } from '../state';

import githubIcon from '../icons/mark-github.svg';
import listIcon from '../icons/kebab-horizontal.svg';
import './Chains.css';
import lineOpen from '../icons/line_open.svg';
import lineClose from '../icons/line_close.svg';
import { Tab } from './Chain/Tab';
import { List, Settings } from '.';
import { State as AppState, Update as AppUpdate } from '../state';
import { Persistent, PersistentObject, PersistentSet } from '../persist';
import settingsIcon from '../icons/settings.svg';
import threeLine from '../icons/three-bars.svg';

export namespace Chains {
  export type Display = boolean;
  export interface Props {
    chains: ChainData[];
    subscribed: Maybe<Types.GenesisHash>;
    connection: Promise<Connection>;
    settings: PersistentObject<AppState.Settings>;
  }
  export interface State {
    display: Display;
  }
}

// How many chains should be rendered in the DOM
const VISIBLE_CAP = 16;
// Milliseconds, sets the minimum time between the renders
const RENDER_THROTTLE = 1000;

export class Chains extends React.Component<Chains.Props, Chains.State> {
  constructor(props: Chains.Props) {
    super(props);

    const display: Chains.Display = false;
    this.state = {
      display,
    };
  }
  private lastRender = performance.now();
  private clicked: Maybe<Types.GenesisHash>;

  public shouldComponentUpdate(nextProps: Chains.Props) {
    if (nextProps.subscribed !== this.clicked) {
      this.clicked = nextProps.subscribed;
    }

    return (
      this.props.subscribed !== nextProps.subscribed ||
      performance.now() - this.lastRender > RENDER_THROTTLE
    );
  }

  public render() {
    this.lastRender = performance.now();

    const allChainsHref = this.props.subscribed
      ? `#all-chains/${this.props.subscribed}`
      : `#all-chains`;
    const { chains, settings } = this.props;
    const { display: currentTab } = this.state;

    return (
      <>
        <div className="Chains">
          <div className="chains-left-icon">
            <Tab
              icon={currentTab ? settingsIcon : threeLine}
              label="Settings"
              display={currentTab}
              tab={currentTab}
              current={currentTab}
              setDisplay={this.setDisplay}
            />
            <div className="Chains-margin">
              {chains
                .slice(0, VISIBLE_CAP)
                .map((chain) => this.renderChain(chain))}
            </div>
          </div>
          <div>
            <a
              className="Chains-all-chains"
              href={allChainsHref}
              title="All Chains"
            >
              <Icon src={listIcon} />
            </a>

            <a
              className="Chains-fork-me"
              // href="https://github.com/axia-tech/substrate-telemetry"
              // target="_blank"
              // title="Fork Me!"
            >
              {/* <Icon src={githubIcon} /> */}
            </a>
          </div>
        </div>
        {currentTab && (
          <div className="sidebar-container">
            <div>
              <Settings settings={settings} />
            </div>
          </div>
        )}
      </>
    );
  }

  private renderChain(chain: ChainData): React.ReactNode {
    const { label, genesisHash, nodeCount } = chain;

    let className = 'Chains-chain';

    if (genesisHash === this.props.subscribed) {
      className += ' Chains-chain-selected';
    }

    return (
      <a
        key={genesisHash}
        className={className}
        onClick={this.subscribe.bind(this, genesisHash)}
      >
        {label}
        <span className="Chains-node-count" title="Node Count">
          {nodeCount}
        </span>
      </a>
    );
  }

  private async subscribe(chain: Types.GenesisHash) {
    if (chain === this.clicked) {
      return;
    }
    this.clicked = chain;

    const connection = await this.props.connection;

    connection.subscribe(chain);
  }
  private setDisplay = (display: Chains.Display) => {
    this.setState({ display: !display });
  };
}
