import React from "react";
import { Text, StyleSheet, ScrollView, Pressable, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.homeHeader}>Sessions</Text>
      <ScrollView>
        <Pressable
          style={styles.newSession}
          onPress={() => navigation.navigate("SessionScreen")}
        >
          <Entypo
            name="plus"
            size={40}
            style={styles.newSessionButton}
            color="black"
          />
        </Pressable>
      </ScrollView>
    </View>
  );
};
export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#D6EADE",
    flex: 1,
  },
  homeHeader: {
    fontSize: 40,
    fontWeight: "bold",
    margin: 30,
    top: 40,
    padding: 10,
  },
  newSession: {
    height: 100,
    width: "80%",
    borderColor: "black",
    //borderWidth: 5,
    borderRadius: 10,
    alignSelf: "center",
    top: 20,
    backgroundColor: "white",
  },
  newSessionText: {
    alignSelf: "center",
    top: "30%",
    fontSize: 30,
    fontWeight: "bold",
  },
  newSessionButton: {
    alignSelf: "center",
    top: "30%",
  },
});
