import React, { Component } from 'react';
import moment from 'moment';
import './TransactionItem.css';

class TransactionItem extends Component {
    render() {
        const { transaction } = this.props;
        // console.log("TransactionItem : " + this.props.index);
        // return (
        //     <div>
        //         {this.props.index}
        //     </div>
        // );
        // console.log("TransactionItem : " + JSON.stringify(transaction))
        return (
            <div className="row">
                <div className="col-xs-3 text-left">
                    {moment(transaction.date).format('L')}
                </div>
                <div className="col-xs-6 text-nowrap">
                    <span className="description">{transaction.description}</span>
                </div>
                <div className="col-xs-3 text-right">
                    {transaction.amount}
                </div>
            </div>
        );
    }
}

export default TransactionItem;