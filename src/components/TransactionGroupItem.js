import React, { Component } from 'react';
import './TransactionGroupItem.css';
import moment from 'moment';

class TransactionGroupItem extends Component {
    render() {
        const { transactions } = this.props;
        // console.log(transactions);
        if (!transactions || transactions.length === 0) {
            return (
                <div>
                    
                </div>
            );
        }
        var amount = 0;
        var date = transactions[0].date;
        transactions.map((transaction, index) => {
            amount += transaction.amount;
        });
        return (
            <div className="row TransactionGroupItem">
                <div className="col-xs-8 text-left date">
                    {moment(date).format('L')}
                </div>
                <div className="col-xs-4 text-right amount">
                    {amount}
                </div>
            </div>
        );
    }
}

export default TransactionGroupItem;