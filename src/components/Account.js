import React, { Component } from 'react';
import './Account.css';
import Transaction from './Transaction';
import { ViewPager, Frame, Track, View, AnimatedView } from 'react-view-pager';
import axios from 'axios';

function renderPageTitles(accounts) {
    if (accounts.length > 0) {
        return accounts.map((account, index) => (
            <View className="pager-title">{account.institution_account_name}</View>
        ));
    } else {
        return [];
    }
}

class ProgressView extends Component {
    render() {
        return (
            <View className="page-title" {...this.props}>
                <AnimatedView
                    animations={[{
                        prop: 'opacity',
                        stops: [
                            [-200, 0],
                            [0, 1],
                            [200, 0]
                        ]
                    }, {
                        prop: 'translateY',
                        stops: [
                            [-200, 50],
                            [0, 0],
                            [200, 50]
                        ]
                    }]}
                    >
                    {this.props.children}
                </AnimatedView>
            </View>
        )
    }
}

const ProgressBar = ({ progress }) => (
    <div className="progress-container">
        <div
            className="progress-bar"
            style={{
                transform: `scaleX(${Math.max(0, Math.min(1, progress))})`,
            }}
            />
    </div>
)

const colors = ['#209D22', '#106CCC', '#C1146B', '#11BDBF', '#8A19EA']
const ProgressPage = ({ view, index, onClick }) => (
    <AnimatedView
        key={index}
        index={index}
        // index={[0, 1]} // maybe allow the ability to specify a range of indices
        animations={[{
            prop: 'scale',
            stops: [
                [-300, 0.75],
                [0, 1],
                [300, 0.75]
            ]
        }, {
            prop: 'opacity',
            stops: [
                [-300, 0.5],
                [0, 1],
                [300, 0.5]
            ]
        }, {
            prop: 'backgroundColor',
            stops: [
                [-300, '#cccccc'],
                [0, colors[index]],
                [300, '#cccccc']
            ]
        }]}
        className="page"
        onClick={e => {
            onClick(e)
        } }
        />
)

class Account extends Component {
    state = {
        accounts: [],
        currentPage : 0,
        progress : 0
    }
    _handleScroll = (progress, trackPosition) => {
        this.setState({ progress })
    }

    componentDidMount() {
        axios.post('https://wdf0cm73b0.execute-api.ap-northeast-1.amazonaws.com/prod/moneytree/getAccounts', { user_id: "dc42dbeef4dc473390376198deeef392" })
            .then(res => {
                console.log(res.data);
                this.setState({ accounts: res.data });
            })
            .catch(err => console.log(err));
    }

    handlePageChange(index) {
        console.log("page change : " + index);
        this.setState({ currentPage: index });
    }

    render() {
        const { accounts, currentPage, progress } = this.state
        if (accounts.length > 0) {
            const currentAccount = accounts[currentPage];
            return (
                <ViewPager className="viewport">
                    <Frame
                        ref={c => this.frame = c}
                        className="frame"
                        >
                        <Track
                            ref={c => this.track = c}
                            viewsToShow={1}
                            infinite
                            className="track"
                            align={0.5}
                            onScroll={this._handleScroll.bind(this)}
                            onViewChange={this.handlePageChange.bind(this)}
                            >
                            {accounts.map((account, index) =>
                                <ProgressView key={`page-${index}`} children={account.institution_account_name} />
                            )}

                        </Track>
                    </Frame>
                    <ProgressBar progress={progress}/>
                    <nav className="pager">
                        <Transaction accountId={currentAccount.id} />
                    </nav>
                </ViewPager>
            );
        } else {
            return (
                <div>

                </div>
            );
        }

    }
}

export default Account;