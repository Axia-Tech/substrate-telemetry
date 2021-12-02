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
import { Column } from './';
import { Node } from '../../../state';
import icon from '../../../icons/inbox.svg';

export class TxsColumn extends React.Component<Column.Props, {}> {
  public static readonly label = 'Transactions in Queue';
  public static readonly icon = icon;
  public static readonly width = 26;
  public static readonly setting = 'txs';
  public static readonly sortBy = ({ txs }: Node) => txs;

  private data = 0;

  public shouldComponentUpdate(nextProps: Column.Props) {
    return this.data !== nextProps.node.txs;
  }

  render() {
    const { txs } = this.props.node;

    this.data = txs;

    return <td className="Column">{txs}</td>;
  }
}
