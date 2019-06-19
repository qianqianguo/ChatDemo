import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    NativeModules,
    requireNativeComponent,
    Alert,
    Dimensions,
    Button,
    DeviceEventEmitter,
    Platform,
    PixelRatio,
    PermissionsAndroid
} from 'react-native';

import { connect } from 'react-redux';
// leanCloud即时通讯服务
import {Realtime, Event} from 'leancloud-realtime';
//富媒体消息插件
import { TypedMessagesPlugin, ImageMessage }
    from 'leancloud-realtime-plugin-typed-messages';

const APP_ID = 'qWx4vmkO6sCi8SWJT43E0XLg-gzGzoHsz';
const APP_KEY = 'RLhGxOS11HwY6wEfXhmP8NJL';
// 初始化即时通讯 SDK
var realtime = new Realtime({
    appId: APP_ID,
    appKey: APP_KEY,
    plugins: [TypedMessagesPlugin], // 注册富媒体消息插件
});

var RNFS = require('react-native-fs');
import {TextMessage} from 'leancloud-realtime';
import IMUI from 'aurora-imui-react-native'
var InputView = IMUI.ChatInput;
var MessageListView = IMUI.MessageList;
const AuroraIController = IMUI.AuroraIMUIController;
const window = Dimensions.get('window');
const getInputTextEvent = "getInputText";
const MessageListDidLoadEvent = "IMUIMessageListDidLoad";

var themsgid = 1;
var curConversation;
var IMClient;
function constructNormalMessage() {

    var message = {};
    message.msgId = themsgid.toString();
    themsgid += 1;
    message.status = "send_succeed";
    message.isOutgoing = true;
    message.timeString = "";
    var user = {
        userId: "",
        displayName: "replace your nickname",
        avatarPath: "ironman"
    };
    user.avatarPath = RNFS.MainBundlePath + '/shape.png';
    message.fromUser = user;
    return message
}

class Chat extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('username', ''),
        };
    };

    constructor(props) {
        super(props);
        let initHeight;
        if (Platform.OS === "ios") {
            initHeight = 86
        } else {
            initHeight = 100
        }
        this.state = {
            inputLayoutHeight: initHeight,
            messageListLayout: {flex: 1, width: window.width, margin: 0},
            inputViewLayout: { width: window.width, height: initHeight, },
            isAllowPullToRefresh: true,
            navigationBar: {}
        };
        this.updateLayout = this.updateLayout.bind(this);
    }

    componentDidMount() {
        this.initIM();
        this.resetMenu();
    }

    onInputViewSizeChange = (size) => {
        console.log("height: " + size.height)
        if (this.state.inputLayoutHeight !== size.height) {
            this.setState({
                inputLayoutHeight: size.height,
                inputViewLayout: { width: size.width, height: size.height },
                messageListLayout: { flex:1, width: window.width, margin: 0 }
            })
        }
    };

    initIM(){
        const { navigation, auth} = this.props;
        const user = auth.user;
        const username = navigation.getParam('username', '');

        realtime.createIMClient(user.getUsername()).then(function(me) {
            IMClient = me;
            me.on(Event.MESSAGE, function(message, conversation) {
                console.warn('信息:'+JSON.stringify(message));
                let evenmessage = constructNormalMessage();
                evenmessage.msgType = 'text';
                evenmessage.text = message.text;
                AuroraIController.appendMessages([evenmessage])
            });

            return me.createConversation({
                members: [username],
                name: '单聊对话',
                unique: true
            });
        }).then(function(conversation) {
            curConversation = conversation;
        }).catch(console.error);
    }

    componentWillUnmount() {
        IMClient.close().then(function() {
            console.warn('退出会话登录');
        }).catch(console.error.bind(console));
        AuroraIController.removeMessageListDidLoadListener(MessageListDidLoadEvent)
    }

    resetMenu() {
        if (Platform.OS === "android") {
            this.refs["ChatInput"].showMenu(false)
            this.setState({
                messageListLayout: { flex: 1, width: window.width, margin: 0 },
                navigationBar: { height: 64, justifyContent: 'center' },
            })
        } else {
            this.setState({
                inputViewLayout: { width: window.width, height: 86 }
            })
        }
    }

    onTouchEditText = () => {
        this.refs["ChatInput"].showMenu(false);
        this.setState({
            inputViewLayout: { width: window.width, height: this.state.inputLayoutHeight }
        })
    };

    onFullScreen = () => {
        this.setState({
            messageListLayout: { flex: 0, width: 0, height: 0 },
            inputViewLayout: { flex:1, width: window.width, height: window.height },
            navigationBar: { height: 0 }
        })
    };

    onRecoverScreen = () => {
        this.setState({
            messageListLayout: { flex: 1, width: window.width, margin: 0 },
            inputViewLayout: { flex: 0, width: window.width, height: this.state.inputLayoutHeight },
            navigationBar: { height: 64, justifyContent: 'center' }
        })
    };

    onAvatarClick = (message) => {
        Alert.alert();
        AuroraIController.removeMessage(message.msgId)
    };

    onMsgClick = (message) => {
        console.log(message);
        Alert.alert("message", JSON.stringify(message))
    };

    onStatusViewClick = (message) => {
        message.status = 'send_succeed';
        AuroraIController.updateMessage(message)
    };

    onBeginDragMessageList = () => {
        this.resetMenu();
        AuroraIController.hidenFeatureView(true)
    };

    onTouchMsgList = () => {
        AuroraIController.hidenFeatureView(true)
    };

    onPullToRefresh = () => {
        console.log("on pull to refresh")
        var messages = [];
        for (var i = 0; i < 14; i++) {
            var message = constructNormalMessage()
            // if (index%2 == 0) {
            message.msgType = "text"
            message.text = "" + i
            // }

            if (i % 3 === 0) {
                message.msgType = "event"
                message.text = "" + i
            }

            AuroraIController.insertMessagesToTop([message])
        }
        AuroraIController.insertMessagesToTop(messages)
        this.refs["MessageList"].refreshComplete()
    };

    onSendText = (text) => {
        var message = constructNormalMessage();
        message.msgType = 'text';
        message.text = text;

        curConversation.send(new TextMessage(text))
            .then((msg)=>{
                AuroraIController.appendMessages([message]);
            }).catch((error)=>console.warn(error));
    };

    onTakePicture = (mediaPath) => {
        var message = constructNormalMessage();
        message.msgType = 'image';
        message.mediaPath = mediaPath;
        AuroraIController.appendMessages([message])
        this.resetMenu();
        AuroraIController.scrollToBottom(true)
    };

    onStartRecordVoice = (e) => {
        console.log("on start record voice")
    };

    onFinishRecordVoice = (mediaPath, duration) => {
        var message = constructNormalMessage();
        message.msgType = "voice";
        message.mediaPath = mediaPath;
        message.timeString = "safsdfa";
        message.duration = duration;
        AuroraIController.appendMessages([message])
    };

    onCancelRecordVoice = () => {
        console.log("on cancel record voice")
    };

    onStartRecordVideo = () => {
        console.log("on start record video")
    };

    onFinishRecordVideo = (mediaPath, duration) => {
        var message = constructNormalMessage();
        message.msgType = "video";
        message.mediaPath = mediaPath;
        message.duration = duration;
        AuroraIController.appendMessages([message])
    };

    onSendGalleryFiles = (mediaFiles) => {
        /**
         * WARN: This callback will return original image,
         * if insert it directly will high memory usage and blocking UI。
         * You should crop the picture before insert to messageList。
         *
         * WARN: 这里返回的是原图，直接插入大会话列表会很大且耗内存.
         * 应该做裁剪操作后再插入到 messageListView 中，
         * 一般的 IM SDK 会提供裁剪操作，或者开发者手动进行裁剪。
         *
         * 代码用例不做裁剪操作。
         */
        for (index = 0; index < mediaFiles.length; index++) {
            var message = constructNormalMessage()
            if (mediaFiles[index].mediaType === "image") {
                message.msgType = "image"
            } else {
                message.msgType = "video";
                message.duration = mediaFiles[index].duration
            }

            message.mediaPath = mediaFiles[index].mediaPath;
            message.timeString = "8:00"
            AuroraIController.appendMessages([message]);
            AuroraIController.scrollToBottom(true)
        }
        this.resetMenu()
    };

    onSwitchToMicrophoneMode = () => {
        AuroraIController.scrollToBottom(true)
    };

    onSwitchToEmojiMode = () => {
        AuroraIController.scrollToBottom(true)
    };
    onSwitchToGalleryMode = () => {
        AuroraIController.scrollToBottom(true)
    };

    onSwitchToCameraMode = () => {
        AuroraIController.scrollToBottom(true)
    };

    onShowKeyboard = (keyboard_height) => {
    };

    updateLayout(layout) {
        this.setState({ inputViewLayout: layout })
    }

    onClickSelectAlbum = () => {
        console.log("on click select album")
    };

    render() {
        return (
            <View style={styles.container}>
                <MessageListView style={this.state.messageListLayout}
                                 ref="MessageList"
                                 onAvatarClick={this.onAvatarClick}
                                 onMsgClick={this.onMsgClick}
                                 onStatusViewClick={this.onStatusViewClick}
                                 onTouchMsgList={this.onTouchMsgList}
                                 onBeginDragMessageList={this.onBeginDragMessageList}
                                 onPullToRefresh={this.onPullToRefresh}
                                 avatarSize={{ width: 40, height: 40 }}
                                 sendBubbleTextSize={18}
                                 sendBubbleTextColor={"#000000"}
                                 sendBubblePadding={{ left: 10, top: 10, right: 15, bottom: 10 }}
                />
                <InputView style={this.state.inputViewLayout}
                           ref="ChatInput"
                           menuContainerHeight={this.state.menuContainerHeight}
                           isDismissMenuContainer={this.state.isDismissMenuContainer}
                           onSendText={this.onSendText}
                           onTakePicture={this.onTakePicture}
                           onStartRecordVoice={this.onStartRecordVoice}
                           onFinishRecordVoice={this.onFinishRecordVoice}
                           onCancelRecordVoice={this.onCancelRecordVoice}
                           onStartRecordVideo={this.onStartRecordVideo}
                           onFinishRecordVideo={this.onFinishRecordVideo}
                           onSendGalleryFiles={this.onSendGalleryFiles}
                           onSwitchToEmojiMode={this.onSwitchToEmojiMode}
                           onSwitchToMicrophoneMode={this.onSwitchToMicrophoneMode}
                           onSwitchToGalleryMode={this.onSwitchToGalleryMode}
                           onSwitchToCameraMode={this.onSwitchToCameraMode}
                           onShowKeyboard={this.onShowKeyboard}
                           onTouchEditText={this.onTouchEditText}
                           onFullScreen={this.onFullScreen}
                           onRecoverScreen={this.onRecoverScreen}
                           onSizeChange={this.onInputViewSizeChange}
                           showSelectAlbumBtn={false}
                           onClickSelectAlbum={this.onClickSelectAlbum}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    sendCustomBtn: {

    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    inputView: {
        backgroundColor: 'green',
        width: window.width,
        height: 100,
    },
    btnStyle: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#3e83d7',
        borderRadius: 8,
        backgroundColor: '#3e83d7'
    }
});

const mapStateToProps = state => ({
    auth: state.auth
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat)