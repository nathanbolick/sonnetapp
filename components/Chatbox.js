import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  StyleSheet,
  View,
  Platform,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

const chatbox = () => {
  const NON_DELETABLE_SPACE = "\n\n"; // Non-deletable blank space
  const [text, setText] = useState(NON_DELETABLE_SPACE);

  const handleChangeText = (input) => {
    // Prevent deletion of the non-deletable space
    if (!input.endsWith(NON_DELETABLE_SPACE)) {
      input += NON_DELETABLE_SPACE;
    }
    setText(input);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.title}>Non-Deletable Space Inside Text Box</Text>
          <TextInput
            style={styles.textBox}
            placeholder="Type here..."
            multiline
            value={text}
            onChangeText={handleChangeText}
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  textBox: {
    height: 200,
    borderColor: "gray",
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
    textAlignVertical: "top", // Ensures the text starts from the top of the TextInput
  },
});

export default chatbox;
