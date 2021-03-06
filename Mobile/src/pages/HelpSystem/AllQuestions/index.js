/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { withNavigationFocus } from 'react-navigation'
import PropTypes from 'prop-types'
import { formatDistance, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Icon from 'react-native-vector-icons/MaterialIcons'

import api from '~/services/api';

import Background from '~/components/Background';
import Header from '~/components/Header';

import { Wrapper, ButtonCheckIn, Content, HeaderContent, Reply, Time, Question, ReplyContent, ContentList } from './styles';

function AllQuestions({ navigation, isFocused }) {
    const [questions, setQuestions] = useState([]);

    const user = useSelector(state => state.user.profile);


    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function loadQuestion() {
        const { id } = user;
        const response = await api.get(`/students/${id}/help-orders`);

        const data = response.data.map(question => ({
            ...question,
            dateDistance: question.answer
                ? formatDistance(parseISO(question.updatedAt), new Date(), {
                    addSuffix: true,
                    locale: pt,
                })
                : formatDistance(parseISO(question.createdAt), new Date(), {
                    addSuffix: true,
                    locale: pt,
                }),
        }));

        function orderByTime(a, b) {
            return !b.answer
        }

        const questionInOrder = data.sort(orderByTime)

        setQuestions(questionInOrder);
    }

    useEffect(() => {
        if (isFocused) {

            loadQuestion()
        }
    }, [isFocused, loadQuestion])



    return (
        <Background>
            <Wrapper>
                <ButtonCheckIn onPress={() => navigation.navigate('MakeQuestions', { user })}>
                    Novo Pedido de auxílio
                </ButtonCheckIn>
                <Content
                    data={questions}
                    keyExtractor={question => String(question._id)}
                    renderItem={({ item }) => (
                        <ContentList onPress={() => navigation.navigate('ReplYQuestions', { item })}>
                            <HeaderContent>
                                <ReplyContent>
                                    <Icon name="check-circle" color={item.answer ? "#42CB59" : "#999999"} size={14} />
                                    <Reply answer={item.answer}>{item.answer ? "Respondido" : "Sem Resposta"}</Reply>
                                </ReplyContent>
                                <Time>
                                    {item.dateDistance}
                                </Time>
                            </HeaderContent>
                            <Question>
                                {item.question}
                            </Question>
                        </ContentList>
                    )}
                />



            </Wrapper>
        </Background>
    );
}

AllQuestions.navigationOptions = ({ navigation }) => ({
    header: () => <Header navigation={navigation} />,
});


AllQuestions.propTypes = {
    navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
    isFocused: PropTypes.bool
}

AllQuestions.defaultProps = {
    isFocused: false
}

export default withNavigationFocus(AllQuestions)
