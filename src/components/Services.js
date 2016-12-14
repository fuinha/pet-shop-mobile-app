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
						<View style={{flex: 1, flexDirection: "row"}}>
							<View style={{width: 30}}>
								<Button transparent onPress={() => this._returnView()}>
									<Icon name="angle-left" style={styles.headerIcon} />
								</Button>
							</View>
							<View style={{flex: 1, flexDirection: "row", justifyContent: "center", paddingRight: 30}}>
								<Title style={styles.title}>Lista de Serviços</Title>
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
									<CardItem>
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
		backgroundColor: "#f0f0f0",
		paddingLeft: 15,
		paddingRight: 15
	},
	title: {
		color: "#6d6e70",
		justifyContent: "center"
	},
  	btVoltar: {
    	margin: 20,
    	marginTop: 10,
    	marginBottom: 5
  	}
});