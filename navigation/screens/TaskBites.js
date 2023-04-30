import * as React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import TaskOutput from '../../components/TaskOutput';

export default function TaskBites() {
    return (
        <View style = {styles.timerContainer}> 
            <TaskOutput />
        </View>
    );

}

const styles = StyleSheet.create({
    timerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fbc4ab'
    }
});