import React, { useRef, useState } from "react";
import {
  KeyboardAwareScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInputComponent,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";

export default function TextBox() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.header}></View>
        <TextInput
          placeholder="Write a song..."
          editable
          multiline
          //numberOfLines={50}
          style={styles.textInput}
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 5,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  scrollContainer: {
    flex: 1,
    width: "100%",
  },
  textInput: {
    flex: 1,
    width: "90%",
    marginBottom: 40,
    alignSelf: "center",
    backgroundColor: "transparent",
    borderRadius: 10,
    borderColor: "transparent",
    textAlignVertical: "top",
    padding: 10, // Add padding to create tappable blank space
  },
});
