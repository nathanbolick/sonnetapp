import React from 'react';
import {TextInput, StyleSheet} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { YStack } from 'tamagui';

const MultilineTextInputExample = () => {
  const [value, onChangeText] = React.useState('Useless Multiline Placeholder');

  // If you type something in the text box that is a color,
  // the background will change to that color.
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: value,
          },
        ]}>
        <YStack
          width={375}
          height={400}
          overflow="hidden"
          space="$2"
          margin="$3"
          padding="$4"
          marginTop={200}
          alignItems="center"
        ></YStack>
        <TextInput
          editable
          multiline
          numberOfLines={5}
          onChangeText={text => onChangeText(text)}
          value={value}
          style={styles.textInput}
        />
        
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomColor: '#000',
    borderBottomWidth: 1,
  },
  textInput: {
    padding: 10,
  },
});

export default MultilineTextInputExample;