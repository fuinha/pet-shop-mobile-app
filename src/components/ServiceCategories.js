import React from 'react';
import { Alert, StyleSheet, Text, View, Image } from 'react-native';
import { Container, Header, Title, Content, Card, CardItem, Footer, FooterTab, Button, Icon } from 'native-base';
import { GLOBAL } from './GLOBAL.js';

export default class ServiceCategories extends React.Component {

	constructor() {
		super();
		this.state = {
			listItems: ""
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
								<Button transparent onPress={() => this._returnToMenu()}>
									<Icon name="angle-left" style={styles.headerIcon} />
								</Button>
							</View>
							<View style={{flex: 1, flexDirection: "row", justifyContent: "center", paddingRight: 30}}>
								<Title style={styles.title}>Serviços por Categoria</Title>
							</View>
						</View>
					</Header>
				<Content>

					<Card dataArray={this.state.listItems}
						renderRow={
							(item) =>
								<CardItem>
									<CardItem header style={{backgroundColor: "#f0f0f0"}}>
										<Text>{item[1]}</Text>
									</CardItem>
									<CardItem button onPress={() => this._goToView("Services",null,item[0])}>
										<Image resizeMode="cover" source={{uri: item[2]}}>
										</Image>	
									</CardItem>										
								</CardItem>
					}>

					</Card>

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

	_goToView(viewName, viewState, categoryId) {
		console.log("_goToView");
		this.props.navigator.push(
			{name: viewName,
			 state: viewState,
			 categoryId: categoryId}
		)
	}

	_returnToMenu(viewState) {
		this.props.navigator.jumpTo("Menu")
	}

	_fetchData() {

		fetch(GLOBAL.BASE_URL + "/api/v1/serviceCategories",
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
				listItems[index] = new Array(key, this.state.responseJson[key]["descricao"], this.state.responseJson[key]["imagem"]);
				console.log(key + " - " + this.state.responseJson[key]["descricao"] + " - " + this.state.responseJson[key]["imagem"])
				index = index + 1;
			}

			this.setState({listItems:  listItems});
		}
		catch(error) {
			console.log("error: " + error);
		}
	}
}

const styles = StyleSheet.create( {
	header: {
		backgroundColor: "#f0f0f0",
		paddingLeft: 15,
		paddingRight: 15
	},
	title: {
		color: "#6d6e70",
		justifyContent: "center"
	}
});