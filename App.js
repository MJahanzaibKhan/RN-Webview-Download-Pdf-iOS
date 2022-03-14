import React, {Component} from 'react';
import {
  StatusBar,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
import {WebView} from 'react-native-webview';
import RNFetchBlob from 'react-native-fetch-blob';

export default class webView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      webviewLoaded: false,
      WEBVIEW_REF: 'weViewRef',
      hasRender: false,
      url: 'https://www.pdfdrive.com/',
      notificationUrl: '',
      hasGoBack: false,
      hasLoadingDone: false,
    };
  }

  historyDownload(url) {
    if (Platform.OS === 'ios') {
      this.downloadHistory(url);
    } else {
      // try {
      //   PermissionsAndroid.request(
      //     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      //     {
      //       title: 'storage title',
      //       message: 'storage_permission',
      //     },
      //   ).then(granted => {
      //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //       //Once user grant the permission start downloading
      //       console.log('Storage Permission Granted.');
      //       this.downloadHistory();
      //     } else {
      //       //If permission denied then show alert 'Storage Permission Not Granted'
      //       Alert.alert('storage_permission');
      //     }
      //   });
      // } catch (err) {
      //   //To handle permission related issue
      //   console.log('error', err);
      // }
    }
  }

  async downloadHistory(url) {
    const {dirs} = RNFetchBlob.fs;
    const dirToSave =
      Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    const configfb = {
      fileCache: true,
      useDownloadManager: true,
      notification: true,
      mediaScannable: true,
      title: `File Name`,
      path: `${dirToSave}/FileDirectoryName`,
      addAndroidDownloads: {
        useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
        notification: true,
        path: dirs.PictureDir + `/Tamkeencare_Invoice_`, // this is the path where your downloaded file will live in
        description: 'Downloading image.',
      },
    };
    const configOptions = Platform.select({
      ios: {
        fileCache: configfb.fileCache,
        title: configfb.title,
        path: configfb.path,
        appendExt: 'pdf',
      },
      android: configfb,
    });
    RNFetchBlob.config(configOptions)
      .fetch('GET', url, {})
      .then(res => {
        console.log(res);
        if (Platform.OS === 'ios') {
          RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
          RNFetchBlob.ios.previewDocument(configfb.path);
        }
      })
      .catch(e => {
        console.log('The file saved to ERROR', e.message);
      });
  }

  render() {
    return (
      <SafeAreaView style={{flexGrow: 1}}>
        <StatusBar barStyle="light-content" backgroundColor="#00243c" />
        {/* <TouchableOpacity
          style={{backgroundColor: 'red', height: 50, width: 200}}
          onPress={() =>
            this.historyDownload(
              'https://vdtxnxrwuh.pdcdn.xyz/dl2.php?id=10172273&h=84f0f3490acb0a861ce0cf97be914eed&u=cache&ext=pdf&n=Living%20in%20the%20light%20a%20guide%20to%20personal%20transformation',
            )
          }>
          <Text>Download</Text>
        </TouchableOpacity> */}
        <WebView
          originWhitelist={['*']}
          allowsBackForwardNavigationGestures={false}
          source={{uri: this.state.url}}
          javaScriptEnabled={true}
          startInLoadingState={true}
          autoManageStatusBarEnabled={false}
          pullToRefreshEnabled={true}
          thirdPartyCookiesEnabled={true}
          allowFileAccess
          domStorageEnabled
          onFileDownload={({nativeEvent: {downloadUrl}}) => {
            // console.log('downloadUrl', downloadUrl);
            this.historyDownload(downloadUrl);
          }}
          ref={this.state.WEBVIEW_REF}
        />
      </SafeAreaView>
    );
  }
}
