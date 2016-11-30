import React, { Component } from 'react';
import { AppRegistry, Navigator, Text } from 'react-native';
import Login from './src/components/Login.js';
import Signin from './src/components/Signin.js';
import Signup from './src/components/Signup.js';
import Menu from './src/components/Menu.js';
import ClientProfile from './src/components/ClientProfile.js';
import PetProfile from './src/components/PetProfile.js';
import PetForm from './src/components/PetForm.js';
import ServiceCategories from './src/components/ServiceCategories.js';
import Services from './src/components/Services.js';
import Schedule from './src/components/Schedule.js';

export default class oboticao extends Component {
  render() {
    return (
      
      <Navigator initialRoute={{ name: 'Login' }}
                 renderScene={ this.renderScene }
      />
      
    )
  }

  renderScene(route, navigator) {
    if(route.name == 'Login') {
      return <Login navigator={navigator} />
    }
    if(route.name == 'Signin')
      return <Signin navigator={navigator} />

    if(route.name == 'Signup')
      return <Signup navigator={navigator} />

    if(route.name == 'Menu')
      return <Menu navigator={navigator} authState={route.state} />

    if(route.name == 'ClientProfile')
      return <ClientProfile navigator={navigator} authState={route.state} />

    if(route.name == 'PetProfile')
      return <PetProfile navigator={navigator} authState={route.state} />

    if(route.name == 'PetForm')
      return <PetForm navigator={navigator} authState={route.state} />

    if(route.name == 'ServiceCategories')
      return <ServiceCategories navigator={navigator} />

    if(route.name == 'Services')
      return <Services navigator={navigator} categoryId={route.categoryId} />

    if(route.name == 'Schedule')
      return <Schedule navigator={navigator} authState={route.state} />

  }

}



AppRegistry.registerComponent('oboticao', () => oboticao);
