<?php
\OCP\App::checkAppEnabled('gum_hls');
\OCP\User::checkLoggedIn();

$filename = $_GET["dir"] . "/" . $_GET["file"];

$file = \OC\Files\Filesystem::getLocalFile($filename);
$file = str_replace(' %26 ', ' & ', $file);



$appPath = \OC_App::getAppPath('gum_hls');

$stream_folder = $appPath . '/streamdata';

$user = \OCP\User::getUser();

$user_stream_dir = $stream_folder . '/' . $user .'';

if(!file_exists($user_stream_dir))
{
	mkdir($user_stream_dir);
	chmod($user_stream_dir, 0777);
}

$segments = $user_stream_dir . '/stream_' . md5($file) . '%03d.ts';
$segment_list = $user_stream_dir. '/list_' . md5($file) . '.m3u8';

exec("ps axu | grep -v grep | grep ".$appPath."/ffmpeg/ffmpeg | grep ".$user_stream_dir."/list_*.m3u8 | awk '{ print $5 }'", $output, $return_var);
if(is_array($output))
{
	foreach($output AS $o)
	{
		exec("kill -9 ".$o);
	}
}


$file_search_arr = glob($user_stream_dir . '/list*.m3u8');
if(is_array($file_search_arr))
{
	foreach ($file_search_arr as $filename)
	{
		@unlink($filename);
	}
}

$file_search_arr = glob($user_stream_dir . '/stream*.ts');
if(is_array($file_search_arr))
{
	foreach ($file_search_arr as $filename)
	{
		@unlink($filename);
	}
}




sleep(5);
$cmd = $appPath."/ffmpeg/ffmpeg -threads 1 -y -i '".$file."' " .
	   ' -c:v h264 -b:v 512k -codec:a aac -strict experimental -b:a 256k -aac_coder anmr -flags -global_header -map 0 -sn -f segment -segment_time 10' .
	   ' -preset faster -quality 1 -r 24 -s 640x360 -crf 20 -movflags faststart -segment_list "' . $segment_list . '"' .
	   ' -segment_format mpegts' .
	   ' "' . $segments . '" >/dev/null 2>&1 & ';

exec($cmd);

sleep(2);

echo $user . '/list_' . md5($file) . '.m3u8'; //output file name

?>