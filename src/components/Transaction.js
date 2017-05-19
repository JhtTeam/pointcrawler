import React, { Component } from 'react';
import './Transaction.css';
import ReactListView from 'react-list-view';
import TransactionItem from './TransactionItem';
import axios from 'axios';
import Spinner from 'react-spinkit';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'
import 'react-virtualized/styles.css'

class Transaction extends Component {
    state = {
        accountId: -1,
        transactions: [],
        loading: false
    }
    constructor(props) {
        console.log("Transaction... constructor");
        super(props);
    }
    componentDidMount() {
        this.loadTransactions();
    }

    loadTransactions() {
        this.setState({ loading: true, transactions: [] });
        console.log("load transactions with account id : " + this.props.accountId);
        axios.post("https://wdf0cm73b0.execute-api.ap-northeast-1.amazonaws.com/prod/moneytree/getTransactions", { account_id: this.props.accountId })
            .then(res => {
                console.log(res.data);
                this.setState({ transactions: res.data, loading: false });
                this.setState({ accountId: this.props.accountId });
            })
            .catch(err => console.log(err));
    }

    render() {
        const { loading, accountId, transactions } = this.state;

        // console.log("Transaction... render : " + loading);

        if (accountId > 0 && accountId !== this.props.accountId) {
            this.state.accountId = this.props.accountId;
            this.loadTransactions();
        }
        if (loading) {
            return (
                <div>
                    <Spinner spinnerName='three-bounce' className="center" />
                </div>
            );
        }
        if (transactions.length > 0) {
            console.log("Transaction... render : " + transactions.length);
            return (
                <div className="Transaction">
                    <AutoSizer disableHeight>
                        {({ width }) => (
                            <List
                                ref='List'
                                className="ListView"
                                height={30 * transactions.length}
                                autoHeight={true}
                                rowCount={transactions.length}
                                rowHeight={30}
                                scrollToIndex={0}
                                width={width}
                                rowRenderer={this._rowRenderer.bind(this)}
                                />
                        )}
                    </AutoSizer>
                </div>
            );
        } else {
            return (
                <div className="Transaction">
                </div>
            );
        }
        // return (
        //     <div>
        //     <AutoSizer disableHeight>
        //         {({ width }) => (
        //             <List
        //                 ref='List'
        //                 className="ListView"
        //                 height={30 * 160}
        //                 autoHeight={true}
        //                 rowCount={160}
        //                 rowHeight={30}
        //                 scrollToIndex={0}
        //                 width={width}
        //                 rowRenderer={this._rowRenderer.bind(this)}
        //                 />
        //         )}
        //     </AutoSizer>
        //     </div>
        // );

    }

    _rowRenderer({ index, isScrolling, key, style }) {
        return (
            <TransactionItem transaction={this.state.transactions[index]} style={style} index={index} />
        );
    }
}

export default Transaction;