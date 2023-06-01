# 3D Spatial Audio 

3D Spatial Audio brings theater-like effects to Video Calling, making it seem as if the sound originates from all around the user. Video SDK provides spatial audio effects that give users an immersive audio experience in scenarios such as e-sports competitions, and online conferences.

You can configure the following spatial audio effects

* **Spatial audio effects for users**:

    By setting the local and remote user's spatial positions, you create an environment that enables users to experience changes in the distance, position, and orientation of other users in real time. This includes:

    - Audio range: Enable users in the same group and within the range to hear each other.

    - Voice blur: Enable users to hear sounds outside of the selected range and distance, or sounds of specific objects, as blurred whispers.

    - Air attenuation: Create a more natural and realistic audio experience, making it easier for people to have natural conversations. The audio engine models how sound behaves as it travels through the air and adjusts the volume based on the distance of the audio source from the listener.

    - Local sound source playback: Customize the background sound and other audio effects.

* **Spatial audio effects for media player**:

   Update the spatial position of the media player to add a sense of space to media resources such as background sounds and musical accompaniment. Agora provides local cartesian coordinate system calculation solution for the media player. This solution calculates the relative positions of the local user and the media player through Video SDK. You update the spatial coordinates of the local user and the media player, respectively, so that the local user can hear the spatial audio effect of the media player.


## Full Documentation

[Agora's 3D Spatial Audio guide](https://docs.agora.io/en/video-calling/enable-features/spatial-audio?platform=web).





