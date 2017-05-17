import React, { Component } from 'react';
import moment from 'moment';

class TransactionItem extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-xs-3 col-sm-3">
                    {moment(this.props.transaction.date).format('L')}
                </div>
                <div className="col-xs-6 col-sm-6">
                    {this.props.transaction.description}
                </div>
                <div className="col-xs-  col-sm-3">
                    {this.props.transaction.amount}
                </div>
            </div>
        );
    }
}

export default TransactionItem;