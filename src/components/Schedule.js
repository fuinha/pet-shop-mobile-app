import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button } from 'native-base';

export default class Schedule extends React.Component {

	render() {
		return(
			<Container>
				<Header>
					<Text>O Boticão - Schedule</Text>

				</Header>
				<Content>
					<Image source={{uri: "http://oapinfo.com/images/login.jpg" }}
               			style={{flex: 1}}>
               			<View style={{flex: 1, backgroundColor: 'rgba(255,255,255,0.6)'}}>
               			</View>
               		</Image>
				</Content>
				<Footer>
					<FooterTab>
						<Button onPress={() => this._goToView("ClientProfile")}>Eu</Button>
					
						<Button onPress={() => this._goToView("PetProfile")}>Pets</Button>
					
						<Button onPress={() => this._goToView("Services")}>Serviços</Button>
					
						<Button onPress={() => this._goToView("Schedule")}>Agenda</Button>
					</FooterTab>
				</Footer>     			
      		</Container>
		)
	}

	_goToView(viewName) {
		this.props.navigator.push(
			{name: viewName}
		)
	}
}