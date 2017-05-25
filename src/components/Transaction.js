import React, { Component } from 'react';
import './Transaction.css';
import TransactionItem from './TransactionItem';
import TransactionGroupItem from './TransactionGroupItem';
import axios from 'axios';
import Spinner from 'react-spinkit';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'
import 'react-virtualized/styles.css'
import moment from 'moment';
// import ReactPullToRefresh from 'react-pull-to-refresh';
import { reactLocalStorage } from 'reactjs-localstorage';

class Transaction extends Component {
    state = {
        accountId: -1,
        groups: {},
        loading: false,
        rowCount: 0
    }
    constructor(props) {
        console.log("Transaction... constructor");
        super(props);
    }
    componentDidMount() {
        console.log("Transaction... componentDidMount");
        this.loadTransactions(this.props.accountId);
    }

    componentWillReceiveProps(nextProps) {
        const { accountId } = nextProps;
        if (this.state.accountId > 0 && this.state.accountId !== accountId) {
            this.setState({ accountId: accountId });
            this.loadTransactions(accountId);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.rowCount === this.state.rowCount) {
            return false;
        }
        return true;
    }


    loadTransactions(accountId) {
        console.log("load transactions with account id : " + accountId);
        var transactionsCachedString = reactLocalStorage.get(accountId, null);
        if (transactionsCachedString) {
            const transactionsCached = JSON.parse(transactionsCachedString);
            const groups = this.groupTransactions(transactionsCached);
            this.setState({ groups: groups.groups, loading: false, accountId: accountId, rowCount: groups.rowCount });
        } else {
            // this.setState({ loading: true });


        }
        axios.post("https://wdf0cm73b0.execute-api.ap-northeast-1.amazonaws.com/prod/moneytree/getTransactions", { account_id: accountId })
                .then(res => res.data)
                .then(transactions => {
                    return transactions.sort((transaction1, transaction2) => {
                        return transaction2.date.localeCompare(transaction1.date);
                    });
                })
                .then(transactions => {
                    //cached
                    reactLocalStorage.set(accountId, JSON.stringify(transactions));

                    const groups = this.groupTransactions(transactions);
                    this.setState({ groups: groups.groups, loading: false, accountId: accountId, rowCount: groups.rowCount });
                    // this.setState(..., { groups: groups });
                })
                .catch(err => console.log(err));
    }

    groupTransactions(data) {
        var rowCount = 0;
        //convert transactions to group
        var groups = {};
        // const transactions = {};
        data.map((transaction, index) => {
            // console.log(transaction.description);
            var date = moment(transaction.date).format('L');
            var transactions = groups[date];
            if (!transactions) {
                rowCount++;
                transactions = [];
                groups[date] = transactions;
            }
            rowCount++;
            transactions.push(transaction);
        });
        return { groups: groups, rowCount: rowCount };
    }

    onRefresh(next) {
        this.loadTransactions(this.state.accountId);
    }

    render() {

        const { loading, accountId, groups, rowCount } = this.state;
        console.log("group length = " + rowCount);
        console.log(window.innerWidth);
        // console.log("Transaction... render : " + accountId + "--- props accountid: " + this.props.accountId);
        // return (
        //         <div className="Transaction">
        //             {accountId}
        //         </div>
        //     );

        if (loading) {
            return (
                <div>
                    <Spinner spinnerName='three-bounce' className="center" />
                </div>
            );
        }
        if (rowCount > 0) {
            const rowHeight = 30;
            return (
                <AutoSizer disableHeight={true}>
                    {({ width, height }) => (
                        <List
                            ref='List'
                            className="ListView"
                            height={rowHeight * rowCount}
                            autoHeight={true}
                            rowCount={rowCount}
                            rowHeight={rowHeight}
                            scrollToIndex={0}
                            width={width}
                            rowRenderer={this._rowRenderer.bind(this)}
                            />
                    )}
                </AutoSizer>
            );
        } else {
            return (
                <div className="Transaction">
                </div>
            );
        }
    }

    _rowRenderer({ index, isScrolling, k, style }) {
        // console.log("row renderer : " + index);
        const { groups } = this.state;
        var counting = 0;
        for (var key in groups) {
            const transactions = groups[key];
            if (counting === index) {
                return (
                    <TransactionGroupItem transactions={transactions} key={index}/>
                );
            }
            counting += transactions.length + 1;
            if (index < counting) {
                var i = counting - index - 1;
                return (
                    <TransactionItem transaction={transactions[i]} index={index} key={index}/>
                );
            }
        }
        return (
            <div>
                {index}
            </div>
        );
    }
}

export default Transaction;