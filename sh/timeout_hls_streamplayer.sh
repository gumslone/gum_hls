#!/bin/bash
#
#
# This script is part of hls_streamer for owncloud
# last resort script what removes files and kill transcoder to keep system clean
# in case user has crashed or disconnected.
# timeout is maxium time of transcode or files can be on server.
#
#
# Timeout setting is as seconds, default is 5hours=18000
# ------------------------------------------------------
#
# Author: Riku Bister
# Script version 0.1
#
##################################################################
#
TIMEOUT=18000
#
##################################################################
#
# Below this line don't touch
#

USERI=$1
PLAYLISTA=$1"_playlist.m3u8"
HAKEMISTO=$2
TIEDOSTOA=$HAKEMISTO"/"$PLAYLISTA
TIEDOSTOB=$HAKEMISTO"/"$USERI"_out???.ts"

sleep 5
PIDNUMERO=`ps axu | grep -v grep | grep ffmpeg | grep $PLAYLISTA | awk '{ print $2 }'`

sleep $TIMEOUT
sleep 5

kill -9 $PIDNUMERO

sleep 5

rm -r $TIEDOSTOA >/dev/null 2>&1
rm -r $TIEDOSTOB >/dev/null 2>&1
