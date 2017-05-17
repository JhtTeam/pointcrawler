import React, { Component } from 'react';
import './Transaction.css';
import ReactListView from 'react-list-view';
import TransactionItem from './TransactionItem';
import axios from 'axios';

class Transaction extends Component {
    constructor(props) {
        console.log("Transaction... constructor");
        super(props);
        this.state = { transactions : [] };
    }
    componentDidMount() {
        this.loadTransactions();
    }

    loadTransactions() {
        console.log("load transactions with account id : " + this.props.accountId);
        axios.post("https://wdf0cm73b0.execute-api.ap-northeast-1.amazonaws.com/prod/moneytree/getTransactions", { account_id : this.props.accountId })
        .then(res => {
            console.log(res.data);
            this.setState({ transactions : res.data });
            this.setState({ accountId : this.props.accountId });
        })
        .catch(err => console.log(err));
    }
    
    render() {
        console.log("Transaction... render");
        if (this.state.accountId > 0 && this.state.accountId !== this.props.accountId) {
            this.state.accountId = this.props.accountId;
            this.loadTransactions();
        }
        if (this.state.transactions.length > 0) {
            console.log("Transaction... render 1");
            return (
                <div className="Transaction container">
                    <ReactListView className="ListView"
                        rowCount={this.state.transactions.length}
                        rowHeight={30}
                        renderItem={(x, y, style) =>
                            <TransactionItem transaction={this.state.transactions[y]} />
                        }
                        />
                </div>
            );
        } else {
            return(
                <div className="Transaction">
                </div>
            );
        }
    }
}

export default Transaction;