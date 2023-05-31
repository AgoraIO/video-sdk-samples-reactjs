# Media stream encryption

Media stream encryption ensures that only the authorized users in a channel can see and hear each other. This ensures that potential eavesdroppers cannot access sensitive and private information shared in a channel. While not every use case requires media stream encryption, Video SDK provides built-in encryption methods that guarantee data confidentiality during transmission.

This page shows you how to integrate built-in media stream encryption into your app using Video Calling.

## Understand the tech

To ensure secure communication, your app uses the same SSL [key](https://en.wikipedia.org/wiki/Public_key_certificate) and [salt](https://en.wikipedia.org/wiki/Salt_(cryptography)) to encrypt and decrypt data in the channel. You use the key and salt to create an encryption configuration. Agora SD-RTN™ uses the encryption configuration to encrypt a stream and sends it to remote users. When the remote user receives the encrypted media stream, the remote app decrypts the media stream using the same salt and key.

## Full Documentation

[Agora's media stream encryption guide](https://docs.agora.io/en/video-calling/develop/media-stream-encryption?platform=web).
