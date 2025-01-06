import React, { Component } from "react";
import { Text, View } from "tamagui";
import * as MediaLibrary from "expo-media-library";

export class AudioProvider extends Component {
  constructor(props) {
    super(props);
  }

  getPermission = async () => {
    const permission = await MediaLibrary.getPermissionsAsync();
  };

  componentDidMount() {
    getPermission();
  }
}
