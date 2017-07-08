import React, { Component } from 'react';
import low  from '../../utils/low';
import Wallet  from '../../utils/wallet';
const {clipboard} = require('electron');

const wallet = new Wallet();


class WalletModel extends Component {

  constructor(props){
    super(props);
    this.state = {
      passphrase: '',
      time: '',
      currentHeight: 0,
      currentHash: 0,
      numpeers: 0,
      networkbestblock: 0
    };
    this.infoUpdate();
    this._handleUnlockClick = this._handleUnlockClick.bind(this);
    this._handleGenericFormChange = this._handleGenericFormChange.bind(this);
  }
  
  infoUpdate() {
    const self = this;
    wallet.getblockcount().then((height) =>{
        let newHeight = self.state.currentHeight;
        newHeight = height;
        self.setState({
           currentHeight : newHeight
        });
        wallet.getblockhash(height).then((hash) =>{
          let newHash = self.state.currentHash;
          newHash = hash;
          self.setState({
            currentHash : newHash
          });
        }).catch((error) => { alert(error); });
      }).catch((error) => {alert(error); });
    wallet.getpeerinfo().then((peers) =>{
      let peercount = self.state.numpeers;
      peercount = peers.length;
      self.setState({
        numpeers : peercount
      });
      var i = 0;
      var bestHeight = 0
      for(i = 0; i < peers.length; i++)
      {
        if(peers[i]['startingheight'] > bestHeight){
          bestHeight = peers[i]['startingheight'];
        }
      }
      self.setState({
        networkbestblock : bestHeight
      });
    });
  }

  _handleLockClick(){
    const self = this;
    wallet.walletlock().then((result)=>{
      if(result == null){
        alert("wallet locked");
      }
      else{
	alert(result);
      }
      return;
    });
  }

  _handleUnlockClick() {
    const self = this;
    var unlockTime;
    //console.log(self.state.passphrase);
    if (self.state.time == '')
      unlockTime = 10000;
    else
      unlockTime = self.state.time;

    //console.log(unlockTime);
    wallet.walletpassphrase(self.state.passphrase, unlockTime).then((resultUnlocked)=>{
      if(resultUnlocked == null){
        alert("wallet unlocked for " + unlockTime + " seconds");
      }
      else{
        alert(resultUnlocked);
      }
      return;
    });
  }

  _handleGenericFormChange(event) {
    // console.log(this);
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value});
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-lg-12">
            <h3>Wallet</h3>
          </div>
          <div className="col-lg-12">
            <div className="panel panel-default">
              <div className="panel-body">
                <div className="col-lg-12 col-md-12">
                  <div className="col-md-12">
                    <span>Wallet Unlock</span>
                    <br/>
                    <input type="text" className="form-control col-md-12" name="time" placeholder="(Optional) default unlock time 10000 seconds" onChange={this._handleGenericFormChange} value={this.state.time} />
                    <br/>
                    <br/>
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="col-md-12">
                    <div className="input-group">
                      <input type="text" className="form-control" name="passphrase" placeholder="passphrase" onChange={this._handleGenericFormChange} value={this.state.passphrase}/>
                      <span className="input-group-btn">
                        <button className="btn btn-success btn-raised" type="button" onClick={this._handleUnlockClick}>Unlock Wallet </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="panel panel-default">
              <div className="panel-body">
                <button className="btn btn-success btn-raised" type="button" onClick={this._handleLockClick}>Lock Wallet </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-lg-12 col-xs-12">
            <div className="panel panel-default">
              <div className="panel-body">
                <h3>Block Info</h3>
                <hr />
                <div className="col-lg-4 col-xs-4 col-md-4">
                  <span>Best Block Height:</span>
                </div>
                <div className="col-lg-8 col-md-8 col-xs-8  text-right">
                  {this.state.currentHeight}
                </div>

                <div className="col-lg-4 col-xs-4 col-md-4">
                  <span>Best Block Hash:</span>
                </div>
                <div className="col-lg-8 col-md-8 col-xs-8 text-right">
                  {this.state.currentHash}
                </div>
                <div className="col-lg-4 col-xs-4 col-md-4">
                  <span>Peer Count:</span>
                </div>
                <div className="col-lg-8 col-md-8 col-xs-8 text-right">
                  {this.state.numpeers}
                </div>
                <div className="col-lg-4 col-xs-4 col-md-4">
                  <span>Network Best Block:</span>
                </div>
                <div className="col-lg-8 col-md-8 col-xs-8 text-right">
                  {this.state.networkbestblock}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WalletModel;
