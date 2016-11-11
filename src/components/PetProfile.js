import React from 'react';
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button } from 'native-base';

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

	render() {
		return(

			<Container>
				<Header>
					<Text>O Boticão - Pet Profile</Text>
				</Header>
				<Content>
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
						<ListItem>
							<InputGroup disabled>
								<Input
									ref="nascimento"
									value={this.state.nascimento}
								/>
							</InputGroup>
						</ListItem>
						<ListItem>
							<InputGroup disabled>
								<Input
									ref="raca"
									value={this.state.raca}
								/>
							</InputGroup>
						</ListItem>
						<ListItem>
							<InputGroup disabled>
								<Input
									ref="porte"
									value={this.state.porte}
								/>
							</InputGroup>
						</ListItem>
						
					</List>
					<Button onPress={() => this._fetchData()}>Verificar token</Button>

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