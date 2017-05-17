import React, { Component } from 'react';
import moment from 'moment';
import './TransactionItem.css';

class TransactionItem extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-xs-3">
                    {moment(this.props.transaction.date).format('L')}
                </div>
                <div className="col-xs-6">
                    <span className="description">{this.props.transaction.description}</span>
                </div>
                <div className="col-xs-3">
                    {this.props.transaction.amount}
                </div>
            </div>
        );
    }
}

export default TransactionItem;