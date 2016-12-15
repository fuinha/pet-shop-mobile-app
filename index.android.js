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
import ScheduleList from './src/components/ScheduleList.js';
import NewSchedule from './src/components/NewSchedule.js';
import ScheduleDetail from './src/components/ScheduleDetail.js';
import RestartClientPass from './src/components/RestartClientPass.js';

export default class oboticao extends Component {
  render() {
    return (
      
      <Navigator initialRoute={{ name: "Login" }}
                 renderScene={ this._renderScene }
      />
      
    )
  }

  _renderScene(route, navigator) {
    if(route.name == 'Login')
      return <Login navigator={navigator} />

    if(route.name == 'Signin')
      return <Signin navigator={navigator} />

    if(route.name == 'Signup')
      return <Signup navigator={navigator} />

    if(route.name == 'RestartClientPass')
      return <RestartClientPass navigator={navigator} authState={route.state} />

    if(route.name == 'Menu')
      return <Menu navigator={navigator} authState={route.state} />

    if(route.name == 'ClientProfile')
      return <ClientProfile navigator={navigator} authState={route.state} />

    if(route.name == 'PetProfile')
      return <PetProfile navigator={navigator} authState={route.state} />

    if(route.name == 'PetForm')
      return <PetForm navigator={navigator} authState={route.state} onUnmount={route.onUnmount} />

    if(route.name == 'ServiceCategories')
      return <ServiceCategories navigator={navigator} authState={route.state} />

    if(route.name == 'Services')
      return <Services navigator={navigator} categoryId={route.categoryId} />

    if(route.name == 'ScheduleList')
      return <ScheduleList navigator={navigator} authState={route.state} />

    if(route.name == 'NewSchedule')
      return <NewSchedule navigator={navigator} authState={route.state} />

    if(route.name == 'ScheduleDetail')
      return <ScheduleDetail navigator={navigator} authState={route.state} />

  }

}



AppRegistry.registerComponent('oboticao', () => oboticao);
