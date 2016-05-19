<?php
\OCP\App::checkAppEnabled('gum_hls');
\OCP\User::checkLoggedIn();


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




?>