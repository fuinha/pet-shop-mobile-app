import React from 'react';
import { Alert, AsyncStorage, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { Container, Header, Title, Content, List, ListItem, InputGroup, Input, Footer, FooterTab, Button, Icon} from 'native-base';
//import Icon from 'react-native-vector-icons/FontAwesome';

export default class Teste extends React.Component {

		constructor() {
		super();
		this.state = {
			nome: "",
			nascimento: "",
			email: "",
			telefone: "",
			endereco: "",
			cidade: "",
			cep: "",
			imagem: "",
			token: "",
			currentPosition: ""
		};
	}

	render() {
		return(

			<Container>
					<Header style={styles.header}>
						<View style={{flex: 1, flexDirection: "row"}}>
							<View style={{width: 30}}>
								<Button transparent>
									<Icon name="angle-left" style={styles.headerIcon} />
								</Button>
							</View>
							<View style={{flex: 1, flexDirection: "row", justifyContent: "center", paddingRight: 30}}>
								<Title style={styles.title}>Meus Dados</Title>
							</View>
						</View>
					</Header>
					<Content style={styles.content}>

					<View style={{ paddingRight: 15, borderWidth: 1, borderColor: "#c0c1c4", borderRadius: 4,  margin: 20, justifyContent: "center" }}>
				
					<Image src={this.state.imagem}></Image>
					
					<List>
						<ListItem>
							<InputGroup disabled>
								<Input
									ref="nome"
									value={this.state.nome}
								/>
							</InputGroup>
						</ListItem>
						
					</List>
					</View>

					<Button rounded bordered block style={styles.btVoltar} onPress={() => this._returnView()}>Voltar</Button>

				</Content>
				<Footer>
					<FooterTab>
						<Button bordered onPress={() => this._goToView("ClientProfile")}>
							Eu
							<Icon name="user" />
						</Button>
					
						<Button bordered onPress={() => this._goToView("PetProfile")}>
							Pets
							<Icon name="paw" />
						</Button>
					
						<Button bordered onPress={() => this._goToView("ServiceCategories")}>
							Serviços
							<Icon name="list" />
						</Button>
					
						<Button bordered onPress={() => this._goToView("Schedule")}>
							Agenda
							<Icon name="calendar" />
						</Button>
					</FooterTab>
				</Footer>
						
      		</Container>
		)
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
	headerIcon: {
		color: "#6d6e70"
	},
	content: {
		backgroundColor: 'rgba(255,255,255,0.6)'	
	},
	btVoltar: {
		margin: 20
	}
});