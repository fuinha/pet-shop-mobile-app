import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View, Image, DatePickerAndroid } from 'react-native';
import { Container, Header, Title, Content, Card, CardItem, Footer, FooterTab, Button, Icon } from 'native-base';
import AppActivityIndicator from './AppActivityIndicator.js';

export default class ScheduleList extends React.Component {

	constructor() {
		super();
		this.state = {
			initialDay: "",
			finalDay: "",
			listItems: [],
			animating: false
		};
	}

	componentDidMount() {
		date = new Date(Date.now()).getDate();
		if(date < 10) date = "0" + date.toString();
		month =  (new Date(Date.now()).getMonth()) + 1;
		if(month < 10) month = "0" + month.toString();
		year = new Date(Date.now()).getFullYear();
		today = date + "/" + month + "/" + year;

		this.setState({initialDay: today});
		this.setState({finalDay: today}, () => this._fetchData());

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
								<Title style={styles.title}>Agendamentos</Title>
							</View>
						</View>
					</Header>
				<Content style={styles.content}>
					<View style={{borderWidth: 1, borderColor: "#c0c1c4", borderRadius: 4}}>
						<View style={{padding: 5, flexDirection: "row", justifyContent: "space-around" }}>
							<View style={{ margin: 2, marginLeft: 20, marginRight: 20, height: 40, justifyContent: "center"}}>
								<Text>De:</Text>
							</View>
							<View style={{ margin: 2, marginLeft: 20, marginRight: 20, height: 40, paddingLeft: 5, paddingRight: 5, borderWidth: 1, borderColor: "#c0c1c4", borderRadius: 4, justifyContent: "center"}}>						
								<Text style={{color: "#484949"}} ref="initialDay" onPress={() => this._showDataPicker("initialDay")}>
									{this.state.initialDay}
								</Text>
							</View>
							<View style={{ margin: 2, marginLeft: 20, marginRight: 20, height: 40, justifyContent: "center"}}>
								<Text>Até:</Text>
							</View>
							<View style={{ margin: 2, marginLeft: 20, marginRight: 20, height: 40, paddingLeft: 5, paddingRight: 5, borderWidth: 1, borderColor: "#c0c1c4", borderRadius: 4, justifyContent: "center"}}>	
								<Text style={{color: "#484949"}} ref="finalDay" onPress={() => this._showDataPicker("finalDay")}>
									{this.state.finalDay}
								</Text>
							</View>
						</View>
						<View style={{ paddingBottom: 5 }}>
							<Button rounded bordered block style={styles.btAtualizar} onPress={() => this._fetchData()}>Atualizar</Button>
						</View>
					</View>

					{ 
						this.state.animating ?
						<View style={{margin: 20}}><AppActivityIndicator animating = {this.state.animating} /></View>
						:null			
					}

					{
						this.state.listItems.length ?
						<Card dataArray={this.state.listItems}
							renderRow={
								(item) =>
									<CardItem>
										<CardItem header style={{backgroundColor: "#f0f0f0"}}>
											<Text>{item[4]} para {item[3]}</Text>
									</CardItem>
									<CardItem button>
										<View style={{flexDirection: "row", justifyContent: "space-around"}}>
											<View style={{justifyContent: "flex-start"}}>
												<Text>Dia: {item[1]}</Text>
												<Text>Hora: {item[2]}</Text>
												<Text>Valor: R${item[5]}</Text>
											</View>
											<View style={{justifyContent: "flex-start"}}>
												<Text>Táxi Dog: R${item[6]}</Text>
												<Text>Pagamento: {item[7]}</Text>
												<Text>Conclusão: {item[8]}</Text>
											</View>
										</View>
									</CardItem>										
								</CardItem>
						}>
						</Card>
						:<View style={{flexDirection: "row", justifyContent: "center"}}><Text>Não há serviços agendados para estes dias</Text></View>

					}


						
						<Button rounded bordered block style={styles.btAdicionar} onPress={() => this._goToView("NewSchedule", this.props.authState)}>Adicionar</Button>
						<Button rounded bordered block style={styles.btPagar}>Pagar</Button>

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
			 state: viewState}
		)
	}

	_returnToMenu(viewState) {
		this.props.navigator.jumpTo("Menu")
	}

	_fetchData() {

		this.setState({animating: true});

		fetch("http://192.168.0.103:3000/api/v1/schedulesByDayRange?initialDay=" + this.state.initialDay + "&finalDay=" + this.state.finalDay,
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
				listItems[index] = new Array(key, this.state.responseJson[key]["dia"],
												this.state.responseJson[key]["hora"],
												this.state.responseJson[key]["pet"],
												this.state.responseJson[key]["servico"],
												this.state.responseJson[key]["valor"],
												this.state.responseJson[key]["taxidog"],
												this.state.responseJson[key]["pagamento"],
												this.state.responseJson[key]["conclusao"]);
				index = index + 1;
			}

			this.setState({animating: false});

			this.setState({listItems:  listItems});
		}
		catch(error) {
			console.log("error: " + error);
		}
	}

	async _showDataPicker(whatDay) {
		try {
			const dateReturn = {action: "", year: "", month: "", day: ""};
			dateReturn = await DatePickerAndroid.open( {
				date: new Date()
			});
			if (dateReturn.action !== DatePickerAndroid.dismissedAction) {
				console.log("Date chose");
				if (dateReturn.day < "10") dateReturn.day = "0" + dateReturn.day;
				dateReturn.month = dateReturn.month + 1;
				if (dateReturn.month < "10") dateReturn.month = "0" + dateReturn.month;

				if(whatDay == "initialDay")
					this.setState({ initialDay: dateReturn.day + "/" + dateReturn.month + "/" + dateReturn.year});
				if(whatDay == "finalDay")
					this.setState({ finalDay: dateReturn.day + "/" + dateReturn.month + "/" + dateReturn.year});
			}
		}
		catch ({code, message}) {
			console.warn("Cannot open date picker", message);
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
  	},
  	btAtualizar: {
    	marginLeft: 20,
    	marginRight: 20
  	}
});