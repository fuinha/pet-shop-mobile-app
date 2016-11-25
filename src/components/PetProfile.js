import React from 'react';
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { Container, Header, Title, Content, Card, CardItem, Footer, FooterTab, Button } from 'native-base';

export default class PetProfile extends React.Component {

	constructor() {
		super();
		this.state = {
			nome: "",
			nascimento: "",
			raca: "",
			porte: "",
			imagem: ""
		};
	}

	componentWillMount() {
		this._fetchData();
	}

	render() {
		return(

			<Container>
				<Header style={styles.header}>
						<Title style={styles.title}>Meus Pets</Title>
					</Header>
					<Content style={styles.content}>
					<Card dataArray={this.state.listItems}
						renderRow={
							(item) =>
								<CardItem>
									<CardItem header>
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
						<Button onPress={() => this._goToView("ClientProfile", this.props.authState)}>Eu</Button>
					
						<Button onPress={() => this._goToView("PetProfile", this.props.authState)}>Pets</Button>
					
						<Button onPress={() => this._goToView("ServiceCategories", "")}>Serviços</Button>
					
						<Button onPress={() => this._goToView("Schedule", this.props.authState)}>Agenda</Button>
					</FooterTab>
				</Footer>     			
      		</Container>
		)
	}

	_goToView(viewName, viewState) {
		this.props.navigator.push(
			{name: viewName,
			 state: viewState}
		)
	}

	_fetchData() {

		fetch("http://192.168.0.101:3000/api/v1/petsByClient?clientEmail=" + this.props.authState.email,
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
		backgroundColor: "#f0f0f0"
	},
	title: {
		color: "#6d6e70"
	},
	content: {
		backgroundColor: 'rgba(255,255,255,0.6)'	
	},
	btAdicionar: {
    	margin: 20
  	}
});