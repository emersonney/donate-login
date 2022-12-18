import { useState, useEffect } from 'react';
import { useNavigation } from "@react-navigation/native"
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { ScreenNavigationProp } from '../../Routes';
import { Usuario } from '../../model/usuario';
import styles from './styles';

import * as usuarioRepository from "../../services/usuario.repository";

export default function LoginPage() {

    const navigation = useNavigation<ScreenNavigationProp["navigation"]>();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [listUsers, setlistUsers] = useState<Usuario[]>([]);

    useEffect(() => {

        navigation.setOptions({ headerTitle: "Login" })

        usuarioRepository.listUsers().then(result => {
            setlistUsers(result);

            if (result.length === 0) {
                AddUserDefault()
            }

        })

    }, [])

    function updateList() {
        usuarioRepository.listUsers().then(result => setlistUsers(result))
    }

    function validateUser(emailForm: string, senhaForm: string) {
        let isValid = false;
        const result = listUsers.filter(user => user.email === emailForm && user.senha === senhaForm);
        if (result.length > 0) {
            isValid = true;
        }

        return isValid;
    }

    async function AddUserDefault() {

        const userDefault = {
            nome: "UserTeste",
            email: "teste@gmail.com",
            senha: "123"
        } as Usuario;

        await usuarioRepository.addUser(userDefault);

        updateList();

    }

    function handleSignInPress() {
        if (email.length === 0 || senha.length === 0) {
            Alert.alert('Preencha email e senha para continuar!');
        } else {
            if (validateUser(email, senha)) {
                navigation.navigate("Listagem", { usuario: {} as Usuario });
            } else {
                Alert.alert("Houve um problema com o login, verifique suas credenciais!");
            }
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../images/logo.png')} style={styles.form_img} resizeMode="contain" />

            <TextInput
                style={styles.form_input}
                value={email}
                placeholder='Email'
                onChangeText={(email) => setEmail(email)}
                autoCapitalize={'none'}
                keyboardType={'email-address'}
                autoCorrect={false}
            />
            <TextInput
                style={styles.form_input}
                value={senha}
                placeholder='Senha'
                secureTextEntry
                onChangeText={(senha) => setSenha(senha)}
                autoCorrect={false}
            />
            <TouchableOpacity onPress={() => { handleSignInPress() }}>
                <View style={styles.button}>
                    <Text style={styles.button_label}>Entrar</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}