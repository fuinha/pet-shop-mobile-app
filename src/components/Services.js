import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Container, Header, Title, Content, Card, CardItem, Footer, FooterTab, Button, Icon } from 'native-base';

export default class Services extends React.Component {

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
					<Title style={styles.title}>Serviços</Title>
				</Header>
				<Content>

					<Card dataArray={this.state.listItems}
						renderRow={
							(item) =>
								<CardItem>
									<CardItem header>
										<Text>{item[1]}</Text>
									</CardItem>
									<CardItem>
										<Image resizeMode="cover" source={{uri: item[2]}}>
										</Image>	
									</CardItem>										
								</CardItem>
					}>

					</Card>

					<Button rounded bordered block style={styles.btVoltar} onPress={() => this._returnView()}>Voltar</Button>

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


	_returnView() {
		this.props.navigator.pop();
	}

	_fetchData() {

		fetch("http://192.168.0.103:3000/api/v1/servicesByCategory?categoryId=" + this.props.categoryId,
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
				listItems[index] = new Array(key, this.state.responseJson[key]["descricao"], this.state.responseJson[key]["imagem"], this.state.responseJson[key]["valor"]);
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
		backgroundColor: "#f0f0f0"
	},
	title: {
		color: "#6d6e70"
	},
  	btVoltar: {
    	margin: 20,
    	marginTop: 10,
    	marginBottom: 5
  	}
});