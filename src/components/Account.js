import React, { Component } from 'react';
import './Account.css';
import Transaction from './Transaction';
import { ViewPager, Frame, Track, View, AnimatedView } from 'react-view-pager';
import axios from 'axios';
import uuid from 'uuid';
import { reactLocalStorage } from 'reactjs-localstorage';

class ProgressView extends Component {
    render() {
        return (
            <View className="page-title" {...this.props}>
                <AnimatedView className="text-center"
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

class Account extends Component {
    state = {
        accounts: [],
        currentPage: 0,
        progress: 0
    }
    _handleScroll = (progress, trackPosition) => {
        this.setState({ progress })
    }

    getRedirectMoneyTreeUrlAuth(userId) {
        const redirectWebUrl = encodeURIComponent(window.location.href);
        const url = "https://wwws-staging.moneytree.jp/link/#/app/oauth/authorize?client_id=c4910a01263c65735bc3e43456240ed94d795be565668caed9f8d7f704481901&redirect_uri=https:%2F%2Fquick-money-recorder.com%2Fapi%2Fmoneytree%2Fcallback%3Fuser_id%3D" + userId + "%26redirect_web_url%3D" + redirectWebUrl + "&response_type=code&scope=guest_read%20accounts_read%20transactions_read%20points_read";
        console.log("moneytree redirect url: " + url);
        return url;
    }

    getAccounts(user) {
        var accountsString = reactLocalStorage.get('accounts', null);
        if (accountsString) {
            var accounts = JSON.parse(accountsString);
            console.log(accounts);
            this.setState({ accounts: accounts });
        }

        axios.post('https://wdf0cm73b0.execute-api.ap-northeast-1.amazonaws.com/prod/moneytree/getAccounts', { moneytree_id: user.moneytree_id })
            .then(res => res.data)
            .then(accounts => {
                console.log(accounts);
                //cached
                reactLocalStorage.set('accounts', JSON.stringify(accounts));
                this.setState({ accounts: accounts });
            })
            .catch(err => console.log(err));
    }

    componentDidMount() {
        var userId = reactLocalStorage.get('user_id', '');
        this.getRedirectMoneyTreeUrlAuth(userId);
        var userCached = reactLocalStorage.get('user', null);
        console.log("userId = " + userId);
        console.log("userCached = " + userCached);
        if (!userId || userId.length == 0) {
            userId = uuid.v4();
            console.log("create user id: " + userId);
            reactLocalStorage.set("user_id", userId);
            //redirect to auth moneytree
            window.location.replace(this.getRedirectMoneyTreeUrlAuth(userId));
        } else {
            if (!userCached) {
                axios.post('https://wdf0cm73b0.execute-api.ap-northeast-1.amazonaws.com/prod/moneytree/getUser', { user_id: userId })
                .then(res => res.data)
                .then(userResponse => {
                    if (userResponse && userResponse.moneytree_id) {
                        reactLocalStorage.set("user", JSON.stringify(userResponse));
                        //get money tree account
                        this.getAccounts(userResponse);
                    } else {
                        window.location.replace(this.getRedirectMoneyTreeUrlAuth(userId));
                    }
                })
                .catch(err => console.log(err));
            } else {
                const user = JSON.parse(userCached);
                console.log(JSON.stringify(user));
                this.getAccounts(user);
            }
        }
    }

    handlePageChange(index) {
        console.log("page change : " + index);
        this.setState({ currentPage: index });
    }

    render() {
        const { accounts, currentPage, progress } = this.state;
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
                                // <ProgressView key={`page-${index}`} children={account.institution_account_name} />
                                <View className="pager-title">{account.institution_account_name}</View>
                            )}

                        </Track>
                    </Frame>
                    <ProgressBar progress={progress} />
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