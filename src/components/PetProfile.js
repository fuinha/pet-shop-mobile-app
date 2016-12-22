import React from 'react';
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { Container, Header, Title, Content, Card, CardItem, Footer, FooterTab, Button, Icon } from 'native-base';
import { GLOBAL } from './GLOBAL.js';
import AppActivityIndicator from './AppActivityIndicator.js';

export default class PetProfile extends React.Component {

	constructor() {
		super();
		this.state = {
			listItems: [],
			nome: "",
			nascimento: "",
			raca: "",
			porte: "",
			imagem: "",
			animating: false
		};
	}

	componentWillMount() {
		this._fetchData();
	}

	render() {
		return(

			<Container>
					<Header style={styles.header}>
						<View style={{flex: 1, flexDirection: "row"}}>
							<View style={{width: 30}}>
								<Button transparent onPress={() => this._returnToMenu(this.props.authState)}>
									<Icon name="angle-left" style={styles.headerIcon} />
								</Button>
							</View>
							<View style={{flex: 1, flexDirection: "row", justifyContent: "center", paddingRight: 30}}>
								<Title style={styles.title}>Meus Pets</Title>
							</View>
						</View>
					</Header>
					<Content style={styles.content}>

						{ 
							this.state.animating ?
								<View style={{margin: 20}}><AppActivityIndicator animating = {this.state.animating} /></View>
								:null
								
						}


					<Card dataArray={this.state.listItems}
						renderRow={
							(item) =>
								<CardItem>
									<CardItem header style={{backgroundColor: "#f0f0f0"}}>
										<Text>{item[1]}</Text>
									</CardItem>
									<CardItem button onPress={() => this._goToView("Services", item[0])}>
										<Image resizeMode="cover" source={{uri: item[5]}}>
										</Image>	
									</CardItem>
									<CardItem>
										<Text>Data de Nascimento: {item[2]}</Text>
										<Text>Raça: {item[3]}</Text>
										<Text>Porte: {item[4]}</Text>
									</CardItem>										
								</CardItem>
					}>

					</Card>
					<Button rounded bordered block style={styles.btAdicionar} onPress={() => this._goToView("PetForm", this.props.authState)}>Adicionar</Button>

				</Content>
				<Footer>
					<FooterTab>
						<Button bordered onPress={() => this._goToView("ClientProfile", this.props.authState)}>
							Eu
							<Icon name="user" />
						</Button>
						<Button bordered onPress={() => this._goToView("PetProfile", this.props.authState)}>
							Pets
							<Icon name="paw" />
						</Button>
						<Button bordered onPress={() => this._goToView("ServiceCategories", this.props.authState)}>
							Serviços
							<Icon name="list" />
						</Button>
						<Button bordered onPress={() => this._goToView("ScheduleList", this.props.authState)}>
							Agenda
							<Icon name="calendar" />
						</Button>
					</FooterTab>
				</Footer>     			
      		</Container>
		)
	}

	_goToView(viewName, viewState) {
		this.props.navigator.push(
			{name: viewName,
			 state: viewState,
			 onUnmount: () => this._fetchData()}
		)
	}

	_returnToMenu(viewState) {
		this.props.navigator.jumpTo("Menu")
	}

	_returnView() {
		this.props.navigator.pop();
	}

	_fetchData() {

		this.setState({animating: true});

		fetch(GLOBAL.BASE_URL + "/api/v1/petsByClient?clientEmail=" + this.props.authState.email,
			{
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
			}})
			.then(
				(response) => {
					this.setState({responseStatus: response["status"]});
					return response.json();
				}
			)
			.then(
				(responseJson) => {
					this.setState({responseJson: responseJson});
					this._analyzeResponse();
				}
			)
			.catch((error) => console.error(error));
	}

	_analyzeResponse() {
		if(this.state.responseStatus == "200") {
			console.log("analyzeResponse");
			this._treatResponseContent();
		}

		else {
			Alert.alert("Ops! :(",
						"Algo inesperado ocorreu no servidor. Tente novamente dentro de alguns instantes, por favor!");
		}

	}

	_treatResponseContent() {
		try {
			console.log("treatResponseContent");
			var listItems = new Array();
			var index = 0;
			for(var key in this.state.responseJson) {
				listItems[index] = new Array(key, this.state.responseJson[key]["nome"],
											this.state.responseJson[key]["nascimento"],
											this.state.responseJson[key]["raca"],
											this.state.responseJson[key]["porte"],
											this.state.responseJson[key]["imagem"]);
				index = index + 1;
			}

			this.setState({animating: false});

			this.setState({listItems:  listItems});
		}
		catch(error) {
			console.log("error: " + error);
		}
	}
}

const styles = StyleSheet.create( {
	backgroundImage: {
		flex: 1
	},
	header: {
		backgroundColor: "#f0f0f0",
		paddingLeft: 15,
		paddingRight: 15
	},
	title: {
		color: "#6d6e70",
		justifyContent: "center"
	},
	content: {
		backgroundColor: 'rgba(255,255,255,0.6)'	
	},
	btAdicionar: {
    	margin: 20
  	}
});