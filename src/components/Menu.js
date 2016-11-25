import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button } from 'native-base';

export default class Menu extends React.Component {

	render() {
		return(
			<Container>
				<Image source={{uri: "http://oapinfo.com/images/menu.jpg" }}
               			style={styles.backgroundImage}>
					<Header style={styles.header}>
						<Title style={styles.title}>Bem vindo!</Title>
					</Header>
					<Content style={styles.content}>

					</Content>
					<Footer>
						<FooterTab>
							<Button onPress={() => this._goToView("ClientProfile", this.props.authState)}>Eu</Button>
					
							<Button onPress={() => this._goToView("PetProfile", this.props.authState)}>Pets</Button>
					
							<Button onPress={() => this._goToView("ServiceCategories", "")}>Serviços</Button>
					
							<Button onPress={() => this._goToView("Schedule", this.props.authState)}>Agenda</Button>
						</FooterTab>
					</Footer> 
				</Image>    			
      		</Container>
		)
	}

	_goToView(viewName, viewState) {
		this.props.navigator.push(
			{name: viewName,
			 state: viewState}
		)
	}
}

const styles = StyleSheet.create( {
	backgroundImage: {
		flex: 1
	},
	header: {
		backgroundColor: "#f0f0f0"
	},
	title: {
		color: "#6d6e70"
	},
	content: {
		backgroundColor: 'rgba(255,255,255,0.6)'	
	}
});