# gum_hls

I have created an app for owncloud 9.0.2 which is in early development stage, but most important features are working fine,
this app adds a HLS streaming capability to your owncloud storage,
you can play almost any type of video like avi, mkv in your browser,
ffmpeg converts the videos to web playable format.
It may not work if you have enabled encoding for your files in owncloud.
the file /ffmpeg/ffmpeg should be executable
the folder streamdata should be writable, chmod it to 0777.

you need also to edit the file /apps/files/controller/viewcontroller.php

find the line (almost at the file end):

$policy->addAllowedFrameDomain('\'self\'');

and add after it:

$policy->addAllowedObjectDomain('\'self\'');

$policy->addAllowedChildSrcDomain('\'self\'');

$policy->addAllowedConnectDomain('\'self\'');

$policy->addAllowedMediaDomain('\'self\'');

this app is based on idea and work from https://apps.owncloud.com/content/sh...content=174642
i have just converted it a little bit.

It should work well on centos 7 server, have not tested it with other servers, it might work too.
