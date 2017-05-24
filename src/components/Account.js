import React, { Component } from 'react';
import './Account.css';
import Transaction from './Transaction';
import { ViewPager, Frame, Track, View, AnimatedView } from 'react-view-pager';
import axios from 'axios';
import uuid from 'uuid';
import { reactLocalStorage } from 'reactjs-localstorage';
import SwipeableViews from 'react-swipeable-views';
import Tabs, { Tab } from 'material-ui/Tabs';

class Account extends Component {
    state = {
        accounts: [],
        currentPage: 0,
        progress: 0,
        switching: false,
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
            this.setState({ accounts: accounts });

            // var results = [];
            // results.push(accounts[0]);
            // results.push(accounts[1]);
            // results.push(accounts[2]);
            // results.push(accounts[3]);
            // console.log(accounts);
            // this.setState({ accounts: results });
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

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.accounts.length == this.state.accounts.length && nextState.switching) {
            return false;
        }
        return true;
    }

    handlePageChange(index) {
        console.log("page change : " + index);
        this.setState({ currentPage: index });
    }

    handleChange = (event, value) => {
        console.log("handleChange... " + value);
        this.setState({
            currentPage: value,
        });
    };

    handleChangeIndex = (index) => {
        console.log("handleChangeIndex... " + index);
        this.setState({
            currentPage: index,
        });
    };

    handleSwitching = (index, type) => {
        console.log("handleSwitching... " + index + " -- " + type);
        const isSwitching = (type === "move") ? true : false;
        const { switching } = this.state;
        if (switching !== isSwitching) {
            this.setState({ switching: isSwitching });
        }
    }

    render() {
        const { accounts, currentPage, progress } = this.state;
        // console.log(currentPage + " --  " + accounts);
        return (
            <div>
                <Tabs index={currentPage} onChange={this.handleChange.bind(this)}>
                    {accounts.map((account, index) =>
                        <Tab label={account.institution_account_name} value={index} key={account.id}/>
                    )}
                </Tabs>
                <SwipeableViews index={currentPage} animateTransitions={false} disabled={false} onChangeIndex={this.handleChangeIndex.bind(this)} onSwitching={this.handleSwitching.bind(this)}>
                    {accounts.map((account, index) =>
                        // <Transaction accountId={account.id} />
                        <Transaction accountId={account.id} key={account.id}/>
                    )}

                </SwipeableViews>
            </div>
        );
    }
}

export default Account;