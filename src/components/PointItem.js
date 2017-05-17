import React, { Component } from 'react';
import moment from 'moment';

class PointItem extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-xs-3 col-sm-3">
                    {moment(this.props.point.date).format('L')}
                </div>
                <div className="col-xs-6 col-sm-6">
                    {this.props.point.name}
                </div>
                <div className="col-xs-  col-sm-3">
                    {this.props.point.point}
                </div>
            </div>
        );
    }
}

export default PointItem;