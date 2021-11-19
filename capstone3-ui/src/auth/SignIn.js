
import React from 'react';
import { Auth } from 'aws-amplify';
//import DynamicImage from '../components/DynamicImage';
import { withRouter } from 'react-router-dom';
import '../css/app.css';

/**
 * Sign-in Page
 */
class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: 0,
      userId: '',
      password: '',
      code: '',
      userObject: null
    };
  }

async onSubmitForm(e) {
    e.preventDefault();
    try {
        //console.log('uid=',this.state.userId);
        //console.log('pwd=',this.state.password);

      try {
        this.state.userObject=await Auth.signIn(this.state.userId,this.state.password);
      }
      catch (err) {
        if (err.code === 'NotAuthorizedException') {
          alert("Not Authorized: "+err.message);
          return;
        }
      }
    this.state.userObject=await Auth.signIn(this.state.userId,this.state.password);
    console.log('userObject1',this.state.userObject);
    
    if (this.state.userObject.challengeName === 'NEW_PASSWORD_REQUIRED') {
        const {requiredAttributes } = this.state.userObject.challengeParam;
        console.log('requiredAttributes is:',requiredAttributes);
        
        //TODO - ASSUME we should fix this to bring them to a page to ask for the new pwd first!
        //WE SHOULD ALSO LOOK TO CHAIN THINGS SO AS TO NOT HAVE USEROBJECT2 ETC
      
        var newpwd=this.state.password+'11';
        //const userObject2=await Auth.completeNewPassword(
        this.state.userObject=await Auth.completeNewPassword(
            this.state.userObject,
            newpwd,
            {
                email: 'none@there.com',
                phone_number: '+15555551212'
            });
      
        //console.log('userobject2',userObject2);
        console.log('userobject2',this.state.userObject);
    }

    const session = await Auth.currentSession();
    console.log('Cognito User Access Token:', session.getAccessToken().getJwtToken());
    console.log('Cognito User Identity Token:', session.getIdToken().getJwtToken());
    console.log('Cognito User Refresh Token', session.getRefreshToken().getToken());
    //this.setState({ stage: 0, email: '', password: '', code: '' });
    
    Auth.currentAuthenticatedUser({
      bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(user => console.log(user))
    .catch(err => console.log(err));

    //this.props.history.replace('/app');
    this.props.history.replace('/dashboard');


    } 
    catch (err) {
        alert(err.message);
        console.error('Auth.signIn(): ', err);
    }
}


  onUserIdChanged(e) {
    this.setState({ userId: e.target.value.toLowerCase() });
  }

  onPasswordChanged(e) {
    this.setState({ password: e.target.value });
  }

  onCodeChanged(e) {
    this.setState({ code: e.target.value });
  }

  isValidEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

//  renderSignIn() {
    render() {
    //const isValidEmail = this.isValidEmail(this.state.email);
    const isValidPassword = this.state.password.length > 7;

    return (
      <div className="app">
        <header>
          <h1>Figna Healthcare</h1>
        </header>
        <section className="form-wrap">
          <div>Enter Your Credentials</div>
          <form id="loginForm" onSubmit={(e) => this.onSubmitForm(e)}>
            <input className='valid' type="text" placeholder="User Id" halign='center' value={this.state.userId} onChange={(e) => this.onUserIdChanged(e)}/>
            <input className={isValidPassword?'valid':'invalid'} type="password" placeholder="Password" value={this.state.password} onChange={(e) => this.onPasswordChanged(e)}/>
            <input type="submit" value="Sign In"/>
          </form>
        </section>
      </div>
    );
  }


//  render() {
//    switch (this.state.stage) {
//      case 0:
//      default:
//        return this.renderSignIn();
////      case 1:
////        return this.renderConfirm();
//    }
//  }
}

export default withRouter(SignIn);

